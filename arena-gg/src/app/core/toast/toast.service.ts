import { Injectable, signal } from '@angular/core';

export interface Toast {
  id: number;
  title: string;
  body?: string;
  tone?: 'gold' | 'emerald' | 'danger' | 'default';
  duration?: number;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private _counter = 0;
  readonly toasts = signal<Toast[]>([]);

  push(toast: Omit<Toast, 'id'>) {
    const id = ++this._counter;
    this.toasts.update(list => [...list, { id, ...toast }]);
    setTimeout(() => this.dismiss(id), toast.duration ?? 4200);
  }

  dismiss(id: number) {
    this.toasts.update(list => list.filter(t => t.id !== id));
  }
}
