import { Injectable } from '@angular/core';
import { CommonsService } from './commons.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { catchError, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserManagementAffliateService {
  constructor(
    private commonService: CommonsService,
    private http: HttpClient
  ) {}

  getExcitingAffliateUsers(data: any) {
    const url = environment.getAllAffliateUsers;
    let urlParams = new HttpParams();

    data.pageNumber
      ? (urlParams = urlParams.append('pageNumber', data.pageNumber))
      : '';
    // data.isApproved
    //   ? (urlParams = urlParams.append('isApproved', data.isApproved))
    //   : '';
    data.pageSize
      ? (urlParams = urlParams.append('pageSize', data.pageSize))
      : '';
    data.name ? (urlParams = urlParams.append('name', data.name)) : '';
    data.agentName
      ? (urlParams = urlParams.append('agentName', data.agentName))
      : '';
    data.email ? (urlParams = urlParams.append('email', data.email)) : '';
    data.agentAddress
      ? (urlParams = urlParams.append('agentAddress', data.agentAddress))
      : '';
    urlParams = urlParams.append('searchType', data.searchType);
    return this.http.get(url, { params: urlParams }).pipe(
      catchError((error) => {
        return this.commonService.catchError(error);
      }),
      map((response: any) => {
        return response;
      })
    );
  }
  getPrivilages(data: any) {
    const url = environment.getPrivilages + data.email;
    return this.http.get(url).pipe(
      catchError((error) => {
        return this.commonService.catchError(error);
      }),
      map((response: any) => {
        return response;
      })
    );
  }

  updateUserStatus(data: any) {
    const url = environment.updateStatus + data.agntDetailsId;

    let urlParams = new HttpParams();
    urlParams = urlParams.append('status', data.status);

    return this.http.put(url, data, { params: urlParams }).pipe(
      catchError((error) => {
        return this.commonService.catchError(error);
      }),
      map((response: any) => {
        return response;
      })
    );
  }

  updatePrivilagStatus(formdata: any) {
    const url = environment.updatePrivilageStatus;

    return this.http.put(url, formdata).pipe(
      catchError((error) => {
        return this.commonService.catchError(error);
      }),
      map((response: any) => {
        return response;
      })
    );
  }
}
