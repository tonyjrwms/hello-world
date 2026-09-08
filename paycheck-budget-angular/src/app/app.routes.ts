import { Routes } from '@angular/router';

/**
 * Each route lazy-loads its page component with `loadComponent`, so the
 * Envelopes and History screens ship as separate JS chunks instead of
 * bloating the initial bundle.
 */
export const routes: Routes = [
  { path: '', redirectTo: 'envelopes', pathMatch: 'full' },
  {
    path: 'envelopes',
    loadComponent: () =>
      import('./pages/envelopes-page/envelopes-page').then((m) => m.EnvelopesPage),
  },
  {
    path: 'history',
    loadComponent: () => import('./pages/history-page/history-page').then((m) => m.HistoryPage),
  },
  { path: '**', redirectTo: 'envelopes' },
];
