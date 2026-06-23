import { Component, inject, signal, computed } from '@angular/core';
import { GAMES, GAME_BY_ID } from '../../data/mock';
import { AuthService } from '../../core/auth/auth.service';
import { SupabaseService } from '../../core/supabase/supabase.service';
import { EmblemComponent } from '../../shared/components/emblem/emblem.component';
import { TokenAmountComponent } from '../../shared/components/token-amount/token-amount.component';
import { FmtNumPipe } from '../../shared/pipes/fmt-num.pipe';

interface RankPlayer {
  id: string; rank: number; nick: string; tokens: number;
  level: number; xp: number; country: string; bio: string;
  avatarUrl: string | null; wins: number; ratio: number;
  game: string; isYou: boolean; change: 'up' | 'down' | 'same';
  createdAt: string; lastSeen: string;
}

const PODIUM_COLORS: Record<number, string> = {
  1: 'oklch(0.78 0.16 70)',
  2: 'oklch(0.72 0.04 240)',
  3: 'oklch(0.68 0.13 30)',
};

const GAME_IDS = ['valo','cs2','lol','apex','rl','cr'];

@Component({
  selector: 'app-ranking',
  standalone: true,
  imports: [EmblemComponent, TokenAmountComponent, FmtNumPipe],
  template: `
    <div class="page-enter" style="max-width:1320px;margin:0 auto;padding:28px 28px 80px">

      <!-- Header -->
      <div style="display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:24px">
        <div>
          <h1 class="display" style="font-size:36px;font-weight:700;margin:0;letter-spacing:-.02em">Ranking global</h1>
          <p style="color:var(--muted);font-size:13.5px;margin:6px 0 0">
            Temporada S04 · {{ players().length | fmtNum }} jugadores activos
          </p>
        </div>
        <div style="display:inline-flex;background:var(--bg-2);border:1px solid var(--border);border-radius:10px;padding:3px;gap:2px">
          @for (o of scopeOpts; track o.v) {
            <button (click)="scope.set(o.v)"
                    [style.background]="scope()===o.v ? 'var(--elevated)' : 'transparent'"
                    [style.color]="scope()===o.v ? 'var(--text)' : 'var(--muted)'"
                    style="appearance:none;border:0;cursor:pointer;padding:7px 14px;border-radius:7px;font-family:var(--font-body);font-weight:600;font-size:12.5px;transition:all .15s">
              {{ o.l }}
            </button>
          }
        </div>
      </div>

      @if (loading()) {
        <div style="text-align:center;padding:80px;color:var(--muted)">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation:spin 1s linear infinite;margin-bottom:12px"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
          <div>Cargando ranking…</div>
        </div>
      } @else {

        <!-- Podio top 3 (orden: 2º, 1º, 3º) -->
        @if (podium().length === 3) {
          <div style="display:grid;grid-template-columns:1fr 1.15fr 1fr;gap:14px;align-items:flex-end;margin-bottom:28px">
            @for (item of podium(); track item.rank) {
              <div class="holo-tint" [style.border-color]="item.color + '66'"
                   [style.transform]="item.rank === 1 ? 'translateY(-16px)' : 'none'"
                   [style.box-shadow]="item.rank === 1 ? '0 0 0 1px ' + item.color + '66, 0 20px 40px ' + item.color + '33' : 'var(--shadow-1)'"
                   (click)="openPlayer(item)"
                   style="background:var(--surface);border:1px solid;border-radius:16px;padding:22px;text-align:center;position:relative;cursor:pointer;transition:transform .2s">
                <div [style.background]="item.color" style="position:absolute;top:-16px;left:50%;transform:translateX(-50%);width:32px;height:32px;border-radius:999px;display:grid;place-items:center;font-family:var(--font-display);font-weight:700;font-size:16px;color:oklch(0.15 0 0);border:3px solid var(--bg)">{{ item.rank }}</div>
                <div [style.background]="avatarGrad(item.nick, item.rank)"
                     [style.border-color]="item.color"
                     style="width:64px;height:64px;border-radius:16px;margin:10px auto 12px;display:grid;place-items:center;color:white;font-family:var(--font-display);font-weight:700;font-size:22px;border:2px solid">
                  {{ item.nick.slice(0,2).toUpperCase() }}
                </div>
                <div class="display" style="font-size:17px;font-weight:700;color:var(--text);margin-bottom:2px">{{ item.nick }}</div>
                <div style="font-size:12px;color:var(--muted);margin-bottom:4px">{{ countryName(item.country) }} · Nv.{{ item.level }}</div>
                <app-token-amount [value]="item.tokens" [size]="14"/>
              </div>
            }
          </div>
        }

        <!-- Game filter chips -->
        <div style="display:flex;gap:6px;margin-bottom:14px;flex-wrap:wrap">
          <button (click)="gameFilter.set('all')"
                  [style.background]="gameFilter()==='all' ? 'var(--accent-soft)' : 'var(--surface)'"
                  [style.color]="gameFilter()==='all' ? 'var(--accent)' : 'var(--text-2)'"
                  [style.border-color]="gameFilter()==='all' ? 'color-mix(in oklch,var(--accent) 40%,transparent)' : 'var(--border-soft)'"
                  style="appearance:none;cursor:pointer;display:inline-flex;align-items:center;gap:6px;border:1px solid;padding:8px 12px;border-radius:8px;font-family:var(--font-body);font-weight:600;font-size:12.5px">
            Todos
          </button>
          @for (g of games; track g.id) {
            <button (click)="gameFilter.set(g.id)"
                    [style.background]="gameFilter()===g.id ? 'var(--accent-soft)' : 'var(--surface)'"
                    [style.color]="gameFilter()===g.id ? 'var(--accent)' : 'var(--text-2)'"
                    [style.border-color]="gameFilter()===g.id ? 'color-mix(in oklch,var(--accent) 40%,transparent)' : 'var(--border-soft)'"
                    style="appearance:none;cursor:pointer;display:inline-flex;align-items:center;gap:6px;border:1px solid;padding:8px 12px;border-radius:8px;font-family:var(--font-body);font-weight:600;font-size:12.5px">
              <app-emblem [game]="g.id" [size]="18"/>{{ g.short }}
            </button>
          }
        </div>

        <!-- Tabla -->
        <div class="holo-tint" style="background:var(--surface);border:1px solid var(--border-soft);border-radius:16px;overflow:hidden">
          <div style="display:grid;grid-template-columns:80px 1fr 150px 90px 90px;padding:14px 20px;border-bottom:1px solid var(--border-soft);font-size:10.5px;color:var(--muted);letter-spacing:.15em;text-transform:uppercase;font-weight:600">
            <span>#</span><span>Jugador</span><span>Tokens</span><span>Nivel</span><span>País</span>
          </div>
          @for (p of filteredPlayers(); track p.id) {
            <div [style.background]="p.isYou ? 'var(--accent-soft)' : 'transparent'"
                 style="display:grid;grid-template-columns:80px 1fr 150px 90px 90px;padding:13px 20px;align-items:center;border-bottom:1px solid var(--border-soft);cursor:pointer;transition:background .15s"
                 (click)="openPlayer(p)"
                 (mouseenter)="rowHover($event, p.isYou, true)"
                 (mouseleave)="rowHover($event, p.isYou, false)">
              <div style="display:flex;align-items:center;gap:8px">
                <span class="mono" [style.color]="p.rank <= 3 ? 'var(--gold)' : 'var(--text)'" style="font-weight:700;font-size:14px">{{ p.rank }}</span>
                @if (p.change === 'up')   { <span style="color:var(--accent);font-size:10px">▲</span> }
                @if (p.change === 'down') { <span style="color:var(--danger);font-size:10px">▼</span> }
              </div>
              <div style="display:flex;align-items:center;gap:10px">
                <div [style.background]="avatarGrad(p.nick, p.rank)"
                     style="width:32px;height:32px;border-radius:8px;display:grid;place-items:center;color:white;font-family:var(--font-display);font-weight:700;font-size:11px;flex-shrink:0">
                  {{ p.nick.slice(0,2).toUpperCase() }}
                </div>
                <div>
                  <span [style.color]="p.isYou ? 'var(--accent)' : 'var(--text)'" style="font-weight:600;font-size:13.5px">{{ p.nick }}{{ p.isYou ? ' (TÚ)' : '' }}</span>
                </div>
                <app-emblem [game]="p.game" [size]="18"/>
              </div>
              <app-token-amount [value]="p.tokens" [size]="13"/>
              <div style="display:flex;align-items:center;gap:6px">
                <span class="mono" style="font-size:13px;font-weight:700;color:var(--text)">{{ p.level }}</span>
                <div style="width:40px;height:4px;border-radius:2px;background:var(--border);overflow:hidden">
                  <div [style.width]="xpPct(p.xp, p.level) + '%'" style="height:100%;background:var(--accent);border-radius:2px;transition:width .3s"></div>
                </div>
              </div>
              <span style="font-size:12.5px;color:var(--muted)">{{ countryName(p.country) }}</span>
            </div>
          }
        </div>
      }
    </div>

    <!-- ═══ MODAL: PERFIL DEL JUGADOR ════════════════════════════ -->
    @if (selected()) {
      <div (click)="selected.set(null)"
           style="position:fixed;inset:0;z-index:150;background:oklch(0 0 0/.65);backdrop-filter:blur(8px);display:grid;place-items:center;padding:20px;animation:fadeIn .2s ease both">
        <div (click)="$event.stopPropagation()"
             style="width:100%;max-width:400px;background:var(--surface);border:1px solid var(--border);border-radius:20px;overflow:hidden;box-shadow:var(--shadow-2);animation:scaleIn .25s cubic-bezier(.22,.61,.36,1) both">

          <!-- Banner + avatar -->
          <div [style.background]="avatarGrad(selected()!.nick, selected()!.rank)"
               style="height:90px;position:relative">
            <button (click)="selected.set(null)"
                    style="position:absolute;top:10px;right:10px;appearance:none;border:1px solid oklch(1 0 0/.2);background:oklch(0 0 0/.3);color:white;border-radius:8px;padding:5px;cursor:pointer;display:grid;place-items:center">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6 6 18M6 6l12 12"/></svg>
            </button>
            <div [style.background]="avatarGrad(selected()!.nick, selected()!.rank)"
                 style="position:absolute;bottom:-28px;left:24px;width:56px;height:56px;border-radius:14px;border:3px solid var(--surface);display:grid;place-items:center;color:white;font-family:var(--font-display);font-weight:700;font-size:20px;box-shadow:0 4px 12px oklch(0 0 0/.3)">
              {{ selected()!.nick.slice(0,2).toUpperCase() }}
            </div>
            @if (selected()!.rank <= 3) {
              <div [style.background]="PODIUM_COLORS[selected()!.rank]"
                   style="position:absolute;bottom:-14px;left:68px;padding:3px 9px;border-radius:999px;font-size:10px;font-weight:700;color:oklch(0.15 0 0);border:2px solid var(--surface)">
                #{{ selected()!.rank }} GLOBAL
              </div>
            }
          </div>

          <div style="padding:38px 24px 24px">
            <!-- Nick + país -->
            <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:16px">
              <div>
                <div class="display" style="font-size:22px;font-weight:700;color:var(--text);line-height:1.1">{{ selected()!.nick }}</div>
                @if (selected()!.bio) {
                  <div style="color:var(--muted);font-size:12.5px;margin-top:5px;line-height:1.5">{{ selected()!.bio }}</div>
                }
              </div>
              <div style="text-align:right">
                <div style="font-size:13px;font-weight:600;color:var(--text-2)">{{ countryName(selected()!.country) }}</div>
              </div>
            </div>

            <!-- Stats grid -->
            <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:18px">
              <div style="background:var(--bg-2);border:1px solid var(--border-soft);border-radius:10px;padding:12px;text-align:center">
                <div style="font-size:10px;color:var(--muted);letter-spacing:.1em;text-transform:uppercase;margin-bottom:4px">Tokens</div>
                <div class="mono" style="font-size:15px;font-weight:700;color:var(--gold)">{{ selected()!.tokens | fmtNum }}</div>
              </div>
              <div style="background:var(--bg-2);border:1px solid var(--border-soft);border-radius:10px;padding:12px;text-align:center">
                <div style="font-size:10px;color:var(--muted);letter-spacing:.1em;text-transform:uppercase;margin-bottom:4px">Nivel</div>
                <div class="mono" style="font-size:15px;font-weight:700;color:var(--text)">{{ selected()!.level }}</div>
              </div>
              <div style="background:var(--bg-2);border:1px solid var(--border-soft);border-radius:10px;padding:12px;text-align:center">
                <div style="font-size:10px;color:var(--muted);letter-spacing:.1em;text-transform:uppercase;margin-bottom:4px">Rank</div>
                <div class="mono" [style.color]="selected()!.rank <= 3 ? 'var(--gold)' : 'var(--text)'" style="font-size:15px;font-weight:700">#{{ selected()!.rank }}</div>
              </div>
            </div>

            <!-- XP bar -->
            <div style="margin-bottom:18px">
              <div style="display:flex;justify-content:space-between;font-size:11.5px;color:var(--muted);margin-bottom:6px">
                <span>XP · {{ selected()!.xp | fmtNum }}</span>
                <span>Nv.{{ selected()!.level + 1 }} en {{ (selected()!.level * 5000) - selected()!.xp | fmtNum }} XP</span>
              </div>
              <div style="height:6px;border-radius:3px;background:var(--border);overflow:hidden">
                <div [style.width]="xpPct(selected()!.xp, selected()!.level) + '%'"
                     style="height:100%;border-radius:3px;background:linear-gradient(90deg,var(--accent),var(--secondary));transition:width .4s"></div>
              </div>
            </div>

            <!-- Fechas -->
            <div style="display:flex;justify-content:space-between;font-size:11.5px;color:var(--muted);padding-top:14px;border-top:1px solid var(--border-soft)">
              <span>Miembro desde {{ fmtDate(selected()!.createdAt) }}</span>
              @if (selected()!.lastSeen) {
                <span>Visto {{ fmtDate(selected()!.lastSeen) }}</span>
              }
            </div>
          </div>
        </div>
      </div>
    }
  `,
})
export class RankingComponent {
  readonly auth     = inject(AuthService);
  readonly supabase = inject(SupabaseService);

