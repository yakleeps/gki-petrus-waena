import { AdminUser } from '../types';

export interface AdminAccount extends AdminUser {
  password: string;
}

export const ADMIN_ACCOUNTS: AdminAccount[] = [
  {
    id: 'usr-superadmin',
    username: 'superadmin',
    password: 'petruswaena2026',
    name: 'Badan Pekerja Majelis Jemaat (BPMJ)',
    role: 'superadmin',
    title: 'Superadmin Pelayanan GKI Petrus Waena',
    noHp: '0812-4800-2026',
  },
  {
    id: 'usr-rayon-1',
    username: 'admin.rayon1',
    password: 'rayon1waena',
    name: 'Admin Rayon 1 - Sion',
    role: 'admin_rayon',
    rayonId: 1,
    rayonName: 'Rayon 1 - Sion',
    title: 'Sekretariat Pengurus Rayon 1 (Sion)',
    noHp: '0812-4812-3001',
  },
  {
    id: 'usr-rayon-2',
    username: 'admin.rayon2',
    password: 'rayon2waena',
    name: 'Admin Rayon 2 - Betlehem',
    role: 'admin_rayon',
    rayonId: 2,
    rayonName: 'Rayon 2 - Betlehem',
    title: 'Sekretariat Pengurus Rayon 2 (Betlehem)',
    noHp: '0813-4422-3002',
  },
  {
    id: 'usr-rayon-3',
    username: 'admin.rayon3',
    password: 'rayon3waena',
    name: 'Admin Rayon 3 - Nazaret',
    role: 'admin_rayon',
    rayonId: 3,
    rayonName: 'Rayon 3 - Nazaret',
    title: 'Sekretariat Pengurus Rayon 3 (Nazaret)',
    noHp: '0821-9833-3003',
  },
  {
    id: 'usr-rayon-4',
    username: 'admin.rayon4',
    password: 'rayon4waena',
    name: 'Admin Rayon 4 - Yerikho',
    role: 'admin_rayon',
    rayonId: 4,
    rayonName: 'Rayon 4 - Yerikho',
    title: 'Sekretariat Pengurus Rayon 4 (Yerikho)',
    noHp: '0811-4844-3004',
  },
  {
    id: 'usr-rayon-5',
    username: 'admin.rayon5',
    password: 'rayon5waena',
    name: 'Admin Rayon 5 - Galilea',
    role: 'admin_rayon',
    rayonId: 5,
    rayonName: 'Rayon 5 - Galilea',
    title: 'Sekretariat Pengurus Rayon 5 (Galilea)',
    noHp: '0852-5455-3005',
  },
  {
    id: 'usr-rayon-6',
    username: 'admin.rayon6',
    password: 'rayon6waena',
    name: 'Admin Rayon 6 - Hermon',
    role: 'admin_rayon',
    rayonId: 6,
    rayonName: 'Rayon 6 - Hermon',
    title: 'Sekretariat Pengurus Rayon 6 (Hermon)',
    noHp: '0812-4866-3006',
  },
  {
    id: 'usr-rayon-7',
    username: 'admin.rayon7',
    password: 'rayon7waena',
    name: 'Admin Rayon 7 - Karmel',
    role: 'admin_rayon',
    rayonId: 7,
    rayonName: 'Rayon 7 - Karmel',
    title: 'Sekretariat Pengurus Rayon 7 (Karmel)',
    noHp: '0813-4477-3007',
  },
  {
    id: 'usr-rayon-8',
    username: 'admin.rayon8',
    password: 'rayon8waena',
    name: 'Admin Rayon 8 - Getsemani',
    role: 'admin_rayon',
    rayonId: 8,
    rayonName: 'Rayon 8 - Getsemani',
    title: 'Sekretariat Pengurus Rayon 8 (Getsemani)',
    noHp: '0822-4888-3008',
  },
  {
    id: 'usr-rayon-9',
    username: 'admin.rayon9',
    password: 'rayon9waena',
    name: 'Admin Rayon 9 - Golgotta',
    role: 'admin_rayon',
    rayonId: 9,
    rayonName: 'Rayon 9 - Golgotta',
    title: 'Sekretariat Pengurus Rayon 9 (Golgotta)',
    noHp: '0812-4899-3009',
  },
  {
    id: 'usr-rayon-10',
    username: 'admin.rayon10',
    password: 'rayon10waena',
    name: 'Admin Rayon 10 - Ebenhaezer',
    role: 'admin_rayon',
    rayonId: 10,
    rayonName: 'Rayon 10 - Ebenhaezer',
    title: 'Sekretariat Pengurus Rayon 10 (Ebenhaezer)',
    noHp: '0813-4410-3010',
  },
  {
    id: 'usr-rayon-11',
    username: 'admin.rayon11',
    password: 'rayon11waena',
    name: 'Admin Rayon 11 - Betania',
    role: 'admin_rayon',
    rayonId: 11,
    rayonName: 'Rayon 11 - Betania',
    title: 'Sekretariat Pengurus Rayon 11 (Betania)',
    noHp: '0821-9811-3011',
  },
  {
    id: 'usr-rayon-12',
    username: 'admin.rayon12',
    password: 'rayon12waena',
    name: 'Admin Rayon 12 - Maranatha',
    role: 'admin_rayon',
    rayonId: 12,
    rayonName: 'Rayon 12 - Maranatha',
    title: 'Sekretariat Pengurus Rayon 12 (Maranatha)',
    noHp: '0812-4812-3012',
  },
];

const SESSION_KEY = 'gki_petrus_waena_admin_session_v1';

export function getStoredAdminSession(): AdminUser | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AdminUser;
  } catch {
    return null;
  }
}

export function setStoredAdminSession(user: AdminUser): void {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  } catch (e) {
    console.error('Failed to store session', e);
  }
}

export function clearStoredAdminSession(): void {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch (e) {
    console.error('Failed to clear session', e);
  }
}

// Aliases for convenience
export const getCurrentAdminSession = getStoredAdminSession;
export const clearAdminSession = clearStoredAdminSession;

export function authenticateUser(username: string, pass: string): AdminUser | null {
  const account = ADMIN_ACCOUNTS.find(
    (a) => a.username.trim().toLowerCase() === username.trim().toLowerCase() && a.password === pass
  );
  if (!account) return null;

  const { password, ...user } = account;
  return user;
}

/**
 * Strict Permission Check:
 * Superadmin: can edit/add/delete ANY rayon (1 to 12)
 * Admin Rayon: can ONLY edit/add/delete their OWN assigned rayon!
 */
export function canManageRayon(user: AdminUser | null, rayonId: number): boolean {
  if (!user) return false;
  if (user.role === 'superadmin') return true;
  if (user.role === 'admin_rayon' && user.rayonId === rayonId) return true;
  return false;
}
