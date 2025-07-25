import { Injectable } from '@angular/core';
import { CommonsService } from '../commons.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, map } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class InvoicesService {
    constructor(
        private commonService: CommonsService,
        private http: HttpClient
    ) { }

    createInvoice(data: any) {
        const url = environment.createnewInvoices;
        return this.http.post(url, data).pipe(
            catchError((error) => this.commonService.catchError(error)),
            map((response: any) => response)
        );
    }

    getAllInvoices(data: any) {
        const url = environment.getAllInvoices;
        let urlParams = new HttpParams();
        data.skip ? (urlParams = urlParams.append('skip', data.skip)) : null;
        data.limit ? (urlParams = urlParams.append('limit', data.limit)) : null;
        data.project_id ? (urlParams = urlParams.append('project_id', data.project_id)) : null;
        return this.http.get(url, { params: urlParams }).pipe(
            catchError((error) => this.commonService.catchError(error)),
            map((response: any) => response)
        );
    }

    getInvoiceById(id: any) {
        const url = environment.getAllInvoices + '/' + id;
        return this.http.get(url).pipe(
            catchError((error) => this.commonService.catchError(error)),
            map((response: any) => response)
        );
    }

    updateInvoice(id: any, data: any) {
        const url = environment.updateInvoices + id;
        return this.http.put(url, data).pipe(
            catchError((error) => this.commonService.catchError(error)),
            map((response: any) => response)
        );
    }

    deleteInvoice(id: any) {
        const url = environment.deleteInvoices + id;
        return this.http.delete(url).pipe(
            catchError((error) => this.commonService.catchError(error)),
            map((response: any) => response)
        );
    }
}
