import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  BellRing, 
  ChevronRight, 
  Heart, 
  FileCheck2, 
  Share2,
  Volume2
} from 'lucide-react';
import { WorshipSchedule } from '../types';

interface HeroBannerProps {
  onNavigate: (tab: string) => void;
  nextSchedule: WorshipSchedule;
  onOpenWhatsAppReminder: (schedule: WorshipSchedule) => void;
  onOpenNotificationModal: () => void;
  onReadVerse: (text: string) => void;
  isHighContrast: boolean;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onNavigate,
  nextSchedule,
  onOpenWhatsAppReminder,
  onOpenNotificationModal,
  onReadVerse,
  isHighContrast,
}) => {
  // Real-time simulated countdown to upcoming Sunday Service
  const [timeLeft, setTimeLeft] = useState({
    days: 2,
    hours: 14,
    minutes: 32,
    seconds: 45,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return { days: 6, hours: 23, minutes: 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const verseText = "Tetapi kamulah bangsa yang terpilih, imamat yang rajani, bangsa yang kudus, umat kepunyaan Allah sendiri, supaya kamu memberitakan perbuatan-perbuatan yang besar dari Dia. (1 Petrus 2:9)";

  return (
    <div className={`relative overflow-hidden ${isHighContrast ? 'bg-zinc-950 text-white border-b-2 border-amber-400' : 'bg-gradient-to-b from-blue-950 via-slate-900 to-blue-900 text-white'}`}>
      {/* Background Decorative Pattern with subtle warm lighting */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16 relative z-10">
        {/* Urgent Announcement Alert Banner */}
        <div className="mb-8 inline-flex items-center gap-2 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 px-4 py-2 rounded-full text-xs sm:text-sm text-amber-200 backdrop-blur-md transition-all">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
          <span className="font-bold text-amber-300">WARTA PENTING:</span>
          <span>Pendaftaran Sakramen Baptisan Kudus Triwulan III telah dibuka.</span>
          <button 
            onClick={() => onNavigate('baptisan')}
            className="underline font-semibold text-white ml-1 hover:text-amber-300 flex items-center"
          >
            Daftar <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Main Titles */}
          <div className="lg:col-span-7 space-y-5">
            <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm tracking-wide">
              <span>⛪</span>
              <span>Gereja Kristen Injili di Tanah Papua — Jemaat Petrus Waena</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight font-serif">
              Membangun Persekutuan, Melayani dengan Kasih Kristus
            </h2>

            {/* Daily Scripture Box with Voice Read support */}
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 relative group">
              <div className="flex items-center justify-between text-xs text-amber-300 font-bold mb-1.5 uppercase tracking-wider">
                <span>Nats Harian & Renungan</span>
                <button
                  onClick={() => onReadVerse(verseText)}
                  className="flex items-center gap-1 text-[11px] bg-white/20 hover:bg-white/30 text-white px-2 py-0.5 rounded-md transition-colors"
                  title="Dengarkan Nats Alkitab (Bantuan Suara)"
                >
                  <Volume2 className="w-3.5 h-3.5 text-amber-300" />
                  <span>Dengarkan</span>
                </button>
              </div>
              <p className="text-sm sm:text-base italic text-slate-100 leading-relaxed">
                "{verseText}"
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                id="hero-jadwal-cta"
                onClick={() => onNavigate('jadwal')}
                className="flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-5 py-3 rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5"
              >
                <Calendar className="w-4 h-4 text-slate-950" />
                <span>Lihat Jadwal Ibadah & Sektor</span>
              </button>

              <button
                id="hero-donasi-cta"
                onClick={() => onNavigate('donasi')}
                className="flex items-center gap-2 bg-white/15 hover:bg-white/25 text-white font-semibold px-5 py-3 rounded-xl border border-white/20 transition-all"
              >
                <Heart className="w-4 h-4 text-rose-400" />
                <span>Persembahan & Donasi</span>
              </button>

              <button
                id="hero-notif-cta"
                onClick={onOpenNotificationModal}
                className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white px-3 py-2 rounded-lg hover:bg-white/10"
              >
                <BellRing className="w-3.5 h-3.5 text-amber-400" />
                <span>Pengaturan Notifikasi</span>
              </button>
            </div>
          </div>

          {/* Right Card: Countdown to Next Service & Real-time Info */}
          <div className="lg:col-span-5">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-2xl text-white">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div>
                  <span className="text-[11px] font-extrabold uppercase tracking-widest text-amber-400">
                    Ibadah Terdekat
                  </span>
                  <h3 className="text-xl font-bold text-white mt-0.5">
                    {nextSchedule.title}
                  </h3>
                </div>
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 mr-1.5 animate-pulse" />
                  Siap Hadir
                </span>
              </div>

              {/* Service Meta */}
              <div className="py-4 space-y-2.5 text-xs sm:text-sm">
                <div className="flex items-start gap-2 text-slate-200">
                  <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span><strong>Waktu:</strong> {nextSchedule.dateOrDay}, {nextSchedule.time}</span>
                </div>
                <div className="flex items-start gap-2 text-slate-200">
                  <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span><strong>Tempat:</strong> {nextSchedule.location}</span>
                </div>
                <div className="bg-black/25 p-3 rounded-xl border border-white/10 mt-2">
                  <p className="text-xs text-amber-300 font-semibold">Tema Kotbah:</p>
                  <p className="text-sm font-bold text-white mt-0.5">"{nextSchedule.theme}"</p>
                  <p className="text-xs text-slate-300 mt-1">Nats: {nextSchedule.bibleVerse} • Pelayan: {nextSchedule.preacher}</p>
                </div>
              </div>

              {/* Real-time Countdown Timer Display */}
              <div className="pt-2 pb-4">
                <p className="text-xs text-slate-300 font-semibold mb-2 flex items-center justify-between">
                  <span>Hitung Mundur Ibadah:</span>
                  <span className="text-[11px] text-amber-300 font-mono">Waktu Indonesia Timur (WIT)</span>
                </p>
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="bg-slate-900/70 p-2 rounded-xl border border-white/10">
                    <span className="block text-xl font-black text-amber-400 font-mono">{timeLeft.days}</span>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Hari</span>
                  </div>
                  <div className="bg-slate-900/70 p-2 rounded-xl border border-white/10">
                    <span className="block text-xl font-black text-white font-mono">{timeLeft.hours}</span>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Jam</span>
                  </div>
                  <div className="bg-slate-900/70 p-2 rounded-xl border border-white/10">
                    <span className="block text-xl font-black text-white font-mono">{timeLeft.minutes}</span>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Menit</span>
                  </div>
                  <div className="bg-slate-900/70 p-2 rounded-xl border border-white/10">
                    <span className="block text-xl font-black text-amber-400 font-mono">{timeLeft.seconds}</span>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Detik</span>
                  </div>
                </div>
              </div>

              {/* WhatsApp Action Button */}
              <button
                id="hero-wa-reminder-btn"
                onClick={() => onOpenWhatsAppReminder(nextSchedule)}
                className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-4 rounded-xl shadow-md transition-all text-sm"
              >
                <Share2 className="w-4 h-4" />
                <span>Ingatkan Saya di WhatsApp</span>
              </button>
            </div>
          </div>
        </div>

        {/* Quick 4-Pillar Service Highlights */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <button
            onClick={() => onNavigate('jadwal')}
            className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/5 hover:bg-white/15 border border-white/10 text-left transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-600/30 flex items-center justify-center text-blue-300 font-bold group-hover:scale-110 transition-transform">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-300">8 Sektor Pelayanan</p>
              <p className="text-sm font-black text-white">Ibadah WIK & PAM</p>
            </div>
          </button>

          <button
            onClick={() => onNavigate('baptisan')}
            className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/5 hover:bg-white/15 border border-white/10 text-left transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-600/30 flex items-center justify-center text-emerald-300 font-bold group-hover:scale-110 transition-transform">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-300">Sakramen Kudus</p>
              <p className="text-sm font-black text-white">Daftar Baptisan Online</p>
            </div>
          </button>

          <button
            onClick={() => onNavigate('donasi')}
            className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/5 hover:bg-white/15 border border-white/10 text-left transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-600/30 flex items-center justify-center text-amber-300 font-bold group-hover:scale-110 transition-transform">
              <Heart className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-300">Persembahan Mudah</p>
              <p className="text-sm font-black text-white">QRIS & Bank Papua</p>
            </div>
          </button>

          <button
            onClick={() => onNavigate('warta')}
            className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/5 hover:bg-white/15 border border-white/10 text-left transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-600/30 flex items-center justify-center text-purple-300 font-bold group-hover:scale-110 transition-transform">
              <BellRing className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-300">Warta Jemaat</p>
              <p className="text-sm font-black text-white">Transparansi Kas</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
