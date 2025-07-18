import { useState, useEffect } from 'react';

import { useAuth } from './useAuth';

import { EmployeesService } from '@/integrations/supabase/api/employees';

interface CurrentUserInfo {
  displayName: string;
  initials: string;
  role: string;
  isLoading: boolean;
}

export function useCurrentUser(): CurrentUserInfo {
  const { user, profile, isLoading: authLoading } = useAuth();
  const [displayName, setDisplayName] = useState<string>('Usuário');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUserInfo = async () => {
      if (authLoading || !user?.email) {
        if (!authLoading) {
          setDisplayName('Usuário');
          setIsLoading(false);
        }
        return;
      }

      setIsLoading(true);
      try {
        // Busca o funcionário diretamente pelo email
        const currentEmployee = await EmployeesService.findEmployeeByEmail(user.email);

        if (currentEmployee?.name) {
          setDisplayName(currentEmployee.name);
        } else {
          // Fallback para o nome de usuário do email se não encontrar funcionário
          const emailUsername = user.email.split('@')[0];
          setDisplayName(emailUsername || 'Usuário');
        }
      } catch (error) {
        console.error('Error loading user info:', error);
        // Fallback em caso de erro na busca
        const emailUsername = user.email.split('@')[0];
        setDisplayName(emailUsername || 'Usuário');
      } finally {
        setIsLoading(false);
      }
    };

    loadUserInfo();
  }, [user?.email, authLoading]); // Depender apenas do email do usuário e do status de autenticação

  const getInitials = (name: string) => {
    if (!name || name === 'Usuário') {
      return 'U';
    }
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const role = profile?.is_admin ? 'Administrador' : 'Usuário';

  return {
    displayName,
    initials: getInitials(displayName),
    role,
    isLoading: isLoading || authLoading,
  };
}
