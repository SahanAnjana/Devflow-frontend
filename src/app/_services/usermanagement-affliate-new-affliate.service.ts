import { Injectable } from '@angular/core';
import { CommonsService } from './commons.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { catchError, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsermanagementAffliateNewAffliateService {
  constructor(
    private commonService: CommonsService,
    private http: HttpClient
  ) {}

  getApprovePendingAllData(data: any) {
    const url = environment.getApprovePendingTableData;

    let urlParams = new HttpParams();

    urlParams = urlParams.append('pageNumber', data.pageNumber);

    // urlParams = urlParams.append('isApproved', data.isApproved);

    urlParams = urlParams.append('pageSize', data.pageSize);

    urlParams = urlParams.append('searchType', data.searchType);

    return this.http.get(url, { params: urlParams }).pipe(
      catchError((error) => {
        return this.commonService.catchError(error);
      }),
      map((response: any) => {
        return response;
      })
    );
  }

  sendEmailForAffliate(formdata: any) {
    const url = environment.sendEmailAppliate;

    return this.http.post(url, formdata).pipe(
      catchError((error) => {
        return this.commonService.catchError(error);
      }),
      map((response: any) => {
        return response;
      })
    );
  }

  getAllSubjects() {
    const url = environment.getAllSubjects;

    return this.http.get(url).pipe(
      catchError((error) => {
        return this.commonService.catchError(error);
      }),
      map((response: any) => {
        return response;
      })
    );
  }

  getAlDetails(data: any) {
    const url =
      environment.getAllAgentDetailsApprovPending + data.subAgentDetailsId;
    let urlParams = new HttpParams();
    urlParams = urlParams.append('isAffiliate', data.isAffiliate);
    return this.http.get(url, { params: urlParams }).pipe(
      catchError((error) => {
        return this.commonService.catchError(error);
      }),
      map((response: any) => {
        return response;
      })
    );
  }

  approveStatusUpdate(data: any) {
    const url = environment.approveStatus;

    let urlParams = new HttpParams();
    urlParams = urlParams.append('agentDetailsId', data.agentDetailsId);
    urlParams = urlParams.append('approveStatus', data.approveStatus);

    return this.http.put(url, data, { params: urlParams }).pipe(
      catchError((error) => {
        return this.commonService.catchError(error);
      }),
      map((response: any) => {
        return response;
      })
    );
  }

  declineStatusUpdate(data: any) {
    const url = environment.declineStatus;

    let urlParams = new HttpParams();
    urlParams = urlParams.append('agentDetailsId', data.agentDetailsId);
    urlParams = urlParams.append('approveStatus', data.approveStatus);

    return this.http.put(url, data, { params: urlParams }).pipe(
      catchError((error) => {
        return this.commonService.catchError(error);
      }),
      map((response: any) => {
        return response;
      })
    );
  }

  declinePndingAllData(data: any) {
    const url = environment.getAllDetailsDeclinepending;

    let urlParams = new HttpParams();
    urlParams = urlParams.append('pageNumber', data.pageNumber);
    urlParams = urlParams.append('pageSize', data.pageSize);
    urlParams = urlParams.append('searchType', data.searchType);
    // urlParams = urlParams.append('isApproved', data.isApproved);

    return this.http.get(url, { params: urlParams }).pipe(
      catchError((error) => {
        return this.commonService.catchError(error);
      }),
      map((response: any) => {
        return response;
      })
    );
  }
  verifyPndingAllData(data: any) {
    const url = environment.getAllVerifyPendingData;

    let urlParams = new HttpParams();
    urlParams = urlParams.append('pageNumber', data.pageNumber);
    urlParams = urlParams.append('pageSize', data.pageSize);
    urlParams = urlParams.append('searchType', data.searchType);

    return this.http.get(url, { params: urlParams }).pipe(
      catchError((error) => {
        return this.commonService.catchError(error);
      }),
      map((response: any) => {
        return response;
      })
    );
  }

  sendMailVarify(data: any) {
    const url = environment.sendMailVerify;

    let urlParams = new HttpParams();
    urlParams = urlParams.append('username', data.username);
    return this.http.get(url, { params: urlParams }).pipe(
      catchError((error) => {
        return this.commonService.catchError(error);
      }),
      map((response: any) => {
        return response;
      })
    );
  }

  getAllVerifyPendingDetailsForPatch(data: any) {
    const url =
      environment.getAllVerifyPendingDetailsforPatch + data.agentDetailsId;
    let urlParams = new HttpParams();
    urlParams = urlParams.append('isAffiliate', data.isAffiliate);
    return this.http.get(url, { params: urlParams }).pipe(
      catchError((error) => {
        return this.commonService.catchError(error);
      }),
      map((response: any) => {
        return response;
      })
    );
  }
}
