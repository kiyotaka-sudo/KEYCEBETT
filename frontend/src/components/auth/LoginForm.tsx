import React, { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'
import { useNavigate, Link } from 'react-router-dom'

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login, isLoading } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await login({ email, password })
      navigate('/')
    } catch (error) {
      // Error is handled by toast in authStore
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="votre@email.com"
        required
      />
      <Input
        label="Mot de passe"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="••••••••"
        required
      />
      <div className="flex justify-end">
        <Link to="#" className="text-xs text-primary hover:underline">Mot de passe oublié ?</Link>
      </div>
      <Button type="submit" className="w-full mt-4" isLoading={isLoading}>
        Se connecter
      </Button>
    </form>
  )
}
