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
import {UserShort} from '../../../../core/models/auth/user-short.interface';
import {MembershipService} from '../../../../core/services/membership.service';

@Component({
  selector: 'app-student-search-dialog',
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
  templateUrl: './student-search-dialog.component.html',
  styleUrl: './student-search-dialog.component.scss'
})
export class StudentSearchDialogComponent {
  form: FormGroup = new FormGroup({
    email: new FormControl('', Validators.required),
  })

  filteredUsers = signal<UserShort[]>([])
  selectedUser?: UserShort;

  data?: any = inject(MAT_DIALOG_DATA);
  membershipService= inject(MembershipService)
  constructor(
    private dialogRef: MatDialogRef<StudentSearchDialogComponent>,
  ) {}

  onInput() {
    if (this.data.courseId) {
      this.membershipService.getCourseStudents(this.data.courseId).subscribe({
        next: value => this.filteredUsers.set(value.map(enr => enr.student)),
        error: err => console.log(err)
      })
    }

  }

  onOptionSelected($event: MatAutocompleteSelectedEvent) {
    this.selectedUser = this.filteredUsers().find(user => user.id === $event.option.value)
  }

  inviteUser() {
    this.dialogRef.close(this.selectedUser);
  }

}
