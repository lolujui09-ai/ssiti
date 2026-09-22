import { useState, useEffect } from 'react';
import { HeaderNav } from './components/HeaderNav/HeaderNav';
import { BuilderCanvas } from './components/VisualBuilder/BuilderCanvas';
import { ResponsesView } from './components/ResponsesView/ResponsesView';
import { SettingsView } from './components/SettingsView/SettingsView';
import { SchemaView } from './components/SchemaView/SchemaView';
import { FormRunner } from './components/FormRunner/FormRunner';
import { ThemeModal } from './components/ThemeModal/ThemeModal';
import { ShareModal } from './components/ShareModal/ShareModal';
import { PromptGeneratorModal } from './components/PromptModal/PromptGeneratorModal';
import { LoginScreen } from './components/Auth/LoginScreen';
import { MyFormsView } from './components/Dashboard/MyFormsView';
import { LandingPage } from './components/Landing/LandingPage';
import { FullFormSchema, FormResponseItem, FormSettings, FormTheme } from './types/schema';
import { User } from './types/auth';
import { Sparkles, FileText, Plus, LogOut, Home } from 'lucide-react';

const FORMS_STORAGE_KEY = 'quickform_user_forms_v3';
const USER_STORAGE_KEY = 'quickform_user_session_v3';

// Default initial form
const DEFAULT_INITIAL_FORM: FullFormSchema = {
  id: 'form_evaluasi_harian',
  title: 'Kuis Evaluasi Pemahaman Materi',
  description: 'Silakan kerjakan evaluasi ini secara mandiri untuk mengukur pemahaman konsep Anda.',
  submitButtonText: 'Kirim Jawaban Evaluasi',
  theme: {
    primaryColor: '#3730a3',
    accentColor: '#4c46c4',
    backgroundColor: '#f8fafc',
    fontFamily: 'Plus Jakarta Sans',
    borderRadius: 'xl',
  },
  settings: {
    isQuiz: true,
    releaseGradesImmediately: true,
    showMissedQuestions: true,
    showCorrectAnswers: true,
    showPointValues: true,
    defaultQuestionPoints: 20,
    collectEmail: true,
    limitOneResponse: false,
    allowResponseEditing: false,
    isAcceptingResponses: true,
    showProgressBar: true,
    shuffleQuestions: false,
    confirmationMessage: 'Jawaban evaluasi Anda telah berhasil dikirim! Silakan lihat skor dan pembahasan Anda.',
    showSubmitAnotherLink: true,
  },
  sections: [
    {
      id: 'sec_identitas',
      title: 'Bagian 1: Data Diri Peserta',
      description: 'Isi identitas diri Anda sebelum memulai pengerjaan kuis.',
      afterSectionAction: 'next',
    },
    {
      id: 'sec_soal',
      title: 'Bagian 2: Soal Pemahaman Konsep',
      description: 'Pilih jawaban yang paling tepat untuk setiap pertanyaan.',
      afterSectionAction: 'submit',
    },
  ],
  questions: [
    {
      id: 'q_nama',
      sectionId: 'sec_identitas',
      type: 'text',
      title: 'Nama Lengkap Peserta',
      placeholder: 'Contoh: Ahmad Fauzan',
      required: true,
    },
    {
      id: 'q_organel',
      sectionId: 'sec_soal',
      type: 'radio',
      title: 'Organel sel yang berfungsi sebagai tempat berlangsungnya respirasi seluler dan penghasil energi utama (ATP) adalah...',
      required: true,
      options: [
        { id: 'opt_1', label: 'Mitokondria', value: 'Mitokondria' },
        { id: 'opt_2', label: 'Ribosom', value: 'Ribosom' },
        { id: 'opt_3', label: 'Badan Golgi', value: 'Badan Golgi' },
        { id: 'opt_4', label: 'Retikulum Endoplasma', value: 'Retikulum Endoplasma' },
      ],
      quiz: {
        points: 25,
        correctAnswers: ['Mitokondria'],
        explanation: 'Mitokondria sering disebut the powerhouse of cell karena menghasilkan ATP lewat siklus respirasi seluler.',
      },
    },
    {
      id: 'q_dna',
      sectionId: 'sec_soal',
      type: 'radio',
      title: 'Organel semiotonom berikut yang memiliki materi genetik (DNA) dan ribosom sendiri adalah...',
      required: true,
      options: [
        { id: 'opt_kloroplas', label: 'Kloroplas dan Mitokondria', value: 'Kloroplas dan Mitokondria' },
        { id: 'opt_lisosom', label: 'Lisosom dan Vakuola', value: 'Lisosom dan Vakuola' },
        { id: 'opt_peroksisom', label: 'Peroksisom dan Sentriol', value: 'Peroksisom dan Sentriol' },
      ],
      quiz: {
        points: 25,
        correctAnswers: ['Kloroplas dan Mitokondria'],
        explanation: 'Menurut teori endosimbiosis, kloroplas dan mitokondria berasal dari bakteri endosimbion dan memiliki DNA sirkular sendiri.',
      },
    },
    {
      id: 'q_skala',
      sectionId: 'sec_soal',
      type: 'scale',
      title: 'Seberapa yakin Anda dengan penguasaan materi biologi sel saat ini?',
      required: false,
      scaleMin: 1,
      scaleMax: 5,
      scaleMinLabel: 'Kurang Yakin',
      scaleMaxLabel: 'Sangat Yakin',
    },
  ],
  responses: [
    {
      id: 'resp_demo_1',
      submittedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      email: 'budi.santoso@gmail.com',
      answers: {
        q_nama: 'Budi Santoso',
        q_organel: 'Mitokondria',
        q_dna: 'Kloroplas dan Mitokondria',
        q_skala: 5,
      },
      quizScore: {
        totalPoints: 50,
        maxPoints: 50,
        breakdown: {
          q_organel: { earned: 25, max: 25, isCorrect: true },
          q_dna: { earned: 25, max: 25, isCorrect: true },
        },
      },
    },
  ],
};

