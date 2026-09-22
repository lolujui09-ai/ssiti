import { Sparkles, Code2, Eye, LayoutTemplate, RotateCcw, Download, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { PRESET_TEMPLATES } from '../data/templates';
import { FormSchema } from '../types/schema';

interface NavbarProps {
  onOpenPromptModal: () => void;
  onSelectTemplate: (schema: FormSchema) => void;
  onReset: () => void;
  onOpenExport: () => void;
  viewMode: 'split' | 'editor' | 'preview';
  onChangeViewMode: (mode: 'split' | 'editor' | 'preview') => void;
  isValid: boolean;
  fieldCount: number;
}

export const Navbar = ({
  onOpenPromptModal,
  onSelectTemplate,
  onReset,
  onOpenExport,
  viewMode,
  onChangeViewMode,
  isValid,
  fieldCount,
}: NavbarProps) => {
  const [showTemplatesDropdown, setShowTemplatesDropdown] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand & Badge */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-sm shadow-indigo-200">
            <Code2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                Schema Form Generator
              </h1>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                AI Prompt-Ready
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden md:block">
              Paste JSON schema dari ChatGPT / Claude / Gemini → Validasi otomatis → Form siap pakai
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick AI Prompt Trigger (Primary Highlight) */}
          <button
            id="btn-prompt-ai"
            onClick={onOpenPromptModal}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs sm:text-sm font-semibold shadow-xs shadow-indigo-300 transition-colors cursor-pointer"
            title="Buka panduan & template prompt untuk ChatGPT, Gemini, atau Claude"
          >
            <Sparkles className="w-4 h-4 text-indigo-200" />
            <span className="hidden sm:inline">Format & Prompt AI</span>
            <span className="sm:hidden">Prompt AI</span>
          </button>

          {/* Preset Templates Dropdown */}
          <div className="relative">
            <button
              id="btn-templates-menu"
              onClick={() => setShowTemplatesDropdown(!showTemplatesDropdown)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-medium transition-colors cursor-pointer"
            >
              <LayoutTemplate className="w-4 h-4 text-slate-500" />
              <span className="hidden md:inline">Contoh Template</span>
            </button>

            {showTemplatesDropdown && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowTemplatesDropdown(false)}
                />
                <div className="absolute right-0 mt-2 w-72 rounded-xl bg-white border border-slate-200 shadow-xl p-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-3 py-2 border-b border-slate-100">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Pilih Schema Contoh
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Muat contoh instan untuk melihat preview form
                    </p>
                  </div>
                  <div className="mt-1 space-y-1">
                    {PRESET_TEMPLATES.map((tmpl) => (
                      <button
                        key={tmpl.id}
                        onClick={() => {
                          onSelectTemplate(tmpl.schema);
                          setShowTemplatesDropdown(false);
                        }}
                        className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-slate-50 hover:text-indigo-600 transition-colors flex flex-col gap-0.5 group cursor-pointer"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs sm:text-sm font-medium text-slate-800 group-hover:text-indigo-600">
                            {tmpl.name}
                          </span>
                          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 group-hover:bg-indigo-50 group-hover:text-indigo-600">
                            {tmpl.badge}
                          </span>
                        </div>
                        <span className="text-xs text-slate-500 line-clamp-1">
                          {tmpl.description}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Export Button */}
          <button
            id="btn-export-form"
            onClick={onOpenExport}
            disabled={!isValid}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm font-medium transition-colors cursor-pointer"
            title="Export schema ke HTML, React component, atau JSON"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span className="hidden lg:inline">Export</span>
          </button>

          {/* Desktop View Mode Segmented Controls */}
          <div className="hidden lg:flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            <button
              onClick={() => onChangeViewMode('editor')}
              className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
                viewMode === 'editor'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Tampilkan hanya Editor Schema"
            >
              Editor Saja
            </button>
            <button
              onClick={() => onChangeViewMode('split')}
              className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
                viewMode === 'split'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Tampilkan Split Screen (Editor & Preview)"
            >
              Split View
            </button>
            <button
              onClick={() => onChangeViewMode('preview')}
              className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
                viewMode === 'preview'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Tampilkan hanya Form Preview"
            >
              Preview Saja
            </button>
          </div>

          {/* Reset button */}
          <button
            id="btn-reset-schema"
            onClick={onReset}
            className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
            title="Kosongkan schema"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
