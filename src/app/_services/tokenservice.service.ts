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
  }
  public getRefreshToken(): string | null {
    return localStorage.getItem(REFRESHTOKEN_KEY);
  }
  clearToken() {
    localStorage.clear();
  }

  saveRefreshToken(token: string): void {
    localStorage.removeItem(REFRESHTOKEN_KEY);
    localStorage.setItem(REFRESHTOKEN_KEY, token);
  }
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
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
