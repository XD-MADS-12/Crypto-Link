import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
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
      {/* Header */}
      <header className="border-b border-purple-800/30 backdrop-blur-sm bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">CryptoLink</span>
            </div>
            
            <nav className="hidden md:flex space-x-8">
              <a href="/" className="text-sm font-medium text-purple-400 hover:text-purple-300 transition-colors">
                Home
              </a>
              <a href="/auth/login" className="text-sm font-medium text-gray-300 hover:text-purple-400 transition-colors">
                Login
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <section className="text-center space-y-6 mb-16">
          <h1 className="text-5xl font-bold text-white leading-tight">
            Secure Crypto-Based
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"> URL Shortener</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Pay with cryptocurrency, get premium features. Secure, fast, and privacy-focused URL shortening with advanced anti-bot protection.
          </p>
          
          <div className="flex justify-center space-x-4">
            <Button asChild className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
              <a href="/auth/register">Get Started</a>
            </Button>
            <Button variant="outline" asChild className="border border-purple-600 text-purple-400 hover:bg-purple-600/20 px-8 py-3 rounded-lg font-semibold transition-colors">
              <a href="#pricing">View Plans</a>
            </Button>
          </div>
        </section>

        {/* Features Grid */}
        <section className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="bg-white/5 backdrop-blur-sm border border-purple-800/30">
            <CardContent className="p-6">
              <Shield className="w-12 h-12 text-purple-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Advanced Security</h3>
              <p className="text-gray-300">Military-grade encryption and anti-bot protection to keep your links safe.</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/5 backdrop-blur-sm border border-purple-800/30">
            <CardContent className="p-6">
              <Coins className="w-12 h-12 text-purple-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Crypto Payments</h3>
              <p className="text-gray-300">Pay with various cryptocurrencies including USDT, BNB, and more.</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/5 backdrop-blur-sm border border-purple-800/30">
            <CardContent className="p-6">
              <TrendingUp className="w-12 h-12 text-purple-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Analytics</h3>
              <p className="text-gray-300">Detailed analytics to track your link performance and engagement.</p>
            </CardContent>
          </Card>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="space-y-6 mb-16">
          <h2 className="text-3xl font-bold text-center text-white">Choose Your Plan</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan, index) => (
              <Card 
                key={index} 
                className={`bg-white/5 backdrop-blur-sm border ${
                  plan.name === 'Premium Monthly' ? 'border-purple-500 ring-2 ring-purple-500/20' : 'border-purple-800/30'
                }`}
              >
                <CardHeader>
                  <CardTitle className="text-white">{plan.name}</CardTitle>
                  <div className="text-3xl font-bold text-purple-400">{plan.price}</div>
                </CardHeader>
                <CardContent>
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
                  {plan.ads && (
                    <Badge variant="secondary" className="mt-4 w-full justify-center bg-yellow-500/20 text-yellow-400">
                      Ads Enabled
                    </Badge>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Security Section */}
        <section className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-purple-800/30 mb-16">
          <h2 className="text-2xl font-bold text-white mb-4">Advanced Security & Fraud Protection</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-purple-400 mb-2">Anti-Bot Protection</h3>
              <p className="text-gray-300">
                Multi-layer system with IP cooldown, user-agent filtering, and click validation to prevent fraudulent activity.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-purple-400 mb-2">Crypto Payment Verification</h3>
              <p className="text-gray-300">
                Read-only blockchain verification ensures payments are valid before activating subscriptions.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-purple-400 mb-2">Rate Limiting</h3>
              <p className="text-gray-300">
                Automated systems monitor and limit requests to prevent abuse and maintain service quality.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-purple-400 mb-2">Suspicious Activity Detection</h3>
              <p className="text-gray-300">
                AI-powered detection flags unusual patterns for admin review and action.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-purple-800/30 backdrop-blur-sm bg-black/20 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-400">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded"></div>
              <span className="text-lg font-semibold text-white">CryptoLink</span>
            </div>
            <p className="text-sm">Secure URL shortening with cryptocurrency payments and advanced security.</p>
            <div className="mt-4 flex justify-center space-x-6 text-sm">
              <a href="#" className="hover:text-purple-400 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-purple-400 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-purple-400 transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
      }
