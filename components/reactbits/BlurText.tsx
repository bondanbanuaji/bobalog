'use client'

import React from 'react'
import { motion, type Variants } from 'framer-motion'

interface BlurTextProps {
  text: string
  className?: string
  delay?: number
  duration?: number
}

const BlurText: React.FC<BlurTextProps> = ({
  text,
  className = '',
  delay = 0.04,
  duration = 0.6,
}) => {
  const words = text.split(' ')

  const container: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: delay,
      },
    },
  }

  const child: Variants = {
    hidden: { opacity: 0, filter: 'blur(10px)' },
    visible: {
      opacity: 1,
      filter: 'blur(0px)',
      transition: {
        duration,
        ease: 'easeOut',
      },
    },
  }

  return (
    <motion.p
      className={className}
      variants={container}
      initial="hidden"
      animate="visible"
      aria-label={text}
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          variants={child}
          style={{ display: 'inline-block', whiteSpace: 'pre' }}
        >
          {i > 0 ? ` ${word}` : word}
        </motion.span>
      ))}
    </motion.p>
  )
}

export default BlurText
