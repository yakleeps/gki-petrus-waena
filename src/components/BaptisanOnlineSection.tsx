import React, { useState } from 'react';
import { 
  UserCheck, 
  FileText, 
  Calendar, 
  CheckCircle2, 
  Download, 
  Printer, 
  Clock, 
  Search, 
  AlertCircle,
  HelpCircle,
  Sparkles,
  ShieldCheck,
  User,
  Users
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { BaptismRegistration, BaptismType } from '../types';
import { SECTORS_LIST, CHURCH_INFO } from '../data/churchData';

interface BaptisanOnlineSectionProps {
  isHighContrast: boolean;
}

export const BaptisanOnlineSection: React.FC<BaptisanOnlineSectionProps> = ({ isHighContrast }) => {
  const [activeTab, setActiveTab] = useState<'daftar' | 'lacak'>('daftar');
  const [step, setStep] = useState(1);

  // Form states
  const [baptismType, setBaptismType] = useState<BaptismType>('anak');
  const [fullName, setFullName] = useState('');
  const [birthPlace, setBirthPlace] = useState('Jayapura');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState<'L' | 'P'>('L');
  const [fatherName, setFatherName] = useState('');
  const [motherName, setMotherName] = useState('');
  const [wikSector, setWikSector] = useState(SECTORS_LIST[0]);
  const [witnessName1, setWitnessName1] = useState('');
  const [witnessName2, setWitnessName2] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [homeAddress, setHomeAddress] = useState('');
  const [marriageCertNumber, setMarriageCertNumber] = useState('');
  const [preferredDate, setPreferredDate] = useState('11 Oktober 2026 (Ibadah Minggu Raya)');

  // Submission result
  const [registeredCard, setRegisteredCard] = useState<BaptismRegistration | null>(null);

  // Tracking query state
  const [searchRegNum, setSearchRegNum] = useState('');
  const [trackedRecord, setTrackedRecord] = useState<BaptismRegistration | null>(null);
  const [trackError, setTrackError] = useState('');

  // Sample stored registrations for demo tracking
  const [savedRegistrations, setSavedRegistrations] = useState<BaptismRegistration[]>([
    {
      regNumber: 'BPT-PW-2026-0045',
      baptismType: 'anak',
      fullName: 'Immanuel Karel Rumbiak',
      birthPlace: 'Jayapura',
      birthDate: '12 Januari 2026',
      gender: 'L',
      fatherName: 'Markus Rumbiak',
      motherName: 'Sarah Wonda',
      wikSector: 'Sektor I (Sion - Perumnas 1 Waena)',
      witnessName1: 'Pnt. Daniel Tabuni',
      witnessName2: 'Ibu Martha Wambrauw',
      phoneNumber: '082198765001',
      homeAddress: 'Perumnas 1 Waena Blok B No. 12',
      marriageCertNumber: 'GKI-NK-2022-089',
      preferredDate: '11 Oktober 2026 (Ibadah Minggu Raya)',
      submittedAt: '12 Sep 2026, 14:20 WIT',
      status: 'Jadwal Katekisasi Ditetapkan',
    },
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newRegNum = `BPT-PW-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newRegistration: BaptismRegistration = {
      regNumber: newRegNum,
      baptismType,
      fullName,
      birthPlace,
      birthDate: birthDate || '10 Maret 2026',
      gender,
      fatherName,
      motherName,
      wikSector,
      witnessName1: witnessName1 || 'Majelis Pendamping',
      witnessName2: witnessName2 || 'Keluarga Wali',
      phoneNumber,
      homeAddress: homeAddress || 'Waena, Kota Jayapura',
      marriageCertNumber: marriageCertNumber || 'Dalam Proses Verifikasi',
      preferredDate,
      submittedAt: new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }) + ' WIT',
      status: 'Menunggu Verifikasi',
    };

    setSavedRegistrations([newRegistration, ...savedRegistrations]);
    setRegisteredCard(newRegistration);

    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch (err) {
      console.warn('Confetti effect failed', err);
    }
  };

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    setTrackError('');
    const found = savedRegistrations.find(
      (r) => r.regNumber.toLowerCase() === searchRegNum.trim().toLowerCase()
    );
    if (found) {
      setTrackedRecord(found);
    } else {
      setTrackedRecord(null);
      setTrackError('Nomor pendaftaran tidak ditemukan. Pastikan format penulisan benar, contoh: BPT-PW-2026-0045');
    }
  };

  const resetForm = () => {
    setRegisteredCard(null);
    setStep(1);
    setFullName('');
    setFatherName('');
    setMotherName('');
    setPhoneNumber('');
    setWitnessName1('');
    setWitnessName2('');
    setHomeAddress('');
  };

  return (
    <section id="baptisan-online" className={`py-12 ${isHighContrast ? 'bg-black text-white' : 'bg-slate-50 text-slate-900'}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-blue-700 font-extrabold text-xs uppercase tracking-wider bg-blue-100 px-3 py-1 rounded-full border border-blue-200">
            Pelayanan Sakramen Gerejawi
          </span>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 font-serif mt-2">
            Pendaftaran Sakramen Baptisan Kudus Online
          </h2>
          <p className="text-slate-600 text-sm mt-1">
            Kemudahan bagi keluarga dan warga jemaat GKI Petrus Waena untuk mendaftarkan baptisan kudus anak maupun baptisan dewasa secara terintegrasi.
          </p>

          {/* Toggle Tab: Daftar Baru vs Cek Status */}
          <div className="flex items-center justify-center gap-2 mt-6 p-1 bg-slate-200/80 rounded-2xl w-fit mx-auto">
            <button
              onClick={() => { setActiveTab('daftar'); setTrackedRecord(null); }}
              className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'daftar'
                  ? 'bg-blue-900 text-white shadow-sm'
                  : 'text-slate-700 hover:text-blue-900'
              }`}
            >
              Formulir Pendaftaran
            </button>
            <button
              onClick={() => setActiveTab('lacak')}
              className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'lacak'
                  ? 'bg-blue-900 text-white shadow-sm'
                  : 'text-slate-700 hover:text-blue-900'
              }`}
            >
              Lacak Status Berkas
            </button>
          </div>
        </div>

        {/* Tab 1: Formulir Pendaftaran */}
        {activeTab === 'daftar' && (
          <div>
            {registeredCard ? (
              /* Success Printable Confirmation Card */
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-200 shadow-xl space-y-6 animate-in zoom-in-95 duration-200">
                <div className="text-center pb-4 border-b border-slate-200">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2">
                    <CheckCircle2 className="w-9 h-9" />
                  </div>
                  <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                    Pendaftaran Berhasil Diterima
                  </span>
                  <h3 className="text-2xl font-black text-slate-900 mt-1">
                    Tanda Registrasi Sakramen Baptisan Kudus
                  </h3>
                  <p className="text-xs text-slate-500">
                    GKI Jemaat Petrus Waena — Klasis Port Numbay
                  </p>
                </div>

                {/* Card Body */}
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-blue-900 text-white p-4 rounded-xl">
                    <div>
                      <span className="text-[11px] text-blue-200 uppercase font-semibold">Nomor Registrasi Resmi:</span>
                      <p className="text-xl font-black tracking-wider font-mono text-amber-300">{registeredCard.regNumber}</p>
                    </div>
                    <div className="text-left sm:text-right">
                      <span className="text-[11px] text-blue-200 uppercase font-semibold">Status Berkas:</span>
                      <p className="text-sm font-bold bg-amber-400 text-slate-950 px-2.5 py-0.5 rounded-full inline-block mt-0.5">
                        {registeredCard.status}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-slate-500 block">Nama Calon Baptis:</span>
                      <strong className="text-sm text-slate-900 block">{registeredCard.fullName}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Jenis Sakramen:</span>
                      <strong className="text-sm text-slate-900 block capitalize">
                        Baptisan {registeredCard.baptismType}
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Nama Orang Tua:</span>
                      <span className="text-slate-800 font-semibold block">
                        Ayah: {registeredCard.fatherName || '-'} / Ibu: {registeredCard.motherName || '-'}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Sektor Pelayanan / WIK:</span>
                      <span className="text-slate-800 font-semibold block">{registeredCard.wikSector}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Saksi Baptis:</span>
                      <span className="text-slate-800 font-medium block">
                        1. {registeredCard.witnessName1} • 2. {registeredCard.witnessName2}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Rencana Tanggal Pelaksanaan:</span>
                      <strong className="text-blue-900 font-bold block">{registeredCard.preferredDate}</strong>
                    </div>
                  </div>

                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900">
                    <p className="font-bold flex items-center gap-1.5 mb-1">
                      <Calendar className="w-3.5 h-3.5 text-amber-700" />
                      Jadwal Katekisasi Orang Tua & Saksi:
                    </p>
                    <p>Sabtu, 3 Oktober 2026 • Jam 16:00 WIT bertempat di Ruang Konsistori GKI Petrus Waena.</p>
                  </div>
                </div>

                {/* Print / Download buttons */}
                <div className="flex flex-wrap gap-3 pt-2">
                  <button
                    onClick={() => window.print()}
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-900 hover:bg-blue-800 text-white font-bold py-3 rounded-xl text-xs transition-all shadow-md"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Cetak / Simpan Bukti PDF</span>
                  </button>

                  <a
                    href={`https://wa.me/${CHURCH_INFO.whatsappCare}?text=${encodeURIComponent(`Shalom Sekretariat GKI Petrus Waena, saya telah mendaftarkan baptisan dengan No. Registrasi: ${registeredCard.regNumber} atas nama ${registeredCard.fullName}. Mohon info selanjutnya.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-5 rounded-xl text-xs transition-all"
                  >
                    <span>Konfirmasi ke WA Sekretariat</span>
                  </a>

                  <button
                    onClick={resetForm}
                    className="w-full text-center text-xs text-slate-500 hover:text-slate-800 py-1"
                  >
                    Daftarkan Anggota Keluarga Lainnya
                  </button>
                </div>
              </div>
            ) : (
              /* Step Wizard Form */
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md">
                {/* Progress bar */}
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
                  <div className={`flex items-center gap-2 text-xs font-bold ${step >= 1 ? 'text-blue-900' : 'text-slate-400'}`}>
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step >= 1 ? 'bg-blue-900 text-white' : 'bg-slate-200'}`}>1</span>
                    <span>Data Calon</span>
                  </div>
                  <div className="w-8 h-0.5 bg-slate-200" />
                  <div className={`flex items-center gap-2 text-xs font-bold ${step >= 2 ? 'text-blue-900' : 'text-slate-400'}`}>
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step >= 2 ? 'bg-blue-900 text-white' : 'bg-slate-200'}`}>2</span>
                    <span>Orang Tua & Saksi</span>
                  </div>
                  <div className="w-8 h-0.5 bg-slate-200" />
                  <div className={`flex items-center gap-2 text-xs font-bold ${step >= 3 ? 'text-blue-900' : 'text-slate-400'}`}>
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step >= 3 ? 'bg-blue-900 text-white' : 'bg-slate-200'}`}>3</span>
                    <span>Konfirmasi</span>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {step === 1 && (
                    <div className="space-y-4 animate-in fade-in duration-150">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                          Jenis Sakramen Baptisan
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {[
                            { id: 'anak', label: 'Baptisan Anak' },
                            { id: 'dewasa', label: 'Baptisan Dewasa' },
                            { id: 'sidi', label: 'Peneguhan Sidi' },
                          ].map((t) => (
                            <button
                              type="button"
                              key={t.id}
                              onClick={() => setBaptismType(t.id as BaptismType)}
                              className={`p-3 rounded-xl text-xs font-bold border transition-all ${
                                baptismType === t.id
                                  ? 'bg-blue-900 text-white border-blue-900 shadow-sm'
                                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                              }`}
                            >
                              {t.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Nama Lengkap Calon Baptis <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Sesuai Akta Kelahiran..."
                          className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Tempat Lahir</label>
                          <input
                            type="text"
                            value={birthPlace}
                            onChange={(e) => setBirthPlace(e.target.value)}
                            placeholder="Kota Lahir (contoh: Jayapura)"
                            className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Tanggal Lahir</label>
                          <input
                            type="date"
                            value={birthDate}
                            onChange={(e) => setBirthDate(e.target.value)}
                            className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Jenis Kelamin</label>
                          <select
                            value={gender}
                            onChange={(e) => setGender(e.target.value as 'L' | 'P')}
                            className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                          >
                            <option value="L">Laki-laki</option>
                            <option value="P">Perempuan</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Sektor Pelayanan (WIK)</label>
                          <select
                            value={wikSector}
                            onChange={(e) => setWikSector(e.target.value)}
                            className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                          >
                            {SECTORS_LIST.map((s, idx) => (
                              <option key={idx} value={s}>{s}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="flex justify-end pt-4">
                        <button
                          type="button"
                          onClick={() => {
                            if (!fullName) {
                              alert('Silakan lengkapi nama calon baptis.');
                              return;
                            }
                            setStep(2);
                          }}
                          className="bg-blue-900 hover:bg-blue-800 text-white font-bold px-6 py-2.5 rounded-xl text-xs transition-all"
                        >
                          Lanjut: Orang Tua & Saksi →
                        </button>
                      </div>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="space-y-4 animate-in fade-in duration-150">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Nama Lengkap Ayah</label>
                          <input
                            type="text"
                            required
                            value={fatherName}
                            onChange={(e) => setFatherName(e.target.value)}
                            placeholder="Nama Ayah..."
                            className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Nama Lengkap Ibu</label>
                          <input
                            type="text"
                            required
                            value={motherName}
                            onChange={(e) => setMotherName(e.target.value)}
                            placeholder="Nama Ibu (Gelar / Marga)..."
                            className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Saksi Baptis 1</label>
                          <input
                            type="text"
                            value={witnessName1}
                            onChange={(e) => setWitnessName1(e.target.value)}
                            placeholder="Nama Saksi Baptis 1..."
                            className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Saksi Baptis 2</label>
                          <input
                            type="text"
                            value={witnessName2}
                            onChange={(e) => setWitnessName2(e.target.value)}
                            placeholder="Nama Saksi Baptis 2..."
                            className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Nomor Surat Nikah Gereja Orang Tua (Jika ada)
                        </label>
                        <input
                          type="text"
                          value={marriageCertNumber}
                          onChange={(e) => setMarriageCertNumber(e.target.value)}
                          placeholder="Contoh: GKI-NK-2021-042 (atau tulis 'Dalam Proses')"
                          className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                        />
                      </div>

                      <div className="flex justify-between pt-4">
                        <button
                          type="button"
                          onClick={() => setStep(1)}
                          className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900"
                        >
                          ← Kembali
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (!fatherName || !motherName) {
                              alert('Silakan masukkan nama ayah dan ibu.');
                              return;
                            }
                            setStep(3);
                          }}
                          className="bg-blue-900 hover:bg-blue-800 text-white font-bold px-6 py-2.5 rounded-xl text-xs transition-all"
                        >
                          Lanjut: Kontak & Jadwal →
                        </button>
                      </div>
                    </div>
                  )}

                  {step === 3 && (
                    <div className="space-y-4 animate-in fade-in duration-150">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Nomor WhatsApp Aktif <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="tel"
                          required
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          placeholder="Untuk pengiriman jadwal katekisasi (08...)"
                          className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Alamat Tempat Tinggal di Waena</label>
                        <textarea
                          rows={2}
                          value={homeAddress}
                          onChange={(e) => setHomeAddress(e.target.value)}
                          placeholder="Nama jalan, nomor rumah, kompleks perumahan..."
                          className="w-full px-4 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Pilihan Periode Pelaksanaan Baptisan</label>
                        <select
                          value={preferredDate}
                          onChange={(e) => setPreferredDate(e.target.value)}
                          className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-hidden font-medium"
                        >
                          <option value="11 Oktober 2026 (Ibadah Minggu Raya Triwulan III)">
                            11 Oktober 2026 — Ibadah Minggu Raya Triwulan III (Rekomendasi)
                          </option>
                          <option value="25 Desember 2026 (Ibadah Natal Kudus)">
                            25 Desember 2026 — Ibadah Natal Kudus
                          </option>
                          <option value="Jadwal Khusus Perkunjungan Sakit di Rumah">
                            Jadwal Khusus Perkunjungan di Rumah (Kasus Darurat/Sakit)
                          </option>
                        </select>
                      </div>

                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-start gap-2">
                        <ShieldCheck className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                        <span>
                          Dengan mengirimkan data ini, pemohon menyatakan data yang diisi adalah benar dan bersedia mengikuti katekisasi baptisan kudus sesuai Tata Gereja GKI di Tanah Papua.
                        </span>
                      </div>

                      <div className="flex justify-between pt-4">
                        <button
                          type="button"
                          onClick={() => setStep(2)}
                          className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900"
                        >
                          ← Kembali
                        </button>
                        <button
                          type="submit"
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-black px-8 py-3 rounded-xl text-xs transition-all shadow-md flex items-center gap-2"
                        >
                          <UserCheck className="w-4 h-4" />
                          <span>Kirim Pendaftaran Baptisan</span>
                        </button>
                      </div>
                    </div>
                  )}
                </form>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Lacak Status Berkas */}
        {activeTab === 'lacak' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-6">
            <div>
              <h3 className="text-lg font-black text-slate-900">
                Pemeriksaan Status Registrasi Baptisan
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Masukkan nomor registrasi yang didapatkan saat pendaftaran (Contoh: BPT-PW-2026-0045).
              </p>
            </div>

            <form onSubmit={handleTrack} className="flex gap-2">
              <input
                type="text"
                required
                value={searchRegNum}
                onChange={(e) => setSearchRegNum(e.target.value)}
                placeholder="Masukkan No. Registrasi..."
                className="flex-1 px-4 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-hidden font-mono"
              />
              <button
                type="submit"
                className="bg-blue-900 hover:bg-blue-800 text-white font-bold px-6 py-2.5 rounded-xl text-xs flex items-center gap-1.5"
              >
                <Search className="w-4 h-4" />
                <span>Cari</span>
              </button>
            </form>

            {trackError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{trackError}</span>
              </div>
            )}

            {trackedRecord && (
              <div className="p-6 bg-slate-50 border border-blue-200 rounded-2xl space-y-4">
                <div className="flex items-center justify-between border-b pb-3">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-bold">No. Pendaftaran:</span>
                    <p className="text-base font-black font-mono text-blue-900">{trackedRecord.regNumber}</p>
                  </div>
                  <span className="px-3 py-1 bg-amber-100 text-amber-900 font-bold rounded-full text-xs border border-amber-300">
                    {trackedRecord.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500">Nama Calon:</span>
                    <p className="font-bold text-slate-900">{trackedRecord.fullName}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Sektor:</span>
                    <p className="font-bold text-slate-900">{trackedRecord.wikSector}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Orang Tua:</span>
                    <p className="font-semibold text-slate-800">{trackedRecord.fatherName} & {trackedRecord.motherName}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Jadwal Baptisan:</span>
                    <p className="font-bold text-blue-800">{trackedRecord.preferredDate}</p>
                  </div>
                </div>

                <div className="pt-2 border-t flex justify-end">
                  <a
                    href={`https://wa.me/${CHURCH_INFO.whatsappCare}?text=${encodeURIComponent(`Shalom Majelis, menanyakan berkas baptisan ${trackedRecord.regNumber} atas nama ${trackedRecord.fullName}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-emerald-700 hover:text-emerald-800"
                  >
                    Hubungi Sekretariat terkait berkas ini →
                  </a>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
