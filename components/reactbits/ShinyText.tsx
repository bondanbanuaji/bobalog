'use client'

import React from 'react'

interface ShinyTextProps {
  text: string
  disabled?: boolean
  speed?: number
  className?: string
}

const ShinyText: React.FC<ShinyTextProps> = ({
  text,
  disabled = false,
  speed = 5,
  className = ''
}) => {
  return (
    <span
      className={`inline-block bg-clip-text ${disabled ? '' : 'animate-shiny-text'} ${className}`}
      style={{
        backgroundImage: 'linear-gradient(120deg, rgba(255,255,255,0) 40%, rgba(255,255,255,0.8) 50%, rgba(255,255,255,0) 60%)',
        backgroundSize: '200% 100%',
        WebkitBackgroundClip: 'text',
        animationDuration: `${speed}s`,
        color: 'inherit',
      }}
    >
      {text}
    </span>
  )
}

export default ShinyText
