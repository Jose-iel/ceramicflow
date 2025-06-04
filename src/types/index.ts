
// Vehicle Types (previously Forklift)
export enum VehicleType {
  GAS = "Gás",
  ELECTRIC = "Elétrica", 
  RETRACTABLE = "Retrátil",
  TRUCK = "Caminhão",
  TRACTOR = "Trator"
}

export enum VehicleStatus {
  OPERATIONAL = "Em Operação",
  STOPPED = "Parada",
  MAINTENANCE = "Aguardando Manutenção"
}

export interface Vehicle {
  id: string;
  model: string;
  type: VehicleType;
  acquisitionDate: string;
  lastMaintenance: string;
  status: VehicleStatus;
  hourMeter: number;
}

// Employee Types (previously User/Operator)
export enum EmployeeRole {
  FORNEIRO = "Forneiro",
  MOTORISTA = "Motorista", 
  OPERADOR_MAQUINAS = "Operador de Máquinas",
  ADMINISTRATIVO = "Administrativo",
  SUPERVISOR = "Supervisor",
  ADMIN = "Administrador"
}

export enum CertificateStatus {
  REGULAR = "Regular",
  WARNING = "Próximo do Vencimento",
  EXPIRED = "Vencido"
}

export interface Employee {
  id: string;
  name: string;
  role: EmployeeRole;
  cpf: string;
  contact: string;
  shift: string;
  registrationDate: string;
  asoExpirationDate: string;
  nrExpirationDate: string;
  asoStatus: CertificateStatus;
  nrStatus: CertificateStatus;
}

// Operation Types
export interface Operation {
  id: string;
  employeeId: string;
  employeeName: string;
  vehicleId: string;
  vehicleModel: string;
  sector: string;
  initialHourMeter: number;
  currentHourMeter?: number;
  startTime: string;
  endTime?: string;
  status: "active" | "completed";
}

// Maintenance Types
export enum MaintenanceStatus {
  WAITING = "Aguardando",
  IN_PROGRESS = "Em andamento", 
  COMPLETED = "Concluído"
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

// Wood Management Types
export interface WoodConsumption {
  id: string;
  date: string;
  quantity: number; // em m³
  sector: string;
  recordedBy: string;
  notes?: string;
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
  status?: "success" | "warning" | "danger" | "info" | "neutral";
  change?: {
    value: number;
    trend: "up" | "down" | "neutral";
  };
}

// Legacy compatibility exports
export type Forklift = Vehicle;
export type User = Employee;
export const ForkliftType = VehicleType;
export const ForkliftStatus = VehicleStatus;
export const UserRole = EmployeeRole;
