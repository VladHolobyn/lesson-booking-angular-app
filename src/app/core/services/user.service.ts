import {HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {User} from '../models/auth/user.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient) { }

  findUserByEmail(email: string): Observable<User[]> {
    return this.http.get<User[]>(`api/users?email=${email}`);
  }

}
