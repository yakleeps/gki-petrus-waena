import React, { useState, useEffect } from 'react';
import { KspData } from '../../types';
import { Users, X, Check, Calendar, Phone, MapPin, Home } from 'lucide-react';

interface KspFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: KspData) => void;
  initialData?: KspData | null;
  rayonName: string;
}

export const KspFormModal: React.FC<KspFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  rayonName,
}) => {
  const [name, setName] = useState('');
  const [ketuaKsp, setKetuaKsp] = useState('');
  const [noHpKetua, setNoHpKetua] = useState('');
  const [jadwalHari, setJadwalHari] = useState('Setiap Rabu, 18:00 WIT');
  const [lokasiPertemuan, setLokasiPertemuan] = useState('');
  const [tuanRumahBulanIni, setTuanRumahBulanIni] = useState('');
  const [jumlahAnggota, setJumlahAnggota] = useState<number>(30);
  const [jumlahKk, setJumlahKk] = useState<number>(8);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setKetuaKsp(initialData.ketuaKsp);
      setNoHpKetua(initialData.noHpKetua);
      setJadwalHari(initialData.jadwalHari);
      setLokasiPertemuan(initialData.lokasiPertemuan);
      setTuanRumahBulanIni(initialData.tuanRumahBulanIni);
      setJumlahAnggota(initialData.jumlahAnggota);
      setJumlahKk(initialData.jumlahKk);
    } else {
      setName('');
      setKetuaKsp('');
      setNoHpKetua('');
      setJadwalHari('Setiap Rabu, 18:00 WIT');
      setLokasiPertemuan('');
      setTuanRumahBulanIni('');
      setJumlahAnggota(30);
      setJumlahKk(8);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !ketuaKsp.trim()) return;

    const kspRecord: KspData = {
      id: initialData?.id || `ksp-${Date.now()}`,
      name: name.trim(),
      ketuaKsp: ketuaKsp.trim(),
      noHpKetua: noHpKetua.trim() || '0812-xxxx-xxxx',
      jadwalHari: jadwalHari.trim() || 'Setiap Rabu, 18:00 WIT',
      lokasiPertemuan: lokasiPertemuan.trim() || 'Rumah warga jemaat',
      tuanRumahBulanIni: tuanRumahBulanIni.trim() || 'Ditentukan berkala',
      jumlahAnggota: Number(jumlahAnggota) || 0,
      jumlahKk: Number(jumlahKk) || 0,
    };

    onSave(kspRecord);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 text-slate-100 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-blue-950 to-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30 font-bold">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                Kelompok Sel Pemuridan • {rayonName}
              </span>
              <h3 className="text-base font-black text-white">
                {initialData ? 'Edit Data KSP' : 'Tambah Kelompok KSP Baru'}
              </h3>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1 custom-scrollbar text-xs">
          <div>
            <label className="block font-bold text-slate-200 mb-1">Nama Kelompok KSP *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: KSP Filia Sion 2"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-hidden focus:border-amber-400 text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-200 mb-1">Nama Ketua / Koordinator KSP *</label>
              <input
                type="text"
                required
                value={ketuaKsp}
                onChange={(e) => setKetuaKsp(e.target.value)}
                placeholder="Contoh: Bpk. Markus Waromi"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-hidden focus:border-amber-400 text-sm"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-200 mb-1">Nomor Kontak / WhatsApp</label>
              <input
                type="text"
                value={noHpKetua}
                onChange={(e) => setNoHpKetua(e.target.value)}
                placeholder="Contoh: 0812-4812-3001"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-hidden focus:border-amber-400 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-200 mb-1">Jadwal Pertemuan Rutin</label>
            <input
              type="text"
              value={jadwalHari}
              onChange={(e) => setJadwalHari(e.target.value)}
              placeholder="Contoh: Setiap Rabu, 18:00 WIT"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-hidden focus:border-amber-400 text-sm"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-200 mb-1">Lokasi / Alamat Wilayah Pertemuan</label>
            <input
              type="text"
              value={lokasiPertemuan}
              onChange={(e) => setLokasiPertemuan(e.target.value)}
              placeholder="Contoh: Jl. Kasuari Jalur 3 No. 12"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-hidden focus:border-amber-400 text-sm"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-200 mb-1">Tuan Rumah Ibadah Bulan Ini</label>
            <input
              type="text"
              value={tuanRumahBulanIni}
              onChange={(e) => setTuanRumahBulanIni(e.target.value)}
              placeholder="Contoh: Kel. Bpk. Frans Wanggai"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-hidden focus:border-amber-400 text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block font-bold text-slate-200 mb-1">Jumlah Jiwa Terdaftar</label>
              <input
                type="number"
                min="0"
                value={jumlahAnggota}
                onChange={(e) => setJumlahAnggota(parseInt(e.target.value) || 0)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-white focus:outline-hidden focus:border-amber-400 text-sm"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-200 mb-1">Jumlah Kepala Keluarga (KK)</label>
              <input
                type="number"
                min="0"
                value={jumlahKk}
                onChange={(e) => setJumlahKk(parseInt(e.target.value) || 0)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-white focus:outline-hidden focus:border-amber-400 text-sm"
              />
            </div>
          </div>

          {/* Buttons */}
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
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-bold text-white text-xs shadow-md"
            >
              <Check className="w-4 h-4" />
              <span>{initialData ? 'Simpan Perubahan KSP' : 'Tambahkan KSP'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
