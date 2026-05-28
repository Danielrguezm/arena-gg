import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { TOURNAMENTS, GAME_BY_ID } from '../../data/mock';
import { BadgeComponent } from '../../shared/components/badge/badge.component';
import { EmblemComponent } from '../../shared/components/emblem/emblem.component';
import { TokenAmountComponent } from '../../shared/components/token-amount/token-amount.component';
import { FmtNumPipe } from '../../shared/pipes/fmt-num.pipe';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [RouterLink, BadgeComponent, EmblemComponent, TokenAmountComponent, FmtNumPipe],
  template: `
    <div class="page-enter" style="max-width:1320px;margin:0 auto;padding:28px 28px 80px">
      @if (!auth.isLoggedIn()) {
        <div style="padding:60px;text-align:center;background:var(--surface);border:1px dashed var(--border);border-radius:18px">
          <div style="font-size:44px;margin-bottom:18px;color:var(--accent)">◆</div>
          <h2 class="display" style="font-size:28px;margin:0;font-weight:700">Inicia sesión para ver tu perfil</h2>
          <p style="color:var(--muted);margin-top:8px;margin-bottom:24px">Aquí verás tus stats, logros y torneos.</p>
          <a routerLink="/login" class="btn btn-primary">Iniciar sesión</a>
        </div>
      } @else {
        <!-- Header card -->
        <div class="holo-tint" style="position:relative;overflow:hidden;border-radius:22px;background:var(--surface);border:1px solid var(--border-soft);padding:32px;margin-bottom:24px;box-shadow:var(--shadow-2)">
          <div aria-hidden style="position:absolute;inset:0;background:radial-gradient(700px 360px at 100% 0%, color-mix(in oklch, var(--accent) 15%, transparent), transparent 60%);pointer-events:none"></div>
          <div style="position:relative;display:flex;align-items:center;gap:24px">
            <div style="width:100px;height:100px;border-radius:22px;background:linear-gradient(135deg, oklch(0.55 0.16 280), oklch(0.40 0.18 320));display:grid;place-items:center;color:white;font-family:var(--font-display);font-weight:700;font-size:36px;border:2px solid var(--accent);box-shadow:0 0 0 4px var(--bg), 0 0 24px var(--accent);position:relative;flex-shrink:0">
              {{ auth.user()?.initials }}
              <span style="position:absolute;right:-4px;bottom:-4px;width:22px;height:22px;border-radius:999px;background:var(--accent);color:var(--accent-ink);display:grid;place-items:center;font-family:var(--font-mono);font-weight:700;font-size:11px;border:3px solid var(--surface)">27</span>
            </div>
            <div style="flex:1;min-width:0">
              <div style="display:flex;gap:10px;margin-bottom:6px">
                <app-badge tone="emerald">CASUAL · LVL 27</app-badge>
                <app-badge tone="gold">VERIFICADO</app-badge>
              </div>
              <h1 class="display" style="font-size:32px;font-weight:700;margin:0;letter-spacing:-.02em">{{ auth.user()?.nick }}</h1>
              <div style="color:var(--muted);font-size:13px;margin-top:6px">Miembro desde S02 · 184 días jugando · <span style="color:var(--accent)">● Online</span></div>
            </div>
            <a routerLink="/tournaments" class="btn btn-ghost">Buscar torneo</a>
          </div>
        </div>

        <!-- Stats -->
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:24px">
          @for (s of stats; track s.l) {
            <div class="holo-tint" style="background:var(--surface);border:1px solid var(--border-soft);border-radius:14px;padding:18px">
              <div style="font-size:11px;color:var(--muted);letter-spacing:.1em;text-transform:uppercase;margin-bottom:8px">{{ s.l }}</div>
              <div class="mono" style="font-size:30px;font-weight:700;color:var(--text);letter-spacing:-.02em">{{ s.v }}</div>
            </div>
          }
        </div>

        <div style="display:grid;grid-template-columns:1.4fr 1fr;gap:24px">
          <!-- Historial -->
          <div class="holo-tint" style="background:var(--surface);border:1px solid var(--border-soft);border-radius:16px;padding:22px">
            <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:16px">
              <h3 class="display" style="font-size:16px;margin:0;font-weight:700;color:var(--text)">Historial reciente</h3>
              <button class="btn btn-ghost" style="padding:6px 12px;font-size:12px">Ver todo →</button>
            </div>
            <div style="display:flex;flex-direction:column;gap:8px">
              @for (t of history; track t.id) {
                <div style="display:grid;grid-template-columns:auto 1fr auto auto;gap:14px;align-items:center;padding:10px 12px;border-radius:10px;background:var(--bg-2);border:1px solid var(--border-soft)">
                  <app-emblem [game]="t.game" [size]="36"/>
                  <div>
                    <div style="font-weight:600;font-size:13.5px;color:var(--text)">{{ t.name }}</div>
                    <div style="font-size:11.5px;color:var(--muted)">{{ getGame(t.game).name }} · hace {{ t.daysAgo }}d</div>
                  </div>
                  <app-badge [tone]="t.result === '1º' ? 'gold' : t.earned > 0 ? 'emerald' : 'default'">{{ t.result }}</app-badge>
                  @if (t.earned > 0) { <app-token-amount [value]="t.earned" [size]="13"/> }
                  @else { <span style="color:var(--muted);font-size:12px">—</span> }
                </div>
              }
            </div>
          </div>

          <!-- Logros -->
          <div class="holo-tint" style="background:var(--surface);border:1px solid var(--border-soft);border-radius:16px;padding:22px">
            <h3 class="display" style="font-size:16px;margin:0 0 16px;font-weight:700;color:var(--text)">Logros</h3>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
              @for (a of achievements; track a.name) {
                <div [style.background]="a.got ? a.color + '14' : 'var(--bg-2)'"
                     [style.border-color]="a.got ? a.color + '66' : 'var(--border-soft)'"
                     [style.opacity]="a.got ? '1' : '.85'"
                     style="padding:14px;border-radius:10px;border:1px solid">
                  <div [style.background]="a.got ? a.color : 'var(--border)'"
                       [style.color]="a.got ? 'oklch(0.10 0 0)' : 'var(--muted)'"
                       style="width:28px;height:28px;border-radius:8px;margin-bottom:8px;display:grid;place-items:center;font-weight:700;font-size:14px">★</div>
                  <div [style.color]="a.got ? 'var(--text)' : 'var(--muted)'" style="font-weight:600;font-size:12.5px;margin-bottom:3px">{{ a.name }}</div>
                  <div style="font-size:11px;color:var(--muted);line-height:1.4">{{ a.desc }}</div>
                  @if (!a.got && a.progress != null) {
                    <div style="margin-top:8px">
                      <div style="height:4px;border-radius:999px;background:var(--bg);overflow:hidden">
                        <div [style.width.%]="a.progress * 100" [style.background]="a.color" style="height:100%"></div>
                      </div>
                      <div class="mono" style="font-size:10px;color:var(--muted);margin-top:4px">{{ (a.progress * 100).toFixed(0) }}%</div>
                    </div>
                  }
                </div>
              }
            </div>
          </div>
        </div>
      }
    </div>
  `,
})
export class ProfileComponent {
  readonly auth = inject(AuthService);

