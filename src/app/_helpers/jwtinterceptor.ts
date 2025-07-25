import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  BehaviorSubject,
  catchError,
  filter,
  finalize,
  Observable,
  switchMap,
  take,
  throwError,
} from 'rxjs';
import { CommonsService } from '../_services/commons.service';
import { DataService } from '../_services/shared-data/data.service';
import { environment } from 'src/environments/environment';
import { TokenserviceService } from '../_services/tokenservice.service';
import { AuthserviceService } from '../_services/authservice.service';
import { DashboardService } from '../_services/dashboard.service';
import { RolemanagementService } from '../_services/rolemanagement.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  request = 0;
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
    null
  );

  currentUser: any;

  constructor(
    private commonService: CommonsService,
    private tokenService: TokenserviceService,
    private router: Router,
    private dataService: DataService,
    private authService: AuthserviceService,
    private dashboardService: DashboardService,
    private roleManagemnetService: RolemanagementService
  ) {}

  privileges: any = {
    CORE_SHOW_REPORTS_NAV: false,
    CORE_SHOW_USER_MANAGEMENT_NAV: false,
    CORE_SHOW_TRANSFERS_NAV: false,
    CORE_SHOW_RATE_SETTINGS_NAV: false,
    CORE_SHOW_DIAGNOSTIC_NAV: false,
    CORE_SHOW_PROMOTION_NAV: false,
    CORE_SHOW_PENDING_CASH_NAV: false,
    CORE_SHOW_TRANSFER_LIMIT_NAV: false,
    CORE_SHOW_MAKE_TRANSFER_NAV: false,
    CORE_SHOW_ROLE_MANAGEMENT_NAV: false,
    CORE_SHOW_COMMUNICATION_NAV: false,
  };

  privilegeCodes: any;
  privilagesList: any;

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<Object>> {
    let authReq = req;

    const token = this.tokenService.getToken();
    if (token != null) {
      authReq = this.addTokenHeader(req, token);
    }

    this.commonService.showLoading();
    this.request++;

    return next.handle(authReq).pipe(
      catchError((error) => {
        if (
          error instanceof HttpErrorResponse &&
          error.status === 401 &&
          !authReq.url.includes(environment.authenticate)
        ) {
          console.log('401 un authorized');
          const token = this.tokenService.getRefreshToken();
          console.log('rfresh token', this.tokenService.getRefreshToken());
          console.log('rfresh token', token);
          if (token) {
            // this.getUserDetailsByme();
            this.getUserDEtails();
            return this.handle401Error(authReq, next);
          } else {
            localStorage.clear();
            this.router.navigate(['/login']);
            window.location.reload();
          }
        }
        return throwError(() => error);
      }),
      finalize(() => {
        this.stopLoader();
      })
    );
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      const token = this.tokenService.getRefreshToken();
      const formdata: any = {
        refresh_token: token,
      };

      if (token)
        return this.authService.refreshToken(formdata).pipe(
          switchMap((token: any) => {
            this.isRefreshing = false;
            this.tokenService.saveToken(token['access_token']);
            this.tokenService.saveRefreshToken(token['refresh_token']);
            localStorage.setItem('isToken', 'true');
            this.refreshTokenSubject.next(token['access_token']);
            this.getUserDEtails();
            this.getUserDetailsByme();
            return next.handle(
              this.addTokenHeader(request, token['access_token'])
            );
          }),
          catchError((err) => {
            this.isRefreshing = false;

            // this.tokenService.signOut();
            this.handleLogout();
            return throwError(() => new Error(err));
          })
        );
    }
    return this.refreshTokenSubject.pipe(
      filter((token) => token !== null),
      take(1),
      switchMap((token) => next.handle(this.addTokenHeader(request, token)))
    );
  }

  getUserDEtails() {
    const data: any = {};
    this.dashboardService.getuserdetails().subscribe({
      next: (res) => {
        if (res) {
          console.log('roleId', res['role']);
          this.dataService.userId = res['id'];
          this.getPrivilages(res['role']);
        }
      },
    });
  }
  getPrivilages(rolename: string) {
    this.dashboardService.getPrivilagesRole(rolename).subscribe({
      next: (res) => {
        if (res) {
          console.log('roleId', res['permissions']);

          res.permissions.map((permission: any) => {
            this.dataService.permisions[permission] = true;
          });
          this.tokenService.savePrivileges(this.dataService.permisions);
          console.log('Converted Permissions:', this.dataService.permisions);
        }
      },
    });
  }

  getAdminPrivilages(roleid: any) {
    const data: any = {};
    data['roleId'] = roleid;
    data['isLogin'] = true;
    this.roleManagemnetService
      .getPrivilagesByuser(data)

      .subscribe({
        next: (res) => {
          if (res['responseDto']) {
            this.privilegeCodes = res['responseDto'];
            this.dataService.privilageCodes = res['responseDto'];
            this.tokenService.savePrivileges(res['responseDto']);
            console.log(this.privilegeCodes);
            this.privilegeCodes.forEach((data: any) => {
              if (data.privilegeCode == 'CORE_SHOW_REPORTS_NAV') {
                data.isActive == true
                  ? (this.privileges.CORE_SHOW_REPORTS_NAV = true)
                  : false;
              }
              if (data.privilegeCode == 'CORE_SHOW_USER_MANAGEMENT_NAV') {
                data.isActive == true
                  ? (this.privileges.CORE_SHOW_USER_MANAGEMENT_NAV = true)
                  : false;
              }
              if (data.privilegeCode == 'CORE_SHOW_TRANSFERS_NAV') {
                data.isActive == true
                  ? (this.privileges.CORE_SHOW_TRANSFERS_NAV = true)
                  : false;
              }
              if (data.privilegeCode == 'CORE_SHOW_RATE_SETTINGS_NAV') {
                data.isActive == true
                  ? (this.privileges.CORE_SHOW_RATE_SETTINGS_NAV = true)
                  : false;
              }
              if (data.privilegeCode == 'CORE_SHOW_DIAGNOSTIC_NAV') {
                data.isActive == true
                  ? (this.privileges.CORE_SHOW_DIAGNOSTIC_NAV = true)
                  : false;
              }
              if (data.privilegeCode == 'CORE_SHOW_PROMOTION_NAV') {
                data.isActive == true
                  ? (this.privileges.CORE_SHOW_PROMOTION_NAV = true)
                  : false;
              }
              if (data.privilegeCode == 'CORE_SHOW_PENDING_CASH_NAV') {
                data.isActive == true
                  ? (this.privileges.CORE_SHOW_PENDING_CASH_NAV = true)
                  : false;
              }
              if (data.privilegeCode == 'CORE_SHOW_TRANSFER_LIMIT_NAV') {
                data.isActive == true
                  ? (this.privileges.CORE_SHOW_TRANSFER_LIMIT_NAV = true)
                  : false;
              }
              if (data.privilegeCode == 'CORE_SHOW_MAKE_TRANSFER_NAV') {
                data.isActive == true
                  ? (this.privileges.CORE_SHOW_MAKE_TRANSFER_NAV = true)
                  : false;
              }
              if (data.privilegeCode == 'CORE_SHOW_ROLE_MANAGEMENT_NAV') {
                data.isActive == true
                  ? (this.privileges.CORE_SHOW_ROLE_MANAGEMENT_NAV = true)
                  : false;
              }
              if (data.privilegeCode == 'CORE_SHOW_COMMUNICATION_NAV') {
                data.isActive == true
                  ? (this.privileges.CORE_SHOW_COMMUNICATION_NAV = true)
                  : false;
              }
            });
          } else {
            console.log('privilages not working');
            this.privilagesList = '';
          }
        },
      });
  }

  getUserDetailsByme() {
    this.authService.getUsersDetialsBy().subscribe((res: any) => {
      this.dataService.userDetails = res;
      console.log('this.userDetails', this.dataService.userDetails);
    });
  }

  stopLoader() {
    this.request--;
    if (this.request <= 0) {
      this.commonService.hideLoading();
    }
  }

  private addTokenHeader(request: HttpRequest<any>, token: string) {
    return request.clone({
      headers: request.headers.set('Authorization', 'Bearer ' + token),
    });
  }

  private handleLogout() {
    this.clearStorage();
    this.router.navigate(['/login']); // Redirect to the login page
  }

  private clearStorage() {
    localStorage.clear();
    sessionStorage.clear();
    this.tokenService.clearToken();
  }
}
