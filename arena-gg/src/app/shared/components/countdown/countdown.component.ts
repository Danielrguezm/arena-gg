import { Component, input, signal, computed, OnInit, OnDestroy } from '@angular/core';
import { BadgeComponent } from '../badge/badge.component';

@Component({
  selector: 'app-countdown',
  standalone: true,
  imports: [BadgeComponent],
  template: `
    @if (isLive()) {
      <app-badge tone="live">EN VIVO</app-badge>
    } @else {
      <div style="display:inline-flex;gap:6px;align-items:center">
        @if (days() > 0) { <span class="seg"><span class="mono" [style.font-size]="compact() ? '14px' : '22px'">{{ pad(days()) }}</span><span class="lbl">d</span></span> }
        <span class="seg"><span class="mono" [style.font-size]="compact() ? '14px' : '22px'">{{ pad(hours()) }}</span><span class="lbl">h</span></span>
        <span class="seg"><span class="mono" [style.font-size]="compact() ? '14px' : '22px'">{{ pad(minutes()) }}</span><span class="lbl">m</span></span>
        <span class="seg"><span class="mono" [style.font-size]="compact() ? '14px' : '22px'">{{ pad(seconds()) }}</span><span class="lbl">s</span></span>
      </div>
    }
  `,
  styles: [`
    .seg { display:inline-flex; flex-direction:column; align-items:center; line-height:1; }
    .mono { font-family:var(--font-mono); font-weight:700; color:var(--text); }
    .lbl  { font-size:9px; color:var(--muted); letter-spacing:.1em; text-transform:uppercase; margin-top:2px; }
  `],
})
export class CountdownComponent implements OnInit, OnDestroy {
  to      = input.required<number>();
  compact = input(false);

  private readonly _tick = signal(0);
  private _interval?: ReturnType<typeof setInterval>;

  readonly ms      = computed(() => { this._tick(); return this.to() - Date.now(); });
  readonly isLive  = computed(() => this.ms() <= 0);
  readonly days    = computed(() => Math.max(0, Math.floor(this.ms() / 86400000)));
  readonly hours   = computed(() => Math.max(0, Math.floor((this.ms() % 86400000) / 3600000)));
  readonly minutes = computed(() => Math.max(0, Math.floor((this.ms() % 3600000) / 60000)));
  readonly seconds = computed(() => Math.max(0, Math.floor((this.ms() % 60000) / 1000)));

  ngOnInit()    { this._interval = setInterval(() => this._tick.update(n => n + 1), 1000); }
  ngOnDestroy() { clearInterval(this._interval); }

  pad(n: number) { return String(n).padStart(2, '0'); }
}
