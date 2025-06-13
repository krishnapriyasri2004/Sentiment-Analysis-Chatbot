import { type NextRequest, NextResponse } from "next/server"
import { generateObject } from "ai"
import { openai } from "@ai-sdk/openai"
import { z } from "zod"

const sentimentSchema = z.object({
  sentiment: z.enum(["positive", "negative", "neutral"]),
  confidence: z.number().min(0).max(1),
  positive: z.number().min(0).max(1),
  negative: z.number().min(0).max(1),
  neutral: z.number().min(0).max(1),
  reasoning: z.string(),
})

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json()

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Text is required and must be a string" }, { status: 400 })
    }

    const { object } = await generateObject({
      model: openai("gpt-4o-mini"),
      schema: sentimentSchema,
      prompt: `Analyze the sentiment of the following text and provide detailed scores:

Text: "${text}"

Please analyze this text and provide:
1. The overall sentiment (positive, negative, or neutral)
2. A confidence score between 0 and 1
3. Individual scores for positive, negative, and neutral sentiment (should sum to approximately 1)
4. Brief reasoning for your analysis

Be precise and consider context, sarcasm, and nuanced emotions.`,
    })

    return NextResponse.json({
      sentiment: object.sentiment,
      confidence: object.confidence,
      positive: object.positive,
      negative: object.negative,
      neutral: object.neutral,
      provider: "openai",
      model: "gpt-4o-mini",
      reasoning: object.reasoning,
    })
  } catch (error) {
    console.error("OpenAI API error:", error)
    return NextResponse.json({ error: "Failed to analyze sentiment with OpenAI" }, { status: 500 })
  }
}
