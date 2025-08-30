'use client'

import { useState } from 'react'
import { Download, FileText, AlertCircle, CheckCircle } from 'lucide-react'
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

interface ResponseExportManagerProps {
  response: ESGResponse
  className?: string
}

export default function ResponseExportManager({ response, className = '' }: ResponseExportManagerProps) {
  const { isDarkMode } = useTheme()
  const [exporting, setExporting] = useState(false)
  const [exportStatus, setExportStatus] = useState<{
    type: 'pdf' | 'excel' | null
    status: 'idle' | 'exporting' | 'success' | 'error'
    message: string
  }>({
    type: null,
    status: 'idle',
    message: ''
  })

  const handleExport = async (format: 'pdf' | 'excel') => {
    setExporting(true)
    setExportStatus({
      type: format,
      status: 'exporting',
      message: `Exporting ${format.toUpperCase()}...`
    })

    try {
      const token = localStorage.getItem('token')
      
      if (!token) {
        throw new Error('Authentication token not found')
      }

      const fetchResponse = await fetch(`/api/export/${format}?responseId=${response.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!fetchResponse.ok) {
        const errorData = await fetchResponse.json().catch(() => ({}))
        throw new Error(errorData.error || `Failed to export ${format.toUpperCase()}`)
      }

      const blob = await fetchResponse.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `esg-response-${response.id}.${format === 'pdf' ? 'pdf' : 'xlsx'}`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      setExportStatus({
        type: format,
        status: 'success',
        message: `${format.toUpperCase()} exported successfully!`
      })

      // Clear success message after 3 seconds
      setTimeout(() => {
        setExportStatus({
          type: null,
          status: 'idle',
          message: ''
        })
      }, 3000)

    } catch (error) {
      console.error(`Error exporting ${format}:`, error)
      setExportStatus({
        type: format,
        status: 'error',
        message: error instanceof Error ? error.message : `Failed to export ${format.toUpperCase()}`
      })
    } finally {
      setExporting(false)
    }
  }

  const getStatusIcon = () => {
    switch (exportStatus.status) {
      case 'exporting':
        return <div className={`animate-spin rounded-full h-4 w-4 border-b-2 ${isDarkMode ? 'border-green-500' : 'border-green-600'}`} />
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />
      default:
        return null
    }
  }

  const getStatusColor = () => {
    switch (exportStatus.status) {
      case 'success':
        return 'text-green-600'
      case 'error':
        return 'text-red-600'
      default:
        return isDarkMode ? 'text-gray-300' : 'text-gray-600'
    }
  }

  return (
    <div className={`${className}`}>
      {/* Export Controls */}
      <div className="flex gap-2">
        <button
          onClick={() => handleExport('pdf')}
          disabled={exporting}
          className={`flex items-center space-x-1 px-2 py-1 rounded text-xs font-medium disabled:opacity-50 transition-all duration-200 ${
            isDarkMode 
              ? 'bg-red-600 hover:bg-red-700 text-white' 
              : 'bg-red-600 hover:bg-red-700 text-white'
          }`}
          title="Export as PDF"
        >
          <FileText className="w-3 h-3" />
          <span>{exporting && exportStatus.type === 'pdf' ? '...' : 'PDF'}</span>
        </button>
        
        <button
          onClick={() => handleExport('excel')}
          disabled={exporting}
          className={`flex items-center space-x-1 px-2 py-1 rounded text-xs font-medium disabled:opacity-50 transition-all duration-200 ${
            isDarkMode 
              ? 'bg-green-600 hover:bg-green-700 text-white' 
              : 'bg-green-600 hover:bg-green-700 text-white'
          }`}
          title="Export as Excel"
        >
          <Download className="w-3 h-3" />
          <span>{exporting && exportStatus.type === 'excel' ? '...' : 'Excel'}</span>
        </button>
      </div>

      {/* Status Messages */}
      {exportStatus.message && (
        <div className={`flex items-center space-x-2 p-2 rounded text-xs border mt-2 ${
          exportStatus.status === 'success' 
            ? 'bg-green-50 border-green-200' 
            : exportStatus.status === 'error'
            ? 'bg-red-50 border-red-200'
            : isDarkMode 
              ? 'bg-gray-700 border-gray-600' 
              : 'bg-gray-50 border-gray-200'
        }`}>
          {getStatusIcon()}
          <span className={`font-medium ${getStatusColor()}`}>
            {exportStatus.message}
          </span>
        </div>
      )}
    </div>
  )
}
