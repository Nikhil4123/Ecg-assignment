'use client'

import { ChevronDown } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

interface YearDropdownProps {
  value: string
  onChange: (value: string) => void
  label?: string
  required?: boolean
}

export default function YearDropdown({ value, onChange, label = "Financial Year", required = false }: YearDropdownProps) {
  const { isDarkMode } = useTheme()
  
  // Generate years for dropdown (current year + 10 years back)
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 11 }, (_, i) => currentYear - i)

  return (
    <div className="space-y-2">
      <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 ${
            isDarkMode 
              ? 'bg-gray-700 border-gray-600 text-white focus:border-green-500' 
              : 'bg-white border-gray-300 text-gray-900 focus:border-green-500'
          } appearance-none pr-10`}
          required={required}
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
  )
}
