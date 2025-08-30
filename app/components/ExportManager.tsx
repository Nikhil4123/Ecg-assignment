'use client'

import { useState } from 'react'
import { Download, FileText, AlertCircle, CheckCircle } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { useNotifications } from '../context/NotificationContext'

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

interface ExportManagerProps {
  responses: ESGResponse[]
  className?: string
}

export default function ExportManager({ responses, className = '' }: ExportManagerProps) {
  const { isDarkMode } = useTheme()
  const { success, error: showError } = useNotifications()
  const [exporting, setExporting] = useState(false)

  const handleExport = async (format: 'pdf' | 'excel') => {
    if (responses.length === 0) {
      showError('Export Failed', 'No responses available to export')
      return
    }

    setExporting(true)

    try {
      const latestResponse = responses[responses.length - 1]
      const token = localStorage.getItem('token')
      
      if (!token) {
        throw new Error('Authentication token not found')
      }

      const response = await fetch(`/api/export/${format}?responseId=${latestResponse.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `Failed to export ${format.toUpperCase()}`)
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `esg-response-${latestResponse.id}.${format === 'pdf' ? 'pdf' : 'xlsx'}`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      success(`${format.toUpperCase()} Exported Successfully`, `Your ${format.toUpperCase()} file has been downloaded.`)

    } catch (error) {
      console.error(`Error exporting ${format}:`, error)
      showError('Export Failed', error instanceof Error ? error.message : `Failed to export ${format.toUpperCase()}`)
    } finally {
      setExporting(false)
    }
  }

  const getStatusIcon = () => {
    if (exporting) {
      return <div className={`animate-spin rounded-full h-4 w-4 border-b-2 ${isDarkMode ? 'border-green-500' : 'border-green-600'}`} />
    }
    return null
  }

  return (
    <div className={`${className}`}>
      {/* Export Controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <button
          onClick={() => handleExport('pdf')}
          disabled={exporting}
          className={`flex items-center justify-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50 transition-all duration-200 ${
            isDarkMode 
              ? 'bg-red-600 hover:bg-red-700 text-white' 
              : 'bg-red-600 hover:bg-red-700 text-white'
          }`}
        >
          <FileText className="w-4 h-4" />
                     <span>{exporting ? 'Exporting...' : 'Export PDF'}</span>
        </button>
        
        <button
          onClick={() => handleExport('excel')}
          disabled={exporting}
          className={`flex items-center justify-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50 transition-all duration-200 ${
            isDarkMode 
              ? 'bg-green-600 hover:bg-green-700 text-white' 
              : 'bg-green-600 hover:bg-green-700 text-white'
          }`}
        >
          <Download className="w-4 h-4" />
                     <span>{exporting ? 'Exporting...' : 'Export Excel'}</span>
        </button>
      </div>

      {/* Status Messages */}
      {/* {exportStatus.message && (
        <div className={`flex items-center space-x-2 p-3 rounded-lg border ${
          exportStatus.status === 'success' 
            ? 'bg-green-50 border-green-200' 
            : exportStatus.status === 'error'
            ? 'bg-red-50 border-red-200'
            : isDarkMode 
              ? 'bg-gray-700 border-gray-600' 
              : 'bg-gray-50 border-gray-200'
        }`}>
          {getStatusIcon()}
          <span className={`text-sm font-medium ${getStatusColor()}`}>
            {exportStatus.message}
          </span>
        </div>
      )} */}

      {/* Export Info */}
      {/* <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mt-2`}>
        <p>• Exports the latest response data</p>
        <p>• PDF includes formatted tables and charts</p>
        <p>• Excel includes detailed data sheets</p>
      </div> */}
    </div>
  )
}
