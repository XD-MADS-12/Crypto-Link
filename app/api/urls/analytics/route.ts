// app/api/url/analytics/route.ts
import { NextRequest } from 'next/server'
import { supabase } from '../lib/supabase'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const urlId = searchParams.get('urlId')
    
    if (!urlId) {
      return new Response(JSON.stringify({ error: 'Missing URL ID' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }
    
    // Get URL info
    const {  urlData, error: urlError } = await supabase
      .from('urls')
      .select('*')
      .eq('id', urlId)
      .single()
    
    if (urlError || !urlData) {
      return new Response(JSON.stringify({ error: 'URL not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      })
    }
    
    // Get click logs
    const {  clickLogs, error: logsError } = await supabase
      .from('click_logs')
      .select('*')
      .eq('url_id', urlId)
      .order('created_at', { ascending: false })
    
    if (logsError) {
      return new Response(JSON.stringify({ error: 'Failed to fetch analytics' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }
    
    return new Response(JSON.stringify({
      url: urlData,
      clicks: clickLogs.length,
      validClicks: clickLogs.filter(log => log.is_valid).length,
      invalidClicks: clickLogs.filter(log => !log.is_valid).length,
      clickLogs
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Analytics error:', error)
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
