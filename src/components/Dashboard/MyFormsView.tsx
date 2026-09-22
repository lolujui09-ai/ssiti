import { useState } from 'react';
import {
  Plus,
  Wand2,
  Search,
  FileText,
  CheckCircle2,
  Calendar,
  MessageSquare,
  MoreVertical,
  ExternalLink,
  Copy,
  Trash2,
  Layers,
  Sparkles,
  ArrowRight,
  HelpCircle,
} from 'lucide-react';
import { FullFormSchema } from '../../types/schema';
import { User } from '../../types/auth';

interface MyFormsViewProps {
  user: User;
  forms: FullFormSchema[];
  onSelectForm: (formId: string, initialTab?: 'builder' | 'responses' | 'settings' | 'schema') => void;
  onCreateBlankForm: () => void;
  onOpenPromptAI: () => void;
  onDuplicateForm: (formId: string) => void;
  onDeleteForm: (formId: string) => void;
  onOpenPreview: (form: FullFormSchema) => void;
  onBackToLanding?: () => void;
}

export const MyFormsView = ({
  user,
  forms,
  onSelectForm,
  onCreateBlankForm,
  onOpenPromptAI,
  onDuplicateForm,
  onDeleteForm,
  onOpenPreview,
  onBackToLanding,
}: MyFormsViewProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'quiz' | 'survey'>('all');
  const [activeMenuFormId, setActiveMenuFormId] = useState<string | null>(null);

  const filteredForms = forms.filter((f) => {
    const matchesSearch =
      f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (f.description && f.description.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;
    if (filterType === 'quiz') return f.settings?.isQuiz === true;
    if (filterType === 'survey') return f.settings?.isQuiz !== true;
    return true;
  });

  return (
    <div className="space-y-8 animate-in fade-in pb-16">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-indigo-800/40 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-white/10 text-indigo-300 text-xs font-semibold backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Selamat datang, {user.name}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Kelola &amp; Buat Formulir Anda
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Buat kuis interaktif atau survei kuesioner. Anda dapat merancang langsung di editor visual atau menggunakan bantuan AI eksternal untuk mempercepat pembuatan.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onCreateBlankForm}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/30 cursor-pointer transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Buat Formulir Kosong</span>
            </button>

            <button
              type="button"
              onClick={onOpenPromptAI}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 cursor-pointer transition-colors backdrop-blur-xs"
            >
              <Wand2 className="w-4 h-4 text-indigo-300" />
              <span>Lihat Prompt AI Generator</span>
            </button>

            {onBackToLanding && (
              <button
                type="button"
                onClick={onBackToLanding}
                className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 cursor-pointer transition-colors backdrop-blur-xs"
              >
                <span>Lihat Landing Page Ssiti</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari formulir berdasarkan judul..."
            className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-2xs"
          />
        </div>

        {/* Filter Badges */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl self-start sm:self-auto text-xs font-semibold text-slate-600">
          <button
            type="button"
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-lg cursor-pointer transition-colors ${
              filterType === 'all' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'hover:text-slate-900'
            }`}
          >
            Semua ({forms.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterType('quiz')}
            className={`px-3 py-1.5 rounded-lg cursor-pointer transition-colors ${
              filterType === 'quiz' ? 'bg-white text-indigo-700 shadow-xs font-bold' : 'hover:text-slate-900'
            }`}
          >
            Kuis ({forms.filter((f) => f.settings?.isQuiz).length})
          </button>
          <button
            type="button"
            onClick={() => setFilterType('survey')}
            className={`px-3 py-1.5 rounded-lg cursor-pointer transition-colors ${
              filterType === 'survey' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'hover:text-slate-900'
            }`}
          >
            Survei ({forms.filter((f) => !f.settings?.isQuiz).length})
          </button>
        </div>
      </div>

      {/* Forms Grid */}
      {filteredForms.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center max-w-md mx-auto space-y-4 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Belum ada formulir</h3>
            <p className="text-xs text-slate-500 mt-1">
              {searchQuery
                ? 'Tidak ditemukan formulir yang cocok dengan pencarian Anda.'
                : 'Mulai dengan membuat formulir baru atau gunakan prompt AI untuk mempercepat.'}
            </p>
          </div>
          <div className="pt-2 flex justify-center gap-3">
            <button
              type="button"
              onClick={onCreateBlankForm}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
            >
              + Buat Formulir
            </button>
            <button
              type="button"
              onClick={onOpenPromptAI}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
            >
              Lihat Prompt AI
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredForms.map((f, idx) => {
            const isQuiz = f.settings?.isQuiz;
            const respCount = f.responses?.length || 0;
            const questionCount = f.questions?.length || 0;

            return (
              <div
                key={`${f.id}-${idx}`}
                className="bg-white border border-slate-200 hover:border-indigo-300 rounded-2xl shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
              >
                {/* Card Top Banner Accent */}
                <div
                  className="h-2.5 w-full"
                  style={{ backgroundColor: f.theme?.primaryColor || '#4f46e5' }}
                />

                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          isQuiz
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                        }`}
                      >
                        {isQuiz ? 'Mode Kuis' : 'Survei / Kuesioner'}
                      </span>

                      {/* Dropdown Menu Toggle */}
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() =>
                            setActiveMenuFormId(activeMenuFormId === f.id ? null : f.id)
                          }
                          className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {activeMenuFormId === f.id && (
                          <div
                            onMouseLeave={() => setActiveMenuFormId(null)}
                            className="absolute right-0 top-full mt-1 w-44 bg-white border border-slate-200 rounded-xl shadow-xl z-20 py-1 text-xs text-slate-700 animate-in fade-in"
                          >
                            <button
                              type="button"
                              onClick={() => {
                                setActiveMenuFormId(null);
                                onSelectForm(f.id, 'builder');
                              }}
                              className="w-full px-3 py-2 text-left hover:bg-slate-50 flex items-center gap-2 cursor-pointer font-medium"
                            >
                              <FileText className="w-3.5 h-3.5 text-slate-500" />
                              <span>Buka &amp; Edit Form</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setActiveMenuFormId(null);
                                onSelectForm(f.id, 'responses');
                              }}
                              className="w-full px-3 py-2 text-left hover:bg-slate-50 flex items-center gap-2 cursor-pointer font-medium"
                            >
                              <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
                              <span>Lihat Tanggapan ({respCount})</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setActiveMenuFormId(null);
                                onOpenPreview(f);
                              }}
                              className="w-full px-3 py-2 text-left hover:bg-slate-50 flex items-center gap-2 cursor-pointer font-medium"
                            >
                              <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                              <span>Buka Form Responden</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setActiveMenuFormId(null);
                                onDuplicateForm(f.id);
                              }}
                              className="w-full px-3 py-2 text-left hover:bg-slate-50 flex items-center gap-2 cursor-pointer font-medium"
                            >
                              <Copy className="w-3.5 h-3.5 text-slate-500" />
                              <span>Duplikat Formulir</span>
                            </button>
                            <div className="border-t border-slate-100 my-1" />
                            <button
                              type="button"
                              onClick={() => {
                                setActiveMenuFormId(null);
                                onDeleteForm(f.id);
                              }}
                              className="w-full px-3 py-2 text-left hover:bg-rose-50 text-rose-600 flex items-center gap-2 cursor-pointer font-medium"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Hapus Formulir</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <h2
                      onClick={() => onSelectForm(f.id, 'builder')}
                      className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-indigo-600 cursor-pointer line-clamp-1 transition-colors"
                    >
                      {f.title || 'Formulir Tanpa Judul'}
                    </h2>

                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {f.description || 'Tidak ada deskripsi.'}
                    </p>
                  </div>

                  {/* Metadata Chips */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1 font-medium">
                        <FileText className="w-3.5 h-3.5 text-slate-400" />
                        <span>{questionCount} Pertanyaan</span>
                      </span>
                      <span className="flex items-center gap-1 font-medium text-indigo-600">
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>{respCount} Tanggapan</span>
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => onSelectForm(f.id, 'builder')}
                      className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                    >
                      <span>Buka</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
