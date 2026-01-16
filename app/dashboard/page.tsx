'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog'
import { Copy, ExternalLink, Plus, BarChart3, Coins, Clock, AlertTriangle, Loader2 } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { motion } from 'framer-motion'
import { PaymentAnimation } from '../components/ui/payment-animation'
import { LoadingSpinner } from '../components/ui/loading-spinner'

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
  const [verificationStatus, setVerificationStatus] = = useState<'idle' | 'pending' | 'success' | 'error'>('idle')
  const router = useRouter()

  useEffect(() => {
    const session = localStorage.getItem('userSession')
    if (!session) {
      router.push('/auth/login')
      return
    }
    
    const userData = JSON.parse(session)
    setUser(userData)
    
    // Fetch user's URLs from Supabase
    fetchUrls()
  }, [router])

  const fetchUrls = async () => {
    const session = localStorage.getItem('userSession')
    if (!session) return
    
    const userData = JSON.parse(session)
    
    const { data, error } = await supabase
      .from('urls')
      .select('*')
      .eq('user_id', userData.id)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching URLs:', error)
    } else {
      setUrls(data || [])
    }
  }

  const shortenUrl = async () => {
    if (!originalUrl) return
    setIsLoading(true)

    try {
      const session = localStorage.getItem('userSession')
      if (!session) throw new Error('Not authenticated')
      
      const userData = JSON.parse(session)
      
      // Generate short code
      const shortCode = Math.random().toString(36).substring(2, 8)
      
      const { data, error } = await supabase
        .from('urls')
        .insert({
          original_url: originalUrl,
          short_code: shortCode,
          domain: 'clnk.to',
          user_id: userData.id
        })
        .select()
        .single()
      
      if (error) throw error
      
      setShortUrl(`${window.location.protocol}//${data.domain}/${data.short_code}`)
      
      // Add to local list
      setUrls(prev => [{
        id: data.id,
        original: originalUrl,
        short_code: data.short_code,
        domain: data.domain,
        clicks: 0,
        created_at: new Date().toISOString().split('T')[0]
      }, ...prev])
      
      setOriginalUrl('')
    } catch (err: any) {
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
    
    setVerificationStatus('pending')
    
    try {
      const session = localStorage.getItem('userSession')
      if (!session) throw new Error('Not authenticated')
      
      const userData = JSON.parse(session)
      
      // Insert payment record
      const { data, error } = await supabase
        .from('payments')
        .insert({
          txid: paymentTxid,
          crypto_type: selectedPlan === 'premium-yearly' ? 'BNB' : 'USDT',
          amount: selectedPlan === 'premium-monthly' ? 10 : 100,
          plan: selectedPlan,
          user_id: userData.id,
          status: 'pending'
        })
        .select()
        .single()
      
      if (error) throw error
      
      setVerificationStatus('success')
      
      // Close dialog after success
      setTimeout(() => {
        setShowPaymentDialog(false)
        setVerificationStatus('idle')
        setPaymentTxid('')
        setPaymentWallet('')
      }, 2000)
    } catch (err: any) {
      console.error(err)
      setVerificationStatus('error')
      
      // Reset after error
      setTimeout(() => {
        setVerificationStatus('idle')
      }, 3000)
    }
  }

  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400 mt-2">
            Manage your shortened URLs and subscription
          </p>
        </motion.div>

        {/* Subscription Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
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
                  <DialogContent className="bg-gray-900 border border-purple-800/30 max-w-md">
                    <DialogHeader>
                      <DialogTitle className="text-white">Crypto Payment Verification</DialogTitle>
                      <DialogDescription className="text-gray-400">
                        Submit your transaction details for verification
                      </DialogDescription>
                    </DialogHeader>
                    
                    {verificationStatus !== 'idle' ? (
                      <div className="py-8">
                        <PaymentAnimation status={verificationStatus} />
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm text-gray-300 mb-2">Payment Addresses</label>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-400">USDT (BEP20):</span>
                              <span className="text-purple-400">0x3462...8e7B</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-400">BNB (BEP20):</span>
                              <span className="text-purple-400">0x3462...8e7B</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-400">BTC:</span>
                              <span className="text-purple-400">1EUj...W9kA</span>
                            </div>
                          </div>
                        </div>
                        
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
                    )}
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* URL Shortener */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
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
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Shorten'}
                </Button>
              </div>
              
              {shortUrl && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-4 p-4 bg-green-500/10 border border-green-500/30 rounded-lg"
                >
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
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* My URLs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
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
                    <motion.tr
                      key={url.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <TableCell className="text-gray-300 max-w-xs truncate">
                        {url.original_url}
                      </TableCell>
                      <TableCell className="text-purple-400 font-mono">
                        {`${window.location.protocol}//${url.domain}/${url.short_code}`}
                      </TableCell>
                      <TableCell className="text-gray-300">
                        {url.clicks}
                      </TableCell>
                      <TableCell className="text-gray-400">
                        {new Date(url.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => copyToClipboard(`${window.location.protocol}//${url.domain}/${url.short_code}`)}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => window.open(`${window.location.protocol}//${url.domain}/${url.short_code}`, '_blank')}
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  )
}
