import { useState, useEffect } from 'react';
import {
  Code2,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  ArrowRight,
  FileCode,
} from 'lucide-react';
import { FullFormSchema, ValidationResult } from '../../types/schema';
import { validateFormSchema } from '../../utils/schemaConverter';

interface SchemaViewProps {
  form: FullFormSchema;
  onApplySchema: (newForm: FullFormSchema) => void;
  onOpenPromptAI?: () => void;
}

export const SchemaView = ({
  form,
  onApplySchema,
}: SchemaViewProps) => {
  const [jsonText, setJsonText] = useState(() => JSON.stringify(form, null, 2));
  const [validation, setValidation] = useState<ValidationResult>(() =>
    validateFormSchema(JSON.stringify(form, null, 2))
  );
  const [copied, setCopied] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Sync when form changes externally
  useEffect(() => {
    const updated = JSON.stringify(form, null, 2);
    setJsonText(updated);
    setValidation(validateFormSchema(updated));
    setHasUnsavedChanges(false);
  }, [form]);

  const handleTextChange = (text: string) => {
    setJsonText(text);
    setHasUnsavedChanges(true);
    const result = validateFormSchema(text);
    setValidation(result);
  };

  const handleFormat = () => {
    try {
      const obj = JSON.parse(jsonText);
      const formatted = JSON.stringify(obj, null, 2);
      setJsonText(formatted);
      setValidation(validateFormSchema(formatted));
    } catch {
      // ignore syntax error
    }
  };

  const handleApply = () => {
    if (validation.isValid && validation.parsedSchema) {
      onApplySchema(validation.parsedSchema);
      setHasUnsavedChanges(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto pb-20 px-4 space-y-4">
      {/* Editor Controls Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-wrap items-center justify-between gap-3 text-xs shadow-2xs">
        <div className="flex items-center gap-2">
          {validation.isValid ? (
            <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 font-bold rounded-xl border border-emerald-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Schema Valid ({validation.parsedSchema?.questions?.length || 0} Pertanyaan)</span>
            </span>
          ) : (
            <span className="flex items-center gap-1.5 px-3 py-1 bg-rose-50 text-rose-700 font-bold rounded-xl border border-rose-200">
              <AlertCircle className="w-4 h-4 text-rose-600" />
              <span>Sintaks Belum Valid</span>
            </span>
          )}

          {hasUnsavedChanges && (
            <span className="text-amber-600 font-semibold px-2 py-0.5 bg-amber-50 rounded-lg">
              Ada perubahan belum diterapkan
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleFormat}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl cursor-pointer transition-colors"
          >
            Rapikan Format
          </button>

          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl cursor-pointer transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Tersalin' : 'Salin JSON'}</span>
          </button>

          <button
            type="button"
            onClick={handleApply}
            disabled={!validation.isValid}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold rounded-xl shadow-xs cursor-pointer transition-colors"
          >
            <span>Terapkan ke Form</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Validation Errors Box if any */}
      {!validation.isValid && validation.errors.length > 0 && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 space-y-2 text-xs text-rose-900 animate-in fade-in">
          <div className="font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600" />
            <span>Daftar Kesalahan Validasi:</span>
          </div>
          <ul className="list-disc pl-5 space-y-1">
            {validation.errors.map((err, idx) => (
              <li key={idx}>
                {err.message} {err.line ? `(Baris ${err.line})` : ''}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Code Textarea Area */}
      <div className="bg-slate-950 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
        <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
            <span className="ml-2 font-mono text-[11px] text-slate-300">schema.json</span>
          </div>
          <span className="font-mono text-[11px]">
            {jsonText.split('\n').length} baris kode
          </span>
        </div>

        <textarea
          rows={26}
          value={jsonText}
          onChange={(e) => handleTextChange(e.target.value)}
          spellCheck={false}
          className="w-full bg-slate-950 text-indigo-200 p-5 font-mono text-xs sm:text-sm leading-relaxed focus:outline-none resize-y selection:bg-indigo-900/60"
        />
      </div>
    </div>
  );
};
