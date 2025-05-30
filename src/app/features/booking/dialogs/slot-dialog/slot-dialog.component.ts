import {Component, inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatOption} from "@angular/material/autocomplete";
import {MatButton} from '@angular/material/button';
import {MAT_DATE_LOCALE, provideNativeDateAdapter} from '@angular/material/core';
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from '@angular/material/datepicker';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent, MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import {MatIcon} from '@angular/material/icon';
import {MatFormField, MatInput, MatLabel, MatSuffix} from "@angular/material/input";
import {MatSelect} from '@angular/material/select';
import {MatTimepicker, MatTimepickerInput, MatTimepickerToggle} from '@angular/material/timepicker';
import {Slot} from '../../../../core/models/bookings/slot.interface';
import {CoursePreview} from '../../../../core/models/courses/course-preview.interface';
import {CourseState} from '../../../../core/models/courses/course-state';
import {CourseService} from '../../../../core/services/course.service';

@Component({
  selector: 'app-slot-dialog',
  imports: [
    FormsModule,
    MatButton,
    MatDialogActions,
    MatDialogContent,
    MatDialogTitle,
    MatFormField,
    MatIcon,
    MatInput,
    MatLabel,
    MatOption,
    ReactiveFormsModule,
    MatButton,
    MatDialogClose,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatDatepicker,
    MatTimepickerInput,
    MatTimepicker,
    MatTimepickerToggle,
    MatSuffix,
    MatSelect
  ],
  providers: [
    provideNativeDateAdapter(),
    {provide: MAT_DATE_LOCALE, useValue: 'en-GB'},
  ],
  templateUrl: './slot-dialog.component.html',
  styleUrl: './slot-dialog.component.scss'
})
export class SlotDialogComponent implements OnInit{
  readonly today: Date = new Date();

  form = new FormGroup({
    date: new FormControl(this.today, Validators.required),
    startTime: new FormControl(this.today, Validators.required),
    endTime: new FormControl(this.today, Validators.required),
    courseId: new FormControl(-1, Validators.required)
  })


  courses: CoursePreview[] = []

  readonly data?: Slot = inject(MAT_DIALOG_DATA);
  readonly dialogRef: MatDialogRef<SlotDialogComponent> = inject(MatDialogRef<SlotDialogComponent>)
  readonly courseService: CourseService = inject(CourseService);

  ngOnInit() {
    this.courseService.getUserCourses().subscribe({
      next: value => this.courses = value
    })

    if (this.data) {
      this.form.patchValue({
        courseId: this.data.course.id,
        date: new Date(this.data.startTime),
        startTime: new Date(this.data.startTime),
        endTime:  new Date(this.data.endTime),
      })
    }

  }

  submit() {
    if (this.form.valid) {
      const startDate = new Date(this.form.value.date!);
      startDate.setHours(this.form.value.startTime!.getHours())
      startDate.setMinutes(this.form.value.startTime!.getMinutes())

      const endDate = new Date(this.form.value.date!);
      endDate.setHours(this.form.value.endTime!.getHours())
      endDate.setMinutes(this.form.value.endTime!.getMinutes())

      this.dialogRef.close({
        courseId: this.form.value.courseId,
        startTime: startDate,
        endTime: endDate
      })
    }
  }

  protected readonly CourseState = CourseState;
}
