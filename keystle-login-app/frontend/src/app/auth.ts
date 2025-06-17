import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { OAuthService, AuthConfig } from 'angular-oauth2-oidc';
import { BehaviorSubject } from 'rxjs';

// Configurações para OAuth
const authConfig: AuthConfig = {
  // URI para onde os usuários serão redirecionados após o login
  redirectUri: window.location.origin + '/callback',
  
  // ID do cliente registrado no provedor OAuth
  clientId: 'poc-auth-keystle',
  
  // URI do emissor/provedor de identidade
  issuer: 'https://idm.keystle.io/cyberclan-b2b/oidc',
  
  // URL para logout
  logoutUrl: 'https://idm.keystle.io/cyberclan-b2b/oidc/logout',
  
  // Escopos solicitados
  scope: 'openid profile email',
  
  // Fluxo de autenticação usado (Authorization Code com PKCE)
  responseType: 'code',
  
  // Recuperar token de acesso
  requestAccessToken: true,
  
  // Usar OIDC para obter informações do usuário
  oidc: true,
  
  // Não usar popups
  useSilentRefresh: false,
  
  

  // Configurações para permitir renovação silenciosa de tokens
  silentRefreshRedirectUri: window.location.origin + '/silent-refresh.html',
  
  // Configurações adicionais
  showDebugInformation: true, // Ajuda no desenvolvimento
  strictDiscoveryDocumentValidation: false, // Permite documentos de descoberta mais flexíveis
  requireHttps: false, // Apenas para desenvolvimento, use true em produção
  
  // Os endpoints serão descobertos automaticamente via .well-known
  // ou configurados manualmente ao inicializar o serviço
};

// Não precisamos de constantes adicionais, usamos diretamente authConfig

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Observáveis para controlar o estado de autenticação e o perfil do usuário
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
    this.oauthService.configure(authConfig);
    // Ativar PKCE programaticamente
    (this.oauthService as any).usePKCE = true;
    
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

  public login() {
    console.log('Iniciando fluxo de login com método padrão');
    
    // Tenta iniciar o fluxo usando a biblioteca
    this.oauthService.initLoginFlow();
  }

  // public login() {
  //   // URL fixa para testes
  //   const authorizationUrl = 'https://idm.keystle.io/cyberclan-b2b/oidc/auth';
    
  //   // Adicionar parâmetros
  //   const params = new URLSearchParams();
  //   params.set('client_id', 'poc-auth-keystle');
  //   params.set('redirect_uri', window.location.origin + '/callback');
  //   params.set('response_type', 'code');
  //   params.set('scope', 'openid profile email');
  //   params.set('state', this.generateRandomState());
    
  //   // URL completa
  //   const fullUrl = `${authorizationUrl}?${params.toString()}`;
  //   console.log('Tentando URL:', fullUrl);
    
  //   window.open(fullUrl, '_blank');
  // }

  // Helper method para configurar o objeto OAuth
  private configureOAuthObject(): AuthConfig {
    return authConfig;
  }
  
  // Gerar um estado aleatório para segurança
  private generateRandomState(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
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
