import { Component, inject, signal, computed } from '@angular/core';
import { ClanService } from '../../core/clan/clan.service';
import { AuthService } from '../../core/auth/auth.service';
import { ToastService } from '../../core/toast/toast.service';
import { EmblemComponent } from '../../shared/components/emblem/emblem.component';
import { GAMES } from '../../data/mock';
import { ClanMember } from '../../data/models';

@Component({
  selector: 'app-clanes',
  standalone: true,
  imports: [EmblemComponent],
  template: `
    <div class="page-enter" style="max-width:1100px;margin:0 auto;padding:28px 28px 80px">

      <!-- ═══ SIN CLAN ══════════════════════════════════════════ -->
      @if (!clanSvc.hasClan()) {
        <div style="max-width:500px;margin:64px auto">
          <div style="text-align:center;margin-bottom:32px">
            <div style="width:80px;height:80px;border-radius:22px;background:linear-gradient(135deg,var(--accent),var(--secondary));margin:0 auto 18px;display:grid;place-items:center;box-shadow:0 0 0 1px oklch(1 0 0/.08) inset,0 12px 32px color-mix(in oklch,var(--accent) 30%,transparent)">
              <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="var(--accent-ink)" stroke-width="2" stroke-linejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            <h1 class="display" style="font-size:30px;font-weight:700;margin:0 0 10px">Crea tu clan</h1>
            <p style="color:var(--muted);font-size:13.5px;line-height:1.65;margin:0">
              Forma tu equipo, gestiona jugadores y compite juntos en torneos.<br>
              Máximo <strong style="color:var(--text-2)">10 jugadores</strong> por clan.
            </p>
          </div>

          <div style="background:var(--surface);border:1px solid var(--border-soft);border-radius:18px;padding:26px">
            <div style="margin-bottom:16px">
              <label style="display:block;font-size:11.5px;font-weight:600;color:var(--muted);letter-spacing:.1em;text-transform:uppercase;margin-bottom:7px">Nombre del clan</label>
              <input #nameInput placeholder="Ej: Arena Wolves"
                     (input)="createName.set(nameInput.value)"
                     style="width:100%;background:var(--bg-2);border:1px solid var(--border);border-radius:10px;padding:11px 14px;color:var(--text);font-family:var(--font-body);font-size:14px;outline:0;transition:border-color .15s"
                     (focus)="nameInput.style.borderColor='var(--accent)'"
                     (blur)="nameInput.style.borderColor='var(--border)'">
            </div>
            <div style="margin-bottom:22px">
              <label style="display:block;font-size:11.5px;font-weight:600;color:var(--muted);letter-spacing:.1em;text-transform:uppercase;margin-bottom:7px">
                Tag del clan <span style="color:var(--dim);font-weight:400;text-transform:none;letter-spacing:0">(2–4 caracteres)</span>
              </label>
              <input #tagInput placeholder="Ej: ARW"
                     maxlength="4"
                     (input)="createTag.set(tagInput.value)"
                     style="width:100%;background:var(--bg-2);border:1px solid var(--border);border-radius:10px;padding:11px 14px;color:var(--text);font-family:var(--font-mono);font-size:15px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;outline:0;transition:border-color .15s"
                     (focus)="tagInput.style.borderColor='var(--accent)'"
                     (blur)="tagInput.style.borderColor='var(--border)'">
            </div>
            @if (createError()) {
              <div style="padding:10px 14px;border-radius:8px;background:oklch(0.68 0.21 25/.12);color:var(--danger);font-size:12.5px;margin-bottom:14px">
                {{ createError() }}
              </div>
            }
            <button class="btn btn-primary" (click)="onCreateClan()" style="width:100%;justify-content:center;gap:8px;padding:13px;font-size:14px">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              Crear clan
            </button>
          </div>
        </div>
      } @else {
        <!-- ═══ CON CLAN ══════════════════════════════════════════ -->

        <!-- Cabecera ─────────────────────────────────────────── -->
        <div style="display:flex;align-items:center;gap:16px;flex-wrap:wrap;margin-bottom:24px">
          <!-- Escudo -->
          <div style="width:64px;height:64px;border-radius:18px;background:linear-gradient(135deg,var(--accent),var(--secondary));display:grid;place-items:center;flex-shrink:0;box-shadow:0 0 0 1px oklch(1 0 0/.08) inset,0 8px 24px color-mix(in oklch,var(--accent) 35%,transparent)">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="var(--accent-ink)" stroke-width="2.5" stroke-linejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          </div>

          <!-- Nombre y tag -->
          <div style="flex:1;min-width:0">
            <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">
              <span class="mono" style="font-size:12px;font-weight:700;padding:3px 9px;border-radius:5px;background:var(--accent-soft);color:var(--accent);letter-spacing:.14em">
                [{{ clanSvc.clan()?.tag }}]
              </span>
              @if (editingName()) {
                <input #nameEditInput [value]="editNameVal()"
                       (input)="editNameVal.set(nameEditInput.value)"
                       (keyup.enter)="saveEditName()"
                       style="background:var(--bg-2);border:1px solid var(--accent);border-radius:8px;padding:6px 10px;color:var(--text);font-family:var(--font-display);font-size:22px;font-weight:700;outline:0;min-width:200px;max-width:280px">
                <button (click)="saveEditName()" style="appearance:none;border:0;background:var(--accent);color:var(--accent-ink);border-radius:7px;padding:6px 11px;cursor:pointer;font-weight:700;font-size:13px">✓</button>
                <button (click)="editingName.set(false)" style="appearance:none;border:1px solid var(--border);background:transparent;color:var(--muted);border-radius:7px;padding:6px 11px;cursor:pointer;font-size:13px">✗</button>
              } @else {
                <h1 class="display" style="font-size:26px;font-weight:700;margin:0;letter-spacing:-.01em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">{{ clanSvc.clan()?.name }}</h1>
                <button (click)="startEditName()" title="Editar nombre"
                        style="appearance:none;border:1px solid var(--border-soft);background:var(--surface);border-radius:7px;padding:6px 7px;cursor:pointer;color:var(--muted);display:grid;place-items:center;flex-shrink:0;transition:color .15s,border-color .15s"
                        (mouseenter)="iconHover($event,true)" (mouseleave)="iconHover($event,false)">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                </button>
              }
            </div>
            <p style="color:var(--muted);font-size:12.5px;margin:5px 0 0">
              Fundado el {{ formatDate(clanSvc.clan()!.createdAt) }}
              @if (clanSvc.clan()?.description) {
                · {{ clanSvc.clan()!.description }}
              }
            </p>
          </div>

          <!-- Botones de acción -->
          <div style="display:flex;gap:8px;flex-shrink:0">
            <button (click)="showAddModal.set(true)"
                    [disabled]="clanSvc.isFull()"
                    class="btn btn-primary" style="gap:8px;padding:10px 16px">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <line x1="19" y1="8" x2="19" y2="14"/>
                <line x1="22" y1="11" x2="16" y2="11"/>
              </svg>
              Añadir jugador
            </button>
            <button (click)="showDisbandConfirm.set(true)" class="btn btn-ghost"
                    style="padding:10px 16px;color:var(--danger);border-color:color-mix(in oklch,var(--danger) 35%,transparent)">
              Disolver
            </button>
          </div>
        </div>

        <!-- Stats ────────────────────────────────────────────── -->
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:28px">
          <div style="background:var(--surface);border:1px solid var(--border-soft);border-radius:14px;padding:16px 20px">
            <div style="font-size:10.5px;color:var(--muted);letter-spacing:.14em;text-transform:uppercase;font-weight:600;margin-bottom:6px">Miembros</div>
            <div class="display" style="font-size:30px;font-weight:700;color:var(--text);line-height:1">
              {{ clanSvc.memberCount() }}<span style="font-size:16px;color:var(--muted);font-weight:500">/10</span>
            </div>
          </div>
          <div style="background:var(--surface);border:1px solid var(--border-soft);border-radius:14px;padding:16px 20px">
            <div style="font-size:10.5px;color:var(--muted);letter-spacing:.14em;text-transform:uppercase;font-weight:600;margin-bottom:6px">Victorias totales</div>
            <div class="display mono" style="font-size:30px;font-weight:700;color:var(--gold);line-height:1">{{ totalWins() }}</div>
          </div>
          <div style="background:var(--surface);border:1px solid var(--border-soft);border-radius:14px;padding:16px 20px">
            <div style="font-size:10.5px;color:var(--muted);letter-spacing:.14em;text-transform:uppercase;font-weight:600;margin-bottom:10px">Juegos del clan</div>
            @if (gamesInClan().length === 0) {
              <span style="font-size:12.5px;color:var(--dim)">Sin juegos aún</span>
            } @else {
              <div style="display:flex;gap:6px;flex-wrap:wrap">
                @for (g of gamesInClan(); track g.id) {
                  <app-emblem [game]="g.id" [size]="30"/>
                }
              </div>
            }
          </div>
        </div>

        <!-- Filtro por juego ──────────────────────────────────── -->
        <div style="display:flex;gap:6px;margin-bottom:20px;flex-wrap:wrap;align-items:center">
          <span style="font-size:11px;color:var(--muted);font-weight:700;letter-spacing:.12em;text-transform:uppercase;margin-right:4px">FILTRAR:</span>
          <button (click)="gameFilter.set('all')"
                  [style.background]="gameFilter()==='all' ? 'var(--accent-soft)' : 'var(--surface)'"
                  [style.color]="gameFilter()==='all' ? 'var(--accent)' : 'var(--text-2)'"
                  [style.border-color]="gameFilter()==='all' ? 'color-mix(in oklch,var(--accent) 40%,transparent)' : 'var(--border-soft)'"
                  style="appearance:none;cursor:pointer;border:1px solid;padding:7px 14px;border-radius:8px;font-family:var(--font-body);font-weight:600;font-size:12.5px;transition:all .15s">
            Todos
          </button>
          @for (g of gamesInClan(); track g.id) {
            <button (click)="gameFilter.set(g.id)"
                    [style.background]="gameFilter()===g.id ? 'var(--accent-soft)' : 'var(--surface)'"
                    [style.color]="gameFilter()===g.id ? 'var(--accent)' : 'var(--text-2)'"
                    [style.border-color]="gameFilter()===g.id ? 'color-mix(in oklch,var(--accent) 40%,transparent)' : 'var(--border-soft)'"
                    style="appearance:none;cursor:pointer;display:inline-flex;align-items:center;gap:6px;border:1px solid;padding:7px 12px;border-radius:8px;font-family:var(--font-body);font-weight:600;font-size:12.5px;transition:all .15s">
              <app-emblem [game]="g.id" [size]="18"/>{{ g.short }}
            </button>
          }
        </div>

        <!-- Grid de miembros ─────────────────────────────────── -->
        @if (filteredMembers().length === 0) {
          <div style="text-align:center;padding:52px 24px;color:var(--muted);border:1px dashed var(--border-soft);border-radius:16px">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-bottom:14px;opacity:.4;display:block;margin-left:auto;margin-right:auto">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            Ningún miembro juega a este juego.
          </div>
        } @else {
          <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(290px,1fr));gap:14px">
            @for (member of filteredMembers(); track member.id) {
              <div class="holo-tint" style="background:var(--surface);border:1px solid var(--border-soft);border-radius:16px;padding:20px;position:relative">

                <!-- Botón eliminar (solo para no-líderes) -->
                @if (member.role !== 'leader') {
                  <button (click)="removeMember(member.id, member.nick)"
                          title="Eliminar del clan"
                          style="position:absolute;top:12px;right:12px;appearance:none;border:1px solid var(--border-soft);background:transparent;color:var(--muted);border-radius:7px;padding:5px 6px;cursor:pointer;display:grid;place-items:center;transition:all .15s"
                          (mouseenter)="removeHover($event,true)" (mouseleave)="removeHover($event,false)">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                      <path d="M18 6 6 18M6 6l12 12"/>
                    </svg>
                  </button>
                }

                <!-- Avatar + nombre + rol -->
                <div style="display:flex;align-items:center;gap:14px;margin-bottom:16px">
                  <div [style.background]="avatarGrad(member)"
                       style="width:54px;height:54px;border-radius:14px;display:grid;place-items:center;color:white;font-family:var(--font-display);font-weight:700;font-size:20px;flex-shrink:0">
                    {{ member.initials }}
                  </div>
                  <div style="min-width:0">
                    <div style="display:flex;align-items:center;gap:6px;margin-bottom:5px">
                      <span style="font-weight:700;font-size:15px;color:var(--text);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">{{ member.nick }}</span>
                      @if (member.role === 'leader') {
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="var(--gold)" title="Líder">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                      }
                    </div>
                    <span [style.background]="member.role === 'leader' ? 'var(--gold-soft)' : 'var(--accent-soft)'"
                          [style.color]="member.role === 'leader' ? 'var(--gold)' : 'var(--accent)'"
                          style="display:inline-block;font-size:10px;font-weight:700;padding:2px 8px;border-radius:5px;letter-spacing:.1em">
                      {{ member.role === 'leader' ? 'LÍDER' : 'MIEMBRO' }}
                    </span>
                  </div>
                </div>

                <!-- Juegos -->
                <div style="margin-bottom:14px">
                  <div style="font-size:10.5px;color:var(--muted);letter-spacing:.1em;text-transform:uppercase;font-weight:600;margin-bottom:8px">Juegos</div>
                  @if (member.games.length === 0) {
                    <span style="font-size:12.5px;color:var(--dim)">Sin juegos</span>
                  } @else {
                    <div style="display:flex;gap:6px;flex-wrap:wrap">
                      @for (gid of member.games; track gid) {
                        <app-emblem [game]="gid" [size]="30"/>
                      }
                    </div>
                  }
                </div>

                <!-- Footer stats -->
                <div style="display:flex;align-items:center;justify-content:space-between;border-top:1px solid var(--border-soft);padding-top:12px">
                  <div>
                    <span class="mono" style="font-size:15px;font-weight:700;color:var(--gold)">{{ member.wins ?? 0 }}</span>
                    <span style="font-size:11.5px;color:var(--muted);margin-left:4px">victorias</span>
                  </div>
                  <span style="font-size:11px;color:var(--dim)">Desde {{ formatDate(member.joinedAt) }}</span>
                </div>
              </div>
            }
          </div>
        }

        <!-- Aviso cuando el clan está lleno -->
        @if (clanSvc.isFull()) {
          <div style="text-align:center;padding:14px;margin-top:16px;border:1px solid var(--border-soft);border-radius:10px;font-size:13px;color:var(--muted)">
            El clan está lleno (10/10). Elimina un miembro para añadir otro.
          </div>
        }
      }
    </div>

    <!-- ═══ MODAL: AÑADIR JUGADOR ═════════════════════════════ -->
    @if (showAddModal()) {
      <div (click)="closeAddModal()"
           style="position:fixed;inset:0;z-index:150;background:oklch(0 0 0/.62);backdrop-filter:blur(6px);display:grid;place-items:center;padding:20px;animation:fadeIn .2s ease both">
        <div (click)="$event.stopPropagation()"
             style="width:100%;max-width:450px;background:var(--surface);border:1px solid var(--border);border-radius:18px;overflow:hidden;box-shadow:var(--shadow-2);animation:scaleIn .25s cubic-bezier(.22,.61,.36,1) both">
          <div style="padding:22px 24px 0">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:22px">
              <h2 class="display" style="font-size:19px;font-weight:700;margin:0">Añadir jugador</h2>
              <button (click)="closeAddModal()" style="appearance:none;border:1px solid var(--border-soft);background:transparent;color:var(--muted);border-radius:8px;padding:6px;cursor:pointer;display:grid;place-items:center">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6 6 18M6 6l12 12"/></svg>
              </button>
            </div>
          </div>

          <div style="padding:0 24px 24px">
            <!-- Nick -->
            <div style="margin-bottom:18px">
              <label style="display:block;font-size:11.5px;font-weight:600;color:var(--muted);letter-spacing:.1em;text-transform:uppercase;margin-bottom:7px">Nick del jugador</label>
              <input #modalNick placeholder="Ej: ninja_master"
                     (input)="addNick.set(modalNick.value)"
                     style="width:100%;background:var(--bg-2);border:1px solid var(--border);border-radius:10px;padding:11px 14px;color:var(--text);font-family:var(--font-body);font-size:14px;outline:0;transition:border-color .15s"
                     (focus)="modalNick.style.borderColor='var(--accent)'"
                     (blur)="modalNick.style.borderColor='var(--border)'">
            </div>

            <!-- Juegos (chips multi-select) -->
            <div style="margin-bottom:22px">
              <label style="display:block;font-size:11.5px;font-weight:600;color:var(--muted);letter-spacing:.1em;text-transform:uppercase;margin-bottom:10px">
                Juegos que practica <span style="color:var(--dim);font-weight:400;text-transform:none;letter-spacing:0">(opcional)</span>
              </label>
              <div style="display:flex;gap:6px;flex-wrap:wrap">
                @for (g of games; track g.id) {
                  <button (click)="toggleAddGame(g.id)"
                          [style.background]="addGames().includes(g.id) ? 'var(--accent-soft)' : 'var(--bg-2)'"
                          [style.color]="addGames().includes(g.id) ? 'var(--accent)' : 'var(--text-2)'"
                          [style.border-color]="addGames().includes(g.id) ? 'color-mix(in oklch,var(--accent) 50%,transparent)' : 'var(--border)'"
                          style="appearance:none;cursor:pointer;display:inline-flex;align-items:center;gap:6px;border:1px solid;padding:7px 12px;border-radius:8px;font-family:var(--font-body);font-weight:600;font-size:12.5px;transition:all .15s">
                    <app-emblem [game]="g.id" [size]="20"/>{{ g.short }}
                  </button>
                }
              </div>
            </div>

            @if (addError()) {
              <div style="padding:10px 14px;border-radius:8px;background:oklch(0.68 0.21 25/.12);color:var(--danger);font-size:12.5px;margin-bottom:14px">
                {{ addError() }}
              </div>
            }

            <div style="display:flex;gap:10px">
              <button class="btn btn-ghost" (click)="closeAddModal()" style="flex:1;justify-content:center">Cancelar</button>
              <button class="btn btn-primary" (click)="onAddMember()" style="flex:1.4;justify-content:center">Añadir al clan</button>
            </div>
          </div>
        </div>
      </div>
    }

    <!-- ═══ MODAL: CONFIRMAR DISOLVER ════════════════════════ -->
    @if (showDisbandConfirm()) {
      <div (click)="showDisbandConfirm.set(false)"
           style="position:fixed;inset:0;z-index:150;background:oklch(0 0 0/.62);backdrop-filter:blur(6px);display:grid;place-items:center;padding:20px;animation:fadeIn .2s ease both">
        <div (click)="$event.stopPropagation()"
             style="width:100%;max-width:400px;background:var(--surface);border:1px solid var(--border);border-radius:18px;padding:30px;text-align:center;box-shadow:var(--shadow-2);animation:scaleIn .25s cubic-bezier(.22,.61,.36,1) both">
          <div style="width:54px;height:54px;border-radius:14px;background:oklch(0.68 0.21 25/.15);margin:0 auto 18px;display:grid;place-items:center">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--danger)" stroke-width="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          </div>
          <h2 class="display" style="font-size:21px;font-weight:700;margin:0 0 8px">¿Disolver el clan?</h2>
          <p style="color:var(--muted);font-size:13.5px;line-height:1.65;margin:0 0 24px">
            Esta acción eliminará el clan y a todos sus miembros permanentemente. No se puede deshacer.
          </p>
          <div style="display:flex;gap:10px">
            <button class="btn btn-ghost" (click)="showDisbandConfirm.set(false)" style="flex:1;justify-content:center">Cancelar</button>
            <button (click)="confirmDisband()"
                    style="flex:1.4;appearance:none;border:0;background:var(--danger);color:white;border-radius:10px;padding:12px;cursor:pointer;font-weight:700;font-size:13.5px;font-family:var(--font-body)">
              Disolver clan
            </button>
          </div>
        </div>
      </div>
    }
  `,
})
export class ClanesComponent {
  readonly clanSvc = inject(ClanService);
  readonly auth    = inject(AuthService);
  readonly toast   = inject(ToastService);

