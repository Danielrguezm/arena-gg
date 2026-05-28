import { Component, input } from '@angular/core';
import { CoinComponent } from '../coin/coin.component';
import { FmtNumPipe } from '../../pipes/fmt-num.pipe';

@Component({
  selector: 'app-token-amount',
  standalone: true,
  imports: [CoinComponent, FmtNumPipe],
  template: `
    <span [style.color]="color() || 'var(--gold)'"
          [style.font-size.px]="size()"
          style="display:inline-flex;align-items:center;gap:5px;font-family:var(--font-mono);font-weight:700;letter-spacing:-.02em">
      @if (!hideIcon()) { <app-coin [size]="size() + 2"/> }
      {{ value() | fmtNum }}
    </span>
  `,
})
export class TokenAmountComponent {
  value    = input.required<number>();
  size     = input(14);
  color    = input('');
  hideIcon = input(false);
}
