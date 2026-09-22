import { useState, useRef, ChangeEvent, FormEvent } from 'react';
import {
  Monitor,
  Tablet,
  Smartphone,
  UploadCloud,
  File,
  X,
  AlertCircle,
  Send,
  RotateCcw,
  Sparkles,
  Info,
  Calendar,
  Hash,
  Mail,
  Type,
  FileText,
  ListFilter,
  CheckSquare,
  CircleDot,
  Paperclip,
  CheckCircle,
} from 'lucide-react';
import { FormSchema, FormField } from '../types/schema';

interface FormPreviewProps {
  schema: FormSchema | null;
  onSubmitSuccess: (data: Record<string, any>) => void;
}

export const FormPreview = ({ schema, onSubmitSuccess }: FormPreviewProps) => {
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [fileData, setFileData] = useState<Record<string, { name: string; size: string; type: string }>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  // Reset internal states when schema changes
  const handleResetForm = () => {
    setFormData({});
    setFileData({});
    setErrors({});
    setIsSubmitted(false);
  };

  const handleInputChange = (fieldId: string, value: any) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }));
    // Clear error for field if user edited it
    if (errors[fieldId]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[fieldId];
        return next;
      });
    }
  };

  const handleCheckboxMultiChange = (fieldId: string, optionValue: string, checked: boolean) => {
    const currentList: string[] = Array.isArray(formData[fieldId]) ? formData[fieldId] : [];
    let updatedList: string[];
    if (checked) {
      updatedList = [...currentList, optionValue];
    } else {
      updatedList = currentList.filter((item) => item !== optionValue);
    }
    handleInputChange(fieldId, updatedList);
  };

  const handleFileUpload = (fieldId: string, file: globalThis.File | null) => {
    if (!file) {
      setFormData((prev) => {
        const next = { ...prev };
        delete next[fieldId];
        return next;
      });
      setFileData((prev) => {
        const next = { ...prev };
        delete next[fieldId];
        return next;
      });
      return;
    }

    const fileSizeKB = (file.size / 1024).toFixed(1);
    const sizeStr = file.size > 1024 * 1024 ? `${(file.size / (1024 * 1024)).toFixed(2)} MB` : `${fileSizeKB} KB`;

    setFileData((prev) => ({
      ...prev,
      [fieldId]: {
        name: file.name,
        size: sizeStr,
        type: file.type || 'Dokumen',
      },
    }));

    handleInputChange(fieldId, `[File: ${file.name} (${sizeStr})]`);
  };

  const validateForm = (): boolean => {
    if (!schema) return false;
    const newErrors: Record<string, string> = {};

    schema.fields.forEach((field) => {
      const val = formData[field.id];

      // Required validation
      if (field.required) {
        if (field.type === 'checkbox' && field.options && field.options.length > 0) {
          if (!val || !Array.isArray(val) || val.length === 0) {
            newErrors[field.id] = `Wajib memilih minimal satu opsi.`;
          }
        } else if (field.type === 'checkbox' && (!field.options || field.options.length === 0)) {
          if (!val) {
            newErrors[field.id] = `Anda harus mencentang persetujuan ini.`;
          }
        } else if (field.type === 'file') {
          if (!val) {
            newErrors[field.id] = `Wajib mengunggah file.`;
          }
        } else if (val === undefined || val === null || String(val).trim() === '') {
          newErrors[field.id] = `${field.label} wajib diisi.`;
        }
      }

      // Type-specific validations
      if (val !== undefined && val !== null && String(val).trim() !== '') {
        if (field.type === 'email') {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(String(val))) {
            newErrors[field.id] = 'Format alamat email tidak valid.';
          }
        }

        if (field.type === 'number') {
          const num = Number(val);
          if (isNaN(num)) {
            newErrors[field.id] = 'Harus berupa angka valid.';
          } else {
            if (field.min !== undefined && num < field.min) {
              newErrors[field.id] = `Nilai minimal adalah ${field.min}.`;
            }
            if (field.max !== undefined && num > field.max) {
              newErrors[field.id] = `Nilai maksimal adalah ${field.max}.`;
            }
          }
        }

        if (field.type === 'text' || field.type === 'textarea') {
          const str = String(val);
          if (field.minLength !== undefined && str.length < field.minLength) {
            newErrors[field.id] = `Minimal ${field.minLength} karakter (saat ini ${str.length}).`;
          }
          if (field.maxLength !== undefined && str.length > field.maxLength) {
            newErrors[field.id] = `Maksimal ${field.maxLength} karakter.`;
          }
          if (field.pattern) {
            try {
              const reg = new RegExp(field.pattern);
              if (!reg.test(str)) {
                newErrors[field.id] = 'Format isian tidak sesuai pola yang ditentukan.';
              }
            } catch (e) {
              // Ignore regex parse failure
            }
          }
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitted(true);
      onSubmitSuccess(formData);
    }
  };

  if (!schema) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 bg-slate-50 border border-slate-200 rounded-2xl text-center">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-500 mb-4 shadow-xs">
          <Sparkles className="w-8 h-8" />
        </div>
        <h3 className="text-base sm:text-lg font-bold text-slate-800">
          Belum Ada Form yang Aktif
        </h3>
        <p className="text-sm text-slate-500 max-w-md mt-1 mb-6">
          Paste schema JSON yang valid pada editor di sebelah kiri, atau muat salah satu template contoh untuk melihat preview form.
        </p>
      </div>
    );
  }

  // Device container styling
  const deviceContainerClass =
    device === 'mobile'
      ? 'max-w-[420px] shadow-2xl border-slate-300'
      : device === 'tablet'
      ? 'max-w-[720px] shadow-xl border-slate-200'
      : 'max-w-2xl shadow-xs border-slate-200';

  return (
    <div className="flex flex-col h-full bg-slate-100/70 border border-slate-200 rounded-2xl overflow-hidden">
      {/* Top Preview Bar */}
      <div className="px-4 py-2.5 bg-white border-b border-slate-200 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Preview Interaktif
          </span>
          <span className="hidden sm:inline text-xs text-slate-400">•</span>
          <span className="hidden sm:inline text-xs text-slate-600 font-medium truncate max-w-[200px]">
            {schema.title}
          </span>
        </div>

        {/* Device View Switcher */}
        <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
          <button
            onClick={() => setDevice('desktop')}
            className={`p-1.5 rounded-md transition-colors cursor-pointer ${
              device === 'desktop' ? 'bg-white text-indigo-600 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
            }`}
            title="Tampilan Desktop"
          >
            <Monitor className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDevice('tablet')}
            className={`p-1.5 rounded-md transition-colors cursor-pointer ${
              device === 'tablet' ? 'bg-white text-indigo-600 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
            }`}
            title="Tampilan Tablet (720px)"
          >
            <Tablet className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDevice('mobile')}
            className={`p-1.5 rounded-md transition-colors cursor-pointer ${
              device === 'mobile' ? 'bg-white text-indigo-600 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
            }`}
            title="Tampilan Mobile (420px)"
          >
            <Smartphone className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Preview Scrollable Canvas */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 flex justify-center items-start">
        <div
          className={`w-full transition-all duration-300 bg-white rounded-2xl border p-6 sm:p-8 ${deviceContainerClass}`}
        >
          {/* Form Header */}
          <div className="border-b border-slate-100 pb-5 mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              {schema.title}
            </h2>
            {schema.description && (
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                {schema.description}
              </p>
            )}
          </div>

          {/* Dynamic Form Body */}
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              {schema.fields.map((field, idx) => {
                const isHalf = field.colSpan === 1;
                const colClass = isHalf ? 'sm:col-span-1' : 'sm:col-span-2';
                const fieldError = errors[field.id];
                const value = formData[field.id] ?? '';

                return (
                  <div key={field.id || idx} className={`${colClass} flex flex-col`}>
                    {/* Field Label & Required Asterisk */}
                    {field.type !== 'checkbox' || (field.options && field.options.length > 0) ? (
                      <label
                        htmlFor={`input-${field.id}`}
                        className="text-xs sm:text-sm font-semibold text-slate-800 mb-1.5 flex items-center justify-between"
                      >
                        <span className="flex items-center gap-1">
                          {field.label}
                          {field.required && (
                            <span className="text-rose-500 font-bold" title="Wajib diisi">
                              *
                            </span>
                          )}
                        </span>
                        {field.maxLength && (
                          <span className="text-[11px] text-slate-400 font-normal">
                            Maks {field.maxLength}
                          </span>
                        )}
                      </label>
                    ) : null}

                    {/* FIELD TYPE: TEXT / EMAIL / NUMBER / DATE / TEL / URL / PASSWORD / TIME */}
                    {[
                      'text',
                      'email',
                      'number',
                      'date',
                      'tel',
                      'url',
                      'password',
                      'time',
                    ].includes(field.type) && (
                      <div className="relative">
                        <input
                          id={`input-${field.id}`}
                          type={field.type}
                          value={value}
                          min={field.min}
                          max={field.max}
                          minLength={field.minLength}
                          maxLength={field.maxLength}
                          placeholder={field.placeholder || ''}
                          onChange={(e) => handleInputChange(field.id, e.target.value)}
                          className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-900 bg-white placeholder:text-slate-400 transition-all focus:outline-none focus:ring-2 ${
                            fieldError
                              ? 'border-rose-400 focus:ring-rose-200 focus:border-rose-500'
                              : 'border-slate-200 focus:ring-indigo-100 focus:border-indigo-600'
                          }`}
                        />
                      </div>
                    )}

                    {/* FIELD TYPE: TEXTAREA */}
                    {field.type === 'textarea' && (
                      <textarea
                        id={`input-${field.id}`}
                        rows={field.rows || 4}
                        value={value}
                        minLength={field.minLength}
                        maxLength={field.maxLength}
                        placeholder={field.placeholder || ''}
                        onChange={(e) => handleInputChange(field.id, e.target.value)}
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-900 bg-white placeholder:text-slate-400 transition-all focus:outline-none focus:ring-2 resize-y ${
                          fieldError
                            ? 'border-rose-400 focus:ring-rose-200 focus:border-rose-500'
                            : 'border-slate-200 focus:ring-indigo-100 focus:border-indigo-600'
                        }`}
                      />
                    )}

                    {/* FIELD TYPE: SELECT */}
                    {field.type === 'select' && (
                      <div className="relative">
                        <select
                          id={`input-${field.id}`}
                          value={value}
                          onChange={(e) => handleInputChange(field.id, e.target.value)}
                          className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-900 bg-white transition-all focus:outline-none focus:ring-2 appearance-none cursor-pointer ${
                            fieldError
                              ? 'border-rose-400 focus:ring-rose-200 focus:border-rose-500'
                              : 'border-slate-200 focus:ring-indigo-100 focus:border-indigo-600'
                          }`}
                        >
                          <option value="">
                            {field.placeholder || '-- Pilih salah satu opsi --'}
                          </option>
                          {field.options?.map((opt: any, optIdx: number) => (
                            <option key={optIdx} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                          <ListFilter className="w-4 h-4" />
                        </div>
                      </div>
                    )}

                    {/* FIELD TYPE: RADIO */}
                    {field.type === 'radio' && (
                      <div className="space-y-2 mt-1">
                        {field.options?.map((opt: any, optIdx: number) => {
                          const isChecked = String(value) === String(opt.value);
                          return (
                            <label
                              key={optIdx}
                              className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                                isChecked
                                  ? 'bg-indigo-50/70 border-indigo-300 text-indigo-950 font-medium'
                                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                              }`}
                            >
                              <input
                                type="radio"
                                name={field.id}
                                value={opt.value}
                                checked={isChecked}
                                onChange={() => handleInputChange(field.id, opt.value)}
                                className="w-4 h-4 text-indigo-600 border-slate-300 focus:ring-indigo-500"
                              />
                              <span className="text-xs sm:text-sm">{opt.label}</span>
                            </label>
                          );
                        })}
                      </div>
                    )}

                    {/* FIELD TYPE: CHECKBOX */}
                    {field.type === 'checkbox' && (
                      <div>
                        {field.options && field.options.length > 0 ? (
                          /* Multi-choice checkbox list */
                          <div className="space-y-2 mt-1">
                            {field.options.map((opt: any, optIdx: number) => {
                              const checkedList: string[] = Array.isArray(value) ? value : [];
                              const isChecked = checkedList.includes(String(opt.value));

                              return (
                                <label
                                  key={optIdx}
                                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                                    isChecked
                                      ? 'bg-indigo-50/70 border-indigo-300 text-indigo-950 font-medium'
                                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                                  }`}
                                >
                                  <input
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={(e) =>
                                      handleCheckboxMultiChange(
                                        field.id,
                                        String(opt.value),
                                        e.target.checked
                                      )
                                    }
                                    className="w-4 h-4 rounded text-indigo-600 border-slate-300 focus:ring-indigo-500"
                                  />
                                  <span className="text-xs sm:text-sm">{opt.label}</span>
                                </label>
                              );
                            })}
                          </div>
                        ) : (
                          /* Single agreement boolean checkbox */
                          <label
                            className={`flex items-start gap-3 p-3.5 rounded-xl border transition-all cursor-pointer ${
                              value
                                ? 'bg-indigo-50/70 border-indigo-300 text-indigo-950 font-medium'
                                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={Boolean(value)}
                              onChange={(e) => handleInputChange(field.id, e.target.checked)}
                              className="w-4 h-4 mt-0.5 rounded text-indigo-600 border-slate-300 focus:ring-indigo-500 shrink-0"
                            />
                            <span className="text-xs sm:text-sm leading-relaxed">
                              {field.label}
                              {field.required && (
                                <span className="text-rose-500 font-bold ml-1">*</span>
                              )}
                            </span>
                          </label>
                        )}
                      </div>
                    )}

                    {/* FIELD TYPE: FILE UPLOAD */}
                    {field.type === 'file' && (
                      <div className="mt-1">
                        <input
                          ref={(el) => {
                            fileInputRefs.current[field.id] = el;
                          }}
                          id={`input-${field.id}`}
                          type="file"
                          accept={field.accept}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            const file = e.target.files?.[0] || null;
                            handleFileUpload(field.id, file);
                          }}
                          className="hidden"
                        />

                        {fileData[field.id] ? (
                          /* Uploaded File Pill Card */
                          <div className="flex items-center justify-between p-3 rounded-xl border border-indigo-200 bg-indigo-50/60">
                            <div className="flex items-center gap-2.5 overflow-hidden">
                              <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0">
                                <File className="w-4 h-4" />
                              </div>
                              <div className="overflow-hidden text-left">
                                <p className="text-xs font-semibold text-slate-800 truncate">
                                  {fileData[field.id].name}
                                </p>
                                <p className="text-[11px] text-slate-500">
                                  {fileData[field.id].size} • {fileData[field.id].type}
                                </p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                if (fileInputRefs.current[field.id]) {
                                  fileInputRefs.current[field.id]!.value = '';
                                }
                                handleFileUpload(field.id, null);
                              }}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-white rounded-lg transition-colors cursor-pointer"
                              title="Hapus file"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          /* Drag and Drop Zone */
                          <div
                            onClick={() => fileInputRefs.current[field.id]?.click()}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => {
                              e.preventDefault();
                              const file = e.dataTransfer.files?.[0] || null;
                              if (file) handleFileUpload(field.id, file);
                            }}
                            className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all hover:bg-slate-50 ${
                              fieldError
                                ? 'border-rose-300 bg-rose-50/30'
                                : 'border-slate-200 hover:border-indigo-400'
                            }`}
                          >
                            <UploadCloud className="w-8 h-8 mx-auto text-indigo-500 mb-1.5" />
                            <p className="text-xs sm:text-sm font-semibold text-slate-700">
                              Klik atau seret file ke sini untuk mengunggah
                            </p>
                            <p className="text-[11px] text-slate-400 mt-0.5">
                              {field.accept
                                ? `Menerima format: ${field.accept}`
                                : 'Format bebas (dokumen, gambar, pdf)'}
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Helper text */}
                    {field.helperText && (
                      <p className="text-[11px] text-slate-500 mt-1.5 flex items-center gap-1">
                        <Info className="w-3 h-3 text-slate-400 shrink-0" />
                        <span>{field.helperText}</span>
                      </p>
                    )}

                    {/* Inline Error Message */}
                    {fieldError && (
                      <p className="text-xs font-medium text-rose-600 mt-1.5 flex items-center gap-1 animate-in fade-in">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{fieldError}</span>
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Form Submit & Reset Buttons */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-end gap-3">
              {schema.showResetButton && (
                <button
                  type="button"
                  onClick={handleResetForm}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-sm font-medium transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <RotateCcw className="w-4 h-4 text-slate-400" />
                  <span>{schema.resetButtonText || 'Reset Isian'}</span>
                </button>
              )}

              <button
                type="submit"
                id="btn-submit-preview-form"
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-sm font-semibold shadow-sm shadow-indigo-200 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>{schema.submitButtonText || 'Kirim Formulir'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
