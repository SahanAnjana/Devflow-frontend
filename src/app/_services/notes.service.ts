import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, catchError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CommonsService } from './commons.service';

@Injectable({
  providedIn: 'root',
})
export class NotesService {
  constructor(
    private commonService: CommonsService,
    private http: HttpClient
  ) {}
  getCustomerNotes(data: any) {
    const url = environment.getCustomerNotes + data.agentSenderDetailsId;
    let urlParams = new HttpParams();

    data.pageNumber
      ? (urlParams = urlParams.append('pageNumber', data.pageNumber))
      : null;
    data.pageSize
      ? (urlParams = urlParams.append('pageSize', data.pageSize))
      : null;
    return this.http.get(url, { params: urlParams }).pipe(
      map((user: any) => {
        return user;
      }),
      catchError((err) => {
        return this.commonService.catchError(err);
      })
    );
  }
  sendCustomerNotes(data: any) {
    const url = environment.saveCustomerNotes;

    return this.http.post(url, data).pipe(
      map((user: any) => {
        return user;
      }),
      catchError((err) => {
        return this.commonService.catchError(err);
      })
    );
  }
}
