"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search, FileText, Globe, Monitor, Zap, Code,
  ClipboardList, BarChart3, ShoppingCart, Settings, Clock, Mic,
  ChevronDown, ChevronRight, ArrowRight, ExternalLink
} from "lucide-react"

/* âââââââââââââââââââââââââ Types âââââââââââââââââââââââââ */
interface CategoryCard {
  num: string
  title: string
  description: string
  color: string
  border: string
  bg: string
  icon: React.ReactNode
}

interface UsageCard {
  num: string
  title: string
  description: string
  services: string[]
  color: string
  border: string
  bg: string
  icon: React.ReactNode
  claudeCan: string[]
  linked: string[]
}

interface Phase {
  title: string
  period: string
  items: string[]
  badgeColor: string
  badgeText: string
  dotColor: string
}

/* âââââââââââââââââââââââââ Data âââââââââââââââââââââââââ */
const categories: CategoryCard[] = [
  { num: "01", title: "æå ±å¦çã»ç¥è­æ´»ç¨", description: "ãã­ã¥ã¡ã³ãè¦ç´ã»ãã¬ãã¸æ¤ç´¢ã»ç¿»è¨³ã»è­°äºé²", color: "text-blue-400", border: "border-blue-400", bg: "bg-blue-400/10", icon: <Search className="w-5 h-5" /> },
  { num: "02", title: "å¶ä½ã»ã¢ã¦ããããçæ", description: "UIä½æã»SVGçæã»ç»åçæã»ããã­ã¤", color: "text-emerald-400", border: "border-emerald-400", bg: "bg-emerald-400/10", icon: <FileText className="w-5 h-5" /> },
  { num: "03", title: "å¤é¨ãµã¼ãã¹é£æº", description: "Gmailã»Notionã»Canvaã»ãã¡ã¤ã«èªåæ´ç", color: "text-teal-400", border: "border-teal-400", bg: "bg-teal-400/10", icon: <Globe className="w-5 h-5" /> },
  { num: "04", title: "ãã©ã¦ã¶ã»PCæä½èªåå", description: "å¥åã»ã¯ãªãã¯ã»ã­ã°ã¤ã³ã»ç»é¢æä½ä»£è¡", color: "text-purple-400", border: "border-purple-400", bg: "bg-purple-400/10", icon: <Monitor className="w-5 h-5" /> },
  { num: "05", title: "ã¿ã¹ã¯èªååã»ã¨ã¼ã¸ã§ã³ã", description: "ããªã¬ã¼å®è¡ã»èªå¾é£éã»å®æã¿ã¹ã¯", color: "text-amber-400", border: "border-amber-400", bg: "bg-amber-400/10", icon: <Zap className="w-5 h-5" /> },
  { num: "06", title: "ã¢ããªã¸ã®AIçµã¿è¾¼ã¿", description: "Claude APIã»Gemini APIã»ç¤¾åãã¼ã«ã¸ã®å®è£", color: "text-rose-400", border: "border-rose-400", bg: "bg-rose-400/10", icon: <Code className="w-5 h-5" /> },
]

