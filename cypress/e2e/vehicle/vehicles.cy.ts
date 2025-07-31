import { VehiclePage, DashboardPage } from '../../support/pages';

describe('Página de Veículos', () => {
  let vehiclePage: VehiclePage;
  let dashboardPage: DashboardPage;

  before(() => {
    vehiclePage = new VehiclePage();
    dashboardPage = new DashboardPage();
    cy.login();
  });

  beforeEach(() => {
    cy.visit('/vehicles', {
      onBeforeLoad(win) {
        win.localStorage.setItem(Cypress.env('authKey'), Cypress.env('authToken'));
      },
    });
  });

  describe('Vehicle Page', () => {
    it('deve verificar se o texto de nenhum veículo encontrado aparece corretamente', () => {
      vehiclePage.getEmptyState().contains('Nenhum veículo encontrado');
    });

    it('deve criar um novo veiculo com sucesso', () => {
      vehiclePage.clickAddButon();
      vehiclePage.fillVehicleForm({
        model: 'Volvo',
        type: 'Caminhão',
        capacity: '100',
        status: 'Em Operação',
        hourMeter: '100',
      });
      vehiclePage.submitVehicleForm();
      vehiclePage.getMessageReturned('Veículo adicionado com sucesso.').should('be.visible');
    });

    it('deve verificar se o card de total de veiculos foi atualizado', () => {
      vehiclePage.verifyVehicleCard('vehicles-total-count', '1');
    });

    it('deve verificar se o card de veículo em operação foi atualizado', () => {
      vehiclePage.verifyVehicleCard('vehicles-active-count', '1');
    });

    it('deve editar um veículo para o status em manutenção', () => {
      vehiclePage.clickEditButton();
      vehiclePage.fillVehicleForm({
        model: 'Volvo',
        type: 'Caminhão',
        capacity: '20',
        status: 'Aguardando Manutenção',
        hourMeter: '10',
      });
      vehiclePage.submitVehicleForm();
      vehiclePage.getMessageReturned('Dados do veículo atualizados com sucesso.').should('be.visible');
    });

    it('deve verificar se o card de veículo em manutenção foi atualizado', () => {
      vehiclePage.verifyVehicleCard('vehicles-maintenance-count', '1');
    });

    it('deve verificar se o card de veículo em manutenção foi atualizado no dashboard', () => {
      dashboardPage.visit();
      dashboardPage.verifyVehiclesInMaintenance('1');
    });

    it('deve editar um veiculo para o status parado', () => {
      vehiclePage.clickEditButton();
      vehiclePage.fillVehicleForm({
        model: 'Volvo',
        type: 'Caminhão',
        capacity: '20',
        status: 'Parada',
        hourMeter: '10',
      });
      vehiclePage.submitVehicleForm();
      vehiclePage.getMessageReturned('Dados do veículo atualizados com sucesso.').should('be.visible');
    });

    it('deve verificar se o card de veículo parado foi atualizado', () => {
      vehiclePage.verifyVehicleCard('vehicles-stopped-count', '1');
    });

    it('deve excluir o veículo', () => {
      vehiclePage.clickDeleteButton();
      vehiclePage.getMessageReturned('Veículo excluído').should('be.visible');
    });
  });
});
