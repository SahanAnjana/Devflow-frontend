import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommonsService } from './commons.service';
import { Router } from '@angular/router';
import { TokenserviceService } from './tokenservice.service';
import { BehaviorSubject, Observable, catchError, map } from 'rxjs';
import { user } from '../_models/users';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthserviceService {
  public currentUser!: Observable<any>;
  private currentUserSubject!: BehaviorSubject<user>;

  constructor(
    private http: HttpClient,
    private commonService: CommonsService,
    private router: Router,
    private tokenStorage: TokenserviceService
  ) {}

  public get currentUserValue(): user {
    return this.currentUserSubject.value;
  }

  //login user
  login(data: any) {
    const url = environment.authenticate;
    const formData = new URLSearchParams();
    formData.append('username', data.username);
    formData.append('password', data.password);
    return this.http
      .post<user>(url, formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
      .pipe(
        map((user: any) => {
          return user;
        }),
        catchError((err) => {
          return this.commonService.catchError(err);
        })
      );
  }

  logout() {
    // console.log('logged out');

    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    localStorage.removeItem('currentclient');
    localStorage.clear();
    this.router.navigate(['/login']);

    location.reload();
  }

  setRefreshToken(token: any) {
    localStorage.setItem('currentUser', token);
    this.tokenStorage.saveToken(token.jwttoken);
  }

  refreshToken(data: any) {
    const url = environment.refresh;
    return this.http.post(url, data).pipe(
      catchError((err) => {
        return this.commonService.catchError(err);
      }),
      map((response: any) => {
        // this.responseHandler();
        return response;
      })
    );
  }

  forgetPasswordRequest(data: any) {
    const url = environment.forgetPasswordRequest;
    return this.http.post(url, data).pipe(
      catchError((err) => {
        return this.commonService.catchError(err);
      }),
      map((response: any) => {
        // this.responseHandler();
        return response;
      })
    );
  }

  resetPassword(data: any) {
    const url = environment.resetPassword;
    return this.http.post(url, data).pipe(
      catchError((err) => {
        return this.commonService.catchError(err);
      }),
      map((response: any) => {
        // this.responseHandler();
        return response;
      })
    );
  }

  validateResetPasswordToken(data: any) {
    const url = environment.baseUrl + environment.user + '/validate';
    let urlParams = new HttpParams();
    urlParams = urlParams.append('token', data.token);
    return this.http.get(url, { params: urlParams }).pipe(
      catchError((err) => {
        return this.commonService.catchError(err);
      }),
      map((response: any) => {
        return response;
      })
    );
  }

  getTfaCode(data: any) {
    const url = environment.TFACode;
    return this.http.post(url, data).pipe(
      catchError((err) => {
        return this.commonService.catchError(err);
      }),
      map((response: any) => {
        // this.responseHandler();
        return response;
      })
    );
  }

  getAllUsers(data: any) {
    const url = environment.getUsers;
    let urlParams = new HttpParams();
    data.skip ? (urlParams = urlParams.append('skip', data.skip)) : null;
    data.limit ? (urlParams = urlParams.append('limit', data.limit)) : null;
    return this.http.get(url, { params: urlParams }).pipe(
      catchError((err) => {
        return this.commonService.catchError(err);
      }),
      map((response: any) => {
        // this.responseHandler();
        return response;
      })
    );
  }

  getUsersDetialsBy() {
    const url = environment.getUserdetailsMe;
    return this.http.get(url).pipe(
      catchError((err) => {
        return this.commonService.catchError(err);
      }),
      map((response: any) => {
        // this.responseHandler();
        return response;
      })
    );
  }
}
