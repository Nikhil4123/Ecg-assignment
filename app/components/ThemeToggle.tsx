'use client'

import { useTheme } from '@/app/context/ThemeContext'
import { Sun, Moon } from 'lucide-react'
import { useState } from 'react'

interface ThemeToggleProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'button' | 'switch'
}

export default function ThemeToggle({ 
  className = '', 
  size = 'md',
  variant = 'button'
}: ThemeToggleProps) {
  const { isDarkMode, toggleDarkMode } = useTheme()
  const [isAnimating, setIsAnimating] = useState(false)

  const handleToggle = () => {
    setIsAnimating(true)
    toggleDarkMode()
    setTimeout(() => setIsAnimating(false), 300)
  }

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  }

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }

  if (variant === 'switch') {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <Sun className={`${iconSizes[size]} ${isDarkMode ? 'text-gray-400' : 'text-yellow-500'}`} />
        <button
          onClick={handleToggle}
          className={`
            relative inline-flex h-6 w-11 items-center rounded-full
            transition-colors duration-200 ease-in-out
            ${isDarkMode ? 'bg-blue-600' : 'bg-gray-300'}
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
            dark:focus:ring-offset-gray-800
            shadow-sm
          `}
          role="switch"
          aria-checked={isDarkMode}
          aria-label="Toggle dark mode"
        >
          <span
            className={`
              inline-block h-4 w-4 transform rounded-full bg-white shadow-md
              transition-transform duration-200 ease-in-out
              ${isDarkMode ? 'translate-x-6' : 'translate-x-1'}
              ${isAnimating ? 'scale-110' : 'scale-100'}
            `}
          />
        </button>
        <Moon className={`${iconSizes[size]} ${isDarkMode ? 'text-blue-400' : 'text-gray-400'}`} />
      </div>
    )
  }

  return (
    <button
      onClick={handleToggle}
      className={`
        ${sizeClasses[size]} ${className}
        relative rounded-lg border border-gray-200 dark:border-gray-700
        bg-white dark:bg-gray-800 
        hover:bg-gray-50 dark:hover:bg-gray-700
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        dark:focus:ring-offset-gray-800
        transition-all duration-200 ease-in-out
        flex items-center justify-center
        shadow-sm hover:shadow-md
        ${isAnimating ? 'scale-110' : 'scale-100'}
      `}
      aria-label="Toggle dark mode"
      title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <div className="relative">
        <Sun 
          className={`
            ${iconSizes[size]} absolute inset-0
            transition-all duration-300 ease-in-out
            ${isDarkMode 
              ? 'opacity-0 rotate-90 scale-0' 
              : 'opacity-100 rotate-0 scale-100'
            }
            text-yellow-500
          `} 
        />
        <Moon 
          className={`
            ${iconSizes[size]} absolute inset-0
            transition-all duration-300 ease-in-out
            ${isDarkMode 
              ? 'opacity-100 rotate-0 scale-100' 
              : 'opacity-0 -rotate-90 scale-0'
            }
            text-blue-400
          `} 
        />
      </div>
    </button>
  )
}
