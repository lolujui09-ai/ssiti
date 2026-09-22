import { useState, useEffect } from 'react';
import {
  FileText,
  CloudCheck,
  Palette,
  Eye,
  Send,
  Sparkles,
  Settings,
  Code2,
  ArrowLeft,
  LogOut,
  Wand2,
} from 'lucide-react';
import { FullFormSchema } from '../../types/schema';
import { User } from '../../types/auth';

interface HeaderNavProps {
  form: FullFormSchema;
  user: User;
  onUpdateTitle: (title: string) => void;
  activeTab: 'builder' | 'responses' | 'settings' | 'schema';
  onSelectTab: (tab: 'builder' | 'responses' | 'settings' | 'schema') => void;
  onOpenTheme: () => void;
  onOpenPreview: () => void;
  onOpenSend: () => void;
  onOpenPromptAI: () => void;
  onBackToDashboard: () => void;
  onGoToLanding?: () => void;
  onLogout: () => void;
  responseCount: number;
}

export const HeaderNav = ({
  form,
  user,
  onUpdateTitle,
  activeTab,
  onSelectTab,
  onOpenTheme,
  onOpenPreview,
  onOpenSend,
  onOpenPromptAI,
  onBackToDashboard,
  onGoToLanding,
  onLogout,
  responseCount,
}: HeaderNavProps) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleValue, setTitleValue] = useState(form.title);

  useEffect(() => {
    setTitleValue(form.title);
  }, [form.title]);

  const handleTitleBlur = () => {
    setIsEditingTitle(false);
    if (titleValue.trim()) {
      onUpdateTitle(titleValue.trim());
    } else {
      setTitleValue(form.title);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200/80 shadow-2xs">
      {/* Top Bar: Back to Dashboard, Title, Actions, User */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3">
        {/* Left: Back button + GForm Icon + Title Input + Save Status */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <button
            type="button"
            onClick={onBackToDashboard}
            className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl cursor-pointer transition-colors flex items-center gap-1 shrink-0"
            title="Kembali ke Formulir Saya (Dashboard)"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline text-xs font-semibold">Formulir Saya</span>
          </button>

          <div
            className="w-8 h-8 rounded-[4px] bg-[#15171a] flex items-center justify-center text-white shrink-0 font-mono text-xs font-bold shadow-xs"
            title="Ssiti Studio"
          >
            S
          </div>

          <div className="min-w-0 flex flex-col">
            <div className="flex items-center gap-2">
              {isEditingTitle ? (
                <input
                  type="text"
                  value={titleValue}
                  onChange={(e) => setTitleValue(e.target.value)}
                  onBlur={handleTitleBlur}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleTitleBlur();
                  }}
                  autoFocus
                  className="text-sm sm:text-base font-bold text-slate-900 border-b-2 border-indigo-600 focus:outline-none px-1 py-0.5 max-w-xs sm:max-w-md"
                />
              ) : (
                <button
                  type="button"
                  onClick={() => setIsEditingTitle(true)}
                  className="text-sm sm:text-base font-bold text-slate-900 hover:bg-slate-100/80 px-2 py-0.5 rounded-lg transition-colors truncate max-w-xs sm:max-w-md text-left cursor-text"
                  title="Klik untuk mengubah judul formulir"
                >
                  {form.title || 'Formulir Tanpa Judul'}
                </button>
              )}
            </div>

            {/* Cloud Saved indicator */}
            <div className="flex items-center gap-1 text-[11px] text-slate-400 pl-2">
              <CloudCheck className="w-3 h-3 text-emerald-600" />
              <span>Tersimpan di akun</span>
            </div>
          </div>
        </div>

        {/* Right: Actions (Prompt AI, Theme, Preview, Send, User Logout) */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* AI Prompt Button */}
          <button
            type="button"
            onClick={onOpenPromptAI}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-xl border border-indigo-200 cursor-pointer transition-all shadow-2xs"
            title="Lihat & Rancang Prompt AI untuk ChatGPT / Gemini / Claude"
          >
            <Wand2 className="w-4 h-4 text-indigo-600" />
            <span className="hidden sm:inline">Lihat Prompt AI</span>
          </button>

          {/* Theme customizer button */}
          <button
            type="button"
            onClick={onOpenTheme}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl cursor-pointer transition-colors"
            title="Kustomisasi Tema & Tampilan"
          >
            <Palette className="w-5 h-5" />
          </button>

          {/* Preview Respondent button */}
          <button
            type="button"
            onClick={onOpenPreview}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl cursor-pointer transition-colors flex items-center gap-1"
            title="Pratinjau Tampilan Pengisi Formulir"
          >
            <Eye className="w-5 h-5" />
            <span className="hidden lg:inline text-xs font-semibold">Pratinjau</span>
          </button>

          {/* Send / Publish button */}
          <button
            type="button"
            onClick={onOpenSend}
            style={{ backgroundColor: form.theme?.primaryColor || '#4f46e5' }}
            className="flex items-center gap-1.5 px-3 sm:px-4 py-2 text-xs font-bold text-white rounded-xl shadow-xs hover:opacity-90 active:scale-95 cursor-pointer transition-all shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Kirim</span>
          </button>

          {/* User Profile & Logout */}
          <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block" />

          <div className="flex items-center gap-2 pl-1">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-8 h-8 rounded-full border border-slate-200 shrink-0"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center">
                {user.name.charAt(0)}
              </div>
            )}

            <button
              type="button"
              onClick={onLogout}
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl cursor-pointer transition-colors"
              title="Keluar dari akun"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Center Tabs: Pertanyaan, Tanggapan, Setelan, Schema */}
      <div className="flex justify-center border-t border-slate-100 px-4">
        <nav className="flex items-center space-x-1 sm:space-x-8 -mb-px text-xs sm:text-sm font-semibold">
          {/* Tab 1: Pertanyaan */}
          <button
            type="button"
            onClick={() => onSelectTab('builder')}
            className={`py-3 px-3 border-b-2 flex items-center gap-2 cursor-pointer transition-colors ${
              activeTab === 'builder'
                ? 'border-indigo-600 text-indigo-700 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
            }`}
          >
            <span>Pertanyaan</span>
          </button>

          {/* Tab 2: Tanggapan */}
          <button
            type="button"
            onClick={() => onSelectTab('responses')}
            className={`py-3 px-3 border-b-2 flex items-center gap-2 cursor-pointer transition-colors ${
              activeTab === 'responses'
                ? 'border-indigo-600 text-indigo-700 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
            }`}
          >
            <span>Tanggapan</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[11px] font-bold ${
                responseCount > 0
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'bg-slate-100 text-slate-500'
              }`}
            >
              {responseCount}
            </span>
          </button>

          {/* Tab 3: Setelan */}
          <button
            type="button"
            onClick={() => onSelectTab('settings')}
            className={`py-3 px-3 border-b-2 flex items-center gap-2 cursor-pointer transition-colors ${
              activeTab === 'settings'
                ? 'border-indigo-600 text-indigo-700 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
            }`}
          >
            <Settings className="w-3.5 h-3.5 sm:hidden" />
            <span>Setelan</span>
          </button>

          {/* Tab 4: Schema JSON */}
          <button
            type="button"
            onClick={() => onSelectTab('schema')}
            className={`py-3 px-3 border-b-2 flex items-center gap-1.5 cursor-pointer transition-colors ${
              activeTab === 'schema'
                ? 'border-indigo-600 text-indigo-700 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
            }`}
          >
            <Code2 className="w-4 h-4 text-indigo-600" />
            <span>Schema JSON</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
