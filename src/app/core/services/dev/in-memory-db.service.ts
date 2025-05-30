import {Injectable} from '@angular/core';
import {InMemoryDbService, RequestInfo,} from 'angular-in-memory-web-api';
import {RegisterRequest} from '../../models/auth/register-request';
import {UserRole} from '../../models/auth/user-role';
import {User} from '../../models/auth/user.interface';
import {SlotRequest} from '../../models/bookings/slot-request.interface';
import {Slot, SlotState} from '../../models/bookings/slot.interface';
import {CourseState} from '../../models/courses/course-state';
import {Course} from '../../models/courses/course.interface';
import {Invitation} from '../../models/students/invitation.interface';
import {EnrollmentState, Student} from '../../models/students/student.interface';

@Injectable({
  providedIn: 'root'
})
export class InMemoryDataService implements InMemoryDbService {

  private currentUser?: User;

  createDb() {
    const users: User[] = [
      { id: 1, firstName: 'Охрім', lastName: 'Франко', email: 'test@gmail.com', role: UserRole.INSTRUCTOR },
      { id: 2, firstName: 'Югина', lastName: 'Гришко', email: 'test2@gmail.com', role: UserRole.STUDENT },
      { id: 3, firstName: 'Ядвіга', lastName: 'Захарчук', email: 'test3@gmail.com', role: UserRole.STUDENT },
    ];

    const courses: Course[] = [
      {id: 1, name: 'English', description: '1', state: CourseState.APPROVED, instructor: users[0]},
      {id: 2, name: 'Math', description: '1', state: CourseState.ARCHIVED, instructor: users[0]},
    ]

    const invitations = [
      {
        id: 1, course: courses[0], courseId: courses[0].id, userId: users[1].id,
        student: users[1], instructor: users[0], sentAt: new Date().toDateString()
      }
    ];

    const enrollments = [
      {
        id: 1, state: EnrollmentState.ACTIVE,
        course: courses[0], courseId: courses[0].id, student: users[2],
        startedAt: new Date().toDateString()
      }
    ];

    const slots: Slot[] = [
      {
        id: 1, state: SlotState.DRAFT,
        startTime: new Date('2025-05-31T10:30:00Z').toISOString(), endTime: new Date('2025-05-31T11:30:00Z').toISOString(),
        course: courses[0],
        student: users[1],
        instructor: users[0],
      }
    ]

    return {
      users, courses, invitations, enrollments, slots
    };
  }


