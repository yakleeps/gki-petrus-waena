import React, { useState } from 'react';
import { 
  FileText, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Clock, 
  User, 
  Volume2, 
  ShieldCheck, 
  ChevronRight, 
  AlertCircle,
  Heart,
  Eye
} from 'lucide-react';
import { ChurchNews } from '../types';

interface BeritaJemaatSectionProps {
  newsList: ChurchNews[];
  onReadText: (text: string) => void;
  isHighContrast: boolean;
}

export const BeritaJemaatSection: React.FC<BeritaJemaatSectionProps> = ({
  newsList,
  onReadText,
  isHighContrast,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('semua');
  const [activeNewsModal, setActiveNewsModal] = useState<ChurchNews | null>(null);

  const categories = [
    { id: 'semua', label: 'Semua Berita' },
    { id: 'warta', label: 'Warta Jemaat' },
    { id: 'keuangan', label: 'Transparansi Keuangan' },
    { id: 'lansia', label: 'Pelayanan Lansia' },
    { id: 'duka', label: 'Warta Duka' },
    { id: 'pemuda', label: 'Pemuda (PAM)' },
  ];

  const filteredNews = newsList.filter((n) => {
    return selectedCategory === 'semua' || n.category === selectedCategory;
  });

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <section id="warta-jemaat" className={`py-12 ${isHighContrast ? 'bg-zinc-950 text-white' : 'bg-white text-slate-900'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-blue-700 font-bold text-xs uppercase tracking-wider mb-1">
              <FileText className="w-4 h-4" />
              <span>Informasi & Akuntabilitas Terbuka</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 font-serif">
              Warta & Berita Jemaat Petrus Waena
            </h2>
            <p className="text-slate-600 text-sm mt-1 max-w-2xl">
              Pembaruan berkala seputar kegiatan gereja, warta duka & sukacita, komisi pelayanan, dan laporan pertanggungjawaban kas jemaat demi transparansi bersama.
            </p>
          </div>

          <button
            onClick={() => {
              const summaryAll = newsList.map(n => `${n.title}. ${n.summary}`).join('. ');
              onReadText(`Warta Jemaat GKI Petrus Waena. ${summaryAll}`);
            }}
            className="flex items-center gap-2 bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold px-4 py-2.5 rounded-xl text-xs transition-colors self-start md:self-auto border border-amber-300"
            title="Dengarkan seluruh warta pekan ini via suara (Ramah Lansia)"
          >
            <Volume2 className="w-4 h-4 text-amber-700" />
            <span>Dengarkan Ringkasan Warta 🔊</span>
          </button>
        </div>

        {/* Categories */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-blue-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {filteredNews.map((news) => (
            <article
              key={news.id}
              className={`rounded-3xl p-6 flex flex-col justify-between border transition-all ${
                news.important
                  ? 'border-amber-400/80 bg-amber-50/20'
                  : isHighContrast
                    ? 'bg-zinc-900 border-zinc-800'
                    : 'bg-slate-50 border-slate-200 hover:border-blue-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className={`text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                    news.category === 'keuangan' 
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : news.category === 'duka'
                        ? 'bg-slate-800 text-white'
                        : 'bg-blue-100 text-blue-800'
                  }`}>
                    {news.categoryLabel}
                  </span>

                  <button
                    onClick={() => onReadText(`${news.title}. ${news.content}`)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-blue-800 hover:bg-blue-50"
                    title="Dengarkan Berita Ini"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                  {news.title}
                </h3>

                <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-2">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    {news.date}
                  </span>
                  <span>•</span>
                  <span>{news.readTime}</span>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 mt-3 leading-relaxed line-clamp-3">
                  {news.summary}
                </p>

                {/* If Financial Data is present, show high-impact transparent summary */}
                {news.financialData && (
                  <div className="mt-4 p-4 rounded-2xl bg-white border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-700 border-b pb-2">
                      <span className="flex items-center gap-1 text-emerald-700">
                        <ShieldCheck className="w-4 h-4" />
                        Periode: {news.financialData.period}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2 rounded-xl bg-emerald-50 text-emerald-950">
                        <span className="text-[10px] uppercase font-bold text-emerald-700 block">Pemasukan</span>
                        <span className="font-extrabold text-sm">{formatRupiah(news.financialData.income)}</span>
                      </div>
                      <div className="p-2 rounded-xl bg-rose-50 text-rose-950">
                        <span className="text-[10px] uppercase font-bold text-rose-700 block">Pengeluaran</span>
                        <span className="font-extrabold text-sm">{formatRupiah(news.financialData.expense)}</span>
                      </div>
                    </div>

                    <div className="pt-1 flex items-center justify-between text-xs font-semibold">
                      <span className="text-slate-500">Saldo Akhir Kas Kasih:</span>
                      <span className="font-black text-blue-900">{formatRupiah(news.financialData.balance)}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-5 pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Oleh: {news.author}</span>
                <button
                  onClick={() => setActiveNewsModal(news)}
                  className="flex items-center gap-1 font-bold text-blue-700 hover:text-blue-900"
                >
                  <span>Baca Lengkap</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* Modal Detail News */}
        {activeNewsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
            <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
              <div className="p-6 border-b border-slate-100 flex items-start justify-between">
                <div>
                  <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">
                    {activeNewsModal.categoryLabel}
                  </span>
                  <h3 className="text-xl font-black text-slate-900 mt-1">
                    {activeNewsModal.title}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-2">
                    <span>{activeNewsModal.date}</span>
                    <span>•</span>
                    <span>Oleh: {activeNewsModal.author}</span>
                  </div>
                </div>
                <button
                  onClick={() => setActiveNewsModal(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700"
                >
                  ✕
                </button>
              </div>

              <div className="p-6 space-y-4 text-sm text-slate-700 leading-relaxed">
                <div className="flex items-center justify-end">
                  <button
                    onClick={() => onReadText(`${activeNewsModal.title}. ${activeNewsModal.content}`)}
                    className="flex items-center gap-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 px-3 py-1.5 rounded-lg text-xs font-bold"
                  >
                    <Volume2 className="w-4 h-4 text-amber-700" />
                    <span>Dengarkan Teks Ini</span>
                  </button>
                </div>

                <p className="font-semibold text-slate-900 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  {activeNewsModal.summary}
                </p>

                <p className="whitespace-pre-line">
                  {activeNewsModal.content}
                </p>

                {activeNewsModal.financialData && (
                  <div className="mt-6 pt-4 border-t border-slate-200">
                    <h4 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      Rincian Laporan Kas Jemaat ({activeNewsModal.financialData.period})
                    </h4>
                    <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden">
                      {activeNewsModal.financialData.details.map((item, idx) => (
                        <div key={idx} className="p-3 flex items-center justify-between text-xs bg-white">
                          <span className="text-slate-700">{item.label}</span>
                          <span className={`font-bold font-mono ${item.type === 'in' ? 'text-emerald-700' : 'text-rose-700'}`}>
                            {item.type === 'in' ? '+ ' : '- '} {formatRupiah(item.amount)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
                <button
                  onClick={() => setActiveNewsModal(null)}
                  className="px-5 py-2 text-xs font-bold bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