// Deduplicate and ensure all forms have unique IDs
const sanitizeForms = (rawForms: any[]): FullFormSchema[] => {
  const seenIds = new Set<string>();
  const sanitized: FullFormSchema[] = [];
  for (const form of rawForms) {
    if (!form || typeof form !== 'object') continue;
    let id = typeof form.id === 'string' && form.id.trim() ? form.id.trim() : `form_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 7)}`;
    if (seenIds.has(id)) {
      id = `${id}_${Math.random().toString(36).substring(2, 7)}`;
    }
    seenIds.add(id);

    // Also sanitize questions to ensure unique IDs within each form
    const questions = Array.isArray(form.questions) ? form.questions : [];
    const seenQIds = new Set<string>();
    const sanitizedQuestions = questions.map((q: any, qIdx: number) => {
      let qId = q?.id || `q_${qIdx + 1}_${Math.random().toString(36).substring(2, 6)}`;
      if (seenQIds.has(qId)) {
        qId = `${qId}_${Math.random().toString(36).substring(2, 6)}`;
      }
      seenQIds.add(qId);
      return { ...q, id: qId };
    });

    sanitized.push({ ...form, id, questions: sanitizedQuestions });
  }
  return sanitized.length > 0 ? sanitized : [DEFAULT_INITIAL_FORM];
};

