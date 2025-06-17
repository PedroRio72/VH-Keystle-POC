import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginComponent implements OnInit {
  isLoading = false;
  errorMessage: string | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Verificar se o usuário já está autenticado
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/home']);
    }
  }

  // Iniciar o fluxo de autenticação OAuth
  login(): void {
    this.isLoading = true;
    this.errorMessage = null;
    try {
      this.authService.login();
      // O redirecionamento é feito pelo serviço OAuth
    } catch (error) {
      this.isLoading = false;
      this.errorMessage = 'Erro ao iniciar o processo de login. Tente novamente.';
      console.error('Erro no login:', error);
    }
  }
}
