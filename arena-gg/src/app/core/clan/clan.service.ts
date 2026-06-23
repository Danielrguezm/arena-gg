import { Injectable, signal, computed } from '@angular/core';
import { Clan, ClanMember } from '../../data/models';

const DEMO_CLAN: Clan = {
  id: 'c_demo',
  name: 'Arena Wolves',
  tag: 'ARW',
  description: 'Los mejores jugadores de la plataforma. Buscamos constancia y buen rollo.',
  leaderId: 'me',
  members: [
    { id: 'me',  nick: 'zarpa_',       initials: 'ZA', role: 'leader', games: ['valo', 'cs2'],  joinedAt: Date.now() - 90 * 864e5, wins: 47 },
    { id: 'm2',  nick: 'FNX',          initials: 'FN', role: 'member', games: ['cs2'],           joinedAt: Date.now() - 60 * 864e5, wins: 33 },
    { id: 'm3',  nick: 'dragon_coils', initials: 'DC', role: 'member', games: ['lol', 'valo'],   joinedAt: Date.now() - 45 * 864e5, wins: 28 },
    { id: 'm4',  nick: 'kr1z',         initials: 'KR', role: 'member', games: ['apex'],          joinedAt: Date.now() - 30 * 864e5, wins: 19 },
    { id: 'm5',  nick: 'frostbyte',    initials: 'FB', role: 'member', games: ['rl', 'cr'],      joinedAt: Date.now() - 20 * 864e5, wins: 12 },
  ],
  createdAt: Date.now() - 90 * 864e5,
};

@Injectable({ providedIn: 'root' })
export class ClanService {
  private readonly _clan = signal<Clan | null>(DEMO_CLAN);

  readonly clan        = this._clan.asReadonly();
  readonly hasClan     = computed(() => this._clan() !== null);
  readonly memberCount = computed(() => this._clan()?.members.length ?? 0);
  readonly isFull      = computed(() => this.memberCount() >= 10);

  createClan(name: string, tag: string, leaderId: string, nick: string, initials: string): void {
    this._clan.set({
      id: 'c_' + Date.now(),
      name: name.trim(),
      tag: tag.toUpperCase().trim().slice(0, 4),
      leaderId,
      members: [{
        id: leaderId, nick, initials,
        role: 'leader', games: [], joinedAt: Date.now(), wins: 0,
      }],
      createdAt: Date.now(),
    });
  }

  updateName(name: string): void {
    const c = this._clan();
    if (!c || !name.trim()) return;
    this._clan.set({ ...c, name: name.trim() });
  }

  addMember(m: ClanMember): boolean {
    const c = this._clan();
    if (!c || c.members.length >= 10) return false;
    if (c.members.some(x => x.nick.toLowerCase() === m.nick.toLowerCase())) return false;
    this._clan.set({ ...c, members: [...c.members, m] });
    return true;
  }

  removeMember(id: string): void {
    const c = this._clan();
    if (!c) return;
    this._clan.set({ ...c, members: c.members.filter(m => m.id !== id) });
  }

  disbandClan(): void {
    this._clan.set(null);
  }
}
