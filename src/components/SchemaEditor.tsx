import { useState, useRef, useEffect } from 'react';
import {
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Copy,
  ClipboardPaste,
  Sparkles,
  AlignLeft,
  Trash2,
  Check,
  FileCode2,
} from 'lucide-react';
import { ValidationResult } from '../types/schema';

interface SchemaEditorProps {
  rawJson: string;
  onChange: (value: string) => void;
  validation: ValidationResult;
  onFormat: () => void;
  onClear: () => void;
  onPaste: () => void;
}

export const SchemaEditor = ({
  rawJson,
  onChange,
  validation,
  onFormat,
  onClear,
}: SchemaEditorProps) => {
  const [copied, setCopied] = useState(false);
  const [pasteSuccess, setPasteSuccess] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);

  // Compute line numbers
  const lines = rawJson.split('\n');
  const lineCount = Math.max(lines.length, 1);

  // Sync scroll between textarea and line numbers
  const handleScroll = () => {
    if (textareaRef.current && lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(rawJson);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        onChange(text);
        setPasteSuccess(true);
        setTimeout(() => setPasteSuccess(false), 2000);
      }
    } catch (err) {
      // Fallback: focus textarea for user to Ctrl+V
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }
  };

  return (
    <div className="flex flex-col h-full bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
      {/* Editor Header / Tooling Bar */}
      <div className="px-4 py-3 bg-slate-50/80 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 font-medium text-xs sm:text-sm text-slate-800">
            <FileCode2 className="w-4 h-4 text-indigo-600" />
            <span>Schema JSON Editor</span>
          </div>

          {/* Dynamic Validation Status Pill */}
          {validation.isValid ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Valid ({validation.parsedSchema?.fields?.length || 0} Field)</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{validation.errors.length} Masalah Schema</span>
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            id="btn-format-json"
            onClick={onFormat}
            disabled={!rawJson.trim()}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            title="Rapikan format spasi dan indentasi JSON (Beautify)"
          >
            <AlignLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Format JSON</span>
          </button>

          <button
            id="btn-paste-clipboard"
            onClick={handlePasteFromClipboard}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium text-indigo-700 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200/80 transition-colors cursor-pointer"
            title="Paste schema JSON yang disalin dari AI (ChatGPT/Claude/Gemini)"
          >
            {pasteSuccess ? (
              <>
                <Check className="w-3.5 h-3.5 text-indigo-600" />
                <span>Ditempel!</span>
              </>
            ) : (
              <>
                <ClipboardPaste className="w-3.5 h-3.5" />
                <span className="font-semibold">Paste dari AI</span>
              </>
            )}
          </button>

          <button
            id="btn-copy-json"
            onClick={handleCopy}
            disabled={!rawJson.trim()}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            title="Salin isi schema ke clipboard"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-600">Disalin!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Salin</span>
              </>
            )}
          </button>

          <button
            id="btn-clear-editor"
            onClick={onClear}
            disabled={!rawJson.trim()}
            className="p-1.5 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
            title="Bersihkan editor"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Editor Main Canvas with Line Numbers */}
      <div className="relative flex-1 min-h-[380px] flex overflow-hidden bg-slate-900 text-slate-100 font-mono text-xs sm:text-sm">
        {/* Line Numbers Column */}
        <div
          ref={lineNumbersRef}
          className="w-12 select-none py-3 pr-2 text-right bg-slate-950/60 text-slate-600 border-r border-slate-800/80 font-mono overflow-hidden"
          aria-hidden="true"
        >
          {Array.from({ length: lineCount }).map((_, i) => (
            <div key={i} className="leading-6 h-6">
              {i + 1}
            </div>
          ))}
        </div>

        {/* Textarea Input */}
        <textarea
          ref={textareaRef}
          id="textarea-schema-json"
          value={rawJson}
          onChange={(e) => onChange(e.target.value)}
          onScroll={handleScroll}
          spellCheck={false}
          className="flex-1 w-full h-full p-3 bg-transparent text-slate-100 placeholder:text-slate-600 font-mono resize-none focus:outline-none leading-6 overflow-auto selection:bg-indigo-700/40"
          placeholder={`Paste schema JSON dari AI di sini...\nContoh:\n{\n  "title": "Form Pendaftaran",\n  "fields": [\n    { "id": "nama", "type": "text", "label": "Nama" }\n  ]\n}`}
        />
      </div>

      {/* Real-time Validation Feedback Drawer */}
      <div className="border-t border-slate-200 bg-white">
        {!validation.isValid ? (
          <div className="p-3.5 bg-rose-50/70 border-b border-rose-100">
            <div className="flex items-center gap-2 text-rose-800 text-xs font-bold uppercase tracking-wider mb-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>Validasi Schema Gagal ({validation.errors.length} Kesalahan)</span>
            </div>
            <ul className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
              {validation.errors.map((err, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2 text-xs text-rose-700 bg-white/80 p-2 rounded-lg border border-rose-200/80 shadow-2xs"
                >
                  <span className="font-semibold px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 text-[10px] shrink-0 mt-0.5">
                    {err.line ? `Baris ${err.line}` : err.fieldId ? `ID: ${err.fieldId}` : `Error #${idx + 1}`}
                  </span>
                  <span className="leading-relaxed">{err.message}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : validation.warnings.length > 0 ? (
          <div className="p-3 bg-amber-50/70 border-b border-amber-100">
            <div className="flex items-center gap-2 text-amber-800 text-xs font-semibold uppercase tracking-wider mb-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Peringatan / Saran Schema ({validation.warnings.length})</span>
            </div>
            <ul className="space-y-1 max-h-28 overflow-y-auto pr-1">
              {validation.warnings.map((warn, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2 text-xs text-amber-800 bg-white/70 p-1.5 rounded border border-amber-200/60"
                >
                  <span className="text-[11px] leading-relaxed">{warn.message}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="px-4 py-2.5 bg-emerald-50/50 flex items-center justify-between text-xs text-emerald-800">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>
                Schema terverifikasi dan memenuhi standar. Form berhasil digenerate di panel preview!
              </span>
            </div>
            <span className="text-[11px] text-emerald-600 font-medium hidden sm:inline">
              Siap diuji
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
