import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const STORAGE_KEY = 'sgq_atlas_auth';

// Demo user for testing
const DEMO_USER = {
    id: 1,
    name: 'Administrador',
    email: 'admin@sgqatlas.com',
    role: 'admin',
    avatar: null
};

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for existing session
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                setUser(parsed);
            } catch (e) {
                localStorage.removeItem(STORAGE_KEY);
            }
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        // Demo authentication - accepts admin@sgqatlas.com / admin123
        if (email === 'admin@sgqatlas.com' && password === 'admin123') {
            const userData = { ...DEMO_USER };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
            setUser(userData);
            return { success: true };
        }
        return { success: false, error: 'Credenciais inválidas' };
    };

    const logout = () => {
        localStorage.removeItem(STORAGE_KEY);
        setUser(null);
    };

    const updateUser = (updates) => {
        const updated = { ...user, ...updates };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        setUser(updated);
    };

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            login,
            logout,
            updateUser,
            isAuthenticated: !!user
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

export default AuthContext;
