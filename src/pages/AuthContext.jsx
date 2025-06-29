import React from "react";
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) setUser(JSON.parse(storedUser));
    }, []);

    const login = (userData) => {
        const { photo, ...userWithoutPhoto } = userData;
        localStorage.setItem("user", JSON.stringify(userWithoutPhoto));
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem("user");
        setUser(null);
    };

    const updateUserContext = (updatedFields) => {
        setUser((prevUser) => {
            const updatedUser = {
                ...prevUser,
                ...updatedFields,
            };
            const { photo, ...userWithoutPhoto } = updatedUser;
            localStorage.setItem("user", JSON.stringify(userWithoutPhoto));
            return updatedUser;
        });
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, updateUserContext }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}