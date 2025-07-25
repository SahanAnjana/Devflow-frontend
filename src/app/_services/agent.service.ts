import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CommonsService } from './commons.service';

@Injectable({
  providedIn: 'root',
})
export class AgentService {
  constructor(
    private commonService: CommonsService,
    private http: HttpClient
  ) {}
  sendingCurrencyList: any[] = [];
  receivingCurrencyList: any[] = [];
  documentList: any = [];
  selectedCountryList: any[] = [];
  saveAgentSendingReceivingCurrency(data: any, exposableId: any) {
    const url = environment.saveAgentSendingReceivingCurrency + exposableId;

    return this.http.post(url, data).pipe(
      catchError((err) => {
        return this.commonService.catchError(err);
      }),
      map((response: any) => {
        return response;
      })
    );
  }
  updateAgentSendingCurrencyStatusUpdate(data: any) {
    const url = environment.agentSendingReceivingCurrencyStatusUpdate;
    let urlParams = new HttpParams();
    urlParams = urlParams.append('isActive', data.isActive);
    urlParams = urlParams.append(
      'agentTransferApprovedSendingReceivingCurrenciesId',
      data.agentTransferApprovedSendingReceivingCurrenciesId
    );
    return this.http.post(url, null, { params: urlParams }).pipe(
      catchError((err) => {
        return this.commonService.catchError(err);
      }),
      map((response: any) => {
        return response;
      })
    );
  }
  getAllAgentIdentityMode(exposableId: any) {
    const url = environment.getAgentIdentityModes + exposableId;

    return this.http.get(url).pipe(
      catchError((err) => {
        return this.commonService.catchError(err);
      }),
      map((response: any) => {
        return response;
      })
    );
  }
  updateCreditBalanceStatus(data: any) {
    const url = environment.updateCreditBalanceStatus + data.exposableId;
    let urlParams = new HttpParams();
    urlParams = urlParams.append(
      'isCreditBalanceRequired',
      data.isCreditBalanceRequired
    );
    return this.http.put(url, null, { params: urlParams }).pipe(
      catchError((err) => {
        return this.commonService.catchError(err);
      }),
      map((response: any) => {
        return response;
      })
    );
  }
  addAgentCurrencyRate(data: any) {
    const url = environment.updateAgentCurrencyRate + data.agentDetailsId;

    return this.http.post(url, data).pipe(
      catchError((err) => {
        return this.commonService.catchError(err);
      }),
      map((response: any) => {
        return response;
      })
    );
  }
  updateAgentCurrencyRate(data: any) {
    const url = environment.updateRateSetting;

    return this.http.post(url, data).pipe(
      catchError((err) => {
        return this.commonService.catchError(err);
      }),
      map((response: any) => {
        return response;
      })
    );
  }
  saveAgentTransactionFee(data: any) {
    const url = environment.saveAgentTransactionFee;

    return this.http.post(url, data).pipe(
      catchError((err) => {
        return this.commonService.catchError(err);
      }),
      map((response: any) => {
        return response;
      })
    );
  }
  getAllagentTransactionFee(data: any) {
    const url = environment.getAllTransactionFee + data.exposableId;
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
  getAgentNotification(data: any) {
    const url = environment.getagentNotificationConfiguration + data;

    return this.http.get(url).pipe(
      catchError((err) => {
        return this.commonService.catchError(err);
      }),
      map((response: any) => {
        return response;
      })
    );
  }
  saveSendingRecievingValidation(data: any) {
    const url = environment.savesendingReceivingAmountValidation;

    return this.http.post(url, data).pipe(
      catchError((err) => {
        return this.commonService.catchError(err);
      }),
      map((response: any) => {
        return response;
      })
    );
  }

  saveAgentNotification(data: any) {
    const url = environment.saveAgentNotification;

    return this.http.post(url, data).pipe(
      catchError((err) => {
        return this.commonService.catchError(err);
      }),
      map((response: any) => {
        return response;
      })
    );
  }
  getAllagentReceivingCountries(data: any) {
    const url = environment.agentReceivingCountries + data.exposableId;
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
  getAgentCountries(data: any) {
    const url = environment.getCountries + data;

    return this.http.get(url).pipe(
      catchError((err) => {
        return this.commonService.catchError(err);
      }),
      map((response: any) => {
        return response;
      })
    );
  }
  getAgentSendingReceivingCurrency(exposableId: any, currencyCode: any) {
    const url =
      environment.getagentSendingReceivingCurrency +
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

  saveAgentReceivingCountry(body: any) {
    const url = environment.saveAgentReceivingCountries;
    return this.http.post(url, body).pipe(
      catchError((err) => {
        return this.commonService.catchError(err);
      }),
      map((response: any) => {
        return response;
      })
    );
  }

  updateAgentStatus(data: any) {
    const url = environment.updateStatus + data.agentDetailsId;
    let urlParams = new HttpParams();
    urlParams = urlParams.append('status', data.status);
    return this.http.put(url, null, { params: urlParams }).pipe(
      catchError((err) => {
        return this.commonService.catchError(err);
      }),
      map((response: any) => {
        return response;
      })
    );
  }

  updateAgentApproveStatus(data: any) {
    const url = environment.updateSubAgnetStatus + data.agentDetailsId;
    let urlParams = new HttpParams();
    urlParams = urlParams.append('isSubAgent', data.isSubAgent);
    urlParams = urlParams.append('status', data.status);
    return this.http.put(url, null, { params: urlParams }).pipe(
      catchError((err) => {
        return this.commonService.catchError(err);
      }),
      map((response: any) => {
        return response;
      })
    );
  }
  getcountry(data: any) {
    const url = environment.country + data;
    let urlParams = new HttpParams();

    return this.http.get(url, { params: urlParams }).pipe(
      catchError((err) => {
        return this.commonService.catchError(err);
      }),
      map((response: any) => {
        return response;
      })
    );
  }

  getDocumentTypes() {
    const url = environment.getDocuments;

    return this.http.get(url).pipe(
      catchError((err) => {
        return this.commonService.catchError(err);
      }),
      map((response: any) => {
        return response;
      })
    );
  }

  saveAgent(urlData: any, data: any) {
    const url = environment.saveAgent + urlData.clientCode;
    let urlParams = new HttpParams();
    urlParams = urlParams.append('loggedUserName', urlData.loggedUserName);
    urlData.isAgent
      ? (urlParams = urlParams.append('isAgent', urlData.isAgent))
      : null;
    return this.http.post(url, data, { params: urlParams }).pipe(
      catchError((err) => {
        return this.commonService.catchError(err);
      }),
      map((response: any) => {
        return response;
      })
    );
  }
  uploadDocument(id: any, data: any) {
    const url = environment.uploadAgentDocuments + id;

    return this.http.post(url, data).pipe(
      catchError((err) => {
        return this.commonService.catchError(err);
      }),
      map((response: any) => {
        return response;
      })
    );
  }

  saveSignUpCountries(data: any) {
    const url = environment.saveAgentCustomerCountry;

    return this.http.post(url, data).pipe(
      catchError((err) => {
        return this.commonService.catchError(err);
      }),
      map((response: any) => {
        return response;
      })
    );
  }
  saveAgentReceivingCurrency(data: any) {
    const url = environment.saveAgentReceivingCurrency;

    return this.http.post(url, data).pipe(
      catchError((err) => {
        return this.commonService.catchError(err);
      }),
      map((response: any) => {
        return response;
      })
    );
  }
  saveAgentSendingCurrency(data: any) {
    const url = environment.saveAgentSendingCurrency;

    return this.http.post(url, data).pipe(
      catchError((err) => {
        return this.commonService.catchError(err);
      }),
      map((response: any) => {
        return response;
      })
    );
  }

  getAllreceivingcurrencies(data: any) {
    const url = environment.getAgentReceivingCurrency + '/' + data.exposableId;
    return this.http.get(url).pipe(
      catchError((err) => {
        return this.commonService.catchError(err);
      }),
      map((response: any) => {
        return response;
      })
    );
  }

  getSignUpcountries(data: any) {
    const url = environment.getSignupCountries + '/' + data.exposableId;
    return this.http.get(url).pipe(
      catchError((err) => {
        return this.commonService.catchError(err);
      }),
      map((response: any) => {
        return response;
      })
    );
  }
  getAgentApprovedRates(data: any) {
    const url =
      environment.agentCustomerApprovedCurrencyRate +
      '/' +
      data.agentCurrencyRateId;
    return this.http.get(url).pipe(
      catchError((err) => {
        return this.commonService.catchError(err);
      }),
      map((reponse: any) => {
        return reponse;
      })
    );
  }
  updateTransferFee(formData: any, data: any) {
    const url = environment.updateTransferFee;
    let urlParams = new HttpParams();
    urlParams = urlParams.append(
      'agentConfiguredTransferFeeId',
      data.agentConfiguredTransferFeeId
    );
    return this.http.put(url, formData, { params: urlParams }).pipe(
      catchError((err) => {
        return this.commonService.catchError(err);
      }),
      map((reponse: any) => {
        return reponse;
      })
    );
  }

  updateRateSettings(data: any) {
    const url = environment.updateRateSettings;
    return this.http.put(url, data).pipe(
      catchError((err) => {
        return this.commonService.catchError(err);
      }),
      map((reponse: any) => {
        return reponse;
      })
    );
  }

  getAgentDetailsByagentDetailsId(data: any) {
    const url =
      environment.getAgentDetailsByagentDetailsId + data.agentDetailsId;
    return this.http.get(url).pipe(
      catchError((err) => {
        return this.commonService.catchError(err);
      }),
      map((reponse: any) => {
        return reponse;
      })
    );
  }
}
