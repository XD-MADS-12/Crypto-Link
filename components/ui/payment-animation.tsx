import { motion } from 'framer-motion'
import { CheckCircle, Clock, XCircle } from 'lucide-react'

export function PaymentAnimation({ status }: { status: 'pending' | 'success' | 'error' }) {
  if (status === 'pending') {
    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="flex flex-col items-center justify-center p-8"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full mb-4"
        />
        <h3 className="text-xl font-bold text-white">Verifying Transaction</h3>
        <p className="text-gray-400 mt-2">Checking blockchain for your payment</p>
      </motion.div>
    )
  }

  if (status === 'success') {
    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="flex flex-col items-center justify-center p-8"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
        </motion.div>
        <h3 className="text-xl font-bold text-white">Payment Verified!</h3>
        <p className="text-gray-400 mt-2">Your subscription will be activated shortly</p>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      className="flex flex-col items-center justify-center p-8"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
      >
        <XCircle className="w-16 h-16 text-red-500 mb-4" />
      </motion.div>
      <h3 className="text-xl font-bold text-white">Verification Failed</h3>
      <p className="text-gray-400 mt-2">Please check your transaction details</p>
    </motion.div>
  )
      }
