import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommonsService } from '../commons.service';
import { environment } from 'src/environments/environment';
import { catchError, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class JobPostingService {
  constructor(
    private http: HttpClient,
    private commonService: CommonsService
  ) {}

  getAllJobpostings(data: any) {
    const url = environment.getAllJobPosting;
    let urlParams = new HttpParams();
    data.skip ? (urlParams = urlParams.append('skip', data.skip)) : null;
    data.limit ? (urlParams = urlParams.append('limit', data.limit)) : null;
    data.title ? (urlParams = urlParams.append('title', data.title)) : null;
    data.department_id
      ? (urlParams = urlParams.append('department_id', data.department_id))
      : null;
    data.active_only
      ? (urlParams = urlParams.append('active_only', data.active_only))
      : null;
    return this.http.get(url).pipe(
      catchError((error) => {
        return this.commonService.catchError(error);
      }),
      map((response: any) => {
        return response;
      })
    );
  }

  createJobPosting(data: any) {
    const url = environment.createJobPosting;
    return this.http.post(url, data).pipe(
      catchError((error) => {
        return this.commonService.catchError(error);
      }),
      map((response: any) => {
        return response;
      })
    );
  }

  deleteEmployeeData(id: any) {
    const url = environment.deleteEmployeeDetails + id;
    return this.http.delete(url).pipe(
      catchError((error) => {
        return this.commonService.catchError(error);
      }),
      map((response: any) => {
        return response;
      })
    );
  }

    getJobPostingDetails(data: any) {
    const url = environment.createJobPosting + data;
    return this.http.get(url).pipe(
      catchError((error) => {
        return this.commonService.catchError(error);
      }),
      map((response: any) => {
        return response;
      })
    );
  }
}
