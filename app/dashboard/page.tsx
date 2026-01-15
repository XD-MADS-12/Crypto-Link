'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Copy, ExternalLink, Plus, BarChart3, Coins, Clock, AlertTriangle } from 'lucide-react'

export default function DashboardPage() {
  const [urls, setUrls] = useState<any[]>([])
  const [originalUrl, setOriginalUrl] = useState('')
  const [shortUrl, setShortUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [showPaymentDialog, setShowPaymentDialog] = useState(false)
  const [paymentTxid, setPaymentTxid] = useState('')
  const [paymentWallet, setPaymentWallet] = useState('')
  const [selectedPlan, setSelectedPlan] = useState('premium-monthly')
  const router = useRouter()

  useEffect(() => {
    const session = localStorage.getItem('userSession')
    if (!session) {
      router.push('/auth/login')
      return
    }
    
    const userData = JSON.parse(session)
    setUser(userData)
    
    // In a real app, fetch user's URLs from API
    // For demo purposes, we'll use mock data
    setUrls([
      {
        id: 1,
        original: 'https://example.com/very-long-url-that-needs-shortening',
        short: 'https://clnk.to/abc123',
        clicks: 42,
        createdAt: '2024-01-14'
      },
      {
        id: 2,
        original: 'https://another-very-long-url.com/path/to/something',
        short: 'https://clnk.to/xyz789',
        clicks: 18,
        createdAt: '2024-01-13'
      }
    ])
  }, [router])

  const shortenUrl = async () => {
    if (!originalUrl) return
    setIsLoading(true)

    try {
      // In a real app, this would be an API call to your backend
      const response = await fetch('/api/urls/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ originalUrl })
      })

      if (!response.ok) {
        throw new Error('Failed to shorten URL')
      }

      const data = await response.json()
      setShortUrl(data.shortUrl)
      
      // Add to local list
      setUrls(prev => [{
        id: Date.now(),
        original: originalUrl,
        short: data.shortUrl,
        clicks: 0,
        createdAt: new Date().toISOString().split('T')[0]
      }, ...prev])
      
      setOriginalUrl('')
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const submitPayment = async () => {
    if (!paymentTxid || !paymentWallet) return
    
    try {
      // In a real app, this would be an API call to your backend
      const response = await fetch('/api/payments/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          txid: paymentTxid, 
          wallet: paymentWallet, 
          plan: selectedPlan 
        })
      })

      if (!response.ok) {
        throw new Error('Payment submission failed')
      }

      alert('Payment submitted! Admin will verify your transaction.')
      setShowPaymentDialog(false)
      setPaymentTxid('')
      setPaymentWallet('')
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-purple-800/30 backdrop-blur-sm bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">CryptoLink Dashboard</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-300">{user?.email}</span>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  localStorage.removeItem('userSession')
                  router.push('/')
                }}
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400 mt-2">
            Manage your shortened URLs and subscription
          </p>
        </div>

        {/* Subscription Status */}
        <div className="mb-8">
          <Card className="bg-white/5 backdrop-blur-sm border border-purple-800/30">
            <CardHeader>
              <CardTitle className="text-xl text-white">Subscription Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg text-white capitalize">
                    {user?.subscription_status || 'Free'} Plan
                  </p>
                  <p className="text-gray-400">
                    {user?.subscription_status === 'free' 
                      ? 'Ads enabled • Limited features' 
                      : 'No ads • Premium features'}
                  </p>
                </div>
                <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
                  <DialogTrigger asChild>
                    <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                      Upgrade Now
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-gray-900 border border-purple-800/30">
                    <DialogHeader>
                      <DialogTitle className="text-white">Crypto Payment Verification</DialogTitle>
                      <DialogDescription className="text-gray-400">
                        Submit your transaction details for verification
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm text-gray-300 mb-2">Transaction Hash (TXID)</label>
                        <Input
                          type="text"
                          value={paymentTxid}
                          onChange={(e) => setPaymentTxid(e.target.value)}
                          placeholder="0x..."
                          className="bg-gray-800 border-gray-700 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-300 mb-2">Sending Wallet Address</label>
                        <Input
                          type="text"
                          value={paymentWallet}
                          onChange={(e) => setPaymentWallet(e.target.value)}
                          placeholder="0x..."
                          className="bg-gray-800 border-gray-700 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-300 mb-2">Plan</label>
                        <select
                          value={selectedPlan}
                          onChange={(e) => setSelectedPlan(e.target.value)}
                          className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
                        >
                          <option value="premium-monthly">Premium Monthly ($10)</option>
                          <option value="premium-yearly">Premium Yearly ($100)</option>
                        </select>
                      </div>
                      
                      <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                        <p className="text-sm text-yellow-400 flex items-center">
                          <AlertTriangle className="w-4 h-4 mr-2" />
                          Send exactly the plan amount to our verified address. Admin will verify within 24 hours.
                        </p>
                      </div>
                      
                      <Button 
                        onClick={submitPayment}
                        disabled={!paymentTxid || !paymentWallet}
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                      >
                        Submit Payment
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* URL Shortener */}
        <div className="mb-8">
          <Card className="bg-white/5 backdrop-blur-sm border border-purple-800/30">
            <CardHeader>
              <CardTitle className="text-xl text-white">Shorten URL</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-2">
                <Input
                  type="url"
                  value={originalUrl}
                  onChange={(e) => setOriginalUrl(e.target.value)}
                  placeholder="https://example.com/very-long-url"
                  className="bg-gray-800 border-gray-700 text-white"
                />
                <Button 
                  onClick={shortenUrl} 
                  disabled={!originalUrl || isLoading}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  {isLoading ? 'Shortening...' : 'Shorten'}
                </Button>
              </div>
              
              {shortUrl && (
                <div className="mt-4 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-green-400 break-all">{shortUrl}</span>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => copyToClipboard(shortUrl)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => window.open(shortUrl, '_blank')}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* My URLs */}
        <div>
          <Card className="bg-white/5 backdrop-blur-sm border border-purple-800/30">
            <CardHeader>
              <CardTitle className="text-xl text-white">My URLs</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-gray-300">Original URL</TableHead>
                    <TableHead className="text-gray-300">Short URL</TableHead>
                    <TableHead className="text-gray-300">Clicks</TableHead>
                    <TableHead className="text-gray-300">Date Created</TableHead>
                    <TableHead className="text-gray-300">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {urls.map((url) => (
                    <TableRow key={url.id}>
                      <TableCell className="text-gray-300 max-w-xs truncate">
                        {url.original}
                      </TableCell>
                      <TableCell className="text-purple-400 font-mono">
                        {url.short}
                      </TableCell>
                      <TableCell className="text-gray-300">
                        {url.clicks}
                      </TableCell>
                      <TableCell className="text-gray-400">
                        {url.createdAt}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => copyToClipboard(url.short)}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => window.open(url.short, '_blank')}
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
