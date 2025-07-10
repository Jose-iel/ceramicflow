import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EmployeeRole } from '@/types';
import { useToast } from '@/hooks/use-toast';

// Tipo para dados do banco (snake_case)
type EmployeeDbData = {
  id?: string;
  name: string;
  role: EmployeeRole;
  cpf?: string;
  contact?: string;
  shift?: string;
  registration_date?: string;
  aso_expiration_date?: string;
  nr_expiration_date?: string;
};

// Tipo para dados brutos do Supabase
type EmployeeRawData = {
  id?: string;
  name: string;
  role: string;
  cpf?: string;
  contact?: string;
  shift?: string;
  registration_date?: string;
  aso_expiration_date?: string;
  nr_expiration_date?: string;
  ceramic_id?: string;
  created_at?: string;
  updated_at?: string;
};

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
    role: EmployeeRole.OPERATOR,
    cpf: '',
    contact: '',
    shift: '',
    registrationDate: '',
    asoExpirationDate: '',
    nrExpirationDate: '',
  });

  useEffect(() => {
    if (employee) {
      setFormData({
        name: employee.name || '',
        role: (employee.role as EmployeeRole) || EmployeeRole.OPERATOR,
        cpf: employee.cpf || '',
        contact: employee.contact || '',
        shift: employee.shift || '',
        registrationDate: employee.registration_date ? 
          new Date(employee.registration_date).toISOString().split('T')[0] : '',
        asoExpirationDate: employee.aso_expiration_date ? 
          new Date(employee.aso_expiration_date).toISOString().split('T')[0] : '',
        nrExpirationDate: employee.nr_expiration_date ? 
          new Date(employee.nr_expiration_date).toISOString().split('T')[0] : '',
      });
    } else {
      setFormData({
        name: '',
        role: EmployeeRole.OPERATOR,
        cpf: '',
        contact: '',
        shift: '',
        registrationDate: '',
        asoExpirationDate: '',
        nrExpirationDate: '',
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
        title: "Erro ao salvar",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
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
      registration_date: formData.registrationDate || null,
      aso_expiration_date: formData.asoExpirationDate || null,
      nr_expiration_date: formData.nrExpirationDate || null,
    };
    
    onSave(employeeData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{employee ? 'Editar Funcionário' : 'Novo Funcionário'}</DialogTitle>
          <DialogDescription>
            Preencha as informações do funcionário abaixo.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          {/* Informações Básicas */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-900 border-b pb-2">
              Informações Básicas
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome *</Label>
                <Input 
                  id="name" 
                  value={formData.name} 
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="Nome completo"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="role">Cargo *</Label>
                <select 
                  id="role"
                  className="w-full p-2 rounded-md border border-input bg-background text-sm"
                  value={formData.role}
                  onChange={(e) => handleChange('role', e.target.value as EmployeeRole)}
                  required
                >
                  {Object.values(EmployeeRole).map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cpf">CPF</Label>
                <Input 
                  id="cpf" 
                  value={formData.cpf} 
                  onChange={(e) => handleChange('cpf', e.target.value)}
                  placeholder="000.000.000-00"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="contact">Contato</Label>
                <Input 
                  id="contact" 
                  value={formData.contact} 
                  onChange={(e) => handleChange('contact', e.target.value)}
                  placeholder="Telefone ou email"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="shift">Turno</Label>
                <Input 
                  id="shift" 
                  value={formData.shift} 
                  onChange={(e) => handleChange('shift', e.target.value)}
                  placeholder="Ex: Manhã, Tarde, Noite"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="registrationDate">Data de Registro</Label>
                <Input 
                  id="registrationDate" 
                  type="date"
                  value={formData.registrationDate} 
                  onChange={(e) => handleChange('registrationDate', e.target.value)}
                />
              </div>
            </div>
          </div>
          
          {/* Certificações */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-900 border-b pb-2">
              Certificações e Exames
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="asoExpirationDate">Vencimento ASO</Label>
                <Input 
                  id="asoExpirationDate" 
                  type="date"
                  value={formData.asoExpirationDate} 
                  onChange={(e) => handleChange('asoExpirationDate', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="nrExpirationDate">Vencimento NR</Label>
                <Input 
                  id="nrExpirationDate" 
                  type="date"
                  value={formData.nrExpirationDate} 
                  onChange={(e) => handleChange('nrExpirationDate', e.target.value)}
                />
              </div>
            </div>
          </div>
          
          <DialogFooter className="flex flex-col sm:flex-row gap-2 pt-6">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="w-full sm:w-auto"
            >
              Cancelar
            </Button>
            <Button 
              type="submit"
              className="w-full sm:w-auto"
            >
              {employee ? 'Atualizar' : 'Criar'} Funcionário
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EmployeeDialog;
