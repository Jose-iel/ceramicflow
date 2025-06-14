
export interface AuthData {
  email: string;
  isAuthenticated: boolean;
  loginTime: number;
}

const AUTH_STORAGE_KEY = 'ceramicflow_auth';
const REMEMBER_STORAGE_KEY = 'ceramicflow_remember';

export const setAuthData = (email: string, rememberMe: boolean = false) => {
  const authData: AuthData = {
    email,
    isAuthenticated: true,
    loginTime: Date.now()
  };

  console.log('Setting auth data:', { email, rememberMe, authData });
  
  try {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData));
    
    if (rememberMe) {
      localStorage.setItem(REMEMBER_STORAGE_KEY, 'true');
    }

    // Verificação imediata
    const verification = localStorage.getItem(AUTH_STORAGE_KEY);
    console.log('Auth data verification after setting:', verification);
    
    return true;
  } catch (error) {
    console.error('Error setting auth data:', error);
    return false;
  }
};

export const getAuthData = (): AuthData | null => {
  try {
    const authDataStr = localStorage.getItem(AUTH_STORAGE_KEY);
    
    console.log('Raw auth data from localStorage:', authDataStr);
    
    if (!authDataStr) {
      console.log('No auth data found');
      return null;
    }
    
    const authData: AuthData = JSON.parse(authDataStr);
    console.log('Parsed auth data:', authData);
    
    // Verificação simples - se tem os dados e está marcado como autenticado
    if (authData && authData.isAuthenticated && authData.email) {
      console.log('User is authenticated');
      return authData;
    }
    
    console.log('User not authenticated according to stored data');
    return null;
    
  } catch (error) {
    console.error('Error reading auth data:', error);
    clearAuthData();
    return null;
  }
};

export const clearAuthData = () => {
  console.log('Clearing auth data');
  localStorage.removeItem(AUTH_STORAGE_KEY);
  localStorage.removeItem(REMEMBER_STORAGE_KEY);
};

export const isUserAuthenticated = (): boolean => {
  const authData = getAuthData();
  const isAuth = authData !== null && authData.isAuthenticated === true;
  console.log('Authentication check result:', isAuth, 'Auth data:', authData);
  return isAuth;
};

// Backward compatibility exports
export const setAuthCookie = setAuthData;
export const getAuthCookie = getAuthData;
export const clearAuthCookie = clearAuthData;
