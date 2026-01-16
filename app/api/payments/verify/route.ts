// app/api/payments/verify/route.ts
import { NextRequest } from 'next/server'
import { supabase } from '../lib/supabase'
import { CryptoVerifier } from '../lib/crypto-verifier'

export async function POST(req: NextRequest) {
  try {
    const { txid, expectedAmount, cryptoType } = await req.json()
    
    // Verify transaction
    const verifier = new CryptoVerifier()
    const result = await verifier.verifyTransaction(txid, expectedAmount, cryptoType)
    
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Payment verification error:', error)
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