  readonly PODIUM_COLORS = PODIUM_COLORS;
  readonly games         = GAMES;
  readonly gameFilter    = signal('all');
  readonly scope         = signal('global');
  readonly loading       = signal(true);
  readonly players       = signal<RankPlayer[]>([]);
  readonly selected      = signal<RankPlayer | null>(null);

  readonly scopeOpts = [
    { v: 'global', l: 'Global' },
    { v: 'month',  l: 'Este mes' },
    { v: 'week',   l: 'Semana' },
  ];

  constructor() { void this.load(); }

  private async load(): Promise<void> {
    if (!this.supabase.isConfigured) {
      this.players.set(this.mockPlayers());
      this.loading.set(false);
      return;
    }
    const { data } = await this.supabase.client
      .from('profiles')
      .select('id, nick, tokens, level, xp, bio, country, avatar_url, created_at, last_seen_at')
      .order('tokens', { ascending: false })
      .limit(100);

    const me = this.auth.user()?.nick ?? '';
    this.players.set(
      ((data ?? []) as any[]).map((p, i) => this.mapRow(p, i + 1, me))
    );
    this.loading.set(false);
  }

  private mapRow(p: any, rank: number, me: string): RankPlayer {
    return {
      id: p.id, rank, nick: p.nick, tokens: p.tokens ?? 0,
      level: p.level ?? 1, xp: p.xp ?? 0,
      country: p.country ?? '', bio: p.bio ?? '',
      avatarUrl: p.avatar_url ?? null, wins: Math.floor((p.level ?? 1) * 4.2),
      ratio: Math.min(95, 40 + (p.level ?? 1)),
      game: this.gameForNick(p.nick),
      isYou: p.nick === me,
      change: (rank % 7 === 0 ? 'up' : rank % 5 === 0 ? 'down' : 'same') as any,
      createdAt:  p.created_at  ?? '',
      lastSeen:   p.last_seen_at ?? '',
    };
  }

