'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FullFormSchema } from '@/types/schema';
import {
  Plus, Wand2, Search, FileText, MessageSquare, MoreVertical,
  ExternalLink, Copy, Trash2, Sparkles, ArrowRight, LogOut, Home,
} from 'lucide-react';
import { signOut } from '@/lib/auth-client';
import { PromptGeneratorModal } from '@/components/modals/PromptGeneratorModal';

interface Props {
  user: { id: string; name: string; email: string; image?: string };
  initialForms: any[];
}

export function DashboardClient({ user, initialForms }: Props) {
  const router = useRouter();
  const [forms, setForms] = useState<any[]>(initialForms);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'quiz' | 'survey'>('all');
  const [activeMenuFormId, setActiveMenuFormId] = useState<string | null>(null);
  const [isPromptOpen, setIsPromptOpen] = useState(false);
  const [loadingCreate, setLoadingCreate] = useState(false);

  const DEFAULT_THEME = { primaryColor: '#4f46e5', accentColor: '#6366f1', backgroundColor: '#f8fafc', fontFamily: 'Plus Jakarta Sans', borderRadius: 'xl' };
  const DEFAULT_SETTINGS = { isQuiz: false, releaseGradesImmediately: false, showMissedQuestions: true, showCorrectAnswers: true, showPointValues: true, defaultQuestionPoints: 10, collectEmail: false, limitOneResponse: false, allowResponseEditing: false, isAcceptingResponses: true, showProgressBar: true, shuffleQuestions: false, confirmationMessage: 'Terima kasih! Tanggapan Anda telah tercatat.', showSubmitAnotherLink: true };

  const filteredForms = forms.filter((f) => {
    const matchesSearch = f.title.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    const settings = f.settingsJson ?? {};
    if (filterType === 'quiz') return settings.isQuiz === true;
    if (filterType === 'survey') return settings.isQuiz !== true;
    return true;
  });

  const handleCreateBlankForm = async () => {
    setLoadingCreate(true);
    const sectionId = `sec_${Date.now()}`;
    const body = {
      title: 'Formulir Baru Tanpa Judul',
      description: '',
      submitButtonText: 'Kirim Formulir',
      themeJson: DEFAULT_THEME,
      settingsJson: DEFAULT_SETTINGS,
      sections: [{ id: sectionId, title: 'Bagian 1', description: '', afterSectionAction: 'submit' }],
      questions: [{ id: `q_${Date.now()}`, sectionId, type: 'text', title: 'Pertanyaan Tanpa Judul', required: false }],
    };
    const res = await fetch('/api/forms', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    if (res.ok) {
      const { id } = await res.json();
      router.push(`/forms/${id}`);
    }
    setLoadingCreate(false);
  };

  const handleDeleteForm = async (formId: string) => {
    if (!confirm('Hapus formulir ini beserta seluruh tanggapannya?')) return;
    await fetch(`/api/forms/${formId}`, { method: 'DELETE' });
    setForms((prev) => prev.filter((f) => f.id !== formId));
  };

  const handleDuplicateForm = async (form: any) => {
    const body = {
      title: `${form.title} (Salinan)`,
      description: form.description ?? '',
      submitButtonText: form.submitButtonText ?? 'Kirim',
      themeJson: form.themeJson,
      settingsJson: form.settingsJson,
      sections: form.sections ?? [],
      questions: form.questions ?? [],
    };
    const res = await fetch('/api/forms', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    if (res.ok) router.refresh();
  };

  const handleFormGenerated = async (newForm: FullFormSchema) => {
    const body = {
      title: newForm.title,
      description: newForm.description ?? '',
      submitButtonText: newForm.submitButtonText ?? 'Kirim',
      themeJson: newForm.theme,
      settingsJson: newForm.settings,
      sections: newForm.sections,
      questions: newForm.questions,
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
    router.refresh();
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => router.push('/')} className="w-8 h-8 rounded-[4px] bg-[#15171a] text-white flex items-center justify-center font-mono font-bold text-xs cursor-pointer hover:opacity-90 transition-opacity">S</button>
            <div>
              <h1 className="text-sm font-extrabold text-slate-900 tracking-tight">Ssiti Studio</h1>
              <p className="text-[11px] text-slate-500">Dasbor Formulir &amp; Generator AI</p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <button onClick={() => router.push('/')} className="hidden md:flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl cursor-pointer transition-colors">
              <Home className="w-4 h-4 text-slate-500" /><span>Landing Page</span>
            </button>
            <button onClick={() => setIsPromptOpen(true)} className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-xl border border-indigo-200 cursor-pointer transition-colors shadow-2xs">
              <Sparkles className="w-4 h-4 text-indigo-600" /><span className="hidden sm:inline">Generator AI</span>
            </button>
            <button onClick={handleCreateBlankForm} disabled={loadingCreate} className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-xs cursor-pointer transition-colors active:scale-95 disabled:opacity-60">
              <Plus className="w-4 h-4" /><span>+ Formulir Baru</span>
            </button>
            <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block" />
            <div className="flex items-center gap-2">
              {user.image ? (
                <img src={user.image} alt={user.name} className="w-8 h-8 rounded-full border border-slate-200 shrink-0" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center">{user.name.charAt(0)}</div>
              )}
              <button onClick={handleLogout} className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl cursor-pointer transition-colors" title="Keluar Akun">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-indigo-800/40 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-white/10 text-indigo-300 text-xs font-semibold backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5" /><span>Selamat datang, {user.name}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">Kelola &amp; Buat Formulir Anda</h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">Buat kuis interaktif atau survei kuesioner dengan visual builder atau prompt AI.</p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button onClick={handleCreateBlankForm} disabled={loadingCreate} className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/30 cursor-pointer transition-all active:scale-95 disabled:opacity-60">
                <Plus className="w-4 h-4" /><span>Buat Formulir Kosong</span>
              </button>
              <button onClick={() => setIsPromptOpen(true)} className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 cursor-pointer transition-colors backdrop-blur-xs">
                <Wand2 className="w-4 h-4 text-indigo-300" /><span>Generator AI</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filter & Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400"><Search className="w-4 h-4" /></div>
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Cari formulir berdasarkan judul..." className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-2xs" />
          </div>
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl self-start sm:self-auto text-xs font-semibold text-slate-600">
            {(['all', 'quiz', 'survey'] as const).map((f) => (
              <button key={f} onClick={() => setFilterType(f)} className={`px-3 py-1.5 rounded-lg cursor-pointer transition-colors ${filterType === f ? 'bg-white text-slate-900 shadow-xs font-bold' : 'hover:text-slate-900'}`}>
                {f === 'all' ? `Semua (${forms.length})` : f === 'quiz' ? `Kuis (${forms.filter(x => x.settingsJson?.isQuiz).length})` : `Survei (${forms.filter(x => !x.settingsJson?.isQuiz).length})`}
              </button>
            ))}
          </div>
        </div>

        {/* Forms Grid */}
        {filteredForms.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center max-w-md mx-auto space-y-4 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto"><FileText className="w-6 h-6" /></div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Belum ada formulir</h3>
              <p className="text-xs text-slate-500 mt-1">{searchQuery ? 'Tidak ditemukan formulir yang cocok.' : 'Mulai dengan membuat formulir baru.'}</p>
            </div>
            <button onClick={handleCreateBlankForm} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer">+ Buat Formulir</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredForms.map((f, idx) => {
              const isQuiz = f.settingsJson?.isQuiz;
              const respCount = f.responses?.length ?? 0;
              const questionCount = f.questions?.length ?? 0;
              return (
                <div key={`${f.id}-${idx}`} className="bg-white border border-slate-200 hover:border-indigo-300 rounded-2xl shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group">
                  <div className="h-2.5 w-full" style={{ backgroundColor: f.themeJson?.primaryColor ?? '#4f46e5' }} />
                  <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${isQuiz ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-indigo-50 text-indigo-700 border border-indigo-200'}`}>
                          {isQuiz ? 'Mode Kuis' : 'Survei / Kuesioner'}
                        </span>
                        <div className="relative">
                          <button onClick={() => setActiveMenuFormId(activeMenuFormId === f.id ? null : f.id)} className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer"><MoreVertical className="w-4 h-4" /></button>
                          {activeMenuFormId === f.id && (
                            <div onMouseLeave={() => setActiveMenuFormId(null)} className="absolute right-0 top-full mt-1 w-44 bg-white border border-slate-200 rounded-xl shadow-xl z-20 py-1 text-xs text-slate-700">
                              <button onClick={() => { setActiveMenuFormId(null); router.push(`/forms/${f.id}`); }} className="w-full px-3 py-2 text-left hover:bg-slate-50 flex items-center gap-2 cursor-pointer font-medium"><FileText className="w-3.5 h-3.5 text-slate-500" />Buka &amp; Edit Form</button>
                              <button onClick={() => { setActiveMenuFormId(null); router.push(`/forms/${f.id}/responses`); }} className="w-full px-3 py-2 text-left hover:bg-slate-50 flex items-center gap-2 cursor-pointer font-medium"><MessageSquare className="w-3.5 h-3.5 text-slate-500" />Lihat Tanggapan ({respCount})</button>
                              <button onClick={() => { setActiveMenuFormId(null); window.open(`/f/${f.id}`, '_blank'); }} className="w-full px-3 py-2 text-left hover:bg-slate-50 flex items-center gap-2 cursor-pointer font-medium"><ExternalLink className="w-3.5 h-3.5 text-slate-500" />Buka Form Responden</button>
                              <button onClick={() => { setActiveMenuFormId(null); handleDuplicateForm(f); }} className="w-full px-3 py-2 text-left hover:bg-slate-50 flex items-center gap-2 cursor-pointer font-medium"><Copy className="w-3.5 h-3.5 text-slate-500" />Duplikat Formulir</button>
                              <div className="border-t border-slate-100 my-1" />
                              <button onClick={() => { setActiveMenuFormId(null); handleDeleteForm(f.id); }} className="w-full px-3 py-2 text-left hover:bg-rose-50 text-rose-600 flex items-center gap-2 cursor-pointer font-medium"><Trash2 className="w-3.5 h-3.5" />Hapus Formulir</button>
                            </div>
                          )}
                        </div>
                      </div>
                      <h2 onClick={() => router.push(`/forms/${f.id}`)} className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-indigo-600 cursor-pointer line-clamp-1 transition-colors">{f.title ?? 'Formulir Tanpa Judul'}</h2>
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{f.description ?? 'Tidak ada deskripsi.'}</p>
                    </div>
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1 font-medium"><FileText className="w-3.5 h-3.5 text-slate-400" />{questionCount} Pertanyaan</span>
                        <span className="flex items-center gap-1 font-medium text-indigo-600"><MessageSquare className="w-3.5 h-3.5" />{respCount} Tanggapan</span>
                      </div>
                      <button onClick={() => router.push(`/forms/${f.id}`)} className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"><span>Buka</span><ArrowRight className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <PromptGeneratorModal isOpen={isPromptOpen} onClose={() => setIsPromptOpen(false)} onFormGenerated={handleFormGenerated} />
    </div>
  );
}

