import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { catchError, map } from 'rxjs';
import { CommonsService } from './commons.service';

@Injectable({
  providedIn: 'root',
})
export class UserPermissionsService {
  constructor(
    private http: HttpClient,
    private commonService: CommonsService
  ) {}

  // Get user permissions by user ID
  getUserPermissions(data: any) {
    const url = environment.getPrivileges;

    let urlParams = new HttpParams();
    urlParams = urlParams.append('role_name', data);
    return this.http.get(url, { params: urlParams }).pipe(
      catchError((error) => {
        return this.commonService.catchError(error);
      }),
      map((response: any) => {
        return response;
      })
    );
  }

  // Update role permissions
  updateUserPermissions(roleName: string, permissions: any) {
    // Use the same base URL as getPrivileges but with PUT method
    const url = environment.getPrivileges;

    let urlParams = new HttpParams();
    urlParams = urlParams.append('role_name', roleName);

    return this.http.put(url, permissions, { params: urlParams }).pipe(
      catchError((error) => {
        return this.commonService.catchError(error);
      }),
      map((response: any) => {
        return response;
      })
    );
  }

  // Update role permissions using the correct API endpoint
  updateRolePermissions(roleId: string, roleData: any) {
    const url = `${environment.baseUrl}/auth/roles/${roleId}`;

    return this.http.put(url, roleData).pipe(
      catchError((error) => {
        return this.commonService.catchError(error);
      }),
      map((response: any) => {
        return response;
      })
    );
  }

  // Get all available permissions
  getAllAvailablePermissions() {
    const url = `${environment.baseUrl}/permissions`;
    return this.http.get(url).pipe(
      catchError((error) => {
        return this.commonService.catchError(error);
      }),
      map((response: any) => {
        return response;
      })
    );
  }
}
