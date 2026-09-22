'use client';
import { useState } from 'react';
import {
  Download,
  Trash2,
  FileSpreadsheet,
  Award,
  ChevronLeft,
  ChevronRight,
  UserCheck,
} from 'lucide-react';
import { FullFormSchema } from '@/types/schema';

interface ResponsesViewProps {
  form: FullFormSchema;
  onClearResponses: () => void;
  onDeleteSingleResponse: (respId: string) => void;
}

export const ResponsesView = ({
  form,
  onClearResponses,
  onDeleteSingleResponse,
}: ResponsesViewProps) => {
  const [activeSubTab, setActiveSubTab] = useState<'summary' | 'individual'>('summary');
  const [individualIndex, setIndividualIndex] = useState(0);

  const responses = form.responses || [];
  const totalCount = responses.length;

  // CSV Export
  const handleExportCSV = () => {
    if (responses.length === 0) {
      alert('Belum ada tanggapan untuk diekspor.');
      return;
    }

    const headers = [
      'Timestamp',
      form.settings.collectEmail ? 'Email' : null,
      form.settings.isQuiz ? 'Total Skor' : null,
      ...form.questions.map((q) => `"${q.title.replace(/"/g, '""')}"`),
    ].filter(Boolean);

    const rows = responses.map((r) => {
      const row = [
        `"${new Date(r.submittedAt).toLocaleString('id-ID')}"`,
        form.settings.collectEmail ? `"${r.email || ''}"` : null,
        form.settings.isQuiz ? `"${r.quizScore?.totalPoints ?? 0}"` : null,
        ...form.questions.map((q) => {
          const val = r.answers[q.id];
          if (val === undefined || val === null) return '""';
          if (Array.isArray(val)) return `"${val.join('; ').replace(/"/g, '""')}"`;
          if (typeof val === 'object') return `"${JSON.stringify(val).replace(/"/g, '""')}"`;
          return `"${String(val).replace(/"/g, '""')}"`;
        }),
      ].filter(Boolean);
      return row.join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${form.title || 'tanggapan'}_export.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // JSON Export
  const handleExportJSON = () => {
    const jsonStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(responses, null, 2));
    const link = document.createElement('a');
    link.setAttribute('href', jsonStr);
    link.setAttribute('download', `${form.title || 'tanggapan'}_export.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Compute Quiz Analytics if Quiz
  const quizScores = responses
    .map((r) => r.quizScore?.totalPoints)
    .filter((s): s is number => typeof s === 'number');

  const avgScore = quizScores.length > 0
    ? Math.round(quizScores.reduce((a, b) => a + b, 0) / quizScores.length)
    : 0;
  const maxScoreFound = quizScores.length > 0 ? Math.max(...quizScores) : 0;
  const minScoreFound = quizScores.length > 0 ? Math.min(...quizScores) : 0;

  return (
    <div className="max-w-4xl mx-auto pb-24 px-4 space-y-5">
      {/* Top Card: Responses Count & Action Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-black text-slate-900">{totalCount}</h2>
            <span className="text-base font-bold text-slate-700">Tanggapan Masuk</span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {form.settings.isAcceptingResponses
              ? 'Formulir saat ini aktif menerima tanggapan baru.'
              : 'Penerimaan tanggapan sedang ditutup.'}
          </p>
        </div>

        {/* Action Buttons: Spreadsheet, JSON, Clear */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={handleExportCSV}
            disabled={totalCount === 0}
            className="flex items-center gap-1.5 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 disabled:opacity-50 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-2xs"
            title="Ekspor ke CSV / Google Sheets"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Ekspor Spreadsheet (CSV)</span>
          </button>

          <button
            type="button"
            onClick={handleExportJSON}
            disabled={totalCount === 0}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer transition-colors"
            title="Unduh Data JSON"
          >
            <Download className="w-4 h-4" />
            <span>JSON</span>
          </button>

          {totalCount > 0 && (
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Yakin ingin menghapus semua tanggapan? Tindakan ini tidak dapat dibatalkan.')) {
                  onClearResponses();
                }
              }}
              className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl cursor-pointer transition-colors"
              title="Hapus Semua Tanggapan"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {totalCount === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
            <UserCheck className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">Menunggu Tanggapan</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Belum ada yang mengisi formulir ini. Buka menu &quot;Pratinjau&quot; atau &quot;Kirim&quot; untuk menguji dan membagikan formulir Anda.
          </p>
        </div>
      ) : (
        <>
          {/* Sub-Tabs: Ringkasan vs Individual */}
          <div className="flex border-b border-slate-200 gap-6 text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveSubTab('summary')}
              className={`pb-2.5 cursor-pointer border-b-2 transition-colors ${
                activeSubTab === 'summary'
                  ? 'border-indigo-600 text-indigo-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Ringkasan Statistik
            </button>

            <button
              type="button"
              onClick={() => setActiveSubTab('individual')}
              className={`pb-2.5 cursor-pointer border-b-2 transition-colors ${
                activeSubTab === 'individual'
                  ? 'border-indigo-600 text-indigo-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Lembar Individual
            </button>
          </div>

          {/* SUB-TAB 1: RINGKASAN */}
          {activeSubTab === 'summary' && (
            <div className="space-y-5 animate-in fade-in">
              {form.settings.isQuiz && quizScores.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-amber-500" />
                    <h3 className="font-bold text-slate-900 text-sm">Statistik Nilai Kuis Peserta</h3>
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100">
                      <span className="text-[11px] text-slate-500 font-semibold block">Rata-Rata</span>
                      <span className="text-xl font-black text-indigo-900">{avgScore} poin</span>
                    </div>
                    <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100">
                      <span className="text-[11px] text-slate-500 font-semibold block">Nilai Tertinggi</span>
                      <span className="text-xl font-black text-emerald-900">{maxScoreFound} poin</span>
                    </div>
                    <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-100">
                      <span className="text-[11px] text-slate-500 font-semibold block">Nilai Terendah</span>
                      <span className="text-xl font-black text-amber-900">{minScoreFound} poin</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Per-Question Distribution Charts */}
              {form.questions.map((q) => {
                const answersList = responses.map((r) => r.answers[q.id]).filter((a) => a !== undefined);

                return (
                  <div key={q.id} className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{q.title}</h4>
                        <span className="text-[11px] text-slate-400">
                          {answersList.length} tanggapan tercatat
                        </span>
                      </div>
                      {q.quiz && (
                        <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-lg">
                          {q.quiz.points} poin
                        </span>
                      )}
                    </div>

                    {(q.type === 'radio' || q.type === 'checkbox' || q.type === 'select') && (
                      <div className="space-y-2 pt-1 text-xs">
                        {(q.options || []).map((opt) => {
                          let count = 0;
                          answersList.forEach((ans) => {
                            if (Array.isArray(ans)) {
                              if (ans.includes(opt.id) || ans.includes(opt.value)) count++;
                            } else {
                              if (ans === opt.id || ans === opt.value) count++;
                            }
                          });

                          const percentage = answersList.length > 0 ? Math.round((count / answersList.length) * 100) : 0;
                          const isCorrect = q.quiz?.correctAnswers?.includes(opt.id) || q.quiz?.correctAnswers?.includes(opt.value);

                          return (
                            <div key={opt.id} className="space-y-1">
                              <div className="flex justify-between font-medium text-slate-700">
                                <span className="flex items-center gap-1.5">
                                  <span>{opt.label}</span>
                                  {isCorrect && (
                                    <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                                      Kunci Jawaban
                                    </span>
                                  )}
                                </span>
                                <span>{count} ({percentage}%)</span>
                              </div>
                              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                <div
                                  style={{ width: `${percentage}%` }}
                                  className={`h-full transition-all duration-300 ${
                                    isCorrect ? 'bg-emerald-500' : 'bg-indigo-500'
                                  }`}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {q.type === 'scale' && (
                      <div className="space-y-2 pt-1 text-xs">
                        {Array.from(
                          { length: (q.scaleMax ?? 5) - (q.scaleMin ?? 1) + 1 },
                          (_, i) => (q.scaleMin ?? 1) + i
                        ).map((num) => {
                          const count = answersList.filter((a) => a === num).length;
                          const percentage = answersList.length > 0 ? Math.round((count / answersList.length) * 100) : 0;
                          return (
                            <div key={num} className="space-y-1">
                              <div className="flex justify-between font-medium text-slate-700">
                                <span>Nilai {num}</span>
                                <span>{count} tanggapan ({percentage}%)</span>
                              </div>
                              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                <div
                                  style={{ width: `${percentage}%` }}
                                  className="h-full bg-indigo-500 transition-all duration-300"
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {(q.type === 'text' || q.type === 'textarea') && (
                      <div className="space-y-1.5 max-h-48 overflow-y-auto pt-1">
                        {answersList.map((ans, idx) => (
                          <div
                            key={idx}
                            className="p-2.5 bg-slate-50 rounded-xl text-xs text-slate-800 border border-slate-100"
                          >
                            {String(ans)}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* SUB-TAB 2: INDIVIDUAL SHEET */}
          {activeSubTab === 'individual' && responses[individualIndex] && (
            <div className="space-y-4 animate-in fade-in">
              <div className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={individualIndex === 0}
                    onClick={() => setIndividualIndex((p) => Math.max(0, p - 1))}
                    className="p-1.5 text-slate-600 hover:text-slate-900 disabled:opacity-30 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <span className="font-bold text-slate-800">
                    Tanggapan {individualIndex + 1} dari {totalCount}
                  </span>

                  <button
                    type="button"
                    disabled={individualIndex === totalCount - 1}
                    onClick={() => setIndividualIndex((p) => Math.min(totalCount - 1, p + 1))}
                    className="p-1.5 text-slate-600 hover:text-slate-900 disabled:opacity-30 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-slate-400">
                    Dikirim: {new Date(responses[individualIndex].submittedAt).toLocaleString('id-ID')}
                  </span>

                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm('Hapus tanggapan nomor ini?')) {
                        onDeleteSingleResponse(responses[individualIndex].id);
                        setIndividualIndex((p) => Math.max(0, p - 1));
                      }
                    }}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                    title="Hapus Tanggapan Ini"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3">
                {responses[individualIndex].email && (
                  <div className="text-xs">
                    <span className="font-semibold text-slate-500">Email Responden: </span>
                    <span className="font-bold text-slate-900">{responses[individualIndex].email}</span>
                  </div>
                )}

                {responses[individualIndex].quizScore && (
                  <div className="flex items-center justify-between p-3 bg-indigo-50/70 rounded-xl border border-indigo-200 text-xs">
                    <span className="font-bold text-indigo-900">Total Perolehan Nilai:</span>
                    <span className="text-base font-black text-indigo-900">
                      {responses[individualIndex].quizScore?.totalPoints} /{' '}
                      {responses[individualIndex].quizScore?.maxPoints} poin
                    </span>
                  </div>
                )}
              </div>

              {form.questions.map((q) => {
                const userVal = responses[individualIndex].answers[q.id];
                const quizScoreBreakdown = responses[individualIndex].quizScore?.breakdown?.[q.id];

                return (
                  <div key={q.id} className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <h4 className="text-sm font-bold text-slate-900">{q.title}</h4>
                      {q.quiz && (
                        <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-lg">
                          {quizScoreBreakdown?.earned ?? 0} / {q.quiz.points} poin
                        </span>
                      )}
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl text-xs font-medium text-slate-800">
                      {userVal !== undefined ? (
                        Array.isArray(userVal) ? (
                          userVal.join(', ')
                        ) : typeof userVal === 'object' ? (
                          JSON.stringify(userVal)
                        ) : (
                          String(userVal)
                        )
                      ) : (
                        <span className="text-slate-400 italic">(Tidak ada jawaban)</span>
                      )}
                    </div>

                    {q.quiz?.correctAnswers && (
                      <div className="text-[11px] text-emerald-800 font-semibold">
                        Kunci Jawaban: {q.quiz.correctAnswers.join(', ')}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
};

