"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search, FileText, Globe, Monitor, Zap, Code,
  ClipboardList, BarChart3, ShoppingCart, Settings, Clock, Mic,
  ChevronDown, ChevronRight, ArrowRight, ExternalLink
} from "lucide-react"

/* ───────────────────────── Types ───────────────────────── */
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

/* ───────────────────────── Data ───────────────────────── */
const categories: CategoryCard[] = [
  { num: "01", title: "情報処理・知識活用", description: "ドキュメント要約・ナレッジ検索・翻訳・議事録", color: "text-blue-400", border: "border-blue-400", bg: "bg-blue-400/10", icon: <Search className="w-5 h-5" /> },
  { num: "02", title: "制作・アウトプット生成", description: "UI作成・SVG生成・画像生成・デプロイ", color: "text-emerald-400", border: "border-emerald-400", bg: "bg-emerald-400/10", icon: <FileText className="w-5 h-5" /> },
  { num: "03", title: "外部サービス連携", description: "Gmail・Notion・Canva・ファイル自動整理", color: "text-teal-400", border: "border-teal-400", bg: "bg-teal-400/10", icon: <Globe className="w-5 h-5" /> },
  { num: "04", title: "ブラウザ・PC操作自動化", description: "入力・クリック・ログイン・画面操作代行", color: "text-purple-400", border: "border-purple-400", bg: "bg-purple-400/10", icon: <Monitor className="w-5 h-5" /> },
  { num: "05", title: "タスク自動化・エージェント", description: "トリガー実行・自律連鎖・定期タスク", color: "text-amber-400", border: "border-amber-400", bg: "bg-amber-400/10", icon: <Zap className="w-5 h-5" /> },
  { num: "06", title: "アプリへのAI組み込み", description: "Claude API・Gemini API・社内ツールへの実装", color: "text-rose-400", border: "border-rose-400", bg: "bg-rose-400/10", icon: <Code className="w-5 h-5" /> },
]

const usageCards: UsageCard[] = [
  { num: "01", title: "図面・仕様書管理", description: "PDF検索・英語翻訳・マニュアル整形・変更履歴記録", services: ["Notion", "NotebookLM"], color: "text-blue-400", border: "border-blue-400", bg: "bg-blue-400/10", icon: <ClipboardList className="w-5 h-5" />, claudeCan: ["PDF・Wordファイルの内容を瞬時に要約", "英語の技術仕様書を自然な日本語に翻訳", "変更点の差分を自動で検出・記録"], linked: ["Notionでナレッジベースを構築し全社共有", "NotebookLMで過去図面を横断検索"] },
  { num: "02", title: "品質レポート作成", description: "検査データ集計・不良レポート生成・顧客向け報告書", services: ["ChatGPT", "Canva"], color: "text-emerald-400", border: "border-emerald-400", bg: "bg-emerald-400/10", icon: <BarChart3 className="w-5 h-5" />, claudeCan: ["検査データのCSVを分析・集計", "不良原因の分析レポートをドラフト", "顧客向け報告書のフォーマット整形"], linked: ["ChatGPTでグラフ・図表を生成", "Canvaでプロフェッショナルな報告書デザイン"] },
  { num: "03", title: "発注・在庫自動化", description: "発注書作成・仕入先メール自動返信・価格比較表", services: ["N8N", "Gmail"], color: "text-teal-400", border: "border-teal-400", bg: "bg-teal-400/10", icon: <ShoppingCart className="w-5 h-5" />, claudeCan: ["発注書テンプレートの自動生成", "仕入先からのメールを解析・分類", "価格比較表の作成と最適提案"], linked: ["N8Nで在庫閾値トリガー→自動発注フロー", "Gmail連携で仕入先への自動返信"] },
  { num: "04", title: "生産計画・工程管理", description: "ボトルネック分析・作業指示書生成・進捗可視化", services: ["Notion", "N8N"], color: "text-purple-400", border: "border-purple-400", bg: "bg-purple-400/10", icon: <Settings className="w-5 h-5" />, claudeCan: ["生産データからボトルネックを特定", "作業指示書の自動生成", "工程間の依存関係を分析"], linked: ["Notionで進捗ダッシュボードを構築", "N8Nで工程完了→次工程通知を自動化"] },
  { num: "05", title: "定型業務自動化", description: "日報・週報生成・メール自動仕分け・申請書作成", services: ["N8N", "Notion"], color: "text-amber-400", border: "border-amber-400", bg: "bg-amber-400/10", icon: <Clock className="w-5 h-5" />, claudeCan: ["日報テンプレートの自動入力", "受信メールの優先度分類", "各種申請書の下書き作成"], linked: ["N8Nで定時トリガー→日報自動収集", "Notionに週報を自動集約・保存"] },
  { num: "06", title: "音声日報・議事録", description: "現場音声→文字起こし→整形→Notion自動保存", services: ["Tipeless", "Notion"], color: "text-rose-400", border: "border-rose-400", bg: "bg-rose-400/10", icon: <Mic className="w-5 h-5" />, claudeCan: ["文字起こしテキストの整形・要約", "アクションアイテムの自動抽出", "議事録フォーマットへの変換"], linked: ["Tipelessで会議・現場音声を自動録音→文字起こし", "Notionに議事録を自動保存・タグ付け"] },
]

