import { useState } from 'react';
import {
  Copy,
  Trash2,
  MoreVertical,
  Plus,
  X,
  CheckCircle,
  HelpCircle,
  Award,
  ChevronDown,
  AlignLeft,
  CircleDot,
  CheckSquare,
  ListFilter,
  Sliders,
  Grid,
  Calendar,
  Clock,
  UploadCloud,
  Type,
} from 'lucide-react';
import { FormQuestion, QuestionType, FormSection, OptionItem } from '../../types/schema';

interface QuestionCardProps {
  question: FormQuestion;
  isActive: boolean;
  onSelect: () => void;
  onUpdate: (updated: FormQuestion) => void;
  onDuplicate: () => void;
  onDelete: () => void;
  isQuizMode: boolean;
  sections: FormSection[];
  themeColor: string;
}

const QUESTION_TYPES: { type: QuestionType; label: string; icon: any }[] = [
  { type: 'text', label: 'Jawaban Singkat', icon: Type },
  { type: 'textarea', label: 'Paragraf', icon: AlignLeft },
  { type: 'radio', label: 'Pilihan Ganda', icon: CircleDot },
  { type: 'checkbox', label: 'Kotak Centang', icon: CheckSquare },
  { type: 'select', label: 'Dropdown', icon: ListFilter },
  { type: 'scale', label: 'Skala Linier', icon: Sliders },
  { type: 'grid_radio', label: 'Kisi Pilihan Ganda', icon: Grid },
  { type: 'grid_checkbox', label: 'Kisi Kotak Centang', icon: Grid },
  { type: 'file', label: 'Upload File', icon: UploadCloud },
  { type: 'date', label: 'Tanggal', icon: Calendar },
  { type: 'time', label: 'Waktu', icon: Clock },
];

