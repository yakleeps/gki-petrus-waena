import React, { useState, useEffect } from 'react';
import { FamilyRecord, FamilyMember, KspData } from '../../types';
import { 
  Home, 
  X, 
  Plus, 
  Trash2, 
  Check, 
  User, 
  MapPin, 
  Users, 
  Calendar,
  AlertCircle,
  GraduationCap,
  Briefcase,
  Droplet,
  Globe,
  Phone,
  Sparkles
} from 'lucide-react';

interface FamilyFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (family: FamilyRecord) => void;
  initialData?: FamilyRecord | null;
  rayonCode: string;
  rayonName: string;
  kspList: KspData[];
}

export const FamilyFormModal: React.FC<FamilyFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  rayonCode,
  rayonName,
  kspList,
}) => {
  const [noKkGereja, setNoKkGereja] = useState('');
  const [kepalaKeluarga, setKepalaKeluarga] = useState('');
  const [pasangan, setPasangan] = useState('');
  const [alamat, setAlamat] = useState('');
  const [kspName, setKspName] = useState(kspList[0]?.name || 'KSP Sektor');
  const [statusEkonomi, setStatusEkonomi] = useState<'Mampu' | 'Menengah' | 'Diakonia / Prasejahtera'>('Menengah');
  const [tanggalRegistrasi, setTanggalRegistrasi] = useState(new Date().toISOString().split('T')[0]);
  
  // Dynamic list of family members
  const [members, setMembers] = useState<FamilyMember[]>([]);

  useEffect(() => {
    if (initialData) {
      setNoKkGereja(initialData.noKkGereja);
      setKepalaKeluarga(initialData.kepalaKeluarga);
      setPasangan(initialData.pasangan || '');
      setAlamat(initialData.alamat);
      setKspName(initialData.kspName);
      setStatusEkonomi(initialData.statusEkonomi || 'Menengah');
      setTanggalRegistrasi(initialData.tanggalRegistrasi || new Date().toISOString().split('T')[0]);
      setMembers(initialData.anggota ? [...initialData.anggota] : []);
    } else {
      const randomSuffix = Math.floor(100 + Math.random() * 900);
      setNoKkGereja(`KK-${rayonCode.replace('Rayon ', 'R')}-${randomSuffix}`);
      setKepalaKeluarga('');
      setPasangan('');
      setAlamat('');
      setKspName(kspList[0]?.name || 'KSP Sektor');
      setStatusEkonomi('Menengah');
      setTanggalRegistrasi(new Date().toISOString().split('T')[0]);
      // Default initial member: Kepala Keluarga
      setMembers([
        {
          id: `mem-${Date.now()}-1`,
          name: '',
          relation: 'Kepala Keluarga',
          gender: 'L',
          age: 42,
          statusBaptis: true,
          statusSidi: true,
          pendidikan: 'Sarjana (S1)',
          pekerjaan: 'PNS / ASN',
          golonganDarah: 'O',
          etnik: 'Biak',
          noKontak: '',
          talenta: '',
        }
      ]);
    }
  }, [initialData, isOpen, rayonCode, kspList]);

  if (!isOpen) return null;

  const handleAddMember = () => {
    const defaultEtnik = members[0]?.etnik || 'Biak';
    const newMember: FamilyMember = {
      id: `mem-${Date.now()}-${members.length + 1}`,
      name: '',
      relation: 'Anak',
      gender: 'L',
      age: 16,
      statusBaptis: true,
      statusSidi: false,
      pendidikan: 'SMA / SMK / Sederajat',
      pekerjaan: 'Pelajar / Mahasiswa',
      golonganDarah: 'Belum Tahu',
      etnik: defaultEtnik,
      noKontak: '',
      talenta: '',
    };
    setMembers([...members, newMember]);
  };

  const handleRemoveMember = (index: number) => {
    if (members.length === 1) return; // Keep at least one
    const updated = members.filter((_, i) => i !== index);
    setMembers(updated);
  };

  const handleMemberChange = (index: number, field: keyof FamilyMember, val: any) => {
    const updated = [...members];
    updated[index] = { ...updated[index], [field]: val };
    
    // If updating the Kepala Keluarga's name in member list, keep kepalaKeluarga synced
    if (index === 0 && field === 'name') {
      setKepalaKeluarga(val);
    }
    setMembers(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!kepalaKeluarga.trim()) return;

    // Ensure member #0 matches kepala keluarga
    const finalMembers = [...members];
    if (finalMembers.length > 0 && finalMembers[0].relation === 'Kepala Keluarga') {
      finalMembers[0].name = kepalaKeluarga.trim();
    }

    const newFamily: FamilyRecord = {
      id: initialData?.id || `fam-${Date.now()}`,
      noKkGereja: noKkGereja.trim() || `KK-${Date.now()}`,
      kepalaKeluarga: kepalaKeluarga.trim(),
      pasangan: pasangan.trim() || undefined,
      jumlahJiwa: finalMembers.length,
      alamat: alamat.trim() || 'Waena, Jayapura',
      kspName: kspName.trim(),
      statusEkonomi: statusEkonomi,
      anggota: finalMembers,
      tanggalRegistrasi: tanggalRegistrasi || new Date().toISOString().split('T')[0],
    };

    onSave(newFamily);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700 text-slate-100 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30 font-bold">
              <Home className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                Kartu Keluarga Jemaat • {rayonName}
              </span>
              <h3 className="text-base font-black text-white">
                {initialData ? `Edit Kartu Keluarga: ${initialData.kepalaKeluarga}` : `Tambah Keluarga Baru di ${rayonCode}`}
              </h3>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto flex-1 custom-scrollbar text-xs">
          {/* Main Family Information */}
          <div className="space-y-4">
            <div className="text-[11px] font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" />
              <span>1. Identitas Kepala Keluarga & Alamat</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Nomor KK Gereja *</label>
                <input
                  type="text"
                  required
                  value={noKkGereja}
                  onChange={(e) => setNoKkGereja(e.target.value)}
                  placeholder="Contoh: KK-R1-085"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-hidden focus:border-amber-400 text-sm"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-300 mb-1">Nama Kepala Keluarga (Bapak/Ibu) *</label>
                <input
                  type="text"
                  required
                  value={kepalaKeluarga}
                  onChange={(e) => {
                    setKepalaKeluarga(e.target.value);
                    if (members.length > 0) {
                      handleMemberChange(0, 'name', e.target.value);
                    }
                  }}
                  placeholder="Contoh: Bpk. Markus Waromi"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-hidden focus:border-amber-400 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Nama Istri / Pasangan</label>
                <input
                  type="text"
                  value={pasangan}
                  onChange={(e) => setPasangan(e.target.value)}
                  placeholder="Contoh: Ibu Maria Waromi - Morin"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-hidden focus:border-amber-400 text-sm"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Kelompok Sel Pemuridan (KSP)</label>
                <select
                  value={kspName}
                  onChange={(e) => setKspName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-hidden focus:border-amber-400 text-sm"
                >
                  {kspList.map((ksp) => (
                    <option key={ksp.id} value={ksp.name}>
                      {ksp.name}
                    </option>
                  ))}
                  <option value="KSP Umum Rayon">KSP Umum Rayon</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">Alamat Tempat Tinggal / Jalur RT-RW *</label>
              <input
                type="text"
                required
                value={alamat}
                onChange={(e) => setAlamat(e.target.value)}
                placeholder="Contoh: Jl. Kasuari Jalur 4 No. 12, Perumnas 1 Waena"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-hidden focus:border-amber-400 text-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Kategori Pelayanan Sosial / Diakonia</label>
                <select
                  value={statusEkonomi}
                  onChange={(e) => setStatusEkonomi(e.target.value as any)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-hidden focus:border-amber-400 text-sm"
                >
                  <option value="Mampu">Warga Mandiri / Mampu</option>
                  <option value="Menengah">Menengah</option>
                  <option value="Diakonia / Prasejahtera">Penerima Pelayanan Kasih / Diakonia</option>
                </select>
              </div>
              <div>
                <label className="block font-bold text-slate-300 mb-1">Tanggal Terdaftar Jemaat</label>
                <input
                  type="date"
                  value={tanggalRegistrasi}
                  onChange={(e) => setTanggalRegistrasi(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-hidden focus:border-amber-400 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Family Members Sub-table */}
          <div className="space-y-3 pt-3 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <div className="text-[11px] font-bold text-sky-300 uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" />
                <span>2. Daftar Anggota Keluarga ({members.length} Jiwa)</span>
              </div>
              <button
                type="button"
                onClick={handleAddMember}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-sky-600/30 hover:bg-sky-600 border border-sky-500/50 text-sky-200 hover:text-white font-bold text-xs transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Anggota</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {members.map((member, idx) => (
                <div 
                  key={member.id || idx}
                  className="p-3.5 rounded-2xl bg-slate-850 border border-slate-750 space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-amber-400">
                      Anggota #{idx + 1}: {idx === 0 ? 'Kepala Keluarga' : member.relation}
                    </span>
                    {idx > 0 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveMember(idx)}
                        className="text-rose-400 hover:text-rose-300 p-1 rounded hover:bg-rose-950/40"
                        title="Hapus Anggota Ini"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Row 1: Primary Identity */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                    <div className="sm:col-span-5">
                      <label className="block text-[10px] text-slate-400 mb-0.5">Nama Lengkap *</label>
                      <input
                        type="text"
                        required
                        value={member.name}
                        onChange={(e) => handleMemberChange(idx, 'name', e.target.value)}
                        placeholder="Nama anggota..."
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white text-xs focus:outline-hidden focus:border-amber-400"
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <label className="block text-[10px] text-slate-400 mb-0.5">Hubungan</label>
                      <select
                        value={member.relation}
                        onChange={(e) => handleMemberChange(idx, 'relation', e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2 py-1.5 text-white text-xs focus:outline-hidden"
                      >
                        <option value="Kepala Keluarga">Kepala Keluarga</option>
                        <option value="Istri">Istri</option>
                        <option value="Anak">Anak</option>
                        <option value="Orang Tua">Orang Tua</option>
                        <option value="Famili">Famili</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[10px] text-slate-400 mb-0.5">Gender</label>
                      <select
                        value={member.gender}
                        onChange={(e) => handleMemberChange(idx, 'gender', e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2 py-1.5 text-white text-xs focus:outline-hidden"
                      >
                        <option value="L">Laki-laki</option>
                        <option value="P">Perempuan</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[10px] text-slate-400 mb-0.5">Usia (Tahun)</label>
                      <input
                        type="number"
                        min="0"
                        max="120"
                        value={member.age}
                        onChange={(e) => handleMemberChange(idx, 'age', parseInt(e.target.value) || 0)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2 py-1.5 text-white text-xs focus:outline-hidden"
                      />
                    </div>
                  </div>

                  {/* Row 2: Pendidikan, Pekerjaan, Golongan Darah, Etnik */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 pt-1">
                    <div className="sm:col-span-3">
                      <label className="flex items-center gap-1 text-[10px] text-slate-400 mb-0.5">
                        <GraduationCap className="w-3 h-3 text-sky-400" />
                        <span>Pendidikan</span>
                      </label>
                      <select
                        value={member.pendidikan || 'SMA / SMK / Sederajat'}
                        onChange={(e) => handleMemberChange(idx, 'pendidikan', e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2 py-1.5 text-white text-xs focus:outline-hidden"
                      >
                        <option value="Belum / Tidak Sekolah">Belum / Tidak Sekolah</option>
                        <option value="PAUD / TK">PAUD / TK</option>
                        <option value="SD / Sederajat">SD / Sederajat</option>
                        <option value="SMP / Sederajat">SMP / Sederajat</option>
                        <option value="SMA / SMK / Sederajat">SMA / SMK / Sederajat</option>
                        <option value="Diploma (D1 - D4)">Diploma (D1 - D4)</option>
                        <option value="Sarjana (S1)">Sarjana (S1)</option>
                        <option value="Magister (S2)">Magister (S2)</option>
                        <option value="Doktor (S3)">Doktor (S3)</option>
                        <option value="Lainnya">Lainnya</option>
                      </select>
                    </div>

                    <div className="sm:col-span-4">
                      <label className="flex items-center gap-1 text-[10px] text-slate-400 mb-0.5">
                        <Briefcase className="w-3 h-3 text-amber-400" />
                        <span>Pekerjaan</span>
                      </label>
                      <input
                        type="text"
                        list="list-pekerjaan"
                        value={member.pekerjaan || ''}
                        onChange={(e) => handleMemberChange(idx, 'pekerjaan', e.target.value)}
                        placeholder="Contoh: PNS, Guru, Pelajar"
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white text-xs focus:outline-hidden focus:border-amber-400"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="flex items-center gap-1 text-[10px] text-slate-400 mb-0.5">
                        <Droplet className="w-3 h-3 text-rose-400" />
                        <span>Gol. Darah</span>
                      </label>
                      <select
                        value={member.golonganDarah || 'Belum Tahu'}
                        onChange={(e) => handleMemberChange(idx, 'golonganDarah', e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2 py-1.5 text-white text-xs focus:outline-hidden font-bold"
                      >
                        <option value="Belum Tahu">Belum Tahu</option>
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="AB">AB</option>
                        <option value="O">O</option>
                      </select>
                    </div>

                    <div className="sm:col-span-3">
                      <label className="flex items-center gap-1 text-[10px] text-slate-400 mb-0.5">
                        <Globe className="w-3 h-3 text-emerald-400" />
                        <span>Etnik / Suku</span>
                      </label>
                      <input
                        type="text"
                        list="list-etnik"
                        value={member.etnik || ''}
                        onChange={(e) => handleMemberChange(idx, 'etnik', e.target.value)}
                        placeholder="Biak, Serui, Sentani, Toraja..."
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white text-xs focus:outline-hidden focus:border-amber-400"
                      />
                    </div>
                  </div>

                  {/* Row 3: No. Kontak, Talenta / Life Skill, and Sakramen */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 pt-1">
                    <div className="sm:col-span-3">
                      <label className="flex items-center gap-1 text-[10px] text-slate-400 mb-0.5">
                        <Phone className="w-3 h-3 text-emerald-400" />
                        <span>No. Kontak / WA</span>
                      </label>
                      <input
                        type="tel"
                        value={member.noKontak || ''}
                        onChange={(e) => handleMemberChange(idx, 'noKontak', e.target.value)}
                        placeholder="0812-xxxx-xxxx"
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white text-xs font-mono focus:outline-hidden focus:border-amber-400"
                      />
                    </div>

                    <div className="sm:col-span-5">
                      <label className="flex items-center gap-1 text-[10px] text-slate-400 mb-0.5">
                        <Sparkles className="w-3 h-3 text-amber-300" />
                        <span>Talenta / Life Skill</span>
                      </label>
                      <input
                        type="text"
                        list="list-talenta"
                        value={member.talenta || ''}
                        onChange={(e) => handleMemberChange(idx, 'talenta', e.target.value)}
                        placeholder="Contoh: Pemusik Keyboard, Song Leader, Guru PAR, Pertukangan..."
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white text-xs focus:outline-hidden focus:border-amber-400"
                      />
                    </div>

                    <div className="flex items-center gap-3 pt-4 sm:col-span-4">
                      <label className="inline-flex items-center gap-1.5 text-[11px] text-slate-200 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={member.statusBaptis}
                          onChange={(e) => handleMemberChange(idx, 'statusBaptis', e.target.checked)}
                          className="w-3.5 h-3.5 rounded text-blue-600 focus:ring-0"
                        />
                        <span>Sudah Baptis</span>
                      </label>

                      <label className="inline-flex items-center gap-1.5 text-[11px] text-slate-200 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={member.statusSidi}
                          onChange={(e) => handleMemberChange(idx, 'statusSidi', e.target.checked)}
                          className="w-3.5 h-3.5 rounded text-purple-600 focus:ring-0"
                        />
                        <span>Sudah Sidi</span>
                      </label>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Datalists for quick autocompletion */}
          <datalist id="list-pekerjaan">
            <option value="PNS / ASN" />
            <option value="Guru / Pendidik" />
            <option value="Dosen" />
            <option value="Tenaga Medis / Perawat / Dokter" />
            <option value="Pegawai BUMN / BUMD" />
            <option value="Karyawan Swasta" />
            <option value="TNI / POLRI" />
            <option value="Pendeta / Pelayan Gereja" />
            <option value="Wiraswasta / Pengusaha" />
            <option value="Pedagang / Pelaku UMKM" />
            <option value="Tukang / Pertukangan" />
            <option value="Petani / Pekebun" />
            <option value="Nelayan" />
            <option value="Pengemudi / Transportasi" />
            <option value="Mahasiswa" />
            <option value="Pelajar / Siswa" />
            <option value="Ibu Rumah Tangga (IRT)" />
            <option value="Pensiunan" />
            <option value="Belum / Tidak Bekerja" />
          </datalist>

          <datalist id="list-etnik">
            <option value="Biak" />
            <option value="Serui / Yapen" />
            <option value="Sentani / Jayapura" />
            <option value="Genyem / Grime Nawa" />
            <option value="Waropen" />
            <option value="Nabire" />
            <option value="Mimika / Kamoro" />
            <option value="Wamena / Hubula / Dani" />
            <option value="Mee / Paniai" />
            <option value="Tolikara" />
            <option value="Lanny Jaya" />
            <option value="Yali" />
            <option value="Asmat" />
            <option value="Marind / Merauke" />
            <option value="Mappi" />
            <option value="Boven Digoel" />
            <option value="Arfak / Manokwari" />
            <option value="Moi / Sorong" />
            <option value="Fakfak" />
            <option value="Kaimana" />
            <option value="Toraja" />
            <option value="Minahasa / Manado" />
            <option value="Sangir" />
            <option value="Ambon / Maluku" />
            <option value="Kei" />
            <option value="Batak" />
            <option value="Jawa" />
            <option value="Sunda" />
            <option value="Bugis / Makassar" />
            <option value="Timor / NTT" />
            <option value="Flores / NTT" />
          </datalist>

          <datalist id="list-talenta">
            <option value="Pemusik (Organ / Keyboard / Piano)" />
            <option value="Pemusik (Gitar Akustik / Bass)" />
            <option value="Pemusik (Drum / Perkusi)" />
            <option value="Prokantor / Song Leader" />
            <option value="Penyanyi / Paduan Suara / VG" />
            <option value="Operator Sound System & Audio" />
            <option value="Operator Multimedia & Proyektor" />
            <option value="Operator Live Streaming & Kamera" />
            <option value="Pengajar / Guru Sekolah Minggu (PAR)" />
            <option value="Pelayanan Pemuda / Remaja" />
            <option value="Pendoa Syafaat / Doa Pelayanan" />
            <option value="Konseling Pastoral & Rohani" />
            <option value="Tenaga Medis / P3K / Kesehatan" />
            <option value="Pelayanan Sosial / Diakonia" />
            <option value="Pertukangan Kayu & Mebel" />
            <option value="Teknisi Listrik & Kelistrikan" />
            <option value="Tata Boga / Memasak / Konsumsi" />
            <option value="Dekorasi Ruang Ibadah / Bunga" />
            <option value="Menjahit / Kerajinan Tangan" />
            <option value="Pertanian / Perkebunan Sayur" />
            <option value="Pengemudi / Logistik Transportasi" />
            <option value="Administrasi & Tata Usaha Gereja" />
          </datalist>

          {/* Action Footer */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 font-bold text-slate-300 text-xs"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 font-bold text-slate-950 text-xs shadow-md"
            >
              <Check className="w-4 h-4" />
              <span>{initialData ? 'Simpan Perubahan KK' : 'Simpan Kartu Keluarga Baru'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
