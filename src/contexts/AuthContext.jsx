import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const savedState = localStorage.getItem('quiz_state');
    if (savedState) {
      try {
        const state = JSON.parse(savedState);
        if (state.username) {
          setIsAuthenticated(true);
          setUsername(state.username);
        }
      } catch (error) {
        console.error('Error parsing saved state:', error);
      }
    }
  }, []);
  
  const login = (name) => {
    setIsAuthenticated(true);
    setUsername(name);
  };
  
  const logout = () => {
    setIsAuthenticated(false);
    setUsername('');
  };
  
  const value = {
    isAuthenticated,
    username,
    login,
    logout
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}