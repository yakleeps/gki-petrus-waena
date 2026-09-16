export type WorshipCategory = 'minggu' | 'ksp' | 'pemuda' | 'wanita' | 'bapak' | 'anak' | 'khusus';

export interface WorshipSchedule {
  id: string;
  title: string;
  category: WorshipCategory;
  categoryLabel: string;
  dateOrDay: string;
  time: string;
  location: string;
  liturgist: string;
  preacher: string;
  theme: string;
  bibleVerse: string;
  organist?: string;
  kantor?: string;
  onlineStreamUrl?: string;
  isUpcomingSoon?: boolean;
}

export interface ChurchNews {
  id: string;
  title: string;
  category: 'warta' | 'duka' | 'sukacita' | 'keuangan' | 'pemuda' | 'lansia';
  categoryLabel: string;
  date: string;
  summary: string;
  content: string;
  author: string;
  readTime: string;
  important?: boolean;
  financialData?: {
    income: number;
    expense: number;
    balance: number;
    period: string;
    details: { label: string; amount: number; type: 'in' | 'out' }[];
  };
}

export type BaptismType = 'anak' | 'dewasa' | 'sidi';

export interface BaptismRegistration {
  regNumber: string;
  baptismType: BaptismType;
  fullName: string;
  birthPlace: string;
  birthDate: string;
  gender: 'L' | 'P';
  fatherName: string;
  motherName: string;
  wikSector: string;
  witnessName1: string;
  witnessName2: string;
  phoneNumber: string;
  email?: string;
  homeAddress: string;
  marriageCertNumber?: string;
  preferredDate: string;
  submittedAt: string;
  status: 'Menunggu Verifikasi' | 'Terverifikasi' | 'Jadwal Katekisasi Ditetapkan';
}

export interface GalleryPhoto {
  id: string;
  title: string;
  category: 'ibadah' | 'hari_raya' | 'sosial' | 'pemuda' | 'par' | 'lansia';
  categoryLabel: string;
  date: string;
  imageUrl: string;
  description: string;
  photographer: string;
  downloadCount: number;
}

export type DonationCategory = 'persembahan_minggu' | 'perpuluhan' | 'pembangunan' | 'diakonia_kasih' | 'bantuan_bencana';

export interface DonationRecord {
  id: string;
  donorName: string;
  isAnonymous: boolean;
  category: DonationCategory;
  categoryLabel: string;
  amount: number;
  paymentMethod: 'qris' | 'bca' | 'mandiri' | 'bri' | 'bni' | 'bank_papua' | 'gopay' | 'ovo' | 'dana';
  paymentMethodName: string;
  timestamp: string;
  prayerWish?: string;
  receiptNumber: string;
  status: 'Berhasil' | 'Menunggu Pembayaran';
}

export interface PastoralMessage {
  id: string;
  senderName: string;
  phoneNumber: string;
  wikSector: string;
  type: 'doa' | 'konseling' | 'kunjungan_lansia' | 'tanya_majelis';
  typeLabel: string;
  message: string;
  timestamp: string;
  status: 'Diterima' | 'Diproses' | 'Dijawab Majelis';
  replyNote?: string;
}

export interface NotificationSettings {
  urgentNews: boolean;
  sundayReminder: boolean;
  wikReminder: boolean;
  financialTransparency: boolean;
  soundEnabled: boolean;
}

export interface AccessibilitySettings {
  fontSize: 'normal' | 'large' | 'xlarge';
  highContrast: boolean;
  simplifiedView: boolean;
  soundGuide: boolean;
}

export interface FamilyMember {
  id: string;
  name: string;
  relation: 'Kepala Keluarga' | 'Istri' | 'Anak' | 'Orang Tua' | 'Famili';
  gender: 'L' | 'P';
  age: number;
  statusBaptis: boolean;
  statusSidi: boolean;
  pendidikan?: string; // Pendidikan (SD, SMP, SMA/SMK, D3, S1, S2, S3, dll)
  pekerjaan: string; // Pekerjaan / Profesi
  golonganDarah?: string; // Golongan Darah (A, B, AB, O, Belum Tahu)
  etnik?: string; // Etnik / Suku (Biak, Serui, Sentani, Toraja, Jawa, dll)
  noKontak?: string; // No. Kontak / WhatsApp
  talenta?: string; // Talenta / Life Skill (Pemusik, Song Leader, Guru PAR, Multimedia, Pertukangan, dll)
}

export interface FamilyRecord {
  id: string;
  noKkGereja: string;
  kepalaKeluarga: string;
  pasangan?: string;
  jumlahJiwa: number;
  alamat: string;
  kspName: string;
  statusEkonomi?: 'Mampu' | 'Menengah' | 'Diakonia / Prasejahtera';
  anggota: FamilyMember[];
  tanggalRegistrasi: string;
}

export interface KspData {
  id: string;
  name: string;
  ketuaKsp: string;
  noHpKetua: string;
  jadwalHari: string;
  lokasiPertemuan: string;
  tuanRumahBulanIni: string;
  jumlahAnggota: number;
  jumlahKk: number;
}

export interface RayonStatistic {
  totalJiwa: number;
  totalKk: number;
  lakiLaki: number;
  perempuan: number;
  anakPar: number;
  pemudaPam: number;
  kaumIbuPw: number;
  kaumBapakPkb: number;
  lansia: number;
  sudahBaptis: number;
  sudahSidi: number;
  belumSidi: number;
}

export interface RayonData {
  id: number; // 1 s/d 12
  code: string; // "Rayon 1", "Rayon 2", ... "Rayon 12"
  name: string; // e.g. "Rayon 1 - Sion Perumnas 1"
  singkatan: string;
  wilayah: string;
  koordinator: {
    nama: string;
    jabatan: string;
    noHp: string;
  };
  majelisPendamping: {
    penatua: string[];
    syamas: string[];
  };
  jadwalIbadahRayon: string;
  posPelayanan: string;
  deskripsi: string;
  statistic: RayonStatistic;
  kspList: KspData[];
  keluargaList: FamilyRecord[];
}

export type UserRole = 'superadmin' | 'admin_rayon' | 'guest';

export interface AdminUser {
  id: string;
  username: string;
  name: string;
  role: UserRole;
  rayonId?: number; // 1 to 12 if admin_rayon, undefined if superadmin
  rayonName?: string;
  title: string;
  noHp?: string;
}
