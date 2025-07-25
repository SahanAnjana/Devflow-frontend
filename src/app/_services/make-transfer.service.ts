import { HttpClient, HttpParams } from '@angular/common/http';
import { EnvironmentInjector, Injectable } from '@angular/core';
import { CommonsService } from './commons.service';
import { environment } from 'src/environments/environment';
import { catchError, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MakeTransferService {
  constructor(
    private http: HttpClient,
    private commonService: CommonsService
  ) {}

  getAllAgents() {
    const url = environment.getAllAgents;
    return this.http.get(url).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((err) => {
        return this.commonService.catchError(err);
      })
    );
  }

  getAgentsByIdandType(data: any) {
    const url = environment.getAllAgentDetails;
    let urlParams = new HttpParams();
    data.agentId
      ? (urlParams = urlParams.append('agentId', data.agentId))
      : null;
    data.type ? (urlParams = urlParams.append('type', data.type)) : null;
    return this.http.get(url, { params: urlParams }).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((err) => {
        return this.commonService.catchError(err);
      })
    );
  }
  getAgentSendingCurrency(data: any) {
    const url = environment.getAgentSendingCurrency + '/' + data.exposableId;
    return this.http.get(url).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((err) => {
        return this.commonService.catchError(err);
      })
    );
  }

  getAgentSendingReceivingCurrency(data: any) {
    const url =
      environment.getReceivingCurrency +
      '/' +
      data.exposableId +
      '/' +
      data.currencyCode;
    return this.http.get(url).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((err) => {
        return this.commonService.catchError(err);
      })
    );
  }
  getAgentCurrencyRateSendAmount(data: any) {
    const url =
      environment.getAgentCurrencyRate +
      '/' +
      data.exposableId +
      '/' +
      'SENDAMOUNT';
    let urlParams = new HttpParams();
    data.sendingCurrencyId
      ? (urlParams = urlParams.append(
          'sendingCurrencyId',
          data.sendingCurrencyId
        ))
      : null;
    data.receivingCurrencyId
      ? (urlParams = urlParams.append(
          'receivingCurrencyId',
          data.receivingCurrencyId
        ))
      : null;
    data.amount ? (urlParams = urlParams.append('amount', data.amount)) : null;
    data.email ? (urlParams = urlParams.append('email', data.email)) : null;
    data.providerType
      ? (urlParams = urlParams.append('providerType', data.providerType))
      : null;
    return this.http.get(url, { params: urlParams }).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((err) => {
        return this.commonService.catchError(err);
      })
    );
  }
  getAgentCurrencyRateReceivedAmount(data: any) {
    const url =
      environment.getAgentCurrencyRate +
      '/' +
      data.exposableId +
      '/' +
      'RECEIVEAMOUNT';
    let urlParams = new HttpParams();
    data.sendingCurrencyId
      ? (urlParams = urlParams.append(
          'sendingCurrencyId',
          data.sendingCurrencyId
        ))
      : null;
    data.receivingCurrencyId
      ? (urlParams = urlParams.append(
          'receivingCurrencyId',
          data.receivingCurrencyId
        ))
      : null;
    data.amount ? (urlParams = urlParams.append('amount', data.amount)) : null;
    data.email ? (urlParams = urlParams.append('email', data.email)) : null;
    data.providerType
      ? (urlParams = urlParams.append('providerType', data.providerType))
      : null;
    return this.http.get(url, { params: urlParams }).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((err) => {
        return this.commonService.catchError(err);
      })
    );
  }
  getSendingReceivingAmountValidation(data: any) {
    const url = environment.getSendingReceivingAmountValidation;
    let urlParams = new HttpParams();
    data.agentTransferApprovedSendingCurrenciesId
      ? (urlParams = urlParams.append(
          'agentTransferApprovedSendingCurrenciesId',
          data.agentTransferApprovedSendingCurrenciesId
        ))
      : null;
    data.agentTransferApprovedReceivingCurrenciesId
      ? (urlParams = urlParams.append(
          'agentTransferApprovedReceivingCurrenciesId',
          data.agentTransferApprovedReceivingCurrenciesId
        ))
      : null;
    data.agentPaymentModeId
      ? (urlParams = urlParams.append(
          'agentPaymentModeId',
          data.agentPaymentModeId
        ))
      : null;
    data.sendingAmount
      ? (urlParams = urlParams.append('sendingAmount', data.sendingAmount))
      : null;
    data.receivedAmount
      ? (urlParams = urlParams.append('receivedAmount', data.receivedAmount))
      : null;
    return this.http.get(url, { params: urlParams }).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((err) => {
        return this.commonService.catchError(err);
      })
    );
  }

  getAgentIdentityMode(data: any) {
    const url = environment.getAgentIdentityMode + '/' + data.exposableId;
    return this.http.get(url).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((err) => {
        return this.commonService.catchError(err);
      })
    );
  }

  getAllSignUpCountries(data: any) {
    const url = environment.getSignupCountries + '/' + data.exposableId;
    return this.http.get(url).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((err) => {
        return this.commonService.catchError(err);
      })
    );
  }

  getCountryCode() {
    const url = environment.countryCode;
    return this.http.get(url).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((err) => {
        return this.commonService.catchError(err);
      })
    );
  }

  getNationality() {
    const url = environment.getNationality;
    return this.http.get(url).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((err) => {
        return this.commonService.catchError(err);
      })
    );
  }

  getAgentSenderDuplicateSearch(data: any) {
    const url =
      environment.getAgentSenderDuplicateSearch + '/' + data.exposableId;
    let urlParams = new HttpParams();
    data.firstName
      ? (urlParams = urlParams.append('firstName', data.firstName))
      : null;
    data.lastName
      ? (urlParams = urlParams.append('lastName', data.lastName))
      : null;
    data.telephoneNumber
      ? (urlParams = urlParams.append('telephoneNumber', data.telephoneNumber))
      : null;
    data.handPhoneNumber
      ? (urlParams = urlParams.append('handPhoneNumber', data.handPhoneNumber))
      : null;
    return this.http.get(url, { params: urlParams }).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((err) => {
        return this.commonService.catchError(err);
      })
    );
  }

  saveAgentSender(data: any) {
    const url = environment.saveAgentSender;
    return this.http.post(url, data).pipe(
      catchError((err) => {
        return this.commonService.catchError(err);
      }),
      map((responce: any) => {
        return responce;
      })
    );
  }

  getAgentTransactionVolumeSummary(data: any) {
    const url =
      environment.getAgentTransactionVolumeSummary +
      '/' +
      data.agentSenderDetailId;
    let urlParams = new HttpParams();
    data.sendingCurrencyCode
      ? (urlParams = urlParams.append(
          'sendingCurrencyCode',
          data.sendingCurrencyCode
        ))
      : null;
    return this.http.get(url, { params: urlParams }).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((err) => {
        return this.commonService.catchError(err);
      })
    );
  }

  getAgentSenderbyEmail(data: any) {
    const url = environment.getAgentSenderdetailsByEmail;
    let urlParams = new HttpParams();
    data.email ? (urlParams = urlParams.append('email', data.email)) : null;
    return this.http.get(url, { params: urlParams }).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((err) => {
        return this.commonService.catchError(err);
      })
    );
  }

  getAgentReceivingCountries(data: any) {
    const url =
      environment.getAgentReceivingCountriesById +
      '/' +
      data.agentTransferAapprovedSendingReceivingCurrenciesId;
    return this.http.get(url).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((err) => {
        return this.commonService.catchError(err);
      })
    );
  }

  getreference(data: any) {
    const url = environment.getReference + '/' + data.countryCode;
    return this.http.get(url).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((err) => {
        return this.commonService.catchError(err);
      })
    );
  }

  getBankDetails(data: any) {
    const url =
      environment.getBankDetailsByExposableId +
      '/' +
      data.exposableId +
      '/' +
      data.countryId;
    return this.http.get(url).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((err) => {
        return this.commonService.catchError(err);
      })
    );
  }

  getAllCountryCode() {
    const url = environment.getAllCountryCode;
    return this.http.get(url).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((err) => {
        return this.commonService.catchError(err);
      })
    );
  }

  saveAgentBeneficiaryDetails(data: any) {
    const url = environment.saveAgentBeneficiaryDetails;
    return this.http.post(url, data).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((err) => {
        return this.commonService.catchError(err);
      })
    );
  }

  addAgentBanks(data: any, body: any) {
    const url =
      environment.saveAgentBeneficiaryDetails +
      '/' +
      data.agentExposableId +
      '/' +
      data.countryId;
    return this.http.post(url, body).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((err) => {
        return this.commonService.catchError(err);
      })
    );
  }

  getProvider(data: any) {
    const url = environment.getProvider + '/' + data.countryId;
    return this.http.get(url).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((err) => {
        return this.commonService.catchError(err);
      })
    );
  }

  getAgentBeneficiaryDetails(data: any) {
    const url =
      environment.getAgentDetailsExposableId +
      '/' +
      data.exposableId +
      '/' +
      data.agentSenderDetailId;
    return this.http.get(url).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((err) => {
        return this.commonService.catchError(err);
      })
    );
  }

  getAgentBeneficiaryBankAccounts(data: any) {
    const url =
      environment.getAgentBeneficiaryBankAccounts +
      '/' +
      data.agentBeneficiaryDetailsId;
    let urlParams = new HttpParams();

    urlParams = urlParams.append('countryId', data.countryId);
    data.agentTransferApprovedSendingReceivingCurrenciesId;
    urlParams = urlParams.append(
      'agentTransferApprovedSendingReceivingCurrenciesId',
      data.agentTransferApprovedSendingReceivingCurrenciesId
    );
    return this.http.get(url, { params: urlParams }).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((err) => {
        return this.commonService.catchError(err);
      })
    );
  }

  saveAgentBanks(data: any, body: any) {
    const url =
      environment.saveAgentBanks +
      '/' +
      data.agentExposableId +
      '/' +
      data.countryId +
      '/1';
    return this.http.post(url, body).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((err) => {
        return this.commonService.catchError(err);
      })
    );
  }

  checkIsBeneficiaryEditable(data: any) {
    const url =
      environment.checkBeneficiaryEditable + '/' + data.beneficiaryDetailsId;
    return this.http.get(url).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((err) => {
        return this.commonService.catchError(err);
      })
    );
  }
  addAgentTransaction(body: any) {
    const url = environment.saveAgentTransaction;
    return this.http.post(url, body).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((err) => {
        return this.commonService.catchError(err);
      })
    );
  }

  getAgentTransactionMode(data: any) {
    const url =
      environment.getAgentTransactionMode +
      '/' +
      data.exposableId +
      '/' +
      data.agentTransferApprovedSendingReceivingCurrenciesId;
    return this.http.get(url).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((err) => {
        return this.commonService.catchError(err);
      })
    );
  }
  getAgentPaymentMode(data: any) {
    const url = environment.getAgentPaymentMode + '/' + data.exposableId;
    return this.http.get(url).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((err) => {
        return this.commonService.catchError(err);
      })
    );
  }

  getTransferFee(data: any) {
    const url =
      environment.getTransferFee +
      '/' +
      data.agentTransferApprovedSendingCurrenciesId +
      '/' +
      data.agentCurrencyTransactionModeId +
      '/FIXED/' +
      data.agentPaymentModeId;
    let urlParams = new HttpParams();
    urlParams = urlParams.append('amount', data.amount);
    return this.http.get(url, { params: urlParams }).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((err) => {
        return this.commonService.catchError(err);
      })
    );
  }

  getAgentSender(data: any) {
    const url =
      environment.getAgentSender + '/' + data.email + '/' + data.agentDetailId;
    let urlParams = new HttpParams();
    urlParams = urlParams.append('name', data.name);
    return this.http.get(url, { params: urlParams }).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((err) => {
        return this.commonService.catchError(err);
      })
    );
  }
  getAgentSenderbyId(data: any) {
    const url = environment.agentSender2 + data.agentSenderDetailsId;

    return this.http.get(url).pipe(
      catchError((err) => {
        return this.commonService.catchError(err);
      }),
      map((responce: any) => {
        return responce;
      })
    );
  }

  getBeneficiary(data: any) {
    const url =
      environment.getBeneficiaryDetails + data.agentBeneficiaryDetailsId;
    return this.http.get(url).pipe(
      catchError((err) => {
        return this.commonService.catchError(err);
      }),
      map((responce: any) => {
        return responce;
      })
    );
  }
  getBeneficiaryByFIlter(data: any) {
    const url = environment.getBeneficiaryByFilter + data.email;
    let urlParams = new HttpParams();
    data.name ? (urlParams = urlParams.append('name', data.name)) : null;
    data.isCustomer
      ? (urlParams = urlParams.append('isCustomer', data.isCustomer))
      : null;
    data.contactNumber
      ? (urlParams = urlParams.append('contactNumber', data.contactNumber))
      : null;
    data.pageNumber
      ? (urlParams = urlParams.append('pageNumber', data.pageNumber))
      : null;
    data.pageSize
      ? (urlParams = urlParams.append('pageSize', data.pageSize))
      : null;
    data.address
      ? (urlParams = urlParams.append('address', data.address))
      : null;
    data.countryId
      ? (urlParams = urlParams.append('countryId', data.countryId))
      : null;
    return this.http.get(url, { params: urlParams }).pipe(
      catchError((err) => {
        return this.commonService.catchError(err);
      }),
      map((response: any) => {
        // this.responseHandler();
        return response;
      })
    );
  }

  getBeneficiaryDetailsById(data: any) {
    const url = environment.getBeneficiaryById + data.agentBeneficiaryDetailsId;
    return this.http.get(url).pipe(
      catchError((err) => {
        return this.commonService.catchError(err);
      }),
      map((response: any) => {
        return response;
      })
    );
  }

  getBankAccountDetailsById(data: any) {
    const url =
      environment.getAgentBankAccountBiId +
      '/' +
      data.agentBeneficiaryBankAccountDetailsId;
    return this.http.get(url).pipe(
      catchError((err) => {
        return this.commonService.catchError(err);
      }),
      map((response: any) => {
        return response;
      })
    );
  }

  getCurrency() {
    const url = environment.getClientCurrency;
    return this.http.get(url).pipe(
      catchError((err) => {
        return this.commonService.catchError(err);
      }),
      map((response: any) => {
        return response;
      })
    );
  }

  getAgentReceivingCurrency(data: any) {
    const url = environment.getAgentRecevingCurrency + data.exposableId;
    return this.http.get(url).pipe(
      catchError((err) => {
        return this.commonService.catchError(err);
      }),
      map((response: any) => {
        return response;
      })
    );
  }

  submitTransfer(body: any) {
    const url = environment.submitTransfer;
    return this.http.post(url, body).pipe(
      catchError((err) => {
        return this.commonService.catchError(err);
      }),
      map((response: any) => {
        return response;
      })
    );
  }
  getBankCodes(data: any) {
    const url = environment.getBankCodes + data.clientcurrencyid;
    return this.http.get(url).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((err) => {
        return this.commonService.catchError(err);
      })
    );
  }
  saveFirstStep(data: any) {
    const url = environment.saveTransferFlow;
    return this.http.post(url, data).pipe(
      catchError((err) => {
        return this.commonService.catchError(err);
      }),
      map((responce: any) => {
        return responce;
      })
    );
  }
  updateFinalStep(data: any) {
    const url = environment.updateTransferFlow;
    return this.http.put(url, data).pipe(
      catchError((err) => {
        return this.commonService.catchError(err);
      }),
      map((responce: any) => {
        return responce;
      })
    );
  }

  updateSenderId(data: any) {
    const url = environment.updateSenderIdData;
    return this.http.put(url, data).pipe(
      catchError((err) => {
        return this.commonService.catchError(err);
      }),
      map((responce: any) => {
        return responce;
      })
    );
  }

  checkRatesvalidOrNot(data: any) {
    const url = environment.checkratescorrect;

    let urlParams = new HttpParams();

    urlParams = urlParams.append('receivingAmount', data.receivingAmount);
    urlParams = urlParams.append('sendingAmount', data.sendingAmount);
    urlParams = urlParams.append('totalPayable', data.totalPayable);
    urlParams = urlParams.append('fee', data.fee);
    urlParams = urlParams.append('currencyRate', data.currencyRate);
    urlParams = urlParams.append('isSendingAmount', data.isSendingAmount);

    return this.http.get(url, { params: urlParams }).pipe(
      catchError((err) => {
        return this.commonService.catchError(err);
      }),
      map((responce: any) => {
        return responce;
      })
    );
  }
}
