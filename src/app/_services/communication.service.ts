import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommonsService } from './commons.service';
import { environment } from 'src/environments/environment';
import { catchError, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommunicationService {
  constructor(private http: HttpClient, private common: CommonsService) {}

  getAllCommunication(data: any) {
    const url = environment.getAllCommunication;
    let urlParams = new HttpParams();
    urlParams = urlParams.append('pageSize', data.pageSize);
    data.sentBy ? (urlParams = urlParams.append('sentBy', data.sentBy)) : '';
    data.recieverEmail
      ? (urlParams = urlParams.append('recieverEmail', data.recieverEmail))
      : '';
    data.subject ? (urlParams = urlParams.append('subject', data.subject)) : '';

    urlParams = urlParams.append('isSuccess', data.isSuccess);

    data.fromDate
      ? (urlParams = urlParams.append('fromDate', data.fromDate))
      : '';
    urlParams = urlParams.append('pageNumber', data.pageNumber);
    data.toDate ? (urlParams = urlParams.append('toDate', data.toDate)) : '';
    return this.http.get(url, { params: urlParams }).pipe(
      catchError((err) => {
        return this.common.catchError(err);
      }),
      map((responce: any) => {
        return responce;
      })
    );
  }

  getAgentSender(data: any) {
    const url = environment.agentSender + '/' + data.email + '/1';
    let urlParams = new HttpParams();
    urlParams = urlParams.append('name', data.name);
    return this.http.get(url, { params: urlParams }).pipe(
      catchError((err) => {
        return this.common.catchError(err);
      }),
      map((responce: any) => {
        return responce;
      })
    );
  }
  getAllAgent() {
    const url = environment.getAgentDetails;
    return this.http.get(url).pipe(
      catchError((err) => {
        return this.common.catchError(err);
      }),
      map((responce: any) => {
        return responce;
      })
    );
  }

  sendEmai(body: any) {
    const url = environment.sendMail;
    return this.http.post(url, body).pipe(
      catchError((err) => {
        return this.common.catchError(err);
      }),
      map((responce: any) => {
        return responce;
      })
    );
  }
}
