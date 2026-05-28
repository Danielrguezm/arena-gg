import { Component, inject, signal, computed } from '@angular/core';
import { STORE_ITEMS, fmtNum, GAME_BY_ID } from '../../data/mock';
import { RARITY_META } from '../../data/models';
import { AuthService } from '../../core/auth/auth.service';
import { ToastService } from '../../core/toast/toast.service';
import { EmblemComponent } from '../../shared/components/emblem/emblem.component';
import { CoinComponent } from '../../shared/components/coin/coin.component';
import { TokenAmountComponent } from '../../shared/components/token-amount/token-amount.component';
import { FmtNumPipe } from '../../shared/pipes/fmt-num.pipe';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-store',
  standalone: true,
  imports: [RouterLink, EmblemComponent, CoinComponent, TokenAmountComponent, FmtNumPipe],
  template: `
    <div class="page-enter" style="max-width:1320px;margin:0 auto;padding:28px 28px 80px">

      <!-- Header -->
      <div style="display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:24px;gap:18px">
        <div>
          <h1 class="display" style="font-size:36px;font-weight:700;margin:0;letter-spacing:-.02em">Tienda</h1>
          <p style="color:var(--muted);font-size:13.5px;margin:6px 0 0">Canjea tus tokens por skins reales, merchandising y gift cards.</p>
        </div>
        @if (auth.isLoggedIn()) {
          <div class="holo-tint" style="background:var(--gold-soft);border:1px solid color-mix(in oklch, var(--gold) 40%, transparent);padding:14px 20px;border-radius:14px;display:flex;align-items:center;gap:14px">
            <div style="font-size:11px;color:var(--muted);letter-spacing:.1em;text-transform:uppercase">Tu saldo</div>
            <div style="display:flex;align-items:baseline;gap:6px"><app-coin [size]="24"/><span class="mono" style="color:var(--gold);font-size:26px;font-weight:700;letter-spacing:-.02em">{{ auth.tokens() | fmtNum }}</span></div>
          </div>
        } @else {
          <a routerLink="/login" class="btn btn-primary">Iniciar sesión para canjear</a>
        }
      </div>

      <!-- Category tabs -->
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:22px;padding-bottom:14px;border-bottom:1px solid var(--border-soft)">
        <div style="display:flex;gap:6px">
          @for (c of cats; track c.v) {
            <button (click)="cat.set(c.v)"
                    [style.color]="cat()===c.v ? 'var(--text)' : 'var(--muted)'"
                    style="appearance:none;cursor:pointer;border:0;background:transparent;padding:10px 14px;font-family:var(--font-body);font-weight:600;font-size:13.5px;position:relative">
              {{ c.l }}
              @if (cat()===c.v) {
                <span style="position:absolute;left:14px;right:14px;bottom:-15px;height:2px;background:var(--accent);border-radius:2px;box-shadow:0 0 12px var(--accent)"></span>
              }
            </button>
          }
        </div>
        <div style="display:flex;align-items:center;gap:8px">
          <span style="color:var(--muted);font-size:12px">Ordenar</span>
          <select (change)="sortBy.set(($event.target as HTMLSelectElement).value)" style="background:var(--surface);border:1px solid var(--border);border-radius:8px;padding:7px 10px;color:var(--text);font-family:var(--font-body);font-size:12.5px;cursor:pointer">
            <option value="featured">Destacados</option>
            <option value="cheap">Más baratos</option>
            <option value="expensive">Más caros</option>
          </select>
        </div>
      </div>

      <!-- Grid -->
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:18px">
        @for (item of filtered(); track item.id) {
          <div class="holo-tint" style="background:var(--surface);border:1px solid var(--border-soft);border-radius:16px;overflow:hidden;display:flex;flex-direction:column;transition:transform .2s,border-color .2s"
               (mouseenter)="hoverCard($event, item.rarity, true)" (mouseleave)="hoverCard($event, item.rarity, false)">
            <!-- Art slot -->
            <div [style.background]="getGame(item.game) ? 'linear-gradient(135deg,' + getGame(item.game)!.color2 + ',oklch(0.20 0.014 230))' : 'linear-gradient(135deg,' + rarMeta(item.rarity).color + '40,oklch(0.20 0.014 230))'"
                 style="position:relative;height:170px;border-bottom:1px solid var(--border-soft)">
              <div aria-hidden style="position:absolute;inset:0;opacity:.35;background-image:radial-gradient(oklch(1 0 0 / .12) 1px, transparent 1px);background-size:14px 14px"></div>
              @if (getGame(item.game)) {
                <div style="position:absolute;right:-12px;top:-12px;opacity:.55"><app-emblem [game]="item.game!" [size]="120"/></div>
              }
              <div style="position:absolute;top:12px;left:12px">
                <span [style.background]="rarMeta(item.rarity).color + '30'"
                      [style.color]="rarMeta(item.rarity).color"
                      [style.border-color]="rarMeta(item.rarity).color + '66'"
                      style="display:inline-flex;padding:3px 8px;border-radius:999px;border:1px solid;font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase">{{ rarMeta(item.rarity).label }}</span>
              </div>
            </div>
            <!-- Info -->
            <div style="padding:16px;display:flex;flex-direction:column;gap:12px;flex:1">
              <div>
                <div style="font-weight:600;font-size:14px;color:var(--text);line-height:1.3">{{ item.name }}</div>
                <div style="font-size:11.5px;color:var(--muted);margin-top:3px">{{ catLabel(item) }}</div>
              </div>
              <div style="flex:1"></div>
              <div style="display:flex;justify-content:space-between;align-items:center">
                <app-token-amount [value]="item.cost" [size]="14"/>
                <button (click)="buy(item)"
                        [disabled]="!auth.isLoggedIn() || auth.tokens() < item.cost"
                        [class]="auth.isLoggedIn() && auth.tokens() >= item.cost ? 'btn btn-primary' : 'btn btn-ghost'"
                        style="padding:7px 12px;font-size:12px">
                  {{ !auth.isLoggedIn() ? 'Login' : auth.tokens() < item.cost ? 'Insuficiente' : 'Canjear' }}
                </button>
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  `,
})
export class StoreComponent {
  readonly auth  = inject(AuthService);
  readonly toast = inject(ToastService);

