/**
 * GKI Petrus Waena - Portal Informasi dan Pelayanan Jemaat Terpadu
 * Gereja Kristen Injili di Tanah Papua — Klasis Port Numbay
 */

import React, { useState, useEffect } from 'react';
import { 
  AccessibilitySettings, 
  NotificationSettings, 
  WorshipSchedule, 
  ChurchNews, 
  GalleryPhoto, 
  DonationRecord,
  AdminUser
} from './types';
import { 
  INITIAL_SCHEDULES, 
  INITIAL_NEWS, 
  INITIAL_PHOTOS, 
  CHURCH_INFO 
} from './data/churchData';
import { getCurrentAdminSession, clearAdminSession } from './data/authUsers';
import { speakText, stopSpeaking } from './utils/downloadHelper';

// Components
import { AccessibilityToolbar } from './components/AccessibilityToolbar';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { JadwalIbadahSection } from './components/JadwalIbadahSection';
import { BeritaJemaatSection } from './components/BeritaJemaatSection';
import { DataJemaatSection } from './components/DataJemaatSection';
import { BaptisanOnlineSection } from './components/BaptisanOnlineSection';
import { GaleriKegiatanSection } from './components/GaleriKegiatanSection';
import { DonasiDigitalSection } from './components/DonasiDigitalSection';
import { KomunikasiMajelisSection } from './components/KomunikasiMajelisSection';
import { WhatsAppReminderModal } from './components/WhatsAppReminderModal';
import { NotifikasiPushModal } from './components/NotifikasiPushModal';
import { NotificationToast } from './components/NotificationToast';
import { AdminLoginModal } from './components/AdminLoginModal';
import { Footer } from './components/Footer';

