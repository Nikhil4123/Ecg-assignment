'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTheme } from '../context/ThemeContext'
import { useNotifications } from '../context/NotificationContext'
import { 
  User, 
  Mail, 
  Calendar, 
  FileText, 
  Save, 
  Eye, 
  EyeOff, 
  Shield, 
  Settings, 
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Star,
  Award,
  Activity,
  TrendingUp,
  Zap
} from 'lucide-react'

interface UserProfile {
  id: string
  name: string
  email: string
  createdAt: string
  updatedAt: string
  _count: {
    responses: number
  }
}

export default function ProfilePage() {
  const router = useRouter()
  const { isDarkMode } = useTheme()
  const { success: showSuccess, error: showError } = useNotifications()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  
  // Form state
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/auth/login')
        return
      }

      const response = await fetch('/api/auth/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setProfile(data)
        setName(data.name)
        setEmail(data.email)
      } else if (response.status === 401) {
        localStorage.removeItem('token')
        router.push('/auth/login')
             } else {
         showError('Profile Load Failed', 'Failed to load profile')
       }
     } catch (error) {
       showError('Profile Load Error', 'Failed to load profile')
     } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate passwords if changing password
    if (newPassword) {
      if (newPassword.length < 6) {
        showError('Password Validation', 'New password must be at least 6 characters long')
        return
      }
      if (newPassword !== confirmPassword) {
        showError('Password Validation', 'New passwords do not match')
        return
      }
    }

    setSaving(true)

    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name,
          email,
          currentPassword: newPassword ? currentPassword : undefined,
          newPassword: newPassword || undefined
        })
      })

      const data = await response.json()

             if (response.ok) {
         showSuccess('Profile Updated', 'Profile updated successfully!')
         setProfile(prev => prev ? { ...prev, ...data } : null)
         setCurrentPassword('')
         setNewPassword('')
         setConfirmPassword('')
       } else {
         showError('Update Failed', data.error || 'Failed to update profile')
       }
     } catch (error) {
       showError('Update Error', 'Failed to update profile')
     } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-dark-bg' : 'bg-light-bg'} flex items-center justify-center`}>
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className={`text-lg ${isDarkMode ? 'text-dark-text' : 'text-light-text'}`}>Loading your profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-dark-bg' : 'bg-light-bg'} py-8 transition-all duration-300`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-8 animate-fade-in-down">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/dashboard')}
                className={`p-2 rounded-lg ${isDarkMode ? 'bg-dark-card hover:bg-gray-600' : 'bg-white hover:bg-gray-50'} shadow-md transition-all duration-300 hover:scale-105`}
              >
                <ArrowLeft className={`h-5 w-5 ${isDarkMode ? 'text-dark-text' : 'text-light-text'}`} />
              </button>
              <div>
                <h1 className={`text-4xl font-bold ${isDarkMode ? 'text-dark-text' : 'text-light-text'} gradient-text`}>
                  Profile Settings
                </h1>
                <p className={`text-lg ${isDarkMode ? 'text-dark-textSecondary' : 'text-light-textSecondary'} mt-2`}>
                  Manage your account and preferences
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Settings className={`h-6 w-6 ${isDarkMode ? 'text-dark-accent' : 'text-light-accent'}`} />
              <span className={`text-sm ${isDarkMode ? 'text-dark-textSecondary' : 'text-light-textSecondary'}`}>
                Settings
              </span>
            </div>
          </div>
        </div>

        {/* Profile Stats Cards */}
        {profile && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className={`card p-6 animate-fade-in-up hover-lift`} style={{ animationDelay: '0.1s' }}>
              <div className="flex items-center">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className={`text-sm font-medium ${isDarkMode ? 'text-dark-textSecondary' : 'text-light-textSecondary'}`}>
                    Member Since
                  </p>
                  <p className={`text-xl font-bold ${isDarkMode ? 'text-dark-text' : 'text-light-text'}`}>
                    {new Date(profile.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
            
            <div className={`card p-6 animate-fade-in-up hover-lift`} style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center">
                <div className="p-3 bg-gradient-to-r from-green-500 to-green-600 rounded-lg">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className={`text-sm font-medium ${isDarkMode ? 'text-dark-textSecondary' : 'text-light-textSecondary'}`}>
                    Total Responses
                  </p>
                  <p className={`text-xl font-bold ${isDarkMode ? 'text-dark-text' : 'text-light-text'}`}>
                    {profile._count.responses}
                  </p>
                </div>
              </div>
            </div>
            
            <div className={`card p-6 animate-fade-in-up hover-lift`} style={{ animationDelay: '0.3s' }}>
              <div className="flex items-center">
                <div className="p-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg">
                  <Activity className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className={`text-sm font-medium ${isDarkMode ? 'text-dark-textSecondary' : 'text-light-textSecondary'}`}>
                    Last Updated
                  </p>
                  <p className={`text-xl font-bold ${isDarkMode ? 'text-dark-text' : 'text-light-text'}`}>
                    {new Date(profile.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            <div className={`card p-6 animate-fade-in-up hover-lift`} style={{ animationDelay: '0.4s' }}>
              <div className="flex items-center">
                <div className="p-3 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg">
                  <Award className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className={`text-sm font-medium ${isDarkMode ? 'text-dark-textSecondary' : 'text-light-textSecondary'}`}>
                    Status
                  </p>
                  <p className={`text-xl font-bold ${isDarkMode ? 'text-dark-text' : 'text-light-text'}`}>
                    Active
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        

        {/* Profile Form */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Basic Information */}
          <div className={`card p-8 animate-fade-in-up`} style={{ animationDelay: '0.5s' }}>
            <div className="flex items-center mb-6">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg mr-3">
                <User className="h-5 w-5 text-white" />
              </div>
              <h2 className={`text-2xl font-semibold ${isDarkMode ? 'text-dark-text' : 'text-light-text'}`}>
                Basic Information
              </h2>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className={`block text-sm font-medium ${isDarkMode ? 'text-dark-text' : 'text-light-text'} mb-2`}>
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-enhanced"
                  required
                />
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
                    required
                  />
                  <Mail className={`absolute right-3 top-3 h-5 w-5 ${isDarkMode ? 'text-dark-textSecondary' : 'text-light-textSecondary'}`} />
                </div>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="btn-primary w-full"
              >
                {saving ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </div>
                )}
              </button>
            </form>
          </div>

          {/* Password Change */}
          <div className={`card p-8 animate-fade-in-up`} style={{ animationDelay: '0.6s' }}>
            <div className="flex items-center mb-6">
              <div className="p-2 bg-gradient-to-r from-green-500 to-green-600 rounded-lg mr-3">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <h2 className={`text-2xl font-semibold ${isDarkMode ? 'text-dark-text' : 'text-light-text'}`}>
                Security Settings
              </h2>
            </div>
            
            <div className="space-y-6">
              <p className={`text-sm ${isDarkMode ? 'text-dark-textSecondary' : 'text-light-textSecondary'}`}>
                Update your password to keep your account secure
              </p>
              
              <div>
                <label htmlFor="currentPassword" className={`block text-sm font-medium ${isDarkMode ? 'text-dark-text' : 'text-light-text'} mb-2`}>
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="currentPassword"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="input-enhanced pr-10"
                    placeholder="Enter current password"
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
              
              <div>
                <label htmlFor="newPassword" className={`block text-sm font-medium ${isDarkMode ? 'text-dark-text' : 'text-light-text'} mb-2`}>
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="input-enhanced pr-10"
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className={`absolute right-3 top-3 ${isDarkMode ? 'text-dark-textSecondary hover:text-dark-text' : 'text-light-textSecondary hover:text-light-text'}`}
                  >
                    {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
              
              {newPassword && (
                <div>
                  <label htmlFor="confirmPassword" className={`block text-sm font-medium ${isDarkMode ? 'text-dark-text' : 'text-light-text'} mb-2`}>
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="input-enhanced"
                    placeholder="Confirm new password"
                  />
                </div>
              )}

              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <div className="flex items-start">
                  <Zap className="h-5 w-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                  <div>
                    <p className={`text-sm font-medium ${isDarkMode ? 'text-dark-text' : 'text-light-text'}`}>
                      Password Requirements
                    </p>
                    <ul className={`text-xs mt-1 space-y-1 ${isDarkMode ? 'text-dark-textSecondary' : 'text-light-textSecondary'}`}>
                      <li>• At least 6 characters long</li>
                      <li>• Mix of letters and numbers</li>
                      <li>• Include special characters for extra security</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
