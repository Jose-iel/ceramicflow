import { AlertTriangle, RefreshCw, Wifi, Database } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ErrorStateProps {
  title?: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  variant?: 'default' | 'network' | 'api' | 'not-found';
}

export function ErrorState({
  title,
  description,
  action,
  variant = 'default',
}: ErrorStateProps) {
  const getIcon = () => {
    switch (variant) {
      case 'network':
        return <Wifi className="h-8 w-8 text-red-600" />;
      case 'api':
        return <Database className="h-8 w-8 text-red-600" />;
      default:
        return <AlertTriangle className="h-8 w-8 text-red-600" />;
    }
  };

  const getDefaultContent = () => {
    switch (variant) {
      case 'network':
        return {
          title: 'Problema de Conexão',
          description: 'Verifique sua conexão com a internet e tente novamente.',
        };
      case 'api':
        return {
          title: 'Erro do Servidor',
          description: 'Nossos serviços estão temporariamente indisponíveis.',
        };
      case 'not-found':
        return {
          title: 'Dados Não Encontrados',
          description: 'Não foi possível encontrar os dados solicitados.',
        };
      default:
        return {
          title: 'Erro Inesperado',
          description: 'Algo deu errado. Nossa equipe foi notificada.',
        };
    }
  };

  const defaultContent = getDefaultContent();

  return (
    <div className="flex items-center justify-center p-8">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            {getIcon()}
          </div>
          <CardTitle>{title || defaultContent.title}</CardTitle>
          <CardDescription>
            {description || defaultContent.description}
          </CardDescription>
        </CardHeader>
        {action && (
          <CardContent>
            <Button className="w-full" onClick={action.onClick}>
              <RefreshCw className="h-4 w-4 mr-2" />
              {action.label}
            </Button>
          </CardContent>
        )}
      </Card>
    </div>
  );
}

// Error state para tabelas vazias
export function EmptyState({
  title = 'Nenhum dado encontrado',
  description = 'Ainda não há dados para exibir aqui.',
  action,
}: {
  title?: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
        <Database className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground mb-4 max-w-sm">{description}</p>
      {action && (
        <Button onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
}

// Loading state para substituir "Carregando..."
export function LoadingState({
  message = 'Carregando dados...',
  size = 'default',
}: {
  message?: string;
  size?: 'sm' | 'default' | 'lg';
}) {
  const sizeClasses = {
    sm: 'p-4',
    default: 'p-8',
    lg: 'p-12',
  };

  return (
    <div className={`flex flex-col items-center justify-center text-center ${sizeClasses[size]}`}>
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4" />
      <p className="text-muted-foreground">{message}</p>
    </div>
  );
}
