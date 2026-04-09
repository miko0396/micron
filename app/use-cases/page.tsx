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
  repeat: "M17 1l4 4-4 4M3 11V9a4 4 0 0 1 4-4h14M7 23l-4-4 4-4M21 13v2a4 4 0 0 1-4 4H3",
  cpu: "M6 2h12a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zM9 2v20M15 2v20M2 9h20M2 15h20",
  video: "M23 7l-7 5 7 5V7zM14 5H3a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2z",
  users: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75",
  workflow: "M3 3h6v6H3zM15 3h6v6h-6zM9 15h6v6H9zM6 9v3a3 3 0 0 0 3 3h0M18 9v3a3 3 0 0 1-3 3h0",
  refresh: "M1 4v6h6M23 20v-6h-6M20.49 9A9 9 0 0 0 5.64 5.64L1 10M23 14l-4.64 4.36A9 9 0 0 1 3.51 15",
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

/* ───────────────────────── Data: 21 AI Capabilities ───────────────────────── */
const capabilities: AiCapability[] = [
  /* ── AI得意分野（テキスト・分析・生成が中心）── */
  {
    num: "01", title: "文章作成・要約・レポート",
    description: "報告書、議事録、提案書、メール文面を瞬時に生成。長文PDFの要約や社内ナレッジの構造化も。",
    iconKey: "file", color: "#2563eb", bgColor: "#eff6ff",
    examples: ["報告書ドラフト", "議事録の要約", "レポート自動生成"],
  },
  {
    num: "02", title: "コーディング・開発支援",
    description: "コード生成、バグ修正、コードレビュー、テスト自動生成。フルスタック対応で開発速度を飛躍的に向上。",
    iconKey: "code", color: "#7c3aed", bgColor: "#f5f3ff",
    examples: ["Webアプリ構築", "API実装", "自動テスト生成"],
  },
  {
    num: "03", title: "翻訳・多言語対応",
    description: "100以上の言語に対応。技術文書もニュアンスを保った自然な翻訳。敬語・専門用語も的確に処理。",
    iconKey: "globe", color: "#0d9488", bgColor: "#f0fdfa",
    examples: ["技術仕様書の翻訳", "海外メール翻訳", "UIの多言語化"],
  },
  {
    num: "04", title: "データ分析・構造化",
    description: "Excel・CSVを読み込んで分析。傾向把握、異常値検出、レポート生成を自動化。非構造データの構造化も。",
    iconKey: "chart", color: "#059669", bgColor: "#ecfdf5",
    examples: ["売上トレンド分析", "KPIダッシュボード", "データ整理・構造化"],
  },
  {
    num: "05", title: "ブラウザ・PC操作自動化",
    description: "Webブラウザの操作やPC上のファイル・アプリ操作をAIが代行。定型的な画面操作を自動化。",
    iconKey: "monitor", color: "#4f46e5", bgColor: "#eef2ff",
    examples: ["Web入力の自動化", "スクレイピング", "アプリ間データ転記"],
  },
  {
    num: "06", title: "定期実行・スケジュール実行",
    description: "毎日・毎週の定型タスクをスケジュール実行。レポート生成、データ収集、通知送信を自動で繰り返し。",
    iconKey: "repeat", color: "#d97706", bgColor: "#fffbeb",
    examples: ["日次レポート自動生成", "定期データ収集", "リマインダー通知"],
  },
  {
    num: "07", title: "アプリへのAI組み込み (API)",
    description: "自社アプリやWebサービスにAI機能をAPI経由で組み込み。チャットボット、自動分類、レコメンドなど。",
    iconKey: "cpu", color: "#dc2626", bgColor: "#fef2f2",
    examples: ["チャットボット構築", "自動分類機能", "レコメンドAPI"],
  },
  {
    num: "08", title: "ドキュメント検索",
    description: "社内文書を横断検索。PDF・Word・Excel・Notionなどを跨いで必要な情報を瞬時に発見。",
    iconKey: "search", color: "#2563eb", bgColor: "#eff6ff",
    examples: ["社内文書の横断検索", "過去議事録の検索", "マニュアル検索"],
  },
  {
    num: "09", title: "メール・ビジネスコミュニケーション",
    description: "ビジネスメールのドラフト、返信提案、要件整理。適切なトーンと敬語で即座に文面作成。",
    iconKey: "mail", color: "#059669", bgColor: "#ecfdf5",
    examples: ["顧客メール作成", "クレーム対応文", "社内連絡の整理"],
  },
  {
    num: "10", title: "ワークフロー設計・最適化",
    description: "業務プロセスの可視化、ボトルネック特定、改善提案。既存フローの見直しと最適化をAIが支援。",
    iconKey: "workflow", color: "#7c3aed", bgColor: "#f5f3ff",
    examples: ["業務フロー分析", "改善提案", "プロセス可視化"],
  },
  {
    num: "11", title: "リアルタイムWeb検索",
    description: "最新のニュース、市場動向、技術トレンドをリアルタイムで検索・要約。常に最新情報をキャッチ。",
    iconKey: "refresh", color: "#dc2626", bgColor: "#fef2f2",
    examples: ["市場動向の調査", "競合情報の収集", "最新ニュース要約"],
  },
  {
    num: "12", title: "画像・動画生成",
    description: "テキストから画像を生成。バナー、イラスト、プレゼン素材、動画のサムネイルなどビジュアル制作を支援。",
    iconKey: "image", color: "#e11d48", bgColor: "#fff1f2",
    examples: ["バナー画像生成", "プレゼン素材", "SNS投稿画像"],
  },
  {
    num: "13", title: "音声認識・文字起こし",
    description: "会議録音や音声メモを自動で文字起こし。議事録化、要約、アクションアイテム抽出まで一貫対応。",
    iconKey: "mic", color: "#d97706", bgColor: "#fffbeb",
    examples: ["会議の自動文字起こし", "音声メモ変換", "多言語音声翻訳"],
  },

  /* ── 外部連携・ツール活用で広がる分野 ── */
  {
    num: "14", title: "チーム情報の集約・構造化・共有",
    description: "Slack、メール、議事録、ドキュメントに散在する情報を集紀・構造化し、チーム全体で共有可能に。",
    iconKey: "users", color: "#0891b2", bgColor: "#ecfeff",
    examples: ["ナレッジ集約", "情報の構造化", "チーム共有ダッシュボード"],
    tag: "連携で拡張",
  },
  {
    num: "15", title: "ワークフロー自動化基盤",
    description: "N8N・Make・Zapierなどの自動化ツールとAIを組み合わせ、複雑な業務フローを完全自動化。",
    iconKey: "zap", color: "#4f46e5", bgColor: "#eef2ff",
    examples: ["承認フロー自動化", "データ連携パイプライン", "通知の自動化"],
    tag: "連携で拡張",
  },
  {
    num: "16", title: "AI API（代替・併用）",
    description: "OpenAI、Google Gemini、Mistralなど複数のAI APIを用途に応じて使い分け・併用。最適なモデルを選択。",
    iconKey: "layers", color: "#7c3aed", bgColor: "#f5f3ff",
    examples: ["マルチモデル活用", "コスト最適化", "用途別API選定"],
    tag: "連携で拡張",
  },
  {
    num: "17", title: "外部サービス連携",
    description: "Slack通知、Gmail送信、カレンダー管理、スプレッドシート更新など外部APIと連携して業務を自動化。",
    iconKey: "link", color: "#0891b2", bgColor: "#ecfeff",
    examples: ["Slack通知の自動化", "API連携フロー", "SaaS間データ同期"],
    tag: "連携で拡張",
  },
  {
    num: "18", title: "アプリ作成",
    description: "社内ツール、ダッシュボード、業務アプリを自然言語の指示だけで構築。プログラミング不要。",
    iconKey: "smartphone", color: "#4f46e5", bgColor: "#eef2ff",
    examples: ["社内ポータル構築", "在庫管理ツール", "日報入力アプリ"],
    tag: "連携で拡張",
  },
  {
    num: "19", title: "UI・チラシなどのデザイン",
    description: "Webページ、ランディングページ、販促チラシ、バナー、SNS投稿画像のデザイン・実装。Canva等と連携。",
    iconKey: "layout", color: "#c026d3", bgColor: "#fdf4ff",
    examples: ["LP制作", "販促チラシ制作", "バナーデザイン"],
    tag: "連携で拡張",
  },
  {
    num: "20", title: "ファイル操作・把握",
    description: "PDF結合・分割、Excel集計、Word整形、フォルダ整理。大量ファイルの一括処理や内容把握も対応。",
    iconKey: "folder", color: "#ea580c", bgColor: "#fff7ed",
    examples: ["PDF結合・変換", "Excel一括集計", "ファイル自動整理"],
    tag: "連携で拡張",
  },
  {
    num: "21", title: "ナレッジベース構築",
    description: "社内文書・議事録・マニュアルからナレッジDBを構築。全社の情報資産を検索・活用可能に。",
    iconKey: "database", color: "#0d9488", bgColor: "#f0fdfa",
    examples: ["社内Wiki構築", "FAQ自動整備", "ノウハウの体系化"],
    tag: "連携で拡張",
  },
]

