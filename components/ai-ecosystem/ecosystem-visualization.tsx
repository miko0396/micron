"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ServiceDetailModal } from "./service-detail-modal"

export interface ServiceInfo {
  name: string
  description: string
  pricing: string
  freeTier: string | null
  url: string
}

/* ─────── Claude ができること (Blue) ─────── */
const claudeCapabilities = [
  {
    title: "文章作成・要約・レポート",
    desc: "プロ品質のビジネス文書、議事録要約、レポート作成を瞬時に生成",
    examples: ["報告書・提案書", "メール文面", "議事録要約", "プレスリリース"],
  },
  {
    title: "コーディング・開発支援",
    desc: "フルスタック開発、デバッグ、コードレビュー、リファクタリング",
    examples: ["Webアプリ構築", "バグ修正", "テスト生成", "API設計"],
  },
  {
    title: "翻訳・多言語対応",
    desc: "100以上の言語に対応。ニュアンスを保った自然な翻訳",
    examples: ["技術文書翻訳", "UI多言語化", "メール翻訳", "マニュアル翻訳"],
  },
  {
    title: "データ分析・構造化",
    desc: "CSV/Excel解析、統計処理、データの可視化コード生成",
    examples: ["売上分析", "グラフ生成", "異常値検出", "KPIレポート"],
  },
  {
    title: "ブラウザ・PC操作自動化",
    desc: "Computer Use機能で画面操作を自動化。クリック、入力、ログインを代行",
    examples: ["フォーム入力", "Web操作自動化", "スクレイピング", "画面操作代行"],
  },
  {
    title: "定期実行・スケジュール実行",
    desc: "タスクの定期自動実行、トリガーベースの処理、バッチ処理",
    examples: ["日次レポート", "定期チェック", "自動通知", "バッチ処理"],
  },
  {
    title: "アプリへのAI組み込み (API)",
    desc: "Claude API / Ollama / Gemini で社内ツールにAIを統合",
    examples: ["チャットボット", "社内検索AI", "自動分類", "レコメンド"],
  },
  {
    title: "ドキュメント検索・ナレッジ",
    desc: "PDF、仕様書、マニュアルから情報を高速検索・抽出",
    examples: ["仕様書検索", "FAQ自動応答", "社内Wiki検索", "契約書分析"],
  },
  {
    title: "メール・ビジネスコミュニケーション",
    desc: "メール自動作成、返信案生成、ビジネス文書のトーン調整",
    examples: ["返信下書き", "お詫びメール", "営業メール", "社内連絡"],
  },
  {
    title: "ワークフロー設計・最適化",
    desc: "業務フローの分析、ボトルネック特定、自動化戦略の立案",
    examples: ["業務分析", "フロー設計", "条件分岐", "自動化ルール"],
  },
]

