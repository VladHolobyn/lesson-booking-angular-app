import {HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {User} from '../models/auth/user.interface';
import {Invitation} from '../models/students/invitation.interface';
import {Student} from '../models/students/student.interface';

@Injectable({
  providedIn: 'root'
})
export class MembershipService {
  constructor(private http: HttpClient) { }


  getCourseInvitations(id: number) {
    return this.http.get<Invitation[]>(`api/invitations?courseId=${id}`);
  }

  getCourseStudents(id: number) {
    return this.http.get<Student[]>(`api/enrollments?courseId=${id}`);
  }

  getUserInvitations(id: number) {
    return this.http.get<Invitation[]>(`api/invitations?userId=${id}`);
  }


  inviteUser(user: User, courseId: number) {
    return this.http.post(`api/invitations`, {
      studentId: user.id,
      courseId
    })
  }

  cancelInvitation(id: number) {
    return this.http.delete(`api/invitations/${id}`)
  }

  declineInvitation(id: number) {
    return this.http.post(`api/invitations/${id}/decline`, {})
  }

  acceptInvitation(id: number) {
    return this.http.post(`api/invitations/${id}/accept`, {})
  }

  removeStudentFromCourse(id: number) {
    return this.http.delete(`api/enrollments/${id}`)
  }

  graduateStudent(id: number) {
    return this.http.post(`api/enrollments/${id}/markAsCompleted`, {})
  }

}
