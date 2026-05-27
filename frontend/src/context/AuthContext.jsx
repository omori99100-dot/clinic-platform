import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authApi } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    if (token) {
      authApi.verify()
        .then(({ user }) => setUser(user))
        .catch(() => localStorage.removeItem('adminToken'))
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = useCallback(async (email, password) => {
    const { token, user } = await authApi.login(email, password)
    localStorage.setItem('adminToken', token)
    setUser(user)
    return user
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('adminToken')
    setUser(null)
  }, [])

  return (
    <AuthContext value={{ user, loading, login, logout, isAdmin: !!user }}>
      {children}
    </AuthContext>
  )
}

export const useAuth = () => useContext(AuthContext)
