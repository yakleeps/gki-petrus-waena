import React, { useState } from 'react';
import { 
  Shield, 
  KeyRound, 
  User, 
  Lock, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  Crown, 
  Users, 
  Eye, 
  EyeOff,
  Sparkles
} from 'lucide-react';
import { ADMIN_ACCOUNTS, authenticateUser } from '../data/authUsers';
import { AdminUser } from '../types';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: AdminUser) => void;
  currentUser: AdminUser | null;
  onLogout: () => void;
  targetRayonId?: number;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  currentUser,
  onLogout,
  targetRayonId,
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'quick' | 'manual'>('quick');

  if (!isOpen) return null;

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!username.trim() || !password) {
      setErrorMessage('Mohon lengkapi nama pengguna dan kata sandi.');
      return;
    }

    const auth = authenticateUser(username, password);
    if (auth) {
      onLoginSuccess(auth);
      onClose();
      setUsername('');
      setPassword('');
      setErrorMessage('');
    } else {
      setErrorMessage('Nama pengguna atau kata sandi tidak valid. Periksa kembali huruf besar/kecil.');
    }
  };

  const handleQuickSelect = (accUsername: string, accPass: string) => {
    const auth = authenticateUser(accUsername, accPass);
    if (auth) {
      onLoginSuccess(auth);
      onClose();
      setErrorMessage('');
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-modal-title"
    >
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700 text-slate-100 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 p-6 border-b border-slate-800 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-lg ring-2 ring-amber-400/30">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/30">
                  Otentikasi Pengurus
                </span>
                <span className="text-[10px] text-slate-400">GKI Petrus Waena</span>
              </div>
              <h2 id="login-modal-title" className="text-xl font-black text-white mt-0.5">
                Login Superadmin & 12 Admin Rayon
              </h2>
              <p className="text-xs text-slate-300 mt-0.5">
                Kewenangan kelola data keluarga, statistik, pengurus, dan KSP per rayon
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Login Status Banner */}
        {currentUser ? (
          <div className="p-6 bg-slate-850 space-y-4">
            <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-600/40 flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 mt-0.5">
                  {currentUser.role === 'superadmin' ? <Crown className="w-5 h-5" /> : <Shield className="w-5 h-5" />}
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                    Sesi Aktif: {currentUser.role === 'superadmin' ? 'Superadmin Majelis' : `Admin ${currentUser.rayonName}`}
                  </div>
                  <h3 className="text-base font-black text-white">{currentUser.name}</h3>
                  <p className="text-xs text-slate-300 mt-0.5">
                    {currentUser.role === 'superadmin' 
                      ? 'Berwenang mengedit, menambah, dan menghapus data pada SEMUA 12 Rayon.'
                      : `HANYA berwenang mengedit, menambah, dan menghapus data pada ${currentUser.rayonName}.`
                    }
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={onLogout}
                className="w-full py-2.5 px-4 rounded-xl bg-rose-600/20 hover:bg-rose-600 border border-rose-500/40 text-rose-300 hover:text-white font-bold text-sm transition-all"
              >
                Keluar dari Akun (Logout)
              </button>
              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm transition-all"
              >
                Lanjut Kelola Data
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
            {/* Tab switch */}
            <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800">
              <button
                type="button"
                onClick={() => setActiveTab('quick')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'quick'
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Pilih Cepat Akun (Demo / 1-Klik)</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('manual')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'manual'
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Input Manual Username & Password</span>
              </button>
            </div>

            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-rose-950/80 border border-rose-500/60 text-rose-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* TAB 1: Quick Selection */}
            {activeTab === 'quick' && (
              <div className="space-y-4">
                <div className="p-3 bg-blue-950/50 border border-blue-800/60 rounded-xl text-xs text-blue-200">
                  <p className="font-semibold">💡 Pengingat Hak Akses Khusus:</p>
                  <ul className="list-disc list-inside mt-1 space-y-0.5 text-[11px] text-blue-300/90">
                    <li><strong>Superadmin</strong> dapat mengedit data di semua Rayon (1 - 12).</li>
                    <li><strong>Admin Rayon (1 - 12)</strong> HANYA dapat menambah, mengedit, dan menghapus data pada Rayon miliknya sendiri.</li>
                  </ul>
                </div>

                {/* 1. Superadmin Button */}
                <div>
                  <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <Crown className="w-3.5 h-3.5" />
                    <span>Akun Tingkat Majelis Jemaat (Pusat)</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleQuickSelect('superadmin', 'petruswaena2026')}
                    className="w-full text-left p-3.5 rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-850 to-slate-800 hover:to-amber-900/30 border border-amber-500/50 hover:border-amber-400 transition-all flex items-center justify-between group shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black">
                        <Crown className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-black text-sm text-white group-hover:text-amber-300">
                            Superadmin Majelis Jemaat
                          </span>
                          <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-mono">
                            user: superadmin
                          </span>
                        </div>
                        <p className="text-xs text-slate-400">
                          Kewenangan penuh: Edit & Hapus data Rayon 1 s/d Rayon 12
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-amber-400 group-hover:translate-x-1 transition-transform">
                      Login Ini →
                    </span>
                  </button>
                </div>

                {/* 2. 12 Rayons Buttons */}
                <div>
                  <div className="text-[11px] font-bold text-sky-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5" />
                      <span>Akun 12 Admin Rayon (Hanya Edit Rayon Masing-Masing)</span>
                    </div>
                    {targetRayonId && (
                      <span className="text-[10px] text-amber-300">
                        Disarankan: Rayon {targetRayonId}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[260px] overflow-y-auto pr-1 custom-scrollbar">
                    {ADMIN_ACCOUNTS.filter(a => a.role === 'admin_rayon').map((acc) => {
                      const isTarget = targetRayonId === acc.rayonId;
                      return (
                        <button
                          key={acc.id}
                          type="button"
                          onClick={() => handleQuickSelect(acc.username, acc.password)}
                          className={`text-left p-2.5 rounded-xl border text-xs transition-all flex flex-col justify-between group ${
                            isTarget
                              ? 'bg-blue-900/50 border-blue-400 ring-1 ring-blue-400 text-white shadow-md'
                              : 'bg-slate-800/80 hover:bg-slate-750 border-slate-700 hover:border-slate-600 text-slate-200'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-white group-hover:text-amber-400">
                              {acc.rayonName}
                            </span>
                            <span className="text-[10px] font-mono text-slate-400">
                              {acc.username}
                            </span>
                          </div>
                          <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-700/60 text-[10px] text-slate-400">
                            <span>Akses: Khusus Rayon {acc.rayonId}</span>
                            <span className="text-amber-400 font-bold group-hover:underline">Pilih</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: Manual Login */}
            {activeTab === 'manual' && (
              <form onSubmit={handleManualSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Nama Pengguna (Username Admin)
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Contoh: superadmin atau admin.rayon1"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-amber-400 transition-colors"
                      required
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Gunakan <code className="text-amber-300">superadmin</code> atau <code className="text-sky-300">admin.rayon1</code> s/d <code className="text-sky-300">admin.rayon12</code>
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Kata Sandi (Password)
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Masukkan kata sandi..."
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-10 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-amber-400 transition-colors"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
                      title={showPassword ? 'Sembunyikan' : 'Tampilkan'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Default: <code className="text-amber-300">petruswaena2026</code> (Superadmin) atau <code className="text-sky-300">rayon[1-12]waena</code> (Admin Rayon)
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 mt-2"
                >
                  <Shield className="w-4 h-4" />
                  <span>Masuk Sistem Admin</span>
                </button>
              </form>
            )}
          </div>
        )}

        {/* Footer info */}
        <div className="bg-slate-950 px-6 py-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <span>Sistem Keamanan Portal Gereja GKI Petrus Waena</span>
          <button
            type="button"
            onClick={onClose}
            className="text-amber-400 hover:underline font-semibold"
          >
            Tutup Dialog
          </button>
        </div>
      </div>
    </div>
  );
};
