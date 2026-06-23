import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GAMES, STORE_ITEMS, fmtNum, GAME_BY_ID } from '../../data/mock';
import { RARITY_META } from '../../data/models';
import { AuthService } from '../../core/auth/auth.service';
import { RegistrationService } from '../../core/registration/registration.service';
import { TournamentAdminService } from '../../core/tournament-admin/tournament-admin.service';
import { BadgeComponent } from '../../shared/components/badge/badge.component';
import { CoinComponent } from '../../shared/components/coin/coin.component';
import { EmblemComponent } from '../../shared/components/emblem/emblem.component';
import { CountdownComponent } from '../../shared/components/countdown/countdown.component';
import { TokenAmountComponent } from '../../shared/components/token-amount/token-amount.component';
import { FmtNumPipe } from '../../shared/pipes/fmt-num.pipe';
import { Tournament } from '../../data/models';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, BadgeComponent, CoinComponent, EmblemComponent, CountdownComponent, TokenAmountComponent, FmtNumPipe],
  template: `
    <div class="page-enter" style="max-width:1320px;margin:0 auto;padding:0 28px 80px">

      <!-- HERO -->
      <section style="position:relative;margin-top:18px;margin-bottom:44px;border-radius:var(--radius-lg);overflow:hidden;background:var(--surface);border:1px solid var(--border-soft);min-height:480px;display:grid;grid-template-columns:1.15fr 1fr">
        <div aria-hidden style="position:absolute;inset:0;pointer-events:none;background:radial-gradient(900px 480px at -5% 50%, color-mix(in oklch, var(--secondary) 28%, transparent), transparent 55%),radial-gradient(900px 480px at 105% 50%, color-mix(in oklch, var(--accent) 28%, transparent), transparent 55%)"></div>
        <div aria-hidden style="position:absolute;inset:0;opacity:.18;mix-blend-mode:screen;background-image:linear-gradient(to right, var(--border-soft) 1px, transparent 1px),linear-gradient(to bottom, var(--border-soft) 1px, transparent 1px);background-size:44px 44px"></div>

        <div style="position:relative;padding:56px 56px 48px;display:flex;flex-direction:column;justify-content:center;gap:26px">
          <app-badge tone="emerald">
            <span style="width:6px;height:6px;border-radius:999px;background:var(--accent);box-shadow:0 0 10px var(--accent);display:inline-block"></span>
            NUEVA TEMPORADA · S04
          </app-badge>
          <h1 class="display" style="font-size:clamp(36px,4vw,60px);line-height:1.02;margin:0;color:var(--text);font-weight:700">
            Compite. Gana <span style="background:linear-gradient(120deg, var(--gold), oklch(0.94 0.12 90));-webkit-background-clip:text;background-clip:text;color:transparent">tokens</span>.<br>
            Canjea por lo que <em style="font-style:normal;color:var(--accent)">te flipa</em>.
          </h1>
          <p style="color:var(--text-2);font-size:16px;line-height:1.55;max-width:500px;margin:0">La plataforma de torneos para los que juegan por diversión. Apúntate gratis, gana partidas y llena tu inventario de skins y merch real.</p>
          <div style="display:flex;gap:12px;flex-wrap:wrap">
            <a routerLink="/tournaments" class="btn btn-primary" style="padding:14px 22px;font-size:14.5px">Ver torneos abiertos <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>
            @if (!auth.isLoggedIn()) {
              <a routerLink="/login" class="btn btn-ghost" style="padding:14px 22px;font-size:14.5px">Crear cuenta gratis</a>
            }
          </div>
          <div style="display:flex;gap:28px;color:var(--muted);font-size:12px;align-items:center">
            <div><span class="mono" style="color:var(--text);font-size:18px;font-weight:700;display:block">12.4K</span><span style="font-size:10px;letter-spacing:.1em;text-transform:uppercase">Jugadores online</span></div>
            <div><span class="mono" style="color:var(--text);font-size:18px;font-weight:700;display:block">184</span><span style="font-size:10px;letter-spacing:.1em;text-transform:uppercase">Torneos esta semana</span></div>
            <div><span class="mono" style="color:var(--text);font-size:18px;font-weight:700;display:block">2.1M</span><span style="font-size:10px;letter-spacing:.1em;text-transform:uppercase">Tokens repartidos</span></div>
          </div>
        </div>

        @if (hero(); as h)
        {<div style="position:relative;padding:44px 48px 44px 12px;display:flex;align-items:center">
          <div [style.background]="'linear-gradient(160deg,' + h.g.color2 + ' 0%, oklch(0.18 0.014 230) 75%)'"
               style="position:relative;width:100%;min-height:360px;border-radius:var(--radius);border:1px solid var(--border);padding:24px;overflow:hidden;box-shadow:var(--shadow-2)">
            <div style="position:absolute;right:-40px;top:-40px;opacity:.25;transform:rotate(-12deg)"><app-emblem [game]="h.t.game" [size]="260"/></div>
            <div style="position:relative;display:flex;flex-direction:column;height:100%;gap:16px">
              <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px">
                <div style="display:flex;gap:10px;align-items:center">
                  <app-emblem [game]="h.t.game" [size]="44" [glow]="true"/>
                  <div>
                    <div class="mono" style="font-size:10px;color:oklch(0.9 0 0 / .7);letter-spacing:.15em">{{ h.g.name.toUpperCase() }}</div>
                    <div class="display" style="font-size:20px;font-weight:700;color:white;margin-top:2px">{{ h.t.name }}</div>
                  </div>
                </div>
                <app-badge tone="gold">DESTACADO</app-badge>
              </div>
              <div style="flex:1"></div>
              <div style="padding:18px 20px;border-radius:14px;background:oklch(0 0 0 / .35);backdrop-filter:blur(10px);border:1px solid oklch(1 0 0 / .08)">
                <div style="font-size:11px;color:oklch(0.85 0 0 / .65);letter-spacing:.12em;text-transform:uppercase;margin-bottom:8px">Premio total</div>
                <div style="display:flex;align-items:baseline;gap:8px"><app-coin [size]="26"/><span class="mono" style="font-size:40px;font-weight:700;color:var(--gold);line-height:1;letter-spacing:-.03em">{{ h.t.prize | fmtNum }}</span><span style="color:oklch(0.9 0 0 / .7);font-size:13px;font-weight:600">TOKENS</span></div>
              </div>
              <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px">
                <div style="padding:10px 12px;border-radius:10px;background:oklch(0 0 0 / .3);border:1px solid oklch(1 0 0 / .06)">
                  <div style="font-size:9.5px;color:oklch(0.85 0 0 / .55);letter-spacing:.12em;text-transform:uppercase;margin-bottom:6px">Empieza en</div>
                  <app-countdown [to]="h.t.startsAt" [compact]="true"/>
                </div>
                <div style="padding:10px 12px;border-radius:10px;background:oklch(0 0 0 / .3);border:1px solid oklch(1 0 0 / .06)">
                  <div style="font-size:9.5px;color:oklch(0.85 0 0 / .55);letter-spacing:.12em;text-transform:uppercase;margin-bottom:6px">Cupos</div>
                  <span class="mono" style="color:white;font-size:16px;font-weight:700">{{ h.t.entries }}/{{ h.t.max }}</span>
                </div>
                <div style="padding:10px 12px;border-radius:10px;background:oklch(0 0 0 / .3);border:1px solid oklch(1 0 0 / .06)">
                  <div style="font-size:9.5px;color:oklch(0.85 0 0 / .55);letter-spacing:.12em;text-transform:uppercase;margin-bottom:6px">Formato</div>
                  <span style="color:white;font-size:12px;font-weight:600">{{ h.t.format }} · {{ h.t.mode }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>}
      </section>

      <!-- LIVE BANNER -->
      <div style="margin-bottom:32px;padding:10px 16px;display:flex;align-items:center;gap:14px;overflow:hidden;background:var(--surface);border:1px solid var(--border-soft);border-radius:12px">
        <app-badge tone="live">EN VIVO AHORA</app-badge>
        <div style="flex:1;overflow:hidden;position:relative;height:18px">
          <div style="display:flex;gap:32px;position:absolute;white-space:nowrap;animation:ticker 38s linear infinite;font-size:12.5px;color:var(--text-2)">
            @for (item of tickerItems; track $index) { <span>· {{ item }}</span> }
          </div>
        </div>
      </div>

      <!-- JUEGOS -->
      <section style="margin-bottom:48px">
        <div style="display:flex;align-items:flex-end;justify-content:space-between;margin-bottom:18px">
          <div>
            <h2 class="display" style="font-size:22px;font-weight:700;margin:0;color:var(--text);letter-spacing:-.02em">Juegos en plataforma</h2>
            <div style="font-size:12.5px;color:var(--muted);margin-top:4px">{{ games.length }} títulos activos</div>
          </div>
        </div>
        <div style="display:grid;grid-template-columns:repeat(6,1fr);gap:14px">
          @for (g of games; track g.id) {
            <a [routerLink]="['/tournaments']" [queryParams]="{game: g.id}"
               style="display:flex;flex-direction:column;gap:14px;border:1px solid var(--border-soft);background:var(--surface);border-radius:14px;padding:18px;cursor:pointer;text-decoration:none;color:var(--text);transition:transform .2s,border-color .2s"
               (mouseenter)="cardHover($event, g.color, true)" (mouseleave)="cardHover($event, g.color, false)">
              <app-emblem [game]="g.id" [size]="52"/>
              <div><div class="display" style="font-size:14px;font-weight:700">{{ g.short }}</div><div style="font-size:11.5px;color:var(--muted);margin-top:2px">{{ g.tag }}</div></div>
              <div style="display:flex;justify-content:space-between;align-items:center">
                <div class="mono" style="font-size:11px;color:var(--muted)"><span style="display:inline-block;width:6px;height:6px;border-radius:999px;background:var(--accent);margin-right:6px;animation:pulseDot 1.5s ease infinite"></span>{{ g.activePlayers | fmtNum }}</div>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color:var(--muted)"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
              </div>
            </a>
          }
        </div>
      </section>

      <!-- TORNEOS DESTACADOS -->
      <section style="margin-bottom:48px">
        <div style="display:flex;align-items:flex-end;justify-content:space-between;margin-bottom:18px">
          <div><h2 class="display" style="font-size:22px;font-weight:700;margin:0;color:var(--text);letter-spacing:-.02em">Torneos destacados</h2><div style="font-size:12.5px;color:var(--muted);margin-top:4px">Empiezan pronto · Plazas limitadas</div></div>
          <a routerLink="/tournaments" class="btn btn-ghost" style="padding:8px 14px;font-size:13px">Ver todos →</a>
        </div>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:18px">
          @for (t of featured(); track t.id) {
            <article class="holo-tint" style="position:relative;background:var(--surface);border:1px solid var(--border-soft);border-radius:16px;overflow:hidden;display:flex;flex-direction:column;cursor:pointer;transition:transform .2s,border-color .2s,box-shadow .2s"
                     (mouseenter)="cardHover($event, getGame(t.game).color, true)" (mouseleave)="cardHover($event, getGame(t.game).color, false)"
                     [routerLink]="['/tournaments', t.id]">
              <!-- Banner -->
              <div [style.background]="'linear-gradient(135deg,' + getGame(t.game).color2 + ',oklch(0.18 0.014 230))'"
                   style="position:relative;height:130px;overflow:hidden;border-bottom:1px solid var(--border-soft)">
                <div aria-hidden style="position:absolute;inset:0;opacity:.35;background-image:radial-gradient(oklch(1 0 0 / .12) 1px, transparent 1px);background-size:16px 16px"></div>
                <div style="position:absolute;right:-16px;top:-16px;opacity:.7;transform:rotate(-8deg)"><app-emblem [game]="t.game" [size]="200"/></div>
                <div style="position:absolute;top:12px;left:14px;display:flex;gap:6px">
                  <app-badge [tone]="t.fee === 0 ? 'emerald' : 'default'">{{ t.fee === 0 ? 'GRATIS' : getGame(t.game).short }}</app-badge>
                  @if (t.featured) { <app-badge tone="gold">DESTACADO</app-badge> }
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
                </div>
                <div>
                  <div style="display:flex;justify-content:space-between;margin-bottom:6px;font-size:11px">
                    <span style="color:var(--muted);text-transform:uppercase;letter-spacing:.06em">Cupos</span>
                    <span class="mono" style="font-weight:700;color:var(--text)">{{ t.entries }}/{{ t.max }}</span>
                  </div>
                  <div style="position:relative;height:8px;border-radius:999px;background:var(--bg-2);overflow:hidden;border:1px solid var(--border-soft)">
                    <div [style.width.%]="(t.entries/t.max)*100"
                         [style.background]="'linear-gradient(90deg,' + getGame(t.game).color2 + ',' + getGame(t.game).color + ')'"
                         style="position:absolute;left:0;top:0;bottom:0;transition:width .4s ease"></div>
                  </div>
                </div>
                <div style="flex:1"></div>
                <div style="display:flex;justify-content:space-between;align-items:center;padding-top:12px;border-top:1px dashed var(--border-soft)">
                  <div>
                    <div style="font-size:9.5px;color:var(--muted);letter-spacing:.12em;text-transform:uppercase;margin-bottom:4px">Empieza en</div>
                    <app-countdown [to]="t.startsAt" [compact]="true"/>
                  </div>
                  <button class="btn btn-primary" (click)="register($event, t)" style="min-width:110px;justify-content:center">Apuntarme</button>
                </div>
              </div>
            </article>
          }
        </div>
      </section>

      <!-- TIENDA TEASER -->
      <section style="margin-bottom:48px">
        <div style="display:flex;align-items:flex-end;justify-content:space-between;margin-bottom:18px">
          <div><h2 class="display" style="font-size:22px;font-weight:700;margin:0;color:var(--text);letter-spacing:-.02em">Canjea tus tokens</h2><div style="font-size:12.5px;color:var(--muted);margin-top:4px">Tienda de skins, merch y gift cards</div></div>
          <a routerLink="/store" class="btn btn-ghost" style="padding:8px 14px;font-size:13px">Ver tienda →</a>
        </div>
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:14px">
          @for (item of storeTeaser; track item.id) {
            <a routerLink="/store" class="holo-tint"
               style="background:var(--surface);border:1px solid var(--border-soft);border-radius:16px;overflow:hidden;display:flex;flex-direction:column;text-decoration:none;transition:transform .2s,border-color .2s"
               (mouseenter)="cardHover($event, rarMeta(item.rarity).color, true)"
               (mouseleave)="cardHover($event, rarMeta(item.rarity).color, false)">
              <!-- Art slot -->
              <div style="position:relative;height:160px;border-bottom:1px solid var(--border-soft);overflow:hidden;background:linear-gradient(135deg,oklch(0.18 0.02 260),oklch(0.22 0.02 230))">
                <img [src]="item.image" [alt]="item.name"
                     style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:1">
                <div style="position:absolute;inset:0;z-index:2;background:linear-gradient(to top,oklch(0 0 0/.35) 0%,transparent 60%)"></div>
                <div style="position:absolute;top:10px;left:10px;z-index:3">
                  <span [style.background]="rarMeta(item.rarity).color + '30'"
                        [style.color]="rarMeta(item.rarity).color"
                        [style.border-color]="rarMeta(item.rarity).color + '66'"
                        style="display:inline-flex;padding:3px 8px;border-radius:999px;border:1px solid;font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;backdrop-filter:blur(4px)">
                    {{ rarMeta(item.rarity).label }}
                  </span>
                </div>
              </div>
              <!-- Info -->
              <div style="padding:14px 16px;display:flex;justify-content:space-between;align-items:center;gap:8px">
                <div style="min-width:0">
                  <div style="font-weight:600;font-size:13.5px;color:var(--text);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">{{ item.name }}</div>
                  <div style="font-size:11px;color:var(--muted);margin-top:2px">{{ catLabel(item) }}</div>
                </div>
                <app-token-amount [value]="item.cost" [size]="13"/>
              </div>
            </a>
          }
        </div>
      </section>

      <!-- FOOTER -->
      <footer style="margin-top:60px;padding:28px 0;border-top:1px solid var(--border-soft);display:flex;justify-content:space-between;align-items:center;color:var(--muted);font-size:12px">
        <div>© 2026 Arena.gg · Plataforma de torneos eSports</div>
        <div style="display:flex;gap:18px"><span>Términos</span><span>Privacidad</span><span>Reglas</span><span>Discord</span></div>
      </footer>
    </div>
  `,
})
export class HomeComponent implements OnInit {
  readonly auth    = inject(AuthService);
  readonly reg     = inject(RegistrationService);
  private readonly apiSvc = inject(TournamentAdminService);

