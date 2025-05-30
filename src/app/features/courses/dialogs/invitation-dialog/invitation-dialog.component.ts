import {Component, inject, signal} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {
  MatAutocomplete,
  MatAutocompleteSelectedEvent,
  MatAutocompleteTrigger,
  MatOption
} from '@angular/material/autocomplete';
import {MatButton} from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions, MatDialogClose,
  MatDialogContent, MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import {MatFormField, MatInput, MatLabel} from "@angular/material/input";
import {User} from '../../../../core/models/auth/user.interface';
import {UserService} from '../../../../core/services/user.service';

@Component({
  selector: 'app-invitation-dialog',
  imports: [
    FormsModule,
    MatButton,
    MatDialogActions,
    MatDialogContent,
    MatDialogTitle,
    MatFormField,
    MatInput,
    MatLabel,
    ReactiveFormsModule,
    MatFormField,
    MatDialogClose,
    MatAutocompleteTrigger,
    MatAutocomplete,
    MatOption
  ],
  templateUrl: './invitation-dialog.component.html',
  styleUrl: './invitation-dialog.component.scss'
})
export class InvitationDialogComponent {
  form: FormGroup = new FormGroup({
    email: new FormControl('', Validators.required),
  })

  filteredUsers = signal<User[]>([])
  selectedUser?: User;

  data?: any = inject(MAT_DIALOG_DATA);
  userService = inject(UserService)
  constructor(
    private dialogRef: MatDialogRef<InvitationDialogComponent>,
  ) {}

  onInput() {
    if (this.form.valid) {
      this.userService.findUserByEmail(this.form.value.email).subscribe({
        next: value => {
          this.filteredUsers.set(value)
        },
        error: err => console.log(err)
      })
      console.log(this.filteredUsers())
    }

  }

  onOptionSelected($event: MatAutocompleteSelectedEvent) {
    this.selectedUser = this.filteredUsers().find(user => user.email === $event.option.value)
  }

  inviteUser() {
    this.dialogRef.close(this.selectedUser);
  }

}
