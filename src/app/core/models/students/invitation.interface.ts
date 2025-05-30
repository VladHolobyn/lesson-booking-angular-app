import {UserShort} from '../auth/user-short.interface';
import {CourseShort} from '../courses/course-short.interface';

export  interface Invitation {
  id: number;
  course: CourseShort;
  student: UserShort;
  instructor: UserShort;
  sentAt: string;
}
