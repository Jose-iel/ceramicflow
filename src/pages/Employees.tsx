
import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import { Button } from "@/components/ui/button";
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Badge } from "@/components/ui/badge";
import { Calendar, Filter, Plus, Search, User, AlertTriangle, CheckCircle } from 'lucide-react';
import { Employee, CertificateStatus, EmployeeRole } from '@/types';
import EmployeeDialog from '@/components/employees/EmployeeDialog';
import { useToast } from '@/hooks/use-toast';

// Mock data for employees
const initialEmployees: Employee[] = [
  {
    id: 'EMP001',
    name: 'Carlos Silva',
    role: EmployeeRole.FORNEIRO,
    cpf: '123.456.789-00',
    contact: '(11) 99999-1234',
    shift: 'Manhã',
    registrationDate: '15/01/2023',
    asoExpirationDate: '15/01/2024',
    nrExpirationDate: '20/12/2023',
    asoStatus: CertificateStatus.REGULAR,
    nrStatus: CertificateStatus.WARNING
  },
  {
    id: 'EMP002',
    name: 'Maria Oliveira',
    role: EmployeeRole.MOTORISTA,
    cpf: '987.654.321-00',
    contact: '(11) 88888-5678',
    shift: 'Tarde',
    registrationDate: '22/03/2023',
    asoExpirationDate: '22/03/2024',
    nrExpirationDate: '10/02/2024',
    asoStatus: CertificateStatus.REGULAR,
    nrStatus: CertificateStatus.REGULAR
  },
  {
    id: 'EMP003',
    name: 'João Santos',
    role: EmployeeRole.OPERADOR_MAQUINAS,
    cpf: '456.789.123-00',
    contact: '(11) 77777-9012',
    shift: 'Noite',
    registrationDate: '10/05/2023',
    asoExpirationDate: '05/11/2023',
    nrExpirationDate: '15/11/2023',
    asoStatus: CertificateStatus.EXPIRED,
    nrStatus: CertificateStatus.EXPIRED
  },
  {
    id: 'EMP004',
    name: 'Ana Costa',
    role: EmployeeRole.SUPERVISOR,
    cpf: '789.123.456-00',
    contact: '(11) 66666-3456',
    shift: 'Manhã',
    registrationDate: '08/07/2023',
    asoExpirationDate: '08/07/2024',
    nrExpirationDate: '20/01/2024',
    asoStatus: CertificateStatus.REGULAR,
    nrStatus: CertificateStatus.WARNING
  },
  {
    id: 'EMP005',
    name: 'Pedro Mendes',
    role: EmployeeRole.ADMINISTRATIVO,
    cpf: '321.654.987-00',
    contact: '(11) 55555-7890',
    shift: 'Manhã',
    registrationDate: '12/09/2023',
    asoExpirationDate: '12/09/2024',
    nrExpirationDate: '25/03/2024',
    asoStatus: CertificateStatus.REGULAR,
    nrStatus: CertificateStatus.REGULAR
  }
];