  readonly games = GAMES;

  readonly gameFilter         = signal('all');
  readonly createName         = signal('');
  readonly createTag          = signal('');
  readonly createError        = signal('');
  readonly editingName        = signal(false);
  readonly editNameVal        = signal('');
  readonly showAddModal       = signal(false);
  readonly addNick            = signal('');
  readonly addGames           = signal<string[]>([]);
  readonly addError           = signal('');
  readonly showDisbandConfirm = signal(false);

  readonly filteredMembers = computed(() => {
    const c = this.clanSvc.clan();
    if (!c) return [];
    const g = this.gameFilter();
    return g === 'all' ? c.members : c.members.filter(m => m.games.includes(g));
  });

  readonly gamesInClan = computed(() => {
    const c = this.clanSvc.clan();
    if (!c) return [];
    const ids = new Set(c.members.flatMap(m => m.games));
    return GAMES.filter(g => ids.has(g.id));
  });

  readonly totalWins = computed(() => {
    const c = this.clanSvc.clan();
    if (!c) return 0;
    return c.members.reduce((sum, m) => sum + (m.wins ?? 0), 0);
  });

  onCreateClan(): void {
    const name = this.createName().trim();
    const tag  = this.createTag().trim();
    if (!name)         { this.createError.set('El nombre del clan es obligatorio'); return; }
    if (tag.length < 2) { this.createError.set('El tag debe tener entre 2 y 4 caracteres'); return; }
    const user = this.auth.user();
    if (!user) return;
    this.clanSvc.createClan(name, tag, user.id ?? 'me', user.nick, user.initials);
    this.toast.push({ title: '¡Clan creado!', body: `Bienvenido a [${tag.toUpperCase()}] ${name}`, tone: 'emerald' });
    this.createError.set('');
  }

