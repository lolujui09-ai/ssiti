import { useState } from 'react';
import { Award, Mail, Eye, Send, Sliders, ChevronDown } from 'lucide-react';
import { FullFormSchema, FormSettings } from '../../types/schema';

interface SettingsViewProps {
  form: FullFormSchema;
  onUpdateSettings: (newSettings: FormSettings) => void;
  onUpdateSubmitText: (newText: string) => void;
}

export const SettingsView = ({
  form,
  onUpdateSettings,
  onUpdateSubmitText,
}: SettingsViewProps) => {
  const settings = form.settings;

  const handleToggle = (key: keyof FormSettings) => {
    onUpdateSettings({
      ...settings,
      [key]: !settings[key],
    });
  };

  return (
    <div className="max-w-3xl mx-auto pb-24 px-4 space-y-4">
      {/* 1. Kuis (Make this a quiz) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-6 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Jadikan Ini Kuis</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Tetapkan bobot nilai poin pada pertanyaan, kunci jawaban yang benar, dan berikan evaluasi otomatis.
                </p>
              </div>
            </div>

            {/* Toggle switch */}
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={settings.isQuiz}
                onChange={() => handleToggle('isQuiz')}
                className="sr-only peer"
              />
              <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600" />
            </label>
          </div>

          {/* Sub-settings if Quiz enabled */}
          {settings.isQuiz && (
            <div className="pt-4 border-t border-slate-100 space-y-4 pl-12 text-xs animate-in fade-in">
              {/* Default Points */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-semibold text-slate-800 block">Nilai Poin Bawaan Pertanyaan</span>
                  <span className="text-slate-400">Poin default saat menambahkan soal baru</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={settings.defaultQuestionPoints}
                    onChange={(e) =>
                      onUpdateSettings({
                        ...settings,
                        defaultQuestionPoints: Math.max(0, parseInt(e.target.value) || 0),
                      })
                    }
                    className="w-16 px-2.5 py-1 text-center font-bold border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <span className="text-slate-500 font-semibold">poin</span>
                </div>
              </div>

              {/* Release Grade Timing */}
              <div className="space-y-2 pt-2">
                <span className="font-semibold text-slate-800 block">Rilis Nilai:</span>
                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="releaseGradesImmediately"
                      checked={settings.releaseGradesImmediately}
                      onChange={() => onUpdateSettings({ ...settings, releaseGradesImmediately: true })}
                      className="text-indigo-600"
                    />
                    <span className="text-slate-700">Segera setelah setiap pengiriman</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="releaseGradesImmediately"
                      checked={!settings.releaseGradesImmediately}
                      onChange={() => onUpdateSettings({ ...settings, releaseGradesImmediately: false })}
                      className="text-indigo-600"
                    />
                    <span className="text-slate-700">Nanti, setelah peninjauan manual pengajar</span>
                  </label>
                </div>
              </div>

              {/* Respondent Visibility Options */}
              <div className="space-y-2 pt-2">
                <span className="font-semibold text-slate-800 block">Setelan yang Dapat Dilihat Responden:</span>
                <div className="space-y-2">
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-slate-700">Jawaban yang benar</span>
                    <input
                      type="checkbox"
                      checked={settings.showCorrectAnswers}
                      onChange={() => handleToggle('showCorrectAnswers')}
                      className="w-4 h-4 text-indigo-600 rounded"
                    />
                  </label>
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-slate-700">Nilai poin setiap soal</span>
                    <input
                      type="checkbox"
                      checked={settings.showPointValues}
                      onChange={() => handleToggle('showPointValues')}
                      className="w-4 h-4 text-indigo-600 rounded"
                    />
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 2. Tanggapan (Responses collection) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Pengumpulan Tanggapan</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Kelola status penerimaan formulir dan data responden.
            </p>
          </div>
        </div>

        <div className="space-y-3 pt-2 pl-12 text-xs">
          {/* Accepting Responses */}
          <div className="flex items-center justify-between">
            <div>
              <span className="font-semibold text-slate-800 block">Menerima Tanggapan</span>
              <span className="text-slate-400">Jika dimatikan, responden tidak dapat mengisi formulir</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.isAcceptingResponses}
                onChange={() => handleToggle('isAcceptingResponses')}
                className="sr-only peer"
              />
              <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600" />
            </label>
          </div>

          {/* Collect Email */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <div>
              <span className="font-semibold text-slate-800 block">Kumpulkan Alamat Email</span>
              <span className="text-slate-400">Responden wajib mengisi alamat email sebelum mengirim</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.collectEmail}
                onChange={() => handleToggle('collectEmail')}
                className="sr-only peer"
              />
              <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600" />
            </label>
          </div>
        </div>
      </div>

      {/* 3. Presentasi Formulir */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0 mt-0.5">
            <Eye className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Presentasi &amp; Tampilan</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Sesuaikan indikator progres dan pesan setelah formulir dikirim.
            </p>
          </div>
        </div>

        <div className="space-y-4 pt-2 pl-12 text-xs">
          {/* Progress Bar */}
          <div className="flex items-center justify-between">
            <div>
              <span className="font-semibold text-slate-800 block">Tampilkan Bilah Kemajuan (Progress Bar)</span>
              <span className="text-slate-400">Indikator halaman 1 dari N pada formulir multi-bagian</span>
            </div>
            <input
              type="checkbox"
              checked={settings.showProgressBar}
              onChange={() => handleToggle('showProgressBar')}
              className="w-4 h-4 text-indigo-600 rounded cursor-pointer"
            />
          </div>

          {/* Submit another link */}
          <div className="flex items-center justify-between">
            <div>
              <span className="font-semibold text-slate-800 block">Tampilkan Link Kirim Tanggapan Lain</span>
              <span className="text-slate-400">Tampilkan tombol untuk pengisian ulang setelah sukses kirim</span>
            </div>
            <input
              type="checkbox"
              checked={settings.showSubmitAnotherLink}
              onChange={() => handleToggle('showSubmitAnotherLink')}
              className="w-4 h-4 text-indigo-600 rounded cursor-pointer"
            />
          </div>

          {/* Confirmation Message */}
          <div className="pt-2 border-t border-slate-100">
            <label className="font-semibold text-slate-800 block mb-1">
              Pesan Konfirmasi Pengiriman:
            </label>
            <input
              type="text"
              value={settings.confirmationMessage}
              onChange={(e) => onUpdateSettings({ ...settings, confirmationMessage: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Custom Submit Button Text */}
          <div>
            <label className="font-semibold text-slate-800 block mb-1">
              Teks Tombol Kirim:
            </label>
            <input
              type="text"
              value={form.submitButtonText || 'Kirim'}
              onChange={(e) => onUpdateSubmitText(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
