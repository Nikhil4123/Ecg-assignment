'use client'

import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import { useNotifications } from '../../context/NotificationContext'
import { User, Mail, Lock, Eye, EyeOff, Loader2, CheckCircle, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import ThemeToggle from '../../components/ThemeToggle'
import NotificationContainer from '../../components/NotificationContainer'

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const { isDarkMode } = useTheme()
  const { success, error: showError, warning } = useNotifications()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      const errorMessage = 'Passwords do not match'
      setError(errorMessage)
      showError('Validation Error', errorMessage)
      return
    }

    if (password.length < 6) {
      const errorMessage = 'Password must be at least 6 characters long'
      setError(errorMessage)
      warning('Password Requirements', errorMessage)
      return
    }

    setLoading(true)
    const registerSuccess = await register(name, email, password)
    if (registerSuccess) {
      success('Registration Successful', 'Welcome to ESG Platform! Your account has been created successfully.')
      // Redirect to dashboard on successful registration
      setTimeout(() => {
        window.location.href = '/dashboard'
      }, 2000)
    } else {
      const errorMessage = 'Registration failed. Email might already be in use.'
      setError(errorMessage)
      showError('Registration Failed', errorMessage)
    }
    setLoading(false)
  }

  const passwordRequirements = [
    { label: 'At least 6 characters', met: password.length >= 6 },
    { label: 'Contains a number', met: /\d/.test(password) },
    { label: 'Contains a letter', met: /[a-zA-Z]/.test(password) },
  ]

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} flex flex-col`}>
      <NotificationContainer />
      {/* Header */}
      <header className={`px-6 py-4 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-sm"></div>
            </div>
            <span className="text-xl font-bold">ESG Platform</span>
          </div>

          {/* Right side controls */}
          <div className="flex items-center space-x-4">
            {/* Dark mode toggle */}
            <ThemeToggle variant="switch" size="md" />

            {/* Back to home */}
            <Link
              href="/"
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                isDarkMode 
                  ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className={`max-w-md w-full ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-2xl border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} p-8 animate-bounce-in`}>
          <div className="space-y-6">
            {/* Welcome Header */}
            <div className="text-center">
              <div className={`w-16 h-16 mx-auto mb-4 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} flex items-center justify-center`}>
                <User className={`w-8 h-8 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
              </div>
              <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Create your account
              </h1>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mt-2`}>
                Join the ESG Platform community
              </p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label htmlFor="name" className={`block text-xs font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                    Full Name
                  </label>
                  <div className="relative">
                    <div className={`absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      <User className="h-4 w-4" />
                    </div>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={`pl-8 appearance-none relative block w-full px-2 py-2 border rounded-md focus:outline-none focus:ring-2 focus:z-10 text-sm transition-all duration-200 ${
                        isDarkMode 
                          ? 'border-gray-600 placeholder-gray-400 text-white bg-gray-700 focus:ring-green-500 focus:border-green-500 hover:border-gray-500' 
                          : 'border-gray-300 placeholder-gray-500 text-gray-900 focus:ring-green-500 focus:border-green-500 hover:border-gray-400'
                      }`}
                      placeholder="Full name"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label htmlFor="email" className={`block text-xs font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                    Email
                  </label>
                  <div className="relative">
                    <div className={`absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      <Mail className="h-4 w-4" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`pl-8 appearance-none relative block w-full px-2 py-2 border rounded-md focus:outline-none focus:ring-2 focus:z-10 text-sm transition-all duration-200 ${
                        isDarkMode 
                          ? 'border-gray-600 placeholder-gray-400 text-white bg-gray-700 focus:ring-green-500 focus:border-green-500 hover:border-gray-500' 
                          : 'border-gray-300 placeholder-gray-500 text-gray-900 focus:ring-green-500 focus:border-green-500 hover:border-gray-400'
                      }`}
                      placeholder="Email"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  Password
                </label>
                <div className="relative">
                  <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    <Lock className="h-5 w-5" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`pl-10 pr-10 appearance-none relative block w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:z-10 text-sm transition-all duration-200 ${
                      isDarkMode 
                        ? 'border-gray-600 placeholder-gray-400 text-white bg-gray-700 focus:ring-green-500 focus:border-green-500 hover:border-gray-500' 
                        : 'border-gray-300 placeholder-gray-500 text-gray-900 focus:ring-green-500 focus:border-green-500 hover:border-gray-400'
                    }`}
                    placeholder="Create a strong password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute inset-y-0 right-0 pr-3 flex items-center ${isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                
                {/* Password Requirements */}
                {password && (
                  <div className="mt-2 space-y-1">
                    {passwordRequirements.map((requirement, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <CheckCircle className={`w-4 h-4 ${requirement.met ? 'text-green-500' : 'text-gray-400'}`} />
                        <span className={`text-xs ${requirement.met ? (isDarkMode ? 'text-green-400' : 'text-green-600') : (isDarkMode ? 'text-gray-500' : 'text-gray-500')}`}>
                          {requirement.label}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="confirmPassword" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  Confirm Password
                </label>
                <div className="relative">
                  <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    <Lock className="h-5 w-5" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`pl-10 pr-10 appearance-none relative block w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:z-10 text-sm transition-all duration-200 ${
                      isDarkMode 
                        ? 'border-gray-600 placeholder-gray-400 text-white bg-gray-700 focus:ring-green-500 focus:border-green-500 hover:border-gray-500' 
                        : 'border-gray-300 placeholder-gray-500 text-gray-900 focus:ring-green-500 focus:border-green-500 hover:border-gray-400'
                    }`}
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className={`absolute inset-y-0 right-0 pr-3 flex items-center ${isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                
                {/* Password Match Indicator */}
                {confirmPassword && (
                  <div className="flex items-center space-x-2 mt-1">
                    <CheckCircle className={`w-4 h-4 ${password === confirmPassword ? 'text-green-500' : 'text-gray-400'}`} />
                    <span className={`text-xs ${password === confirmPassword ? (isDarkMode ? 'text-green-400' : 'text-green-600') : (isDarkMode ? 'text-gray-500' : 'text-gray-500')}`}>
                      {password === confirmPassword ? 'Passwords match' : 'Passwords do not match'}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex items-center">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  required
                  className={`h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500 ${
                    isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white'
                  }`}
                />
                <label htmlFor="terms" className={`ml-2 block text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  I agree to the{' '}
                  <a href="#" className={`font-medium hover:underline ${isDarkMode ? 'text-green-400 hover:text-green-300' : 'text-green-600 hover:text-green-500'}`}>
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="#" className={`font-medium hover:underline ${isDarkMode ? 'text-green-400 hover:text-green-300' : 'text-green-600 hover:text-green-500'}`}>
                    Privacy Policy
                  </a>
                </label>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] shadow-lg"
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Creating account...</span>
                    </div>
                  ) : (
                    'Create account'
                  )}
                </button>
              </div>
            </form>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className={`w-full border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-300'}`} />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className={`px-2 ${isDarkMode ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-500'}`}>
                  Or continue with
                </span>
              </div>
            </div>

            {/* Social Login Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                className={`w-full inline-flex justify-center py-2 px-4 border rounded-lg shadow-sm text-sm font-medium transition-colors ${
                  isDarkMode 
                    ? 'border-gray-600 bg-gray-700 text-gray-300 hover:bg-gray-600' 
                    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="ml-2">Google</span>
              </button>
              <button
                type="button"
                className={`w-full inline-flex justify-center py-2 px-4 border rounded-lg shadow-sm text-sm font-medium transition-colors ${
                  isDarkMode 
                    ? 'border-gray-600 bg-gray-700 text-gray-300 hover:bg-gray-600' 
                    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
                <span className="ml-2">Twitter</span>
              </button>
            </div>

            {/* Sign in link */}
            <div className="text-center">
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Already have an account?{' '}
                <Link href="/auth/login" className={`font-medium hover:underline ${isDarkMode ? 'text-green-400 hover:text-green-300' : 'text-green-600 hover:text-green-500'}`}>
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
