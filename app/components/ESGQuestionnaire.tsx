'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { useNotifications } from '../context/NotificationContext'
import { Leaf, Users, Shield, Calculator, Save, CheckCircle, AlertCircle, ChevronDown } from 'lucide-react'

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

export default function ESGQuestionnaire() {
  const { user } = useAuth()
  const { isDarkMode } = useTheme()
  const { success, error: showError } = useNotifications()
  const [saving, setSaving] = useState(false)
  
  // Generate years for dropdown (current year + 10 years back)
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 11 }, (_, i) => currentYear - i)

  const [data, setData] = useState<ESGData>({
    financialYear: currentYear.toString(),
    // Environmental
    totalElectricityConsumption: 0,
    renewableElectricityConsumption: 0,
    totalFuelConsumption: 0,
    carbonEmissions: 0,
    // Social
    totalEmployees: 0,
    femaleEmployees: 0,
    avgTrainingHoursPerEmployee: 0,
    communityInvestmentSpend: 0,
    // Governance
    independentBoardMembersPercent: 0,
    hasDataPrivacyPolicy: false,
    totalRevenue: 0
  })

  // Calculate derived metrics
  const calculatedMetrics = {
    carbonIntensity: data.totalRevenue > 0 ? data.carbonEmissions / data.totalRevenue : 0,
    renewableElectricityRatio: data.totalElectricityConsumption > 0 ? (data.renewableElectricityConsumption / data.totalElectricityConsumption) * 100 : 0,
    diversityRatio: data.totalEmployees > 0 ? (data.femaleEmployees / data.totalEmployees) * 100 : 0,
    communitySpendRatio: data.totalRevenue > 0 ? (data.communityInvestmentSpend / data.totalRevenue) * 100 : 0
  }

  const handleInputChange = (field: keyof ESGData, value: string | number | boolean) => {
    setData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

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
        success('Data Saved Successfully', 'Your ESG response has been recorded and is ready for analysis.')
      } else {
        showError('Save Failed', 'Unable to save ESG data. Please try again.')
      }
    } catch (error) {
      showError('Save Error', 'An unexpected error occurred while saving.')
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
              <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                ESG Assessment Questionnaire
              </h1>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Complete your Environmental, Social, and Governance assessment
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* Financial Year Selection */}
          <div className="space-y-4">
            <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Financial Year
            </h2>
            <div className="relative">
              <label htmlFor="financialYear" className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Select Financial Year
              </label>
              <div className="relative">
                <select
                  id="financialYear"
                  value={data.financialYear}
                  onChange={(e) => handleInputChange('financialYear', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white focus:border-green-500' 
                      : 'bg-white border-gray-300 text-gray-900 focus:border-green-500'
                  } appearance-none pr-10`}
                  required
                >
                  {years.map(year => (
                    <option key={year} value={year.toString()}>
                      {year}-{(year + 1).toString().slice(-2)}
                    </option>
                  ))}
                </select>
                <ChevronDown className={`absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} pointer-events-none`} />
              </div>
            </div>
          </div>

          {/* Environmental Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-lg ${isDarkMode ? 'bg-green-600' : 'bg-green-100'} flex items-center justify-center`}>
                <Leaf className={`w-5 h-5 ${isDarkMode ? 'text-white' : 'text-green-600'}`} />
              </div>
              <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Environmental Metrics
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="totalElectricityConsumption" className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Total Electricity Consumption (kWh)
                </label>
                <input
                  type="number"
                  id="totalElectricityConsumption"
                  value={data.totalElectricityConsumption}
                  onChange={(e) => handleInputChange('totalElectricityConsumption', parseFloat(e.target.value) || 0)}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white focus:border-green-500' 
                      : 'bg-white border-gray-300 text-gray-900 focus:border-green-500'
                  }`}
                  placeholder="0"
                  min="0"
                  step="0.01"
                />
              </div>
              
              <div>
                <label htmlFor="renewableElectricityConsumption" className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Renewable Electricity Consumption (kWh)
                </label>
                <input
                  type="number"
                  id="renewableElectricityConsumption"
                  value={data.renewableElectricityConsumption}
                  onChange={(e) => handleInputChange('renewableElectricityConsumption', parseFloat(e.target.value) || 0)}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white focus:border-green-500' 
                      : 'bg-white border-gray-300 text-gray-900 focus:border-green-500'
                  }`}
                  placeholder="0"
                  min="0"
                  step="0.01"
                />
              </div>
              
              <div>
                <label htmlFor="totalFuelConsumption" className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Total Fuel Consumption (liters)
                </label>
                <input
                  type="number"
                  id="totalFuelConsumption"
                  value={data.totalFuelConsumption}
                  onChange={(e) => handleInputChange('totalFuelConsumption', parseFloat(e.target.value) || 0)}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white focus:border-green-500' 
                      : 'bg-white border-gray-300 text-gray-900 focus:border-green-500'
                  }`}
                  placeholder="0"
                  min="0"
                  step="0.01"
                />
              </div>
              
              <div>
                <label htmlFor="carbonEmissions" className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Carbon Emissions (T CO2e)
                </label>
                <input
                  type="number"
                  id="carbonEmissions"
                  value={data.carbonEmissions}
                  onChange={(e) => handleInputChange('carbonEmissions', parseFloat(e.target.value) || 0)}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white focus:border-green-500' 
                      : 'bg-white border-gray-300 text-gray-900 focus:border-green-500'
                  }`}
                  placeholder="0"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
          </div>

          {/* Social Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-lg ${isDarkMode ? 'bg-blue-600' : 'bg-blue-100'} flex items-center justify-center`}>
                <Users className={`w-5 h-5 ${isDarkMode ? 'text-white' : 'text-blue-600'}`} />
              </div>
              <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Social Metrics
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="totalEmployees" className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Total Employees
                </label>
                <input
                  type="number"
                  id="totalEmployees"
                  value={data.totalEmployees}
                  onChange={(e) => handleInputChange('totalEmployees', parseInt(e.target.value) || 0)}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500' 
                      : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                  }`}
                  placeholder="0"
                  min="0"
                />
              </div>
              
              <div>
                <label htmlFor="femaleEmployees" className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Female Employees
                </label>
                <input
                  type="number"
                  id="femaleEmployees"
                  value={data.femaleEmployees}
                  onChange={(e) => handleInputChange('femaleEmployees', parseInt(e.target.value) || 0)}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500' 
                      : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                  }`}
                  placeholder="0"
                  min="0"
                />
              </div>
              
              <div>
                <label htmlFor="avgTrainingHoursPerEmployee" className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Average Training Hours per Employee
                </label>
                <input
                  type="number"
                  id="avgTrainingHoursPerEmployee"
                  value={data.avgTrainingHoursPerEmployee}
                  onChange={(e) => handleInputChange('avgTrainingHoursPerEmployee', parseFloat(e.target.value) || 0)}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500' 
                      : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                  }`}
                  placeholder="0"
                  min="0"
                  step="0.1"
                />
              </div>
              
              <div>
                <label htmlFor="communityInvestmentSpend" className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Community Investment Spend (₹)
                </label>
                <input
                  type="number"
                  id="communityInvestmentSpend"
                  value={data.communityInvestmentSpend}
                  onChange={(e) => handleInputChange('communityInvestmentSpend', parseFloat(e.target.value) || 0)}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500' 
                      : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                  }`}
                  placeholder="0"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
          </div>

          {/* Governance Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-lg ${isDarkMode ? 'bg-purple-600' : 'bg-purple-100'} flex items-center justify-center`}>
                <Shield className={`w-5 h-5 ${isDarkMode ? 'text-white' : 'text-purple-600'}`} />
              </div>
              <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Governance Metrics
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="independentBoardMembersPercent" className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Independent Board Members (%)
                </label>
                <input
                  type="number"
                  id="independentBoardMembersPercent"
                  value={data.independentBoardMembersPercent}
                  onChange={(e) => handleInputChange('independentBoardMembersPercent', parseFloat(e.target.value) || 0)}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200 ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white focus:border-purple-500' 
                      : 'bg-white border-gray-300 text-gray-900 focus:border-purple-500'
                  }`}
                  placeholder="0"
                  min="0"
                  max="100"
                  step="0.01"
                />
              </div>
              
              <div>
                <label htmlFor="totalRevenue" className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Total Revenue (₹)
                </label>
                <input
                  type="number"
                  id="totalRevenue"
                  value={data.totalRevenue}
                  onChange={(e) => handleInputChange('totalRevenue', parseFloat(e.target.value) || 0)}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200 ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white focus:border-purple-500' 
                      : 'bg-white border-gray-300 text-gray-900 focus:border-purple-500'
                  }`}
                  placeholder="0"
                  min="0"
                  step="0.01"
                />
              </div>
              
              <div className="md:col-span-2">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="hasDataPrivacyPolicy"
                    checked={data.hasDataPrivacyPolicy}
                    onChange={(e) => handleInputChange('hasDataPrivacyPolicy', e.target.checked)}
                    className={`w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500 ${
                      isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white'
                    }`}
                  />
                  <label htmlFor="hasDataPrivacyPolicy" className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Has Data Privacy Policy
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Calculated Metrics Display */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-lg ${isDarkMode ? 'bg-gray-600' : 'bg-gray-100'} flex items-center justify-center`}>
                <Calculator className={`w-5 h-5 ${isDarkMode ? 'text-white' : 'text-gray-600'}`} />
              </div>
              <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Calculated Metrics
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className={`p-4 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Carbon Intensity
                </p>
                <p className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {calculatedMetrics.carbonIntensity.toFixed(6)} T CO2e/₹
                </p>
              </div>
              
              <div className={`p-4 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Renewable Electricity Ratio
                </p>
                <p className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {calculatedMetrics.renewableElectricityRatio.toFixed(2)}%
                </p>
              </div>
              
              <div className={`p-4 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Diversity Ratio
                </p>
                <p className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {calculatedMetrics.diversityRatio.toFixed(2)}%
                </p>
              </div>
              
              <div className={`p-4 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Community Spend Ratio
                </p>
                <p className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {calculatedMetrics.communitySpendRatio.toFixed(2)}%
                </p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 shadow-lg ${
                isDarkMode ? 'focus:ring-offset-gray-800' : 'focus:ring-offset-white'
              }`}
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
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