/* ─────── 苦手を補完するサービス (Red) ─────── */
const complementServices = [
  {
    title: "リアルタイムWeb検索",
    desc: "最新ニュース・時事情報のリアルタイム取得",
    services: [
      {
        name: "Perplexity",
        description: "AI検索エンジン。リアルタイムでWeb検索を行い、信頼性の高いソースを引用しながら回答を生成。最新のニュースや研究データにアクセス可能。",
        pricing: "Pro: $20/月",
        freeTier: "無料プランあり：1日5回のPro検索、基本検索は無制限",
        url: "https://perplexity.ai",
      },
    ],
  },
  {
    title: "画像・動画生成",
    desc: "ビジュアルコンテンツの直接生成・編集",
    services: [
      {
        name: "Canva",
        description: "テンプレートベースのデザインツール。AI画像生成、背景削除、動画編集機能も搭載。",
        pricing: "Pro: $12.99/月",
        freeTier: "無料プランあり：基本機能、限定テンプレート",
        url: "https://canva.com",
      },
      {
        name: "Adobe",
        description: "Photoshop、Illustrator等にAI機能(Firefly)を統合。商用利用可能な生成AI。",
        pricing: "Creative Cloud: $54.99/月〜",
        freeTier: "7日間無料トライアル",
        url: "https://adobe.com",
      },
    ],
  },
  {
    title: "音声認識・文字起こし",
    desc: "リアルタイム音声入力と話者識別",
    services: [
      {
        name: "Tipeless",
        description: "音声入力特化のAIツール。現場での音声をリアルタイムで文字起こしし、日報・議事録・報告書を自動生成。",
        pricing: "要問い合わせ",
        freeTier: "トライアルあり",
        url: "https://tipeless.com",
      },
    ],
  },
  {
    title: "ナレッジベース・Wiki",
    desc: "チーム情報の集約・構造化・共有",
    services: [
      {
        name: "Notion",
        description: "ドキュメント、データベース、Wiki、プロジェクト管理を統合。AI機能で要約や文章生成も可能。",
        pricing: "Plus: $10/月",
        freeTier: "無料プランあり：個人利用無制限",
        url: "https://notion.so",
      },
      {
        name: "NotebookLM",
        description: "Googleの研究支援AI。PDFをアップロードし、質問応答、要約、ポッドキャスト音声生成が可能。",
        pricing: "完全無料",
        freeTier: "全機能無料。Googleアカウントが必要",
        url: "https://notebooklm.google.com",
      },
    ],
  },
  {
    title: "ワークフロー自動化基盤",
    desc: "外部トリガー連携・永続バックグラウンド処理",
    services: [
      {
        name: "N8N",
        description: "セルフホスト可能なワークフロー自動化。400以上のノードでカスタムコード実行も可能。",
        pricing: "Cloud: €20/月〜",
        freeTier: "セルフホスト版は完全無料",
        url: "https://n8n.io",
      },
    ],
  },
  {
    title: "AI API（代替・併用）",
    desc: "用途に応じて使い分けるAI API群",
    services: [
      {
        name: "Ollama",
        description: "ローカルで動作するオープンソースLLM実行環境。Llama、Mistral等のモデルをプライベート環境で実行可能。データを外部に送信しない。",
        pricing: "完全無料（オープンソース）",
        freeTier: "全機能無料。ローカルGPU推奨",
        url: "https://ollama.com",
      },
      {
        name: "Gemini",
        description: "Google DeepMindのマルチモーダルAI。テキスト・画像・動画・音声を統合的に処理。Google Workspace連携が強力。",
        pricing: "Gemini Advanced: $19.99/月（Google One AI Premium）",
        freeTier: "無料プランあり：Gemini 1.5 Flash利用可能",
        url: "https://gemini.google.com",
      },
    ],
  },
]

/* ─────── SVG Icons ─────── */
const icons: Record<string, string> = {
  check: "M20 6L9 17l-5-5",
  sparkle: "M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8z",
  tool: "M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z",
  link: "M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71",
  chevronRight: "M9 18l6-6-6-6",
  external: "M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3",
}

function Icon({ d, size = 16, color = "currentColor" }: { d: string; size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  )
}

