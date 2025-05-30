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
  protected readonly UserRole = UserRole;

  readonly authService = inject(AuthService);
  readonly router = inject(Router)

  @Input()
  isShort: boolean = true;


  logout() {
    this.authService.logout();
    this.router.navigate(['auth', 'login'])
  }

}
