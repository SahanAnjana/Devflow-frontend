import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommonsService } from '../commons.service';
import { environment } from 'src/environments/environment';
import { catchError, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PerposalsService {
  constructor(
    private http: HttpClient,
    private commonService: CommonsService
  ) {}

  getAllPerposals(data: any) {
    const url = environment.getAllPerposals;
    let urlParams = new HttpParams();
    data.skip ? (urlParams = urlParams.append('skip', data.skip)) : null;
    data.limit ? (urlParams = urlParams.append('limit', data.limit)) : null;
    data.company_id
      ? (urlParams = urlParams.append('company_id', data.company_id))
      : null;

    data.search ? (urlParams = urlParams.append('search', data.search)) : null;
    data.contact_id
      ? (urlParams = urlParams.append('contact_id', data.contact_id))
      : null;
    data.stage ? (urlParams = urlParams.append('stage', data.stage)) : null;

    return this.http.get(url, { params: urlParams }).pipe(
      catchError((error) => {
        return this.commonService.catchError(error);
      }),
      map((response: any) => {
        return response;
      })
    );
  }

  createPerposals(data: any) {
    const url = environment.createnewPerposals;
    return this.http.post(url, data).pipe(
      catchError((error) => {
        return this.commonService.catchError(error);
      }),
      map((response: any) => {
        return response;
      })
    );
  }

  deletePerposals(id: any) {
    const url = environment.deletePerposals + id;
    return this.http.delete(url).pipe(
      catchError((error) => {
        return this.commonService.catchError(error);
      }),
      map((response: any) => {
        return response;
      })
    );
  }

  getPerposalsDetailsById(id: any) {
    const url = environment.getPerposalsDetailsById + id;
    return this.http.get(url).pipe(
      catchError((error) => {
        return this.commonService.catchError(error);
      }),
      map((response: any) => {
        return response;
      })
    );
  }

  updatePerposals(formdata: any, id: any) {
    const url = environment.updatePerposals + id;
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
