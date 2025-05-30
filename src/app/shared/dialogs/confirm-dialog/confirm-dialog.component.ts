import {Component, inject, OnInit} from '@angular/core';
import {MatButton} from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle
} from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog',
  imports: [
    MatDialogContent,
    MatDialogActions,
    MatButton,
    MatDialogClose,
    MatDialogTitle
  ],
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.scss'
})
export class ConfirmDialogComponent implements OnInit {

  readonly data? =inject(MAT_DIALOG_DATA)

  message:string = 'Are you sure you want to do that?'

  ngOnInit(): void {
    if (this.data?.message) {
      this.message = this.data.message;
    }
  }
}
