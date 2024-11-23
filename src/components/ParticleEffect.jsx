import { useEffect, useState } from 'react'
import '../styles/ParticleEffect.css'

const ParticleEffect = ({ x, y, color, onComplete }) => {
  const [particles, setParticles] = useState(
    Array(10).fill().map(() => ({
      x: 0,
      y: 0,
      angle: Math.random() * Math.PI * 2,
      speed: 1 + Math.random() * 2,
      alpha: 1
    }))
  )

  useEffect(() => {
    const animation = requestAnimationFrame(function animate() {
      setParticles(prev => {
        const next = prev.map(particle => ({
          ...particle,
          x: particle.x + Math.cos(particle.angle) * particle.speed,
          y: particle.y + Math.sin(particle.angle) * particle.speed,
          alpha: particle.alpha - 0.02
        }))

        if (next.every(p => p.alpha <= 0)) {
          onComplete()
          return prev
        }

        requestAnimationFrame(animate)
        return next
      })
    })

    return () => cancelAnimationFrame(animation)
  }, [onComplete])

  return (
    <div className="particle-container" style={{ left: x, top: y }}>
      {particles.map((particle, i) => (
        <div
          key={i}
          className="particle"
          style={{
            left: particle.x,
            top: particle.y,
            backgroundColor: color,
            opacity: particle.alpha,
            transform: `scale(${particle.alpha})`
          }}
        />
      ))}
    </div>
  )
}

export default ParticleEffect