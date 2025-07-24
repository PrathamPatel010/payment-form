import { Routes } from '@angular/router';
import { ContributionComponent } from '@features/contribution/contribution.component';
import { PaymentSuccessComponent } from '@pages/index';

export const routes: Routes = [
  { path: '', pathMatch: 'full', component: ContributionComponent },
  { path: 'payment-success', component: PaymentSuccessComponent },
];
