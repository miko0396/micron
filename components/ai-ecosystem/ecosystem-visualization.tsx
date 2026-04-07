"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ClaudeOrb } from "./claude-orb"
import { SatelliteNode, type NodeData } from "./satellite-node"
import { OrbitLines } from "./orbit-lines"
import { ServiceDetailModal } from "./service-detail-modal"
import { SidebarDetailPanel } from "./sidebar-detail-panel"

export interface ServiceInfo {
  name: string
  description: string
  pricing: string
  freeTier: string | null
  url: string
}

const nodes: NodeData[] = [
  {
    id: 1,
    title: "情報処理・知識活用",
    services: [
      {
        name: "Perplexity",
        description: "AI検索エンジン。リアルタイムでWeb検索を行い、信頼性の高いソースを引用しながら回答を生成。最新のニュースや研究データにアクセス可能。",
        pricing: "Pro: $20/月 (GPT-4, Claude対応、無制限Pro検索)",
        freeTier: "無料プランあり：1日5回のPro検索、基本検索は無制限",
        url: "https://perplexity.ai",
      },
      {
        name: "NotebookLM",
        description: "Googleの研究支援AI。PDFやドキュメントをアップロードし、その内容に基づいた質問応答、要約、ポッドキャスト音声生成が可能。",
        pricing: "完全無料（Google Labsの実験プロジェクト）",
        freeTier: "全機能無料で利用可能。Googleアカウントが必要",
        url: "https://notebooklm.google.com",
      },
    ],
    isComplement: true,
    claudeStrengths: [
      "深い文脈理解と論理的思考",
      "複雑な概念の分かりやすい説明",
      "多角的な視点からの分析",
    ],
    claudeWeaknesses: [
      "リアルタイムのWeb検索ができない",
      "最新ニュースや時事情報を把握できない",
      "情報のソースURLを提示できない",
    ],
  },
  {
    id: 2,
    title: "制作・アウトプット生成",
    services: [
      {
        name: "ChatGPT",
        description: "OpenAIの対話型AI。テキスト生成、コード作成、画像生成（DALL-E）、データ分析などマルチモーダルな機能を提供。プラグインで機能拡張可能。",
        pricing: "Plus: $20/月, Team: $25/月/人, Enterprise: 要問合せ",
        freeTier: "無料プランあり：GPT-3.5無制限、GPT-4は制限付き",
        url: "https://chat.openai.com",
      },
      {
        name: "Canva",
        description: "オンラインデザインツール。テンプレートベースで誰でも簡単にプロ品質のデザインを作成。AI画像生成、背景削除、動画編集機能も搭載。",
        pricing: "Pro: $12.99/月, Teams: $14.99/月/人",
        freeTier: "無料プランあり：基本機能、限定テンプレート、5GBストレージ",
        url: "https://canva.com",
      },
      {
        name: "Adobe",
        description: "クリエイティブソフトウェアの業界標準。Photoshop、Illustrator、Premiere ProにAI機能（Firefly）を統合。商用利用可能な生成AI。",
        pricing: "Creative Cloud: $54.99/月〜、単体アプリ: $22.99/月〜",
        freeTier: "7日間無料トライアル、Firefly単体は月25クレジット無料",
        url: "https://adobe.com",
      },
    ],
    isComplement: true,
    claudeStrengths: [
      "クリエイティブブリーフの作成",
      "コピーライティング",
      "ストーリーテリング",
    ],
    claudeWeaknesses: [
      "画像・動画の生成ができない",
      "ビジュアルデザインの直接作成",
      "フォントやレイアウトの視覚的調整",
    ],
  },
  {
    id: 3,
    title: "外部サービス連携",
    services: [
      {
        name: "Notion",
        description: "オールインワンのワークスペース。ドキュメント、データベース、Wiki、プロジェクト管理を統合。AI機能で要約や文章生成も可能。",
        pricing: "Plus: $10/月, Business: $15/月",
        freeTier: "無料プランあり：個人利用無制限、ゲスト10人まで",
        url: "https://notion.so",
      },
      {
        name: "Canva",
        description: "オンラインデザインツール。テンプレートベースで誰でも簡単にプロ品質のデザインを作成。AI画像生成、背景削除、動画編集機能も搭載。",
        pricing: "Pro: $12.99/月, Teams: $14.99/月/人",
        freeTier: "無料プランあり：基本機能、限定テンプレート、5GBストレージ",
        url: "https://canva.com",
      },
      {
        name: "Gmail",
        description: "Googleの無料メールサービス。15GBの無料ストレージ、強力なスパムフィルター、Google Workspaceとの統合。Gemini AIによるメール作成支援も。",
        pricing: "Google Workspace: $6/月/人〜",
        freeTier: "個人利用は完全無料：15GBストレージ、基本機能すべて",
        url: "https://gmail.com",
      },
    ],
    isComplement: true,
    claudeStrengths: [
      "APIドキュメントの理解",
      "連携フローの設計",
      "エラーハンドリング提案",
    ],
    claudeWeaknesses: [
      "直接外部サービスを操作できない",
      "OAuth認証フローの実行",
      "リアルタイムデータ同期",
    ],
  },
  {
    id: 4,
    title: "ブラウザ・PC操作自動化",
    services: [],
    isComplement: false,
    claudeStrengths: [
      "Computer Use機能による画面操作",
      "ブラウザ自動化スクリプト生成",
      "エラー検出と自己修正",
      "複雑なPC操作を自然言語で指示",
    ],
    claudeWeaknesses: [
      "（この領域はClaude単体でほぼ完結）",
    ],
  },
  {
    id: 5,
    title: "タスク自動化・エージェント",
    services: [
      {
        name: "N8N",
        description: "セルフホスト可能なワークフロー自動化。400以上のノードでカスタムコード実行も可能。データプライバシーを重視する企業に人気。",
        pricing: "Cloud: €20/月〜、Self-hosted: 無料",
        freeTier: "セルフホスト版は完全無料、Cloud版は14日間トライアル",
        url: "https://n8n.io",
      },
    ],
    isComplement: true,
    claudeStrengths: [
      "ワークフロー設計の最適化",
      "条件分岐ロジックの構築",
      "自然言語からの自動化ルール生成",
    ],
    claudeWeaknesses: [
      "定期実行・スケジュール実行",
      "外部トリガーによる自動起動",
      "永続的なバックグラウンド処理",
    ],
  },
  {
    id: 6,
    title: "アプリ組み込み",
    services: [
      {
        name: "Claude API",
        description: "Anthropicの公式API。200Kトークンの長いコンテキスト、優れたコード生成能力、安全性を重視した設計。構造化出力にも対応。",
        pricing: "Claude 3 Opus: $15/$75 (入力/出力 per 1M tokens), Sonnet: $3/$15, Haiku: $0.25/$1.25",
        freeTier: "新規登録で$5のクレジット付与",
        url: "https://anthropic.com/api",
      },
      {
        name: "Gemini API",
        description: "Googleのマルチモーダ���AI。テキスト、画像、動画、音声を統合的に処理。100万トークンのコンテキストウィンドウ。",
        pricing: "Gemini Pro: 無料〜$7/$21 per 1M tokens (使用量による)",
        freeTier: "無料枠あり：60 RPM、32K TPM",
        url: "https://ai.google.dev",
      },
      {
        name: "ChatGPT API",
        description: "OpenAIのAPI。GPT-4、DALL-E、Whisperなど多数のモデルにアクセス。Function calling、JSON mode、ファインチューニングに対応。",
        pricing: "GPT-4 Turbo: $10/$30 per 1M tokens, GPT-3.5: $0.50/$1.50",
        freeTier: "新規登録で$5のクレジット付与（3ヶ月有効）",
        url: "https://openai.com/api",
      },
    ],
    isComplement: false,
    claudeStrengths: [
      "200Kトークンの長文コンテキスト",
      "高度なコード生成能力",
      "構造化出力 (JSON, XML)",
    ],
    claudeWeaknesses: [
      "（競合APIと比較して）画像生成なし",
      "音声合成・音声認識なし",
      "リアルタイム検索機能なし",
    ],
  },
  {
    id: 7,
    title: "音声入力・議事録",
    services: [
      {
        name: "Tl;dv",
        description: "AI会議アシスタント。Zoom、Google Meet、Microsoft Teamsの会議を自動録画・文字起こし。要約やアクションアイテムを自動抽出。30以上の言語に対応。",
        pricing: "Pro: $20/月, Business: $59/月",
        freeTier: "無料プランあり：無制限の録画・文字起こし、AI要約機能付き",
        url: "https://tldv.io",
      },
    ],
    isComplement: true,
    claudeStrengths: [
      "議事録の構造化と要約",
      "アクションアイテム抽出",
      "フォローアップメール生成",
    ],
    claudeWeaknesses: [
      "音声の直接認識・文字起こし",
      "リアルタイム会議参加",
      "話者識別・タイムスタンプ付与",
    ],
  },
]

