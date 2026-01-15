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
    
    const {  payments, error: paymentsError } = await supabase
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
