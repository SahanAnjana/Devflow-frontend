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

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  request = 0;
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
    null
  );
  private refreshAttempts = 0;
  private maxRefreshAttempts = 3;

  currentUser: any;

  constructor(
    private commonService: CommonsService,
    private tokenService: TokenserviceService,
    private router: Router,
    private dataService: DataService,
    private authService: AuthserviceService,
    private dashboardService: DashboardService
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
          !authReq.url.includes(environment.authenticate) &&
          !authReq.url.includes(environment.refresh)
        ) {
          console.log('401 unauthorized - attempting token refresh');
          const refreshToken = this.tokenService.getRefreshToken();

          if (refreshToken && refreshToken.trim() !== '') {
            console.log('Refresh token available, attempting refresh');
            return this.handle401Error(authReq, next);
          } else {
            console.log('No refresh token available, redirecting to login');
            this.handleLogout();
            return throwError(() => error);
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

      // Check refresh attempts to prevent infinite loops
      if (this.refreshAttempts >= this.maxRefreshAttempts) {
        console.log('Max refresh attempts reached, logging out');
        this.refreshAttempts = 0;
        this.isRefreshing = false;
        this.handleLogout();
        return throwError(() => new Error('Max refresh attempts exceeded'));
      }

      this.refreshAttempts++;
      const refreshToken = this.tokenService.getRefreshToken();
      const formdata: any = {
        refresh_token: refreshToken,
      };

      console.log(
        `Attempting to refresh token (attempt ${this.refreshAttempts}/${this.maxRefreshAttempts}):`,
        refreshToken
      );

      if (refreshToken && refreshToken.trim() !== '') {
        return this.authService.refreshToken(formdata).pipe(
          switchMap((tokenResponse: any) => {
            console.log('Token refresh successful:', tokenResponse);
            this.isRefreshing = false;
            this.refreshAttempts = 0; // Reset attempts on success

            // Save new tokens
            if (tokenResponse['access_token']) {
              this.tokenService.saveToken(tokenResponse['access_token']);
              localStorage.setItem('isToken', 'true');
              this.refreshTokenSubject.next(tokenResponse['access_token']);

              // Update refresh token if provided
              if (tokenResponse['refresh_token']) {
                this.tokenService.saveRefreshToken(
                  tokenResponse['refresh_token']
                );
              }

              // Get updated user details
              this.getUserDEtails();
              this.getUserDetailsByme();

              // Retry the original request with new token
              return next.handle(
                this.addTokenHeader(request, tokenResponse['access_token'])
              );
            } else {
              console.error('No access token in refresh response');
              this.handleLogout();
              return throwError(() => new Error('Invalid token response'));
            }
          }),
          catchError((err) => {
            console.error('Token refresh failed:', err);
            this.isRefreshing = false;

            // If refresh failed, don't immediately logout - might be temporary network issue
            if (this.refreshAttempts >= this.maxRefreshAttempts) {
              this.refreshAttempts = 0;
              this.handleLogout();
            }

            return throwError(() => new Error('Token refresh failed'));
          })
        );
      } else {
        console.log('No valid refresh token, logging out');
        this.isRefreshing = false;
        this.refreshAttempts = 0;
        this.handleLogout();
        return throwError(() => new Error('No refresh token available'));
      }
    } else {
      // If already refreshing, wait for the refresh to complete
      return this.refreshTokenSubject.pipe(
        filter((token) => token !== null),
        take(1),
        switchMap((token) => {
          console.log('Using refreshed token for queued request');
          return next.handle(this.addTokenHeader(request, token));
        })
      );
    }
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
    console.log('Handling logout - clearing storage and redirecting');
    this.clearStorage();

    // Reset refresh state
    this.isRefreshing = false;
    this.refreshTokenSubject.next(null);

    // Only navigate to login if not already there
    if (!this.router.url.includes('/login')) {
      this.router.navigate(['/login']);
    }
  }

  private clearStorage() {
    localStorage.clear();
    sessionStorage.clear();
    this.tokenService.clearToken();
  }
}
