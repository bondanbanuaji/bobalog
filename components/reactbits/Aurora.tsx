'use client'

import React from 'react'

interface AuroraProps {
  className?: string
  colorStops?: string[]
  speed?: number
  blur?: string
}

// Seeded RNG — hasil selalu sama untuk seed yang sama (SSR & client identik)
function seededRandom(seed: number) {
  let s = seed
  return () => {
    s = (s * 16807 + 0) % 2147483647
    return (s - 1) / 2147483646
  }
}

const Aurora: React.FC<AuroraProps> = ({
  className = '',
  colorStops = ['#c4a882', '#9b7fe8', '#f29cc4', '#7bcfa0'],
  speed = 6,
  blur = '120px',
}) => {
  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {colorStops.map((color, i) => {
        const rand = seededRandom(i * 1000 + 42)
        const size = 40 + rand() * 30          // 40–70%, stabil
        const top = 10 + (i * 25) % 70
        const left = 5 + (i * 30) % 80
        const animDelay = i * (speed / colorStops.length)
        return (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${size}%`,
              height: `${size}%`,
              top: `${top}%`,
              left: `${left}%`,
              background: `radial-gradient(circle, ${color}40 0%, transparent 70%)`,
              filter: `blur(${blur})`,
              animation: `aurora-float-${i} ${speed + i * 2}s ease-in-out infinite`,
              animationDelay: `-${animDelay}s`,
              opacity: 0.5,
            }}
          />
        )
      })}
      <style jsx>{`
        @keyframes aurora-float-0 {
          0%, 100% { transform: translate(0%, 0%) scale(1); }
          33% { transform: translate(10%, -15%) scale(1.1); }
          66% { transform: translate(-5%, 10%) scale(0.95); }
        }
        @keyframes aurora-float-1 {
          0%, 100% { transform: translate(0%, 0%) scale(1); }
          33% { transform: translate(-15%, 10%) scale(1.05); }
          66% { transform: translate(10%, -10%) scale(1.1); }
        }
        @keyframes aurora-float-2 {
          0%, 100% { transform: translate(0%, 0%) scale(1.05); }
          33% { transform: translate(5%, 15%) scale(0.95); }
          66% { transform: translate(-10%, -5%) scale(1.1); }
        }
        @keyframes aurora-float-3 {
          0%, 100% { transform: translate(0%, 0%) scale(1); }
          33% { transform: translate(-10%, -10%) scale(1.15); }
          66% { transform: translate(15%, 5%) scale(0.9); }
        }
      `}</style>
    </div>
  )
}

export default Aurora