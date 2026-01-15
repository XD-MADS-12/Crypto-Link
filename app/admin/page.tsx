'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { AlertTriangle, CheckCircle, XCircle, Users, DollarSign, Eye, Clock, Activity } from 'lucide-react'

export default function AdminPage() {
  const [users, setUsers] = useState<any[]>([])
  const [payments, setPayments] = useState<any[]>([])
  const [clickLogs, setClickLogs] = useState<any[]>([])
  const [userStats, setUserStats] = useState({
    totalUsers: 0,
    activeSubscriptions: 0,
    pendingPayments: 0,
    totalClicks: 0
  })
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const session = localStorage.getItem('userSession')
    if (!session) {
      router.push('/auth/login')
      return
    }
    
    const userData = JSON.parse(session)
    if (userData.role !== 'admin') {
      router.push('/dashboard')
      return
    }
    
    setUser(userData)
    
    // In a real app, fetch data from API
    // For demo purposes, we'll use mock data
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
  }, [router])

  const updatePaymentStatus = async (paymentId: number, status: string) => {
    try {
      // In a real app, this would be an API call to your backend
      console.log(`Updating payment ${paymentId} to ${status}`)
      
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
      // In a real app, this would be an API call to your backend
      console.log(`Updating user ${userId} to ${status}`)
      
      setUsers(prev => prev.map(u => 
        u.id === userId ? { ...u, status } : u
      ))
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
                <Activity className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">Admin Dashboard</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-red-400 flex items-center">
                <Activity className="w-4 h-4 mr-1" />
                Admin Mode Active
              </span>
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
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-gray-400 mt-2">
            Manage users, payments, and system settings
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
        <div className="mb-8">
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
        </div>

        {/* Users Management */}
        <div className="mb-8">
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
                        <select
                          value={user.status}
                          onChange={(e) => updateUserStatus(user.id, e.target.value)}
                          className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm text-white"
                        >
                          <option value="active">active</option>
                          <option value="inactive">inactive</option>
                          <option value="blocked">blocked</option>
                        </select>
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
        </div>

        {/* Suspicious Activity */}
        <div>
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
      </main>
    </div>
  )
    }
