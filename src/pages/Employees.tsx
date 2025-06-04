
import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import { Button } from "@/components/ui/button";
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { CertificateStatus, Employee, EmployeeRole } from '@/types';
import { BadgeCheck, Filter, Search, UserPlus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

// Mock data for employees
const initialEmployees: Employee[] = [
  {
    id: 'EMP001',
    name: 'Carlos Silva',
    role: EmployeeRole.FORNEIRO,
    cpf: '123.456.789-10',
    contact: '(11) 98765-4321',
    shift: 'Manhã',
    registrationDate: '15/03/2022',
    asoExpirationDate: '15/03/2024',
    nrExpirationDate: '20/05/2024',
    asoStatus: CertificateStatus.REGULAR,
    nrStatus: CertificateStatus.REGULAR
  },
  {
    id: 'EMP002',
    name: 'Maria Oliveira',
    role: EmployeeRole.MOTORISTA,
    cpf: '987.654.321-00',
    contact: '(11) 91234-5678',
    shift: 'Tarde',
    registrationDate: '10/06/2022',
    asoExpirationDate: '10/06/2023',
    nrExpirationDate: '15/08/2023',
    asoStatus: CertificateStatus.EXPIRED,
    nrStatus: CertificateStatus.EXPIRED
  },
  {
    id: 'EMP003',
    name: 'João Pereira',
    role: EmployeeRole.OPERADOR_MAQUINAS,
    cpf: '456.789.123-45',
    contact: '(11) 97654-3210',
    shift: 'Noite',
    registrationDate: '05/01/2023',
    asoExpirationDate: '05/01/2024',
    nrExpirationDate: '10/02/2024',
    asoStatus: CertificateStatus.WARNING,
    nrStatus: CertificateStatus.REGULAR
  },
  {
    id: 'EMP004',
    name: 'Ana Costa',
    role: EmployeeRole.ADMINISTRATIVO,
    cpf: '789.123.456-78',
    contact: '(11) 94321-8765',
    shift: 'Manhã',
    registrationDate: '20/04/2023',
    asoExpirationDate: '20/04/2024',
    nrExpirationDate: '25/06/2023',
    asoStatus: CertificateStatus.REGULAR,
    nrStatus: CertificateStatus.WARNING
  },
  {
    id: 'EMP005',
    name: 'Pedro Santos',
    role: EmployeeRole.SUPERVISOR,
    cpf: '321.654.987-00',
    contact: '(11) 95678-1234',
    shift: 'Integral',
    registrationDate: '12/11/2021',
    asoExpirationDate: '12/11/2023',
    nrExpirationDate: '20/01/2024',
    asoStatus: CertificateStatus.WARNING,
    nrStatus: CertificateStatus.WARNING
  }
];

const EmployeesPage = () => {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [role, setRole] = useState<string>('all');
  const [certStatus, setCertStatus] = useState<string>('all');
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  
  // Filter employees based on search and filters
  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(search.toLowerCase()) || 
                          employee.id.toLowerCase().includes(search.toLowerCase());
    
    const matchesRole = role === 'all' || employee.role === role;
    
    const matchesCertStatus = certStatus === 'all' || 
                             (certStatus === 'regular' && 
                              employee.asoStatus === CertificateStatus.REGULAR && 
                              employee.nrStatus === CertificateStatus.REGULAR) ||
                             (certStatus === 'warning' && 
                              (employee.asoStatus === CertificateStatus.WARNING || 
                               employee.nrStatus === CertificateStatus.WARNING)) ||
                             (certStatus === 'expired' && 
                              (employee.asoStatus === CertificateStatus.EXPIRED || 
                               employee.nrStatus === CertificateStatus.EXPIRED));
    
    return matchesSearch && matchesRole && matchesCertStatus;
  });

  const getStatusClass = (status: CertificateStatus) => {
    switch (status) {
      case CertificateStatus.REGULAR:
        return 'bg-status-operational/10 text-status-operational';
      case CertificateStatus.WARNING:
        return 'bg-status-maintenance/10 text-status-maintenance';
      case CertificateStatus.EXPIRED:
        return 'bg-status-warning/10 text-status-warning';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const handleDeleteEmployee = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este funcionário?")) {
      setEmployees(prev => prev.filter(emp => emp.id !== id));
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
        "flex-1 flex flex-col",
        !isMobile && "ml-64"
      )}>
        <Navbar 
          title="Funcionários" 
          subtitle="Gerenciamento de Funcionários"
        />
        
        <main className="flex-1 px-6 py-6">
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
              <Button className="gap-2">
                <UserPlus className="w-4 h-4" />
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
              </select>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Status de Certificação</h4>
              <select 
                className="w-full p-2 rounded-md border border-input bg-background"
                value={certStatus}
                onChange={(e) => setCertStatus(e.target.value)}
              >
                <option value="all">Todos</option>
                <option value="regular">Regular</option>
                <option value="warning">Próximo do Vencimento</option>
                <option value="expired">Vencido</option>
              </select>
            </div>
          </div>
          
          {/* Employees list */}
          <div className="bg-card rounded-lg shadow">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="p-4 text-left font-medium text-muted-foreground">ID</th>
                    <th className="p-4 text-left font-medium text-muted-foreground">Nome</th>
                    <th className="p-4 text-left font-medium text-muted-foreground">Cargo</th>
                    <th className="p-4 text-left font-medium text-muted-foreground">ASO</th>
                    <th className="p-4 text-left font-medium text-muted-foreground">NR-11</th>
                    <th className="p-4 text-left font-medium text-muted-foreground">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredEmployees.map((employee) => (
                    <tr key={employee.id} className="hover:bg-muted/50 transition-colors">
                      <td className="p-4">{employee.id}</td>
                      <td className="p-4">
                        <div className="font-medium">{employee.name}</div>
                        <div className="text-sm text-muted-foreground">{employee.contact}</div>
                      </td>
                      <td className="p-4">{employee.role}</td>
                      <td className="p-4">
                        <div className={cn(
                          "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs",
                          getStatusClass(employee.asoStatus)
                        )}>
                          <BadgeCheck className="w-3 h-3 mr-1" />
                          {employee.asoStatus}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Vence: {employee.asoExpirationDate}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className={cn(
                          "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs",
                          getStatusClass(employee.nrStatus)
                        )}>
                          <BadgeCheck className="w-3 h-3 mr-1" />
                          {employee.nrStatus}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Vence: {employee.nrExpirationDate}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            Detalhes
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
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
              <div className="p-8 text-center">
                <p className="text-muted-foreground">Nenhum funcionário encontrado</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default EmployeesPage;
