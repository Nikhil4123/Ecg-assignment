'use client'

import { useNotifications, Notification, NotificationType } from '@/app/context/NotificationContext'
import { useTheme } from '@/app/context/ThemeContext'
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react'
import { useState, useEffect } from 'react'

interface NotificationItemProps {
  notification: Notification
  onRemove: (id: string) => void
}

function NotificationItem({ notification, onRemove }: NotificationItemProps) {
  const { isDarkMode } = useTheme()
  const [isExiting, setIsExiting] = useState(false)

  const handleRemove = () => {
    setIsExiting(true)
    setTimeout(() => {
      onRemove(notification.id)
    }, 300) // Match animation duration
  }

  useEffect(() => {
    // Auto-remove after duration
    if (notification.duration && notification.duration > 0) {
      const timer = setTimeout(() => {
        handleRemove()
      }, notification.duration)
      return () => clearTimeout(timer)
    }
  }, [notification.duration, notification.id])

  const getIcon = (type: NotificationType) => {
    const iconClass = "w-5 h-5 flex-shrink-0"
    switch (type) {
      case 'success':
        return <CheckCircle className={`${iconClass} text-green-500`} />
      case 'error':
        return <AlertCircle className={`${iconClass} text-red-500`} />
      case 'warning':
        return <AlertTriangle className={`${iconClass} text-yellow-500`} />
      case 'info':
        return <Info className={`${iconClass} text-blue-500`} />
      default:
        return <Info className={`${iconClass} text-gray-500`} />
    }
  }

  const getColors = (type: NotificationType) => {
    if (isDarkMode) {
      switch (type) {
        case 'success':
          return 'bg-green-900/20 border-green-800 text-green-200'
        case 'error':
          return 'bg-red-900/20 border-red-800 text-red-200'
        case 'warning':
          return 'bg-yellow-900/20 border-yellow-800 text-yellow-200'
        case 'info':
          return 'bg-blue-900/20 border-blue-800 text-blue-200'
        default:
          return 'bg-gray-900/20 border-gray-800 text-gray-200'
      }
    } else {
      switch (type) {
        case 'success':
          return 'bg-green-50 border-green-200 text-green-800'
        case 'error':
          return 'bg-red-50 border-red-200 text-red-800'
        case 'warning':
          return 'bg-yellow-50 border-yellow-200 text-yellow-800'
        case 'info':
          return 'bg-blue-50 border-blue-200 text-blue-800'
        default:
          return 'bg-gray-50 border-gray-200 text-gray-800'
      }
    }
  }

  return (
    <div
      className={`
        ${getColors(notification.type)}
        border rounded-lg p-4 mb-3 shadow-lg backdrop-blur-sm
        transform transition-all duration-300 ease-in-out
        ${isExiting 
          ? 'translate-x-full opacity-0 scale-95' 
          : 'translate-x-0 opacity-100 scale-100'
        }
        hover:shadow-xl hover:scale-105
        min-w-80 max-w-md
      `}
    >
      <div className="flex items-start space-x-3">
        {getIcon(notification.type)}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm leading-5">
            {notification.title}
          </p>
          {notification.message && (
            <p className="mt-1 text-sm opacity-90 leading-5">
              {notification.message}
            </p>
          )}
          {notification.actions && notification.actions.length > 0 && (
            <div className="mt-3 flex space-x-2">
              {notification.actions.map((action, index) => (
                <button
                  key={index}
                  onClick={action.action}
                  className={`
                    px-3 py-1 text-xs font-medium rounded-md transition-colors
                    ${action.variant === 'primary'
                      ? `${notification.type === 'success' ? 'bg-green-600 text-white hover:bg-green-700' :
                          notification.type === 'error' ? 'bg-red-600 text-white hover:bg-red-700' :
                          notification.type === 'warning' ? 'bg-yellow-600 text-white hover:bg-yellow-700' :
                          'bg-blue-600 text-white hover:bg-blue-700'
                        }`
                      : `${isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`
                    }
                  `}
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}
        </div>
        <button
          onClick={handleRemove}
          className={`
            flex-shrink-0 ml-2 p-1 rounded-full transition-colors
            ${isDarkMode 
              ? 'hover:bg-gray-700 text-gray-400 hover:text-gray-200' 
              : 'hover:bg-gray-200 text-gray-500 hover:text-gray-700'
            }
          `}
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

export default function NotificationContainer() {
  const { notifications, removeNotification } = useNotifications()

  if (notifications.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onRemove={removeNotification}
        />
      ))}
    </div>
  )
}
