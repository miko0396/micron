"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence, useInView } from "framer-motion"
import { ChevronDown, ChevronUp, Sparkles, AlertTriangle, ExternalLink, Check } from "lucide-react"

interface ServiceInfo {
  name: string
  description: string
  pricing: string
  freeTier: string | null
  url: string
}

interface CategoryData {
  id: number
  title: string
  isComplement: boolean
  claudeStrengths: string[]
  claudeWeaknesses: string[]
  services: ServiceInfo[]
}

const categories: CategoryData[] = [
  {
    id: 1,
    title: "情報処理・知識活用",
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
    services: [
      {
        name: "Perplexity",
        description: "AI検索エンジン。リアルタイムでWeb検索を行い、信頼性の高いソースを引用しながら回答を生成。",
        pricing: "Pro: $20/月",
        freeTier: "無料プランあり：1日5回のPro検索",
        url: "https://perplexity.ai",
      },
      {
        name: "NotebookLM",
        description: "Googleの研究支援AI。PDFやドキュメントをアップロードし、その内容に基づいた質問応答が可能。",
        pricing: "完全無料",
        freeTier: "全機能無料で利用可能",
        url: "https://notebooklm.google.com",
      },
    ],
  },
  {
    id: 2,
    title: "制作・アウトプット生成",
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
    services: [
      {
        name: "ChatGPT",
        description: "テキスト生成、コード作成、画像生成（DALL-E）などマルチモーダルな機能を提供。",
        pricing: "Plus: $20/月",
        freeTier: "無料プランあり：GPT-3.5無制限",
        url: "https://chat.openai.com",
      },
      {
        name: "Canva",
        description: "テンプレートベースで誰でも簡単にプロ品質のデザインを作成。AI画像生成機能も搭載。",
        pricing: "Pro: $12.99/月",
        freeTier: "無料プランあり",
        url: "https://canva.com",
      },
      {
        name: "Adobe Creative Cloud",
        description: "Photoshop、IllustratorにAI機能（Firefly）を統合。商用利用可能な生成AI。",
        pricing: "$54.99/月〜",
        freeTier: "7日間無料トライアル",
        url: "https://adobe.com",
      },
    ],
  },
  {
    id: 3,
    title: "外部サービス連携",
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
    services: [
      {
        name: "Notion",
        description: "オールインワンのワークスペース。ドキュメント、データベース、Wiki、プロジェクト管理を統合。",
        pricing: "Plus: $10/月",
        freeTier: "無料プランあり",
        url: "https://notion.so",
      },
      {
        name: "Gmail / Google Workspace",
        description: "メール、カレンダー、ドライブなどGoogleサービスとの統合。",
        pricing: "$6/月/人〜",
        freeTier: "個人利用は完全無料",
        url: "https://workspace.google.com",
      },
    ],
  },
  {
    id: 4,
    title: "タスク自動化・エージェント",
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
    id: 5,
    title: "音声入力・議事録",
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
    services: [
      {
        name: "Tl;dv",
        description: "AI会議アシスタント。Zoom、Google Meet、Teamsの会議を自動録画・文字起こし。",
        pricing: "Pro: $20/月",
        freeTier: "無料プランあり：無制限の録画・文字起こし",
        url: "https://tldv.io",
      },
    ],
  },
  {
    id: 6,
    title: "ブラウザ・PC操作自動化",
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
    services: [],
  },
  {
    id: 7,
    title: "アプリ組み込み・API",
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
    services: [
      {
        name: "Claude API",
        description: "Anthropicの公式API。200Kトークンの長いコンテキスト、優れたコード生成能力。",
        pricing: "Sonnet: $3/$15 per 1M tokens",
        freeTier: "新規登録で$5クレジット付与",
        url: "https://anthropic.com/api",
      },
    ],
  },
]

