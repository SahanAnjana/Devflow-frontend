import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommonsService } from './commons.service';
import { environment } from 'src/environments/environment';
import { catchError, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReportNotesService {
  constructor(private http: HttpClient, private common: CommonsService) {}

  getSubject() {
    const url = environment.getAllSubject;
    return this.http.get(url).pipe(
      catchError((err) => {
        return this.common.catchError(err);
      }),
      map((responce: any) => {
        return responce;
      })
    );
  }
  getAllNotes(data: any) {
    const url = environment.getAllNotes + '/' + data.transactionDetailId;
    let urlParams = new HttpParams();
    urlParams = urlParams.append('pageNumber', data.pageNumber);
    urlParams = urlParams.append('pageSize', data.pageSize);
    return this.http.get(url, { params: urlParams }).pipe(
      catchError((err) => {
        return this.common.catchError(err);
      }),
      map((responce: any) => {
        return responce;
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
        return this.common.catchError(err);
      })
    );
  }

  addNotes(data: any) {
    const url = environment.saveTrfNotes;
    return this.http.post(url, data).pipe(
      catchError((err) => {
        return this.common.catchError(err);
      }),
      map((responce: any) => {
        return responce;
      })
    );
  }
}
