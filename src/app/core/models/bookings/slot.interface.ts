import {UserShort} from '../auth/user-short.interface';
import {CourseShort} from '../courses/course-short.interface';

export enum SlotState {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  RESERVED = 'RESERVED',
  CANCELLED = 'CANCELLED'
}

export interface Slot {
  id: number
  startTime: string
  endTime: string
  state: SlotState
  course: CourseShort
  student: UserShort
  instructor: UserShort
}
