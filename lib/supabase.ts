// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

// lib/crypto-verifier.ts
export class CryptoVerifier {
  async verifyTransaction(txid: string, expectedAmount: number, cryptoType: string): Promise<boolean> {
    try {
      // This is a simplified example - in production, you'd connect to actual blockchain explorers
      let apiUrl = '';
      
      switch(cryptoType) {
        case 'USDT':
          apiUrl = `https://api.trongrid.io/v1/transactions/${txid}`;
          break;
        case 'BNB':
          apiUrl = `https://api.bscscan.com/api?module=proxy&action=eth_getTransactionByHash&txhash=${txid}&apikey=${process.env.BSCSCAN_API_KEY}`;
          break;
        case 'BTC':
          apiUrl = `https://blockchain.info/rawtx/${txid}`;
          break;
        default:
          return false;
      }
      
      const response = await fetch(apiUrl);
      const data = await response.json();
      
      // Simplified verification logic
      if (data && data.amount >= expectedAmount) {
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error verifying transaction:', error);
      return false;
    }
  }
}

// lib/security.ts
export class SecurityService {
  static generateHash(input: string): string {
    // In a real app, use a proper hashing algorithm
    return btoa(input).substring(0, 16);
  }

  static validateUserAgent(userAgent: string): boolean {
    const botPatterns = [
      /bot/i,
      /crawler/i,
      /spider/i,
      /slurp/i,
      /facebookexternalhit/i
    ];
    
    return !botPatterns.some(pattern => pattern.test(userAgent));
  }

