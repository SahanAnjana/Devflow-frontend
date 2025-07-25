import { Injectable } from '@angular/core';
import { CommonsService } from './commons.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { catchError, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserManagementAgentService {
  constructor(
    private commonService: CommonsService,
    private http: HttpClient
  ) {}

  getAgentDetasilsById(data: any) {
    const url = environment.getAgentById;
    let urlParams = new HttpParams();

    urlParams = urlParams.append('agentId', data.agentId);

    return this.http.get(url, { params: urlParams }).pipe(
      catchError((err) => {
        return this.commonService.catchError(err);
      }),
      map((response: any) => {
        return response;
      })
    );
  }
  getAllSignUpCountries(data: any) {
    const url = environment.getSignupCountries + '/' + data.exposableId;
    return this.http.get(url).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((err) => {
        return this.commonService.catchError(err);
      })
    );
  }
  getAllSignUpsendingcurrencies(data: any) {
    const url = environment.agentSendingCurrency + '/' + data.exposableId;
    return this.http.get(url).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((err) => {
        return this.commonService.catchError(err);
      })
    );
  }
  getAllreceivingcurrencies(data: any) {
    const url = environment.agentReceivingCurrency + '/' + data.exposableId;
    return this.http.get(url).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((err) => {
        return this.commonService.catchError(err);
      })
    );
  }
  getAllAgentTableData(data: any) {
    const url = environment.getAllAgent; //please add url

    let urlParams = new HttpParams();

    data.pageNumber
      ? (urlParams = urlParams.append('pageNumber', data.pageNumber))
      : '';

    data.pageSize
      ? (urlParams = urlParams.append('pageSize', data.pageSize))
      : '';

    data.email ? (urlParams = urlParams.append('email', data.email)) : '';
    // data.isAgentUser
    //   ? (urlParams = urlParams.append('isAgentUser', data.isAgentUser))
    //   : '';

    data.contactNumber
      ? (urlParams = urlParams.append('contactNumber', data.contactNumber))
      : '';

    data.registeredFromDate
      ? (urlParams = urlParams.append(
          'registeredFromDate',
          data.registeredFromDate
        ))
      : '';

    data.registeredToDate
      ? (urlParams = urlParams.append(
          'registeredToDate',
          data.registeredToDate
        ))
      : '';

    data.userName
      ? (urlParams = urlParams.append('userName', data.userName))
      : '';
    data.agentAddress
      ? (urlParams = urlParams.append('agentAddress', data.agentAddress))
      : '';

    data.searchType
      ? (urlParams = urlParams.append('searchType', data.searchType))
      : '';

    data.status ? (urlParams = urlParams.append('status', data.status)) : '';
    // data.isAgentUser
    //   ? (urlParams = urlParams.append('isAgentUser', data.isAgentUser))
    //   : '';

    return this.http.get(url, { params: urlParams }).pipe(
      catchError((error) => {
        return this.commonService.catchError(error);
      }),
      map((response: any) => {
        return response;
      })
    );
  }
  unlockUser(data: any) {
    const url = environment.unlockUser;
    let urlParams = new HttpParams();
    urlParams = urlParams.append('email', data.email);
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
