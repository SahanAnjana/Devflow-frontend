import { Injectable } from '@angular/core';
import { CommonsService } from './commons.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { catchError, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserManagementPlatformUserService {
  constructor(
    private commonService: CommonsService,
    private http: HttpClient
  ) {}

  getAllPlatformUserTableData(data: any) {
    const url = environment.getAllExitPlatformUser; //please add url

    let urlParams = new HttpParams();

    data.pageNumber
      ? (urlParams = urlParams.append('pageNumber', data.pageNumber))
      : '';
    data.pageSize
      ? (urlParams = urlParams.append('pageSize', data.pageSize))
      : '';

    data.email ? (urlParams = urlParams.append('email', data.email)) : '';
    data.username
      ? (urlParams = urlParams.append('username', data.username))
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
  getAllNewPlatformUserData(data: any) {
    const url = environment.getAllNewPlatformUser; //please add url

    let urlParams = new HttpParams();

    data.pageNumber
      ? (urlParams = urlParams.append('pageNumber', data.pageNumber))
      : '';
    data.pageSize
      ? (urlParams = urlParams.append('pageSize', data.pageSize))
      : '';

    data.email ? (urlParams = urlParams.append('email', data.email)) : '';
    data.username
      ? (urlParams = urlParams.append('username', data.username))
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
  getAllViewUserData(data: any) {
    const url = environment.getViewUserDetails + data.userDetailsId; //please add url

    return this.http.get(url).pipe(
      catchError((error) => {
        return this.commonService.catchError(error);
      }),
      map((response: any) => {
        return response;
      })
    );
  }

  updatePlatFormUser(formdata: any) {
    const url = environment.updateUser; //please add url

    return this.http.put(url, formdata).pipe(
      catchError((error) => {
        return this.commonService.catchError(error);
      }),
      map((response: any) => {
        return response;
      })
    );
  }
  addPlatFormUser(formdata: any) {
    const url = environment.addNewUser; //please add url

    return this.http.post(url, formdata).pipe(
      catchError((error) => {
        return this.commonService.catchError(error);
      }),
      map((response: any) => {
        return response;
      })
    );
  }
  getAllCountry() {
    const url = environment.getCountry;
    return this.http.get(url).pipe(
      catchError((error) => {
        return this.commonService.catchError(error);
      }),
      map((response: any) => {
        return response;
      })
    );
  }

  changeIsActiveUserA(data: any) {
    const url = environment.isActiveStatusChange + data.email; //please add url

    let urlPrams = new HttpParams();
    urlPrams = urlPrams.set('isActive', data.isActive);
    return this.http.get(url, { params: urlPrams }).pipe(
      catchError((error) => {
        return this.commonService.catchError(error);
      }),
      map((response: any) => {
        return response;
      })
    );
  }

  getAllRole() {
    const url = environment.getAllRole;
    return this.http.get(url).pipe(
      catchError((error) => {
        return this.commonService.catchError(error);
      }),
      map((response: any) => {
        return response;
      })
    );
  }

  getRoleById(data: any) {
    const url = environment.getRoleById;
    let urlParams = new HttpParams();
    urlParams = urlParams.append('id', data.id);
    return this.http.get(url, { params: urlParams }).pipe(
      catchError((error) => {
        return this.commonService.catchError(error);
      }),
      map((response: any) => {
        return response;
      })
    );
  }

  updateUserRole(data: any) {
    const url = environment.updateUserRole + '/' + data.email;
    let urlParams = new HttpParams();
    urlParams = urlParams.append('roleId', data.roleId);
    urlParams = urlParams.append('asigineeUserName', data.asigineeUserName);
    return this.http.put(url, { params: urlParams }).pipe(
      catchError((error) => {
        return this.commonService.catchError(error);
      }),
      map((response: any) => {
        return response;
      })
    );
  }

  unlockUser(data: any) {
    const url = environment.unlockUser;
    let urlParams = new HttpParams();
    urlParams = urlParams.append('email', data.email);
    return this.http.put(url, null, { params: urlParams }).pipe(
      catchError((error) => {
        return this.commonService.catchError(error);
      }),
      map((response: any) => {
        return response;
      })
    );
  }
  assignRole(data: any) {
    const url = environment.assignRole + data.email;
    let urlParams = new HttpParams();
    urlParams = urlParams.append('roleId', data.roleId);
    urlParams = urlParams.append('asigineeUserName', data.asigineeUserName);
    return this.http.put(url, null, { params: urlParams }).pipe(
      catchError((error) => {
        return this.commonService.catchError(error);
      }),
      map((response: any) => {
        return response;
      })
    );
  }

  checkUserName(data: any) {
    const url = environment.checkUserName;
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

  getUserDetailsById(data: any) {
    const url = environment.getUserDetailsById + '/' + data.userId;
    return this.http.get(url).pipe(
      catchError((error) => {
        return this.commonService.catchError(error);
      }),
      map((response: any) => {
        return response;
      })
    );
  }

  approveAgent(data: any) {
    const url =
      environment.agentApproval + '/' + data.userId + '/' + data.status;

    return this.http.put(url, null).pipe(
      catchError((error) => {
        return this.commonService.catchError(error);
      }),
      map((response: any) => {
        return response;
      })
    );
  }
}