  getGame(id: string) { return GAME_BY_ID[id] ?? GAME_BY_ID['valo']; }

  readonly stats = [
    { l: 'Torneos jugados', v: '47' },
    { l: 'Ratio de victorias', v: '62%' },
    { l: 'Tokens ganados', v: '18.4K' },
    { l: 'Racha actual', v: '5 W' },
  ];

  readonly history = TOURNAMENTS.slice(0, 5).map((t, i) => ({
    ...t,
    result:  ['1º','3º','9-16','1º','DNF'][i],
    earned:  [Math.round(t.prize * 0.5), Math.round(t.prize * 0.10), 0, Math.round(t.prize * 0.5), 0][i],
    daysAgo: i * 4 + 2,
  }));

  readonly achievements = [
    { name: 'Primera sangre',  desc: 'Gana tu primer torneo',         got: true,  color: 'oklch(0.78 0.16 70)',  progress: undefined },
    { name: 'Triple corona',   desc: 'Gana 3 torneos seguidos',       got: true,  color: 'oklch(0.65 0.20 300)', progress: undefined },
    { name: 'Marathonista',    desc: 'Juega 50 torneos',              got: false, color: 'oklch(0.65 0.18 235)', progress: 0.94 },
    { name: 'Millonario',      desc: 'Acumula 100K tokens',           got: false, color: 'oklch(0.78 0.16 70)',  progress: 0.18 },
    { name: 'Top 1%',          desc: 'Top 1% del ranking global',     got: false, color: 'oklch(0.74 0.16 158)', progress: 0.40 },
    { name: 'All-rounder',     desc: 'Gana en 3 juegos distintos',    got: true,  color: 'oklch(0.65 0.20 300)', progress: undefined },
  ];
}
