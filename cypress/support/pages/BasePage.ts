// ✅ OBRIGATÓRIO - cypress/support/pages/BasePage.ts
export abstract class BasePage {
  protected readonly baseUrl = Cypress.config('baseUrl');

  // ✅ OBRIGATÓRIO - Todos os seletores via data-testid
  protected getByTestId(testId: string): Cypress.Chainable {
    return cy.get(`[data-testid="${testId}"]`);
  }

  // ✅ OBRIGATÓRIO - Loading states
  protected waitForPageLoad(): void {
    cy.get('[data-testid="page-loading"]').should('not.exist');
    cy.get('[data-testid="page-content"]').should('be.visible');
  }

  // ✅ OBRIGATÓRIO - Error handling
  protected checkForErrors(): void {
    cy.get('[data-testid="error-message"]').should('not.exist');
  }

  // ✅ OBRIGATÓRIO - Toast notifications
  protected checkSuccessToast(message: string): void {
    cy.get('[data-testid="toast-success"]').should('be.visible').and('contain.text', message);
  }

  protected checkErrorToast(message: string): void {
    cy.get('[data-testid="toast-error"]').should('be.visible').and('contain.text', message);
  }

  // ✅ OBRIGATÓRIO - Navigation
  abstract visit(): void;
  abstract isLoaded(): void;
}
