import React, { useState } from 'react';
import { 
  X, 
  Send, 
  Copy, 
  Check, 
  Users, 
  Smartphone, 
  Clock, 
  Calendar, 
  MapPin, 
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { WorshipSchedule } from '../types';
import { formatWorshipWAMessage, openWhatsAppDirect, shareToWhatsAppGroup } from '../utils/whatsappHelper';
import { SECTORS_LIST } from '../data/churchData';

interface WhatsAppReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  schedule: WorshipSchedule | null;
  onScheduleSubscribe?: (data: { name: string; phone: string; sector: string; scheduleId: string }) => void;
}

export const WhatsAppReminderModal: React.FC<WhatsAppReminderModalProps> = ({
  isOpen,
  onClose,
  schedule,
  onScheduleSubscribe,
}) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [memberName, setMemberName] = useState('');
  const [selectedSector, setSelectedSector] = useState(SECTORS_LIST[0]);
  const [copied, setCopied] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  if (!isOpen || !schedule) return null;

  const encodedMessage = formatWorshipWAMessage(schedule, selectedSector);
  const plainTextMessage = decodeURIComponent(encodedMessage);

  const handleSendToMyPhone = () => {
    let clean = phoneNumber.trim();
    if (clean.startsWith('08')) {
      clean = '628' + clean.slice(2);
    } else if (clean.startsWith('+62')) {
      clean = clean.replace('+', '');
    }
    openWhatsAppDirect(clean, encodedMessage);
  };

  const handleShareToGroup = () => {
    shareToWhatsAppGroup(encodedMessage);
  };

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(plainTextMessage);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const handleRegisterAutomated = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber) return;
    setIsSubscribed(true);
    if (onScheduleSubscribe) {
      onScheduleSubscribe({
        name: memberName || 'Warga Jemaat',
        phone: phoneNumber,
        sector: selectedSector,
        scheduleId: schedule.id,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
        {/* Modal Header */}
        <div className="p-6 bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 text-white rounded-t-3xl relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 text-emerald-200 text-xs font-bold uppercase tracking-wider mb-1">
            <Smartphone className="w-4 h-4" />
            <span>Integrasi Pengingat WhatsApp Jemaat</span>
          </div>
          <h3 className="text-xl font-black text-white">
            Kirim Pengingat: {schedule.title}
          </h3>
          <p className="text-xs text-emerald-100 mt-1">
            Dapatkan pengingat otomatis kegiatan gereja langsung di WhatsApp pribadi atau grup sektor Anda.
          </p>
        </div>

        <div className="p-6 space-y-6 text-slate-800 text-sm">
          {/* Schedule Summary Card */}
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-blue-900">
              <Calendar className="w-3.5 h-3.5" />
              <span>{schedule.dateOrDay} • {schedule.time}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>{schedule.location}</span>
            </div>
            <div className="pt-2 border-t border-slate-200 text-xs">
              <span className="font-semibold text-slate-700">Pelayan Firman: </span>
              <span className="font-bold text-slate-900">{schedule.preacher}</span>
            </div>
          </div>

          {/* Action Tabs / Direct Sending */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              1. Kirim Pengingat Langsung
            </label>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="No. WhatsApp (contoh: 081234567890)"
                  className="w-full pl-3 pr-3 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>
              <button
                id="send-wa-direct-btn"
                onClick={handleSendToMyPhone}
                className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2.5 rounded-xl shadow-xs transition-all shrink-0"
              >
                <Send className="w-4 h-4" />
                <span>Kirim ke WhatsApp</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-500">
              Jika nomor dikosongkan, WhatsApp akan membuka daftar kontak/chat Anda.
            </p>

            <div className="pt-2 flex flex-wrap gap-2">
              <button
                id="share-wa-group-btn"
                onClick={handleShareToGroup}
                className="flex items-center gap-2 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 px-3.5 py-2 rounded-xl text-xs font-bold transition-all"
              >
                <Users className="w-4 h-4 text-teal-600" />
                <span>Bagikan ke Grup WhatsApp WIK / Sektor</span>
              </button>

              <button
                id="copy-wa-text-btn"
                onClick={handleCopyText}
                className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 px-3 py-2 rounded-xl text-xs font-semibold transition-all"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
                <span>{copied ? 'Tersalin ke Clipboard!' : 'Salin Teks Format Pesan'}</span>
              </button>
            </div>
          </div>

          {/* Automated Weekly Subscription Registration */}
          <div className="pt-4 border-t border-slate-200">
            <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-4">
              <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs uppercase tracking-wider mb-1">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>2. Aktifkan Notifikasi WhatsApp Otomatis Mingguan</span>
              </div>
              <p className="text-xs text-emerald-800 mb-3 leading-relaxed">
                Daftarkan nomor Anda agar sistem GKI Petrus Waena otomatis mengirimkan pengingat H-1 sebelum ibadah sektor atau ibadah minggu dimulai.
              </p>

              {isSubscribed ? (
                <div className="bg-white p-4 rounded-xl border border-emerald-300 flex items-center gap-3 text-emerald-900">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                  <div>
                    <p className="font-bold text-xs">Pendaftaran Notifikasi WhatsApp Berhasil!</p>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      Nomor {phoneNumber || 'Anda'} telah terdaftar untuk jadwal {schedule.title} ({selectedSector}). Pengingat otomatis akan dikirimkan rutin.
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleRegisterAutomated} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">Nama Warga / Keluarga:</label>
                      <input
                        type="text"
                        required
                        value={memberName}
                        onChange={(e) => setMemberName(e.target.value)}
                        placeholder="Kel. Bpk/Ibu..."
                        className="w-full px-3 py-2 text-xs border border-emerald-200 rounded-lg bg-white focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">Sektor Pelayanan / WIK:</label>
                      <select
                        value={selectedSector}
                        onChange={(e) => setSelectedSector(e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-emerald-200 rounded-lg bg-white focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                      >
                        {SECTORS_LIST.map((s, idx) => (
                          <option key={idx} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs"
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>Daftarkan Pengingat Terjadwal Otomatis</span>
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Message Preview */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              Pratinjau Format Pesan WhatsApp:
            </label>
            <div className="bg-slate-900 text-emerald-300 p-3.5 rounded-xl text-xs font-mono whitespace-pre-wrap max-h-40 overflow-y-auto border border-slate-700">
              {plainTextMessage}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-100 rounded-b-3xl border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200 rounded-xl transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
