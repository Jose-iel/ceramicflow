import React from 'react';

import { EmptyState } from '@/components/common/ErrorStates';
import { Button } from '@/components/ui/button';
import { DataTableSkeleton } from '@/components/ui/skeleton-variants';
import { useIsMobile } from '@/hooks/use-mobile';

interface TableColumn<T = Record<string, unknown>> {
  key: string;
  label: string;
  className?: string;
  render?: (value: unknown, row: T) => React.ReactNode;
}

interface TableAction<T = Record<string, unknown>> {
  label: string;
  onClick: (row: T) => void;
  variant?: 'default' | 'outline' | 'ghost' | 'secondary';
  className?: string;
  condition?: (row: T) => boolean;
}

interface DataTableProps<T = Record<string, unknown>> {
  data: T[];
  columns: TableColumn<T>[];
  actions?: TableAction<T>[];
  emptyMessage?: string;
  emptyAction?: {
    label: string;
    onClick: () => void;
  };
  minWidth?: string;
  isLoading?: boolean;
  showMobileCards?: boolean;
}

const DataTable = <T extends Record<string, unknown> & { id?: string }>({
  data,
  columns,
  actions = [],
  emptyMessage = 'Nenhum item encontrado',
  emptyAction,
  minWidth = '600px',
  isLoading = false,
  showMobileCards = false,
}: DataTableProps<T>) => {
  const isMobile = useIsMobile();

  if (isLoading) {
    return <DataTableSkeleton columns={columns.length} />;
  }

  if (data.length === 0) {
    return (
      <EmptyState action={emptyAction} description="Tente ajustar os filtros ou adicionar novos dados." title={emptyMessage} />
    );
  }

  // Mobile cards view
  if (isMobile && showMobileCards) {
    return (
      <div className="space-y-4">
        {data.map((row, index) => (
          <div key={row.id || `card-${index}`} className="bg-card rounded-lg border p-4 space-y-3">
            {columns
              .filter(col => !col.className?.includes('hidden'))
              .map(column => (
                <div key={column.key} className="flex justify-between items-start">
                  <span className="text-sm font-medium text-muted-foreground">{column.label}:</span>
                  <div className="text-sm text-right max-w-[60%]">
                    {column.render ? column.render(row[column.key], row) : (row[column.key] as React.ReactNode) || '-'}
                  </div>
                </div>
              ))}
            {actions.length > 0 && (
              <div className="flex gap-2 pt-3 border-t">
                {actions.map((action, actionIndex) => {
                  if (action.condition && !action.condition(row)) {
                    return null;
                  }

                  return (
                    <Button
                      key={actionIndex}
                      className={`flex-1 text-xs ${action.className || ''}`}
                      size="sm"
                      variant={action.variant || 'ghost'}
                      onClick={() => action.onClick(row)}
                    >
                      {action.label}
                    </Button>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }

  // Desktop table view
  return (
    <div className="bg-card rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full" style={{ minWidth }}>
          <thead className="bg-muted/50">
            <tr>
              {columns.map(column => (
                <th
                  key={column.key}
                  className={`p-2 md:p-4 text-left text-xs md:text-sm font-medium text-muted-foreground uppercase tracking-wider ${column.className || ''}`}
                >
                  {column.label}
                </th>
              ))}
              {actions.length > 0 && (
                <th className="p-2 md:p-4 text-left text-xs md:text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  Ações
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {data.map((row, index) => (
              <tr key={row.id || `row-${index}`} className="hover:bg-muted/50 transition-colors">
                {columns.map(column => (
                  <td key={column.key} className={`p-2 md:p-4 text-xs md:text-sm whitespace-nowrap ${column.className || ''}`}>
                    {column.render ? column.render(row[column.key], row) : (row[column.key] as React.ReactNode) || '-'}
                  </td>
                ))}
                {actions.length > 0 && (
                  <td className="p-2 md:p-4">
                    <div className="flex flex-wrap gap-1 sm:gap-2">
                      {actions.map((action, actionIndex) => {
                        if (action.condition && !action.condition(row)) {
                          return null;
                        }

                        return (
                          <Button
                            key={actionIndex}
                            className={`text-xs ${action.className || ''}`}
                            size="sm"
                            variant={action.variant || 'ghost'}
                            onClick={() => action.onClick(row)}
                          >
                            {action.label}
                          </Button>
                        );
                      })}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
