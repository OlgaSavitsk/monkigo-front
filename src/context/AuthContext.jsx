import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [userData, setUserData] = useState(() => {
        const storedData = localStorage.getItem('user');
        return storedData ? JSON.parse(storedData) : null;
    });

    const checkTokenExpiration = (data) => {
        if (!data || !data.token) return true;
        
        try {
            const tokenParts = data.token.split('.');
            if (tokenParts.length !== 3) return true;
            
            const decodedToken = JSON.parse(window.atob(tokenParts[1]));
            return Date.now() >= decodedToken.exp * 1000;
        } catch (error) {
            console.error(error);
        }
    };

    const handleTokenExpiration = () => {
        if (checkTokenExpiration(userData)) {
            localStorage.clear()
        }
    };

    useEffect(() => {
        handleTokenExpiration();
    }, [userData]);

    return (
        <AuthContext.Provider value={{ userData, setUserData, checkTokenExpiration  }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};