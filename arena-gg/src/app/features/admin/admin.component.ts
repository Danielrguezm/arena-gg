import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DecimalPipe } from '@angular/common';
import { TournamentAdminService, TournamentDto } from '../../core/tournament-admin/tournament-admin.service';

const EMPTY = (): TournamentDto => ({
  gameId: 'lol', name: '', prize: 0, fee: 0, maxEntries: 32,
  format: '5v5', mode: 'Eliminación', level: 'Casual',
  status: 'open', featured: false, startsAt: '',
});

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [FormsModule, DecimalPipe],
  template: `
    <div class="page-enter" style="max-width:1100px;margin:0 auto;padding:32px 28px 80px">
      <h1 class="display" style="font-size:28px;font-weight:700;color:var(--text);margin:0 0 24px">Panel Admin — Torneos</h1>

      <!-- Botón nuevo -->
      <button class="btn btn-primary" style="margin-bottom:24px" (click)="openForm()">+ Nuevo torneo</button>

      <!-- Formulario -->
      @if (showForm()) {
        <div style="background:var(--surface);border:1px solid var(--border-soft);border-radius:16px;padding:28px;margin-bottom:32px">
          <h2 class="display" style="font-size:18px;margin:0 0 20px;color:var(--text)">
            {{ editing() ? 'Editar torneo' : 'Crear torneo' }}
          </h2>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
            <div>
              <label style="font-size:12px;font-weight:600;color:var(--text-2);display:block;margin-bottom:6px">Nombre</label>
              <input [(ngModel)]="form.name" class="field-input" placeholder="Nombre del torneo">
            </div>
            <div>
              <label style="font-size:12px;font-weight:600;color:var(--text-2);display:block;margin-bottom:6px">Juego</label>
              <select [(ngModel)]="form.gameId" class="field-input">
                <option value="lol">League of Legends</option>
                <option value="cs2">Counter-Strike 2</option>
                <option value="valo">Valorant</option>
                <option value="apex">Apex Legends</option>
                <option value="rl">Rocket League</option>
                <option value="cr">Clash Royale</option>
              </select>
            </div>
            <div>
              <label style="font-size:12px;font-weight:600;color:var(--text-2);display:block;margin-bottom:6px">Premio (tokens)</label>
              <input [(ngModel)]="form.prize" type="number" class="field-input">
            </div>
            <div>
              <label style="font-size:12px;font-weight:600;color:var(--text-2);display:block;margin-bottom:6px">Entrada (tokens)</label>
              <input [(ngModel)]="form.fee" type="number" class="field-input">
            </div>
            <div>
              <label style="font-size:12px;font-weight:600;color:var(--text-2);display:block;margin-bottom:6px">Cupos máximos</label>
              <input [(ngModel)]="form.maxEntries" type="number" class="field-input">
            </div>
            <div>
              <label style="font-size:12px;font-weight:600;color:var(--text-2);display:block;margin-bottom:6px">Formato</label>
              <input [(ngModel)]="form.format" class="field-input" placeholder="5v5, 1v1, Trío...">
            </div>
            <div>
              <label style="font-size:12px;font-weight:600;color:var(--text-2);display:block;margin-bottom:6px">Modo</label>
              <input [(ngModel)]="form.mode" class="field-input" placeholder="Eliminación, Bo3...">
            </div>
            <div>
              <label style="font-size:12px;font-weight:600;color:var(--text-2);display:block;margin-bottom:6px">Nivel</label>
              <select [(ngModel)]="form.level" class="field-input">
                <option value="Casual">Casual</option>
                <option value="Intermedio">Intermedio</option>
                <option value="Avanzado">Avanzado</option>
              </select>
            </div>
            <div>
              <label style="font-size:12px;font-weight:600;color:var(--text-2);display:block;margin-bottom:6px">Fecha inicio</label>
              <input [(ngModel)]="form.startsAt" type="datetime-local" class="field-input">
            </div>
            <div>
              <label style="font-size:12px;font-weight:600;color:var(--text-2);display:block;margin-bottom:6px">Estado</label>
              <select [(ngModel)]="form.status" class="field-input">
                <option value="open">Abierto</option>
                <option value="live">En vivo</option>
                <option value="finished">Finalizado</option>
                <option value="cancelled">Cancelado</option>
              </select>
            </div>
            <div style="display:flex;align-items:center;gap:10px;padding-top:22px">
              <input [(ngModel)]="form.featured" type="checkbox" id="featured" style="width:16px;height:16px;cursor:pointer">
              <label for="featured" style="font-size:13px;color:var(--text-2);cursor:pointer">Destacado</label>
            </div>
          </div>
          @if (error()) {
            <div style="margin-top:14px;padding:10px;border-radius:8px;background:oklch(0.68 0.21 25 / .12);color:var(--danger);font-size:12px">⚠ {{ error() }}</div>
          }
          <div style="display:flex;gap:10px;margin-top:20px">
            <button class="btn btn-primary" (click)="save()" [disabled]="saving()">
              {{ saving() ? 'Guardando…' : (editing() ? 'Guardar cambios' : 'Crear torneo') }}
            </button>
            <button class="btn btn-ghost" (click)="closeForm()">Cancelar</button>
          </div>
        </div>
      }

      <!-- Tabla -->
      @if (loading()) {
        <div style="color:var(--muted);padding:40px;text-align:center">Cargando torneos…</div>
      } @else if (tournaments().length === 0) {
        <div style="color:var(--muted);padding:40px;text-align:center">No hay torneos en la base de datos.</div>
      } @else {
        <div style="background:var(--surface);border:1px solid var(--border-soft);border-radius:16px;overflow:hidden">
          <table style="width:100%;border-collapse:collapse">
            <thead>
              <tr style="background:var(--bg-2);font-size:11px;color:var(--muted);text-transform:uppercase;letter-spacing:.08em">
                <th style="padding:12px 16px;text-align:left">Nombre</th>
                <th style="padding:12px 16px;text-align:left">Juego</th>
                <th style="padding:12px 16px;text-align:right">Premio</th>
                <th style="padding:12px 16px;text-align:right">Cupos</th>
                <th style="padding:12px 16px;text-align:center">Estado</th>
                <th style="padding:12px 16px;text-align:center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              @for (t of tournaments(); track t.id) {
                <tr style="border-top:1px solid var(--border-soft);font-size:13px">
                  <td style="padding:14px 16px;color:var(--text);font-weight:600">{{ t.name }}</td>
                  <td style="padding:14px 16px;color:var(--muted)">{{ t.gameId }}</td>
                  <td style="padding:14px 16px;text-align:right;color:var(--gold);font-family:var(--font-mono)">{{ t.prize | number }}</td>
                  <td style="padding:14px 16px;text-align:right;color:var(--text-2)">{{ t.maxEntries }}</td>
                  <td style="padding:14px 16px;text-align:center">
                    <span style="padding:3px 10px;border-radius:999px;font-size:11px;font-weight:600;background:var(--accent-soft);color:var(--accent)">{{ t.status }}</span>
                  </td>
                  <td style="padding:14px 16px;text-align:center;display:flex;gap:8px;justify-content:center">
                    <button class="btn btn-ghost" style="padding:6px 12px;font-size:12px" (click)="edit(t)">Editar</button>
                    <button class="btn" style="padding:6px 12px;font-size:12px;background:oklch(0.68 0.21 25 / .12);color:var(--danger);border-color:transparent" (click)="remove(t)">Eliminar</button>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </div>
  `,
})
export class AdminComponent implements OnInit {
  private readonly svc = inject(TournamentAdminService);

