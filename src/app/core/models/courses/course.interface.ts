
import {UserShort} from '../auth/user-short.interface';
import {CourseState} from './course-state';

export interface Course {
  id: number
  name: string
  description: string
  state: CourseState,
  instructor?: UserShort
}
