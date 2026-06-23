import { Injectable, signal } from '@angular/core';
import { Tournament } from '../../data/models';
import { AuthService } from '../auth/auth.service';
import { ToastService } from '../toast/toast.service';

@Injectable({ providedIn: 'root' })
export class RegistrationService {
  private readonly _pending     = signal<Tournament | null>(null);
  private readonly _teamPending = signal<Tournament | null>(null);
  private readonly _registered  = signal<Set<string>>(new Set());
  private readonly _teamMembers = signal<string[]>([]);

  readonly pending     = this._pending.asReadonly();
  readonly teamPending = this._teamPending.asReadonly();
  readonly registered  = this._registered.asReadonly();
  readonly teamMembers = this._teamMembers.asReadonly();

  constructor(
    private readonly authSvc: AuthService,
    private readonly toast:   ToastService,
  ) {}

  isRegistered(id: string) { return this._registered().has(id); }

  needsTeam(format: string): boolean {
    return format !== '1v1' && format !== 'Solo';
  }

  requestRegistration(t: Tournament) {
    if (!this.authSvc.isLoggedIn()) {
      this.toast.push({ title: 'Inicia sesión', body: 'Necesitas una cuenta para inscribirte en un torneo', tone: 'danger' });
      return;
    }
    if (this.needsTeam(t.format)) {
      this._teamPending.set(t);
    } else {
      this._teamMembers.set([]);
      this._pending.set(t);
    }
  }

  submitTeam(t: Tournament, teamMembers: string[]) {
    this._teamPending.set(null);
    this._teamMembers.set(teamMembers);
    this._pending.set(t);
  }

  cancelTeam() { this._teamPending.set(null); }

  cancelRegistration() {
    this._pending.set(null);
    this._teamMembers.set([]);
  }

  async confirmRegistration() {
    if (!this.authSvc.isLoggedIn()) { this._pending.set(null); return; }

    const t = this._pending();
    if (!t) return;
    this._pending.set(null);
    this._teamMembers.set([]);

    if (t.fee > 0 && this.authSvc.tokens() < t.fee) {
      this.toast.push({ title: 'Tokens insuficientes', body: `Te faltan ${t.fee - this.authSvc.tokens()} tokens`, tone: 'danger' });
      return;
    }
    if (t.fee > 0) this.authSvc.spendTokens(t.fee);

    this._registered.update(s => { const ns = new Set(s); ns.add(t.id); return ns; });
    this.toast.push({ title: '¡Inscrito!', body: `Te has unido a ${t.name}`, tone: 'emerald' });

    const winAmount = Math.round(t.prize * 0.15);
    setTimeout(() => {
      this.authSvc.addTokens(winAmount);
      this.toast.push({ title: `+${winAmount} tokens`, body: 'Premio del torneo', tone: 'gold', duration: 5000 });
    }, 3000);
  }
}