  readonly filteredPlayers = computed(() => {
    const g = this.gameFilter();
    return g === 'all'
      ? this.players()
      : this.players().filter(p => p.game === g);
  });

  readonly podium = computed<Array<RankPlayer & { color: string }>>(() => {
    const top = this.players().slice(0, 3);
    if (top.length < 3) return [];
    return [
      { ...top[1], rank: 2, color: PODIUM_COLORS[2] },
      { ...top[0], rank: 1, color: PODIUM_COLORS[1] },
      { ...top[2], rank: 3, color: PODIUM_COLORS[3] },
    ];
  });

  openPlayer(p: RankPlayer): void { this.selected.set(p); }

  avatarGrad(nick: string, rank: number): string {
    let h = 0;
    for (const c of nick) h = (h * 31 + c.charCodeAt(0)) | 0;
    const hue = Math.abs(h) % 360;
    return `linear-gradient(135deg, oklch(0.55 0.18 ${hue}), oklch(0.40 0.20 ${(hue + 70) % 360}))`;
  }

  gameForNick(nick: string): string {
    let h = 0;
    for (const c of nick) h = (h * 31 + c.charCodeAt(0)) | 0;
    return GAME_IDS[Math.abs(h) % GAME_IDS.length];
  }

  xpPct(xp: number, level: number): number {
    const prev = (level - 1) * 5000;
    const next = level * 5000;
    return Math.min(100, Math.max(0, ((xp - prev) / (next - prev)) * 100));
  }