const usageCards: UsageCard[] = [
  { num: "01", title: "å³é¢ã»ä»æ§æ¸ç®¡ç", description: "PDFæ¤ç´¢ã»è±èªç¿»è¨³ã»ããã¥ã¢ã«æ´å½¢ã»å¤æ´å±¥æ­´è¨é²", services: ["Notion", "NotebookLM"], color: "text-blue-400", border: "border-blue-400", bg: "bg-blue-400/10", icon: <ClipboardList className="w-5 h-5" />, claudeCan: ["PDFã»Wordãã¡ã¤ã«ã®åå®¹ãç¬æã«è¦ç´", "è±èªã®æè¡ä»æ§æ¸ãèªç¶ãªæ¥æ¬èªã«ç¿»è¨³", "å¤æ´ç¹ã®å·®åãèªåã§æ¤åºã»è¨é²"], linked: ["Notionã§ãã¬ãã¸ãã¼ã¹ãæ§ç¯ãå¨ç¤¾å±æ", "NotebookLMã§éå»å³é¢ãæ¨ªæ­æ¤ç´¢"] },
  { num: "02", title: "åè³ªã¬ãã¼ãä½æ", description: "æ¤æ»ãã¼ã¿éè¨ã»ä¸è¯ã¬ãã¼ãçæã»é¡§å®¢åãå ±åæ¸", services: ["ChatGPT", "Canva"], color: "text-emerald-400", border: "border-emerald-400", bg: "bg-emerald-400/10", icon: <BarChart3 className="w-5 h-5" />, claudeCan: ["æ¤æ»ãã¼ã¿ã®CSVãåæã»éè¨", "ä¸è¯åå ã®åæã¬ãã¼ãããã©ãã", "é¡§å®¢åãå ±åæ¸ã®ãã©ã¼ãããæ´å½¢"], linked: ["ChatGPTã§ã°ã©ãã»å³è¡¨ãçæ", "Canvaã§ãã­ãã§ãã·ã§ãã«ãªå ±åæ¸ãã¶ã¤ã³"] },
  { num: "03", title: "çºæ³¨ã»å¨åº«èªåå", description: "çºæ³¨æ¸ä½æã»ä»å¥åã¡ã¼ã«èªåè¿ä¿¡ã»ä¾¡æ ¼æ¯è¼è¡¨", services: ["N8N", "Gmail"], color: "text-teal-400", border: "border-teal-400", bg: "bg-teal-400/10", icon: <ShoppingCart className="w-5 h-5" />, claudeCan: ["çºæ³¨æ¸ãã³ãã¬ã¼ãã®èªåçæ", "ä»å¥åããã®ã¡ã¼ã«ãè§£æã»åé¡", "ä¾¡æ ¼æ¯è¼è¡¨ã®ä½æã¨æé©ææ¡"], linked: ["N8Nã§å¨åº«é¾å¤ããªã¬ã¼âèªåçºæ³¨ãã­ã¼", "Gmailé£æºã§ä»å¥åã¸ã®èªåè¿ä¿¡"] },
  { num: "04", title: "çç£è¨ç»ã»å·¥ç¨ç®¡ç", description: "ããã«ããã¯åæã»ä½æ¥­æç¤ºæ¸çæã»é²æå¯è¦å", services: ["Notion", "N8N"], color: "text-purple-400", border: "border-purple-400", bg: "bg-purple-400/10", icon: <Settings className="w-5 h-5" />, claudeCan: ["çç£ãã¼ã¿ããããã«ããã¯ãç¹å®", "ä½æ¥­æç¤ºæ¸ã®èªåçæ", "å·¥ç¨éã®ä¾å­é¢ä¿ãåæ"], linked: ["Notionã§é²æããã·ã¥ãã¼ããæ§ç¯", "N8Nã§å·¥ç¨å®äºâæ¬¡å·¥ç¨éç¥ãèªåå"] },
  { num: "05", title: "å®åæ¥­åèªåå", description: "æ¥å ±ã»é±å ±çæã»ã¡ã¼ã«èªåä»åãã»ç³è«æ¸ä½æ", services: ["N8N", "Notion"], color: "text-amber-400", border: "border-amber-400", bg: "bg-amber-400/10", icon: <Clock className="w-5 h-5" />, claudeCan: ["æ¥å ±ãã³ãã¬ã¼ãã®èªåå¥å", "åä¿¡ã¡ã¼ã«ã®åªååº¦åé¡", "åç¨®ç³è«æ¸ã®ä¸æ¸ãä½æ"], linked: ["N8Nã§å®æããªã¬ã¼âæ¥å ±èªååé", "Notionã«é±å ±ãèªåéç´ã»ä¿å­"] },
  { num: "06", title: "é³å£°æ¥å ±ã»è­°äºé²", description: "ç¾å ´é³å£°âæå­èµ·ããâæ´å½¢âNotionèªåä¿å­", services: ["Tipeless", "Notion"], color: "text-rose-400", border: "border-rose-400", bg: "bg-rose-400/10", icon: <Mic className="w-5 h-5" />, claudeCan: ["æå­èµ·ãããã­ã¹ãã®æ´å½¢ã»è¦ç´", "ã¢ã¯ã·ã§ã³ã¢ã¤ãã ã®èªåæ½åº", "è­°äºé²ãã©ã¼ãããã¸ã®å¤æ"], linked: ["Tipelessã§ä¼è­°ã»ç¾å ´é³å£°ãèªåé²é³âæå­èµ·ãã", "Notionã«è­°äºé²ãèªåä¿å­ã»ã¿ã°ä»ã"] },
]

