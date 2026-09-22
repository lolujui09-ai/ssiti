import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { forms, formResponses } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';
import { ResponseSubmitSchema } from '@/lib/validations';
import { randomUUID } from 'crypto';

type Params = { params: Promise<{ formId: string }> };

// Helper: compute quiz score server-side
function computeQuizScore(
  formData: any,
  answers: Record<string, any>
) {
  const questions: any[] = formData.questions ?? [];
  let totalPoints = 0;
  let maxScore = 0;
  const breakdown: Record<string, { earned: number; max: number; isCorrect: boolean }> = {};

  for (const q of questions) {
    if (!q.quizJson) continue;
    const qPoints = q.quizJson.points ?? 0;
    maxScore += qPoints;
    const correctAnswers: string[] = q.quizJson.correctAnswers ?? [];
    const userAns = answers[q.id];
    let isCorrect = false;

    if (q.type === 'checkbox') {
      const userArr = Array.isArray(userAns) ? userAns : [];
      isCorrect =
        userArr.length === correctAnswers.length &&
        userArr.every((v: string) => correctAnswers.includes(v));
    } else if (q.type === 'text') {
      isCorrect = correctAnswers.some(
        (c) => String(userAns ?? '').trim().toLowerCase() === c.trim().toLowerCase()
      );
    } else {
      isCorrect = correctAnswers.includes(userAns);
    }

    const earned = isCorrect ? qPoints : 0;
    totalPoints += earned;
    breakdown[q.id] = { earned, max: qPoints, isCorrect };
  }

  return { totalPoints, maxPoints: maxScore, breakdown };
}

// GET /api/forms/[formId]/responses
export async function GET(req: NextRequest, { params }: Params) {
  const { formId } = await params;
  const responses = await db.query.formResponses.findMany({
    where: eq(formResponses.formId, formId),
    orderBy: (r, { desc }) => [desc(r.submittedAt)],
  });
  return NextResponse.json(responses);
}

// POST /api/forms/[formId]/responses — public submit (no auth required)
export async function POST(req: NextRequest, { params }: Params) {
  const { formId } = await params;

  // Load the form (public)
  const form = await db.query.forms.findFirst({
    where: eq(forms.id, formId),
    with: {
      questions: { orderBy: (q, { asc }) => [asc(q.order)] },
    },
  });

  if (!form) return NextResponse.json({ error: 'Form not found' }, { status: 404 });

  const settings = form.settingsJson as any;
  if (!settings?.isAcceptingResponses) {
    return NextResponse.json(
      { error: settings?.closedMessage ?? 'Form sudah ditutup.' },
      { status: 403 }
    );
  }

  try {
    const body = await req.json();
    const parsed = ResponseSubmitSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });
    }

    const { email, answers } = parsed.data;

    // Compute quiz score if quiz mode
    let quizScoreJson = null;
    if (settings?.isQuiz) {
      quizScoreJson = computeQuizScore(form, answers);
    }

    const responseId = randomUUID();
    await db.insert(formResponses).values({
      id: responseId,
      formId,
      email: email || null,
      answersJson: answers,
      quizScoreJson: quizScoreJson as any,
    });

    return NextResponse.json(
      {
        id: responseId,
        quizScore: settings?.isQuiz && settings?.releaseGradesImmediately ? quizScoreJson : null,
        confirmationMessage: settings?.confirmationMessage ?? 'Terima kasih!',
      },
      { status: 201 }
    );
  } catch (err) {
    console.error('[POST /api/forms/[formId]/responses]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

