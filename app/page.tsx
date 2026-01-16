'use client'

import { motion } from 'framer-motion'
import { Button } from '../components/ui/button'
import { Card } from '../components/ui/card'
import { CheckCircle, Shield, Coins, TrendingUp, Zap, Lock } from 'lucide-react'

export default function HomePage() {
  const plans = [
    {
      name: 'Free',
      price: '$0',
      features: ['100 links/month', 'Basic analytics', 'Standard redirects'],
      ads: true,
      limit: 100
    },
    {
      name: 'Premium Monthly',
      price: '$10',
      features: ['Unlimited links', 'Advanced analytics', 'Custom domains', 'No ads', 'Priority support'],
      ads: false,
      limit: null
    },
    {
      name: 'Premium Yearly',
      price: '$100',
      features: ['Unlimited links', 'Advanced analytics', 'Custom domains', 'No ads', 'Priority support', '20% discount'],
      ads: false,
      limit: null
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="py-20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            className="text-5xl md:text-6xl font-bold text-white leading-tight mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Secure Crypto-Based
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"> URL Shortener</span>
          </motion.h1>
          
          <motion.p 
            className="text-xl text-gray-300 max-w-3xl mx-auto mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Pay with cryptocurrency, get premium features. Secure, fast, and privacy-focused URL shortening with advanced anti-bot protection.
          </motion.p>
          
          <motion.div 
            className="flex justify-center space-x-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Button asChild className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
              <a href="/auth/register">Get Started</a>
            </Button>
            <Button variant="outline" asChild className="border border-purple-600 text-purple-400 hover:bg-purple-600/20 px-8 py-3 rounded-lg font-semibold transition-colors">
              <a href="#pricing">View Plans</a>
            </Button>
          </motion.div>
        </div>
      </motion.section>

      {/* Features Grid */}
      <motion.section 
        id="features"
        className="py-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              whileHover={{ y: -10 }}
              className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-purple-800/30"
            >
              <Shield className="w-12 h-12 text-purple-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Advanced Security</h3>
              <p className="text-gray-300">Military-grade encryption and anti-bot protection to keep your links safe.</p>
            </motion.div>
            
            <motion.div
              whileHover={{ y: -10 }}
              className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-purple-800/30"
            >
              <Coins className="w-12 h-12 text-purple-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Crypto Payments</h3>
              <p className="text-gray-300">Pay with various cryptocurrencies including USDT, BNB, and more.</p>
            </motion.div>
            
            <motion.div
              whileHover={{ y: -10 }}
              className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-purple-800/30"
            >
              <TrendingUp className="w-12 h-12 text-purple-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Analytics</h3>
              <p className="text-gray-300">Detailed analytics to track your link performance and engagement.</p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Pricing Section */}
      <motion.section 
        id="pricing"
        className="py-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-white mb-12">Choose Your Plan</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -10 }}
                className={`bg-white/5 backdrop-blur-sm rounded-xl p-6 border ${
                  plan.name === 'Premium Monthly' ? 'border-purple-500 ring-2 ring-purple-500/20' : 'border-purple-800/30'
                }`}
              >
                <h3 className="text-xl font-semibold text-white mb-2">{plan.name}</h3>
                <div className="text-3xl font-bold text-purple-400 mb-4">{plan.price}</div>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="text-gray-300 flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button 
                  asChild
                  className={`w-full ${
                    plan.name === 'Premium Monthly' 
                      ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                      : 'bg-gray-700 hover:bg-gray-600 text-white'
                  }`}
                >
                  <a href="/auth/register">{plan.name === 'Free' ? 'Get Started' : 'Upgrade Now'}</a>
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>
    </div>
  )
}
