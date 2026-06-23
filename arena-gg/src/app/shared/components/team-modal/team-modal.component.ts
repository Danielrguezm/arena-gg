import { Component, inject, signal, effect } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RegistrationService } from '../../../core/registration/registration.service';
import { ClanService } from '../../../core/clan/clan.service';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-team-modal',
  standalone: true,
  imports: [RouterLink],
  template: `
    @if (reg.teamPending(); as t) {
      <div (click)="reg.cancelTeam()"
           style="position:fixed;inset:0;z-index:150;background:oklch(0 0 0/.62);backdrop-filter:blur(6px);display:grid;place-items:center;padding:20px;animation:fadeIn .2s ease both">
        <div (click)="$event.stopPropagation()"
             style="width:100%;max-width:480px;background:var(--surface);border:1px solid var(--border);border-radius:18px;overflow:hidden;box-shadow:var(--shadow-2);animation:scaleIn .25s cubic-bezier(.22,.61,.36,1) both">

          <!-- Header -->
          <div style="padding:22px 24px 0">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px">
              <h2 class="display" style="font-size:19px;font-weight:700;margin:0">Selecciona tu equipo</h2>
              <button (click)="reg.cancelTeam()" style="appearance:none;border:1px solid var(--border-soft);background:transparent;color:var(--muted);border-radius:8px;padding:6px;cursor:pointer;display:grid;place-items:center">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6 6 18M6 6l12 12"/></svg>
              </button>
            </div>
            <p style="color:var(--muted);font-size:13px;margin:0 0 20px">
              Formato <strong style="color:var(--text)">{{ t.format }}</strong> ·
              Necesitas <strong style="color:var(--accent)">{{ teamSize(t.format) }} jugadores</strong>
            </p>
          </div>

          <div style="padding:0 24px 24px">

            @if (!clan.hasClan()) {
              <div style="padding:16px;border-radius:10px;background:oklch(0.86 0.18 86 / .1);border:1px solid oklch(0.86 0.18 86 / .25);margin-bottom:18px;font-size:13px;color:var(--text-2);line-height:1.6">
                <strong style="color:var(--gold)">No tienes clan.</strong>
                Puedes inscribirte de forma individual o
                <a routerLink="/clanes" (click)="reg.cancelTeam()" style="color:var(--accent)">crear tu clan</a> para añadir compañeros.
              </div>
              <div style="display:flex;gap:10px">
                <button class="btn btn-ghost" (click)="reg.cancelTeam()" style="flex:1;justify-content:center">Cancelar</button>
                <button class="btn btn-primary" (click)="confirmSolo(t)" style="flex:1.4;justify-content:center">Inscribirme solo</button>
              </div>
            } @else {
              <!-- Counter -->
              <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px">
                <span style="font-size:12px;color:var(--muted);font-weight:600;letter-spacing:.08em;text-transform:uppercase">Miembros del clan</span>
                <span [style.color]="selected().length === teamSize(t.format) ? 'var(--accent)' : selected().length > teamSize(t.format) ? 'var(--danger)' : 'var(--muted)'"
                      class="mono" style="font-size:13px;font-weight:700">
                  {{ selected().length }}/{{ teamSize(t.format) }}
                </span>
              </div>

              <!-- Member list -->
              <div style="display:flex;flex-direction:column;gap:8px;max-height:320px;overflow-y:auto;margin-bottom:18px;padding-right:2px">
                @for (m of clan.clan()!.members; track m.id) {
                  <div (click)="toggleMember(m.id)"
                       [style.background]="selected().includes(m.id) ? 'var(--accent-soft)' : 'var(--bg-2)'"
                       [style.border-color]="selected().includes(m.id) ? 'color-mix(in oklch,var(--accent) 40%,transparent)' : 'var(--border)'"
                       [style.cursor]="m.id === currentUserId() ? 'default' : 'pointer'"
                       style="display:flex;align-items:center;gap:12px;padding:12px 14px;border-radius:10px;border:1px solid;transition:all .15s">

                    <!-- Checkbox -->
                    <div [style.background]="selected().includes(m.id) ? 'var(--accent)' : 'transparent'"
                         [style.border-color]="selected().includes(m.id) ? 'var(--accent)' : 'var(--border)'"
                         style="width:18px;height:18px;border-radius:5px;border:1.5px solid;display:grid;place-items:center;flex-shrink:0;transition:all .15s">
                      @if (selected().includes(m.id)) {
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--accent-ink)" stroke-width="3"><path d="m5 13 4 4L19 7"/></svg>
                      }
                    </div>

                    <!-- Avatar -->
                    <div [style.background]="memberGrad(m.nick)"
                         style="width:38px;height:38px;border-radius:10px;display:grid;place-items:center;color:white;font-family:var(--font-display);font-weight:700;font-size:14px;flex-shrink:0">
                      {{ m.initials }}
                    </div>

                    <!-- Info -->
                    <div style="flex:1;min-width:0">
                      <div style="display:flex;align-items:center;gap:6px">
                        <span style="font-weight:600;font-size:13.5px;color:var(--text);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">{{ m.nick }}</span>
                        @if (m.id === currentUserId()) {
                          <span style="font-size:10.5px;color:var(--muted)">(tú)</span>
                        }
                        @if (m.role === 'leader') {
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="var(--gold)"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                        }
                      </div>
                      <div style="font-size:11.5px;color:var(--muted);margin-top:2px">{{ m.wins ?? 0 }} victorias</div>
                    </div>
                  </div>
                }
              </div>

              @if (clan.memberCount() < teamSize(t.format)) {
                <div style="padding:10px 14px;border-radius:8px;background:oklch(0.86 0.18 86 / .1);border:1px solid oklch(0.86 0.18 86 / .25);color:oklch(0.86 0.18 86);font-size:12.5px;margin-bottom:14px">
                  Tu clan tiene menos miembros de los necesarios. Puedes inscribirte con los disponibles o
                  <a routerLink="/clanes" (click)="reg.cancelTeam()" style="color:var(--accent)">añadir más</a>.
                </div>
              }
              @if (selected().length > teamSize(t.format)) {
                <div style="padding:10px 14px;border-radius:8px;background:oklch(0.68 0.21 25/.12);color:var(--danger);font-size:12.5px;margin-bottom:14px">
                  Demasiados jugadores seleccionados (máx {{ teamSize(t.format) }}).
                </div>
              }

              <div style="display:flex;gap:10px">
                <button class="btn btn-ghost" (click)="reg.cancelTeam()" style="flex:1;justify-content:center">Cancelar</button>
                <button class="btn btn-primary" (click)="confirm(t)"
                        [disabled]="selected().length === 0 || selected().length > teamSize(t.format)"
                        style="flex:1.4;justify-content:center">
                  Confirmar equipo
                </button>
              </div>
            }
          </div>
        </div>
      </div>
    }
  `,
})
export class TeamModalComponent {
  readonly reg  = inject(RegistrationService);
  readonly clan = inject(ClanService);
  readonly auth = inject(AuthService);