  static isRateLimited(ip: string): boolean {
    // In a real app, check against Redis or similar cache
    return false;
  }
}

// components/Header.tsx
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { Zap } from 'lucide-react'

export function Header({ user }: { user: any }) {
  const router = useRouter()

  return (
    <header className="border-b border-purple-800/30 backdrop-blur-sm bg-black/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">CryptoLink</span>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            <a href="/" className="text-sm font-medium text-gray-300 hover:text-purple-400 transition-colors">
              Home
            </a>
            <a href="/dashboard" className="text-sm font-medium text-gray-300 hover:text-purple-400 transition-colors">
              Dashboard
            </a>
            {user?.role === 'admin' && (
              <a href="/admin" className="text-sm font-medium text-gray-300 hover:text-purple-400 transition-colors">
                Admin Panel
              </a>
            )}
          </nav>

          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-300">{user.email}</span>
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
            ) : (
              <Button asChild>
                <a href="/auth/login">Login</a>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

// components/Footer.tsx
export function Footer() {
  return (
    <footer className="border-t border-purple-800/30 backdrop-blur-sm bg-black/20 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center text-gray-400">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded"></div>
            <span className="text-lg font-semibold text-white">CryptoLink</span>
          </div>
          <p className="text-sm">Secure URL shortening with cryptocurrency payments and advanced security.</p>
          <div className="mt-4 flex justify-center space-x-6 text-sm">
            <a href="#" className="hover:text-purple-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-purple-400 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-purple-400 transition-colors">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

// components/URLShortener.tsx
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Copy, ExternalLink } from 'lucide-react'

export function URLShortener({ onUrlCreated }: { onUrlCreated: (url: any) => void }) {
  const [originalUrl, setOriginalUrl] = useState('')
  const [shortUrl, setShortUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const shortenUrl = async () => {
    if (!originalUrl) return
    setIsLoading(true)

    try {
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
      
      // Notify parent component
      onUrlCreated({
        id: Date.now(),
        original: originalUrl,
        short: data.shortUrl,
        clicks: 0,
        createdAt: new Date().toISOString().split('T')[0]
      })
      
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

  return (
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
  )
}

// components/PaymentForm.tsx
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertTriangle } from 'lucide-react'

export function PaymentForm({ onSubmit }: { onSubmit: ( any) => void }) {
  const [txid, setTxid] = useState('')
  const [wallet, setWallet] = useState('')
  const [plan, setPlan] = useState('premium-monthly')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!txid || !wallet) {
      setError('Please fill in all fields')
      return
    }
    
    onSubmit({ txid, wallet, plan })
    setTxid('')
    setWallet('')
    setError('')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <div>
        <label className="block text-sm text-gray-300 mb-2">Transaction Hash (TXID)</label>
        <Input
          type="text"
          value={txid}
          onChange={(e) => setTxid(e.target.value)}
          placeholder="0x..."
          className="bg-gray-800 border-gray-700 text-white"
        />
      </div>
      <div>
        <label className="block text-sm text-gray-300 mb-2">Sending Wallet Address</label>
        <Input
          type="text"
          value={wallet}
          onChange={(e) => setWallet(e.target.value)}
          placeholder="0x..."
          className="bg-gray-800 border-gray-700 text-white"
        />
      </div>
      <div>
        <label className="block text-sm text-gray-300 mb-2">Plan</label>
        <Select value={plan} onValueChange={setPlan}>
          <SelectTrigger className="w-full bg-gray-800 border-gray-700 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-700">
            <SelectItem value="premium-monthly">Premium Monthly ($10)</SelectItem>
            <SelectItem value="premium-yearly">Premium Yearly ($100)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
        <p className="text-sm text-yellow-400 flex items-center">
          <AlertTriangle className="w-4 h-4 mr-2" />
          Send exactly the plan amount to our verified address. Admin will verify within 24 hours.
        </p>
      </div>
      
      <Button 
        type="submit"
        className="w-full bg-purple-600 hover:bg-purple-700 text-white"
      >
        Submit Payment
      </Button>
    </form>
  )
}

// components/AdminPanel.tsx
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CheckCircle, XCircle, Users, DollarSign, Eye, Clock, Activity, AlertTriangle } from 'lucide-react'

export function AdminPanel() {
  const [users, setUsers] = useState<any[]>([])
  const [payments, setPayments] = useState<any[]>([])
  const [clickLogs, setClickLogs] = useState<any[]>([])
  const [userStats, setUserStats] = useState({
    totalUsers: 0,
    activeSubscriptions: 0,
    pendingPayments: 0,
    totalClicks: 0
  })

  useEffect(() => {
    // Fetch data from API in a real implementation
    const mockUsers = [
      { id: 1, email: 'admin@cryptolink.com', role: 'admin', status: 'active', subscription: 'active', createdAt: '2024-01-14' },
      { id: 2, email: 'user@example.com', role: 'user', status: 'active', subscription: 'free', createdAt: '2024-01-14' },
      { id: 3, email: 'premium@example.com', role: 'user', status: 'active', subscription: 'premium', createdAt: '2024-01-14' }
    ]
    
    const mockPayments = [
      { id: 1, userId: 2, plan: 'premium-monthly', cryptoType: 'USDT', txid: '0xabc123456789abcdef123456789abcdef123456789abcdef123456789abcdef1', amount: 10, status: 'pending', createdAt: '2024-01-14T10:30:00Z' },
      { id: 2, userId: 3, plan: 'premium-yearly', cryptoType: 'BNB', txid: '0xdef987654321fedcba987654321fedcba987654321fedcba987654321fedc', amount: 100, status: 'active', createdAt: '2024-01-14T09:15:00Z' }
    ]
    
    const mockClickLogs = [
      { id: 1, urlId: 1, ipHash: 'abc123', userAgent: 'Mozilla/5.0...', isValid: true, createdAt: '2024-01-14T11:00:00Z' },
      { id: 2, urlId: 1, ipHash: 'def456', userAgent: 'Bot/1.0', isValid: false, createdAt: '2024-01-14T10:45:00Z' }
    ]
    
    setUsers(mockUsers)
    setPayments(mockPayments)
    setClickLogs(mockClickLogs)
    
    setUserStats({
      totalUsers: mockUsers.length,
      activeSubscriptions: mockPayments.filter(p => p.status === 'active').length,
      pendingPayments: mockPayments.filter(p => p.status === 'pending').length,
      totalClicks: mockClickLogs.length
    })
  }, [])

  const updatePaymentStatus = async (paymentId: number, status: string) => {
    try {
      // In a real app, this would be an API call to your backend
      setPayments(prev => prev.map(p => 
        p.id === paymentId ? { ...p, status } : p
      ))
      
      // Update stats
      if (status === 'active') {
        setUserStats(prev => ({
          ...prev,
          activeSubscriptions: prev.activeSubscriptions + 1,
          pendingPayments: prev.pendingPayments - 1
        }))
      } else if (status === 'rejected') {
        setUserStats(prev => ({
          ...prev,
          pendingPayments: prev.pendingPayments - 1
        }))
      }
    } catch (err) {
      console.error(err)
    }
  }

  const updateUserStatus = async (userId: number, status: string) => {
    try {
      setUsers(prev => prev.map(u => 
        u.id === userId ? { ...u, status } : u
      ))
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white/5 backdrop-blur-sm border border-purple-800/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400">Total Users</p>
                <p className="text-2xl font-bold text-white">{userStats.totalUsers}</p>
              </div>
              <Users className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white/5 backdrop-blur-sm border border-purple-800/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400">Active Subscriptions</p>
                <p className="text-2xl font-bold text-white">{userStats.activeSubscriptions}</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white/5 backdrop-blur-sm border border-purple-800/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400">Pending Payments</p>
                <p className="text-2xl font-bold text-white">{userStats.pendingPayments}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white/5 backdrop-blur-sm border border-purple-800/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400">Total Clicks</p>
                <p className="text-2xl font-bold text-white">{userStats.totalClicks}</p>
              </div>
              <Eye className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Payments */}
      <Card className="bg-white/5 backdrop-blur-sm border border-purple-800/30">
        <CardHeader>
          <CardTitle className="text-xl text-white flex items-center">
            <Clock className="w-5 h-5 mr-2 text-yellow-400" />
            Pending Payments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-gray-300">User ID</TableHead>
                <TableHead className="text-gray-300">Plan</TableHead>
                <TableHead className="text-gray-300">Crypto Type</TableHead>
                <TableHead className="text-gray-300">Amount</TableHead>
                <TableHead className="text-gray-300">TXID</TableHead>
                <TableHead className="text-gray-300">Date</TableHead>
                <TableHead className="text-gray-300">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.filter(p => p.status === 'pending').map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="text-gray-300">{payment.userId}</TableCell>
                  <TableCell className="text-gray-300 capitalize">{payment.plan.replace('-', ' ')}</TableCell>
                  <TableCell className="text-gray-300">{payment.cryptoType}</TableCell>
                  <TableCell className="text-gray-300">${payment.amount}</TableCell>
                  <TableCell className="text-gray-400 font-mono text-xs max-w-xs truncate">
                    {payment.txid.substring(0, 20)}...
                  </TableCell>
                  <TableCell className="text-gray-400">
                    {new Date(payment.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => updatePaymentStatus(payment.id, 'active')}
                        className="text-green-400 border-green-400 hover:bg-green-400/10"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => updatePaymentStatus(payment.id, 'rejected')}
                        className="text-red-400 border-red-400 hover:bg-red-400/10"
                      >
                        <XCircle className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Users Management */}
      <Card className="bg-white/5 backdrop-blur-sm border border-purple-800/30">
        <CardHeader>
          <CardTitle className="text-xl text-white flex items-center">
            <Users className="w-5 h-5 mr-2 text-blue-400" />
            Users Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-gray-300">Email</TableHead>
                <TableHead className="text-gray-300">Role</TableHead>
                <TableHead className="text-gray-300">Status</TableHead>
                <TableHead className="text-gray-300">Subscription</TableHead>
                <TableHead className="text-gray-300">Date Created</TableHead>
                <TableHead className="text-gray-300">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="text-gray-300">{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={user.status}
                      onValueChange={(value) => updateUserStatus(user.id, value)}
                    >
                      <SelectTrigger className="w-32 bg-gray-800 border-gray-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        <SelectItem value="active">active</SelectItem>
                        <SelectItem value="inactive">inactive</SelectItem>
                        <SelectItem value="blocked">blocked</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Badge variant={
                      user.subscription === 'free' ? 'secondary' : 
                      user.subscription === 'premium' ? 'default' : 
                      'outline'
                    }>
                      {user.subscription}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-400">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => updateUserStatus(user.id, user.status === 'active' ? 'blocked' : 'active')}
                    >
                      {user.status === 'active' ? 'Block' : 'Unblock'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Suspicious Activity */}
      <Card className="bg-white/5 backdrop-blur-sm border border-purple-800/30">
        <CardHeader>
          <CardTitle className="text-xl text-white flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2 text-red-400" />
            Suspicious Click Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-gray-300">URL ID</TableHead>
                <TableHead className="text-gray-300">IP Hash</TableHead>
                <TableHead className="text-gray-300">User Agent</TableHead>
                <TableHead className="text-gray-300">Valid</TableHead>
                <TableHead className="text-gray-300">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clickLogs.filter(log => !log.isValid).map((log) => (
                <TableRow key={log.id} className="bg-red-500/10">
                  <TableCell className="text-red-400">{log.urlId}</TableCell>
                  <TableCell className="text-red-400">{log.ipHash}</TableCell>
                  <TableCell className="text-red-400 text-xs max-w-xs truncate">
                    {log.userAgent}
                  </TableCell>
                  <TableCell>
                    <Badge variant="destructive">Invalid</Badge>
                  </TableCell>
                  <TableCell className="text-gray-400">
                    {new Date(log.createdAt).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

// app/api/auth/login/route.ts
import { NextRequest } from 'next/server'
import { supabase } from '@/lib/supabase'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    // Get user from Supabase
    const {  user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single()

    if (error || !user) {
      return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash)
    if (!isValidPassword) {
      return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Return user data
    return new Response(JSON.stringify({ 
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        subscription_status: user.subscription_status
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Login error:', error)
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

// app/api/auth/register/route.ts
import { NextRequest } from 'next/server'
import { supabase } from '@/lib/supabase'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    // Check if user already exists
    const { data: existingUser, error: selectError } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single()

    if (existingUser) {
      return new Response(JSON.stringify({ error: 'User already exists' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Insert new user
    const {  newUser, error: insertError } = await supabase
      .from('users')
      .insert({
        email,
        password_hash: hashedPassword,
        role: 'user',
        status: 'active',
        subscription_status: 'free'
      })
      .select()
      .single()

    if (insertError) {
      return new Response(JSON.stringify({ error: 'Registration failed' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Return user data
    return new Response(JSON.stringify({ 
      user: {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
        subscription_status: newUser.subscription_status
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Registration error:', error)
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

// app/api/urls/create/route.ts
import { NextRequest } from 'next/server'
import { supabase } from '@/lib/supabase'
import { nanoid } from 'nanoid'

export async function POST(req: NextRequest) {
  try {
    const { originalUrl } = await req.json()
    
    // Generate short code
    const shortCode = nanoid(6)
    
    // Insert into Supabase
    const { data, error } = await supabase
      .from('urls')
      .insert({
        original_url: originalUrl,
        short_code: shortCode,
        domain: 'clnk.to',
        user_id: 'user-id-placeholder' // In a real app, get from auth token
      })
      .select()
      .single()
    
    if (error) {
      return new Response(JSON.stringify({ error: 'Failed to create short URL' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    return new Response(JSON.stringify({ 
      shortUrl: `https://clnk.to/${shortCode}` 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('URL creation error:', error)
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

// app/api/payments/submit/route.ts
import { NextRequest } from 'next/server'
import { supabase } from '@/lib/supabase'
import { CryptoVerifier } from '@/lib/crypto-verifier'

export async function POST(req: NextRequest) {
  try {
    const { txid, wallet, plan } = await req.json()
    
    // Verify transaction
    const verifier = new CryptoVerifier()
    const expectedAmount = plan === 'premium-monthly' ? 10 : 100
    const cryptoType = plan === 'premium-yearly' ? 'BNB' : 'USDT'
    
    const isValid = await verifier.verifyTransaction(txid, expectedAmount, cryptoType)
    
    if (!isValid) {
      return new Response(JSON.stringify({ error: 'Invalid transaction' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }
    
    // Check if TXID already exists
    const { data: existingPayment, error: selectError } = await supabase
      .from('payments')
      .select('id')
      .eq('txid', txid)
      .single()
    
    if (existingPayment) {
      return new Response(JSON.stringify({ error: 'Transaction already used' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }
    
    // Insert payment record
    const { data, error } = await supabase
      .from('payments')
      .insert({
        txid,
        crypto_type: cryptoType,
        amount: expectedAmount,
        plan,
        user_id: 'user-id-placeholder', // In a real app, get from auth token
        status: 'pending'
      })
      .select()
      .single()
    
    if (error) {
      return new Response(JSON.stringify({ error: 'Failed to submit payment' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Payment submission error:', error)
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

// app/api/admin/dashboard/route.ts
import { NextRequest } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  try {
    // Only allow admin users
    const authHeader = req.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.ADMIN_TOKEN}`) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      })
    }
    
    // Fetch admin data
    const {  users, error: usersError } = await supabase
      .from('users')
      .select('*')
    
    const { data: payments, error: paymentsError } = await supabase
      .from('payments')
      .select('*')
    
    const { data: clickLogs, error: clickLogsError } = await supabase
      .from('click_logs')
      .select('*')

    if (usersError || paymentsError || clickLogsError) {
      return new Response(JSON.stringify({ error: 'Failed to fetch data' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    return new Response(JSON.stringify({ 
      users,
      payments,
      clickLogs
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Admin dashboard error:', error)
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