function Section1() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <section
      ref={ref}
      className="min-h-screen flex flex-col items-center justify-center px-6 py-20 bg-gradient-to-b from-white to-neutral-50"
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-4xl text-center"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={isInView ? { scale: 1, opacity: 1 } : {}}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="w-24 h-24 mx-auto mb-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-xl"
        >
          <span className="text-white text-3xl font-bold">C</span>
        </motion.div>

        <h1 className="text-4xl md:text-6xl font-bold text-neutral-900 mb-6">
          Claude AI
          <span className="block text-2xl md:text-3xl font-normal text-neutral-500 mt-4">
            エコシステム提案書
          </span>
        </h1>

        <p className="text-lg md:text-xl text-neutral-600 leading-relaxed max-w-2xl mx-auto mb-12">
          Claudeを中心に、AIツールを組み合わせることで
          <br className="hidden md:block" />
          業務効率を最大化する統合アプローチをご提案します。
        </p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="flex flex-wrap justify-center gap-4"
        >
          <div className="flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-full text-sm font-medium">
            <div className="w-2 h-2 rounded-full bg-indigo-500" />
            Claude Native: 2カテゴリ
          </div>
          <div className="flex items-center gap-2 bg-rose-50 text-rose-700 px-4 py-2 rounded-full text-sm font-medium">
            <div className="w-2 h-2 rounded-full bg-rose-500" />
            苦手を補完: 5カテゴリ
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ delay: 1, duration: 0.5 }}
        className="absolute bottom-8 animate-bounce"
      >
        <ChevronDown className="w-8 h-8 text-neutral-400" />
      </motion.div>
    </section>
  )
}

