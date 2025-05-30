import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {CourseRequest} from '../models/courses/course-request.interface';
import {Course} from '../models/courses/course.interface';

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  constructor(private http: HttpClient) {}

  getUserCourses(): Observable<Course[]> {
    return this.http.get<Course[]>('api/courses')
  }

  getCourseDetails(id: number): Observable<Course> {
    return this.http.get<Course>(`api/courses/${id}`)
  }

  createCourse(data: CourseRequest): Observable<any> {
    return this.http.post(`api/courses`, data);
  }

  updateCourse(id: number, data: Partial<CourseRequest>) {
    return this.http.put(`api/courses/${id}`, data);
  }

  deleteCourse(id: number) {
    return this.http.delete(`api/courses/${id}`);
  }

  approveCourse(id: number) {
    return this.http.post(`api/courses/${id}/approve`, {});
  }

  archiveCourse(id: number) {
    return this.http.post(`api/courses/${id}/archive`, {});
  }
}
