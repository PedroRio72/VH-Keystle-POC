// src/app/auth.service.ts
import { Injectable, inject } from '@angular/core';
import {
  User,
  UserManager,
  WebStorageStateStore,
} from 'oidc-client-ts';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private userManager: UserManager;
  private user: User | null = null;

  constructor() {
    console.log("PP> AuthService constructor()");
    console.log("PP> environment = ", environment);
    this.userManager = new UserManager({
      authority: environment.authority,
      client_id: environment.clientId,
      redirect_uri: environment.redirectUri,
      post_logout_redirect_uri: environment.postLogoutRedirectUri,
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
    console.log("PP> Access Token:", this.user.access_token);
    console.log("PP> Refresh Token:", this.user.refresh_token);
    console.log("PP> Id Token:", this.user.id_token);
    console.log("PP> User:", this.user.profile);
    console.log("PP> Expires At:", this.user.expires_at);
    console.log("PP> Expires In:", this.user.expires_in);
    console.log("PP> Session State:", this.user.session_state);
    console.log("PP> State:", this.user.state);
    
  }

  getAccessToken(): string | null {
    return this.user?.access_token ?? null;
  }

  logout() {
    this.userManager.signoutRedirect();
  }

  async fetchUsers() {
    console.log("PP> fetchUsers()");
    const token = this.getAccessToken();
    console.log("PP> token length = ", token ? token.length : 0);
    console.log("PP> token first 20 chars = ", token ? token.substring(0, 20) + '...' : 'null');
    
    if (!token) throw new Error('Token not found');

    // const res = await fetch(`https://api.keystle.io/clients/poc-auth-keystle/users`, {
    const res = await fetch(`/api/clients/poc-auth-keystle/users`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'x-tenant-id': 'cyberclan-b2b',
        'Content-Type': 'application/json'
      },
    });

    console.log("PP> API Response Status:", res.status, res.statusText);
    
    if (!res.ok) {
      const errorText = await res.text().catch(() => 'No error details');
      console.error("PP> API Error Details:", errorText);
      throw new Error(`Erro: ${res.status} - ${res.statusText}`);
    }
    
    return await res.json();
  }
}
