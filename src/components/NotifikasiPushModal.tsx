import React, { useState } from 'react';
import { 
  X, 
  Bell, 
  BellRing, 
  Check, 
  Volume2, 
  ShieldAlert, 
  Sparkles, 
  Smartphone, 
  Send,
  AlertCircle
} from 'lucide-react';
import { NotificationSettings } from '../types';
import { SECTORS_LIST } from '../data/churchData';

interface NotifikasiPushModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: NotificationSettings;
  onUpdateSettings: (newSettings: NotificationSettings) => void;
  onTriggerTestPush: (title: string, body: string) => void;
}

export const NotifikasiPushModal: React.FC<NotifikasiPushModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onTriggerTestPush,
}) => {
  const [permissionState, setPermissionState] = useState<'default' | 'granted' | 'simulated'>('simulated');
  const [userSector, setUserSector] = useState(SECTORS_LIST[0]);
  const [successToast, setSuccessToast] = useState(false);

  if (!isOpen) return null;

  const handleRequestPermission = async () => {
    if ('Notification' in window) {
      try {
        const result = await Notification.requestPermission();
        setPermissionState(result === 'granted' ? 'granted' : 'simulated');
      } catch {
        setPermissionState('simulated');
      }
    } else {
      setPermissionState('simulated');
    }
    setSuccessToast(true);
    setTimeout(() => setSuccessToast(false), 3000);
  };

  const handleTestPush = () => {
    onTriggerTestPush(
      'GKI Petrus Waena • Pengingat Ibadah',
      `Shalom! Ibadah Minggu Raya akan dimulai besok jam 09:00 WIT. Tema: Kasih yang Memulihkan. Sektor: ${userSector}`
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-t-3xl relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
            <BellRing className="w-4 h-4" />
            <span>Pengaturan Notifikasi & Pengingat Rutin</span>
          </div>
          <h3 className="text-xl font-black text-white">
            Notifikasi Push Jemaat
          </h3>
          <p className="text-xs text-blue-200 mt-1">
            Atur jenis pemberitahuan mendesak dan pembaruan rutin mingguan yang ingin Anda terima di perangkat seluler.
          </p>
        </div>

        <div className="p-6 space-y-6 text-sm text-slate-800">
          {/* Permission Status Banner */}
          <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-blue-900 text-xs">
                <Smartphone className="w-4 h-4 text-blue-700" />
                <span>Status Izin Browser / Seluler:</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                Siap Menerima
              </span>
            </div>
            <p className="text-xs text-slate-600">
              Notifikasi push memungkinkan info darurat duka jemaat dan pengingat ibadah muncul langsung di layar ponsel Anda meskipun aplikasi ditutup.
            </p>
            <button
              onClick={handleRequestPermission}
              className="mt-1 bg-blue-900 hover:bg-blue-800 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Sinkronkan Izin Notifikasi Perangkat</span>
            </button>
            {successToast && (
              <p className="text-[11px] font-bold text-emerald-700">✓ Izin notifikasi aktif dan tersimpan!</p>
            )}
          </div>

          {/* Sector selection for tailored alerts */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Sektor Pelayanan Anda (WIK)
            </label>
            <select
              value={userSector}
              onChange={(e) => setUserSector(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs border border-slate-300 rounded-xl bg-slate-50 focus:outline-hidden focus:ring-2 focus:ring-blue-600 font-medium"
            >
              {SECTORS_LIST.map((s, idx) => (
                <option key={idx} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Customizable notification toggles */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Kustomisasi Jenis Notifikasi
            </label>

            {/* Urgent / Duka */}
            <div className="flex items-start justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="pr-3">
                <span className="font-bold text-xs text-slate-900 block">
                  Informasi Mendesak & Warta Duka Cita
                </span>
                <span className="text-[11px] text-slate-500 block mt-0.5">
                  Pemberitahuan darurat dari Majelis Jemaat dan warta pemakaman/penghiburan.
                </span>
              </div>
              <input
                type="checkbox"
                checked={settings.urgentNews}
                onChange={(e) => onUpdateSettings({ ...settings, urgentNews: e.target.checked })}
                className="w-5 h-5 rounded-md text-blue-900 focus:ring-blue-500 mt-1 cursor-pointer"
              />
            </div>

            {/* Sunday Service */}
            <div className="flex items-start justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="pr-3">
                <span className="font-bold text-xs text-slate-900 block">
                  Pengingat Ibadah Minggu
                </span>
                <span className="text-[11px] text-slate-500 block mt-0.5">
                  Pengingat H-1 (Sabtu Sore) dan jam 05:00 WIT pada hari Minggu.
                </span>
              </div>
              <input
                type="checkbox"
                checked={settings.sundayReminder}
                onChange={(e) => onUpdateSettings({ ...settings, sundayReminder: e.target.checked })}
                className="w-5 h-5 rounded-md text-blue-900 focus:ring-blue-500 mt-1 cursor-pointer"
              />
            </div>

            {/* WIK Sector */}
            <div className="flex items-start justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="pr-3">
                <span className="font-bold text-xs text-slate-900 block">
                  Jadwal Ibadah KSP / WIK Sektor
                </span>
                <span className="text-[11px] text-slate-500 block mt-0.5">
                  Pengingat keluarga tuan rumah dan petugas liturgi ibadah sektor setiap Rabu.
                </span>
              </div>
              <input
                type="checkbox"
                checked={settings.wikReminder}
                onChange={(e) => onUpdateSettings({ ...settings, wikReminder: e.target.checked })}
                className="w-5 h-5 rounded-md text-blue-900 focus:ring-blue-500 mt-1 cursor-pointer"
              />
            </div>

            {/* Financial Transparency */}
            <div className="flex items-start justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="pr-3">
                <span className="font-bold text-xs text-slate-900 block">
                  Pembaruan Transparansi Kas Jemaat
                </span>
                <span className="text-[11px] text-slate-500 block mt-0.5">
                  Laporan keuangan mingguan yang diumumkan secara terbuka setiap Senin.
                </span>
              </div>
              <input
                type="checkbox"
                checked={settings.financialTransparency}
                onChange={(e) => onUpdateSettings({ ...settings, financialTransparency: e.target.checked })}
                className="w-5 h-5 rounded-md text-blue-900 focus:ring-blue-500 mt-1 cursor-pointer"
              />
            </div>

            {/* Sound Toggle */}
            <div className="flex items-start justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="pr-3 flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-amber-600" />
                <div>
                  <span className="font-bold text-xs text-slate-900 block">
                    Bunyi Notifikasi
                  </span>
                  <span className="text-[11px] text-slate-500 block mt-0.5">
                    Mainkan nada lonceng gereja lembut saat pemberitahuan tiba.
                  </span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.soundEnabled}
                onChange={(e) => onUpdateSettings({ ...settings, soundEnabled: e.target.checked })}
                className="w-5 h-5 rounded-md text-blue-900 focus:ring-blue-500 mt-1 cursor-pointer"
              />
            </div>
          </div>

          {/* Test push button */}
          <div className="pt-2">
            <button
              onClick={handleTestPush}
              className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl text-xs transition-all shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Kirim Tes Notifikasi ke Layar Sekarang</span>
            </button>
          </div>
        </div>

        <div className="p-4 bg-slate-100 rounded-b-3xl border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold bg-blue-900 text-white rounded-xl hover:bg-blue-800"
          >
            Simpan & Selesai
          </button>
        </div>
      </div>
    </div>
  );
};
