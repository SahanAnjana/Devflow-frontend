import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommonsService } from '../commons.service';
import { environment } from 'src/environments/environment';
import { catchError, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InterviewService {
  constructor(
    private http: HttpClient,
    private commonService: CommonsService
  ) {}

  getAllInterviews(data: any) {
    const url = environment.getAllInterviews;

    let urlParams = new HttpParams();
    data.skip ? (urlParams = urlParams.append('skip', data.skip)) : null;
    data.limit ? (urlParams = urlParams.append('limit', data.limit)) : null;
    data.application_id
      ? (urlParams = urlParams.append('application_id', data.application_id))
      : null;
    data.interviewer_id
      ? (urlParams = urlParams.append('interviewer_id', data.interviewer_id))
      : null;
    data.from_date
      ? (urlParams = urlParams.append('from_date', data.from_date))
      : null;
    data.to_date
      ? (urlParams = urlParams.append('to_date', data.to_date))
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

  createInterviews(data: any) {
    const url = environment.createnewInterview;
    return this.http.post(url, data).pipe(
      catchError((error) => {
        return this.commonService.catchError(error);
      }),
      map((response: any) => {
        return response;
      })
    );
  }

  updateInterviews(id: string, data: any) {
    const url = environment.updateInterview + id;
    return this.http.put(url, data).pipe(
      catchError((error) => {
        return this.commonService.catchError(error);
      }),
      map((response: any) => {
        return response;
      })
    );
  }

  deleteInterview(id: string) {
    const url = environment.deleteInterview + id;
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
