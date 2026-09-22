import { useState } from 'react';
import {
  X,
  Sparkles,
  Copy,
  Check,
  ArrowRight,
  Bot,
  ExternalLink,
  Code,
  FileJson,
  CheckCircle2,
  AlertCircle,
  FileCode2,
} from 'lucide-react';
import { generateAIPrompt, SCHEMA_DOCS_PROMPT, EMPTY_SCHEMA_TEMPLATE } from '../data/templates';
import { validateFormSchema } from '../utils/schemaConverter';

interface PromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyEmptyTemplate?: () => void;
  onApplyJson?: (jsonStr: string) => void;
}

const SAMPLE_IDEAS = [
  'Formulir pendaftaran les privat matematika SMA dengan pilihan jadwal',
  'Survei kepuasan pasien klinik gigi lengkap dengan ulasan dan keluhan',
  'Lamaran pekerjaan UI/UX Designer dengan upload portfolio & resume',
  'Pemesanan katering prasmanan pesta pernikahan & pilihan menu',
  'Pendaftaran lomba cerdas cermat antar sekolah',
  'Formulir laporan bug & kendala aplikasi mobile',
];

export const PromptModal = ({ isOpen, onClose, onApplyJson }: PromptModalProps) => {
  const [activeTab, setActiveTab] = useState<'prompt' | 'import' | 'docs' | 'empty'>('prompt');
  const [userRequirement, setUserRequirement] = useState(
    'Formulir pendaftaran workshop kecerdasan buatan (AI) untuk mahasiswa dan profesional'
  );
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [copiedDocs, setCopiedDocs] = useState(false);
  const [copiedEmpty, setCopiedEmpty] = useState(false);
  const [pasteJsonInput, setPasteJsonInput] = useState('');
  const [pasteValidation, setPasteValidation] = useState<any>(null);

  if (!isOpen) return null;

  const currentGeneratedPrompt = generateAIPrompt(userRequirement);

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(currentGeneratedPrompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  const handleCopyDocs = () => {
    navigator.clipboard.writeText(SCHEMA_DOCS_PROMPT);
    setCopiedDocs(true);
    setTimeout(() => setCopiedDocs(false), 2000);
  };

  const handleCopyEmpty = () => {
    navigator.clipboard.writeText(JSON.stringify(EMPTY_SCHEMA_TEMPLATE, null, 2));
    setCopiedEmpty(true);
    setTimeout(() => setCopiedEmpty(false), 2000);
  };

  const handlePasteChange = (val: string) => {
    setPasteJsonInput(val);
    if (val.trim()) {
      setPasteValidation(validateFormSchema(val));
    } else {
      setPasteValidation(null);
    }
  };

  const handleApplyPastedJson = () => {
    if (pasteValidation?.isValid && onApplyJson) {
      onApplyJson(pasteJsonInput);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Format Schema & Generator Prompt AI
              </h3>
              <p className="text-xs text-slate-500">
                Cara praktis meminta ChatGPT, Gemini, atau Claude membuatkan form untuk Anda
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Workflow Steps Banner */}
        <div className="px-6 py-3 bg-indigo-50/60 border-b border-indigo-100 grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
          <div className="flex items-center gap-1.5 text-indigo-900 font-medium">
            <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
              1
            </span>
            <span>Salin Prompt di sini</span>
          </div>
          <div className="flex items-center gap-1.5 text-indigo-900 font-medium">
            <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
              2
            </span>
            <span>Kirim ke AI eksternal</span>
          </div>
          <div className="flex items-center gap-1.5 text-indigo-900 font-medium">
            <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
              3
            </span>
            <span>Salin JSON hasil AI</span>
          </div>
          <div className="flex items-center gap-1.5 text-indigo-900 font-medium">
            <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
              4
            </span>
            <span>Tempel & Form Jadi!</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 border-b border-slate-200 flex gap-4 text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => setActiveTab('prompt')}
            className={`py-3 border-b-2 transition-colors cursor-pointer shrink-0 ${
              activeTab === 'prompt'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Generator Prompt AI (Langkah 1)
          </button>
          <button
            onClick={() => setActiveTab('import')}
            className={`py-3 border-b-2 transition-colors cursor-pointer shrink-0 flex items-center gap-1.5 ${
              activeTab === 'import'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileCode2 className="w-3.5 h-3.5" />
            <span>Tempel Hasil AI &amp; Terapkan (Langkah 2)</span>
          </button>
          <button
            onClick={() => setActiveTab('docs')}
            className={`py-3 border-b-2 transition-colors cursor-pointer shrink-0 ${
              activeTab === 'docs'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Spesifikasi Schema
          </button>
          <button
            onClick={() => setActiveTab('empty')}
            className={`py-3 border-b-2 transition-colors cursor-pointer shrink-0 ${
              activeTab === 'empty'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Template Kosong
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {activeTab === 'import' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-900">
                  Tempel Kode JSON dari AI Eksternal
                </h4>
                <p className="text-xs text-slate-500">
                  Setelah ChatGPT, Gemini, atau Claude memberikan JSON schema, salin dan tempel di bawah ini untuk langsung memuat seluruh pertanyaan ke formulir.
                </p>
              </div>

              <textarea
                rows={10}
                value={pasteJsonInput}
                onChange={(e) => handlePasteChange(e.target.value)}
                placeholder="Tempel { ... } JSON di sini..."
                className="w-full bg-slate-900 text-emerald-400 font-mono text-xs p-4 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />

              {/* Status Validation */}
              {pasteValidation && (
                <div
                  className={`p-3 rounded-xl border text-xs flex items-center justify-between ${
                    pasteValidation.isValid
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800 font-semibold'
                      : 'bg-rose-50 border-rose-200 text-rose-800'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {pasteValidation.isValid ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    )}
                    <span>
                      {pasteValidation.isValid
                        ? `Valid! Terdeteksi ${pasteValidation.parsedSchema?.questions.length || 0} pertanyaan.`
                        : pasteValidation.errors[0]?.message || 'Sintaks JSON tidak valid.'}
                    </span>
                  </div>

                  {pasteValidation.isValid && (
                    <button
                      type="button"
                      onClick={handleApplyPastedJson}
                      className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold cursor-pointer transition-colors shadow-2xs"
                    >
                      Terapkan ke Formulir
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
          {activeTab === 'prompt' && (
            <div className="space-y-4">
              {/* Requirement Input */}
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  1. Kebutuhan Form Anda:
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={userRequirement}
                    onChange={(e) => setUserRequirement(e.target.value)}
                    placeholder="Contoh: Formulir lamaran kerja posisi Barista & Kasir..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600 transition-all"
                  />
                </div>
              </div>

              {/* Sample Idea Chips */}
              <div>
                <p className="text-[11px] font-medium text-slate-400 mb-1.5">
                  Atau klik contoh ide kebutuhan cepat:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {SAMPLE_IDEAS.map((idea, idx) => (
                    <button
                      key={idx}
                      onClick={() => setUserRequirement(idea)}
                      className="px-2.5 py-1 rounded-lg text-xs bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-600 border border-slate-200/80 transition-colors cursor-pointer"
                    >
                      {idea}
                    </button>
                  ))}
                </div>
              </div>

              {/* Ready-to-copy Prompt Preview */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    2. Prompt Siap Salin untuk ChatGPT / Claude / Gemini:
                  </label>
                  <button
                    onClick={handleCopyPrompt}
                    className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-2xs transition-colors cursor-pointer"
                  >
                    {copiedPrompt ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Berhasil Disalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Salin Prompt Lengkap</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="relative rounded-xl bg-slate-900 p-4 text-xs font-mono text-slate-200 max-h-56 overflow-y-auto border border-slate-800 leading-relaxed whitespace-pre-wrap selection:bg-indigo-800">
                  {currentGeneratedPrompt}
                </div>
              </div>

              {/* Direct links to AI tools */}
              <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                <span>Buka AI favorit Anda di tab baru:</span>
                <div className="flex items-center gap-2">
                  <a
                    href="https://chatgpt.com"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                  >
                    <span>ChatGPT</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </a>
                  <a
                    href="https://gemini.google.com"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                  >
                    <span>Gemini</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </a>
                  <a
                    href="https://claude.ai"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                  >
                    <span>Claude</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </a>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'docs' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-600">
                  Aturan format JSON yang didukung oleh validator sistem:
                </p>
                <button
                  onClick={handleCopyDocs}
                  className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 cursor-pointer"
                >
                  {copiedDocs ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedDocs ? 'Disalin' : 'Salin Aturan'}</span>
                </button>
              </div>

              <div className="rounded-xl bg-slate-900 p-4 text-xs font-mono text-slate-200 max-h-80 overflow-y-auto border border-slate-800 leading-relaxed whitespace-pre-wrap">
                {SCHEMA_DOCS_PROMPT}
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
                <p className="font-semibold text-slate-800">Tipe field yang didukung penuh:</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {['text', 'email', 'number', 'date', 'textarea', 'select', 'radio', 'checkbox', 'file', 'tel', 'url'].map((t) => (
                    <span key={t} className="px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700 font-mono text-[11px]">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'empty' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-600">
                  Struktur JSON minimal jika Anda ingin mengisi secara manual:
                </p>
                <button
                  onClick={handleCopyEmpty}
                  className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 cursor-pointer"
                >
                  {copiedEmpty ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedEmpty ? 'Disalin' : 'Salin Template'}</span>
                </button>
              </div>

              <div className="rounded-xl bg-slate-900 p-4 text-xs font-mono text-emerald-400 max-h-80 overflow-y-auto border border-slate-800 leading-relaxed whitespace-pre-wrap">
                {JSON.stringify(EMPTY_SCHEMA_TEMPLATE, null, 2)}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 bg-slate-50/70 flex items-center justify-between">
          <p className="text-xs text-slate-500">
            Setelah AI menghasilkan JSON, klik <strong>Paste dari AI</strong> di editor.
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold cursor-pointer transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
