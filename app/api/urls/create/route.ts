// app/api/urls/create/route.ts
import { NextRequest } from 'next/server'
import { supabase } from '../lib/supabase'
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
