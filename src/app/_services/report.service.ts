import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, map } from 'rxjs';
import { CommonsService } from './commons.service';
import { environment } from 'src/environments/environment';
import { format } from 'date-fns';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  constructor(
    private http: HttpClient,
    private commonService: CommonsService
  ) {}
  getreportdetails(data: any) {
    const url = environment.reports_summaryReportWithAgent;
    let urlParams = new HttpParams();

    urlParams = urlParams.append('pageNumber', data.pageNumber);

    urlParams = urlParams.append('pageSize', data.pageSize);
    data.clientName
      ? (urlParams = urlParams.append('clientName', data.clientName))
      : null;
    data.fromDate
      ? (urlParams = urlParams.append('fromDate', data.fromDate))
      : null;
    data.startAmount
      ? (urlParams = urlParams.append('startAmount', data.startAmount))
      : null;
    data.endAmount
      ? (urlParams = urlParams.append('endAmount', data.endAmount))
      : null;
    data.userType
      ? (urlParams = urlParams.append('userType', data.userType))
      : null;
    data.transferStatus
      ? (urlParams = urlParams.append('transferStatus', data.transferStatus))
      : null;
    data.transferAs
      ? (urlParams = urlParams.append('transferAs', data.transferAs))
      : null;
    data.transactionRef
      ? (urlParams = urlParams.append('transactionRef', data.transactionRef))
      : null;
    data.customerRef
      ? (urlParams = urlParams.append('customerRef', data.customerRef))
      : null;
    data.currency
      ? (urlParams = urlParams.append('currency', data.currency))
      : null;
    data.country
      ? (urlParams = urlParams.append('country', data.country))
      : null;
    data.agentName
      ? (urlParams = urlParams.append('agentName', data.agentName))
      : null;
    data.toDate ? (urlParams = urlParams.append('toDate', data.toDate)) : null;

    return this.http.get(url, { params: urlParams }).pipe(
      catchError((err) => {
        return this.commonService.catchError(err);
      }),
      map((response: any) => {
        return response;
      })
    );
  }
  getcarddetails(data: any) {
    const url = environment.reports_summaryReportWithAgent_cardetails;
    let urlParams = new HttpParams();

    urlParams = urlParams.append('pageNumber', data.pageNumber);

    urlParams = urlParams.append('pageSize', data.pageSize);

    data.transferAmount
      ? (urlParams = urlParams.append('transferAmount', data.transferAmount))
      : null;

    data.agentName
      ? (urlParams = urlParams.append('agentName', data.agentName))
      : null;

    return this.http.get(url, { params: urlParams }).pipe(
      catchError((err) => {
        return this.commonService.catchError(err);
      }),
      map((response: any) => {
        return response;
      })
    );
  }
  getcashcollection(data: any) {
    const url = environment.report_cashCollectorCollectedCashDetailsReportView;
    let urlParams = new HttpParams();

    urlParams = urlParams.append('pageNumber', data.pageNumber);

    urlParams = urlParams.append('pageSize', data.pageSize);

    data.agentName
      ? (urlParams = urlParams.append('agentName', data.agentName))
      : '';
    data.startAmount
      ? (urlParams = urlParams.append('startAmount', data.startAmount))
      : '';
    data.endAmount
      ? (urlParams = urlParams.append('endAmount', data.endAmount))
      : '';
    data.toDate ? (urlParams = urlParams.append('toDate', data.toDate)) : '';
    data.fromDate
      ? (urlParams = urlParams.append('fromDate', data.fromDate))
      : '';
    return this.http.get(url, { params: urlParams }).pipe(
      catchError((err) => {
        return this.commonService.catchError(err);
      }),
      map((response: any) => {
        return response;
      })
    );
  }
  getcurrencies() {
    const url = environment.currency;

    return this.http.get(url).pipe(
      catchError((err) => {
        return this.commonService.catchError(err);
      }),
      map((response: any) => {
        return response;
      })
    );
  }
  getdetailsofreport(data: any) {
    const url =
      environment.agentTransactionDetails_getUpdatedAgentTransaction_Details +
      data.agentTransactionDetailsId;

    return this.http.get(url).pipe(
      catchError((err) => {
        return this.commonService.catchError(err);
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
        return this.commonService.catchError(err);
      }),
      map((response: any) => {
        return response;
      })
    );
  }

  getusertype() {
    const url = environment.userType;

    return this.http.get(url).pipe(
      catchError((err) => {
        return this.commonService.catchError(err);
      }),
      map((response: any) => {
        return response;
      })
    );
  }
  gettransactionmode() {
    const url = environment.transactionMode;

    return this.http.get(url).pipe(
      catchError((err) => {
        return this.commonService.catchError(err);
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
        return this.commonService.catchError(err);
      }),
      map((response: any) => {
        return response;
      })
    );
  }
  getcountrycode() {
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
  getnationality() {
    const url = environment.nationality;

    return this.http.get(url).pipe(
      catchError((err) => {
        return this.commonService.catchError(err);
      }),
      map((response: any) => {
        return response;
      })
    );
  }
  getclientcurrentcy(data: any) {
    const url = environment.clientCurrency_MN + data.clientCode;
    let urlParams = new HttpParams();

    return this.http.get(url).pipe(
      catchError((err) => {
        return this.commonService.catchError(err);
      }),
      map((response: any) => {
        return response;
      })
    );
  }
  getbankdetails(data: any) {
    const url =
      environment.bankDetails_byExposableIdAndCountryId +
      data.username +
      '/' +
      data.countryId;
    let urlParams = new HttpParams();

    return this.http.get(url).pipe(
      catchError((err) => {
        return this.commonService.catchError(err);
      }),
      map((response: any) => {
        return response;
      })
    );
  }
  getAgentDetailsGetExposableId(data: any) {
    const url = environment.getExposableId;

    let urlParams = new HttpParams();
    urlParams = urlParams.append('username', data.username);

    return this.http.get(url, { params: urlParams }).pipe(
      catchError((err) => {
        return this.commonService.catchError(err);
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
        return this.commonService.catchError(err);
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
        return this.commonService.catchError(err);
      }),
      map((response: any) => {
        return response;
      })
    );
  }
  // getbankdet(data: any) {
  //   const url =
  //     environment.agentBanks_getAgentBankDetails +
  //     data.agentTransactionDetailId;
  //   let urlParams = new HttpParams();

  //   return this.http.get(url).pipe(
  //     catchError((err) => {
  //       return this.commonService.catchError(err);
  //     }),
  //     map((response: any) => {
  //       return response;
  //     })
  //   );
  // }
  // updatebeneficiaries(data: any) {
  //   const url = environment.agentBeneficiaryDetails_update;

  //   return this.http.put(url, data).pipe(
  //     catchError((err) => {
  //       return this.commonService.catchError(err);
  //     }),
  //     map((response: any) => {
  //       return response;
  //     })
  //   );
  // }
  // updatebank(data: any,formdata:any) {
  //   const url =
  //     environment.agentBanks_update +
  //     data.exposeId +
  //     data.agentTransactionDetailId +
  //     data.beneficiaryDetailsId;

  //   return this.http.put(url, data).pipe(
  //     catchError((err) => {
  //       return this.commonService.catchError(err);
  //     }),
  //     map((response: any) => {
  //       return response;
  //     })
  //   );
  // }
  getbankDetails(data: any) {
    const url =
      environment.agentBanks_getAgentBankDetails +
      '/' +
      data.agentTransactionDetailId;
    return this.http.get(url).pipe(
      catchError((err) => {
        return this.commonService.catchError(err);
      }),
      map((response: any) => {
        return response;
      })
    );
  }

  updateBeneficiary(data: any) {
    const url = environment.agentBeneficiaryDetails_update;

    return this.http.put(url, data).pipe(
      catchError((err) => {
        return this.commonService.catchError(err);
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
        return this.commonService.catchError(err);
      }),
      map((response: any) => {
        return response;
      })
    );
  }
  checkBeneficiaryEditable(data: any) {
    const url =
      environment.agentTransaction_checkIs + '/' + data.beneficiaryDetailsId;

    return this.http.get(url).pipe(
      catchError((err) => {
        return this.commonService.catchError(err);
      }),
      map((response: any) => {
        return response;
      })
    );
  }

  checkBankdetailsEditable(data: any) {
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
        return this.commonService.catchError(err);
      }),
      map((response: any) => {
        return response;
      })
    );
  }
  today: any = Date.now();
  downLoadFileReports(data: any, type: string, headers: any) {
    const blob = new Blob([data], { type: type });
    const anchor = document.createElement('a');
    anchor.href = window.URL.createObjectURL(blob);
    anchor.download = this.getFileNameFromHeaders(headers);
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  }

  private getFileNameFromHeaders(headers: any): string {
    const contentDisposition = headers.get('content-disposition');
    const matches = /filename=([^;]+)/i.exec(contentDisposition);
    if (matches && matches.length > 1) {
      return matches[1].trim();
    }
    return 'downloaded_file';
  }
  // getFileNameFromHttpResponseReport(headers: any) {
  //   // const contentDispositionHeader = headers.get('Content-Disposition');
  //   // const result = contentDispositionHeader.split(';')[1].trim().split('=')[1];
  //   const result = 'summary_report' + format(this.today, 'yyyyMMddHHmmss');
  //   return result.replace(/"/g, '');
  // }
  // downLoadFileReports(data: any, type: string, headers: any) {
  //   const blob = new Blob([data], { type: type });
  //   const url = window.URL.createObjectURL(blob);
  //   const anchor = document.createElement('a');
  //   anchor.download = this.getFileNameFromHttpResponseReport(headers);
  //   anchor.href = url;
  //   anchor.click();
  // }
  downLoadFilePDF(data: any, type: string, headers: any) {
    const blob = new Blob([data], { type: type });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.download = this.getFileNameFromHttpResponsePdf(headers);
    anchor.href = url;
    anchor.click();
  }
  getFileNameFromHttpResponsePdf(headers: any) {
    const result = 'stocks_rate_report';
    return result.replace(/"/g, '');
  }
  downloadSummaryReport(data: any) {
    // this.commons.showLoading();

    const url = environment.reports_summaryReportWithAgent_download;

    let urlParams = new HttpParams();
    if (data.clientName) {
      urlParams = urlParams.append('clientName', data.clientName);
    }
    if (data.fromDate) {
      urlParams = urlParams.append('fromDate', data.fromDate);
    }
    if (data.toDate) {
      urlParams = urlParams.append('toDate', data.toDate);
    }
    if (data.transactionToAmount) {
      urlParams = urlParams.append(
        'transactionToAmount',
        data.transactionToAmount
      );
    }
    if (data.transactionFromAmount) {
      urlParams = urlParams.append(
        'transactionFromAmount',
        data.transactionFromAmount
      );
    }
    if (data.transferAmount) {
      urlParams = urlParams.append('transferAmount', data.transferAmount);
    }
    if (data.userType) {
      urlParams = urlParams.append('userType', data.userType);
    }
    if (data.transferStatus) {
      urlParams = urlParams.append('transferStatus', data.transferStatus);
    }
    if (data.transferAs) {
      urlParams = urlParams.append('transferAs', data.transferAs);
    }
    if (data.transactionRef) {
      urlParams = urlParams.append('transactionRef', data.transactionRef);
    }
    if (data.customerRef) {
      urlParams = urlParams.append('customerRef', data.customerRef);
    }

    urlParams = urlParams.append('userName', data.userName);

    urlParams = urlParams.append('pageNumber', data.pageNumber);
    urlParams = urlParams.append('pageSize', data.pageSize);

    if (data.agentName) {
      urlParams = urlParams.append('agentName', data.agentName);
    }
    if (data.country) {
      urlParams = urlParams.append('country', data.country);
    }
    if (data.currency) {
      urlParams = urlParams.append('currency', data.currency);
    }

    // urlParams = urlParams.append('csTeam', data.csTeam);

    return this.http
      .get(url, {
        params: urlParams,
        responseType: 'arraybuffer',
        observe: 'response',
      })
      .pipe(
        catchError((err) => {
          return this.commonService.catchError(err);
        }),
        map((response: any) => {
          this.downLoadFileReports(
            response.body,
            'application/vnd.ms-excel',
            response.headers
          );
          return response;
        })
      );
  }
  downloadtransfer() {
    // this.commons.showLoading();

    const url = environment.summaryReportTransferAmenment;

    return this.http
      .get(url, {
        responseType: 'arraybuffer',
        observe: 'response',
      })
      .pipe(
        catchError((err) => {
          return this.commonService.catchError(err);
        }),
        map((response: any) => {
          this.downLoadFilePDF(
            response.body,
            'application/pdf',
            response.headers
          );
          return response;
        })
      );
  }
  downloadcommisionfee(data: any) {
    // this.commons.showLoading();

    const url = environment.reports_commisionFeeForSubAgent;

    let urlParams = new HttpParams();

    urlParams = urlParams.append('agentExposableId', data.agentExposableId);

    urlParams = urlParams.append('pageNumber', data.pageNumber);
    urlParams = urlParams.append('pageSize', data.pageSize);

    urlParams = urlParams.append('userName', data.userName);
    // urlParams = urlParams.append('csTeam', data.csTeam);

    return this.http
      .get(url, {
        params: urlParams,
        responseType: 'arraybuffer',
        observe: 'response',
      })
      .pipe(
        catchError((err) => {
          return this.commonService.catchError(err);
        }),
        map((response: any) => {
          this.downLoadFileReports(
            response.body,
            'application/vnd.ms-excel',
            response.headers
          );
          return response;
        })
      );
  }
  downloadcashcommision(data: any) {
    // this.commons.showLoading();

    const url = environment.reports_cashCollectorCollectedCashDetailsReportView;

    let urlParams = new HttpParams();

    urlParams = urlParams.append('agentExposableId', data.agentExposableId);

    urlParams = urlParams.append('pageNumber', data.pageNumber);
    urlParams = urlParams.append('pageSize', data.pageSize);
    data.endAmount
      ? (urlParams = urlParams.append('endAmount', data.endAmount))
      : '';
    data.startAmount
      ? (urlParams = urlParams.append('startAmount', data.startAmount))
      : '';

    data.agentName
      ? (urlParams = urlParams.append('agentName', data.agentName))
      : '';
    data.toDate ? (urlParams = urlParams.append('toDate', data.toDate)) : '';
    data.fromDate
      ? (urlParams = urlParams.append('fromDate', data.fromDate))
      : '';
    // urlParams = urlParams.append('csTeam', data.csTeam);

    return this.http
      .get(url, {
        params: urlParams,
        responseType: 'arraybuffer',
        observe: 'response',
      })
      .pipe(
        catchError((err) => {
          return this.commonService.catchError(err);
        }),
        map((response: any) => {
          this.downLoadFilePDF(
            response.body,
            'application/pdf',
            response.headers
          );
          return response;
        })
      );
  }
}
