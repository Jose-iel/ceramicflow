import { LoginPage } from '../../support/pages';

describe('Página de Login', () => {
  let loginPage: LoginPage;

  beforeEach(() => {
    loginPage = new LoginPage();
  });

  describe('Login Form Rendering', () => {
    it('deve renderizar os campos de login e o botão', () => {
      loginPage.visit();

      cy.get('[data-testid="email-input"]').should('be.visible');
      cy.get('[data-testid="password-input"]').should('be.visible');
      cy.get('[data-testid="submit-button"]').should('be.visible').and('contain.text', 'Entrar');
    });
  });

  describe('Login Validation', () => {
    it('deve exibir uma mensagem de erro com credenciais inválidas', () => {
      const invalidCredentials = {
        email: 'usuario@invalido.com',
        password: 'senhaerrada',
      };

      loginPage.visit();
      loginPage.fillCredentials(invalidCredentials.email, invalidCredentials.password);
      loginPage.submitLogin();

      loginPage.checkErrorMessage();
    });

    it('deve mostrar a senha ao clicar no botão Mostrar Senha', () => {
      const testPassword = 'senhaerrada';

      loginPage.visit();
      cy.get('[data-testid="password-input"]').type(testPassword);
      loginPage.togglePasswordVisibility();

      cy.get('[data-testid="password-input"]').should('have.attr', 'type', 'text');
    });
  });

  describe('Login Success', () => {
    it('deve fazer login com sucesso com credenciais válidas', () => {
      const adminEmail = Cypress.env('TEST_ADMIN_USER_EMAIL');
      const adminPassword = Cypress.env('TEST_ADMIN_USER_PASSWORD');

      loginPage.visit();
      loginPage.fillCredentials(adminEmail, adminPassword);
      loginPage.submitLogin();

      loginPage.checkSuccessfulLogin();
    });
  });
});
