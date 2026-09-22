import { useState } from 'react';
import {
  FileText,
  MessageSquare,
  Settings as SettingsIcon,
  Code2,
  Palette,
  Eye,
  Send,
  Sparkles,
  LayoutTemplate,
  Check,
  Undo2,
  Redo2,
  ChevronDown,
} from 'lucide-react';
import { FullFormSchema } from '../types/schema';
import { SAMPLE_FORMS } from '../data/sampleForms';

interface HeaderNavProps {
  form: FullFormSchema;
  onUpdateTitle: (newTitle: string) => void;
  activeTab: 'builder' | 'responses' | 'settings' | 'schema';
  onSelectTab: (tab: 'builder' | 'responses' | 'settings' | 'schema') => void;
  onOpenTheme: () => void;
  onOpenPreview: () => void;
  onOpenShare: () => void;
  onOpenPromptAI: () => void;
  onLoadPreset: (form: FullFormSchema) => void;
  responseCount: number;
}

export const HeaderNav = ({
  form,
  onUpdateTitle,
  activeTab,
  onSelectTab,
  onOpenTheme,
  onOpenPreview,
  onOpenShare,
  onOpenPromptAI,
  onLoadPreset,
  responseCount,
}: HeaderNavProps) => {
  const [showTemplatesDropdown, setShowTemplatesDropdown] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState(form.title);

  const handleTitleSubmit = () => {
    setIsEditingTitle(false);
    if (titleInput.trim()) {
      onUpdateTitle(titleInput.trim());
    } else {
      setTitleInput(form.title);
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-2xs">
      {/* Upper Row: Brand, Editable Title, Top Actions */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-3">
        {/* Left: Brand & Form Title */}
        <div className="flex items-center gap-3 min-w-0">
          <div
            style={{ backgroundColor: form.theme.primaryColor }}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-xs shrink-0 transition-colors"
          >
            <FileText className="w-5 h-5" />
          </div>

          <div className="min-w-0 flex items-center gap-2">
            <span className="font-extrabold text-sm tracking-tight text-slate-900 hidden sm:inline">
              QuickForm
            </span>
            <span className="text-slate-300 hidden sm:inline">/</span>

            {isEditingTitle ? (
              <input
                type="text"
                value={titleInput}
                onChange={(e) => setTitleInput(e.target.value)}
                onBlur={handleTitleSubmit}
                onKeyDown={(e) => e.key === 'Enter' && handleTitleSubmit()}
                autoFocus
                className="font-semibold text-xs sm:text-sm text-slate-800 border-b-2 border-indigo-600 bg-transparent focus:outline-none px-1 py-0.5"
              />
            ) : (
              <h2
                onClick={() => {
                  setTitleInput(form.title);
                  setIsEditingTitle(true);
                }}
                className="font-semibold text-xs sm:text-sm text-slate-800 truncate cursor-pointer hover:bg-slate-100 px-2 py-1 rounded-md transition-colors"
                title="Klik untuk mengubah judul form"
              >
                {form.title}
              </h2>
            )}
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Preset templates */}
          <div className="relative">
            <button
              onClick={() => setShowTemplatesDropdown(!showTemplatesDropdown)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium cursor-pointer transition-colors"
              title="Muat contoh form Google Forms lengkap"
            >
              <LayoutTemplate className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden md:inline">Contoh Template</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showTemplatesDropdown && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowTemplatesDropdown(false)}
                />
                <div className="absolute right-0 mt-1.5 w-72 bg-white border border-slate-200 rounded-xl shadow-xl p-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                    Pilih Template Google Forms
                  </div>
                  <div className="mt-1 space-y-1">
                    {SAMPLE_FORMS.map((tmpl) => (
                      <button
                        key={tmpl.id}
                        onClick={() => {
                          onLoadPreset(tmpl);
                          setShowTemplatesDropdown(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors flex flex-col gap-0.5 cursor-pointer group"
                      >
                        <span className="text-xs font-semibold text-slate-800 group-hover:text-indigo-600">
                          {tmpl.title}
                        </span>
                        <span className="text-[11px] text-slate-500 line-clamp-1">
                          {tmpl.description}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* AI Prompt Button */}
          <button
            onClick={onOpenPromptAI}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200/80 text-xs font-semibold cursor-pointer transition-colors"
            title="Buka panduan & prompt AI untuk ChatGPT/Gemini/Claude"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Prompt AI</span>
          </button>

          {/* Customize Theme Button */}
          <button
            onClick={onOpenTheme}
            className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent hover:border-slate-200 transition-colors cursor-pointer"
            title="Kustomisasi Tema & Tampilan"
          >
            <Palette className="w-4 h-4" />
          </button>

          {/* Preview Button */}
          <button
            onClick={onOpenPreview}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold cursor-pointer transition-colors"
            title="Lihat Pratinjau Form"
          >
            <Eye className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Pratinjau</span>
          </button>

          {/* Publish / Send / Share Button */}
          <button
            onClick={onOpenShare}
            style={{ backgroundColor: form.theme.primaryColor }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-white text-xs font-bold shadow-xs hover:opacity-90 active:opacity-100 cursor-pointer transition-all"
            title="Publikasikan dan Bagikan Link Form"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Kirim / Bagikan</span>
          </button>
        </div>
      </div>

      {/* Lower Row: Google Forms-Style Center Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-center border-t border-slate-100">
        <nav className="flex items-center gap-2 sm:gap-6 text-xs sm:text-sm font-semibold">
          <button
            onClick={() => onSelectTab('builder')}
            className={`py-2.5 px-3 border-b-2 flex items-center gap-2 cursor-pointer transition-colors ${
              activeTab === 'builder'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Pertanyaan</span>
          </button>

          <button
            onClick={() => onSelectTab('responses')}
            className={`py-2.5 px-3 border-b-2 flex items-center gap-2 cursor-pointer transition-colors ${
              activeTab === 'responses'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Respons</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
              {responseCount}
            </span>
          </button>

          <button
            onClick={() => onSelectTab('settings')}
            className={`py-2.5 px-3 border-b-2 flex items-center gap-2 cursor-pointer transition-colors ${
              activeTab === 'settings'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <SettingsIcon className="w-4 h-4" />
            <span>Setelan</span>
          </button>

          <button
            onClick={() => onSelectTab('schema')}
            className={`py-2.5 px-3 border-b-2 flex items-center gap-2 cursor-pointer transition-colors ${
              activeTab === 'schema'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>Schema & AI</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
