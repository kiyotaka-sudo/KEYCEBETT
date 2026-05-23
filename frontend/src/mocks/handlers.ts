import { http, HttpResponse } from 'msw'
import { 
  MOCK_SPORTS, MOCK_LEAGUES, MOCK_EVENTS, MOCK_LIVE_EVENTS, 
  MOCK_CASINO, MOCK_WALLET, MOCK_TRANSACTIONS, MOCK_BETS 
} from './mockData'

// Délai simulé
const delay = () => new Promise(resolve => setTimeout(resolve, 500))

export const handlers = [
  // Auth
  http.post('/api/auth/login', async () => {
    await delay()
    return HttpResponse.json({
      success: true,
      data: {
        accessToken: 'mock-token',
        refreshToken: 'mock-refresh',
        user: { id: '1', username: 'TestUser', email: 'test@keycebet.cm', role: 'USER', balance: 12500 }
      }
    })
  }),

  // Sports
  http.get('/api/sports', async () => {
    await delay()
    return HttpResponse.json({ success: true, data: MOCK_SPORTS })
  }),

  http.get('/api/leagues', async () => {
    await delay()
    return HttpResponse.json({ success: true, data: MOCK_LEAGUES })
  }),

  http.get('/api/events', async () => {
    await delay()
    return HttpResponse.json({ success: true, data: MOCK_EVENTS })
  }),

  http.get('/api/events/live', async () => {
    await delay()
    return HttpResponse.json({ success: true, data: MOCK_LIVE_EVENTS })
  }),

  http.get('/api/events/:id', async ({ params }) => {
    await delay()
    const event = [...MOCK_EVENTS, ...MOCK_LIVE_EVENTS].find(e => e.id === Number(params.id))
    return HttpResponse.json({ success: true, data: event })
  }),

  // Casino
  http.get('/api/casino/games', async () => {
    await delay()
    return HttpResponse.json({ success: true, data: MOCK_CASINO })
  }),

  // Wallet
  http.get('/api/wallet/balance', async () => {
    await delay()
    return HttpResponse.json({ success: true, data: MOCK_WALLET })
  }),

  http.get('/api/wallet/transactions', async () => {
    await delay()
    return HttpResponse.json({ success: true, data: { content: MOCK_TRANSACTIONS, totalElements: MOCK_TRANSACTIONS.length } })
  }),

  // Bets
  http.post('/api/bets', async () => {
    await delay()
    return HttpResponse.json({ success: true, data: MOCK_BETS[0] }) // Mock return
  }),

  http.get('/api/bets/my', async () => {
    await delay()
    return HttpResponse.json({ success: true, data: { content: MOCK_BETS, totalElements: MOCK_BETS.length } })
  }),

  // Dashboard Stats
  http.get('/api/dashboard/stats', async () => {
    await delay()
    return HttpResponse.json({ 
      success: true, 
      data: {
        totalUsers: 12450,
        activeUsers: 843,
        totalBets: 45200,
        grossGamingRevenue: 45000000,
        totalBetStakes: 120000000,
        totalDeposits: 85000000,
        totalWithdrawals: 40000000,
        totalWinsPaid: 75000000
      } 
    })
  })
]
