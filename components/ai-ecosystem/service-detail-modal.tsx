"use client"

import { motion } from "framer-motion"
import { X, ExternalLink, Check, Sparkles } from "lucide-react"
import type { ServiceInfo } from "./ecosystem-visualization"

interface ServiceDetailModalProps {
  service: ServiceInfo
  onClose: () => void
}

export function ServiceDetailModal({ service, onClose }: ServiceDetailModalProps) {
  return (
    <>
      {/* Backdrop */}
      <motion.div
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        className="fixed top-1/2 left-1/2 z-50 w-full max-w-lg"
        initial={{ opacity: 0, scale: 0.95, x: "-50%", y: "-50%" }}
        animate={{ opacity: 1, scale: 1, x: "-50%", y: "-50%" }}
        exit={{ opacity: 0, scale: 0.95, x: "-50%", y: "-50%" }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
      >
        <div className="bg-white rounded-2xl shadow-xl border border-neutral-200 overflow-hidden">
          {/* Header */}
          <div className="relative bg-gradient-to-r from-indigo-500 to-violet-500 px-6 py-5">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
            >
              <X className="w-4 h-4 text-white" />
            </button>
            <h2 className="text-xl font-bold text-white mb-1">{service.name}</h2>
            <a
              href={service.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-white/80 hover:text-white text-sm transition-colors"
            >
              {service.url.replace("https://", "")}
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Content */}
          <div className="p-6 space-y-5">
            {/* Description */}
            <div>
              <h3 className="text-sm font-semibold text-neutral-800 mb-2">概要</h3>
              <p className="text-sm text-neutral-600 leading-relaxed">{service.description}</p>
            </div>

            {/* Pricing */}
            <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-100">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                </div>
                <h3 className="text-sm font-semibold text-neutral-800">料金プラン</h3>
              </div>
              <p className="text-sm text-neutral-700">{service.pricing}</p>
            </div>

            {/* Free Tier */}
            {service.freeTier && (
              <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  </div>
                  <h3 className="text-sm font-semibold text-emerald-800">無料枠</h3>
                </div>
                <p className="text-sm text-emerald-700">{service.freeTier}</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 pb-6">
            <a
              href={service.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-medium transition-colors"
            >
              サービスを見る
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </motion.div>
    </>
  )
}