  post(reqInfo: RequestInfo) {
    const { url, req  } = reqInfo;


    if (url.endsWith('/login')) {
      const body = reqInfo.utils.getJsonBody(req);
      const users = (reqInfo.utils.getDb() as any).users;

      const item = users.find((user: User) => user.email === body.email);
      if (item) {
        this.currentUser = item;
        return reqInfo.utils.createResponse$(() => ({
          body: { user: item }, status: 200
        }));
      } else {
        return reqInfo.utils.createResponse$(() => ({
          status: 404, body: { message: 'User not found' }
        }));
      }
    }
    else if (url.endsWith('/register')) {
      const body = reqInfo.utils.getJsonBody(req) as RegisterRequest;
      const users = (reqInfo.utils.getDb() as any).users;
      const id = users.length+1

      const newUser = { ...body, id,  role: UserRole.STUDENT };
      users.push(newUser);
      return reqInfo.utils.createResponse$(() => ({
        status: 201,
        body: id
      }));

    }
    else if (url.endsWith('/approve')) {
      const course = (reqInfo.utils.getDb() as any).courses.find((c: Course) => c.id === reqInfo.id);
      course.state = CourseState.APPROVED
      return reqInfo.utils.createResponse$(() => ({
        status: 200,
        body: {}
      }));
    }
    else if (url.endsWith('/archive')) {
      const course = (reqInfo.utils.getDb() as any).courses.find((c: Course) => c.id === reqInfo.id);
      course.state = CourseState.ARCHIVED
      return reqInfo.utils.createResponse$(() => ({
        status: 200,
        body: {}
      }));

    }

    else if (url.endsWith('/invitations')) {
      const body = reqInfo.utils.getJsonBody(req);
      const invitations =  (reqInfo.utils.getDb() as any).invitations;
      const id = invitations.length+1

      const newInvitation = {
        id, sentAt: new Date().toDateString(),
        courseId: body.courseId, userId: body.studentId,
        course: (reqInfo.utils.getDb() as any).courses.find((c: Course) => c.id === body.courseId),
        student: (reqInfo.utils.getDb() as any).users.find((c: Course) => c.id === body.studentId),
        instructor: (reqInfo.utils.getDb() as any).users[0]
      };
      invitations.push(newInvitation);
      return reqInfo.utils.createResponse$(() => ({
        status: 201,
        body: id
      }));
    }
    else if (url.endsWith('/decline')) {
      const invitations =  (reqInfo.utils.getDb() as any).invitations;
      (reqInfo.utils.getDb() as any).invitations = invitations.filter((i: Invitation) => i.id !== reqInfo.id);
      return reqInfo.utils.createResponse$(() => ({
        status: 204,
        body: {}
      }));
    }
    else if (url.endsWith('/accept')) {
      const invitations =  (reqInfo.utils.getDb() as any).invitations;
      const enrollments =  (reqInfo.utils.getDb() as any).enrollments;
      const id = enrollments.length+1;

      const invitation = invitations.find((i: Invitation) => i.id === reqInfo.id);
      (reqInfo.utils.getDb() as any).invitations = invitations.filter((i: Invitation) => i.id !== reqInfo.id);
      const newEnrollments = {
        id, startedAt: new Date().toDateString(), state: EnrollmentState.ACTIVE,
        courseId: invitation.courseId,
        course: invitation.course,
        student: invitation.student
      };
      enrollments.push(newEnrollments);
      return reqInfo.utils.createResponse$(() => ({
        status: 201,
        body: id
      }));
    }
    else if (url.endsWith('/markAsCompleted')) {
      const enrollments =  (reqInfo.utils.getDb() as any).enrollments;
      const enrollment = enrollments.find((e: Student) => e.id === reqInfo.id);
      enrollment.state = EnrollmentState.COMPLETED;
      return reqInfo.utils.createResponse$(() => ({
        status: 200,
        body: {}
      }));
    }


    else if (url.endsWith('/slots')) {
      const body = reqInfo.utils.getJsonBody(req) as SlotRequest;
      const slots =  (reqInfo.utils.getDb() as any).slots;
      const id = slots.length+1

      const newSlot = {
        id, sentAt: new Date().toDateString(),
        courseId: body.courseId, userId: body.courseId,
        course: (reqInfo.utils.getDb() as any).courses.find((c: Course) => c.id === body.courseId),
        instructor: (reqInfo.utils.getDb() as any).users[0],
        startTime: body.startTime, endTime: body.endTime, state: SlotState.DRAFT
      };
      slots.push(newSlot);
      return reqInfo.utils.createResponse$(() => ({
        status: 201,
        body: id
      }));
    }
    else if (url.endsWith('/publish')) {
      const slot =  (reqInfo.utils.getDb() as any).slots.find((s: Slot) => s.id === reqInfo.id);
      slot.state = SlotState.PUBLISHED;
      return reqInfo.utils.createResponse$(() => ({
        status: 200,
        body: {}
      }));
    }
    else if (url.includes('/assign')) {
      const slot =  (reqInfo.utils.getDb() as any).slots.find((s: Slot) => s.id === reqInfo.id);

      const segments = url.split('/');
      const userId = Number.parseInt(segments[segments.length - 1]);

      slot.student = (reqInfo.utils.getDb() as any).users.find((s: Student) => s.id === userId);
      slot.state = SlotState.RESERVED;
      return reqInfo.utils.createResponse$(() => ({
        status: 200,
        body: {}
      }));
    }
    else if (url.includes('/unassign')) {
      const slot =  (reqInfo.utils.getDb() as any).slots.find((s: Slot) => s.id === reqInfo.id);
      slot.student = null;
      slot.state = SlotState.PUBLISHED;
      return reqInfo.utils.createResponse$(() => ({
        status: 200,
        body: {}
      }));
    }
    else if (url.includes('/reserve')) {
      const slot =  (reqInfo.utils.getDb() as any).slots.find((s: Slot) => s.id === reqInfo.id);

      slot.student = this.currentUser;
      slot.state = SlotState.RESERVED;
      return reqInfo.utils.createResponse$(() => ({
        status: 200,
        body: {}
      }));
    }
    else if (url.includes('/cancel')) {
      const slot =  (reqInfo.utils.getDb() as any).slots.find((s: Slot) => s.id === reqInfo.id);

      slot.student = null;
      slot.state = SlotState.PUBLISHED;
      return reqInfo.utils.createResponse$(() => ({
        status: 200,
        body: {}
      }));
    }
    return undefined;
  }


  get(reqInfo: RequestInfo) {
    const { collectionName } = reqInfo;

    if (collectionName === 'slots') {
      const startTimeStr = reqInfo.query.get('startDate')![0];
      const endTimeStr = reqInfo.query.get('endDate')![0];
      let slots = (reqInfo.utils.getDb() as any).slots;

      if (startTimeStr && endTimeStr) {
        slots = slots.filter((slot: Slot) => {
          let include= slot.startTime >= startTimeStr && slot.endTime <= endTimeStr;
          if (this.currentUser?.role === UserRole.INSTRUCTOR) {
            include &&= slot.instructor.id === this.currentUser.id;
          } else {
            include &&= (slot.student.id === this.currentUser?.id || slot.state === SlotState.PUBLISHED);
          }

          return include;
        });
      }
      return reqInfo.utils.createResponse$(() => ({
        body: slots,
        status: 200,
      }));
    } else if (collectionName === 'courses') {
      const enrollments = (reqInfo.utils.getDb() as any).enrollments;
      let courses = (reqInfo.utils.getDb() as any).courses;

      courses = courses.filter((course: Course) => {
        let include;
        if (this.currentUser?.role === UserRole.INSTRUCTOR) {
          include = course.instructor?.id === this.currentUser.id;
        } else {
          include = enrollments.find((e: Student) => e.course.id === course.id && e.student.id === this.currentUser?.id)?.id;
        }

        return include;
      });
      return reqInfo.utils.createResponse$(() => ({
        body: courses,
        status: 200,
      }));
    }

    return undefined;
  }

  put(reqInfo: RequestInfo) {
    const { req, collectionName } = reqInfo;

    if (collectionName === 'slots') {
      const body = reqInfo.utils.getJsonBody(req) as SlotRequest;
      const slot = (reqInfo.utils.getDb() as any).slots.find((c: Slot) => c.id === reqInfo.id);

      slot.courseId = body.courseId;
      slot.course = (reqInfo.utils.getDb() as any).courses.find((c: Course) => c.id === body.courseId);
      slot.startTime = body.startTime;
      slot.endTime = body.endTime;

      return reqInfo.utils.createResponse$(() => ({
        status: 200,
        body: {}
      }));
    }

    return undefined;
  }
}
