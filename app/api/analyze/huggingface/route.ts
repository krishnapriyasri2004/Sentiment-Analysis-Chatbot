import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json()

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Text is required and must be a string" }, { status: 400 })
    }

    if (!process.env.HUGGINGFACE_API_KEY) {
      console.log("Hugging Face API key not found, using fallback")
      return NextResponse.json({ error: "API key not configured" }, { status: 500 })
    }

    // Try multiple Hugging Face models for better reliability
    const models = [
      "cardiffnlp/twitter-roberta-base-sentiment-latest",
      "nlptown/bert-base-multilingual-uncased-sentiment",
      "cardiffnlp/twitter-roberta-base-sentiment",
    ]

    let lastError = null

    for (const model of models) {
      try {
        console.log(`Trying Hugging Face model: ${model}`)

        const response = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            inputs: text,
            options: {
              wait_for_model: true,
              use_cache: false,
            },
          }),
        })

        console.log(`Response status for ${model}:`, response.status)

        if (!response.ok) {
          let errorText = "Unknown error"
          try {
            const errorData = await response.text()
            errorText = errorData
            console.log(`Error response for ${model}:`, errorText)
          } catch (parseError) {
            console.log(`Could not parse error for ${model}:`, parseError)
          }
          lastError = new Error(`HTTP ${response.status}: ${errorText}`)
          continue
        }

        let result
        try {
          result = await response.json()
          console.log(`Success with ${model}:`, result)
        } catch (jsonError) {
          console.log(`JSON parse error for ${model}:`, jsonError)
          lastError = new Error(`Invalid JSON response from ${model}`)
          continue
        }

        // Handle different response formats
        if (Array.isArray(result) && result.length > 0) {
          const scores = result[0]

          // Handle different label formats
          let positive = 0
          let negative = 0
          let neutral = 0

          if (Array.isArray(scores)) {
            scores.forEach((item: { label: string; score: number }) => {
              const label = item.label.toLowerCase()

              // Handle different labeling schemes
              if (label.includes("positive") || label === "label_2" || label === "pos") {
                positive = item.score
              } else if (label.includes("negative") || label === "label_0" || label === "neg") {
                negative = item.score
              } else if (label.includes("neutral") || label === "label_1" || label === "neu") {
                neutral = item.score
              }
            })
          }

          // Normalize scores if they don't add up to 1
          const total = positive + negative + neutral
          if (total > 0) {
            positive = positive / total
            negative = negative / total
            neutral = neutral / total
          } else {
            // Fallback if no valid scores
            positive = 0.33
            negative = 0.33
            neutral = 0.34
          }

          // Determine primary sentiment
          const maxScore = Math.max(positive, negative, neutral)
          let primarySentiment = "neutral"
          if (positive === maxScore) primarySentiment = "positive"
          else if (negative === maxScore) primarySentiment = "negative"

          return NextResponse.json({
            sentiment: primarySentiment,
            confidence: maxScore,
            positive,
            negative,
            neutral,
            provider: "huggingface",
            model,
          })
        }

        // If we get here, the response format was unexpected
        lastError = new Error(`Unexpected response format from ${model}`)
        continue
      } catch (modelError) {
        console.error(`Error with model ${model}:`, modelError)
        lastError = modelError
        continue
      }
    }

    // If all models failed, return error response
    console.error("All Hugging Face models failed, last error:", lastError)
    return NextResponse.json(
      {
        error: "All Hugging Face models failed",
        details: lastError instanceof Error ? lastError.message : "Unknown error",
      },
      { status: 500 },
    )
  } catch (error) {
    console.error("Hugging Face API error:", error)
    return NextResponse.json(
      {
        error: "Failed to analyze sentiment with Hugging Face",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
