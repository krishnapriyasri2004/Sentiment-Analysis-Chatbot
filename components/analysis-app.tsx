"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Brain,
  ArrowLeft,
  Sparkles,
  MessageCircle,
  TrendingUp,
  History,
  Download,
  RotateCcw,
  AlertCircle,
  Copy,
  Lightbulb,
} from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface AnalysisAppProps {
  onBack: () => void
}

// Simple examples with very basic English
const EXAMPLE_TEXTS = [
  {
    category: "Happy Person",
    text: "I love this place. The food is good and the people are nice. I will come back.",
    color: "bg-green-50 border-green-200",
    learning: "Words like love, good, and nice show happy feelings",
  },
  {
    category: "Mad Person",
    text: "This is bad. I do not like it. The service is terrible and I want my money back.",
    color: "bg-red-50 border-red-200",
    learning: "Words like bad, terrible, and do not like show angry feelings",
  },
  {
    category: "Normal Person",
    text: "The place is okay. The food came fast. It was fine. Nothing special but not bad.",
    color: "bg-gray-50 border-gray-200",
    learning: "Words like okay, fine, and nothing special show normal feelings",
  },
  {
    category: "Very Happy",
    text: "This is the best day ever! I got a new job and I am so excited! Everything is perfect!",
    color: "bg-yellow-50 border-yellow-200",
    learning: "Words like best ever, excited, and perfect show very happy feelings",
  },
  {
    category: "Sad Person",
    text: "I feel sad today. My friend is sick and I am worried. I hope things get better.",
    color: "bg-blue-50 border-blue-200",
    learning: "Words like sad, sick, and worried show sad feelings",
  },
  {
    category: "Not Sure",
    text: "I do not understand this. It is hard and I need help. Can someone explain it?",
    color: "bg-purple-50 border-purple-200",
    learning: "Words like do not understand and need help show confused feelings",
  },
  {
    category: "Proud Person",
    text: "My kid won the race today. I am so proud of her. She worked hard and did great.",
    color: "bg-orange-50 border-orange-200",
    learning: "Words like proud, won, and did great show happy and proud feelings",
  },
  {
    category: "Tired Person",
    text: "I am tired from work. It was a long day. I want to go home and rest.",
    color: "bg-indigo-50 border-indigo-200",
    learning: "Words like tired and long day show tired feelings but not angry",
  },
]

// Enhanced sentiment analysis with better error handling
async function analyzeSentiment(text: string, provider: "huggingface" | "openai" = "huggingface") {
  try {
    console.log(`Analyzing with ${provider}:`, text.substring(0, 50) + "...")

    if (provider === "huggingface") {
      const response = await fetch("/api/analyze/huggingface", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      })

      const data = await response.json()

      if (!response.ok) {
        console.error("Hugging Face API failed:", data)
        throw new Error(data.error || "Hugging Face API failed")
      }

      return data
    } else {
      const response = await fetch("/api/analyze/openai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      })

      const data = await response.json()

      if (!response.ok) {
        console.error("OpenAI API failed:", data)
        throw new Error(data.error || "OpenAI API failed")
      }

      return data
    }
  } catch (error) {
    console.error(`${provider} analysis failed:`, error)
    // Always fall back to mock analysis
    return mockAnalyzeSentiment(text, provider)
  }
}

// Enhanced fallback function
function mockAnalyzeSentiment(text: string, requestedProvider = "fallback") {
  console.log("Using fallback sentiment analysis")

  const words = text.toLowerCase().split(/\s+/)

  // Simple word lists
  const happyWords = [
    "love",
    "good",
    "great",
    "nice",
    "happy",
    "best",
    "wonderful",
    "awesome",
    "perfect",
    "excellent",
    "amazing",
    "beautiful",
    "proud",
    "excited",
    "joy",
    "smile",
    "laugh",
    "win",
    "won",
    "better",
    "hope",
    "thank",
    "thanks",
    "pleased",
    "like",
    "enjoy",
  ]

  const sadWords = [
    "bad",
    "terrible",
    "awful",
    "sad",
    "angry",
    "mad",
    "upset",
    "worried",
    "scared",
    "sick",
    "hurt",
    "pain",
    "problem",
    "wrong",
    "broken",
    "failed",
    "lost",
    "never",
    "worst",
    "horrible",
    "hate",
    "annoying",
    "frustrated",
    "disappointed",
    "tired",
  ]

  let happyScore = 0
  let sadScore = 0

  words.forEach((word) => {
    // Remove punctuation
    const cleanWord = word.replace(/[^\w]/g, "")
    if (happyWords.includes(cleanWord)) happyScore++
    if (sadWords.includes(cleanWord)) sadScore++
  })

  // Check for emotional indicators
  const exclamationCount = (text.match(/!/g) || []).length

  // Boost scores based on emotional indicators
  if (exclamationCount > 0) {
    if (happyScore > sadScore) happyScore += exclamationCount * 0.5
    else if (sadScore > happyScore) sadScore += exclamationCount * 0.5
  }

  const totalWords = happyScore + sadScore

  if (totalWords === 0) {
    return {
      sentiment: "neutral",
      confidence: 0.6 + Math.random() * 0.2,
      positive: 0.3 + Math.random() * 0.1,
      negative: 0.3 + Math.random() * 0.1,
      neutral: 0.4 + Math.random() * 0.1,
      provider: `${requestedProvider}-fallback`,
    }
  }

  const happyRatio = happyScore / totalWords
  const sadRatio = sadScore / totalWords

  let sentiment = "neutral"
  let confidence = 0.5

  if (happyRatio > sadRatio) {
    sentiment = "positive"
    confidence = 0.6 + happyRatio * 0.3
  } else if (sadRatio > happyRatio) {
    sentiment = "negative"
    confidence = 0.6 + sadRatio * 0.3
  } else {
    confidence = 0.5 + Math.random() * 0.2
  }

  // Normalize scores
  const positive = happyRatio || 0.2 + Math.random() * 0.1
  const negative = sadRatio || 0.2 + Math.random() * 0.1
  const neutral = Math.max(0.1, 1 - positive - negative)

  return {
    sentiment,
    confidence: Math.min(confidence, 0.9),
    positive,
    negative,
    neutral,
    provider: `${requestedProvider}-fallback`,
  }
}

