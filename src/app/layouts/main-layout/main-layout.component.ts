import {NgClass} from '@angular/common';
import {Component, computed, inject} from '@angular/core';
import {MatAnchor, MatButton, MatIconButton} from '@angular/material/button';
import {MatDialog} from '@angular/material/dialog';
import {MatIcon} from '@angular/material/icon';
import {MatSidenavModule} from '@angular/material/sidenav';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {UserRole} from '../../core/models/auth/user-role';
import {AuthService} from '../../core/services/auth.service';
import {ResponsiveService} from '../../core/services/ui/responsive.service';
import {InboxDialogComponent} from '../../features/inbox/inbox-dialog/inbox-dialog.component';
import {UserComponent} from '../../shared/user/user.component';

@Component({
  selector: 'app-main',
  imports: [
    RouterOutlet,
    MatSidenavModule,
    MatAnchor,
    MatIcon,
    RouterLink,
    RouterLinkActive,
    MatIconButton,
    UserComponent,
    NgClass,
    MatButton
  ],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss'
})
export class MainLayoutComponent {
  protected readonly UserRole = UserRole;

  readonly authService = inject(AuthService);
  readonly dialog = inject(MatDialog);
  responsiveService = inject(ResponsiveService)


  isOpened: boolean = false

  sidenavMode = computed(() => {
    if (this.responsiveService.isPhoneScreen()) {
      return 'over'
    }
    return 'side'
  })

  openInboxDialog() {
    this.dialog.open(InboxDialogComponent, {
      width: '60vw',
      maxWidth: '800px',
    })
  }

}
