import { Component, inject, input, computed, signal, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { fmtNum, GAME_BY_ID } from '../../../data/mock';
import { RegistrationService } from '../../../core/registration/registration.service';
import { AuthService } from '../../../core/auth/auth.service';
import { TournamentAdminService } from '../../../core/tournament-admin/tournament-admin.service';
import { Tournament } from '../../../data/models';
import { BadgeComponent } from '../../../shared/components/badge/badge.component';
import { CoinComponent } from '../../../shared/components/coin/coin.component';
import { EmblemComponent } from '../../../shared/components/emblem/emblem.component';
import { CountdownComponent } from '../../../shared/components/countdown/countdown.component';
import { TokenAmountComponent } from '../../../shared/components/token-amount/token-amount.component';
import { FmtNumPipe } from '../../../shared/pipes/fmt-num.pipe';

@Component({
  selector: 'app-tournament-detail',
  standalone: true,
  imports: [RouterLink, BadgeComponent, CoinComponent, EmblemComponent, CountdownComponent, TokenAmountComponent, FmtNumPipe],
  template: `
    <div class="page-enter" style="max-width:1320px;margin:0 auto;padding:28px 28px 80px">

      <!-- Breadcrumb -->
      <a routerLink="/tournaments" style="display:inline-flex;align-items:center;gap:6px;color:var(--muted);font-size:13px;margin-bottom:18px;text-decoration:none">← Volver a torneos</a>

      @if (tournament(); as t) {
        <!-- Hero banner -->
        <div class="holo-tint"
             [style.background]="'linear-gradient(135deg,' + game().color2 + ',oklch(0.18 0.014 230))'"
             style="position:relative;overflow:hidden;border-radius:22px;padding:32px;border:1px solid var(--border-soft);min-height:260px;display:flex;flex-direction:column;justify-content:space-between;box-shadow:var(--shadow-2);margin-bottom:24px">
          <div aria-hidden style="position:absolute;right:-40px;top:-40px;opacity:.3;transform:rotate(-12deg)"><app-emblem [game]="t.game" [size]="340"/></div>
          <div aria-hidden style="position:absolute;inset:0;opacity:.22;background-image:radial-gradient(oklch(1 0 0 / .14) 1px, transparent 1px);background-size:20px 20px;pointer-events:none"></div>

          <div style="position:relative;display:flex;justify-content:space-between;align-items:flex-start;gap:16px">
            <div style="display:flex;gap:16px;align-items:center">
              <app-emblem [game]="t.game" [size]="64" [glow]="true"/>
              <div>
                <div style="display:flex;gap:8px;margin-bottom:8px">
                  @if (t.featured) { <app-badge tone="gold">DESTACADO</app-badge> }
                  @if (t.fee === 0) { <app-badge tone="emerald">GRATIS</app-badge> }
                  <app-badge>{{ game().name }}</app-badge>
                </div>
                <h1 class="display" style="font-size:38px;margin:0;font-weight:700;color:white;letter-spacing:-.02em">{{ t.name }}</h1>
                <div style="margin-top:8px;color:oklch(0.92 0 0 / .8);font-size:14px">{{ t.format }} · {{ t.mode }} · Nivel <strong>{{ t.level }}</strong></div>
              </div>
            </div>
          </div>

          <div style="position:relative;display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-top:28px">
            <div style="padding:14px;border-radius:12px;background:oklch(0 0 0 / .35);backdrop-filter:blur(8px);border:1px solid oklch(1 0 0 / .08)">
              <div style="font-size:10px;color:oklch(0.85 0 0 / .65);letter-spacing:.12em;text-transform:uppercase;margin-bottom:8px">Premio total</div>
              <div style="display:flex;align-items:baseline;gap:6px"><app-coin [size]="20"/><span class="mono" style="color:var(--gold);font-size:22px;font-weight:700;letter-spacing:-.02em">{{ t.prize | fmtNum }}</span></div>
            </div>
            <div style="padding:14px;border-radius:12px;background:oklch(0 0 0 / .35);backdrop-filter:blur(8px);border:1px solid oklch(1 0 0 / .08)">
              <div style="font-size:10px;color:oklch(0.85 0 0 / .65);letter-spacing:.12em;text-transform:uppercase;margin-bottom:8px">Empieza en</div>
              <app-countdown [to]="t.startsAt" [compact]="true"/>
            </div>
            <div style="padding:14px;border-radius:12px;background:oklch(0 0 0 / .35);backdrop-filter:blur(8px);border:1px solid oklch(1 0 0 / .08)">
              <div style="font-size:10px;color:oklch(0.85 0 0 / .65);letter-spacing:.12em;text-transform:uppercase;margin-bottom:8px">Inscritos</div>
              <span class="mono" style="color:white;font-size:22px;font-weight:700">{{ t.entries }}/{{ t.max }}</span>
            </div>
            <div style="padding:14px;border-radius:12px;background:oklch(0 0 0 / .35);backdrop-filter:blur(8px);border:1px solid oklch(1 0 0 / .08)">
              <div style="font-size:10px;color:oklch(0.85 0 0 / .65);letter-spacing:.12em;text-transform:uppercase;margin-bottom:8px">Entrada</div>
              @if (t.fee > 0) { <div style="display:flex;align-items:baseline;gap:6px"><app-coin [size]="16"/><span class="mono" style="color:var(--gold);font-size:18px;font-weight:700">{{ t.fee | fmtNum }}</span></div> }
              @else { <span style="color:var(--accent);font-weight:700;font-size:18px">GRATIS</span> }
            </div>
          </div>
        </div>

        <!-- Body grid -->
        <div style="display:grid;grid-template-columns:1.6fr 1fr;gap:24px">
          <div style="display:flex;flex-direction:column;gap:24px">
            <!-- Bracket -->
            <div class="holo-tint" style="background:var(--surface);border:1px solid var(--border-soft);border-radius:16px;padding:22px">
              <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:16px">
                <h3 class="display" style="font-size:16px;margin:0;font-weight:700;color:var(--text)">Bracket</h3>
                <app-badge tone="live">RONDA 1 EN VIVO</app-badge>
              </div>
              <div style="display:flex;gap:18px;overflow-x:auto;padding-bottom:4px">
                @for (round of bracket; track $index; let ri = $index) {
                  <div style="display:flex;flex-direction:column;gap:12px;min-width:200px;flex:1">
                    <div class="mono" style="font-size:10px;color:var(--muted);letter-spacing:.15em">{{ ri === bracket.length - 1 ? 'FINAL' : 'RONDA ' + (ri + 1) }}</div>
                    @for (match of round; track $index) {
                      <div [style.border-color]="match.status === 'live' ? 'var(--danger)' : 'var(--border-soft)'"
                           [style.box-shadow]="match.status === 'live' ? '0 0 0 1px oklch(0.68 0.21 25 / .25), 0 0 18px oklch(0.68 0.21 25 / .20)' : 'none'"
                           style="background:var(--bg-2);border:1px solid;border-radius:10px;position:relative">
                        @if (match.status === 'live') {
                          <div style="position:absolute;top:6px;left:10px;z-index:1"><app-badge tone="live">EN VIVO</app-badge></div>
                        }
                        @for (row of [0,1]; track row) {
                          <div [style.border-top]="row === 1 ? '1px solid var(--border-soft)' : 'none'"
                               [style.background]="(row === 0 ? match.aWon : match.bWon) ? 'var(--accent-soft)' : 'transparent'"
                               [style.margin-top]="row === 0 && match.status === 'live' ? '28px' : '0'"
                               style="display:flex;justify-content:space-between;align-items:center;padding:9px 10px;border-radius:inherit">
                            <span [style.color]="(row === 0 ? match.a : match.b) === null ? 'var(--dim)' : ((row === 0 ? match.aWon : match.bWon) ? 'var(--accent)' : 'var(--text-2)')"
                                  [style.font-weight]="(row === 0 ? match.aWon : match.bWon) ? '700' : '500'"
                                  style="font-size:12px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:140px">
                              {{ (row === 0 ? match.a : match.b) ?? '—' }}
                            </span>
                            <span class="mono" [style.color]="(row === 0 ? match.aWon : match.bWon) ? 'var(--accent)' : 'var(--muted)'" style="font-size:12px;font-weight:700">
                              {{ match.status === 'done' ? (row === 0 ? match.aw : match.bw) : (match.status === 'live' ? '—' : '') }}
                            </span>
                          </div>
                        }
                      </div>
                    }
                  </div>
                }
              </div>
            </div>

            <!-- Rules -->
            <div class="holo-tint" style="background:var(--surface);border:1px solid var(--border-soft);border-radius:16px;padding:22px">
              <h3 class="display" style="font-size:16px;margin:0 0 16px;font-weight:700;color:var(--text)">Reglas del torneo</h3>
              <ul style="padding-left:20px;margin:0;display:flex;flex-direction:column;gap:8px;color:var(--text-2);font-size:13.5px;line-height:1.6">
                <li>Formato {{ t.mode }}, eliminación a {{ t.format === '1v1' ? 'doble' : 'simple' }}.</li>
                <li>Cada partida tiene un máximo de 25 minutos. Si hay empate, se decide en muerte súbita.</li>
                <li>Está prohibido el uso de cuentas alternativas (smurfs). Verificamos rango por API del juego.</li>
                <li>El check-in se abre 15 min antes del inicio. Si no haces check-in, pierdes tu plaza.</li>
                <li>Los reportes de cheating se revisan en menos de 24h. La decisión del staff es final.</li>
              </ul>
            </div>

            <!-- Players -->
            <div class="holo-tint" style="background:var(--surface);border:1px solid var(--border-soft);border-radius:16px;padding:22px">
              <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:16px">
                <h3 class="display" style="font-size:16px;margin:0;font-weight:700;color:var(--text)">Inscritos ({{ t.entries }})</h3>
                <button class="btn btn-ghost" style="padding:6px 12px;font-size:12px">Ver todos →</button>
              </div>
              <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px">
                @for (p of playersList(t.entries); track p.nick) {
                  <div [style.background]="p.isYou ? 'var(--accent-soft)' : 'var(--bg-2)'"
                       [style.border-color]="p.isYou ? 'color-mix(in oklch, var(--accent) 35%, transparent)' : 'var(--border-soft)'"
                       style="display:flex;align-items:center;gap:8px;padding:8px 10px;border-radius:8px;border:1px solid">
                    <div [style.background]="'linear-gradient(135deg, oklch(0.55 0.18 ' + p.hue + '), oklch(0.40 0.20 ' + (p.hue+80) + '))'"
                         style="width:28px;height:28px;border-radius:7px;flex-shrink:0;display:grid;place-items:center;color:white;font-family:var(--font-display);font-weight:700;font-size:10px">{{ p.nick.slice(0,2).toUpperCase() }}</div>
                    <div style="min-width:0;flex:1">
                      <div [style.color]="p.isYou ? 'var(--accent)' : 'var(--text)'" style="font-size:12px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">{{ p.nick }}{{ p.isYou ? ' (TÚ)' : '' }}</div>
                      <div class="mono" style="font-size:10px;color:var(--muted)">lvl {{ p.lvl }}</div>
                    </div>
                  </div>
                }
              </div>
            </div>
          </div>

          <!-- Right column -->
          <div style="display:flex;flex-direction:column;gap:24px">
            <!-- CTA sticky -->
            <div class="holo-tint" style="background:var(--surface);border:1px solid var(--border-soft);border-radius:16px;padding:24px;position:sticky;top:96px">
              <div style="font-size:11px;color:var(--muted);letter-spacing:.12em;text-transform:uppercase;margin-bottom:10px">Tu plaza</div>
              <div style="padding:14px;border-radius:10px;background:var(--bg-2);border:1px solid var(--border-soft);margin-bottom:16px">
                <div style="display:flex;justify-content:space-between;font-size:11px;margin-bottom:8px">
                  <span style="color:var(--muted);letter-spacing:.06em;text-transform:uppercase">Cupos restantes</span>
                  <span class="mono" [style.color]="isFull(t) ? 'var(--danger)' : 'var(--text)'" style="font-weight:700">{{ t.max - t.entries }}</span>
                </div>
                <div style="height:8px;border-radius:999px;background:var(--bg);overflow:hidden;border:1px solid var(--border-soft)">
                  <div [style.width.%]="(t.entries/t.max)*100"
                       [style.background]="isFull(t) ? 'linear-gradient(90deg, var(--danger), oklch(0.55 0.20 25))' : 'linear-gradient(90deg,' + game().color2 + ',' + game().color + ')'"
                       style="height:100%"></div>
                </div>
              </div>

              @if (isFull(t)) {
                <button class="btn btn-ghost" disabled style="width:100%;justify-content:center;opacity:.6">Torneo lleno</button>
              } @else if (reg.isRegistered(t.id)) {
                <button class="btn" style="width:100%;justify-content:center;background:var(--accent-soft);color:var(--accent);border:1px solid color-mix(in oklch, var(--accent) 35%, transparent)">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m5 13 4 4L19 7"/></svg>
                  Inscrito
                </button>
              } @else {
                <button class="btn btn-primary" (click)="register(t)" style="width:100%;justify-content:center;padding:14px 18px;font-size:14.5px">
                  @if (t.fee > 0) { Inscribirme · <app-token-amount [value]="t.fee" [size]="13" color="inherit"/> }
                  @else { Inscribirme gratis }
                </button>
              }

              <div style="margin-top:14px;font-size:11.5px;color:var(--muted);text-align:center;line-height:1.5">Recibirás una notificación 15 min antes del check-in.</div>
            </div>

            <!-- Prize distribution -->
            <div class="holo-tint" style="background:var(--surface);border:1px solid var(--border-soft);border-radius:16px;padding:22px">
              <h3 class="display" style="font-size:16px;margin:0 0 16px;font-weight:700;color:var(--text)">Reparto del premio</h3>
              <div style="display:flex;flex-direction:column;gap:8px">
                @for (r of prizeRows(t.prize); track r.p) {
                  <div [style.background]="r.i === 0 ? 'var(--gold-soft)' : 'var(--bg-2)'"
                       [style.border-color]="r.i === 0 ? 'color-mix(in oklch, var(--gold) 35%, transparent)' : 'var(--border-soft)'"
                       style="display:flex;justify-content:space-between;align-items:center;padding:10px 12px;border-radius:8px;border:1px solid">
                    <span [style.color]="r.i === 0 ? 'var(--gold)' : 'var(--text)'" style="font-weight:600;font-size:13px">{{ r.p }}</span>
                    <app-token-amount [value]="r.v" [size]="13"/>
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
      } @else {
        <div style="text-align:center;padding:80px;color:var(--muted)">Torneo no encontrado.</div>
      }
    </div>
  `,
})
export class TournamentDetailComponent implements OnInit {
  readonly reg    = inject(RegistrationService);
  readonly auth   = inject(AuthService);
  private readonly router  = inject(Router);
  private readonly apiSvc  = inject(TournamentAdminService);

  id = input<string>('');

  private readonly _tournament = signal<Tournament | null>(null);
  readonly tournament = computed(() => this._tournament());
  readonly game       = computed(() => GAME_BY_ID[this._tournament()?.game ?? ''] ?? GAME_BY_ID['valo']);

  ngOnInit() {
    this.apiSvc.getById(this.id()).subscribe({
      next: dto => this._tournament.set({
        id: dto.id!,
        game: dto.gameId,
        name: dto.name,
        prize: dto.prize,
        entries: dto.entries ?? 0,
        max: dto.maxEntries,
        format: dto.format,
        mode: dto.mode,
        level: (dto.level ?? 'Casual') as Tournament['level'],
        startsAt: dto.startsAt ? new Date(dto.startsAt).getTime() : Date.now(),
        fee: dto.fee,
        featured: dto.featured,
      }),
      error: () => this._tournament.set(null),
    });
  }


  readonly bracket = [
    [
      { a: 'NUEVOS LOBOS', b: 'FNX',         aw: 2,    bw: 1,    aWon: true,  bWon: false, status: 'done' },
      { a: 'DRAGON COILS', b: 'BLITZ',        aw: 0,    bw: 2,    aWon: false, bWon: true,  status: 'done' },
      { a: 'SOLARIS',      b: 'ZNTRX',        aw: null, bw: null, aWon: false, bWon: false, status: 'live' },
      { a: 'HYDRA',        b: 'KILO9',        aw: null, bw: null, aWon: false, bWon: false, status: 'soon' },
    ],
    [
      { a: 'NUEVOS LOBOS', b: 'BLITZ', aw: null, bw: null, aWon: false, bWon: false, status: 'soon' },
      { a: null,           b: null,    aw: null, bw: null, aWon: false, bWon: false, status: 'tbd'  },
    ],
    [
      { a: null, b: null, aw: null, bw: null, aWon: false, bWon: false, status: 'tbd' },
    ],
  ];

  isFull(t: any) { return t.full || t.entries >= t.max; }

  prizeRows(prize: number) {
    return [
      { i: 0, p: '🥇 1º',    v: Math.round(prize * 0.50)   },
      { i: 1, p: '🥈 2º',    v: Math.round(prize * 0.25)   },
      { i: 2, p: '🥉 3º–4º', v: Math.round(prize * 0.10)   },
      { i: 3, p: '5º–8º',    v: Math.round(prize * 0.0375) },
    ];
  }

  playersList(entries: number) {
    const names = ['zarpa_','vinky17','NUEVOS_LOBOS','kilo9','brawn','frostbyte','sn0wy','drago','sliver','g0nzo','whiskey','tessa','b00m','kr1z','jin','valo_main'];
    return Array.from({ length: Math.min(entries, 16) }).map((_, i) => ({
      nick:  names[i % names.length],
      lvl:   10 + (i * 7 % 40),
      isYou: i === 4,
      hue:   (i * 47) % 360,
    }));
  }

  register(t: any) { this.reg.requestRegistration(t); }
}
