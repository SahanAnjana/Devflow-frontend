import { Injectable } from '@angular/core';
import { CommonsService } from '../commons.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { catchError, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ResourcesService {
  constructor(
    private commonService: CommonsService,
    private http: HttpClient
  ) {}

  getAllResourcesList(data: any) {
    const url = environment.getAllresourcesList;

    let urlParams = new HttpParams();

    data.skip ? (urlParams = urlParams.append('isAgent', data.skip)) : null;
    data.limit ? (urlParams = urlParams.append('limit', data.limit)) : null;
    data.project_id
      ? (urlParams = urlParams.append('project_id', data.project_id))
      : null;
    data.type ? (urlParams = urlParams.append('type', data.type)) : null;
    data.availability
      ? (urlParams = urlParams.append('availability', data.availability))
      : null;
    data.skills ? (urlParams = urlParams.append('skills', data.skills)) : null;
    data.cost_rate
      ? (urlParams = urlParams.append('cost_rate', data.cost_rate))
      : null;
    return this.http.get(url, { params: urlParams }).pipe(
      catchError((error) => {
        return this.commonService.catchError(error);
      }),
      map((response: any) => {
        return response;
      })
    );
  }

  cerateNewResources(formdata: any) {
    const url = environment.addNewResources;
    let urlParams = new HttpParams();
    return this.http.post(url, formdata).pipe(
      catchError((error) => {
        return this.commonService.catchError(error);
      }),
      map((response: any) => {
        return response;
      })
    );
  }

  getResourceDataByid(id: any) {
    const url = environment.getREsourcesData + id;
    let urlParams = new HttpParams();
    return this.http.get(url).pipe(
      catchError((error) => {
        return this.commonService.catchError(error);
      }),
      map((response: any) => {
        return response;
      })
    );
  }
  updateResourceDataByid(formdata: any, id: any) {
    const url = environment.getREsourcesData + id;
    let urlParams = new HttpParams();
    return this.http.put(url, formdata).pipe(
      catchError((error) => {
        return this.commonService.catchError(error);
      }),
      map((response: any) => {
        return response;
      })
    );
  }

  deleteResourceDataByid(id: any) {
    const url = environment.deleteResources + id;
    let urlParams = new HttpParams();
    return this.http.delete(url).pipe(
      catchError((error) => {
        return this.commonService.catchError(error);
      }),
      map((response: any) => {
        return response;
      })
    );
  }
}
