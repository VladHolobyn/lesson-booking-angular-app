import {Component, inject, Input} from '@angular/core';
import {MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {Router} from '@angular/router';
import {UserRole} from '../../core/models/auth/user-role';
import {AuthService} from '../../core/services/auth.service';

@Component({
  selector: 'app-user',
  imports: [
    MatIconButton,
    MatIcon,
  ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent {

  @Input()
  isShort: boolean = true;

  authService = inject(AuthService);
  router = inject(Router)

  logOut() {
    this.authService.logout();
    this.router.navigate(['auth', 'login'])
  }

  protected readonly UserRole = UserRole;
}
