# Keystle Authentication Demo

Uma aplicação Angular que demonstra a integração com o Keystle através do fluxo OAuth 2.0/OpenID Connect.

## Visão Geral

Este projeto é uma prova de conceito (PoC) para integração com o Keystle, uma solução de gestão de identidade e autorização multi-tenant. 
A aplicação demonstra o fluxo de autenticação utilizando OAuth 2.0 Authorization Code Flow com PKCE, 
recomendado para aplicações de página única (SPAs).

### Funcionalidades

- Login através do Keystle usando OAuth 2.0/OpenID Connect
- Visualização de tokens JWT e suas claims
- Tratamento de callback de autenticação
- Renovação automática de tokens
- Visualização de perfil do usuário autenticado

## Estrutura do Projeto

```
frontend/
├── src/
│   ├── app/
│   │   ├── auth.ts           # Serviço de autenticação OAuth
│   │   ├── login/            # Componente de tela de login
│   │   ├── home/             # Componente home (pós-autenticação)
│   │   ├── callback/         # Componente para processar callback OAuth
│   │   ├── app.ts            # Componente principal da aplicação
│   │   └── app.routes.ts     # Configuração das rotas
│   ├── assets/
│   │   └── silent-refresh.html # Página para renovação silenciosa de tokens
│   └── ...
└── ...
```

## Tecnologias Utilizadas

- Angular (v17+)
- angular-oauth2-oidc
- Firebase (para hosting)

## Requisitos

- Node.js (v16+)
- Angular CLI
- Firebase CLI (opcional, para deploy)

## Configuração

### 1. Clone o repositório

```bash
git clone [url-do-repositorio]
cd keystle-login-app/frontend
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure o Keystle

1. Acesse o portal administrativo do Keystle
2. Registre uma nova aplicação cliente OAuth 2.0
3. Configure as seguintes informações:
   - Nome da aplicação: "Keystle Auth Demo"
   - Tipo de aplicação: "Single Page Application"
   - URLs de redirecionamento autorizados:
     - http://localhost:4200/callback
     - https://[seu-dominio-firebase]/callback
   - Escopos solicitados: "openid profile email"

### 4. Configure a aplicação

Abra o arquivo `src/app/auth.ts` e atualize o Client ID:

```typescript
const oauthConfig: AuthConfig = {
  clientId: 'seu-client-id-obtido-do-keystle',
  // ...outras configurações...
};
```

## Execução

### Desenvolvimento local

```bash
ng serve
```

Acesse a aplicação em http://localhost:4200

### Build para produção

```bash
ng build
```

### Deploy para Firebase

```bash
firebase deploy
```

## Fluxo de Autenticação

1. Usuário acessa a aplicação e clica em "Entrar com Keystle"
2. O navegador redireciona para o servidor de autenticação do Keystle
3. Usuário realiza login no Keystle
4. O navegador é redirecionado de volta para a aplicação com um código de autorização
5. A aplicação troca o código por tokens JWT
6. O usuário é redirecionado para a página home onde pode ver seu perfil e os tokens

## Segurança

Esta implementação utiliza o fluxo Authorization Code com PKCE, recomendado para SPAs, pois:

- Não armazena o client secret no navegador
- Utiliza um code challenge para proteção adicional
- Gerencia tokens de forma segura via angular-oauth2-oidc

## Pronto para Produção

Antes do deploy em produção:

1. Atualize a configuração para usar HTTPS:
   ```typescript
   requireHttps: true
   ```

2. Configure corretamente as URLs de callback para seu domínio de produção
3. Desative o modo de debug:
   ```typescript
   showDebugInformation: false
   ```

## Suporte

Para dúvidas ou problemas, entre em contato com a equipe de desenvolvimento.

---

© 2025 - Prova de Conceito para integração com Keystle
