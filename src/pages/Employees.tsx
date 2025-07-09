import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { Plus, Search, Filter, Edit, Trash2 } from 'lucide-react';
import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';
import { Input } from '@/components/ui/input';
import EmployeeDialog from '@/components/employees/EmployeeDialog';
import { useEmployees, useCreateEmployee, useUpdateEmployee, useDeleteEmployee } from '@/hooks/useEmployees';

const EmployeesPage = () => {
  const isMobile = useIsMobile();
  const [search, setSearch] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<any | null>(null);

  // Use real database hooks
  const { data: employees = [], isLoading } = useEmployees();
  const createEmployee = useCreateEmployee();
  const updateEmployee = useUpdateEmployee();
  const deleteEmployee = useDeleteEmployee();

  // Filter employees
  const filteredEmployees = employees.filter(employee => 
    employee.name.toLowerCase().includes(search.toLowerCase()) ||
    employee.role.toLowerCase().includes(search.toLowerCase())
  );

  const handleSaveEmployee = (employeeData: any) => {
    if (editingEmployee) {
      updateEmployee.mutate({
        employeeId: editingEmployee.id,
        employeeData: employeeData
      });
    } else {
      createEmployee.mutate(employeeData);
    }
    setEditingEmployee(null);
    setShowDialog(false);
  };

  const handleEditEmployee = (employee: any) => {
    setEditingEmployee(employee);
    setShowDialog(true);
  };

  const handleDeleteEmployee = (id: string) => {
    deleteEmployee.mutate(id);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <div className={cn("flex-1 flex flex-col", !isMobile && "ml-64")}>
          <Navbar title="Funcionários" subtitle="Gestão de Pessoal" />
          <main className="flex-1 px-6 py-6 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600">Carregando funcionários...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <div className={cn(
        "flex-1 flex flex-col",
        !isMobile && "ml-64"
      )}>
        <Navbar 
          title="Funcionários" 
          subtitle="Gestão de Pessoal"
        />
        
        <main className="flex-1 px-6 py-6">
          {/* Header with search and actions */}
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
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filtrar
              </Button>
              <Button 
                className="gap-2" 
                onClick={() => {
                  setEditingEmployee(null);
                  setShowDialog(true);
                }}
              >
                <Plus className="w-4 h-4" />
                Novo Funcionário
              </Button>
            </div>
          </div>

          {/* Employees Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nome
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cargo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contato
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Turno
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ASO
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      NR
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredEmployees.map((employee) => (
                    <tr key={employee.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {employee.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{employee.role}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{employee.contact || '-'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{employee.shift || '-'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {employee.aso_expiration_date || '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {employee.nr_expiration_date || '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditEmployee(employee)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteEmployee(employee.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {filteredEmployees.length === 0 && (
            <div className="text-center p-8 text-muted-foreground">
              <p>Nenhum funcionário encontrado</p>
              <p className="text-sm mt-2">Adicione um novo funcionário para começar</p>
            </div>
          )}
        </main>
      </div>

      <EmployeeDialog
        open={showDialog}
        onOpenChange={setShowDialog}
        employee={editingEmployee}
        onSave={handleSaveEmployee}
      />
    </div>
  );
};

export default EmployeesPage;
