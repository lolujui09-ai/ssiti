import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { forms } from '@/drizzle/schema';
import { eq, desc } from 'drizzle-orm';
import { SAMPLE_FORMS } from '@/lib/sampleForms';
import { DashboardClient } from './DashboardClient';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect('/login');

  let userForms: any[] = [];
  try {
    userForms = await db.query.forms.findMany({
      where: eq(forms.userId, session.user.id),
      with: {
        sections: { orderBy: (s, { asc }) => [asc(s.order)] },
        questions: { orderBy: (q, { asc }) => [asc(q.order)] },
        responses: true,
      },
      orderBy: [desc(forms.updatedAt)],
    });
  } catch (err) {
    console.warn('[Dashboard] DB not ready or error, using sample forms for prototype:', err);
    userForms = SAMPLE_FORMS.map((f) => ({
      id: f.id,
      userId: session.user.id,
      title: f.title,
      description: f.description,
      submitButtonText: f.submitButtonText,
      themeJson: f.theme,
      settingsJson: f.settings,
      sections: f.sections,
      questions: f.questions,
      responses: f.responses,
    }));
  }

  return (
    <DashboardClient
      user={{
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        image: session.user.image ?? undefined,
      }}
      initialForms={userForms}
    />
  );
}
