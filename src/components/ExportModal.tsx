import { useState } from 'react';
import { X, Copy, Check, Download, Code, FileText, FileCode, FileCode2 } from 'lucide-react';
import { FormSchema } from '../types/schema';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  schema: FormSchema | null;
  rawJson: string;
}

export const ExportModal = ({ isOpen, onClose, schema, rawJson }: ExportModalProps) => {
  const [exportType, setExportType] = useState<'json' | 'html' | 'react'>('json');
  const [copied, setCopied] = useState(false);

  if (!isOpen || !schema) return null;

  // Generate HTML standalone snippet
  const generateStandaloneHTML = () => {
    return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${schema.title}</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-50 text-slate-900 min-h-screen py-10 px-4">
  <div class="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
    <h1 class="text-2xl font-bold mb-2 text-slate-900">${schema.title}</h1>
    ${schema.description ? `<p class="text-slate-600 mb-6 text-sm">${schema.description}</p>` : ''}
    
    <form class="space-y-5" onsubmit="event.preventDefault(); alert('Form berhasil dikirim!');">
      ${schema.fields
        .map((f) => {
          if (f.type === 'textarea') {
            return `<div>
        <label class="block text-sm font-semibold mb-1">${f.label} ${f.required ? '<span class="text-red-500">*</span>' : ''}</label>
        <textarea name="${f.id}" rows="${f.rows || 4}" placeholder="${f.placeholder || ''}" ${f.required ? 'required' : ''} class="w-full border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500"></textarea>
      </div>`;
          }
          if (f.type === 'select') {
            return `<div>
        <label class="block text-sm font-semibold mb-1">${f.label} ${f.required ? '<span class="text-red-500">*</span>' : ''}</label>
        <select name="${f.id}" ${f.required ? 'required' : ''} class="w-full border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500">
          <option value="">-- Pilih salah satu --</option>
          ${f.options?.map((opt: any) => `<option value="${opt.value}">${opt.label}</option>`).join('\n          ') || ''}
        </select>
      </div>`;
          }
          if (f.type === 'file') {
            return `<div>
        <label class="block text-sm font-semibold mb-1">${f.label} ${f.required ? '<span class="text-red-500">*</span>' : ''}</label>
        <input type="file" name="${f.id}" accept="${f.accept || ''}" ${f.required ? 'required' : ''} class="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer" />
      </div>`;
          }
          return `<div>
        <label class="block text-sm font-semibold mb-1">${f.label} ${f.required ? '<span class="text-red-500">*</span>' : ''}</label>
        <input type="${f.type}" name="${f.id}" placeholder="${f.placeholder || ''}" ${f.required ? 'required' : ''} class="w-full border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500" />
      </div>`;
        })
        .join('\n      ')}

      <button type="submit" class="w-full bg-indigo-600 text-white font-semibold py-3 px-6 rounded-xl hover:bg-indigo-700 transition-colors">
        ${schema.submitButtonText || 'Kirim'}
      </button>
    </form>
  </div>
</body>
</html>`;
  };

  // Generate React Component snippet
  const generateReactSnippet = () => {
    return `import React, { useState } from 'react';

export const ${schema.title.replace(/[^a-zA-Z0-9]/g, '') || 'DynamicForm'} = () => {
  const [formData, setFormData] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Submitted Data:', formData);
    alert('Formulir berhasil dikirim!');
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
      <h2 className="text-2xl font-bold text-slate-900 mb-2">${schema.title}</h2>
      ${schema.description ? `<p className="text-slate-600 text-sm mb-6">${schema.description}</p>` : ''}
      
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Render fields from schema */}
        ${schema.fields
          .map(
            (f) => `<div>
          <label className="block text-sm font-semibold mb-1.5 text-slate-800">${f.label} ${f.required ? '*' : ''}</label>
          <input
            type="${f.type}"
            name="${f.id}"
            required={${Boolean(f.required)}}
            onChange={(e) => setFormData({ ...formData, ${f.id}: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
          />
        </div>`
          )
          .join('\n        ')}

        <button type="submit" className="w-full py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700">
          ${schema.submitButtonText || 'Kirim'}
        </button>
      </form>
    </div>
  );
};`;
  };

  const getExportContent = () => {
    if (exportType === 'json') return rawJson;
    if (exportType === 'html') return generateStandaloneHTML();
    return generateReactSnippet();
  };

  const currentContent = getExportContent();

  const handleCopy = () => {
    navigator.clipboard.writeText(currentContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const filename =
      exportType === 'json'
        ? `${schema.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_schema.json`
        : exportType === 'html'
        ? `${schema.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}.html`
        : `${schema.title.replace(/[^a-zA-Z0-9]/g, '') || 'DynamicForm'}.tsx`;

    const blob = new Blob([currentContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2">
            <Download className="w-5 h-5 text-indigo-600" />
            <h3 className="text-base font-bold text-slate-900">
              Export Schema & Kode Form
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="px-6 border-b border-slate-200 flex gap-4 text-xs font-semibold">
          <button
            onClick={() => setExportType('json')}
            className={`py-3 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
              exportType === 'json'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileCode2 className="w-4 h-4" />
            <span>Schema JSON</span>
          </button>
          <button
            onClick={() => setExportType('html')}
            className={`py-3 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
              exportType === 'html'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Standalone HTML</span>
          </button>
          <button
            onClick={() => setExportType('react')}
            className={`py-3 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
              exportType === 'react'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileCode className="w-4 h-4" />
            <span>React Component</span>
          </button>
        </div>

        {/* Content Box */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500">
              {exportType === 'json' && 'File JSON schema standar untuk dibagikan atau disimpan.'}
              {exportType === 'html' && 'File web HTML mandiri lengkap dengan styling Tailwind CSS.'}
              {exportType === 'react' && 'Komponen React TypeScript siap tempel ke codebase Anda.'}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Disalin!' : 'Salin'}</span>
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh File</span>
              </button>
            </div>
          </div>

          <pre className="p-4 rounded-xl bg-slate-900 text-slate-200 font-mono text-xs overflow-x-auto max-h-72 border border-slate-800 leading-relaxed">
            {currentContent}
          </pre>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
