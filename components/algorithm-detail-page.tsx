"use client"

import React, { useState } from "react"
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
  AlertCircle,
  Activity,
  CheckCircle,
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
import { EnhancedD3Visualization } from "@/components/d3-animation"
import { LocalStorageManager } from "@/lib/local-storage-manager"
import { AIExplanationModal } from "@/components/ai-explanation-modal"
import { ExportModal } from "@/components/export-modal"
import Link from "next/link"

interface Algorithm {
  id: string
  problemId?: number
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
  lastModified?: number
  examples: Array<{
    input: string
    output: string
    explanation: string
  }>
  analogy: {
    title: string
    content: string
  } | undefined
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
  implementations?: {
    bruteForce?: {
      title: string
      timeComplexity: string
      spaceComplexity: string
      code: string
      explanation?: string
      whenToUse?: string
    }
    optimized?: {
      title: string
      timeComplexity: string
      spaceComplexity: string
      code: string
      explanation?: string
      whenToUse?: string
    }
    alternative?: {
      title: string
      timeComplexity: string
      spaceComplexity: string
      code: string
      explanation?: string
      whenToUse?: string
    }
  }
  animationStates: Array<{
    step: number
    title: string
    description: string
    data: any
  }>
  animation?: {
    interactiveData: any
  }
  metadata?: {
    tags?: string[]
    acceptanceRate?: string
    frequency?: number
    similarProblems?: string[]
    difficultyBreakdown?: {
      understanding: string
      implementation: string
      optimization: string
    }
  }
  generatedAnimations?: Array<{
    library: string
    frames: Array<{
      step: number
      atoms: any[]
      data: any
    }>
  }>
  educationalContent?: {
    analogy?: {
      title: string
      content: string
      visualAid?: string
    }
    keyInsights?: string[]
    commonMistakes?: string[]
    optimizationTips?: string[]
    interviewTips?: string[]
  }
  codeQuality?: {
    readability: number
    efficiency: number
    maintainability: number
    documentation: number
    testability: number
    bestPractices?: string[]
  }
  testingScenarios?: Array<{
    scenario: string
    input: string
    expectedOutput: string
    edgeCase: boolean
  }>
  performanceAnalysis?: {
    bestCase: string
    averageCase: string
    worstCase: string
    spaceComplexity: string
    bottlenecks?: string[]
    scalability: string
  }
  relatedAlgorithms?: Array<{
    name: string
    similarity: string
    whenToUse: string
  }>
}

interface AlgorithmDetailPageProps {
  algorithm: Algorithm
}

