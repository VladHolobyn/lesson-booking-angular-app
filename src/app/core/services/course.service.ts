import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {CourseRequest} from '../models/courses/course-request.interface';
import {Course} from '../models/courses/course.interface';

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  private apiUrl = '---';

  constructor(private http: HttpClient) {}

  getUserCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(this.apiUrl + '/api/courses')
  }

  getCourseDetails(id: number): Observable<Course> {
    return this.http.get<Course>(`${this.apiUrl}/api/courses/${id}`)
  }


  createCourse(data: CourseRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/courses`, data);
  }

  updateCourse(id: number, data: Partial<CourseRequest>) {
    return this.http.put(`${this.apiUrl}/api/courses/${id}`, data);
  }

  deleteCourse(id: number) {
    return this.http.delete(`${this.apiUrl}/api/courses/${id}`);
  }

  approveCourse(id: number) {
    return this.http.post(`${this.apiUrl}/api/courses/${id}/approve`, {});
  }

  archiveCourse(id: number) {
    return this.http.post(`${this.apiUrl}/api/courses/${id}/archive`, {});
  }
}
