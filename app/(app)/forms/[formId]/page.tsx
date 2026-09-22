import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { forms, formSections, formQuestions, formResponses } from '@/drizzle/schema';
import { eq, asc } from 'drizzle-orm';
import { SAMPLE_FORMS } from '@/lib/sampleForms';
import { FormBuilderClient } from './FormBuilderClient';

export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ formId: string }> };

export default async function FormBuilderPage({ params }: Props) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect('/login');

  const { formId } = await params;

  let form: any = null;
  try {
    form = await db.query.forms.findFirst({
      where: eq(forms.id, formId),
      with: {
        sections: { orderBy: [asc(formSections.order)] },
        questions: { orderBy: [asc(formQuestions.order)] },
        responses: { orderBy: (r, { desc }) => [desc(r.submittedAt)] },
      },
    });
  } catch (err) {
    console.warn('[FormBuilder] DB query fallback:', err);
  }

  // Fallback to sample forms if not in DB
  if (!form) {
    const sample = SAMPLE_FORMS.find((f) => f.id === formId) || SAMPLE_FORMS[0];
    if (sample) {
      form = {
        id: sample.id,
        userId: session.user.id,
        title: sample.title,
        description: sample.description,
        submitButtonText: sample.submitButtonText,
        themeJson: sample.theme,
        settingsJson: sample.settings,
        sections: sample.sections,
        questions: sample.questions,
        responses: sample.responses,
      };
    }
  }

  if (!form) redirect('/dashboard');

  return (
    <FormBuilderClient
      initialForm={form}
      user={{
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        image: session.user.image ?? undefined,
      }}
    />
  );
}
