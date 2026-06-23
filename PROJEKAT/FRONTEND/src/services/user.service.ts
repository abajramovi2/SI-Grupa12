import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

export type ApiAccessResult = {
  ok: boolean;
  status: number;
  message: string;
};

export type UserRole = {
  id: string;
  naziv: string;
  opis?: string | null;
};

export type ManagedUser = {
  id: string;
  ime: string;
  prezime: string;
  email: string;
  statusNaloga: string;
  ulogaId: string;
  ulogaNaziv: string;
  ulogaOpis?: string | null;
};

export type UserRoleManagementResult = {
  korisnici: ManagedUser[];
  uloge: UserRole[];
};

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly baseUrl = environment.apiUrl.replace('/api', '');
  private readonly backendSessionUrl = `${this.baseUrl}/auth/session`;
  private readonly backendLogoutUrl = `${this.baseUrl}/auth/logout`;
  private readonly backendApiUrl = environment.apiUrl;
  private readonly accessTokenKey = 'kc_access_token';


  private async fetchWithTimeout(input: RequestInfo | URL, init: RequestInit, timeoutMs = 15000): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs);

    try {
      return await fetch(input, { ...init, signal: controller.signal });
    } finally {
      window.clearTimeout(timeoutId);
    }
  }

  public async getValidSession(accessToken: string): Promise<void> {
    const sessionResponse = await this.fetchWithTimeout(this.backendSessionUrl, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      credentials: 'include',
    });

    if (!sessionResponse.ok) {
      throw new Error('Backend nije kreirao session cookie.');
    }
  }

  public async logout(): Promise<void> {
    const response = await this.fetchWithTimeout(this.backendLogoutUrl, {
      method: 'POST',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Neuspjesan logout.');
    }
  }

  public async getProfile(): Promise<ApiAccessResult> {
    return this.getApiMessage('/profile');
  }

  public async getRoleMessage(path: string): Promise<ApiAccessResult> {
    return this.getApiMessage(path);
  }

  public async getUsersWithRoles(): Promise<UserRoleManagementResult> {
    const response = await this.requestApi('/korisnici', { method: 'GET' });

    if (!response.ok) {
      const body = await this.parseJson<{ error?: string }>(response);
      throw new Error(body.error || 'Greška pri dohvatu korisnika.');
    }

    return this.parseJson<UserRoleManagementResult>(response);
  }

  public async updateUserRole(userId: string, ulogaId: string): Promise<ManagedUser> {
    const response = await this.requestApi(`/korisnici/${encodeURIComponent(userId)}/uloga`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ulogaId }),
    });

    const body = await this.parseJson<{ error?: string; korisnik?: ManagedUser }>(response);

    if (!response.ok || !body.korisnik) {
      throw new Error(body.error || 'Greška pri izmjeni uloge korisnika.');
    }

    return body.korisnik;
  }

  private async requestApi(path: string, init: RequestInit): Promise<Response> {
    const headers = new Headers(init.headers || {});
    const accessToken = sessionStorage.getItem(this.accessTokenKey);

    if (accessToken) {
      headers.set('Authorization', `Bearer ${accessToken}`);
    }

    return this.fetchWithTimeout(`${this.backendApiUrl}${path}`, {
      ...init,
      headers,
      credentials: 'include',
    });
  }

  private async parseJson<T>(response: Response): Promise<T> {
    try {
      return (await response.json()) as T;
    } catch {
      return {} as T;
    }
  }

  private async getApiMessage(path: string): Promise<ApiAccessResult> {
    const response = await this.requestApi(path, { method: 'GET' });

    let body: { message?: string; error?: string; user?: unknown } = {};

    body = await this.parseJson<typeof body>(response);

    return {
      ok: response.ok,
      status: response.status,
      message:
        body.message ||
        body.error ||
        (body.user ? 'Profil korisnika je uspjesno ucitan.' : 'Backend nije vratio poruku.'),
    };
  }
}
