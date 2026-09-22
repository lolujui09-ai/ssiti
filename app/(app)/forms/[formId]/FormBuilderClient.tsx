'use client';
import { useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { FullFormSchema, FormSettings, FormTheme } from '@/types/schema';
import { BuilderCanvas } from '@/components/builder/BuilderCanvas';
import { ResponsesView } from '@/components/responses/ResponsesView';
import { SettingsView } from '@/components/settings/SettingsView';
import { SchemaView } from '@/components/schema/SchemaView';
import { FormRunner } from '@/components/form-runner/FormRunner';
import { ThemeModal } from '@/components/modals/ThemeModal';
import { ShareModal } from '@/components/modals/ShareModal';
import { PromptGeneratorModal } from '@/components/modals/PromptGeneratorModal';
import { HeaderNav } from '@/components/nav/HeaderNav';
import { signOut } from '@/lib/auth-client';

// Map DB row → FullFormSchema
function dbToFullForm(dbForm: any): FullFormSchema {
  return {
    id: dbForm.id,
    title: dbForm.title,
    description: dbForm.description ?? '',
    submitButtonText: dbForm.submitButtonText ?? 'Kirim Formulir',
    theme: dbForm.themeJson ?? { primaryColor: '#4f46e5', accentColor: '#6366f1', backgroundColor: '#f8fafc', fontFamily: 'Plus Jakarta Sans', borderRadius: 'xl' },
    settings: dbForm.settingsJson ?? {},
    sections: (dbForm.sections ?? []).map((s: any) => ({ id: s.id, title: s.title, description: s.description ?? '', afterSectionAction: s.afterSectionAction ?? 'submit' })),
    questions: (dbForm.questions ?? []).map((q: any) => ({
      id: q.id, type: q.type, title: q.title, description: q.description ?? '',
      required: q.required, placeholder: q.placeholder ?? '', sectionId: q.sectionId,
      options: q.optionsJson ?? undefined, hasOtherOption: q.hasOtherOption ?? false,
      scaleMin: q.scaleMin ?? 1, scaleMax: q.scaleMax ?? 5,
      scaleMinLabel: q.scaleMinLabel ?? '', scaleMaxLabel: q.scaleMaxLabel ?? '',
      rows: q.rowsJson ?? undefined, columns: q.columnsJson ?? undefined,
      validation: q.validationJson ?? undefined, quiz: q.quizJson ?? undefined,
    })),
    responses: (dbForm.responses ?? []).map((r: any) => ({
      id: r.id, submittedAt: r.submittedAt?.toISOString?.() ?? new Date().toISOString(),
      email: r.email ?? undefined, answers: r.answersJson ?? {},
      quizScore: r.quizScoreJson ?? undefined,
    })),
  };
}

interface Props {
  initialForm: any;
  user: { id: string; name: string; email: string; image?: string };
}

export function FormBuilderClient({ initialForm, user }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<FullFormSchema>(() => dbToFullForm(initialForm));
  const [activeTab, setActiveTab] = useState<'builder' | 'responses' | 'settings' | 'schema'>('builder');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isPromptOpen, setIsPromptOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const saveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-save debounced
  const saveForm = useCallback(async (updatedForm: FullFormSchema) => {
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(async () => {
      setSaving(true);
      await fetch(`/api/forms/${updatedForm.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: updatedForm.title,
          description: updatedForm.description,
          submitButtonText: updatedForm.submitButtonText,
          themeJson: updatedForm.theme,
          settingsJson: updatedForm.settings,
          sections: updatedForm.sections,
          questions: updatedForm.questions,
        }),
      });
      setSaving(false);
    }, 800);
  }, []);

  const handleUpdateForm = (updated: FullFormSchema) => {
    setForm(updated);
    saveForm(updated);
  };

  const handleUpdateTitle = (title: string) => handleUpdateForm({ ...form, title });
  const handleUpdateSettings = (settings: FormSettings) => handleUpdateForm({ ...form, settings });
  const handleUpdateSubmitText = (submitButtonText: string) => handleUpdateForm({ ...form, submitButtonText });
  const handleUpdateTheme = (theme: FormTheme) => handleUpdateForm({ ...form, theme });

  const handleNewResponse = async (newResp: any) => {
    setForm((prev) => ({ ...prev, responses: [newResp, ...(prev.responses ?? [])] }));
  };

  const handleClearResponses = async () => {
    // For now just refresh from server
    router.refresh();
  };

  const handleDeleteSingleResponse = (respId: string) => {
    setForm((prev) => ({ ...prev, responses: (prev.responses ?? []).filter((r) => r.id !== respId) }));
  };

  const handleFormGenerated = async (newForm: FullFormSchema) => {
    const body = {
      title: newForm.title, description: newForm.description ?? '',
      submitButtonText: newForm.submitButtonText ?? 'Kirim',
      themeJson: newForm.theme, settingsJson: newForm.settings,
      sections: newForm.sections, questions: newForm.questions,
    };
    const res = await fetch('/api/forms', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    if (res.ok) {
      const { id } = await res.json();
      setIsPromptOpen(false);
      router.push(`/forms/${id}`);
    }
  };

  const handleLogout = async () => {
    await signOut();
    router.push('/');
  };

  return (
    <div
      style={{ backgroundColor: form.theme?.backgroundColor || '#f8fafc', fontFamily: form.theme?.fontFamily ? `"${form.theme.fontFamily}", sans-serif` : 'inherit' }}
      className="min-h-screen flex flex-col text-slate-900"
    >
      <HeaderNav
        form={form}
        userName={user.name}
        userAvatar={user.image}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenTheme={() => setIsThemeOpen(true)}
        onOpenPreview={() => setIsPreviewOpen(true)}
        onOpenSend={() => setIsShareOpen(true)}
        onOpenPromptAI={() => setIsPromptOpen(true)}
        onUpdateTitle={handleUpdateTitle}
        responseCount={form.responses?.length ?? 0}
        saving={saving}
        onBackToDashboard={() => router.push('/dashboard')}
        onLogout={handleLogout}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {activeTab === 'builder' && <BuilderCanvas form={form} onChange={handleUpdateForm} onOpenPromptAI={() => setIsPromptOpen(true)} />}
        {activeTab === 'responses' && <ResponsesView form={form} onClearResponses={handleClearResponses} onDeleteSingleResponse={handleDeleteSingleResponse} />}
        {activeTab === 'settings' && <SettingsView form={form} onUpdateSettings={handleUpdateSettings} onUpdateSubmitText={handleUpdateSubmitText} />}
        {activeTab === 'schema' && <SchemaView form={form} onApplySchema={handleUpdateForm} onOpenPromptAI={() => setIsPromptOpen(true)} />}
      </main>

      {/* Preview Modal */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex flex-col py-6 animate-in fade-in">
          <div className="flex-1">
            <FormRunner
              form={form}
              onSubmitSuccess={handleNewResponse}
              isRespondentView={false}
              onClosePreview={() => setIsPreviewOpen(false)}
            />
          </div>
        </div>
      )}

      <ThemeModal isOpen={isThemeOpen} onClose={() => setIsThemeOpen(false)} theme={form.theme} onUpdateTheme={handleUpdateTheme} />
      <ShareModal isOpen={isShareOpen} onClose={() => setIsShareOpen(false)} form={form} onOpenPreview={() => { setIsShareOpen(false); setIsPreviewOpen(true); }} />
      <PromptGeneratorModal isOpen={isPromptOpen} onClose={() => setIsPromptOpen(false)} onFormGenerated={handleFormGenerated} />
    </div>
  );
}

