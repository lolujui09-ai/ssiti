import { Layers, Trash2, ArrowRight } from 'lucide-react';
import { FormSection } from '../../types/schema';

interface SectionCardProps {
  section: FormSection;
  index: number;
  totalSections: number;
  allSections: FormSection[];
  onUpdate: (updated: FormSection) => void;
  onDelete: () => void;
  primaryColor?: string;
}

export const SectionCard = ({
  section,
  index,
  totalSections,
  allSections,
  onUpdate,
  onDelete,
  primaryColor = '#6366f1',
}: SectionCardProps) => {
  return (
    <div className="bg-white rounded-2xl border-t-4 border border-slate-200 shadow-xs p-6 mb-4 relative" style={{ borderTopColor: primaryColor }}>
      {/* Upper info */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span
            style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}
            className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>
              Bagian {index + 1} dari {totalSections}
            </span>
          </span>
        </div>

        {totalSections > 1 && (
          <button
            type="button"
            onClick={onDelete}
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
            title="Hapus bagian ini (pertanyaan akan dipindahkan ke bagian sebelumnya)"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Editable Title */}
      <input
        type="text"
        value={section.title}
        onChange={(e) => onUpdate({ ...section, title: e.target.value })}
        placeholder="Judul Bagian..."
        className="w-full text-xl font-bold text-slate-900 border-b border-transparent hover:border-slate-200 focus:border-indigo-600 focus:outline-none pb-1 transition-colors mb-2"
      />

      {/* Editable Description */}
      <textarea
        rows={2}
        value={section.description || ''}
        onChange={(e) => onUpdate({ ...section, description: e.target.value })}
        placeholder="Deskripsi bagian (opsional)..."
        className="w-full text-xs sm:text-sm text-slate-500 border-b border-transparent hover:border-slate-200 focus:border-indigo-600 focus:outline-none pb-1 resize-y bg-transparent"
      />

      {/* Next Action Selection (Google Forms Section Flow) */}
      {totalSections > 1 && index < totalSections - 1 && (
        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <span className="text-slate-500 font-medium flex items-center gap-1.5">
            <ArrowRight className="w-3.5 h-3.5 text-indigo-600" />
            <span>Setelah Bagian {index + 1}:</span>
          </span>
          <select
            value={section.targetSectionId || section.nextAction || 'next'}
            onChange={(e) => {
              const val = e.target.value;
              if (val === 'next' || val === 'submit') {
                onUpdate({ ...section, nextAction: val, targetSectionId: undefined });
              } else {
                onUpdate({ ...section, nextAction: 'go_to_section', targetSectionId: val });
              }
            }}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 font-semibold cursor-pointer"
          >
            <option value="next">Lanjutkan ke bagian berikutnya</option>
            {allSections.map((s, sIdx) => {
              if (s.id === section.id) return null;
              return (
                <option key={s.id} value={s.id}>
                  Buka bagian {sIdx + 1} ({s.title})
                </option>
              );
            })}
            <option value="submit">Kirim formulir</option>
          </select>
        </div>
      )}
    </div>
  );
};
