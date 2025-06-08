import { createContext, useState, useContext, useEffect } from 'react';
import { authService } from './endpoints/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const verifySession = async () => {
            try {
                const result = await authService.verifyAuth();
                if (result && !result.error) {
                    setIsAuthenticated(true);
                    setUser({ isLoggedIn: true });
                } else {
                    setIsAuthenticated(false);
                    setUser(null);
                }
            } catch (error) {
                alert('Auth verification failed:', error);
                setIsAuthenticated(false);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        verifySession();
    }, []);

    const login = async (credentials) => {
        try {
            const userData = await authService.login(credentials);
            console.log('credentials:', credentials);
            setUser({ isLoggedIn: true });
            setIsAuthenticated(true);

            return userData;
        } catch (error) {
            alert('Login failed:', error);
            return {
                error: 'Login failed. Please try again.',
                status: error.response ? error.response.status : 500
            }
        }
    }

    const logout = async () => {
        try {
            const logoutResponse = await authService.logout();
            console.log('Logout response:', logoutResponse);
            setUser(null);
            setIsAuthenticated(false);

            return logoutResponse;
        } catch (error) {
            alert('Logout failed:', error);
            setIsAuthenticated(false);
            setUser(null);
            return {
                error: 'Logout failed. Please try again.',
                status: error.response ? error.response.status : 500
            }
        }
    };

    return (
        <AuthContext.Provider
        value={{
            user,
            isAuthenticated,
            loading,
            login,
            logout
        }}
        >
        {children}
        </AuthContext.Provider>
    );
};


export const useAuth = () => useContext(AuthContext);
