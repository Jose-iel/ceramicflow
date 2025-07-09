
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

interface EmployeeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (employee: any) => void;
  employee?: any;
}

const EmployeeDialog = ({ open, onOpenChange, onSave, employee }: EmployeeDialogProps) => {
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: '',
    role: EmployeeRole.OPERATOR,
    cpf: '',
    contact: '',
    shift: '',
    registration_date: '',
    aso_expiration_date: '',
    nr_expiration_date: '',
  });

  useEffect(() => {
    if (employee) {
      setFormData({
        name: employee.name || '',
        role: employee.role || EmployeeRole.OPERATOR,
        cpf: employee.cpf || '',
        contact: employee.contact || '',
        shift: employee.shift || '',
        registration_date: employee.registration_date ? 
          new Date(employee.registration_date).toISOString().split('T')[0] : '',
        aso_expiration_date: employee.aso_expiration_date ? 
          new Date(employee.aso_expiration_date).toISOString().split('T')[0] : '',
        nr_expiration_date: employee.nr_expiration_date ? 
          new Date(employee.nr_expiration_date).toISOString().split('T')[0] : '',
      });
    } else {
      setFormData({
        name: '',
        role: EmployeeRole.OPERATOR,
        cpf: '',
        contact: '',
        shift: '',
        registration_date: '',
        aso_expiration_date: '',
        nr_expiration_date: '',
      });
    }
  }, [employee, open]);

  const handleChange = (field: string, value: any) => {
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
    
    onSave(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{employee ? 'Editar Funcionário' : 'Novo Funcionário'}</DialogTitle>
          <DialogDescription>
            Preencha as informações do funcionário abaixo.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input 
              id="name" 
              value={formData.name} 
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Nome completo"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="role">Cargo</Label>
            <select 
              id="role"
              className="w-full p-2 rounded-md border border-input bg-background"
              value={formData.role}
              onChange={(e) => handleChange('role', e.target.value as EmployeeRole)}
              required
            >
              {Object.values(EmployeeRole).map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>
          
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
            <Label htmlFor="registration_date">Data de Registro</Label>
            <Input 
              id="registration_date" 
              type="date"
              value={formData.registration_date} 
              onChange={(e) => handleChange('registration_date', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="aso_expiration_date">Vencimento ASO</Label>
            <Input 
              id="aso_expiration_date" 
              type="date"
              value={formData.aso_expiration_date} 
              onChange={(e) => handleChange('aso_expiration_date', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="nr_expiration_date">Vencimento NR</Label>
            <Input 
              id="nr_expiration_date" 
              type="date"
              value={formData.nr_expiration_date} 
              onChange={(e) => handleChange('nr_expiration_date', e.target.value)}
            />
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              {employee ? 'Atualizar' : 'Criar'} Funcionário
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EmployeeDialog;