/* ───────────────────────── Data: 21 Use Cases ───────────────────────── */
const useCases: UseCase[] = [
  {
    id: "doc", category: "文章作成",
    title: "図面・仕様書の検索と要約",
    pain: "過去の図面を探すのに毎回30分以上かかる。英語の仕様書は読むだけで半日。",
    solution: "AIが社内文書を横断検索し、要約・翻訳を即座に実行。",
    claudeRole: "PDF・Wordの内容を瞬時に要約、英語仕様書を自然な日本語に翻訳、変更点を自動検出",
    tools: ["Notion", "NotebookLM"],
    impact: "検索時間 90%削減、翻訳コスト 80%削減",
    iconKey: "clipboard", color: "#2563eb", bgColor: "#eff6ff",
  },
  {
    id: "coding", category: "開発支援",
    title: "社内ツールの高速開発",
    pain: "簡単な社内ツールでも外注すると数ヶ月・数百万円。内製しようにもリソースが足りない。",
    solution: "AIがコード生成・レビュー・テストを支援し、開発速度を5倍に。",
    claudeRole: "要件からコード自動生成、バグの原因特定と修正案提示、テストコード自動生成",
    tools: ["GitHub Copilot", "Claude Code"],
    impact: "開発期間 80%短縮、外注コスト大幅削減",
    iconKey: "code", color: "#7c3aed", bgColor: "#f5f3ff",
  },
  {
    id: "translate", category: "翻訳",
    title: "海外取引先とのコミュニケーション効率化",
    pain: "英語メールの読み書きに時間がかかる。翻訳会社への依頼はコストと時間がかかりすぎる。",
    solution: "AIが技術用語を含む文書も自然に翻訳。リアルタイムで多言語対応。",
    claudeRole: "専門用語を含む技術文書の翻訳、ニュアンスを保ったメール翻訳、多言語FAQ生成",
    tools: ["DeepL", "Google Translate API"],
    impact: "翻訳時間 95%削減、翻訳コスト 90%削減",
    iconKey: "globe", color: "#0d9488", bgColor: "#f0fdfa",
  },
  {
    id: "data", category: "データ分析",
    title: "品質データの自動分析・レポート生成",
    pain: "検査データの集計に2時間、報告書作成にさらに3時間。毎週の繰り返し。",
    solution: "データ投入だけでAIが集計・分析・報告書ドラフトまで自動生成。",
    claudeRole: "CSVデータの分析・集計、不良原因の分析レポートをドラフト、顧客向け報告書のフォーマット整形",
    tools: ["ChatGPT (グラフ生成)", "Canva (デザイン)"],
    impact: "作成時間 5時間 → 30分、週20時間の削減",
    iconKey: "chart", color: "#059669", bgColor: "#ecfdf5",
  },
  {
    id: "browser", category: "PC自動化",
    title: "Webブラウザ操作の自動化",
    pain: "毎日同じサイトにログインしてデータをコピペする作業が1時間以上。ミスも多い。",
    solution: "AIがブラウザを操作し、データ取得・入力・転記を完全自動化。",
    claudeRole: "Webサイトからのデータ取得、フォーム自動入力、複数サイト間のデータ転記",
    tools: ["Claude Computer Use", "Playwright"],
    impact: "入力作業 100%自動化、ヒューマンエラー ゼロ",
    iconKey: "monitor", color: "#4f46e5", bgColor: "#eef2ff",
  },
  {
    id: "schedule", category: "定期実行",
    title: "日次・週次レポートの自動生成・配信",
    pain: "毎朝のKPIレポートを手動で作成して配信。担当者が休むと遅延する。",
    solution: "AIがスケジュールに従い自動でデータ収集→分析→レポート生成→Slack配信。",
    claudeRole: "データソースからの自動収集、KPI分析とレポート文面作成、異常値の自動アラート",
    tools: ["N8N", "Slack"],
    impact: "レポート作成 完全自動化、配信遅延ゼロ",
    iconKey: "repeat", color: "#d97706", bgColor: "#fffbeb",
  },
  {
    id: "api", category: "API活用",
    title: "自社アプリへのAIチャット機能組み込み",
    pain: "顧客からの問い合わせ対応にコストがかかる。FAQページでは解決できない質問が多い。",
    solution: "自社アプリにAIチャットボットをAPI経由で組み込み、24時間自動対応。",
    claudeRole: "自然言語での質問理解、ナレッジベースからの回答生成、エスカレーション判断",
    tools: ["Claude API", "Vercel"],
    impact: "問い合わせ対応コスト 60%削減、顧客満足度向上",
    iconKey: "cpu", color: "#dc2626", bgColor: "#fef2f2",
  },
  {
    id: "docsearch", category: "検索",
    title: "社内ナレッジの横断検索",
    pain: "情報がNotionやDrive、メールに散在。必要な情報を見つけるのに平均20分かかる。",
    solution: "AIが全ドキュメントを横断検索し、必要な情報を要約して即座に回答。",
    claudeRole: "複数ソースの横断検索、関連文書のランキング、要約つき回答生成",
    tools: ["NotebookLM", "Notion AI"],
    impact: "情報検索時間 90%削減、ナレッジ活用率向上",
    iconKey: "search", color: "#2563eb", bgColor: "#eff6ff",
  },
  {
    id: "email", category: "コミュニケーション",
    title: "ビジネスメールの自動ドラフト・分類",
    pain: "メール対応に1日2時間。重要なメールが埋もれて対応漏れが発生。",
    solution: "AIがメールを自動分類し、返信ドラフトを提案。重要メールは即座に通知。",
    claudeRole: "メールの優先度分類、返信文面のドラフト、要件の自動抽出・タスク化",
    tools: ["Gmail", "Slack"],
    impact: "メール処理時間 70%削減、対応漏れゼロ",
    iconKey: "mail", color: "#059669", bgColor: "#ecfdf5",
  },
  {
    id: "workflow", category: "業務設計",
    title: "業務プロセスの可視化と最適化",
    pain: "業務フローが属人化して全体像が見えない。非劷率なプロセスが放置されている。",
    solution: "AIが現行フローを分析し、ボトルネック特定と改善案を自動提案。",
    claudeRole: "業務フローのヒアリング・構造化、ボトルネック分析、改善プランの自動生成",
    tools: ["Miro", "Notion"],
    impact: "プロセス改善の期間 60%短縮",
    iconKey: "workflow", color: "#7c3aed", bgColor: "#f5f3ff",
  },
  {
    id: "websearch", category: "調査",
    title: "市場調査・競合分析の自動化",
    pain: "市場レポートの作成に3日かかる。手動での情報収集は漏れが多い。",
    solution: "AIがリアルタイムにWeb検索し、最新情報を収集・分析・レポート化。",
    claudeRole: "最新ニュース・論文の自動収集、競合動向の要約、市場トレンドレポート生成",
    tools: ["Perplexity", "Claude Web検索"],
    impact: "調査時間 3日 → 2時間、情報の殡度向上",
    iconKey: "refresh", color: "#dc2626", bgColor: "#fef2f2",
  },
  {
    id: "imagegen", category: "画像生成",
    title: "マーケティング素材の自動生成",
    pain: "バナーやSNS画像の作成をデザイナーに依頼すると1週間待ち。急な施策に対応できない。",
    solution: "AIでテキストからバナー・サムネイル・イラストを即座に生成。",
    claudeRole: "プロンプトからの画像生成指示、ブランドガイドに沿ったデザイン提案、バリエーション生成",
    tools: ["Midjourney", "DALL-E", "Canva"],
    impact: "素材制作時間 90%短縮、デザインコスト削減",
    iconKey: "image", color: "#e11d48", bgColor: "#fff1f2",
  },
  {
    id: "voice", category: "音声活用",
    title: "会議・現場音声の自動議事録化",
    pain: "会議の議事録俜は内容に集中できない。現場の口頭報告は記録に残らない。",
    solution: "録音するだけで文字起こし→要約→アクションアイテム抽出→Notionに自動保存。",
    claudeRole: "文字起こしテキストの整形・要約、アクションアイテムの自動抽出、議事録フォーマットへの変換",
    tools: ["Tipeless", "Notion"],
    impact: "議事録作成 自動化、情報共有のタイムラグ ゼロ",
    iconKey: "mic", color: "#d97706", bgColor: "#fffbeb",
  },
  {
    id: "team", category: "チーム共有",
    title: "チームナレッジの集約と構造化",
    pain: "情報がSlack・メール・議事録に分散。新メンバーのオンボーディングに1ヶ月かかる。",
    solution: "AIが各チャネルの情報を自動集約・構造化し、検索可能なナレッジに変換。",
    claudeRole: "Slack・メールの重要情報抽出、情報の分類・構造化、オンボーディング資料の自動生成",
    tools: ["Slack", "Notion", "NotebookLM"],
    impact: "オンボーディング期間 60%短縮、情報共有率向上",
    iconKey: "users", color: "#0891b2", bgColor: "#ecfeff",
  },
  {
    id: "automation", category: "自動化基盤",
    title: "承認フロー・通知の完全自動化",
    pain: "経費精算の承認に3日かかる。承認状況の確認で何度もメール。",
    solution: "N8N + AIで承認フロー全体を自動化。申請→チェック→承認→通知をワンストップ。",
    claudeRole: "申請内容の自動チェック、承認基準との照合、異常値の検出とアラート",
    tools: ["N8N", "Slack", "Google Sheets"],
    impact: "承認リードタイム 80%短縮、手動チェック不要",
    iconKey: "zap", color: "#4f46e5", bgColor: "#eef2ff",
  },
  {
    id: "multimodel", category: "AI API",
    title: "用途別のAIモデル使い分け",
    pain: "1つのAIだけでは全ての業務に最適ではない。コストと品質のバランスが難しい。",
    solution: "用途に応じてClaude・GPT・Geminiなど複数モデルを使い分け、最適なコスト・品質を実現。",
    claudeRole: "タスク分析と最適モデルの選定、APIルーティングの設計、コスト最適化の提案",
    tools: ["Claude API", "OpenAI API", "Gemini API"],
    impact: "AI活用コスト 40%削減、タスク適合度向上",
    iconKey: "layers", color: "#7c3aed", bgColor: "#f5f3ff",
  },
  {
    id: "integration", category: "サービス連携",
    title: "SaaS間のデータ連携自動化",
    pain: "営業データをCRMからスプシに手動転記。月末の集計は丸1日がかり。",
    solution: "AIがSaaS間のデータを自動連携。転記・集計・レポートまでノーコードで実現。",
    claudeRole: "API連携フローの設計、データ変換ルールの生成、異常データの検出・通知",
    tools: ["N8N", "Zapier", "Google Sheets"],
    impact: "データ転記 100%自動化、集計時間 90%削減",
    iconKey: "link", color: "#0891b2", bgColor: "#ecfeff",
  },
  {
    id: "appbuild", category: "アプリ作成",
    title: "ノーコードで社内業務アプリ構築",
    pain: "現場から「こんなツールが欲しい」と要望があっても、IT部門の対応待ちで数ヶ月。",
    solution: "AIに自然言語で指示するだけで業務アプリを構築。プログラミング不要。",
    claudeRole: "要件の整理・設計、アプリコードの自動生成、UIデザインの提案",
    tools: ["Claude Artifacts", "Vercel", "Supabase"],
    impact: "アプリ構築 数ヶ月 → 数日、IT部門の負荷軽減",
    iconKey: "smartphone", color: "#4f46e5", bgColor: "#eef2ff",
  },
  {
    id: "design", category: "デザイン",
    title: "販促チラシ・Webページのデザイン",
    pain: "デザイナーへの外注は高額で、納品まで2週間。ちょっとした修正にも時間がかかる。",
    solution: "AIがデザイン案を即座に生成。Canvaと連携して高品質なチラシ・LPを内製化。",
    claudeRole: "デザインコンセプトの提案、HTML/CSSコードの自動生成、レスポンシブ対応",
    tools: ["Canva", "Figma", "Claude Artifacts"],
    impact: "デザイン制作時間 85%短縮、外注コスト大幅削減",
    iconKey: "layout", color: "#c026d3", bgColor: "#fdf4ff",
  },
  {
    id: "fileops", category: "ファイル操作",
    title: "大量ファイルの一括処理・整理",
    pain: "月末に数百枚のPDFを結合・リネーム。Excelファイルの集計も手作業で丸2日。",
    solution: "AIがファイルの一括結合・分割・リネーム・集計を自動処理。",
    claudeRole: "PDF結合・分割の自動実行、Excel一括集計・フォーマット変換、フォルダ構造の自動整理",
    tools: ["Claude Desktop", "Python"],
    impact: "ファイル処理時間 95%削減、手作業ミス ゼロ",
    iconKey: "folder", color: "#ea580c", bgColor: "#fff7ed",
  },
  {
    id: "knowledge", category: "ナレッジ",
    title: "社内ナレッジベースの構築と運用",
    pain: "退職者のノウハウが消失。同じ質問が繰り返されるが、回答がどこにもまとまっていない。",
    solution: "AIが社内文書・議事録からナレッジDBを自動構築。質問に即座に回答。",
    claudeRole: "文書からのナレッジ抽出・分類、FAQの自動生成・更新、質問応答チャットボット",
    tools: ["NotebookLM", "Notion", "Supabase"],
    impact: "ナレッジ検索時間 90%削減、ノウハウ消失の防止",
    iconKey: "database", color: "#0d9488", bgColor: "#f0fdfa",
  },
]

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

          {/* ─── Section 1: AIができること ─── */}
          <Section id="capabilities">
            <div style={{ paddingTop: 48 }}>
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                style={{ marginBottom: 8 }}
              >
                <span style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  padding: "4px 12px", borderRadius: 100,
                  background: "var(--color-bg-muted)", border: "1px solid var(--color-border)",
                  fontSize: 12, fontWeight: 500, color: "var(--color-text-muted)",
                }}>
                  <Icon d={icons.sparkle} size={14} color="var(--color-primary)" />
                  社内検討資料
                </span>
              </motion.div>
              <h2 style={{ fontSize: 26, fontWeight: 700, marginBottom: 8 }}>AIができること</h2>
              <p style={{ fontSize: 14, color: "var(--color-text-muted)", marginBottom: 12 }}>
                AIが得意な13分野と、外部サービス連携で実現する8分野。合計21の業務領域をカバーします。
              </p>
            </div>

            {/* Sub-header: AI得意分野 */}
            <div style={{
              display: "flex", alignItems: "center", gap: 8, marginBottom: 16, marginTop: 24,
            }}>
              <span style={{
                padding: "3px 10px", borderRadius: 100,
                background: "#eff6ff", border: "1px solid #bfdbfe",
                fontSize: 12, fontWeight: 600, color: "#2563eb",
              }}>
                AI得意分量
              </span>
              <span style={{ fontSize: 13, color: "var(--color-text-muted)" }}>
                — テキスト・分析・生成・操作が中心の13領域
              </span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
              {capabilities.slice(0, 13).map((cap, i) => (
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

            {/* Sub-header: 連携で拡張する8分野 */}
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
                — 外部サービスやツールとの組み合わせで実現する8᠘域
              </span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
              {capabilities.slice(13).map((cap, i) => (
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
                                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
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
