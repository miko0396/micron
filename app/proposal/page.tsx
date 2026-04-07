"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from "framer-motion"

/* ───────────────────────── SVG Icons ───────────────────────── */
const Icon = ({ d, size = 20, color = "currentColor" }: { d: string; size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d={d} /></svg>
)

const icons = {
  search: "M11 11m-8 0a8 8 0 1 0 16 0 8 8 0 1 0 -16 0M21 21l-4.35-4.35",
  file: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6",
  globe: "M12 12m-10 0a10 10 0 1 0 20 0 10 10 0 1 0 -20 0M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10",
  monitor: "M2 3h20v14H2zM8 21h8M12 17v4",
  zap: "M13 2L3 14h9l-1 8 10-12h-9l1-8",
  code: "M16 18l6-6-6-6M8 6l-6 6 6 6",
  clipboard: "M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v0a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2z",
  chart: "M18 20V10M12 20V4M6 20v-6",
  cart: "M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6",
  settings: "M12 12m-3 0a3 3 0 1 0 6 0 3 3 0 1 0 -6 0",
  clock: "M12 12m-10 0a10 10 0 1 0 20 0 10 10 0 1 0 -20 0M12 6v6l4 2",
  mic: "M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3zM19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8",
  chevronDown: "M6 9l6 6 6-6",
  chevronRight: "M9 18l6-6-6-6",
  arrowRight: "M5 12h14M12 5l7 7-7 7",
  externalLink: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3",
  check: "M20 6L9 17l-5-5",
  sparkle: "M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83",
  play: "M5 3l14 9-14 9V3z",
  eye: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 12m-3 0a3 3 0 1 0 6 0 3 3 0 1 0 -6 0",
}

/* ───────────────────────── Color System (CSS vars) ───────────────────────── */
const cssVars = `
  :root {
    --color-bg: #ffffff;
    --color-bg-subtle: #f9fafb;
    --color-bg-muted: #f3f4f6;
    --color-border: #e5e7eb;
    --color-border-strong: #d1d5db;
    --color-text: #111827;
    --color-text-muted: #6b7280;
    --color-text-faint: #9ca3af;
    --color-primary: #2563eb;
    --color-primary-hover: #1d4ed8;
  }
`

/* ───────────────────────── Types ───────────────────────── */
interface CategoryCard {
  num: string; title: string; description: string
  color: string; bgColor: string; iconKey: keyof typeof icons
}
interface UsageCard {
  num: string; title: string; description: string
  services: string[]; color: string; bgColor: string
  iconKey: keyof typeof icons
  claudeCan: string[]; linked: string[]
}
interface Phase {
  title: string; period: string; items: string[]
  color: string; bgColor: string; badgeText: string
}

/* ───────────────────────── Data ───────────────────────── */
const categories: CategoryCard[] = [
  { num: "01", title: "情報処理・知識活用", description: "ドキュメント要約・ナレッジ検索・翻訳・議事録", color: "#2563eb", bgColor: "#eff6ff", iconKey: "search" },
  { num: "02", title: "制作・アウトプット生成", description: "UI作成・SVG生成・画像生成・デプロイ", color: "#059669", bgColor: "#ecfdf5", iconKey: "file" },
  { num: "03", title: "外部サービス連携", description: "Gmail・Notion・Canva・ファイル自動整理", color: "#0d9488", bgColor: "#f0fdfa", iconKey: "globe" },
  { num: "04", title: "ブラウザ・PC操作自動化", description: "入力・クリック・ログイン・画面操作代行", color: "#7c3aed", bgColor: "#f5f3ff", iconKey: "monitor" },
  { num: "05", title: "タスク自動化・エージェント", description: "トリガー実行・自律連鎖・定期タスク", color: "#d97706", bgColor: "#fffbeb", iconKey: "zap" },
  { num: "06", title: "アプリへのAI組み込み", description: "Claude API・Gemini API・社内ツールへの実装", color: "#dc2626", bgColor: "#fef2f2", iconKey: "code" },
]

const usageCards: UsageCard[] = [
  { num: "01", title: "図面・仕様書管理", description: "PDF検索・英語翻訳・マニュアル整形・変更履歴記録", services: ["Notion", "NotebookLM"], color: "#2563eb", bgColor: "#eff6ff", iconKey: "clipboard", claudeCan: ["PDF・Wordファイルの内容を瞬時に要約", "英語の技術仕様書を自然な日本語に翻訳", "変更点の差分を自動で検出・記録"], linked: ["Notionでナレッジベースを構築し全社共有", "NotebookLMで過去図面を横断検索"] },
  { num: "02", title: "品質レポート作成", description: "検査データ集計・不良レポート生成・顧客向け報告書", services: ["ChatGPT", "Canva"], color: "#059669", bgColor: "#ecfdf5", iconKey: "chart", claudeCan: ["検査データのCSVを分析・集計", "不良原因の分析レポートをドラフト", "顧客向け報告書のフォーマット整形"], linked: ["ChatGPTでグラフ・図表を生成", "Canvaでプロフェッショナルな報告書デザイン"] },
  { num: "03", title: "発注・在庫自動化", description: "発注書作成・仕入先メール自動返信・価格比較表", services: ["N8N", "Gmail"], color: "#0d9488", bgColor: "#f0fdfa", iconKey: "cart", claudeCan: ["発注書テンプレートの自動生成", "仕入先からのメールを解析・分類", "価格比較表の作成と最適提案"], linked: ["N8Nで在庫閾値トリガー→自動発注フロー", "Gmail連携で仕入先への自動返信"] },
  { num: "04", title: "生産計画・工程管理", description: "ボトルネック分析・作業指示書生成・進捗可視化", services: ["Notion", "N8N"], color: "#7c3aed", bgColor: "#f5f3ff", iconKey: "settings", claudeCan: ["生産データからボトルネックを特定", "作業指示書の自動生成", "工程間の依存関係を分析"], linked: ["Notionで進捗ダッシュボードを構築", "N8Nで工程完了→次工程通知を自動化"] },
  { num: "05", title: "定型業務自動化", description: "日報・週報生成・メール自動仕分け・申請書作成", services: ["N8N", "Notion"], color: "#d97706", bgColor: "#fffbeb", iconKey: "clock", claudeCan: ["日報テンプレートの自動入力", "受信メールの優先度分類", "各種申請書の下書き作成"], linked: ["N8Nで定時トリガー→日報自動収集", "Notionに週報を自動集約・保存"] },
  { num: "06", title: "音声日報・議事録", description: "現場音声→文字起こし→整形→Notion自動保存", services: ["Tipeless", "Notion"], color: "#dc2626", bgColor: "#fef2f2", iconKey: "mic", claudeCan: ["文字起こしテキストの整形・要約", "アクションアイテムの自動抽出", "議事録フォーマットへの変換"], linked: ["Tipelessで会議・現場音声を自動録音→文字起こし", "Notionに議事録を自動保存・タグ付け"] },
]

const phases: Phase[] = [
  { title: "すぐ始められる", period: "今すぐ・無料〜低コスト", items: ["音声日報のTipeless導入", "図面・仕様書のClaude検索", "メール返信の自動化（Gmail連携）"], color: "#059669", bgColor: "#ecfdf5", badgeText: "即導入可能" },
  { title: "1〜2ヶ月で構築", period: "中期セットアップ", items: ["N8Nで発注・在庫の自動トリガー設定", "Notionナレッジベースの整備", "品質レポートの自動生成フロー"], color: "#2563eb", bgColor: "#eff6ff", badgeText: "要セットアップ" },
  { title: "本格活用", period: "3ヶ月〜", items: ["基幹システムへのClaude API組み込み", "生産計画AIエージェントの構築", "全工程のデータ連携・自動化"], color: "#7c3aed", bgColor: "#f5f3ff", badgeText: "カスタム開発" },
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

const sections = ["AIができること", "ミクロンでの活用方法", "Claudeからの提案"]

/* ───────────────────────── Floating Particles ───────────────────────── */
function FloatingParticles() {
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 0 }}>
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          style={{
            position: "absolute",
            width: 4 + Math.random() * 4,
            height: 4 + Math.random() * 4,
            borderRadius: "50%",
            background: `rgba(37, 99, 235, ${0.06 + Math.random() * 0.08})`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30 - Math.random() * 40, 0],
            x: [0, (Math.random() - 0.5) * 30, 0],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: 6 + Math.random() * 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 4,
          }}
        />
      ))}
    </div>
  )
}