interface AnalysisResult {
  id: string
  text: string
  sentiment: string
  confidence: number
  positive: number
  negative: number
  neutral: number
  timestamp: Date
  provider: string
  processingTime?: number
}

export function AnalysisApp({ onBack }: AnalysisAppProps) {
  const [text, setText] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [results, setResults] = useState<AnalysisResult[]>([])
  const [currentResult, setCurrentResult] = useState<AnalysisResult | null>(null)
  const [provider, setProvider] = useState<"huggingface" | "openai">("huggingface")
  const [error, setError] = useState<string | null>(null)
  const [selectedExample, setSelectedExample] = useState<number | null>(null)

  const handleAnalyze = async () => {
    if (!text.trim()) return

    setIsAnalyzing(true)
    setError(null)
    const startTime = Date.now()

    try {
      const analysis = await analyzeSentiment(text, provider)
      const processingTime = Date.now() - startTime

      const result: AnalysisResult = {
        id: Date.now().toString(),
        text: text.trim(),
        sentiment: analysis.sentiment,
        confidence: analysis.confidence,
        positive: analysis.positive,
        negative: analysis.negative,
        neutral: analysis.neutral,
        timestamp: new Date(),
        provider: analysis.provider || provider,
        processingTime,
      }

      setCurrentResult(result)
      setResults((prev) => [result, ...prev])

      // Show warning if using fallback
      if (analysis.provider?.includes("fallback")) {
        setError(`Using backup system - ${provider} is not working right now`)
      }
    } catch (error) {
      console.error("Analysis failed:", error)
      setError(error instanceof Error ? error.message : "Something went wrong")
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleExampleClick = (exampleText: string, index: number) => {
    setText(exampleText)
    setSelectedExample(index)
    // Auto-scroll to textarea
    setTimeout(() => {
      document.querySelector("textarea")?.focus()
    }, 100)
  }

  const getSentimentText = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "Happy"
      case "negative":
        return "Sad"
      default:
        return "Normal"
    }
  }

  const clearHistory = () => {
    setResults([])
    setCurrentResult(null)
    setError(null)
  }

  const exportResults = () => {
    const dataStr = JSON.stringify(results, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = "text-results.json"
    link.click()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={onBack} className="text-gray-600 hover:text-gray-900">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Text Feeling Checker</h1>
                  <p className="text-sm text-gray-500">See if text is happy, sad, or normal</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Error Alert */}
        {error && (
          <Alert className="mb-6 border-orange-200 bg-orange-50">
            <AlertCircle className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800">{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Input Section */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-xl">
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Check Your Text</h2>
                    <p className="text-gray-600">
                      Write something and we will tell you if it sounds happy, sad, or normal. Try the examples on the
                      right.
                    </p>
                  </div>

                  <Textarea
                    placeholder="Write something here or click an example on the right"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="min-h-[140px] text-base border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 resize-none rounded-xl transition-all duration-200"
                  />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Select value={provider} onValueChange={(value: "huggingface" | "openai") => setProvider(value)}>
                        <SelectTrigger className="w-[180px] border-gray-200 rounded-lg">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="huggingface">Smart AI</SelectItem>
                          <SelectItem value="openai">Super AI</SelectItem>
                        </SelectContent>
                      </Select>
                      <span className="text-sm text-gray-500">{text.length} letters</span>
                    </div>

                    <Button
                      onClick={handleAnalyze}
                      disabled={!text.trim() || isAnalyzing}
                      size="lg"
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    >
                      {isAnalyzing ? (
                        <>
                          <Sparkles className="w-5 h-5 mr-2 animate-spin" />
                          Checking...
                        </>
                      ) : (
                        <>
                          <TrendingUp className="w-5 h-5 mr-2" />
                          Check Text
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Results Section */}
            {currentResult && (
              <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-xl">
                <CardContent className="p-8">
                  <div className="space-y-8">
                    <div className="text-center">
                      <div className="text-6xl mb-6 font-bold text-gray-700">
                        {getSentimentText(currentResult.sentiment)}
                      </div>
                      <h3 className="text-3xl font-bold text-gray-900 mb-3">
                        This text sounds {currentResult.sentiment}
                      </h3>
                      <p className="text-xl text-gray-600">I am {(currentResult.confidence * 100).toFixed(0)}% sure</p>
                    </div>

                    <div className="grid grid-cols-3 gap-6">
                      <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl border border-green-200">
                        <div className="text-3xl font-bold text-green-700 mb-2">
                          {(currentResult.positive * 100).toFixed(0)}%
                        </div>
                        <div className="text-sm font-medium text-green-600">Happy</div>
                      </div>
                      <div className="text-center p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-200">
                        <div className="text-3xl font-bold text-gray-700 mb-2">
                          {(currentResult.neutral * 100).toFixed(0)}%
                        </div>
                        <div className="text-sm font-medium text-gray-600">Normal</div>
                      </div>
                      <div className="text-center p-6 bg-gradient-to-br from-red-50 to-red-100 rounded-2xl border border-red-200">
                        <div className="text-3xl font-bold text-red-700 mb-2">
                          {(currentResult.negative * 100).toFixed(0)}%
                        </div>
                        <div className="text-sm font-medium text-red-600">Sad</div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
                      <p className="text-center text-blue-800 font-medium">
                        <strong>Checked by {currentResult.provider}</strong>
                        {currentResult.processingTime && (
                          <span className="ml-2 text-sm">Done in {currentResult.processingTime}ms</span>
                        )}
                      </p>
                    </div>

                    {/* Learning insight for selected example */}
                    {selectedExample !== null && EXAMPLE_TEXTS[selectedExample] && (
                      <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl p-6 border border-yellow-200">
                        <div className="flex items-start gap-3">
                          <Lightbulb className="w-5 h-5 text-yellow-600 mt-1" />
                          <div>
                            <h4 className="font-semibold text-yellow-800 mb-2">Why this result?</h4>
                            <p className="text-yellow-700 text-sm">{EXAMPLE_TEXTS[selectedExample].learning}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Example Texts */}
            <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-xl">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Lightbulb className="w-5 h-5 text-yellow-600" />
                  Try These Examples
                </CardTitle>
                <p className="text-sm text-gray-600">Click any example to see how it works</p>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px]">
                  <div className="space-y-3">
                    {EXAMPLE_TEXTS.map((example, index) => (
                      <div
                        key={index}
                        className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer hover:shadow-md ${example.color}`}
                        onClick={() => handleExampleClick(example.text, index)}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-semibold text-gray-700">{example.category}</span>
                              <Copy className="w-4 h-4 text-gray-400 hover:text-blue-600 transition-colors" />
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{example.text}</p>
                            <div className="text-xs text-gray-500">{example.learning}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* History */}
            {results.length > 0 && (
              <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-xl">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <History className="w-5 h-5 text-blue-600" />
                      What You Checked
                    </CardTitle>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={exportResults} className="rounded-lg">
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={clearHistory} className="rounded-lg">
                        <RotateCcw className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[300px]">
                    <div className="space-y-3">
                      {results.map((result) => (
                        <div
                          key={result.id}
                          className="flex items-start gap-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl hover:from-blue-50 hover:to-purple-50 transition-all duration-200 border border-gray-200"
                        >
                          <div className="text-lg font-bold text-gray-600">{getSentimentText(result.sentiment)}</div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-900 line-clamp-2 mb-2 font-medium">{result.text}</p>
                            <div className="flex items-center gap-3 text-xs text-gray-500">
                              <span className="capitalize font-semibold bg-gray-200 px-2 py-1 rounded">
                                {getSentimentText(result.sentiment)}
                              </span>
                              <span>{(result.confidence * 100).toFixed(0)}% sure</span>
                              <span>{result.timestamp.toLocaleTimeString()}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            )}

            {/* Empty State for History */}
            {results.length === 0 && (
              <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-xl">
                <CardContent className="p-8 text-center">
                  <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready to start</h3>
                  <p className="text-gray-600 text-sm">Try the examples above to see how it works</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
