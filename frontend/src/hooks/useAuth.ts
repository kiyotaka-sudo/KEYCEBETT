import { useAuthStore } from '@/store/authStore'
import { useEffect } from 'react'

export const useAuth = () => {
  const { user, token, isAuthenticated, isLoading, login, register, logout, fetchUser } = useAuthStore()

  useEffect(() => {
    if (token && !user) {
      fetchUser()
    }
  }, [token, user, fetchUser])

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
  }
}
