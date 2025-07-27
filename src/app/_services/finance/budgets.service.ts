import { Injectable } from '@angular/core';
import { CommonsService } from '../commons.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class BudgetsService {
    constructor(
        private commonService: CommonsService,
        private http: HttpClient
    ) { }

    createBudget(data: any): Observable<any> {
        const url = environment.createnewBudgets;
        return this.http.post(url, data).pipe(
            catchError((error) => {
                return this.commonService.catchError(error);
            }),
            map((response: any) => {
                return response;
            })
        );
    }

    getAllBudgets(data: { skip?: number; limit?: number; project_id?: string }): Observable<any> {
        const url = environment.getAllBudgets;
        let urlParams = new HttpParams();
        if (data.skip) urlParams = urlParams.append('skip', data.skip.toString());
        if (data.limit) urlParams = urlParams.append('limit', data.limit.toString());
        if (data.project_id) urlParams = urlParams.append('project_id', data.project_id);

        return this.http.get(url, { params: urlParams }).pipe(
            catchError((error) => {
                return this.commonService.catchError(error);
            }),
            map((response: any) => {
                return response;
            })
        );
    }

}
