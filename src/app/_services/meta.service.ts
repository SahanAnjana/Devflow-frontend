import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommonsService } from './commons.service';
import { environment } from 'src/environments/environment';
import { catchError, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MetaService {
  constructor(
    private commonService: CommonsService,
    private http: HttpClient
  ) {}

  getCountries(data: any) {
    const url = environment.getSignupCountries + '/' + data;

    return this.http.get(url).pipe(
      map((user: any) => {
        return user;
      }),
      catchError((err) => {
        return this.commonService.catchError(err);
      })
    );
  }
  getNationalities() {
    const url = environment.nationality;

    return this.http.get(url).pipe(
      map((user: any) => {
        return user;
      }),
      catchError((err) => {
        return this.commonService.catchError(err);
      })
    );
  }
  getAgentDetailsGetExposableId(data: any) {
    const url = environment.getAgentDetailsExposableId;

    let urlParams = new HttpParams();
    urlParams = urlParams.append('username', data);

    return this.http.get(url, { params: urlParams }).pipe(
      catchError((err) => {
        return this.commonService.catchError(err);
      }),
      map((response: any) => {
        return response;
      })
    );
  }
  getagentIdentityMode(data: any) {
    const url = environment.getAgentIdentityMode + '/' + data;

    return this.http.get(url).pipe(
      catchError((err) => {
        return this.commonService.catchError(err);
      }),
      map((response: any) => {
        return response;
      })
    );
  }
  getAllContactTitleNames() {
    const url = environment.getAllContactTitleNames;

    return this.http.get(url).pipe(
      catchError((err) => {
        return this.commonService.catchError(err);
      }),
      map((response: any) => {
        return response;
      })
    );
  }
  getAllcountryCode() {
    const url = environment.countryCode;

    return this.http.get(url).pipe(
      catchError((err) => {
        return this.commonService.catchError(err);
      }),
      map((response: any) => {
        return response;
      })
    );
  }
  getAllAgentReceivingCurrencies(exposableId: any) {
    const url = environment.agentReceivingCurrency + exposableId;

    return this.http.get(url).pipe(
      catchError((err) => {
        return this.commonService.catchError(err);
      }),
      map((response: any) => {
        return response;
      })
    );
  }
  agentSendingReceivingCurrency(data: any) {
    const url = environment.agentSendingReceivingCurrency + data.exposableId;
    let urlParams = new HttpParams();
    urlParams = urlParams.append('pageNumber', data.pageNumber);
    urlParams = urlParams.append('pageSize', data.pageSize);
    return this.http.get(url, { params: urlParams }).pipe(
      catchError((err) => {
        return this.commonService.catchError(err);
      }),
      map((response: any) => {
        return response;
      })
    );
  }

  getAllAgentReceivingCurrenciesByCurrencyCode(
    exposableId: any,
    currencyCode: any
  ) {
    const url =
      environment.getagentSendingReceivingCurrencyByCurrencyCode +
      exposableId +
      '/' +
      currencyCode;

    return this.http.get(url).pipe(
      catchError((err) => {
        return this.commonService.catchError(err);
      }),
      map((response: any) => {
        return response;
      })
    );
  }
  getAllAgentTransferModeByCurrencyCode(
    exposableId: any,
    agentTransferApprovedSendingReceivingCurrenciesId: any
  ) {
    const url =
      environment.agentTransactionModeByCurrencyId +
      exposableId +
      '/' +
      agentTransferApprovedSendingReceivingCurrenciesId;

    return this.http.get(url).pipe(
      catchError((err) => {
        return this.commonService.catchError(err);
      }),
      map((response: any) => {
        return response;
      })
    );
  }
}
