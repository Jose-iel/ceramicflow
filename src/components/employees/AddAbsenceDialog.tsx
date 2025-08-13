import { useEffect, useState } from 'react';
import { CalendarIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import type { Employee } from '@/integrations/supabase/api/employees';
import type { CreateEmployeeAbsencePayload, EmployeeAbsence } from '@/integrations/supabase/api/employee-absences';

interface AddAbsenceDialogProps {
  open: boolean;
  employees: Employee[];
  editingAbsence?: EmployeeAbsence | null;
  onOpenChange: (open: boolean) => void;
  onSave: (absenceData: CreateEmployeeAbsencePayload) => void;
}

const AddAbsenceDialog = ({ open, employees, editingAbsence = null, onOpenChange, onSave }: AddAbsenceDialogProps) => {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('');
  const [absenceDate, setAbsenceDate] = useState<string>('');
  const [reason, setReason] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Preencher dados quando o diálogo abrir
  useEffect(() => {
    if (open) {
      if (editingAbsence) {
        // Modo edição - preencher com dados existentes
        setSelectedEmployeeId(editingAbsence.employee_id);
        setAbsenceDate(editingAbsence.absence_date);
        setReason(editingAbsence.reason || '');
        setNotes(editingAbsence.notes || '');
      } else {
        // Modo criação - preencher data atual e limpar campos
        const today = new Date();
        const formattedDate = today.toISOString().split('T')[0];
        setAbsenceDate(formattedDate);
        setSelectedEmployeeId('');
        setReason('');
        setNotes('');
      }
    }
  }, [open, editingAbsence]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedEmployeeId || !absenceDate) {
      return;
    }

    setIsSubmitting(true);

    try {
      const absenceData: CreateEmployeeAbsencePayload = {
        employee_id: selectedEmployeeId,
        absence_date: absenceDate,
        reason: reason || undefined,
        notes: notes || undefined,
      };

      await onSave(absenceData);
      onOpenChange(false);
    } catch (error) {
      console.error('Erro ao salvar falta:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>{editingAbsence ? 'Editar Falta de Funcionário' : 'Adicionar Falta de Funcionário'}</DialogTitle>
          <DialogDescription>
            {editingAbsence
              ? 'Edite os dados da falta do funcionário.'
              : 'Registre uma nova falta para um funcionário. Selecione o funcionário, a data e adicione uma justificativa.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 py-4">
            {/* Seleção do Funcionário */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="employee" className="text-right">
                Funcionário *
              </Label>
              <div className="col-span-3">
                <Select value={selectedEmployeeId} onValueChange={setSelectedEmployeeId} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um funcionário" />
                  </SelectTrigger>
                  <SelectContent>
                    {employees.map(employee => (
                      <SelectItem key={employee.id} value={employee.id}>
                        {employee.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Data da Falta */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="absence_date" className="text-right">
                Data da Falta *
              </Label>
              <div className="col-span-3 relative">
                <Input
                  id="absence_date"
                  type="date"
                  value={absenceDate}
                  onChange={e => setAbsenceDate(e.target.value)}
                  required
                  className={cn('pl-10')}
                />
                <CalendarIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              </div>
            </div>

            {/* Motivo da Falta */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="reason" className="text-right">
                Motivo
              </Label>
              <div className="col-span-3">
                <Select value={reason} onValueChange={setReason}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o motivo (opcional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="doenca">Doença</SelectItem>
                    <SelectItem value="consulta_medica">Consulta Médica</SelectItem>
                    <SelectItem value="problema_pessoal">Problema Pessoal</SelectItem>
                    <SelectItem value="licenca_medica">Licença Médica</SelectItem>
                    <SelectItem value="falta_justificada">Falta Justificada</SelectItem>
                    <SelectItem value="atraso">Atraso</SelectItem>
                    <SelectItem value="outros">Outros</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Observações/Justificativa */}
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="notes" className="text-right pt-2">
                Justificativa
              </Label>
              <div className="col-span-3">
                <Textarea
                  id="notes"
                  placeholder="Adicione detalhes ou justificativa para a falta..."
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCancel} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button type="submit" disabled={!selectedEmployeeId || !absenceDate || isSubmitting}>
              {isSubmitting
                ? editingAbsence
                  ? 'Salvando...'
                  : 'Registrando...'
                : editingAbsence
                  ? 'Salvar Alterações'
                  : 'Registrar Falta'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddAbsenceDialog;