export function AlgorithmDetailPage({ algorithm: serverAlgorithm }: AlgorithmDetailPageProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [showAIModal, setShowAIModal] = useState(false)
  const [showExportModal, setShowExportModal] = useState(false)
  const [animationType, setAnimationType] = useState<"mermaid" | "flow" | "d3" | "three">("mermaid")
  const [algorithm, setAlgorithm] = useState(serverAlgorithm)

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

  // Check localStorage for updated algorithm data
  React.useEffect(() => {
    const checkLocalStorage = () => {
      try {
        // Try to load by algorithm ID first
        let localAlgorithm = LocalStorageManager.loadAlgorithm(serverAlgorithm.id)

        // If not found by ID, try by problem ID
        if (!localAlgorithm && serverAlgorithm.problemId) {
          localAlgorithm = LocalStorageManager.loadAlgorithmByProblemId(serverAlgorithm.problemId)
        }

        // Update if we found a more recent version
        if (localAlgorithm) {
          const localLastModified = (localAlgorithm as any).lastModified || 0
          const serverLastModified = serverAlgorithm.lastModified || 0

          if (localLastModified > serverLastModified) {
            console.log('📦 Loading updated algorithm from localStorage:', localAlgorithm.title)
            setAlgorithm(localAlgorithm as any)
          }
        }
      } catch (error) {
        console.warn('Failed to check localStorage for algorithm updates:', error)
      }
    }

    checkLocalStorage()
  }, [serverAlgorithm.id, serverAlgorithm.problemId, serverAlgorithm.lastModified])

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
                  Back to Discovery 222222
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
                  algorithm.generatedAnimations?.find(anim => anim.library === 'd3') ? (
                    <EnhancedD3Visualization
                      algorithmData={algorithm}
                      animations={algorithm.generatedAnimations.find(anim => anim.library === 'd3')?.frames || []}
                      currentStep={currentStep}
                      onStepChange={handleStepChange}
                    />
                  ) : (
                    <D3Animation
                      steps={algorithm.animationStates}
                      currentStep={currentStep}
                      isPlaying={isPlaying}
                      onStepChange={handleStepChange}
                      onPlayPause={handlePlayPause}
                      onReset={handleReset}
                      algorithmId={algorithm.id}
                    />
                  )
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
              <TabsList className="grid w-full grid-cols-8">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="analogy">Analogy</TabsTrigger>
                <TabsTrigger value="code">Code</TabsTrigger>
                <TabsTrigger value="testing">Testing</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
                <TabsTrigger value="quality">Code Quality</TabsTrigger>
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
                      {algorithm.educationalContent?.keyInsights?.map((insight: string, index: number) => (
                        <li key={`edu-${index}`} className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                          <span className="text-sm leading-relaxed">{insight}</span>
                        </li>
                      ))}
                      {/* Show additional dynamic insights */}
                      {(algorithm as any).metadata?.difficultyBreakdown && (
                        <li className="flex items-start gap-3 mt-4 pt-4 border-t border-border">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                          <div className="text-sm">
                            <strong>Difficulty Breakdown:</strong>
                            <div className="mt-1 space-y-1">
                              <div>Understanding: {(algorithm as any).metadata.difficultyBreakdown.understanding}</div>
                              <div>Implementation: {(algorithm as any).metadata.difficultyBreakdown.implementation}</div>
                              <div>Optimization: {(algorithm as any).metadata.difficultyBreakdown.optimization}</div>
                            </div>
                          </div>
                        </li>
                      )}
                    </ul>
                  </CardContent>
                </Card>

                {algorithm.educationalContent?.commonMistakes && algorithm.educationalContent.commonMistakes.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-orange-600" />
                        Common Mistakes to Avoid
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {algorithm.educationalContent.commonMistakes.map((mistake: string, index: number) => (
                          <li key={index} className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                            <span className="text-sm leading-relaxed">{mistake}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {algorithm.educationalContent?.optimizationTips && algorithm.educationalContent.optimizationTips.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Zap className="h-5 w-5 text-green-600" />
                        Optimization Tips
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {algorithm.educationalContent.optimizationTips.map((tip: string, index: number) => (
                          <li key={index} className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                            <span className="text-sm leading-relaxed">{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="analogy" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="h-5 w-5" />
                      {algorithm.analogy?.title}
                    </CardTitle>
                    <CardDescription>Understanding through real-world comparison</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="prose prose-sm max-w-none">
                      <p className="whitespace-pre-line leading-relaxed">{algorithm.analogy?.content}</p>
                    </div>
                    {algorithm.educationalContent?.analogy?.visualAid && (
                      <div className="mt-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                        <h4 className="font-medium text-purple-800 dark:text-purple-200 mb-2 flex items-center gap-2">
                          <Box className="h-4 w-4" />
                          Visual Aid
                        </h4>
                        <p className="text-sm text-purple-700 dark:text-purple-300">
                          {algorithm.educationalContent.analogy.visualAid}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="code" className="space-y-6">
                <div className="grid gap-6">
                  {/* Brute Force Implementation - Only show if it exists */}
                  {algorithm.implementations?.bruteForce && (
                    <Card>
                      <CardHeader>
                        <CardTitle>{algorithm.implementations.bruteForce?.title || 'Brute Force Approach'}</CardTitle>
                        <CardDescription>
                          Time: {algorithm.implementations.bruteForce?.timeComplexity || 'O(n²)'} • Space:{" "}
                          {algorithm.implementations.bruteForce?.spaceComplexity || 'O(1)'}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                      <div className="relative">
                        <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm font-mono leading-relaxed border border-slate-700">
                          <code className="language-javascript">
                            {algorithm.implementations.bruteForce?.code || `// Brute force implementation not available

function bruteForceSolution(input) {
  // TODO: Implement brute force approach
  // Time Complexity: O(n²)
  // Space Complexity: O(1)
  return null;
}`}
                          </code>
                        </pre>
                        <button
                          onClick={() => navigator.clipboard.writeText(algorithm.implementations.bruteForce?.code || '')}
                          className="absolute top-3 right-3 bg-slate-700 hover:bg-slate-600 text-white px-3 py-1 rounded text-xs transition-colors"
                        >
                          📋 Copy
                        </button>
                      </div>
                      {algorithm.implementations.bruteForce?.explanation && (
                        <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                          <p className="text-sm text-blue-800 dark:text-blue-200">
                            <strong>💡 Explanation:</strong> {algorithm.implementations.bruteForce.explanation}
                          </p>
                          {algorithm.implementations.bruteForce.whenToUse && (
                            <p className="text-sm text-blue-700 dark:text-blue-300 mt-2">
                              <strong>🎯 When to use:</strong> {algorithm.implementations.bruteForce.whenToUse}
                            </p>
                          )}
                        </div>
                      )}
                      </CardContent>
                    </Card>
                  )}

                  {/* Optimized Implementation */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Zap className="h-5 w-5 text-secondary" />
                        {algorithm.implementations?.optimized?.title || 'Optimized Solution'}
                      </CardTitle>
                      <CardDescription>
                        Time: {algorithm.implementations?.optimized?.timeComplexity || 'O(n)'} • Space:{" "}
                        {algorithm.implementations?.optimized?.spaceComplexity || 'O(1)'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="relative">
                        <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm font-mono leading-relaxed border border-slate-700">
                          <code className="language-javascript">
                            {algorithm.implementations?.optimized?.code || `// Optimized implementation not available

function optimizedSolution(input) {
  // TODO: Implement optimized approach
  // Time Complexity: O(n)
  // Space Complexity: O(1)

  if (!input || input.length === 0) {
    return null;
  }

  // Optimized algorithm implementation
  // Use efficient data structures and algorithms

  return result;
}`}
                          </code>
                        </pre>
                        <button
                          onClick={() => navigator.clipboard.writeText(algorithm.implementations?.optimized?.code || '')}
                          className="absolute top-3 right-3 bg-slate-700 hover:bg-slate-600 text-white px-3 py-1 rounded text-xs transition-colors"
                        >
                          📋 Copy
                        </button>
                      </div>
                      {algorithm.implementations?.optimized?.explanation && (
                        <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                          <p className="text-sm text-green-800 dark:text-green-200">
                            <strong>🚀 Explanation:</strong> {algorithm.implementations.optimized.explanation}
                          </p>
                          {algorithm.implementations.optimized.whenToUse && (
                            <p className="text-sm text-green-700 dark:text-green-300 mt-2">
                              <strong>🎯 When to use:</strong> {algorithm.implementations.optimized.whenToUse}
                            </p>
                          )}
                        </div>
                      )}
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

              <TabsContent value="testing" className="space-y-6">
                <div className="grid gap-4">
                  {(algorithm as any).testingScenarios?.map((scenario: any, index: number) => (
                    <Card key={index} className={scenario.edgeCase ? "border-orange-200 dark:border-orange-800" : "border-green-200 dark:border-green-800"}>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                          {scenario.edgeCase ? <AlertCircle className="h-5 w-5 text-orange-600" /> : <CheckCircle className="h-5 w-5 text-green-600" />}
                          {scenario.scenario}
                          {scenario.edgeCase && <Badge variant="outline" className="text-orange-600">Edge Case</Badge>}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <h4 className="font-medium text-sm mb-1">Input:</h4>
                          <code className="bg-muted px-2 py-1 rounded text-sm">{scenario.input}</code>
                        </div>
                        <div>
                          <h4 className="font-medium text-sm mb-1">Expected Output:</h4>
                          <code className="bg-muted px-2 py-1 rounded text-sm">{scenario.expectedOutput}</code>
                        </div>
                      </CardContent>
                    </Card>
                  )) || (
                    <Card>
                      <CardContent className="text-center py-8">
                        <p className="text-muted-foreground">Testing scenarios will be available after uploading an algorithm.</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="performance" className="space-y-6">
                <div className="grid gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" />
                        Complexity Analysis
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <h4 className="font-medium">Time Complexity</h4>
                          <div className="space-y-1">
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Best Case:</span>
                              <Badge variant="outline">{(algorithm as any).performanceAnalysis?.bestCase || 'O(1)'}</Badge>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Average Case:</span>
                              <Badge variant="outline">{(algorithm as any).performanceAnalysis?.averageCase || 'O(n)'}</Badge>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Worst Case:</span>
                              <Badge variant="outline">{(algorithm as any).performanceAnalysis?.worstCase || 'O(n²)'}</Badge>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-medium">Space Complexity</h4>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Space:</span>
                            <Badge variant="outline">{(algorithm as any).performanceAnalysis?.spaceComplexity || 'O(1)'}</Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Activity className="h-5 w-5" />
                        Performance Characteristics
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Bottlenecks</h4>
                        <ul className="space-y-2">
                          {(algorithm as any).performanceAnalysis?.bottlenecks?.map((bottleneck: string, index: number) => (
                            <li key={index} className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                              <span className="text-sm">{bottleneck}</span>
                            </li>
                          )) || (
                            <li className="text-sm text-muted-foreground">Performance analysis available after upload</li>
                          )}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Scalability</h4>
                        <p className="text-sm text-muted-foreground">
                          {(algorithm as any).performanceAnalysis?.scalability || 'Scalability analysis available after upload'}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="quality" className="space-y-6">
                <div className="grid gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5" />
                        Code Quality Metrics
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">{(algorithm as any).codeQuality?.readability || 8}/10</div>
                          <div className="text-sm text-muted-foreground">Readability</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">{(algorithm as any).codeQuality?.efficiency || 9}/10</div>
                          <div className="text-sm text-muted-foreground">Efficiency</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-yellow-600">{(algorithm as any).codeQuality?.maintainability || 7}/10</div>
                          <div className="text-sm text-muted-foreground">Maintainability</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-600">{(algorithm as any).codeQuality?.documentation || 8}/10</div>
                          <div className="text-sm text-muted-foreground">Documentation</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-red-600">{(algorithm as any).codeQuality?.testability || 9}/10</div>
                          <div className="text-sm text-muted-foreground">Testability</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Lightbulb className="h-5 w-5" />
                        Best Practices
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {(algorithm as any).codeQuality?.bestPractices?.map((practice: string, index: number) => (
                          <li key={index} className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                            <span className="text-sm">{practice}</span>
                          </li>
                        )) || (
                          <li className="text-sm text-muted-foreground">Best practices available after upload</li>
                        )}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Brain className="h-5 w-5" />
                        Interview Preparation
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {(algorithm as any).educationalContent?.interviewTips?.map((tip: string, index: number) => (
                          <li key={index} className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
                            <span className="text-sm">{tip}</span>
                          </li>
                        )) || (
                          <li className="text-sm text-muted-foreground">Interview tips available after upload</li>
                        )}
                      </ul>
                    </CardContent>
                  </Card>
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
