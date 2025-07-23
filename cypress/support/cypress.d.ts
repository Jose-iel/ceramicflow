/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    login(email?: string, password?: string): Chainable<Element>;
    loginAs(userType: 'admin' | 'manager' | 'operator'): Chainable<Element>;
    logout(): Chainable<Element>;
    checkAuthState(expected: 'authenticated' | 'unauthenticated'): Chainable<Element>;
  }
}