export function EcosystemVisualization() {
  const [selectedNode, setSelectedNode] = useState<NodeData | null>(null)
  const [selectedService, setSelectedService] = useState<ServiceInfo | null>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }
    updateDimensions()
    setIsLoaded(true)
    window.addEventListener("resize", updateDimensions)
    return () => window.removeEventListener("resize", updateDimensions)
  }, [])

  // Adjust radius based on whether sidebar is open
  const baseRadius = Math.min(dimensions.width * 0.65, dimensions.height) * 0.32
  const radius = selectedNode ? baseRadius * 0.85 : baseRadius

  const handleServiceClick = (service: ServiceInfo) => {
    setSelectedService(service)
  }

  const handleNodeSelect = (node: NodeData) => {
    setSelectedNode(selectedNode?.id === node.id ? null : node)
  }

  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-neutral-50">
      {/* Subtle grid background */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Soft gradient accents */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse at 20% 20%, rgba(99,102,241,0.05) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 80%, rgba(244,63,94,0.05) 0%, transparent 50%)
          `,
        }}
      />

      {/* Title */}
      <motion.div
        className="absolute top-8 left-0 right-0 text-center z-20"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <h1 className="text-3xl md:text-4xl font-bold text-neutral-800 mb-2">
          AI Ecosystem Map
        </h1>
        <p className="text-neutral-500 text-sm md:text-base">
          Claude を中心としたAIツール連携マップ
        </p>
      </motion.div>

      {/* Legend */}
      <motion.div
        className="absolute bottom-8 left-8 z-20 flex flex-col gap-2 bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-sm border border-neutral-200"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-indigo-500" />
          <span className="text-xs text-neutral-600">Claude Native</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-rose-500" />
          <span className="text-xs text-neutral-600">苦手を補完</span>
        </div>
      </motion.div>

      {/* Main visualization container */}
      {isLoaded && (
        <motion.div 
          className="absolute inset-0 flex items-center justify-center"
          animate={{
            x: selectedNode ? -160 : 0,
          }}
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
        >
          {/* Orbit lines SVG layer */}
          <OrbitLines nodes={nodes} radius={radius} selectedNode={selectedNode} />

          {/* Center Claude orb */}
          <motion.div
            className="absolute z-30"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 20,
              delay: 0.2,
            }}
          >
            <ClaudeOrb />
          </motion.div>

          {/* Satellite nodes */}
          {nodes.map((node, index) => {
            const angle = (index * 2 * Math.PI) / nodes.length - Math.PI / 2
            return (
              <SatelliteNode
                key={node.id}
                node={node}
                angle={angle}
                radius={radius}
                index={index}
                onSelect={handleNodeSelect}
                isSelected={selectedNode?.id === node.id}
                onServiceClick={handleServiceClick}
              />
            )
          })}
        </motion.div>
      )}

      {/* Instructions */}
      <motion.div
        className="absolute bottom-8 right-8 z-20 text-right bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-sm border border-neutral-200"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <p className="text-xs text-neutral-500">ノードをクリックして詳細を表示</p>
        <p className="text-xs text-neutral-400">サービス名クリックで料金確認</p>
      </motion.div>

      {/* Sidebar Detail Panel */}
      <AnimatePresence>
        {selectedNode && (
          <SidebarDetailPanel
            node={selectedNode}
            onClose={() => setSelectedNode(null)}
            onServiceClick={handleServiceClick}
          />
        )}
      </AnimatePresence>

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