export function EcosystemVisualization() {
  const [selectedService, setSelectedService] = useState<ServiceInfo | null>(null)
  const [hoveredCap, setHoveredCap] = useState<number | null>(null)
  const [hoveredComp, setHoveredComp] = useState<number | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => { setIsLoaded(true) }, [])

  return (
    <div className="relative w-full min-h-screen overflow-hidden" style={{ background: "#f8fafc" }}>
      {/* Subtle grid background */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.02) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Blue gradient accent - more prominent */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse at 25% 30%, rgba(37,99,235,0.06) 0%, transparent 60%),
            radial-gradient(ellipse at 75% 70%, rgba(244,63,94,0.04) 0%, transparent 50%)
          `,
        }}
      />

      {/* Header */}
      {isLoaded && (
        <motion.div
          className="relative z-10 text-center pt-10 pb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h1 style={{ fontSize: 32, fontWeight: 800, color: "#1e293b", marginBottom: 6 }}>
            AI Ecosystem Map
          </h1>
          <p style={{ fontSize: 14, color: "#64748b" }}>
            Claude を中心としたAI活用 — できることの全体像
          </p>
        </motion.div>
      )}

      {/* Main two-column layout */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px 64px", position: "relative", zIndex: 1 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 0, alignItems: "start" }}>

          {/* ─── LEFT: Claude Capabilities (BLUE) ─── */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={isLoaded ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.3, duration: 0.5 }}
              style={{
                display: "flex", alignItems: "center", gap: 10, marginBottom: 20, padding: "0 8px",
              }}
            >
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#2563eb" }} />
              <span style={{ fontSize: 13, fontWeight: 700, color: "#2563eb", letterSpacing: 1, textTransform: "uppercase" }}>
                Claude ができること
              </span>
              <span style={{ fontSize: 11, color: "#94a3b8", marginLeft: 4 }}>
                {claudeCapabilities.length} 分野
              </span>
            </motion.div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {claudeCapabilities.map((cap, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -30 }}
                  animate={isLoaded ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.3 + i * 0.06, duration: 0.4 }}
                  onMouseEnter={() => setHoveredCap(i)}
                  onMouseLeave={() => setHoveredCap(null)}
                  style={{
                    background: hoveredCap === i ? "#eff6ff" : "white",
                    border: hoveredCap === i ? "1.5px solid #2563eb" : "1.5px solid #e2e8f0",
                    borderRadius: 12,
                    padding: "14px 18px",
                    cursor: "default",
                    transition: "all 200ms ease",
                    boxShadow: hoveredCap === i
                      ? "0 4px 20px rgba(37,99,235,0.12)"
                      : "0 1px 3px rgba(0,0,0,0.04)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: 8,
                      background: "linear-gradient(135deg, #2563eb, #3b82f6)",
                      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                    }}>
                      <Icon d={icons.check} size={14} color="white" />
                    </div>
                    <span style={{ fontSize: 14, fontWeight: 650, color: "#1e293b" }}>
                      {cap.title}
                    </span>
                  </div>
                  <p style={{ fontSize: 12, color: "#64748b", lineHeight: 1.5, marginBottom: 8, paddingLeft: 38 }}>
                    {cap.desc}
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 5, paddingLeft: 38 }}>
                    {cap.examples.map((ex, j) => (
                      <span
                        key={j}
                        style={{
                          fontSize: 10, fontWeight: 500, padding: "2px 8px", borderRadius: 100,
                          background: "#dbeafe", color: "#1d4ed8", border: "1px solid #bfdbfe",
                        }}
                      >
                        {ex}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* ─── CENTER: Claude Orb ─── */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "60px 24px 0", position: "sticky", top: 80 }}>
            {isLoaded && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.4 }}
                style={{ position: "relative", width: 100, height: 100, marginBottom: 16 }}
              >
                {/* Glow */}
                <motion.div
                  style={{
                    position: "absolute", inset: -12, borderRadius: "50%",
                    background: "radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)",
                  }}
                  animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                />
                {/* Rotating ring */}
                <motion.div
                  style={{
                    position: "absolute", inset: -4, borderRadius: "50%",
                    border: "2px dashed rgba(99,102,241,0.3)",
                  }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                />
                {/* Core */}
                <motion.div
                  style={{
                    width: 100, height: 100, borderRadius: "50%",
                    background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)",
                    boxShadow: "0 8px 30px rgba(99,102,241,0.3)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                  animate={{ scale: [1, 1.03, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <span style={{ fontSize: 14, fontWeight: 700, color: "white", letterSpacing: 1 }}>Claude</span>
                </motion.div>
              </motion.div>
            )}

            {/* Connector lines */}
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 8 }}>
              <div style={{ width: 40, height: 2, background: "linear-gradient(to left, transparent, #2563eb)", borderRadius: 2 }} />
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#6366f1" }} />
              <div style={{ width: 40, height: 2, background: "linear-gradient(to right, transparent, #e11d48)", borderRadius: 2 }} />
            </div>

            {/* Legend */}
            <div style={{ marginTop: 24, textAlign: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#2563eb" }} />
                <span style={{ fontSize: 11, color: "#475569", fontWeight: 500 }}>Claude Native</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#e11d48" }} />
                <span style={{ fontSize: 11, color: "#475569", fontWeight: 500 }}>苦手を補完</span>
              </div>
            </div>
          </div>

          {/* ─── RIGHT: Complement Services (RED) ─── */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={isLoaded ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.3, duration: 0.5 }}
              style={{
                display: "flex", alignItems: "center", gap: 10, marginBottom: 20, padding: "0 8px",
              }}
            >
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#e11d48" }} />
              <span style={{ fontSize: 13, fontWeight: 700, color: "#e11d48", letterSpacing: 1, textTransform: "uppercase" }}>
                苦手を補完
              </span>
              <span style={{ fontSize: 11, color: "#94a3b8", marginLeft: 4 }}>
                {complementServices.length} 分野
              </span>
            </motion.div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {complementServices.map((comp, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 30 }}
                  animate={isLoaded ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.4 + i * 0.08, duration: 0.4 }}
                  onMouseEnter={() => setHoveredComp(i)}
                  onMouseLeave={() => setHoveredComp(null)}
                  style={{
                    background: hoveredComp === i ? "#fff1f2" : "white",
                    border: hoveredComp === i ? "1.5px solid #e11d48" : "1.5px solid #e2e8f0",
                    borderRadius: 12,
                    padding: "14px 18px",
                    transition: "all 200ms ease",
                    boxShadow: hoveredComp === i
                      ? "0 4px 20px rgba(225,29,72,0.1)"
                      : "0 1px 3px rgba(0,0,0,0.04)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: 8,
                      background: "linear-gradient(135deg, #e11d48, #f43f5e)",
                      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                    }}>
                      <Icon d={icons.tool} size={13} color="white" />
                    </div>
                    <span style={{ fontSize: 14, fontWeight: 650, color: "#1e293b" }}>
                      {comp.title}
                    </span>
                  </div>
                  <p style={{ fontSize: 12, color: "#64748b", lineHeight: 1.5, marginBottom: 10, paddingLeft: 38 }}>
                    {comp.desc}
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6, paddingLeft: 38 }}>
                    {comp.services.map((service, j) => (
                      <button
                        key={j}
                        onClick={() => setSelectedService(service)}
                        style={{
                          display: "flex", alignItems: "center", gap: 8,
                          padding: "8px 12px", borderRadius: 10,
                          background: "#fef2f2", border: "1px solid #fecdd3",
                          cursor: "pointer", textAlign: "left", transition: "all 150ms ease",
                          width: "100%",
                        }}
                        onMouseOver={e => {
                          (e.currentTarget as HTMLButtonElement).style.background = "#fee2e2";
                          (e.currentTarget as HTMLButtonElement).style.borderColor = "#fca5a5";
                        }}
                        onMouseOut={e => {
                          (e.currentTarget as HTMLButtonElement).style.background = "#fef2f2";
                          (e.currentTarget as HTMLButtonElement).style.borderColor = "#fecdd3";
                        }}
                      >
                        <div style={{
                          width: 32, height: 32, borderRadius: 8,
                          background: "#e11d48", display: "flex", alignItems: "center", justifyContent: "center",
                          color: "white", fontSize: 11, fontWeight: 700, flexShrink: 0,
                        }}>
                          {service.name.slice(0, 2)}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontSize: 12, fontWeight: 600, color: "#1e293b" }}>{service.name}</p>
                          <p style={{ fontSize: 10, color: "#94a3b8" }}>
                            {service.freeTier ? "無料枠あり" : "有料"}
                          </p>
                        </div>
                        <Icon d={icons.external} size={12} color="#cbd5e1" />
                      </button>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom note */}
        {isLoaded && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.5 }}
            style={{
              textAlign: "center", marginTop: 48, padding: "16px 24px",
              background: "white", borderRadius: 12, border: "1px solid #e2e8f0",
              maxWidth: 600, margin: "48px auto 0",
            }}
          >
            <p style={{ fontSize: 12, color: "#64748b" }}>
              サービス名をクリックすると料金・詳細を確認できます
            </p>
          </motion.div>
        )}
      </div>

      {/* Service Detail Modal */}
      <AnimatePresence>
        {selectedService && (
          <ServiceDetailModal
            service={selectedService}
            onClose={() => setSelectedService(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
