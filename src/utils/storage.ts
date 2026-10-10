import { Character, Letter, SystemNotification, GoogleUser, WardenProfile } from '../types';
import { OFFICIAL_GENRES } from '../data/constants';
import wardenAvatarDefault from '../assets/images/warden_nanggtho_avatar_1791594079687.jpg';

const CHARACTERS_KEY = 'nhat_ky_tu_an_characters';
const FAVORITES_KEY = 'nhat_ky_tu_an_user_favorites';
const LETTERS_KEY = 'nhat_ky_tu_an_letters';
const NOTIFICATIONS_KEY = 'nhat_ky_tu_an_notifications';
const GATE_KEY = 'nhat_ky_tu_an_gate_passed';
const THEME_KEY = 'nhat_ky_tu_an_theme';
const GOOGLE_USER_KEY = 'nhat_ky_tu_an_google_user';
const GENRES_KEY = 'nhat_ky_tu_an_genres';
const WARDEN_PROFILE_KEY = 'nhat_ky_tu_an_warden_profile';

export const DEFAULT_WARDEN_PROFILE: WardenProfile = {
  name: 'Nàng Thơ Tối Cao',
  wardenId: '#001-WARDEN',
  subzone: 'Phân Khu Hoa Hồng',
  email: 'nangtho.warden@gmail.com',
  location: 'Buồng Giam Số 07 (Velvet Isolation Ward)',
  rank: '✪ CẤP A',
  quote:
    '“Mọi song sắt bọc nhung và trái tim cuồng si nơi đây đều thuộc quyền quản thúc của ta. Kẻ nào tìm cách trốn chạy sẽ chỉ càng lún sâu vào chiếc bẫy ngọt ngào này.”',
  avatarUrl: wardenAvatarDefault,
  daysServed: 0,
  visitsCount: 0,
  cardsCollected: 0,
  totalCards: 15,
  midnightTrials: 0,
  alarmHusband: true,
  secretLetters: true,
  hideFromLeaderboard: false,
  vipCode: '#GOLDEN-VELVET',
  favoritePrisonerId: null,
};

export const getStoredWardenProfile = (): WardenProfile => {
  try {
    const raw = localStorage.getItem(WARDEN_PROFILE_KEY);
    const base = raw ? { ...DEFAULT_WARDEN_PROFILE, ...JSON.parse(raw) } : DEFAULT_WARDEN_PROFILE;
    return {
      ...base,
      daysServed: 0,
      visitsCount: 0,
      cardsCollected: 0,
      midnightTrials: 0,
    };
  } catch {
    return DEFAULT_WARDEN_PROFILE;
  }
};

export const saveWardenProfile = (profile: WardenProfile) => {
  localStorage.setItem(WARDEN_PROFILE_KEY, JSON.stringify(profile));
};

export const getStoredCharacters = (): Character[] => {
  try {
    const raw = localStorage.getItem(CHARACTERS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    const filtered = parsed.filter(
      (c: Character) => c.id !== 'char-kaelen-valerius-06' && !c.name?.toLowerCase().includes('kaelen')
    );
    if (filtered.length !== parsed.length) {
      localStorage.setItem(CHARACTERS_KEY, JSON.stringify(filtered));
    }
    return filtered;
  } catch {
    return [];
  }
};

export const saveCharacters = (characters: Character[]) => {
  localStorage.setItem(CHARACTERS_KEY, JSON.stringify(characters));
};

export const getStoredFavorites = (): string[] => {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    const filtered = parsed.filter((id: string) => id !== 'char-kaelen-valerius-06');
    return filtered;
  } catch {
    return [];
  }
};

export const saveFavorites = (favs: string[]) => {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favs));
};

const INITIAL_LETTERS: Letter[] = [];

export const getStoredLetters = (): Letter[] => {
  try {
    const raw = localStorage.getItem(LETTERS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // Filter out dummy sample letters so the letter wall starts clean
    const filtered = parsed.filter((l: Letter) => !l.id?.startsWith('letter-sample-'));
    return filtered;
  } catch {
    return [];
  }
};

export const saveLetters = (letters: Letter[]) => {
  localStorage.setItem(LETTERS_KEY, JSON.stringify(letters));
};

export const getStoredNotifications = (): SystemNotification[] => {
  try {
    const raw = localStorage.getItem(NOTIFICATIONS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const saveNotifications = (notifs: SystemNotification[]) => {
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifs));
};

export const isGatePassed = (): boolean => {
  // Session storage allows user to see gate again when refreshed or restarted if preferred,
  // but let's check sessionStorage so they can re-experience on new tab.
  return sessionStorage.getItem(GATE_KEY) === 'true';
};

export const setGatePassed = (passed: boolean) => {
  sessionStorage.setItem(GATE_KEY, passed ? 'true' : 'false');
};

export const getStoredTheme = (): 'light' | 'dark' => {
  const theme = localStorage.getItem(THEME_KEY);
  return theme === 'dark' ? 'dark' : 'light';
};

export const saveTheme = (theme: 'light' | 'dark') => {
  localStorage.setItem(THEME_KEY, theme);
};

export const getStoredGoogleUser = (): GoogleUser | null => {
  try {
    const raw = localStorage.getItem(GOOGLE_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const saveGoogleUser = (user: GoogleUser | null) => {
  if (!user) {
    localStorage.removeItem(GOOGLE_USER_KEY);
  } else {
    localStorage.setItem(GOOGLE_USER_KEY, JSON.stringify(user));
  }
};

export const getStoredGenres = (): string[] => {
  try {
    const raw = localStorage.getItem(GENRES_KEY);
    if (!raw) return [...OFFICIAL_GENRES];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      // Ensure all 21 default official genres are preserved, appending any custom ones added by admin
      const combined = Array.from(new Set([...OFFICIAL_GENRES, ...parsed]));
      return combined;
    }
    return [...OFFICIAL_GENRES];
  } catch {
    return [...OFFICIAL_GENRES];
  }
};

export const saveGenres = (genres: string[]) => {
  localStorage.setItem(GENRES_KEY, JSON.stringify(genres));
};
