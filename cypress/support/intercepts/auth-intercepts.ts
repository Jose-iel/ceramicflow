// ✅ OBRIGATÓRIO - cypress/support/intercepts/auth-intercepts.ts
export class AuthIntercepts {
  static setupAuthIntercepts(): void {
    // ✅ INTERCEPT CONDICIONAL - Supabase login endpoint
    cy.intercept('POST', '**/auth/v1/token?grant_type=password', req => {
      const { email, password } = req.body;

      // ✅ Credenciais válidas do .env
      const validEmail = Cypress.env('TEST_ADMIN_USER_EMAIL');
      const validPassword = Cypress.env('TEST_ADMIN_USER_PASSWORD');

      if (email === validEmail && password === validPassword) {
        // ✅ LOGIN VÁLIDO - Retorna sucesso
        req.reply({
          statusCode: 200,
          fixture: 'auth/login-response.json',
        });
      } else {
        // ✅ LOGIN INVÁLIDO - Retorna erro
        req.reply({
          statusCode: 400,
          body: {
            error: 'invalid_grant',
            error_description: 'Invalid login credentials',
          },
        });
      }
    }).as('login');

    // ✅ INTERCEPT - Supabase session check (só para login válido)
    cy.intercept('GET', '**/auth/v1/user', {
      statusCode: 200,
      fixture: 'auth/user-profile.json',
    }).as('getUserProfile');

    // ✅ INTERCEPT - Session refresh ou validação
    cy.intercept('POST', '**/auth/v1/token?grant_type=refresh_token', {
      statusCode: 200,
      fixture: 'auth/login-response.json',
    }).as('refreshToken');

    // ✅ INTERCEPT - Profile endpoint
    cy.intercept('GET', '**/rest/v1/profiles*', {
      statusCode: 200,
      fixture: 'auth/profile.json',
    }).as('getProfile');

    // ✅ INTERCEPT - Logout endpoint
    cy.intercept('POST', '**/auth/v1/logout', {
      statusCode: 204,
    }).as('logout');
  }
}

// ✅ OBRIGATÓRIO - Comandos específicos para auth
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      setupAuthIntercepts(): Chainable<void>;
      setupApiIntercepts(): Chainable<void>;
    }
  }
}

// Comando específico APENAS para auth (login)
Cypress.Commands.add('setupAuthIntercepts', () => {
  AuthIntercepts.setupAuthIntercepts();
});

// Comando geral (para outros testes que precisam de tudo)
Cypress.Commands.add('setupApiIntercepts', () => {
  // Setup auth intercepts
  AuthIntercepts.setupAuthIntercepts();

  // Setup all other API intercepts quando necessário
  // TODO: implementar import dinâmico quando outros módulos precisarem
});
