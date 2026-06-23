import { Component, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';
import { SupabaseService } from '../../../core/supabase/supabase.service';
import { TokenAmountComponent } from '../../../shared/components/token-amount/token-amount.component';
import { BadgeComponent } from '../../../shared/components/badge/badge.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink, TokenAmountComponent, BadgeComponent],
  template: `
    <div class="page-enter" style="min-height:calc(100vh - 70px);display:grid;grid-template-columns:1.05fr 1fr;max-width:1320px;margin:0 auto;padding:0 28px;align-items:stretch">

      <!-- IZQUIERDA: branding -->
      <div style="position:relative;overflow:hidden;border-radius:18px;margin:40px 32px 40px 0;background:linear-gradient(160deg, oklch(0.20 0.014 230) 0%, oklch(0.14 0.012 230) 100%);border:1px solid var(--border-soft);padding:48px;display:flex;flex-direction:column;justify-content:space-between;min-height:540px">
        <div aria-hidden style="position:absolute;inset:0;background:radial-gradient(600px 300px at 80% 0%, color-mix(in oklch, var(--accent) 22%, transparent), transparent 60%),radial-gradient(500px 280px at 0% 100%, color-mix(in oklch, var(--secondary) 18%, transparent), transparent 60%);pointer-events:none"></div>
        <div style="position:relative;display:flex;align-items:center;gap:12px">
          <div style="width:40px;height:40px;border-radius:11px;background:linear-gradient(135deg, var(--accent), var(--secondary));display:grid;place-items:center;box-shadow:0 0 0 1px oklch(1 0 0 / .08) inset">
            <svg viewBox="0 0 24 24" width="22" height="22"><path d="M12 2 L22 8 L22 16 L12 22 L2 16 L2 8 Z" fill="none" stroke="var(--accent-ink)" stroke-width="2" stroke-linejoin="round"/><path d="M12 6 L18 10 L12 14 L6 10 Z" fill="var(--accent-ink)"/></svg>
          </div>
          <div class="display" style="font-size:20px;font-weight:700;color:var(--text)">ARENA<span style="color:var(--accent)">.GG</span></div>
        </div>
        <div style="position:relative">
          <app-badge tone="gold">+500 TOKENS DE BIENVENIDA</app-badge>
          <h2 class="display" style="font-size:38px;margin:20px 0 14px;line-height:1.05;font-weight:700;color:var(--text);letter-spacing:-.02em">Tu próxima<br>partida <span style="background:linear-gradient(120deg, var(--accent), oklch(0.85 0.16 165));-webkit-background-clip:text;background-clip:text;color:transparent">vale algo</span>.</h2>
          <p style="color:var(--text-2);font-size:14.5px;line-height:1.55;max-width:360px">Únete a una comunidad de jugadores casuales que ya están convirtiendo sus victorias en skins, merch y experiencias.</p>
        </div>
        <div style="position:relative;display:flex;gap:16px;align-items:center;color:var(--muted);font-size:12px">
          <span style="display:inline-flex;align-items:center;gap:6px"><span style="width:7px;height:7px;border-radius:999px;background:var(--accent);animation:pulseDot 1.5s ease infinite"></span><span class="mono" style="color:var(--text)">12 415</span> online</span>
          <span style="width:1px;height:14px;background:var(--border)"></span>
          <span><span class="mono" style="color:var(--text)">184</span> torneos hoy</span>
          <span style="width:1px;height:14px;background:var(--border)"></span>
          <span><span class="mono" style="color:var(--gold)">2.1M</span> tokens repartidos</span>
        </div>
      </div>

      <!-- DERECHA: formulario -->
      <div style="display:flex;align-items:center;justify-content:center;padding:40px 0">
        <div style="width:100%;max-width:420px;background:var(--surface);border:1px solid var(--border-soft);border-radius:18px;padding:32px;box-shadow:var(--shadow-2)">

          <!-- Tabs -->
          <div style="display:flex;background:var(--bg-2);border:1px solid var(--border);border-radius:10px;padding:3px;margin-bottom:24px">
            <button (click)="mode.set('login')"   [style.background]="mode()==='login'   ? 'var(--elevated)' : 'transparent'"   [style.color]="mode()==='login'   ? 'var(--text)' : 'var(--muted)'" style="flex:1;appearance:none;border:0;cursor:pointer;padding:9px 12px;border-radius:8px;font-family:var(--font-body);font-weight:600;font-size:13px;transition:all .2s">Iniciar sesión</button>
            <button (click)="mode.set('register')" [style.background]="mode()==='register' ? 'var(--elevated)' : 'transparent'" [style.color]="mode()==='register' ? 'var(--text)' : 'var(--muted)'" style="flex:1;appearance:none;border:0;cursor:pointer;padding:9px 12px;border-radius:8px;font-family:var(--font-body);font-weight:600;font-size:13px;transition:all .2s">Crear cuenta</button>
          </div>

          <h1 class="display" style="font-size:26px;margin:0;font-weight:700;color:var(--text);letter-spacing:-.02em">{{ mode() === 'login' ? 'Bienvenido de nuevo' : 'Crea tu arena' }}</h1>
          <p style="color:var(--muted);font-size:13.5px;margin:6px 0 24px;line-height:1.5">
            @if (mode() === 'login') { Vuelve a tus torneos y reclama lo que ganaste. }
            @else { Regístrate gratis y recibe <app-token-amount [value]="500" [size]="12"/> de bienvenida. }
          </p>

          <!-- OAuth buttons -->
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:18px">
            <!-- Discord -->
            <button (click)="loginWithProvider('discord')"
                    [disabled]="oauthLoading() !== null"
                    class="btn btn-ghost"
                    style="justify-content:center;gap:8px;padding:11px 12px;font-size:13px;color:oklch(0.80 0.14 278);border-color:oklch(0.60 0.22 278 / .35);transition:background .15s,border-color .15s"
                    (mouseenter)="asEl($event).style.background='oklch(0.60 0.22 278 / .1)'"
                    (mouseleave)="asEl($event).style.background='transparent'">
              @if (oauthLoading() === 'discord') {
                <span style="width:13px;height:13px;border-radius:999px;border:2px solid currentColor;border-top-color:transparent;display:inline-block;animation:coinSpin .8s linear infinite"></span>
              } @else {
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.317 4.492c-1.53-.69-3.17-1.2-4.885-1.49a.075.075 0 0 0-.079.036c-.21.369-.444.85-.608 1.23a18.566 18.566 0 0 0-5.487 0 12.36 12.36 0 0 0-.617-1.23A.077.077 0 0 0 8.562 3c-1.714.29-3.354.8-4.885 1.491a.07.07 0 0 0-.032.027C.533 9.093-.32 13.555.099 17.961a.08.08 0 0 0 .031.055 20.03 20.03 0 0 0 5.993 2.98.078.078 0 0 0 .084-.026c.462-.62.874-1.275 1.226-1.963.021-.04.001-.088-.041-.104a13.201 13.201 0 0 1-1.872-.878.075.075 0 0 1-.008-.125c.126-.093.252-.19.372-.287a.075.075 0 0 1 .078-.01c3.927 1.764 8.18 1.764 12.061 0a.075.075 0 0 1 .079.009c.12.098.245.195.372.288a.075.075 0 0 1-.006.125c-.598.344-1.22.635-1.873.877a.075.075 0 0 0-.041.105c.36.687.772 1.341 1.225 1.962a.077.077 0 0 0 .084.028 19.963 19.963 0 0 0 6.002-2.981.076.076 0 0 0 .032-.054c.5-5.094-.838-9.52-3.549-13.442a.06.06 0 0 0-.031-.03z"/>
                </svg>
              }
              Discord
            </button>
            <!-- Twitch -->
            <button (click)="loginWithProvider('twitch')"
                    [disabled]="oauthLoading() !== null"
                    class="btn btn-ghost"
                    style="justify-content:center;gap:8px;padding:11px 12px;font-size:13px;color:oklch(0.78 0.18 295);border-color:oklch(0.60 0.25 295 / .35);transition:background .15s,border-color .15s"
                    (mouseenter)="asEl($event).style.background='oklch(0.60 0.25 295 / .1)'"
                    (mouseleave)="asEl($event).style.background='transparent'">
              @if (oauthLoading() === 'twitch') {
                <span style="width:13px;height:13px;border-radius:999px;border:2px solid currentColor;border-top-color:transparent;display:inline-block;animation:coinSpin .8s linear infinite"></span>
              } @else {
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z"/>
                </svg>
              }
              Twitch
            </button>
          </div>

          <div style="display:flex;align-items:center;gap:10px;margin:16px 0;color:var(--muted);font-size:11px">
            <div style="flex:1;height:1px;background:var(--border)"></div>
            <span style="letter-spacing:.15em">O CON EMAIL</span>
            <div style="flex:1;height:1px;background:var(--border)"></div>
          </div>

          <!-- Form -->
          <div style="display:flex;flex-direction:column;gap:14px">
            @if (mode() === 'register') {
              <div>
                <label style="font-size:12px;font-weight:600;color:var(--text-2);display:block;margin-bottom:6px">Nick de jugador</label>
                <input [(ngModel)]="nick" placeholder="zarpa_" class="field-input" [class.error]="touched() && !nick">
                @if (touched() && !nick) { <div style="color:var(--danger);font-size:11.5px;margin-top:5px">⚠ Elige un nick</div> }
              </div>
            }
            <div>
              <label style="font-size:12px;font-weight:600;color:var(--text-2);display:block;margin-bottom:6px">Email</label>
              <input [(ngModel)]="email" type="email" placeholder="tu@email.com" class="field-input" [class.error]="touched() && !email">
              @if (touched() && !email) { <div style="color:var(--danger);font-size:11.5px;margin-top:5px">⚠ Email obligatorio</div> }
            </div>
            <div>
              <label style="font-size:12px;font-weight:600;color:var(--text-2);display:block;margin-bottom:6px">Contraseña</label>
              <div style="position:relative">
                <input [(ngModel)]="password" [type]="showPw() ? 'text' : 'password'" placeholder="••••••••" class="field-input" style="padding-right:40px" [class.error]="touched() && !password">
                <button (click)="showPw.update(v => !v)" style="position:absolute;right:8px;top:50%;transform:translateY(-50%);appearance:none;border:0;background:transparent;color:var(--muted);cursor:pointer;padding:6px">
                  @if (showPw()) { <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22"/></svg> }
                  @else { <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg> }
                </button>
              </div>
            </div>
            @if (mode() === 'register') {
              <div>
                <label style="font-size:12px;font-weight:600;color:var(--text-2);display:block;margin-bottom:6px">Repite contraseña</label>
                <input [(ngModel)]="password2" type="password" placeholder="••••••••" class="field-input" [class.error]="touched() && password !== password2">
                @if (touched() && password !== password2) { <div style="color:var(--danger);font-size:11.5px;margin-top:5px">⚠ No coinciden</div> }
              </div>
              <label style="display:flex;gap:10px;align-items:flex-start;color:var(--text-2);font-size:12.5px;line-height:1.5;cursor:pointer" (click)="agree.update(v => !v)">
                <span [style.border]="agree() ? '1.5px solid var(--accent)' : '1.5px solid var(--border)'" [style.background]="agree() ? 'var(--accent)' : 'transparent'" style="width:18px;height:18px;border-radius:5px;flex-shrink:0;display:grid;place-items:center;margin-top:1px;transition:all .15s">
                  @if (agree()) { <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--accent-ink)" stroke-width="3"><path d="m5 13 4 4L19 7"/></svg> }
                </span>
                Acepto los <a style="color:var(--accent)">términos</a> y la <a style="color:var(--accent)">política de privacidad</a>.
              </label>
            }

            @if (error()) { <div style="padding:10px;border-radius:8px;background:oklch(0.68 0.21 25 / .12);color:var(--danger);font-size:12px">⚠ {{ error() }}</div> }

            <button (click)="submit()" [disabled]="submitting()" class="btn btn-primary" style="width:100%;justify-content:center;padding:14px 18px;margin-top:6px;font-size:14.5px">
              @if (submitting()) {
                <span style="display:inline-block;width:14px;height:14px;border-radius:999px;border:2px solid var(--accent-ink);border-top-color:transparent;animation:coinSpin .8s linear infinite"></span>
                {{ mode() === 'login' ? 'Entrando…' : 'Creando cuenta…' }}
              } @else {
                {{ mode() === 'login' ? 'Entrar' : 'Crear cuenta y entrar' }}
              }
            </button>
            <a routerLink="/" style="color:var(--muted);font-size:12.5px;text-align:center">← Volver a la home</a>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class LoginComponent {
  private readonly authSvc   = inject(AuthService);
  private readonly supabase  = inject(SupabaseService);
  private readonly router    = inject(Router);

  readonly mode        = signal<'login' | 'register'>('login');
  readonly showPw      = signal(false);
  readonly touched     = signal(false);
  readonly submitting  = signal(false);
  readonly oauthLoading = signal<'discord' | 'twitch' | null>(null);
  readonly error       = signal('');
  readonly agree       = signal(false);

  nick      = '';
  email     = '';
  password  = '';
  password2 = '';

  async loginWithProvider(provider: 'discord' | 'twitch'): Promise<void> {
    this.oauthLoading.set(provider);
    this.error.set('');
    try {
      await this.authSvc.loginWithOAuth(provider);
      // Mock mode: navigate home. Real OAuth: browser redirects away automatically.
      if (!this.supabase.isConfigured) this.router.navigate(['/']);
    } catch (e: any) {
      this.error.set(e?.message ?? `Error al conectar con ${provider}`);
      this.oauthLoading.set(null);
    }
  }

  asEl(e: MouseEvent) { return e.currentTarget as HTMLElement; }

  async submit() {
    this.touched.set(true);
    this.error.set('');

    if (!this.email || !this.password) return;
    if (this.mode() === 'register' && (!this.nick || this.password !== this.password2 || !this.agree())) return;

    this.submitting.set(true);
    try {
      if (this.supabase.isConfigured) {
        if (this.mode() === 'login') {
          await this.authSvc.login(this.email, this.password);
        } else {
          await this.authSvc.register(this.email, this.password, this.nick);
        }
      } else {
        // Mock login
        await new Promise(r => setTimeout(r, 800));
        const nick = this.mode() === 'register' ? this.nick : this.email.split('@')[0];
        this.authSvc.mockLogin(this.email, nick, this.mode() === 'register');
      }
      this.router.navigate(['/']);
    } catch (e: any) {
      this.error.set(e?.message ?? 'Error al iniciar sesión');
    } finally {
      this.submitting.set(false);
    }
  }
}
