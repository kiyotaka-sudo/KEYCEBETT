import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useWithdraw, useInvalidateWallet } from '@/hooks/useWallet'
import { walletService } from '@/services/wallet.service'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { PaymentProvider, Transaction, TransactionStatus } from '@/types/wallet.types'

const PROVIDERS = [
  {
    id: 'MTN_MOMO' as PaymentProvider,
    label: 'MTN Mobile Money',
    shortLabel: 'MTN MoMo',
    color: '#FFCB05',
    bgGradient: 'linear-gradient(135deg,#FFCB05,#FF8C00)',
    logo: 'M',
  },
  {
    id: 'ORANGE_MONEY' as PaymentProvider,
    label: 'Orange Money',
    shortLabel: 'Orange Money',
    color: '#FF6B00',
    bgGradient: 'linear-gradient(135deg,#FF6B00,#FF3D00)',
    logo: 'O',
  },
]

const STATUS_LABELS: Record<TransactionStatus, string> = {
  PENDING:   'Virement en cours vers votre telephone...',
  COMPLETED: 'Retrait effectue ! Fonds envoyes sur votre compte Mobile Money.',
  FAILED:    'Le retrait a echoue. Votre solde a ete restitue.',
  CANCELLED: 'Retrait annule. Votre solde a ete restitue.',
}

function formatCmPhone(raw: string): string {
  const digits = raw.replace(/\D/g, '')
  if (digits.startsWith('237')) return `+${digits}`
  return `+237${digits.slice(-9)}`
}

const Spinner = () => (
  <svg className="animate-spin w-6 h-6 text-yellow-400" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
  </svg>
)

