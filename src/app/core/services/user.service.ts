import {HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {User} from '../models/auth/user.interface';
import {Page} from '../models/page';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  findUserByEmail(email: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/api/users?email=${email}`);
  }

}
