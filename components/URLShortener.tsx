// components/ui/url-shortener.tsx
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Copy, ExternalLink, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { motion } from 'framer-motion'

export function URLShortener({ onUrlCreated }: { onUrlCreated: (url: any) => void }) {
  const [originalUrl, setOriginalUrl] = useState('')
  const [shortUrl, setShortUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)

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
      
      const newShortUrl = `${window.location.protocol}//${data.domain}/${data.short_code}`
      setShortUrl(newShortUrl)
      
      // Notify parent component
      onUrlCreated({
        id: data.id,
        original: originalUrl,
        short_code: data.short_code,
        domain: data.domain,
        clicks: 0,
        created_at: new Date().toISOString().split('T')[0]
      })
      
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
  )
}
