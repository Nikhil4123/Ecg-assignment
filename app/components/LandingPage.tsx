'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTheme } from '../context/ThemeContext'
import ThemeToggle from './ThemeToggle'
import { 
  ArrowRight, 
  CheckCircle, 
  Star, 
  Users, 
  Shield, 
  Zap, 
  TrendingUp,
  Globe,
  Award,
  Sparkles,
  Play,
  Menu,
  X,
  ChevronDown,
  BarChart3,
  FileText,
  Download,
  Eye,
  Lock,
  Globe2,
  Target,
  Lightbulb,
  Building
} from 'lucide-react'

export default function LandingPage() {
  const router = useRouter()
  const { isDarkMode } = useTheme()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
    
    const handleScroll = () => {
      const sections = ['Hero', 'features', 'testimonials', 'cta']
      const scrollPosition = window.scrollY + 100
      
      for (let i = sections.length - 1; i >= 0; i--) {
        const element = document.getElementById(sections[i])
        if (element && scrollPosition >= element.offsetTop) {
          setActiveSection(sections[i])
          break
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const features = [
    {
      icon: Shield,
      title: 'Secure & Reliable',
      description: 'Bank-level security with 99.9% uptime guarantee',
      color: 'from-green-500 to-emerald-600'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Optimized performance for instant responses',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      icon: TrendingUp,
      title: 'Advanced Analytics',
      description: 'Comprehensive insights and detailed reporting',
      color: 'from-blue-500 to-indigo-600'
    },
    {
      icon: Globe,
      title: 'Global Access',
      description: 'Access your data from anywhere in the world',
      color: 'from-purple-500 to-pink-600'
    },
    {
      icon: Award,
      title: 'Industry Leading',
      description: 'Trusted by thousands of organizations worldwide',
      color: 'from-red-500 to-pink-500'
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Work together seamlessly with your team',
      color: 'from-indigo-500 to-blue-600'
    }
  ]

  const stats = [
    { label: 'Organizations', value: '10K+', icon: Building, color: 'from-blue-500 to-blue-600' },
    { label: 'Countries', value: '50+', icon: Globe2, color: 'from-green-500 to-green-600' },
    { label: 'Data Points', value: '1M+', icon: BarChart3, color: 'from-purple-500 to-purple-600' },
    { label: 'Uptime', value: '99.9%', icon: Shield, color: 'from-orange-500 to-orange-600' }
  ]

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'ESG Manager',
      company: 'TechCorp',
      content: 'This platform has revolutionized how we handle ESG assessments. The interface is intuitive and the analytics are invaluable.',
      rating: 5,
      avatar: 'SJ'
    },
    {
      name: 'Michael Chen',
      role: 'Sustainability Director',
      company: 'GreenFuture Inc',
      content: 'The best ESG platform we\'ve used. Fast, reliable, and packed with features that actually matter.',
      rating: 5,
      avatar: 'MC'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Compliance Officer',
      company: 'EcoSolutions',
      content: 'Outstanding platform that makes ESG compliance straightforward and efficient.',
      rating: 5,
      avatar: 'ER'
    }
  ]

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-dark-bg' : 'bg-light-bg'} transition-all duration-500`}>
      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-500 ${
        isDarkMode 
          ? 'bg-dark-bg/90 backdrop-blur-xl border-dark-border' 
          : 'bg-light-bg/90 backdrop-blur-xl border-light-border'
      } border-b shadow-lg`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <span className={`text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent`}>
                ESG Platform
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {['hero', 'features', 'testimonials', 'cta'].map((section) => (
                <button
                  key={section}
                  onClick={() => scrollToSection(section)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                    activeSection === section
                      ? `${isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-700'}`
                      : `${isDarkMode ? 'text-gray-300 hover:text-white hover:bg-gray-800' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`
                  }`}
                >
                  {section.charAt(0).toUpperCase() + section.slice(1)}
                </button>
              ))}
            </div>

            {/* Right side controls */}
            <div className="flex items-center space-x-4">
              <ThemeToggle variant="switch" size="md" />
              
              <button
                onClick={() => router.push('/auth/login')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                  isDarkMode 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl'
                }`}
              >
                Sign In
              </button>

              <button
                onClick={() => router.push('/auth/register')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                  isDarkMode 
                    ? 'bg-transparent border-2 border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white' 
                    : 'bg-transparent border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white'
                }`}
              >
                Get Started
              </button>

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className={`md:hidden border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="px-4 py-4 space-y-2">
              {['hero', 'features', 'testimonials', 'cta'].map((section) => (
                <button
                  key={section}
                  onClick={() => {
                    scrollToSection(section)
                    setMobileMenuOpen(false)
                  }}
                  className={`block w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${
                    activeSection === section
                      ? `${isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-700'}`
                      : `${isDarkMode ? 'text-gray-300 hover:text-white hover:bg-gray-800' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`
                  }`}
                >
                  {section.charAt(0).toUpperCase() + section.slice(1)}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="hero" className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className={`transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <h1 className={`text-5xl md:text-7xl font-bold mb-8 leading-tight ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Transform
              </span>{' '}
              Your ESG Journey
            </h1>
            
            <p className={`text-xl md:text-2xl mb-12 max-w-4xl mx-auto leading-relaxed ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              The most advanced Environmental, Social, and Governance assessment platform. 
              Streamline compliance, gain insights, and drive sustainable growth with AI-powered analytics.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <button
                onClick={() => router.push('/auth/register')}
                className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center space-x-2"
              >
                <span>Start Free Trial</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button
                onClick={() => scrollToSection('features')}
                className="px-8 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-xl text-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300 flex items-center space-x-2"
              >
                <Play className="w-5 h-5" />
                <span>Watch Demo</span>
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div
                  key={stat.label}
                  className={`transform transition-all duration-700 delay-${index * 100} ${
                    isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                  }`}
                >
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r ${stat.color} flex items-center justify-center shadow-lg`}>
                    <stat.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className={`text-3xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {stat.value}
                  </div>
                  <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Powerful Features for Modern ESG Management
            </h2>
            <p className={`text-xl max-w-3xl mx-auto ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Everything you need to assess, track, and improve your organization's ESG performance
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className={`group p-8 rounded-2xl border transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 ${
                  isDarkMode 
                    ? 'bg-gray-800/50 border-gray-700 hover:border-gray-600 hover:bg-gray-800' 
                    : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-2xl'
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`w-16 h-16 mb-6 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {feature.title}
                </h3>
                <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} leading-relaxed`}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Trusted by Industry Leaders
            </h2>
            <p className={`text-xl max-w-3xl mx-auto ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              See what our customers say about their ESG transformation journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.name}
                className={`p-8 rounded-2xl border transition-all duration-500 transform hover:scale-105 ${
                  isDarkMode 
                    ? 'bg-gray-800/50 border-gray-700 hover:border-gray-600' 
                    : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-xl'
                }`}
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold mr-4">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {testimonial.name}
                    </h4>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {testimonial.role} at {testimonial.company}
                    </p>
                  </div>
                </div>
                
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                
                <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} leading-relaxed italic`}>
                  "{testimonial.content}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="cta" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className={`p-12 rounded-3xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white shadow-2xl`}>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Transform Your ESG Strategy?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of organizations already using our platform to drive sustainable growth
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => router.push('/auth/register')}
                className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <span>Start Free Trial</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              
              <button
                onClick={() => router.push('/auth/login')}
                className="px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-xl text-lg hover:bg-white/10 transition-all duration-300"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`py-12 px-4 sm:px-6 lg:px-8 border-t ${
        isDarkMode ? 'border-gray-700 bg-gray-900/50' : 'border-gray-200 bg-gray-50'
      }`}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <span className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  ESG Platform
                </span>
              </div>
              <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Transforming ESG management with cutting-edge technology and insights.
              </p>
            </div>
            
            <div>
              <h3 className={`font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Product</h3>
              <ul className={`space-y-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <li><button onClick={() => scrollToSection('features')} className="hover:text-blue-500 transition-colors">Features</button></li>
                <li><button onClick={() => scrollToSection('testimonials')} className="hover:text-blue-500 transition-colors">Testimonials</button></li>
                <li><button onClick={() => router.push('/auth/register')} className="hover:text-blue-500 transition-colors">Pricing</button></li>
              </ul>
            </div>
            
            <div>
              <h3 className={`font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Company</h3>
              <ul className={`space-y-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <li><button className="hover:text-blue-500 transition-colors">About</button></li>
                <li><button className="hover:text-blue-500 transition-colors">Blog</button></li>
                <li><button className="hover:text-blue-500 transition-colors">Careers</button></li>
              </ul>
            </div>
            
            <div>
              <h3 className={`font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Support</h3>
              <ul className={`space-y-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <li><button className="hover:text-blue-500 transition-colors">Help Center</button></li>
                <li><button className="hover:text-blue-500 transition-colors">Contact</button></li>
                <li><button className="hover:text-blue-500 transition-colors">Status</button></li>
              </ul>
            </div>
          </div>
          
          <div className={`mt-8 pt-8 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} text-center`}>
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              © 2024 ESG Platform. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