  startEditName(): void {
    this.editNameVal.set(this.clanSvc.clan()?.name ?? '');
    this.editingName.set(true);
  }

  saveEditName(): void {
    const name = this.editNameVal().trim();
    if (!name) return;
    this.clanSvc.updateName(name);
    this.editingName.set(false);
    this.toast.push({ title: 'Nombre del clan actualizado', tone: 'emerald' });
  }

  toggleAddGame(id: string): void {
    this.addGames.update(list =>
      list.includes(id) ? list.filter(x => x !== id) : [...list, id]
    );
  }

  onAddMember(): void {
    const nick = this.addNick().trim();
    if (!nick)           { this.addError.set('El nick es obligatorio'); return; }
    if (nick.length < 2) { this.addError.set('El nick debe tener al menos 2 caracteres'); return; }

    const member: ClanMember = {
      id:       'm_' + Date.now(),
      nick,
      initials: nick.slice(0, 2).toUpperCase(),
      role:     'member',
      games:    [...this.addGames()],
      joinedAt: Date.now(),
      wins:     0,
    };

    const ok = this.clanSvc.addMember(member);
    if (!ok) {
      this.addError.set(
        this.clanSvc.memberCount() >= 10
          ? 'El clan ya tiene 10 miembros'
          : 'Ese nick ya está en el clan'
      );
      return;
    }
    this.toast.push({ title: `${nick} añadido al clan`, tone: 'emerald' });
    this.closeAddModal();
  }

