// Ambiente de produção
export const environment = {
  production: true,
  // authority: 'https://idm.keystle.io/cyberclan-b2b/oidc',
  authority: 'https://idm.jummon.com/cyberclan/oidc',  
  clientId: 'poc-auth-keystle',
  baseUrl: 'https://vh-keystle-poc.web.app',
  redirectUri: 'https://vh-keystle-poc.web.app/callback',
  postLogoutRedirectUri: 'https://vh-keystle-poc.web.app'
};
