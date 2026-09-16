import React from 'react';
import { Church, MapPin, Phone, Mail, Heart, Shield, Clock } from 'lucide-react';
import { CHURCH_INFO } from '../data/churchData';

interface FooterProps {
  onNavigate: (tab: string) => void;
  isHighContrast: boolean;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, isHighContrast }) => {
  return (
    <footer className={`border-t transition-colors ${
      isHighContrast ? 'bg-black text-white border-zinc-800' : 'bg-slate-900 text-white border-slate-800'
    } pb-20 lg:pb-12 pt-16`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Col 1: About */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-400 text-slate-950 font-black flex items-center justify-center font-serif text-lg">
                †
              </div>
              <span className="font-black text-base text-white tracking-wide">
                GKI Petrus Waena
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Gereja Kristen Injili di Tanah Papua, Klasis Port Numbay. Bersekutu, bersaksi, dan melayani dengan kasih persaudaraan di wilayah Waena, Jayapura.
            </p>
            <div className="pt-2 text-xs text-amber-300 flex items-center gap-1.5">
              <span>Motto:</span>
              <span className="font-semibold italic">"Satu Roh, Satu Tubuh di dalam Kristus"</span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-3">
              Layanan Jemaat
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-300">
              <li>
                <button onClick={() => onNavigate('data-jemaat')} className="hover:text-amber-400 transition-colors font-semibold text-amber-300">
                  Data Jemaat (12 Rayon & KSP)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('jadwal')} className="hover:text-amber-400 transition-colors">
                  Jadwal Ibadah Minggu & Sektor
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('warta')} className="hover:text-amber-400 transition-colors">
                  Warta Jemaat & Transparansi Kas
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('baptisan')} className="hover:text-amber-400 transition-colors">
                  Pendaftaran Baptisan Kudus Online
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('galeri')} className="hover:text-amber-400 transition-colors">
                  Galeri Foto & Dokumentasi Pelayanan
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('donasi')} className="hover:text-amber-400 transition-colors">
                  Persembahan Syukur & QRIS Digital
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('komunikasi')} className="hover:text-amber-400 transition-colors">
                  Tanya Majelis & Permohonan Doa
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact & Address */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-3">
              Alamat & Kontak
            </h4>
            <div className="space-y-2 text-xs text-slate-300">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{CHURCH_INFO.address}</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <span>WhatsApp: {CHURCH_INFO.phone}</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{CHURCH_INFO.email}</span>
              </p>
              <p className="flex items-center gap-2 text-slate-400 text-[11px] pt-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Sekretariat Buka: Senin - Sabtu 08:00 - 15:00 WIT</span>
              </p>
            </div>
          </div>

          {/* Col 4: Digital Transparency & Accessibility note */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-2">
              Inklusif & Ramah Lansia
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Portal ini dilengkapi fitur penyesuaian ukuran huruf, kontras tajam, serta pembaca suara teks bahasa Indonesia demi kemudahan akses opa, oma, dan seluruh warga jemaat.
            </p>
            <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 text-[11px] text-slate-300 space-y-1">
              <span className="font-bold text-amber-400 block">Rekening Resmi Jemaat:</span>
              <span>Bank Papua: 100-02-01-09876-5</span>
              <span className="block">BCA: 810-554-1290</span>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <p>© {new Date().getFullYear()} GKI Petrus Waena. Hak cipta dilindungi undang-undang.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-300">Tata Gereja GKI di Tanah Papua</span>
            <span>•</span>
            <span className="hover:text-slate-300">Klasis Port Numbay</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
