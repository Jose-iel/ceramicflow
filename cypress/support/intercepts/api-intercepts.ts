// ✅ OBRIGATÓRIO - cypress/support/intercepts/api-intercepts.ts
export class ApiIntercepts {
  // ✅ OBRIGATÓRIO - Centralized intercept setup
  static setupEmployeesIntercepts(): void {
    cy.intercept('GET', '**/employees**', { fixture: 'employees/list.json' }).as('getEmployees');
    cy.intercept('POST', '**/employees**', { fixture: 'employees/created.json' }).as('createEmployee');
    cy.intercept('PUT', '**/employees/**', { fixture: 'employees/updated.json' }).as('updateEmployee');
    cy.intercept('DELETE', '**/employees/**', { statusCode: 204 }).as('deleteEmployee');
    cy.intercept('GET', '**/employees?search=**', { fixture: 'employees/search-results.json' }).as('searchEmployees');
  }

  static setupDashboardIntercepts(): void {
    cy.intercept('GET', '**/dashboard/overview**', { fixture: 'dashboard/overview.json' }).as('getDashboardOverview');
    cy.intercept('GET', '**/dashboard/stats**', { fixture: 'dashboard/stats.json' }).as('getDashboardStats');
  }

  static setupSalesIntercepts(): void {
    cy.intercept('GET', '**/sales**', { fixture: 'sales/list.json' }).as('getSales');
    cy.intercept('POST', '**/sales**', { fixture: 'sales/created.json' }).as('createSale');
    cy.intercept('PUT', '**/sales/**', { fixture: 'sales/updated.json' }).as('updateSale');
    cy.intercept('DELETE', '**/sales/**', { statusCode: 204 }).as('deleteSale');
  }

  static setupVehiclesIntercepts(): void {
    cy.intercept('GET', '**/vehicles**', { fixture: 'vehicles/list.json' }).as('getVehicles');
    cy.intercept('POST', '**/vehicles**', { fixture: 'vehicles/created.json' }).as('createVehicle');
    cy.intercept('PUT', '**/vehicles/**', { fixture: 'vehicles/updated.json' }).as('updateVehicle');
    cy.intercept('DELETE', '**/vehicles/**', { statusCode: 204 }).as('deleteVehicle');
  }

  static setupOperationsIntercepts(): void {
    cy.intercept('GET', '**/operations**', { fixture: 'operations/list.json' }).as('getOperations');
    cy.intercept('POST', '**/operations**', { fixture: 'operations/created.json' }).as('createOperation');
    cy.intercept('PUT', '**/operations/**', { fixture: 'operations/updated.json' }).as('updateOperation');
    cy.intercept('DELETE', '**/operations/**', { statusCode: 204 }).as('deleteOperation');
  }

  static setupMaintenanceIntercepts(): void {
    cy.intercept('GET', '**/maintenances**', { fixture: 'maintenances/list.json' }).as('getMaintenances');
    cy.intercept('POST', '**/maintenances**', { fixture: 'maintenances/created.json' }).as('createMaintenance');
    cy.intercept('PUT', '**/maintenances/**', { fixture: 'maintenances/updated.json' }).as('updateMaintenance');
    cy.intercept('DELETE', '**/maintenances/**', { statusCode: 204 }).as('deleteMaintenance');
  }

  static setupWoodIntercepts(): void {
    cy.intercept('GET', '**/wood**', { fixture: 'wood/list.json' }).as('getWood');
    cy.intercept('POST', '**/wood**', { fixture: 'wood/created.json' }).as('createWood');
    cy.intercept('PUT', '**/wood/**', { fixture: 'wood/updated.json' }).as('updateWood');
    cy.intercept('DELETE', '**/wood/**', { statusCode: 204 }).as('deleteWood');
  }

  static setupBackofficeIntercepts(): void {
    cy.intercept('GET', '**/backoffice**', { fixture: 'backoffice/overview.json' }).as('getBackoffice');
    cy.intercept('POST', '**/backoffice/**', { fixture: 'backoffice/action-result.json' }).as('backofficeAction');
  }

  static setupUserLevelsIntercepts(): void {
    cy.intercept('GET', '**/user_levels**', { fixture: 'user-levels/list.json' }).as('getUserLevels');
    cy.intercept('GET', '**/routes**', { fixture: 'user-levels/routes.json' }).as('getRoutes');
    cy.intercept('GET', '**/user_level_permissions**', { fixture: 'user-levels/permissions.json' }).as('getUserLevelPermissions');
    cy.intercept('POST', '**/user_levels**', { fixture: 'user-levels/created.json' }).as('createUserLevel');
    cy.intercept('PUT', '**/user_levels/**', { fixture: 'user-levels/updated.json' }).as('updateUserLevel');
    cy.intercept('DELETE', '**/user_levels/**', { statusCode: 204 }).as('deleteUserLevel');
  }

  static setupProfileIntercepts(): void {
    cy.intercept('GET', '**/profiles**', { fixture: 'profiles/user-profile.json' }).as('getProfile');
    cy.intercept('PUT', '**/profiles/**', { fixture: 'profiles/updated.json' }).as('updateProfile');
  }

  // ✅ OBRIGATÓRIO - Setup all intercepts
  static setupAllIntercepts(): void {
    this.setupEmployeesIntercepts();
    this.setupDashboardIntercepts();
    this.setupSalesIntercepts();
    this.setupVehiclesIntercepts();
    this.setupOperationsIntercepts();
    this.setupMaintenanceIntercepts();
    this.setupWoodIntercepts();
    this.setupBackofficeIntercepts();
    this.setupUserLevelsIntercepts();
    this.setupProfileIntercepts();
  }
}

// ✅ COMANDO ESPECÍFICO - Para testes que precisam de TODOS os intercepts de API
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      setupAllApiIntercepts(): Chainable<void>;
    }
  }
}

Cypress.Commands.add('setupAllApiIntercepts', () => {
  ApiIntercepts.setupAllIntercepts();
});
