"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import type { NodeData } from "./satellite-node"

interface OrbitLinesProps {
  nodes: NodeData[]
  radius: number
  selectedNode: NodeData | null
}

interface Particle {
  id: number
  nodeIndex: number
  progress: number
}

export function OrbitLines({ nodes, radius, selectedNode }: OrbitLinesProps) {
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    // Initialize particles
    const initialParticles: Particle[] = []
    nodes.forEach((_, nodeIndex) => {
      // 2 particles per node
      for (let i = 0; i < 2; i++) {
        initialParticles.push({
          id: nodeIndex * 2 + i,
          nodeIndex,
          progress: (i / 2) * 100,
        })
      }
    })
    setParticles(initialParticles)

    // Animate particles
    const interval = setInterval(() => {
      setParticles((prev) =>
        prev.map((p) => ({
          ...p,
          progress: (p.progress + 0.6) % 100,
        }))
      )
    }, 50)

    return () => clearInterval(interval)
  }, [nodes])

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ overflow: "visible" }}
    >
      <defs>
        {/* Gradient for default lines */}
        <linearGradient id="lineGradientLight" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(99,102,241,0.1)" />
          <stop offset="50%" stopColor="rgba(99,102,241,0.4)" />
          <stop offset="100%" stopColor="rgba(99,102,241,0.1)" />
        </linearGradient>
        
        {/* Active line gradient */}
        <linearGradient id="activeLineGradientLight" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(99,102,241,0.3)" />
          <stop offset="50%" stopColor="rgba(99,102,241,0.8)" />
          <stop offset="100%" stopColor="rgba(99,102,241,0.3)" />
        </linearGradient>

        {/* Complement line gradient */}
        <linearGradient id="complementLineGradientLight" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(244,63,94,0.1)" />
          <stop offset="50%" stopColor="rgba(244,63,94,0.4)" />
          <stop offset="100%" stopColor="rgba(244,63,94,0.1)" />
        </linearGradient>

        {/* Active complement gradient */}
        <linearGradient id="activeComplementGradientLight" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(244,63,94,0.3)" />
          <stop offset="50%" stopColor="rgba(244,63,94,0.8)" />
          <stop offset="100%" stopColor="rgba(244,63,94,0.3)" />
        </linearGradient>

        {/* Glow filter */}
        <filter id="glowLight" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Center point reference */}
      <g style={{ transform: "translate(50%, 50%)" }}>
        {nodes.map((node, index) => {
          const angle = (index * 2 * Math.PI) / nodes.length - Math.PI / 2
          const endX = Math.cos(angle) * radius
          const endY = Math.sin(angle) * radius
          const isSelected = selectedNode?.id === node.id
          const isComplement = node.isComplement

          return (
            <g key={node.id}>
              {/* Base line */}
              <motion.line
                x1="0"
                y1="0"
                x2={endX}
                y2={endY}
                stroke={
                  isSelected
                    ? isComplement
                      ? "url(#activeComplementGradientLight)"
                      : "url(#activeLineGradientLight)"
                    : isComplement
                    ? "url(#complementLineGradientLight)"
                    : "url(#lineGradientLight)"
                }
                strokeWidth={isSelected ? 2.5 : 1.5}
                strokeDasharray={isSelected ? "0" : "6,6"}
                filter={isSelected ? "url(#glowLight)" : undefined}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{
                  pathLength: 1,
                  opacity: 1,
                  strokeDashoffset: isSelected ? 0 : [0, -12],
                }}
                transition={{
                  pathLength: { delay: 0.4 + index * 0.08, duration: 0.6 },
                  opacity: { delay: 0.4 + index * 0.08, duration: 0.3 },
                  strokeDashoffset: {
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "linear",
                  },
                }}
              />

              {/* Particles traveling toward center */}
              {particles
                .filter((p) => p.nodeIndex === index)
                .map((particle) => {
                  const progress = particle.progress / 100
                  const px = endX * (1 - progress)
                  const py = endY * (1 - progress)

                  return (
                    <motion.circle
                      key={particle.id}
                      cx={px}
                      cy={py}
                      r={isSelected ? 4 : 3}
                      fill={isComplement ? "#f43f5e" : "#6366f1"}
                      opacity={Math.sin(progress * Math.PI) * (isSelected ? 0.9 : 0.5)}
                      filter="url(#glowLight)"
                    />
                  )
                })}
            </g>
          )
        })}

        {/* Center decoration circle */}
        <motion.circle
          cx="0"
          cy="0"
          r={radius + 30}
          fill="none"
          stroke="rgba(99,102,241,0.08)"
          strokeWidth="1"
          strokeDasharray="3,6"
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            rotate: 360,
          }}
          transition={{
            opacity: { delay: 0.8, duration: 0.5 },
            rotate: { duration: 120, repeat: Infinity, ease: "linear" },
          }}
        />
      </g>
    </svg>
  )
}
