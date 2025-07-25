import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthserviceService } from '../_services/authservice.service';
import { TokenserviceService } from '../_services/tokenservice.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private tokenService: TokenserviceService
  ) {}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.tokenService.getToken()) {
      return true;
    }

    this.router.navigate(['/login']);
    return false;
  }
}
