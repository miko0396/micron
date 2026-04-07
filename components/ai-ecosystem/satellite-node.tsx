"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import type { ServiceInfo } from "./ecosystem-visualization"

export interface NodeData {
  id: number
  title: string
  services: ServiceInfo[]
  isComplement: boolean
  claudeStrengths: string[]
  claudeWeaknesses: string[]
}

interface SatelliteNodeProps {
  node: NodeData
  angle: number
  radius: number
  index: number
  onSelect: (node: NodeData) => void
  isSelected: boolean
  onServiceClick: (service: ServiceInfo) => void
}

export function SatelliteNode({ node, angle, radius, index, onSelect, isSelected, onServiceClick }: SatelliteNodeProps) {
  const [isHovered, setIsHovered] = useState(false)
  
  const x = Math.cos(angle) * radius
  const y = Math.sin(angle) * radius

  const handleNodeClick = () => {
    onSelect(node)
  }

  // Determine if this node has services to show
  const hasServices = node.services.length > 0

  return (
    <motion.div
      className="absolute"
      style={{
        left: "50%",
        top: "50%",
      }}
      initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
      animate={{
        x: x - 85,
        y: y - 40,
        opacity: 1,
        scale: 1,
      }}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 15,
        delay: 0.3 + index * 0.12,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Node container - wider for Japanese text */}
      <motion.div
        className={`relative w-[170px] rounded-xl p-3 cursor-pointer transition-all duration-200 ${
          isHovered || isSelected ? "z-50" : "z-10"
        }`}
        style={{
          background: "white",
          border: node.isComplement 
            ? "2px solid rgb(244 63 94)"
            : "2px solid rgb(99 102 241)",
          boxShadow: isHovered || isSelected
            ? node.isComplement
              ? "0 8px 30px rgba(244,63,94,0.2), 0 4px 12px rgba(0,0,0,0.08)"
              : "0 8px 30px rgba(99,102,241,0.2), 0 4px 12px rgba(0,0,0,0.08)"
            : "0 2px 8px rgba(0,0,0,0.06)",
        }}
        animate={{
          scale: isHovered || isSelected ? 1.05 : 1,
        }}
        transition={{ duration: 0.2 }}
        onClick={handleNodeClick}
      >
        {/* Category indicator dot */}
        <div
          className={`absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full ${
            node.isComplement ? "bg-rose-500" : "bg-indigo-500"
          }`}
        />

        {/* Content */}
        <div className="relative z-10">
          {/* Category label */}
          <p className={`text-[10px] mb-1 font-medium ${
            node.isComplement ? "text-rose-500" : "text-indigo-500"
          }`}>
            {node.isComplement ? "苦手を補完" : "Claude Native"}
          </p>
          
          {/* Title - full Japanese text */}
          <p className="text-sm font-bold text-neutral-800 leading-tight mb-2">
            {node.title}
          </p>
          
          {/* Service tags preview */}
          <div className="flex flex-wrap gap-1">
            {hasServices ? (
              <>
                {node.services.slice(0, 2).map((service, i) => (
                  <span
                    key={i}
                    className={`text-[9px] px-1.5 py-0.5 rounded-full ${
                      node.isComplement 
                        ? "bg-rose-50 text-rose-600"
                        : "bg-indigo-50 text-indigo-600"
                    }`}
                  >
                    {service.name}
                  </span>
                ))}
                {node.services.length > 2 && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-neutral-100 text-neutral-500">
                    +{node.services.length - 2}
                  </span>
                )}
              </>
            ) : (
              <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${
                node.isComplement 
                  ? "bg-rose-50 text-rose-600"
                  : "bg-indigo-50 text-indigo-600"
              }`}>
                Claude単体
              </span>
            )}
          </div>
        </div>

        {/* Selection indicator */}
        {isSelected && (
          <motion.div
            className={`absolute inset-0 rounded-xl ${
              node.isComplement ? "bg-rose-500" : "bg-indigo-500"
            } opacity-5`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.05 }}
          />
        )}
      </motion.div>
    </motion.div>
  )
}
