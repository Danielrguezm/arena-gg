import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent),
  },
  {
    path: 'tournaments',
    loadComponent: () => import('./features/tournaments/tournament-list/tournament-list.component').then(m => m.TournamentListComponent),
  },
  {
    path: 'tournaments/:id',
    loadComponent: () => import('./features/tournaments/tournament-detail/tournament-detail.component').then(m => m.TournamentDetailComponent),
  },
  {
    path: 'store',
    loadComponent: () => import('./features/store/store.component').then(m => m.StoreComponent),
  },
  {
    path: 'ranking',
    loadComponent: () => import('./features/ranking/ranking.component').then(m => m.RankingComponent),
  },
  {
    path: 'profile',
    loadComponent: () => import('./features/profile/profile.component').then(m => m.ProfileComponent),
    canActivate: [authGuard],
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent),
  },
  { path: '**', redirectTo: '' },
];
