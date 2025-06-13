import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Key, Settings } from "lucide-react"

export function SetupInstructions() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            API Setup Instructions
          </CardTitle>
          <CardDescription>Configure your AI providers to enable production-grade sentiment analysis</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Hugging Face Setup */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="outline">Hugging Face</Badge>
              <span className="text-sm font-medium">Free Tier Available</span>
            </div>

            <Alert>
              <Key className="w-4 h-4" />
              <AlertDescription>
                <strong>Environment Variable:</strong> <code>HUGGINGFACE_API_KEY</code>
              </AlertDescription>
            </Alert>

            <div className="text-sm space-y-2">
              <p>
                <strong>Steps to get your API key:</strong>
              </p>
              <ol className="list-decimal list-inside space-y-1 ml-4">
                <li>
                  Visit{" "}
                  <a
                    href="https://huggingface.co"
                    className="text-blue-600 hover:underline inline-flex items-center gap-1"
                  >
                    huggingface.co <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
                <li>Create a free account or sign in</li>
                <li>Go to Settings → Access Tokens</li>
                <li>Create a new token with "Read" permissions</li>
                <li>Copy the token and add it to your environment variables</li>
              </ol>
              <p className="text-muted-foreground">
                <strong>Model:</strong> cardiffnlp/twitter-roberta-base-sentiment-latest
              </p>
            </div>
          </div>

          {/* OpenAI Setup */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="outline">OpenAI</Badge>
              <span className="text-sm font-medium">Pay-per-use</span>
            </div>

            <Alert>
              <Key className="w-4 h-4" />
              <AlertDescription>
                <strong>Environment Variable:</strong> <code>OPENAI_API_KEY</code>
              </AlertDescription>
            </Alert>

            <div className="text-sm space-y-2">
              <p>
                <strong>Steps to get your API key:</strong>
              </p>
              <ol className="list-decimal list-inside space-y-1 ml-4">
                <li>
                  Visit{" "}
                  <a
                    href="https://platform.openai.com"
                    className="text-blue-600 hover:underline inline-flex items-center gap-1"
                  >
                    platform.openai.com <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
                <li>Create an account and add billing information</li>
                <li>Go to API Keys section</li>
                <li>Create a new secret key</li>
                <li>Copy the key and add it to your environment variables</li>
              </ol>
              <p className="text-muted-foreground">
                <strong>Model:</strong> GPT-4o-mini (cost-effective with high accuracy)
              </p>
            </div>
          </div>

          {/* Environment Setup */}
          <div className="space-y-3">
            <h4 className="font-medium">Environment Variables Setup</h4>
            <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md">
              <code className="text-sm">
                HUGGINGFACE_API_KEY=hf_your_token_here
                <br />
                OPENAI_API_KEY=sk-your_key_here
              </code>
            </div>
            <p className="text-sm text-muted-foreground">
              Add these to your <code>.env.local</code> file in your project root.
            </p>
          </div>

          {/* Fallback Notice */}
          <Alert>
            <AlertDescription>
              <strong>Fallback Mode:</strong> If API keys are not configured, the app will use a rule-based fallback
              system for demonstration purposes.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  )
}
