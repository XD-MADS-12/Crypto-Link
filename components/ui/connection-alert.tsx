import { useEffect, useState } from 'react'
import { Alert, AlertDescription } from './alert'
import { Wifi, WifiOff } from 'lucide-react'

export function ConnectionAlert() {
  const [isOnline, setIsOnline] = useState(navigator.onLine)

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  if (isOnline) return null

  return (
    <Alert className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-red-500/20 border-red-500 text-red-200">
      <WifiOff className="h-4 w-4" />
      <AlertDescription>Connection lost. Please check your internet connection.</AlertDescription>
    </Alert>
  )
}
