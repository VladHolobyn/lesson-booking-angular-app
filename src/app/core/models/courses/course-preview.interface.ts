import {UserShort} from "../auth/user-short.interface";
import {CourseState} from './course-state';

export interface CoursePreview {
  id: number
  name: string
  state: CourseState
  instructor?: UserShort
}
