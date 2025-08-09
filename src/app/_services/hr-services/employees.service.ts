import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { catchError, map } from 'rxjs';
import { CommonsService } from '../commons.service';

@Injectable({
  providedIn: 'root',
})
export class EmployeesService {
  constructor(
    private http: HttpClient,
    private commonService: CommonsService
  ) {}

  getAllEmployees(data: any) {
    const url = environment.getEmployees;
    let urlParams = new HttpParams();
    data.skip ? (urlParams = urlParams.append('skip', data.skip)) : null;
    data.limit ? (urlParams = urlParams.append('limit', data.limit)) : null;
    data.department_id
      ? (urlParams = urlParams.append('department_id', data.department_id))
      : null;
    data.manager_id
      ? (urlParams = urlParams.append('manager_id', data.manager_id))
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

  createEmployee(data: any) {
    const url = environment.createEmployee;
    return this.http.post(url, data).pipe(
      catchError((error) => {
        return this.commonService.catchError(error);
      }),
      map((response: any) => {
        return response;
      })
    );
  }

  deleteEmployeeData(id: any) {
    const url = environment.deleteEmployeeDetails + id;
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
