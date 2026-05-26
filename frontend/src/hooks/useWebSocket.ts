import { useEffect, useRef } from 'react'
import { io, Socket } from 'socket.io-client'
import { useAuthStore } from '@/store/authStore'
import { useNotificationStore } from '@/store/notificationStore'

export const useWebSocket = () => {
  const socketRef = useRef<Socket | null>(null)
  const token = useAuthStore((state) => state.token)
  const addNotification = useNotificationStore((state) => state.addNotification)

  useEffect(() => {
    if (!token) return

    const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:8080/ws'
    
    // Initialisation
    socketRef.current = io(wsUrl, {
      auth: { token },
      transports: ['websocket'],
    })

    const socket = socketRef.current

    socket.on('connect', () => {
      console.log('Connecté au WebSocket')
    })

    socket.on('disconnect', () => {
      console.log('Déconnecté du WebSocket')
    })

    // Écoute des résultats de paris (public)
    socket.on('/topic/bet-results', (message) => {
      // Optionnel: rafraîchir l'interface si on affiche un feed public
      console.log('Nouveau résultat global:', message)
    })

    // Écoute des paris personnels (privé)
    socket.on('/user/queue/bets', (bet) => {
      if (bet.status === 'WON') {
        addNotification({
          type: 'SUCCESS',
          title: 'Pari Gagnant !',
          message: `Votre pari a été gagné. Gain : ${bet.potentialWin} XAF`
        })
      } else if (bet.status === 'LOST') {
        addNotification({
          type: 'ERROR',
          title: 'Pari Perdant',
          message: 'Meilleure chance la prochaine fois.'
        })
      }
    })

    return () => {
      socket.disconnect()
    }
  }, [token, addNotification])

  return socketRef.current
}
