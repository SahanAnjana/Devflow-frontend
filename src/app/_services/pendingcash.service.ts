import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommonsService } from './commons.service';
import { environment } from 'src/environments/environment';
import { catchError, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PendingcashService {

  constructor(private http: HttpClient, public commons: CommonsService) { }


  getAllPendingCashData(data: any){

    const url = environment.getAllPendingCashDetails

    let urlParams = new HttpParams();

    urlParams = urlParams.append('pageNumber', data.pageNumber)
    urlParams = urlParams.append('pageSize', data.pageSize)

    if(data.fromDate){urlParams = urlParams.append('fromDate', data.fromDate)}
    if(data.toDate){urlParams = urlParams.append('toDate', data.toDate)}
    if(data.startAmount){urlParams = urlParams.append('startAmount', data.startAmount)}
    if(data.endAmount){urlParams = urlParams.append('endAmount', data.endAmount)}
    if(data.agentName){urlParams = urlParams.append('agentName', data.agentName)}

    return this.http.put(url,data, { params: urlParams }).pipe(
      catchError((err) => {
        return this.commons.catchError(err);
      }),
      map((response: any) => {
        return response;
      })
    );

  }










}
