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
      if (authLoading || !user) {
        if (!authLoading && !user) {
          setDisplayName('Usuário');
          setIsLoading(false);
        }
        return;
      }

      try {
        // Try to find the user in employees table by email
        const employees = await EmployeesService.getAllEmployees();
        const currentEmployee = employees.find(emp =>
          emp.contact?.toLowerCase().includes((user.email || '').toLowerCase()) ||
          (user.email && emp.name?.toLowerCase().includes(user.email.split('@')[0].toLowerCase())),
        );

        if (currentEmployee?.name) {
          setDisplayName(currentEmployee.name);
        } else {
          // Fallback to email username
          const emailUsername = user.email?.split('@')[0];
          setDisplayName(emailUsername || 'Usuário');
        }
      } catch (error) {
        console.error('Error loading user info:', error);
        // Fallback to email username
        const emailUsername = user.email?.split('@')[0];
        setDisplayName(emailUsername || 'Usuário');
      } finally {
        setIsLoading(false);
      }
    };

    loadUserInfo();
  }, [user, authLoading]);

  const getInitials = (name: string) => {
    if (!name || name === 'Usuário') {return 'U';}
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
