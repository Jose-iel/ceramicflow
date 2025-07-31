/// <reference types="cypress" />
import { BasePage } from './BasePage';

export class DashboardPage extends BasePage {
  private readonly selectors = {
    pageContent: 'dashboard-page-content',
    totalRevenue: 'total-revenue-dashboard-card',
    totalSales: 'total-sales-dashboard-card',
    completedOperations: 'completed-operations-dashboard-card',
    totalEmployees: 'total-employees-dashboard-card',
    totalWoodConsumed: 'total-wood-consumed-dashboard-card',
    totalTrucks: 'total-trucks-dashboard-card',
    vehiclesInMaintenance: 'vehicles-in-maintenance-dashboard-card',
    vacationsExpiring: 'vacations-expiring-dashboard-card',
  } as const;

  visit(): void {
    cy.visit('/dashboard');
    this.isLoaded();
  }

  isLoaded(): void {
    this.getByTestId(this.selectors.pageContent).should('be.visible');
    this.getByTestId(this.selectors.totalRevenue).should('be.visible');
    this.getByTestId(this.selectors.totalSales).should('be.visible');
    this.getByTestId(this.selectors.completedOperations).should('be.visible');
    this.getByTestId(this.selectors.totalEmployees).should('be.visible');
    this.getByTestId(this.selectors.totalWoodConsumed).should('be.visible');
    this.getByTestId(this.selectors.totalTrucks).should('be.visible');
    this.getByTestId(this.selectors.vehiclesInMaintenance).should('be.visible');
    this.getByTestId(this.selectors.vacationsExpiring).should('be.visible');
  }

  verifyTotalRevenue(value: string): void {
    this.getByTestId(this.selectors.totalRevenue).contains(value);
  }

  verifyTotalSales(value: string): void {
    this.getByTestId(this.selectors.totalSales).contains(value);
  }

  verifyCompletedOperations(value: string): void {
    this.getByTestId(this.selectors.completedOperations).contains(value);
  }

  verifyTotalEmployees(value: string): void {
    this.getByTestId(this.selectors.totalEmployees).contains(value);
  }

  verifyTotalWoodConsumed(value: string): void {
    this.getByTestId(this.selectors.totalWoodConsumed).contains(value);
  }

  verifyTotalTrucks(value: string): void {
    this.getByTestId(this.selectors.totalTrucks).contains(value);
  }

  verifyVehiclesInMaintenance(value: string): void {
    this.getByTestId(this.selectors.vehiclesInMaintenance).contains(value);
  }

  verifyVacationsExpiring(value: string): void {
    this.getByTestId(this.selectors.vacationsExpiring).contains(value);
  }
}
