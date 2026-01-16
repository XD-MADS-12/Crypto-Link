// app/api/payments/submit/route.ts
import { NextRequest } from 'next/server'
import { supabase } from '../lib/supabase'
import { CryptoVerifier } from '../lib/crypto-verifier'

export async function POST(req: NextRequest) {
  try {
    const { txid, wallet, plan } = await req.json()
    
    // Verify transaction
    const verifier = new CryptoVerifier()
    const expectedAmount = plan === 'premium-monthly' ? 10 : 100
    const cryptoType = plan === 'premium-yearly' ? 'BNB' : 'USDT'
    
    const isValid = await verifier.verifyTransaction(txid, expectedAmount, cryptoType)
    
    if (!isValid.valid) {
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
