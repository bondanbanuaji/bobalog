'use client'

import React, { useRef, useState } from 'react'

interface MagnetProps {
  children: React.ReactNode
  padding?: number
  disabled?: boolean
  className?: string
}

const Magnet: React.FC<MagnetProps> = ({
  children,
  padding = 50,
  disabled = false,
  className = '',
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const [transform, setTransform] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const distX = e.clientX - centerX
    const distY = e.clientY - centerY
    setTransform({ x: distX * 0.3, y: distY * 0.3 })
  }

  const handleMouseLeave = () => {
    setTransform({ x: 0, y: 0 })
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`inline-block ${className}`}
      style={{
        padding: `${padding}px`,
        margin: `-${padding}px`,
      }}
    >
      <div
        style={{
          transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
          transition: transform.x === 0 && transform.y === 0 ? 'transform 0.5s cubic-bezier(0.33, 1, 0.68, 1)' : 'transform 0.15s ease-out',
          willChange: 'transform',
        }}
      >
        {children}
      </div>
    </div>
  )
}

export default Magnet
