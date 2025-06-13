"use client"

import { useState } from "react"
import { LandingPage } from "@/components/landing-page"
import { AnalysisApp } from "@/components/analysis-app"

export default function SentimentAI() {
  const [showApp, setShowApp] = useState(false)

  if (showApp) {
    return <AnalysisApp onBack={() => setShowApp(false)} />
  }

  return <LandingPage onGetStarted={() => setShowApp(true)} />
}
