import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommonsService } from './commons.service';
import { environment } from 'src/environments/environment';
import { catchError, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RolemanagementService {
  constructor(private http: HttpClient, public commons: CommonsService) {}

  getAllRoleManagemnetData(data: any) {
    const url = environment.getAllRoleManagmentData;

    let urlParams = new HttpParams();

    urlParams = urlParams.append('pageNumber', data.pageNumber);
    urlParams = urlParams.append('pageSize', data.pageSize);

    return this.http.get(url, { params: urlParams }).pipe(
      catchError((err) => {
        return this.commons.catchError(err);
      }),
      map((response: any) => {
        return response;
      })
    );
  }

  updateRoleStatus(data: any) {
    const url = environment.updateRoleStatus;

    return this.http.put(url, data).pipe(
      catchError((err) => {
        return this.commons.catchError(err);
      }),
      map((response: any) => {
        return response;
      })
    );
  }

  addNewRole(data: any) {
    const url = environment.addNewRole;

    return this.http.post(url, data).pipe(
      catchError((err) => {
        return this.commons.catchError(err);
      }),
      map((response: any) => {
        return response;
      })
    );
  }

  getAllPrivilages() {
    const url = environment.getAllPrivilages;

    return this.http.get(url).pipe(
      catchError((err) => {
        return this.commons.catchError(err);
      }),
      map((response: any) => {
        return response;
      })
    );
  }

  updateRolePrivilageStatus(data: any) {
    const url = environment.updateRolePrivilageStatus;

    return this.http.put(url, data).pipe(
      catchError((err) => {
        return this.commons.catchError(err);
      }),
      map((response: any) => {
        return response;
      })
    );
  }

  getPrivilagesByuser(data: any) {
    const url = environment.getPrivilagesByUser + data.roleId;
    let urlParams = new HttpParams();

    data.isLogin
      ? (urlParams = urlParams.append('isLogin', data.isLogin))
      : null;
    // urlParams = urlParams.append('isLogin', data.isLogin);

    return this.http.get(url, { params: urlParams }).pipe(
      catchError((err) => {
        return this.commons.catchError(err);
      }),
      map((response: any) => {
        return response;
      })
    );
  }
}
