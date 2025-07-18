import React, { useState, useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { EmployeeRole } from '@/types';

// Tipo para dados do banco (snake_case)
interface EmployeeDbData {
  id?: string;
  name: string;
  role: EmployeeRole;
  cpf?: string;
  contact?: string;
  shift?: string;
  admission_date?: string;
  vacation_due_date?: string;
}

// Tipo para dados brutos do Supabase
interface EmployeeRawData {
  id?: string;
  name: string;
  role: string;
  cpf?: string;
  contact?: string;
  shift?: string;
  admission_date?: string;
  vacation_due_date?: string;
  ceramic_id?: string;
  created_at?: string;
  updated_at?: string;
}

interface EmployeeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (employee: Omit<EmployeeDbData, 'id'>) => void;
  employee?: EmployeeRawData;
}

const EmployeeDialog = ({ open, onOpenChange, onSave, employee }: EmployeeDialogProps) => {
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    role: EmployeeRole.AJUDANTE,
    cpf: '',
    contact: '',
    shift: '',
    admissionDate: '',
    vacationDueDate: '',
  });

  useEffect(() => {
    if (employee) {
      setFormData({
        name: employee.name || '',
        role: (employee.role as EmployeeRole) || EmployeeRole.AJUDANTE,
        cpf: employee.cpf || '',
        contact: employee.contact || '',
        shift: employee.shift || '',
        admissionDate: employee.admission_date ? new Date(employee.admission_date).toISOString().split('T')[0] : '',
        vacationDueDate: employee.vacation_due_date ? new Date(employee.vacation_due_date).toISOString().split('T')[0] : '',
      });
    } else {
      setFormData({
        name: '',
        role: EmployeeRole.AJUDANTE,
        cpf: '',
        contact: '',
        shift: '',
        admissionDate: '',
        vacationDueDate: '',
      });
    }
  }, [employee, open]);

  const handleChange = (field: string, value: string | EmployeeRole) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.role) {
      toast({
        title: 'Erro ao salvar',
        description: 'Preencha todos os campos obrigatórios',
        variant: 'destructive',
      });
      return;
    }

    // Converte os dados para o formato esperado pelo banco (snake_case)
    const employeeData = {
      name: formData.name,
      role: formData.role,
      cpf: formData.cpf,
      contact: formData.contact,
      shift: formData.shift,
      admission_date: formData.admissionDate || null,
      vacation_due_date: formData.vacationDueDate || null,
    };

    onSave(employeeData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{employee ? 'Editar Funcionário' : 'Novo Funcionário'}</DialogTitle>
          <DialogDescription>Preencha as informações do funcionário abaixo.</DialogDescription>
        </DialogHeader>

        <form className="space-y-6 pt-4" onSubmit={handleSubmit}>
          {/* Informações Básicas */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-900 border-b pb-2">Informações Básicas</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome *</Label>
                <Input
                  required
                  id="name"
                  placeholder="Nome completo"
                  value={formData.name}
                  onChange={e => handleChange('name', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Cargo *</Label>
                <select
                  required
                  className="w-full p-2 rounded-md border border-input bg-background text-sm"
                  id="role"
                  value={formData.role}
                  onChange={e => handleChange('role', e.target.value as EmployeeRole)}
                >
                  {Object.values(EmployeeRole).map(role => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cpf">CPF</Label>
                <Input
                  id="cpf"
                  placeholder="000.000.000-00"
                  value={formData.cpf}
                  onChange={e => handleChange('cpf', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact">Contato</Label>
                <Input
                  id="contact"
                  placeholder="Telefone ou email"
                  value={formData.contact}
                  onChange={e => handleChange('contact', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="shift">Turno</Label>
                <Input
                  id="shift"
                  placeholder="Ex: Manhã, Tarde, Noite"
                  value={formData.shift}
                  onChange={e => handleChange('shift', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="admissionDate">Data de Admissão</Label>
                <Input
                  id="admissionDate"
                  type="date"
                  value={formData.admissionDate}
                  onChange={e => handleChange('admissionDate', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Certificações */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-900 border-b pb-2">Certificações e Exames</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="vacationDueDate">Próximas Férias</Label>
                <Input
                  id="vacationDueDate"
                  type="date"
                  value={formData.vacationDueDate}
                  onChange={e => handleChange('vacationDueDate', e.target.value)}
                />
              </div>
            </div>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-2 pt-6">
            <Button className="w-full sm:w-auto" type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button className="w-full sm:w-auto" type="submit">
              {employee ? 'Atualizar' : 'Criar'} Funcionário
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EmployeeDialog;
