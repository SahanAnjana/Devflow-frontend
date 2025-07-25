import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommonsService } from './commons.service';
import { environment } from 'src/environments/environment';
import { catchError, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CoperateuserService {
  constructor(private http: HttpClient, public commons: CommonsService) {}

  getAllCorporateUser(data: any) {
    const url = environment.getAllCorporateUsers;

    let urlParams = new HttpParams();

    urlParams = urlParams.append('pageNumber', data.pageNumber);
    urlParams = urlParams.append('pageSize', data.pageSize);
    urlParams = urlParams.append('searchType', data.searchType);

    data.name ? (urlParams = urlParams.append('name', data.name)) : null;
    data.email ? (urlParams = urlParams.append('email', data.email)) : null;
    data.contactNumber
      ? (urlParams = urlParams.append('contactNumber', data.contactNumber))
      : null;
    data.agentName
      ? (urlParams = urlParams.append('agentName', data.agentName))
      : null;
    data.address
      ? (urlParams = urlParams.append('address', data.address))
      : null;
    data.customerRef
      ? (urlParams = urlParams.append('customerRef', data.customerRef))
      : null;
    data.ownerName
      ? (urlParams = urlParams.append('ownerName', data.ownerName))
      : null;

    return (
      this,
      this.http.get(url, { params: urlParams }).pipe(
        catchError((err) => {
          return this.commons.catchError(err);
        }),
        map((response: any) => {
          return response;
        })
      )
    );
  }

  updateStatus(data: any) {
    const url = environment.changeStatus;

    let urlParams = new HttpParams();

    urlParams = urlParams.append('email', data.email);
    urlParams = urlParams.append('isMail', data.isMail);
    urlParams = urlParams.append('isActive', data.isActive);

    return this.http.put(url, data, { params: urlParams }).pipe(
      catchError((err) => {
        return this.commons.catchError(err);
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
    urlParams = urlParams.append('amlCheckDate', data.amlCheckDate);

    return this.http.put(url, data, { params: urlParams }).pipe(
      catchError((err) => {
        return this.commons.catchError(err);
      }),
      map((response: any) => {
        return response;
      })
    );
  }

  sendEmail(data: any) {
    const url = environment.sendEmail;

    return this.http.post(url, data).pipe(
      catchError((err) => {
        return this.commons.catchError(err);
      }),
      map((response: any) => {
        return response;
      })
    );
  }

  getEmailSubjects() {
    const url = environment.getAllEmailSubjects;

    return this.http.get(url).pipe(
      catchError((err) => {
        return this.commons.catchError(err);
      }),
      map((response: any) => {
        return response;
      })
    );
  }

  getAllNewCorporateUser(data: any) {
    const url = environment.getAllNewCorporateUsers;

    let urlParams = new HttpParams();

    urlParams = urlParams.append('pageNumber', data.pageNumber);
    urlParams = urlParams.append('pageSize', data.pageSize);
    urlParams = urlParams.append('searchType', data.searchType);

    data.name ? (urlParams = urlParams.append('name', data.name)) : null;
    data.email ? (urlParams = urlParams.append('email', data.email)) : null;
    data.contactNumber
      ? (urlParams = urlParams.append('contactNumber', data.contactNumber))
      : null;
    data.agentName
      ? (urlParams = urlParams.append('agentName', data.agentName))
      : null;

    return (
      this,
      this.http.get(url, { params: urlParams }).pipe(
        catchError((err) => {
          return this.commons.catchError(err);
        }),
        map((response: any) => {
          return response;
        })
      )
    );
  }

  getAllNewUserViewDetails(data: any) {
    const url =
      environment.getNewCorporateViewDetails +
      data.agentUserCooperateSenderDetailsId;

    return this.http.get(url).pipe(
      catchError((err) => {
        return this.commons.catchError(err);
      }),
      map((response: any) => {
        return response;
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
    // const contentDispositionHeader = headers.get('Content-Disposition');
    // const result = contentDispositionHeader.split(';')[1].trim().split('=')[1];
    const result = 'New_Corporate_User_Report';
    return result.replace(/"/g, '');
  }

  // downLoadZipFile(data: any, type: string, headers: any) {
  //   const blob = new Blob([data], { type: type });
  //   const url = window.URL.createObjectURL(blob);
  //   const anchor = document.createElement('a');
  //   anchor.download = this.getFileNameFromHttpResponseZip(headers); // Adjust this function
  //   anchor.href = url;
  //   anchor.click();
  // }

  // getFileNameFromHttpResponseZip(headers: any) {
  //   console.log('header', headers);
  //   const contentDisposition = headers.get('content-disposition');
  //   console.log('contentDisposition', contentDisposition);
  //   const matches = /filename=([^;]+)/i.exec(contentDisposition);
  //   console.log('matches', matches);
  //   if (matches && matches.length > 1) {
  //     return matches[1].trim();
  //   }
  //   return 'documents'; // Default name if filename cannot be extracted
  // }

  getFileNameFromHttpResponseZip(headers: any) {
    console.log('header', headers);
    const contentDisposition = headers.get('content-disposition');
    console.log('contentDisposition', contentDisposition);

    // Use a regex to extract the filename from content-disposition, handling quotes
    const matches = /filename="(.+?)"/i.exec(contentDisposition);
    console.log('matches', matches);

    if (matches && matches.length > 1) {
      return matches[1].trim(); // Return the filename without quotes
    }

    return 'documents'; // Default name if filename cannot be extracted
  }

  downloadNewUserDoc(data: any) {
    const url = environment.downloadDocNewUserCo;
    let urlParams = new HttpParams();
    urlParams = urlParams.append('email', data.email);

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
          return this.commons.catchError(err);
        })
      );
  }
  downLoadReport(data: any) {
    const url = environment.downloadReport + data.agentTransactionId;
    return this.http
      .get(url, {
        responseType: 'arraybuffer',
        observe: 'response',
      })
      .pipe(
        catchError((err) => {
          return this.commons.catchError(err);
        }),
        map((response: any) => {
          this.downLoadZipFile(
            response.body,
            'application/zip',
            response.headers
          );
          return response;
        })
      );
  }

  getAllDocumentData(data: any) {
    const url = environment.getAllDocumets + data.agentUserCooperateId;

    return this.http.get(url).pipe(
      catchError((err) => {
        return this.commons.catchError(err);
      }),
      map((response: any) => {
        return response;
      })
    );
  }

  uploadocument(data: any, formdata: any) {
    const url = environment.uploadDocs + data.coorporateId;
    return this.http.post(url, formdata).pipe(
      catchError((err) => {
        return this.commons.catchError(err);
      }),
      map((response: any) => {
        return response;
      })
    );
  }

  updateCorporateStaus(data: any) {
    const url = environment.updateStatusCorporate + data.requestType;

    let urlParams = new HttpParams();
    urlParams = urlParams.append('email', data.email);
    data.isMail ? (urlParams = urlParams.append('isMail', data.isMail)) : null;
    urlParams = urlParams.append('isApprove', data.isApprove);

    return this.http.put(url, data, { params: urlParams }).pipe(
      catchError((err) => {
        return this.commons.catchError(err);
      }),
      map((response: any) => {
        return response;
      })
    );
  }
  downLoadZipFile(data: any, type: string, headers: any) {
    const blob = new Blob([data], { type: type });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.download = this.getFileNameFromHttpResponseZip(headers);
    anchor.href = url;
    anchor.click();
  }
}
