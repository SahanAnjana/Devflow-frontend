import { Injectable } from '@angular/core';
import { CommonsService } from '../commons.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, map } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class AccountsService {
    constructor(
        private commonService: CommonsService,
        private http: HttpClient
    ) { }

    createAccount(data: any) {
        const url = environment.createnewAccounts;
        return this.http.post(url, data).pipe(
            catchError((error) => {
                return this.commonService.catchError(error);
            }),
            map((response: any) => {
                return response;
            })
        );
    }
    getALlAccounts(data: any) {
        const url = environment.getAllAccounts;
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

    getAccountDataById(id: any) {
        const url = environment.getAccountsDetailsById + id;
        return this.http.get(url).pipe(
            catchError((error) => {
                return this.commonService.catchError(error);
            }),
            map((response: any) => {
                return response;
            })
        );
    }

    updateAccountData(id: any, data: any) {
        const url = environment.updateAccounts + id;
        return this.http.put(url, data).pipe(
            catchError((error) => {
                return this.commonService.catchError(error);
            }),
            map((response: any) => {
                return response;
            })
        );
    }

    deleteAccount(id: any) {
        const url = environment.deleteAccounts + id;
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
