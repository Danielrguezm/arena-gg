import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { GAMES, fmtNum, GAME_BY_ID } from '../../../data/mock';
import { RegistrationService } from '../../../core/registration/registration.service';
import { AuthService } from '../../../core/auth/auth.service';
import { TournamentAdminService, TournamentDto } from '../../../core/tournament-admin/tournament-admin.service';
import { BadgeComponent } from '../../../shared/components/badge/badge.component';
import { CoinComponent } from '../../../shared/components/coin/coin.component';
import { EmblemComponent } from '../../../shared/components/emblem/emblem.component';
import { CountdownComponent } from '../../../shared/components/countdown/countdown.component';
import { TokenAmountComponent } from '../../../shared/components/token-amount/token-amount.component';
import { FmtNumPipe } from '../../../shared/pipes/fmt-num.pipe';
import { Tournament } from '../../../data/models';

@Component({
  selector: 'app-tournament-list',
  standalone: true,
  imports: [RouterLink, BadgeComponent, CoinComponent, EmblemComponent, CountdownComponent, TokenAmountComponent, FmtNumPipe],
  template: `
    <div class="page-enter" style="max-width:1320px;margin:0 auto;padding:28px 28px 80px">

      <!-- Header -->
      <div style="display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:28px;gap:18px">
        <div>
          <h1 class="display" style="font-size:36px;font-weight:700;margin:0;letter-spacing:-.02em">Torneos abiertos</h1>
          <div style="color:var(--muted);font-size:13.5px;margin-top:6px">
            <span class="mono" style="color:var(--text)">{{ filtered().length }}</span> {{ filtered().length === 1 ? 'torneo encontrado' : 'torneos encontrados' }}
          </div>
        </div>
        <!-- Sort -->
        <div style="display:flex;gap:8px;align-items:center">
          <span style="color:var(--muted);font-size:12px">Ordenar</span>
          <div style="display:inline-flex;background:var(--bg-2);border:1px solid var(--border);border-radius:10px;padding:3px;gap:2px">
            @for (o of sortOpts; track o.v) {
              <button (click)="sort.set(o.v)" [style.background]="sort()===o.v ? 'var(--elevated)' : 'transparent'" [style.color]="sort()===o.v ? 'var(--text)' : 'var(--muted)'" style="appearance:none;border:0;cursor:pointer;padding:6px 11px;border-radius:7px;font-family:var(--font-body);font-weight:600;font-size:12px;transition:all .15s">{{ o.l }}</button>
            }
          </div>
        </div>
      </div>

      <!-- Filter bar -->
      <div style="background:var(--surface);border:1px solid var(--border-soft);border-radius:14px;padding:14px;display:flex;gap:14px;align-items:center;flex-wrap:wrap;margin-bottom:28px">
        <!-- Search -->
        <div style="display:flex;align-items:center;gap:8px;background:var(--bg-2);border:1px solid var(--border);border-radius:10px;padding:9px 12px;min-width:220px">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color:var(--muted)"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>
          <input [value]="query()" (input)="query.set(asInput($event).value)" placeholder="Buscar torneo…" style="background:transparent;border:0;outline:0;color:var(--text);font-family:var(--font-body);font-size:13px;width:180px">
        </div>

        <div style="width:1px;height:28px;background:var(--border)"></div>

        <!-- Game chips -->
        <div style="display:flex;gap:6px;flex-wrap:wrap;align-items:center">
          <button (click)="gameFilter.set('all')" [style.background]="gameFilter()==='all' ? 'var(--accent-soft)' : 'var(--bg-2)'" [style.color]="gameFilter()==='all' ? 'var(--accent)' : 'var(--text-2)'" [style.border-color]="gameFilter()==='all' ? 'color-mix(in oklch, var(--accent) 40%, transparent)' : 'var(--border)'" style="appearance:none;cursor:pointer;display:inline-flex;align-items:center;gap:6px;background:var(--bg-2);border:1px solid;padding:6px 10px;border-radius:8px;font-family:var(--font-body);font-weight:600;font-size:12px;transition:all .15s">Todos</button>
          @for (g of games; track g.id) {
            <button (click)="gameFilter.set(g.id)" [style.background]="gameFilter()===g.id ? 'var(--accent-soft)' : 'var(--bg-2)'" [style.color]="gameFilter()===g.id ? 'var(--accent)' : 'var(--text-2)'" [style.border-color]="gameFilter()===g.id ? 'color-mix(in oklch, var(--accent) 40%, transparent)' : 'var(--border)'" style="appearance:none;cursor:pointer;display:inline-flex;align-items:center;gap:6px;border:1px solid;padding:6px 10px;border-radius:8px;font-family:var(--font-body);font-weight:600;font-size:12px;transition:all .15s">
              <app-emblem [game]="g.id" [size]="18"/>{{ g.short }}
            </button>
          }
        </div>

        <div style="flex:1"></div>

        <!-- Level -->
        <div style="display:inline-flex;background:var(--bg-2);border:1px solid var(--border);border-radius:10px;padding:3px;gap:2px">
          @for (o of levelOpts; track o.v) {
            <button (click)="levelFilter.set(o.v)" [style.background]="levelFilter()===o.v ? 'var(--elevated)' : 'transparent'" [style.color]="levelFilter()===o.v ? 'var(--text)' : 'var(--muted)'" style="appearance:none;border:0;cursor:pointer;padding:6px 10px;border-radius:7px;font-family:var(--font-body);font-weight:600;font-size:12px;transition:all .15s">{{ o.l }}</button>
          }
        </div>
        <!-- Entry -->
        <div style="display:inline-flex;background:var(--bg-2);border:1px solid var(--border);border-radius:10px;padding:3px;gap:2px">
          @for (o of entryOpts; track o.v) {
            <button (click)="entryFilter.set(o.v)" [style.background]="entryFilter()===o.v ? 'var(--elevated)' : 'transparent'" [style.color]="entryFilter()===o.v ? 'var(--text)' : 'var(--muted)'" style="appearance:none;border:0;cursor:pointer;padding:6px 11px;border-radius:7px;font-family:var(--font-body);font-weight:600;font-size:12px;transition:all .15s">{{ o.l }}</button>
          }
        </div>
      </div>

      <!-- Grid / empty -->
      @if (filtered().length === 0) {
        <div style="margin-top:60px;padding:60px;text-align:center;border:1px dashed var(--border);border-radius:14px;color:var(--muted)">
          <div style="font-size:32px;margin-bottom:8px">◇</div>
          <div style="color:var(--text);font-weight:600;margin-bottom:4px">Sin torneos para esos filtros</div>
          <div style="font-size:13px;margin-bottom:16px">Prueba a quitar alguno o cambiar el juego.</div>
          <button class="btn btn-ghost" (click)="clearFilters()">Limpiar filtros</button>
        </div>
      } @else {
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:18px">
          @for (t of filtered(); track t.id) {
            <article class="holo-tint" style="position:relative;background:var(--surface);border:1px solid var(--border-soft);border-radius:16px;overflow:hidden;display:flex;flex-direction:column;cursor:pointer;transition:transform .2s,border-color .2s,box-shadow .2s"
                     (mouseenter)="hover($event, getGame(t.game).color, true)" (mouseleave)="hover($event, getGame(t.game).color, false)"
                     [routerLink]="['/tournaments', t.id]">
              <!-- Banner -->
              <div [style.background]="'linear-gradient(135deg,' + getGame(t.game).color2 + ',oklch(0.18 0.014 230))'"
                   style="position:relative;height:130px;overflow:hidden;border-bottom:1px solid var(--border-soft)">
                <div aria-hidden style="position:absolute;inset:0;opacity:.35;background-image:radial-gradient(oklch(1 0 0 / .12) 1px, transparent 1px);background-size:16px 16px"></div>
                <div style="position:absolute;right:-16px;top:-16px;opacity:.7;transform:rotate(-8deg)"><app-emblem [game]="t.game" [size]="200"/></div>
                <div style="position:absolute;top:12px;left:14px;display:flex;gap:6px">
                  <app-badge [tone]="t.startsAt <= now ? 'live' : 'default'">{{ t.startsAt <= now ? 'EN VIVO' : getGame(t.game).short }}</app-badge>
                  @if (t.featured) { <app-badge tone="gold">DESTACADO</app-badge> }
                  @if (t.fee === 0 && t.startsAt > now) { <app-badge tone="emerald">GRATIS</app-badge> }
                </div>
                <div style="position:absolute;bottom:14px;left:14px">
                  <div style="font-size:9.5px;color:oklch(0.9 0 0 / .65);letter-spacing:.15em;margin-bottom:4px">PREMIO</div>
                  <div style="display:flex;align-items:baseline;gap:6px"><app-coin [size]="20"/><span class="mono" style="font-size:24px;font-weight:700;color:var(--gold);letter-spacing:-.03em">{{ t.prize | fmtNum }}</span></div>
                </div>
              </div>
              <!-- Body -->
              <div style="padding:18px;display:flex;flex-direction:column;gap:14px;flex:1">
                <div>
                  <div class="mono" style="font-size:10px;color:var(--muted);letter-spacing:.12em;margin-bottom:4px">{{ getGame(t.game).name.toUpperCase() }}</div>
                  <h3 class="display" style="font-size:17px;font-weight:700;margin:0;line-height:1.2;color:var(--text)">{{ t.name }}</h3>
                </div>
                <div style="display:flex;gap:14px;font-size:11.5px;color:var(--muted)">
                  <span>◆ {{ t.format }} · {{ t.mode }}</span><span>⬢ {{ t.level }}</span>
                  @if (t.fee > 0) { <span>◇ <app-token-amount [value]="t.fee" [size]="11" [hideIcon]="true" color="var(--gold)"/> entrada</span> }
                </div>
                <!-- Progress -->
                <div>
                  <div style="display:flex;justify-content:space-between;margin-bottom:6px;font-size:11px">
                    <span style="color:var(--muted);text-transform:uppercase;letter-spacing:.06em">Cupos</span>
                    <span class="mono" [style.color]="isFull(t) ? 'var(--danger)' : 'var(--text)'" style="font-weight:700">{{ t.entries }}/{{ t.max }}</span>
                  </div>
                  <div style="position:relative;height:8px;border-radius:999px;background:var(--bg-2);overflow:hidden;border:1px solid var(--border-soft)">
                    <div [style.width.%]="(t.entries/t.max)*100"
                         [style.background]="isFull(t) ? 'linear-gradient(90deg, var(--danger), oklch(0.55 0.20 25))' : 'linear-gradient(90deg,' + getGame(t.game).color2 + ',' + getGame(t.game).color + ')'"
                         style="position:absolute;left:0;top:0;bottom:0;transition:width .4s ease"></div>
                  </div>
                </div>
                <div style="flex:1"></div>
                <!-- Footer CTA -->
                <div style="display:flex;justify-content:space-between;align-items:center;padding-top:12px;border-top:1px dashed var(--border-soft)">
                  <div>
                    <div style="font-size:9.5px;color:var(--muted);letter-spacing:.12em;text-transform:uppercase;margin-bottom:4px">{{ t.startsAt <= now ? 'Estado' : 'Empieza en' }}</div>
                    <app-countdown [to]="t.startsAt" [compact]="true"/>
                  </div>
                  @if (isFull(t)) {
                    <button class="btn btn-ghost" disabled style="opacity:.6;cursor:not-allowed">Lleno</button>
                  } @else if (reg.isRegistered(t.id)) {
                    <button class="btn" style="background:var(--accent-soft);color:var(--accent);border:1px solid color-mix(in oklch, var(--accent) 35%, transparent);cursor:default">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m5 13 4 4L19 7"/></svg>
                      Inscrito
                    </button>
                  } @else {
                    <button class="btn btn-primary" (click)="register($event, t)" style="min-width:110px;justify-content:center">Apuntarme</button>
                  }
                </div>
              </div>
            </article>
          }
        </div>
      }
    </div>
  `,
})
export class TournamentListComponent implements OnInit {
  readonly reg  = inject(RegistrationService);
  readonly auth = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly apiSvc = inject(TournamentAdminService);

