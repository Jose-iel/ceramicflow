/// <reference types="cypress" />
import dayjs from 'dayjs';
import { BasePage } from './BasePage';

export class VehiclePage extends BasePage {
  private readonly selectors = {
    pageContent: 'vehicles-page-content',
    filters: 'vehicles-filters',
    typeFilter: 'vehicles-type-filter',
    statusFilter: 'vehicles-status-filter',
    grid: 'vehicles-grid',
    addButton: 'vehicles-add-button',
    emptyState: 'vehicles-empty-state',
  } as const;

  visit(): void {
    cy.visit('/vehicles');
    this.isLoaded();
  }

  isLoaded(): void {
    this.getByTestId(this.selectors.pageContent).should('be.visible');
    this.getByTestId(this.selectors.filters).should('be.visible');
    this.getByTestId(this.selectors.typeFilter).should('be.visible');
    this.getByTestId(this.selectors.statusFilter).should('be.visible');
    this.getByTestId(this.selectors.addButton).should('be.visible');
  }

  fillVehicleForm(data: { model: string; type: string; capacity?: string; status: string; hourMeter?: string | number }): void {
    const today = dayjs().format('YYYY-MM-DD');

    cy.get('[data-testid="vehicle-model-input"]').clear().type(data.model);
    cy.get('[data-testid="vehicle-type-select"]').click();
    cy.contains('[role="option"]', data.type).click();
    if (data.capacity) {
      cy.get('[data-testid="vehicle-capacity-input"]').clear().type(data.capacity);
    }
    cy.get('[data-testid="vehicle-status-select"]').click();
    cy.contains('[role="option"]', data.status).click();

    cy.get('[data-testid="vehicle-acquisition-date-input"]').clear().type(today);

    cy.get('[data-testid="vehicle-last-maintenance-input"]').clear().type(today);

    if (data.hourMeter !== undefined) {
      cy.get('[data-testid="vehicle-hour-meter-input"]').clear().type(String(data.hourMeter));
    }
  }

  clickAddButon(): void {
    this.getByTestId(this.selectors.addButton).click();
  }

  submitVehicleForm(): void {
    cy.get('[data-testid="vehicle-submit-button"]').parents('button[type="submit"]').click();
  }

  getVehicleCard(id: string): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.getByTestId(`vehicle-card-${id}`);
  }

  clickEditButton(): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.getByTestId(`vehicle-edit-button`).click();
  }

  clickDeleteButton(): Cypress.Chainable<JQuery<HTMLElement>> {
    this.getByTestId('vehicle-delete-button').click();
    this.getByTestId('delete-confirmation-dialog-title').contains('Confirmar exclusão');
    return this.getByTestId('delete-confirmation-dialog').click();
  }

  getEmptyState(): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.getByTestId(this.selectors.emptyState);
  }

  getMessageReturned(message: string): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('[data-testid="toast-message"]').contains(message);
  }

  verifyVehicleCard(testid: string, expectedtotal: string): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get(`[data-testid="${testid}"]`).contains(expectedtotal);
  }
}
