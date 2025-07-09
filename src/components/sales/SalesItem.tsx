
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, User, Package, DollarSign, Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Sale {
  id: string;
  sale_date: string;
  customer_name: string;
  customer_contact?: string;
  brick_quantity: number;
  price_per_thousand: number;
  total_value: number;
  recorded_by: string;
  notes?: string;
}

interface SalesItemProps {
  sale: Sale;
  onClick: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const SalesItem: React.FC<SalesItemProps> = ({ sale, onClick, onEdit, onDelete }) => {
  return (
    <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer group">
      <div className="flex flex-col space-y-3">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="flex-1 min-w-0" onClick={onClick}>
            <h3 className="font-semibold text-base truncate">{sale.customer_name}</h3>
            <p className="text-sm text-muted-foreground">
              {sale.customer_contact || 'Sem contato'}
            </p>
          </div>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button variant="ghost" size="sm" onClick={onEdit}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onDelete}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-2 gap-3 text-sm" onClick={onClick}>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{format(new Date(sale.sale_date), 'dd/MM/yyyy', { locale: ptBR })}</span>
          </div>
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-muted-foreground" />
            <span>{sale.brick_quantity.toLocaleString()} tijolos</span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <span>R$ {sale.price_per_thousand.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}/mil</span>
          </div>
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="truncate">{sale.recorded_by}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center pt-2 border-t" onClick={onClick}>
          <span className="text-xs text-muted-foreground">Total</span>
          <Badge variant="secondary" className="font-semibold">
            R$ {sale.total_value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </Badge>
        </div>
      </div>
    </Card>
  );
};

export default SalesItem;
