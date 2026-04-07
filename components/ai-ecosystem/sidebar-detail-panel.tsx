"use client"

import { motion } from "framer-motion"
import { X, Sparkles, ExternalLink, AlertTriangle } from "lucide-react"
import type { NodeData } from "./satellite-node"
import type { ServiceInfo } from "./ecosystem-visualization"

interface SidebarDetailPanelProps {
  node: NodeData
  onClose: () => void
  onServiceClick: (service: ServiceInfo) => void
}

export function SidebarDetailPanel({ node, onClose, onServiceClick }: SidebarDetailPanelProps) {
  return (
    <motion.div
      className="fixed right-0 top-0 h-full w-[380px] bg-white shadow-2xl z-40 overflow-hidden flex flex-col"
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {/* Header */}
      <div className={`relative px-6 py-5 ${node.isComplement ? "bg-rose-500" : "bg-indigo-500"}`}>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
        >
          <X className="w-4 h-4 text-white" />
        </button>
        <div className="flex items-center gap-3 mb-2">
          <div className={`w-3 h-3 rounded-full ${node.isComplement ? "bg-rose-200" : "bg-indigo-200"}`} />
          <span className="text-white/80 text-xs font-medium">
            {node.isComplement ? "苦手を補完" : "Claude Native"}
          </span>
        </div>
        <h2 className="text-xl font-bold text-white">{node.title}</h2>
      </div>

      {/* Content - scrollable */}
      <div className="flex-1 overflow-y-auto">
        {/* Claude strengths */}
        <div className="px-6 py-5 border-b border-neutral-100">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-full flex items-center justify-center bg-emerald-100">
              <Sparkles className="w-4 h-4 text-emerald-600" />
            </div>
            <h3 className="text-sm font-semibold text-neutral-800">Claudeの強み</h3>
          </div>
          <ul className="space-y-2">
            {node.claudeStrengths.map((strength, i) => (
              <li key={i} className="text-sm text-neutral-600 flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 bg-emerald-400" />
                {strength}
              </li>
            ))}
          </ul>
        </div>

        {/* Claude weaknesses */}
        <div className="px-6 py-5 border-b border-neutral-100">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-full flex items-center justify-center bg-amber-100">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
            </div>
            <h3 className="text-sm font-semibold text-neutral-800">Claudeの苦手</h3>
          </div>
          <ul className="space-y-2">
            {node.claudeWeaknesses.map((weakness, i) => (
              <li key={i} className="text-sm text-neutral-600 flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 bg-amber-400" />
                {weakness}
              </li>
            ))}
          </ul>
        </div>

        {/* Services list */}
        {node.services.length > 0 && (
          <div className="px-6 py-5">
            <h3 className="text-sm font-semibold text-neutral-800 mb-4">
              {node.isComplement ? "補完サービス" : "関連サービス"}
            </h3>
            <div className="space-y-3">
              {node.services.map((service, i) => (
                <button
                  key={i}
                  onClick={() => onServiceClick(service)}
                  className="w-full p-4 rounded-xl border border-neutral-200 hover:border-neutral-300 hover:shadow-md transition-all text-left group"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white text-sm font-bold ${
                      node.isComplement ? "bg-rose-500" : "bg-indigo-500"
                    }`}>
                      {service.name.slice(0, 2)}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-neutral-800 group-hover:text-neutral-900">
                        {service.name}
                      </p>
                      <p className="text-xs text-neutral-400">
                        {service.freeTier ? "無料枠あり" : "有料サービス"}
                      </p>
                    </div>
                    <ExternalLink className="w-4 h-4 text-neutral-300 group-hover:text-neutral-500 transition-colors" />
                  </div>
                  <p className="text-xs text-neutral-500 line-clamp-2">{service.description}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* No services message */}
        {node.services.length === 0 && (
          <div className="px-6 py-8 text-center">
            <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mx-auto mb-3">
              <Sparkles className="w-6 h-6 text-indigo-500" />
            </div>
            <p className="text-sm font-medium text-neutral-800 mb-1">Claude単体で完結</p>
            <p className="text-xs text-neutral-500">
              この領域はClaudeの機能だけで対応可能です
            </p>
          </div>
        )}
      </div>
    </motion.div>
  )
}
