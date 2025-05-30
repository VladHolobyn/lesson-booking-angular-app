import { Routes } from '@angular/router';
import {authGuard} from './core/guards/auth-guard.guard';
import {UserRole} from './core/models/auth/user-role';
import {BookingComponent} from './features/booking/booking.component';
import {CourseDetailsComponent} from './features/course-details/course-details.component';
import {CoursesComponent} from './features/courses/courses.component';
import {LoginComponent} from './features/auth/login/login.component';
import {RegistrationComponent} from './features/auth/registration/registration.component';
import {CenteredLayoutComponent} from './layouts/centered-layout/centered-layout.component';
import {MainLayoutComponent} from './layouts/main-layout/main-layout.component';

export const routes: Routes = [
  {
    path: 'auth',
    component: CenteredLayoutComponent,
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegistrationComponent }
    ]
  },
  {
    path: '', component: MainLayoutComponent,
    canActivate:[authGuard], data: { roles: [UserRole.INSTRUCTOR, UserRole.STUDENT]},
    children: [
      { path: '', redirectTo: '/courses', pathMatch: 'full' },
      { path: 'courses', component: CoursesComponent, data: { roles: [UserRole.INSTRUCTOR, UserRole.STUDENT] }},
      { path: 'courses/:id' , component: CourseDetailsComponent, data: { roles: [UserRole.INSTRUCTOR, UserRole.STUDENT] }},
      { path: 'booking', component: BookingComponent, data: { roles: [UserRole.INSTRUCTOR, UserRole.STUDENT] }},
    ]
  },
];