export const WithdrawForm: React.FC<{ onSuccess: () => void; maxAmount: number }> = ({ onSuccess, maxAmount }) => {
  const [amount, setAmount]       = useState('')
  const [phone, setPhone]         = useState('')
  const [provider, setProvider]   = useState<PaymentProvider>('MTN_MOMO')
  const [pendingTx, setPendingTx] = useState<Transaction | null>(null)
  const [serverMsg, setServerMsg] = useState('')

  const { mutate: withdraw, isPending } = useWithdraw()
  const invalidateWallet = useInvalidateWallet()
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const stopPolling = () => {
    if (pollingRef.current) { clearInterval(pollingRef.current); pollingRef.current = null }
  }

  // Polling toutes les 3s tant que PENDING
  useEffect(() => {
    if (pendingTx?.status === 'PENDING' && pendingTx.reference) {
      pollingRef.current = setInterval(async () => {
        try {
          const updated = await walletService.checkPayment(pendingTx.reference!)
          setPendingTx(prev => ({ ...prev!, ...updated }))
          if (updated.status !== 'PENDING') {
            stopPolling()
            invalidateWallet() // Mettre à jour le solde dans tous les cas (COMPLETED ou FAILED = remboursé)
            if (updated.status === 'COMPLETED') {
              setTimeout(onSuccess, 2000)
            }
          }
        } catch { /* polling silencieux */ }
      }, 3000)
    }
    return stopPolling
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingTx?.reference, pendingTx?.status])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    withdraw(
      { amount: Number(amount), phoneNumber: formatCmPhone(phone), provider },
      {
        onSuccess: (response) => {
          setServerMsg(response.message || '')
          setPendingTx(response.data)
          invalidateWallet() // Le solde est déduit immédiatement
        },
      }
    )
  }

  const sel = PROVIDERS.find(p => p.id === provider)!
  const amountNum = Number(amount)
  const isOverMax = amountNum > maxAmount

  // ─── Vue résultat post-soumission ─────────────────────────────────────────
  if (pendingTx) {
    const borderCol = pendingTx.status === 'COMPLETED' ? '#22c55e'
                    : pendingTx.status === 'FAILED'    ? '#ef4444'
                    : sel.color
    return (
      <AnimatePresence mode="wait">
        <motion.div key="result" initial={{ opacity:0,y:12 }} animate={{ opacity:1,y:0 }}
          className="space-y-5 text-center py-2">

          <div className="rounded-2xl p-5 border" style={{ background:'rgba(255,255,255,0.04)', borderColor:borderCol }}>
            <div className="flex items-center justify-center gap-3 mb-3">
              {pendingTx.status === 'PENDING'   ? <Spinner /> :
               pendingTx.status === 'COMPLETED' ? <span className="text-3xl text-green-400">&#10003;</span> :
               <span className="text-3xl text-red-400">&#10005;</span>}
              <span className="font-bold text-lg">
                {pendingTx.status === 'PENDING'   ? 'Virement en cours...' :
                 pendingTx.status === 'COMPLETED' ? 'Retrait effectue !' : 'Retrait echoue'}
              </span>
            </div>
            <p className="text-sm text-text-muted mb-4">{STATUS_LABELS[pendingTx.status]}</p>

            <div className="pt-4 border-t border-surface-2 text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-text-muted">Montant retire</span>
                <span className="font-mono font-bold text-white">
                  {Number(pendingTx.amount).toLocaleString('fr-CM')} XAF
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Reference</span>
                <span className="font-mono text-xs text-text-muted">{pendingTx.reference}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Reseau</span>
                <span className="font-bold" style={{ color:sel.color }}>{sel.shortLabel}</span>
              </div>
            </div>
          </div>

          {serverMsg && <p className="text-xs text-text-muted italic">{serverMsg}</p>}

          {pendingTx.status === 'PENDING' && (
            <p className="text-xs text-text-muted animate-pulse">
              Verification automatique toutes les 3 secondes...
            </p>
          )}

          {pendingTx.status !== 'PENDING' && (
            <Button type="button" variant="ghost" className="w-full"
              onClick={() => { setPendingTx(null); setAmount(''); setPhone('') }}>
              Nouveau retrait
            </Button>
          )}
        </motion.div>
      </AnimatePresence>
    )
  }

  // ─── Vue formulaire ────────────────────────────────────────────────────────
  return (
    <motion.form onSubmit={handleSubmit} className="space-y-5"
      initial={{ opacity:0 }} animate={{ opacity:1 }}>

      {/* Solde disponible */}
      <div className="rounded-xl p-3 border border-surface-2 bg-surface/50 flex justify-between items-center text-sm">
        <span className="text-text-muted">Solde disponible</span>
        <span className="font-mono font-bold text-white">
          {maxAmount.toLocaleString('fr-CM')} XAF
        </span>
      </div>

      {/* Sélecteur provider */}
      <div>
        <label className="block text-sm font-medium text-text-muted mb-2">
          Reseau de reception
        </label>
        <div className="grid grid-cols-2 gap-3">
          {PROVIDERS.map(p => (
            <button key={p.id} type="button" onClick={() => setProvider(p.id)}
              className="relative p-4 rounded-xl border-2 text-sm font-semibold transition-all duration-200"
              style={{
                borderColor: provider === p.id ? p.color : 'rgba(255,255,255,0.1)',
                background:  provider === p.id ? `${p.color}18` : 'rgba(255,255,255,0.03)',
                color:       provider === p.id ? p.color : '#888',
                transform:   provider === p.id ? 'scale(1.03)' : 'scale(1)',
              }}>
              <div className="w-9 h-9 rounded-full flex items-center justify-center font-black text-lg mx-auto mb-2"
                style={{ background: p.bgGradient, color:'#fff' }}>
                {p.logo}
              </div>
              <div className="text-xs leading-tight">{p.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Montant + raccourcis */}
      <div>
        <Input label="Montant a retirer (XAF)" type="number" min="1000" step="100"
          max={maxAmount} value={amount} onChange={e => setAmount(e.target.value)}
          placeholder="Min 1 000 XAF" required />
        {isOverMax && (
          <p className="text-xs text-red-400 mt-1">
            Montant superieur a votre solde disponible ({maxAmount.toLocaleString('fr-CM')} XAF)
          </p>
        )}
        <div className="flex gap-2 mt-2">
          {[1000, 2000, 5000].filter(v => v <= maxAmount).map(v => (
            <button key={v} type="button" onClick={() => setAmount(String(v))}
              className="flex-1 py-1.5 rounded-lg text-xs font-medium border transition-colors"
              style={{
                borderColor: amount === String(v) ? sel.color : 'rgba(255,255,255,0.1)',
                color:       amount === String(v) ? sel.color : '#777',
                background:  amount === String(v) ? `${sel.color}15` : 'transparent',
              }}>
              {v >= 1000 ? `${v/1000}k` : v}
            </button>
          ))}
          {maxAmount >= 1000 && (
            <button type="button" onClick={() => setAmount(String(Math.floor(maxAmount)))}
              className="flex-1 py-1.5 rounded-lg text-xs font-medium border transition-colors"
              style={{
                borderColor: amount === String(Math.floor(maxAmount)) ? sel.color : 'rgba(255,255,255,0.1)',
                color:       amount === String(Math.floor(maxAmount)) ? sel.color : '#777',
                background:  amount === String(Math.floor(maxAmount)) ? `${sel.color}15` : 'transparent',
              }}>
              Max
            </button>
          )}
        </div>
      </div>

      {/* Téléphone */}
      <div>
        <Input label={`Numero de reception ${sel.shortLabel}`} type="tel"
          value={phone} onChange={e => setPhone(e.target.value)}
          placeholder="Ex: 677 00 00 00" required />
        <p className="text-xs text-text-muted mt-1">Fonds envoyes sur ce numero</p>
      </div>

      {/* Récapitulatif */}
      {amount && amountNum >= 1000 && !isOverMax && (
        <motion.div initial={{ opacity:0,height:0 }} animate={{ opacity:1,height:'auto' }}
          className="rounded-xl p-4 border text-sm"
          style={{ borderColor:`${sel.color}40`, background:`${sel.color}0D` }}>
          <p className="font-semibold mb-2" style={{ color:sel.color }}>Recapitulatif</p>
          <div className="space-y-1 text-text-muted">
            <div className="flex justify-between">
              <span>Reseau</span>
              <span className="font-bold" style={{ color:sel.color }}>{sel.label}</span>
            </div>
            <div className="flex justify-between">
              <span>Montant retire</span>
              <span className="font-mono text-white font-bold">
                {amountNum.toLocaleString('fr-CM')} XAF
              </span>
            </div>
            <div className="flex justify-between">
              <span>Solde apres retrait</span>
              <span className="font-mono text-text-muted">
                {(maxAmount - amountNum).toLocaleString('fr-CM')} XAF
              </span>
            </div>
          </div>
        </motion.div>
      )}

      <Button type="submit" variant="primary" size="lg" isLoading={isPending}
        disabled={!amount || amountNum < 1000 || isOverMax || !phone}>
        {isPending ? 'Traitement en cours...' : `Retirer via ${sel.shortLabel}`}
      </Button>
    </motion.form>
  )
}

