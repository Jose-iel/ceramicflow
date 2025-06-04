
import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import { Button } from "@/components/ui/button";
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { Employee, EmployeeRole, CertificateStatus } from '@/types';
import { Filter, Search, Plus, Users, AlertTriangle, CheckCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Badge from '@/components/common/Badge';
import EmployeeDialog from '@/components/employees/EmployeeDialog';
import { useToast } from '@/hooks/use-toast';

// Mock data for employees
const initialEmployees: Employee[] = [
  {
    id: 'F001',
    name: 'João Silva',
    role: EmployeeRole.FORNEIRO,
    cpf: '123.456.789-10',
    contact: '(11) 98765-4321',
    shift: 'Manhã',
    registrationDate: '15/01/2023',
    asoExpirationDate: '15/01/2024',
    nrExpirationDate: '15/01/2024',
    asoStatus: CertificateStatus.REGULAR,
    nrStatus: CertificateStatus.REGULAR
  },
  {
    id: 'F002',
    name: 'Maria Santos',
    role: EmployeeRole.OPERADOR_MAQUINAS,
    cpf: '987.654.321-00',
    contact: '(11) 91234-5678',
    shift: 'Tarde',
    registrationDate: '22/03/2023',
    asoExpirationDate: '22/03/2024',
    nrExpirationDate: '10/12/2023',
    asoStatus: CertificateStatus.REGULAR,
    nrStatus: CertificateStatus.WARNING
  }
];

const EmployeesPage = () => {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [role, setRole] = useState<string>('all');
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [showDialog, setShowDialog] = useState(false);
  
  // Filter employees
  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(search.toLowerCase()) || 
                          employee.id.toLowerCase().includes(search.toLowerCase());
    
    const matchesRole = role === 'all' || employee.role === role;
    
    return matchesSearch && matchesRole;
  });

  const handleSaveEmployee = (employee: Employee) => {
    setEmployees(prev => [...prev, employee]);
  };

  const getStatusBadgeVariant = (status: CertificateStatus) => {
    switch (status) {
      case CertificateStatus.REGULAR:
        return 'success';
      case CertificateStatus.WARNING:
        return 'warning';
      case CertificateStatus.EXPIRED:
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <div className={cn(
        "flex-1 flex flex-col",
        !isMobile && "ml-64"
      )}>
        <Navbar 
          title="Funcionários" 
          subtitle="Gerenciamento da Equipe"
        />
        
        <main className="flex-1 px-6 py-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total de Funcionários
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{employees.length}</div>
                <p className="text-xs text-muted-foreground">
                  Funcionários ativos
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Certificados Regulares
                </CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {employees.filter(e => e.asoStatus === CertificateStatus.REGULAR && e.nrStatus === CertificateStatus.REGULAR).length}
                </div>
                <p className="text-xs text-muted-foreground">
                  ASO e NR-11 em dia
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Atenção Necessária
                </CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {employees.filter(e => e.asoStatus !== CertificateStatus.REGULAR || e.nrStatus !== CertificateStatus.REGULAR).length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Certificados vencendo/vencidos
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Filter section */}
          <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
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
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                Filtrar
              </Button>
              <Button className="gap-2" onClick={() => setShowDialog(true)}>
                <Plus className="w-4 h-4" />
                Novo Funcionário
              </Button>
            </div>
          </div>
          
          {/* Filter options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Cargo</h4>
              <select 
                className="w-full p-2 rounded-md border border-input bg-background"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="all">Todos</option>
                <option value={EmployeeRole.FORNEIRO}>Forneiro</option>
                <option value={EmployeeRole.MOTORISTA}>Motorista</option>
                <option value={EmployeeRole.OPERADOR_MAQUINAS}>Operador de Máquinas</option>
                <option value={EmployeeRole.ADMINISTRATIVO}>Administrativo</option>
                <option value={EmployeeRole.SUPERVISOR}>Supervisor</option>
                <option value={EmployeeRole.ADMIN}>Administrador</option>
              </select>
            </div>
          </div>

          {/* Employees grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredEmployees.map((employee) => (
              <Card key={employee.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{employee.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{employee.role}</p>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {employee.id}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Turno:</span>
                    <span>{employee.shift}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Contato:</span>
                    <span>{employee.contact}</span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">ASO:</span>
                      <Badge variant={getStatusBadgeVariant(employee.asoStatus)}>
                        {employee.asoExpirationDate}
                      </Badge>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">NR-11:</span>
                      <Badge variant={getStatusBadgeVariant(employee.nrStatus)}>
                        {employee.nrExpirationDate}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {filteredEmployees.length === 0 && (
            <div className="text-center p-8 text-muted-foreground">
              <p>Nenhum funcionário encontrado</p>
            </div>
          )}
        </main>
      </div>
      
      <EmployeeDialog
        open={showDialog}
        onOpenChange={setShowDialog}
        onSave={handleSaveEmployee}
      />
    </div>
  );
};

export default EmployeesPage;