export const QuestionCard = ({
  question,
  isActive,
  onSelect,
  onUpdate,
  onDuplicate,
  onDelete,
  isQuizMode,
  sections,
  themeColor,
}: QuestionCardProps) => {
  const [isAnswerKeyMode, setIsAnswerKeyMode] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showDescription, setShowDescription] = useState(Boolean(question.description));

  // Option handlers
  const handleAddOption = () => {
    const currentOptions = question.options || [];
    const newIdx = currentOptions.length + 1;
    const newOption: OptionItem = {
      id: `opt-${Date.now()}`,
      label: `Opsi ${newIdx}`,
      value: `opt-${Date.now()}`,
    };
    onUpdate({
      ...question,
      options: [...currentOptions, newOption],
    });
  };

  const handleUpdateOption = (optId: string, label: string) => {
    const updated = (question.options || []).map((o) =>
      o.id === optId ? { ...o, label, value: o.value || optId } : o
    );
    onUpdate({ ...question, options: updated });
  };

  const handleDeleteOption = (optId: string) => {
    const updated = (question.options || []).filter((o) => o.id !== optId);
    onUpdate({ ...question, options: updated });
  };

  const handleToggleCorrectAnswer = (val: string) => {
    const currentQuiz = question.quiz || { points: 10, correctAnswers: [] };
    const currentCorrect = currentQuiz.correctAnswers || [];
    let updatedCorrect: string[];

    if (question.type === 'checkbox') {
      // Multiple answers allowed
      if (currentCorrect.includes(val)) {
        updatedCorrect = currentCorrect.filter((v) => v !== val);
      } else {
        updatedCorrect = [...currentCorrect, val];
      }
    } else {
      // Single answer (radio, select, text)
      updatedCorrect = [val];
    }

    onUpdate({
      ...question,
      quiz: {
        ...currentQuiz,
        correctAnswers: updatedCorrect,
      },
    });
  };

  // -------------------------------------------------------------
  // INACTIVE CARD RENDER (When not currently being edited)
  // -------------------------------------------------------------
  if (!isActive) {
    return (
      <div
        onClick={onSelect}
        className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 hover:shadow-xs hover:border-slate-300 transition-all cursor-pointer group relative"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1.5 flex-1">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <span>{question.title || 'Pertanyaan Tanpa Judul'}</span>
              {question.required && <span className="text-rose-500 font-bold">*</span>}
            </h4>

            {question.description && (
              <p className="text-xs text-slate-500">{question.description}</p>
            )}

            {/* Answer Preview for Inactive Mode */}
            <div className="pt-2 text-xs text-slate-400">
              {(question.type === 'text' || question.type === 'textarea') && (
                <div className="w-full max-w-sm border-b border-dashed border-slate-300 py-1 text-slate-400 italic">
                  {question.type === 'text' ? 'Teks jawaban singkat' : 'Teks jawaban panjang'}
                </div>
              )}

              {(question.type === 'radio' || question.type === 'checkbox' || question.type === 'select') && (
                <div className="space-y-1.5">
                  {(question.options || []).slice(0, 4).map((opt) => (
                    <div key={opt.id} className="flex items-center gap-2 text-slate-600">
                      {question.type === 'radio' ? (
                        <div className="w-3.5 h-3.5 rounded-full border border-slate-400" />
                      ) : question.type === 'checkbox' ? (
                        <div className="w-3.5 h-3.5 rounded border border-slate-400" />
                      ) : (
                        <span className="text-slate-400">•</span>
                      )}
                      <span>{opt.label}</span>
                    </div>
                  ))}
                  {(question.options || []).length > 4 && (
                    <span className="text-slate-400 text-[11px]">
                      + {(question.options || []).length - 4} opsi lainnya...
                    </span>
                  )}
                </div>
              )}

              {question.type === 'scale' && (
                <div className="flex items-center gap-2 py-1">
                  <span className="text-[11px]">{question.scaleMinLabel || '1'}</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <div
                        key={n}
                        className="w-6 h-6 rounded-full border border-slate-300 flex items-center justify-center text-[10px]"
                      >
                        {n}
                      </div>
                    ))}
                  </div>
                  <span className="text-[11px]">{question.scaleMaxLabel || '5'}</span>
                </div>
              )}

              {(question.type === 'grid_radio' || question.type === 'grid_checkbox') && (
                <div className="text-slate-400 italic">Matriks Kisi ({question.rows?.length || 2} baris × {question.columns?.length || 3} kolom)</div>
              )}

              {question.type === 'file' && (
                <div className="flex items-center gap-1.5 text-slate-500 py-1">
                  <UploadCloud className="w-4 h-4" />
                  <span>Area unggah berkas (Maks. 10 MB)</span>
                </div>
              )}

              {question.type === 'date' && <div className="text-slate-400">Pilihan Tanggal (HH/BB/TTTT)</div>}
              {question.type === 'time' && <div className="text-slate-400">Pilihan Waktu (JJ:MM)</div>}
            </div>
          </div>

          {/* Right badge: Points if Quiz */}
          {isQuizMode && question.quiz && (
            <div className="flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-800 rounded-lg text-xs font-bold shrink-0 border border-amber-200">
              <Award className="w-3.5 h-3.5 text-amber-600" />
              <span>{question.quiz.points} poin</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // ACTIVE CARD RENDER (Full Google Forms Style Editor)
  // -------------------------------------------------------------
  return (
    <div
      style={{ borderLeftColor: themeColor }}
      className="bg-white rounded-2xl border-l-[6px] border border-slate-300/80 shadow-md p-6 space-y-5 transition-all relative"
    >
      {/* If in Quiz Answer Key Mode */}
      {isAnswerKeyMode ? (
        <div className="space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-600" />
              <h4 className="font-bold text-slate-900 text-sm">
                Kunci Jawaban &amp; Bobot Poin
              </h4>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold text-slate-600">Nilai Soal:</label>
              <input
                type="number"
                min="0"
                max="100"
                value={question.quiz?.points ?? 10}
                onChange={(e) =>
                  onUpdate({
                    ...question,
                    quiz: {
                      ...(question.quiz || { correctAnswers: [] }),
                      points: Math.max(0, parseInt(e.target.value) || 0),
                    },
                  })
                }
                className="w-16 px-2 py-1 text-center font-bold text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <span className="text-xs font-bold text-slate-600">poin</span>
            </div>
          </div>

          <p className="text-xs text-slate-500">
            Klik pada pilihan jawaban di bawah ini untuk menandainya sebagai kunci jawaban yang benar (ditandai dengan centang hijau).
          </p>

          {/* Options Answer Key Selector */}
          <div className="space-y-2">
            {(question.options || []).map((opt, optIdx) => {
              const isCorrect = (question.quiz?.correctAnswers || []).includes(opt.id) ||
                (question.quiz?.correctAnswers || []).includes(opt.value);
              return (
                <div
                  key={`${opt.id || 'opt'}-${optIdx}`}
                  onClick={() => handleToggleCorrectAnswer(opt.id)}
                  className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                    isCorrect
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold shadow-2xs'
                      : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {question.type === 'checkbox' ? (
                      <CheckSquare className={`w-4 h-4 ${isCorrect ? 'text-emerald-600' : 'text-slate-400'}`} />
                    ) : (
                      <CircleDot className={`w-4 h-4 ${isCorrect ? 'text-emerald-600' : 'text-slate-400'}`} />
                    )}
                    <span className="text-xs">{opt.label}</span>
                  </div>

                  {isCorrect && (
                    <span className="flex items-center gap-1 text-xs text-emerald-700 font-bold">
                      <CheckCircle className="w-4 h-4" />
                      <span>Jawaban Benar</span>
                    </span>
                  )}
                </div>
              );
            })}

            {/* If Short Answer Text Key */}
            {question.type === 'text' && (
              <div className="space-y-2 pt-2">
                <label className="text-xs font-semibold text-slate-700 block">
                  Kunci Jawaban Tepat (Teks eksak):
                </label>
                <input
                  type="text"
                  placeholder="Ketik teks jawaban yang benar..."
                  value={question.quiz?.correctAnswers?.[0] || ''}
                  onChange={(e) =>
                    onUpdate({
                      ...question,
                      quiz: {
                        ...(question.quiz || { points: 10 }),
                        correctAnswers: [e.target.value],
                      },
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            )}
          </div>

          {/* Explanation / Feedback Field */}
          <div className="pt-2">
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Tambahkan Umpan Balik / Penjelasan Jawaban:
            </label>
            <textarea
              rows={2}
              placeholder="Berikan penjelasan mengapa jawaban ini benar untuk memandu peserta..."
              value={question.quiz?.explanation || ''}
              onChange={(e) =>
                onUpdate({
                  ...question,
                  quiz: {
                    ...(question.quiz || { points: 10, correctAnswers: [] }),
                    explanation: e.target.value,
                  },
                })
              }
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none"
            />
          </div>

          <div className="pt-3 border-t border-slate-200 flex justify-end">
            <button
              type="button"
              onClick={() => setIsAnswerKeyMode(false)}
              className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl cursor-pointer shadow-xs transition-colors"
            >
              Selesai Menata Kunci Jawaban
            </button>
          </div>
        </div>
      ) : (
        /* NORMAL EDITING MODE */
        <div className="space-y-5">
          {/* Top Row: Question Title Input + Type Selector */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="flex-1 w-full">
              <input
                type="text"
                value={question.title}
                onChange={(e) => onUpdate({ ...question, title: e.target.value })}
                placeholder="Judul pertanyaan..."
                className="w-full text-sm font-bold text-slate-900 bg-slate-50/70 hover:bg-slate-100/70 focus:bg-white border-b-2 border-slate-200 focus:border-indigo-600 focus:outline-none px-3 py-2.5 rounded-t-lg transition-colors"
              />
            </div>

            {/* Type Selector Dropdown */}
            <div className="relative w-full sm:w-56 shrink-0">
              <select
                value={question.type}
                onChange={(e) => {
                  const newType = e.target.value as QuestionType;
                  let newOptions = question.options;
                  if (
                    (newType === 'radio' || newType === 'checkbox' || newType === 'select') &&
                    (!newOptions || newOptions.length === 0)
                  ) {
                    newOptions = [
                      { id: 'opt-1', label: 'Opsi 1', value: 'opt-1' },
                      { id: 'opt-2', label: 'Opsi 2', value: 'opt-2' },
                    ];
                  }
                  onUpdate({ ...question, type: newType, options: newOptions });
                }}
                className="w-full appearance-none bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-8 cursor-pointer shadow-2xs"
              >
                {QUESTION_TYPES.map((t) => (
                  <option key={t.type} value={t.type}>
                    {t.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3 top-2.5 pointer-events-none" />
            </div>
          </div>

          {/* Description input if active */}
          {showDescription && (
            <div>
              <input
                type="text"
                value={question.description || ''}
                onChange={(e) => onUpdate({ ...question, description: e.target.value })}
                placeholder="Deskripsi atau petunjuk tambahan..."
                className="w-full text-xs text-slate-600 border-b border-slate-200 focus:border-indigo-500 focus:outline-none px-2 py-1"
              />
            </div>
          )}

          {/* TYPE-SPECIFIC BODY EDITORS */}
          <div className="space-y-2.5">
            {/* 1. Radio / Checkbox / Dropdown Options */}
            {(question.type === 'radio' || question.type === 'checkbox' || question.type === 'select') && (
              <div className="space-y-2">
                {(question.options || []).map((opt, idx) => (
                  <div key={opt.id} className="flex items-center gap-2 group/opt">
                    {question.type === 'radio' ? (
                      <CircleDot className="w-4 h-4 text-slate-400 shrink-0" />
                    ) : question.type === 'checkbox' ? (
                      <CheckSquare className="w-4 h-4 text-slate-400 shrink-0" />
                    ) : (
                      <span className="w-4 text-xs font-mono text-slate-400 text-center">{idx + 1}.</span>
                    )}

                    <input
                      type="text"
                      value={opt.label}
                      onChange={(e) => handleUpdateOption(opt.id, e.target.value)}
                      placeholder={`Opsi ${idx + 1}`}
                      className="flex-1 text-xs text-slate-800 border-b border-transparent hover:border-slate-300 focus:border-indigo-600 focus:outline-none px-1 py-1"
                    />

                    {/* Section Branching selector if multiple sections */}
                    {sections.length > 1 && question.type === 'radio' && (
                      <select
                        value={opt.goToSectionId || 'next'}
                        onChange={(e) => {
                          const updated = (question.options || []).map((o) =>
                            o.id === opt.id ? { ...o, goToSectionId: e.target.value } : o
                          );
                          onUpdate({ ...question, options: updated });
                        }}
                        className="text-[11px] bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-slate-600 focus:outline-none"
                      >
                        <option value="next">Lanjut ke bagian berikutnya</option>
                        {sections.map((s, sIdx) => (
                          <option key={s.id} value={s.id}>
                            Buka Bagian {sIdx + 1}: {s.title}
                          </option>
                        ))}
                        <option value="submit">Kirim formulir</option>
                      </select>
                    )}

                    {(question.options || []).length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleDeleteOption(opt.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded-md cursor-pointer opacity-70 group-hover/opt:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}

                {/* Add Option Button */}
                <div className="flex items-center gap-2 pt-1 text-xs">
                  <button
                    type="button"
                    onClick={handleAddOption}
                    className="flex items-center gap-1.5 text-indigo-600 hover:text-indigo-800 font-semibold px-2 py-1 rounded-lg hover:bg-indigo-50 cursor-pointer transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambahkan opsi</span>
                  </button>
                </div>
              </div>
            )}

            {/* 2. Text / Textarea Preview */}
            {question.type === 'text' && (
              <div className="border-b border-dashed border-slate-300 py-2 text-slate-400 text-xs italic">
                Teks jawaban singkat (Responden akan mengetik satu baris kalimat)
              </div>
            )}

            {question.type === 'textarea' && (
              <div className="border-b border-dashed border-slate-300 py-3 text-slate-400 text-xs italic">
                Teks jawaban panjang (Responden dapat mengetik beberapa paragraf penjelasan)
              </div>
            )}

            {/* 3. Linear Scale Configuration */}
            {question.type === 'scale' && (
              <div className="p-4 bg-slate-50 rounded-xl space-y-3 text-xs">
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-slate-700">Rentang Skala:</span>
                  <select
                    value={question.scaleMin ?? 1}
                    onChange={(e) => onUpdate({ ...question, scaleMin: parseInt(e.target.value) })}
                    className="bg-white border border-slate-300 rounded-lg px-2 py-1"
                  >
                    <option value={0}>0</option>
                    <option value={1}>1</option>
                  </select>
                  <span>sampai</span>
                  <select
                    value={question.scaleMax ?? 5}
                    onChange={(e) => onUpdate({ ...question, scaleMax: parseInt(e.target.value) })}
                    className="bg-white border border-slate-300 rounded-lg px-2 py-1"
                  >
                    <option value={3}>3</option>
                    <option value={5}>5</option>
                    <option value={7}>7</option>
                    <option value={10}>10</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="text-slate-500 block mb-1">Label Nilai Minimum ({question.scaleMin ?? 1}):</label>
                    <input
                      type="text"
                      placeholder="Contoh: Sangat Tidak Puas"
                      value={question.scaleMinLabel || ''}
                      onChange={(e) => onUpdate({ ...question, scaleMinLabel: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-slate-500 block mb-1">Label Nilai Maksimum ({question.scaleMax ?? 5}):</label>
                    <input
                      type="text"
                      placeholder="Contoh: Sangat Puas"
                      value={question.scaleMaxLabel || ''}
                      onChange={(e) => onUpdate({ ...question, scaleMaxLabel: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 4. Grid (Matrix) Configuration */}
            {(question.type === 'grid_radio' || question.type === 'grid_checkbox') && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-xl text-xs">
                {/* Rows */}
                <div className="space-y-2">
                  <span className="font-bold text-slate-800 block">Baris (Pernyataan):</span>
                  {(question.rows || [{ id: 'r1', label: 'Baris 1' }]).map((row, rIdx) => (
                    <div key={`${row.id || 'r'}-${rIdx}`} className="flex items-center gap-1.5">
                      <span className="text-slate-400 font-mono w-4">{rIdx + 1}.</span>
                      <input
                        type="text"
                        value={row.label}
                        onChange={(e) => {
                          const updated = (question.rows || []).map((r) =>
                            r.id === row.id ? { ...r, label: e.target.value } : r
                          );
                          onUpdate({ ...question, rows: updated });
                        }}
                        className="flex-1 bg-white border border-slate-300 rounded-lg px-2 py-1"
                      />
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      const currentRows = question.rows || [];
                      onUpdate({
                        ...question,
                        rows: [...currentRows, { id: `r-${Date.now()}`, label: `Baris ${currentRows.length + 1}` }],
                      });
                    }}
                    className="text-indigo-600 font-semibold hover:underline flex items-center gap-1 mt-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Tambah Baris</span>
                  </button>
                </div>

                {/* Columns */}
                <div className="space-y-2">
                  <span className="font-bold text-slate-800 block">Kolom (Pilihan Nilai):</span>
                  {(question.columns || [{ id: 'c1', label: 'Kolom 1' }]).map((col, cIdx) => (
                    <div key={`${col.id || 'c'}-${cIdx}`} className="flex items-center gap-1.5">
                      <span className="text-slate-400 font-mono w-4">{cIdx + 1}.</span>
                      <input
                        type="text"
                        value={col.label}
                        onChange={(e) => {
                          const updated = (question.columns || []).map((c) =>
                            c.id === col.id ? { ...c, label: e.target.value } : c
                          );
                          onUpdate({ ...question, columns: updated });
                        }}
                        className="flex-1 bg-white border border-slate-300 rounded-lg px-2 py-1"
                      />
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      const currentCols = question.columns || [];
                      onUpdate({
                        ...question,
                        columns: [...currentCols, { id: `c-${Date.now()}`, label: `Kolom ${currentCols.length + 1}` }],
                      });
                    }}
                    className="text-indigo-600 font-semibold hover:underline flex items-center gap-1 mt-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Tambah Kolom</span>
                  </button>
                </div>
              </div>
            )}

            {/* 5. File Upload Settings */}
            {question.type === 'file' && (
              <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-700 font-medium">Batas ukuran berkas maksimal:</span>
                  <select
                    value={question.validation?.maxFileSizeMB || 10}
                    onChange={(e) =>
                      onUpdate({
                        ...question,
                        validation: {
                          ...(question.validation || {}),
                          maxFileSizeMB: parseInt(e.target.value),
                        },
                      })
                    }
                    className="bg-white border border-slate-300 rounded-lg px-2 py-1"
                  >
                    <option value={1}>1 MB</option>
                    <option value={5}>5 MB</option>
                    <option value={10}>10 MB</option>
                    <option value={50}>50 MB</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* BOTTOM ACTION TOOLBAR */}
          <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
            {/* Left: Quiz Answer Key Button */}
            {isQuizMode ? (
              <button
                type="button"
                onClick={() => setIsAnswerKeyMode(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-xl font-bold cursor-pointer transition-colors"
              >
                <Award className="w-4 h-4 text-amber-600" />
                <span>Kunci Jawaban ({question.quiz?.points ?? 10} poin)</span>
              </button>
            ) : (
              <div />
            )}

            {/* Right: Actions (Duplicate, Delete, Required Switch, More) */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onDuplicate}
                className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors"
                title="Duplikatkan pertanyaan"
              >
                <Copy className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={onDelete}
                className="p-1.5 text-slate-500 hover:text-rose-600 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors"
                title="Hapus pertanyaan"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <div className="h-5 w-[1px] bg-slate-200" />

              {/* Required Switch */}
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <span className="text-slate-700 font-semibold">Wajib diisi</span>
                <input
                  type="checkbox"
                  checked={Boolean(question.required)}
                  onChange={(e) => onUpdate({ ...question, required: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-8 h-4 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-indigo-600 relative" />
              </label>

              {/* More menu */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowMoreMenu(!showMoreMenu)}
                  className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 cursor-pointer"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>

                {showMoreMenu && (
                  <div className="absolute right-0 bottom-full mb-1 w-44 bg-white rounded-xl shadow-lg border border-slate-200 py-1 z-50 text-xs">
                    <button
                      type="button"
                      onClick={() => {
                        setShowDescription(!showDescription);
                        setShowMoreMenu(false);
                      }}
                      className="w-full text-left px-3 py-1.5 hover:bg-slate-50 text-slate-700"
                    >
                      {showDescription ? 'Sembunyikan Deskripsi' : 'Tampilkan Deskripsi'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
