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
    ) { }

    createExpense(data: any): Observable<any> {
        const url = environment.createnewExpenses;
        return this.http.post<any>(url, data).pipe(
            catchError((error) => this.commonService.catchError(error)),
            map((response: any) => response)
        );
    }

    getAllExpenses(data: { skip?: number; limit?: number; project_id?: string }): Observable<any> {
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

        return this.http.get<any>(url, { params: urlParams }).pipe(
            catchError((error) => this.commonService.catchError(error))
        );
    }


}
