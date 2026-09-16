import React, { useState, useEffect } from 'react';
import { RAYONS_LIST } from '../data/rayonData';
import { RayonData, FamilyRecord, KspData, AdminUser, RayonStatistic } from '../types';
import { canManageRayon } from '../data/authUsers';
import { FamilyFormModal } from './modals/FamilyFormModal';
import { KspFormModal } from './modals/KspFormModal';
import { RayonEditModal } from './modals/RayonEditModal';
import { DeleteConfirmModal } from './modals/DeleteConfirmModal';
import {
  Users,
  Home,
  BarChart3,
  MapPin,
  Phone,
  Calendar,
  Clock,
  ChevronRight,
  CheckCircle2,
  Search,
  Building,
  UserCheck,
  Shield,
  Heart,
  Award,
  Layers,
  Sparkles,
  Info,
  BookOpen,
  Plus,
  Edit,
  Trash2,
  Lock,
  Unlock,
  Crown,
  RotateCcw,
  Check,
  GraduationCap,
  Briefcase,
  Droplet,
  Globe
} from 'lucide-react';

interface DataJemaatSectionProps {
  selectedRayonId: number;
  onSelectRayon: (id: number) => void;
  currentUser: AdminUser | null;
  onOpenLoginModal: (targetRayonId?: number) => void;
  onLogout: () => void;
}

type RayonTab = 'statistik' | 'data-rayon' | 'data-ksp' | 'data-keluarga';

const STORAGE_KEY = 'gki_petrus_waena_rayons_data_v2';

