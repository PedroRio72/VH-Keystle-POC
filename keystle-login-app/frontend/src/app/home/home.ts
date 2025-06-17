import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../auth';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})
export class HomeComponent implements OnInit {
  isLoading = true;
  errorMessage: string | null = null;
  accessToken: string | null = null;
  decodedToken: any = null;
  userInfo: any = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Verificar se o usuário está autenticado
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    this.loadTokenInfo();
    
    // Inscrever-se para atualizações do perfil
    this.authService.userProfile$.subscribe(profile => {
      this.userInfo = profile;
      this.isLoading = false;
    });
  }

  loadTokenInfo(): void {
    // Obter o token de acesso
    this.accessToken = this.authService.getAccessToken();
    
    // Decodificar o token JWT
    if (this.accessToken) {
      this.decodedToken = this.authService.getDecodedAccessToken();
    }
    
    // Carregar informações do perfil se não estiverem disponíveis
    if (!this.userInfo) {
      this.authService.loadUserProfile();
    }
  }

  logout(): void {
    this.authService.logout();
  }

  // Formatar objeto JSON para exibição
  formatJson(obj: any): string {
    return JSON.stringify(obj, null, 2);
  }
}
