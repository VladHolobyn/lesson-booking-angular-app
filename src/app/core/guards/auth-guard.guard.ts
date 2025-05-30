import {inject} from '@angular/core';
import {CanActivateFn, Router} from '@angular/router';
import {AuthService} from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const user = authService.getCurrentUser();
  const allowedRoles = route.data['roles'] as string[];

  if (user && allowedRoles.includes(user.role)) {
    return true
  }

  router.navigate(['auth', 'login'])
  return false;
};
