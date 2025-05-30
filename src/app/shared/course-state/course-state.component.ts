import {NgClass} from '@angular/common';
import {Component, Input} from '@angular/core';
import {SlotState} from '../../core/models/bookings/slot.interface';
import {CourseState} from '../../core/models/courses/course-state';
import {EnrollmentState} from '../../core/models/students/student.interface';

@Component({
  selector: 'app-course-state',
  imports: [
    NgClass
  ],
  templateUrl: './course-state.component.html',
  styleUrl: './course-state.component.scss'
})
export class CourseStateComponent {
  protected readonly CourseState = CourseState;
  protected readonly EnrollmentState = EnrollmentState;
  protected readonly SlotState = SlotState;

  @Input() state?: CourseState;
  @Input() studentState?: EnrollmentState;
  @Input() slotState?: SlotState;
}
