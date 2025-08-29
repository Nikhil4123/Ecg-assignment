'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { Leaf, Users, Shield, Calculator, Save, CheckCircle, AlertCircle } from 'lucide-react'

interface ESGData {
  financialYear: string
  // Environmental
  totalElectricityConsumption: number
  renewableElectricityConsumption: number
  totalFuelConsumption: number
  carbonEmissions: number
  // Social
  totalEmployees: number
  femaleEmployees: number
  avgTrainingHoursPerEmployee: number
  communityInvestmentSpend: number
  // Governance
  independentBoardMembersPercent: number
  hasDataPrivacyPolicy: boolean
  totalRevenue: number
}

interface CalculatedMetrics {
  carbonIntensity: number
  renewableElectricityRatio: number
  diversityRatio: number
  communitySpendRatio: number
}

export default function ESGQuestionnaire() {
  const { user } = useAuth()
  const { isDarkMode } = useTheme()
  const [data, setData] = useState<ESGData>({
    financialYear: new Date().getFullYear().toString(),
    totalElectricityConsumption: 0,
    renewableElectricityConsumption: 0,
    totalFuelConsumption: 0,
    carbonEmissions: 0,
    totalEmployees: 0,
    femaleEmployees: 0,
    avgTrainingHoursPerEmployee: 0,
    communityInvestmentSpend: 0,
    independentBoardMembersPercent: 0,
    hasDataPrivacyPolicy: false,
    totalRevenue: 0,
  })

  const [calculatedMetrics, setCalculatedMetrics] = useState<CalculatedMetrics>({
    carbonIntensity: 0,
    renewableElectricityRatio: 0,
    diversityRatio: 0,
    communitySpendRatio: 0,
  })

  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('')

  // Calculate metrics in real-time
  useEffect(() => {
    const carbonIntensity = data.totalRevenue > 0 ? data.carbonEmissions / data.totalRevenue : 0
    const renewableElectricityRatio = data.totalElectricityConsumption > 0 
      ? (data.renewableElectricityConsumption / data.totalElectricityConsumption) * 100 : 0
    const diversityRatio = data.totalEmployees > 0 
      ? (data.femaleEmployees / data.totalEmployees) * 100 : 0
    const communitySpendRatio = data.totalRevenue > 0 
      ? (data.communityInvestmentSpend / data.totalRevenue) * 100 : 0

    setCalculatedMetrics({
      carbonIntensity,
      renewableElectricityRatio,
      diversityRatio,
      communitySpendRatio,
    })
  }, [data])

  const handleInputChange = (field: keyof ESGData, value: string | number | boolean) => {
    setData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage('')
    setMessageType('')

    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/responses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...data,
          ...calculatedMetrics
        }),
      })

      if (response.ok) {
        setMessage('ESG data saved successfully!')
        setMessageType('success')
        setTimeout(() => {
          setMessage('')
          setMessageType('')
        }, 3000)
      } else {
        setMessage('Failed to save data. Please try again.')
        setMessageType('error')
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.')
      setMessageType('error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto animate-fade-in-up">
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-xl rounded-xl border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} hover-lift`}>
        {/* Header */}
        <div className={`px-6 py-6 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center space-x-3">
            <div className={`w-12 h-12 rounded-lg ${isDarkMode ? 'bg-green-600' : 'bg-green-100'} flex items-center justify-center`}>
              <Leaf className={`w-6 h-6 ${isDarkMode ? 'text-white' : 'text-green-600'}`} />
            </div>
            <div>
              <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                ESG Questionnaire
              </h2>
              <p className={`mt-1 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Fill in your Environmental, Social, and Governance metrics for the selected financial year.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* Message Display */}
          {message && (
            <div className={`p-4 rounded-lg border flex items-center space-x-3 animate-fade-in-down ${
              messageType === 'success'
                ? `${isDarkMode ? 'bg-green-900/50 border-green-700 text-green-200' : 'bg-green-50 border-green-200 text-green-600'}`
                : `${isDarkMode ? 'bg-red-900/50 border-red-700 text-red-200' : 'bg-red-50 border-red-200 text-red-600'}`
            }`}>
              {messageType === 'success' ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <AlertCircle className="w-5 h-5" />
              )}
              <span>{message}</span>
            </div>
          )}

          {/* Financial Year */}
          <div className="animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} mb-2`}>
              Financial Year
            </label>
            <input
              type="text"
              value={data.financialYear}
              onChange={(e) => handleInputChange('financialYear', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 ${
                isDarkMode
                  ? 'border-gray-600 placeholder-gray-400 text-white bg-gray-700 hover:border-gray-500'
                  : 'border-gray-300 placeholder-gray-500 text-gray-900 bg-white hover:border-gray-400'
              }`}
              placeholder="e.g., 2024"
            />
          </div>

          {/* Environmental Section */}
          <div className={`border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} pt-6 animate-fade-in-up`} style={{ animationDelay: '200ms' }}>
            <div className="flex items-center space-x-3 mb-6">
              <div className={`w-10 h-10 rounded-lg ${isDarkMode ? 'bg-green-600' : 'bg-green-100'} flex items-center justify-center`}>
                <Leaf className={`w-5 h-5 ${isDarkMode ? 'text-white' : 'text-green-600'}`} />
              </div>
              <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-green-400' : 'text-green-700'}`}>
                Environmental Metrics
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { label: 'Total Electricity Consumption (kWh)', field: 'totalElectricityConsumption' },
                { label: 'Renewable Electricity Consumption (kWh)', field: 'renewableElectricityConsumption' },
                { label: 'Total Fuel Consumption (liters)', field: 'totalFuelConsumption' },
                { label: 'Carbon Emissions (T CO2e)', field: 'carbonEmissions' }
              ].map((item, index) => (
                <div key={item.field} className="animate-fade-in-up" style={{ animationDelay: `${300 + index * 50}ms` }}>
                  <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} mb-2`}>
                    {item.label}
                  </label>
                  <input
                    type="number"
                    value={data[item.field as keyof ESGData] as number}
                    onChange={(e) => handleInputChange(item.field as keyof ESGData, parseFloat(e.target.value) || 0)}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 ${
                      isDarkMode
                        ? 'border-gray-600 placeholder-gray-400 text-white bg-gray-700 hover:border-gray-500'
                        : 'border-gray-300 placeholder-gray-500 text-gray-900 bg-white hover:border-gray-400'
                    }`}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Social Section */}
          <div className={`border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} pt-6 animate-fade-in-up`} style={{ animationDelay: '400ms' }}>
            <div className="flex items-center space-x-3 mb-6">
              <div className={`w-10 h-10 rounded-lg ${isDarkMode ? 'bg-blue-600' : 'bg-blue-100'} flex items-center justify-center`}>
                <Users className={`w-5 h-5 ${isDarkMode ? 'text-white' : 'text-blue-600'}`} />
              </div>
              <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-blue-400' : 'text-blue-700'}`}>
                Social Metrics
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { label: 'Total Number of Employees', field: 'totalEmployees' },
                { label: 'Number of Female Employees', field: 'femaleEmployees' },
                { label: 'Average Training Hours per Employee (per year)', field: 'avgTrainingHoursPerEmployee' },
                { label: 'Community Investment Spend (INR)', field: 'communityInvestmentSpend' }
              ].map((item, index) => (
                <div key={item.field} className="animate-fade-in-up" style={{ animationDelay: `${500 + index * 50}ms` }}>
                  <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} mb-2`}>
                    {item.label}
                  </label>
                  <input
                    type="number"
                    value={data[item.field as keyof ESGData] as number}
                    onChange={(e) => handleInputChange(item.field as keyof ESGData, parseFloat(e.target.value) || 0)}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                      isDarkMode
                        ? 'border-gray-600 placeholder-gray-400 text-white bg-gray-700 hover:border-gray-500'
                        : 'border-gray-300 placeholder-gray-500 text-gray-900 bg-white hover:border-gray-400'
                    }`}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Governance Section */}
          <div className={`border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} pt-6 animate-fade-in-up`} style={{ animationDelay: '600ms' }}>
            <div className="flex items-center space-x-3 mb-6">
              <div className={`w-10 h-10 rounded-lg ${isDarkMode ? 'bg-purple-600' : 'bg-purple-100'} flex items-center justify-center`}>
                <Shield className={`w-5 h-5 ${isDarkMode ? 'text-white' : 'text-purple-600'}`} />
              </div>
              <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-purple-400' : 'text-purple-700'}`}>
                Governance Metrics
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="animate-fade-in-up" style={{ animationDelay: '700ms' }}>
                <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} mb-2`}>
                  % of Independent Board Members
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={data.independentBoardMembersPercent}
                  onChange={(e) => handleInputChange('independentBoardMembersPercent', parseFloat(e.target.value) || 0)}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 ${
                    isDarkMode
                      ? 'border-gray-600 placeholder-gray-400 text-white bg-gray-700 hover:border-gray-500'
                      : 'border-gray-300 placeholder-gray-500 text-gray-900 bg-white hover:border-gray-400'
                  }`}
                />
              </div>
              <div className="animate-fade-in-up" style={{ animationDelay: '750ms' }}>
                <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} mb-2`}>
                  Does the company have a data privacy policy?
                </label>
                <select
                  value={data.hasDataPrivacyPolicy ? 'true' : 'false'}
                  onChange={(e) => handleInputChange('hasDataPrivacyPolicy', e.target.value === 'true')}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 ${
                    isDarkMode
                      ? 'border-gray-600 text-white bg-gray-700 hover:border-gray-500'
                      : 'border-gray-300 text-gray-900 bg-white hover:border-gray-400'
                  }`}
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>
              <div className="md:col-span-2 animate-fade-in-up" style={{ animationDelay: '800ms' }}>
                <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} mb-2`}>
                  Total Revenue (INR)
                </label>
                <input
                  type="number"
                  value={data.totalRevenue}
                  onChange={(e) => handleInputChange('totalRevenue', parseFloat(e.target.value) || 0)}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 ${
                    isDarkMode
                      ? 'border-gray-600 placeholder-gray-400 text-white bg-gray-700 hover:border-gray-500'
                      : 'border-gray-300 placeholder-gray-500 text-gray-900 bg-white hover:border-gray-400'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Auto-Calculated Metrics Display */}
          <div className={`border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} pt-6 animate-fade-in-up`} style={{ animationDelay: '900ms' }}>
            <div className="flex items-center space-x-3 mb-6">
              <div className={`w-10 h-10 rounded-lg ${isDarkMode ? 'bg-indigo-600' : 'bg-indigo-100'} flex items-center justify-center`}>
                <Calculator className={`w-5 h-5 ${isDarkMode ? 'text-white' : 'text-indigo-600'}`} />
              </div>
              <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-indigo-400' : 'text-indigo-700'}`}>
                Auto-Calculated Metrics
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { label: 'Carbon Intensity (T CO2e / INR)', value: calculatedMetrics.carbonIntensity.toFixed(6), color: 'green' },
                { label: 'Renewable Electricity Ratio (%)', value: `${calculatedMetrics.renewableElectricityRatio.toFixed(2)}%`, color: 'green' },
                { label: 'Diversity Ratio (%)', value: `${calculatedMetrics.diversityRatio.toFixed(2)}%`, color: 'blue' },
                { label: 'Community Spend Ratio (%)', value: `${calculatedMetrics.communitySpendRatio.toFixed(2)}%`, color: 'purple' }
              ].map((metric, index) => (
                <div 
                  key={metric.label}
                  className={`p-6 rounded-xl border hover-lift transition-all duration-200 animate-fade-in-up ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 hover:border-gray-500' 
                      : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                  }`}
                  style={{ animationDelay: `${1000 + index * 100}ms` }}
                >
                  <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                    {metric.label}
                  </label>
                  <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {metric.value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className={`border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} pt-6 animate-fade-in-up`} style={{ animationDelay: '1100ms' }}>
            <button
              type="submit"
              disabled={saving}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-4 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] shadow-lg flex items-center justify-center space-x-2"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  <span>Save ESG Data</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 