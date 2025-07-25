import { Injectable } from '@angular/core';
import { CommonsService } from './commons.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { catchError, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EmailService {
  constructor(
    private commonService: CommonsService,
    private http: HttpClient
  ) {}
  getEmailSubjects() {
    const url = environment.getAllSubject;

    return this.http.get(url).pipe(
      map((user: any) => {
        return user;
      }),
      catchError((err) => {
        return this.commonService.catchError(err);
      })
    );
  }
  sendEmail(data: any) {
    const url = environment.sendEmail;

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
