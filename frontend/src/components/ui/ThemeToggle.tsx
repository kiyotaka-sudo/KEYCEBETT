import React from 'react'
import { useUiStore } from '@/store/uiStore'
import { Sun, Moon } from 'lucide-react'
import { motion } from 'framer-motion'

export const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useUiStore()
  const isDark = theme === 'dark'

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="relative p-2 rounded-full hover:bg-surface-2 transition-colors flex items-center justify-center overflow-hidden"
      aria-label="Basculer le thème"
    >
      <motion.div
        initial={false}
        animate={{
          scale: isDark ? 1 : 0,
          opacity: isDark ? 1 : 0,
          rotate: isDark ? 0 : -90
        }}
        transition={{ duration: 0.2 }}
        className="absolute"
      >
        <Moon size={20} className="text-primary" />
      </motion.div>
      <motion.div
        initial={false}
        animate={{
          scale: !isDark ? 1 : 0,
          opacity: !isDark ? 1 : 0,
          rotate: !isDark ? 0 : 90
        }}
        transition={{ duration: 0.2 }}
      >
        <Sun size={20} className="text-primary" />
      </motion.div>
    </button>
  )
}
