import {Component, inject, OnInit} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {MatButton, MatIconButton} from '@angular/material/button';
import {
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle
} from '@angular/material/dialog';
import {MatIcon} from '@angular/material/icon';
import {Router} from '@angular/router';
import {Invitation} from '../../core/models/students/invitation.interface';
import {AuthService} from '../../core/services/auth.service';
import {MembershipService} from '../../core/services/membership.service';
import {
  ConfirmDialogComponent
} from '../../shared/dialogs/confirm-dialog/confirm-dialog.component';

@Component({
  imports: [
    MatButton,
    MatDialogActions,
    MatDialogContent,
    MatDialogTitle,
    ReactiveFormsModule,
    MatDialogClose,
    MatButton,
    MatIconButton,
    MatIcon,
  ],
  selector: 'app-inbox-dialog',
  styleUrl: './inbox-dialog.component.scss',
  templateUrl: './inbox-dialog.component.html'
})
export class InboxDialogComponent implements OnInit{
  readonly authService = inject(AuthService)
  readonly membershipService = inject(MembershipService)
  readonly dialog = inject(MatDialog)
  readonly router = inject(Router)

  invitations?: Invitation[]

  ngOnInit(): void {
    this.loadInvitations()
  }

  declineInvitation(id: number) {
    this.dialog.open(ConfirmDialogComponent).afterClosed().subscribe({
      next: value => {
        if(value) {
          this.membershipService.declineInvitation(id).subscribe({
            next: () => this.loadInvitations()
          })
        }
      }
    })
  }

  acceptInvitation(id: number) {
    this.dialog.open(ConfirmDialogComponent).afterClosed().subscribe({
      next: value => {
        if(value) {
          this.membershipService.acceptInvitation(id).subscribe({
            next: () => this.loadInvitations()
          })
        }
      }
    })
  }

  private loadInvitations() {
    this.membershipService.getUserInvitations(this.authService.getCurrentUser()!.id).subscribe({
      next: value => this.invitations = value,
      error: err => console.log(err)
    })
  }
}
