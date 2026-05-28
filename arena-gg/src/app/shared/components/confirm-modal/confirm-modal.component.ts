import { Component, inject } from '@angular/core';
import { RegistrationService } from '../../../core/registration/registration.service';
import { AuthService } from '../../../core/auth/auth.service';
import { GAME_BY_ID } from '../../../data/mock';
import { BadgeComponent } from '../badge/badge.component';
import { CountdownComponent } from '../countdown/countdown.component';
import { TokenAmountComponent } from '../token-amount/token-amount.component';
import { FmtNumPipe } from '../../pipes/fmt-num.pipe';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [BadgeComponent, CountdownComponent, TokenAmountComponent, FmtNumPipe],
  template: `
    @if (reg.pending(); as t) {
      <div (click)="reg.cancelRegistration()"
           style="position:fixed;inset:0;z-index:150;background:oklch(0 0 0 / .55);backdrop-filter:blur(6px);display:grid;place-items:center;animation:fadeIn .2s ease both;padding:20px">
        <div (click)="$event.stopPropagation()"
             style="width:100%;max-width:420px;background:var(--surface);border:1px solid var(--border);border-radius:18px;overflow:hidden;box-shadow:0 24px 64px oklch(0 0 0 / .5);animation:scaleIn .25s cubic-bezier(.22,.61,.36,1) both">
          <!-- Banner -->
          <div [style.background]="'linear-gradient(135deg,' + g(t.game).color2 + ',oklch(0.18 0.014 230))'"
               style="position:relative;height:110px;overflow:hidden">
            <div style="position:absolute;right:-10px;top:-10px;opacity:.3">
              <div [style.width.px]="140" [style.height.px]="140"
                   [style.border-radius.px]="39"
                   [style.background]="'linear-gradient(135deg,' + g(t.game).color2 + ',' + g(t.game).color + ')'"
                   style="display:grid;place-items:center">
              </div>
            </div>
            <div style="position:absolute;left:22px;bottom:18px">
              <div class="mono" style="font-size:10px;color:oklch(0.9 0 0 / .7);letter-spacing:.15em">{{ g(t.game).name.toUpperCase() }}</div>
              <div class="display" style="font-size:20px;color:white;font-weight:700;margin-top:2px">{{ t.name }}</div>
            </div>
          </div>

          <div style="padding:24px">
            <p style="font-size:13px;color:var(--text-2);line-height:1.5;margin-bottom:18px">
              Estás a punto de inscribirte en este torneo. Cuando empiece recibirás una notificación con el lobby.
            </p>

            <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:18px">
              <div style="padding:10px;border-radius:10px;background:var(--bg-2);border:1px solid var(--border-soft)">
                <div style="font-size:9.5px;color:var(--muted);letter-spacing:.12em;text-transform:uppercase;margin-bottom:6px">Empieza en</div>
                <app-countdown [to]="t.startsAt" [compact]="true"/>
              </div>
              <div style="padding:10px;border-radius:10px;background:var(--bg-2);border:1px solid var(--border-soft)">
                <div style="font-size:9.5px;color:var(--muted);letter-spacing:.12em;text-transform:uppercase;margin-bottom:6px">Premio total</div>
                <app-token-amount [value]="t.prize" [size]="15"/>
              </div>
              <div style="padding:10px;border-radius:10px;background:var(--bg-2);border:1px solid var(--border-soft)">
                <div style="font-size:9.5px;color:var(--muted);letter-spacing:.12em;text-transform:uppercase;margin-bottom:6px">Formato</div>
                <span style="font-size:13px;font-weight:600;color:var(--text)">{{ t.format }} · {{ t.mode }}</span>
              </div>
              <div style="padding:10px;border-radius:10px;background:var(--bg-2);border:1px solid var(--border-soft)">
                <div style="font-size:9.5px;color:var(--muted);letter-spacing:.12em;text-transform:uppercase;margin-bottom:6px">Entrada</div>
                @if (t.fee > 0) {
                  <app-token-amount [value]="t.fee" [size]="14" [color]="canAfford(t.fee) ? 'var(--gold)' : 'var(--danger)'"/>
                } @else {
                  <span style="color:var(--accent);font-weight:700;font-size:13px">GRATIS</span>
                }
              </div>
            </div>

            @if (t.fee > 0 && !canAfford(t.fee)) {
              <div style="padding:10px;border-radius:8px;background:oklch(0.68 0.21 25 / .12);color:var(--danger);font-size:12px;margin-bottom:14px">
                No tienes tokens suficientes. Te faltan <strong class="mono">{{ (t.fee - auth.tokens()) | fmtNum }}</strong>.
              </div>
            }

            <div style="display:flex;gap:10px">
              <button class="btn btn-ghost" (click)="reg.cancelRegistration()" style="flex:1;justify-content:center">Cancelar</button>
              <button class="btn btn-primary"
                      [disabled]="t.fee > 0 && !canAfford(t.fee)"
                      (click)="reg.confirmRegistration()"
                      style="flex:1.4;justify-content:center">
                Confirmar inscripción
              </button>
            </div>
          </div>
        </div>
      </div>
    }
  `,
})
export class ConfirmModalComponent {
  readonly reg  = inject(RegistrationService);
  readonly auth = inject(AuthService);

  g(gameId: string) { return GAME_BY_ID[gameId]; }
  canAfford(fee: number) { return this.auth.tokens() >= fee; }
}
