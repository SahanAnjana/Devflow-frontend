import { Injectable } from '@angular/core';
const TOKEN_KEY = 'currentUser';
const REFRESHTOKEN_KEY = 'auth-refreshtoken';
const PRIVILEGES_KEY = 'AllPrivileges';
@Injectable({
  providedIn: 'root',
})
export class TokenserviceService {
  constructor() {}

  saveToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
    window.sessionStorage.setItem(TOKEN_KEY, token);
  }
  public getRefreshToken(): string | null {
    return (
      sessionStorage.getItem(REFRESHTOKEN_KEY) ||
      localStorage.getItem(REFRESHTOKEN_KEY)
    );
  }
  clearToken() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESHTOKEN_KEY);
    localStorage.removeItem(PRIVILEGES_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(REFRESHTOKEN_KEY);
    localStorage.removeItem('isToken');
  }

  saveRefreshToken(token: string): void {
    sessionStorage.setItem(REFRESHTOKEN_KEY, token);
    localStorage.setItem(REFRESHTOKEN_KEY, token);
  }
  getToken(): string | null {
    return sessionStorage.getItem(TOKEN_KEY);
  }

  savePrivileges(privileges: any) {
    // Use a more descriptive function name
    localStorage.setItem(PRIVILEGES_KEY, JSON.stringify(privileges)); // Store as a string
  }

  getPrivileges() {
    const privileges = localStorage.getItem(PRIVILEGES_KEY);
    return privileges ? JSON.parse(privileges) : null; // Parse back to an object
  }
}
