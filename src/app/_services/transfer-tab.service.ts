import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommonsService } from './commons.service';
import { environment } from 'src/environments/environment';
import { catchError, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TransferTabService {
  constructor(private http: HttpClient, public commons: CommonsService) {}
  checkIsBeneficiaryEditable(data: any) {
    const url =
      environment.checkBeneficiaryEditable + '/' + data.beneficiaryDetailsId;
    return this.http.get(url).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((err) => {
        return this.commons.catchError(err);
      })
    );
  }
  getCountry() {
    const url = environment.getCountries;
    return this.http.get(url).pipe(
      catchError((err) => {
        return this.commons.catchError(err);
      }),
      map((response: any) => {
        return response;
      })
    );
  }

  transactionGetAll(data: any) {
    const url = environment.getTransfers;
    let urlParams = new HttpParams();
    data.customerReference
      ? (urlParams = urlParams.append(
          'customerReference',
          data.customerReference
        ))
      : null;
    data.transferReference
      ? (urlParams = urlParams.append(
          'transferReference',
          data.transferReference
        ))
      : null;
    data.senderName
      ? (urlParams = urlParams.append('senderName', data.senderName))
      : null;
    data.countryName
      ? (urlParams = urlParams.append('countryName', data.countryName))
      : null;
    data.transactionFromDate
      ? (urlParams = urlParams.append(
          'transactionFromDate',
          data.transactionFromDate
        ))
      : null;
    data.transactionToDate
      ? (urlParams = urlParams.append(
          'transactionToDate',
          data.transactionToDate
        ))
      : null;
    data.agentName
      ? (urlParams = urlParams.append('agentName', data.agentName))
      : null;
    data.pageSize
      ? (urlParams = urlParams.append('pageSize', data.pageSize))
      : null;
    data.pageNumber
      ? (urlParams = urlParams.append('pageNumber', data.pageNumber))
      : null;

    return this.http.get(url, { params: urlParams }).pipe(
      catchError((err) => {
        return this.commons.catchError(err);
      }),
      map((response: any) => {
        return response;
      })
    );
  }
  gettclientname() {
    const url = environment.client_allForReport;

    return this.http.get(url).pipe(
      catchError((err) => {
        return this.commons.catchError(err);
      }),
      map((response: any) => {
        return response;
      })
    );
  }
  getcountry(data: any) {
    const url = environment.country;
    let urlParams = new HttpParams();

    urlParams = urlParams.append('clientCode', data.clientCode);
    return this.http.get(url, { params: urlParams }).pipe(
      catchError((err) => {
        return this.commons.catchError(err);
      }),
      map((response: any) => {
        return response;
      })
    );
  }
  paybillGetAll(data: any) {
    const url = environment.payBillTransaction;
    let urlParams = new HttpParams();

    data.pageSize
      ? (urlParams = urlParams.append('pageSize', data.pageSize))
      : null;
    data.pageNumber
      ? (urlParams = urlParams.append('pageNumber', data.pageNumber))
      : null;

    return this.http.get(url, { params: urlParams }).pipe(
      catchError((err) => {
        return this.commons.catchError(err);
      }),
      map((response: any) => {
        return response;
      })
    );
  }

  trnxGetPayBill(data: any) {
    const url = environment.getPayBill;
    let urlParams = new HttpParams();
    data.pageSize
      ? (urlParams = urlParams.append('pageSize', data.pageSize))
      : null;
    data.pageNumber
      ? (urlParams = urlParams.append('pageNumber', data.pageNumber))
      : null;
    return this.http.get(url, { params: urlParams }).pipe(
      catchError((err) => {
        return this.commons.catchError(err);
      }),
      map((response: any) => {
        return response;
      })
    );
  }

  getAllSUbject() {
    const url = environment.getAllSubject;
    return this.http.get(url).pipe(
      catchError((err) => {
        return this.commons.catchError(err);
      }),
      map((response: any) => {
        return response;
      })
    );
  }

  getNotes(data: any) {
    const url = environment.getTransferNotes + '/' + data.transcationID;
    let urlParams = new HttpParams();
    data.pageSize
      ? (urlParams = urlParams.append('pageSize', data.pageSize))
      : null;
    data.pageNumber
      ? (urlParams = urlParams.append('pageNumber', data.pageNumber))
      : null;
    return this.http.get(url, { params: urlParams }).pipe(
      catchError((err) => {
        return this.commons.catchError(err);
      }),
      map((response: any) => {
        return response;
      })
    );
  }
  getdetailsoftransfer(data: any) {
    const url =
      environment.agentTransactiondetails + data.agentTransactionDetailId;

    return this.http.get(url).pipe(
      catchError((err) => {
        return this.commons.catchError(err);
      }),
      map((response: any) => {
        return response;
      })
    );
  }
  addNotes(body: any) {
    const url = environment.saveTrfNotes;
    return this.http.post(url, body).pipe(
      catchError((err) => {
        return this.commons.catchError(err);
      }),
      map((response: any) => {
        return response;
      })
    );
  }
  agentTrnxDetails(data: any) {
    const url =
      environment.getAgentTrnxDetails + '/' + data.agentTransactionDetailId;
    return this.http.get(url).pipe(
      catchError((err) => {
        return this.commons.catchError(err);
      }),
      map((response: any) => {
        return response;
      })
    );
  }
  agentTrnxVolSummary(data: any) {
    const url =
      environment.agentTransaction_volumeSummary + data.agentSenderDetailId;
    let urlParams = new HttpParams();
    data.sendingCurrencyCode
      ? (urlParams = urlParams.append(
          'sendingCurrencyCode',
          data.sendingCurrencyCode
        ))
      : null;
    return this.http.get(url, { params: urlParams }).pipe(
      catchError((err) => {
        return this.commons.catchError(err);
      }),
      map((response: any) => {
        return response;
      })
    );
  }
  checkBeneficiary(data: any) {
    const url = environment.checkBenEditable + '/' + data.beneficiaryID;
    return this.http.get(url).pipe(
      catchError((err) => {
        return this.commons.catchError(err);
      }),
      map((response: any) => {
        return response;
      })
    );
  }
  getsummary(data: any) {
    const url =
      environment.agentTransaction_volumeSummary + data.senderDetailsId;
    let urlParams = new HttpParams();
    urlParams = urlParams.append(
      'sendingCurrencyCode',
      data.sendingCurrencyCode
    );

    return this.http.get(url, { params: urlParams }).pipe(
      catchError((err) => {
        return this.commons.catchError(err);
      }),
      map((response: any) => {
        return response;
      })
    );
  }
  // chcekBankEditable(data: any) {
  //   const url = environment.checkBenEditable + '/' + data.beneficiaryID;
  //   let urlParams = new HttpParams();
  //   data.agentBeneficiaryBankAccountDetailsId
  //     ? (urlParams = urlParams.append(
  //         'agentBeneficiaryBankAccountDetailsId',
  //         data.agentBeneficiaryBankAccountDetailsId
  //       ))
  //     : null;
  //   return this.http.get(url).pipe(
  //     catchError((err) => {
  //       return this.commons.catchError(err);
  //     }),
  //     map((response: any) => {
  //       return response;
  //     })
  //   );
  // }
  chcekBankEditable(data: any) {
    const url =
      environment.agentBeneficiaryBankAccounts_checkBeneficiaryBankIsEditable +
      data.beneficiaryDetailsId;
    let urlParams = new HttpParams();
    urlParams = urlParams.append(
      'agentBeneficiaryBankAccountDetailsId',
      data.agentBeneficiaryBankAccountDetailsId
    );
    return this.http.get(url, { params: urlParams }).pipe(
      catchError((err) => {
        return this.commons.catchError(err);
      }),
      map((response: any) => {
        return response;
      })
    );
  }
  updateBeneficiary(body: any) {
    const url = environment.updateBeneficiary;
    return this.http.put(url, body).pipe(
      catchError((err) => {
        return this.commons.catchError(err);
      }),
      map((response: any) => {
        return response;
      })
    );
  }

  updatebank(data: any, body: any) {
    const url =
      environment.updateBank +
      '/' +
      data.exposableId +
      '/' +
      data.agentTranscationDetailsID;
    return this.http.put(url, body).pipe(
      catchError((err) => {
        return this.commons.catchError(err);
      }),
      map((response: any) => {
        return response;
      })
    );
  }
  updateBankAccountDetails(data: any, formData: any) {
    const url =
      environment.agentBanks_update +
      data.exposableId +
      '/' +
      data.countryId +
      '/' +
      data.agentTransactionDetailId;

    return this.http.put(url, formData).pipe(
      catchError((err) => {
        return this.commons.catchError(err);
      }),
      map((response: any) => {
        return response;
      })
    );
  }
  ammendSendAmount(data: any) {
    const url = environment.trnxPaymentAmountAmmend;
    let urlParams = new HttpParams();
    data.newSendingAmount
      ? (urlParams = urlParams.append(
          'newSendingAmount',
          data.newSendingAmount
        ))
      : null;
    data.transactionMasterId
      ? (urlParams = urlParams.append(
          'transactionMasterId',
          data.transactionMasterId
        ))
      : null;
    data.transactionDetailId
      ? (urlParams = urlParams.append(
          'transactionDetailId',
          data.transactionDetailId
        ))
      : null;
    return this.http.put(url, null, { params: urlParams }).pipe(
      catchError((err) => {
        return this.commons.catchError(err);
      }),
      map((response: any) => {
        return response;
      })
    );
  }
  ammendReceivedAmount(data: any) {
    const url = environment.trnxReceivedAmountAmmend;
    let urlParams = new HttpParams();
    data.newReceivingAmount
      ? (urlParams = urlParams.append(
          'newReceivingAmount',
          data.newReceivingAmount
        ))
      : null;
    data.transactionMasterId
      ? (urlParams = urlParams.append(
          'transactionMasterId',
          data.transactionMasterId
        ))
      : null;
    data.transactionDetailId
      ? (urlParams = urlParams.append(
          'transactionDetailId',
          data.transactionDetailId
        ))
      : null;
    return this.http.put(url, null, { params: urlParams }).pipe(
      catchError((err) => {
        return this.commons.catchError(err);
      }),
      map((response: any) => {
        return response;
      })
    );
  }

  markPaymentReceived(data: any) {
    const url =
      environment.markPaymentReceived +
      '/' +
      data.transactionMasterId +
      '/' +
      data.transactionDetailId +
      '/' +
      data.isPaymentReceived;
    return this.http.put(url, null).pipe(
      catchError((err) => {
        return this.commons.catchError(err);
      }),
      map((response: any) => {
        return response;
      })
    );
  }

  checkIdIssueDate(data: any) {
    const url = environment.checkIdIssueDate + '/' + data.transactionDetailId;
    return this.http.get(url).pipe(
      catchError((err) => {
        return this.commons.catchError(err);
      }),
      map((response: any) => {
        return response;
      })
    );
  }

  executionTypeCargills(data: any) {
    const url = environment.cargills;
    let urlParams = new HttpParams();
    urlParams = urlParams.append(
      'transactionMasterId',
      data.transactionMasterId
    );
    urlParams = urlParams.append(
      'transactionDetailId',
      data.transactionDetailId
    );
    urlParams = urlParams.append('isManual', data.isManual);
    return this.http.post(url, null, { params: urlParams }).pipe(
      catchError((err) => {
        return this.commons.catchError(err);
      }),
      map((response: any) => {
        return response;
      })
    );
  }
  executionTypeTerrapay(data: any) {
    const url = environment.terraPay;
    let urlParams = new HttpParams();
    urlParams = urlParams.append(
      'transactionMasterId',
      data.transactionMasterId
    );
    urlParams = urlParams.append(
      'transactionDetailId',
      data.transactionDetailId
    );
    urlParams = urlParams.append('isManual', data.isManual);
    return this.http.post(url, null, { params: urlParams }).pipe(
      catchError((err) => {
        return this.commons.catchError(err);
      }),
      map((response: any) => {
        return response;
      })
    );
  }
  executionTypemanual(data: any) {
    const url = environment.manual;
    let urlParams = new HttpParams();
    urlParams = urlParams.append(
      'transactionMasterId',
      data.transactionMasterId
    );
    urlParams = urlParams.append(
      'transactionDetailId',
      data.transactionDetailId
    );
    urlParams = urlParams.append('isManual', data.isManual);
    return this.http.post(url, null, { params: urlParams }).pipe(
      catchError((err) => {
        return this.commons.catchError(err);
      }),
      map((response: any) => {
        return response;
      })
    );
  }

  getAgentSender(data: any) {
    const url = environment.getAgentSenderById;
    let urlParams = new HttpParams();
    urlParams = urlParams.append(
      'agentSenderDetailsId',
      data.agentSenderDetailsId
    );
    return this.http.get(url).pipe(
      catchError((err) => {
        return this.commons.catchError(err);
      }),
      map((response: any) => {
        return response;
      })
    );
  }
  executeQuote(data: any) {
    const url = environment.executeTrnx;
    let urlParams = new HttpParams();
    urlParams = urlParams.append(
      'transactionMasterId',
      data.transactionMasterId
    );
    urlParams = urlParams.append(
      'transactionDetailId',
      data.transactionDetailId
    );
    urlParams = urlParams.append('transactionType', data.transactionType);
    return this.http.post(url, null, { params: urlParams }).pipe(
      catchError((err) => {
        return this.commons.catchError(err);
      }),
      map((response: any) => {
        return response;
      })
    );
  }

  changeTrnx(data: any) {
    const url = environment.changeTrnxStatus;
    let urlParams = new HttpParams();
    urlParams = urlParams.append(
      'transactionDetailId',
      data.transactionDetailId
    );
    urlParams = urlParams.append('transactionStatus', data.transactionStatus);
    return this.http.put(url, null, { params: urlParams }).pipe(
      catchError((err) => {
        return this.commons.catchError(err);
      }),
      map((response: any) => {
        return response;
      })
    );
  }
  createQuote(data: any) {
    const url = environment.getAgentTrnxDetails;
    let urlParams = new HttpParams();
    urlParams = urlParams.append(
      'transactionMasterId',
      data.transactionMasterId
    );
    urlParams = urlParams.append(
      'transactionDetailId',
      data.transactionDetailId
    );
    urlParams = urlParams.append('isManual', data.isManual);
    return this.http.post(url, null, { params: urlParams }).pipe(
      catchError((err) => {
        return this.commons.catchError(err);
      }),
      map((response: any) => {
        return response;
      })
    );
  }
  getEmailSubjects() {
    const url = environment.emailSubjectDetails_getAll;

    return this.http.get(url).pipe(
      catchError((err) => {
        return this.commons.catchError(err);
      }),
      map((response: any) => {
        return response;
      })
    );
  }
  sendEmail(data: any) {
    const url = environment.subAgentSendEmail;

    return this.http.post(url, data).pipe(
      catchError((err) => {
        return this.commons.catchError(err);
      }),
      map((response: any) => {
        return response;
      })
    );
  }
  // sendEmail(body: any) {
  //   const url = environment.sendTrfMail;
  //   return this.http.put(url, body).pipe(
  //     catchError((err) => {
  //       return this.commons.catchError(err);
  //     }),
  //     map((response: any) => {
  //       return response;
  //     })
  //   );
  // }
  // getBenificieryCountries(data:any){

  //   const url = environment.benificiaryCountries + data.countryId

  //   return this.http.get(url).pipe(
  //     catchError((err) => {
  //       return this.commons.catchError(err);
  //     }),
  //     map((response: any) => {
  //       return response;
  //     })
  //   );

  // }
  getCountryCode() {
    const url = environment.CountryCode;
    return this.http.get(url).pipe(
      catchError((err) => {
        return this.commons.catchError(err);
      }),
      map((response: any) => {
        return response;
      })
    );
  }
  getcountryname(data: any) {
    const url = environment.country_byExposableId + data.exposeId;

    return this.http.get(url).pipe(
      catchError((err) => {
        return this.commons.catchError(err);
      }),
      map((response: any) => {
        return response;
      })
    );
  }
  getNationality() {
    const url = environment.nationality;
    return this.http.get(url).pipe(
      catchError((err) => {
        return this.commons.catchError(err);
      }),
      map((response: any) => {
        return response;
      })
    );
  }
  getBneificieryCurrency(data: any) {
    const url = environment.currencyForBenificiery + data.refCode;

    return this.http.get(url).pipe(
      catchError((err) => {
        return this.commons.catchError(err);
      }),
      map((response: any) => {
        return response;
      })
    );
  }
  getAgentReceivingCountries(data: any) {
    const url =
      environment.agentReceivingCountrie + '/' + data.clientcurrencyid;

    return this.http.get(url).pipe(
      catchError((err) => {
        return this.commons.catchError(err);
      }),
      map((response: any) => {
        return response;
      })
    );
  }

  checkTransferLimitation(data: any) {
    const url =
      environment.checkTransferLimitation + '/' + data.agentTransactionMasterId;
    return this.http.get(url).pipe(
      catchError((err) => {
        return this.commons.catchError(err);
      }),
      map((response: any) => {
        return response;
      })
    );
  }
}