  readonly selected = signal<string[]>([]);

  constructor() {
    effect(() => {
      const t = this.reg.teamPending();
      this.selected.set(t ? [this.currentUserId()] : []);
    });
  }

  currentUserId() { return this.auth.user()?.id ?? 'me'; }

  teamSize(format: string): number {
    if (!format) return 2;
    if (format === 'Trío') return 3;
    const m = format.match(/^(\d+)v/);
    return m ? +m[1] : 2;
  }

  toggleMember(id: string): void {
    if (id === this.currentUserId()) return;
    this.selected.update(list =>
      list.includes(id) ? list.filter(x => x !== id) : [...list, id]
    );
  }

  confirm(t: any): void {
    const clanMembers = this.clan.clan()?.members ?? [];
    const nicks = this.selected().map(id => clanMembers.find(m => m.id === id)?.nick ?? id);
    this.reg.submitTeam(t, nicks);
  }

  confirmSolo(t: any): void {
    const myNick = this.clan.clan()?.members.find(m => m.id === this.currentUserId())?.nick
      ?? this.auth.user()?.email?.split('@')[0] ?? 'tú';
    this.reg.submitTeam(t, [myNick]);
  }

  memberGrad(nick: string): string {
    let hash = 0;
    for (const ch of nick) hash = (hash * 31 + ch.charCodeAt(0)) | 0;
    const h = Math.abs(hash) % 360;
    return `linear-gradient(135deg, oklch(0.55 0.18 ${h}), oklch(0.40 0.20 ${(h + 60) % 360}))`;
  }
}
