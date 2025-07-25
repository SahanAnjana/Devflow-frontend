import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommonsService } from '../commons.service';
import { environment } from 'src/environments/environment';
import { catchError, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ContactsService {
  constructor(
    private http: HttpClient,
    private commonService: CommonsService
  ) {}

  getAllContacts(data: any) {
    const url = environment.getAllContacts;
    let urlParams = new HttpParams();
    data.skip ? (urlParams = urlParams.append('skip', data.skip)) : null;
    data.limit ? (urlParams = urlParams.append('limit', data.limit)) : null;
    data.company_id
      ? (urlParams = urlParams.append('company_id', data.company_id))
      : null;

    data.search ? (urlParams = urlParams.append('search', data.search)) : null;
    data.tags ? (urlParams = urlParams.append('tags', data.tags)) : null;

    return this.http.get(url, { params: urlParams }).pipe(
      catchError((error) => {
        return this.commonService.catchError(error);
      }),
      map((response: any) => {
        return response;
      })
    );
  }

  createContacts(data: any) {
    const url = environment.createnewContacts;
    return this.http.post(url, data).pipe(
      catchError((error) => {
        return this.commonService.catchError(error);
      }),
      map((response: any) => {
        return response;
      })
    );
  }

  deleteContacts(id: any) {
    const url = environment.deleteContacts + id;
    return this.http.delete(url).pipe(
      catchError((error) => {
        return this.commonService.catchError(error);
      }),
      map((response: any) => {
        return response;
      })
    );
  }

  getContactsDetailsById(id: any) {
    const url = environment.getContactsDetailsById + id;
    return this.http.get(url).pipe(
      catchError((error) => {
        return this.commonService.catchError(error);
      }),
      map((response: any) => {
        return response;
      })
    );
  }

  updateContacts(formdata: any, id: any) {
    const url = environment.updateContacts + id;
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
