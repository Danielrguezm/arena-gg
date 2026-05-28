import { Component, inject } from '@angular/core';
import { ToastService } from '../../../core/toast/toast.service';
import { CoinComponent } from '../coin/coin.component';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CoinComponent],
  template: `
    <div style="position:fixed;top:80px;right:18px;z-index:90;display:flex;flex-direction:column;gap:10px;pointer-events:none;max-width:360px">
      @for (t of toast.toasts(); track t.id) {
        <div (click)="toast.dismiss(t.id)"
             [style.border-color]="t.tone === 'gold' ? 'var(--gold)' : t.tone === 'danger' ? 'var(--danger)' : 'var(--border)'"
             style="pointer-events:auto;background:var(--elevated);border:1px solid;border-radius:12px;padding:12px 14px;box-shadow:var(--shadow-2);animation:fadeUp .25s ease both;display:flex;gap:12px;align-items:flex-start;min-width:280px;cursor:pointer">
          <div [style.background]="t.tone === 'gold' ? 'var(--gold-soft)' : t.tone === 'danger' ? 'oklch(0.68 0.21 25 / .14)' : 'var(--accent-soft)'"
               [style.color]="t.tone === 'gold' ? 'var(--gold)' : t.tone === 'danger' ? 'var(--danger)' : 'var(--accent)'"
               style="width:32px;height:32px;border-radius:8px;flex-shrink:0;display:grid;place-items:center">
            @if (t.tone === 'gold') { <app-coin [size]="18"/> }
            @else if (t.tone === 'danger') { <span>✕</span> }
            @else { <span>✓</span> }
          </div>
          <div style="flex:1;min-width:0">
            <div style="font-weight:600;font-size:13.5px;color:var(--text);margin-bottom:2px">{{ t.title }}</div>
            @if (t.body) { <div style="font-size:12.5px;color:var(--muted);line-height:1.4">{{ t.body }}</div> }
          </div>
        </div>
      }
    </div>
  `,
})
export class ToastComponent {
  readonly toast = inject(ToastService);
}
