// app/admin-secret-key/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AlertTriangle, CheckCircle, XCircle, Users, DollarSign, Eye, Clock, Activity, Shield } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { motion } from 'framer-motion'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

export default function AdminSecretPage() {
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
  const [isLoading, setIsLoading] = useState(true)
  const [accessGranted, setAccessGranted] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    // Check if user has admin access
    const session = localStorage.getItem('userSession')
    if (session) {
      const userData = JSON.parse(session)
      if (userData.role === 'admin') {
        setUser(userData)
        setAccessGranted(true)
        fetchData()
      }
    }
  }, [])

  const handleAccess = async () => {
    if (password === 'CRYPTO_ADMIN_2024') {
      // Verify admin credentials
      const { data, error } = await supabase
        .from('users')
        .select('role')
        .eq('email', 'unkn0wn471k@yahoo.com')
        .single()
      
      if (error || data?.role !== 'admin') {
        setError('Invalid admin credentials')
        return
      }
      
      // Grant access
      setAccessGranted(true)
      setUser({ email: 'unkn0wn471k@yahoo.com', role: 'admin' })
      localStorage.setItem('userSession', JSON.stringify({
        email: 'unkn0wn471k@yahoo.com',
        role: 'admin'
      }))
      
      // Fetch data
      fetchData()
    } else {
      setError('Invalid access code')
    }
  }

  const fetchData = async () => {
    setIsLoading(true)
    
    try {
      // Fetch users
      const {  usersData, error: usersError } = await supabase
        .from('users')
        .select('*')
      
      if (usersError) throw usersError
      
      // Fetch payments
      const {  paymentsData, error: paymentsError } = await supabase
        .from('payments')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (paymentsError) throw paymentsError
      
      // Fetch click logs
      const {  clickLogsData, error: clickLogsError } = await supabase
        .from('click_logs')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (clickLogsError) throw clickLogsError
      
      setUsers(usersData || [])
      setPayments(paymentsData || [])
      setClickLogs(clickLogsData || [])
      
      // Calculate stats
      setUserStats({
        totalUsers: usersData?.length || 0,
        activeSubscriptions: paymentsData?.filter((p: any) => p.status === 'active').length || 0,
        pendingPayments: paymentsData?.filter((p: any) => p.status === 'pending').length || 0,
        totalClicks: clickLogsData?.length || 0
      })
    } catch (error) {
      console.error('Error fetching admin data', error)
    } finally {
      setIsLoading(false)
    }
  }

  const updatePaymentStatus = async (paymentId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('payments')
        .update({ status })
        .eq('id', paymentId)
      
      if (error) throw error
      
      // Update local state
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

  const updateUserStatus = async (userId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ status })
        .eq('id', userId)
      
      if (error) throw error
      
      setUsers(prev => prev.map(u => 
        u.id === userId ? { ...u, status } : u
      ))
    } catch (err) {
      console.error(err)
    }
  }

  if (!accessGranted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-purple-800/30"
        >
          <div className="text-center mb-6">
            <Shield className="w-12 h-12 text-purple-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white">Admin Access Required</h2>
            <p className="text-gray-400 mt-2">Enter admin access code to continue</p>
          </div>
          
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 mb-4 text-red-300">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter access code"
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white"
            />
            <Button 
              onClick={handleAccess}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2"
            >
              Access Admin Panel
            </Button>
          </div>
        </motion.div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <LoadingSpinner />
          <p className="text-white mt-4">Loading admin panel...</p>
        </div>
      </div>
    )
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
          <h1 className="text-3xl font-bold text-white flex items-center">
            <Shield className="w-8 h-8 text-purple-400 mr-3" />
            Admin Dashboard
          </h1>
          <p className="text-gray-400 mt-2 flex items-center">
            <Activity className="w-4 h-4 mr-2" />
            Admin Mode Active
          </p>
        </motion.div>

        {/* Stats Overview */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
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
        </motion.div>

        {/* Pending Payments */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
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
                    <motion.tr
                      key={payment.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <TableCell className="text-gray-300">{payment.user_id}</TableCell>
                      <TableCell className="text-gray-300 capitalize">{payment.plan.replace('-', ' ')}</TableCell>
                      <TableCell className="text-gray-300">{payment.crypto_type}</TableCell>
                      <TableCell className="text-gray-300">${payment.amount}</TableCell>
                      <TableCell className="text-gray-400 font-mono text-xs max-w-xs truncate">
                        {payment.txid.substring(0, 20)}...
                      </TableCell>
                      <TableCell className="text-gray-400">
                        {new Date(payment.created_at).toLocaleDateString()}
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
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </motion.div>

        {/* Users Management */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-8"
        >
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
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
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
                          user.subscription_status === 'free' ? 'secondary' : 
                          user.subscription_status === 'active' ? 'default' : 
                          'outline'
                        }>
                          {user.subscription_status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-400">
                        {new Date(user.created_at).toLocaleDateString()}
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
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </motion.div>

        {/* Suspicious Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
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
                  {clickLogs.filter(log => !log.is_valid).map((log) => (
                    <motion.tr
                      key={log.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="bg-red-500/10"
                    >
                      <TableCell className="text-red-400">{log.url_id}</TableCell>
                      <TableCell className="text-red-400">{log.ip_hash}</TableCell>
                      <TableCell className="text-red-400 text-xs max-w-xs truncate">
                        {log.user_agent}
                      </TableCell>
                      <TableCell>
                        <Badge variant="destructive">Invalid</Badge>
                      </TableCell>
                      <TableCell className="text-gray-400">
                        {new Date(log.created_at).toLocaleString()}
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
