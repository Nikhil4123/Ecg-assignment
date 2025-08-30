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
  LogIn, 
  User, 
  Shield, 
  Sparkles,
  ArrowRight,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

export default function LoginForm() {
  const router = useRouter()
  const { login } = useAuth()
  const { isDarkMode } = useTheme()
  const { success, error: showError } = useNotifications()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const loginSuccess = await login(email, password)
      if (loginSuccess) {
        success('Login Successful', 'Welcome back! Redirecting to dashboard...')
        setTimeout(() => router.push('/dashboard'), 1000)
      } else {
        showError('Login Failed', 'Invalid email or password. Please try again.')
      }
    } catch (error) {
      showError('Login Error', 'An unexpected error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 ${isDarkMode ? 'bg-dark-bg' : 'bg-light-bg'} transition-all duration-300`}>
      <div className="max-w-md w-full space-y-8 animate-fade-in-up">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-6 animate-bounce-in">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <h2 className={`text-3xl font-bold ${isDarkMode ? 'text-dark-text' : 'text-light-text'} gradient-text`}>
            Welcome Back
          </h2>
          <p className={`mt-2 text-sm ${isDarkMode ? 'text-dark-textSecondary' : 'text-light-textSecondary'}`}>
            Sign in to your ESG Platform account
          </p>
        </div>

        {/* Form */}
        <div className={`card p-8 animate-fade-in-up`} style={{ animationDelay: '0.2s' }}>

          <form onSubmit={handleSubmit} className="space-y-6">
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
                  placeholder="Enter your password"
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
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className={`ml-2 block text-sm ${isDarkMode ? 'text-dark-textSecondary' : 'text-light-textSecondary'}`}>
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <a href="#" className={`font-medium ${isDarkMode ? 'text-dark-accent hover:text-dark-accentHover' : 'text-light-accent hover:text-light-accentHover'} transition-colors`}>
                  Forgot password?
                </a>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full group"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Signing in...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <LogIn className="h-4 w-4 mr-2 group-hover:translate-x-1 transition-transform" />
                  Sign In
                </div>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className={`w-full border-t ${isDarkMode ? 'border-dark-border' : 'border-light-border'}`} />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className={`px-2 ${isDarkMode ? 'bg-dark-bg text-dark-textSecondary' : 'bg-light-bg text-light-textSecondary'}`}>
                  Or continue with
                </span>
              </div>
            </div>
          </div>

          {/* Social Login Buttons */}
          <div className="mt-6 grid grid-cols-2 gap-3">
            <button className="btn-secondary group">
              <div className="flex items-center justify-center">
                <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="group-hover:translate-x-1 transition-transform">Google</span>
              </div>
            </button>
            <button className="btn-secondary group">
              <div className="flex items-center justify-center">
                <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
                <span className="group-hover:translate-x-1 transition-transform">Twitter</span>
              </div>
            </button>
          </div>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className={`text-sm ${isDarkMode ? 'text-dark-textSecondary' : 'text-light-textSecondary'}`}>
              Don't have an account?{' '}
              <button
                onClick={() => router.push('/auth/register')}
                className={`font-medium ${isDarkMode ? 'text-dark-accent hover:text-dark-accentHover' : 'text-light-accent hover:text-light-accentHover'} transition-colors group`}
              >
                Sign up
                <ArrowRight className="inline h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </button>
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <div className={`card p-4 text-center hover-lift`}>
            <User className={`h-8 w-8 mx-auto mb-2 ${isDarkMode ? 'text-dark-accent' : 'text-light-accent'}`} />
            <h3 className={`text-sm font-medium ${isDarkMode ? 'text-dark-text' : 'text-light-text'}`}>User Friendly</h3>
            <p className={`text-xs ${isDarkMode ? 'text-dark-textSecondary' : 'text-light-textSecondary'}`}>Easy to use interface</p>
          </div>
          <div className={`card p-4 text-center hover-lift`}>
            <Shield className={`h-8 w-8 mx-auto mb-2 ${isDarkMode ? 'text-dark-accent' : 'text-light-accent'}`} />
            <h3 className={`text-sm font-medium ${isDarkMode ? 'text-dark-text' : 'text-light-text'}`}>Secure</h3>
            <p className={`text-xs ${isDarkMode ? 'text-dark-textSecondary' : 'text-light-textSecondary'}`}>Your data is protected</p>
          </div>
          <div className={`card p-4 text-center hover-lift`}>
            <Sparkles className={`h-8 w-8 mx-auto mb-2 ${isDarkMode ? 'text-dark-accent' : 'text-light-accent'}`} />
            <h3 className={`text-sm font-medium ${isDarkMode ? 'text-dark-text' : 'text-light-text'}`}>Modern</h3>
            <p className={`text-xs ${isDarkMode ? 'text-dark-textSecondary' : 'text-light-textSecondary'}`}>Latest technology</p>
          </div>
        </div>
      </div>
    </div>
  )
} 