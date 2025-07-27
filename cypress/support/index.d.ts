/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    // Auth Commands - template constitucional
    login(email?: string, password?: string): Chainable<void>;
    loginAs(userType: 'admin' | 'manager' | 'operator'): Chainable<void>;
    logout(): Chainable<void>;
    checkAuthState(expected: 'authenticated' | 'unauthenticated'): Chainable<void>;
  }
}