  readonly tournaments = signal<TournamentDto[]>([]);
  readonly loading     = signal(true);
  readonly saving      = signal(false);
  readonly showForm    = signal(false);
  readonly editing     = signal(false);
  readonly error       = signal('');

  form: TournamentDto = EMPTY();
  private editingId = '';

  ngOnInit() { this.load(); }

  load() {
    this.loading.set(true);
    this.svc.getAll().subscribe({
      next: ts => { this.tournaments.set(ts); this.loading.set(false); },
      error: () => { this.loading.set(false); },
    });
  }

  openForm() { this.form = EMPTY(); this.editing.set(false); this.error.set(''); this.showForm.set(true); }
  closeForm() { this.showForm.set(false); }

  edit(t: TournamentDto) {
    this.form = { ...t, startsAt: t.startsAt ? t.startsAt.slice(0, 16) : '' };
    this.editingId = t.id!;
    this.editing.set(true);
    this.error.set('');
    this.showForm.set(true);
  }

  save() {
    if (!this.form.name) { this.error.set('El nombre es obligatorio'); return; }
    this.saving.set(true);
    const obs = this.editing()
      ? this.svc.update(this.editingId, this.form)
      : this.svc.create(this.form);
    obs.subscribe({
      next: () => { this.saving.set(false); this.closeForm(); this.load(); },
      error: (e) => { this.saving.set(false); this.error.set(e?.message ?? 'Error al guardar'); },
    });
  }

  remove(t: TournamentDto) {
    if (!confirm(`¿Eliminar "${t.name}"?`)) return;
    this.svc.delete(t.id!).subscribe({ next: () => this.load() });
  }
}
