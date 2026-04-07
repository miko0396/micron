"use client"

import { motion } from "framer-motion"

export function ClaudeOrb() {
  return (
    <div className="relative w-36 h-36 flex items-center justify-center">
      {/* Outer soft glow */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)",
        }}
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.6, 0.9, 0.6],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Rotating outer ring */}
      <motion.div
        className="absolute w-32 h-32 rounded-full"
        style={{
          border: "2px dashed rgba(99,102,241,0.3)",
        }}
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Inner rotating ring */}
      <motion.div
        className="absolute w-24 h-24 rounded-full"
        style={{
          border: "1px solid rgba(99,102,241,0.2)",
        }}
        animate={{
          rotate: -360,
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Core orb */}
      <motion.div
        className="relative w-20 h-20 rounded-full flex items-center justify-center"
        style={{
          background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)",
          boxShadow: "0 8px 30px rgba(99,102,241,0.3), 0 4px 12px rgba(139,92,246,0.2)",
        }}
        animate={{
          scale: [1, 1.03, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <span className="text-sm font-bold text-white tracking-wide">Claude</span>
      </motion.div>

      {/* Orbiting dots */}
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-indigo-400"
          style={{
            boxShadow: "0 0 8px rgba(99,102,241,0.5)",
          }}
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 8 + i * 2,
            repeat: Infinity,
            ease: "linear",
            delay: i * 0.5,
          }}
        >
          <motion.div
            className="w-2 h-2 rounded-full bg-indigo-400"
            style={{
              transform: `translateX(${52 + i * 8}px)`,
            }}
          />
        </motion.div>
      ))}
    </div>
  )
}