export const DataJemaatSection: React.FC<DataJemaatSectionProps> = ({
  selectedRayonId,
  onSelectRayon,
  currentUser,
  onOpenLoginModal,
  onLogout,
}) => {
  // Store all 12 Rayons in state, backed by localStorage
  const [rayonsData, setRayonsData] = useState<RayonData[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error loading saved rayons data', e);
    }
    return RAYONS_LIST;
  });

  // Save whenever rayonsData changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(rayonsData));
    } catch (e) {
      console.error('Error saving rayons data', e);
    }
  }, [rayonsData]);

  const [activeSubTab, setActiveSubTab] = useState<RayonTab>('statistik');
  const [familySearchQuery, setFamilySearchQuery] = useState('');
  const [selectedFamily, setSelectedFamily] = useState<FamilyRecord | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals state
  const [isFamilyModalOpen, setIsFamilyModalOpen] = useState(false);
  const [editingFamily, setEditingFamily] = useState<FamilyRecord | null>(null);

  const [isKspModalOpen, setIsKspModalOpen] = useState(false);
  const [editingKsp, setEditingKsp] = useState<KspData | null>(null);

  const [isRayonModalOpen, setIsRayonModalOpen] = useState(false);

  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    itemType: 'Keluarga' | 'KSP' | 'Anggota';
    itemId: string;
    itemName: string;
  } | null>(null);

  const activeRayon: RayonData =
    rayonsData.find((r) => r.id === selectedRayonId) || rayonsData[0] || RAYONS_LIST[0];

  // Check permission for active Rayon:
  // Superadmin -> true for all 12 Rayons
  // Admin Rayon X -> true ONLY if activeRayon.id === X
  const isAuthorized = canManageRayon(currentUser, activeRayon.id);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Recalculate statistics for a rayon based on families
  const recalculateRayonStats = (families: FamilyRecord[]): RayonStatistic => {
    let totalJiwa = 0;
    let lakiLaki = 0;
    let perempuan = 0;
    let anakPar = 0;
    let pemudaPam = 0;
    let kaumIbuPw = 0;
    let kaumBapakPkb = 0;
    let lansia = 0;
    let sudahBaptis = 0;
    let sudahSidi = 0;
    let belumSidi = 0;

    families.forEach((fam) => {
      fam.anggota.forEach((m) => {
        totalJiwa++;
        if (m.gender === 'L') lakiLaki++;
        else perempuan++;

        if (m.age < 15) anakPar++;
        else if (m.age >= 15 && m.age <= 25) pemudaPam++;
        else if (m.age >= 60) lansia++;
        else {
          if (m.gender === 'L') kaumBapakPkb++;
          else kaumIbuPw++;
        }

        if (m.statusBaptis) sudahBaptis++;
        if (m.statusSidi) sudahSidi++;
        else belumSidi++;
      });
    });

    return {
      totalJiwa: totalJiwa || families.length * 4,
      totalKk: families.length,
      lakiLaki,
      perempuan,
      anakPar,
      pemudaPam,
      kaumIbuPw,
      kaumBapakPkb,
      lansia,
      sudahBaptis,
      sudahSidi,
      belumSidi,
    };
  };

  // --- CRUD Handlers for Data Keluarga ---
  const handleSaveFamily = (savedFam: FamilyRecord) => {
    setRayonsData((prev) =>
      prev.map((r) => {
        if (r.id !== activeRayon.id) return r;

        let updatedKeluargaList: FamilyRecord[];
        const exists = r.keluargaList.some((f) => f.id === savedFam.id);
        if (exists) {
          updatedKeluargaList = r.keluargaList.map((f) => (f.id === savedFam.id ? savedFam : f));
          showToast(`Berhasil memperbarui data keluarga: Kel. ${savedFam.kepalaKeluarga}`);
        } else {
          updatedKeluargaList = [savedFam, ...r.keluargaList];
          showToast(`Berhasil menambahkan keluarga baru: Kel. ${savedFam.kepalaKeluarga}`);
        }

        const newStats = recalculateRayonStats(updatedKeluargaList);
        return {
          ...r,
          keluargaList: updatedKeluargaList,
          statistic: newStats,
        };
      })
    );
  };

  const handleDeleteFamily = (familyId: string) => {
    setRayonsData((prev) =>
      prev.map((r) => {
        if (r.id !== activeRayon.id) return r;
        const updatedKeluargaList = r.keluargaList.filter((f) => f.id !== familyId);
        const newStats = recalculateRayonStats(updatedKeluargaList);
        return {
          ...r,
          keluargaList: updatedKeluargaList,
          statistic: newStats,
        };
      })
    );
    setSelectedFamily(null);
    showToast('Data keluarga berhasil dihapus dari rayon.');
  };

  // --- CRUD Handlers for Data KSP ---
  const handleSaveKsp = (savedKsp: KspData) => {
    setRayonsData((prev) =>
      prev.map((r) => {
        if (r.id !== activeRayon.id) return r;

        let updatedKspList: KspData[];
        const exists = r.kspList.some((k) => k.id === savedKsp.id);
        if (exists) {
          updatedKspList = r.kspList.map((k) => (k.id === savedKsp.id ? savedKsp : k));
          showToast(`Berhasil memperbarui data KSP: ${savedKsp.name}`);
        } else {
          updatedKspList = [...r.kspList, savedKsp];
          showToast(`Berhasil menambahkan kelompok sel: ${savedKsp.name}`);
        }

        return {
          ...r,
          kspList: updatedKspList,
        };
      })
    );
  };

  const handleDeleteKsp = (kspId: string) => {
    setRayonsData((prev) =>
      prev.map((r) => {
        if (r.id !== activeRayon.id) return r;
        const updatedKspList = r.kspList.filter((k) => k.id !== kspId);
        return {
          ...r,
          kspList: updatedKspList,
        };
      })
    );
    showToast('Data kelompok sel pemuridan (KSP) berhasil dihapus.');
  };

  // --- Edit Handler for Data Rayon ---
  const handleSaveRayonInfo = (updatedFields: Partial<RayonData>) => {
    setRayonsData((prev) =>
      prev.map((r) => {
        if (r.id !== activeRayon.id) return r;
        return {
          ...r,
          ...updatedFields,
        };
      })
    );
    showToast(`Data pengurus & informasi ${activeRayon.code} berhasil diperbarui.`);
  };

  // --- Reset to default factory mock data ---
  const handleResetToDefault = () => {
    if (window.confirm('Reset semua data 12 Rayon kembali ke data awal gereja?')) {
      setRayonsData(RAYONS_LIST);
      localStorage.removeItem(STORAGE_KEY);
      showToast('Data 12 Rayon telah dikembalikan ke data awal gereja.');
    }
  };

  const filteredFamilies = activeRayon.keluargaList.filter((fam) => {
    const q = familySearchQuery.toLowerCase();
    return (
      fam.kepalaKeluarga.toLowerCase().includes(q) ||
      fam.noKkGereja.toLowerCase().includes(q) ||
      fam.alamat.toLowerCase().includes(q) ||
      fam.kspName.toLowerCase().includes(q) ||
      fam.anggota?.some(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          (m.pekerjaan && m.pekerjaan.toLowerCase().includes(q)) ||
          (m.pendidikan && m.pendidikan.toLowerCase().includes(q)) ||
          (m.etnik && m.etnik.toLowerCase().includes(q)) ||
          (m.talenta && m.talenta.toLowerCase().includes(q)) ||
          (m.golonganDarah && m.golonganDarah.toLowerCase().includes(q)) ||
          (m.noKontak && m.noKontak.includes(q))
      )
    );
  });

  // Calculate aggregate church statistics across all 12 Rayons
  const totalJiwaAll = rayonsData.reduce((acc, r) => acc + r.statistic.totalJiwa, 0);
  const totalKkAll = rayonsData.reduce((acc, r) => acc + r.statistic.totalKk, 0);

  return (
    <section
      id="data-jemaat-section"
      aria-labelledby="data-jemaat-heading"
      className="py-10 bg-slate-900 text-slate-100 min-h-screen relative"
    >
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-emerald-950 border border-emerald-500 text-emerald-100 shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Hierarchy Navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 bg-slate-800/90 p-3.5 rounded-2xl border border-slate-700/60">
          <nav
            aria-label="Breadcrumb Hirarki Data Jemaat"
            className="flex items-center flex-wrap gap-2 text-xs sm:text-sm text-slate-400"
          >
            <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
              <Users className="w-4 h-4" />
              <span>Data Jemaat</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500" />
            <div className="flex items-center gap-1.5 text-slate-300 font-medium">
              <Layers className="w-4 h-4 text-sky-400" />
              <span>Data Keluarga 12 Rayon</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500" />
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-800/50">
              <span>{activeRayon.name}</span>
            </div>
          </nav>

          {/* User Auth Action Pill in Toolbar */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            {currentUser ? (
              <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-700">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-bold text-slate-200">
                  {currentUser.role === 'superadmin' ? '👑 Superadmin' : `🛡️ Admin Rayon ${currentUser.rayonId}`}
                </span>
                <button
                  onClick={() => onOpenLoginModal(activeRayon.id)}
                  className="text-[11px] text-amber-400 hover:underline font-semibold ml-1"
                >
                  Profil
                </button>
                <button
                  onClick={onLogout}
                  className="text-[11px] text-rose-400 hover:text-rose-300 font-semibold ml-2 pl-2 border-l border-slate-700"
                >
                  Keluar
                </button>
              </div>
            ) : (
              <button
                onClick={() => onOpenLoginModal(activeRayon.id)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-sm transition-all"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Login Admin Rayon {activeRayon.id}</span>
              </button>
            )}
          </div>
        </div>

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              Sistem Informasi Pelayanan Jemaat GKI Petrus Waena
            </div>
            <h1
              id="data-jemaat-heading"
              className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-3"
            >
              <span>Data Jemaat & Data Keluarga 12 Rayon</span>
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1.5 max-w-3xl leading-relaxed">
              Pangkalan data jemaat terpusat dengan otentikasi berjenjang. Superadmin berwenang mengelola seluruh 12 Rayon, sedangkan 12 Admin Rayon memiliki kewenangan khusus edit, tambah, dan hapus data rayon masing-masing.
            </p>
          </div>

          {/* Quick Aggregate Stats for entire Church */}
          <div className="flex items-center gap-3 bg-slate-800/90 border border-slate-700 p-3 rounded-2xl shrink-0">
            <div className="text-center px-3 border-r border-slate-700">
              <span className="block text-[11px] text-slate-400 font-medium">12 Rayon</span>
              <span className="text-base font-black text-amber-400">Aktif</span>
            </div>
            <div className="text-center px-3 border-r border-slate-700">
              <span className="block text-[11px] text-slate-400 font-medium">Total Jiwa</span>
              <span className="text-base font-black text-emerald-400">{totalJiwaAll.toLocaleString()}</span>
            </div>
            <div className="text-center px-3">
              <span className="block text-[11px] text-slate-400 font-medium">Total KK</span>
              <span className="text-base font-black text-sky-400">{totalKkAll.toLocaleString()} KK</span>
            </div>
          </div>
        </div>

        {/* 12 Rayon Selection Toolbar */}
        <div className="mb-6 bg-slate-800/90 p-4 rounded-2xl border border-slate-700/80 shadow-lg">
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Building className="w-4 h-4 text-amber-400" />
              Pilih Rayon Pelayanan (Rayon 1 - 12):
            </span>
            <div className="flex items-center gap-3">
              <span className="text-xs text-amber-400/90 font-medium hidden sm:inline">
                Aktif: {activeRayon.name}
              </span>
              <button
                type="button"
                onClick={handleResetToDefault}
                className="text-[11px] text-slate-400 hover:text-slate-200 flex items-center gap-1"
                title="Kembalikan data modifikasi ke data default"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Data Awal</span>
              </button>
            </div>
          </div>

          <div
            role="tablist"
            aria-label="Daftar 12 Rayon"
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5"
          >
            {rayonsData.map((rayon) => {
              const isSelected = rayon.id === activeRayon.id;
              const isUserAssignedRayon = currentUser?.role === 'admin_rayon' && currentUser.rayonId === rayon.id;
              return (
                <button
                  key={rayon.id}
                  id={`rayon-select-btn-${rayon.id}`}
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => {
                    onSelectRayon(rayon.id);
                    setSelectedFamily(null);
                  }}
                  className={`flex flex-col text-left p-3 rounded-xl border transition-all duration-150 relative ${
                    isSelected
                      ? 'bg-amber-500 text-slate-950 font-bold border-amber-400 shadow-md ring-2 ring-amber-400/40'
                      : 'bg-slate-900/80 text-slate-200 border-slate-700 hover:bg-slate-700/60 hover:border-slate-600'
                  }`}
                >
                  {isUserAssignedRayon && (
                    <span className="absolute -top-1.5 -right-1.5 bg-sky-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full shadow-sm">
                      Rayon Anda
                    </span>
                  )}
                  <div className="flex items-center justify-between w-full">
                    <span
                      className={`text-xs font-black uppercase px-2 py-0.5 rounded ${
                        isSelected
                          ? 'bg-slate-950 text-amber-400'
                          : 'bg-slate-800 text-amber-300'
                      }`}
                    >
                      {rayon.code}
                    </span>
                    <span
                      className={`text-[11px] font-mono ${
                        isSelected ? 'text-slate-900 font-bold' : 'text-slate-400'
                      }`}
                    >
                      {rayon.statistic.totalKk} KK
                    </span>
                  </div>
                  <span
                    className={`text-xs font-extrabold mt-1.5 truncate ${
                      isSelected ? 'text-slate-950' : 'text-slate-100'
                    }`}
                  >
                    {rayon.singkatan}
                  </span>
                  <span
                    className={`text-[10px] mt-0.5 ${
                      isSelected ? 'text-slate-800 font-medium' : 'text-slate-400'
                    }`}
                  >
                    {rayon.statistic.totalJiwa} Jiwa
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* AUTHORIZATION STATUS BANNER */}
        <div className="mb-6">
          {isAuthorized ? (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/80 via-slate-900 to-emerald-950/60 border border-emerald-600/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 mt-0.5">
                  <Unlock className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase tracking-wider text-emerald-400">
                      {currentUser?.role === 'superadmin' ? 'Kewenangan Superadmin Majelis' : `Kewenangan Admin ${currentUser?.rayonName}`}
                    </span>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-semibold">
                      Mode Edit & Kelola Aktif
                    </span>
                  </div>
                  <p className="text-xs text-slate-200 mt-0.5">
                    {currentUser?.role === 'superadmin'
                      ? `Anda memiliki hak akses penuh Superadmin untuk Menambah, Mengedit, dan Menghapus data di ${activeRayon.name}.`
                      : `Anda terotentikasi sebagai Admin resmi ${activeRayon.name}. Anda berwenang mengubah data keluarga, KSP, dan pengurus rayon ini.`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => {
                    setEditingFamily(null);
                    setIsFamilyModalOpen(true);
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah KK</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditingKsp(null);
                    setIsKspModalOpen(true);
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-md transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah KSP</span>
                </button>
              </div>
            </div>
          ) : currentUser ? (
            /* User is logged in as another rayon admin */
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/70 via-slate-900 to-slate-900 border border-amber-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 mt-0.5">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase tracking-wider text-amber-400">
                      Hak Akses Terbatas (Hanya-Baca)
                    </span>
                    <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full">
                      Akun: {currentUser.name}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Sesuai mandat gereja, Anda <strong>HANYA</strong> berwenang mengedit data pada <strong>{currentUser.rayonName}</strong>. Data pada <strong>{activeRayon.name}</strong> bersifat Hanya-Baca (Read-Only).
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (currentUser.rayonId) onSelectRayon(currentUser.rayonId);
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md transition-all shrink-0"
              >
                <span>Beralih ke Rayon {currentUser.rayonId} ({currentUser.rayonName})</span>
                <span>→</span>
              </button>
            </div>
          ) : (
            /* Guest / not logged in */
            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-slate-700 text-slate-300 mt-0.5">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                      Mode Tamu / Warga Jemaat (Hanya Baca)
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Untuk menambah, mengedit, atau menghapus data di {activeRayon.name}, silakan login sebagai <strong>Superadmin</strong> atau <strong>Admin Rayon {activeRayon.id}</strong>.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onOpenLoginModal(activeRayon.id)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-sm transition-all shrink-0"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Login Admin Rayon {activeRayon.id}</span>
              </button>
            </div>
          )}
        </div>

        {/* Rayon Details Section with 4 Sub-Tabs */}
        <div className="bg-slate-850 rounded-3xl border border-slate-700/80 shadow-2xl overflow-hidden mb-10">
          {/* Active Rayon Header Bar */}
          <div className="p-6 bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border-b border-slate-700/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-widest bg-amber-400/10 px-2.5 py-0.5 rounded border border-amber-400/30">
                  {activeRayon.code}
                </span>
                <span className="text-xs text-slate-400">• Klasis Port Numbay</span>
              </div>
              <h2 className="text-2xl font-black text-white mt-1">
                {activeRayon.name}
              </h2>
              <p className="text-xs text-slate-300 mt-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>{activeRayon.wilayah}</span>
              </p>
            </div>

            {/* Sub-Tabs Selector */}
            <div
              role="tablist"
              aria-label="Sub Menu Rayon"
              className="flex items-center p-1.5 bg-slate-900 rounded-2xl border border-slate-750 flex-wrap gap-1"
            >
              <button
                id="tab-btn-statistik"
                role="tab"
                aria-selected={activeSubTab === 'statistik'}
                onClick={() => setActiveSubTab('statistik')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeSubTab === 'statistik'
                    ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span>1. Statistik Jemaat</span>
              </button>

              <button
                id="tab-btn-data-rayon"
                role="tab"
                aria-selected={activeSubTab === 'data-rayon'}
                onClick={() => setActiveSubTab('data-rayon')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeSubTab === 'data-rayon'
                    ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Building className="w-4 h-4" />
                <span>2. Data Rayon</span>
              </button>

              <button
                id="tab-btn-data-ksp"
                role="tab"
                aria-selected={activeSubTab === 'data-ksp'}
                onClick={() => setActiveSubTab('data-ksp')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeSubTab === 'data-ksp'
                    ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>3. Data KSP ({activeRayon.kspList.length})</span>
              </button>

              <button
                id="tab-btn-data-keluarga"
                role="tab"
                aria-selected={activeSubTab === 'data-keluarga'}
                onClick={() => setActiveSubTab('data-keluarga')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeSubTab === 'data-keluarga'
                    ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Home className="w-4 h-4" />
                <span>4. Data Keluarga ({activeRayon.keluargaList.length})</span>
              </button>
            </div>
          </div>

          {/* Sub-Tab 1: STATISTIK JEMAAT RAYON [X] */}
          {activeSubTab === 'statistik' && (
            <div id="panel-statistik" className="p-6 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-black text-white flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-amber-400" />
                    Statistik Jemaat {activeRayon.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Rincian demografi warga jemaat, status sakramen, dan kategori unsur pelayanan jemaat.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-950/70 border border-emerald-800/60 px-3 py-1 rounded-lg">
                    Sinkron Real-Time dengan {activeRayon.keluargaList.length} Kartu Keluarga
                  </span>
                </div>
              </div>

              {/* Primary Cards: Total Jiwa & Total KK */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-slate-900/90 border border-slate-700/80 p-4 rounded-2xl">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                    Total Jiwa
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-3xl font-black text-emerald-400">
                      {activeRayon.statistic.totalJiwa}
                    </span>
                    <span className="text-xs text-slate-400">Jiwa</span>
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    {activeRayon.statistic.lakiLaki} Laki-laki • {activeRayon.statistic.perempuan} Perempuan
                  </span>
                </div>

                <div className="bg-slate-900/90 border border-slate-700/80 p-4 rounded-2xl">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                    Kepala Keluarga (KK)
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-3xl font-black text-sky-400">
                      {activeRayon.statistic.totalKk}
                    </span>
                    <span className="text-xs text-slate-400">KK Terdata</span>
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Rata-rata 4.2 Jiwa / KK
                  </span>
                </div>

                <div className="bg-slate-900/90 border border-slate-700/80 p-4 rounded-2xl">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                    Warga Baptis
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-3xl font-black text-purple-400">
                      {activeRayon.statistic.sudahBaptis}
                    </span>
                    <span className="text-xs text-slate-400">Jiwa</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 mt-1 block font-semibold">
                    {Math.round((activeRayon.statistic.sudahBaptis / (activeRayon.statistic.totalJiwa || 1)) * 100)}% Sudah Dibaptis
                  </span>
                </div>

                <div className="bg-slate-900/90 border border-slate-700/80 p-4 rounded-2xl">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                    Warga Sidi
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-3xl font-black text-amber-400">
                      {activeRayon.statistic.sudahSidi}
                    </span>
                    <span className="text-xs text-slate-400">Sidi</span>
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    {activeRayon.statistic.belumSidi} Belum Sidi / Calon
                  </span>
                </div>
              </div>

              {/* Unsur Jemaat (PAR, PAM, PW, PKB, Lansia) */}
              <div className="bg-slate-900/90 border border-slate-700/80 p-5 rounded-2xl">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block mb-4">
                  Demografi Berdasarkan Unsur Kategorial Pelayanan
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700/60 text-center">
                    <span className="text-[10px] font-bold text-sky-400 block uppercase">
                      PAR (Anak)
                    </span>
                    <span className="text-xl font-black text-white mt-1 block">
                      {activeRayon.statistic.anakPar}
                    </span>
                    <span className="text-[10px] text-slate-400">0 - 14 Tahun</span>
                  </div>

                  <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700/60 text-center">
                    <span className="text-[10px] font-bold text-emerald-400 block uppercase">
                      PAM (Pemuda)
                    </span>
                    <span className="text-xl font-black text-white mt-1 block">
                      {activeRayon.statistic.pemudaPam}
                    </span>
                    <span className="text-[10px] text-slate-400">15 - 25 Tahun</span>
                  </div>

                  <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700/60 text-center">
                    <span className="text-[10px] font-bold text-rose-400 block uppercase">
                      PW (Kaum Ibu)
                    </span>
                    <span className="text-xl font-black text-white mt-1 block">
                      {activeRayon.statistic.kaumIbuPw}
                    </span>
                    <span className="text-[10px] text-slate-400">Persekutuan Wanita</span>
                  </div>

                  <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700/60 text-center">
                    <span className="text-[10px] font-bold text-blue-400 block uppercase">
                      PKB (Kaum Bapak)
                    </span>
                    <span className="text-xl font-black text-white mt-1 block">
                      {activeRayon.statistic.kaumBapakPkb}
                    </span>
                    <span className="text-[10px] text-slate-400">Persekutuan Kaum Bapak</span>
                  </div>

                  <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700/60 text-center col-span-2 sm:col-span-1">
                    <span className="text-[10px] font-bold text-amber-400 block uppercase">
                      Lansia
                    </span>
                    <span className="text-xl font-black text-white mt-1 block">
                      {activeRayon.statistic.lansia}
                    </span>
                    <span className="text-[10px] text-slate-400">Usia 60+ Tahun</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Sub-Tab 2: DATA RAYON (Pengurus & Wilayah) */}
          {activeSubTab === 'data-rayon' && (
            <div id="panel-data-rayon" className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                <div>
                  <h3 className="text-lg font-black text-white flex items-center gap-2">
                    <Building className="w-5 h-5 text-amber-400" />
                    Struktur & Informasi Pelayanan {activeRayon.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Rincian koordinator rayon, kontak darurat, majelis pendamping, dan lokasi pos pelayanan.
                  </p>
                </div>
                {isAuthorized && (
                  <button
                    type="button"
                    onClick={() => setIsRayonModalOpen(true)}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all self-start sm:self-auto"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Edit Informasi Pengurus Rayon</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left: Koordinator Rayon */}
                <div className="bg-slate-900/90 border border-slate-700 p-6 rounded-2xl flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block">
                        Koordinator Rayon
                      </span>
                      {isAuthorized && (
                        <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded">
                          Dapat Diedit
                        </span>
                      )}
                    </div>
                    <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center font-black text-xl mb-4">
                      {activeRayon.koordinator.nama.charAt(0)}
                    </div>
                    <h4 className="text-lg font-black text-white">
                      {activeRayon.koordinator.nama}
                    </h4>
                    <span className="text-xs text-amber-400 font-semibold block mt-0.5">
                      {activeRayon.koordinator.jabatan}
                    </span>

                    <div className="mt-4 pt-4 border-t border-slate-800 space-y-2">
                      <div className="flex items-center gap-2 text-xs text-slate-300">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-mono">{activeRayon.koordinator.noHp}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-300">
                        <Building className="w-3.5 h-3.5 text-slate-400" />
                        <span>Pos Pelayanan: {activeRayon.posPelayanan}</span>
                      </div>
                    </div>
                  </div>

                  <a
                    href={`https://wa.me/62${activeRayon.koordinator.noHp.replace(/[^0-9]/g, '').replace(/^0/, '')}?text=Shalom%20Koordinator%20${encodeURIComponent(activeRayon.name)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-6 w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Hubungi Koordinator WhatsApp</span>
                  </a>
                </div>

                {/* Center: Majelis Pendamping (Penatua & Syamas) */}
                <div className="bg-slate-900/90 border border-slate-700 p-6 rounded-2xl">
                  <span className="text-xs font-bold uppercase tracking-wider text-sky-400 block mb-3">
                    Majelis Pendamping Rayon
                  </span>
                  <div className="space-y-4">
                    <div>
                      <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5 mb-2">
                        <Shield className="w-3.5 h-3.5 text-amber-400" />
                        Penatua Pendamping:
                      </span>
                      <ul className="space-y-1.5">
                        {activeRayon.majelisPendamping.penatua.map((p, idx) => (
                          <li
                            key={idx}
                            className="text-xs bg-slate-800/80 px-3 py-2 rounded-lg text-slate-200 border border-slate-700 font-medium flex items-center gap-2"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                            <span>{p}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5 mb-2">
                        <Heart className="w-3.5 h-3.5 text-rose-400" />
                        Syamas Pendamping:
                      </span>
                      <ul className="space-y-1.5">
                        {activeRayon.majelisPendamping.syamas.map((s, idx) => (
                          <li
                            key={idx}
                            className="text-xs bg-slate-800/80 px-3 py-2 rounded-lg text-slate-200 border border-slate-700 font-medium flex items-center gap-2"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                            <span>{s}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Right: Ibadah Rayon & Wilayah Details */}
                <div className="bg-slate-900/90 border border-slate-700 p-6 rounded-2xl flex flex-col justify-between">
                  <div className="space-y-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block">
                      Jadwal & Lingkup Pelayanan
                    </span>

                    <div className="bg-slate-800/90 p-3.5 rounded-xl border border-slate-700">
                      <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        Jadwal Ibadah Rayon:
                      </span>
                      <p className="text-sm font-semibold text-white mt-1">
                        {activeRayon.jadwalIbadahRayon}
                      </p>
                    </div>

                    <div className="bg-slate-800/90 p-3.5 rounded-xl border border-slate-700">
                      <span className="text-xs font-bold text-sky-400 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5" />
                        Cakupan Wilayah / Kompleks:
                      </span>
                      <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                        {activeRayon.wilayah}
                      </p>
                    </div>

                    <div className="bg-slate-800/90 p-3.5 rounded-xl border border-slate-700">
                      <span className="text-xs font-bold text-purple-400 flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5" />
                        Profil Rayon:
                      </span>
                      <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                        {activeRayon.deskripsi}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Sub-Tab 3: DATA KSP (Kelompok Sel Pemuridan) */}
          {activeSubTab === 'data-ksp' && (
            <div id="panel-data-ksp" className="p-6">
              <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-black text-white flex items-center gap-2">
                    <Users className="w-5 h-5 text-amber-400" />
                    Data Kelompok Sel Pemuridan (KSP) {activeRayon.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Daftar KSP naungan {activeRayon.code}, nama ketua, jadwal ibadah sel, tuan rumah persekutuan, dan jumlah anggota.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded-lg self-start sm:self-auto">
                    {activeRayon.kspList.length} Kelompok Sel
                  </span>
                  {isAuthorized && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingKsp(null);
                        setIsKspModalOpen(true);
                      }}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Tambah KSP</span>
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {activeRayon.kspList.map((ksp) => (
                  <div
                    key={ksp.id}
                    className="bg-slate-900/90 border border-slate-700 hover:border-amber-500/50 p-5 rounded-2xl transition-all shadow-md flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 text-xs font-black">
                          {ksp.name}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                            {ksp.jumlahAnggota} Jiwa ({ksp.jumlahKk} KK)
                          </span>
                          {isAuthorized && (
                            <div className="flex items-center gap-1 ml-1">
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingKsp(ksp);
                                  setIsKspModalOpen(true);
                                }}
                                className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-amber-400"
                                title="Edit KSP"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  setDeleteConfirm({
                                    isOpen: true,
                                    itemType: 'KSP',
                                    itemId: ksp.id,
                                    itemName: ksp.name,
                                  })
                                }
                                className="p-1 rounded bg-slate-800 hover:bg-rose-950/60 text-rose-400"
                                title="Hapus KSP"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="space-y-3 mt-4">
                        <div className="flex items-start gap-2.5 text-xs">
                          <UserCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                          <div>
                            <span className="text-slate-400 block font-medium">Ketua KSP:</span>
                            <span className="font-bold text-white">{ksp.ketuaKsp}</span>
                            <span className="block text-[11px] text-slate-400 font-mono">
                              HP: {ksp.noHpKetua}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-start gap-2.5 text-xs">
                          <Calendar className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                          <div>
                            <span className="text-slate-400 block font-medium">Waktu Ibadah:</span>
                            <span className="font-semibold text-slate-200">{ksp.jadwalHari}</span>
                          </div>
                        </div>

                        <div className="flex items-start gap-2.5 text-xs">
                          <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <div>
                            <span className="text-slate-400 block font-medium">Lokasi / Sektor:</span>
                            <span className="font-semibold text-slate-200">{ksp.lokasiPertemuan}</span>
                          </div>
                        </div>

                        <div className="flex items-start gap-2.5 text-xs bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
                          <Home className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                          <div>
                            <span className="text-amber-400 block font-bold text-[11px]">
                              Tuan Rumah Ibadah Bulan Ini:
                            </span>
                            <span className="font-semibold text-white">{ksp.tuanRumahBulanIni}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between">
                      <span className="text-[11px] text-slate-400">Naungan {activeRayon.code}</span>
                      <button
                        onClick={() => {
                          setFamilySearchQuery(ksp.name);
                          setActiveSubTab('data-keluarga');
                        }}
                        className="text-xs text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1"
                      >
                        <span>Lihat KK KSP Ini</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sub-Tab 4: DATA KELUARGA RAYON [X] */}
          {activeSubTab === 'data-keluarga' && (
            <div id="panel-data-keluarga" className="p-6">
              <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-black text-white flex items-center gap-2">
                    <Home className="w-5 h-5 text-amber-400" />
                    Data Keluarga (Kartu Keluarga) {activeRayon.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Daftar Kartu Keluarga, nama kepala keluarga, no. KK gereja, alamat di Waena, dan rincian anggota keluarga.
                  </p>
                </div>

                <div className="flex items-center gap-2.5 flex-wrap">
                  {/* Search Family Input */}
                  <div className="relative w-full sm:w-64">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      id="search-family-input"
                      type="text"
                      value={familySearchQuery}
                      onChange={(e) => setFamilySearchQuery(e.target.value)}
                      placeholder="Cari nama, no KK, KSP..."
                      className="w-full bg-slate-900 text-slate-100 text-xs rounded-xl pl-9 pr-4 py-2.5 border border-slate-700 focus:outline-hidden focus:border-amber-400"
                    />
                    {familySearchQuery && (
                      <button
                        onClick={() => setFamilySearchQuery('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
                      >
                        Reset
                      </button>
                    )}
                  </div>

                  {/* Tambah Keluarga Button if authorized */}
                  {isAuthorized && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingFamily(null);
                        setIsFamilyModalOpen(true);
                      }}
                      className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md transition-all shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>+ Tambah Keluarga Baru</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Family Cards Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {filteredFamilies.map((fam) => (
                  <div
                    key={fam.id}
                    className={`p-5 rounded-2xl border transition-all ${
                      selectedFamily?.id === fam.id
                        ? 'bg-slate-900 border-amber-400 ring-2 ring-amber-400/30 shadow-xl'
                        : 'bg-slate-900/90 border-slate-700 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs text-amber-400 font-bold bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800">
                            {fam.noKkGereja}
                          </span>
                          <span className="text-xs text-sky-400 bg-sky-950/60 px-2 py-0.5 rounded border border-sky-800 font-semibold">
                            {fam.kspName}
                          </span>
                        </div>
                        <h4 className="text-lg font-black text-white mt-2">
                          Kel. {fam.kepalaKeluarga}
                        </h4>
                        {fam.pasangan && (
                          <p className="text-xs text-slate-400">
                            Pasangan: <span className="text-slate-200 font-medium">{fam.pasangan}</span>
                          </p>
                        )}
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <div className="text-right">
                          <span className="text-2xl font-black text-emerald-400">{fam.jumlahJiwa}</span>
                          <span className="block text-[11px] text-slate-400 font-medium">Jiwa</span>
                        </div>
                        {/* Edit & Hapus Buttons for authorized user */}
                        {isAuthorized && (
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingFamily(fam);
                                setIsFamilyModalOpen(true);
                              }}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-amber-400 transition-colors"
                              title="Edit Data Keluarga Ini"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                setDeleteConfirm({
                                  isOpen: true,
                                  itemType: 'Keluarga',
                                  itemId: fam.id,
                                  itemName: `Kel. ${fam.kepalaKeluarga}`,
                                })
                              }
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-600 hover:text-white text-rose-400 transition-colors"
                              title="Hapus Data Keluarga Ini"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-800 space-y-2 text-xs text-slate-300">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                        <span>{fam.alamat}</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                        <span>Terdaftar sejak: {fam.tanggalRegistrasi}</span>
                        <span className="font-semibold text-slate-300">Status: {fam.statusEkonomi || 'Menengah'}</span>
                      </div>
                    </div>

                    {/* Member Breakdown Preview */}
                    <div className="mt-4 pt-3 border-t border-slate-800">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-slate-300">
                          Anggota Keluarga ({fam.anggota.length} Jiwa):
                        </span>
                        <button
                          onClick={() => setSelectedFamily(selectedFamily?.id === fam.id ? null : fam)}
                          className="text-xs font-bold text-amber-400 hover:underline"
                        >
                          {selectedFamily?.id === fam.id ? 'Tutup Detail ▲' : 'Lihat Detail Anggota ▼'}
                        </button>
                      </div>

                      {/* Detailed list if opened */}
                      {selectedFamily?.id === fam.id && (
                        <div className="mt-3 space-y-2 bg-slate-950/70 p-3.5 rounded-xl border border-slate-800">
                          {fam.anggota.map((m) => (
                            <div
                              key={m.id}
                              className="p-3 rounded-xl bg-slate-900/90 border border-slate-800/90 text-xs space-y-2 hover:border-slate-700 transition-colors"
                            >
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 pb-1 border-b border-slate-800/60">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-bold text-white text-sm">{m.name}</span>
                                  <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
                                    {m.relation}
                                  </span>
                                  <span className="text-slate-400 text-[11px]">
                                    • {m.age} thn • {m.gender === 'L' ? 'Laki-laki' : 'Perempuan'}
                                  </span>
                                </div>

                                <div className="flex items-center gap-1.5 flex-wrap">
                                  {m.statusBaptis ? (
                                    <span className="text-[10px] font-medium text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                                      Baptis ✓
                                    </span>
                                  ) : (
                                    <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                                      Belum Baptis
                                    </span>
                                  )}
                                  {m.statusSidi ? (
                                    <span className="text-[10px] font-medium text-purple-300 bg-purple-950/80 px-2 py-0.5 rounded border border-purple-800">
                                      Sidi ✓
                                    </span>
                                  ) : (
                                    <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                                      Belum Sidi
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Member Attributes Grid */}
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 pt-0.5">
                                {/* Pendidikan */}
                                <div className="flex items-center gap-1.5 text-[11px] text-slate-300">
                                  <GraduationCap className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                                  <span className="text-slate-400">Pendidikan:</span>
                                  <span className="font-medium text-slate-200 truncate">{m.pendidikan || '-'}</span>
                                </div>

                                {/* Pekerjaan */}
                                <div className="flex items-center gap-1.5 text-[11px] text-slate-300">
                                  <Briefcase className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                                  <span className="text-slate-400">Pekerjaan:</span>
                                  <span className="font-medium text-slate-200 truncate">{m.pekerjaan || '-'}</span>
                                </div>

                                {/* Golongan Darah */}
                                <div className="flex items-center gap-1.5 text-[11px] text-slate-300">
                                  <Droplet className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                                  <span className="text-slate-400">Gol. Darah:</span>
                                  <span className="font-bold text-rose-300 px-1.5 py-0.2 bg-rose-950/60 rounded border border-rose-800/60 text-[10px]">
                                    {m.golonganDarah || 'Belum Tahu'}
                                  </span>
                                </div>

                                {/* Etnik */}
                                <div className="flex items-center gap-1.5 text-[11px] text-slate-300">
                                  <Globe className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                  <span className="text-slate-400">Etnik:</span>
                                  <span className="font-medium text-slate-200 truncate">{m.etnik || '-'}</span>
                                </div>

                                {/* No. Kontak */}
                                <div className="flex items-center gap-1.5 text-[11px] text-slate-300">
                                  <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                  <span className="text-slate-400">Kontak:</span>
                                  {m.noKontak ? (
                                    <a
                                      href={`https://wa.me/${m.noKontak.replace(/[^0-9]/g, '').replace(/^0/, '62')}`}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="font-mono text-emerald-400 hover:text-emerald-300 hover:underline flex items-center gap-1"
                                      title="Hubungi via WhatsApp"
                                    >
                                      <span>{m.noKontak}</span>
                                    </a>
                                  ) : (
                                    <span className="text-slate-500 italic">-</span>
                                  )}
                                </div>

                                {/* Talenta / Life Skill */}
                                <div className="flex items-center gap-1.5 text-[11px] text-slate-300 sm:col-span-2 lg:col-span-1">
                                  <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                                  <span className="text-slate-400">Talenta:</span>
                                  <span className="font-medium text-amber-200 truncate" title={m.talenta}>
                                    {m.talenta || '-'}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {filteredFamilies.length === 0 && (
                <div className="text-center py-12 bg-slate-900/60 rounded-2xl border border-slate-800">
                  <Home className="w-10 h-10 text-slate-500 mx-auto mb-3" />
                  <p className="text-sm font-bold text-slate-300">
                    Tidak ditemukan data keluarga dengan kata kunci "{familySearchQuery}"
                  </p>
                  <button
                    onClick={() => setFamilySearchQuery('')}
                    className="mt-3 px-4 py-2 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs"
                  >
                    Reset Pencarian
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Guidance for Rayon Switching */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-white block">
                Navigasi Cepat Antar Rayon:
              </span>
              <p className="text-xs text-slate-400">
                Pilih Rayon 1 s/d Rayon 12 di atas untuk memeriksa statistik, profil rayon, kelompok KSP, dan data keluarga masing-masing.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="prev-rayon-btn"
              onClick={() => onSelectRayon(activeRayon.id > 1 ? activeRayon.id - 1 : 12)}
              className="px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-xs font-bold text-slate-200 transition-all"
            >
              ← Rayon Sebelumnya
            </button>
            <span className="text-xs font-mono font-bold text-amber-400 px-2">
              {activeRayon.id} / 12
            </span>
            <button
              id="next-rayon-btn"
              onClick={() => onSelectRayon(activeRayon.id < 12 ? activeRayon.id + 1 : 1)}
              className="px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-xs font-bold text-slate-200 transition-all"
            >
              Rayon Berikutnya →
            </button>
          </div>
        </div>
      </div>

      {/* MODALS */}
      {/* 1. Family Form Modal (Add / Edit) */}
      <FamilyFormModal
        isOpen={isFamilyModalOpen}
        onClose={() => {
          setIsFamilyModalOpen(false);
          setEditingFamily(null);
        }}
        onSave={handleSaveFamily}
        initialData={editingFamily}
        rayonCode={activeRayon.code}
        rayonName={activeRayon.name}
        kspList={activeRayon.kspList}
      />

      {/* 2. KSP Form Modal (Add / Edit) */}
      <KspFormModal
        isOpen={isKspModalOpen}
        onClose={() => {
          setIsKspModalOpen(false);
          setEditingKsp(null);
        }}
        onSave={handleSaveKsp}
        initialData={editingKsp}
        rayonName={activeRayon.name}
      />

      {/* 3. Rayon Edit Modal */}
      <RayonEditModal
        isOpen={isRayonModalOpen}
        onClose={() => setIsRayonModalOpen(false)}
        onSave={handleSaveRayonInfo}
        rayon={activeRayon}
      />

      {/* 4. Delete Confirm Modal */}
      {deleteConfirm && (
        <DeleteConfirmModal
          isOpen={deleteConfirm.isOpen}
          onClose={() => setDeleteConfirm(null)}
          onConfirm={() => {
            if (deleteConfirm.itemType === 'Keluarga') {
              handleDeleteFamily(deleteConfirm.itemId);
            } else if (deleteConfirm.itemType === 'KSP') {
              handleDeleteKsp(deleteConfirm.itemId);
            }
          }}
          title={`Konfirmasi Hapus Data ${deleteConfirm.itemType}`}
          itemName={deleteConfirm.itemName}
          itemType={deleteConfirm.itemType}
        />
      )}
    </section>
  );
};
