import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommonsService } from '../commons.service';
import { environment } from 'src/environments/environment';
import { catchError, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ContractsService {
  constructor(
    private http: HttpClient,
    private commonService: CommonsService
  ) {}

  getAllContracts(data: any) {
    const url = environment.getAllContracts;
    let urlParams = new HttpParams();
    data.skip ? (urlParams = urlParams.append('skip', data.skip)) : null;
    data.limit ? (urlParams = urlParams.append('limit', data.limit)) : null;
    data.company_id
      ? (urlParams = urlParams.append('company_id', data.company_id))
      : null;

    data.search ? (urlParams = urlParams.append('search', data.search)) : null;
    data.deal_id
      ? (urlParams = urlParams.append('deal_id', data.deal_id))
      : null;
    data.status ? (urlParams = urlParams.append('status', data.status)) : null;

    return this.http.get(url, { params: urlParams }).pipe(
      catchError((error) => {
        return this.commonService.catchError(error);
      }),
      map((response: any) => {
        return response;
      })
    );
  }

  createContracts(data: any) {
    const url = environment.createnewContracts;
    return this.http.post(url, data).pipe(
      catchError((error) => {
        return this.commonService.catchError(error);
      }),
      map((response: any) => {
        return response;
      })
    );
  }

  deleteContracts(id: any) {
    const url = environment.deleteContracts + id;
    return this.http.delete(url).pipe(
      catchError((error) => {
        return this.commonService.catchError(error);
      }),
      map((response: any) => {
        return response;
      })
    );
  }

  getContractsDetailsById(id: any) {
    const url = environment.getContractsDetailsById + id;
    return this.http.get(url).pipe(
      catchError((error) => {
        return this.commonService.catchError(error);
      }),
      map((response: any) => {
        return response;
      })
    );
  }

  updateContracts(formdata: any, id: any) {
    const url = environment.updateContracts + id;
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
