import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api'; // Import our Axios instance

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // For showing spinner on initial load

  // 1. Restore Session on Refresh
  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    
    if (token && role) {
      // If data exists in storage, set the user state immediately
      setUser({ token, role });
    }
    setLoading(false);
  }, []);

  // 2. Login Function
  const login = async (email, password) => {
    try {
      const response = await api.post('/api/auth/login', { email, password });
      
      const { token, role, isBlocked } = response.data;

      if (isBlocked) {
        throw { response: { data: { message: 'Your account is blocked. Contact Admin.' } } };
      }

      // Save to Storage
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);

      // Update State
      setUser({ token, role });
      return { success: true, role }; // Return role for redirection logic

    } catch (error) {
      console.error("Login failed:", error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  // 3. Logout Function
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom Hook to use Auth easily
export const useAuth = () => useContext(AuthContext);