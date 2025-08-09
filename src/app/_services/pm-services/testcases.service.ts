import { Injectable } from '@angular/core';
import { CommonsService } from '../commons.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { catchError, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TestcasesService {
  constructor(
    private commonService: CommonsService,
    private http: HttpClient
  ) {}

  createProject(data: any) {
    const url = environment.createproject;
    return this.http.post(url, data).pipe(
      catchError((error) => {
        return this.commonService.catchError(error);
      }),
      map((response: any) => {
        return response;
      })
    );
  }
  getALlTestCases(data: any) {
    const url = environment.getAllTestCases;
    let urlParams = new HttpParams();
    data.skip ? (urlParams = urlParams.append('skip', data.skip)) : null;
    data.limit ? (urlParams = urlParams.append('limit', data.limit)) : null;
    data.project_id
      ? (urlParams = urlParams.append('project_id', data.project_id))
      : null;
    data.category
      ? (urlParams = urlParams.append('category', data.category))
      : null;
    data.priority
      ? (urlParams = urlParams.append('priority', data.priority))
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

  getIssuesDataById(id: any) {
    const url = environment.getIssuesData + id;
    return this.http.get(url).pipe(
      catchError((error) => {
        return this.commonService.catchError(error);
      }),
      map((response: any) => {
        return response;
      })
    );
  }

  updateProjectData(id: any, data: any) {
    const url = environment.updateProjectDetails + id;
    return this.http.put(url, data).pipe(
      catchError((error) => {
        return this.commonService.catchError(error);
      }),
      map((response: any) => {
        return response;
      })
    );
  }

  deleteTestCases(id: any) {
    const url = environment.deleteTestCases + id;
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
