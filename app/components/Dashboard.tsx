'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Dashboard() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to the new dashboard page
    router.push('/dashboard')
  }, [router])

  return null
} 