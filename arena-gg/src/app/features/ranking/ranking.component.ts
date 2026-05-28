import { Component, inject, signal, computed } from '@angular/core';
import { GAMES, GAME_BY_ID, fmtNum } from '../../data/mock';
import { AuthService } from '../../core/auth/auth.service';
import { EmblemComponent } from '../../shared/components/emblem/emblem.component';
import { TokenAmountComponent } from '../../shared/components/token-amount/token-amount.component';
import { FmtNumPipe } from '../../shared/pipes/fmt-num.pipe';

interface RankPlayer {
  rank: number; nick: string; tokens: number; wins: number;
  ratio: number; game: string; isYou: boolean; change: 'up' | 'down' | 'same';
}

const PODIUM_COLORS: Record<number, string> = {
  1: 'oklch(0.78 0.16 70)',
  2: 'oklch(0.72 0.04 240)',
  3: 'oklch(0.68 0.13 30)',
};

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
          <p style="color:var(--muted);font-size:13.5px;margin:6px 0 0">Temporada S04 · Actualiza cada hora · {{ 12415 | fmtNum }} jugadores activos</p>
        </div>
        <div style="display:inline-flex;background:var(--bg-2);border:1px solid var(--border);border-radius:10px;padding:3px;gap:2px">
          @for (o of scopeOpts; track o.v) {
            <button (click)="scope.set(o.v)" [style.background]="scope()===o.v ? 'var(--elevated)' : 'transparent'" [style.color]="scope()===o.v ? 'var(--text)' : 'var(--muted)'" style="appearance:none;border:0;cursor:pointer;padding:7px 14px;border-radius:7px;font-family:var(--font-body);font-weight:600;font-size:12.5px;transition:all .15s">{{ o.l }}</button>
          }
        </div>
      </div>

      <!-- Podio top 3 (orden: 2º, 1º, 3º) -->
      <div style="display:grid;grid-template-columns:1fr 1.15fr 1fr;gap:14px;align-items:flex-end;margin-bottom:28px">
        @for (item of podium(); track item.rank) {
          <div class="holo-tint" [style.border-color]="item.color + '66'"
               [style.transform]="item.rank === 1 ? 'translateY(-16px)' : 'none'"
               [style.box-shadow]="item.rank === 1 ? '0 0 0 1px ' + item.color + '66, 0 20px 40px ' + item.color + '33' : 'var(--shadow-1)'"
               style="background:var(--surface);border:1px solid;border-radius:16px;padding:22px;text-align:center;position:relative">
            <div [style.background]="item.color" style="position:absolute;top:-16px;left:50%;transform:translateX(-50%);width:32px;height:32px;border-radius:999px;display:grid;place-items:center;font-family:var(--font-display);font-weight:700;font-size:16px;color:oklch(0.15 0 0);border:3px solid var(--bg)">{{ item.rank }}</div>
            <div [style.background]="'linear-gradient(135deg, oklch(0.55 0.18 ' + (item.rank * 80) + '), oklch(0.40 0.20 ' + (item.rank * 80 + 80) + '))'"
                 [style.border-color]="item.color"
                 style="width:64px;height:64px;border-radius:16px;margin:10px auto 12px;display:grid;place-items:center;color:white;font-family:var(--font-display);font-weight:700;font-size:22px;border:2px solid">{{ item.nick.slice(0, 2).toUpperCase() }}</div>
            <div class="display" style="font-size:17px;font-weight:700;color:var(--text);margin-bottom:4px">{{ item.nick }}</div>
            <div style="font-size:11.5px;color:var(--muted);margin-bottom:12px">{{ getGame(item.game).name }}</div>
            <app-token-amount [value]="item.tokens" [size]="14"/>
          </div>
        }
      </div>

      <!-- Game filter chips -->
      <div style="display:flex;gap:6px;margin-bottom:14px;flex-wrap:wrap">
        <button (click)="gameFilter.set('all')" [style.background]="gameFilter()==='all' ? 'var(--accent-soft)' : 'var(--surface)'" [style.color]="gameFilter()==='all' ? 'var(--accent)' : 'var(--text-2)'" [style.border-color]="gameFilter()==='all' ? 'color-mix(in oklch, var(--accent) 40%, transparent)' : 'var(--border-soft)'" style="appearance:none;cursor:pointer;display:inline-flex;align-items:center;gap:6px;border:1px solid;padding:8px 12px;border-radius:8px;font-family:var(--font-body);font-weight:600;font-size:12.5px">Todos los juegos</button>
        @for (g of games; track g.id) {
          <button (click)="gameFilter.set(g.id)" [style.background]="gameFilter()===g.id ? 'var(--accent-soft)' : 'var(--surface)'" [style.color]="gameFilter()===g.id ? 'var(--accent)' : 'var(--text-2)'" [style.border-color]="gameFilter()===g.id ? 'color-mix(in oklch, var(--accent) 40%, transparent)' : 'var(--border-soft)'" style="appearance:none;cursor:pointer;display:inline-flex;align-items:center;gap:6px;border:1px solid;padding:8px 12px;border-radius:8px;font-family:var(--font-body);font-weight:600;font-size:12.5px">
            <app-emblem [game]="g.id" [size]="18"/>{{ g.short }}
          </button>
        }
      </div>

      <!-- Tabla -->
      <div class="holo-tint" style="background:var(--surface);border:1px solid var(--border-soft);border-radius:16px;overflow:hidden">
        <div style="display:grid;grid-template-columns:80px 1fr 130px 100px 110px;padding:14px 20px;border-bottom:1px solid var(--border-soft);font-size:10.5px;color:var(--muted);letter-spacing:.15em;text-transform:uppercase;font-weight:600">
          <span>#</span><span>Jugador</span><span>Tokens</span><span>Ratio</span><span>Victorias</span>
        </div>
        @for (p of filteredPlayers(); track p.nick) {
          <div [style.background]="p.isYou ? 'var(--accent-soft)' : 'transparent'"
               style="display:grid;grid-template-columns:80px 1fr 130px 100px 110px;padding:14px 20px;align-items:center;border-bottom:1px solid var(--border-soft);transition:background .15s"
               (mouseenter)="rowHover($event, p.isYou, true)"
               (mouseleave)="rowHover($event, p.isYou, false)">
            <div style="display:flex;align-items:center;gap:8px">
              <span class="mono" [style.color]="p.rank <= 3 ? 'var(--gold)' : 'var(--text)'" style="font-weight:700;font-size:14px">{{ p.rank }}</span>
              @if (p.change === 'up')   { <span style="color:var(--accent);font-size:10px">▲</span> }
              @if (p.change === 'down') { <span style="color:var(--danger);font-size:10px">▼</span> }
            </div>
            <div style="display:flex;align-items:center;gap:10px">
              <div [style.background]="'linear-gradient(135deg, oklch(0.55 0.18 ' + (p.rank * 27) + '), oklch(0.40 0.20 ' + (p.rank * 27 + 60) + '))'"
                   style="width:28px;height:28px;border-radius:7px;display:grid;place-items:center;color:white;font-family:var(--font-display);font-weight:700;font-size:10px">{{ p.nick.slice(0, 2).toUpperCase() }}</div>
              <span [style.color]="p.isYou ? 'var(--accent)' : 'var(--text)'" style="font-weight:600;font-size:13.5px">{{ p.nick }}{{ p.isYou ? ' (TÚ)' : '' }}</span>
              <app-emblem [game]="p.game" [size]="20"/>
            </div>
            <app-token-amount [value]="p.tokens" [size]="13"/>
            <span class="mono" style="color:var(--text-2);font-size:13px">{{ p.ratio }}%</span>
            <span class="mono" style="color:var(--text-2);font-size:13px">{{ p.wins }}</span>
          </div>
        }
      </div>
    </div>
  `,
})
export class RankingComponent {
  readonly auth = inject(AuthService);

  readonly games      = GAMES;
  readonly gameFilter = signal('all');
  readonly scope      = signal('global');
  readonly scopeOpts  = [{ v: 'global', l: 'Global' }, { v: 'month', l: 'Este mes' }, { v: 'week', l: 'Semana' }];

  private readonly allPlayers: RankPlayer[] = (() => {
    const names = ['NUEVOS_LOBOS','FNX','DRAGON_COILS','zarpa_','kilo9','vinky17','brawn','frostbyte','sn0wy','drago','sliver','whiskey','tessa','b00m','kr1z','jin','valo_main','apex_dad','clutch','mvp'];
    return names.map((nick, i) => ({
      rank:   i + 1,
      nick,
      tokens: Math.round(245000 - i * 9500),
      wins:   Math.round(180 - i * 6),
      ratio:  Math.round((85 - i * 1.5) * 10) / 10,
      game:   ['valo','cs2','lol','apex','rl','cr'][i % 6],
      isYou:  nick === 'zarpa_',
      change: (i % 7 === 0 ? 'up' : i % 5 === 0 ? 'down' : 'same') as 'up' | 'down' | 'same',
    }));
  })();

  readonly filteredPlayers = computed(() => {
    const g = this.gameFilter();
    return (g === 'all' ? this.allPlayers : this.allPlayers.filter(p => p.game === g)).slice(0, 12);
  });

  readonly podium = computed<Array<RankPlayer & { color: string }>>(() => {
    const [p1, p2, p3] = this.allPlayers;
    return [
      { ...p2, rank: 2, color: PODIUM_COLORS[2] },
      { ...p1, rank: 1, color: PODIUM_COLORS[1] },
      { ...p3, rank: 3, color: PODIUM_COLORS[3] },
    ];
  });

  getGame(id: string) { return GAME_BY_ID[id] ?? GAME_BY_ID['valo']; }

  rowHover(e: MouseEvent, isYou: boolean, enter: boolean) {
    if (isYou) return;
    (e.currentTarget as HTMLElement).style.background = enter ? 'var(--hover)' : 'transparent';
  }
}
