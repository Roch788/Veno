import React from 'react';
import { useState, useEffect } from 'react'
export const AuthContext = React.createContext();
import api from '../utils/axios';
export const Authprovider = (({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);
    const login = async (email, password, role) => {
        try {
            const { data } = await api.post('/auth/login', {
                email,
                password,
                role
            })
            setUser(data);
            localStorage.setItem("user", JSON.stringify(data));
            localStorage.setItem("token", data.token);
            return data;
        } catch (err) {
            throw err;
        }
    };
    const register = async (name, email, password, role) => {
        try {
            const { data } = await api.post('/auth/register', { name, email, password, role });
            // Backend returns a confirmation message and email — do not treat as authenticated yet
            return data;
        } catch (err) {
            console.log("register failed", err)
            throw err;
        };
    }
    const verifyOtp = async (email, otp) => {
        try {
            const { data } = await api.post('/auth/verify-otp', { email, otp });
            setUser(data);
            localStorage.setItem("user", JSON.stringify(data));
            localStorage.setItem("token", data.token);
            return data;
        } catch (err) {
            console.log("Otp Verification failed", err)
            throw err;
        };
    }
    const logout = () => {
        setUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
    };
    return (
        <AuthContext.Provider value={{ user, loading, login, logout, verifyOtp, register }} >
            {children}
        </AuthContext.Provider>
    );

})