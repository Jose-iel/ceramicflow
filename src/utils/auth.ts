
import Cookies from 'js-cookie';

const AUTH_COOKIE_NAME = 'ceramicflow_auth';
const REMEMBER_COOKIE_NAME = 'ceramicflow_remember';

export interface AuthData {
  email: string;
  isAuthenticated: boolean;
  loginTime: number;
}

export const setAuthCookie = (email: string, rememberMe: boolean = false) => {
  const authData: AuthData = {
    email,
    isAuthenticated: true,
    loginTime: Date.now()
  };

  const cookieOptions = {
    expires: rememberMe ? 15 : undefined, // 15 dias se "lembre-se de mim", senão sessão
    sameSite: 'strict' as const
  };

  console.log('Setting auth cookie:', { email, rememberMe, authData });
  
  Cookies.set(AUTH_COOKIE_NAME, JSON.stringify(authData), cookieOptions);
  
  if (rememberMe) {
    Cookies.set(REMEMBER_COOKIE_NAME, 'true', { expires: 15, sameSite: 'strict' });
  }

  // Verify cookie was set
  const verification = Cookies.get(AUTH_COOKIE_NAME);
  console.log('Cookie verification:', verification ? 'Set successfully' : 'Failed to set');
};

export const getAuthCookie = (): AuthData | null => {
  try {
    const authCookie = Cookies.get(AUTH_COOKIE_NAME);
    const rememberCookie = Cookies.get(REMEMBER_COOKIE_NAME);
    
    console.log('Getting auth cookie:', { 
      hasCookie: !!authCookie, 
      hasRemember: !!rememberCookie 
    });
    
    if (!authCookie) return null;
    
    const authData: AuthData = JSON.parse(authCookie);
    
    // Se não tem "lembre-se de mim" e passou mais de 1 dia de sessão, expira
    if (!rememberCookie) {
      const oneDayInMs = 24 * 60 * 60 * 1000;
      if (Date.now() - authData.loginTime > oneDayInMs) {
        console.log('Session expired (1 day limit)');
        clearAuthCookie();
        return null;
      }
    } else {
      // Se tem "lembre-se de mim", verifica se passou 15 dias
      const fifteenDaysInMs = 15 * 24 * 60 * 60 * 1000;
      if (Date.now() - authData.loginTime > fifteenDaysInMs) {
        console.log('Remember me expired (15 days limit)');
        clearAuthCookie();
        return null;
      }
    }
    
    console.log('Auth data retrieved successfully:', authData);
    return authData;
  } catch (error) {
    console.error('Erro ao ler cookie de autenticação:', error);
    clearAuthCookie();
    return null;
  }
};

export const clearAuthCookie = () => {
  console.log('Clearing auth cookies');
  Cookies.remove(AUTH_COOKIE_NAME);
  Cookies.remove(REMEMBER_COOKIE_NAME);
};

export const isUserAuthenticated = (): boolean => {
  const authData = getAuthCookie();
  const isAuth = authData !== null && authData.isAuthenticated;
  console.log('Authentication check result:', isAuth);
  return isAuth;
};
