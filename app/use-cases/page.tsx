"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from "framer-motion"

/* ───────────────────────── SVG Icon ───────────────────────── */
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
  chevronRight: "M9 18l6-6-6-6",
  arrowRight: "M5 12h14M12 5l7 7-7 7",
  check: "M20 6L9 17l-5-5",
  sparkle: "M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83",
  play: "M5 3l14 9-14 9V3z",
  user: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 7m-4 0a4 4 0 1 0 8 0 4 4 0 1 0-8 0",
  trendUp: "M23 6l-9.5 9.5-5-5L1 18M17 6h6v6",
  shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  layers: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
  target: "M12 12m-10 0a10 10 0 1 0 20 0 10 10 0 1 0-20 0M12 12m-6 0a6 6 0 1 0 12 0 6 6 0 1 0-12 0M12 12m-2 0a2 2 0 1 0 4 0 2 2 0 1 0-4 0",
  briefcase: "M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2zM16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2",
  lightbulb: "M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z",
}

/* ───────────────────────── CSS Variables ───────────────────────── */
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
  * { box-sizing: border-box; }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .fade-up { animation: fadeUp 0.5s ease forwards; }
  .fade-up-1 { animation: fadeUp 0.5s ease 0.1s forwards; opacity: 0; }
  .fade-up-2 { animation: fadeUp 0.5s ease 0.2s forwards; opacity: 0; }
  .fade-up-3 { animation: fadeUp 0.5s ease 0.3s forwards; opacity: 0; }
  .fade-up-4 { animation: fadeUp 0.5s ease 0.4s forwards; opacity: 0; }
  .fade-up-5 { animation: fadeUp 0.5s ease 0.5s forwards; opacity: 0; }
  .fade-up-6 { animation: fadeUp 0.5s ease 0.6s forwards; opacity: 0; }
