import React, { useState } from 'react';
import { 
  Image as ImageIcon, 
  Download, 
  Eye, 
  Calendar, 
  User, 
  Check, 
  X, 
  Share2, 
  Loader2,
  Sparkles
} from 'lucide-react';
import { GalleryPhoto } from '../types';
import { downloadImageToDevice } from '../utils/downloadHelper';

interface GaleriKegiatanSectionProps {
  photos: GalleryPhoto[];
  isHighContrast: boolean;
}

export const GaleriKegiatanSection: React.FC<GaleriKegiatanSectionProps> = ({
  photos,
  isHighContrast,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('semua');
  const [activePhoto, setActivePhoto] = useState<GalleryPhoto | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [downloadSuccessId, setDownloadSuccessId] = useState<string | null>(null);

  const categories = [
    { id: 'semua', label: 'Semua Dokumentasi' },
    { id: 'hari_raya', label: 'Hari Raya Gerejawi' },
    { id: 'ibadah', label: 'Ibadah & Sakramen' },
    { id: 'pemuda', label: 'Pemuda (PAM)' },
    { id: 'par', label: 'Sekolah Minggu (PAR)' },
    { id: 'lansia', label: 'Pelayanan Lansia' },
  ];

  const filteredPhotos = photos.filter(
    (p) => selectedCategory === 'semua' || p.category === selectedCategory
  );

  const handleDownload = async (photo: GalleryPhoto, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setDownloadingId(photo.id);
    const cleanFilename = `GKI-Petrus-Waena-${photo.title.replace(/[^a-zA-Z0-9]/g, '-')}`;
    
    await downloadImageToDevice(photo.imageUrl, cleanFilename);
    
    setDownloadingId(null);
    setDownloadSuccessId(photo.id);
    setTimeout(() => setDownloadSuccessId(null), 3000);
  };

  return (
    <section id="galeri-kegiatan" className={`py-12 ${isHighContrast ? 'bg-zinc-950 text-white' : 'bg-white text-slate-900'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-blue-700 font-bold text-xs uppercase tracking-wider mb-1">
              <ImageIcon className="w-4 h-4" />
              <span>Dokumentasi Pelayanan Jemaat</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 font-serif">
              Galeri Foto Pelayanan GKI Petrus Waena
            </h2>
            <p className="text-slate-600 text-sm mt-1 max-w-2xl">
              Abadikan setiap momen sukacita persekutuan, sakramen, dan pelayanan kasih di gereja. Semua foto dapat diunduh langsung ke galeri memori perangkat Anda.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-3.5 py-2 rounded-xl">
            <Sparkles className="w-4 h-4" />
            <span className="font-semibold">Unduh Kualitas Penuh (HD) Gratis</span>
          </div>
        </div>

        {/* Categories Bar */}
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

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPhotos.map((photo) => {
            const isDownloading = downloadingId === photo.id;
            const isSuccess = downloadSuccessId === photo.id;

            return (
              <div
                key={photo.id}
                onClick={() => setActivePhoto(photo)}
                className={`group cursor-pointer rounded-3xl overflow-hidden border transition-all duration-300 flex flex-col justify-between ${
                  isHighContrast
                    ? 'bg-zinc-900 border-zinc-700'
                    : 'bg-white border-slate-200 hover:shadow-lg hover:border-blue-300'
                }`}
              >
                {/* Photo Thumbnail */}
                <div className="relative aspect-4/3 overflow-hidden bg-slate-100">
                  <img
                    src={photo.imageUrl}
                    alt={photo.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <span className="text-white text-xs font-semibold flex items-center gap-1.5">
                      <Eye className="w-4 h-4" /> Klik untuk perbesar
                    </span>
                  </div>
                  <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold uppercase px-2.5 py-1 rounded-full">
                    {photo.categoryLabel}
                  </span>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-base text-slate-900 line-clamp-1 group-hover:text-blue-900 transition-colors">
                      {photo.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1.5 leading-relaxed">
                      {photo.description}
                    </p>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-3">
                      <Calendar className="w-3 h-3" />
                      <span>{photo.date}</span>
                      <span>•</span>
                      <span>{photo.photographer}</span>
                    </div>
                  </div>

                  {/* Direct One-tap Download Button */}
                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <button
                      onClick={(e) => handleDownload(photo, e)}
                      disabled={isDownloading}
                      className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all shadow-xs ${
                        isSuccess
                          ? 'bg-emerald-600 text-white'
                          : isDownloading
                            ? 'bg-slate-200 text-slate-500'
                            : 'bg-blue-50 hover:bg-blue-900 text-blue-900 hover:text-white border border-blue-200 hover:border-blue-900'
                      }`}
                      title="Unduh langsung foto ini ke galeri HP Anda"
                    >
                      {isDownloading ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Menyimpan ke Perangkat...</span>
                        </>
                      ) : isSuccess ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Tersimpan di Galeri!</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-3.5 h-3.5" />
                          <span>Unduh ke Galeri HP</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Lightbox Modal */}
        {activePhoto && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in">
            <div className="relative max-w-4xl w-full bg-slate-950 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl flex flex-col max-h-[95vh]">
              {/* Close button */}
              <button
                onClick={() => setActivePhoto(null)}
                className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Photo Display */}
              <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden max-h-[65vh]">
                <img
                  src={activePhoto.imageUrl}
                  alt={activePhoto.title}
                  referrerPolicy="no-referrer"
                  className="max-h-[65vh] w-auto object-contain mx-auto"
                />
              </div>

              {/* Modal Details & Action */}
              <div className="p-6 bg-slate-900 text-white border-t border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <span className="text-amber-400 text-xs font-bold uppercase tracking-wider">
                    {activePhoto.categoryLabel}
                  </span>
                  <h3 className="text-xl font-black text-white mt-0.5">
                    {activePhoto.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 max-w-xl">
                    {activePhoto.description}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-2">
                    Foto oleh: {activePhoto.photographer} • {activePhoto.date}
                  </p>
                </div>

                <button
                  onClick={() => handleDownload(activePhoto)}
                  className="flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-6 py-3 rounded-2xl text-xs sm:text-sm shadow-xl transition-all shrink-0"
                >
                  <Download className="w-4 h-4" />
                  <span>Simpan ke Galeri Pribadi</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