  asInput = (e: Event) => e.target as HTMLInputElement;

  readonly games   = GAMES;
  readonly now     = Date.now();
  readonly fmtNum  = fmtNum;
  readonly loading = signal(true);
  private readonly allTournaments = signal<Tournament[]>([]);

  readonly gameFilter  = signal('all');
  readonly levelFilter = signal('all');
  readonly entryFilter = signal('all');
  readonly sort        = signal('starting');
  readonly query       = signal('');

  readonly sortOpts  = [{ v: 'starting', l: 'Empieza antes' }, { v: 'prize', l: 'Mayor premio' }, { v: 'spots', l: 'Menos cupos' }];
  readonly levelOpts = [{ v: 'all', l: 'Cualquier nivel' }, { v: 'Casual', l: 'Casual' }, { v: 'Intermedio', l: 'Intermedio' }, { v: 'Avanzado', l: 'Avanzado' }];
  readonly entryOpts = [{ v: 'all', l: 'Todos' }, { v: 'free', l: 'Gratis' }, { v: 'paid', l: 'Con entrada' }];

  ngOnInit() {
    this.route.queryParams.subscribe(p => {
      if (p['game']) this.gameFilter.set(p['game']);
      if (p['q']) this.query.set(p['q']);
    });
    this.apiSvc.getAll().subscribe({
      next: ts => {
        this.allTournaments.set(ts.map(t => ({
          id: t.id!,
          game: t.gameId,
          name: t.name,
          prize: t.prize,
          entries: t.entries ?? 0,
          max: t.maxEntries,
          format: t.format,
          mode: t.mode,
          level: (t.level ?? 'Casual') as Tournament['level'],
          startsAt: t.startsAt ? new Date(t.startsAt).getTime() : Date.now(),
          fee: t.fee,
          featured: t.featured,
        })));
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  readonly filtered = computed(() => {
    let list = [...this.allTournaments()];
    const g = this.gameFilter();
    const l = this.levelFilter();
    const e = this.entryFilter();
    const q = this.query().toLowerCase().trim();
    const s = this.sort();

    if (g !== 'all') list = list.filter(t => t.game === g);
    if (l !== 'all') list = list.filter(t => t.level === l);
    if (e === 'free') list = list.filter(t => t.fee === 0);
    if (e === 'paid') list = list.filter(t => t.fee > 0);
    if (q) list = list.filter(t => t.name.toLowerCase().includes(q) || GAME_BY_ID[t.game]?.name.toLowerCase().includes(q));
    if (s === 'starting') list.sort((a, b) => a.startsAt - b.startsAt);
    if (s === 'prize')    list.sort((a, b) => b.prize - a.prize);
    if (s === 'spots')    list.sort((a, b) => (a.max - a.entries) - (b.max - b.entries));
    return list;
  });

  getGame(id: string) { return GAME_BY_ID[id]; }
  isFull(t: Tournament) { return t.full || t.entries >= t.max; }

  hover(e: MouseEvent, color: string, enter: boolean) {
    const el = e.currentTarget as HTMLElement;
    el.style.borderColor = enter ? color : 'var(--border-soft)';
    el.style.transform   = enter ? 'translateY(-3px)' : '';
    el.style.boxShadow   = enter ? `0 14px 32px oklch(0 0 0 / .35), 0 0 0 1px ${color}33` : '';
  }

  register(e: MouseEvent, t: Tournament) {
    e.stopPropagation();
    e.preventDefault();
    this.reg.requestRegistration(t);
  }

  clearFilters() {
    this.gameFilter.set('all');
    this.levelFilter.set('all');
    this.entryFilter.set('all');
    this.query.set('');
  }
}