  closeAddModal(): void {
    this.showAddModal.set(false);
    this.addNick.set('');
    this.addGames.set([]);
    this.addError.set('');
  }

  removeMember(id: string, nick: string): void {
    this.clanSvc.removeMember(id);
    this.toast.push({ title: `${nick} eliminado del clan` });
  }

  confirmDisband(): void {
    this.clanSvc.disbandClan();
    this.showDisbandConfirm.set(false);
    this.toast.push({ title: 'Clan disuelto', tone: 'danger' });
  }

  formatDate(ts: number): string {
    return new Date(ts).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  avatarGrad(m: ClanMember): string {
    let hash = 0;
    for (const ch of m.nick) hash = (hash * 31 + ch.charCodeAt(0)) | 0;
    const h = Math.abs(hash) % 360;
    return `linear-gradient(135deg, oklch(0.55 0.18 ${h}), oklch(0.40 0.20 ${(h + 60) % 360}))`;
  }

  removeHover(e: MouseEvent, enter: boolean): void {
    const el = e.currentTarget as HTMLElement;
    el.style.color = enter ? 'var(--danger)' : 'var(--muted)';
    el.style.borderColor = enter
      ? 'color-mix(in oklch,var(--danger) 40%,transparent)'
      : 'var(--border-soft)';
  }

  iconHover(e: MouseEvent, enter: boolean): void {
    const el = e.currentTarget as HTMLElement;
    el.style.color = enter ? 'var(--text)' : 'var(--muted)';
    el.style.borderColor = enter ? 'var(--border)' : 'var(--border-soft)';
  }
}
