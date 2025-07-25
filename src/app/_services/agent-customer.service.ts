import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CommonsService } from './commons.service';

@Injectable({
  providedIn: 'root',
})
export class AgentCustomerService {
  constructor(
    private commonService: CommonsService,
    private http: HttpClient
  ) {}

  getAllAgentCustomerData(data: any) {
    const url = environment.get_agent_customer;
    let urlParams = new HttpParams();

    data.pageNumber
      ? (urlParams = urlParams.append('pageNumber', data.pageNumber))
      : '';
    data.searchType
      ? (urlParams = urlParams.append('searchType', data.searchType))
      : '';
    data.pageSize
      ? (urlParams = urlParams.append('pageSize', data.pageSize))
      : '';
    data.name ? (urlParams = urlParams.append('name', data.name)) : '';
    data.agentName
      ? (urlParams = urlParams.append('agentName', data.agentName))
      : '';
    data.email ? (urlParams = urlParams.append('email', data.email)) : '';
    data.address ? (urlParams = urlParams.append('address', data.address)) : '';
    data.contactNumber
      ? (urlParams = urlParams.append('contactNumber', data.contactNumber))
      : '';
    data.customerReference
      ? (urlParams = urlParams.append(
          'customerReference',
          data.customerReference
        ))
      : '';

    return this.http.get(url, { params: urlParams }).pipe(
      catchError((error) => {
        return this.commonService.catchError(error);
      }),
      map((response: any) => {
        return response;
      })
    );
  }
  getTransactionSummary(data: any) {
    const url = environment.getAgentTransactionSummary;
    let urlParams = new HttpParams();

    data.pageNumber
      ? (urlParams = urlParams.append('pageNumber', data.pageNumber))
      : '';
    data.pageSize
      ? (urlParams = urlParams.append('pageSize', data.pageSize))
      : '';
    data.userName
      ? (urlParams = urlParams.append('userName', data.userName))
      : '';

    data.email ? (urlParams = urlParams.append('email', data.email)) : '';
    data.transactionSummery
      ? (urlParams = urlParams.append(
          'transactionSummery',
          data.transactionSummery
        ))
      : '';

    return this.http.get(url, { params: urlParams }).pipe(
      catchError((error) => {
        return this.commonService.catchError(error);
      }),
      map((response: any) => {
        return response;
      })
    );
  }
  enableCorporateAccount(data: any) {
    const url = environment.enableCoporateAccount + data.id;
    let urlParams = new HttpParams();

    urlParams = urlParams.append('isCoporateEnable', data.isCoporateEnable);

    return this.http.put(url, null, { params: urlParams }).pipe(
      catchError((error) => {
        return this.commonService.catchError(error);
      }),
      map((response: any) => {
        return response;
      })
    );
  }
  getVolumeSummary(data: any) {
    const url = environment.agentTransaction_volumeSummary + data.id;
    let urlParams = new HttpParams();

    data.sendingCurrencyCode
      ? (urlParams = urlParams.append(
          'sendingCurrencyCode',
          data.sendingCurrencyCode
        ))
      : '';

    return this.http.get(url, { params: urlParams }).pipe(
      catchError((error) => {
        return this.commonService.catchError(error);
      }),
      map((response: any) => {
        return response;
      })
    );
  }

  getAgentSenderDetailsByUsername(data: any) {
    const url = environment.getAgentSenderDetailsByUsername + data;

    return this.http.get(url).pipe(
      catchError((error) => {
        return this.commonService.catchError(error);
      }),
      map((response: any) => {
        return response;
      })
    );
  }
  updateAgentCustomer(data: any) {
    const url = environment.updateAgentSenderDetails;

    return this.http.put(url, data).pipe(
      catchError((error) => {
        return this.commonService.catchError(error);
      }),
      map((response: any) => {
        return response;
      })
    );
  }

