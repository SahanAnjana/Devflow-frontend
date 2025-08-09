import { Injectable } from '@angular/core';
import { CommonsService } from '../commons.service';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ExpensesService {
  constructor(
    private commonService: CommonsService,
    private http: HttpClient
  ) {}

  createExpense(data: any): Observable<any> {
    const url = environment.createnewExpenses;
    return this.http.post<any>(url, data).pipe(
      catchError((error) => this.commonService.catchError(error)),
      map((response: any) => response)
    );
  }

  getAllExpenses(data: {
    skip?: number;
    limit?: number;
    project_id?: string;
  }): Observable<any> {
    const url = environment.getAllExpenses;
    let urlParams = new HttpParams();

    if (data.skip !== undefined) {
      urlParams = urlParams.append('skip', data.skip.toString());
    }
    if (data.limit !== undefined) {
      urlParams = urlParams.append('limit', data.limit.toString());
    }
    if (data.project_id) {
      urlParams = urlParams.append('project_id', data.project_id);
    }

    return this.http
      .get<any>(url, { params: urlParams })
      .pipe(catchError((error) => this.commonService.catchError(error)));
  }

  getExpenseById(id: any): Observable<any> {
    const url = environment.getExpensesDetailsById + id;
    return this.http.get(url).pipe(
      catchError((error) => {
        return this.commonService.catchError(error);
      }),
      map((response: any) => {
        return response;
      })
    );
  }

  updateExpense(id: any, data: any): Observable<any> {
    const url = environment.updateExpenses + id;
    return this.http.put(url, data).pipe(
      catchError((error) => {
        return this.commonService.catchError(error);
      }),
      map((response: any) => {
        return response;
      })
    );
  }

  deleteExpense(id: any): Observable<any> {
    const url = environment.deleteExpenses + id;
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
