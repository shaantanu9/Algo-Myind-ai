"use client"

import { useState } from "react"
import { Brain, Loader2, X, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"

interface AIExplanationModalProps {
  isOpen: boolean
  onClose: () => void
  algorithmId: string
  questions: Array<{
    id: string
    question: string
    context?: string
  }>
}

export function AIExplanationModal({ isOpen, onClose, algorithmId, questions }: AIExplanationModalProps) {
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null)
  const [explanation, setExplanation] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleQuestionSelect = async (questionId: string, question: string, context?: string) => {
    setSelectedQuestion(questionId)
    setIsLoading(true)
    setError(null)
    setExplanation("")

    try {
      const response = await fetch("/api/ai-explanation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          algorithmId,
          question,
          context,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get AI explanation")
      }

      const data = await response.json()
      setExplanation(data.explanation)
    } catch (err) {
      setError("Failed to get AI explanation. Please try again.")
      console.error("AI explanation error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setSelectedQuestion(null)
    setExplanation("")
    setError(null)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-secondary" />
            AI Study Assistant
          </DialogTitle>
          <DialogDescription>
            Get personalized explanations to deepen your understanding of this algorithm
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Questions Panel */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Study Questions</h3>
            <div className="space-y-2">
              {questions.map((q) => (
                <Card
                  key={q.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedQuestion === q.id ? "ring-2 ring-secondary bg-secondary/5" : ""
                  }`}
                  onClick={() => handleQuestionSelect(q.id, q.question, q.context)}
                >
                  <CardContent className="p-4">
                    <p className="text-sm font-medium">{q.question}</p>
                    {q.context && <p className="text-xs text-muted-foreground mt-1">{q.context}</p>}
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="bg-muted/30 rounded-lg p-4 text-sm">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-4 w-4 text-secondary" />
                <span className="font-medium">AI-Powered Learning</span>
              </div>
              <p className="text-muted-foreground">
                Click any question to get a personalized explanation tailored to your learning level and the specific
                algorithm context.
              </p>
            </div>
          </div>

          {/* Explanation Panel */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">AI Explanation</h3>

            {!selectedQuestion && (
              <div className="bg-muted/30 rounded-lg p-8 text-center">
                <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Select a question to get an AI-powered explanation</p>
              </div>
            )}

            {isLoading && (
              <div className="bg-muted/30 rounded-lg p-8 text-center">
                <Loader2 className="h-8 w-8 text-secondary animate-spin mx-auto mb-4" />
                <p className="text-muted-foreground">AI is thinking...</p>
              </div>
            )}

            {error && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                <p className="text-destructive text-sm">{error}</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2 bg-transparent"
                  onClick={() => {
                    const question = questions.find((q) => q.id === selectedQuestion)
                    if (question) {
                      handleQuestionSelect(question.id, question.question, question.context)
                    }
                  }}
                >
                  Try Again
                </Button>
              </div>
            )}

            {explanation && (
              <Card>
                <CardContent className="p-6">
                  <div className="prose prose-sm max-w-none">
                    <div className="whitespace-pre-line leading-relaxed">{explanation}</div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t">
          <Button variant="outline" onClick={handleClose}>
            <X className="h-4 w-4 mr-2" />
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
