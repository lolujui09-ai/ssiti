import { useState } from 'react';
import { X, Sparkles, Copy, Check, ArrowRight, BookOpen, AlertCircle } from 'lucide-react';
import { validateFormSchema } from '../../utils/schemaConverter';
import { FullFormSchema } from '../../types/schema';

interface PromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplySchema: (newForm: FullFormSchema) => void;
}

const PROMPT_TEMPLATES = [
  {
    id: 'quiz',
    title: 'Kuis Online & Ujian Otomatis Berbobot Poin',
    description: 'Format kuis dengan kunci jawaban, pembahasan, dan skor poin otomatis.',
    promptText: `Tolong buatkan schema JSON Google Forms lengkap untuk QuickForm dengan kriteria berikut:
1. Topik: [Tulis topik kuis Anda di sini, misal: Pemrograman Web Modern 2026]
2. Jumlah soal: 5 soal (campuran pilihan ganda, kotak centang, dan jawaban singkat)
3. Mode kuis aktif ("settings.isQuiz": true)
4. Setiap soal memiliki:
   - "quiz": { "points": 20, "correctAnswers": ["jawaban_benar"], "explanation": "penjelasan mengapa jawaban ini tepat" }
5. Kembalikan HANYA JSON valid tanpa teks pengantar atau markdown tambahan. Format root:
{
  "title": "Judul Kuis",
  "description": "Deskripsi kuis",
  "settings": { "isQuiz": true, "releaseGradeImmediately": true, "showCorrectAnswers": true, "collectEmail": true },
  "sections": [{ "id": "sec_1", "title": "Bagian 1", "questionIds": ["q_1", "q_2"] }],
  "questions": [
    {
      "id": "q_1",
      "type": "radio",
      "title": "Pertanyaan...",
      "required": true,
      "options": [{ "id": "o1", "label": "Opsi A", "value": "a" }],
      "quiz": { "points": 20, "correctAnswers": ["a"], "explanation": "Penjelasan..." }
    }
  ]
}`,
  },
  {
    id: 'branching',
    title: 'Formulir Multi-Bagian dengan Percabangan (Conditional Logic)',
    description: 'Beralih ke halaman/bagian berbeda berdasarkan pilihan jawaban responden.',
    promptText: `Buatkan schema JSON Google Forms untuk QuickForm dengan percabangan logika (Conditional Logic):
1. Bagian 1: Identitas & Pilihan Kategori (misal: "Apakah Anda Mahasiswa atau Karyawan?")
2. Jika memilih Mahasiswa: arahkan ke Bagian 2 (Data Kampus)
3. Jika memilih Karyawan: arahkan ke Bagian 3 (Data Pekerjaan)
4. Gunakan field "logicRules":
   "logicRules": [
     { "optionValue": "mahasiswa", "action": "go_to_section", "targetSectionId": "sec_kampus" },
     { "optionValue": "karyawan", "action": "go_to_section", "targetSectionId": "sec_kantor" }
   ]
5. Format return: HANYA kode JSON valid.`,
  },
  {
    id: 'survey_grid',
    title: 'Survei Kepuasan dengan Skala Linier & Kisi Matrix',
    description: 'Kuesioner evaluasi memakai Linear Scale 1-5, Multiple Choice Grid, dan Checkbox Grid.',
    promptText: `Buatkan schema JSON formulir survei evaluasi kepuasan untuk QuickForm dengan tipe pertanyaan:
1. Skala Linier ("type": "scale", "scaleMin": 1, "scaleMax": 5, "scaleMinLabel": "Buruk", "scaleMaxLabel": "Sangat Baik")
2. Kisi Pilihan Ganda ("type": "grid_radio", "rows": [{"id": "r1", "label": "Aspek Pelayanan"}], "columns": [{"id": "c1", "label": "Cukup"}, {"id": "c2", "label": "Baik"}])
3. Kisi Kotak Centang ("type": "grid_checkbox", "rows": [...], "columns": [...])
4. Kembalikan HANYA JSON murni tanpa pembungkus narasi.`,
  },
];

export const PromptModal = ({
  isOpen,
  onClose,
  onApplySchema,
}: PromptModalProps) => {
  const [selectedTemplate, setSelectedTemplate] = useState(PROMPT_TEMPLATES[0]);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [pasteJson, setPasteJson] = useState('');
  const [pasteError, setPasteError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(selectedTemplate.promptText);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  const handleApplyPasted = () => {
    setPasteError(null);
    if (!pasteJson.trim()) {
      setPasteError('Silakan tempelkan schema JSON hasil AI terlebih dahulu.');
      return;
    }

    const validation = validateFormSchema(pasteJson);
    if (!validation.isValid || !validation.parsedSchema) {
      setPasteError(validation.errors[0]?.message || 'Format JSON schema tidak valid.');
      return;
    }

    onApplySchema(validation.parsedSchema);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl p-6 relative max-h-[90vh] flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Pembuat Form Berbantu AI Eksternal</h3>
            <p className="text-xs text-slate-500">
              Salin prompt, berikan ke ChatGPT, Gemini, atau Claude, lalu tempel hasilnya kembali ke sini.
            </p>
          </div>
        </div>

        {/* Template Selector Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-3">
          {PROMPT_TEMPLATES.map((tmpl) => (
            <button
              key={tmpl.id}
              type="button"
              onClick={() => setSelectedTemplate(tmpl)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                selectedTemplate.id === tmpl.id
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {tmpl.title.split(' ')[0]} {tmpl.title.split(' ')[1]}
            </button>
          ))}
        </div>

        <div className="overflow-y-auto flex-1 space-y-4 pr-1 text-xs">
          {/* Step 1: Copy Prompt */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-slate-800 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px]">
                  1
                </span>
                <span>Salin Prompt untuk AI (ChatGPT / Claude / Gemini)</span>
              </span>
              <button
                type="button"
                onClick={handleCopyPrompt}
                className="flex items-center gap-1 px-3 py-1 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg text-slate-700 font-bold text-xs cursor-pointer shadow-2xs"
              >
                {copiedPrompt ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedPrompt ? 'Prompt Tersalin!' : 'Salin Prompt'}</span>
              </button>
            </div>
            <pre className="p-3 bg-white rounded-lg border border-slate-200 font-mono text-[11px] text-slate-700 whitespace-pre-wrap max-h-36 overflow-y-auto select-all">
              {selectedTemplate.promptText}
            </pre>
          </div>

          {/* Step 2: Paste Schema Result */}
          <div className="p-4 bg-indigo-50/40 rounded-xl border border-indigo-100">
            <span className="font-bold text-slate-800 flex items-center gap-1.5 mb-2">
              <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px]">
                2
              </span>
              <span>Tempel Hasil JSON dari AI di Sini:</span>
            </span>
            <textarea
              rows={5}
              value={pasteJson}
              onChange={(e) => {
                setPasteJson(e.target.value);
                setPasteError(null);
              }}
              placeholder='Tempelkan JSON yang dihasilkan AI (contoh: { "title": "...", "questions": [...] })'
              className="w-full p-3 bg-white rounded-lg border border-slate-200 font-mono text-[11px] text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
            {pasteError && (
              <p className="text-xs text-rose-600 font-medium flex items-center gap-1 mt-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{pasteError}</span>
              </p>
            )}
          </div>
        </div>

        {/* Footer actions */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl cursor-pointer"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleApplyPasted}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
          >
            <span>Terapkan ke Form Builder</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
