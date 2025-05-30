import {Component, inject, Injectable, OnInit} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatButton, MatIconButton} from '@angular/material/button';
import {DateAdapter} from '@angular/material/core';
import {
  DateRange,
  MAT_DATE_RANGE_SELECTION_STRATEGY,
  MatDatepickerToggle,
  MatDateRangeInput,
  MatDateRangePicker,
  MatDateRangeSelectionStrategy,
  MatEndDate,
  MatStartDate
} from '@angular/material/datepicker';
import {MatDialog} from '@angular/material/dialog';
import {MatIcon} from '@angular/material/icon';
import {MatFormField, MatLabel, MatSuffix} from '@angular/material/input';
import {MatMenu, MatMenuContent, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';
import {MatDrawerContainer, MatDrawerContent} from '@angular/material/sidenav';
import {forkJoin, map} from 'rxjs';
import {UserRole} from '../../core/models/auth/user-role';
import {ScheduleItem} from '../../core/models/bookings/schedule-item.interface';
import {SlotRequest} from '../../core/models/bookings/slot-request.interface';
import {Slot, SlotState} from '../../core/models/bookings/slot.interface';
import {CoursePreview} from '../../core/models/courses/course-preview.interface';
import {CourseState} from '../../core/models/courses/course-state';
import {AuthService} from '../../core/services/auth.service';
import {BookingService} from '../../core/services/booking.service';
import {CourseService} from '../../core/services/course.service';
import {ResponsiveService} from '../../core/services/ui/responsive.service';
import {CourseStateComponent} from '../../shared/course-state/course-state.component';
import {ConfirmDialogComponent} from '../../shared/dialogs/confirm-dialog/confirm-dialog.component';
import {SlotDialogComponent} from './dialogs/slot-dialog/slot-dialog.component';
import {
  StudentSearchDialogComponent
} from './dialogs/student-search-dialog/student-search-dialog.component';

@Injectable()
export class FiveDayRangeSelectionStrategy<D> implements MatDateRangeSelectionStrategy<D> {
  private _dateAdapter = inject<DateAdapter<D>>(DateAdapter<D>);

  selectionFinished(date: D | null): DateRange<D> {
    return this._createFiveDayRange(date);
  }

  createPreview(activeDate: D | null): DateRange<D> {
    return this._createFiveDayRange(activeDate);
  }

  private _createFiveDayRange(date: D | null): DateRange<D> {
    if (date) {
      const start = this._dateAdapter.addCalendarDays(date, -2);
      const end = this._dateAdapter.addCalendarDays(date, 2);
      return new DateRange<D>(start, end);
    }

    return new DateRange<D>(null, null);
  }
}



@Component({
  selector: 'app-booking',
  imports: [
    MatButton,
    MatFormField,
    MatLabel,
    MatDateRangeInput,
    MatDatepickerToggle,
    MatDateRangePicker,
    ReactiveFormsModule,
    MatStartDate,
    MatEndDate,
    MatSuffix,
    MatIcon,
    MatIconButton,
    MatDrawerContainer,
    MatDrawerContent,
    CourseStateComponent,
    MatMenu,
    MatMenuContent,
    MatMenuItem,
    MatMenuTrigger,
  ],
  providers: [
    {provide: MAT_DATE_RANGE_SELECTION_STRATEGY, useClass: FiveDayRangeSelectionStrategy},
  ],
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.scss'
})
export class BookingComponent implements OnInit{
  protected readonly UserRole = UserRole;
  protected readonly SlotState = SlotState;
  protected readonly CourseState = CourseState;
  protected readonly days = ['Нд', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];

  readonly bookingService: BookingService = inject(BookingService);
  readonly authService: AuthService = inject(AuthService);
  readonly courseService: CourseService = inject(CourseService);
  readonly dialog = inject(MatDialog);
  readonly responsiveService = inject(ResponsiveService);

  dateRange = new FormGroup({
    start: new FormControl<Date>(new Date(), Validators.required),
    end: new FormControl<Date>(new Date(), Validators.required),
  });

  slots: Map<string, ScheduleItem[]> = new Map();
  courses: CoursePreview[] = []


  ngOnInit() {
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + 5);
    this.dateRange.patchValue({start: today, end: futureDate});

    this.courseService.getUserCourses().subscribe({
      next: value => this.courses = value
    })

    this.loadSlots();
  }

  handleDateRangeChange() {
    const startDay = new Date(
      this.dateRange.value.start!.getFullYear(), this.dateRange.value.start!.getMonth(),
      this.dateRange.value.start!.getDate(), 0,0,0,0
    )
    startDay.setMinutes(startDay.getMinutes() - startDay.getTimezoneOffset())

    const endDay = new Date(
      this.dateRange.value.end!.getFullYear(), this.dateRange.value.end!.getMonth(),
      this.dateRange.value.end!.getDate(), 23,59,59,0
    )
    endDay.setMinutes(endDay.getMinutes() - endDay.getTimezoneOffset())

    this.dateRange.patchValue({start: startDay, end: endDay});
    this.loadSlots();
  }

  handleCreateDialog() {
    this.dialog.open(SlotDialogComponent).afterClosed().subscribe({
      next: value => {
        if (value) {
          this.bookingService.createSlot({
            courseId: value.courseId,
            startTime: value.startTime.toISOString(),
            endTime: value.endTime.toISOString(),
          }).subscribe({
            next: () => this.loadSlots()
          })
        }
      }
    })
  }

  handleEditDialog(slot: Slot) {
    this.dialog.open(SlotDialogComponent, {data: slot}).afterClosed().subscribe({
      next: value => {
        if (value) {
          const body: SlotRequest = {
            courseId: value.courseId,
            startTime: value.startTime.toISOString(),
            endTime: value.endTime.toISOString()
          }
          this.bookingService.updateSlot(slot.id, body).subscribe({
            next: () => this.loadSlots()
          })
        }
      }
    })
  }

  publishSlot(slotId: number) {
    this.dialog.open(ConfirmDialogComponent).afterClosed().subscribe({
      next: value => {
        if (value) {
          this.bookingService.publishSlot(slotId).subscribe({
            next: () => this.loadSlots()
          })
        }
      }
    })
  }

  deleteOrCancel(slotId: number) {
    this.dialog.open(ConfirmDialogComponent).afterClosed().subscribe({
      next: value => {
        if (value) {
          this.bookingService.deleteOrCancelSlot(slotId).subscribe({
            next: () => this.loadSlots()
          })
        }
      }
    })
  }

  assignPerson(slot: Slot) {
    this.dialog.open(StudentSearchDialogComponent, {
      data: {courseId: slot.course.id},
      width: '400px'
    }).afterClosed().subscribe({
      next: value => {
        if (value) {
          this.bookingService.assignStudent(slot.id, value.id).subscribe({
            next: () => this.loadSlots()
          })
        }
      }
    })
  }

  unassignStudent(slotId: number) {
    this.dialog.open(ConfirmDialogComponent).afterClosed().subscribe({
      next: value => {
        if (value) {
          this.bookingService.unassignStudent(slotId).subscribe({
            next: () => this.loadSlots()
          })
        }
      }
    })
  }

  reserve(slotId: number) {
    this.dialog.open(ConfirmDialogComponent).afterClosed().subscribe({
      next: value => {
        if (value) {
          this.bookingService.reserveSlot(slotId).subscribe({
            next: () => this.loadSlots()
          })
        }
      }
    })
  }

  cancelReservation(slotId: number) {
    this.dialog.open(ConfirmDialogComponent).afterClosed().subscribe({
      next: value => {
        if (value) {
          this.bookingService.cancelSlotReservation(slotId).subscribe({
            next: () => this.loadSlots()
          })
        }
      }
    })
  }


  formatTime(dateStr:string) {
    const date = new Date(dateStr);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  getDate(str: string) {
    return new Date(str);
  }


  private loadSlots() {
    if (this.dateRange.valid) {

      this.bookingService.getSlots(this.dateRange.value.start!, this.dateRange.value.end!).subscribe({
        next: value => {
          this.slots = new Map();

          for (const slot of value) {
            const day = slot.startTime.split('T')[0];

            if (!this.slots.has(day)) {
              this.slots.set(day, []);
            }
            this.slots.get(day)!.push({
              data: slot,
              startTime: slot.startTime, endTime: slot.endTime
            });
          }

          const sortedEntries = Array.from(this.slots.entries()).sort(([keyA], [keyB]) => {
            return new Date(keyA).getTime() - new Date(keyB).getTime();
          });
          this.slots = new Map(sortedEntries);
          for (const [day, slots] of this.slots) {
            slots.sort((a, b) => a.startTime.localeCompare(b.startTime));
          }
        }
      })
    }
  }

}
