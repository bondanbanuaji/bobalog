'use client'

import React from 'react'

interface GradientTextProps {
  children: React.ReactNode
  className?: string
  colors?: string[]
  animationSpeed?: number
}

const GradientText: React.FC<GradientTextProps> = ({
  children,
  className = '',
  colors = ['#c4a882', '#9b7fe8', '#f29cc4', '#7bcfa0', '#c4a882'],
  animationSpeed = 8,
}) => {
  const gradientStyle: React.CSSProperties = {
    backgroundImage: `linear-gradient(to right, ${colors.join(', ')})`,
    backgroundSize: '300% 100%',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    animation: `gradient-shift ${animationSpeed}s ease-in-out infinite`,
    display: 'inline-block',
  }

  return (
    <span className={className} style={gradientStyle}>
      {children}
    </span>
  )
}

export default GradientText
