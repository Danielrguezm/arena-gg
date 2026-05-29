import { Game, Tournament, StoreItem, Reward } from './models';

export const GAMES: Game[] = [
  { id: 'lol',  name: 'League of Legends', short: 'LoL', tag: 'MOBA',          hue: 195, color: 'oklch(0.72 0.16 195)', color2: 'oklch(0.52 0.18 235)', activePlayers: 8742, emblem: '/games/league-of-legends.webp' },
  { id: 'cs2',  name: 'Counter-Strike 2',  short: 'CS2', tag: 'FPS Táctico',   hue: 32,  color: 'oklch(0.78 0.16 65)',  color2: 'oklch(0.55 0.18 35)',  activePlayers: 6210, emblem: '/games/CS2.jpg', imagePosition: 'center 0%' },
  { id: 'valo', name: 'Valorant',           short: 'VAL', tag: 'FPS Táctico',   hue: 18,  color: 'oklch(0.70 0.20 18)',  color2: 'oklch(0.48 0.20 18)',  activePlayers: 5118, emblem: '/games/Valorant.webp' },
  { id: 'apex', name: 'Apex Legends',       short: 'APX', tag: 'Battle Royale', hue: 28,  color: 'oklch(0.74 0.18 40)',  color2: 'oklch(0.50 0.20 28)',  activePlayers: 3942, emblem: '/games/Apex_legends.jpg' },
  { id: 'rl',   name: 'Rocket League',      short: 'RL',  tag: 'Deportivo',     hue: 245, color: 'oklch(0.68 0.17 245)', color2: 'oklch(0.46 0.18 270)', activePlayers: 2810, emblem: '/games/RocketLeague.webp', imagePosition: 'center 30%' },
  { id: 'cr',   name: 'Clash Royale',       short: 'CR',  tag: 'Estrategia',    hue: 145, color: 'oklch(0.74 0.16 145)', color2: 'oklch(0.50 0.17 160)', activePlayers: 4321, emblem: '/games/clashroyale.jpg' },
];

export const GAME_BY_ID: Record<string, Game> = Object.fromEntries(GAMES.map(g => [g.id, g]));

const now = Date.now();
const min = 60 * 1000;
const hr  = 60 * min;
const day = 24 * hr;

export const TOURNAMENTS: Tournament[] = [
  { id: 't01', game: 'valo',  name: 'Night Ops Cup',       prize: 12000, entries: 48,  max: 64,  format: '5v5',  mode: 'Eliminación',   level: 'Casual',     startsAt: now + 28*min,      fee: 0,   featured: true  },
  { id: 't02', game: 'lol',   name: 'Summer Solo Queue',   prize: 18000, entries: 122, max: 128, format: '1v1',  mode: 'Bo3',           level: 'Intermedio', startsAt: now + 2*hr+12*min, fee: 250, featured: true  },
  { id: 't03', game: 'cs2',   name: 'Smoke & Mirrors',     prize:  8500, entries: 22,  max: 32,  format: '5v5',  mode: 'Suiza',         level: 'Casual',     startsAt: now + 6*hr,        fee: 0,   featured: false },
  { id: 't04', game: 'rl',    name: 'Aerial Madness',      prize:  4200, entries: 51,  max: 64,  format: '3v3',  mode: 'Eliminación',   level: 'Casual',     startsAt: now + 45*min,      fee: 0,   featured: false },
  { id: 't05', game: 'apex',  name: 'Drop Zone Royale',    prize: 22000, entries: 96,  max: 100, format: 'Trío', mode: 'Battle Royale', level: 'Avanzado',   startsAt: now + 1*day+3*hr,  fee: 500, featured: true  },
  { id: 't06', game: 'cr',    name: 'Crown Rush',          prize:  3200, entries: 187, max: 256, format: '1v1',  mode: 'Bo5',           level: 'Casual',     startsAt: now + 90*min,      fee: 0,   featured: false },
  { id: 't07', game: 'valo',  name: 'Spike Showdown #14',  prize:  6800, entries: 32,  max: 32,  format: '5v5',  mode: 'Eliminación',   level: 'Intermedio', startsAt: now + 18*min,      fee: 100, featured: false, full: true },
  { id: 't08', game: 'lol',   name: 'ARAM Madness',        prize:  1500, entries: 14,  max: 64,  format: '5v5',  mode: 'ARAM',          level: 'Casual',     startsAt: now + 4*hr+30*min, fee: 0,   featured: false },
  { id: 't09', game: 'cs2',   name: '1v1 Aim Arena',       prize:  2500, entries: 8,   max: 16,  format: '1v1',  mode: 'Bo1',           level: 'Casual',     startsAt: now + 35*min,      fee: 0,   featured: false },
  { id: 't10', game: 'rl',    name: 'Hoops League Night',  prize:  1800, entries: 12,  max: 32,  format: '2v2',  mode: 'Liga',          level: 'Casual',     startsAt: now + 5*hr,        fee: 0,   featured: false },
  { id: 't11', game: 'apex',  name: 'No-Fill Solo Grind',  prize:  3500, entries: 47,  max: 100, format: 'Solo', mode: 'Battle Royale', level: 'Avanzado',   startsAt: now + 8*hr,        fee: 250, featured: false },
  { id: 't12', game: 'cr',    name: 'Mega Knight Mayhem',  prize:   900, entries: 64,  max: 128, format: '1v1',  mode: 'Bo3',           level: 'Casual',     startsAt: now + 22*min,      fee: 0,   featured: false },
];

