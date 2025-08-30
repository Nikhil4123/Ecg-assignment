'use client'

import Link from 'next/link'
import { useTheme } from '../context/ThemeContext'
import { 
  BarChart3, 
  FileText, 
  Clock, 
  User, 
  Download,
  Home
} from 'lucide-react'

interface DashboardNavProps {
  currentPage?: string
}

export default function DashboardNav({ currentPage = 'dashboard' }: DashboardNavProps) {
  const { isDarkMode } = useTheme()

  const navItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: Home,
      description: 'Overview and analytics'
    },
    {
      name: 'Questionnaire',
      href: '/dashboard?tab=questionnaire',
      icon: FileText,
      description: 'Complete ESG questionnaire'
    },
    {
      name: 'Past Responses',
      href: '/dashboard?tab=past-responses',
      icon: Clock,
      description: 'View previous submissions'
    },
    {
      name: 'Export Manager',
      href: '/export',
      icon: Download,
      description: 'Export data in various formats'
    },
    {
      name: 'Profile',
      href: '/profile',
      icon: User,
      description: 'Manage your account'
    }
  ]

  return (
    <nav className={`mb-8 p-4 rounded-lg border ${
      isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    }`}>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = currentPage === item.name.toLowerCase().replace(' ', '-')
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`p-4 rounded-lg border transition-all duration-200 hover:scale-105 ${
                isActive
                  ? isDarkMode 
                    ? 'bg-blue-600 border-blue-500 text-white' 
                    : 'bg-blue-600 border-blue-500 text-white'
                  : isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600 hover:border-gray-500' 
                    : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100 hover:border-gray-300'
              }`}
            >
              <div className="flex flex-col items-center text-center space-y-2">
                <Icon className={`w-6 h-6 ${isActive ? 'text-white' : isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                <div>
                  <div className={`text-sm font-medium ${isActive ? 'text-white' : isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                    {item.name}
                  </div>
                  <div className={`text-xs ${isActive ? 'text-blue-100' : isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                    {item.description}
                  </div>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
