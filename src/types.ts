export type PrisonZone = 'Phòng Giam Lạnh' | 'Phòng Giam Ấm' | 'Phòng Giam Chữa Lành';

export interface LoveMessage {
  id: string;
  senderName: string;
  message: string;
  createdAt: number;
}

export interface Character {
  id: string;
  prisonId: string;
  name: string;
  age?: string | number;
  subtitle?: string;
  origin?: string;
  crime?: string;
  rarity?: 'SSR' | 'SR' | 'R';
  loyalty?: number;
  danger?: number;
  heartbeat?: number;
  loveRate?: string;
  sentenceTerm?: string;
  possession?: string;
  quote?: string;
  voiceActor?: string;
  voiceAudioUrl?: string;
  voiceLine?: string;
  voiceDuration?: string;
  voicePitch?: number;
  voiceRate?: number;
  zone?: PrisonZone;
  genres: string[];
  backstory: string;
  firstMessage: string;
  chatLink: string;
  avatarUrl?: string;
  avatarGradient?: string;
  status?: string;
  likes: number;
  loveCount?: number;
  loveMessages?: LoveMessage[];
  createdAt: number;
}

export interface Letter {
  id: string;
  senderName: string;
  senderId?: string;
  isAnonymous?: boolean;
  category?: 'idea' | 'review' | 'feedback' | 'love';
  categoryTitle?: string;
  title?: string;
  subtitle?: string;
  content: string;
  rating?: number;
  aspects?: string[];
  targetPrisoner?: string;
  stamp: string;
  stampName?: string;
  zoneName?: string;
  badgeText?: string;
  statusBadge?: string;
  adminReply?: {
    author: string;
    timeText: string;
    message: string;
  };
  themeColor: string;
  createdAt: number;
  likes: number;
  commentsCount?: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'husband';
  text: string;
  timestamp: number;
  type?: 'text' | 'gift' | 'voice' | 'action';
  giftName?: string;
  audioUrl?: string;
}

export interface SystemNotification {
  id: string;
  title: string;
  message: string;
  characterId?: string;
  timestamp: number;
}

export interface GoogleUser {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  wardNumber: string;
  privilegeLevel: string;
  joinedAt: number;
}

export interface WardenProfile {
  name: string;
  wardenId: string;
  subzone: string;
  email: string;
  location: string;
  rank: string;
  quote: string;
  avatarUrl: string;
  daysServed: number;
  visitsCount: number;
  cardsCollected: number;
  totalCards: number;
  midnightTrials: number;
  alarmHusband: boolean;
  secretLetters: boolean;
  hideFromLeaderboard: boolean;
  vipCode: string;
  favoritePrisonerId?: string | null;
}

export type ActiveTab =
  | 'all'
  | 'home'
  | 'cards'
  | 'ranking'
  | 'gacha'
  | 'letters'
  | 'genres'
  | 'midnightCourt'
  | 'profile'
  | 'minigame';

export type SortOption = 'likes' | 'newest' | 'name';