export default function App() {
  // Navigation
  const [activeTab, setActiveTab] = useState<string>('beranda');
  const [selectedRayonId, setSelectedRayonId] = useState<number>(1);

  // Authentication State for Superadmin and 12 Rayon Admins
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(() => getCurrentAdminSession());
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginTargetRayonId, setLoginTargetRayonId] = useState<number | undefined>(undefined);

  // Accessibility (Ramah Lansia) Settings
  const [accessibility, setAccessibility] = useState<AccessibilitySettings>({
    fontSize: 'normal',
    highContrast: false,
    simplifiedView: false,
    soundGuide: true,
  });

  // Speech Reader state
  const [isReadingSpeech, setIsReadingSpeech] = useState(false);

  // Modals & Notifications
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [selectedScheduleForWA, setSelectedScheduleForWA] = useState<WorshipSchedule | null>(null);

  // Notification Preferences
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    urgentNews: true,
    sundayReminder: true,
    wikReminder: true,
    financialTransparency: true,
    soundEnabled: true,
  });

  // Push Toast Alert
  const [toast, setToast] = useState<{
    show: boolean;
    title: string;
    body: string;
    tabTarget?: string;
  }>({
    show: false,
    title: '',
    body: '',
  });

  // Data sets
  const [schedules] = useState<WorshipSchedule[]>(INITIAL_SCHEDULES);
  const [newsList] = useState<ChurchNews[]>(INITIAL_NEWS);
  const [photos] = useState<GalleryPhoto[]>(INITIAL_PHOTOS);

  // Show a welcome reminder toast after 3 seconds to demonstrate real-time notifications
  useEffect(() => {
    const timer = setTimeout(() => {
      setToast({
        show: true,
        title: 'Pemberitahuan Warta Jemaat Petrus Waena',
        body: 'Pendaftaran Sakramen Baptisan Kudus Triwulan III telah dibuka. Ibadah KSP Sektor Rabu pkl 18:00 WIT.',
        tabTarget: 'baptisan',
      });
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  // Voice synthesis helper
  const handleReadText = (text: string) => {
    setIsReadingSpeech(true);
    speakText(text, () => {
      setIsReadingSpeech(false);
    });
  };

  const handleStopReading = () => {
    stopSpeaking();
    setIsReadingSpeech(false);
  };

  const handleReadFullRenungan = () => {
    const textToRead = `Shalom jemaat terkasih GKI Petrus Waena. Ayat harian kita: Tetapi kamulah bangsa yang terpilih, imamat yang rajani, bangsa yang kudus, umat kepunyaan Allah sendiri, supaya kamu memberitakan perbuatan-perbuatan yang besar dari Dia. Ibadah Minggu Utama dipimpin oleh Pendeta Stevanus Morin dengan tema: Melayani dengan Hati yang Tulus di Tanah Papua. Tuhan Yesus memberkati.`;
    handleReadText(textToRead);
  };

  const handleTriggerTestPush = (title: string, body: string) => {
    setToast({
      show: true,
      title,
      body,
      tabTarget: 'jadwal',
    });
  };

  // Admin Authentication Actions
  const handleOpenLoginModal = (targetRayonId?: number) => {
    setLoginTargetRayonId(targetRayonId || selectedRayonId);
    setIsLoginModalOpen(true);
  };

  const handleLoginSuccess = (user: AdminUser) => {
    setCurrentUser(user);
    setIsLoginModalOpen(false);
    setToast({
      show: true,
      title: 'Login Berhasil Terverifikasi',
      body: `Selamat bertugas, ${user.name}. Masuk sebagai ${user.role === 'superadmin' ? 'Superadmin Majelis' : user.rayonName}.`,
      tabTarget: 'data-jemaat',
    });

    if (user.role === 'admin_rayon' && user.rayonId) {
      setSelectedRayonId(user.rayonId);
      setActiveTab('data-jemaat');
    }
  };

  const handleLogout = () => {
    clearAdminSession();
    setCurrentUser(null);
    setToast({
      show: true,
      title: 'Sesi Admin Diakhiri',
      body: 'Anda telah keluar dari akun admin. Sistem beralih ke mode Hanya-Baca (Tamu / Jemaat).',
    });
  };

  // Font size class mapper for elderly accessibility
  const getFontSizeClass = () => {
    switch (accessibility.fontSize) {
      case 'large':
        return 'text-[17px] leading-relaxed [&_h2]:text-3xl [&_h3]:text-2xl [&_p]:text-base';
      case 'xlarge':
        return 'text-[19px] leading-loose [&_h2]:text-4xl [&_h3]:text-3xl [&_p]:text-lg [&_button]:text-base';
      default:
        return 'text-sm';
    }
  };

  return (
    <div 
      className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${
        accessibility.highContrast 
          ? 'bg-black text-amber-50 selection:bg-amber-400 selection:text-black' 
          : 'bg-slate-50 text-slate-900'
      } ${getFontSizeClass()}`}
    >
      {/* 1. Accessibility & Elderly Toolbar */}
      <AccessibilityToolbar
        settings={accessibility}
        onChange={setAccessibility}
        onReadPage={handleReadFullRenungan}
        isReading={isReadingSpeech}
        onStopReading={handleStopReading}
        onNavigate={(tab) => setActiveTab(tab)}
      />

      {/* 2. Top Header & Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenNotificationModal={() => setIsNotificationModalOpen(true)}
        unreadCount={2}
        isHighContrast={accessibility.highContrast}
        selectedRayonId={selectedRayonId}
        onSelectRayon={(id) => {
          setSelectedRayonId(id);
          setActiveTab('data-jemaat');
        }}
        currentUser={currentUser}
        onOpenLoginModal={handleOpenLoginModal}
        onLogout={handleLogout}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {activeTab === 'beranda' && (
          <div>
            {/* Hero Section */}
            <HeroBanner
              onNavigate={setActiveTab}
              nextSchedule={schedules[1]} // Ibadah Minggu Utama
              onOpenWhatsAppReminder={(s) => setSelectedScheduleForWA(s)}
              onOpenNotificationModal={() => setIsNotificationModalOpen(true)}
              onReadVerse={handleReadText}
              isHighContrast={accessibility.highContrast}
            />

            {/* Jadwal Ibadah Preview */}
            <JadwalIbadahSection
              schedules={schedules}
              onOpenWhatsAppReminder={(s) => setSelectedScheduleForWA(s)}
              onReadText={handleReadText}
              isHighContrast={accessibility.highContrast}
            />

            {/* Data Jemaat (12 Rayon) Quick Portal on Beranda */}
            <div className="bg-slate-900 border-y border-slate-800 py-10 px-4 sm:px-6 lg:px-8">
              <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-2">
                      Portal Data Jemaat Terpadu
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black text-white">
                      Data Jemaat & Data Keluarga 12 Rayon
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-300 mt-1">
                      Akses statistik jemaat, data pengurus rayon, kelompok sel pemuridan (KSP), dan kartu keluarga.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedRayonId(1);
                      setActiveTab('data-jemaat');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-md transition-all shrink-0"
                  >
                    <span>Buka Portal 12 Rayon Lengkap</span>
                    <span>→</span>
                  </button>
                </div>

                {/* Quick 12 Rayons Chips */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => {
                    const names = [
                      'Sion', 'Betlehem', 'Nazaret', 'Yerikho', 'Galilea', 'Hermon',
                      'Karmel', 'Getsemani', 'Golgotta', 'Ebenhaezer', 'Betania', 'Maranatha'
                    ];
                    return (
                      <button
                        key={num}
                        onClick={() => {
                          setSelectedRayonId(num);
                          setActiveTab('data-jemaat');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="flex flex-col p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-amber-400/50 text-left transition-all group"
                      >
                        <span className="text-[10px] font-mono text-amber-400 font-bold">Rayon {num}</span>
                        <span className="text-xs font-bold text-slate-200 group-hover:text-white truncate">
                          {names[num - 1]}
                        </span>
                        <span className="text-[10px] text-slate-400 mt-1">
                          Statistik & KSP →
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Warta Jemaat Preview */}
            <BeritaJemaatSection
              newsList={newsList}
              onReadText={handleReadText}
              isHighContrast={accessibility.highContrast}
            />

            {/* Baptisan Section Quick Access */}
            <BaptisanOnlineSection
              isHighContrast={accessibility.highContrast}
            />

            {/* Galeri Kegiatan Preview */}
            <GaleriKegiatanSection
              photos={photos}
              isHighContrast={accessibility.highContrast}
            />

            {/* Donasi Digital Section */}
            <DonasiDigitalSection
              isHighContrast={accessibility.highContrast}
            />

            {/* Komunikasi Dua Arah & Doa */}
            <KomunikasiMajelisSection
              isHighContrast={accessibility.highContrast}
            />
          </div>
        )}

        {/* Data Jemaat Section (User's specific hierarchical feature with Admin CRUD permissions) */}
        {activeTab === 'data-jemaat' && (
          <DataJemaatSection
            selectedRayonId={selectedRayonId}
            onSelectRayon={setSelectedRayonId}
            currentUser={currentUser}
            onOpenLoginModal={handleOpenLoginModal}
            onLogout={handleLogout}
          />
        )}

        {activeTab === 'jadwal' && (
          <div className="py-6">
            <JadwalIbadahSection
              schedules={schedules}
              onOpenWhatsAppReminder={(s) => setSelectedScheduleForWA(s)}
              onReadText={handleReadText}
              isHighContrast={accessibility.highContrast}
            />
          </div>
        )}

        {activeTab === 'warta' && (
          <div className="py-6">
            <BeritaJemaatSection
              newsList={newsList}
              onReadText={handleReadText}
              isHighContrast={accessibility.highContrast}
            />
          </div>
        )}

        {activeTab === 'baptisan' && (
          <div className="py-6">
            <BaptisanOnlineSection
              isHighContrast={accessibility.highContrast}
            />
          </div>
        )}

        {activeTab === 'galeri' && (
          <div className="py-6">
            <GaleriKegiatanSection
              photos={photos}
              isHighContrast={accessibility.highContrast}
            />
          </div>
        )}

        {activeTab === 'donasi' && (
          <div className="py-6">
            <DonasiDigitalSection
              isHighContrast={accessibility.highContrast}
            />
          </div>
        )}

        {activeTab === 'komunikasi' && (
          <div className="py-6">
            <KomunikasiMajelisSection
              isHighContrast={accessibility.highContrast}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer
        onNavigate={setActiveTab}
        isHighContrast={accessibility.highContrast}
      />

      {/* WhatsApp Reminder Modal */}
      <WhatsAppReminderModal
        isOpen={Boolean(selectedScheduleForWA)}
        onClose={() => setSelectedScheduleForWA(null)}
        schedule={selectedScheduleForWA}
        onScheduleSubscribe={(data) => {
          setToast({
            show: true,
            title: 'Pengingat WhatsApp Terdaftar',
            body: `Nomor ${data.phone} (${data.name}) dijadwalkan menerima pengingat rutin untuk ${data.sector}.`,
          });
        }}
      />

      {/* Push Notification Manager Modal */}
      <NotifikasiPushModal
        isOpen={isNotificationModalOpen}
        onClose={() => setIsNotificationModalOpen(false)}
        settings={notificationSettings}
        onUpdateSettings={setNotificationSettings}
        onTriggerTestPush={handleTriggerTestPush}
      />

      {/* Admin Login Modal (Superadmin & 12 Admin Rayon) */}
      <AdminLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        initialRayonId={loginTargetRayonId}
      />

      {/* Real-time Push Notification Toast Banner */}
      <NotificationToast
        show={toast.show}
        title={toast.title}
        body={toast.body}
        onClose={() => setToast({ ...toast, show: false })}
        onActionClick={toast.tabTarget ? () => setActiveTab(toast.tabTarget!) : undefined}
        soundEnabled={notificationSettings.soundEnabled}
      />
    </div>
  );
}
