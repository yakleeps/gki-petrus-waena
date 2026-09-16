import React from 'react';
import { AccessibilitySettings } from '../types';
import { Eye, Volume2, Type, Sparkles, Users } from 'lucide-react';

interface AccessibilityToolbarProps {
  settings: AccessibilitySettings;
  onChange: (newSettings: AccessibilitySettings) => void;
  onReadPage: () => void;
  isReading: boolean;
  onStopReading: () => void;
  onNavigate?: (tab: string) => void;
}

export const AccessibilityToolbar: React.FC<AccessibilityToolbarProps> = ({
  settings,
  onChange,
  onReadPage,
  isReading,
  onStopReading,
  onNavigate,
}) => {
  return (
    <aside
      aria-label="Panel Aksesibilitas Ramah Lansia"
      id="accessibility-toolbar"
      className="bg-amber-500 text-slate-950 px-4 py-2 text-sm shadow-inner transition-colors duration-200"
    >
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Left side: Elderly friendly badge & quick Data Jemaat shortcut */}
        <div className="flex items-center flex-wrap gap-2 font-medium">
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-950 text-amber-400 font-bold text-xs">
            ♿
          </span>
          <span className="font-semibold tracking-wide">
            Mode Aksesibilitas & Ramah Lansia
          </span>
          <span className="hidden sm:inline text-xs text-slate-900 bg-amber-400/80 px-2 py-0.5 rounded font-mono">
            Bagi Oma, Opa & Warga Jemaat
          </span>
          {onNavigate && (
            <button
              id="toolbar-data-jemaat-shortcut-btn"
              onClick={() => onNavigate('data-jemaat')}
              className="ml-1 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-950 text-amber-400 hover:bg-slate-900 text-xs font-bold transition-all shadow-xs"
              title="Akses Langsung Data Jemaat 12 Rayon"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Data Jemaat (12 Rayon)</span>
            </button>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center flex-wrap gap-2 sm:gap-4">
          {/* Font size control */}
          <div className="flex items-center bg-amber-600/30 rounded-lg p-1 border border-amber-600/40">
            <span className="text-xs font-semibold px-2 flex items-center gap-1">
              <Type className="w-3.5 h-3.5" />
              Ukuran Huruf:
            </span>
            <button
              id="font-size-normal-btn"
              onClick={() => onChange({ ...settings, fontSize: 'normal' })}
              className={`px-2.5 py-1 rounded text-xs font-bold transition-all ${
                settings.fontSize === 'normal'
                  ? 'bg-slate-950 text-amber-400 shadow-sm'
                  : 'text-slate-900 hover:bg-amber-400/60'
              }`}
              title="Huruf Standar"
            >
              A
            </button>
            <button
              id="font-size-large-btn"
              onClick={() => onChange({ ...settings, fontSize: 'large' })}
              className={`px-2.5 py-1 rounded text-sm font-bold transition-all ${
                settings.fontSize === 'large'
                  ? 'bg-slate-950 text-amber-400 shadow-sm'
                  : 'text-slate-900 hover:bg-amber-400/60'
              }`}
              title="Huruf Besar (Lebih Jelas)"
            >
              A+
            </button>
            <button
              id="font-size-xlarge-btn"
              onClick={() => onChange({ ...settings, fontSize: 'xlarge' })}
              className={`px-2.5 py-1 rounded text-base font-bold transition-all ${
                settings.fontSize === 'xlarge'
                  ? 'bg-slate-950 text-amber-400 shadow-sm'
                  : 'text-slate-900 hover:bg-amber-400/60'
              }`}
              title="Huruf Sangat Besar (Untuk Lansia)"
            >
              A++
            </button>
          </div>

          {/* High Contrast Toggle */}
          <button
            id="toggle-contrast-btn"
            onClick={() => onChange({ ...settings, highContrast: !settings.highContrast })}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
              settings.highContrast
                ? 'bg-slate-950 text-amber-300 border-slate-950 ring-2 ring-amber-300'
                : 'bg-amber-400/60 hover:bg-amber-400 text-slate-950 border-amber-600/40'
            }`}
            title="Kontras Tinggi agar teks terbaca tajam"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{settings.highContrast ? 'Kontras: Aktif' : 'Kontras Tinggi'}</span>
          </button>

          {/* Voice Reader for Elderly */}
          {isReading ? (
            <button
              id="stop-reading-btn"
              onClick={onStopReading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-600 text-white animate-pulse shadow-sm"
              title="Hentikan Pembacaan Suara"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Berhenti Membaca ⏹</span>
            </button>
          ) : (
            <button
              id="start-reading-btn"
              onClick={onReadPage}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-950 text-amber-300 hover:bg-slate-900 border border-slate-900 shadow-sm transition-all"
              title="Dengarkan Suara Pembaca Teks untuk Lansia"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Dengarkan Renungan 🔊</span>
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};
