import { useState } from 'react';
import { X, Link2, Mail, Code2, Copy, Check, Download, ExternalLink } from 'lucide-react';
import { FullFormSchema } from '../../types/schema';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  form: FullFormSchema;
  onOpenPreview: () => void;
}

export const ShareModal = ({
  isOpen,
  onClose,
  form,
  onOpenPreview,
}: ShareModalProps) => {
  const [activeTab, setActiveTab] = useState<'link' | 'embed' | 'export'>('link');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedEmbed, setCopiedEmbed] = useState(false);
  const [shortenUrl, setShortenUrl] = useState(false);

  if (!isOpen) return null;

  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : '';
  const fullShareUrl = `${currentOrigin}/#respondent-${form.id}`;
  const displayUrl = shortenUrl
    ? `https://quickform.id/f/${form.id.slice(-6)}`
    : fullShareUrl;

  const embedCode = `<iframe src="${fullShareUrl}" width="640" height="800" frameborder="0" marginheight="0" marginwidth="0">Memuat formulir...</iframe>`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(displayUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyEmbed = () => {
    navigator.clipboard.writeText(embedCode);
    setCopiedEmbed(true);
    setTimeout(() => setCopiedEmbed(false), 2000);
  };

  const handleDownloadSchema = () => {
    const jsonStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(form, null, 2));
    const link = document.createElement('a');
    link.setAttribute('href', jsonStr);
    link.setAttribute('download', `${form.title || 'form_schema'}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div>
            <h3 className="text-base font-bold text-slate-900">Kirim &amp; Bagikan Formulir</h3>
            <p className="text-xs text-slate-500">{form.title}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="px-6 border-b border-slate-200 flex gap-6 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('link')}
            className={`py-3 border-b-2 flex items-center gap-1.5 cursor-pointer transition-colors ${
              activeTab === 'link'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Link2 className="w-4 h-4" />
            <span>Tautan Link</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('embed')}
            className={`py-3 border-b-2 flex items-center gap-1.5 cursor-pointer transition-colors ${
              activeTab === 'embed'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>Sematkan HTML</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('export')}
            className={`py-3 border-b-2 flex items-center gap-1.5 cursor-pointer transition-colors ${
              activeTab === 'export'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>Ekspor Schema</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-6 space-y-4 text-xs">
          {activeTab === 'link' && (
            <div className="space-y-4">
              <div>
                <label className="font-bold text-slate-800 block mb-1.5">Tautan Formulir:</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={displayUrl}
                    className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 font-mono text-xs focus:outline-none select-all"
                  />
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors shrink-0"
                  >
                    {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedLink ? 'Tersalin' : 'Salin'}</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 text-slate-700 font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={shortenUrl}
                    onChange={(e) => setShortenUrl(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded"
                  />
                  <span>Perpendek URL</span>
                </label>

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenPreview();
                  }}
                  className="text-indigo-600 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Buka Form Sekarang</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {activeTab === 'embed' && (
            <div className="space-y-3">
              <label className="font-bold text-slate-800 block">Kode Sematkan IFrame HTML:</label>
              <textarea
                readOnly
                rows={3}
                value={embedCode}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-800 font-mono text-xs focus:outline-none select-all resize-none"
              />
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleCopyEmbed}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  {copiedEmbed ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedEmbed ? 'Kode Tersalin' : 'Salin Kode IFrame'}</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'export' && (
            <div className="space-y-3">
              <p className="text-slate-600">
                Unduh seluruh struktur formulir (judul, pertanyaan, opsi, pengaturan kuis, dan tema) sebagai berkas JSON standar.
              </p>
              <button
                type="button"
                onClick={handleDownloadSchema}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-xs"
              >
                <Download className="w-4 h-4" />
                <span>Unduh File Schema ({form.questions.length} Pertanyaan)</span>
              </button>
            </div>
          )}
        </div>

        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-bold cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
