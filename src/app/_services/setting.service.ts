import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommonsService } from './commons.service';
import { environment } from 'src/environments/environment';
import { catchError, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SettingService {

  constructor(private http: HttpClient, public commons: CommonsService) { }
  private responseHandler() {
    this.commons.hideLoading();
  }
  getsettingdetails(data: any) {
    const url = environment.optGetAllUserDetails;
    
    let urlParams = new HttpParams();

    urlParams = urlParams.append('username', data.username);
    return this.http.get(url, { params: urlParams }).pipe(
      catchError((err: any) => {
        return this.commons.catchError(err);
      }),
      map((response: any) => {
        this.responseHandler();
        return response;
      })
    );
  }
  updatesetting(data: any) {
    const url = environment.updatesetting;

    return this.http.put(url, data).pipe(
      catchError((err) => {
        return this.commons.catchError(err);
      }),
      map((response: any) => {
        return response;
      })
    );
  }
}
