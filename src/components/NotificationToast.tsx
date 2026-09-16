import React, { useEffect } from 'react';
import { Bell, X, Sparkles, ChevronRight } from 'lucide-react';

interface NotificationToastProps {
  show: boolean;
  title: string;
  body: string;
  onClose: () => void;
  onActionClick?: () => void;
  soundEnabled?: boolean;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({
  show,
  title,
  body,
  onClose,
  onActionClick,
  soundEnabled = true,
}) => {
  useEffect(() => {
    if (show && soundEnabled) {
      // Gentle chime using Web Audio API so no external asset is needed
      try {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioContextClass) {
          const ctx = new AudioContextClass();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          
          osc.type = 'sine';
          osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
          osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5
          
          gain.gain.setValueAtTime(0.12, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
          
          osc.connect(gain);
          gain.connect(ctx.destination);
          
          osc.start();
          osc.stop(ctx.currentTime + 0.6);
        }
      } catch (e) {
        console.warn('Audio chime note:', e);
      }
    }
  }, [show, soundEnabled]);

  if (!show) return null;

  return (
    <div 
      role="alert"
      className="fixed top-20 right-4 left-4 sm:left-auto sm:w-96 z-50 animate-in slide-in-from-top-4 duration-300"
    >
      <div className="bg-slate-900/95 text-white p-4 rounded-2xl border border-amber-400/50 shadow-2xl backdrop-blur-md flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center shrink-0 mt-0.5">
          <Bell className="w-5 h-5 animate-bounce" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-400">
              Notifikasi Terjadwal
            </span>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-md"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <h4 className="text-xs font-bold text-white mt-0.5 leading-snug">
            {title}
          </h4>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed line-clamp-2">
            {body}
          </p>

          {onActionClick && (
            <button
              onClick={() => {
                onActionClick();
                onClose();
              }}
              className="mt-2 text-[11px] font-bold text-amber-300 hover:text-amber-200 flex items-center gap-1"
            >
              <span>Buka Informasi Ini</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
