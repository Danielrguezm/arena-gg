import { Injectable, signal } from '@angular/core';
import { Tournament } from '../../data/models';
import { AuthService } from '../auth/auth.service';
import { ToastService } from '../toast/toast.service';
import { SupabaseService } from '../supabase/supabase.service';
import { TournamentAdminService } from '../tournament-admin/tournament-admin.service';

@Injectable({ providedIn: 'root' })
export class RegistrationService {
  private readonly _pending    = signal<Tournament | null>(null);
  private readonly _registered = signal<Set<string>>(new Set());

  readonly pending    = this._pending.asReadonly();
  readonly registered = this._registered.asReadonly();

  constructor(
    private readonly authSvc:   AuthService,
    private readonly toast:     ToastService,
    private readonly supabase:  SupabaseService,
    private readonly apiSvc:    TournamentAdminService,
  ) {}

  isRegistered(id: string) { return this._registered().has(id); }

  requestRegistration(t: Tournament) {
    if (!this.authSvc.isLoggedIn()) {
      this.toast.push({ title: 'Inicia sesión', body: 'Necesitas una cuenta para inscribirte en un torneo', tone: 'danger' });
      return;
    }
    this._pending.set(t);
  }

  cancelRegistration() { this._pending.set(null); }

  async confirmRegistration() {
    if (!this.authSvc.isLoggedIn()) { this._pending.set(null); return; }

    const t = this._pending();
    if (!t) return;
    this._pending.set(null);

    const userId = this.authSvc.user()?.id;
    if (userId) {
      try {
        await new Promise<void>((resolve, reject) => {
          this.apiSvc.registerToTournament(t.id, userId).subscribe({
            next: () => resolve(),
            error: (e) => reject(e),
          });
        });
        if (t.fee > 0) this.authSvc.spendTokens(t.fee);
      } catch (e: any) {
        this.toast.push({ title: 'Error', body: e?.error?.error ?? e.message, tone: 'danger' });
        return;
      }
    } else {
      if (t.fee > 0 && this.authSvc.tokens() < t.fee) {
        this.toast.push({ title: 'Tokens insuficientes', body: `Te faltan ${t.fee - this.authSvc.tokens()} tokens`, tone: 'danger' });
        return;
      }
      if (t.fee > 0) this.authSvc.spendTokens(t.fee);
    }

    this._registered.update(s => { const ns = new Set(s); ns.add(t.id); return ns; });
    this.toast.push({ title: '¡Inscrito!', body: `Te has unido a ${t.name}`, tone: 'emerald' });

    // Demo: simula ganar tokens
    const winAmount = Math.round(t.prize * 0.15);
    setTimeout(() => {
      this.authSvc.addTokens(winAmount);
      this.toast.push({ title: `+${winAmount} tokens`, body: 'Premio del torneo', tone: 'gold', duration: 5000 });
    }, 3000);
  }
}
