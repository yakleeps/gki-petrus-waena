import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  BookOpen, 
  Share2, 
  Search, 
  ExternalLink,
  Volume2,
  Sparkles,
  Music2,
  Users2
} from 'lucide-react';
import { WorshipSchedule, WorshipCategory } from '../types';

interface JadwalIbadahSectionProps {
  schedules: WorshipSchedule[];
  onOpenWhatsAppReminder: (schedule: WorshipSchedule) => void;
  onReadText: (text: string) => void;
  isHighContrast: boolean;
}

export const JadwalIbadahSection: React.FC<JadwalIbadahSectionProps> = ({
  schedules,
  onOpenWhatsAppReminder,
  onReadText,
  isHighContrast,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('semua');
  const [searchQuery, setSearchQuery] = useState('');

  const categories: { id: string; label: string }[] = [
    { id: 'semua', label: 'Semua Ibadah' },
    { id: 'minggu', label: 'Ibadah Minggu' },
    { id: 'ksp', label: 'KSP / WIK Sektor' },
    { id: 'pemuda', label: 'Pemuda (PAM)' },
    { id: 'wanita', label: 'Kaum Ibu (PW)' },
    { id: 'bapak', label: 'Kaum Bapak (PKB)' },
    { id: 'anak', label: 'Sekolah Minggu (PAR)' },
  ];

  const filteredSchedules = schedules.filter((s) => {
    const matchCategory = selectedCategory === 'semua' || s.category === selectedCategory;
    const q = searchQuery.toLowerCase();
    const matchSearch = 
      s.title.toLowerCase().includes(q) ||
      s.preacher.toLowerCase().includes(q) ||
      s.location.toLowerCase().includes(q) ||
      s.theme.toLowerCase().includes(q);
    return matchCategory && matchSearch;
  });

  const createCalendarEvent = (s: WorshipSchedule) => {
    const title = encodeURIComponent(`GKI Petrus Waena: ${s.title}`);
    const details = encodeURIComponent(`Tema: ${s.theme}\nPelayan: ${s.preacher}\nLiturgos: ${s.liturgist}\nNats: ${s.bibleVerse}`);
    const location = encodeURIComponent(s.location);
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}`;
    window.open(url, '_blank');
  };

  return (
    <section id="jadwal-ibadah" className={`py-12 ${isHighContrast ? 'bg-black text-white' : 'bg-slate-50 text-slate-900'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-blue-700 font-bold text-xs uppercase tracking-wider mb-1">
              <Calendar className="w-4 h-4" />
              <span>Jadwal Pelayanan & Persekutuan Terpadu</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 font-serif">
              Jadwal Ibadah Jemaat Petrus Waena
            </h2>
            <p className="text-slate-600 text-sm mt-1 max-w-2xl">
              Pantau jadwal peribadahan secara real-time, lengkap dengan liturgos, pengkhotbah, tema kotbah, dan lokasi sektor persekutuan di wilayah Waena.
            </p>
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari pelayan, tema, atau sektor..."
              className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-hidden shadow-xs"
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-blue-900 text-white shadow-sm ring-2 ring-blue-900/20'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Schedule Cards Grid */}
        {filteredSchedules.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-300 p-8">
            <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="font-bold text-slate-700">Tidak ada jadwal ibadah yang sesuai pencarian.</p>
            <p className="text-xs text-slate-500 mt-1">Coba gunakan kata kunci lain atau pilih filter "Semua Ibadah".</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSchedules.map((schedule) => (
              <div
                key={schedule.id}
                className={`flex flex-col justify-between rounded-3xl p-6 transition-all duration-200 border ${
                  isHighContrast
                    ? 'bg-zinc-900 border-2 border-amber-400 text-white'
                    : 'bg-white border-slate-200/90 hover:border-blue-300 hover:shadow-md'
                }`}
              >
                <div>
                  {/* Top Badge & Audio read */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
                      {schedule.categoryLabel}
                    </span>
                    <button
                      onClick={() =>
                        onReadText(
                          `Jadwal ${schedule.title}. Waktu ${schedule.dateOrDay}, jam ${schedule.time}. Bertempat di ${schedule.location}. Tema: ${schedule.theme}. Pelayan Firman: ${schedule.preacher}.`
                        )
                      }
                      className="p-1.5 rounded-lg text-slate-400 hover:text-blue-700 hover:bg-blue-50 transition-colors"
                      title="Dengarkan Jadwal Ini (Fitur Suara Lansia)"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Title & Time */}
                  <h3 className="text-lg font-black text-slate-900 leading-snug">
                    {schedule.title}
                  </h3>

                  <div className="mt-3 space-y-2 text-xs text-slate-600">
                    <div className="flex items-center gap-2 font-semibold text-blue-900">
                      <Clock className="w-4 h-4 text-blue-700 shrink-0" />
                      <span>{schedule.dateOrDay} • {schedule.time}</span>
                    </div>

                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <span className="line-clamp-2">{schedule.location}</span>
                    </div>
                  </div>

                  {/* Theme Box */}
                  <div className="mt-4 p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
                    <div className="flex items-center gap-1.5 text-amber-700 font-bold mb-1">
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Tema & Firman Tuhan</span>
                    </div>
                    <p className="font-bold text-slate-900 line-clamp-2">
                      "{schedule.theme}"
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Nats: <strong className="text-slate-700">{schedule.bibleVerse}</strong>
                    </p>
                  </div>

                  {/* Liturgical Team */}
                  <div className="mt-3 space-y-1.5 text-xs text-slate-700 pt-2 border-t border-slate-100">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Pelayan Firman:</span>
                      <span className="font-bold text-slate-900">{schedule.preacher}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Liturgos:</span>
                      <span className="font-medium text-slate-800">{schedule.liturgist}</span>
                    </div>
                    {schedule.organist && (
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 flex items-center gap-1">
                          <Music2 className="w-3 h-3 text-slate-400" /> Pemusik:
                        </span>
                        <span className="text-slate-700">{schedule.organist}</span>
                      </div>
                    )}
                    {schedule.kantor && (
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 flex items-center gap-1">
                          <Users2 className="w-3 h-3 text-slate-400" /> Koor:
                        </span>
                        <span className="text-slate-700 text-right truncate max-w-[180px]">{schedule.kantor}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center gap-2">
                  <button
                    onClick={() => onOpenWhatsAppReminder(schedule)}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-3 rounded-xl text-xs transition-all shadow-xs"
                    title="Kirim Pengingat WhatsApp"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Pengingat WhatsApp</span>
                  </button>

                  <button
                    onClick={() => createCalendarEvent(schedule)}
                    className="p-2.5 rounded-xl border border-slate-200 hover:border-blue-400 text-slate-600 hover:text-blue-900 bg-slate-50 hover:bg-white transition-all"
                    title="Simpan ke Google Calendar"
                  >
                    <Calendar className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
