'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { TrendingUp, Download, FileText, BarChart3, PieChart as PieChartIcon, Shield } from 'lucide-react'

interface ESGResponse {
  id: string
  financialYear: string
  totalElectricityConsumption: number
  renewableElectricityConsumption: number
  totalFuelConsumption: number
  carbonEmissions: number
  totalEmployees: number
  femaleEmployees: number
  avgTrainingHoursPerEmployee: number
  communityInvestmentSpend: number
  independentBoardMembersPercent: number
  hasDataPrivacyPolicy: boolean
  totalRevenue: number
  carbonIntensity: number
  renewableElectricityRatio: number
  diversityRatio: number
  communitySpendRatio: number
  createdAt: string
}

export default function SummaryPage() {
  const { user } = useAuth()
  const { isDarkMode } = useTheme()
  const [responses, setResponses] = useState<ESGResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [exporting, setExporting] = useState(false)

  useEffect(() => {
    fetchResponses()
  }, [])

  const fetchResponses = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/responses', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        setResponses(data)
      }
    } catch (error) {
      console.error('Error fetching responses:', error)
    } finally {
      setLoading(false)
    }
  }

  const exportToPDF = async () => {
    setExporting(true)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/export/pdf', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'esg-questionnaire-summary.pdf'
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error('Error exporting PDF:', error)
    } finally {
      setExporting(false)
    }
  }

  const exportToExcel = async () => {
    setExporting(true)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/export/excel', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'esg-questionnaire-summary.xlsx'
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error('Error exporting Excel:', error)
    } finally {
      setExporting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className={`animate-spin rounded-full h-32 w-32 border-b-2 ${isDarkMode ? 'border-green-500' : 'border-green-600'}`}></div>
      </div>
    )
  }

  if (responses.length === 0) {
    return (
      <div className="text-center py-12 animate-fade-in-up">
        <div className={`w-16 h-16 mx-auto mb-4 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} flex items-center justify-center`}>
          <TrendingUp className={`w-8 h-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
        </div>
        <h3 className={`text-lg font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>No Analytics Data Available</h3>
        <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Complete the ESG questionnaire to see your analytics dashboard.</p>
      </div>
    )
  }

  // Prepare data for charts
  const latestResponse = responses[responses.length - 1]
  
  const environmentalData = [
    { name: 'Total Electricity (kWh)', value: latestResponse.totalElectricityConsumption },
    { name: 'Renewable Electricity (kWh)', value: latestResponse.renewableElectricityConsumption },
    { name: 'Total Fuel (liters)', value: latestResponse.totalFuelConsumption },
    { name: 'Carbon Emissions (T CO2e)', value: latestResponse.carbonEmissions },
  ]

  const calculatedMetricsData = [
    { name: 'Carbon Intensity', value: latestResponse.carbonIntensity },
    { name: 'Renewable Ratio (%)', value: latestResponse.renewableElectricityRatio },
    { name: 'Diversity Ratio (%)', value: latestResponse.diversityRatio },
    { name: 'Community Spend (%)', value: latestResponse.communitySpendRatio },
  ]

  const socialData = [
    { name: 'Total Employees', value: latestResponse.totalEmployees },
    { name: 'Female Employees', value: latestResponse.femaleEmployees },
    { name: 'Avg Training Hours', value: latestResponse.avgTrainingHoursPerEmployee },
    { name: 'Community Investment (INR)', value: latestResponse.communityInvestmentSpend },
  ]

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

  return (
    <div className="max-w-7xl mx-auto animate-fade-in-up">
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-xl rounded-xl border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} hover-lift`}>
        <div className={`px-6 py-6 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className={`w-12 h-12 rounded-lg ${isDarkMode ? 'bg-blue-600' : 'bg-blue-100'} flex items-center justify-center`}>
                <BarChart3 className={`w-6 h-6 ${isDarkMode ? 'text-white' : 'text-blue-600'}`} />
              </div>
              <div>
                <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Analytics Dashboard</h2>
                <p className={`mt-1 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Comprehensive overview of your Environmental, Social, and Governance metrics
                </p>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={exportToPDF}
                disabled={exporting}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50 transition-all duration-200 ${
                  isDarkMode 
                    ? 'bg-red-600 hover:bg-red-700 text-white' 
                    : 'bg-red-600 hover:bg-red-700 text-white'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>{exporting ? 'Exporting...' : 'Export PDF'}</span>
              </button>
              <button
                onClick={exportToExcel}
                disabled={exporting}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50 transition-all duration-200 ${
                  isDarkMode 
                    ? 'bg-green-600 hover:bg-green-700 text-white' 
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                <Download className="w-4 h-4" />
                <span>{exporting ? 'Exporting...' : 'Export Excel'}</span>
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Key Metrics Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className={`p-6 rounded-xl border hover-lift transition-all duration-200 animate-fade-in-up ${
              isDarkMode 
                ? 'bg-blue-900/20 border-blue-700/50' 
                : 'bg-blue-50 border-blue-200'
            }`} style={{ animationDelay: '100ms' }}>
              <h3 className={`text-sm font-medium ${isDarkMode ? 'text-blue-300' : 'text-blue-800'}`}>Carbon Intensity</h3>
              <p className={`text-3xl font-bold ${isDarkMode ? 'text-blue-100' : 'text-blue-900'}`}>
                {latestResponse.carbonIntensity.toFixed(6)}
              </p>
              <p className={`text-xs ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>T CO2e / INR</p>
            </div>
            <div className={`p-6 rounded-xl border hover-lift transition-all duration-200 animate-fade-in-up ${
              isDarkMode 
                ? 'bg-green-900/20 border-green-700/50' 
                : 'bg-green-50 border-green-200'
            }`} style={{ animationDelay: '200ms' }}>
              <h3 className={`text-sm font-medium ${isDarkMode ? 'text-green-300' : 'text-green-800'}`}>Renewable Energy</h3>
              <p className={`text-3xl font-bold ${isDarkMode ? 'text-green-100' : 'text-green-900'}`}>
                {latestResponse.renewableElectricityRatio.toFixed(1)}%
              </p>
              <p className={`text-xs ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>of total electricity</p>
            </div>
            <div className={`p-6 rounded-xl border hover-lift transition-all duration-200 animate-fade-in-up ${
              isDarkMode 
                ? 'bg-purple-900/20 border-purple-700/50' 
                : 'bg-purple-50 border-purple-200'
            }`} style={{ animationDelay: '300ms' }}>
              <h3 className={`text-sm font-medium ${isDarkMode ? 'text-purple-300' : 'text-purple-800'}`}>Diversity Ratio</h3>
              <p className={`text-3xl font-bold ${isDarkMode ? 'text-purple-100' : 'text-purple-900'}`}>
                {latestResponse.diversityRatio.toFixed(1)}%
              </p>
              <p className={`text-xs ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`}>female employees</p>
            </div>
            <div className={`p-6 rounded-xl border hover-lift transition-all duration-200 animate-fade-in-up ${
              isDarkMode 
                ? 'bg-orange-900/20 border-orange-700/50' 
                : 'bg-orange-50 border-orange-200'
            }`} style={{ animationDelay: '400ms' }}>
              <h3 className={`text-sm font-medium ${isDarkMode ? 'text-orange-300' : 'text-orange-800'}`}>Community Investment</h3>
              <p className={`text-3xl font-bold ${isDarkMode ? 'text-orange-100' : 'text-orange-900'}`}>
                {latestResponse.communitySpendRatio.toFixed(2)}%
              </p>
              <p className={`text-xs ${isDarkMode ? 'text-orange-400' : 'text-orange-600'}`}>of total revenue</p>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Environmental Metrics Chart */}
            <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-white'} border ${isDarkMode ? 'border-gray-600' : 'border-gray-200'} rounded-xl p-6 hover-lift transition-all duration-200 animate-fade-in-up`} style={{ animationDelay: '500ms' }}>
              <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4 flex items-center space-x-2`}>
                <div className={`w-8 h-8 rounded-lg ${isDarkMode ? 'bg-green-600' : 'bg-green-100'} flex items-center justify-center`}>
                  <BarChart3 className={`w-4 h-4 ${isDarkMode ? 'text-white' : 'text-green-600'}`} />
                </div>
                <span>Environmental Metrics</span>
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={environmentalData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#e5e7eb'} />
                  <XAxis dataKey="name" tick={{ fill: isDarkMode ? '#d1d5db' : '#374151' }} />
                  <YAxis tick={{ fill: isDarkMode ? '#d1d5db' : '#374151' }} />
                  <Tooltip contentStyle={{ 
                    backgroundColor: isDarkMode ? '#374151' : '#ffffff',
                    border: isDarkMode ? '1px solid #4b5563' : '1px solid #e5e7eb',
                    color: isDarkMode ? '#ffffff' : '#374151'
                  }} />
                  <Bar dataKey="value" fill="#10B981" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Social Metrics Chart */}
            <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-white'} border ${isDarkMode ? 'border-gray-600' : 'border-gray-200'} rounded-xl p-6 hover-lift transition-all duration-200 animate-fade-in-up`} style={{ animationDelay: '600ms' }}>
              <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4 flex items-center space-x-2`}>
                <div className={`w-8 h-8 rounded-lg ${isDarkMode ? 'bg-blue-600' : 'bg-blue-100'} flex items-center justify-center`}>
                  <BarChart3 className={`w-4 h-4 ${isDarkMode ? 'text-white' : 'text-blue-600'}`} />
                </div>
                <span>Social Metrics</span>
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={socialData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#e5e7eb'} />
                  <XAxis dataKey="name" tick={{ fill: isDarkMode ? '#d1d5db' : '#374151' }} />
                  <YAxis tick={{ fill: isDarkMode ? '#d1d5db' : '#374151' }} />
                  <Tooltip contentStyle={{ 
                    backgroundColor: isDarkMode ? '#374151' : '#ffffff',
                    border: isDarkMode ? '1px solid #4b5563' : '1px solid #e5e7eb',
                    color: isDarkMode ? '#ffffff' : '#374151'
                  }} />
                  <Bar dataKey="value" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Calculated Metrics Pie Chart */}
            <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-white'} border ${isDarkMode ? 'border-gray-600' : 'border-gray-200'} rounded-xl p-6 hover-lift transition-all duration-200 animate-fade-in-up`} style={{ animationDelay: '700ms' }}>
              <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4 flex items-center space-x-2`}>
                <div className={`w-8 h-8 rounded-lg ${isDarkMode ? 'bg-purple-600' : 'bg-purple-100'} flex items-center justify-center`}>
                  <PieChartIcon className={`w-4 h-4 ${isDarkMode ? 'text-white' : 'text-purple-600'}`} />
                </div>
                <span>Calculated Metrics Overview</span>
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={calculatedMetricsData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {calculatedMetricsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ 
                    backgroundColor: isDarkMode ? '#374151' : '#ffffff',
                    border: isDarkMode ? '1px solid #4b5563' : '1px solid #e5e7eb',
                    color: isDarkMode ? '#ffffff' : '#374151'
                  }} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Governance Metrics */}
            <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-white'} border ${isDarkMode ? 'border-gray-600' : 'border-gray-200'} rounded-xl p-6 hover-lift transition-all duration-200 animate-fade-in-up`} style={{ animationDelay: '800ms' }}>
              <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4 flex items-center space-x-2`}>
                <div className={`w-8 h-8 rounded-lg ${isDarkMode ? 'bg-indigo-600' : 'bg-indigo-100'} flex items-center justify-center`}>
                  <div className={`w-4 h-4 ${isDarkMode ? 'text-white' : 'text-indigo-600'}`}>
                    <Shield className={`w-4 h-4`} />
                  </div>
                </div>
                <span>Governance Metrics</span>
              </h3>
              <div className="space-y-4">
                <div className={`flex justify-between items-center p-4 rounded-lg ${
                  isDarkMode ? 'bg-gray-600' : 'bg-gray-50'
                }`}>
                  <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Independent Board Members</span>
                  <span className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {latestResponse.independentBoardMembersPercent}%
                  </span>
                </div>
                <div className={`flex justify-between items-center p-4 rounded-lg ${
                  isDarkMode ? 'bg-gray-600' : 'bg-gray-50'
                }`}>
                  <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Data Privacy Policy</span>
                  <span className={`text-lg font-semibold ${
                    latestResponse.hasDataPrivacyPolicy ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {latestResponse.hasDataPrivacyPolicy ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className={`flex justify-between items-center p-4 rounded-lg ${
                  isDarkMode ? 'bg-gray-600' : 'bg-gray-50'
                }`}>
                  <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Total Revenue</span>
                  <span className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    ₹{latestResponse.totalRevenue.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Historical Data */}
          {responses.length > 1 && (
            <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-white'} border ${isDarkMode ? 'border-gray-600' : 'border-gray-200'} rounded-xl p-6 hover-lift transition-all duration-200 animate-fade-in-up`} style={{ animationDelay: '900ms' }}>
              <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4 flex items-center space-x-2`}>
                <div className={`w-8 h-8 rounded-lg ${isDarkMode ? 'bg-yellow-600' : 'bg-yellow-100'} flex items-center justify-center`}>
                  <TrendingUp className={`w-4 h-4 ${isDarkMode ? 'text-white' : 'text-yellow-600'}`} />
                </div>
                <span>Historical Trends</span>
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={responses}>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#e5e7eb'} />
                  <XAxis dataKey="financialYear" tick={{ fill: isDarkMode ? '#d1d5db' : '#374151' }} />
                  <YAxis tick={{ fill: isDarkMode ? '#d1d5db' : '#374151' }} />
                  <Tooltip contentStyle={{ 
                    backgroundColor: isDarkMode ? '#374151' : '#ffffff',
                    border: isDarkMode ? '1px solid #4b5563' : '1px solid #e5e7eb',
                    color: isDarkMode ? '#ffffff' : '#374151'
                  }} />
                  <Legend />
                  <Bar dataKey="carbonIntensity" fill="#EF4444" name="Carbon Intensity" />
                  <Bar dataKey="renewableElectricityRatio" fill="#10B981" name="Renewable Ratio %" />
                  <Bar dataKey="diversityRatio" fill="#8B5CF6" name="Diversity Ratio %" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 