  getCustomerImageDetails(data: any) {
    const url = environment.customerImageDetails;
    let urlParams = new HttpParams();

    data.customerDetailsId
      ? (urlParams = urlParams.append(
          'customerDetailsId',
          data.customerDetailsId
        ))
      : '';
    data.identityModeId
      ? (urlParams = urlParams.append('identityModeId', data.identityModeId))
      : '';
    return this.http.get(url).pipe(
      catchError((error) => {
        return this.commonService.catchError(error);
      }),
      map((response: any) => {
        return response;
      })
    );
  }
  updateAML(data: any) {
    const url = environment.updateAml;
    let urlParams = new HttpParams();

    urlParams = urlParams.append('email', data.email);
    data.amlCheckDate
      ? (urlParams = urlParams.append('amlCheckDate', data.amlCheckDate))
      : '';
    return this.http.put(url, null, { params: urlParams }).pipe(
      catchError((error) => {
        return this.commonService.catchError(error);
      }),
      map((response: any) => {
        return response;
      })
    );
  }
  updateStatus(data: any) {
    const url = environment.agentSenderUpdateStatus + data.requestType;
    let urlParams = new HttpParams();

    data.email ? (urlParams = urlParams.append('email', data.email)) : '';

    urlParams = urlParams.append('isApprove', data.isApprove);

    urlParams = urlParams.append('isActive', data.isActive);

    return this.http.put(url, null, { params: urlParams }).pipe(
      catchError((error) => {
        return this.commonService.catchError(error);
      }),
      map((response: any) => {
        return response;
      })
    );
  }
  updateStatus2(data: any) {
    const url = environment.updateStatus2 + '/' + data.id;
    let urlParams = new HttpParams();
    urlParams = urlParams.append('isActive', data.isActive);
    data.email ? (urlParams = urlParams.append('email', data.email)) : '';

    return this.http.put(url, null, { params: urlParams }).pipe(
      catchError((error) => {
        return this.commonService.catchError(error);
      }),
      map((response: any) => {
        return response;
      })
    );
  }
  getAllAgentSenderDeclineUsers(data: any) {
    const url = environment.declinedAgentCustomers;
    let urlParams = new HttpParams();

    data.pageNumber
      ? (urlParams = urlParams.append('pageNumber', data.pageNumber))
      : '';

    data.pageSize
      ? (urlParams = urlParams.append('pageSize', data.pageSize))
      : '';
    data.name ? (urlParams = urlParams.append('name', data.name)) : '';
    data.agentName
      ? (urlParams = urlParams.append('agentName', data.agentName))
      : '';
    data.email ? (urlParams = urlParams.append('email', data.email)) : '';
    data.contactNumber
      ? (urlParams = urlParams.append('contactNumber', data.contactNumber))
      : '';

    return this.http.get(url, { params: urlParams }).pipe(
      catchError((error) => {
        return this.commonService.catchError(error);
      }),
      map((response: any) => {
        return response;
      })
    );
  }
  updateIdentityDetails(data: any) {
    const url = environment.agentTransactionIdentitySave;

    return this.http.post(url, data).pipe(
      catchError((error) => {
        return this.commonService.catchError(error);
      }),
      map((response: any) => {
        return response;
      })
    );
  }
  customerImageDetailsPrimaryUpload(data: any, params: any, customerId: any) {
    const url = environment.customerImageDetailsPrimaryUpload + customerId;
    let urlParams = new HttpParams();

    params.primaryId
      ? (urlParams = urlParams.append('primaryId', params.primaryId))
      : '';

    return this.http.post(url, data, { params: urlParams }).pipe(
      catchError((error) => {
        return this.commonService.catchError(error);
      }),
      map((response: any) => {
        return response;
      })
    );
  }
  customerImageDetailsSecondaryUpload(data: any, params: any, customerId: any) {
    const url = environment.customerImageDetailsSecondaryUpload + customerId;
    let urlParams = new HttpParams();

    params.secondaryIdType
      ? (urlParams = urlParams.append(
          'secondaryIdType',
          params.secondaryIdType
        ))
      : '';

    return this.http.post(url, data, { params: urlParams }).pipe(
      catchError((error) => {
        return this.commonService.catchError(error);
      }),
      map((response: any) => {
        return response;
      })
    );
  }
  getAllretrieveAllPrimaryids(data: any) {
    const url = environment.customerImagePrimaryGetAll;
    let urlParams = new HttpParams();

    data.pageNumber
      ? (urlParams = urlParams.append('pageNumber', data.pageNumber))
      : '';

    data.pageSize
      ? (urlParams = urlParams.append('pageSize', data.pageSize))
      : '';
    data.customerDetailsId
      ? (urlParams = urlParams.append(
          'customerDetailsId',
          data.customerDetailsId
        ))
      : '';

    return this.http.get(url, { params: urlParams }).pipe(
      catchError((error) => {
        return this.commonService.catchError(error);
      }),
      map((response: any) => {
        return response;
      })
    );
  }
  getAllretrieveAllSecondaryids(data: any) {
    const url = environment.customerImageSecondaryGetAll;
    let urlParams = new HttpParams();

    data.pageNumber
      ? (urlParams = urlParams.append('pageNumber', data.pageNumber))
      : '';

    data.pageSize
      ? (urlParams = urlParams.append('pageSize', data.pageSize))
      : '';
    data.customerDetailsId
      ? (urlParams = urlParams.append(
          'customerDetailsId',
          data.customerDetailsId
        ))
      : '';

    return this.http.get(url, { params: urlParams }).pipe(
      catchError((error) => {
        return this.commonService.catchError(error);
      }),
      map((response: any) => {
        return response;
      })
    );
  }

  getAllAgentSenderPendingUsers(data: any) {
    const url = environment.getAllWithoutApproved;
    let urlParams = new HttpParams();

    data.pageNumber
      ? (urlParams = urlParams.append('pageNumber', data.pageNumber))
      : '';

    data.pageSize
      ? (urlParams = urlParams.append('pageSize', data.pageSize))
      : '';
    data.name ? (urlParams = urlParams.append('name', data.name)) : '';
    data.agentName
      ? (urlParams = urlParams.append('agentName', data.agentName))
      : '';
    data.email ? (urlParams = urlParams.append('email', data.email)) : '';
    data.contactNumber
      ? (urlParams = urlParams.append('contactNumber', data.contactNumber))
      : '';

    return this.http.get(url, { params: urlParams }).pipe(
      catchError((error) => {
        return this.commonService.catchError(error);
      }),
      map((response: any) => {
        return response;
      })
    );
  }
  sendVerifyLink(data: any) {
    const url = environment.sendVerifyLink + data;

    return this.http.get(url).pipe(
      catchError((error) => {
        return this.commonService.catchError(error);
      }),
      map((response: any) => {
        return response;
      })
    );
  }
  signUpCustomer(data: any) {
    const url = environment.customerSignUp + data.agentRefNumber;

    return this.http.post(url, data).pipe(
      catchError((error) => {
        return this.commonService.catchError(error);
      }),
      map((response: any) => {
        return response;
      })
    );
  }
}
