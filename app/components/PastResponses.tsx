'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { useNotifications } from '../context/NotificationContext'
import { Calendar, Eye, Download, FileText, Clock, TrendingUp, ChevronRight, CheckCircle, XCircle, Trash2, AlertTriangle } from 'lucide-react'

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

export default function PastResponses() {
  const { user } = useAuth()
  const { isDarkMode } = useTheme()
  const { success, error: showError, warning } = useNotifications()
  const [responses, setResponses] = useState<ESGResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedResponse, setSelectedResponse] = useState<ESGResponse | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

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

  const exportResponse = async (responseId: string, format: 'pdf' | 'excel') => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/export/${format}?responseId=${responseId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `esg-response-${responseId}.${format === 'pdf' ? 'pdf' : 'xlsx'}`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error(`Error exporting ${format}:`, error)
    }
  }

  const deleteResponse = async (responseId: string) => {
    setDeleting(true)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/responses/${responseId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        setResponses(prev => prev.filter(r => r.id !== responseId))
        setDeleteConfirm(null)
        success('Response Deleted', 'The ESG response has been successfully deleted.')
      } else {
        showError('Delete Failed', 'Unable to delete the response. Please try again.')
      }
    } catch (error) {
      showError('Delete Error', 'An unexpected error occurred while deleting.')
    } finally {
      setDeleting(false)
    }
  }

  const handleDeleteClick = (e: React.MouseEvent, responseId: string) => {
    e.stopPropagation()
    setDeleteConfirm(responseId)
  }

  const handleDeleteCancel = () => {
    setDeleteConfirm(null)
  }

  const handleDeleteConfirm = (responseId: string) => {
    deleteResponse(responseId)
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
          <Clock className={`w-8 h-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
        </div>
        <h3 className={`text-lg font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>No Past Responses</h3>
        <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Complete the ESG questionnaire to see your past responses.</p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto animate-fade-in-up">
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-xl rounded-xl border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} hover-lift`}>
        {/* Header */}
        <div className={`px-6 py-6 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center space-x-3">
            <div className={`w-12 h-12 rounded-lg ${isDarkMode ? 'bg-orange-600' : 'bg-orange-100'} flex items-center justify-center`}>
              <Clock className={`w-6 h-6 ${isDarkMode ? 'text-white' : 'text-orange-600'}`} />
            </div>
            <div>
              <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Past Responses
              </h2>
              <p className={`mt-1 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                View and manage your previous ESG questionnaire submissions
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Responses List */}
          <div className="space-y-4">
            {responses.map((response, index) => (
              <div 
                key={response.id}
                className={`p-6 rounded-xl border hover-lift transition-all duration-200 animate-fade-in-up cursor-pointer ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 hover:border-gray-500' 
                    : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => setSelectedResponse(selectedResponse?.id === response.id ? null : response)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-lg ${isDarkMode ? 'bg-blue-600' : 'bg-blue-100'} flex items-center justify-center`}>
                      <Calendar className={`w-6 h-6 ${isDarkMode ? 'text-white' : 'text-blue-600'}`} />
                    </div>
                    <div>
                      <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        Financial Year {response.financialYear}
                      </h3>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Submitted on {new Date(response.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={(e) => handleDeleteClick(e, response.id)}
                      className={`p-2 rounded-lg transition-all duration-200 hover:scale-110 ${
                        isDarkMode 
                          ? 'text-red-400 hover:bg-red-900/20 hover:text-red-300' 
                          : 'text-red-500 hover:bg-red-50 hover:text-red-600'
                      }`}
                      title="Delete Response"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                    <ChevronRight className={`w-5 h-5 transition-transform duration-200 ${
                      selectedResponse?.id === response.id ? 'rotate-90' : ''
                    } ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                  </div>
                </div>

                {/* Quick Metrics Preview */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-600' : 'bg-white'}`}>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Carbon Intensity</p>
                    <p className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {response.carbonIntensity.toFixed(6)}
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-600' : 'bg-white'}`}>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Renewable Energy</p>
                    <p className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {response.renewableElectricityRatio.toFixed(1)}%
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-600' : 'bg-white'}`}>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Diversity Ratio</p>
                    <p className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {response.diversityRatio.toFixed(1)}%
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-600' : 'bg-white'}`}>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Community Investment</p>
                    <p className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {response.communitySpendRatio.toFixed(2)}%
                    </p>
                  </div>
                </div>

                {/* Expanded Details */}
                {selectedResponse?.id === response.id && (
                  <div className="mt-6 pt-6 border-t border-gray-200 animate-fade-in-up">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Environmental Metrics */}
                      <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-600' : 'bg-green-50'}`}>
                        <h4 className={`font-semibold mb-3 ${isDarkMode ? 'text-green-300' : 'text-green-800'}`}>
                          Environmental Metrics
                        </h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Total Electricity</span>
                            <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                              {response.totalElectricityConsumption.toLocaleString()} kWh
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Renewable Energy</span>
                            <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                              {response.renewableElectricityConsumption.toLocaleString()} kWh
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Carbon Emissions</span>
                            <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                              {response.carbonEmissions.toLocaleString()} T CO2e
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Social Metrics */}
                      <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-600' : 'bg-blue-50'}`}>
                        <h4 className={`font-semibold mb-3 ${isDarkMode ? 'text-blue-300' : 'text-blue-800'}`}>
                          Social Metrics
                        </h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Total Employees</span>
                            <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                              {response.totalEmployees.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Female Employees</span>
                            <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                              {response.femaleEmployees.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Training Hours</span>
                            <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                              {response.avgTrainingHoursPerEmployee} hrs/employee
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Governance Metrics */}
                      <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-600' : 'bg-purple-50'}`}>
                        <h4 className={`font-semibold mb-3 ${isDarkMode ? 'text-purple-300' : 'text-purple-800'}`}>
                          Governance Metrics
                        </h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Independent Board</span>
                            <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                              {response.independentBoardMembersPercent}%
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Privacy Policy</span>
                            <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                              {response.hasDataPrivacyPolicy ? (
                                <span className="flex items-center text-green-400">
                                  <CheckCircle className="w-4 h-4 mr-1" />
                                  Yes
                                </span>
                              ) : (
                                <span className="flex items-center text-red-400">
                                  <XCircle className="w-4 h-4 mr-1" />
                                  No
                                </span>
                              )}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Total Revenue</span>
                            <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                              ₹{response.totalRevenue.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Export Actions */}
                    <div className="mt-6 flex space-x-3">
                      <button
                        onClick={() => exportResponse(response.id, 'pdf')}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                          isDarkMode 
                            ? 'bg-red-600 hover:bg-red-700 text-white' 
                            : 'bg-red-600 hover:bg-red-700 text-white'
                        }`}
                      >
                        <FileText className="w-4 h-4" />
                        <span>Export PDF</span>
                      </button>
                      <button
                        onClick={() => exportResponse(response.id, 'excel')}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                          isDarkMode 
                            ? 'bg-green-600 hover:bg-green-700 text-white' 
                            : 'bg-green-600 hover:bg-green-700 text-white'
                        }`}
                      >
                        <Download className="w-4 h-4" />
                        <span>Export Excel</span>
                      </button>
                      <button
                        onClick={(e) => handleDeleteClick(e, response.id)}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                          isDarkMode 
                            ? 'bg-red-600 hover:bg-red-700 text-white' 
                            : 'bg-red-600 hover:bg-red-700 text-white'
                        }`}
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Delete Response</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className={`max-w-md w-full mx-4 p-6 rounded-2xl shadow-2xl ${
            isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
          }`}>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Delete Response
                </h3>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  This action cannot be undone
                </p>
              </div>
            </div>
            
            <p className={`mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Are you sure you want to delete this ESG response? This will permanently remove all data associated with this submission.
            </p>
            
            <div className="flex space-x-3">
              <button
                onClick={handleDeleteCancel}
                disabled={deleting}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  isDarkMode 
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                } disabled:opacity-50`}
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteConfirm(deleteConfirm)}
                disabled={deleting}
                className={`flex-1 px-4 py-2 rounded-lg font-medium text-white bg-red-600 hover:bg-red-700 transition-all duration-200 disabled:opacity-50 flex items-center justify-center space-x-2`}
              >
                {deleting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 