/* ───────────────────────── Tilt Card ───────────────────────── */
function TiltCard({ children, style, className, onClick }: { children: React.ReactNode; style?: React.CSSProperties; className?: string; onClick?: () => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [6, -6]), { stiffness: 200, damping: 20 })
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-6, 6]), { stiffness: 200, damping: 20 })

  const handleMouse = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    x.set((e.clientX - rect.left) / rect.width - 0.5)
    y.set((e.clientY - rect.top) / rect.height - 0.5)
  }, [x, y])

  const handleLeave = useCallback(() => { x.set(0); y.set(0) }, [x, y])

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
      onClick={onClick}
      style={{ ...style, rotateX, rotateY, transformPerspective: 800 }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/* ───────────────────────── Reveal on Hover Card ───────────────────────── */
function PeekCard({ front, back, color }: { front: React.ReactNode; back: React.ReactNode; color: string }) {
  const [peeking, setPeeking] = useState(false)
  return (
    <div
      style={{ position: "relative", cursor: "pointer" }}
      onMouseEnter={() => setPeeking(true)}
      onMouseLeave={() => setPeeking(false)}
      onClick={() => setPeeking(!peeking)}
    >
      <motion.div
        animate={{ y: peeking ? -8 : 0, scale: peeking ? 1.02 : 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        style={{
          position: "relative", zIndex: 2,
          background: "var(--color-bg)",
          border: "1px solid var(--color-border)",
          borderRadius: 12,
          overflow: "hidden",
        }}
      >
        <div style={{ borderLeft: `3px solid ${color}`, padding: 24 }}>
          {front}
        </div>
      </motion.div>
      <AnimatePresence>
        {peeking && (
          <motion.div
            initial={{ opacity: 0, y: -20, scaleY: 0.8 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -10, scaleY: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            style={{
              position: "absolute", left: 0, right: 0, top: "100%",
              marginTop: -4,
              background: "var(--color-bg-subtle)",
              border: "1px solid var(--color-border)",
              borderTop: `2px solid ${color}`,
              borderRadius: "0 0 12px 12px",
              padding: 16,
              zIndex: 1,
            }}
          >
            {back}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ───────────────────────── Hub Diagram ───────────────────────── */
function HubDiagram() {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)
  const radius = 140; const cx = 200; const cy = 200
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, marginTop: 48 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 24, fontSize: 13, color: "var(--color-text-muted)" }}>
        <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#e11d48", display: "inline-block" }} /> 苦手を補完
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#64748b", display: "inline-block" }} /> Claude主体
        </span>
      </div>
      <svg viewBox="0 0 400 400" style={{ width: 340, height: 340, maxWidth: "100%" }}>
        <defs>
          <style>{`
            @keyframes dash { to { stroke-dashoffset: -20; } }
            .flow-line { stroke-dasharray: 8 6; animation: dash 1.5s linear infinite; }
            @keyframes pulse-ring { 0% { r: 36; opacity: 0.3; } 100% { r: 52; opacity: 0; } }
            .pulse { animation: pulse-ring 2s ease-out infinite; }
          `}</style>
          <filter id="glow"><feGaussianBlur stdDeviation="3" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        </defs>
        {hubNodes.map((node) => {
          const rad = (node.angle * Math.PI) / 180
          const nx = cx + radius * Math.cos(rad)
          const ny = cy + radius * Math.sin(rad)
          const isComplement = node.type === "complement"
          const isHovered = hoveredNode === node.name
          const nodeColor = isComplement ? "#e11d48" : "#64748b"
          return (
            <g key={node.name} onMouseEnter={() => setHoveredNode(node.name)} onMouseLeave={() => setHoveredNode(null)} style={{ cursor: "pointer" }}>
              <line x1={cx} y1={cy} x2={nx} y2={ny} className="flow-line" stroke={nodeColor} strokeWidth={isHovered ? 2.5 : 1.5} opacity={isHovered ? 0.9 : 0.4} />
              <circle cx={nx} cy={ny} r={isHovered ? 32 : 28} fill={isComplement ? "rgba(225,29,72,0.08)" : "rgba(100,116,139,0.08)"} stroke={nodeColor} strokeWidth={isHovered ? 2 : 1} opacity={isHovered ? 1 : 0.7} style={{ transition: "all 200ms ease" }} />
              <text x={nx} y={ny} textAnchor="middle" dominantBaseline="central" fill={isHovered ? nodeColor : "var(--color-text-muted)"} fontSize={isHovered ? 12 : 11} fontWeight={isHovered ? 600 : 500} style={{ transition: "all 200ms ease" }}>{node.name}</text>
            </g>
          )
        })}
        <circle cx={cx} cy={cy} r="36" className="pulse" fill="none" stroke="#2563eb" strokeWidth="1" />
        <circle cx={cx} cy={cy} r="36" fill="var(--color-bg)" stroke="#2563eb" strokeWidth="2" filter="url(#glow)" />
        <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central" fill="#2563eb" fontSize="14" fontWeight="700">Claude</text>
      </svg>
    </div>
  )
}

/* ───────────────────────── Animated Counter ───────────────────────── */
function AnimatedNumber({ value, suffix = "", delay = 0 }: { value: number; suffix?: string; delay?: number }) {
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      const duration = 1200
      const start = performance.now()
      const tick = (now: number) => {
        const progress = Math.min((now - start) / duration, 1)
        const eased = 1 - Math.pow(1 - progress, 3)
        setDisplay(Math.round(eased * value))
        if (progress < 1) requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    }, 300 + delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return <span style={{ fontVariantNumeric: "tabular-nums" }}>{display}{suffix}</span>
}

/* ───────────────────────── CTA Section ───────────────────────── */
function CTASection() {
  const [selected, setSelected] = useState<number | null>(null)
  const options = [
    { label: "音声日報を試す", detail: "Tipeless + Claude で現場の音声を自動で日報化。スマホで録音するだけで、整形された日報がNotionに保存されます。", icon: "mic" as const },
    { label: "書類作業を減らす", detail: "図面・仕様書をClaudeで検索・要約。NotebookLMと組み合わせてナレッジベースを構築し、必要な情報に即アクセス。", icon: "file" as const },
    { label: "自動化を始める", detail: "N8Nで発注・在庫管理のトリガーを設定。在庫が閾値を下回ると自動発注、Gmail連携で仕入先に自動メール送信。", icon: "zap" as const },
  ]
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      style={{
        marginTop: 48,
        padding: 32,
        borderRadius: 16,
        background: "linear-gradient(135deg, var(--color-bg-subtle) 0%, #eff6ff 100%)",
        border: "1px solid var(--color-border)",
      }}
    >
      <p style={{ fontSize: 18, fontWeight: 600, color: "var(--color-text)", marginBottom: 8, textAlign: "center" }}>
        まず何から始める？
      </p>
      <p style={{ fontSize: 13, color: "var(--color-text-muted)", marginBottom: 24, textAlign: "center" }}>
        クリックして詳細を確認
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
        {options.map((opt, i) => (
          <motion.button
            key={i}
            onClick={() => setSelected(selected === i ? null : i)}
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.98 }}
            style={{
              textAlign: "left",
              padding: 20,
              borderRadius: 12,
              border: `1px solid ${selected === i ? "#2563eb" : "var(--color-border)"}`,
              background: selected === i ? "#eff6ff" : "var(--color-bg)",
              cursor: "pointer",
              transition: "border-color 200ms ease, background 200ms ease",
              outline: "none",
            }}
          >
            <span style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 500, color: "var(--color-text)" }}>
              <span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 32, height: 32, borderRadius: 8, background: selected === i ? "#dbeafe" : "var(--color-bg-muted)" }}>
                <Icon d={icons[opt.icon]} size={16} color={selected === i ? "#2563eb" : "var(--color-text-muted)"} />
              </span>
              {opt.label}
              <motion.span
                animate={{ rotate: selected === i ? 180 : 0 }}
                style={{ marginLeft: "auto", display: "flex" }}
              >
                <Icon d={icons.chevronDown} size={16} color="var(--color-text-faint)" />
              </motion.span>
            </span>
            <AnimatePresence>
              {selected === i && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  style={{ fontSize: 13, color: "var(--color-text-muted)", marginTop: 12, lineHeight: 1.7, overflow: "hidden" }}
                >
                  {opt.detail}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.button>
        ))}
      </div>
    </motion.div>
  )
}

