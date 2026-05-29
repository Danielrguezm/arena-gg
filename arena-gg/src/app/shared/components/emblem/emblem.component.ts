import { Component, input, computed, signal, effect } from '@angular/core';
import { GAME_BY_ID } from '../../../data/mock';

@Component({
  selector: 'app-emblem',
  standalone: true,
  template: `
    @if (g()) {
      <div [style.width.px]="size()"
           [style.height.px]="size()"
           [style.border-radius.px]="size() * 0.28"
           [style.background]="'linear-gradient(135deg,' + g()!.color2 + ' 0%,' + g()!.color + ' 100%)'"
           [style.box-shadow]="glow() ? '0 0 0 1px ' + g()!.color + ' inset, 0 0 24px ' + g()!.color + '55' : '0 0 0 1px rgba(255,255,255,.08) inset'"
           style="display:grid;place-items:center;position:relative;flex-shrink:0;overflow:hidden"
           [attr.aria-label]="g().name">
        @if (showImg()) {
          <img [src]="g()!.emblem"
               [style.width.px]="size()"
               [style.height.px]="size()"
               style="object-fit:cover;display:block;border-radius:inherit"
               (error)="imgError.set(true)"
               [alt]="g().name">
        } @else {
          <svg [attr.viewBox]="'0 0 44 44'" [attr.width]="size() * 0.68" [attr.height]="size() * 0.68" style="display:block">
            @switch (game()) {
              @case ('lol') {
                <polygon points="22,4 38,13 38,31 22,40 6,31 6,13" fill="none" stroke="rgba(255,255,255,.85)" stroke-width="1.5"/>
              }
              @case ('cs2') {
                <rect x="10" y="10" width="24" height="24" fill="none" stroke="rgba(255,255,255,.85)" stroke-width="1.5" transform="rotate(45 22 22)"/>
                <circle cx="22" cy="22" r="3" fill="rgba(255,255,255,.85)"/>
              }
              @case ('valo') {
                <polygon points="22,6 36,32 22,28 8,32" fill="rgba(255,255,255,.85)"/>
              }
              @case ('apex') {
                <polygon points="22,6 34,30 22,22 10,30" fill="none" stroke="rgba(255,255,255,.85)" stroke-width="2"/>
              }
              @case ('rl') {
                <circle cx="22" cy="22" r="11" fill="none" stroke="rgba(255,255,255,.85)" stroke-width="1.5"/>
                <path d="M11 22 L33 22 M22 11 L22 33" stroke="rgba(255,255,255,.6)" stroke-width="1"/>
              }
              @case ('cr') {
                <polygon points="6,28 14,12 22,22 30,12 38,28 6,28" fill="rgba(255,255,255,.85)"/>
              }
              @default {
                <circle cx="22" cy="22" r="12" fill="rgba(255,255,255,.6)"/>
              }
            }
          </svg>
          <span [style.font-size.px]="Math.max(8, size() * 0.16)"
                style="position:absolute;bottom:3px;right:5px;font-family:var(--font-mono);color:rgba(0,0,0,.55);font-weight:700;letter-spacing:.02em">
            {{ g().short }}
          </span>
        }
      </div>
    }
  `,
})
export class EmblemComponent {
  game = input<string>('');
  size = input(44);
  glow = input(false);

  readonly Math = Math;

  readonly g        = computed(() => GAME_BY_ID[this.game()] ?? null);
  readonly imgError = signal(false);
  readonly showImg  = computed(() => !this.imgError() && !!this.g()?.emblem?.startsWith('/'));

  constructor() {
    effect(() => { this.game(); this.imgError.set(false); });
  }
}
