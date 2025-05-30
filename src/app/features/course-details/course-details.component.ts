import {NgClass} from '@angular/common';
import {Component, inject, OnInit} from '@angular/core';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatDialog} from '@angular/material/dialog';
import {MatIcon} from '@angular/material/icon';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';
import {MatTab, MatTabGroup} from '@angular/material/tabs';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {UserRole} from '../../core/models/auth/user-role';
import {CourseState} from '../../core/models/courses/course-state';
import {Course} from '../../core/models/courses/course.interface';
import {Invitation} from '../../core/models/students/invitation.interface';
import {EnrollmentState, Student} from '../../core/models/students/student.interface';
import {AuthService} from '../../core/services/auth.service';
import {CourseService} from '../../core/services/course.service';
import {MembershipService} from '../../core/services/membership.service';
import {ResponsiveService} from '../../core/services/ui/responsive.service';
import {CourseStateComponent} from '../../shared/course-state/course-state.component';
import {
  ConfirmDialogComponent
} from '../../shared/dialogs/confirm-dialog/confirm-dialog.component';
import {CourseDialogComponent} from '../courses/dialogs/course-dialog/course-dialog.component';
import {InvitationDialogComponent} from './dialogs/invitation-dialog/invitation-dialog.component';



@Component({
  selector: 'app-course-details',
  imports: [
    MatIcon,
    MatButton,
    RouterLink,
    CourseStateComponent,
    MatTabGroup,
    MatTab,
    MatIconButton,
    MatMenu,
    MatMenuItem,
    MatMenuTrigger,
    NgClass,
  ],
  templateUrl: './course-details.component.html',
  styleUrl: './course-details.component.scss'
})
export class CourseDetailsComponent implements OnInit{
  protected readonly CourseState = CourseState;
  protected readonly EnrollmentState = EnrollmentState;
  protected readonly UserRole = UserRole;

  readonly dialog = inject(MatDialog);
  readonly courseService = inject(CourseService)
  readonly authService = inject(AuthService)
  readonly membershipService = inject(MembershipService)
  readonly responsiveService = inject(ResponsiveService)
  readonly route = inject(ActivatedRoute);
  readonly router = inject(Router);

  course?: Course;
  invitations?: Invitation[];
  students?: Student[];
  selectedStudent?: Student;
  isToggle: boolean = false;


  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadCourseData(Number.parseInt(id));
    }
  }

  editCourse() {
    this.dialog.open(CourseDialogComponent, {
      data: this.course,
      minWidth: 300,
      maxWidth: 400,
      width: '100%'
    }).afterClosed().subscribe({
      next: value => {
        if (value) {
          const body = {...this.course, ...value};
          this.courseService.updateCourse(this.course!.id, body).subscribe({
            next: () => this.loadCourseData(this.course!.id),
            error: () => console.error("Unable to update")
          })
        }
      }
    })
  }

  removeCourse() {
    this.dialog.open(ConfirmDialogComponent, {
      minWidth: 300,
      maxWidth: 400,
      width: '100%'
    }).afterClosed().subscribe({
      next: value => {
        if (value) {
          this.courseService.deleteCourse(this.course!.id).subscribe({
            next: () => this.router.navigate(["/"]),
            error: () => console.error("Unable to delete")
          })
        }
      }
    })
  }

  approveCourse() {
    if (this.course){
      this.courseService.approveCourse(this.course.id).subscribe({
        next: () => this.loadCourseData(this.course!.id),
        error: () => console.error("Course is not approved")
      })
    }
  }

  archiveCourse() {
    if (this.course){
      this.courseService.archiveCourse(this.course.id).subscribe({
        next: () => this.loadCourseData(this.course!.id),
        error: () => console.error("Course is not archived")
      })
    }
  }

  private loadCourseData(id: number) {
    this.courseService.getCourseDetails(id).subscribe({
      next: value => {
        this.course = value;
        this.loadCourseInvitations();
        this.loadCourseStudents();
      },
      error: () => console.error("Cannot load course data")
    })
  }


  // ------------------ Students

  openInvitationDialog() {
    this.dialog.open(InvitationDialogComponent, {
      minWidth: 300,
      maxWidth: 400,
      width: '100%'
    }).afterClosed().subscribe({
      next: (value) => {
        if (value) {
          this.membershipService.inviteUser(value, this.course!.id).subscribe({
              next: () => this.loadCourseInvitations(),
              error: () => console.error("Cannot send an invitation")
            })
        }
      }
    })
  }

  cancelInvitation(id: number) {
    this.dialog.open(ConfirmDialogComponent).afterClosed().subscribe({
      next: value => {
        if (value) {
          this.membershipService.cancelInvitation(id).subscribe({
            next: () => this.loadCourseInvitations(),
            error: () => console.error("Invitation is not canceled")
          })
        }
      }
    });

  }

  graduateStudent(enrollmentId: number) {
    this.dialog.open(ConfirmDialogComponent).afterClosed().subscribe({
      next: value => {
        if (value) {
          this.membershipService.graduateStudent(enrollmentId).subscribe({
            next: () => {
              this.loadCourseStudents();
              this.selectedStudent = undefined;
            },
            error: () => console.error("Student is not graduated")
          })
        }
      }
    });
  }

  removeStudentFromCourse(enrollmentId: number) {
    this.dialog.open(ConfirmDialogComponent).afterClosed().subscribe({
      next: value => {
        if (value) {
          this.membershipService.removeStudentFromCourse(enrollmentId).subscribe({
            next: () => {
              this.loadCourseStudents();
              this.selectedStudent = undefined;
            },
            error: () => console.error("Student is not removed")
          })
        }
      }
    });
  }

  selectStudent(student: Student) {
    this.selectedStudent = student;
  }


  private loadCourseStudents() {
    if (this.course) {
      this.membershipService.getCourseStudents(this.course.id).subscribe({
        next: value => this.students = value,
        error: () => console.error("Cannot load course students!")
      })
    }
  }

  private loadCourseInvitations() {
    this.membershipService.getCourseInvitations(this.course!.id).subscribe({
      next: value => {
        this.invitations = value
      },
      error: () => console.error("Cannot load course invitations!")
    })
  }

  getDate(str: string) {
    return new Date(str);
  }

}
