// Vehicle Types (previously Forklift)
export enum VehicleType {
  CAR = 'Carro',
  TRUCK = 'Caminhão',
  LOADER = 'Pá Carregadeira',
  BACKHOE = 'Retro Escavadeira',
  EXCAVATOR = 'Escavadeira Hidraulica',
  TRACTOR = 'Trator',
  FORKLIFT = 'Empilhadeira',
}

export enum VehicleStatus {
  OPERATIONAL = 'Em Operação',
  STOPPED = 'Parada',
  MAINTENANCE = 'Aguardando Manutenção',
}

export interface Vehicle {
  id: string;
  model: string;
  type: VehicleType;
  acquisitionDate: string;
  lastMaintenance: string;
  status: VehicleStatus;
  hourMeter: number;
  capacity?: string; // Optional for backwards compatibility
}

// Employee Types (previously User/Operator)
export enum EmployeeRole {
  FORNEIRO = 'Forneiro',
  LANCEADOR = 'Lanceador',
  MOTORISTA = 'Motorista',
  OPERADOR_MAQUINAS = 'Operador de Máquinas',
  SUPERVISOR = 'Supervisor',
  GERENTE = 'Gerente',
  AJUDANTE = 'Ajudante',
}

export enum CertificateStatus {
  REGULAR = 'Regular',
  WARNING = 'Próximo do Vencimento',
  EXPIRED = 'Vencido',
}

export interface Employee {
  id: string;
  name: string;
  role: EmployeeRole;
  cpf: string;
  contact: string;
  shift: string;
  admission_date: string;
  vacation_due_date: string;
}

// Operation Status enum
export enum OperationStatus {
  IN_PROGRESS = 'Em Andamento',
  COMPLETED = 'Concluída',
  PAUSED = 'Pausada',
}

// Operation Types - Updated to match the code usage
export interface Operation {
  id: string;
  type: string; // Type of operation (e.g., "Coleta de Barro", "Transporte de Lenha")
  location: string; // Where the operation is taking place
  operator: string; // Name of the operator
  startDate: string; // Start date
  endDate?: string | null; // End date (optional)
  status: OperationStatus;
  employeeId?: string; // Optional for backwards compatibility
  employeeName?: string; // Optional for backwards compatibility
  vehicleId?: string; // Optional for operations that don't involve vehicles
  vehicleModel?: string; // Optional for operations that don't involve vehicles
  operationType?: 'vehicle' | 'manual'; // Type of operation
  description?: string; // Description of what's being done
  initialHourMeter?: number; // Optional for vehicle operations
  currentHourMeter?: number; // Optional for vehicle operations
  startTime?: string; // Alternative to startDate
  endTime?: string; // Alternative to endDate
  gasConsumption?: number; // Optional for gas consumption tracking
}

// Maintenance Types
export enum MaintenanceStatus {
  WAITING = 'WAITING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

export interface Maintenance {
  id: string;
  vehicleId: string;
  vehicleModel: string;
  issue: string;
  reportedBy: string;
  reportedDate: string;
  status: MaintenanceStatus;
  completedDate?: string;
}

// Wood Management Types - Updated to match code usage
export interface WoodConsumption {
  id: string;
  date: string;
  quantity: number; // em m³
  sector?: string; // Optional for backwards compatibility
  recordedBy?: string; // Optional for backwards compatibility
  notes?: string;
  oven: string; // Forno used
  responsible: string; // Person responsible
  observations?: string; // Observations
}

export interface WoodPurchase {
  id: string;
  date: string;
  supplier: string;
  quantity: number; // em m³
  unitPrice: number; // valor por m³
  totalValue: number;
  invoiceNumber?: string;
  notes?: string;
}

// Raw Material Types
export interface ClayConsumption {
  id: string;
  date: string;
  trucksQuantity: number;
  supplier?: string;
  origin?: string;
  truckId?: string;
  recordedBy: string;
  notes?: string;
}

// Dashboard Types
export interface DashboardStats {
  totalVehicles: number;
  operationalVehicles: number;
  stoppedVehicles: number;
  maintenanceVehicles: number;
  totalEmployees: number;
  employeesWithValidCertificates: number;
  employeesWithWarningCertificates: number;
  employeesWithExpiredCertificates: number;
  activeOperations: number;
  pendingMaintenances: number;
  monthlyWoodConsumption: number; // m³
  monthlyClayConsumption: number; // trucks
}

// Common Component Props
export interface StatusCardProps {
  title: string;
  value: number;
  icon: React.ElementType;
  status?: 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  change?: {
    value: number;
    trend: 'up' | 'down' | 'neutral';
  };
}

// Wood Management Types
export interface WoodPurchaseRawData {
  id: string;
  ceramic_id: string;
  date: string;
  supplier: string;
  quantity: number;
  unit_price: number;
  total_value: number;
  invoice_number?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface WoodPurchaseDbData {
  ceramic_id: string;
  date: string;
  supplier: string;
  quantity: number;
  unit_price: number;
  total_value: number;
  invoice_number?: string;
  notes?: string;
}

export interface WoodConsumptionRawData {
  id: string;
  ceramic_id: string;
  date: string;
  quantity: number;
  oven?: string;
  responsible?: string;
  observations?: string;
  created_at: string;
  updated_at: string;
}

export interface WoodConsumptionDbData {
  ceramic_id: string;
  date: string;
  quantity: number;
  oven?: string;
  responsible?: string;
  observations?: string;
}

// Clay Consumption Types - Data from database (snake_case)
export interface ClayConsumptionRawData {
  id: string;
  ceramic_id: string;
  date: string;
  trucks_quantity: number;
  supplier?: string;
  origin?: string;
  truck_id?: string;
  recorded_by: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

// Clay Consumption Types - Data for database operations (snake_case)
export interface ClayConsumptionDbData {
  ceramic_id: string;
  date: string;
  trucks_quantity: number;
  supplier?: string;
  origin?: string;
  truck_id?: string;
  recorded_by: string;
  notes?: string;
}

// Clay Consumption Types - Internal usage (camelCase)
export interface ClayConsumptionData {
  id?: string;
  date: string;
  trucksQuantity: number;
  supplier?: string;
  origin?: string;
  truckId?: string;
  recordedBy: string;
  notes?: string;
}
