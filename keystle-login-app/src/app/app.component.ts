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
  i: number = 0;
  intervalId: any;
  constructor(public auth: AuthService) { this.getToken(); }

  ngOnInit(): void {

    // Verificar o token a cada 1 segundo pois a função getAccessToken() é assíncrona
    this.intervalId = setInterval(() => {
      console.log("PP> AppComponent ngOnInit() - getToken()", this.i++);
      this.getToken();
    }, 1000);

    if (window.location.href.includes('code=')) {
      this.auth.completeLogin().then(() => {
        window.history.replaceState({}, '', '/');
      });
    }

  }

  getToken() {
    this.token = this.auth.getAccessToken() ?? "";
    if (this.token) clearInterval(this.intervalId);
  }

  login() {
    this.auth.login();
  }

  logout() {

    this.auth.logout();
  }

  copyToken() {
    if (this.token) {
      navigator.clipboard.writeText(this.token)
        .then(() => {
          // Feedback visual temporário
          const originalButtonText = 'Copy Token';
          const copyButton = document.getElementById('copyTokenButton') as HTMLElement;
          copyButton.style.backgroundColor = '#4caf50'; // Verde para indicar sucesso
          copyButton.textContent = 'Copied!';
          
          setTimeout(() => {
            copyButton.style.backgroundColor = '#1976d2'; // Volta para a cor original
            copyButton.textContent = originalButtonText;
          }, 2000);
        })

        .catch(err => {
          console.error('Erro ao copiar token: ', err);
          this.error = 'Não foi possível copiar o token para a área de transferência.';
        });
    }
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
