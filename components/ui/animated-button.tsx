import { motion } from 'framer-motion'
import { Button } from './button'

export function AnimatedButton({ children, onClick, disabled, className }: any) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      disabled={disabled}
      className={className}
    >
      {children}
    </motion.button>
  )
}
