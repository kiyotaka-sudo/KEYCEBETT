import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User, LoginRequest, RegisterRequest, AuthResponse } from '@/types/auth.types'
import api from '@/config/axios'
import toast from 'react-hot-toast'

interface AuthState {
  user: User | null
  token: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
  
  login: (credentials: LoginRequest) => Promise<void>
  register: (data: RegisterRequest) => Promise<void>
  logout: () => void
  setToken: (token: string) => void
  fetchUser: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (credentials) => {
        set({ isLoading: true })
        try {
          const { data } = await api.post<{ data: AuthResponse }>('/auth/login', credentials)
          set({
            user: data.data.user,
            token: data.data.accessToken,
            refreshToken: data.data.refreshToken,
            isAuthenticated: true,
          })
          toast.success('Connexion réussie')
        } catch (error: any) {
          toast.error(error.message || 'Erreur de connexion')
          throw error
        } finally {
          set({ isLoading: false })
        }
      },

      register: async (registerData) => {
        set({ isLoading: true })
        try {
          const { data } = await api.post<{ data: AuthResponse }>('/auth/register', registerData)
          set({
            user: data.data.user,
            token: data.data.accessToken,
            refreshToken: data.data.refreshToken,
            isAuthenticated: true,
          })
          toast.success('Compte créé avec succès')
        } catch (error: any) {
          toast.error(error.message || 'Erreur lors de l\'inscription')
          throw error
        } finally {
          set({ isLoading: false })
        }
      },

      logout: async () => {
        try {
          const refreshToken = get().refreshToken
          if (refreshToken) {
            await api.post('/auth/logout', { refreshToken })
          }
        } catch (error) {
          console.error('Erreur logout serveur', error)
        } finally {
          set({ user: null, token: null, refreshToken: null, isAuthenticated: false })
          toast.success('Déconnecté')
          window.location.href = '/'
        }
      },

      setToken: (token) => set({ token }),

      fetchUser: async () => {
        if (!get().token) return
        try {
          const { data } = await api.get<{ data: User }>('/users/me')
          set({ user: data.data })
        } catch (error) {
          console.error('Impossible de récupérer l\'utilisateur', error)
        }
      },
    }),
    {
      name: 'keycebet-auth',
      partialize: (state) => ({ 
        token: state.token, 
        refreshToken: state.refreshToken 
      }), // On ne persiste que les tokens
    }
  )
)
