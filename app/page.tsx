'use client'

import { useAuth } from './context/AuthContext'
import { useTheme } from './context/ThemeContext'
import Dashboard from './components/Dashboard'
import LandingPage from './components/LandingPage'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect } from 'react'

export default function Home() {
  const { user, loading } = useAuth()
  const { isDarkMode, toggleDarkMode } = useTheme()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // If user is logged in and on auth pages, redirect to dashboard
    if (user && (pathname === '/auth/login' || pathname === '/auth/register')) {
      router.push('/dashboard')
    }
    
    // If user is not logged in and on dashboard, redirect to home
    if (!user && !loading && pathname === '/dashboard') {
      router.push('/')
    }
  }, [user, loading, pathname, router])

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
      </div>
    )
  }

  // If on auth pages, don't render anything (let the auth pages handle themselves)
  if (pathname === '/auth/login' || pathname === '/auth/register') {
    return null
  }

  // If user is logged in, show dashboard
  if (user) {
    return <Dashboard />
  }

  // Otherwise show landing page
  return <LandingPage />
} 