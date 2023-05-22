import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '@app/models/identity/User';
import { UserUpdate } from '@app/models/identity/UserUpdate';
import { environment } from '@environments/environment';
import { Observable, ReplaySubject } from 'rxjs';
import { map, take } from 'rxjs/operators';

@Injectable()
export class AccountService {

  baseURL = environment.apiURL + "api/account/";
  public currentUserSource = new ReplaySubject<User>(1);
  public currentUser$ = this.currentUserSource.asObservable();

  constructor(private http: HttpClient) { }

  public login(model: any): Observable<void> {
    return this.http.post<User>(this.baseURL + 'login', model).pipe(
      take(1),
      map((response: User) => {
        const user = response;
        if(user) {
          this.setCurrentUser(user);
        }
      })
    );
  }

  public register(model: any): Observable<void> {
    return this.http.post<User>(this.baseURL + 'register', model).pipe(
      take(1),
      map((response: User) => {
        const user = response;
        if(user) {
          this.setCurrentUser(user);
        }
      })
    );
  }

  public getUser(): Observable<UserUpdate> {
    return this.http.get<UserUpdate>(this.baseURL + "getUser").pipe(take(1));
  }


  public updateUser(model: UserUpdate): Observable<void> {
    return this.http.put<UserUpdate>(this.baseURL + "updateUser", model).pipe(
      take(1),
      map((user: UserUpdate) => {
          this.setCurrentUser(user);
        }
      )
    );
  }

  public logout(): void {
    localStorage.removeItem('user');
    this.currentUserSource.next(null as any);
    //this.currentUserSource.complete();
  }

  public setCurrentUser(user: User): void {
    this.currentUserSource.next(user);
    localStorage.setItem("user", JSON.stringify(user));
  }

  public postUpload(file: File): Observable<UserUpdate> {
    const fileToUpload = file as File;
    const formData = new FormData();
    formData.append("file", fileToUpload);

    return this.http
          .post<UserUpdate>(`${this.baseURL}upload-image`, formData)
          .pipe(take(1));
  }
}