const EmployeesPage = () => {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [shiftFilter, setShiftFilter] = useState<string>('all');
  const [certificateFilter, setCertificateFilter] = useState<string>('all');
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);

  // Dialog states
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  
  // Filter employees based on search and filters
  const filteredEmployees = employees.filter(employee => {
    // Search filter
    const matchesSearch = employee.name.toLowerCase().includes(search.toLowerCase()) || 
                          employee.cpf.includes(search) ||
                          employee.id.toLowerCase().includes(search.toLowerCase());
    
    // Role filter
    const matchesRole = roleFilter === 'all' || employee.role === roleFilter;
    
    // Shift filter
    const matchesShift = shiftFilter === 'all' || employee.shift === shiftFilter;
    
    // Certificate filter
    let matchesCertificate = true;
    if (certificateFilter === 'expired') {
      matchesCertificate = employee.asoStatus === CertificateStatus.EXPIRED || employee.nrStatus === CertificateStatus.EXPIRED;
    } else if (certificateFilter === 'warning') {
      matchesCertificate = employee.asoStatus === CertificateStatus.WARNING || employee.nrStatus === CertificateStatus.WARNING;
    } else if (certificateFilter === 'regular') {
      matchesCertificate = employee.asoStatus === CertificateStatus.REGULAR && employee.nrStatus === CertificateStatus.REGULAR;
    }
    
    return matchesSearch && matchesRole && matchesShift && matchesCertificate;
  });

  // Format date
  const formatDate = (dateString: string) => {
    return dateString;
  };
  
  // Get unique roles and shifts for filters
  const roles = [...new Set(employees.map(emp => emp.role))];
  const shifts = [...new Set(employees.map(emp => emp.shift))];

  // Calculate stats
  const totalEmployees = employees.length;
  const employeesWithValidCertificates = employees.filter(emp => 
    emp.asoStatus === CertificateStatus.REGULAR && emp.nrStatus === CertificateStatus.REGULAR
  ).length;
  const employeesWithWarningCertificates = employees.filter(emp => 
    emp.asoStatus === CertificateStatus.WARNING || emp.nrStatus === CertificateStatus.WARNING
  ).length;
  const employeesWithExpiredCertificates = employees.filter(emp => 
    emp.asoStatus === CertificateStatus.EXPIRED || emp.nrStatus === CertificateStatus.EXPIRED
  ).length;

  // Get certificate status badge variant
  const getCertificateStatusVariant = (status: CertificateStatus) => {
    switch (status) {
      case CertificateStatus.REGULAR:
        return 'default';
      case CertificateStatus.WARNING:
        return 'secondary';
      case CertificateStatus.EXPIRED:
        return 'outline';
      default:
        return 'outline';
    }
  };

  // Handle add/edit employee
  const handleSaveEmployee = (employeeData: Employee) => {
    if (editDialogOpen) {
      // Update existing employee
      setEmployees(prev => 
        prev.map(e => e.id === employeeData.id ? employeeData : e)
      );
    } else {
      // Add new employee
      setEmployees(prev => [...prev, employeeData]);
    }
  };

  // Handle delete employee
  const handleDeleteEmployee = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este funcionário?")) {
      setEmployees(prev => prev.filter(e => e.id !== id));
      toast({
        title: "Funcionário excluído",
        description: "O funcionário foi excluído com sucesso."
      });
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <div className={cn(
        "flex-1 flex flex-col min-w-0",
        !isMobile && "ml-64"
      )}>
        <Navbar 
          title="Funcionários" 
          subtitle="Gerenciamento de Pessoal"
        />
        
        <main className="flex-1 px-3 md:px-6 py-4 md:py-6 overflow-x-hidden">
          {/* Stats cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
            <div className="bg-card border rounded-lg p-3 md:p-4 shadow">
              <h3 className="text-xs md:text-sm font-medium text-muted-foreground mb-2">Total de Funcionários</h3>
              <div className="flex items-center justify-between">
                <p className="text-lg md:text-2xl font-bold">{totalEmployees}</p>
                <div className="p-1.5 md:p-2 bg-primary/10 rounded-full">
                  <User className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                </div>
              </div>
            </div>
            
            <div className="bg-card border rounded-lg p-3 md:p-4 shadow">
              <h3 className="text-xs md:text-sm font-medium text-muted-foreground mb-2">Certificados Regulares</h3>
              <div className="flex items-center justify-between">
                <p className="text-lg md:text-2xl font-bold text-green-600">{employeesWithValidCertificates}</p>
                <div className="p-1.5 md:p-2 bg-green-100 rounded-full">
                  <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-green-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-card border rounded-lg p-3 md:p-4 shadow">
              <h3 className="text-xs md:text-sm font-medium text-muted-foreground mb-2">Próximos ao Vencimento</h3>
              <div className="flex items-center justify-between">
                <p className="text-lg md:text-2xl font-bold text-yellow-600">{employeesWithWarningCertificates}</p>
                <div className="p-1.5 md:p-2 bg-yellow-100 rounded-full">
                  <AlertTriangle className="w-4 h-4 md:w-5 md:h-5 text-yellow-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-card border rounded-lg p-3 md:p-4 shadow">
              <h3 className="text-xs md:text-sm font-medium text-muted-foreground mb-2">Certificados Vencidos</h3>
              <div className="flex items-center justify-between">
                <p className="text-lg md:text-2xl font-bold text-red-600">{employeesWithExpiredCertificates}</p>
                <div className="p-1.5 md:p-2 bg-red-100 rounded-full">
                  <AlertTriangle className="w-4 h-4 md:w-5 md:h-5 text-red-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Filter section */}
          <div className="flex flex-col gap-3 mb-4 md:mb-6">
            <div className="flex flex-col sm:flex-row gap-3 sm:justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input 
                  type="text" 
                  placeholder="Buscar funcionário..." 
                  className="pl-10"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex items-center gap-2 text-sm">
                  <Filter className="w-4 h-4" />
                  {isMobile ? 'Filtrar' : 'Filtrar'}
                </Button>
                <Button 
                  className="gap-2 text-sm"
                  onClick={() => {
                    setSelectedEmployee(null);
                    setAddDialogOpen(true);
                  }}
                >
                  <Plus className="w-4 h-4" />
                  {isMobile ? 'Novo' : 'Novo Funcionário'}
                </Button>
              </div>
            </div>
            
            {/* Filter options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <div className="space-y-1">
                <h4 className="text-sm font-medium">Cargo</h4>
                <select 
                  className="w-full p-2 text-sm rounded-md border border-input bg-background"
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                >
                  <option value="all">Todos</option>
                  {roles.map((role) => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-medium">Turno</h4>
                <select 
                  className="w-full p-2 text-sm rounded-md border border-input bg-background"
                  value={shiftFilter}
                  onChange={(e) => setShiftFilter(e.target.value)}
                >
                  <option value="all">Todos</option>
                  {shifts.map((shift) => (
                    <option key={shift} value={shift}>{shift}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-medium">Status dos Certificados</h4>
                <select 
                  className="w-full p-2 text-sm rounded-md border border-input bg-background"
                  value={certificateFilter}
                  onChange={(e) => setCertificateFilter(e.target.value)}
                >
                  <option value="all">Todos</option>
                  <option value="regular">Regular</option>
                  <option value="warning">Próximo ao Vencimento</option>
                  <option value="expired">Vencido</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* Employee List */}
          <div className="bg-card rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="p-2 md:p-4 text-left text-xs md:text-sm font-medium text-muted-foreground">ID</th>
                    <th className="p-2 md:p-4 text-left text-xs md:text-sm font-medium text-muted-foreground">Nome</th>
                    <th className="p-2 md:p-4 text-left text-xs md:text-sm font-medium text-muted-foreground">Cargo</th>
                    <th className="p-2 md:p-4 text-left text-xs md:text-sm font-medium text-muted-foreground">CPF</th>
                    <th className="p-2 md:p-4 text-left text-xs md:text-sm font-medium text-muted-foreground">Contato</th>
                    <th className="p-2 md:p-4 text-left text-xs md:text-sm font-medium text-muted-foreground">Turno</th>
                    <th className="p-2 md:p-4 text-left text-xs md:text-sm font-medium text-muted-foreground">ASO</th>
                    <th className="p-2 md:p-4 text-left text-xs md:text-sm font-medium text-muted-foreground">NR</th>
                    <th className="p-2 md:p-4 text-left text-xs md:text-sm font-medium text-muted-foreground">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredEmployees.map((employee) => (
                    <tr key={employee.id} className="hover:bg-muted/50 transition-colors">
                      <td className="p-2 md:p-4 text-xs md:text-sm">{employee.id}</td>
                      <td className="p-2 md:p-4">
                        <div className="text-xs md:text-sm font-medium">{employee.name}</div>
                        <div className="text-xs text-muted-foreground">Admitido em {employee.registrationDate}</div>
                      </td>
                      <td className="p-2 md:p-4 text-xs md:text-sm">{employee.role}</td>
                      <td className="p-2 md:p-4 text-xs md:text-sm">{employee.cpf}</td>
                      <td className="p-2 md:p-4 text-xs md:text-sm">{employee.contact}</td>
                      <td className="p-2 md:p-4 text-xs md:text-sm">{employee.shift}</td>
                      <td className="p-2 md:p-4">
                        <Badge variant={getCertificateStatusVariant(employee.asoStatus)} className="text-xs">
                          {employee.asoStatus === CertificateStatus.REGULAR && 'Regular'}
                          {employee.asoStatus === CertificateStatus.WARNING && 'Próximo'}
                          {employee.asoStatus === CertificateStatus.EXPIRED && 'Vencido'}
                        </Badge>
                        <div className="text-xs text-muted-foreground mt-1">
                          Vence: {employee.asoExpirationDate}
                        </div>
                      </td>
                      <td className="p-2 md:p-4">
                        <Badge variant={getCertificateStatusVariant(employee.nrStatus)} className="text-xs">
                          {employee.nrStatus === CertificateStatus.REGULAR && 'Regular'}
                          {employee.nrStatus === CertificateStatus.WARNING && 'Próximo'}
                          {employee.nrStatus === CertificateStatus.EXPIRED && 'Vencido'}
                        </Badge>
                        <div className="text-xs text-muted-foreground mt-1">
                          Vence: {employee.nrExpirationDate}
                        </div>
                      </td>
                      <td className="p-2 md:p-4">
                        <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="text-xs"
                            onClick={() => {
                              setSelectedEmployee(employee);
                              setEditDialogOpen(true);
                            }}
                          >
                            Editar
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="text-xs text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleDeleteEmployee(employee.id)}
                          >
                            Excluir
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {filteredEmployees.length === 0 && (
              <div className="p-6 md:p-8 text-center">
                <p className="text-muted-foreground text-sm md:text-base">Nenhum funcionário encontrado</p>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Add/Edit Employee Dialog */}
      <EmployeeDialog 
        open={addDialogOpen} 
        onOpenChange={setAddDialogOpen}
        onSave={handleSaveEmployee}
      />
      
      <EmployeeDialog 
        open={editDialogOpen} 
        onOpenChange={setEditDialogOpen}
        employee={selectedEmployee || undefined}
        onSave={handleSaveEmployee}
      />
    </div>
  );
};

export default EmployeesPage;
