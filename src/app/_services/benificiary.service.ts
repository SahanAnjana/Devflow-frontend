import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommonsService } from './commons.service';
import { environment } from 'src/environments/environment';
import { catchError, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BenificiaryService {
  constructor(private http: HttpClient, public commons: CommonsService) {}

  getAgentDetailsGetExposableId(data: any) {
    const url = environment.getAgentDetailsExposableId;

    let urlParams = new HttpParams();
    urlParams = urlParams.append('username', data.username);

    return this.http.get(url, { params: urlParams }).pipe(
      catchError((err) => {
        return this.commons.catchError(err);
      }),
      map((response: any) => {
        return response;
      })
    );
  }

  getAllBenificiaryData(data: any) {
    const url = environment.getAllBenificiaryData;

    let urlParams = new HttpParams();

    urlParams = urlParams.append('pageNumber', data.pageNumber);
    urlParams = urlParams.append('pageSize', data.pageSize);

    if (data.name) {
      urlParams = urlParams.append('name', data.name);
    }
    if (data.contactNumber) {
      urlParams = urlParams.append('contactNumber', data.contactNumber);
    }
    if (data.address) {
      urlParams = urlParams.append('address', data.address);
    }

    return this.http.get(url, { params: urlParams }).pipe(
      catchError((err) => {
        return this.commons.catchError(err);
      }),
      map((response: any) => {
        return response;
      })
    );
  }

  updateAgentBeneficiaryStatus(data: any) {
    const url =
      environment.updateAgentBeneficiaryStatus + '/' + data.agentBeneficiaryId;
    let urlParams = new HttpParams();
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

  getBasicData(data: any) {
    const url = environment.getBenificieryBasicData + data.benificiaryid;

    return this.http.get(url).pipe(
      catchError((err) => {
        return this.commons.catchError(err);
      }),
      map((response: any) => {
        return response;
      })
    );
  }

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

  getAllBankAccountDetails(data: any) {
    const url = environment.getAllBankAccountDetails + data.benificiaryId;

    let urlParams = new HttpParams();

    urlParams = urlParams.append('pageNumber', data.pageNumber);
    urlParams = urlParams.append('pageSize', data.pageSize);

    return this.http.get(url, { params: urlParams }).pipe(
      catchError((err) => {
        return this.commons.catchError(err);
      }),
      map((response: any) => {
        return response;
      })
    );
  }

  updateBankAccountStatus(data: any) {
    const url =
      environment.updateBankAccountStatus + '/' + data.agentBeneficiaryId;
    let urlParams = new HttpParams();
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

  addNewBank(data: any, formData: any) {
    const url =
      environment.addNewBankForBenificiery +
      data.exposableId +
      '/' +
      data.currencyID +
      '/' +
      1;

    return this.http.post(url, formData).pipe(
      catchError((err) => {
        return this.commons.catchError(err);
      }),
      map((response: any) => {
        return response;
      })
    );
  }

  getBenificieryCountries(data: any) {
    const url = environment.benificiaryCountries + data.countryId;

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

  getAgentReceivingCurrency(data: any) {
    const url = environment.getAgentRecevingCurrency + data.exposableId;
    return this.http.get(url).pipe(
      catchError((err) => {
        return this.commons.catchError(err);
      }),
      map((response: any) => {
        return response;
      })
    );
  }

  updateBenificery(data: any) {
    const url = environment.benificieryUpdate;

    return this.http.put(url, data).pipe(
      catchError((err) => {
        return this.commons.catchError(err);
      }),
      map((response: any) => {
        return response;
      })
    );
  }

  getBenificieryTransactionHistory(data: any) {
    const url = environment.benificiaryTransactionHistory + data.benificiaryId;

    let urlParams = new HttpParams();

    urlParams = urlParams.append('pageNumber', data.pageNumber);
    urlParams = urlParams.append('pageSize', data.pageSize);
    urlParams = urlParams.append('beneficiaryName', data.beneficiaryName);
    urlParams = urlParams.append('filterCategory', data.filterCategory);

    return this.http.put(url, data, { params: urlParams }).pipe(
      catchError((err) => {
        return this.commons.catchError(err);
      }),
      map((response: any) => {
        return response;
      })
    );
  }

  getBenificieryVolumeSummary(data: any) {
    const url = environment.BenificieryVolumeSummary + data.benificiaryId;

    let urlParams = new HttpParams();

    urlParams = urlParams.append('pageNumber', data.pageNumber);
    urlParams = urlParams.append('pageSize', data.pageSize);
    urlParams = urlParams.append('beneficiaryName', data.beneficiaryName);
    urlParams = urlParams.append('filterCategory', data.filterCategory);

    return this.http.put(url, data, { params: urlParams }).pipe(
      catchError((err) => {
        return this.commons.catchError(err);
      }),
      map((response: any) => {
        return response;
      })
    );
  }

  dowmloadBenificieryReport(data: any) {
    let urlParams = new HttpParams();

    const url = environment.downloadBenificieryReport + data.benificieryId;

    urlParams = urlParams.append('filterCategory', data.filterCategory);
    urlParams = urlParams.append('beneficiaryName', data.beneficiaryName);

    return this.http
      .get(url, {
        params: urlParams,
        responseType: 'arraybuffer',
        observe: 'response',
      })
      .pipe(
        catchError((err) => {
          return this.commons.catchError(err);
        }),
        map((response: any) => {
          this.downLoadFile_DMD(
            response.body,
            'application/vnd.ms-excel',
            response.headers
          );
          return response;
        })
      );
  }

  downLoadFile_DMD(data: any, type: string, headers: any) {
    const blob = new Blob([data], { type: type });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.download = this.getFileNameFromHttpResponse(headers);
    anchor.href = url;
    anchor.click();
  }

  getFileNameFromHttpResponse(headers: any) {
    // const contentDispositionHeader = headers.get('Content-Disposition');
    // const result = contentDispositionHeader.split(';')[1].trim().split('=')[1];
    const result = 'Benificiery_Summary_Report' + new Date();
    return result.replace(/"/g, '');
  }

  addPersonalBenificiery(formData: any) {
    const url = environment.savePersonalBenificiery;

    return this.http.post(url, formData).pipe(
      catchError((err) => {
        return this.commons.catchError(err);
      }),
      map((response: any) => {
        return response;
      })
    );
  }

  getAgentSenderName(data: any) {
    const url =
      environment.agentSenderSearchforBeni +
      data.agentsEmail +
      '/' +
      data.agentsId;

    let urlParams = new HttpParams();

    urlParams = urlParams.append('name', data.name);

    return this.http.get(url, { params: urlParams }).pipe(
      catchError((err) => {
        return this.commons.catchError(err);
      }),
      map((reponse: any) => {
        return reponse;
      })
    );
  }

  getAgentSenderDetails(data: any) {
    const url = environment.getAgentSenderDetailss + data.agentSenderDetailsId;

    return this.http.get(url, data).pipe(
      catchError((err) => {
        return this.commons.catchError(err);
      }),
      map((response: any) => {
        return response;
      })
    );
  }

  getCountries(data: any) {
    const url = environment.getAllSignupCountries + data.exposableId;

    return this.http.get(url, data).pipe(
      catchError((err) => {
        return this.commons.catchError(err);
      }),
      map((response: any) => {
        return response;
      })
    );
  }

  getIdTypes(data: any) {
    const url = environment.getIdTypes + data.exposableId;

    return this.http.get(url).pipe(
      catchError((err) => {
        return this.commons.catchError(err);
      }),
      map((response: any) => {
        return response;
      })
    );
  }

  checkIsBeneficiaryEditable(data: any) {
    const url = environment.checkIsEditable + data.agentbeneficiaryDetailsId;

    return this.http.get(url, data).pipe(
      catchError((err) => {
        return this.commons.catchError(err);
      }),
      map((response: any) => {
        return response;
      })
    );
  }

  getAgentDetails() {
    const url = environment.getAgentDetailss;

    return this.http.get(url).pipe(
      catchError((err) => {
        return this.commons.catchError(err);
      }),
      map((response: any) => {
        return response;
      })
    );
  }

  getDynamicLabels(data: any) {
    const url = environment.dynamicLabels + data.countryID;

    return this.http.get(url).pipe(
      catchError((err) => {
        return this.commons.catchError(err);
      }),
      map((response: any) => {
        return response;
      })
    );
  }

  getSenderDetails(data: any) {
    const url = environment.senderDetails + data.exposableId;

    let urlParams = new HttpParams();
    urlParams = urlParams.append('email', data.email);

    return this.http.get(url, { params: urlParams }).pipe(
      catchError((err) => {
        return this.commons.catchError(err);
      }),
      map((response: any) => {
        return response;
      })
    );
  }
}
