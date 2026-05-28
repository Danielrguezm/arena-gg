import { Component, input } from '@angular/core';

export type BadgeTone = 'default' | 'emerald' | 'gold' | 'danger' | 'info' | 'live';

const TONES: Record<BadgeTone, { bg: string; color: string; border: string }> = {
  default: { bg: 'var(--hover)',                          color: 'var(--text-2)', border: 'var(--border-soft)' },
  emerald: { bg: 'var(--accent-soft)',                    color: 'var(--accent)', border: 'transparent'        },
  gold:    { bg: 'var(--gold-soft)',                      color: 'var(--gold)',   border: 'transparent'        },
  danger:  { bg: 'oklch(0.68 0.21 25 / .14)',             color: 'var(--danger)', border: 'transparent'        },
  info:    { bg: 'oklch(0.74 0.14 235 / .14)',            color: 'var(--info)',   border: 'transparent'        },
  live:    { bg: 'oklch(0.68 0.21 25 / .14)',             color: 'var(--danger)', border: 'transparent'        },
};

@Component({
  selector: 'app-badge',
  standalone: true,
  template: `
    <span [style.background]="style().bg"
          [style.color]="style().color"
          [style.border]="'1px solid ' + style().border"
          style="display:inline-flex;align-items:center;gap:6px;padding:4px 9px;border-radius:999px;font-size:11.5px;font-weight:600;letter-spacing:.02em;white-space:nowrap;font-family:var(--font-body)">
      @if (tone() === 'live') {
        <span style="width:6px;height:6px;border-radius:999px;background:var(--danger);animation:pulseDot 1.2s ease-in-out infinite;display:inline-block"></span>
      }
      <ng-content/>
    </span>
  `,
})
export class BadgeComponent {
  tone = input<BadgeTone>('default');
  style() { return TONES[this.tone()]; }
}
