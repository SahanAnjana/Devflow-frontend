import { Injectable } from '@angular/core';
import { CommonsService } from '../commons.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, map } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class BudgetsService {
    constructor(
        private commonService: CommonsService,
        private http: HttpClient
    ) { }

    createBudget(data: any) {
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
    getALlBudgets(data: any) {
        const url = environment.getAllBudgets;
        let urlParams = new HttpParams();
        data.skip ? (urlParams = urlParams.append('skip', data.skip)) : null;
        data.limit ? (urlParams = urlParams.append('limit', data.limit)) : null;
        data.project_id
            ? (urlParams = urlParams.append('project_id', data.project_id))
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

    // Alias method for consistent naming
    getAllBudgets(data: any) {
        return this.getALlBudgets(data);
    }

    getBudgetDataById(id: any) {
        const url = environment.getBudgetsDetailsById + id;
        return this.http.get(url).pipe(
            catchError((error) => {
                return this.commonService.catchError(error);
            }),
            map((response: any) => {
                return response;
            })
        );
    }

    updateBudgetData(id: any, data: any) {
        const url = environment.updateBudgets + id;
        return this.http.put(url, data).pipe(
            catchError((error) => {
                return this.commonService.catchError(error);
            }),
            map((response: any) => {
                return response;
            })
        );
    }

    deleteBudget(id: any) {
        const url = environment.deleteBudgets + id;
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
