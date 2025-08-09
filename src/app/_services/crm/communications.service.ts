import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommonsService } from '../commons.service';
import { environment } from 'src/environments/environment';
import { catchError, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommunicationsService {
  constructor(
    private http: HttpClient,
    private commonService: CommonsService
  ) {}

  getAllCommunications(data: any) {
    const url = environment.getAllCommunications;
    let urlParams = new HttpParams();
    data.skip ? (urlParams = urlParams.append('skip', data.skip)) : null;
    data.limit ? (urlParams = urlParams.append('limit', data.limit)) : null;
    data.company_id
      ? (urlParams = urlParams.append('company_id', data.company_id))
      : null;
    data.deal_id
      ? (urlParams = urlParams.append('deal_id', data.deal_id))
      : null;
    data.communication_type
      ? (urlParams = urlParams.append(
          'communication_type',
          data.communication_type
        ))
      : null;
    data.direction
      ? (urlParams = urlParams.append('direction', data.direction))
      : null;
    data.date_from
      ? (urlParams = urlParams.append('date_from', data.date_from))
      : null;
    data.date_to
      ? (urlParams = urlParams.append('date_to', data.date_to))
      : null;
    data.search ? (urlParams = urlParams.append('search', data.search)) : null;
    return this.http.get(url, { params: urlParams }).pipe(
      catchError((error) => {
        return this.commonService.catchError(error);
      }),
      map((response: any) => {
        return response;
      })
    );
  }

  createCommunications(data: any) {
    const url = environment.createnewCommunications;
    return this.http.post(url, data).pipe(
      catchError((error) => {
        return this.commonService.catchError(error);
      }),
      map((response: any) => {
        return response;
      })
    );
  }

  deleteCommunications(id: any) {
    const url = environment.deleteCommunications + id;
    return this.http.delete(url).pipe(
      catchError((error) => {
        return this.commonService.catchError(error);
      }),
      map((response: any) => {
        return response;
      })
    );
  }

  getCommunicationsDetailsById(id: any) {
    const url = environment.getCommunicationsDetailsById + id;
    return this.http.get(url).pipe(
      catchError((error) => {
        return this.commonService.catchError(error);
      }),
      map((response: any) => {
        return response;
      })
    );
  }

  updateCommunications(formdata: any, id: any) {
    const url = environment.updateCommunications + id;
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
