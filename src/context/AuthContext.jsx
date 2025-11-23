import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/axiosConfig';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for stored token and user data on mount
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (token && storedUser) {
            setUser(JSON.parse(storedUser));
            setIsAuthenticated(true);
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const response = await api.post('/auth/login', { email, password });
            const { token, refreshToken, id, role, names, lastNames, cargo, profilePhotoUrl } = response.data;

            // Construct user object
            const userData = {
                id,
                email,
                role,
                names,
                lastNames,
                cargo: cargo || null, // Only for employees
                profilePhotoUrl: profilePhotoUrl || null
            };

            // Save to local storage
            localStorage.setItem('token', token);
            localStorage.setItem('refreshToken', refreshToken);
            localStorage.setItem('user', JSON.stringify(userData));

            // Update state
            setUser(userData);
            setIsAuthenticated(true);

            return { success: true, role };
        } catch (error) {
            console.error('Login failed:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Ingreso fallido. Por favor, verifique sus credenciales.'
            };
        }
    };

    const register = async (userData) => {
        try {
            const response = await api.post('/auth/register', userData);
            const { token, refreshToken, id, role, names, lastNames, cargo, profilePhotoUrl } = response.data;

            // Construct user object
            const userObj = {
                id,
                email: userData.email,
                role,
                names,
                lastNames,
                cargo: cargo || null,
                profilePhotoUrl: profilePhotoUrl || null
            };

            // Save to local storage
            localStorage.setItem('token', token);
            localStorage.setItem('refreshToken', refreshToken);
            localStorage.setItem('user', JSON.stringify(userObj));

            // Update state
            setUser(userObj);
            setIsAuthenticated(true);

            return { success: true, data: response.data };
        } catch (error) {
            console.error('Registro fallido:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Registro fallido. Por favor, intente de nuevo.'
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        setUser(null);
        setIsAuthenticated(false);
        // Optional: Redirect to login page handled by component or router
    };

    const value = {
        user,
        isAuthenticated,
        loading,
        login,
        register,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
