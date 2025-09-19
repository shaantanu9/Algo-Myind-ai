"use client"

import { useState } from "react"
import {
  ArrowLeft,
  Play,
  Pause,
  RotateCcw,
  Share2,
  Download,
  Brain,
  Lightbulb,
  Zap,
  Clock,
  TrendingUp,
  BookOpen,
  Wrench,
  Layers,
  Box,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { MermaidAnimation } from "@/components/mermaid-animation"
import { ReactFlowAnimation } from "@/components/react-flow-animation"
import { D3Animation } from "@/components/d3-animation"
import { ThreeAnimation } from "@/components/three-animation"
import { AIExplanationModal } from "@/components/ai-explanation-modal"
import { ExportModal } from "@/components/export-modal"
import Link from "next/link"

interface Algorithm {
  id: string
  title: string
  description: string
  difficulty: string
  category: string
  timeComplexity: string
  spaceComplexity: string
  popularity: number
  estimatedTime: string
  realWorldUse: string
  problemStatement: string
  examples: Array<{
    input: string
    output: string
    explanation: string
  }>
  analogy: {
    title: string
    content: string
  }
  keyInsights: string[]
  realWorldApplications: Array<{
    domain: string
    application: string
    description: string
  }>
  engineeringLessons: Array<{
    principle: string
    lesson: string
    application: string
  }>
  implementations: {
    bruteForce: {
      title: string
      timeComplexity: string
      spaceComplexity: string
      code: string
    }
    optimized: {
      title: string
      timeComplexity: string
      spaceComplexity: string
      code: string
    }
  }
  animationStates: Array<{
    step: number
    title: string
    description: string
    data: any
  }>
}

interface AlgorithmDetailPageProps {
  algorithm: Algorithm
}

export function AlgorithmDetailPage({ algorithm }: AlgorithmDetailPageProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [showAIModal, setShowAIModal] = useState(false)
  const [showExportModal, setShowExportModal] = useState(false)
  const [animationType, setAnimationType] = useState<"mermaid" | "flow" | "d3" | "three">("mermaid")

  const aiQuestions = [
    {
      id: "why-hash-map-faster",
      question: "Why is the hash map approach faster than brute force?",
      context: "Time complexity comparison and algorithmic efficiency",
    },
    {
      id: "space-time-tradeoff",
      question: "What's the trade-off we're making with the hash map solution?",
      context: "Space complexity vs time complexity analysis",
    },
    {
      id: "when-brute-force-better",
      question: "When might the brute force approach be better?",
      context: "Practical considerations and edge cases",
    },
    {
      id: "hash-collision-handling",
      question: "How do hash collisions affect this algorithm?",
      context: "Hash map implementation details and performance",
    },
    {
      id: "real-world-scaling",
      question: "How does this algorithm scale in real-world applications?",
      context: "Production systems and performance considerations",
    },
  ]

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "Medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "Hard":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const handleReset = () => {
    setCurrentStep(0)
    setIsPlaying(false)
  }

  const handleStepChange = (step: number) => {
    setCurrentStep(Math.max(0, Math.min(step, algorithm.animationStates.length - 1)))
  }

  const progress = ((currentStep + 1) / algorithm.animationStates.length) * 100

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Discovery
                </Button>
              </Link>
              <Separator orientation="vertical" className="h-6" />
              <div>
                <h1 className="text-2xl font-bold">{algorithm.title}</h1>
                <p className="text-sm text-muted-foreground">
                  {algorithm.category} • {algorithm.estimatedTime}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={getDifficultyColor(algorithm.difficulty)}>{algorithm.difficulty}</Badge>
              <Button variant="outline" size="sm" onClick={() => setShowExportModal(true)}>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm" onClick={() => setShowExportModal(true)}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Animation Workspace */}
            <Card className="border-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    {animationType === "mermaid" && <Layers className="h-5 w-5 text-secondary" />}
                    {animationType === "flow" && <Layers className="h-5 w-5 text-secondary" />}
                    {animationType === "d3" && <Zap className="h-5 w-5 text-secondary" />}
                    {animationType === "three" && <Box className="h-5 w-5 text-secondary" />}
                    Interactive{" "}
                    {animationType === "mermaid"
                      ? "Study Notes"
                      : animationType === "flow"
                        ? "Flow Diagram"
                        : animationType === "d3"
                          ? "Array Animation"
                          : "3D Visualization"}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    {/* Animation Type Selector */}
                    <div className="flex items-center gap-1 mr-4">
                      <Button
                        variant={animationType === "mermaid" ? "secondary" : "outline"}
                        size="sm"
                        onClick={() => setAnimationType("mermaid")}
                        title="Mermaid - Study Notes"
                      >
                        <BookOpen className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={animationType === "flow" ? "secondary" : "outline"}
                        size="sm"
                        onClick={() => setAnimationType("flow")}
                        title="React Flow - Interactive Steps"
                      >
                        <Layers className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={animationType === "d3" ? "secondary" : "outline"}
                        size="sm"
                        onClick={() => setAnimationType("d3")}
                        title="D3.js - Array Animation"
                      >
                        <Zap className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={animationType === "three" ? "secondary" : "outline"}
                        size="sm"
                        onClick={() => setAnimationType("three")}
                        title="Three.js - 3D Visualization"
                      >
                        <Box className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button variant="outline" size="sm" onClick={handleReset}>
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                    <Button variant="secondary" size="sm" onClick={handlePlayPause}>
                      {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      {isPlaying ? "Pause" : "Play"}
                    </Button>
                  </div>
                </div>
                <Progress value={progress} className="w-full" />
                <p className="text-sm text-muted-foreground">
                  Step {currentStep + 1} of {algorithm.animationStates.length}:{" "}
                  {algorithm.animationStates[currentStep]?.title}
                </p>
              </CardHeader>
              <CardContent>
                {animationType === "mermaid" && (
                  <MermaidAnimation
                    steps={algorithm.animationStates}
                    currentStep={currentStep}
                    isPlaying={isPlaying}
                    onStepChange={handleStepChange}
                    onPlayPause={handlePlayPause}
                    onReset={handleReset}
                    algorithmId={algorithm.id}
                  />
                )}
                {animationType === "flow" && (
                  <ReactFlowAnimation
                    steps={algorithm.animationStates}
                    currentStep={currentStep}
                    isPlaying={isPlaying}
                    onStepChange={handleStepChange}
                    onPlayPause={handlePlayPause}
                    onReset={handleReset}
                    algorithmId={algorithm.id}
                  />
                )}
                {animationType === "d3" && (
                  <D3Animation
                    steps={algorithm.animationStates}
                    currentStep={currentStep}
                    isPlaying={isPlaying}
                    onStepChange={handleStepChange}
                    onPlayPause={handlePlayPause}
                    onReset={handleReset}
                    algorithmId={algorithm.id}
                  />
                )}
                {animationType === "three" && (
                  <ThreeAnimation
                    steps={algorithm.animationStates}
                    currentStep={currentStep}
                    isPlaying={isPlaying}
                    onStepChange={handleStepChange}
                    onPlayPause={handlePlayPause}
                    onReset={handleReset}
                    algorithmId={algorithm.id}
                  />
                )}
              </CardContent>
            </Card>

            {/* Tabbed Content */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="analogy">Analogy</TabsTrigger>
                <TabsTrigger value="code">Code</TabsTrigger>
                <TabsTrigger value="applications">Applications</TabsTrigger>
                <TabsTrigger value="engineering">Engineering</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5" />
                      Problem Statement
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-relaxed whitespace-pre-line">{algorithm.problemStatement}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Examples</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {algorithm.examples.map((example, index) => (
                      <div key={index} className="border rounded-lg p-4 bg-muted/30">
                        <div className="space-y-2 text-sm">
                          <div>
                            <strong>Input:</strong> <code className="bg-muted px-2 py-1 rounded">{example.input}</code>
                          </div>
                          <div>
                            <strong>Output:</strong>{" "}
                            <code className="bg-muted px-2 py-1 rounded">{example.output}</code>
                          </div>
                          <div>
                            <strong>Explanation:</strong> {example.explanation}
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lightbulb className="h-5 w-5" />
                      Key Insights
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {algorithm.keyInsights.map((insight, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0" />
                          <span className="text-sm leading-relaxed">{insight}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="analogy" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="h-5 w-5" />
                      {algorithm.analogy.title}
                    </CardTitle>
                    <CardDescription>Understanding through real-world comparison</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-sm max-w-none">
                      <p className="whitespace-pre-line leading-relaxed">{algorithm.analogy.content}</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="code" className="space-y-6">
                <div className="grid gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>{algorithm.implementations.bruteForce.title}</CardTitle>
                      <CardDescription>
                        Time: {algorithm.implementations.bruteForce.timeComplexity} • Space:{" "}
                        {algorithm.implementations.bruteForce.spaceComplexity}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                        <code>{algorithm.implementations.bruteForce.code}</code>
                      </pre>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Zap className="h-5 w-5 text-secondary" />
                        {algorithm.implementations.optimized.title}
                      </CardTitle>
                      <CardDescription>
                        Time: {algorithm.implementations.optimized.timeComplexity} • Space:{" "}
                        {algorithm.implementations.optimized.spaceComplexity}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                        <code>{algorithm.implementations.optimized.code}</code>
                      </pre>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="applications" className="space-y-6">
                <div className="grid gap-4">
                  {algorithm.realWorldApplications.map((app, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle className="text-lg">{app.domain}</CardTitle>
                        <CardDescription className="font-medium">{app.application}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm leading-relaxed">{app.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="engineering" className="space-y-6">
                <div className="grid gap-4">
                  {algorithm.engineeringLessons.map((lesson, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <Wrench className="h-5 w-5" />
                          {lesson.principle}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <h4 className="font-medium text-sm mb-1">Key Lesson:</h4>
                          <p className="text-sm leading-relaxed">{lesson.lesson}</p>
                        </div>
                        <div>
                          <h4 className="font-medium text-sm mb-1">Engineering Application:</h4>
                          <p className="text-sm leading-relaxed text-muted-foreground">{lesson.application}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Algorithm Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Algorithm Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Time Complexity</span>
                    <div className="font-mono text-secondary font-medium">{algorithm.timeComplexity}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Space Complexity</span>
                    <div className="font-mono text-secondary font-medium">{algorithm.spaceComplexity}</div>
                  </div>
                </div>
                <Separator />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Popularity</span>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-secondary" />
                    <span className="font-medium">{algorithm.popularity}%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Est. Time</span>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-secondary" />
                    <span className="font-medium">{algorithm.estimatedTime}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AI Questions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Brain className="h-5 w-5" />
                  AI Study Questions
                </CardTitle>
                <CardDescription>Test your understanding with AI-powered explanations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm space-y-2">
                  <p className="font-medium">1. Why is the hash map approach faster?</p>
                  <p className="font-medium">2. What's the trade-off we're making?</p>
                  <p className="font-medium">3. When might brute force be better?</p>
                  <p className="text-muted-foreground text-xs">+ 2 more questions</p>
                </div>
                <Button
                  variant="outline"
                  className="w-full bg-transparent"
                  size="sm"
                  onClick={() => setShowAIModal(true)}
                >
                  <Brain className="h-4 w-4 mr-2" />
                  Get AI Explanations
                </Button>
              </CardContent>
            </Card>

            {/* Related Algorithms */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Related Algorithms</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <Link href="/algorithm/three-sum" className="block">
                    <div className="p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                      <div className="font-medium text-sm">Three Sum</div>
                      <div className="text-xs text-muted-foreground">Extension of Two Sum</div>
                    </div>
                  </Link>
                  <Link href="/algorithm/two-sum-ii" className="block">
                    <div className="p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                      <div className="font-medium text-sm">Two Sum II</div>
                      <div className="text-xs text-muted-foreground">Sorted array variant</div>
                    </div>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* AI Explanation Modal */}
      <AIExplanationModal
        isOpen={showAIModal}
        onClose={() => setShowAIModal(false)}
        algorithmId={algorithm.id}
        questions={aiQuestions}
      />

      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        algorithmId={algorithm.id}
        algorithmTitle={algorithm.title}
        currentStep={currentStep}
        animationType={animationType}
      />
    </div>
  )
}
