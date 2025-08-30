'use client'

import { useState, useEffect } from 'react'
import { Download, FileText, AlertCircle, CheckCircle, Settings, RefreshCw, Info } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

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

interface ExportJob {
  id: string
  type: 'pdf' | 'excel'
  responseId: string
  status: 'pending' | 'exporting' | 'completed' | 'failed'
  progress: number
  message: string
  createdAt: Date
  completedAt?: Date
}

interface ExportDashboardProps {
  responses: ESGResponse[]
  className?: string
}

export default function ExportDashboard({ responses, className = '' }: ExportDashboardProps) {
  const { isDarkMode } = useTheme()
  const [exportJobs, setExportJobs] = useState<ExportJob[]>([])
  const [selectedResponse, setSelectedResponse] = useState<string>('')
  const [exportFormat, setExportFormat] = useState<'pdf' | 'excel'>('pdf')
  const [showSettings, setShowSettings] = useState(false)
  const [autoDownload, setAutoDownload] = useState(true)
  const [showNotifications, setShowNotifications] = useState(true)

  // Initialize with latest response
  useEffect(() => {
    if (responses.length > 0 && !selectedResponse) {
      setSelectedResponse(responses[responses.length - 1].id)
    }
  }, [responses, selectedResponse])

  const createExportJob = (type: 'pdf' | 'excel', responseId: string): ExportJob => ({
    id: `${type}-${responseId}-${Date.now()}`,
    type,
    responseId,
    status: 'pending',
    progress: 0,
    message: 'Queued for export...',
    createdAt: new Date()
  })

  const updateExportJob = (jobId: string, updates: Partial<ExportJob>) => {
    setExportJobs(prev => prev.map(job => 
      job.id === jobId ? { ...job, ...updates } : job
    ))
  }

  const handleExport = async () => {
    if (!selectedResponse) {
      return
    }

    const job = createExportJob(exportFormat, selectedResponse)
    setExportJobs(prev => [job, ...prev])

    // Update job status to exporting
    updateExportJob(job.id, { status: 'exporting', progress: 10, message: 'Preparing export...' })

    try {
      const token = localStorage.getItem('token')
      
      if (!token) {
        throw new Error('Authentication token not found')
      }

      updateExportJob(job.id, { progress: 30, message: 'Generating file...' })

      const response = await fetch(`/api/export/${exportFormat}?responseId=${selectedResponse}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `Failed to export ${exportFormat.toUpperCase()}`)
      }

      updateExportJob(job.id, { progress: 80, message: 'Downloading file...' })

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `esg-response-${selectedResponse}.${exportFormat === 'pdf' ? 'pdf' : 'xlsx'}`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      updateExportJob(job.id, { 
        status: 'completed', 
        progress: 100, 
        message: `${exportFormat.toUpperCase()} exported successfully!`,
        completedAt: new Date()
      })

      if (showNotifications) {
        // Show browser notification if supported
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('Export Complete', {
            body: `${exportFormat.toUpperCase()} file has been downloaded successfully.`,
            icon: '/favicon.ico'
          })
        }
      }

    } catch (error) {
      console.error(`Error exporting ${exportFormat}:`, error)
      updateExportJob(job.id, { 
        status: 'failed', 
        progress: 0, 
        message: error instanceof Error ? error.message : `Failed to export ${exportFormat.toUpperCase()}`,
        completedAt: new Date()
      })
    }
  }

  const clearCompletedJobs = () => {
    setExportJobs(prev => prev.filter(job => job.status !== 'completed'))
  }

  const retryJob = (job: ExportJob) => {
    setSelectedResponse(job.responseId)
    setExportFormat(job.type)
    handleExport()
  }

  const getStatusIcon = (status: ExportJob['status']) => {
    switch (status) {
      case 'pending':
        return <RefreshCw className="w-4 h-4 text-yellow-500 animate-spin" />
      case 'exporting':
        return <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-red-500" />
      default:
        return null
    }
  }

  const getStatusColor = (status: ExportJob['status']) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600'
      case 'exporting':
        return 'text-blue-600'
      case 'completed':
        return 'text-green-600'
      case 'failed':
        return 'text-red-600'
      default:
        return isDarkMode ? 'text-gray-300' : 'text-gray-600'
    }
  }

  return (
    <div className={`${className}`}>
      {/* Header */}
      <div className={`flex items-center justify-between mb-6 p-4 rounded-lg border ${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-lg ${isDarkMode ? 'bg-blue-600' : 'bg-blue-100'} flex items-center justify-center`}>
            <Download className={`w-5 h-5 ${isDarkMode ? 'text-white' : 'text-blue-600'}`} />
          </div>
          <div>
            <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Export Manager
            </h3>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Manage your ESG data exports
            </p>
          </div>
        </div>
        
        <button
          onClick={() => setShowSettings(!showSettings)}
          className={`p-2 rounded-lg transition-colors ${
            isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
          }`}
        >
          <Settings className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
        </button>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className={`mb-6 p-4 rounded-lg border ${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <h4 className={`text-sm font-medium mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Export Settings
          </h4>
          <div className="space-y-3">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={autoDownload}
                onChange={(e) => setAutoDownload(e.target.checked)}
                className="rounded"
              />
              <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Auto-download files
              </span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={showNotifications}
                onChange={(e) => setShowNotifications(e.target.checked)}
                className="rounded"
              />
              <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Show notifications
              </span>
            </label>
          </div>
        </div>
      )}

      {/* Export Controls */}
      <div className={`mb-6 p-4 rounded-lg border ${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Response Selection */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Select Response
            </label>
            <select
              value={selectedResponse}
              onChange={(e) => setSelectedResponse(e.target.value)}
              className={`w-full p-2 rounded-lg border ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              {responses.map(response => (
                <option key={response.id} value={response.id}>
                  FY {response.financialYear} - {new Date(response.createdAt).toLocaleDateString()}
                </option>
              ))}
            </select>
          </div>

          {/* Format Selection */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Export Format
            </label>
            <div className="flex space-x-2">
              <button
                onClick={() => setExportFormat('pdf')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  exportFormat === 'pdf'
                    ? 'bg-red-600 text-white'
                    : isDarkMode 
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>PDF</span>
              </button>
              <button
                onClick={() => setExportFormat('excel')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  exportFormat === 'excel'
                    ? 'bg-green-600 text-white'
                    : isDarkMode 
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Download className="w-4 h-4" />
                <span>Excel</span>
              </button>
            </div>
          </div>

          {/* Export Button */}
          <div className="flex items-end">
            <button
              onClick={handleExport}
              disabled={!selectedResponse}
              className={`w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50 transition-all duration-200 ${
                exportFormat === 'pdf'
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              <Download className="w-4 h-4" />
              <span>Export {exportFormat.toUpperCase()}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Export History */}
      <div className={`rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className={`px-4 py-3 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <h4 className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Export History
            </h4>
            <button
              onClick={clearCompletedJobs}
              className={`text-xs ${isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-800'}`}
            >
              Clear Completed
            </button>
          </div>
        </div>
        
        <div className="p-4">
          {exportJobs.length === 0 ? (
            <div className={`text-center py-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              <Info className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No export jobs yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {exportJobs.map(job => (
                <div
                  key={job.id}
                  className={`p-3 rounded-lg border ${
                    isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(job.status)}
                      <span className={`text-sm font-medium ${getStatusColor(job.status)}`}>
                        {job.type.toUpperCase()} Export
                      </span>
                    </div>
                    <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {job.createdAt.toLocaleTimeString()}
                    </span>
                  </div>
                  
                  <p className={`text-sm mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {job.message}
                  </p>
                  
                  {job.status === 'exporting' && (
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${job.progress}%` }}
                      />
                    </div>
                  )}
                  
                  {job.status === 'failed' && (
                    <button
                      onClick={() => retryJob(job)}
                      className={`text-xs px-2 py-1 rounded ${
                        isDarkMode 
                          ? 'bg-red-600 hover:bg-red-700 text-white' 
                          : 'bg-red-600 hover:bg-red-700 text-white'
                      }`}
                    >
                      Retry
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