  readonly games       = GAMES;
  readonly fmtNum      = fmtNum;
  readonly storeTeaser = STORE_ITEMS.filter(i => !!i.image).slice(0, 4);

  private readonly allTournaments = signal<Tournament[]>([]);

  readonly featured = computed(() => this.allTournaments().filter(t => t.featured).slice(0, 3));

  readonly hero = computed(() => {
    const list = this.allTournaments();
    const t = list.find(x => x.featured) ?? list[0];
    if (!t) return null;
    return { t, g: GAME_BY_ID[t.game] };
  });

  ngOnInit() {
    this.apiSvc.getAll().subscribe({
      next: ts => this.allTournaments.set(ts.map(t => ({
        id: t.id!,
        game: t.gameId,
        name: t.name,
        prize: t.prize,
        entries: 0,
        max: t.maxEntries,
        format: t.format,
        mode: t.mode,
        level: (t.level ?? 'Casual') as Tournament['level'],
        startsAt: t.startsAt ? new Date(t.startsAt).getTime() : Date.now(),
        fee: t.fee,
        featured: t.featured,
      }))),
    });
  }

  readonly tickerItems = [
    'FNX vs DRAGON COILS — CS2 Smoke & Mirrors · MAPA 2',
    'Crown Rush · 8ª semifinal · zarpa_ vs vinky17',
    'ARAM Madness se llena: 14/64 inscritos',
    'Aerial Madness empieza en 45 min — quedan 13 cupos',
    'Night Ops Cup: top seed eliminado',
    '+18 500 tokens repartidos en la última hora',
    'FNX vs DRAGON COILS — CS2 Smoke & Mirrors · MAPA 2',
    'Crown Rush · 8ª semifinal · zarpa_ vs vinky17',
  ];

  getGame(id?: string) { return id ? (GAME_BY_ID[id] ?? GAME_BY_ID['valo']) : GAME_BY_ID['valo']; }
  rarMeta(r: string)   { return RARITY_META[r as keyof typeof RARITY_META]; }
  heroColor() { return this.hero()?.g?.color2 ?? 'oklch(0.18 0.014 230)'; }

  catLabel(item: any): string {
    if (item.game) return GAME_BY_ID[item.game]?.name ?? '';
    if (item.cat === 'merch')    return 'Merchandising oficial';
    if (item.cat === 'giftcard') return 'Gift card digital';
    return 'Pase de batalla';
  }

  cardHover(e: MouseEvent, color: string, enter: boolean) {
    const el = e.currentTarget as HTMLElement;
    el.style.borderColor = enter ? color : 'var(--border-soft)';
    el.style.transform   = enter ? 'translateY(-2px)' : '';
  }

  register(e: MouseEvent, t: Tournament) {
    e.stopPropagation();
    e.preventDefault();
    this.reg.requestRegistration(t);
  }
}
