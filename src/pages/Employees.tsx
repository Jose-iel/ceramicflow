import { useState } from 'react';
import { Plus, Users, UserCheck, Clock } from 'lucide-react';
import EmployeeDialog from '@/components/employees/EmployeeDialog';
import { useEmployees, useCreateEmployee, useUpdateEmployee, useDeleteEmployee } from '@/hooks';
import type { Employee, CreateEmployeePayload } from '@/integrations/supabase/api/employees';
import { EmployeeRole } from '@/types';
import PageLayout from '@/components/common/PageLayout';
import DataTable from '@/components/common/DataTable';

const EmployeesPage = () => {
  const [search, setSearch] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  // Use hooks otimizados
  const { data: employees = [], isLoading } = useEmployees();
  const createEmployee = useCreateEmployee();
  const updateEmployee = useUpdateEmployee();
  const deleteEmployee = useDeleteEmployee();

  // Filter employees
  const filteredEmployees = (employees as Employee[]).filter(employee => 
    employee.name.toLowerCase().includes(search.toLowerCase()) ||
    employee.role.toString().toLowerCase().includes(search.toLowerCase()) ||
    employee.cpf?.toLowerCase().includes(search.toLowerCase())
  );

  const handleSaveEmployee = (employeeData: CreateEmployeePayload) => {
    if (editingEmployee) {
      updateEmployee.mutate({
        employeeId: editingEmployee.id,
        payload: employeeData
      });
    } else {
      createEmployee.mutate(employeeData);
    }
    setEditingEmployee(null);
    setShowDialog(false);
  };

  const handleEditEmployee = (employee: Employee) => {
    setEditingEmployee(employee);
    setShowDialog(true);
  };

  const handleDeleteEmployee = (employeeId: string) => {
    if (confirm("Tem certeza que deseja excluir este funcionário?")) {
      deleteEmployee.mutate(employeeId);
    }
  };

  const handleDialogClose = () => {
    setShowDialog(false);
    setEditingEmployee(null);
  };

  // Calculate stats
  const totalEmployees = filteredEmployees.length;
  const operatorCount = filteredEmployees.filter(emp => emp.role === EmployeeRole.OPERATOR).length;
  const adminCount = filteredEmployees.filter(emp => emp.role === EmployeeRole.ADMIN).length;

  // Stats cards configuration
  const statsCards = [
    {
      title: 'Total de Funcionários',
      value: totalEmployees.toString(),
      subtitle: 'funcionários cadastrados',
      icon: Users
    },
    {
      title: 'Operadores',
      value: operatorCount.toString(),
      subtitle: 'operadores ativos',
      icon: UserCheck
    },
    {
      title: 'Administrativos',
      value: adminCount.toString(),
      subtitle: 'administrativos',
      icon: Clock
    }
  ];

  // Table columns configuration - mobile responsive
  const columns = [
    {
      key: 'name',
      label: 'Nome',
      render: (value: unknown) => (
        <div className="text-sm font-medium text-gray-900">
          {String(value)}
        </div>
      ),
      className: 'min-w-[150px]' // Garantir largura mínima
    },
    {
      key: 'role',
      label: 'Cargo',
      render: (value: unknown) => {
        const roleMap = {
          [EmployeeRole.OPERATOR]: 'Operador',
          [EmployeeRole.ADMIN]: 'Administrativo',
          [EmployeeRole.SUPERVISOR]: 'Supervisor'
        };
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {roleMap[value as EmployeeRole] || String(value)}
          </span>
        );
      },
      className: 'min-w-[120px]'
    },
    {
      key: 'cpf',
      label: 'CPF',
      render: (value: unknown) => (
        <div className="text-sm text-gray-900 font-mono">
          {String(value || 'Não informado')}
        </div>
      ),
      className: 'min-w-[140px] hidden sm:table-cell' // Ocultar no mobile
    },
    {
      key: 'contact',
      label: 'Contato',
      render: (value: unknown) => (
        <div className="text-sm text-gray-900">
          {String(value || 'Não informado')}
        </div>
      ),
      className: 'min-w-[140px] hidden md:table-cell' // Ocultar em telas pequenas
    },
    {
      key: 'shift',
      label: 'Turno',
      render: (value: unknown) => (
        <div className="text-sm text-gray-900">
          {String(value || 'Não definido')}
        </div>
      ),
      className: 'min-w-[100px] hidden lg:table-cell' // Ocultar em telas menores
    }
  ];

  // Table actions - mobile friendly
  const tableActions = [
    {
      label: 'Editar',
      onClick: (row: Record<string, unknown>) => handleEditEmployee(row as unknown as Employee),
      variant: 'outline' as const,
      className: 'sm:w-auto w-full mb-2 sm:mb-0' // Full width no mobile
    },
    {
      label: 'Excluir',
      onClick: (row: Record<string, unknown>) => handleDeleteEmployee((row as unknown as Employee).id),
      variant: 'ghost' as const,
      className: 'text-red-500 hover:text-red-700 hover:bg-red-50 sm:w-auto w-full'
    }
  ];

  return (
    <PageLayout
      title="Funcionários"
      subtitle="Gerenciamento de Colaboradores"
      isLoading={isLoading}
      selectedMonth=""
      onMonthChange={() => {}}
      showMonthFilter={false}
      statsCards={statsCards}
      searchValue={search}
      onSearchChange={setSearch}
      searchPlaceholder="Buscar funcionário..."
      actions={[
        {
          label: 'Novo Funcionário',
          onClick: () => setShowDialog(true),
          icon: <Plus className="w-4 h-4" />,
          className: 'w-full sm:w-auto' // Full width no mobile
        }
      ]}
    >
      <div className="space-y-6">
        <DataTable
          data={filteredEmployees as unknown as Record<string, unknown>[]}
          columns={columns}
          actions={tableActions}
          emptyMessage="Nenhum funcionário encontrado"
          minWidth="600px" // Reduzir largura mínima para mobile
          isLoading={isLoading}
          showMobileCards={true} // Ativar cards no mobile
        />
      </div>

      <EmployeeDialog
        open={showDialog}
        onOpenChange={handleDialogClose}
        onSave={handleSaveEmployee}
        employee={editingEmployee}
      />
    </PageLayout>
  );
};

export default EmployeesPage;
