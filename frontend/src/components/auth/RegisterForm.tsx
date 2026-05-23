import React, { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

export const RegisterForm: React.FC = () => {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  })
  
  const { register, isLoading } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (step === 1) {
      setStep(2)
      return
    }
    
    if (formData.password !== formData.confirmPassword) {
      alert("Les mots de passe ne correspondent pas")
      return
    }

    try {
      await register({
        username: formData.username,
        email: formData.email,
        phone: formData.phone,
        password: formData.password
      })
      navigate('/')
    } catch (error) {
      // Error handled by store
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Progress indicator */}
      <div className="flex justify-center space-x-2 mb-6">
        <div className={`h-1.5 w-12 rounded-full ${step >= 1 ? 'bg-primary' : 'bg-surface-2'}`} />
        <div className={`h-1.5 w-12 rounded-full ${step >= 2 ? 'bg-primary' : 'bg-surface-2'}`} />
      </div>

      <AnimatePresence mode="wait">
        {step === 1 ? (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-4"
          >
            <Input
              label="Nom d'utilisateur"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Ex: KeycePlayer"
              required
            />
            <Input
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="votre@email.com"
              required
            />
            <Button type="submit" className="w-full mt-4">
              Continuer
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-4"
          >
            <Input
              label="Numéro de téléphone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Ex: +237 6XX XX XX XX"
              required
            />
            <Input
              label="Mot de passe"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              minLength={6}
            />
            <Input
              label="Confirmer le mot de passe"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />
            
            <div className="flex space-x-3 mt-6">
              <Button type="button" variant="ghost" className="w-1/3" onClick={() => setStep(1)}>
                Retour
              </Button>
              <Button type="submit" className="w-2/3" isLoading={isLoading}>
                Créer mon compte
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  )
}