function CategoryCard({ category, index }: { category: CategoryData; index: number }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  const borderColor = category.isComplement ? "border-rose-200" : "border-indigo-200"
  const bgAccent = category.isComplement ? "bg-rose-50" : "bg-indigo-50"
  const textAccent = category.isComplement ? "text-rose-600" : "text-indigo-600"
  const dotColor = category.isComplement ? "bg-rose-500" : "bg-indigo-500"

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className={`bg-white rounded-2xl border-2 ${borderColor} shadow-sm overflow-hidden`}
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-6 flex items-center justify-between hover:bg-neutral-50 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className={`w-3 h-3 rounded-full ${dotColor}`} />
          <div className="text-left">
            <h3 className="text-lg font-semibold text-neutral-800">{category.title}</h3>
            <span className={`text-xs font-medium ${textAccent} ${bgAccent} px-2 py-0.5 rounded-full`}>
              {category.isComplement ? "苦手を補完" : "Claude Native"}
            </span>
          </div>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-5 h-5 text-neutral-400" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 space-y-6">
              {/* Strengths & Weaknesses */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-emerald-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm font-semibold text-emerald-800">Claudeの強み</span>
                  </div>
                  <ul className="space-y-2">
                    {category.claudeStrengths.map((s, i) => (
                      <li key={i} className="text-sm text-emerald-700 flex items-start gap-2">
                        <Check className="w-4 h-4 mt-0.5 shrink-0" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-amber-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span className="text-sm font-semibold text-amber-800">Claudeの苦手</span>
                  </div>
                  <ul className="space-y-2">
                    {category.claudeWeaknesses.map((w, i) => (
                      <li key={i} className="text-sm text-amber-700 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 mt-2 rounded-full bg-amber-500 shrink-0" />
                        {w}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Services */}
              {category.services.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-neutral-700 mb-3">推奨サービス</h4>
                  <div className="space-y-3">
                    {category.services.map((service, i) => (
                      <div key={i} className="bg-neutral-50 rounded-xl p-4 border border-neutral-100">
                        <div className="flex items-start justify-between mb-2">
                          <h5 className="font-semibold text-neutral-800">{service.name}</h5>
                          <a
                            href={service.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-neutral-400 hover:text-indigo-600 transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </div>
                        <p className="text-sm text-neutral-600 mb-3">{service.description}</p>
                        <div className="flex flex-wrap gap-2">
                          <span className="text-xs bg-neutral-200 text-neutral-700 px-2 py-1 rounded-full">
                            {service.pricing}
                          </span>
                          {service.freeTier && (
                            <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">
                              {service.freeTier}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function Section2() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.1 })

  const complementCategories = categories.filter(c => c.isComplement)
  const nativeCategories = categories.filter(c => !c.isComplement)

  return (
    <section ref={ref} className="min-h-screen py-20 px-6 bg-neutral-50">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
            カテゴリ別詳細
          </h2>
          <p className="text-neutral-600">
            各カテゴリをクリックして、Claudeの強み・苦手と推奨サービスを確認
          </p>
        </motion.div>

        {/* Claude Native */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-4 h-4 rounded-full bg-indigo-500" />
            <h3 className="text-xl font-semibold text-neutral-800">Claude Native</h3>
            <span className="text-sm text-neutral-500">— Claude単体で対応可能</span>
          </div>
          <div className="space-y-4">
            {nativeCategories.map((cat, i) => (
              <CategoryCard key={cat.id} category={cat} index={i} />
            ))}
          </div>
        </motion.div>

        {/* Complement */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-4 h-4 rounded-full bg-rose-500" />
            <h3 className="text-xl font-semibold text-neutral-800">苦手を補完</h3>
            <span className="text-sm text-neutral-500">— 他ツールとの連携を推奨</span>
          </div>
          <div className="space-y-4">
            {complementCategories.map((cat, i) => (
              <CategoryCard key={cat.id} category={cat} index={i} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function Section3() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <section
      ref={ref}
      className="min-h-screen flex flex-col items-center justify-center px-6 py-20 bg-gradient-to-b from-neutral-50 to-white"
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="max-w-3xl text-center"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-8">
          まとめ
        </h2>

        <div className="bg-white rounded-2xl shadow-lg border border-neutral-200 p-8 mb-12">
          <div className="grid md:grid-cols-2 gap-8 text-left">
            <div>
              <h3 className="text-lg font-semibold text-indigo-600 mb-4 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-indigo-500" />
                Claude Native
              </h3>
              <ul className="space-y-2 text-neutral-700">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-indigo-500" />
                  ブラウザ・PC操作自動化
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-indigo-500" />
                  アプリ組み込み・API
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-rose-600 mb-4 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500" />
                苦手を補完（5カテゴリ）
              </h3>
              <ul className="space-y-2 text-neutral-700 text-sm">
                <li>情報処理・知識活用</li>
                <li>制作・アウトプット生成</li>
                <li>外部サービス連携</li>
                <li>タスク自動化・エージェント</li>
                <li>音声入力・議事録</li>
              </ul>
            </div>
          </div>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-lg text-neutral-600 leading-relaxed mb-8"
        >
          Claudeの強力な言語理解・推論能力を軸に、
          <br className="hidden md:block" />
          各領域の専門ツールを組み合わせることで、
          <br className="hidden md:block" />
          <span className="font-semibold text-neutral-800">最適なAIワークフローを構築できます。</span>
        </motion.p>

        <motion.a
          href="/"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transition-shadow"
        >
          エコシステムマップを見る
          <ChevronUp className="w-5 h-5 rotate-90" />
        </motion.a>
      </motion.div>
    </section>
  )
}

export default function ProposalPage() {
  const [currentSection, setCurrentSection] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      const windowHeight = window.innerHeight
      const section = Math.floor((scrollY + windowHeight / 2) / windowHeight)
      setCurrentSection(Math.min(section, 2))
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <main className="bg-white">
      {/* Progress indicator */}
      <div className="fixed top-1/2 right-6 -translate-y-1/2 z-50 flex flex-col gap-3">
        {[0, 1, 2].map((i) => (
          <button
            key={i}
            onClick={() => {
              window.scrollTo({ top: i * window.innerHeight, behavior: "smooth" })
            }}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              currentSection === i
                ? "bg-indigo-600 scale-150"
                : "bg-neutral-300 hover:bg-neutral-400"
            }`}
            aria-label={`Section ${i + 1}`}
          />
        ))}
      </div>

      <Section1 />
      <Section2 />
      <Section3 />
    </main>
  )
}
