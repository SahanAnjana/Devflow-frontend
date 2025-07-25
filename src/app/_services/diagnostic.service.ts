import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommonsService } from './commons.service';
import { environment } from 'src/environments/environment';
import { catchError, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DiagnosticService {
  constructor(
    private commonService: CommonsService,
    private http: HttpClient
  ) {}

  getdiagnosticLoginDetails(data: any) {
    const url = environment.loginDetails;

    let urlParams = new HttpParams();

    urlParams = urlParams.append('pageNumber', data.pageNumber);
    urlParams = urlParams.append('pageSize', data.pageSize);
    data.username
      ? (urlParams = urlParams.append('username', data.username))
      : null;

    return this.http.get(url, { params: urlParams }).pipe(
      map((user: any) => {
        return user;
      }),
      catchError((err) => {
        return this.commonService.catchError(err);
      })
    );
  }

  getdiagnosticTransferFlowDetails(data: any) {
    const url = environment.transferFlowDataAll;

    let urlParams = new HttpParams();

    urlParams = urlParams.append('pageNumber', data.pageNumber);
    urlParams = urlParams.append('pageSize', data.pageSize);
    data.agentName
      ? (urlParams = urlParams.append('agentName', data.username))
      : null;
    data.customerReference
      ? (urlParams = urlParams.append(
          'customerReference',
          data.customerReference
        ))
      : null;

    return this.http.get(url, { params: urlParams }).pipe(
      map((user: any) => {
        return user;
      }),
      catchError((err) => {
        return this.commonService.catchError(err);
      })
    );
  }

  getcuastomerTransferFlowDetails(data: any) {
    const url = environment.customerTransferFlow;

    let urlParams = new HttpParams();

    urlParams = urlParams.append('pageNumber', data.pageNumber);
    urlParams = urlParams.append('pageSize', data.pageSize);
    data.name ? (urlParams = urlParams.append('name', data.name)) : null;
    data.email ? (urlParams = urlParams.append('email', data.email)) : null;
    data.telephoneNo
      ? (urlParams = urlParams.append('telephoneNo', data.telephoneNo))
      : null;
    data.agentName
      ? (urlParams = urlParams.append('agentName', data.agentName))
      : null;
    data.address
      ? (urlParams = urlParams.append('address', data.address))
      : null;
    return this.http.get(url, { params: urlParams }).pipe(
      map((user: any) => {
        return user;
      }),
      catchError((err) => {
        return this.commonService.catchError(err);
      })
    );
  }

  getAllTransferFlowStepById(data: any) {
    const url = environment.getAllTransferFlowStepById + data.trasferFlowId;

    return this.http.get(url).pipe(
      map((user: any) => {
        return user;
      }),
      catchError((err) => {
        return this.commonService.catchError(err);
      })
    );
  }

  getdualRegistrationData(data: any) {
    const url = environment.getDualRegistration;

    let urlParams = new HttpParams();

    urlParams = urlParams.append('pageNumber', data.pageNumber);
    urlParams = urlParams.append('pageSize', data.pageSize);
    return this.http.get(url, { params: urlParams }).pipe(
      map((user: any) => {
        return user;
      }),
      catchError((err) => {
        return this.commonService.catchError(err);
      })
    );
  }

  getdualRegistrationPopData(data: any) {
    const url = environment.dualRegistrationPopupData;

    let urlParams = new HttpParams();

    urlParams = urlParams.append('dateOfBirth', data.dateOfBirth);
    urlParams = urlParams.append('placeOfBirth', data.placeOfBirth);
    urlParams = urlParams.append('telephoneNo', data.telephoneNo);
    urlParams = urlParams.append('customerName', data.customerName);
    return this.http.get(url, { params: urlParams }).pipe(
      map((user: any) => {
        return user;
      }),
      catchError((err) => {
        return this.commonService.catchError(err);
      })
    );
  }

  downloadImage(data: any) {
    const url = environment.downloadImage;

    let urlParams = new HttpParams();
    urlParams = urlParams.append('email', data.email);
    urlParams = urlParams.append('dateOfBirth', data.dateOfBirth);
    urlParams = urlParams.append('birthPlace', data.birthPlace);

    return this.http
      .get(url, {
        params: urlParams,
        responseType: 'arraybuffer',
        observe: 'response',
      })
      .pipe(
        map((response: any) => {
          this.downLoadZipFile(
            response.body,
            'application/zip',
            response.headers
          );
          return response;
        }),
        catchError((err) => {
          return this.commonService.catchError(err);
        })
      );
  }

  downloadAmlReport(data: any) {
    const url = environment.downloadAmlReport + data.journeyId;
    return this.http
      .get(url, { responseType: 'arraybuffer', observe: 'response' })
      .pipe(
        map((response: any) => {
          this.downLoadFilePDF(
            response.body,
            'application/pdf',
            response.headers
          );
          return response;
        }),
        catchError((err) => {
          return this.commonService.catchError(err);
        })
      );
  }

  deleteData(data: any) {
    const url = environment.deleteDataInTable;
    let urlParams = new HttpParams();
    urlParams = urlParams.append('dualRegistrationId', data.dualRegistrationId);
    return this.http.put(url, data, { params: urlParams }).pipe(
      map((user: any) => {
        return user;
      }),
      catchError((err) => {
        return this.commonService.catchError(err);
      })
    );
  }

  downLoadFilePDF(data: any, type: string, headers: any) {
    const blob = new Blob([data], { type: type });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.download = this.getFileNameFromHttpResponsePdf(headers);
    anchor.href = url;
    anchor.click();
  }
  getFileNameFromHttpResponsePdf(headers: any) {
    const result = 'AML_report';
    return result.replace(/"/g, '');
  }

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

  ///zip download

  downLoadZipFile(data: any, type: string, headers: any) {
    const blob = new Blob([data], { type: type });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.download = this.getFileNameFromHttpResponseZip(headers); // Adjust this function
    anchor.href = url;
    anchor.click();
  }

  getFileNameFromHttpResponseZip(headers: any) {
    const contentDisposition = headers.get('content-disposition');
    const matches = /filename=([^;]+)/i.exec(contentDisposition);
    if (matches && matches.length > 1) {
      return matches[1].trim();
    }
    return 'downloaded_file.zip'; // Default name if filename cannot be extracted
  }
}
