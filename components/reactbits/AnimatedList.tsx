'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface AnimatedListProps {
  children: React.ReactNode[]
  className?: string
  delay?: number
}

const AnimatedList: React.FC<AnimatedListProps> = ({
  children,
  className = '',
  delay = 0.05
}) => {
  return (
    <div className={className}>
      <AnimatePresence>
        {React.Children.map(children, (child, i) => (
          <motion.div
            key={(child as React.ReactElement).key || i}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
            transition={{
              type: 'spring',
              stiffness: 260,
              damping: 20,
              delay: i * delay,
            }}
          >
            {child}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

export default AnimatedList
