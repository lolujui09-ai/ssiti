'use client';
import { X, Check } from 'lucide-react';
import { FormTheme } from '@/types/schema';

interface ThemeModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: FormTheme;
  onUpdateTheme: (updated: FormTheme) => void;
}

const PRESET_COLORS = [
  { name: 'Ungu Klasik GForm', hex: '#673ab7' },
  { name: 'Indigo Modern', hex: '#4f46e5' },
  { name: 'Biru Samudera', hex: '#0284c7' },
  { name: 'Teal Hijau Laut', hex: '#0d9488' },
  { name: 'Hijau Zamrud', hex: '#16a34a' },
  { name: 'Amber Emas', hex: '#d97706' },
  { name: 'Merah Coral', hex: '#e11d48' },
  { name: 'Mawar Pink', hex: '#db2777' },
  { name: 'Slate Elegan', hex: '#334155' },
  { name: 'Hitam Pekat', hex: '#0f172a' },
];

export const ThemeModal = ({
  isOpen,
  onClose,
  theme,
  onUpdateTheme,
}: ThemeModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Opsi Tema Formulir</h3>
            <p className="text-xs text-slate-500">Sesuaikan warna aksen dan gaya visual</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 text-xs">
          {/* 1. Primary Header Color */}
          <div className="space-y-2">
            <label className="font-bold text-slate-800 block">Warna Aksen Utama</label>
            <div className="grid grid-cols-5 gap-3">
              {PRESET_COLORS.map((c) => {
                const isSelected = theme.primaryColor.toLowerCase() === c.hex.toLowerCase();
                return (
                  <button
                    key={c.hex}
                    type="button"
                    onClick={() => onUpdateTheme({ ...theme, primaryColor: c.hex })}
                    style={{ backgroundColor: c.hex }}
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white cursor-pointer hover:scale-105 transition-transform shadow-2xs relative"
                    title={c.name}
                  >
                    {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
                  </button>
                );
              })}
            </div>

            {/* Custom Hex input */}
            <div className="flex items-center gap-2 pt-1">
              <span className="text-slate-500">Warna Kustom:</span>
              <input
                type="color"
                value={theme.primaryColor}
                onChange={(e) => onUpdateTheme({ ...theme, primaryColor: e.target.value })}
                className="w-7 h-7 rounded border border-slate-200 cursor-pointer"
              />
              <span className="font-mono text-slate-700 font-semibold uppercase">
                {theme.primaryColor}
              </span>
            </div>
          </div>

          {/* 2. Background Canvas Tone */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="font-bold text-slate-800 block">Nuansa Latar Belakang</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'Abu Lembut', val: '#f8fafc' },
                { label: 'Putih Bersih', val: '#ffffff' },
                { label: 'Krem Hangat', val: '#fdfbf7' },
              ].map((bg) => (
                <button
                  key={bg.val}
                  type="button"
                  onClick={() => onUpdateTheme({ ...theme, backgroundColor: bg.val })}
                  className={`p-2.5 rounded-xl border text-center font-semibold cursor-pointer transition-colors ${
                    theme.backgroundColor === bg.val
                      ? 'border-indigo-600 bg-indigo-50/50 text-indigo-900'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  {bg.label}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Font Family */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="font-bold text-slate-800 block">Gaya Huruf (Font)</label>
            <select
              value={theme.fontFamily || 'Plus Jakarta Sans'}
              onChange={(e) => onUpdateTheme({ ...theme, fontFamily: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white text-slate-800 font-medium cursor-pointer"
            >
              <option value="Inter">Inter (Bawaan GForm Modern)</option>
              <option value="Roboto">Roboto (Google Classic)</option>
              <option value="Poppins">Poppins (Ramah &amp; Bulat)</option>
              <option value="Plus Jakarta Sans">Plus Jakarta Sans (Elegan)</option>
              <option value="Outfit">Outfit (Display Modern)</option>
            </select>
          </div>
        </div>

        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