const phases: Phase[] = [
  { title: "ããå§ãããã", period: "ä»ããã»ç¡æãä½ã³ã¹ã", items: ["é³å£°æ¥å ±ã®Tipelesså°å¥", "å³é¢ã»ä»æ§æ¸ã®Claudeæ¤ç´¢", "ã¡ã¼ã«è¿ä¿¡ã®èªååï¼Gmailé£æºï¼"], badgeColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30", badgeText: "å³å°å¥å¯è½", dotColor: "bg-emerald-400" },
  { title: "1ã2ã¶æã§æ§ç¯", period: "ä¸­æã»ããã¢ãã", items: ["N8Nã§çºæ³¨ã»å¨åº«ã®èªåããªã¬ã¼è¨­å®", "Notionãã¬ãã¸ãã¼ã¹ã®æ´å", "åè³ªã¬ãã¼ãã®èªåçæãã­ã¼"], badgeColor: "bg-blue-500/20 text-blue-400 border-blue-500/30", badgeText: "è¦ã»ããã¢ãã", dotColor: "bg-blue-400" },
  { title: "æ¬æ ¼æ´»ç¨", period: "3ã¶æã", items: ["åºå¹¹ã·ã¹ãã ã¸ã®Claude APIçµã¿è¾¼ã¿", "çç£è¨ç»AIã¨ã¼ã¸ã§ã³ãã®æ§ç¯", "å¨å·¥ç¨ã®ãã¼ã¿é£æºã»èªåå"], badgeColor: "bg-purple-500/20 text-purple-400 border-purple-500/30", badgeText: "ã«ã¹ã¿ã éçº", dotColor: "bg-purple-400" },
]

const hubNodes = [
  { name: "Perplexity", angle: 0, type: "complement" },
  { name: "NotebookLM", angle: 45, type: "complement" },
  { name: "Tipeless", angle: 90, type: "complement" },
  { name: "Notion", angle: 135, type: "complement" },
  { name: "Canva", angle: 180, type: "complement" },
  { name: "ChatGPT", angle: 225, type: "complement" },
  { name: "N8N", angle: 270, type: "complement" },
  { name: "Vercel/V0", angle: 315, type: "claude" },
]

/* âââââââââââââââââââââââââ Sections âââââââââââââââââââââââââ */
const sections = ["AIãã§ãããã¨", "ãã¯ã­ã³ã§ã®æ´»ç¨æ¹æ³", "Claudeããã®ææ¡"]

/* âââââââââââââââââââââââââ Hub Diagram âââââââââââââââââââââââââ */
function HubDiagram() {
  const radius = 140
  const cx = 200
  const cy = 200
  return (
    <div className="flex flex-col items-center gap-4 mt-12">
      <div className="flex items-center gap-6 text-sm">
        <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-rose-400/60 inline-block" /> è¦æãè£å®</span>
        <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-slate-400/60 inline-block" /> Claudeä¸»ä½</span>
      </div>
      <svg viewBox="0 0 400 400" className="w-[320px] h-[320px] md:w-[400px] md:h-[400px]">
        <defs>
          <style>{`
            @keyframes dash { to { stroke-dashoffset: -20; } }
            .flow-line { stroke-dasharray: 8 6; animation: dash 1.5s linear infinite; }
          `}</style>
        </defs>
        {hubNodes.map((node) => {
          const rad = (node.angle * Math.PI) / 180
          const nx = cx + radius * Math.cos(rad)
          const ny = cy + radius * Math.sin(rad)
          const isComplement = node.type === "complement"
          return (
            <g key={node.name}>
              <line x1={cx} y1={cy} x2={nx} y2={ny} className="flow-line" stroke={isComplement ? "#f472b6" : "#94a3b8"} strokeWidth="1.5" opacity="0.6" />
              <circle cx={nx} cy={ny} r="28" fill={isComplement ? "rgba(244,114,182,0.12)" : "rgba(148,163,184,0.12)"} stroke={isComplement ? "#f472b6" : "#94a3b8"} strokeWidth="1" opacity="0.8" />
              <text x={nx} y={ny} textAnchor="middle" dominantBaseline="central" fill={isComplement ? "#f9a8d4" : "#cbd5e1"} fontSize="11" fontWeight="500">{node.name}</text>
            </g>
          )
        })}
        <circle cx={cx} cy={cy} r="36" fill="#1e293b" stroke="#3b82f6" strokeWidth="2" />
        <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central" fill="#ffffff" fontSize="14" fontWeight="700">Claude</text>
      </svg>
    </div>
  )
}

/* âââââââââââââââââââââââââ CTA Section âââââââââââââââââââââââââ */
function CTASection() {
  const [selected, setSelected] = useState<number | null>(null)
  const options = [
    { label: "é³å£°æ¥å ±ãè©¦ã", detail: "Tipeless + Claude ã§ç¾å ´ã®é³å£°ãèªåã§æ¥å ±åãã¹ããã§é²é³ããã ãã§ãæ´å½¢ãããæ¥å ±ãNotionã«ä¿å­ããã¾ãã" },
    { label: "æ¸é¡ä½æ¥­ãæ¸ãã", detail: "å³é¢ã»ä»æ§æ¸ãClaudeã§æ¤ç´¢ã»è¦ç´ãNotebookLMã¨çµã¿åããã¦ãã¬ãã¸ãã¼ã¹ãæ§ç¯ããå¿è¦ãªæå ±ã«å³ã¢ã¯ã»ã¹ã" },
    { label: "èªååãå§ãã", detail: "N8Nã§çºæ³¨ã»å¨åº«ç®¡çã®ããªã¬ã¼ãè¨­å®ãå¨åº«ãé¾å¤ãä¸åãã¨èªåçºæ³¨ãGmailé£æºã§ä»å¥åã«èªåã¡ã¼ã«éä¿¡ã" },
  ]
  return (
    <div className="mt-12 p-6 md:p-8 rounded-xl bg-white/[0.04] border border-white/10">
      <p className="text-lg font-semibold text-white mb-6 text-center">ã¾ãä½ããå§ããï¼</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {options.map((opt, i) => (
          <button key={i} onClick={() => setSelected(selected === i ? null : i)} className={`text-left p-4 rounded-lg border transition-all duration-200 ${selected === i ? "border-blue-400 bg-blue-500/10" : "border-white/10 bg-white/[0.03] hover:border-white/20"}`}>
            <span className="flex items-center gap-2 text-sm font-medium text-white">
              <ArrowRight className="w-4 h-4 text-blue-400" />
              {opt.label}
            </span>
            <AnimatePresence>
              {selected === i && (
                <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="text-xs text-slate-400 mt-3 leading-relaxed">
                  {opt.detail}
                </motion.p>
              )}
            </AnimatePresence>
          </button>
        ))}
      </div>
    </div>
  )
}

/* âââââââââââââââââââââââââ Main Page âââââââââââââââââââââââââ */
export default function ProposalPage() {
  const [activeSection, setActiveSection] = useState(0)
  const [expandedCard, setExpandedCard] = useState<number | null>(null)
  const sectionRefs = [useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null)]

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY + 120
      for (let i = sectionRefs.length - 1; i >= 0; i--) {
        const el = sectionRefs[i].current
        if (el && el.offsetTop <= scrollY) {
          setActiveSection(i)
          break
        }
      }
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollTo = (i: number) => {
    sectionRefs[i].current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  return (
    <div className="min-h-screen" style={{ background: "#1E2D4E" }}>
      {/* ââ Navigation ââ */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10" style={{ background: "rgba(30,45,78,0.95)", backdropFilter: "blur(12px)" }}>
        <div className="max-w-6xl mx-auto px-4 md:px-8 h-14 flex items-center justify-between">
          <span className="text-sm md:text-base font-semibold text-white">æ ªå¼ä¼ç¤¾ãã¯ã­ã³ Ã AIæ´»ç¨ææ¡</span>
          <div className="flex gap-1">
            {sections.map((s, i) => (
              <button key={i} onClick={() => scrollTo(i)} className="relative px-3 py-2 text-xs md:text-sm transition-colors duration-200" style={{ color: activeSection === i ? "#3B82F6" : "rgba(255,255,255,0.6)" }}>
                {s}
                {activeSection === i && <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full" style={{ background: "#3B82F6" }} />}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 md:px-8 pt-24 pb-16">
        {/* ââ Section 1: AIãã§ãããã¨ ââ */}
        <section ref={sectionRefs[0]} className="mb-24 scroll-mt-20">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }}>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">AIã§ã§ãããã¨</h2>
            <p className="text-slate-400 mb-8">6ã¤ã®æ©è½ã«ãã´ãª</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((cat, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.3, delay: i * 0.06 }}
                className={`group bg-white/[0.06] border-l-[3px] ${cat.border} rounded-lg p-5 hover:bg-white/[0.09] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-default`}>
                <div className="flex items-center gap-3 mb-3">
                  <span className={`flex items-center justify-center w-8 h-8 rounded-md ${cat.bg} ${cat.color}`}>{cat.icon}</span>
                  <span className={`text-xs font-bold ${cat.color} opacity-60`}>{cat.num}</span>
                </div>
                <h3 className="text-sm font-semibold text-white mb-1">{cat.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{cat.description}</p>
              </motion.div>
            ))}
          </div>

          <HubDiagram />
        </section>

        {/* ââ Section 2: ãã¯ã­ã³ã§ã®æ´»ç¨æ¹æ³ ââ */}
        <section ref={sectionRefs[1]} className="mb-24 scroll-mt-20">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }}>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">æ ªå¼ä¼ç¤¾ãã¯ã­ã³ Ã AI</h2>
            <p className="text-slate-400 mb-8">è£½é ã»çç£ç®¡çæ¥­åã¸ã®å·ä½çãªæ´»ç¨</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {usageCards.map((card, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.3, delay: i * 0.06 }}
                className={`bg-white/[0.06] border-l-[3px] ${card.border} rounded-lg overflow-hidden transition-all duration-200 ${expandedCard === i ? "" : "hover:bg-white/[0.09] hover:shadow-lg hover:-translate-y-0.5"}`}>
                <button onClick={() => setExpandedCard(expandedCard === i ? null : i)} className="w-full text-left p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`flex items-center justify-center w-8 h-8 rounded-md ${card.bg} ${card.color}`}>{card.icon}</span>
                    <span className={`text-xs font-bold ${card.color} opacity-60`}>{card.num}</span>
                    <ChevronDown className={`w-4 h-4 text-slate-500 ml-auto transition-transform duration-200 ${expandedCard === i ? "rotate-180" : ""}`} />
                  </div>
                  <h3 className="text-sm font-semibold text-white mb-1">{card.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed mb-3">{card.description}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {card.services.map((s) => (
                      <span key={s} className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-blue-500/15 text-blue-300 border border-blue-500/20">{s}</span>
                    ))}
                  </div>
                </button>
                <AnimatePresence>
                  {expandedCard === i && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 border-t border-white/10">
                        <div className="p-4 bg-white/[0.02]">
                          <p className="text-xs font-semibold text-blue-400 mb-2 flex items-center gap-1.5">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="9 12 11 14 15 10"/></svg>
                            Claudeãã§ãããã¨
                          </p>
                          <ul className="space-y-1.5">
                            {card.claudeCan.map((item, j) => (
                              <li key={j} className="text-[11px] text-slate-300 flex items-start gap-1.5">
                                <ChevronRight className="w-3 h-3 text-blue-400/60 mt-0.5 shrink-0" />{item}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="p-4 bg-rose-500/[0.04] border-l border-white/10">
                          <p className="text-xs font-semibold text-rose-400 mb-2 flex items-center gap-1.5">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                            é£æºãµã¼ãã¹ã¨å¹æ
                          </p>
                          <ul className="space-y-1.5">
                            {card.linked.map((item, j) => (
                              <li key={j} className="text-[11px] text-slate-300 flex items-start gap-1.5">
                                <ChevronRight className="w-3 h-3 text-rose-400/60 mt-0.5 shrink-0" />{item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ââ Section 3: Claudeããã®ææ¡ ââ */}
        <section ref={sectionRefs[2]} className="scroll-mt-20">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }}>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Claudeããã®ææ¡</h2>
            <p className="text-slate-400 mb-10">ãã¯ã­ã³ã®æ¥­åå¹çåã­ã¼ãããã</p>
          </motion.div>

          {/* Timeline */}
          <div className="relative">
            {/* Desktop horizontal line */}
            <div className="hidden md:block absolute top-6 left-0 right-0 h-px bg-white/10" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {phases.map((phase, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.3, delay: i * 0.1 }}
                  className="relative">
                  {/* Dot */}
                  <div className="hidden md:flex items-center justify-center mb-6">
                    <div className={`w-3 h-3 rounded-full ${phase.dotColor} ring-4 ring-[#1E2D4E] relative z-10`} />
                  </div>
                  <div className="bg-white/[0.06] rounded-lg p-5 border border-white/10 hover:border-white/20 transition-colors duration-200">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-xs font-bold text-white/40">Phase {i + 1}</span>
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${phase.badgeColor}`}>{phase.badgeText}</span>
                    </div>
                    <h3 className="text-base font-semibold text-white mb-1">{phase.title}</h3>
                    <p className="text-xs text-slate-500 mb-4">{phase.period}</p>
                    <ul className="space-y-2">
                      {phase.items.map((item, j) => (
                        <li key={j} className="text-xs text-slate-300 flex items-start gap-2">
                          <ChevronRight className="w-3.5 h-3.5 text-slate-500 mt-0.5 shrink-0" />{item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <CTASection />

          {/* Footer link */}
          <div className="mt-12 text-center">
            <a href="/" className="inline-flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors duration-200">
              <ExternalLink className="w-4 h-4" />
              AI Ecosystem Map ãè¦ã
            </a>
          </div>
        </section>
      </main>
    </div>
  )
}