export const REWARDS: Reward[] = [
  { id: 'r1', name: 'Skin Phantom Selecta',    cost: 18500, tag: 'Valorant'    },
  { id: 'r2', name: 'Sudadera Arena GG',       cost:  9800, tag: 'Merch'       },
  { id: 'r3', name: 'Pase de Batalla Premium', cost: 12000, tag: 'Battle Pass' },
  { id: 'r4', name: 'Gift Card 25€',           cost: 25000, tag: 'Steam'       },
];

export const STORE_ITEMS: StoreItem[] = [
  { id: 's1', name: 'Phantom Selecta',    cat: 'skin',     game: 'valo', cost: 18500, rarity: 'epic'      },
  { id: 's2', name: 'AK-47 Hydroponic',   cat: 'skin',     game: 'cs2',  cost: 22000, rarity: 'legendary' },
  { id: 's3', name: 'Decoy Vandal',       cat: 'skin',     game: 'valo', cost:  9800, rarity: 'rare'      },
  { id: 's4', name: 'Octane Heirloom',    cat: 'skin',     game: 'apex', cost: 32000, rarity: 'legendary' },
  { id: 's5', name: 'Mega Knight Skin',   cat: 'skin',     game: 'cr',   cost:  4500, rarity: 'rare'      },
  { id: 's6', name: 'Battle Bus Skin',    cat: 'skin',     game: 'rl',   cost:  6200, rarity: 'rare'      },
  { id: 'm1', name: 'Sudadera Arena GG',  cat: 'merch',                  cost:  9800, rarity: 'rare'      },
  { id: 'm2', name: 'Gorra Snapback',     cat: 'merch',                  cost:  4200, rarity: 'common'    },
  { id: 'm3', name: 'Mousepad XL',        cat: 'merch',                  cost:  5500, rarity: 'common'    },
  { id: 'g1', name: 'Steam 10€',          cat: 'giftcard',               cost: 10000, rarity: 'rare'      },
  { id: 'g2', name: 'Steam 25€',          cat: 'giftcard',               cost: 25000, rarity: 'epic'      },
  { id: 'g3', name: 'Riot Points 15€',    cat: 'giftcard',               cost: 15000, rarity: 'rare'      },
  { id: 'b1', name: 'Pase de Batalla S04',cat: 'pass',                   cost: 12000, rarity: 'epic'      },
  { id: 'b2', name: 'Boost x2 XP (7d)',   cat: 'pass',                   cost:  3500, rarity: 'common'    },
];

export function fmtNum(n: number): string {
  return new Intl.NumberFormat('es-ES').format(n);
}

export function fmtCountdown(ms: number) {
  if (ms <= 0) return { d: 0, h: 0, m: 0, s: 0 };
  const s  = Math.floor(ms / 1000);
  const d  = Math.floor(s / 86400);
  const h  = Math.floor((s % 86400) / 3600);
  const m  = Math.floor((s % 3600) / 60);
  const ss = s % 60;
  return { d, h, m, s: ss };
}
