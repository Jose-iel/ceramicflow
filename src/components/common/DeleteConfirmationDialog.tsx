import { AlertTriangle } from 'lucide-react';
import React from 'react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface DeleteConfirmationDialogProps {
  trigger: React.ReactNode;
  itemType: string;
  itemName?: string;
  onConfirm: () => Promise<void> | void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
}

export function DeleteConfirmationDialog({
  trigger,
  itemType,
  itemName,
  onConfirm,
  open,
  onOpenChange,
  description,
  confirmText = 'Sim, excluir',
  cancelText = 'Cancelar',
  isLoading = false,
}: DeleteConfirmationDialogProps) {
  const defaultDescription = itemName
    ? `Tem certeza que deseja excluir ${itemType} "${itemName}"? Esta ação não pode ser desfeita.`
    : `Tem certeza que deseja excluir este ${itemType}? Esta ação não pode ser desfeita.`;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogTrigger asChild>
        {trigger}
      </AlertDialogTrigger>
      <AlertDialogContent className="sm:max-w-[425px]">
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <AlertDialogTitle className="text-left">
                Confirmar exclusão
              </AlertDialogTitle>
            </div>
          </div>
        </AlertDialogHeader>
        <AlertDialogDescription className="text-left leading-relaxed">
          {description || defaultDescription}
        </AlertDialogDescription>
        <AlertDialogFooter className="flex flex-col-reverse sm:flex-row gap-2">
          <AlertDialogCancel disabled={isLoading}>
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            disabled={isLoading}
            onClick={onConfirm}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                Excluindo...
              </div>
            ) : (
              confirmText
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
