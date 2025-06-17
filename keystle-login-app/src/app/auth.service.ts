// src/app/auth.service.ts
import { Injectable, inject } from '@angular/core';
import {
  User,
  UserManager,
  WebStorageStateStore,
} from 'oidc-client-ts';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private userManager: UserManager;
  private user: User | null = null;

  constructor() {
    this.userManager = new UserManager({
      authority: 'https://idm.keystle.io/cyberclan-b2b/oidc',
      client_id: 'poc-auth-keystle',
      redirect_uri: 'http://localhost:4200/callback',
      post_logout_redirect_uri: 'http://localhost:4200',
      response_type: 'code',
      scope: 'openid profile email',
      userStore: new WebStorageStateStore({ store: window.localStorage }),
    });

    this.userManager.getUser().then((user) => {
      this.user = user;
    });
  }

  login() {
    this.userManager.signinRedirect();
  }

  async completeLogin() {
    this.user = await this.userManager.signinRedirectCallback();
  }

  getAccessToken(): string | null {
    return this.user?.access_token ?? null;
  }

  logout() {
    this.userManager.signoutRedirect();
  }

  async fetchUsers() {
    const token = this.getAccessToken();
    console.log("PP> token = ", token);
    if (!token) throw new Error('Token não encontrado');

    const res = await fetch(`https://api.keystle.io/clients/poc-auth-keystle/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'x-tenant-id': 'cyberclan-b2b',
      },
    });

    if (!res.ok) throw new Error(`Erro: ${res.status}`);
    return await res.json();
  }
}
