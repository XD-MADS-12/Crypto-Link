// app/api/auth/register/route.ts
import { NextRequest } from 'next/server'
import { supabase } from '../lib/supabase'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    // Check if user already exists
    const {  existingUser, error: selectError } = await supabase
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