  readonly cat    = signal('all');
  readonly sortBy = signal('featured');

  readonly cats = [
    { v: 'all',      l: 'Todo'           },
    { v: 'skin',     l: 'Skins'          },
    { v: 'merch',    l: 'Merch'          },
    { v: 'giftcard', l: 'Gift cards'     },
    { v: 'pass',     l: 'Pases & boosts' },
  ];

  readonly filtered = computed(() => {
    let list = [...STORE_ITEMS];
    if (this.cat() !== 'all') list = list.filter(i => i.cat === this.cat());
    const s = this.sortBy();
    if (s === 'cheap')     list.sort((a, b) => a.cost - b.cost);
    if (s === 'expensive') list.sort((a, b) => b.cost - a.cost);
    return list;
  });

  getGame(id?: string) { return id ? GAME_BY_ID[id] ?? null : null; }
  rarMeta(r: string)   { return RARITY_META[r as keyof typeof RARITY_META]; }

  catLabel(item: any) {
    if (item.game) return GAME_BY_ID[item.game]?.name ?? '';
    if (item.cat === 'merch')    return 'Merchandising oficial';
    if (item.cat === 'giftcard') return 'Gift card digital';
    return 'Pase de batalla';
  }

  hoverCard(e: MouseEvent, rarity: string, enter: boolean) {
    const el = e.currentTarget as HTMLElement;
    el.style.borderColor = enter ? this.rarMeta(rarity).color : 'var(--border-soft)';
    el.style.transform   = enter ? 'translateY(-3px)' : '';
  }

  buy(item: any) {
    if (!this.auth.isLoggedIn()) return;
    if (this.auth.tokens() < item.cost) {
      this.toast.push({ title: 'Tokens insuficientes', body: `Te faltan ${fmtNum(item.cost - this.auth.tokens())} tokens.`, tone: 'danger' });
      return;
    }
    this.auth.spendTokens(item.cost);
    this.toast.push({ title: '¡Canjeado!', body: `${item.name} se ha añadido a tu inventario.`, tone: 'emerald' });
  }
}
