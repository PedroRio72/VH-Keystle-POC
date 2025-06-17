// src/app/app.component.ts
import { Component, OnInit } from '@angular/core';
import { NgIf, JsonPipe } from '@angular/common';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [NgIf, JsonPipe]
})
export class AppComponent implements OnInit {
  users: any = null;
  error: string | null = null;
  token: string | null = null;
  

  constructor(public auth: AuthService) {this.getToken();}

  ngOnInit(): void {
    // Verificar o token a cada 1 segundo pois a função getAccessToken() é assíncrona
    setInterval(() => {
      this.getToken();
    }, 1000);

    if (window.location.href.includes('code=')) {
      this.auth.completeLogin().then(() => {
        window.history.replaceState({}, '', '/');
      });
    }
    
  }

  getToken() {
    this.token = this.auth.getAccessToken() ?? "<< No Token >>";
  }

  login() {    
    this.auth.login();
  }

  logout() {
    
    this.auth.logout();
  }

  async getUsers() {
    try {
      this.users = await this.auth.fetchUsers();
      this.error = null;
    } catch (err) {
      this.error = (err as Error).message;
      this.users = null;
    }
  }
}
