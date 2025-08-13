import { Plus, Users, Clock, UserX } from 'lucide-react';
import { useState, useCallback } from 'react';

import DataTable from '@/components/common/DataTable';
import PageLayout from '@/components/common/PageLayout';
import EmployeeDialog from '@/components/employees/EmployeeDialog';
import AddAbsenceDialog from '@/components/employees/AddAbsenceDialog';
import {
  useEmployees,
  useCreateEmployee,
  useUpdateEmployee,
  useDeleteEmployee,
  useAllEmployeeAbsences,
  useCreateEmployeeAbsence,
  useUpdateEmployeeAbsence,
  useDeleteEmployeeAbsence,
} from '@/hooks';
import { useToast } from '@/hooks/use-toast';
import { useMonthFilter } from '@/hooks/useMonthFilter';
import type { Employee, CreateEmployeePayload } from '@/integrations/supabase/api/employees';
import type { CreateEmployeeAbsencePayload, EmployeeAbsence } from '@/integrations/supabase/api/employee-absences';
import { EmployeeRole } from '@/types';

const EmployeesPage = () => {
  const [search, setSearch] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [showAbsenceDialog, setShowAbsenceDialog] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [editingAbsence, setEditingAbsence] = useState<EmployeeAbsence | null>(null);
  const [showUpcomingVacationsOnly, setShowUpcomingVacationsOnly] = useState(false);

  const { toast } = useToast();
  const { selectedMonth, setSelectedMonth, filterDataByMonth } = useMonthFilter();

  // Use hooks otimizados
  const { data: employees = [], isLoading } = useEmployees();
  const { data: allAbsences = [] } = useAllEmployeeAbsences();
  const createEmployee = useCreateEmployee();
  const updateEmployee = useUpdateEmployee();
  const deleteEmployee = useDeleteEmployee();
  const createAbsence = useCreateEmployeeAbsence();
  const updateAbsence = useUpdateEmployeeAbsence();
  const deleteAbsence = useDeleteEmployeeAbsence();

  // Filter employees
  const filteredEmployees = (employees as Employee[]).filter(employee => {
    // Filtro de busca por texto
    const matchesSearch =
      employee.name.toLowerCase().includes(search.toLowerCase()) ||
      employee.role.toString().toLowerCase().includes(search.toLowerCase()) ||
      employee.cpf?.toLowerCase().includes(search.toLowerCase());

    // Filtro de férias próximas
    if (showUpcomingVacationsOnly) {
      if (!employee.vacation_due_date) {
        return false;
      }
      const vacationDate = new Date(employee.vacation_due_date);
      const today = new Date();
      const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
      const hasUpcomingVacation = vacationDate <= thirtyDaysFromNow;
      return matchesSearch && hasUpcomingVacation;
    }

    return matchesSearch;
  });

  const handleSaveEmployee = (employeeData: CreateEmployeePayload) => {
    if (editingEmployee) {
      updateEmployee.mutate({
        employeeId: editingEmployee.id,
        payload: employeeData,
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

  const handleDeleteEmployee = async (employeeId: string, employeeName: string) => {
    try {
      await deleteEmployee.mutateAsync(employeeId);
      toast({
        title: 'Funcionário excluído',
        description: `O funcionário ${employeeName} foi excluído com sucesso.`,
      });
    } catch (error: unknown) {
      let errorMessage = 'Erro inesperado ao excluir funcionário.';

      if (
        error instanceof Error &&
        (error.message.includes('foreign key constraint') ||
          error.message.includes('operations_employee_id_fkey') ||
          error.message.includes('operations_vehicle_id_fkey'))
      ) {
        errorMessage =
          'Você não pode excluir um funcionário que esteja vinculado a uma operação. Remova as operações relacionadas primeiro.';
      }

      toast({
        title: 'Erro ao excluir',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  const handleDialogClose = () => {
    setShowDialog(false);
    setEditingEmployee(null);
  };

  const handleSaveAbsence = (absenceData: CreateEmployeeAbsencePayload) => {
    if (editingAbsence) {
      // Editando falta existente
      updateAbsence.mutate({
        absenceId: editingAbsence.id,
        payload: absenceData,
      });
    } else {
      // Criando nova falta
      createAbsence.mutate(absenceData);
    }
    setShowAbsenceDialog(false);
    setEditingAbsence(null);
  };

  const handleAbsenceDialogClose = () => {
    setShowAbsenceDialog(false);
    setEditingAbsence(null);
  };

  const handleEditAbsence = useCallback((absence: EmployeeAbsence) => {
    setEditingAbsence(absence);
    setShowAbsenceDialog(true);
  }, []);

  const handleDeleteAbsence = useCallback(
    async (absenceId: string, employeeName: string, absenceDate: string) => {
      try {
        await deleteAbsence.mutateAsync(absenceId);
        toast({
          title: 'Falta excluída',
          description: `A falta do funcionário ${employeeName} do dia ${absenceDate} foi excluída com sucesso.`,
        });
      } catch {
        toast({
          title: 'Erro ao excluir',
          description: 'Erro inesperado ao excluir a falta.',
          variant: 'destructive',
        });
      }
    },
    [deleteAbsence, toast]
  );

  // Função para buscar faltas de um funcionário e converter para formato do DataTable
  const getEmployeeAbsencesForExpansion = useCallback(
    (employee: Employee) => {
      // Filtrar faltas do funcionário específico
      let employeeAbsences = allAbsences.filter(absence => absence.employee_id === employee.id);

      // Aplicar filtro por mês nas faltas
      if (employeeAbsences.length > 0) {
        employeeAbsences = filterDataByMonth(employeeAbsences.map(absence => ({ ...absence, date: absence.absence_date })));
      }

      // Se o funcionário não tem faltas para o mês selecionado, retorna array vazio (não mostra expansão)
      if (!employeeAbsences.length) {
        return [];
      }

      // Converter faltas reais para o formato esperado pelo DataTable expandido
      return employeeAbsences.map(absence => ({
        data: new Date(absence.absence_date).toLocaleDateString('pt-BR'),
        motivo: absence.reason || 'Motivo não informado',
        observacoes: absence.notes || 'Sem observações',
        botao1: {
          label: 'Editar',
          onClick: () => handleEditAbsence(absence),
          variant: 'outline' as const,
        },
        botao2: {
          label: 'Excluir',
          onClick: () => {
            const employeeName = employee.name;
            const absenceDate = new Date(absence.absence_date).toLocaleDateString('pt-BR');
            handleDeleteAbsence(absence.id, employeeName, absenceDate);
          },
          variant: 'ghost' as const,
        },
      }));
    },
    [allAbsences, filterDataByMonth, handleEditAbsence, handleDeleteAbsence]
  );

  // Calculate stats
  const totalEmployees = filteredEmployees.length;

  // Calcular funcionários com férias próximas do vencimento (dentro de 30 dias)
  const today = new Date();
  const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
  const employeesWithUpcomingVacations = filteredEmployees.filter(emp => {
    if (emp.vacation_due_date) {
      const vacationDate = new Date(emp.vacation_due_date);
      // Funcionário precisa tirar férias se a data de vencimento é hoje ou nos próximos 30 dias
      return vacationDate <= thirtyDaysFromNow;
    }
    return false;
  }).length;

  // Calcular total de faltas do mês selecionado
  const filteredAbsences = filterDataByMonth(allAbsences.map(absence => ({ ...absence, date: absence.absence_date })));
  const totalAbsencesInMonth = filteredAbsences.length;

  // Stats cards configuration
  const statsCards = [
    {
      title: 'Total de Funcionários',
      value: totalEmployees.toString(),
      subtitle: 'funcionários cadastrados',
      icon: Users,
    },
    {
      title: 'Férias Próximas',
      value: employeesWithUpcomingVacations.toString(),
      subtitle: 'próximas do vencimento',
      icon: Clock,
    },
    {
      title: 'Faltas do Mês',
      value: totalAbsencesInMonth.toString(),
      subtitle: selectedMonth || 'todas as faltas',
      icon: UserX,
      iconColor: 'text-red-600',
      iconBgColor: 'bg-red-100',
    },
  ];

  // Table columns configuration - mobile responsive
  const columns = [
    {
      key: 'name',
      label: 'Nome',
      render: (value: unknown) => <div className="text-sm font-medium text-gray-900">{String(value)}</div>,
      className: 'min-w-[150px]', // Garantir largura mínima
    },
    {
      key: 'role',
      label: 'Cargo',
      render: (value: unknown) => {
        const roleMap = {
          [EmployeeRole.FORNEIRO]: 'Forneiro',
          [EmployeeRole.LANCEADOR]: 'Lanceador',
          [EmployeeRole.MOTORISTA]: 'Motorista',
          [EmployeeRole.OPERADOR_MAQUINAS]: 'Operador de Máquinas',
          [EmployeeRole.SUPERVISOR]: 'Supervisor',
          [EmployeeRole.GERENTE]: 'Gerente',
          [EmployeeRole.AJUDANTE]: 'Ajudante',
        };
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {roleMap[value as EmployeeRole] || String(value)}
          </span>
        );
      },
      className: 'min-w-[120px]',
    },
    {
      key: 'cpf',
      label: 'CPF',
      render: (value: unknown) => <div className="text-sm text-gray-900 font-mono">{String(value || 'Não informado')}</div>,
      className: 'min-w-[140px] hidden sm:table-cell', // Ocultar no mobile
    },
    {
      key: 'contact',
      label: 'Contato',
      render: (value: unknown) => <div className="text-sm text-gray-900">{String(value || 'Não informado')}</div>,
      className: 'min-w-[140px] hidden md:table-cell', // Ocultar em telas pequenas
    },
    {
      key: 'shift',
      label: 'Turno',
      render: (value: unknown) => <div className="text-sm text-gray-900">{String(value || 'Não definido')}</div>,
      className: 'min-w-[100px] hidden lg:table-cell', // Ocultar em telas menores
    },
    {
      key: 'absences_count',
      label: 'Faltas',
      render: (value: unknown, row: Record<string, unknown>) => {
        const employee = row as unknown as Employee;
        // Filtrar faltas do funcionário específico e aplicar filtro por mês
        let employeeAbsences = allAbsences.filter(absence => absence.employee_id === employee.id);
        employeeAbsences = filterDataByMonth(employeeAbsences.map(absence => ({ ...absence, date: absence.absence_date })));
        const employeeAbsencesCount = employeeAbsences.length;

        if (employeeAbsencesCount === 0) {
          return <div className="text-sm text-gray-400">Nenhuma</div>;
        }

        return (
          <div className="text-sm">
            <span
              className={`inline-flex items-center px-8 py-0.5 rounded-full text-xs font-medium ${
                employeeAbsencesCount > 5
                  ? 'bg-red-100 text-red-800'
                  : employeeAbsencesCount > 2
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-green-100 text-green-800'
              }`}
            >
              {employeeAbsencesCount}
            </span>
          </div>
        );
      },
      className: 'min-w-[80px] hidden md:table-cell', // Ocultar em telas pequenas
    },
    {
      key: 'vacation_due_date',
      label: 'Vencimento das Férias',
      render: (value: unknown) => {
        if (!value) {
          return <span className="text-gray-400">Não definido</span>;
        }
        const date = new Date(value as string);
        const today = new Date();
        const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
        const isOverdue = date < today;
        const isUpcoming = date <= thirtyDaysFromNow && date >= today;

        let className = 'text-sm';
        let bgClassName = '';

        if (isOverdue) {
          className += ' text-red-700 font-bold';
          bgClassName = 'bg-red-100 px-2 py-1 rounded';
        } else if (isUpcoming) {
          className += ' text-orange-600 font-semibold';
          bgClassName = 'bg-orange-100 px-2 py-1 rounded';
        } else {
          className += ' text-gray-900';
        }

        return (
          <div className={bgClassName}>
            <div className={className}>{date.toLocaleDateString('pt-BR')}</div>
            {isOverdue && <div className="text-xs text-red-600 font-medium">Vencido</div>}
            {isUpcoming && !isOverdue && <div className="text-xs text-orange-600 font-medium">Próximo</div>}
          </div>
        );
      },
      className: 'min-w-[140px] hidden xl:table-cell', // Ocultar em telas muito pequenas
    },
  ];

  // Table actions - mobile friendly
  const tableActions = [
    {
      label: 'Editar',
      onClick: (row: Record<string, unknown>) => handleEditEmployee(row as unknown as Employee),
      variant: 'outline' as const,
      className: 'sm:w-auto w-full mb-2 sm:mb-0', // Full width no mobile
    },
    {
      label: 'Excluir',
      onClick: (row: Record<string, unknown>) =>
        handleDeleteEmployee((row as unknown as Employee).id, (row as unknown as Employee).name),
      variant: 'ghost' as const,
      className: 'text-red-500 hover:text-red-700 hover:bg-red-50 sm:w-auto w-full',
    },
  ];

  return (
    <PageLayout
      actions={[
        {
          label: showUpcomingVacationsOnly ? 'Mostrar Todos' : 'Férias Próximas',
          onClick: () => setShowUpcomingVacationsOnly(!showUpcomingVacationsOnly),
          variant: showUpcomingVacationsOnly ? 'default' : 'outline',
          icon: <Clock className="w-4 h-4" />,
          className: 'w-full sm:w-auto',
        },
        {
          label: 'Adicionar Falta',
          onClick: () => setShowAbsenceDialog(true),
          variant: 'outline',
          icon: <UserX className="w-4 h-4" />,
          className: 'w-full sm:w-auto',
        },
        {
          label: 'Novo Funcionário',
          onClick: () => setShowDialog(true),
          icon: <Plus className="w-4 h-4" />,
          className: 'w-full sm:w-auto', // Full width no mobile
        },
      ]}
      isLoading={isLoading}
      searchPlaceholder="Buscar funcionário..."
      searchValue={search}
      selectedMonth={selectedMonth}
      showMonthFilter={true}
      statsCards={statsCards}
      subtitle="Gerenciamento de Colaboradores"
      title="Funcionários"
      onMonthChange={setSelectedMonth}
      onSearchChange={setSearch}
    >
      <div className="space-y-6">
        <DataTable
          showMobileCards // Ativar cards no mobile
          actions={tableActions}
          columns={columns}
          data={filteredEmployees as unknown as Record<string, unknown>[]}
          emptyMessage="Nenhum funcionário encontrado"
          expandable={true}
          expandedRowData={employee => getEmployeeAbsencesForExpansion(employee as unknown as Employee)}
          isLoading={isLoading}
          minWidth="600px" // Reduzir largura mínima para mobile
        />
      </div>

      <EmployeeDialog employee={editingEmployee} open={showDialog} onOpenChange={handleDialogClose} onSave={handleSaveEmployee} />

      <AddAbsenceDialog
        open={showAbsenceDialog}
        employees={employees as Employee[]}
        editingAbsence={editingAbsence}
        onOpenChange={handleAbsenceDialogClose}
        onSave={handleSaveAbsence}
      />
    </PageLayout>
  );
};

export default EmployeesPage;
