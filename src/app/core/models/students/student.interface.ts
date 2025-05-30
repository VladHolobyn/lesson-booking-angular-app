import {UserShort} from '../auth/user-short.interface';
import {CourseShort} from '../courses/course-short.interface';

export enum EnrollmentState{
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED'
}

export interface Student{
  id: number
  state: EnrollmentState
  student: UserShort
  course: CourseShort
  startedAt: string
}
