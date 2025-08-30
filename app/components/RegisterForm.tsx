'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { useNotifications } from '../context/NotificationContext'
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  UserPlus, 
  User, 
  Shield, 
  Sparkles,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Check,
  X
} from 'lucide-react'

export default function RegisterForm() {
  const router = useRouter()
  const { register } = useAuth()
  const { isDarkMode } = useTheme()
  const { success, error: showError } = useNotifications()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  // Password validation
  const passwordRequirements = {
    length: password.length >= 6,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
  }

  const allRequirementsMet = Object.values(passwordRequirements).every(Boolean)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      showError('Validation Error', 'Passwords do not match')
      return
    }

    if (!allRequirementsMet) {
      showError('Password Requirements', 'Please meet all password requirements')
      return
    }

    setLoading(true)

    try {
      const registerSuccess = await register(name, email, password)
      if (registerSuccess) {
        success('Registration Successful', `Welcome ${name}! Redirecting to dashboard...`)
        setTimeout(() => router.push('/dashboard'), 1000)
      } else {
        showError('Registration Failed', 'Unable to create account. Please try again.')
      }
    } catch (error) {
      showError('Registration Error', 'An unexpected error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 ${isDarkMode ? 'bg-dark-bg' : 'bg-light-bg'} transition-all duration-300`}>
      <div className="max-w-md w-full space-y-8 animate-fade-in-up">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center mb-6 animate-bounce-in">
            <UserPlus className="h-8 w-8 text-white" />
          </div>
          <h2 className={`text-3xl font-bold ${isDarkMode ? 'text-dark-text' : 'text-light-text'} gradient-text`}>
            Create Account
          </h2>
          <p className={`mt-2 text-sm ${isDarkMode ? 'text-dark-textSecondary' : 'text-light-textSecondary'}`}>
            Join the ESG Platform community
          </p>
        </div>

        {/* Form */}
        <div className={`card p-8 animate-fade-in-up`} style={{ animationDelay: '0.2s' }}>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className={`block text-sm font-medium ${isDarkMode ? 'text-dark-text' : 'text-light-text'} mb-2`}>
                Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-enhanced pr-10"
                  placeholder="Enter your full name"
                  required
                />
                <User className={`absolute right-3 top-3 h-5 w-5 ${isDarkMode ? 'text-dark-textSecondary' : 'text-light-textSecondary'}`} />
              </div>
            </div>

            <div>
              <label htmlFor="email" className={`block text-sm font-medium ${isDarkMode ? 'text-dark-text' : 'text-light-text'} mb-2`}>
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-enhanced pr-10"
                  placeholder="Enter your email"
                  required
                />
                <Mail className={`absolute right-3 top-3 h-5 w-5 ${isDarkMode ? 'text-dark-textSecondary' : 'text-light-textSecondary'}`} />
              </div>
            </div>

            <div>
              <label htmlFor="password" className={`block text-sm font-medium ${isDarkMode ? 'text-dark-text' : 'text-light-text'} mb-2`}>
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-enhanced pr-10"
                  placeholder="Create a strong password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-3 top-3 ${isDarkMode ? 'text-dark-textSecondary hover:text-dark-text' : 'text-light-textSecondary hover:text-light-text'}`}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>

              {/* Password Requirements */}
              {password && (
                <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className={`text-xs font-medium mb-2 ${isDarkMode ? 'text-dark-text' : 'text-light-text'}`}>
                    Password Requirements:
                  </p>
                  <div className="space-y-1">
                    {Object.entries(passwordRequirements).map(([key, met]) => (
                      <div key={key} className="flex items-center text-xs">
                        {met ? (
                          <Check className="h-3 w-3 text-green-500 mr-2" />
                        ) : (
                          <X className="h-3 w-3 text-red-500 mr-2" />
                        )}
                        <span className={`${met ? 'text-green-600' : 'text-red-600'}`}>
                          {key === 'length' && 'At least 6 characters'}
                          {key === 'uppercase' && 'One uppercase letter'}
                          {key === 'lowercase' && 'One lowercase letter'}
                          {key === 'number' && 'One number'}
                          {key === 'special' && 'One special character'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className={`block text-sm font-medium ${isDarkMode ? 'text-dark-text' : 'text-light-text'} mb-2`}>
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="input-enhanced pr-10"
                  placeholder="Confirm your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className={`absolute right-3 top-3 ${isDarkMode ? 'text-dark-textSecondary hover:text-dark-text' : 'text-light-textSecondary hover:text-light-text'}`}
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {confirmPassword && password !== confirmPassword && (
                <p className="text-red-500 text-xs mt-1">Passwords do not match</p>
              )}
            </div>

            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                required
              />
              <label htmlFor="terms" className={`ml-2 block text-sm ${isDarkMode ? 'text-dark-textSecondary' : 'text-light-textSecondary'}`}>
                I agree to the{' '}
                <a href="#" className={`font-medium ${isDarkMode ? 'text-dark-accent hover:text-dark-accentHover' : 'text-light-accent hover:text-light-accentHover'} transition-colors`}>
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className={`font-medium ${isDarkMode ? 'text-dark-accent hover:text-dark-accentHover' : 'text-light-accent hover:text-light-accentHover'} transition-colors`}>
                  Privacy Policy
                </a>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading || !allRequirementsMet || password !== confirmPassword}
              className="btn-primary w-full group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating account...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <UserPlus className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                  Create Account
                </div>
              )}
            </button>
          </form>

          {/* Sign In Link */}
          <div className="mt-6 text-center">
            <p className={`text-sm ${isDarkMode ? 'text-dark-textSecondary' : 'text-light-textSecondary'}`}>
              Already have an account?{' '}
              <button
                onClick={() => router.push('/auth/login')}
                className={`font-medium ${isDarkMode ? 'text-dark-accent hover:text-dark-accentHover' : 'text-light-accent hover:text-light-accentHover'} transition-colors group`}
              >
                Sign in
                <ArrowLeft className="inline h-4 w-4 ml-1 group-hover:-translate-x-1 transition-transform" />
              </button>
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <div className={`card p-4 text-center hover-lift`}>
            <Shield className={`h-8 w-8 mx-auto mb-2 ${isDarkMode ? 'text-dark-accent' : 'text-light-accent'}`} />
            <h3 className={`text-sm font-medium ${isDarkMode ? 'text-dark-text' : 'text-light-text'}`}>Secure</h3>
            <p className={`text-xs ${isDarkMode ? 'text-dark-textSecondary' : 'text-light-textSecondary'}`}>Bank-level security</p>
          </div>
          <div className={`card p-4 text-center hover-lift`}>
            <Sparkles className={`h-8 w-8 mx-auto mb-2 ${isDarkMode ? 'text-dark-accent' : 'text-light-accent'}`} />
            <h3 className={`text-sm font-medium ${isDarkMode ? 'text-dark-text' : 'text-light-text'}`}>Modern</h3>
            <p className={`text-xs ${isDarkMode ? 'text-dark-textSecondary' : 'text-light-textSecondary'}`}>Latest features</p>
          </div>
          <div className={`card p-4 text-center hover-lift`}>
            <CheckCircle className={`h-8 w-8 mx-auto mb-2 ${isDarkMode ? 'text-dark-accent' : 'text-light-accent'}`} />
            <h3 className={`text-sm font-medium ${isDarkMode ? 'text-dark-text' : 'text-light-text'}`}>Reliable</h3>
            <p className={`text-xs ${isDarkMode ? 'text-dark-textSecondary' : 'text-light-textSecondary'}`}>99.9% uptime</p>
          </div>
        </div>
      </div>
    </div>
  )
} 