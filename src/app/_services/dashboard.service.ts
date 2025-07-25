import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommonsService } from './commons.service';
import { environment } from 'src/environments/environment';
import { catchError, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  constructor(private http: HttpClient, private common: CommonsService) {}

  getUserPrivilages(data: any) {
    const url = environment.user_privileges + data;
    return this.http.get(url).pipe(
      catchError((err) => {
        return this.common.catchError(err);
      }),
      map((responce: any) => {
        return responce;
      })
    );
  }

  getTransactionCount(data: any) {
    const url = environment.transaction_count + '/' + data.clientCode;
    let urlParams = new HttpParams();
    urlParams = urlParams.append('userName', data.userName);
    return this.http.get(url, { params: urlParams }).pipe(
      catchError((err) => {
        return this.common.catchError(err);
      }),
      map((response: any) => {
        return response;
      })
    );
  }

  getUserCount() {
    const url = environment.get_User_Count;
    return this.http.get(url).pipe(
      catchError((err) => {
        return this.common.catchError(err);
      }),
      map((response: any) => {
        return response;
      })
    );
  }
  getTransferCount(data: any) {
    const url = environment.getTransactionNotifications;
    let urlParams = new HttpParams();
    urlParams = urlParams.append('userName', data.userName);
    return this.http.get(url, { params: urlParams }).pipe(
      catchError((err) => {
        return this.common.catchError(err);
      }),
      map((response: any) => {
        return response;
      })
    );
  }

  getPrivilages() {
    const url = environment.getPrivileges + '';
    return this.http.get(url).pipe(
      catchError((err) => {
        return this.common.catchError(err);
      }),
      map((response: any) => {
        return response;
      })
    );
  }
  getPrivilagesRole(data: string) {
    let urlParams = new HttpParams();
    urlParams = urlParams.append('role_name', data);
    const url = environment.getPrivileges;
    return this.http.get(url, { params: urlParams }).pipe(
      catchError((err) => {
        return this.common.catchError(err);
      }),
      map((response: any) => {
        return response;
      })
    );
  }

  getuserdetails() {
    const url = environment.getUserDetails;
    return this.http.get(url).pipe(
      catchError((err) => {
        return this.common.catchError(err);
      }),
      map((response: any) => {
        return response;
      })
    );
  }
}
