import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { catchError, map } from 'rxjs';
import { CommonsService } from '../commons.service';

@Injectable({
  providedIn: 'root',
})
export class DepartmentService {
  constructor(
    private http: HttpClient,
    private commonService: CommonsService
  ) {}

  getAllDepartments() {
    const url = environment.getDepartments;
    return this.http.get(url).pipe(
      catchError((error) => {
        return this.commonService.catchError(error);
      }),
      map((response: any) => {
        return response;
      })
    );
  }

  createDepartment(data: any) {
    const url = environment.createDepartment;
    return this.http.post(url, data).pipe(
      catchError((error) => {
        return this.commonService.catchError(error);
      }),
      map((response: any) => {
        return response;
      })
    );
  }

  updateDepartment(id: string, data: any) {
    const url = `${environment.updateDepartment}${id}`;
    return this.http.put(url, data).pipe(
      catchError((error) => {
        return this.commonService.catchError(error);
      }),
      map((response: any) => {
        return response;
      })
    );
  }

  deleteDepartment(id: string) {
    const url = `${environment.deleteDepartment}${id}`;
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
