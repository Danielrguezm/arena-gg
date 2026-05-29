import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="page-enter" style="min-height:calc(100vh - 70px);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:24px;padding:40px">
      <div style="font-size:120px;font-family:var(--font-mono);font-weight:700;color:var(--border);line-height:1">404</div>
      <div style="text-align:center">
        <h1 class="display" style="font-size:28px;font-weight:700;color:var(--text);margin:0 0 10px">Página no encontrada</h1>
        <p style="color:var(--muted);font-size:15px;margin:0">La página que buscas no existe o fue eliminada.</p>
      </div>
      <a routerLink="/" class="btn btn-primary" style="padding:12px 24px">Volver al inicio</a>
    </div>
  `,
})
export class NotFoundComponent {}
