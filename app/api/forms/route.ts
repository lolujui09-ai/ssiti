import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { forms, formSections, formQuestions } from '@/drizzle/schema';
import { eq, desc } from 'drizzle-orm';
import { FormCreateSchema } from '@/lib/validations';
import { randomUUID } from 'crypto';

// GET /api/forms — list all forms for current user
export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const userForms = await db.query.forms.findMany({
      where: eq(forms.userId, session.user.id),
      with: {
        sections: { orderBy: (s, { asc }) => [asc(s.order)] },
        questions: { orderBy: (q, { asc }) => [asc(q.order)] },
        responses: true,
      },
      orderBy: [desc(forms.updatedAt)],
    });
    return NextResponse.json(userForms);
  } catch (err) {
    console.error('[GET /api/forms]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/forms — create new form
export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const parsed = FormCreateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });
    }

    const { title, description, submitButtonText, themeJson, settingsJson, sections, questions } = parsed.data;
    const formId = randomUUID();

    // Insert form
    await db.insert(forms).values({
      id: formId,
      userId: session.user.id,
      title,
      description,
      submitButtonText: submitButtonText ?? 'Kirim Formulir',
      themeJson: themeJson as any,
      settingsJson: settingsJson as any,
    });

    // Insert sections
    if (sections.length > 0) {
      await db.insert(formSections).values(
        sections.map((s, idx) => ({
          id: s.id || randomUUID(),
          formId,
          title: s.title,
          description: s.description ?? '',
          afterSectionAction: s.afterSectionAction ?? 'submit',
          order: idx,
        }))
      );
    }

    // Insert questions
    if (questions.length > 0) {
      await db.insert(formQuestions).values(
        questions.map((q, idx) => ({
          id: q.id || randomUUID(),
          formId,
          sectionId: q.sectionId ?? sections[0]?.id,
          type: q.type,
          title: q.title,
          description: q.description ?? '',
          required: q.required ?? false,
          placeholder: q.placeholder ?? '',
          optionsJson: q.options ?? null,
          hasOtherOption: q.hasOtherOption ?? false,
          scaleMin: q.scaleMin ?? 1,
          scaleMax: q.scaleMax ?? 5,
          scaleMinLabel: q.scaleMinLabel ?? '',
          scaleMaxLabel: q.scaleMaxLabel ?? '',
          rowsJson: q.rows ?? null,
          columnsJson: q.columns ?? null,
          validationJson: q.validation ?? null,
          quizJson: q.quiz ?? null,
          order: idx,
        }))
      );
    }

    return NextResponse.json({ id: formId }, { status: 201 });
  } catch (err) {
    console.error('[POST /api/forms]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

