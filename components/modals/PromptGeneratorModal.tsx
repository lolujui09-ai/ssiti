'use client';

import { useState, useMemo } from 'react';
import {
  X,
  Sparkles,
  Copy,
  Check,
  ExternalLink,
  Bot,
  FileCode2,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Wand2,
} from 'lucide-react';
import { buildCompleteAIPrompt } from '@/lib/promptGenerator';
import { validateFormSchema } from '@/lib/schemaConverter';
import { FullFormSchema } from '@/types/schema';

interface PromptGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFormGenerated: (newForm: FullFormSchema) => void;
}

export function PromptGeneratorModal({
  isOpen,
  onClose,
  onFormGenerated,
}: PromptGeneratorModalProps) {
  const [activeStep, setActiveStep] = useState<'prompt' | 'paste'>('prompt');

  // User input states
  const [formContext, setFormContext] = useState('Kuis Harian Evaluasi Pemahaman Siswa');
  const [formType, setFormType] = useState<'quiz' | 'survey' | 'registration' | 'general'>('quiz');
  const [rawQuestions, setRawQuestions] = useState(
    `1. Nama Lengkap dan Nomor Induk Siswa
2. Apa fungsi utama organ mitokondria dalam sel tumbuhan dan hewan? (pilihan ganda)
3. Manakah dari organel berikut yang memiliki DNA sendiri? (pilihan ganda)
4. Jelaskan secara singkat proses fotosintesis pada daun! (uraian/paragraf)
5. Berapa tingkat pemahaman Anda terhadap materi sel? (skala 1 sampai 5)`
  );
  const [extraRequirements, setExtraRequirements] = useState(
    'Sertakan kunci jawaban benar dan penjelasan pembahasan untuk setiap soal pilihan ganda, dengan masing-masing soal bernilai 20 poin.'
  );

  // Copy state
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  // Paste JSON state
  const [jsonInput, setJsonInput] = useState('');
  const [pasteValidation, setPasteValidation] = useState<any>(null);

  // Generated master prompt memo
  const masterPrompt = useMemo(() => {
    return buildCompleteAIPrompt({
      formContext,
      formType,
      rawQuestions,
      extraRequirements,
    });
  }, [formContext, formType, rawQuestions, extraRequirements]);

  if (!isOpen) return null;

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(masterPrompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  const handleJsonInputChange = (val: string) => {
    setJsonInput(val);
    if (val.trim()) {
      setPasteValidation(validateFormSchema(val));
    } else {
      setPasteValidation(null);
    }
  };

  const handleGenerateNow = () => {
    if (pasteValidation?.isValid && pasteValidation.parsedSchema) {
      onFormGenerated(pasteValidation.parsedSchema);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/20">
              <Wand2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Lihat &amp; Rancang Prompt AI untuk Schema Form
              </h3>
              <p className="text-xs text-slate-500">
                Tempatkan kumpulan pertanyaan Anda &rarr; Dapatkan prompt untuk ChatGPT / Gemini / Claude &rarr; Generate form otomatis
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Tabs */}
        <div className="px-6 border-b border-slate-200 bg-slate-50/40 flex gap-6 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveStep('prompt')}
            className={`py-3.5 border-b-2 flex items-center gap-2 cursor-pointer transition-colors ${
              activeStep === 'prompt'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-[11px] font-extrabold">
              1
            </span>
            <span>Rancang Prompt dengan Kumpulan Pertanyaan</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveStep('paste')}
            className={`py-3.5 border-b-2 flex items-center gap-2 cursor-pointer transition-colors ${
              activeStep === 'paste'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-[11px] font-extrabold">
              2
            </span>
            <span>Tempel JSON Hasil AI &amp; Generate Form</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {activeStep === 'prompt' ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Form Context & User Questions Inputs */}
              <div className="lg:col-span-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    1. Topik / Konteks Formulir
                  </label>
                  <input
                    type="text"
                    value={formContext}
                    onChange={(e) => setFormContext(e.target.value)}
                    placeholder="Contoh: Kuis Ujian Akhir Kimia SMA, Survei Pasien..."
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    2. Tipe Formulir
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'quiz', label: 'Kuis Berpoin', desc: 'Dengan kunci jawaban' },
                      { id: 'survey', label: 'Kuesioner', desc: 'Survei & evaluasi' },
                      { id: 'registration', label: 'Pendaftaran', desc: 'Form registrasi' },
                    ].map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setFormType(t.id as any)}
                        className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                          formType === t.id
                            ? 'bg-indigo-50/80 border-indigo-500 ring-1 ring-indigo-500 text-indigo-950 font-bold'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 font-medium'
                        }`}
                      >
                        <div className="text-xs">{t.label}</div>
                        <div className="text-[10px] text-slate-500 font-normal mt-0.5">{t.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-slate-800">
                      3. Kumpulan Pertanyaan / Kebutuhan Mentah Pengguna
                    </label>
                    <span className="text-[11px] text-indigo-600 font-medium">Bisa teks bebas / list</span>
                  </div>
                  <textarea
                    rows={6}
                    value={rawQuestions}
                    onChange={(e) => setRawQuestions(e.target.value)}
                    placeholder="Tuliskan daftar pertanyaan yang Anda inginkan di sini..."
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-900 font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white resize-y"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    Anda dapat mengetik pertanyaan mentah atau draft acak. Prompt akan menginstruksikan AI untuk mengubahnya menjadi tipe pertanyaan yang tepat (radio, checkbox, scale, grid, dsb).
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    4. Kebutuhan Khusus Tambahan (Opsional)
                  </label>
                  <input
                    type="text"
                    value={extraRequirements}
                    onChange={(e) => setExtraRequirements(e.target.value)}
                    placeholder="Contoh: Wajibkan semua soal, beri kunci jawaban, buat dalam 2 bagian..."
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  />
                </div>
              </div>

              {/* Right Column: Master Prompt Preview & Copy Action */}
              <div className="lg:col-span-6 flex flex-col space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                    <span>Hasil Master Prompt Siap Salin</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyPrompt}
                    className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                  >
                    {copiedPrompt ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedPrompt ? 'Prompt Disalin!' : 'Salin Prompt Lengkap'}</span>
                  </button>
                </div>

                <div className="flex-1 bg-slate-950 text-indigo-200 rounded-2xl p-4 border border-slate-800 font-mono text-[11px] leading-relaxed overflow-y-auto max-h-[350px] select-all">
                  {masterPrompt}
                </div>

                {/* External AI Quick Launchers */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-xs space-y-2">
                  <div className="text-slate-700 font-bold flex items-center gap-1.5">
                    <Bot className="w-4 h-4 text-indigo-600" />
                    <span>Langkah Selanjutnya: Buka AI Pilihan Anda</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Salin prompt di atas, lalu tempelkan ke salah satu layanan AI berikut:
                  </p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    <a
                      href="https://chatgpt.com"
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 bg-white border border-slate-200 hover:border-slate-300 rounded-xl text-[11px] font-bold text-slate-800 flex items-center gap-1 shadow-2xs hover:bg-slate-50"
                    >
                      <span>ChatGPT</span>
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                    </a>
                    <a
                      href="https://gemini.google.com"
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 bg-white border border-slate-200 hover:border-slate-300 rounded-xl text-[11px] font-bold text-slate-800 flex items-center gap-1 shadow-2xs hover:bg-slate-50"
                    >
                      <span>Google Gemini</span>
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                    </a>
                    <a
                      href="https://claude.ai"
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 bg-white border border-slate-200 hover:border-slate-300 rounded-xl text-[11px] font-bold text-slate-800 flex items-center gap-1 shadow-2xs hover:bg-slate-50"
                    >
                      <span>Claude</span>
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                    </a>
                  </div>
                </div>

                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => setActiveStep('paste')}
                    className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-xs"
                  >
                    <span>Sudah dapat JSON dari AI? Lanjut ke Tempel &amp; Generate</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Step 2: Paste JSON and Direct Generate */
            <div className="space-y-4 max-w-3xl mx-auto">
              <div className="text-center space-y-1">
                <h4 className="text-base font-bold text-slate-900">
                  Tempel Kode JSON dari AI untuk Langsung Menghasilkan Formulir
                </h4>
                <p className="text-xs text-slate-500">
                  Setelah ChatGPT, Gemini, atau Claude memberikan JSON schema, salin dan tempel di bawah ini. Sistem akan memvalidasi dan langsung membuat formulir siap pakai.
                </p>
              </div>

              <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-lg">
                <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <span className="font-mono text-[11px]">Tempel JSON {`{ ... }`}</span>
                  <span className="text-[11px]">
                    {jsonInput.trim() ? `${jsonInput.split('\n').length} baris` : 'Kosong'}
                  </span>
                </div>
                <textarea
                  rows={12}
                  value={jsonInput}
                  onChange={(e) => handleJsonInputChange(e.target.value)}
                  placeholder="Tempel kode JSON di sini... (contoh: { 'id': '...', 'title': '...', 'questions': [...] })"
                  className="w-full bg-slate-950 text-emerald-400 font-mono text-xs p-4 focus:outline-none resize-y selection:bg-indigo-900"
                />
              </div>

              {/* Validation Status */}
              {pasteValidation && (
                <div
                  className={`p-4 rounded-2xl border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    pasteValidation.isValid
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                      : 'bg-rose-50 border-rose-200 text-rose-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {pasteValidation.isValid ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                    )}
                    <div>
                      <div className="font-bold">
                        {pasteValidation.isValid
                          ? 'Schema Valid & Siap Digenerate!'
                          : 'Sintaks JSON Belum Sesuai'}
                      </div>
                      <div className="text-[11px] text-slate-600 mt-0.5">
                        {pasteValidation.isValid
                          ? `Formulir: "${pasteValidation.parsedSchema?.title}" dengan ${
                              pasteValidation.parsedSchema?.questions.length || 0
                            } pertanyaan.`
                          : pasteValidation.errors[0]?.message || 'Pastikan JSON tidak terpotong.'}
                      </div>
                    </div>
                  </div>

                  {pasteValidation.isValid && (
                    <button
                      type="button"
                      onClick={handleGenerateNow}
                      className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-emerald-600/20 shrink-0 transition-transform active:scale-95"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Generate Formulir Sekarang</span>
                    </button>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setActiveStep('prompt')}
                  className="text-xs text-indigo-600 font-bold hover:underline cursor-pointer"
                >
                  &larr; Kembali ke Rancang Prompt
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>AI eksternal digunakan untuk mempercepat perancangan form via copy-paste.</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl font-bold cursor-pointer transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}