export default function App() {
  // 1. User Session State
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const savedUser = localStorage.getItem(USER_STORAGE_KEY);
      if (savedUser) return JSON.parse(savedUser);
    } catch {
      // fallback
    }
    return null;
  });

  // 2. Multi-Forms State
  const [forms, setForms] = useState<FullFormSchema[]>(() => {
    try {
      const saved = localStorage.getItem(FORMS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return sanitizeForms(parsed);
        }
      }
    } catch {
      // fallback
    }
    return [DEFAULT_INITIAL_FORM];
  });

  // 3. Navigation & Active View State: 'landing' | 'login' | 'dashboard' | 'builder'
  const [viewMode, setViewMode] = useState<'landing' | 'login' | 'dashboard' | 'builder'>('landing');
  const [activeFormId, setActiveFormId] = useState<string>(
    forms[0]?.id || DEFAULT_INITIAL_FORM.id
  );
  const [activeTab, setActiveTab] = useState<'builder' | 'responses' | 'settings' | 'schema'>('builder');

  // 4. Modals
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isPromptOpen, setIsPromptOpen] = useState(false);
  const [previewingForm, setPreviewingForm] = useState<FullFormSchema | null>(null);

  // Sync forms to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(FORMS_STORAGE_KEY, JSON.stringify(forms));
    } catch {
      // storage quota fallback
    }
  }, [forms]);

  // Sync user to localStorage
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(USER_STORAGE_KEY);
      }
    } catch {
      // fallback
    }
  }, [currentUser]);

  // Check URL hash for direct respondent link (e.g. /#respondent-form_id)
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#respondent-')) {
        const targetId = hash.replace('#respondent-', '');
        const found = forms.find((f) => f.id === targetId) || forms[0];
        if (found) {
          setPreviewingForm(found);
          setIsPreviewOpen(true);
        }
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, [forms]);

  // Active form currently being edited
  const currentForm = forms.find((f) => f.id === activeFormId) || forms[0] || DEFAULT_INITIAL_FORM;

  // Form mutation helper
  const handleUpdateCurrentForm = (updatedForm: FullFormSchema) => {
    setForms((prev) => prev.map((f) => (f.id === updatedForm.id ? updatedForm : f)));
  };

  const handleUpdateTitle = (newTitle: string) => {
    handleUpdateCurrentForm({ ...currentForm, title: newTitle });
  };

  const handleUpdateSettings = (newSettings: FormSettings) => {
    handleUpdateCurrentForm({ ...currentForm, settings: newSettings });
  };

  const handleUpdateSubmitText = (newText: string) => {
    handleUpdateCurrentForm({ ...currentForm, submitButtonText: newText });
  };

  const handleUpdateTheme = (newTheme: FormTheme) => {
    handleUpdateCurrentForm({ ...currentForm, theme: newTheme });
  };

  // Response submissions
  const handleNewResponse = (newResp: FormResponseItem) => {
    const target = previewingForm || currentForm;
    const updatedForm: FullFormSchema = {
      ...target,
      responses: [newResp, ...(target.responses || [])],
    };
    handleUpdateCurrentForm(updatedForm);
    if (previewingForm) {
      setPreviewingForm(updatedForm);
    }
  };

  const handleClearResponses = () => {
    handleUpdateCurrentForm({ ...currentForm, responses: [] });
  };

  const handleDeleteSingleResponse = (respId: string) => {
    handleUpdateCurrentForm({
      ...currentForm,
      responses: (currentForm.responses || []).filter((r) => r.id !== respId),
    });
  };

  // Dashboard Form Actions
  const handleSelectForm = (
    formId: string,
    initialTab: 'builder' | 'responses' | 'settings' | 'schema' = 'builder'
  ) => {
    setActiveFormId(formId);
    setActiveTab(initialTab);
    setViewMode('builder');
  };

  const handleCreateBlankForm = () => {
    const newFormId = `form_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 7)}`;
    const newBlankForm: FullFormSchema = {
      id: newFormId,
      title: 'Formulir Baru Tanpa Judul',
      description: 'Tuliskan deskripsi petunjuk formulir di sini.',
      submitButtonText: 'Kirim Formulir',
      theme: {
        primaryColor: '#3730a3',
        accentColor: '#4c46c4',
        backgroundColor: '#f8fafc',
        fontFamily: 'Plus Jakarta Sans',
        borderRadius: 'xl',
      },
      settings: {
        isQuiz: false,
        releaseGradesImmediately: false,
        showMissedQuestions: true,
        showCorrectAnswers: true,
        showPointValues: true,
        defaultQuestionPoints: 10,
        collectEmail: false,
        limitOneResponse: false,
        allowResponseEditing: false,
        isAcceptingResponses: true,
        showProgressBar: true,
        shuffleQuestions: false,
        confirmationMessage: 'Terima kasih! Tanggapan Anda telah tercatat.',
        showSubmitAnotherLink: true,
      },
      sections: [
        {
          id: `sec_1_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          title: 'Bagian 1',
          description: '',
          afterSectionAction: 'submit',
        },
      ],
      questions: [
        {
          id: `q_1_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          sectionId: `sec_1_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          type: 'text',
          title: 'Pertanyaan Tanpa Judul',
          required: false,
          placeholder: 'Jawaban singkat...',
        },
      ],
      responses: [],
    };

    setForms((prev) => [newBlankForm, ...prev]);
    setActiveFormId(newFormId);
    setActiveTab('builder');
    setViewMode('builder');
  };

  const handleDuplicateForm = (formId: string) => {
    const target = forms.find((f) => f.id === formId);
    if (!target) return;
    const duplicated: FullFormSchema = {
      ...JSON.parse(JSON.stringify(target)),
      id: `form_copy_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 7)}`,
      title: `${target.title} (Salinan)`,
      responses: [],
    };
    setForms((prev) => [duplicated, ...prev]);
  };

  const handleDeleteForm = (formId: string) => {
    if (forms.length <= 1) {
      alert('Anda harus memiliki minimal 1 formulir di akun Anda.');
      return;
    }
    if (window.confirm('Apakah Anda yakin ingin menghapus formulir ini beserta seluruh tanggapannya?')) {
      const remaining = forms.filter((f) => f.id !== formId);
      setForms(remaining);
      if (activeFormId === formId) {
        setActiveFormId(remaining[0].id);
      }
    }
  };

  // Generated form from PromptGeneratorModal
  const handleFormGenerated = (newGeneratedForm: FullFormSchema) => {
    setForms((prev) => {
      let finalForm = newGeneratedForm;
      // If form with same ID already exists, generate a fresh unique ID
      if (!finalForm.id || prev.some((f) => f.id === finalForm.id)) {
        finalForm = {
          ...finalForm,
          id: `form_ai_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 7)}`,
        };
      }
      return [finalForm, ...prev];
    });
    setActiveFormId(newGeneratedForm.id);
    setActiveTab('builder');
    setViewMode('builder');
  };

  // Auth login handler
  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    setViewMode('dashboard');
  };

  // Auth logout
  const handleLogout = () => {
    if (window.confirm('Apakah Anda yakin ingin keluar dari akun?')) {
      setCurrentUser(null);
      setViewMode('landing');
    }
  };

  // Flow from Landing page
  const handleGetStartedFromLanding = () => {
    if (currentUser) {
      setViewMode('dashboard');
    } else {
      setViewMode('login');
    }
  };

  // 1. LANDING PAGE VIEW
  if (viewMode === 'landing') {
    return (
      <LandingPage
        onGetStarted={handleGetStartedFromLanding}
        onOpenLogin={() => setViewMode('login')}
        user={currentUser}
      />
    );
  }

  // 2. LOGIN / REGISTER VIEW
  if (viewMode === 'login') {
    return (
      <LoginScreen
        onLoginSuccess={handleLoginSuccess}
        onBackToLanding={() => setViewMode('landing')}
      />
    );
  }

  return (
    <div
      style={{
        backgroundColor: viewMode === 'builder' ? currentForm.theme?.backgroundColor || '#f8fafc' : '#f8fafc',
        fontFamily:
          viewMode === 'builder' && currentForm.theme?.fontFamily
            ? `"${currentForm.theme.fontFamily}", sans-serif`
            : 'inherit',
      }}
      className="min-h-screen flex flex-col text-slate-900 selection:bg-indigo-100 selection:text-indigo-900"
    >
      {/* 3. DASHBOARD VIEW ("Formulir Saya") */}
      {viewMode === 'dashboard' && (
        <div className="min-h-screen flex flex-col bg-slate-50">
          {/* Dashboard Header Bar */}
          <header className="sticky top-0 z-40 bg-white border-b border-slate-200/80 shadow-2xs">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setViewMode('landing')}
                  className="w-8 h-8 rounded-[4px] bg-[#15171a] text-white flex items-center justify-center font-mono font-bold text-xs shadow-xs cursor-pointer hover:opacity-90 transition-opacity"
                  title="Ke Halaman Utama Ssiti"
                >
                  S
                </button>
                <div>
                  <h1 className="text-sm font-extrabold text-slate-900 tracking-tight">Ssiti Studio</h1>
                  <p className="text-[11px] text-slate-500">Dasbor Formulir &amp; Generator AI</p>
                </div>
              </div>

              {/* Header Right Actions */}
              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={() => setViewMode('landing')}
                  className="hidden md:flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl cursor-pointer transition-colors"
                >
                  <Home className="w-4 h-4 text-slate-500" />
                  <span>Landing Page</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsPromptOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-xl border border-indigo-200 cursor-pointer transition-colors shadow-2xs"
                >
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <span className="hidden sm:inline">Lihat Prompt AI</span>
                </button>

                <button
                  type="button"
                  onClick={handleCreateBlankForm}
                  className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-xs cursor-pointer transition-colors active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Formulir Baru</span>
                </button>

                <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block" />

                {/* User info & Logout */}
                {currentUser && (
                  <div className="flex items-center gap-2">
                    {currentUser.avatar ? (
                      <img
                        src={currentUser.avatar}
                        alt={currentUser.name}
                        className="w-8 h-8 rounded-full border border-slate-200 shrink-0"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center">
                        {currentUser.name.charAt(0)}
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl cursor-pointer transition-colors"
                      title="Keluar Akun"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* Dashboard Main Content */}
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
            <MyFormsView
              user={currentUser || { id: 'usr_guest', name: 'Tamu', email: 'tamu@ssiti.app' }}
              forms={forms}
              onSelectForm={handleSelectForm}
              onCreateBlankForm={handleCreateBlankForm}
              onOpenPromptAI={() => setIsPromptOpen(true)}
              onDuplicateForm={handleDuplicateForm}
              onDeleteForm={handleDeleteForm}
              onOpenPreview={(targetForm) => {
                setPreviewingForm(targetForm);
                setIsPreviewOpen(true);
              }}
              onBackToLanding={() => setViewMode('landing')}
            />
          </main>
        </div>
      )}

      {/* 4. FORM BUILDER VIEW (Editing a specific form) */}
      {viewMode === 'builder' && (
        <>
          {/* Header Navigation Bar */}
          <HeaderNav
            form={currentForm}
            user={currentUser || { id: 'usr_guest', name: 'Tamu', email: 'tamu@ssiti.app' }}
            onUpdateTitle={handleUpdateTitle}
            activeTab={activeTab}
            onSelectTab={setActiveTab}
            onOpenTheme={() => setIsThemeOpen(true)}
            onOpenPreview={() => {
              setPreviewingForm(currentForm);
              setIsPreviewOpen(true);
            }}
            onOpenSend={() => setIsShareOpen(true)}
            onOpenPromptAI={() => setIsPromptOpen(true)}
            onBackToDashboard={() => setViewMode('dashboard')}
            onGoToLanding={() => setViewMode('landing')}
            onLogout={handleLogout}
            responseCount={currentForm.responses?.length || 0}
          />

          {/* Builder Body Content */}
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
            {/* TAB 1: PERTANYAAN (Visual Builder) */}
            {activeTab === 'builder' && (
              <BuilderCanvas
                form={currentForm}
                onChange={handleUpdateCurrentForm}
                onOpenPromptAI={() => setIsPromptOpen(true)}
              />
            )}

            {/* TAB 2: TANGGAPAN (Responses Analytics & Individual Sheets) */}
            {activeTab === 'responses' && (
              <ResponsesView
                form={currentForm}
                onClearResponses={handleClearResponses}
                onDeleteSingleResponse={handleDeleteSingleResponse}
              />
            )}

            {/* TAB 3: SETELAN (Quiz, Email, Limits, Presentation) */}
            {activeTab === 'settings' && (
              <SettingsView
                form={currentForm}
                onUpdateSettings={handleUpdateSettings}
                onUpdateSubmitText={handleUpdateSubmitText}
              />
            )}

            {/* TAB 4: SCHEMA JSON (Clean, Pure Code Editor) */}
            {activeTab === 'schema' && (
              <SchemaView
                form={currentForm}
                onApplySchema={handleUpdateCurrentForm}
                onOpenPromptAI={() => setIsPromptOpen(true)}
              />
            )}
          </main>
        </>
      )}

      {/* Live Respondent View (Preview Modal or Full Screen Link) */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex flex-col py-6 animate-in fade-in">
          <div className="flex-1">
            <FormRunner
              form={previewingForm || currentForm}
              onSubmitSuccess={handleNewResponse}
              isRespondentView={false}
              onClosePreview={() => {
                setIsPreviewOpen(false);
                setPreviewingForm(null);
                if (window.location.hash.startsWith('#respondent-')) {
                  window.location.hash = '';
                }
              }}
            />
          </div>
        </div>
      )}

      {/* Theme Customizer Modal */}
      <ThemeModal
        isOpen={isThemeOpen}
        onClose={() => setIsThemeOpen(false)}
        theme={currentForm.theme}
        onUpdateTheme={handleUpdateTheme}
      />

      {/* Share / Send Form Modal */}
      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        form={currentForm}
        onOpenPreview={() => {
          setIsShareOpen(false);
          setPreviewingForm(currentForm);
          setIsPreviewOpen(true);
        }}
      />

      {/* Dedicated Prompt AI & Direct Generator Modal */}
      <PromptGeneratorModal
        isOpen={isPromptOpen}
        onClose={() => setIsPromptOpen(false)}
        onFormGenerated={handleFormGenerated}
      />
    </div>
  );
}
