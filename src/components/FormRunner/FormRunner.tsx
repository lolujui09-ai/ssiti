import { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Award,
  UploadCloud,
  FileCheck,
  X,
} from 'lucide-react';
import { FullFormSchema, FormResponseItem, FormQuestion } from '../../types/schema';

interface FormRunnerProps {
  form: FullFormSchema;
  onSubmitSuccess: (response: FormResponseItem) => void;
  isRespondentView?: boolean;
  onClosePreview?: () => void;
}

export const FormRunner = ({
  form,
  onSubmitSuccess,
  isRespondentView = false,
  onClosePreview,
}: FormRunnerProps) => {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [respondentEmail, setRespondentEmail] = useState('');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedScore, setSubmittedScore] = useState<any>(null);
  const [showGradeSheet, setShowGradeSheet] = useState(false);

  // If form is closed
  if (!form.settings.isAcceptingResponses) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div style={{ backgroundColor: form.theme.primaryColor }} className="h-2.5 w-full" />
          <div className="p-8 text-center space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">{form.title}</h2>
            <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-xs sm:text-sm font-medium">
              {form.settings.closedMessage || 'Formulir ini sudah tidak lagi menerima tanggapan.'}
            </div>
            {onClosePreview && (
              <button
                type="button"
                onClick={onClosePreview}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold cursor-pointer"
              >
                Kembali ke Form Editor
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  const currentSection = form.sections[currentSectionIndex] || form.sections[0];
  const sectionQuestions = form.questions.filter(
    (q) => (q.sectionId || form.sections[0]?.id || 'sec-1') === currentSection.id
  );

  // Answer change handlers
  const handleAnswerChange = (qId: string, val: any) => {
    setAnswers((prev) => ({ ...prev, [qId]: val }));
    if (validationErrors[qId]) {
      setValidationErrors((prev) => {
        const copy = { ...prev };
        delete copy[qId];
        return copy;
      });
    }
  };

  const handleCheckboxChange = (qId: string, optVal: string) => {
    const current = (answers[qId] as string[]) || [];
    let updated: string[];
    if (current.includes(optVal)) {
      updated = current.filter((v) => v !== optVal);
    } else {
      updated = [...current, optVal];
    }
    handleAnswerChange(qId, updated);
  };

  const handleGridRadioChange = (qId: string, rowId: string, colId: string) => {
    const currentGrid = (answers[qId] as Record<string, string>) || {};
    handleAnswerChange(qId, { ...currentGrid, [rowId]: colId });
  };

  // Validate current section before moving forward
  const validateCurrentSection = (): boolean => {
    const errors: Record<string, string> = {};

    // Validate email if on section 0 and collectEmail enabled
    if (currentSectionIndex === 0 && form.settings.collectEmail) {
      if (!respondentEmail.trim()) {
        errors['email'] = 'Alamat email wajib diisi.';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(respondentEmail)) {
        errors['email'] = 'Format email tidak valid.';
      }
    }

    // Validate required questions in this section
    sectionQuestions.forEach((q) => {
      if (q.required) {
        const val = answers[q.id];
        if (
          val === undefined ||
          val === null ||
          val === '' ||
          (Array.isArray(val) && val.length === 0) ||
          (typeof val === 'object' && Object.keys(val).length === 0)
        ) {
          errors[q.id] = 'Pertanyaan ini wajib dijawab.';
        }
      }
    });

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Next section or Submit
  const handleNextOrSubmit = () => {
    if (!validateCurrentSection()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Check branching on current question answers if any
    let targetSectionId: string | undefined;
    for (const q of sectionQuestions) {
      if (q.type === 'radio' && answers[q.id]) {
        const chosenOpt = q.options?.find(
          (o) => o.id === answers[q.id] || o.value === answers[q.id]
        );
        if (chosenOpt?.goToSectionId && chosenOpt.goToSectionId !== 'next') {
          targetSectionId = chosenOpt.goToSectionId;
          break;
        }
      }
    }

    if (targetSectionId === 'submit') {
      executeSubmission();
      return;
    }

    if (targetSectionId) {
      const targetIdx = form.sections.findIndex((s) => s.id === targetSectionId);
      if (targetIdx !== -1) {
        setCurrentSectionIndex(targetIdx);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
    }

    // If more sections exist
    if (currentSectionIndex < form.sections.length - 1) {
      setCurrentSectionIndex((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      executeSubmission();
    }
  };

  const handlePrev = () => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleResetForm = () => {
    if (window.confirm('Kosongkan formulir? Seluruh isian Anda akan dihapus.')) {
      setAnswers({});
      setRespondentEmail('');
      setCurrentSectionIndex(0);
      setValidationErrors({});
    }
  };

  // Grade Quiz & Record response
  const executeSubmission = () => {
    let totalScore = 0;
    let maxScore = 0;
    const breakdown: Record<string, { earned: number; max: number; isCorrect: boolean }> = {};

    if (form.settings.isQuiz) {
      form.questions.forEach((q) => {
        if (!q.quiz) return;
        const qPoints = q.quiz.points || 0;
        maxScore += qPoints;
        const userAns = answers[q.id];
        const correctAnswers = q.quiz.correctAnswers || [];

        let isCorrect = false;
        if (q.type === 'checkbox') {
          const userArr = Array.isArray(userAns) ? userAns : [];
          isCorrect =
            userArr.length === correctAnswers.length &&
            userArr.every((v) => correctAnswers.includes(v));
        } else if (q.type === 'text') {
          isCorrect = correctAnswers.some(
            (c) => String(userAns || '').trim().toLowerCase() === c.trim().toLowerCase()
          );
        } else {
          isCorrect = correctAnswers.includes(userAns);
        }

        const earned = isCorrect ? qPoints : 0;
        totalScore += earned;
        breakdown[q.id] = { earned, max: qPoints, isCorrect };
      });
    }

    const quizScoreResult = form.settings.isQuiz
      ? { totalPoints: totalScore, maxPoints: maxScore, breakdown }
      : undefined;

    const newResponse: FormResponseItem = {
      id: `resp-${Date.now()}`,
      submittedAt: new Date().toISOString(),
      email: form.settings.collectEmail ? respondentEmail : undefined,
      answers,
      quizScore: quizScoreResult,
    };

    setSubmittedScore(quizScoreResult);
    setIsSubmitted(true);
    onSubmitSuccess(newResponse);
  };

  // -------------------------------------------------------------
  // SUBMISSION SUCCESS VIEW
  // -------------------------------------------------------------
  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto py-10 px-4 space-y-4 animate-in fade-in">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div style={{ backgroundColor: form.theme.primaryColor }} className="h-2.5 w-full" />
          <div className="p-8 space-y-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">{form.title}</h2>
            <p className="text-sm text-slate-700 leading-relaxed">
              {form.settings.confirmationMessage || 'Tanggapan Anda telah dicatat.'}
            </p>

            {/* Quiz Score Preview Button */}
            {form.settings.isQuiz && form.settings.releaseGradesImmediately && submittedScore && (
              <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-indigo-50/70 rounded-2xl border border-indigo-200">
                <div>
                  <span className="text-xs text-indigo-700 font-bold uppercase tracking-wider block">
                    Hasil Nilai Kuis Anda:
                  </span>
                  <div className="text-2xl font-black text-indigo-900">
                    {submittedScore.totalPoints} / {submittedScore.maxPoints} poin
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowGradeSheet(!showGradeSheet)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer transition-colors"
                >
                  {showGradeSheet ? 'Sembunyikan Pembahasan' : 'Lihat Skor & Pembahasan'}
                </button>
              </div>
            )}

            {/* Links */}
            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
              {form.settings.showSubmitAnotherLink && (
                <button
                  type="button"
                  onClick={() => {
                    setAnswers({});
                    setIsSubmitted(false);
                    setCurrentSectionIndex(0);
                    setShowGradeSheet(false);
                  }}
                  className="text-indigo-600 font-bold hover:underline cursor-pointer"
                >
                  Kirim tanggapan lain
                </button>
              )}

              {onClosePreview && (
                <button
                  type="button"
                  onClick={onClosePreview}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl cursor-pointer transition-colors"
                >
                  Tutup Pratinjau
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Detailed Graded Sheet if User toggles "Lihat Skor" */}
        {showGradeSheet && submittedScore && (
          <div className="space-y-4 pt-2">
            <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
              <Award className="w-5 h-5 text-indigo-600" />
              <span>Lembar Hasil Ujian &amp; Kunci Jawaban</span>
            </h3>

            {form.questions.map((q) => {
              const res = submittedScore.breakdown[q.id];
              const userVal = answers[q.id];
              const isCorrect = res?.isCorrect;

              return (
                <div
                  key={q.id}
                  className={`bg-white rounded-2xl border p-5 space-y-3 ${
                    isCorrect ? 'border-emerald-300 bg-emerald-50/20' : 'border-rose-300 bg-rose-50/20'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      {isCorrect ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                      ) : (
                        <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                      )}
                      <span>{q.title}</span>
                    </h4>

                    {q.quiz && (
                      <span className="text-xs font-bold text-slate-600 shrink-0 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                        {res?.earned ?? 0} / {q.quiz.points} poin
                      </span>
                    )}
                  </div>

                  {/* Respondent answer */}
                  <div className="text-xs text-slate-700">
                    <span className="font-semibold text-slate-500">Jawaban Anda: </span>
                    <span className="font-bold">
                      {Array.isArray(userVal)
                        ? userVal.join(', ') || '(Tidak dijawab)'
                        : userVal || '(Tidak dijawab)'}
                    </span>
                  </div>

                  {/* Correct Answer Revelation */}
                  {!isCorrect && q.quiz?.correctAnswers && (
                    <div className="p-3 bg-emerald-50 rounded-xl text-xs text-emerald-900 font-semibold border border-emerald-200">
                      <span>Kunci Jawaban yang Benar: </span>
                      <span className="font-bold">{q.quiz.correctAnswers.join(', ')}</span>
                    </div>
                  )}

                  {/* Explanation feedback */}
                  {q.quiz?.explanation && (
                    <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <span className="font-bold text-slate-800 block mb-0.5">Penjelasan &amp; Umpan Balik:</span>
                      <span>{q.quiz.explanation}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // -------------------------------------------------------------
  // ACTIVE RESPONDENT QUESTION FORM
  // -------------------------------------------------------------
  return (
    <div className="max-w-2xl mx-auto pb-24 px-3 sm:px-4 space-y-4">
      {/* Top Banner Bar if In Preview Mode */}
      {!isRespondentView && onClosePreview && (
        <div className="bg-slate-900 text-white px-4 py-2.5 rounded-2xl flex items-center justify-between text-xs shadow-md">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold">Mode Pratinjau Responden (Uji Coba Pengisian)</span>
          </div>
          <button
            type="button"
            onClick={onClosePreview}
            className="flex items-center gap-1 font-bold text-slate-300 hover:text-white px-2 py-1 rounded-lg hover:bg-slate-800 cursor-pointer transition-colors"
          >
            <span>Tutup Pratinjau</span>
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Progress Bar if multi-section */}
      {form.settings.showProgressBar && form.sections.length > 1 && (
        <div className="space-y-1">
          <div className="flex justify-between text-[11px] font-semibold text-slate-500">
            <span>Bagian {currentSectionIndex + 1} dari {form.sections.length}</span>
            <span>{Math.round(((currentSectionIndex + 1) / form.sections.length) * 100)}%</span>
          </div>
          <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
            <div
              style={{
                width: `${((currentSectionIndex + 1) / form.sections.length) * 100}%`,
                backgroundColor: form.theme.primaryColor,
              }}
              className="h-full transition-all duration-300"
            />
          </div>
        </div>
      )}

      {/* 1. Header Title Card */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
        <div style={{ backgroundColor: form.theme.primaryColor }} className="h-2.5 w-full" />
        <div className="p-6 sm:p-7 space-y-4">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {form.title || 'Formulir Tanpa Judul'}
          </h1>

          {form.description && (
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
              {form.description}
            </p>
          )}

          {/* Email collection input if enabled */}
          {form.settings.collectEmail && currentSectionIndex === 0 && (
            <div className="pt-4 border-t border-slate-100 space-y-1.5">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1">
                <span>Alamat Email</span>
                <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                placeholder="nama@email.com"
                value={respondentEmail}
                onChange={(e) => {
                  setRespondentEmail(e.target.value);
                  if (validationErrors['email']) {
                    setValidationErrors((prev) => {
                      const c = { ...prev };
                      delete c['email'];
                      return c;
                    });
                  }
                }}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs text-slate-900 focus:outline-none transition-colors ${
                  validationErrors['email']
                    ? 'border-rose-400 bg-rose-50/30 focus:border-rose-600'
                    : 'border-slate-300 focus:border-indigo-600'
                }`}
              />
              {validationErrors['email'] && (
                <p className="text-[11px] text-rose-600 font-semibold flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>{validationErrors['email']}</span>
                </p>
              )}
            </div>
          )}

          <div className="pt-2 text-[11px] text-rose-600 font-medium border-t border-slate-100">
            * Menunjukkan pertanyaan wajib diisi
          </div>
        </div>
      </div>

      {/* Section Sub-header if multi-section */}
      {form.sections.length > 1 && (
        <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-300">
            Bagian {currentSectionIndex + 1}
          </span>
          <h2 className="text-base sm:text-lg font-bold">{currentSection.title}</h2>
          {currentSection.description && (
            <p className="text-xs text-slate-300 mt-1">{currentSection.description}</p>
          )}
        </div>
      )}

      {/* 2. Questions List for Current Section */}
      <div className="space-y-4">
        {sectionQuestions.map((q) => {
          const userVal = answers[q.id];
          const hasError = Boolean(validationErrors[q.id]);

          return (
            <div
              key={q.id}
              className={`bg-white rounded-2xl shadow-xs border p-5 sm:p-6 space-y-4 transition-all ${
                hasError ? 'border-rose-400 ring-2 ring-rose-100' : 'border-slate-200'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1 flex-1">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-start gap-1.5">
                    <span>{q.title}</span>
                    {q.required && <span className="text-rose-500 font-bold">*</span>}
                  </h3>
                  {q.description && (
                    <p className="text-xs text-slate-500">{q.description}</p>
                  )}
                </div>

                {form.settings.isQuiz && q.quiz && form.settings.showPointValues && (
                  <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg shrink-0">
                    {q.quiz.points} poin
                  </span>
                )}
              </div>

              {/* RENDER QUESTION INPUT FIELD BY TYPE */}
              <div className="text-xs sm:text-sm">
                {/* 1. Jawaban Singkat */}
                {q.type === 'text' && (
                  <input
                    type="text"
                    placeholder={q.placeholder || 'Jawaban Anda...'}
                    value={userVal || ''}
                    onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                    className="w-full px-3 py-2 border-b-2 border-slate-300 focus:border-indigo-600 focus:outline-none transition-colors text-slate-800 text-xs sm:text-sm"
                  />
                )}

                {/* 2. Paragraf */}
                {q.type === 'textarea' && (
                  <textarea
                    rows={3}
                    placeholder={q.placeholder || 'Tuliskan jawaban Anda di sini...'}
                    value={userVal || ''}
                    onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-300 focus:border-indigo-600 focus:outline-none resize-y text-slate-800 text-xs sm:text-sm"
                  />
                )}

                {/* 3. Pilihan Ganda (Radio) */}
                {q.type === 'radio' && (
                  <div className="space-y-2">
                    {(q.options || []).map((opt) => {
                      const isSelected = userVal === opt.id || userVal === opt.value;
                      return (
                        <label
                          key={opt.id}
                          className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                            isSelected
                              ? 'bg-indigo-50/60 border-indigo-300 font-semibold text-indigo-950'
                              : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <input
                            type="radio"
                            name={`radio-${q.id}`}
                            checked={isSelected}
                            onChange={() => handleAnswerChange(q.id, opt.id)}
                            className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className="text-xs sm:text-sm">{opt.label}</span>
                        </label>
                      );
                    })}
                  </div>
                )}

                {/* 4. Kotak Centang (Checkbox) */}
                {q.type === 'checkbox' && (
                  <div className="space-y-2">
                    {(q.options || []).map((opt) => {
                      const currentSelected = (userVal as string[]) || [];
                      const isSelected = currentSelected.includes(opt.id) || currentSelected.includes(opt.value);
                      return (
                        <label
                          key={opt.id}
                          className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                            isSelected
                              ? 'bg-indigo-50/60 border-indigo-300 font-semibold text-indigo-950'
                              : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleCheckboxChange(q.id, opt.id)}
                            className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                          />
                          <span className="text-xs sm:text-sm">{opt.label}</span>
                        </label>
                      );
                    })}
                  </div>
                )}

                {/* 5. Dropdown (Select) */}
                {q.type === 'select' && (
                  <select
                    value={userVal || ''}
                    onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-indigo-600 cursor-pointer"
                  >
                    <option value="">Pilih jawaban...</option>
                    {(q.options || []).map((opt) => (
                      <option key={opt.id} value={opt.id}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                )}

                {/* 6. Skala Linier (Scale) */}
                {q.type === 'scale' && (
                  <div className="space-y-3 pt-1">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>{q.scaleMinLabel || String(q.scaleMin ?? 1)}</span>
                      <span>{q.scaleMaxLabel || String(q.scaleMax ?? 5)}</span>
                    </div>

                    <div className="flex items-center justify-between gap-1 overflow-x-auto pb-1">
                      {Array.from(
                        { length: (q.scaleMax ?? 5) - (q.scaleMin ?? 1) + 1 },
                        (_, i) => (q.scaleMin ?? 1) + i
                      ).map((num) => {
                        const isSelected = userVal === num;
                        return (
                          <button
                            key={num}
                            type="button"
                            onClick={() => handleAnswerChange(q.id, num)}
                            className={`flex-1 min-w-[36px] h-10 rounded-xl border text-xs font-bold flex items-center justify-center cursor-pointer transition-all ${
                              isSelected
                                ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                                : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                            }`}
                          >
                            {num}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 7. Kisi Pilihan Ganda (Grid Radio) */}
                {q.type === 'grid_radio' && (
                  <div className="overflow-x-auto border border-slate-200 rounded-xl">
                    <table className="w-full text-xs text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                          <th className="p-3 font-semibold text-slate-600">Pernyataan</th>
                          {(q.columns || []).map((col) => (
                            <th key={col.id} className="p-3 text-center font-semibold text-slate-600">
                              {col.label}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {(q.rows || []).map((row) => (
                          <tr key={row.id} className="hover:bg-slate-50/50">
                            <td className="p-3 font-medium text-slate-800">{row.label}</td>
                            {(q.columns || []).map((col) => {
                              const isChecked = userVal?.[row.id] === col.id;
                              return (
                                <td key={col.id} className="p-3 text-center">
                                  <input
                                    type="radio"
                                    name={`grid-${q.id}-${row.id}`}
                                    checked={isChecked}
                                    onChange={() => handleGridRadioChange(q.id, row.id, col.id)}
                                    className="w-4 h-4 text-indigo-600"
                                  />
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* 8. File Upload */}
                {q.type === 'file' && (
                  <div className="p-4 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50/50 flex flex-col items-center justify-center gap-2 text-center cursor-pointer hover:bg-slate-100/50 transition-colors">
                    {userVal ? (
                      <div className="flex items-center gap-2 text-xs font-bold text-emerald-700">
                        <FileCheck className="w-5 h-5 text-emerald-600" />
                        <span>{userVal} (Berkas siap diunggah)</span>
                      </div>
                    ) : (
                      <>
                        <UploadCloud className="w-6 h-6 text-slate-400" />
                        <span className="text-xs font-semibold text-slate-700">
                          Klik untuk memilih berkas dari perangkat Anda
                        </span>
                        <span className="text-[11px] text-slate-400">
                          Batas ukuran maks. {q.validation?.maxFileSizeMB || 10} MB
                        </span>
                      </>
                    )}
                    <input
                      type="file"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleAnswerChange(q.id, file.name);
                        }
                      }}
                      className="hidden"
                      id={`file-${q.id}`}
                    />
                    <label
                      htmlFor={`file-${q.id}`}
                      className="mt-2 px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 cursor-pointer"
                    >
                      {userVal ? 'Ganti Berkas' : 'Pilih Berkas'}
                    </label>
                  </div>
                )}

                {/* 9. Tanggal */}
                {q.type === 'date' && (
                  <input
                    type="date"
                    value={userVal || ''}
                    onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                    className="px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-indigo-600"
                  />
                )}

                {/* 10. Waktu */}
                {q.type === 'time' && (
                  <input
                    type="time"
                    value={userVal || ''}
                    onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                    className="px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-indigo-600"
                  />
                )}
              </div>

              {/* Error indicator */}
              {hasError && (
                <p className="text-xs text-rose-600 font-semibold flex items-center gap-1.5 pt-1">
                  <AlertCircle className="w-4 h-4" />
                  <span>{validationErrors[q.id]}</span>
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer Navigation Buttons */}
      <div className="pt-4 flex items-center justify-between gap-3">
        {/* Back Button if section > 0 */}
        {currentSectionIndex > 0 ? (
          <button
            type="button"
            onClick={handlePrev}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs sm:text-sm font-bold shadow-2xs cursor-pointer transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={handleResetForm}
            className="text-xs text-slate-500 hover:text-slate-800 cursor-pointer font-medium"
          >
            Kosongkan formulir
          </button>
        )}

        {/* Next or Submit Button */}
        <button
          type="button"
          onClick={handleNextOrSubmit}
          style={{ backgroundColor: form.theme.primaryColor }}
          className="flex items-center gap-2 px-6 py-2.5 text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs hover:opacity-90 active:scale-95 cursor-pointer transition-all"
        >
          <span>
            {currentSectionIndex < form.sections.length - 1
              ? 'Berikutnya'
              : form.submitButtonText || 'Kirim'}
          </span>
          {currentSectionIndex < form.sections.length - 1 && <ArrowRight className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};
