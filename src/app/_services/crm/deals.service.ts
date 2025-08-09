import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommonsService } from '../commons.service';
import { environment } from 'src/environments/environment';
import { catchError, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DealsService {
  constructor(
    private http: HttpClient,
    private commonService: CommonsService
  ) {}

  getAllDeals(data: any) {
    const url = environment.getAllDeals;
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

  createDeals(data: any) {
    const url = environment.createnewDeals;
    return this.http.post(url, data).pipe(
      catchError((error) => {
        return this.commonService.catchError(error);
      }),
      map((response: any) => {
        return response;
      })
    );
  }

  deleteDeals(id: any) {
    const url = environment.deleteDeals + id;
    return this.http.delete(url).pipe(
      catchError((error) => {
        return this.commonService.catchError(error);
      }),
      map((response: any) => {
        return response;
      })
    );
  }

  getDealsDetailsById(id: any) {
    const url = environment.getDealsDetailsById + id;
    return this.http.get(url).pipe(
      catchError((error) => {
        return this.commonService.catchError(error);
      }),
      map((response: any) => {
        return response;
      })
    );
  }

  updateDeals(formdata: any, id: any) {
    const url = environment.updateDeals + id;
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
