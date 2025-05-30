import {Component, computed, inject, OnInit, signal} from '@angular/core';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatOption, MatRipple} from '@angular/material/core';
import {MatDialog} from '@angular/material/dialog';
import {MatIcon} from '@angular/material/icon';
import {MatFormField, MatLabel} from '@angular/material/input';
import {MatSelect, MatSelectChange} from '@angular/material/select';
import {RouterLink} from '@angular/router';
import {UserRole} from '../../core/models/auth/user-role';
import {CoursePreview} from '../../core/models/courses/course-preview.interface';
import {CourseState} from '../../core/models/courses/course-state';
import {AuthService} from '../../core/services/auth.service';
import {CourseService} from '../../core/services/course.service';
import {ResponsiveService} from '../../core/services/ui/responsive.service';
import {CourseStateComponent} from '../../shared/course-state/course-state.component';
import {CourseDialogComponent} from './dialogs/course-dialog/course-dialog.component';

@Component({
  selector: 'app-courses',
  imports: [
    MatButton,
    MatIcon,
    MatRipple,
    RouterLink,
    CourseStateComponent,
    MatIconButton,
    MatFormField,
    MatSelect,
    MatOption,
    MatLabel
  ],
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.scss'
})
export class CoursesComponent implements OnInit{
  protected readonly UserRole = UserRole;
  protected readonly CourseState = CourseState;

  readonly courseService: CourseService = inject(CourseService)
  readonly authService = inject(AuthService);
  readonly responsiveService = inject(ResponsiveService);
  readonly dialog = inject(MatDialog);

  showFilters: boolean = true;

  courses = signal<CoursePreview[]>([]);
  selectedStates = signal<CourseState[]>([]);
  filteredList = computed(() => {
    if (!this.selectedStates().length) return this.courses();
    else return this.courses().filter(c => this.selectedStates().includes(c.state))
  })



  ngOnInit() {
    this.loadData();
  }

  handleCreate() {
    this.openDialog().subscribe({
      next: value => {
        if (value) {
          this.courseService.createCourse(value).subscribe({
            next: () => this.loadData(),
            error: () => console.error("Course is not created")
          })
        }
      }
    })
  }

  private openDialog() {
    const dialogRef = this.dialog.open(CourseDialogComponent, {
      minWidth: 300,
      maxWidth: 400,
      width: '100%'
    });

    return dialogRef.afterClosed();
  }

  private loadData() {
    this.courseService.getUserCourses().subscribe({
      next: value => this.courses.set(value),
      error: () => console.error("Unable to get user courses")
    })
  }

  stateSelected($event: MatSelectChange<any>) {
    this.selectedStates.set($event.value);
  }
}
