import React, { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext()
/*this is a function that acts as a container for data that can be shared across the component tree */
export function useAuth() {
    return useContext(AuthContext)
}

export default function AuthProvider({ children }) {
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState(null)
    const [token, setToken] = useState(() => {
        return localStorage.getItem('token')
    })
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        return !!localStorage.getItem('token')
    })

    useEffect(() => {
      
        const verifyToken = async () => {
            const savedToken = localStorage.getItem('token')
            if (!savedToken) {
                setLoading(false)
                return
            }
            try {
                const response = await fetch('/api/me', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${savedToken}`
                    },
                });
                console.log('token verification status : ', response.status)
                if (response.ok) {
                    const userData = await response.json()
                    console.log('user data retrieved : ', userData)
                    if (userData.access_token && userData.access_token !== savedToken) {
                        setToken(userData.access_token)

                        localStorage.setItem('token', userData.access_token)
                    } else {
                        setToken(savedToken)
                    }
                    setIsAuthenticated(true)
                    setUser(userData)
                } else {
                    handleLogout()
                }
            } catch (err) {
                console.log('Failed to verify token : ', err)
                handleLogout()
            } finally {
                setLoading(false)
            }
        }
        verifyToken()
    }, [])

    const register = async (name, email, password) => {
        setLoading(true)
        setError(null)
        try {
            const response = await fetch('/api/createUser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password })
            })

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.detail || 'Registration Failed')
            }
            setLoading(false)
            return { success: true, data };
        } catch (err) {
            setError(err.message)
            setLoading(false)
            return { success: false, error: err.message }
        }
    };

    const login = async (email, password) => {
        setLoading(true)
        setError(null)

        try {
            const formData = new FormData()
            formData.append('username', email)
            formData.append('password', password)

            const response = await fetch('/api/login', {
                method: 'POST',
                body: formData
            })
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.detail || 'Login Failed')
            }
            const newToken = data.access_token
            localStorage.setItem('token', newToken)
            setToken(newToken)

            const userResponse = await fetch('/api/me', {
                headers: {
                    'Authorization': `Bearer ${newToken}`
                }
            })
            if (userResponse.ok) {
                const userData = await userResponse.json()
                setUser(userData)
                setIsAuthenticated(true)
            }

            setLoading(false)
            return { success: true, data }
        } catch (err) {
            setError(err.message)
            setLoading(false)
            return { success: false, error: err.message }
        }
    }
    const handleLogout = () => {
        console.log('Logging out, removing token')
        try {
            localStorage.removeItem('token');
        } catch (e) {
            console.error('Error removing token from localStorage',e )
        }
        setToken(null)
        setUser(null)
        setIsAuthenticated(false)
    }
    //the values that will be available in the context
    const contextValues = {
        register,
        login,
        logout: handleLogout,
        user,
        error,
        setError,
        loading,
        isAuthenticated,
        token
    };

    return (
        <AuthContext.Provider value={contextValues}>
            {children}
        </AuthContext.Provider>
    )
}