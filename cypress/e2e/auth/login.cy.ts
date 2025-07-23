import { LoginPage } from '../../support/pages/LoginPage';

describe('Página de Login', () => {
  let loginPage: LoginPage;

  beforeEach(() => {
    // ✅ OBRIGATÓRIO - Setup APENAS auth intercepts para login
    cy.setupAuthIntercepts();

    // ✅ OBRIGATÓRIO - Page object instance
    loginPage = new LoginPage();
  });

  afterEach(() => {
    // ✅ OBRIGATÓRIO - Cleanup
    // No logout needed for login page tests
  });

  describe('Login Form Rendering', () => {
    it('deve renderizar os campos de login e o botão', () => {
      // ✅ OBRIGATÓRIO - Arrange
      // Form should be visible

      // ✅ OBRIGATÓRIO - Act
      loginPage.visit();

      // ✅ OBRIGATÓRIO - Assert
      cy.get('[data-testid="email-input"]').should('be.visible');
      cy.get('[data-testid="password-input"]').should('be.visible');
      cy.get('[data-testid="submit-button"]').should('be.visible').and('contain.text', 'Entrar');
    });
  });

  describe('Login Validation', () => {
    it('deve exibir uma mensagem de erro com credenciais inválidas', () => {
      // ✅ OBRIGATÓRIO - Arrange
      const invalidCredentials = {
        email: 'usuario@invalido.com',
        password: 'senhaerrada',
      };

      // ✅ OBRIGATÓRIO - Act
      loginPage.visit();
      loginPage.fillCredentials(invalidCredentials.email, invalidCredentials.password);
      loginPage.submitLogin();

      // ✅ OBRIGATÓRIO - Assert
      cy.wait('@login'); // Aguardar o intercept processar a requisição
      loginPage.checkErrorMessage();
    });

    it('deve mostrar a senha ao clicar no botão Mostrar Senha', () => {
      // ✅ OBRIGATÓRIO - Arrange
      const testPassword = 'senhaerrada';

      // ✅ OBRIGATÓRIO - Act
      loginPage.visit();
      cy.get('[data-testid="password-input"]').type(testPassword);
      loginPage.togglePasswordVisibility();

      // ✅ OBRIGATÓRIO - Assert
      cy.get('[data-testid="password-input"]').should('have.attr', 'type', 'text');
    });
  });

  describe('Login Success', () => {
    it('deve fazer login com sucesso com credenciais válidas', () => {
      // ✅ OBRIGATÓRIO - Arrange
      const adminEmail = Cypress.env('TEST_ADMIN_USER_EMAIL');
      const adminPassword = Cypress.env('TEST_ADMIN_USER_PASSWORD');

      // ✅ OBRIGATÓRIO - Act
      loginPage.visit();
      loginPage.fillCredentials(adminEmail, adminPassword);
      loginPage.submitLogin();

      // ✅ OBRIGATÓRIO - Assert
      cy.wait('@login');
      loginPage.checkSuccessfulLogin();
    });
  });
});
