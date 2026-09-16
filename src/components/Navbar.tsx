import React, { useState, useRef, useEffect } from 'react';
import { CHURCH_INFO } from '../data/churchData';
import { RAYONS_LIST } from '../data/rayonData';
import { AdminUser } from '../types';
import { 
  Church, 
  Calendar, 
  FileText, 
  UserCheck, 
  Image as ImageIcon, 
  HeartHandshake, 
  Bell, 
  Phone, 
  Menu, 
  X,
  MessageCircle,
  HelpCircle,
  Volume2,
  Users,
  ChevronDown,
  ChevronRight,
  BarChart3,
  Building,
  Home,
  Layers,
  Sparkles,
  Shield,
  Crown,
  Lock,
  LogOut
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenNotificationModal: () => void;
  unreadCount?: number;
  isHighContrast: boolean;
  selectedRayonId?: number;
  onSelectRayon?: (id: number) => void;
  currentUser?: AdminUser | null;
  onOpenLoginModal?: (targetRayonId?: number) => void;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenNotificationModal,
  unreadCount = 2,
  isHighContrast,
  selectedRayonId = 1,
  onSelectRayon,
  currentUser,
  onOpenLoginModal,
  onLogout,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [hoveredRayonId, setHoveredRayonId] = useState<number>(selectedRayonId || 1);
  const [mobileRayonOpen, setMobileRayonOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [
    { id: 'beranda', label: 'Beranda', icon: Church },
    { id: 'jadwal', label: 'Jadwal Ibadah', icon: Calendar },
    { id: 'warta', label: 'Warta Jemaat', icon: FileText },
    { id: 'baptisan', label: 'Daftar Baptisan', icon: UserCheck },
    { id: 'galeri', label: 'Galeri Foto', icon: ImageIcon },
    { id: 'donasi', label: 'Donasi Digital', icon: HeartHandshake },
    { id: 'komunikasi', label: 'Tanya & Doa', icon: MessageCircle },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
    setDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRayonClick = (rayonId: number) => {
    if (onSelectRayon) {
      onSelectRayon(rayonId);
    }
    setActiveTab('data-jemaat');
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const activeRayonInfo = RAYONS_LIST.find((r) => r.id === (hoveredRayonId || 1)) || RAYONS_LIST[0];

  return (
    <>
      {/* Top Header */}
      <header 
        className={`sticky top-0 z-40 transition-colors duration-200 ${
          isHighContrast 
            ? 'bg-black text-white border-b-2 border-amber-400 shadow-md' 
            : 'bg-white/95 backdrop-blur-md text-slate-900 border-b border-slate-200 shadow-xs'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo & Church Identification */}
            <button
              onClick={() => handleNavClick('beranda')}
              className="flex items-center gap-3 text-left focus:outline-hidden group"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-950 text-white flex items-center justify-center shadow-md ring-2 ring-amber-400/40 group-hover:scale-105 transition-transform">
                {/* Visual symbol of Church cross with dove wing styling */}
                <div className="relative flex items-center justify-center">
                  <span className="text-2xl font-serif font-black text-amber-400">†</span>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold uppercase tracking-widest text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200/60">
                    GKI di Tanah Papua
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">
                    Klasis Port Numbay
                  </span>
                </div>
                <h1 className="text-lg sm:text-xl font-black tracking-tight text-slate-900 leading-tight">
                  GKI Petrus Waena
                </h1>
                <p className="text-xs text-slate-500 line-clamp-1 font-medium">
                  Waena, Distrik Heram - Kota Jayapura
                </p>
              </div>
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {/* Beranda */}
              <button
                id="nav-beranda-btn"
                onClick={() => handleNavClick('beranda')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                  activeTab === 'beranda'
                    ? isHighContrast
                      ? 'bg-amber-400 text-black shadow-sm font-bold'
                      : 'bg-blue-900 text-white shadow-sm'
                    : isHighContrast
                      ? 'text-white hover:bg-zinc-800'
                      : 'text-slate-700 hover:text-blue-900 hover:bg-slate-100'
                }`}
              >
                <Church className={`w-4 h-4 ${activeTab === 'beranda' ? (isHighContrast ? 'text-black' : 'text-amber-400') : 'text-slate-400'}`} />
                <span>Beranda</span>
              </button>

              {/* Jadwal Ibadah */}
              <button
                id="nav-jadwal-btn"
                onClick={() => handleNavClick('jadwal')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                  activeTab === 'jadwal'
                    ? isHighContrast
                      ? 'bg-amber-400 text-black shadow-sm font-bold'
                      : 'bg-blue-900 text-white shadow-sm'
                    : isHighContrast
                      ? 'text-white hover:bg-zinc-800'
                      : 'text-slate-700 hover:text-blue-900 hover:bg-slate-100'
                }`}
              >
                <Calendar className={`w-4 h-4 ${activeTab === 'jadwal' ? (isHighContrast ? 'text-black' : 'text-amber-400') : 'text-slate-400'}`} />
                <span>Jadwal</span>
              </button>

              {/* Warta Jemaat */}
              <button
                id="nav-warta-btn"
                onClick={() => handleNavClick('warta')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                  activeTab === 'warta'
                    ? isHighContrast
                      ? 'bg-amber-400 text-black shadow-sm font-bold'
                      : 'bg-blue-900 text-white shadow-sm'
                    : isHighContrast
                      ? 'text-white hover:bg-zinc-800'
                      : 'text-slate-700 hover:text-blue-900 hover:bg-slate-100'
                }`}
              >
                <FileText className={`w-4 h-4 ${activeTab === 'warta' ? (isHighContrast ? 'text-black' : 'text-amber-400') : 'text-slate-400'}`} />
                <span>Warta</span>
              </button>

              {/* Data Jemaat Hierarchical Dropdown (User request) */}
              <div className="relative" ref={dropdownRef}>
                <button
                  id="nav-data-jemaat-dropdown-btn"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  onMouseEnter={() => setDropdownOpen(true)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-bold transition-all ${
                    activeTab === 'data-jemaat'
                      ? isHighContrast
                        ? 'bg-amber-400 text-black shadow-sm'
                        : 'bg-blue-900 text-white shadow-sm ring-2 ring-amber-400/40'
                      : isHighContrast
                        ? 'text-amber-300 hover:bg-zinc-800'
                        : 'text-blue-900 hover:bg-blue-50/80 font-bold'
                  }`}
                  aria-expanded={dropdownOpen}
                  aria-haspopup="true"
                >
                  <Users className={`w-4 h-4 ${activeTab === 'data-jemaat' ? 'text-amber-400' : 'text-blue-700'}`} />
                  <span>Data Jemaat</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Hierarchical Dropdown Menu:
                    Data Jemaat -> Data Keluarga 12 Rayon -> Rayon 1 s/d 12 -> (Statistik, Data Rayon, Data KSP) */}
                {dropdownOpen && (
                  <div 
                    onMouseLeave={() => setDropdownOpen(false)}
                    className="absolute left-0 mt-1 w-[680px] bg-slate-900 text-slate-100 rounded-2xl shadow-2xl border border-slate-700/80 z-50 p-4 animate-in fade-in zoom-in-95 duration-150"
                  >
                    {/* Header: Data Keluarga 12 Rayon */}
                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
                      <div>
                        <div className="flex items-center gap-2">
                          <Layers className="w-4 h-4 text-amber-400" />
                          <span className="text-sm font-black text-white">
                            Data Keluarga 12 Rayon
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Pilih salah satu Rayon (1 - 12) untuk melihat statistik jemaat, data pengurus rayon, dan kelompok KSP.
                        </p>
                      </div>
                      <button
                        onClick={() => handleRayonClick(1)}
                        className="text-xs text-amber-400 hover:underline font-bold bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/30"
                      >
                        Buka Semua 12 Rayon →
                      </button>
                    </div>

                    <div className="grid grid-cols-12 gap-4">
                      {/* Left: Rayon 1 - 12 Selection List (User requirement: turunnannya data Keluarga Rayon 1-12) */}
                      <div className="col-span-6 max-h-[360px] overflow-y-auto pr-1 space-y-1 custom-scrollbar">
                        <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider px-2 py-1">
                          Pilih Rayon Pelayanan:
                        </div>
                        {RAYONS_LIST.map((r) => {
                          const isHovered = hoveredRayonId === r.id;
                          const isCurrent = selectedRayonId === r.id;
                          return (
                            <button
                              key={r.id}
                              id={`dropdown-rayon-item-${r.id}`}
                              onMouseEnter={() => setHoveredRayonId(r.id)}
                              onClick={() => handleRayonClick(r.id)}
                              className={`w-full flex items-center justify-between text-left px-3 py-2 rounded-xl text-xs transition-all ${
                                isHovered
                                  ? 'bg-amber-500 text-slate-950 font-bold shadow'
                                  : isCurrent
                                    ? 'bg-slate-800 text-amber-300 font-semibold border border-slate-700'
                                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                              }`}
                            >
                              <div className="flex items-center gap-2 truncate">
                                <span className={`font-mono text-[10px] px-1.5 py-0.5 rounded ${
                                  isHovered ? 'bg-slate-950 text-amber-400 font-bold' : 'bg-slate-800 text-slate-400'
                                }`}>
                                  {r.code}
                                </span>
                                <span className="truncate font-semibold">{r.singkatan}</span>
                              </div>
                              <span className={`text-[10px] ${isHovered ? 'text-slate-900 font-bold' : 'text-slate-400'}`}>
                                {r.statistic.totalKk} KK
                              </span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Right: Sub-items for selected Rayon
                          (User request: "pilih Rayon 1 turunannya: Statistik jemaat rayon 1, data Rayon, Data KSP. pilih Rayon 2 dst") */}
                      <div className="col-span-6 bg-slate-850 p-4 rounded-xl border border-slate-700/80 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between gap-1 pb-2 border-b border-slate-700">
                            <div>
                              <span className="text-xs font-black text-amber-400">
                                {activeRayonInfo.code}: {activeRayonInfo.singkatan}
                              </span>
                              <p className="text-[10px] text-slate-300 truncate max-w-[200px]">
                                {activeRayonInfo.wilayah.split('(')[0]}
                              </p>
                            </div>
                            <span className="text-[10px] font-mono bg-slate-800 text-emerald-400 px-2 py-0.5 rounded">
                              {activeRayonInfo.statistic.totalJiwa} Jiwa
                            </span>
                          </div>

                          <div className="mt-3 space-y-2">
                            <div className="text-[11px] font-bold text-slate-300">
                              Data Turunan {activeRayonInfo.code}:
                            </div>

                            {/* 1. Statistik Jemaat */}
                            <button
                              onClick={() => handleRayonClick(activeRayonInfo.id)}
                              className="w-full text-left p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-750 text-xs flex items-center justify-between group transition-all"
                            >
                              <div className="flex items-center gap-2">
                                <BarChart3 className="w-3.5 h-3.5 text-amber-400" />
                                <span className="font-semibold text-slate-200 group-hover:text-amber-300">
                                  Statistik Jemaat {activeRayonInfo.code}
                                </span>
                              </div>
                              <span className="text-[10px] text-slate-400 font-mono">
                                {activeRayonInfo.statistic.totalJiwa} Jiwa / {activeRayonInfo.statistic.totalKk} KK
                              </span>
                            </button>

                            {/* 2. Data Rayon */}
                            <button
                              onClick={() => handleRayonClick(activeRayonInfo.id)}
                              className="w-full text-left p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-750 text-xs flex items-center justify-between group transition-all"
                            >
                              <div className="flex items-center gap-2">
                                <Building className="w-3.5 h-3.5 text-sky-400" />
                                <span className="font-semibold text-slate-200 group-hover:text-sky-300">
                                  Data Rayon & Majelis
                                </span>
                              </div>
                              <span className="text-[10px] text-slate-400 truncate max-w-[100px]">
                                {activeRayonInfo.koordinator.nama.split(',')[0]}
                              </span>
                            </button>

                            {/* 3. Data KSP */}
                            <button
                              onClick={() => handleRayonClick(activeRayonInfo.id)}
                              className="w-full text-left p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-750 text-xs flex items-center justify-between group transition-all"
                            >
                              <div className="flex items-center gap-2">
                                <Users className="w-3.5 h-3.5 text-emerald-400" />
                                <span className="font-semibold text-slate-200 group-hover:text-emerald-300">
                                  Data KSP ({activeRayonInfo.kspList.length} Kelompok)
                                </span>
                              </div>
                              <span className="text-[10px] text-slate-400">
                                Sektor Sel
                              </span>
                            </button>

                            {/* 4. Data Keluarga */}
                            <button
                              onClick={() => handleRayonClick(activeRayonInfo.id)}
                              className="w-full text-left p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-750 text-xs flex items-center justify-between group transition-all"
                            >
                              <div className="flex items-center gap-2">
                                <Home className="w-3.5 h-3.5 text-purple-400" />
                                <span className="font-semibold text-slate-200 group-hover:text-purple-300">
                                  Data Kartu Keluarga
                                </span>
                              </div>
                              <span className="text-[10px] text-slate-400">
                                {activeRayonInfo.keluargaList.length} Terdata
                              </span>
                            </button>
                          </div>
                        </div>

                        <button
                          onClick={() => handleRayonClick(activeRayonInfo.id)}
                          className="mt-3 w-full py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg text-center transition-all flex items-center justify-center gap-1.5"
                        >
                          <span>Buka Detail Lengkap {activeRayonInfo.code}</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Daftar Baptisan */}
              <button
                id="nav-baptisan-btn"
                onClick={() => handleNavClick('baptisan')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                  activeTab === 'baptisan'
                    ? isHighContrast
                      ? 'bg-amber-400 text-black shadow-sm font-bold'
                      : 'bg-blue-900 text-white shadow-sm'
                    : isHighContrast
                      ? 'text-white hover:bg-zinc-800'
                      : 'text-slate-700 hover:text-blue-900 hover:bg-slate-100'
                }`}
              >
                <UserCheck className={`w-4 h-4 ${activeTab === 'baptisan' ? (isHighContrast ? 'text-black' : 'text-amber-400') : 'text-slate-400'}`} />
                <span>Baptisan</span>
              </button>

              {/* Galeri Foto */}
              <button
                id="nav-galeri-btn"
                onClick={() => handleNavClick('galeri')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                  activeTab === 'galeri'
                    ? isHighContrast
                      ? 'bg-amber-400 text-black shadow-sm font-bold'
                      : 'bg-blue-900 text-white shadow-sm'
                    : isHighContrast
                      ? 'text-white hover:bg-zinc-800'
                      : 'text-slate-700 hover:text-blue-900 hover:bg-slate-100'
                }`}
              >
                <ImageIcon className={`w-4 h-4 ${activeTab === 'galeri' ? (isHighContrast ? 'text-black' : 'text-amber-400') : 'text-slate-400'}`} />
                <span>Galeri</span>
              </button>

              {/* Donasi Digital */}
              <button
                id="nav-donasi-btn"
                onClick={() => handleNavClick('donasi')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                  activeTab === 'donasi'
                    ? isHighContrast
                      ? 'bg-amber-400 text-black shadow-sm font-bold'
                      : 'bg-blue-900 text-white shadow-sm'
                    : isHighContrast
                      ? 'text-white hover:bg-zinc-800'
                      : 'text-slate-700 hover:text-blue-900 hover:bg-slate-100'
                }`}
              >
                <HeartHandshake className={`w-4 h-4 ${activeTab === 'donasi' ? (isHighContrast ? 'text-black' : 'text-amber-400') : 'text-slate-400'}`} />
                <span>Donasi</span>
              </button>

              {/* Tanya & Doa */}
              <button
                id="nav-komunikasi-btn"
                onClick={() => handleNavClick('komunikasi')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                  activeTab === 'komunikasi'
                    ? isHighContrast
                      ? 'bg-amber-400 text-black shadow-sm font-bold'
                      : 'bg-blue-900 text-white shadow-sm'
                    : isHighContrast
                      ? 'text-white hover:bg-zinc-800'
                      : 'text-slate-700 hover:text-blue-900 hover:bg-slate-100'
                }`}
              >
                <MessageCircle className={`w-4 h-4 ${activeTab === 'komunikasi' ? (isHighContrast ? 'text-black' : 'text-amber-400') : 'text-slate-400'}`} />
                <span>Tanya & Doa</span>
              </button>
            </nav>

            {/* Header Right Actions */}
            <div className="flex items-center gap-2">
              {/* Admin Login / Profile Status */}
              {currentUser ? (
                <div className="hidden sm:flex items-center gap-1.5 bg-slate-900 border border-slate-700 text-slate-100 px-2.5 py-1.5 rounded-xl text-xs">
                  {currentUser.role === 'superadmin' ? (
                    <Crown className="w-3.5 h-3.5 text-amber-400" />
                  ) : (
                    <Shield className="w-3.5 h-3.5 text-sky-400" />
                  )}
                  <button
                    onClick={() => onOpenLoginModal?.(selectedRayonId)}
                    className="font-bold hover:underline truncate max-w-[120px]"
                    title={`Masuk sebagai: ${currentUser.name}`}
                  >
                    {currentUser.role === 'superadmin' ? 'Superadmin' : `Admin R${currentUser.rayonId}`}
                  </button>
                  {onLogout && (
                    <button
                      onClick={onLogout}
                      title="Keluar dari akun admin"
                      className="ml-1 p-1 hover:bg-slate-800 text-slate-400 hover:text-rose-400 rounded"
                    >
                      <LogOut className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ) : (
                <button
                  id="header-login-btn"
                  onClick={() => onOpenLoginModal?.(selectedRayonId)}
                  className="hidden sm:flex items-center gap-1.5 bg-slate-100 hover:bg-amber-100 border border-slate-300 hover:border-amber-400 text-slate-800 px-3 py-1.5 rounded-xl text-xs font-bold transition-all"
                  title="Login Superadmin atau Admin Rayon 1-12"
                >
                  <Lock className="w-3.5 h-3.5 text-amber-600" />
                  <span>Login Admin</span>
                </button>
              )}

              {/* Notification Push Bell Button */}
              <button
                id="header-notification-btn"
                onClick={onOpenNotificationModal}
                className="relative p-2.5 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50 text-slate-700 transition-all"
                title="Pengaturan Notifikasi & Warta Mendesak"
                aria-label="Buka Notifikasi"
              >
                <Bell className="w-5 h-5 text-blue-900" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-600 text-white rounded-full text-[11px] font-bold flex items-center justify-center animate-pulse shadow-xs">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Direct WhatsApp Center for Quick Pastoral Need */}
              <a
                href={`https://wa.me/${CHURCH_INFO.whatsappCare}?text=${encodeURIComponent('Shalom Sekretariat GKI Petrus Waena, saya ingin menanyakan informasi jemaat.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-xs hover:shadow transition-all"
                title="Hubungi WhatsApp Center Majelis"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>WA Majelis</span>
              </a>

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100"
                aria-label="Menu Navigasi"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-6 space-y-1 shadow-xl animate-in slide-in-from-top-2 duration-150">
            <div className="py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Menu Layanan Jemaat
            </div>
            {/* Beranda */}
            <button
              onClick={() => handleNavClick('beranda')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold transition-all ${
                activeTab === 'beranda' ? 'bg-blue-900 text-white' : 'text-slate-800 hover:bg-slate-100'
              }`}
            >
              <Church className="w-5 h-5 text-blue-700" />
              <span>Beranda</span>
            </button>

            {/* Jadwal Ibadah */}
            <button
              onClick={() => handleNavClick('jadwal')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold transition-all ${
                activeTab === 'jadwal' ? 'bg-blue-900 text-white' : 'text-slate-800 hover:bg-slate-100'
              }`}
            >
              <Calendar className="w-5 h-5 text-blue-700" />
              <span>Jadwal Ibadah</span>
            </button>

            {/* Warta Jemaat */}
            <button
              onClick={() => handleNavClick('warta')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold transition-all ${
                activeTab === 'warta' ? 'bg-blue-900 text-white' : 'text-slate-800 hover:bg-slate-100'
              }`}
            >
              <FileText className="w-5 h-5 text-blue-700" />
              <span>Warta Jemaat</span>
            </button>

            {/* Data Jemaat Mobile Hierarchy (12 Rayon) */}
            <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50 my-1">
              <button
                onClick={() => setMobileRayonOpen(!mobileRayonOpen)}
                className={`w-full flex items-center justify-between px-4 py-3 text-base font-bold transition-all ${
                  activeTab === 'data-jemaat' ? 'bg-blue-900 text-white' : 'text-blue-900 bg-blue-50/80 hover:bg-blue-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-amber-500" />
                  <span>Data Jemaat (12 Rayon)</span>
                </div>
                <ChevronDown className={`w-4 h-4 transition-transform ${mobileRayonOpen ? 'rotate-180' : ''}`} />
              </button>

              {mobileRayonOpen && (
                <div className="p-3 bg-slate-900 text-slate-100 space-y-2 max-h-[300px] overflow-y-auto">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-700">
                    <span className="text-xs font-bold text-amber-400">Data Keluarga 12 Rayon:</span>
                    <button
                      onClick={() => handleRayonClick(1)}
                      className="text-[11px] text-sky-300 underline"
                    >
                      Buka Rayon 1
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 pt-1">
                    {RAYONS_LIST.map((r) => (
                      <button
                        key={r.id}
                        onClick={() => handleRayonClick(r.id)}
                        className={`text-left p-2 rounded-lg text-xs font-semibold border transition-all ${
                          selectedRayonId === r.id
                            ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
                            : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono">{r.code}</span>
                          <span className="text-[9px] opacity-75">{r.statistic.totalKk} KK</span>
                        </div>
                        <div className="truncate font-bold text-xs mt-0.5">{r.singkatan}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Baptisan */}
            <button
              onClick={() => handleNavClick('baptisan')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold transition-all ${
                activeTab === 'baptisan' ? 'bg-blue-900 text-white' : 'text-slate-800 hover:bg-slate-100'
              }`}
            >
              <UserCheck className="w-5 h-5 text-blue-700" />
              <span>Daftar Baptisan</span>
            </button>

            {/* Galeri Foto */}
            <button
              onClick={() => handleNavClick('galeri')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold transition-all ${
                activeTab === 'galeri' ? 'bg-blue-900 text-white' : 'text-slate-800 hover:bg-slate-100'
              }`}
            >
              <ImageIcon className="w-5 h-5 text-blue-700" />
              <span>Galeri Foto</span>
            </button>

            {/* Donasi Digital */}
            <button
              onClick={() => handleNavClick('donasi')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold transition-all ${
                activeTab === 'donasi' ? 'bg-blue-900 text-white' : 'text-slate-800 hover:bg-slate-100'
              }`}
            >
              <HeartHandshake className="w-5 h-5 text-blue-700" />
              <span>Donasi Digital</span>
            </button>

            {/* Tanya & Doa */}
            <button
              onClick={() => handleNavClick('komunikasi')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold transition-all ${
                activeTab === 'komunikasi' ? 'bg-blue-900 text-white' : 'text-slate-800 hover:bg-slate-100'
              }`}
            >
              <MessageCircle className="w-5 h-5 text-blue-700" />
              <span>Tanya Majelis & Doa</span>
            </button>

            {/* Admin Login / Session in Mobile Menu */}
            <div className="pt-2 pb-1 border-t border-slate-100">
              {currentUser ? (
                <div className="p-3 rounded-xl bg-slate-900 text-white flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {currentUser.role === 'superadmin' ? (
                      <Crown className="w-5 h-5 text-amber-400 shrink-0" />
                    ) : (
                      <Shield className="w-5 h-5 text-sky-400 shrink-0" />
                    )}
                    <div>
                      <span className="text-xs font-bold block text-white">
                        {currentUser.role === 'superadmin' ? 'Superadmin Majelis' : currentUser.rayonName}
                      </span>
                      <span className="text-[11px] text-slate-400">{currentUser.name}</span>
                    </div>
                  </div>
                  {onLogout && (
                    <button
                      onClick={() => {
                        onLogout();
                        setMobileMenuOpen(false);
                      }}
                      className="px-2.5 py-1 rounded bg-rose-950/80 text-rose-300 text-xs font-bold border border-rose-800"
                    >
                      Keluar
                    </button>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenLoginModal?.(selectedRayonId);
                  }}
                  className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-sm"
                >
                  <Lock className="w-4 h-4" />
                  <span>Login Superadmin / Admin Rayon</span>
                </button>
              )}
            </div>

            <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
              <a
                href={`https://wa.me/${CHURCH_INFO.whatsappCare}?text=${encodeURIComponent('Shalom Sekretariat GKI Petrus Waena, saya ingin berkonsultasi mengenai pelayanan gereja.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-emerald-600 text-white py-3 rounded-xl font-bold text-sm"
              >
                <Phone className="w-4 h-4" />
                <span>WhatsApp Sekretariat Jemaat</span>
              </a>
            </div>
          </div>
        )}
      </header>

      {/* Bottom Sticky Bar for Mobile Users (App-like navigation with Data Jemaat) */}
      <nav 
        aria-label="Navigasi Seluler Cepat"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-2xl py-1.5 px-2 flex items-center justify-around"
      >
        <button
          onClick={() => handleNavClick('beranda')}
          className={`flex flex-col items-center py-1 px-1.5 rounded-lg transition-colors ${
            activeTab === 'beranda' ? 'text-blue-900 font-bold' : 'text-slate-500'
          }`}
        >
          <Church className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Beranda</span>
        </button>

        <button
          onClick={() => handleNavClick('jadwal')}
          className={`flex flex-col items-center py-1 px-1.5 rounded-lg transition-colors ${
            activeTab === 'jadwal' ? 'text-blue-900 font-bold' : 'text-slate-500'
          }`}
        >
          <Calendar className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Jadwal</span>
        </button>

        <button
          onClick={() => handleRayonClick(selectedRayonId || 1)}
          className={`flex flex-col items-center py-1 px-1.5 rounded-lg transition-colors ${
            activeTab === 'data-jemaat' ? 'text-amber-600 font-bold' : 'text-slate-500'
          }`}
        >
          <Users className="w-5 h-5" />
          <span className="text-[10px] mt-0.5 font-semibold">12 Rayon</span>
        </button>

        <button
          onClick={() => handleNavClick('warta')}
          className={`flex flex-col items-center py-1 px-1.5 rounded-lg transition-colors ${
            activeTab === 'warta' ? 'text-blue-900 font-bold' : 'text-slate-500'
          }`}
        >
          <FileText className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Warta</span>
        </button>

        <button
          onClick={() => handleNavClick('donasi')}
          className={`flex flex-col items-center py-1 px-1.5 rounded-lg transition-colors ${
            activeTab === 'donasi' ? 'text-blue-900 font-bold' : 'text-slate-500'
          }`}
        >
          <HeartHandshake className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Donasi</span>
        </button>
      </nav>

    </>
  );
};
