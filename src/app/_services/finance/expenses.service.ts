import { Injectable } from '@angular/core';
import { CommonsService } from '../commons.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, map } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class ExpensesService {
    constructor(
        private commonService: CommonsService,
        private http: HttpClient
    ) { }

    createExpense(data: any) {
        const url = environment.createnewExpenses;
        return this.http.post(url, data).pipe(
            catchError((error) => this.commonService.catchError(error)),
            map((response: any) => response)
        );
    }

    getAllExpenses(data: any) {
        const url = environment.getAllExpenses;
        let urlParams = new HttpParams();
        data.skip ? (urlParams = urlParams.append('skip', data.skip)) : null;
        data.limit ? (urlParams = urlParams.append('limit', data.limit)) : null;
        data.project_id ? (urlParams = urlParams.append('project_id', data.project_id)) : null;
        return this.http.get(url, { params: urlParams }).pipe(
            catchError((error) => this.commonService.catchError(error)),
            map((response: any) => response)
        );
    }

    getExpenseById(id: any) {
        const url = environment.getAllExpenses + '/' + id;
        return this.http.get(url).pipe(
            catchError((error) => this.commonService.catchError(error)),
            map((response: any) => response)
        );
    }

    updateExpense(id: any, data: any) {
        const url = environment.updateExpenses + id;
        return this.http.put(url, data).pipe(
            catchError((error) => this.commonService.catchError(error)),
            map((response: any) => response)
        );
    }

    deleteExpense(id: any) {
        const url = environment.deleteExpenses + id;
        return this.http.delete(url).pipe(
            catchError((error) => this.commonService.catchError(error)),
            map((response: any) => response)
        );
    }
}
