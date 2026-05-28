import { Component, input } from '@angular/core';

@Component({
  selector: 'app-coin',
  standalone: true,
  template: `
    <svg [attr.width]="size()" [attr.height]="size()" viewBox="0 0 24 24"
         style="display:inline-block;vertical-align:middle"
         [style.animation]="spin() ? 'coinSpin 1.4s linear infinite' : 'none'">
      <defs>
        <linearGradient id="cg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%"   stop-color="oklch(0.92 0.10 86)"/>
          <stop offset="60%"  stop-color="oklch(0.78 0.15 80)"/>
          <stop offset="100%" stop-color="oklch(0.62 0.16 70)"/>
        </linearGradient>
      </defs>
      <circle cx="12" cy="12" r="10" fill="url(#cg)" stroke="oklch(0.50 0.14 70)" stroke-width="0.8"/>
      <circle cx="12" cy="12" r="7.5" fill="none" stroke="oklch(0.55 0.14 70 / .6)" stroke-width="0.6"/>
      <text x="12" y="15.2" text-anchor="middle" font-family="var(--font-display)" font-weight="700" font-size="9" fill="oklch(0.30 0.10 70)">T</text>
    </svg>
  `,
})
export class CoinComponent {
  size = input(16);
  spin = input(false);
}
