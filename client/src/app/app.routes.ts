import { Routes } from '@angular/router';
import { ContributionComponent } from '@features/contribution/contribution.component';
import { PaymentSuccessComponent } from '@pages/index';
import { paymentSuccessGuard } from './guards';

export const routes: Routes = [
  { path: '', pathMatch: 'full', component: ContributionComponent },
  {
    path: 'payment-success',
    component: PaymentSuccessComponent,
    canActivate: [paymentSuccessGuard],
  },
  { path: '**', redirectTo: '/' },
];
