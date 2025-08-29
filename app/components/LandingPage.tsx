'use client'

import { Moon, Sun, Play, ArrowRight, MoreVertical } from 'lucide-react'
import Link from 'next/link'

interface LandingPageProps {
  onGetStarted: () => void
  isDarkMode: boolean
  toggleDarkMode: () => void
}

export default function LandingPage({ onGetStarted, isDarkMode, toggleDarkMode }: LandingPageProps) {
  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
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

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="hover:text-green-400 transition-colors">Features</a>
             </nav>

          {/* Right side controls */}
          <div className="flex items-center space-x-4">
            {/* Dark mode toggle */}
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} transition-colors`}
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* More options
            <button className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} transition-colors`}>
              <MoreVertical className="w-5 h-5" />
            </button> */}

                                {/* Get Started button */}
                    <Link
                      href="/auth/register"
                      className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                    >
                      Get Started
                    </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center">
          <h1 className="text-6xl font-bold mb-6 animate-fade-in-down">
            Transform Your{' '}
            <span className="bg-gradient-to-r from-green-400 to-purple-600 bg-clip-text text-transparent animate-pulse-slow">
              ESG Management
            </span>
          </h1>
          
          <p className="text-xl mb-8 max-w-3xl mx-auto opacity-90 animate-fade-in-up">
            Comprehensive Environmental, Social, and Governance platform that empowers organizations to track, analyze, and report their sustainability performance with precision and ease.
          </p>

                            {/* Call to Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up" style={{ animationDelay: '300ms' }}>
                    <Link href="/auth/register" className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white px-8 py-4 rounded-lg font-medium flex items-center space-x-2 transition-all transform hover:scale-105 hover-lift">
                      <span>Start Free Trial</span>
                      <ArrowRight className="w-5 h-5" />
                    </Link>

                    <button className={`border ${isDarkMode ? 'border-gray-600 hover:border-gray-500' : 'border-gray-300 hover:border-gray-400'} px-8 py-4 rounded-lg font-medium flex items-center space-x-2 transition-colors hover-lift`}>
                      <Play className="w-5 h-5" />
                      <span>Watch Demo</span>
                    </button>
                  </div>
        </div>

        {/* Statistics Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20">
          {[
            { number: '500+', label: 'Companies Trust Us' },
            { number: '95%', label: 'Customer Satisfaction' },
            { number: '99.9%', label: 'Uptime Guarantee' },
            { number: '24/7', label: 'Support Available' }
          ].map((stat, index) => (
            <div 
              key={index}
              className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'} text-center hover-lift animate-fade-in-up`}
              style={{ animationDelay: `${(index + 1) * 200}ms` }}
            >
              <div className="text-3xl font-bold text-green-400 mb-2">{stat.number}</div>
              <div className="text-sm opacity-80">{stat.label}</div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
