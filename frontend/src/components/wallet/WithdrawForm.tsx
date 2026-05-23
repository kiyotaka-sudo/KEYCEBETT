import React, { useState } from 'react'
import { useWithdraw } from '@/hooks/useWallet'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'

/**
 * TODO - AMI 1 : Intégrer l'API de paiement ici
 * Providers cibles : MTN Mobile Money (+237 6XX), Orange Money (+237 6XX)
 * Brancher sur POST /api/wallet/withdraw
 */
export const WithdrawForm: React.FC<{ onSuccess: () => void, maxAmount: number }> = ({ onSuccess, maxAmount }) => {
  const [amount, setAmount] = useState<string>('')
  const [phone, setPhone] = useState<string>('')
  const [provider, setProvider] = useState<'MTN' | 'ORANGE'>('MTN')
  
  const { mutate: withdraw, isPending } = useWithdraw()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    withdraw({
      amount: Number(amount),
      phoneNumber: phone,
      provider: provider
    }, {
      onSuccess: () => {
        onSuccess()
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="text-xs text-text-muted mb-2 text-right">
        Retirable: <span className="text-white font-mono font-bold">{maxAmount} XAF</span>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <button
          type="button"
          onClick={() => setProvider('MTN')}
          className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
            provider === 'MTN' ? 'border-primary bg-primary/10 text-primary' : 'border-surface-2 bg-surface text-text-muted'
          }`}
        >
          MTN Mobile Money
        </button>
        <button
          type="button"
          onClick={() => setProvider('ORANGE')}
          className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
            provider === 'ORANGE' ? 'border-primary bg-primary/10 text-primary' : 'border-surface-2 bg-surface text-text-muted'
          }`}
        >
          Orange Money
        </button>
      </div>

      <Input 
        label="Montant (XAF)"
        type="number"
        min="100"
        max={maxAmount}
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Min 100 XAF"
        required
      />

      <Input 
        label="Numéro de compte de réception"
        type="tel"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="Ex: 699123456"
        required
      />

      <Button type="submit" variant="primary" className="w-full mt-6" isLoading={isPending} disabled={Number(amount) > maxAmount}>
        Confirmer le retrait
      </Button>
    </form>
  )
}
