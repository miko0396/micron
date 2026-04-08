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
  link: "M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71",
  layout: "M3 3h7v9H3zM14 3h7v5h-7zM14 12h7v9h-7zM3 16h7v5H3z",
  image: "M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zM21 15l-5-5L5 21M8.5 10a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z",
  folder: "M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z",
  database: "M12 2C6.48 2 2 4.02 2 6.5S6.48 11 12 11s10-2.02 10-4.5S17.52 2 12 2zM2 6.5V12c0 2.48 4.48 4.5 10 4.5s10-2.02 10-4.5V6.5M2 12v5.5C2 19.98 6.48 22 12 22s10-2.02 10-4.5V12",
  phone: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z",
  mail: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6",
  bookOpen: "M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z",
  messageCircle: "M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z",
  smartphone: "M6 2h12a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zM12 18h.01",
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
  tag?: string
}

/* ───────────────────────── Data ───────────────────────── */
const capabilities: AiCapability[] = [
  /* ── AIが得意な10分野 ── */
  {
    num: "01", title: "文書作成・要約",
    description: "報告書、議事録、提案書、メール文面を瞬時に生成。長文PDFの要約や社内ナレッジの構造化も。",
    iconKey: "file", color: "#2563eb", bgColor: "#eff6ff",
    examples: ["報告書の自動ドラフト", "議事録の要約", "社内文書の整理"],
  },
  {
    num: "02", title: "翻訳・多言語対応",
    description: "100以上の言語に対応。技術文書もニュアンスを保った自然な翻訳。敬語・専門用語も的確に処理。",
    iconKey: "globe", color: "#0d9488", bgColor: "#f0fdfa",
    examples: ["技術仕様書の日英翻訳", "海外メール翻訳", "UIの多言語化"],
  },
  {
    num: "03", title: "コーディング・開発支援",
    description: "コード生成、バグ修正、コードレビュー、テスト自動生成。フルスタック対応で開発速度を飛躍的に向上。",
    iconKey: "code", color: "#7c3aed", bgColor: "#f5f3ff",
    examples: ["Webアプリ構築", "API設計・実装", "自動テスト生成"],
  },
  {
    num: "04", title: "データ分析・可視化",
    description: "Excel・CSVを読み込んで分析。傾向把握、異常値検出、レポート生成を自動化。",
    iconKey: "chart", color: "#059669", bgColor: "#ecfdf5",
    examples: ["売上トレンド分析", "KPIダッシュボード", "品質データ分析"],
  },
  {
    num: "05", title: "リサーチ・調査",
    description: "Web検索やドキュメント横断で情報収集。市場調査、競合分析、技術調査を効率化。",
    iconKey: "search", color: "#dc2626", bgColor: "#fef2f2",
    examples: ["市場動向の調査", "競合製品の比較", "特許・論文の要約"],
  },
  {
    num: "06", title: "アイデア出し・企画立案",
    description: "ブレインストーミングの相手として活用。企画書のたたき台、構成案、コピーライティングまで。",
    iconKey: "lightbulb", color: "#d97706", bgColor: "#fffbeb",
    examples: ["新サービス企画", "キャッチコピー生成", "プレゼン構成案"],
  },
  {
    num: "07", title: "メール・コミュニケーション",
    description: "ビジネスメールのドラフト、返信提案、要件整理。適切なトーンと敬語で即座に文面作成。",
    iconKey: "mail", color: "#2563eb", bgColor: "#eff6ff",
    examples: ["顧客向けメール作成", "クレーム対応文", "社内連絡の整理"],
  },
  {
    num: "08", title: "教育・研修コンテンツ",
    description: "研修資料、マニュアル、FAQ、クイズの作成。社員のスキルレベルに合わせたコンテンツ生成。",
    iconKey: "bookOpen", color: "#059669", bgColor: "#ecfdf5",
    examples: ["研修資料の作成", "操作マニュアル生成", "理解度テスト作成"],
  },
  {
    num: "09", title: "法務・契約レビュー",
    description: "契約書のリスク条項チェック、NDA・利用規約のドラフト。法的文書の読解と要約を支援。",
    iconKey: "shield", color: "#7c3aed", bgColor: "#f5f3ff",
    examples: ["契約書レビュー", "NDAドラフト", "利用規約チェック"],
  },
  {
    num: "10", title: "カスタマーサポート",
    description: "問い合わせ対応の下書き、FAQ自動生成、顧客データ分析。対応品質の均一化と速度向上。",
    iconKey: "messageCircle", color: "#dc2626", bgColor: "#fef2f2",
    examples: ["問い合わせ回答作成", "FAQ自動更新", "VOC分析"],
  },

  /* ── 苦手を補完する6分野 ── */
  {
    num: "11", title: "外部サービス連携",
    description: "Slack通知、Gmail送信、カレンダー管理、スプレッドシート更新など外部APIと連携して業務を自動化。",
    iconKey: "link", color: "#0891b2", bgColor: "#ecfeff",
    examples: ["Slack通知の自動化", "API連携フロー", "SaaS間のデータ同期"],
    tag: "連携で拡張",
  },
  {
    num: "12", title: "アプリ・ツール作成",
    description: "社内ツール、ダッシュボード、業務アプリを自然言語の指示だけで構築。プログラミング不要。",
    iconKey: "smartphone", color: "#4f46e5", bgColor: "#eef2ff",
    examples: ["社内ポータル構築", "在庫管理ツール", "日報入力アプリ"],
    tag: "連携で拡張",
  },
  {
    num: "13", title: "UI・Webデザイン",
    description: "Webページ、ランディングページ、管理画面のデザイン・実装。レスポンシブ対応も自動。",
    iconKey: "layout", color: "#c026d3", bgColor: "#fdf4ff",
    examples: ["LP制作", "管理画面デザイン", "プロトタイプ作成"],
    tag: "連携で拡張",
  },
  {
    num: "14", title: "チラシ・グラフィックデザイン",
    description: "販促チラシ、バナー、SNS投稿画像、プレゼン資料のビジュアルデザイン。Canva等と連携して高品質に。",
    iconKey: "image", color: "#e11d48", bgColor: "#fff1f2",
    examples: ["販促チラシ制作", "バナー画像生成", "SNS投稿デザイン"],
    tag: "連携で拡張",
  },
  {
    num: "15", title: "ファイル操作・管理",
    description: "PDF結合・分割、Excel集計、Word整形、フォルダ整理。大量ファイルの一括処理も対応。",
    iconKey: "folder", color: "#ea580c", bgColor: "#fff7ed",
    examples: ["PDF結合・変換", "Excel一括集計", "ファイル自動整理"],
    tag: "連携で拡張",
  },
  {
    num: "16", title: "ナレッジベース構築",
    description: "社内文書・議事録・マニュアルからナレッジDBを構築。全社の情報資産を検索・活用可能に。",
    iconKey: "database", color: "#0d9488", bgColor: "#f0fdfa",
    examples: ["社内Wiki構築", "FAQ自動整備", "ノウハウの体系化"],
    tag: "連携で拡張",
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
    pain: "会議の議事録係は内容に集中できない。現場の口頭報告は記録に残らない。",
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
              得意な10分野と、外部連携で広がる6分野をご紹介します。
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
                { value: 16, suffix: "分野", label: "AIが活用できる業務領域" },
                { value: 70, suffix: "%", label: "定型業務の削減可能率" },
                { value: 5, suffix: "時間/週", label: "1人あたりの時間創出" },
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
            <p style={{ fontSize: 14, color: "var(--color-text-muted)", marginBottom: 12 }}>
              AIが得意な10分野と、外部サービス連携で実現する6分野。合計16の業務領域をカバーします。
            </p>

            {/* Sub-header: 得意な10分野 */}
            <div style={{
              display: "flex", alignItems: "center", gap: 8, marginBottom: 16, marginTop: 24,
            }}>
              <span style={{
                padding: "3px 10px", borderRadius: 100,
                background: "#eff6ff", border: "1px solid #bfdbfe",
                fontSize: 12, fontWeight: 600, color: "#2563eb",
              }}>
                AI得意分野
              </span>
              <span style={{ fontSize: 13, color: "var(--color-text-muted)" }}>
                — テキスト・分析・生成が中心の10領域
              </span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
              {capabilities.slice(0, 10).map((cap, i) => (
                <motion.div
                  key={cap.num}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
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

            {/* Sub-header: 苦手を補完する6分野 */}
            <div style={{
              display: "flex", alignItems: "center", gap: 8, marginBottom: 16, marginTop: 40,
            }}>
              <span style={{
                padding: "3px 10px", borderRadius: 100,
                background: "#ecfeff", border: "1px solid #a5f3fc",
                fontSize: 12, fontWeight: 600, color: "#0891b2",
              }}>
                連携で拡張
              </span>
              <span style={{ fontSize: 13, color: "var(--color-text-muted)" }}>
                — 外部サービスやツールとの組み合わせで実現する6領域
              </span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
              {capabilities.slice(10).map((cap, i) => (
                <motion.div
                  key={cap.num}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  style={{
                    padding: 24, borderRadius: 12,
                    background: "var(--color-bg)",
                    border: "1px solid var(--color-border)",
                    cursor: "default",
                    transition: "border-color 150ms ease, box-shadow 150ms ease",
                    position: "relative",
                  }}
                  whileHover={{ borderColor: "var(--color-border-strong)", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}
                >
                  {cap.tag && (
                    <span style={{
                      position: "absolute", top: 12, right: 12,
                      padding: "2px 8px", borderRadius: 100,
                      background: "#ecfeff", fontSize: 10, fontWeight: 500, color: "#0891b2",
                    }}>
                      {cap.tag}
                    </span>
                  )}
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
                          {uc.impact.split("\u3001")[0]}
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
                            {/* Left: pain & solution */}
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
                            {/* Right: AI role & tools */}
                            <div>
                              <div style={{ marginBottom: 16 }}>
                                <p style={{ fontSize: 12, fontWeight: 600, color: "var(--color-primary)", marginBottom: 4 }}>
                                  <Icon d={icons.sparkle} size={12} color="var(--color-primary)" /> AIの役割
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
            <h2 style={{ fontSize: 22, fontWeight: 600, margin: "0 0 8px" }}>まずは小さく始めてみませんか?</h2>
            <p style={{ fontSize: 14, color: "var(--color-text-muted)", margin: "0 0 24px" }}>
              無料プランで文書要約・翻訳・メールドラフトから試行できます。
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
            AI Ecosystem Map &mdash; AI Integration Proposal
          </div>
        </div>
      </div>
    </>
  )
}