/* ───────────────────────── Step Progress ───────────────────────── */
function StepProgress({ phase, total }: { phase: number; total: number }) {
  return (
    <div style={{ display: "flex", gap: 4, marginBottom: 24 }}>
      {Array.from({ length: total }).map((_, i) => (
        <motion.div
          key={i}
          style={{
            height: 3,
            borderRadius: 2,
            flex: 1,
            background: i <= phase ? "#2563eb" : "var(--color-border)",
          }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: i * 0.15, duration: 0.4 }}
        />
      ))}
    </div>
  )
}

/* ───────────────────────── Main Page ───────────────────────── */
export default function ProposalPage() {
  const [activeSection, setActiveSection] = useState(0)
  const [expandedCard, setExpandedCard] = useState<number | null>(null)
  const [activePhase, setActivePhase] = useState(0)
  const sectionRefs = [useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null)]

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY + 120
      for (let i = sectionRefs.length - 1; i >= 0; i--) {
        const el = sectionRefs[i].current
        if (el && el.offsetTop <= scrollY) { setActiveSection(i); break }
      }
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollTo = (i: number) => {
    sectionRefs[i].current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: cssVars }} />
      <div style={{ minHeight: "100vh", background: "var(--color-bg)", color: "var(--color-text)", position: "relative" }}>
        <FloatingParticles />

        {/* ── Navigation ── */}
        <nav style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
          borderBottom: "1px solid var(--color-border)",
          background: "rgba(255,255,255,0.85)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
        }}>
          <div style={{ maxWidth: 1152, margin: "0 auto", padding: "0 32px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <motion.span
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              style={{ fontSize: 15, fontWeight: 600, color: "var(--color-text)" }}
            >
              株式会社ミクロン × AI活用提案
            </motion.span>
            <div style={{ display: "flex", gap: 4 }}>
              {sections.map((s, i) => (
                <motion.button
                  key={i}
                  onClick={() => scrollTo(i)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    position: "relative",
                    padding: "8px 16px",
                    fontSize: 13,
                    fontWeight: activeSection === i ? 600 : 400,
                    color: activeSection === i ? "#2563eb" : "var(--color-text-muted)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    borderRadius: 8,
                    transition: "color 200ms ease",
                  }}
                >
                  {s}
                  {activeSection === i && (
                    <motion.div
                      layoutId="tab-underline"
                      style={{
                        position: "absolute", bottom: 0, left: 8, right: 8,
                        height: 2, borderRadius: 1, background: "#2563eb",
                      }}
                    />
                  )}
                </motion.button>
              ))}
            </div>
          </div>
        </nav>

        <main style={{ maxWidth: 1152, margin: "0 auto", padding: "96px 32px 64px", position: "relative", zIndex: 1 }}>

          {/* ── Hero Stats ── */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 64 }}
          >
            {[
              { label: "AI機能カテゴリ", value: 6, suffix: "種類" },
              { label: "業務活用シーン", value: 6, suffix: "パターン" },
              { label: "連携サービス", value: 8, suffix: "以上" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                style={{
                  background: "var(--color-bg-subtle)",
                  border: "1px solid var(--color-border)",
                  borderRadius: 12,
                  padding: "20px 24px",
                  textAlign: "center",
                }}
              >
                <p style={{ fontSize: 11, fontWeight: 500, color: "var(--color-text-faint)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>{stat.label}</p>
                <p style={{ fontSize: 32, fontWeight: 700, color: "#2563eb", lineHeight: 1 }}>
                  <AnimatedNumber value={stat.value} suffix={stat.suffix} delay={i * 200} />
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* ── Section 1: AIができること ── */}
          <section ref={sectionRefs[0]} style={{ marginBottom: 96, scrollMarginTop: 80 }}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
              <h2 style={{ fontSize: 28, fontWeight: 700, color: "var(--color-text)", marginBottom: 4 }}>AIでできること</h2>
              <p style={{ fontSize: 14, color: "var(--color-text-muted)", marginBottom: 32 }}>6つの機能カテゴリ</p>
            </motion.div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
              {categories.map((cat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
                >
                  <TiltCard
                    style={{
                      background: "var(--color-bg)",
                      border: "1px solid var(--color-border)",
                      borderRadius: 12,
                      overflow: "hidden",
                      cursor: "default",
                    }}
                  >
                    <div style={{ borderLeft: `3px solid ${cat.color}`, padding: 24 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                        <motion.span
                          whileHover={{ rotate: 12, scale: 1.15 }}
                          style={{
                            display: "flex", alignItems: "center", justifyContent: "center",
                            width: 36, height: 36, borderRadius: 8,
                            background: cat.bgColor, color: cat.color,
                          }}
                        >
                          <Icon d={icons[cat.iconKey]} size={18} color={cat.color} />
                        </motion.span>
                        <span style={{ fontSize: 11, fontWeight: 700, color: cat.color, opacity: 0.5 }}>{cat.num}</span>
                      </div>
                      <h3 style={{ fontSize: 15, fontWeight: 600, color: "var(--color-text)", marginBottom: 4 }}>{cat.title}</h3>
                      <p style={{ fontSize: 13, color: "var(--color-text-muted)", lineHeight: 1.6 }}>{cat.description}</p>
                    </div>
                  </TiltCard>
                </motion.div>
              ))}
            </div>

            <HubDiagram />
          </section>

          {/* ── Section 2: ミクロンでの活用方法 ── */}
          <section ref={sectionRefs[1]} style={{ marginBottom: 96, scrollMarginTop: 80 }}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
              <h2 style={{ fontSize: 28, fontWeight: 700, color: "var(--color-text)", marginBottom: 4 }}>株式会社ミクロン × AI</h2>
              <p style={{ fontSize: 14, color: "var(--color-text-muted)", marginBottom: 32 }}>カーソルをかざすと詳細が覗けます</p>
            </motion.div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 24 }}>
              {usageCards.map((card, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
                >
                  <PeekCard
                    color={card.color}
                    front={
                      <>
                        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                          <motion.span
                            whileHover={{ rotate: 12, scale: 1.15 }}
                            style={{
                              display: "flex", alignItems: "center", justifyContent: "center",
                              width: 36, height: 36, borderRadius: 8,
                              background: card.bgColor, color: card.color,
                            }}
                          >
                            <Icon d={icons[card.iconKey]} size={18} color={card.color} />
                          </motion.span>
                          <span style={{ fontSize: 11, fontWeight: 700, color: card.color, opacity: 0.5 }}>{card.num}</span>
                          <span style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "var(--color-text-faint)" }}>
                            <Icon d={icons.eye} size={14} color="var(--color-text-faint)" /> 覗く
                          </span>
                        </div>
                        <h3 style={{ fontSize: 15, fontWeight: 600, color: "var(--color-text)", marginBottom: 4 }}>{card.title}</h3>
                        <p style={{ fontSize: 13, color: "var(--color-text-muted)", lineHeight: 1.6, marginBottom: 12 }}>{card.description}</p>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                          {card.services.map((s) => (
                            <span key={s} style={{ padding: "2px 10px", fontSize: 11, fontWeight: 500, borderRadius: 100, background: card.bgColor, color: card.color, border: `1px solid ${card.color}22` }}>{s}</span>
                          ))}
                        </div>
                      </>
                    }
                    back={
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                        <div>
                          <p style={{ fontSize: 12, fontWeight: 600, color: "#2563eb", marginBottom: 8, display: "flex", alignItems: "center", gap: 4 }}>
                            <Icon d={icons.check} size={14} color="#2563eb" /> Claudeができること
                          </p>
                          {card.claudeCan.map((item, j) => (
                            <p key={j} style={{ fontSize: 12, color: "var(--color-text-muted)", lineHeight: 1.6, paddingLeft: 16, position: "relative", marginBottom: 4 }}>
                              <span style={{ position: "absolute", left: 4, top: 2 }}><Icon d={icons.chevronRight} size={10} color="#2563eb" /></span>
                              {item}
                            </p>
                          ))}
                        </div>
                        <div>
                          <p style={{ fontSize: 12, fontWeight: 600, color: "#e11d48", marginBottom: 8, display: "flex", alignItems: "center", gap: 4 }}>
                            <Icon d={icons.externalLink} size={14} color="#e11d48" /> 連携サービス
                          </p>
                          {card.linked.map((item, j) => (
                            <p key={j} style={{ fontSize: 12, color: "var(--color-text-muted)", lineHeight: 1.6, paddingLeft: 16, position: "relative", marginBottom: 4 }}>
                              <span style={{ position: "absolute", left: 4, top: 2 }}><Icon d={icons.chevronRight} size={10} color="#e11d48" /></span>
                              {item}
                            </p>
                          ))}
                        </div>
                      </div>
                    }
                  />
                </motion.div>
              ))}
            </div>
          </section>

          {/* ── Section 3: Claudeからの提案 ── */}
          <section ref={sectionRefs[2]} style={{ scrollMarginTop: 80 }}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
              <h2 style={{ fontSize: 28, fontWeight: 700, color: "var(--color-text)", marginBottom: 4 }}>Claudeからの提案</h2>
              <p style={{ fontSize: 14, color: "var(--color-text-muted)", marginBottom: 16 }}>ミクロンの業務効率化ロードマップ</p>
            </motion.div>

            <StepProgress phase={activePhase} total={3} />

            {/* Phase selector tabs */}
            <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
              {phases.map((phase, i) => (
                <motion.button
                  key={i}
                  onClick={() => setActivePhase(i)}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  style={{
                    flex: 1,
                    padding: "12px 16px",
                    borderRadius: 12,
                    border: `1px solid ${activePhase === i ? phase.color : "var(--color-border)"}`,
                    background: activePhase === i ? phase.bgColor : "var(--color-bg)",
                    cursor: "pointer",
                    transition: "all 200ms ease",
                    outline: "none",
                    textAlign: "left",
                  }}
                >
                  <span style={{ fontSize: 11, fontWeight: 600, color: phase.color, opacity: activePhase === i ? 1 : 0.5 }}>
                    Phase {i + 1}
                  </span>
                  <p style={{ fontSize: 14, fontWeight: activePhase === i ? 600 : 400, color: activePhase === i ? "var(--color-text)" : "var(--color-text-muted)", marginTop: 2 }}>
                    {phase.title}
                  </p>
                </motion.button>
              ))}
            </div>

            {/* Active phase detail */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activePhase}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.3 }}
                style={{
                  background: "var(--color-bg)",
                  border: "1px solid var(--color-border)",
                  borderLeft: `3px solid ${phases[activePhase].color}`,
                  borderRadius: 12,
                  padding: 32,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                  <span style={{
                    fontSize: 11, fontWeight: 600,
                    padding: "4px 12px",
                    borderRadius: 100,
                    background: phases[activePhase].bgColor,
                    color: phases[activePhase].color,
                    border: `1px solid ${phases[activePhase].color}33`,
                  }}>
                    {phases[activePhase].badgeText}
                  </span>
                  <span style={{ fontSize: 13, color: "var(--color-text-faint)" }}>{phases[activePhase].period}</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {phases[activePhase].items.map((item, j) => (
                    <motion.div
                      key={j}
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: j * 0.12 }}
                      style={{
                        display: "flex", alignItems: "center", gap: 12,
                        padding: "12px 16px",
                        borderRadius: 8,
                        background: "var(--color-bg-subtle)",
                        border: "1px solid var(--color-border)",
                      }}
                    >
                      <span style={{
                        display: "flex", alignItems: "center", justifyContent: "center",
                        width: 24, height: 24, borderRadius: 6,
                        background: phases[activePhase].bgColor,
                        fontSize: 12, fontWeight: 600, color: phases[activePhase].color,
                      }}>
                        {j + 1}
                      </span>
                      <span style={{ fontSize: 14, color: "var(--color-text)" }}>{item}</span>
                    </motion.div>
                  ))}
                </div>
                {activePhase < 2 && (
                  <motion.button
                    onClick={() => setActivePhase(activePhase + 1)}
                    whileHover={{ scale: 1.02, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      display: "inline-flex", alignItems: "center", gap: 8,
                      marginTop: 24, padding: "8px 20px",
                      background: "var(--color-text)",
                      color: "var(--color-bg)",
                      border: "none", borderRadius: 8,
                      fontSize: 13, fontWeight: 500,
                      cursor: "pointer",
                    }}
                  >
                    次のフェーズへ <Icon d={icons.arrowRight} size={14} color="var(--color-bg)" />
                  </motion.button>
                )}
              </motion.div>
            </AnimatePresence>

            <CTASection />

            {/* Footer */}
            <div style={{ marginTop: 48, textAlign: "center" }}>
              <motion.a
                href="/"
                whileHover={{ scale: 1.05 }}
                style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 13, color: "#2563eb", textDecoration: "none" }}
              >
                <Icon d={icons.externalLink} size={14} color="#2563eb" />
                AI Ecosystem Map を見る
              </motion.a>
            </div>
          </section>
        </main>
      </div>
    </>
  )
}
