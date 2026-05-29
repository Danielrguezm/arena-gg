export interface Game {
  id: string;
  name: string;
  short: string;
  tag: string;
  hue: number;
  color: string;
  color2: string;
  activePlayers: number;
  emblem: string;
  imagePosition?: string;
}

export interface Tournament {
  id: string;
  game: string;
  name: string;
  prize: number;
  entries: number;
  max: number;
  format: string;
  mode: string;
  level: 'Casual' | 'Intermedio' | 'Avanzado';
  startsAt: number;
  fee: number;
  featured: boolean;
  full?: boolean;
}

export interface StoreItem {
  id: string;
  name: string;
  cat: 'skin' | 'merch' | 'giftcard' | 'pass';
  game?: string;
  cost: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface Reward {
  id: string;
  name: string;
  cost: number;
  tag: string;
}

export interface UserProfile {
  id?: string;
  nick: string;
  email: string;
  initials: string;
  tokens: number;
  bonus?: number;
  joinedAt?: number;
  isAdmin?: boolean;
}

export interface RankPlayer {
  rank: number;
  nick: string;
  tokens: number;
  wins: number;
  ratio: number;
  game: string;
  isYou: boolean;
  change: 'up' | 'down' | 'same';
}

export interface Achievement {
  name: string;
  desc: string;
  got: boolean;
  color: string;
  progress?: number;
}

export const RARITY_META: Record<StoreItem['rarity'], { label: string; color: string }> = {
  common:    { label: 'Común',      color: 'oklch(0.72 0.04 240)' },
  rare:      { label: 'Raro',       color: 'oklch(0.65 0.18 235)' },
  epic:      { label: 'Épico',      color: 'oklch(0.65 0.20 300)' },
  legendary: { label: 'Legendario', color: 'oklch(0.78 0.16 70)'  },
};
