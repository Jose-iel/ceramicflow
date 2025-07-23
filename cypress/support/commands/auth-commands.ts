/// <reference types="cypress" />

// ✅ OBRIGATÓRIO - Template constitucional Artigo III
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      login(email?: string, password?: string): Chainable<void>;
      loginAs(userType: 'admin' | 'manager' | 'operator'): Chainable<void>;
      logout(): Chainable<void>;
      checkAuthState(expected: 'authenticated' | 'unauthenticated'): Chainable<void>;
    }
  }
}

Cypress.Commands.add('login', (email?: string, password?: string) => {
  const credentials = {
    email: email || Cypress.env('TEST_ADMIN_USER_EMAIL'),
    password: password || Cypress.env('TEST_ADMIN_USER_PASSWORD'),
  };

  cy.visit('/login');
  cy.get('[data-testid="email-input"]').type(credentials.email);
  cy.get('[data-testid="password-input"]').type(credentials.password);
  cy.get('[data-testid="submit-button"]').click();

  cy.wait('@login');
  cy.url().should('not.include', '/login');
  cy.get('[data-testid="toast-success"]').should('be.visible');
});

Cypress.Commands.add('loginAs', (userType: 'admin' | 'manager' | 'operator') => {
  // ✅ OBRIGATÓRIO - Use fixtures for different user types
  cy.fixture(`users/${userType}.json`).then(user => {
    const email = Cypress.env(user.email);
    const password = Cypress.env(user.password);
    cy.login(email, password);
  });
});

Cypress.Commands.add('logout', () => {
  cy.intercept('POST', '**/auth/v1/logout', { statusCode: 204 }).as('logout');

  cy.get('[data-testid="user-menu"]').click();
  cy.get('[data-testid="logout-button"]').click();

  cy.wait('@logout');
  cy.url().should('include', '/login');
});

Cypress.Commands.add('checkAuthState', (expected: 'authenticated' | 'unauthenticated') => {
  if (expected === 'authenticated') {
    cy.get('[data-testid="user-menu"]').should('be.visible');
    cy.url().should('not.include', '/login');
  } else {
    cy.url().should('include', '/login');
    cy.get('[data-testid="login-form"]').should('be.visible');
  }
});

export {};
