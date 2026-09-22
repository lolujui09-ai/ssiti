import { db } from '@/lib/db';
import { forms, formSections, formQuestions } from '@/drizzle/schema';
import { eq, asc } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { SAMPLE_FORMS } from '@/lib/sampleForms';
import { FormRunnerPublic } from './FormRunnerPublic';

export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ formId: string }> };

export default async function PublicFormPage({ params }: Props) {
  const { formId } = await params;

  let form: any = null;
  try {
    form = await db.query.forms.findFirst({
      where: eq(forms.id, formId),
      with: {
        sections: { orderBy: [asc(formSections.order)] },
        questions: { orderBy: [asc(formQuestions.order)] },
      },
    });
  } catch (err) {
    console.warn('[PublicFormPage] DB query error, checking sample forms:', err);
  }

  // Fallback to sample forms
  if (!form) {
    const sample = SAMPLE_FORMS.find((f) => f.id === formId) || SAMPLE_FORMS[0];
    if (sample) {
      form = {
        id: sample.id,
        title: sample.title,
        description: sample.description,
        submitButtonText: sample.submitButtonText,
        themeJson: sample.theme,
        settingsJson: sample.settings,
        sections: sample.sections,
        questions: sample.questions,
      };
    }
  }

  if (!form) notFound();

  return <FormRunnerPublic form={form} />;
}
