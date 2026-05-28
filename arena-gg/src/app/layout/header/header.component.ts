import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { ThemeService } from '../../core/theme/theme.service';
import { CoinComponent } from '../../shared/components/coin/coin.component';
import { FmtNumPipe } from '../../shared/pipes/fmt-num.pipe';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CoinComponent, FmtNumPipe],
  template: `
    <header style="position:sticky;top:0;z-index:50;background:color-mix(in oklch, var(--bg) 82%, transparent);backdrop-filter:blur(18px) saturate(140%);border-bottom:1px solid var(--border-soft)">
      <div style="max-width:1320px;margin:0 auto;padding:14px 28px;display:flex;align-items:center;gap:24px">

        <!-- Logo -->
        <a routerLink="/" style="display:flex;align-items:center;gap:10px;text-decoration:none">
          <div style="width:34px;height:34px;border-radius:9px;background:linear-gradient(135deg, var(--accent) 0%, var(--secondary) 100%);display:grid;place-items:center;box-shadow:0 0 0 1px oklch(1 0 0 / .08) inset, 0 6px 18px color-mix(in oklch, var(--accent) 40%, transparent)">
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path d="M12 2 L22 8 L22 16 L12 22 L2 16 L2 8 Z" fill="none" stroke="var(--accent-ink)" stroke-width="2" stroke-linejoin="round"/>
              <path d="M12 6 L18 10 L12 14 L6 10 Z" fill="var(--accent-ink)"/>
            </svg>
          </div>
          <div style="display:flex;flex-direction:column;align-items:flex-start;line-height:1">
            <span class="display" style="font-size:18px;font-weight:700;color:var(--text)">ARENA<span style="color:var(--accent)">.GG</span></span>
            <span class="mono" style="font-size:9px;color:var(--muted);letter-spacing:.15em;margin-top:2px">TOURNAMENT NETWORK</span>
          </div>
        </a>

        <!-- Nav -->
        <nav style="display:flex;gap:4px;margin-left:16px">
          <a routerLink="/" routerLinkActive="nav-active" [routerLinkActiveOptions]="{exact:true}" class="nav-item">Inicio</a>
          <a routerLink="/tournaments" routerLinkActive="nav-active" class="nav-item">Torneos</a>
          <a routerLink="/store" routerLinkActive="nav-active" class="nav-item">Tienda</a>
          <a routerLink="/ranking" routerLinkActive="nav-active" class="nav-item">Ranking</a>
          @if (auth.isLoggedIn()) {
            <a routerLink="/profile" routerLinkActive="nav-active" class="nav-item">Perfil</a>
          }
        </nav>

        <div style="flex:1"></div>

        <!-- Buscador (decorativo) -->
        <div style="display:flex;align-items:center;gap:8px;background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:8px 12px;min-width:200px;color:var(--muted)">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>
          <input placeholder="Buscar torneos…" style="background:transparent;border:0;outline:0;color:var(--text);font-family:var(--font-body);font-size:13px;width:100%">
          <kbd class="mono" style="font-size:10px;padding:2px 5px;border:1px solid var(--border);border-radius:4px;color:var(--muted)">/</kbd>
        </div>

        <!-- Theme toggle -->
        <button (click)="theme.toggle()"
                style="appearance:none;border:1px solid var(--border);background:var(--surface);cursor:pointer;width:38px;height:38px;border-radius:10px;display:grid;place-items:center;color:var(--text-2)">
          @if (theme.theme() === 'dark') {
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>
          } @else {
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
          }
        </button>

        <!-- Auth area -->
        @if (auth.isLoggedIn()) {
          <div style="display:flex;align-items:center;gap:10px">
            <!-- Tokens pill -->
            <div id="header-tokens" style="display:flex;align-items:center;gap:8px;padding:8px 12px;border-radius:10px;background:var(--gold-soft);border:1px solid color-mix(in oklch, var(--gold) 30%, transparent)">
              <app-coin [size]="16"/>
              <span class="mono" style="color:var(--gold);font-weight:700;font-size:13.5px">{{ auth.tokens() | fmtNum }}</span>
            </div>
            <!-- Avatar -->
            <div style="width:38px;height:38px;border-radius:10px;background:linear-gradient(135deg, oklch(0.55 0.16 280), oklch(0.40 0.18 320));display:grid;place-items:center;color:white;font-family:var(--font-display);font-weight:700;font-size:13px;border:1px solid var(--border);cursor:pointer;position:relative">
              {{ auth.user()?.initials }}
              <span style="position:absolute;right:-2px;bottom:-2px;width:11px;height:11px;border-radius:999px;background:var(--accent);border:2px solid var(--bg)"></span>
            </div>
          </div>
        } @else {
          <div style="display:flex;gap:8px">
            <a routerLink="/login" class="btn btn-ghost" style="padding:10px 14px">Iniciar sesión</a>
            <a routerLink="/login" class="btn btn-primary" style="padding:10px 14px">Crear cuenta</a>
          </div>
        }
      </div>
    </header>
  `,
  styles: [`
    .nav-item {
      appearance: none; border: 0; background: transparent; cursor: pointer;
      font-family: var(--font-body); font-weight: 600; font-size: 13.5px;
      padding: 8px 12px; border-radius: 8px;
      color: var(--muted); position: relative;
      transition: color .15s; text-decoration: none;
      display: inline-block;
    }
    .nav-item:hover { color: var(--text); }
    .nav-active { color: var(--text) !important; }
    .nav-active::after {
      content: ''; position: absolute; left: 12px; right: 12px; bottom: -2px;
      height: 2px; background: var(--accent); border-radius: 2px;
      box-shadow: 0 0 12px var(--accent);
    }
  `],
})
export class HeaderComponent {
  readonly auth  = inject(AuthService);
  readonly theme = inject(ThemeService);
}