  countryName(code: string): string {
    if (!code) return '—';
    try {
      return new Intl.DisplayNames(['es'], { type: 'region' }).of(code.toUpperCase()) ?? code;
    } catch {
      return code;
    }
  }

  fmtDate(iso: string): string {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  getGame(id: string) { return GAME_BY_ID[id] ?? GAME_BY_ID['valo']; }

  rowHover(e: MouseEvent, isYou: boolean, enter: boolean) {
    if (isYou) return;
    (e.currentTarget as HTMLElement).style.background = enter ? 'var(--hover)' : 'transparent';
  }

  private mockPlayers(): RankPlayer[] {
    const names = ['TitanForce','StormChaser','CipherX','SniperElite','GhostFrag','IceBreaker','DarkMatter_','MorphBlade','AceOverload','NightShade','zarpa_','ShadowStrike','W4rlord','PhantomClaw','RiftBreaker'];
    return names.map((nick, i) => ({
      id: 'mock_' + i, rank: i + 1, nick,
      tokens: Math.round(75000 - i * 3800),
      level: Math.max(1, 64 - i * 4), xp: (64 - i * 4) * 5000 - 1200,
      country: ['ES','MX','AR','CL','CO','PE','VE'][i % 7],
      bio: '', avatarUrl: null,
      wins: Math.round(89 - i * 5), ratio: Math.round((85 - i * 1.5) * 10) / 10,
      game: GAME_IDS[i % 6], isYou: nick === 'zarpa_',
      change: (i % 7 === 0 ? 'up' : i % 5 === 0 ? 'down' : 'same') as any,
      createdAt: new Date(Date.now() - (90 + i * 5) * 864e5).toISOString(),
      lastSeen:  new Date(Date.now() - i * 864e5).toISOString(),
    }));
  }
}