`

/* ───────────────────────── Types ───────────────────────── */
interface UseCase {
  id: string
  category: string
  title: string
  pain: string
  solution: string
  claudeRole: string
  tools: string[]
  impact: string
  iconKey: keyof typeof icons
  color: string
  bgColor: string
}

interface AiCapability {
  num: string
  title: string
  description: string
  iconKey: keyof typeof icons
  color: string
  bgColor: string
  examples: string[]
}

/* ──────────────────────── Data ───────────────────────── */
const capabilities: AiCapability[] = [
  {
    num: "01", title: "文書作成・情報整理",
    description: "報告書、議事録、提案書、メール文面を瞬時に生成。社内の情報を構造化して再利用可能に。",
    iconKey: "file", color: "#2563eb", bgColor: "#eff6ff",
    examples: ["報告書の自動ドラフト", "議事録の要約・整形", "篾内ナレッジの検索・抽出"],
  },
  {
    num: "02", title: "データ分析・可視化",
    description: "Excel・CSVデータを読み込んで分析。傾向の把握、異常値の検出、レポート生成を自動化。",
    iconKey: "chart", color: "#059669", bgColor: "#ecfdf5",
    examples: ["売上データの傾向分析", "KPIダッシュボード生成", "品質データの異常検出"],
  },
  {
    num: "03", title: "業務プロセス自動化",
    description: "定型業務のフロー化、メール仕分け、申請書作成など反復タスクを自動化。",
    iconKey: "zap", color: "#d97706", bgColor: "#fffbeb",
    examples: ["受信メールの自動分類", "発注書の自動生成", "日報・週報の自動集約"],
  },
  {
    num: "04", title: "翻訳・多言語対応",
    description: "100以上の言語に対応。技術文書もニュアンスを保った自然な翻訳。",
    iconKey: "globe", color: "#0d9488", bgColor: "#f0fdfa",
    examples: ["技術仕様書の日英翻訳", "海外顧客メールの翻訳", "UIの多言語化"],
  },
  {
    num: "05", title: "コーディング・開発",
    description: "アプリ開発、バグ修正、コードレビュー、テスト生成まで。フルスタック対応。",
    iconKey: "code", color: "#7c3aed", bgColor: "#f5f3ff",
    examples: ["Webアプリの構築", "APIの設計・実装", "自動テストの生成"],
  },
  {
    num: "06", title: "PC操作・ブラウザ自動化",
    description: "画面上のクリック、入力、ログインなどをAIが代行。手作業ゼロの業務を実現。",
    iconKey: "monitor", color: "#dc2626", bgColor: "#fef2f2",
    examples: ["フォーム自動入力", "Webスクレイピング", "定期的な画面操作の自動化"],
  },
]

const useCases: UseCase[] = [
  {
    id: "doc", category: "情報処理",
    title: "図面・仕様書の検索と管理",
    pain: "過去の図面を探すのに毎回30分以上かかる。英語の仕様書は読むだけで半日。",
    solution: "AIが社内文書を横断検索し、要約・翻訳を即座に実行。",
    claudeRole: "PDF・Wordの内容を瞬時に要約、英語仕様書を自然な日本語に翻訳、変更点を自動検出",
    tools: ["Notion", "NotebookLM"],
    impact: "検索時間 90%削減、翻訳コスト 80%削減",
    iconKey: "clipboard", color: "#2563eb", bgColor: "#eff6ff",
  },
  {
    id: "report", category: "レポート",
    title: "品質レポート・報告書の自動生成",
    pain: "検査データの集計に2時間、報告書作成にさらに3時間。毎週の繰り返し。",
    solution: "データ投入だけでAIが集計・分析・報告書ドラフトまで自動生成。",
    claudeRole: "CSVデータの分析・集計、不良原因の分析レポートをドラフト、顧客向け報告書のフォーマット整形",
    tools: ["ChatGPT (グラフ生成)", "Canva (デザイン)"],
    impact: "作成時間 5時間 → 30分、週20時間の削減",
    iconKey: "chart", color: "#059669", bgColor: "#ecfdf5",
  },
  {
    id: "order", category: "業務自動化",
    title: "発注・在庫管理の自動化",
    pain: "在庫確認→発注書作成→メール送信を手動で毎日。漏れやミスが頻発。",
    solution: "在庫が閾値を下回ると自動で発注書を作成し、仕入先にメール送信。",
    claudeRole: "発注書テンプレートの自動生成、仕入先メールの解析・分類、価格比較表の作成",
    tools: ["N8N (自動化)", "Gmail"],
    impact: "発注ミス ゼロ化、作業時間 95%削減",
    iconKey: "cart", color: "#0d9488", bgColor: "#f0fdfa",
  },
  {
    id: "routine", category: "定型業務",
    title: "日報・週報・申請書の自動化",
    pain: "毎日30分の日報作成。週報は各メンバーの日報をまとめるだけで1時間以上。",
    solution: "音声録音やメモから日報を自動生成。週報は日報データから自動集約。",
    claudeRole: "テンプレートの自動入力、受信メールの優先度分類、各種申請書の下書き作成",
    tools: ["Tipeless (音声)", "Notion"],
    impact: "日報作成 30分 → 3分、週報集約 自動化",
    iconKey: "clock", color: "#d97706", bgColor: "#fffbeb",
  },
  {
    id: "voice", category: "音声活用",
    title: "会議・現場音声の自動議事録化",
    pain: "会議の議事録保は内容に集中できない。現場の口頭報告は記録に残らない。",
    solution: "録音するだけで文字起こし→要約→アクションアイテム抽出→Notionに自動保存。",
    claudeRole: "文字起こしテキストの整形・要約、アクションアイテムの自動抽出、議事録フォーマットへの変換",
    tools: ["Tipeless", "Notion"],
    impact: "議事録作成 自動化、情報共有のタイムラグ ゼロ",
    iconKey: "mic", color: "#dc2626", bgColor: "#fef2f2",
  },
  {
    id: "plan", category: "計画・管理",
    title: "生産計画・工程管理の最適化",
    pain: "工程間の依存関係が複雑で、ボトルネックの特定が属人化。計画変更のたびに全体調整。",
    solution: "AIが生産データからボトルネックを特定し、工程の最適化を提案。",
    claudeRole: "生産データからボトルネックを特定、作業指示書の自動生成、工程間の依存関係を分析",
    tools: ["Notion (ダッシュボード)", "N8N (通知)"],
    impact: "計画策定時間 70%削減、工程遅延 50%削減",
    iconKey: "settings", color: "#7c3aed", bgColor: "#f5f3ff",
  },
]

const whyClaude = [
  {
    title: "日本語の品�
    title: "日本語の品質が圧倒的",
    description: "ビジネス文書に必要な正確さと自然さ。敬語・専門用語も的確に扱える。",
    iconKey: "file" as const, color: "#2563eb",
  },
  {
    title: "20万トークンの長文理解",
    description: "100ページ超のPDFや仕様書を一度に読み込み、全体を把握した上で回答。",
    iconKey: "layers" as const, color: "#059669",
  },
  {
    title: "正確性と安全性",
    description: "ハルシネーション（嘘）が少なく、わからないことは「わからない」と回答。業務利用に必須の信頼性。",
    iconKey: "shield" as const, color: "#7c3aed",
  },
  {
    title: "API・自動化との親和性",
    description: "N8N、Notion、Gmail等と連携可能。社内システムへの組み込みもAPI経由で容易。",
    iconKey: "code" as const, color: "#d97706",
  },
]

const roadmap = [
  {
    phase: "Phase 1",
    title: "即導入",
    period: "今週から",
    items: ["Claudeで文書要約・翻訳を開始", "Tipelessで音声日報を試行", "日常メールのドラフト支援"],
    color: "#059669", bgColor: "#ecfdf5", badgeText: "無料で開始可能",
  },
  {
    phase: "Phase 2",
    title: "業務フロー構築",
    period: "1〜2ヶ月",
    items: ["N8Nで発注・通知の自動化フロー構築", "Notionにナレッジベース整備", "品質レポートの自動生成パイプライン"],
    color: "#2563eb", bgColor: "#eff6ff", badgeText: "セットアップ必要",
  },
  {
    phase: "Phase 3",
    title: "全社展開",
    period: "3ヶ月〜",
    items: ["Claude APIを社内システムに組み込み", "全部門への展開・教育", "AIエージェントによる自律的業務処理"],
    color: "#7c3aed", bgColor: "#f5f3ff", badgeText: "カスタム開発",
  },
]

/* ───────────────────────── Animated Counter ───────────────────────── */
function AnimatedNumber({ value, suffix = "", delay = 0 }: { value: number; suffix?: string; delay?: number }) {
  const [display, setDisplay] = useState(0)
  useEffect(() => {
    const timer = setTimeout(() => {
      const duration = 1200; const start = performance.now()
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

/* ───────────────────────── Section Component ───────────────────────── */
function Section({ children, id }: { children: React.ReactNode; id?: string }) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      style={{ marginBottom: 64 }}
    >
      {children}
    </motion.section>
  )
}

/* ───────────────────────── Sticky Nav ───────────────────────── */
const navItems = [
  { id: "capabilities", label: "AIができること" },
  { id: "use-cases", label: "活用事例" },
  { id: "why-claude", label: "なぜClaudeか" },
  { id: "roadmap", label: "導入ステップ" },
]

function StickyNav({ activeSection }: { activeSection: string }) {
  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 50,
      background: "rgba(255,255,255,0.85)", backdropFilter: "blur(12px)",
      borderBottom: "1px solid var(--color-border)",
      padding: "0 24px",
    }}>
      <div style={{
        maxWidth: 1080, margin: "0 auto",
        display: "flex", gap: 0, height: 48, alignItems: "stretch",
      }}>
        {navItems.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            style={{
              display: "flex", alignItems: "center",
              padding: "0 16px",
              fontSize: 13, fontWeight: activeSection === item.id ? 600 : 400,
              color: activeSection === item.id ? "var(--color-primary)" : "var(--color-text-muted)",
              borderBottom: activeSection === item.id ? "2px solid var(--color-primary)" : "2px solid transparent",
              textDecoration: "none",
              transition: "all 150ms ease",
            }}
          >
            {item.label}
          </a>
        ))}
        <div style={{ flex: 1 }} />
        <a
          href="/"
          style={{
            display: "flex", alignItems: "center", gap: 6,
            fontSize: 12, color: "var(--color-text-faint)", textDecoration: "none",
          }}
        >
          <Icon d={icons.layers} size={14} /> Ecosystem Map
        </a>
      </div>
    </nav>
  )
}

/* ───────────────────────── Main Page ───────────────────────── */
export default function UseCasesPage() {
  const [activeSection, setActiveSection] = useState("capabilities")
  const [expandedCase, setExpandedCase] = useState<string | null>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id)
        })
      },
      { rootMargin: "-40% 0px -55% 0px" }
    )
    navItems.forEach((item) => {
      const el = document.getElementById(item.id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: cssVars }} />
      <div style={{
        minHeight: "100vh",
        background: "var(--color-bg)",
        color: "var(--color-text)",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      }}>
        <StickyNav activeSection={activeSection} />

        <div style={{ maxWidth: 1080, margin: "0 auto", padding: "0 24px" }}>
          {/* ─── Hero ─── */}
          <div style={{ textAlign: "center", padding: "64px 0 48px" }}>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                padding: "4px 12px", borderRadius: 100,
                background: "var(--color-bg-muted)", border: "1px solid var(--color-border)",
                fontSize: 12, fontWeight: 500, color: "var(--color-text-muted)",
                marginBottom: 16,
              }}>
                <Icon d={icons.sparkle} size={14} color="var(--color-primary)" />
                社内検討資料
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              style={{
                fontSize: 36, fontWeight: 700, lineHeight: 1.3,
                color: "var(--color-text)", margin: "16px 0 12px",
                letterSpacing: "-0.02em",
              }}
            >
              AIで変わる、<br />これからの業務
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              style={{
                fontSize: 15, color: "var(--color-text-muted)",
                maxWidth: 520, margin: "0 auto", lineHeight: 1.7,
              }}
            >
              AIは「未来の技術」ではなく「今日から使えるツール」です。<br />
              具体的な活用事例と、最適なAI選定についてご提案します。
            </motion.p>

            {/* Metrics */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              style={{
                display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16,
                maxWidth: 560, margin: "32px auto 0",
              }}
            >
              {[
                { value: 70, suffix: "%", label: "定型業務の削減可能率" },
                { value: 5, suffix: "時間/週", label: "1人あたりの時間創出" },
                { value: 3, suffix: "ヶ月", label: "投資回収目安" },
              ].map((m, i) => (
                <div key={i} style={{
                  padding: 16, borderRadius: 12,
                  background: "var(--color-bg-subtle)", border: "1px solid var(--color-border)",
                }}>
                  <p style={{ fontSize: 28, fontWeight: 600, color: "var(--color-primary)", margin: 0, lineHeight: 1 }}>
                    <AnimatedNumber value={m.value} suffix={m.suffix} delay={i * 150} />
                  </p>
                  <p style={{ fontSize: 11, color: "var(--color-text-muted)", margin: "8px 0 0" }}>{m.label}</p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* ─── Section 1: AIができること ─── */}
          <Section id="capabilities">
            <h2 style={{ fontSize: 22, fontWeight: 600, marginBottom: 8 }}>AIができること</h2>
            <p style={{ fontSize: 14, color: "var(--color-text-muted)", marginBottom: 32 }}>
              現在のAI技蠓で実現可能な6つの領域。すべて今日から導入を開始できます。
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
              {capabilities.map((cap, i) => (
                <motion.div
                  key={cap.num}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  style={{
                    padding: 24, borderRadius: 12,
                    background: "var(--color-bg)",
                    border: "1px solid var(--color-border)",
                    cursor: "default",
                    transition: "border-color 150ms ease, box-shadow 150ms ease",
                  }}
                  whileHover={{ borderColor: "var(--color-border-strong)", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: 10,
                      background: cap.bgColor, display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <Icon d={icons[cap.iconKey]} size={20} color={cap.color} />
                    </div>
                    <div>
                      <span style={{ fontSize: 11, fontWeight: 600, color: cap.color }}>{cap.num}</span>
                      <h3 style={{ fontSize: 15, fontWeight: 600, margin: 0 }}>{cap.title}</h3>
                    </div>
                  </div>
                  <p style={{ fontSize: 13, color: "var(--color-text-muted)", lineHeight: 1.6, margin: "0 0 12px" }}>
                    {cap.description}
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {cap.examples.map((ex) => (
                      <span key={ex} style={{
                        padding: "3px 10px", borderRadius: 100,
                        background: "var(--color-bg-muted)", fontSize: 11, color: "var(--color-text-muted)",
                      }}>
                        {ex}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </Section>

          {/* ─── Section 2: 活用事例 ─── */}
          <Section id="use-cases">
            <h2 style={{ fontSize: 22, fontWeight: 600, marginBottom: 8 }}>具体的な活用事例</h2>
            <p style={{ fontSize: 14, color: "var(--color-text-muted)", marginBottom: 32 }}>
              実際の業務シーンに合わせた導入イメージ。クリックで詳細を確認できます。
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {useCases.map((uc, i) => {
                const isOpen = expandedCase === uc.id
                return (
                  <motion.div
                    key={uc.id}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    style={{
                      borderRadius: 12,
                      border: `1px solid ${isOpen ? uc.color + "40" : "var(--color-border)"}`,
                      background: isOpen ? uc.bgColor + "80" : "var(--color-bg)",
                      overflow: "hidden",
                      transition: "all 200ms ease",
                    }}
                  >
                    {/* Header - clickable */}
                    <div
                      onClick={() => setExpandedCase(isOpen ? null : uc.id)}
                      style={{
                        display: "flex", alignItems: "center", gap: 16, padding: 20,
                        cursor: "pointer",
                      }}
                    >
                      <div style={{
                        width: 44, height: 44, borderRadius: 10, flexShrink: 0,
                        background: uc.bgColor, display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        <Icon d={icons[uc.iconKey]} size={22} color={uc.color} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                          <span style={{
                            padding: "2px 8px", borderRadius: 100,
                            background: uc.bgColor, fontSize: 11, fontWeight: 500, color: uc.color,
                          }}>
                            {uc.category}
                          </span>
                        </div>
                        <h3 style={{ fontSize: 15, fontWeight: 600, margin: 0 }}>{uc.title}</h3>
                      </div>
                      <div style={{ flexShrink: 0, display: "flex", alignItems: "center" }}>
                        <span style={{
                          fontSize: 12, color: "var(--color-text-faint)", marginRight: 8,
                          display: isOpen ? "none" : "block",
                        }}>
                          {uc.impact.split("、")[0]}
                        </span>
                        <motion.span
                          animate={{ rotate: isOpen ? 90 : 0 }}
                          transition={{ duration: 0.15 }}
                        >
                          <Icon d={icons.chevronRight} size={16} color="var(--color-text-faint)" />
                        </motion.span>
                      </div>
                    </div>

                    {/* Detail - expandable */}
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2, ease: "easeOut" }}
                          style={{ overflow: "hidden" }}
                        >
                          <div style={{ padding: "0 20px 20px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                            {/* 左: 課題と解決策 */}
                            <div>
                              <div style={{ marginBottom: 16 }}>
                                <p style={{ fontSize: 12, fontWeight: 600, color: "var(--color-text-muted)", marginBottom: 4 }}>
                                  <Icon d={icons.target} size={12} color={uc.color} /> 現在の課題
                                </p>
                                <p style={{ fontSize: 13, color: "var(--color-text)", lineHeight: 1.6, margin: 0 }}>{uc.pain}</p>
                              </div>
                              <div>
                                <p style={{ fontSize: 12, fontWeight: 600, color: "var(--color-text-muted)", marginBottom: 4 }}>
                                  <Icon d={icons.lightbulb} size={12} color={uc.color} /> AI導入後
                                </p>
                                <p style={{ fontSize: 13, color: "var(--color-text)", lineHeight: 1.6, margin: 0 }}>{uc.solution}</p>
                              </div>
                            </div>
                            {/* 右: Claudeの役割と連携ツール */}
                            <div>
                              <div style={{ marginBottom: 16 }}>
                                <p style={{ fontSize: 12, fontWeight: 600, color: "var(--color-primary)", marginBottom: 4 }}>
                                  <Icon d={icons.sparkle} size={12} color="var(--color-primary)" /> Claudeの役割
                                </p>
                                <p style={{ fontSize: 13, color: "var(--color-text)", lineHeight: 1.6, margin: 0 }}>{uc.claudeRole}</p>
                              </div>
                              <div style={{ marginBottom: 16 }}>
                                <p style={{ fontSize: 12, fontWeight: 600, color: "var(--color-text-muted)", marginBottom: 6 }}>連携ツール</p>
                                <div style={{ display: "flex", gap: 6 }}>
                                  {uc.tools.map((t) => (
                                    <span key={t} style={{
                                      padding: "3px 10px", borderRadius: 100,
                                      background: "var(--color-bg)", border: "1px solid var(--color-border)",
                                      fontSize: 11, color: "var(--color-text-muted)",
                                    }}>
                                      {t}
                                    </span>
                                  ))}
                                </div>
                              </div>
                              <div style={{
                                padding: "8px 12px", borderRadius: 8,
                                background: "var(--color-bg)", border: `1px solid ${uc.color}20`,
                              }}>
                                <p style={{ fontSize: 12, fontWeight: 600, color: uc.color, margin: 0 }}>
                                  <Icon d={icons.trendUp} size={12} color={uc.color} /> 期待効果
                                </p>
                                <p style={{ fontSize: 14, fontWeight: 600, color: "var(--color-text)", margin: "4px 0 0" }}>{uc.impact}</p>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )
              })}
            </div>
          </Section>

          {/* ─── Section 3: なぜClaudeか ─── */}
          <Section id="why-claude">
            <h2 style={{ fontSize: 22, fontWeight: 600, marginBottom: 8 }}>なぜ Claude を推奨するか</h2>
            <p style={{ fontSize: 14, color: "var(--color-text-muted)", marginBottom: 32 }}>
              ChatGPT、Gemini、その他のAIツールと比較した上での推奨理由です。
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
              {whyClaude.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  style={{
                    padding: 24, borderRadius: 12,
                    background: "var(--color-bg)",
                    border: "1px solid var(--color-border)",
                  }}
                >
                  <div style={{
                    width: 36, height: 36, borderRadius: 8,
                    background: item.color + "10", display: "flex", alignItems: "center", justifyContent: "center",
                    marginBottom: 12,
                  }}>
                    <Icon d={icons[item.iconKey]} size={18} color={item.color} />
                  </div>
                  <h3 style={{ fontSize: 15, fontWeight: 600, margin: "0 0 6px" }}>{item.title}</h3>
                  <p style={{ fontSize: 13, color: "var(--color-text-muted)", lineHeight: 1.6, margin: 0 }}>{item.description}</p>
                </motion.div>
              ))}
            </div>

            {/* Comparison table */}
            <div style={{
              marginTop: 32, borderRadius: 12,
              border: "1px solid var(--color-border)",
              overflow: "hidden",
            }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ background: "var(--color-bg-subtle)" }}>
                    <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600, borderBottom: "1px solid var(--color-border)" }}>比較項目</th>
                    <th style={{ padding: "12px 16px", textAlign: "center", fontWeight: 600, color: "var(--color-primary)", borderBottom: "1px solid var(--color-border)" }}>Claude</th>
                    <th style={{ padding: "12px 16px", textAlign: "center", fontWeight: 600, borderBottom: "1px solid var(--color-border)", color: "var(--color-text-muted)" }}>ChatGPT</th>
                    <th style={{ padding: "12px 16px", textAlign: "center", fontWeight: 600, borderBottom: "1px solid var(--color-border)", color: "var(--color-text-muted)" }}>Gemini</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["日本語品質", "best", "good", "good"],
                    ["長文理解 (トークン)", "best", "fair", "best"],
                    ["正確性 (ハルシネーション少)", "best", "good", "fair"],
                    ["コーディング能力", "best", "good", "good"],
                    ["API統合のしやすさ", "best", "best", "good"],
                    ["料金 (API)", "good", "good", "best"],
                  ].map(([label, claude, chatgpt, gemini], i) => (
                    <tr key={i} style={{ borderBottom: i < 5 ? "1px solid var(--color-border)" : "none" }}>
                      <td style={{ padding: "10px 16px", fontWeight: 500 }}>{label}</td>
                      {[claude, chatgpt, gemini].map((v, j) => (
                        <td key={j} style={{ padding: "10px 16px", textAlign: "center" }}>
                          {v === "best" ? (
                            <span style={{
                              display: "inline-flex", alignItems: "center", gap: 4,
                              padding: "2px 10px", borderRadius: 100,
                              background: j === 0 ? "#eff6ff" : "var(--color-bg-muted)",
                              fontSize: 12, fontWeight: 500,
                              color: j === 0 ? "var(--color-primary)" : "var(--color-text-muted)",
                            }}>
                              <Icon d={icons.check} size={12} color={j === 0 ? "var(--color-primary)" : "var(--color-text-muted)"} />
                              {j === 0 ? "優秀" : "優秀"}
                            </span>
                          ) : v === "good" ? (
                            <span style={{ fontSize: 12, color: "var(--color-text-muted)" }}>良好</span>
                          ) : (
                            <span style={{ fontSize: 12, color: "var(--color-text-faint)" }}>普通</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>

          {/* ─── Section 4: 導入ステップ ─── */}
          <Section id="roadmap">
            <h2 style={{ fontSize: 22, fontWeight: 600, marginBottom: 8 }}>導入ロードマップ</h2>
            <p style={{ fontSize: 14, color: "var(--color-text-muted)", marginBottom: 32 }}>
              小さく始めて、効果を確認しながら段階的に拡大。リスクを最小限に。
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
              {roadmap.map((phase, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  style={{
                    padding: 24, borderRadius: 12,
                    background: "var(--color-bg)",
                    border: "1px solid var(--color-border)",
                    borderTop: `3px solid ${phase.color}`,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: phase.color }}>{phase.phase}</span>
                    <span style={{
                      padding: "2px 8px", borderRadius: 100,
                      background: phase.bgColor, fontSize: 11, fontWeight: 500, color: phase.color,
                    }}>
                      {phase.badgeText}
                    </span>
                  </div>
                  <h3 style={{ fontSize: 18, fontWeight: 600, margin: "0 0 4px" }}>{phase.title}</h3>
                  <p style={{ fontSize: 12, color: "var(--color-text-muted)", margin: "0 0 16px" }}>{phase.period}</p>
                  <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
                    {phase.items.map((item, j) => (
                      <li key={j} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 13, color: "var(--color-text)", lineHeight: 1.5 }}>
                        <Icon d={icons.check} size={14} color={phase.color} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </Section>

          {/* ─── CTA ─── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{
              textAlign: "center", padding: "48px 32px",
              borderRadius: 16, marginBottom: 64,
              background: "linear-gradient(135deg, var(--color-bg-subtle) 0%, #eff6ff 100%)",
              border: "1px solid var(--color-border)",
            }}
          >
            <h2 style={{ fontSize: 22, fontWeight: 600, margin: "0 0 8px" }}>ま�Zは小さく始めてみませんか？</h2>
            <p style={{ fontSize: 14, color: "var(--color-text-muted)", margin: "0 0 24px" }}>
              Claude の無料プランで、文書要約・翻訳・メールドラフトから試行できます。
            </p>
            <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
              <a
                href="https://claude.ai"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  padding: "10px 24px", borderRadius: 8,
                  background: "var(--color-primary)", color: "#fff",
                  fontSize: 14, fontWeight: 500, textDecoration: "none",
                  transition: "opacity 150ms ease",
                }}
              >
                Claude を試す <Icon d={icons.arrowRight} size={14} color="#fff" />
              </a>
              <a
                href="/"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  padding: "10px 24px", borderRadius: 8,
                  background: "var(--color-bg)", color: "var(--color-text)",
                  border: "1px solid var(--color-border)",
                  fontSize: 14, fontWeight: 500, textDecoration: "none",
                  transition: "background 150ms ease",
                }}
              >
                Ecosystem Map を見る
              </a>
            </div>
          </motion.div>

          {/* Footer */}
          <div style={{
            padding: "24px 0", borderTop: "1px solid var(--color-border)",
            textAlign: "center", fontSize: 12, color: "var(--color-text-faint)",
            marginBottom: 32,
          }}>
            AI Ecosystem Map &mdash; Claude Integration Proposal
          </div>
        </div>
      </div>
    </>
  )
}
