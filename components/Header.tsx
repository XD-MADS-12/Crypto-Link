import { Button } from './ui/button'
import { useRouter } from 'next/navigation'
import { Zap, User, Shield } from 'lucide-react'
import { motion } from 'framer-motion'

export function Header({ user }: { user: any }) {
  const router = useRouter()

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="border-b border-purple-800/30 backdrop-blur-sm bg-black/20 sticky top-0 z-40"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <motion.div 
            className="flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">CryptoLink</span>
          </motion.div>
          
          <nav className="hidden md:flex space-x-8">
            <motion.a 
              href="/" 
              className="text-sm font-medium text-gray-300 hover:text-purple-400 transition-colors"
              whileHover={{ y: -2 }}
            >
              Home
            </motion.a>
            <motion.a 
              href="/dashboard" 
              className="text-sm font-medium text-gray-300 hover:text-purple-400 transition-colors"
              whileHover={{ y: -2 }}
            >
              Dashboard
            </motion.a>
            {user?.role === 'admin' && (
              <motion.a 
                href="/admin" 
                className="text-sm font-medium text-gray-300 hover:text-purple-400 transition-colors flex items-center"
                whileHover={{ y: -2 }}
              >
                <Shield className="w-4 h-4 mr-1" /> Admin Panel
              </motion.a>
            )}
          </nav>

          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-300 flex items-center">
                  <User className="w-4 h-4 mr-1" /> {user.email}
                </span>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    localStorage.removeItem('userSession')
                    router.push('/')
                  }}
                >
                  Logout
                </Button>
              </div>
            ) : (
              <Button asChild>
                <a href="/auth/login">Login</a>
              </Button>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  )
            }
