import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { forms, formSections, formQuestions } from '@/drizzle/schema';
import { eq, and } from 'drizzle-orm';
import { randomUUID } from 'crypto';

type Params = { params: Promise<{ formId: string }> };

// Helper: get form with ownership check
async function getOwnedForm(formId: string, userId: string) {
  return db.query.forms.findFirst({
    where: and(eq(forms.id, formId), eq(forms.userId, userId)),
    with: {
      sections: { orderBy: (s, { asc }) => [asc(s.order)] },
      questions: { orderBy: (q, { asc }) => [asc(q.order)] },
      responses: true,
    },
  });
}

// GET /api/forms/[formId]
export async function GET(req: NextRequest, { params }: Params) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { formId } = await params;
  const form = await getOwnedForm(formId, session.user.id);
  if (!form) return NextResponse.json({ error: 'Form not found' }, { status: 404 });

  return NextResponse.json(form);
}

// PUT /api/forms/[formId] — full update (title, theme, settings, sections, questions)
export async function PUT(req: NextRequest, { params }: Params) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { formId } = await params;
  const existing = await getOwnedForm(formId, session.user.id);
  if (!existing) return NextResponse.json({ error: 'Form not found' }, { status: 404 });

  try {
    const body = await req.json();

    // Update core form fields
    await db
      .update(forms)
      .set({
        title: body.title ?? existing.title,
        description: body.description ?? existing.description,
        submitButtonText: body.submitButtonText ?? existing.submitButtonText,
        themeJson: body.themeJson ?? (existing.themeJson as any),
        settingsJson: body.settingsJson ?? (existing.settingsJson as any),
      })
      .where(eq(forms.id, formId));

    // Update sections: delete all + re-insert
    if (Array.isArray(body.sections)) {
      await db.delete(formSections).where(eq(formSections.formId, formId));
      if (body.sections.length > 0) {
        await db.insert(formSections).values(
          body.sections.map((s: any, idx: number) => ({
            id: s.id || randomUUID(),
            formId,
            title: s.title,
            description: s.description ?? '',
            afterSectionAction: s.afterSectionAction ?? 'submit',
            order: idx,
          }))
        );
      }
    }

    // Update questions: delete all + re-insert (preserves dnd-kit order)
    if (Array.isArray(body.questions)) {
      await db.delete(formQuestions).where(eq(formQuestions.formId, formId));
      if (body.questions.length > 0) {
        await db.insert(formQuestions).values(
          body.questions.map((q: any, idx: number) => ({
            id: q.id || randomUUID(),
            formId,
            sectionId: q.sectionId ?? body.sections?.[0]?.id ?? null,
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
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[PUT /api/forms/[formId]]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/forms/[formId]
export async function DELETE(req: NextRequest, { params }: Params) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { formId } = await params;
  const existing = await getOwnedForm(formId, session.user.id);
  if (!existing) return NextResponse.json({ error: 'Form not found' }, { status: 404 });

  await db.delete(forms).where(eq(forms.id, formId));
  return NextResponse.json({ success: true });
}

