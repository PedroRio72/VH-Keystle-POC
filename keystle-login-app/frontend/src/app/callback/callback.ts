import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth';

@Component({
  selector: 'app-callback',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="callback-container">
      <div class="callback-content">
        <h2>Processando autenticação...</h2>
        <div class="spinner"></div>
        <p *ngIf="errorMessage" class="error">{{ errorMessage }}</p>
      </div>
    </div>
  `,
  styles: [`
    .callback-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      background-color: #f5f5f5;
    }
    
    .callback-content {
      text-align: center;
      padding: 2rem;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }
    
    h2 {
      color: #2c5cc5;
      margin-bottom: 1.5rem;
    }
    
    .spinner {
      border: 4px solid rgba(0, 0, 0, 0.1);
      border-radius: 50%;
      border-top: 4px solid #2c5cc5;
      width: 40px;
      height: 40px;
      margin: 0 auto 1.5rem;
      animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    .error {
      color: #e53935;
      margin-top: 1rem;
    }
  `]
})
export class CallbackComponent implements OnInit {
  errorMessage: string | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Processar o callback de autorização do OAuth
    this.processAuthCallback();
  }

  private processAuthCallback(): void {
    // Tentar completar o fluxo de código de autorização
    this.authService.handleCallback().then(success => {
      if (success) {
        // Redirecionar para a página home após autenticação bem-sucedida
        this.router.navigate(['/home']);
      } else {
        this.errorMessage = 'Falha na autenticação. Verifique suas credenciais.';
        setTimeout(() => this.router.navigate(['/login']), 3000);
      }
    }).catch(error => {
      console.error('Erro durante callback de autenticação:', error);
      this.errorMessage = 'Erro durante o processo de autenticação.';
      setTimeout(() => this.router.navigate(['/login']), 3000);
    });
  }
}
