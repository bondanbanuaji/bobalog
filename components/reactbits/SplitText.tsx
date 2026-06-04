'use client'

import React from 'react'
import { motion, type Variants } from 'framer-motion'

interface SplitTextProps {
  text: string
  className?: string
  delay?: number
  duration?: number
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span'
  splitBy?: 'chars' | 'words'
  onAnimationComplete?: () => void
}

const SplitText: React.FC<SplitTextProps> = ({
  text,
  className = '',
  delay = 0.03,
  duration = 0.5,
  tag = 'p',
  splitBy = 'chars',
  onAnimationComplete,
}) => {
  const Tag = tag as React.ElementType

  const parts = splitBy === 'chars'
    ? text.split('')
    : text.split(' ')

  const container: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: delay,
      },
    },
  }

  const child: Variants = {
    hidden: { opacity: 0, y: 20, filter: 'blur(4px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        type: 'spring',
        damping: 20,
        stiffness: 200,
        duration,
      },
    },
  }

  return (
    <Tag className={className}>
      <motion.span
        variants={container}
        initial="hidden"
        animate="visible"
        onAnimationComplete={onAnimationComplete}
        aria-label={text}
        style={{ display: 'inline-flex', flexWrap: 'wrap' }}
      >
        {parts.map((part, i) => (
          <motion.span
            key={i}
            variants={child}
            style={{ display: 'inline-block', whiteSpace: 'pre' }}
          >
            {splitBy === 'words' && i > 0 ? ` ${part}` : part}
          </motion.span>
        ))}
      </motion.span>
    </Tag>
  )
}

export default SplitText
