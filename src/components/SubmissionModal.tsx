import { useState } from 'react';
import { CheckCircle2, X, Copy, Check, RotateCcw, FileText, Database } from 'lucide-react';

interface SubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: Record<string, any>;
  formTitle: string;
}

export const SubmissionModal = ({
  isOpen,
  onClose,
  data,
  formTitle,
}: SubmissionModalProps) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const jsonString = JSON.stringify(data, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const entries = Object.entries(data);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95">
        {/* Header */}
        <div className="px-6 py-4 bg-emerald-50/70 border-b border-emerald-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Form Berhasil Dikirim!
              </h3>
              <p className="text-xs text-emerald-800">
                Simulasi pengiriman form "{formTitle}" sukses divalidasi.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-white/80 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {/* Visual Table of Submitted Data */}
          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-indigo-600" />
              <span>Data Isian Pengguna ({entries.length} Field)</span>
            </h4>
            <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100">
              {entries.map(([key, value]) => {
                let displayVal = String(value);
                if (Array.isArray(value)) {
                  displayVal = value.join(', ');
                } else if (typeof value === 'boolean') {
                  displayVal = value ? 'Disetujui (True)' : 'Tidak (False)';
                }

                return (
                  <div
                    key={key}
                    className="px-4 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs sm:text-sm hover:bg-slate-50 transition-colors"
                  >
                    <span className="font-semibold text-slate-600 font-mono text-xs">
                      {key}
                    </span>
                    <span className="text-slate-900 font-medium text-right break-all">
                      {displayVal || <em className="text-slate-400">Kosong</em>}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Raw JSON Representation */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-slate-500" />
                <span>JSON Payload Hasil Submit</span>
              </h4>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-600">Disalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Salin JSON Payload</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-4 rounded-xl bg-slate-900 text-emerald-400 font-mono text-xs overflow-x-auto max-h-48 border border-slate-800 leading-relaxed">
              {jsonString}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold transition-colors cursor-pointer"
          >
            Tutup & Uji Lagi
          </button>
        </div>
      </div>
    </div>
  );
};
