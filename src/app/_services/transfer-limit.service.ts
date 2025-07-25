import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommonsService } from './commons.service';
import { environment } from 'src/environments/environment';
import { catchError, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TransferLimitService {
  constructor(
    private http: HttpClient,
    private commonService: CommonsService
  ) {}
  getdetailstransferlimit(data: any) {
    const url = environment.agentTransferLimit + '/' + data.exposableId;
    let urlParams = new HttpParams();

    urlParams = urlParams.append('pageNumber', data.pageNumber);
    urlParams = urlParams.append('pageSize', data.pageSize);
    if (data.agentTransferLimitId) {
      urlParams = urlParams.append(
        'agentTransferLimitId',
        data.agentTransferLimitId
      );
    }

    return this.http.get(url, { params: urlParams }).pipe(
      catchError((err) => {
        return this.commonService.catchError(err);
      }),
      map((response: any) => {
        return response;
      })
    );
  }
  private responseHandler() {
    this.commonService.hideLoading();
  }
  getexposabledid(data: any) {
    const url = environment.optGetAllUserDetails;
    let urlParams = new HttpParams();

    urlParams = urlParams.append('username', data.username);
    return this.http.get(url, { params: urlParams }).pipe(
      catchError((err: any) => {
        return this.commonService.catchError(err);
      }),
      map((response: any) => {
        this.responseHandler();
        return response;
      })
    );
  }
  search(data: any) {
    const url =
      environment.agentSendergetAgentSenderDetailsByCriteria +
      '/' +
      data.email +
      '/1';
    let urlParams = new HttpParams();

    urlParams = urlParams.append('name', data.name);
    return this.http.get(url, { params: urlParams }).pipe(
      catchError((err: any) => {
        return this.commonService.catchError(err);
      }),
      map((response: any) => {
        this.responseHandler();
        return response;
      })
    );
  }
  getcurrencies(data: any) {
    const url = environment.agentSendingCurrency + '/' + data.exposableId;

    return this.http.get(url).pipe(
      catchError((err) => {
        return this.commonService.catchError(err);
      }),
      map((response: any) => {
        return response;
      })
    );
  }
  getduration() {
    const url = environment.Durations;

    return this.http.get(url).pipe(
      catchError((err) => {
        return this.commonService.catchError(err);
      }),
      map((response: any) => {
        return response;
      })
    );
  }
  adddetails(data: any) {
    const url = environment.save;
    return this.http.post(url, data).pipe(
      catchError((err) => {
        return this.commonService.catchError(err);
      }),
      map((response) => {
        return response;
      })
    );
  }
  updatetranferlimit(data: any) {
    const url = environment.agentTransferLimitupdate;
    return this.http.put(url, data).pipe(
      catchError((err) => {
        return this.commonService.catchError(err);
      }),
      map((response: any) => {
        return response;
      })
    );
  }
}
