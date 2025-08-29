'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTheme } from '../context/ThemeContext'
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
  X
} from 'lucide-react'

export default function LandingPage() {
  const router = useRouter()
  const { isDarkMode } = useTheme()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const features = [
    {
      icon: Shield,
      title: 'Secure & Reliable',
      description: 'Bank-level security with 99.9% uptime guarantee'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Optimized performance for instant responses'
    },
    {
      icon: TrendingUp,
      title: 'Advanced Analytics',
      description: 'Comprehensive insights and detailed reporting'
    },
    {
      icon: Globe,
      title: 'Global Access',
      description: 'Access your data from anywhere in the world'
    },
    {
      icon: Award,
      title: 'Industry Leading',
      description: 'Trusted by thousands of organizations worldwide'
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Work together seamlessly with your team'
    }
  ]

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'ESG Manager',
      company: 'TechCorp',
      content: 'This platform has revolutionized how we handle ESG assessments. The interface is intuitive and the analytics are invaluable.',
      rating: 5
    },
    {
      name: 'Michael Chen',
      role: 'Sustainability Director',
      company: 'GreenFuture Inc',
      content: 'The best ESG platform we\'ve used. Fast, reliable, and packed with features that actually matter.',
      rating: 5
    },
    {
      name: 'Emily Rodriguez',
      role: 'Compliance Officer',
      company: 'EcoSolutions',
      content: 'Outstanding platform that makes ESG compliance straightforward and efficient.',
      rating: 5
    }
  ]

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-dark-bg' : 'bg-light-bg'} transition-all duration-300`}>
      {/* Navigation */}
      <nav className={`fixed w-full z-50 ${isDarkMode ? 'bg-dark-bg/80 backdrop-blur-md' : 'bg-light-bg/80 backdrop-blur-md'} border-b ${isDarkMode ? 'border-dark-border' : 'border-light-border'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className={`text-xl font-bold ${isDarkMode ? 'text-dark-text' : 'text-light-text'}`}>
                ESG Platform
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className={`text-sm font-medium ${isDarkMode ? 'text-dark-text hover:text-dark-accent' : 'text-light-text hover:text-light-accent'} transition-colors`}>
                Features
              </a>
              <a href="#testimonials" className={`text-sm font-medium ${isDarkMode ? 'text-dark-text hover:text-dark-accent' : 'text-light-text hover:text-light-accent'} transition-colors`}>
                Testimonials
              </a>
              <a href="#pricing" className={`text-sm font-medium ${isDarkMode ? 'text-dark-text hover:text-dark-accent' : 'text-light-text hover:text-light-accent'} transition-colors`}>
                Pricing
              </a>
              <button
                onClick={() => router.push('/auth/login')}
                className="btn-secondary"
              >
                Sign In
              </button>
              <button
                onClick={() => router.push('/auth/register')}
                className="btn-primary"
              >
                Get Started
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`p-2 rounded-md ${isDarkMode ? 'text-dark-text hover:text-dark-accent' : 'text-light-text hover:text-light-accent'}`}
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden animate-fade-in-down">
            <div className={`px-2 pt-2 pb-3 space-y-1 ${isDarkMode ? 'bg-dark-card' : 'bg-light-card'} border-t ${isDarkMode ? 'border-dark-border' : 'border-light-border'}`}>
              <a href="#features" className={`block px-3 py-2 text-sm font-medium ${isDarkMode ? 'text-dark-text hover:text-dark-accent' : 'text-light-text hover:text-light-accent'} transition-colors`}>
                Features
              </a>
              <a href="#testimonials" className={`block px-3 py-2 text-sm font-medium ${isDarkMode ? 'text-dark-text hover:text-dark-accent' : 'text-light-text hover:text-light-accent'} transition-colors`}>
                Testimonials
              </a>
              <a href="#pricing" className={`block px-3 py-2 text-sm font-medium ${isDarkMode ? 'text-dark-text hover:text-dark-accent' : 'text-light-text hover:text-light-accent'} transition-colors`}>
                Pricing
              </a>
              <div className="pt-4 space-y-2">
                <button
                  onClick={() => router.push('/auth/login')}
                  className="w-full btn-secondary"
                >
                  Sign In
                </button>
                <button
                  onClick={() => router.push('/auth/register')}
                  className="w-full btn-primary"
                >
                  Get Started
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center animate-fade-in-up">
            <h1 className={`text-4xl md:text-6xl font-bold ${isDarkMode ? 'text-dark-text' : 'text-light-text'} mb-6`}>
              The Future of{' '}
              <span className="gradient-text">ESG Management</span>
            </h1>
            <p className={`text-xl md:text-2xl ${isDarkMode ? 'text-dark-textSecondary' : 'text-light-textSecondary'} mb-8 max-w-3xl mx-auto`}>
              Streamline your Environmental, Social, and Governance assessments with our comprehensive platform. 
              Get insights, track progress, and drive sustainable growth.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => router.push('/auth/register')}
                className="btn-primary group text-lg px-8 py-4"
              >
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="btn-secondary group text-lg px-8 py-4">
                <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                Watch Demo
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className={`card p-6 text-center hover-lift`}>
              <div className="text-3xl font-bold gradient-text mb-2">10,000+</div>
              <div className={`text-sm ${isDarkMode ? 'text-dark-textSecondary' : 'text-light-textSecondary'}`}>
                Active Users
              </div>
            </div>
            <div className={`card p-6 text-center hover-lift`}>
              <div className="text-3xl font-bold gradient-text mb-2">99.9%</div>
              <div className={`text-sm ${isDarkMode ? 'text-dark-textSecondary' : 'text-light-textSecondary'}`}>
                Uptime
              </div>
            </div>
            <div className={`card p-6 text-center hover-lift`}>
              <div className="text-3xl font-bold gradient-text mb-2">24/7</div>
              <div className={`text-sm ${isDarkMode ? 'text-dark-textSecondary' : 'text-light-textSecondary'}`}>
                Support
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className={`text-3xl md:text-4xl font-bold ${isDarkMode ? 'text-dark-text' : 'text-light-text'} mb-4`}>
              Powerful Features
            </h2>
            <p className={`text-xl ${isDarkMode ? 'text-dark-textSecondary' : 'text-light-textSecondary'} max-w-2xl mx-auto`}>
              Everything you need to manage your ESG initiatives effectively
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className={`card p-6 hover-lift animate-fade-in-up`}
                style={{ animationDelay: `${0.1 * (index + 1)}s` }}
              >
                <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg w-fit mb-4">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-dark-text' : 'text-light-text'} mb-2`}>
                  {feature.title}
                </h3>
                <p className={`${isDarkMode ? 'text-dark-textSecondary' : 'text-light-textSecondary'}`}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className={`text-3xl md:text-4xl font-bold ${isDarkMode ? 'text-dark-text' : 'text-light-text'} mb-4`}>
              What Our Users Say
            </h2>
            <p className={`text-xl ${isDarkMode ? 'text-dark-textSecondary' : 'text-light-textSecondary'} max-w-2xl mx-auto`}>
              Join thousands of satisfied customers worldwide
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index} 
                className={`card p-6 hover-lift animate-fade-in-up`}
                style={{ animationDelay: `${0.2 * (index + 1)}s` }}
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className={`${isDarkMode ? 'text-dark-textSecondary' : 'text-light-textSecondary'} mb-4`}>
                  "{testimonial.content}"
                </p>
                <div>
                  <div className={`font-semibold ${isDarkMode ? 'text-dark-text' : 'text-light-text'}`}>
                    {testimonial.name}
                  </div>
                  <div className={`text-sm ${isDarkMode ? 'text-dark-textSecondary' : 'text-light-textSecondary'}`}>
                    {testimonial.role} at {testimonial.company}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className={`card p-12 animate-fade-in-up`}>
            <h2 className={`text-3xl md:text-4xl font-bold ${isDarkMode ? 'text-dark-text' : 'text-light-text'} mb-4`}>
              Ready to Get Started?
            </h2>
            <p className={`text-xl ${isDarkMode ? 'text-dark-textSecondary' : 'text-light-textSecondary'} mb-8`}>
              Join thousands of organizations already using our platform
            </p>
            <button
              onClick={() => router.push('/auth/register')}
              className="btn-primary group text-lg px-8 py-4"
            >
              Start Your Free Trial
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`py-12 px-4 sm:px-6 lg:px-8 border-t ${isDarkMode ? 'border-dark-border' : 'border-light-border'}`}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className={`text-lg font-bold ${isDarkMode ? 'text-dark-text' : 'text-light-text'}`}>
                  ESG Platform
                </span>
              </div>
              <p className={`text-sm ${isDarkMode ? 'text-dark-textSecondary' : 'text-light-textSecondary'}`}>
                Empowering organizations to build a sustainable future through comprehensive ESG management.
              </p>
            </div>
            <div>
              <h3 className={`font-semibold ${isDarkMode ? 'text-dark-text' : 'text-light-text'} mb-4`}>Product</h3>
              <ul className="space-y-2">
                <li><a href="#" className={`text-sm ${isDarkMode ? 'text-dark-textSecondary hover:text-dark-accent' : 'text-light-textSecondary hover:text-light-accent'} transition-colors`}>Features</a></li>
                <li><a href="#" className={`text-sm ${isDarkMode ? 'text-dark-textSecondary hover:text-dark-accent' : 'text-light-textSecondary hover:text-light-accent'} transition-colors`}>Pricing</a></li>
                <li><a href="#" className={`text-sm ${isDarkMode ? 'text-dark-textSecondary hover:text-dark-accent' : 'text-light-textSecondary hover:text-light-accent'} transition-colors`}>API</a></li>
              </ul>
            </div>
            <div>
              <h3 className={`font-semibold ${isDarkMode ? 'text-dark-text' : 'text-light-text'} mb-4`}>Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className={`text-sm ${isDarkMode ? 'text-dark-textSecondary hover:text-dark-accent' : 'text-light-textSecondary hover:text-light-accent'} transition-colors`}>About</a></li>
                <li><a href="#" className={`text-sm ${isDarkMode ? 'text-dark-textSecondary hover:text-dark-accent' : 'text-light-textSecondary hover:text-light-accent'} transition-colors`}>Blog</a></li>
                <li><a href="#" className={`text-sm ${isDarkMode ? 'text-dark-textSecondary hover:text-dark-accent' : 'text-light-textSecondary hover:text-light-accent'} transition-colors`}>Careers</a></li>
              </ul>
            </div>
            <div>
              <h3 className={`font-semibold ${isDarkMode ? 'text-dark-text' : 'text-light-text'} mb-4`}>Support</h3>
              <ul className="space-y-2">
                <li><a href="#" className={`text-sm ${isDarkMode ? 'text-dark-textSecondary hover:text-dark-accent' : 'text-light-textSecondary hover:text-light-accent'} transition-colors`}>Help Center</a></li>
                <li><a href="#" className={`text-sm ${isDarkMode ? 'text-dark-textSecondary hover:text-dark-accent' : 'text-light-textSecondary hover:text-light-accent'} transition-colors`}>Contact</a></li>
                <li><a href="#" className={`text-sm ${isDarkMode ? 'text-dark-textSecondary hover:text-dark-accent' : 'text-light-textSecondary hover:text-light-accent'} transition-colors`}>Status</a></li>
              </ul>
            </div>
          </div>
          <div className={`mt-8 pt-8 border-t ${isDarkMode ? 'border-dark-border' : 'border-light-border'} text-center`}>
            <p className={`text-sm ${isDarkMode ? 'text-dark-textSecondary' : 'text-light-textSecondary'}`}>
              © 2024 ESG Platform. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
