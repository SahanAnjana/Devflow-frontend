import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommonsService } from './commons.service';
import { environment } from 'src/environments/environment';
import { catchError, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SubAgentSettingsService {
  constructor(private http: HttpClient, public commons: CommonsService) {}

  viewSubAgentDataById(data: any) {
    const url = environment.getSubAgentById + data.userDetailsId; //please add url

    return this.http.get(url).pipe(
      catchError((error) => {
        return this.commons.catchError(error);
      }),
      map((response: any) => {
        return response;
      })
    );
  }

  getAllPrivilages(data: any) {
    const url = environment.getAllSubAgentPrivilages + data.email;

    return this.http.get(url).pipe(
      catchError((err) => {
        return this.commons.catchError(err);
      }),
      map((response: any) => {
        return response;
      })
    );
  }

  updatePrivilageStatus(data: any) {
    const url = environment.updateSubAgentPrivilageStatus;

    return this.http.put(url, data).pipe(
      catchError((err) => {
        return this.commons.catchError(err);
      }),
      map((response: any) => {
        return response;
      })
    );
  }

  getAllProviderType(data: any) {
    const url = environment.getAllProviderType;
    let urlParams = new HttpParams();

    return this.http.get(url, { params: urlParams }).pipe(
      catchError((err) => {
        return this.commons.catchError(err);
      }),
      map((response: any) => {
        // this.responseHandler();
        return response;
      })
    );
  }

  getAllCurrencyType(data: any) {
    const url = environment.getAllCurrencyType + data.exposableId;
    let urlParams = new HttpParams();
    // data.agentExposableId
    //   ? (urlParams = urlParams.append(
    //       'agentExposableId',
    //       data.agentExposableId
    //     ))
    //   : null;
    return this.http.get(url).pipe(
      catchError((err) => {
        return this.commons.catchError(err);
      }),
      map((response: any) => {
        // this.responseHandler();
        return response;
      })
    );
  }

  getAllAgentCurrencyRate(data: any) {
    const url = environment.getAllAgentCurrencyRate + data.agentId;
    let urlparams = new HttpParams();
    // data.coreDetailsId
    //   ? (urlparams = urlparams.append('coreDetailsId', data.coreDetailsId))
    //   : null;
    data.pageNumber
      ? (urlparams = urlparams.append('pageNumber', data.pageNumber))
      : null;
    data.pageSize
      ? (urlparams = urlparams.append('pageSize', data.pageSize))
      : null;
    data.currencyId
      ? (urlparams = urlparams.append('currencyId', data.currencyId))
      : null;
    data.providerType
      ? (urlparams = urlparams.append('providerType', data.providerType))
      : null;
    // data.branchDetailsId
    //   ? (urlparams = urlparams.append('branchDetailsId', data.branchDetailsId))
    //   : null;
    return this.http.get(url, { params: urlparams }).pipe(
      catchError((err) => {
        return this.commons.catchError(err);
      }),
      map((response: any) => {
        return response;
      })
    );
  }

  getSubAgentagentIdentityMode(data: any) {
    const url = environment.getAllIdentityMode + data.exposableId;

    return this.http.get(url).pipe(
      catchError((error) => {
        return this.commons.catchError(error);
      }),
      map((response: any) => {
        return response;
      })
    );
  }

  updateSubAgentIdentityModeStatus(data: any) {
    const url =
      environment.updateSubAgentIdentityModeStatus + data.agentIdentityModeId;
    let urlParams = new HttpParams();
    urlParams = urlParams.append('isActive', data.isActive);
    return this.http.put(url, null, { params: urlParams }).pipe(
      catchError((err) => {
        return this.commons.catchError(err);
      }),
      map((response: any) => {
        return response;
      })
    );
  }

  getSubAgentPaymentMode(data: any) {
    const url = environment.getAllIPaymentMode + data.exposableId;

    // console.log('subPaymenmode', data);

    return this.http.get(url).pipe(
      catchError((error) => {
        return this.commons.catchError(error);
      }),
      map((response: any) => {
        return response;
      })
    );
  }

  updateSubAgentPaymentModeStatus(data: any) {
    const url =
      environment.updateSubAgentPaymentModeStatus + data.agentPaymentModeId;
    let urlParams = new HttpParams();
    urlParams = urlParams.append('isActive', data.isActive);
    return this.http.put(url, null, { params: urlParams }).pipe(
      catchError((err) => {
        return this.commons.catchError(err);
      }),
      map((response: any) => {
        return response;
      })
    );
  }

  getAllSubAgentReceivingCurrency(data: any) {
    const url = environment.getAllReceivingCurrency + data.exposableId;

    let urlParams = new HttpParams();
    data.isUnique && (urlParams = urlParams.append('isUnique', data.isUnique));
    data.agentTransferApprovedReceivingCurrenciesId &&
      (urlParams = urlParams.append(
        'agentTransferApprovedReceivingCurrenciesId',
        data.agentTransferApprovedReceivingCurrenciesId
      ));
    return this.http.get(url, { params: urlParams }).pipe(
      catchError((error) => {
        return this.commons.catchError(error);
      }),
      map((response: any) => {
        return response;
      })
    );
  }

  getSubAgentTransferMode(data: any) {
    const url = environment.getAllTransferMode + data.exposableId;
    let urlparams = new HttpParams();

    data.pageNumber
      ? (urlparams = urlparams.append('pageNumber', data.pageNumber))
      : null;
    data.pageSize
      ? (urlparams = urlparams.append('pageSize', data.pageSize))
      : null;
    data.isUnique
      ? (urlparams = urlparams.append('isUnique', data.isUnique))
      : null;
    data.agentTransferApprovedReceivingCurrenciesId
      ? (urlparams = urlparams.append(
          'agentTransferApprovedReceivingCurrenciesId',
          data.agentTransferApprovedReceivingCurrenciesId
        ))
      : null;

    return this.http.get(url, { params: urlparams }).pipe(
      catchError((err) => {
        return this.commons.catchError(err);
      }),
      map((response: any) => {
        return response;
      })
    );
  }

  updateSubAgentTransferModeStatus(data: any) {
    const url =
      environment.updateSubAgentTransferModeStatus +
      data.agentCurrencyTransactionModeId;

    let urlParams = new HttpParams();
    urlParams = urlParams.append('isActive', data.isActive);
    return this.http.put(url, null, { params: urlParams }).pipe(
      catchError((err) => {
        return this.commons.catchError(err);
      }),
      map((response: any) => {
        return response;
      })
    );
  }

  updateSubAgentCreditBalanceStatus(data: any) {
    const url =
      environment.updateCreditBalanceStatus + data.isCreditBalanceRequired;

    let urlParams = new HttpParams();
    urlParams = urlParams.append('exposableId', data.exposableId);
    urlParams = urlParams.append(
      'isCreditBalanceRequired',
      data.isCreditBalanceRequired
    );
    return this.http.put(url, null, { params: urlParams }).pipe(
      catchError((err) => {
        return this.commons.catchError(err);
      }),
      map((response: any) => {
        return response;
      })
    );
  }

  getSubAgentTransfee(data: any) {
    const url = environment.getAllTransferFee + data.exposableId;
    let urlparams = new HttpParams();

    data.pageNumber
      ? (urlparams = urlparams.append('pageNumber', data.pageNumber))
      : null;
    data.pageSize
      ? (urlparams = urlparams.append('pageSize', data.pageSize))
      : null;

    return this.http.get(url, { params: urlparams }).pipe(
      catchError((err) => {
        return this.commons.catchError(err);
      }),
      map((response: any) => {
        return response;
      })
    );
  }

  getAllSubAgentSendingCurrency(data: any) {
    const url = environment.getAllSendingCurrency + data.exposableId;

    return this.http.get(url).pipe(
      catchError((error) => {
        return this.commons.catchError(error);
      }),
      map((response: any) => {
        return response;
      })
    );
  }

  getAllSubAgentTransferMode(data: any) {
    const url = environment.getAgentTransactionMode + data.exposableId;

    // console.log('subTransferMode', data);

    return this.http.get(url).pipe(
      catchError((error) => {
        return this.commons.catchError(error);
      }),
      map((response: any) => {
        return response;
      })
    );
  }

  getAllSubAgentPaymentMode(data: any) {
    const url = environment.getAgentPaymentMode + data.exposableId;

    // console.log('subTransferMode', data);

    return this.http.get(url).pipe(
      catchError((error) => {
        return this.commons.catchError(error);
      }),
      map((response: any) => {
        return response;
      })
    );
  }

  getAllcurrencyAmountValidation(data: any) {
    const url = environment.sendingReceivingAmountValidation + data.exposableId;
    let urlparams = new HttpParams();

    data.pageNumber
      ? (urlparams = urlparams.append('pageNumber', data.pageNumber))
      : null;
    data.pageSize
      ? (urlparams = urlparams.append('pageSize', data.pageSize))
      : null;

    return this.http.get(url, { params: urlparams }).pipe(
      catchError((err) => {
        return this.commons.catchError(err);
      }),
      map((response: any) => {
        return response;
      })
    );
  }

  getAllApprovedCountries(data: any) {
    const url = environment.getAllSubAgentReceivingCountries + data.exposableId;
    let urlparams = new HttpParams();

    data.pageNumber
      ? (urlparams = urlparams.append('pageNumber', data.pageNumber))
      : null;
    data.pageSize
      ? (urlparams = urlparams.append('pageSize', data.pageSize))
      : null;

    return this.http.get(url, { params: urlparams }).pipe(
      catchError((err) => {
        return this.commons.catchError(err);
      }),
      map((response: any) => {
        return response;
      })
    );
  }
}
