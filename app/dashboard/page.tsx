'use client'

import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { useState } from 'react'
import { 
  LayoutDashboard, 
  FileText, 
  History, 
  LogOut, 
  Menu, 
  X, 
  Sun, 
  Moon,
  ChevronRight,
  User
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import ESGQuestionnaire from '../components/ESGQuestionnaire'
import SummaryPage from '../components/SummaryPage'
import PastResponses from '../components/PastResponses'

export default function DashboardPage() {
  const { user, logout } = useAuth()
  const { isDarkMode, toggleDarkMode } = useTheme()
  const [activeTab, setActiveTab] = useState('questionnaire')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  const menuItems = [
    {
      id: 'questionnaire',
      label: 'ESG Questionnaire',
      icon: FileText,
      component: ESGQuestionnaire
    },
    {
      id: 'summary',
      label: 'Analytics',
      icon: LayoutDashboard,
      component: SummaryPage
    },
    {
      id: 'responses',
      label: 'Past Responses',
      icon: History,
      component: PastResponses
    },
    {
      id: 'profile',
      label: 'Profile Settings',
      icon: User,
      component: null // This will be handled separately
    }
  ]

  const ActiveComponent = menuItems.find(item => item.id === activeTab)?.component

  const handleTabClick = (tabId: string) => {
    if (tabId === 'profile') {
      router.push('/profile')
    } else {
      setActiveTab(tabId)
    }
  }

  return (
    <div className={`h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} flex overflow-hidden`}>
      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:relative lg:translate-x-0
        ${isDarkMode ? 'bg-gray-800' : 'bg-white'} 
        border-r ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}
        shadow-xl flex flex-col h-screen
      `}>
        {/* Sidebar Header */}
        <div className={`p-6 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center space-x-3 animate-fade-in-down">
            <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg flex items-center justify-center hover-scale">
              <div className="w-6 h-6 bg-white rounded-sm"></div>
            </div>
            <div>
              <h1 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                ESG Platform
              </h1>
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Dashboard
              </p>
            </div>
          </div>
        </div>

        

                 {/* Navigation Menu */}
         <nav className="flex-1 p-4 space-y-2 overflow-y-auto min-h-0">
           {menuItems.map((item, index) => {
             const Icon = item.icon
             return (
               <button
                 key={item.id}
                 onClick={() => handleTabClick(item.id)}
                 className={`
                   w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 group hover-lift
                   ${activeTab === item.id
                     ? `${isDarkMode ? 'bg-green-600 text-white shadow-lg' : 'bg-green-500 text-white shadow-lg'}`
                     : `${isDarkMode ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'}`
                   }
                 `}
                 style={{ animationDelay: `${index * 100}ms` }}
               >
                 <Icon className={`w-5 h-5 transition-transform duration-200 ${activeTab === item.id ? 'scale-110' : ''}`} />
                 <span className="font-medium">{item.label}</span>
                 <ChevronRight className={`w-4 h-4 ml-auto transition-transform duration-200 ${activeTab === item.id ? 'rotate-90' : ''}`} />
               </button>
             )
           })}
         </nav>

        {/* Sidebar Footer */}
        <div className={`p-4 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="space-y-2">
            {/* Theme Toggle */}
            <button
              onClick={toggleDarkMode}
              className={`
                w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200
                ${isDarkMode ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'}
              `}
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              <span className="font-medium">
                {isDarkMode ? 'Light Mode' : 'Dark Mode'}
              </span>
            </button>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

             {/* Main Content */}
       <div className="flex-1 flex flex-col lg:ml-0 overflow-hidden h-screen">
         {/* Top Header */}
         <header className={`
           flex-shrink-0 z-30 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} 
           border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}
           shadow-sm
         `}>
          <div className="flex items-center justify-between px-6 py-4">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className={`p-2 rounded-lg lg:hidden ${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Page Title */}
            <div className="flex-1 lg:flex-none">
              <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {menuItems.find(item => item.id === activeTab)?.label}
              </h2>
            </div>

                         {/* Right side controls */}
             <div className="flex items-center space-x-4">
               {/* Theme Toggle */}
               <button
                 onClick={toggleDarkMode}
                 className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} transition-colors`}
               >
                 {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
               </button>

               {/* User Profile */}
               <div className="flex items-center space-x-3">
                 <div className="text-right hidden sm:block">
                   <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                     {user?.name || 'User'}
                   </p>
                   <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                     {user?.email}
                   </p>
                 </div>
                 <button
                   onClick={() => router.push('/profile')}
                   className={`w-10 h-10 rounded-full ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} flex items-center justify-center hover-scale cursor-pointer transition-colors`}
                 >
                   <User className={`w-5 h-5 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} />
                 </button>
               </div>
             </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="animate-fade-in-up">
            {ActiveComponent && <ActiveComponent />}
          </div>
        </main>
      </div>
    </div>
  )
}