const phases: Phase[] = [
  { title: "すぐ始められる", period: "今すぐ・無料〜低コスト", items: ["音声日報のTipeless導入", "図面・仕様書のClaude検索", "メール返信の自動化（Gmail連携）"], badgeColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30", badgeText: "即導入可能", dotColor: "bg-emerald-400" },
  { title: "1〜2ヶ月で構築", period: "中期セットアップ", items: ["N8Nで発注・在庫の自動トリガー設定", "Notionナレッジベースの整備", "品質レポートの自動生成フロー"], badgeColor: "bg-blue-500/20 text-blue-400 border-blue-500/30", badgeText: "要セットアップ", dotColor: "bg-blue-400" },
  { title: "本格活用", period: "3ヶ月〜", items: ["基幹システムへのClaude API組み込み", "生産計画AIエージェントの構築", "全工程のデータ連携・自動化"], badgeColor: "bg-purple-500/20 text-purple-400 border-purple-500/30", badgeText: "カスタム開発", dotColor: "bg-purple-400" },
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

/* ───────────────────────── Sections ───────────────────────── */
const sections = ["AIができること", "ミクロンでの活用方法", "Claudeからの提案"]

/* ───────────────────────── Hub Diagram ───────────────────────── */
function HubDiagram() {
  const radius = 140
  const cx = 200
  const cy = 200
  return (
    <div className="flex flex-col items-center gap-4 mt-12">
      <div className="flex items-center gap-6 text-sm">
        <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-rose-400/60 inline-block" /> 苦手を補完</span>
        <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-slate-400/60 inline-block" /> Claude主体</span>
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

/* ───────────────────────── CTA Section ───────────────────────── */
function CTASection() {
  const [selected, setSelected] = useState<number | null>(null)
  const options = [
    { label: "音声日報を試す", detail: "Tipeless + Claude で現場の音声を自動で日報化。スマホで録音するだけで、整形された日報がNotionに保存されます。" },
    { label: "書類作業を減らす", detail: "図面・仕様書をClaudeで検索・要約。NotebookLMと組み合わせてナレッジベースを構築し、必要な情報に即アクセス。" },
    { label: "自動化を始める", detail: "N8Nで発注・在庫管理のトリガーを設定。在庫が閾値を下回ると自動発注、Gmail連携で仕入先に自動メール送信。" },
  ]
  return (
    <div className="mt-12 p-6 md:p-8 rounded-xl bg-white/[0.04] border border-white/10">
      <p className="text-lg font-semibold text-white mb-6 text-center">まず何から始める？</p>
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

/* ───────────────────────── Main Page ───────────────────────── */
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
      {/* ── Navigation ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10" style={{ background: "rgba(30,45,78,0.95)", backdropFilter: "blur(12px)" }}>
        <div className="max-w-6xl mx-auto px-4 md:px-8 h-14 flex items-center justify-between">
          <span className="text-sm md:text-base font-semibold text-white">株式会社ミクロン × AI活用提案</span>
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
        {/* ── Section 1: AIができること ── */}
        <section ref={sectionRefs[0]} className="mb-24 scroll-mt-20">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }}>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">AIでできること</h2>
            <p className="text-slate-400 mb-8">6つの機能カテゴリ</p>
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

        {/* ── Section 2: ミクロンでの活用方法 ── */}
        <section ref={sectionRefs[1]} className="mb-24 scroll-mt-20">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }}>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">株式会社ミクロン × AI</h2>
            <p className="text-slate-400 mb-8">製造・生産管理業務への具体的な活用</p>
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
                            Claudeができること
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
                            連携サービスと効果
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

        {/* ── Section 3: Claudeからの提案 ── */}
        <section ref={sectionRefs[2]} className="scroll-mt-20">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }}>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Claudeからの提案</h2>
            <p className="text-slate-400 mb-10">ミクロンの業務効率化ロードマップ</p>
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
              AI Ecosystem Map を見る
            </a>
          </div>
        </section>
      </main>
    </div>
  )
}
