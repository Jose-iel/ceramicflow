import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  private readonly selectors = {
    pageContent: 'login-container',
    emailInput: 'email-input',
    passwordInput: 'password-input',
    submitButton: 'submit-button',
    togglePasswordButton: 'toggle-password-button',
    errorMessage: 'error-message',
    loginForm: 'login-form',
  } as const;

  visit(): void {
    cy.visit('/login');
    this.isLoaded();
  }

  isLoaded(): void {
    // ✅ Simplified loading check - page specific elements
    this.getByTestId(this.selectors.loginForm).should('be.visible');
    this.getByTestId(this.selectors.emailInput).should('be.visible');
    this.getByTestId(this.selectors.submitButton).should('be.visible');
  }

  fillCredentials(email: string, password: string): void {
    // ✅ OBRIGATÓRIO - Use getByTestId da BasePage
    this.getByTestId(this.selectors.emailInput).clear().type(email);
    this.getByTestId(this.selectors.passwordInput).clear().type(password);
  }

  submitLogin(): void {
    // ✅ OBRIGATÓRIO - Use getByTestId da BasePage
    this.getByTestId(this.selectors.submitButton).click();
  }

  togglePasswordVisibility(): void {
    // ✅ OBRIGATÓRIO - Use getByTestId da BasePage
    this.getByTestId(this.selectors.togglePasswordButton).click();
  }

  checkErrorMessage(): void {
    // ✅ Toast real do sistema - procura pelo texto do título
    cy.contains('Erro no login').should('be.visible');
  }

  checkSuccessfulLogin(): void {
    // ✅ Toast real do sistema - procura pelo texto do título
    cy.contains('Login realizado com sucesso!').should('be.visible');

    // ✅ Aguardar redirecionamento ou saída da página de login
    cy.url().should('not.include', '/login');
  }
}
