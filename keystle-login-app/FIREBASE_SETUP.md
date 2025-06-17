# Guia de Configuração do Firebase

Este guia detalhará o processo de configuração do Firebase Hosting para a aplicação Keystle Authentication Demo.

## Pré-requisitos

1. Conta Google (para acessar o Firebase)
2. Projeto criado no [Firebase Console](https://console.firebase.google.com/)
3. Firebase CLI instalado (local ou globalmente)
4. Aplicação Angular construída com `ng build`

## Passo a Passo

### 1. Crie um projeto no Firebase Console

1. Acesse o [Firebase Console](https://console.firebase.google.com/)
2. Clique em "Adicionar projeto"
3. Dê um nome ao projeto (ex: "keystle-auth-demo")
4. Opcional: Configure o Google Analytics
5. Clique em "Criar projeto"

### 2. Registre sua aplicação no Firebase

1. Na página inicial do projeto, clique no ícone da web `</>` para adicionar uma aplicação web
2. Dê um nome à aplicação (ex: "keystle-login-app")
3. Opcional: Configure o Firebase Hosting marcando a opção "Também configurar o Firebase Hosting para este app"
4. Clique em "Registrar app"
5. Anote as configurações do Firebase (você precisará delas se usar outros recursos do Firebase)
6. Clique em "Continuar no console"

### 3. Configure o Firebase Hosting via CLI

Assumindo que você já tenha o Firebase CLI instalado e esteja no diretório `frontend` do projeto:

```bash
# Faça login na sua conta Google
firebase login

# Inicialize o Firebase no projeto (serão criados arquivos de configuração)
firebase init
```

Durante a inicialização:
1. Selecione "Hosting: Configure files for Firebase Hosting..."
2. Selecione seu projeto Firebase
3. Especifique o diretório de build: `dist/frontend/browser`
4. Configure como um SPA (aplicação de página única): Responda "Y" para "Configure as a single-page app"?
5. Não sobrescreva o arquivo `index.html`: Responda "N" para "File dist/frontend/browser/index.html already exists. Overwrite?"

### 4. Atualize as configurações de Hosting (opcional)

Edite o arquivo `firebase.json` para otimizar a entrega de assets e configurar rotas:

```json
{
  "hosting": {
    "public": "dist/frontend/browser",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "**/*.@(js|css)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=31536000"
          }
        ]
      }
    ]
  }
}
```

### 5. Atualize a configuração OAuth

Importante: Após o deploy, atualize o callback URL no portal do Keystle para incluir seu domínio do Firebase:

```
https://seu-projeto-firebase.web.app/callback
```

Além disso, atualize o `redirectUri` no arquivo `src/app/auth.ts` para usar uma lógica dinâmica que funcione tanto em desenvolvimento quanto em produção:

```typescript
redirectUri: window.location.origin + '/callback',
```

### 6. Deploy da aplicação

```bash
# Construa a aplicação Angular otimizada para produção
ng build --configuration production

# Faça o deploy para o Firebase Hosting
firebase deploy
```

Após a conclusão, você receberá URLs para acessar sua aplicação, como:
- `https://seu-projeto-firebase.web.app`

### 7. Configuração para produção

Para ambientes de produção, certifique-se de ajustar as configurações de segurança no arquivo `auth.ts`:

```typescript
const oauthConfig: AuthConfig = {
  // ... outras configurações ...
  requireHttps: true,
  showDebugInformation: false,
};
```

## Uso de Cloud Functions (opcional)

Se você precisar implementar lógica de backend para sua aplicação:

1. Adicione Cloud Functions durante a inicialização do Firebase:
   ```bash
   firebase init functions
   ```

2. Escolha JavaScript ou TypeScript
3. Desenvolva suas funções em `functions/index.js` ou `functions/src/index.ts`
4. Faça o deploy das functions:
   ```bash
   firebase deploy --only functions
   ```

## Solução de problemas comuns

### CORS em Cloud Functions

Se estiver usando Cloud Functions e enfrentar problemas de CORS:

```javascript
const cors = require('cors')({origin: true});

exports.yourFunction = functions.https.onRequest((req, res) => {
  return cors(req, res, () => {
    // Lógica da sua função
  });
});
```

### Erro 404 nas rotas

Se suas rotas não estiverem funcionando após o deploy, verifique se a configuração de reescrita no `firebase.json` está correta.

### Problemas com tokens OAuth

Se encontrar erros relacionados a tokens, verifique:
1. O client ID está correto
2. As URLs de redirecionamento estão configuradas corretamente no portal do Keystle
3. Os escopos solicitados estão autorizados

### Limites do plano gratuito

O plano gratuito do Firebase tem algumas limitações:
- 10GB de transferência/mês para Hosting
- 125.000 invocações de Cloud Functions/mês
- Sem domínios personalizados no plano gratuito

Para produção, considere fazer upgrade para o plano Blaze (pay-as-you-go).
