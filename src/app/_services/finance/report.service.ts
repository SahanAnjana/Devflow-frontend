import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommonsService } from '../commons.service';
import { environment } from 'src/environments/environment';
import { catchError, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  constructor(
    private http: HttpClient,
    private commonService: CommonsService
  ) {}

  getFinancialSummary(data: any) {
    const url = environment.getFinancialSummary;
    let urlParams = new HttpParams();
    data.from_date
      ? (urlParams = urlParams.append('from_date', data.from_date))
      : null;
    data.to_date
      ? (urlParams = urlParams.append('to_date', data.to_date))
      : null;
    return this.http.get(url, { params: urlParams }).pipe(
      catchError((error) => {
        return this.commonService.catchError(error);
      }),
      map((response: any) => {
        return response;
      })
    );
  }

  getProfitLossReport(data: any) {
    const url = environment.getProfitLossReport;
    let urlParams = new HttpParams();
    data.from_date
      ? (urlParams = urlParams.append('from_date', data.from_date))
      : null;
    data.to_date
      ? (urlParams = urlParams.append('to_date', data.to_date))
      : null;
    return this.http.get(url, { params: urlParams }).pipe(
      catchError((error) => {
        return this.commonService.catchError(error);
      }),
      map((response: any) => {
        return response;
      })
    );
  }

  getRevenueReport(data: any) {
    const url = environment.getRevenueReport;
    let urlParams = new HttpParams();
    data.from_date
      ? (urlParams = urlParams.append('from_date', data.from_date))
      : null;
    data.to_date
      ? (urlParams = urlParams.append('to_date', data.to_date))
      : null;
    return this.http.get(url, { params: urlParams }).pipe(
      catchError((error) => {
        return this.commonService.catchError(error);
      }),
      map((response: any) => {
        return response;
      })
    );
  }

  getExpnsiveReport(data: any) {
    const url = environment.getExpensesReport;
    let urlParams = new HttpParams();
    data.from_date
      ? (urlParams = urlParams.append('from_date', data.from_date))
      : null;
    data.to_date
      ? (urlParams = urlParams.append('to_date', data.to_date))
      : null;
    return this.http.get(url, { params: urlParams }).pipe(
      catchError((error) => {
        return this.commonService.catchError(error);
      }),
      map((response: any) => {
        return response;
      })
    );
  }

  getProjectFInanceReport(data: any) {
    const url = environment.getProjectFinanceReport;
    let urlParams = new HttpParams();
    data.from_date
      ? (urlParams = urlParams.append('from_date', data.from_date))
      : null;
    data.to_date
      ? (urlParams = urlParams.append('to_date', data.to_date))
      : null;
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
