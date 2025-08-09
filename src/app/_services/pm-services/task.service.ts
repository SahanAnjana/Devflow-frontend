import { Injectable } from '@angular/core';
import { CommonsService } from '../commons.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { catchError, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  constructor(
    private commonService: CommonsService,
    private http: HttpClient
  ) {}

  getAllTaskList() {
    const url = environment.getAllTaskList;
    return this.http.get(url).pipe(
      catchError((error) => {
        return this.commonService.catchError(error);
      }),
      map((response: any) => {
        return response;
      })
    );
  }

  cerateNewTask(data: any, id: any) {
    const url = environment.createNewTask;
    let urlParams = new HttpParams();
    urlParams = urlParams.append('project_id', id);
    return this.http.post(url, { params: urlParams }, data).pipe(
      catchError((error) => {
        return this.commonService.catchError(error);
      }),
      map((response: any) => {
        return response;
      })
    );
  }

  getProjectTasks(data: any) {
    const url = environment.getProjectTasks;
    let urlParams = new HttpParams();
    data.skip ? (urlParams = urlParams.append('skip', data.skip)) : null;
    data.limit ? (urlParams = urlParams.append('limit', data.limit)) : null;
    data.project_id
      ? (urlParams = urlParams.append('project_id', data.project_id))
      : null;
    data.status ? (urlParams = urlParams.append('status', data.status)) : null;
    data.assignee_id
      ? (urlParams = urlParams.append('assignee_id', data.assignee_id))
      : null;

    return this.http.get(url).pipe(
      catchError((error) => {
        return this.commonService.catchError(error);
      }),
      map((response: any) => {
        return response;
      })
    );
  }

  getTaskDetailsbyId(id: any) {
    const url = environment.getTaskDetailsById + id;
    return this.http.get(url).pipe(
      catchError((error) => {
        return this.commonService.catchError(error);
      }),
      map((response: any) => {
        return response;
      })
    );
  }

  updateTaskDetails(id: any, data: any) {
    const url = environment.updateTaskDetails + id;
    return this.http.put(url, data).pipe(
      catchError((error) => {
        return this.commonService.catchError(error);
      }),
      map((response: any) => {
        return response;
      })
    );
  }

  deleteTaskDetails(id: any) {
    const url = environment.updateTaskDetails + id;
    return this.http.delete(url).pipe(
      catchError((error) => {
        return this.commonService.catchError(error);
      }),
      map((response: any) => {
        return response;
      })
    );
  }
  updaterTaskEndpoint(data: any, form: any) {
    const url = environment.updateTaskDetails + data.id + '/status';
    return this.http.put(url, form).pipe(
      catchError((error) => {
        return this.commonService.catchError(error);
      }),
      map((response: any) => {
        return response;
      })
    );
  }

  changeAssigneeEndpoint(data: any) {
    const url = environment.changeAssigneeEndpoint + data.id + '/assignee';
    return this.http.put(url, data.assignee_id).pipe(
      catchError((error) => {
        return this.commonService.catchError(error);
      }),
      map((response: any) => {
        return response;
      })
    );
  }
}
