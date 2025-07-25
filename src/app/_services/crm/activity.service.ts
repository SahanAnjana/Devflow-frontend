import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommonsService } from '../commons.service';
import { environment } from 'src/environments/environment';
import { catchError, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ActivityService {
  constructor(
    private http: HttpClient,
    private commonService: CommonsService
  ) {}

  getAllActivities(data: any) {
    const url = environment.getAllActivities;
    let urlParams = new HttpParams();
    data.skip ? (urlParams = urlParams.append('skip', data.skip)) : null;
    data.limit ? (urlParams = urlParams.append('limit', data.limit)) : null;
    data.contact_id
      ? (urlParams = urlParams.append('contact_id', data.contact_id))
      : null;
    data.deal_id
      ? (urlParams = urlParams.append('deal_id', data.deal_id))
      : null;
    data.activity_type
      ? (urlParams = urlParams.append('activity_type', data.activity_type))
      : null;
    data.status ? (urlParams = urlParams.append('status', data.status)) : null;
    data.due_date_from
      ? (urlParams = urlParams.append('due_date_from', data.due_date_from))
      : null;
    data.due_date_to
      ? (urlParams = urlParams.append('due_date_to', data.due_date_to))
      : null;
    return this.http.get(url, { params: urlParams }).pipe(
      catchError((error) => {
        return this.commonService.catchError(error);
      }),
      map((response: any) => {
        return response;
      })
    );
  }

  createActivity(data: any) {
    const url = environment.createnewActivity;
    return this.http.post(url, data).pipe(
      catchError((error) => {
        return this.commonService.catchError(error);
      }),
      map((response: any) => {
        return response;
      })
    );
  }

  deleteActivity(id: any) {
    const url = environment.deleteActivity + id;
    return this.http.delete(url).pipe(
      catchError((error) => {
        return this.commonService.catchError(error);
      }),
      map((response: any) => {
        return response;
      })
    );
  }

  getActivityDetailsById(id: any) {
    const url = environment.getActivityDetailsById + id;
    return this.http.get(url).pipe(
      catchError((error) => {
        return this.commonService.catchError(error);
      }),
      map((response: any) => {
        return response;
      })
    );
  }

  updateActivity(formdata: any, id: any) {
    const url = environment.updateActivity + id;
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
