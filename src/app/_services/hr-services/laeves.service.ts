import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { catchError, map } from 'rxjs';
import { CommonsService } from '../commons.service';

@Injectable({
  providedIn: 'root',
})
export class LaevesService {
  constructor(
    private http: HttpClient,
    private commonService: CommonsService
  ) {}

  getAllLeavesummary(data: any) {
    const url = environment.getLeavesAll;
    let urlParams = new HttpParams();
    data.skip ? (urlParams = urlParams.append('skip', data.skip)) : null;
    data.limit ? (urlParams = urlParams.append('limit', data.limit)) : null;
    data.status ? (urlParams = urlParams.append('status', data.status)) : null;
    return this.http.get(url, { params: urlParams }).pipe(
      catchError((error) => {
        return this.commonService.catchError(error);
      }),
      map((response: any) => {
        return response;
      })
    );
  }

  addLeaveRequest(formdata: any) {
    const url = environment.createLEaveRequest;
    return this.http.post(url, formdata).pipe(
      catchError((error) => {
        return this.commonService.catchError(error);
      }),
      map((response: any) => {
        return response;
      })
    );
  }

  getAllLeaveData(data: any) {
    const url = environment.getLeavesAll + data;
    return this.http.get(url).pipe(
      catchError((error) => {
        return this.commonService.catchError(error);
      }),
      map((response: any) => {
        return response;
      })
    );
  }

  UpdateLeaveRequest(formdata: any, data: any) {
    const url = environment.updateLeaverequest + data;
    return this.http.post(url, formdata).pipe(
      catchError((error) => {
        return this.commonService.catchError(error);
      }),
      map((response: any) => {
        return response;
      })
    );
  }
  deleteLeave(data: any) {
    const url = environment.updateLeaverequest + data;
    return this.http.delete(url).pipe(
      catchError((error) => {
        return this.commonService.catchError(error);
      }),
      map((response: any) => {
        return response;
      })
    );
  }
}
