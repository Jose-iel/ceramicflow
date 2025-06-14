
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
    expires: rememberMe ? 15 : 1, // 15 dias se "lembre-se de mim", senão 1 dia
    sameSite: 'strict' as const,
    path: '/'
  };

  console.log('Setting auth cookie:', { email, rememberMe, authData });
  
  Cookies.set(AUTH_COOKIE_NAME, JSON.stringify(authData), cookieOptions);
  
  if (rememberMe) {
    Cookies.set(REMEMBER_COOKIE_NAME, 'true', { expires: 15, sameSite: 'strict', path: '/' });
  }

  // Verificação imediata
  const verification = Cookies.get(AUTH_COOKIE_NAME);
  console.log('Cookie verification after setting:', verification);
  
  // Força a verificação
  setTimeout(() => {
    const recheckAuth = isUserAuthenticated();
    console.log('Authentication recheck after cookie set:', recheckAuth);
  }, 100);
};

export const getAuthCookie = (): AuthData | null => {
  try {
    const authCookie = Cookies.get(AUTH_COOKIE_NAME);
    
    console.log('Raw auth cookie:', authCookie);
    
    if (!authCookie) {
      console.log('No auth cookie found');
      return null;
    }
    
    const authData: AuthData = JSON.parse(authCookie);
    console.log('Parsed auth data:', authData);
    
    // Verificação simples - se tem o cookie e está marcado como autenticado, aceita
    if (authData && authData.isAuthenticated) {
      console.log('User is authenticated');
      return authData;
    }
    
    console.log('User not authenticated according to cookie data');
    return null;
    
  } catch (error) {
    console.error('Error reading auth cookie:', error);
    clearAuthCookie();
    return null;
  }
};

export const clearAuthCookie = () => {
  console.log('Clearing auth cookies');
  Cookies.remove(AUTH_COOKIE_NAME, { path: '/' });
  Cookies.remove(REMEMBER_COOKIE_NAME, { path: '/' });
};

export const isUserAuthenticated = (): boolean => {
  const authData = getAuthCookie();
  const isAuth = authData !== null && authData.isAuthenticated === true;
  console.log('Authentication check result:', isAuth, 'Auth data:', authData);
  return isAuth;
};
