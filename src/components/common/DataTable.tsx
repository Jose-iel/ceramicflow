import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

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

interface ExpandedRowData {
  data: string;
  motivo: string;
  observacoes: string;
  botao1?: {
    label: string;
    onClick: () => void;
    variant?: 'default' | 'outline' | 'ghost' | 'secondary';
  };
  botao2?: {
    label: string;
    onClick: () => void;
    variant?: 'default' | 'outline' | 'ghost' | 'secondary';
  };
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
  expandable?: boolean;
  expandedRowData?: (row: T) => ExpandedRowData[];
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
  expandable = false,
  expandedRowData,
}: DataTableProps<T>) => {
  const isMobile = useIsMobile();
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const toggleRowExpansion = (rowId: string) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(rowId)) {
      newExpandedRows.delete(rowId);
    } else {
      newExpandedRows.add(rowId);
    }
    setExpandedRows(newExpandedRows);
  };

  const isRowExpanded = (rowId: string) => expandedRows.has(rowId);

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
        {data.map((row, index) => {
          const rowId = row.id || `card-${index}`;
          const isExpanded = expandable && isRowExpanded(rowId);
          const hasExpandedData = expandable && expandedRowData && expandedRowData(row).length > 0;

          return (
            <div key={rowId} className="bg-card rounded-lg border overflow-hidden">
              <div
                className={`p-4 space-y-3 ${hasExpandedData ? 'cursor-pointer hover:bg-muted/50 transition-colors' : ''}`}
                onClick={hasExpandedData ? () => toggleRowExpansion(rowId) : undefined}
              >
                {expandable && hasExpandedData && (
                  <div className="flex items-center mb-2">
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                )}
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
                          onClick={e => {
                            e.stopPropagation();
                            action.onClick(row);
                          }}
                        >
                          {action.label}
                        </Button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Expanded content for mobile */}
              {expandable && hasExpandedData && isExpanded && (
                <div className="px-4 pb-4 border-t bg-muted/20">
                  <div className="space-y-3 pt-3">
                    {expandedRowData!(row).map((item, itemIndex) => (
                      <div key={itemIndex} className="bg-background rounded-md p-3 space-y-2">
                        <div className="flex justify-between items-start">
                          <span className="text-sm font-medium text-muted-foreground">Data:</span>
                          <span className="text-sm text-right">{item.data}</span>
                        </div>
                        <div className="flex justify-between items-start">
                          <span className="text-sm font-medium text-muted-foreground">Motivo:</span>
                          <span className="text-sm text-right max-w-[60%]">{item.motivo}</span>
                        </div>
                        <div className="flex justify-between items-start">
                          <span className="text-sm font-medium text-muted-foreground">Observações:</span>
                          <span className="text-sm text-right max-w-[60%]">{item.observacoes}</span>
                        </div>
                        {(item.botao1 || item.botao2) && (
                          <div className="flex gap-2 pt-2">
                            {item.botao1 && (
                              <Button
                                size="sm"
                                variant={item.botao1.variant || 'outline'}
                                className="flex-1 text-xs"
                                onClick={e => {
                                  e.stopPropagation();
                                  item.botao1!.onClick();
                                }}
                              >
                                {item.botao1.label}
                              </Button>
                            )}
                            {item.botao2 && (
                              <Button
                                size="sm"
                                variant={item.botao2.variant || 'outline'}
                                className="flex-1 text-xs"
                                onClick={e => {
                                  e.stopPropagation();
                                  item.botao2!.onClick();
                                }}
                              >
                                {item.botao2.label}
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
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
              {expandable && (
                <th className="p-2 md:p-4 text-left text-xs md:text-sm font-medium text-muted-foreground uppercase tracking-wider w-10"></th>
              )}
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
            {data.map((row, index) => {
              const rowId = row.id || `row-${index}`;
              const isExpanded = expandable && isRowExpanded(rowId);
              const hasExpandedData = expandable && expandedRowData && expandedRowData(row).length > 0;

              return (
                <React.Fragment key={rowId}>
                  <tr
                    className={`hover:bg-muted/50 transition-colors ${hasExpandedData ? 'cursor-pointer' : ''}`}
                    onClick={hasExpandedData ? () => toggleRowExpansion(rowId) : undefined}
                  >
                    {expandable && (
                      <td className="p-2 md:p-4 text-xs md:text-sm whitespace-nowrap">
                        {hasExpandedData && (
                          <div className="flex items-center justify-center">
                            {isExpanded ? (
                              <ChevronDown className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            )}
                          </div>
                        )}
                      </td>
                    )}
                    {columns.map(column => (
                      <td
                        key={column.key}
                        className={`p-2 md:p-4 text-xs md:text-sm whitespace-nowrap ${column.className || ''}`}
                      >
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
                                onClick={e => {
                                  e.stopPropagation();
                                  action.onClick(row);
                                }}
                              >
                                {action.label}
                              </Button>
                            );
                          })}
                        </div>
                      </td>
                    )}
                  </tr>

                  {/* Expanded row content for desktop */}
                  {expandable && hasExpandedData && isExpanded && (
                    <tr>
                      <td colSpan={columns.length + (expandable ? 1 : 0) + (actions.length > 0 ? 1 : 0)} className="p-0">
                        <div className="bg-muted/20 border-t">
                          <div className="p-4 space-y-3">
                            {expandedRowData!(row).map((item, itemIndex) => (
                              <div key={itemIndex} className="bg-background rounded-md p-3 grid grid-cols-12 gap-3 items-start">
                                <div className="col-span-2">
                                  <span className="text-sm font-medium text-muted-foreground">Data: </span>
                                  <span className="text-sm">{item.data}</span>
                                </div>
                                <div className="col-span-3">
                                  <span className="text-sm font-medium text-muted-foreground">Motivo: </span>
                                  <span className="text-sm">{item.motivo}</span>
                                </div>
                                <div className="col-span-4">
                                  <span className="text-sm font-medium text-muted-foreground">Observações: </span>
                                  <span className="text-sm">{item.observacoes}</span>
                                </div>
                                <div className="col-span-3 flex gap-2 justify-end">
                                  {item.botao1 && (
                                    <Button
                                      size="sm"
                                      variant={item.botao1.variant || 'outline'}
                                      className="text-xs"
                                      onClick={e => {
                                        e.stopPropagation();
                                        item.botao1!.onClick();
                                      }}
                                    >
                                      {item.botao1.label}
                                    </Button>
                                  )}
                                  {item.botao2 && (
                                    <Button
                                      size="sm"
                                      variant={item.botao2.variant || 'outline'}
                                      className="text-xs"
                                      onClick={e => {
                                        e.stopPropagation();
                                        item.botao2!.onClick();
                                      }}
                                    >
                                      {item.botao2.label}
                                    </Button>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
