import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CommonsService } from './commons.service';
import { catchError, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DownloadReportsService {
  constructor(
    private http: HttpClient,
    private commonService: CommonsService
  ) {}

  downloadFinancialSummary(data: any) {
    const url = environment.downloadReports + data.file_path;

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
}
