'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import LoginForm from './LoginForm'
import RegisterForm from './RegisterForm'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  isDarkMode: boolean
}

export default function AuthModal({ isOpen, onClose, isDarkMode }: AuthModalProps) {
  const [showLogin, setShowLogin] = useState(true)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className={`relative max-w-md w-full ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-2xl border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} animate-in zoom-in-95 duration-200`}>
        {/* Close button */}
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-700 text-gray-400 hover:text-gray-300' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'} transition-all duration-200`}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Tab buttons */}
        <div className="flex p-6 pt-8">
          <button
            onClick={() => setShowLogin(true)}
            className={`flex-1 py-3 px-4 text-sm font-medium rounded-lg transition-all duration-200 ${
              showLogin
                ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg'
                : isDarkMode 
                  ? 'text-gray-400 hover:text-white hover:bg-gray-700' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setShowLogin(false)}
            className={`flex-1 py-3 px-4 text-sm font-medium rounded-lg transition-all duration-200 ${
              !showLogin
                ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg'
                : isDarkMode 
                  ? 'text-gray-400 hover:text-white hover:bg-gray-700' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Form content */}
        <div className="px-6 pb-8">
          {showLogin ? <LoginForm /> : <RegisterForm />}
        </div>
      </div>
    </div>
  )
}
