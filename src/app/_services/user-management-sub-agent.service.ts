import { Injectable } from '@angular/core';
import { CommonsService } from './commons.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { catchError, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserManagementSubAgentService {
  constructor(
    private commonService: CommonsService,
    private http: HttpClient
  ) {}

  getAllSubAgentTableData(data: any) {
    const url = environment.getAllsubAgents; //please add url

    let urlParams = new HttpParams();

    data.pageNumber
      ? (urlParams = urlParams.append('pageNumber', data.pageNumber))
      : '';
    data.email ? (urlParams = urlParams.append('email', data.email)) : '';
    data.contactNumber
      ? (urlParams = urlParams.append('contactNumber', data.contactNumber))
      : '';
    data.agentName
      ? (urlParams = urlParams.append('agentName', data.agentName))
      : '';
    data.userName
      ? (urlParams = urlParams.append('userName', data.userName))
      : '';
    data.agentAddress
      ? (urlParams = urlParams.append('agentAddress', data.agentAddress))
      : '';
    data.pageSize
      ? (urlParams = urlParams.append('pageSize', data.pageSize))
      : '';

    data.searchType
      ? (urlParams = urlParams.append('searchType', data.searchType))
      : '';

    return this.http.get(url, { params: urlParams }).pipe(
      catchError((error) => {
        return this.commonService.catchError(error);
      }),
      map((response: any) => {
        return response;
      })
    );
  }

  getSubAgentDetasilsById(data: any) {
    const url = environment.getSubAgentById + data;

    return this.http.get(url).pipe(
      catchError((error) => {
        return this.commonService.catchError(error);
      }),
      map((response: any) => {
        return response;
      })
    );
  }

  updateStatus(data: any) {
    const url = environment.updateSubAgnetStatus + data.agentDetailsId;
    let urlParams = new HttpParams();
    urlParams = urlParams.append('status', data.status);
    urlParams = urlParams.append('isSubAgent', data.isSubAgent);
    return this.http.put(url, null, { params: urlParams }).pipe(
      catchError((error) => {
        return this.commonService.catchError(error);
      }),
      map((response: any) => {
        return response;
      })
    );
  }
}
