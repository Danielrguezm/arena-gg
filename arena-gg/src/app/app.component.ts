import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './layout/header/header.component';
import { ToastComponent } from './shared/components/toast/toast.component';
import { ConfirmModalComponent } from './shared/components/confirm-modal/confirm-modal.component';
import { TeamModalComponent } from './shared/components/team-modal/team-modal.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, ToastComponent, ConfirmModalComponent, TeamModalComponent],
  template: `
    <app-header/>
    <main style="min-height:calc(100vh - 70px)">
      <router-outlet/>
    </main>
    <app-toast/>
    <app-team-modal/>
    <app-confirm-modal/>
  `,
})
export class AppComponent {}


