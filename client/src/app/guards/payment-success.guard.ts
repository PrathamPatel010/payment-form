import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const paymentSuccessGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const navigationId = window.history.state?.navigationId;
  return navigationId ? true : router.createUrlTree(['/']);
};
