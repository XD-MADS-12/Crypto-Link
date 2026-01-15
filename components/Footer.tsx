import { motion } from 'framer-motion'

export function Footer() {
  return (
    <motion.footer 
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="border-t border-purple-800/30 backdrop-blur-sm bg-black/20 mt-16"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center text-gray-400">
          <motion.div 
            className="flex items-center justify-center space-x-2 mb-4"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded"></div>
            <span className="text-lg font-semibold text-white">CryptoLink</span>
          </motion.div>
          <p className="text-sm">Secure URL shortening with cryptocurrency payments and advanced security.</p>
          <div className="mt-4 flex justify-center space-x-6 text-sm">
            <a href="#" className="hover:text-purple-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-purple-400 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-purple-400 transition-colors">Contact</a>
          </div>
        </div>
      </div>
    </motion.footer>
  )
}
