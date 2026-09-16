import React, { useState } from 'react';
import { 
  MessageCircle, 
  HeartHandshake, 
  Send, 
  Phone, 
  CheckCircle2, 
  Clock, 
  User, 
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  Heart
} from 'lucide-react';
import { PastoralMessage } from '../types';
import { SECTORS_LIST, CHURCH_INFO } from '../data/churchData';

interface KomunikasiMajelisSectionProps {
  isHighContrast: boolean;
}

export const KomunikasiMajelisSection: React.FC<KomunikasiMajelisSectionProps> = ({ isHighContrast }) => {
  const [senderName, setSenderName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [wikSector, setWikSector] = useState(SECTORS_LIST[0]);
  const [type, setType] = useState<PastoralMessage['type']>('kunjungan_lansia');
  const [message, setMessage] = useState('');
  const [submittedToast, setSubmittedToast] = useState(false);

  // Sample feed of real-time pastoral communications
  const [messagesList, setMessagesList] = useState<PastoralMessage[]>([
    {
      id: 'msg-1',
      senderName: 'Kel. Mandowen (Sektor Sion)',
      phoneNumber: '081248xxxxxx',
      wikSector: 'Sektor I (Sion - Perumnas 1 Waena)',
      type: 'kunjungan_lansia',
      typeLabel: 'Kunjungan Lansia & Doa',
      message: 'Mohon kunjungan doa dan pelayanan perjamuan kudus di rumah untuk Opa Yulianus (86 thn) yang saat ini tirah baring di rumah.',
      timestamp: '15 Sep 2026, 08:30 WIT',
      status: 'Dijawab Majelis',
      replyNote: 'Shalom, Tim Komisi Diakonia bersama Pdt. Yohana Rumkabu dijadwalkan hadir Kamis, 17 Sep jam 15:00 WIT. Tuhan memberkati.',
    },
    {
      id: 'msg-2',
      senderName: 'Ibu Ruth (Sektor Betlehem)',
      phoneNumber: '082198xxxxxx',
      wikSector: 'Sektor II (Betlehem - Waena Kampung)',
      type: 'doa',
      typeLabel: 'Permohonan Pokok Doa',
      message: 'Mohon dukungan doa bagi anak kami yang akan mengikuti seleksi beasiswa dan ujian akhir.',
      timestamp: '14 Sep 2026, 17:15 WIT',
      status: 'Diproses',
      replyNote: 'Telah dimasukkan dalam daftar pokok doa persekutuan jemaat dan ibadah subuh.',
    },
    {
      id: 'msg-3',
      senderName: 'Pemuda Sektor Nazaret',
      phoneNumber: '081344xxxxxx',
      wikSector: 'Sektor III (Nazaret - Perumnas 2 Waena)',
      type: 'tanya_majelis',
      typeLabel: 'Tanya Majelis Jemaat',
      message: 'Apakah ada formulir surat pengantar pindah domisili jemaat ke Klasis Biak Selatan?',
      timestamp: '13 Sep 2026, 11:20 WIT',
      status: 'Dijawab Majelis',
      replyNote: 'Surat atestasi pindah dapat diurus di kantor sekretariat gereja setiap hari kerja jam 09:00 - 14:00 WIT.',
    },
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderName || !message) return;

    const typeLabels: Record<PastoralMessage['type'], string> = {
      doa: 'Permohonan Doa Khusus',
      konseling: 'Konseling Pastoral Pendeta',
      kunjungan_lansia: 'Kunjungan Doa Lansia / Sakit',
      tanya_majelis: 'Tanya Majelis / Administrasi',
    };

    const newMsg: PastoralMessage = {
      id: `msg-${Date.now()}`,
      senderName,
      phoneNumber,
      wikSector,
      type,
      typeLabel: typeLabels[type],
      message,
      timestamp: 'Baru saja',
      status: 'Diterima',
      replyNote: 'Pesan Anda telah diterima oleh Sekretariat Majelis Jemaat GKI Petrus Waena. Pengurus akan segera merespons.',
    };

    setMessagesList([newMsg, ...messagesList]);
    setSubmittedToast(true);
    setMessage('');
    setTimeout(() => setSubmittedToast(false), 5000);
  };

  return (
    <section id="komunikasi-majelis" className={`py-12 ${isHighContrast ? 'bg-zinc-950 text-white' : 'bg-white text-slate-900'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-blue-700 font-bold text-xs uppercase tracking-wider mb-1">
              <MessageCircle className="w-4 h-4" />
              <span>Komunikasi Dua Arah & Pelayanan Kasih</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 font-serif">
              Tanya Majelis & Permohonan Pelayanan Doa
            </h2>
            <p className="text-slate-600 text-sm mt-1 max-w-2xl">
              Saluran komunikasi interaktif bagi warga jemaat, keluarga, dan lansia untuk memohon kunjungan pastoral, konseling, atau konsultasi administrasi jemaat secara real-time.
            </p>
          </div>

          <a
            href={`https://wa.me/${CHURCH_INFO.whatsappCare}?text=${encodeURIComponent('Shalom Pendeta & Majelis GKI Petrus Waena, saya ingin berkonsultasi permohonan doa/pelayanan.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-xs transition-colors self-start md:self-auto"
          >
            <Phone className="w-4 h-4" />
            <span>Chat Langsung WA Sekretariat</span>
          </a>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Form on Left (5 Cols) */}
          <div className="lg:col-span-5 bg-slate-50 border border-slate-200 rounded-3xl p-6 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Kirim Permohonan atau Pertanyaan
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Pesan akan langsung diproses oleh Majelis Jemaat dan Pendeta Pelayan.
            </p>

            {submittedToast && (
              <div className="mb-4 p-3.5 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-900 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Permohonan Berhasil Terkirim!</p>
                  <p className="text-emerald-700 mt-0.5">
                    Majelis Jemaat telah menerima pesan Anda dan akan segera menindaklanjuti via telepon atau kunjungan.
                  </p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Kategori Pelayanan
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'kunjungan_lansia', label: 'Pelayanan Lansia & Sakit' },
                    { id: 'doa', label: 'Permohonan Doa' },
                    { id: 'konseling', label: 'Konseling Pendeta' },
                    { id: 'tanya_majelis', label: 'Tanya Majelis' },
                  ].map((cat) => (
                    <button
                      type="button"
                      key={cat.id}
                      onClick={() => setType(cat.id as PastoralMessage['type'])}
                      className={`p-2 rounded-xl text-[11px] font-bold border transition-all ${
                        type === cat.id
                          ? 'bg-blue-900 text-white border-blue-900'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nama Warga / Keluarga Pemohon <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  placeholder="Contoh: Kel. Rumbiak (atau Nama Pribadi)"
                  className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    No. WhatsApp / HP
                  </label>
                  <input
                    type="tel"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="0812..."
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Sektor WIK
                  </label>
                  <select
                    value={wikSector}
                    onChange={(e) => setWikSector(e.target.value)}
                    className="w-full px-2.5 py-2 text-xs border border-slate-300 rounded-xl bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                  >
                    {SECTORS_LIST.map((s, idx) => (
                      <option key={idx} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Isi Pesan / Pokok Kunjungan Doa <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tuliskan pokok permohonan doa, kondisi kesehatan anggota keluarga lanjut usia, atau pertanyaan administrasi gereja..."
                  className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-blue-900 hover:bg-blue-800 text-white font-bold py-3 rounded-xl text-xs shadow-md transition-all"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Kirimkan ke Majelis Jemaat</span>
              </button>
            </form>
          </div>

          {/* Real-time Status Feed on Right (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900">
                Pelacakan & Respons Pelayanan Jemaat Terkini
              </h3>
              <span className="text-xs text-slate-500 font-semibold">
                Transparansi Pelayanan
              </span>
            </div>

            <div className="space-y-4">
              {messagesList.map((item) => (
                <div
                  key={item.id}
                  className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2.5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">{item.senderName}</span>
                      <span className="text-[10px] bg-blue-50 text-blue-800 border border-blue-200 px-2 py-0.5 rounded-full font-semibold">
                        {item.typeLabel}
                      </span>
                    </div>
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                      item.status === 'Dijawab Majelis'
                        ? 'bg-emerald-100 text-emerald-800'
                        : item.status === 'Diproses'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-700'
                    }`}>
                      ● {item.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl">
                    "{item.message}"
                  </p>

                  {item.replyNote && (
                    <div className="p-3 bg-blue-50/70 border border-blue-200/80 rounded-xl text-xs space-y-1">
                      <div className="flex items-center gap-1.5 text-blue-900 font-bold">
                        <ShieldCheck className="w-3.5 h-3.5 text-blue-700" />
                        <span>Tanggapan Majelis Jemaat:</span>
                      </div>
                      <p className="text-blue-950 font-medium">
                        {item.replyNote}
                      </p>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                    <span>{item.wikSector}</span>
                    <span>{item.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
