// Ambiente de desenvolvimento
export const environment = {
  production: false,
  // authority: 'https://idm.keystle.io/cyberclan-b2b/oidc',
  authority: 'https://idm.jummon.com/cyberclan/oidc',  
  clientId: 'poc-auth-keystle',
  baseUrl: 'http://localhost:4200',
  redirectUri: 'http://localhost:4200/callback',
  postLogoutRedirectUri: 'http://localhost:4200/login'
};
