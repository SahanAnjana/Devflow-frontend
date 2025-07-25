import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, catchError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CommonsService } from './commons.service';

@Injectable({
  providedIn: 'root',
})
export class DownloadCustomerIdentityImagesService {
  constructor(
    private commonService: CommonsService,
    private http: HttpClient
  ) {}

  downloadCustomerIdentityImages(data: any) {
    const url = environment.downloadImage;
    let urlParams = new HttpParams();
    data.email ? (urlParams = urlParams.append('email', data.email)) : null;
    data.dateOfBirth
      ? (urlParams = urlParams.append('dateOfBirth', data.dateOfBirth))
      : null;
    data.birthPlace
      ? (urlParams = urlParams.append('birthPlace', data.birthPlace))
      : null;
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
  downloadAMLReport(data: any) {
    const url = environment.downloadAmlReport + data;

    return this.http
      .get(url, { responseType: 'arraybuffer', observe: 'response' })
      .pipe(
        map((response: any) => {
          response &&
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
  downloadAMLCreditSafeReport(data: any) {
    const url = environment.creditsafeAMLService + data;

    return this.http
      .get(url, { responseType: 'arraybuffer', observe: 'response' })
      .pipe(
        map((response: any) => {
          response &&
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

  downLoadFilePDF(data: any, type: string, headers: any) {
    const blob = new Blob([data], { type: type });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.download = this.getFileNameFromHttpResponsePdf(headers);
    anchor.href = url;
    anchor.click();
  }
  getFileNameFromHttpResponsePdf(headers: any) {
    const result = 'AML_Report';
    return result.replace(/"/g, '');
  }

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
