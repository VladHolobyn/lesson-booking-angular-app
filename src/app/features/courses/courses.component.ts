import {Component, inject, OnInit} from '@angular/core';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatOption, MatRipple} from '@angular/material/core';
import {MatDialog} from '@angular/material/dialog';
import {MatIcon} from '@angular/material/icon';
import {MatFormField, MatLabel} from '@angular/material/input';
import {MatSelect} from '@angular/material/select';
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

  readonly courseService: CourseService = inject(CourseService)
  readonly dialog = inject(MatDialog);
  readonly authService = inject(AuthService);

  courseList?: CoursePreview[]
  readonly responsiveService = inject(ResponsiveService);
  showFilters: boolean = true;

  ngOnInit() {
    this.loadData();
  }

  handleCreate() {
    this.openDialog().subscribe({
      next: value => {
        if (value) {
          this.courseService.createCourse(value).subscribe({
            next: () => this.loadData(),
            error: () => console.error("course create")
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
      next: value => this.courseList = value,
      error: () => console.error("Unable to get user courses")
    })
  }

  protected readonly CourseState = CourseState;
}
