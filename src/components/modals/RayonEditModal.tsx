import React, { useState, useEffect } from 'react';
import { RayonData } from '../../types';
import { Building, X, Check, Phone, MapPin, Calendar, Users, Shield } from 'lucide-react';

interface RayonEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedData: Partial<RayonData>) => void;
  rayon: RayonData;
}

export const RayonEditModal: React.FC<RayonEditModalProps> = ({
  isOpen,
  onClose,
  onSave,
  rayon,
}) => {
  const [namaKoordinator, setNamaKoordinator] = useState('');
  const [jabatanKoordinator, setJabatanKoordinator] = useState('');
  const [noHpKoordinator, setNoHpKoordinator] = useState('');
  const [wilayah, setWilayah] = useState('');
  const [posPelayanan, setPosPelayanan] = useState('');
  const [jadwalIbadahRayon, setJadwalIbadahRayon] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [penatuaList, setPenatuaList] = useState('');
  const [syamasList, setSyamasList] = useState('');

  useEffect(() => {
    if (rayon) {
      setNamaKoordinator(rayon.koordinator.nama);
      setJabatanKoordinator(rayon.koordinator.jabatan);
      setNoHpKoordinator(rayon.koordinator.noHp);
      setWilayah(rayon.wilayah);
      setPosPelayanan(rayon.posPelayanan);
      setJadwalIbadahRayon(rayon.jadwalIbadahRayon);
      setDeskripsi(rayon.deskripsi);
      setPenatuaList(rayon.majelisPendamping.penatua.join(', '));
      setSyamasList(rayon.majelisPendamping.syamas.join(', '));
    }
  }, [rayon, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const penatuaArr = penatuaList
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const syamasArr = syamasList
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    onSave({
      wilayah: wilayah.trim(),
      posPelayanan: posPelayanan.trim(),
      jadwalIbadahRayon: jadwalIbadahRayon.trim(),
      deskripsi: deskripsi.trim(),
      koordinator: {
        nama: namaKoordinator.trim(),
        jabatan: jabatanKoordinator.trim(),
        noHp: noHpKoordinator.trim(),
      },
      majelisPendamping: {
        penatua: penatuaArr.length > 0 ? penatuaArr : rayon.majelisPendamping.penatua,
        syamas: syamasArr.length > 0 ? syamasArr : rayon.majelisPendamping.syamas,
      },
    });

    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700 text-slate-100 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30 font-bold">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                Pengaturan Informasi Rayon Pelayanan
              </span>
              <h3 className="text-base font-black text-white">
                Edit Data {rayon.code}: {rayon.singkatan}
              </h3>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1 custom-scrollbar text-xs">
          {/* Koordinator Fields */}
          <div className="p-4 rounded-2xl bg-slate-850 border border-slate-750 space-y-3">
            <div className="text-[11px] font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" />
              <span>Koordinator / Pengurus Inti Rayon</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Nama Koordinator *</label>
                <input
                  type="text"
                  required
                  value={namaKoordinator}
                  onChange={(e) => setNamaKoordinator(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-hidden focus:border-amber-400 text-sm"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-300 mb-1">Jabatan / Gelar Gerejawi</label>
                <input
                  type="text"
                  value={jabatanKoordinator}
                  onChange={(e) => setJabatanKoordinator(e.target.value)}
                  placeholder="Contoh: Koordinator Rayon 1 (Sion)"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-hidden focus:border-amber-400 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">Nomor WhatsApp / HP Koordinator *</label>
              <input
                type="text"
                required
                value={noHpKoordinator}
                onChange={(e) => setNoHpKoordinator(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-hidden focus:border-amber-400 text-sm"
              />
            </div>
          </div>

          {/* Wilayah & Pos Pelayanan */}
          <div className="space-y-3">
            <div>
              <label className="block font-bold text-slate-300 mb-1">Batas & Cakupan Wilayah Pelayanan</label>
              <textarea
                rows={2}
                value={wilayah}
                onChange={(e) => setWilayah(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white focus:outline-hidden focus:border-amber-400 text-sm"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">Pos Pelayanan / Titik Kumpul</label>
              <input
                type="text"
                value={posPelayanan}
                onChange={(e) => setPosPelayanan(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-hidden focus:border-amber-400 text-sm"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">Jadwal Ibadah Rayon</label>
              <input
                type="text"
                value={jadwalIbadahRayon}
                onChange={(e) => setJadwalIbadahRayon(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-hidden focus:border-amber-400 text-sm"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">Profil Singkat Rayon</label>
              <textarea
                rows={2}
                value={deskripsi}
                onChange={(e) => setDeskripsi(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white focus:outline-hidden focus:border-amber-400 text-sm"
              />
            </div>
          </div>

          {/* Majelis Pendamping */}
          <div className="p-4 rounded-2xl bg-slate-850 border border-slate-750 space-y-3">
            <div className="text-[11px] font-bold text-sky-300 uppercase tracking-wider flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" />
              <span>Majelis Pendamping Rayon (Pisahkan dengan koma)</span>
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">Daftar Penatua Pendamping</label>
              <input
                type="text"
                value={penatuaList}
                onChange={(e) => setPenatuaList(e.target.value)}
                placeholder="Contoh: Pnt. Simon Mandowen, Pnt. Markus Kogoya"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-hidden focus:border-amber-400 text-sm"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">Daftar Syamas Pendamping</label>
              <input
                type="text"
                value={syamasList}
                onChange={(e) => setSyamasList(e.target.value)}
                placeholder="Contoh: Dkn. Maria Waromi, Dkn. Christian Yoku"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-hidden focus:border-amber-400 text-sm"
              />
            </div>
          </div>

          {/* Actions */}
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
              <span>Simpan Perubahan Rayon</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
