import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { OAuthService, AuthConfig } from 'angular-oauth2-oidc';
import { BehaviorSubject } from 'rxjs';

// Configuração do OAuth para o Keystle
const oauthConfig: AuthConfig = {
  // Substitua com o seu Client ID registrado no Keystle
  clientId: 'your-client-id',
  
  // A URL base do seu provedor de identidade Keystle
  issuer: 'https://idm.keystle.io/cyberclan-b2b/oidc',
  
  // URL para onde o usuário será redirecionado após o login
  redirectUri: window.location.origin + '/callback',
  
  // Escopos solicitados
  scope: 'openid profile email',
  
  // Tipo de resposta esperada
  responseType: 'code',
  
  // Código de desafio para segurança adicional (PKCE)
  // O PKCE será habilitado na configuração do serviço
  
  // Configurações para permitir renovação silenciosa de tokens
  silentRefreshRedirectUri: window.location.origin + '/silent-refresh.html',
  
  // Configurações adicionais
  showDebugInformation: true, // Ajuda no desenvolvimento
  strictDiscoveryDocumentValidation: false, // Permite documentos de descoberta mais flexíveis
  requireHttps: false, // Apenas para desenvolvimento, use true em produção
  
  // Os endpoints serão descobertos automaticamente via .well-known
  // ou configurados manualmente ao inicializar o serviço
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userProfileSubject = new BehaviorSubject<any>(null);
  public userProfile$ = this.userProfileSubject.asObservable();
  
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(
    private oauthService: OAuthService,
    private router: Router
  ) {}
  
  // Método público para inicializar o OAuth
  public initOAuth() {
    // Configurar o serviço OAuth
    this.configureOAuth();
    
    // Ativar renovação automática de tokens
    this.oauthService.setupAutomaticSilentRefresh();
    this.oauthService.useSilentRefresh = true;
    
    // Usar localStorage para armazenar tokens
    this.oauthService.setStorage(localStorage);
  }

  // Configuração inicial do serviço OAuth
  private configureOAuth() {
    this.oauthService.configure(oauthConfig);
    
    // Tentar carregar o documento de descoberta
    this.oauthService.loadDiscoveryDocument().then(() => {
      // Verificar se tem um token válido ao iniciar
      this.oauthService.tryLoginCodeFlow().then(() => {
        if (this.oauthService.hasValidAccessToken()) {
          this.isAuthenticatedSubject.next(true);
          this.loadUserProfile();
          this.oauthService.setupAutomaticSilentRefresh();
        }
      }).catch(error => {
        console.error('Erro ao tentar login com código de autorização:', error);
      });
    }).catch(error => {
      console.error('Erro ao carregar documento de descoberta:', error);
      // Se falhar, tente usar os endpoints configurados manualmente
    });
  }

  // Iniciar o processo de login
  public login() {
    this.oauthService.initCodeFlow();
  }

  // Logout do usuário
  public logout() {
    this.oauthService.logOut();
    this.isAuthenticatedSubject.next(false);
    this.userProfileSubject.next(null);
    this.router.navigate(['/login']);
  }

  // Carregar informações do perfil do usuário
  public loadUserProfile() {
    this.oauthService.loadUserProfile().then(profile => {
      this.userProfileSubject.next(profile);
    }).catch(error => {
      console.error('Erro ao carregar perfil do usuário:', error);
    });
  }

  // Obter o token JWT
  public getAccessToken(): string {
    return this.oauthService.getAccessToken();
  }

  // Verificar se o usuário está autenticado
  public isAuthenticated(): boolean {
    return this.oauthService.hasValidAccessToken();
  }

  // Decodificar o token JWT para visualização
  public getDecodedAccessToken(): any {
    const token = this.getAccessToken();
    if (token) {
      try {
        // Decodificar o token JWT (sem verificação de assinatura)
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
      } catch (e) {
        console.error('Erro ao decodificar token:', e);
        return null;
      }
    }
    return null;
  }
  
  // Processar callback de autenticação - usado pelo componente de callback
  public handleCallback(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      // Tenta processar o código de autorização recebido
      this.oauthService.tryLoginCodeFlow().then(() => {
        if (this.oauthService.hasValidAccessToken()) {
          // Autenticação bem-sucedida
          this.isAuthenticatedSubject.next(true);
          
          // Carregar perfil do usuário
          this.loadUserProfile();
          
          // Configurar renovação silenciosa de tokens
          this.oauthService.setupAutomaticSilentRefresh();
          
          resolve(true);
        } else {
          // Não conseguiu obter um token válido
          console.error('Falha ao obter token válido');
          this.isAuthenticatedSubject.next(false);
          resolve(false);
        }
      }).catch(error => {
        console.error('Erro no processamento do callback de autenticação:', error);
        this.isAuthenticatedSubject.next(false);
        reject(error);
      });
    });
  }
}
