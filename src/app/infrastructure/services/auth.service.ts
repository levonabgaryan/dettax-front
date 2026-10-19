import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CanActivateFn, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  private readonly _token = signal<string | null>(localStorage.getItem('access_token'));
  public readonly token = this._token.asReadonly();

  private readonly _userId = signal<string | null>(
    this.getUserIdFromToken(localStorage.getItem('access_token')),
  );
  public readonly userId = this._userId.asReadonly();

  private readonly identityUrl = 'http://localhost:5291';
  private readonly clientId = 'dettax-frontend';
  private readonly redirectUri = 'http://localhost:3000/callback';

  public async login(): Promise<void> {
    const codeVerifier = this.generateRandomString(64);
    localStorage.setItem('code_verifier', codeVerifier);

    const codeChallenge = await this.generateCodeChallenge(codeVerifier);

    const authUrl =
      `${this.identityUrl}/connect/authorize?` +
      `client_id=${this.clientId}&` +
      `redirect_uri=${encodeURIComponent(this.redirectUri)}&` +
      `response_type=code&` +
      `scope=api offline_access&` +
      `code_challenge=${codeChallenge}&` +
      `code_challenge_method=S256`;

    window.location.href = authUrl;
  }

  public async handleCallback(code: string): Promise<void> {
    const codeVerifier = localStorage.getItem('code_verifier');
    if (!codeVerifier) throw new Error('Code verifier not found');

    const body = new URLSearchParams();
    body.set('grant_type', 'authorization_code');
    body.set('code', code);
    body.set('redirect_uri', this.redirectUri);
    body.set('client_id', this.clientId);
    body.set('code_verifier', codeVerifier);

    try {
      const res = await firstValueFrom(
        this.http.post<TokenResponse>(`${this.identityUrl}/connect/token`, body.toString(), {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        }),
      );

      localStorage.setItem('access_token', res.access_token);
      this._token.set(res.access_token);
      this._userId.set(this.getUserIdFromToken(res.access_token));
      localStorage.removeItem('code_verifier');

      await this.router.navigate(['/']);
    } catch (error) {
      console.error('Token exchange failed', error);
      await this.router.navigate(['/']);
    }
  }

  public logout(): void {
    localStorage.removeItem('access_token');
    this._token.set(null);
    this._userId.set(null);

    const postLogoutRedirect = encodeURIComponent('http://localhost:3000/');
    window.location.href = `${this.identityUrl}/connect/logout?post_logout_redirect_uri=${postLogoutRedirect}`;
  }

  private getUserIdFromToken(token: string | null): string | null {
    if (!token) return null;
    try {
      const payload = token.split('.')[1];
      const decoded = JSON.parse(atob(payload));
      return decoded.sub || null;
    } catch (e) {
      console.error('Failed to decode token', e);
      return null;
    }
  }

  // ─── PKCE HELPERS ───────────────────────────────────────────
  private generateRandomString(length: number): string {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
    let result = '';
    const values = new Uint32Array(length);
    window.crypto.getRandomValues(values);
    for (let i = 0; i < length; i++) {
      result += charset[values[i] % charset.length];
    }
    return result;
  }

  private async generateCodeChallenge(verifier: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(verifier);
    const digest = await window.crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode(...new Uint8Array(digest)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
  scope: string;
}

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);

  if (authService.token()) {
    return true;
  }

  authService.login();
  return false;
};
