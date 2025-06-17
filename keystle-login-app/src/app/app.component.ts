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

  constructor(public auth: AuthService) {}

  ngOnInit(): void {
    if (window.location.href.includes('code=')) {
      this.auth.completeLogin().then(() => {
        window.history.replaceState({}, '', '/');
      });
    }
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
