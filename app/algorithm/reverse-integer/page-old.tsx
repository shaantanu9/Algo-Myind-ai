"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Play,
  Pause,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Code,
  BookOpen,
  BarChart3,
  Zap,
  CheckCircle,
  AlertCircle,
  Clock,
  MemoryStick,
  Target,
  TrendingUp
} from "lucide-react"

// Animation Components
import { MermaidAnimation } from "@/components/mermaid-animation"
import { ReactFlowAnimation } from "@/components/react-flow-animation"
import { D3Animation } from "@/components/d3-animation"
import { ThreeAnimation } from "@/components/three-animation"

// Local Storage Manager
import { LocalStorageManager } from "@/lib/local-storage-manager"

interface AlgorithmData {
  problemId: number
  title: string
  description: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  category: string
  timeComplexity: string
  spaceComplexity: string
  examples: Array<{
    input: string
    output: string
    explanation: string
  }>
  problemStatement: string
  realWorldUse: string
  constraints: string[]
  solution: {
    javascript: string
    explanation: string
  }
  animation: {
    interactiveData: any
  }
  metadata: {
    tags: string[]
    acceptanceRate?: string
    frequency?: number
  }
  id?: string
  popularity?: number
  estimatedTime?: string
}

const ALGORITHM_DATA: AlgorithmData = {
  problemId: 7,
  title: "Reverse Integer",
  description: "This algorithm takes a signed 32-bit integer as input, reverses its digits, and returns the reversed integer. If the reversed integer exceeds the 32-bit integer range, it returns 0.",
  difficulty: "Easy",
  category: "Math",
  timeComplexity: "O(log n)",
  spaceComplexity: "O(1)",
  examples: [
    {
      input: "123",
      output: "321",
      explanation: "The digits of the number 123 are reversed to form the number 321."
    },
    {
      input: "-123",
      output: "-321",
      explanation: "The digits of the number 123 are reversed to form the number 321. The sign is preserved, so the result is -321."
    },
    {
      input: "1534236469",
      output: "0",
      explanation: "The reversed number exceeds the 32-bit integer range, so the function returns 0."
    }
  ],
  problemStatement: "This algorithm takes a signed 32-bit integer as input, reverses its digits, and returns the reversed integer. If the reversed integer exceeds the 32-bit integer range, it returns 0.",
  realWorldUse: "Integer reversal is commonly used in mathematical computations, data processing, and algorithmic problem-solving.",
  constraints: [
    "-2^31 <= x <= 2^31 - 1",
    "You must solve this problem without converting the integer to a string (if possible in your language)"
  ],
  solution: {
    javascript: `var reverse = function(x) {
  let result = 0;
  const sign = x < 0 ? -1 : 1;
  x = Math.abs(x);

  while (x > 0) {
    const digit = x % 10;
    result = result * 10 + digit;

    // Check for overflow
    if (result > Math.pow(2, 31) - 1) {
      return 0;
    }

    x = Math.floor(x / 10);
  }

  return result * sign;
};`,
    explanation: "This solution reverses an integer by iteratively extracting digits from the end and building the reversed number. It handles overflow by checking if the result exceeds the 32-bit integer range, and preserves the sign of the original number."
  },
  animation: {
    interactiveData: {
      algorithmType: "Math",
      dataStructure: "Integer",
      keyOperations: [
        "Extract digits",
        "Build reversed number",
        "Check overflow",
        "Apply sign"
      ],
      visualizationHints: "Show digit extraction process and number building step by step"
    }
  },
  metadata: {
    tags: [
      "Math",
      "Integer",
      "Overflow",
      "Bit Manipulation"
    ],
    acceptanceRate: "25.4%",
    frequency: 85
  }
}

// Generate animation steps based on algorithm type
const generateAnimationSteps = (algorithmData: AlgorithmData) => {
  const steps = []

  // Basic algorithm steps
  steps.push({
    step: 0,
    title: "Algorithm Overview",
    description: algorithmData.description,
    data: algorithmData.animation.interactiveData
  })

  steps.push({
    step: 1,
    title: "Initialization",
    description: "Set up initial variables and handle sign",
    data: algorithmData.animation.interactiveData
  })

  steps.push({
    step: 2,
    title: "Digit Extraction Loop",
    description: "Extract digits and build reversed number",
    data: algorithmData.animation.interactiveData
  })

  steps.push({
    step: 3,
    title: "Overflow Check",
    description: "Verify the result doesn't exceed integer limits",
    data: algorithmData.animation.interactiveData
  })

  steps.push({
    step: 4,
    title: "Apply Sign",
    description: "Apply the original sign to the result",
    data: algorithmData.animation.interactiveData
  })

  return steps
}

export default function ReverseIntegerPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [selectedVisualization, setSelectedVisualization] = useState<'mermaid' | 'reactflow' | 'd3' | 'three'>('mermaid')
  const [algorithmData, setAlgorithmData] = useState<AlgorithmData>(ALGORITHM_DATA)

  // Load from LocalStorageManager on mount
  useEffect(() => {
    const localStorageAlgorithm = LocalStorageManager.loadAlgorithm("reverse-integer")
    if (localStorageAlgorithm) {
      setAlgorithmData(localStorageAlgorithm)
    } else {
      // Save the hardcoded data to LocalStorageManager if not exists
      LocalStorageManager.saveAlgorithm({
        ...ALGORITHM_DATA,
        id: "reverse-integer",
        createdAt: Date.now(),
        lastModified: Date.now()
      })
    }

    // Mark as recently used
    LocalStorageManager.markAlgorithmAsUsed("reverse-integer")
  }, [])

  const animationSteps = generateAnimationSteps(algorithmData)

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'bg-green-100 text-green-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'hard': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {algorithmData.title}
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl">
              {algorithmData.description}
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500 mb-2">Problem #{algorithmData.problemId}</div>
            <Badge className={getDifficultyColor(algorithmData.difficulty)}>
              {algorithmData.difficulty}
            </Badge>
          </div>
        </div>

        {/* Metadata */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium">Category:</span>
            <Badge variant="outline">{algorithmData.category}</Badge>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium">Time:</span>
            <Badge variant="outline">O({algorithmData.timeComplexity})</Badge>
          </div>
          <div className="flex items-center gap-2">
            <MemoryStick className="h-4 w-4 text-purple-600" />
            <span className="text-sm font-medium">Space:</span>
            <Badge variant="outline">O({algorithmData.spaceComplexity})</Badge>
          </div>
          {algorithmData.metadata.acceptanceRate && (
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-orange-600" />
              <span className="text-sm font-medium">Acceptance:</span>
              <Badge variant="outline">{algorithmData.metadata.acceptanceRate}</Badge>
            </div>
          )}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {algorithmData.metadata.tags.map(tag => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="solution" className="flex items-center gap-2">
            <Code className="h-4 w-4" />
            Solution
          </TabsTrigger>
          <TabsTrigger value="animation" className="flex items-center gap-2">
            <Play className="h-4 w-4" />
            Animation
          </TabsTrigger>
          <TabsTrigger value="interactive" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Interactive
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Problem Description */}
          <Card>
            <CardHeader>
              <CardTitle>Problem Statement</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">
                {algorithmData.description}
              </p>
            </CardContent>
          </Card>

          {/* Examples */}
          <Card>
            <CardHeader>
              <CardTitle>Examples</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {algorithmData.examples.map((example, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="space-y-2">
                    <div>
                      <span className="font-medium text-blue-600">Input:</span>
                      <code className="ml-2 bg-gray-100 px-2 py-1 rounded text-sm">
                        {example.input}
                      </code>
                    </div>
                    <div>
                      <span className="font-medium text-green-600">Output:</span>
                      <code className="ml-2 bg-gray-100 px-2 py-1 rounded text-sm">
                        {example.output}
                      </code>
                    </div>
                    <div>
                      <span className="font-medium text-purple-600">Explanation:</span>
                      <p className="ml-2 text-gray-700 mt-1">{example.explanation}</p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Constraints */}
          <Card>
            <CardHeader>
              <CardTitle>Constraints</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-1">
                {algorithmData.constraints.map((constraint, index) => (
                  <li key={index} className="text-gray-700">{constraint}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="solution" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                Solution
              </CardTitle>
              <CardDescription>
                Complete JavaScript implementation with detailed explanation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">JavaScript Code:</h4>
                <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
                  <code>{algorithmData.solution.javascript}</code>
                </pre>
              </div>
              <div>
                <h4 className="font-medium mb-2">Explanation:</h4>
                <p className="text-gray-700 leading-relaxed">
                  {algorithmData.solution.explanation}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="animation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="h-5 w-5" />
                Algorithm Animation
              </CardTitle>
              <CardDescription>
                Step-by-step visualization of the algorithm execution
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Visualization Type Selector */}
                <div className="flex gap-2">
                  {[
                    { id: 'mermaid', label: 'Flowchart', icon: BookOpen },
                    { id: 'reactflow', label: 'Interactive', icon: Zap },
                    { id: 'd3', label: 'Data Viz', icon: BarChart3 },
                    { id: 'three', label: '3D', icon: Target }
                  ].map(({ id, label, icon: Icon }) => (
                    <Button
                      key={id}
                      variant={selectedVisualization === id ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedVisualization(id as any)}
                      className="flex items-center gap-2"
                    >
                      <Icon className="h-4 w-4" />
                      {label}
                    </Button>
                  ))}
                </div>

                {/* Animation Controls */}
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                    disabled={currentStep === 0}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsPlaying(!isPlaying)}
                  >
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentStep(0)}
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentStep(Math.min(animationSteps.length - 1, currentStep + 1))}
                    disabled={currentStep === animationSteps.length - 1}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>

                  <div className="flex-1 mx-4">
                    <Progress value={(currentStep + 1) / animationSteps.length * 100} className="h-2" />
                  </div>

                  <span className="text-sm text-gray-600">
                    {currentStep + 1} / {animationSteps.length}
                  </span>
                </div>

                {/* Animation Content */}
                <div className="min-h-[500px] border rounded-lg p-4">
                  {selectedVisualization === 'mermaid' && (
                    <MermaidAnimation
                      steps={animationSteps}
                      currentStep={currentStep}
                      isPlaying={isPlaying}
                      onStepChange={setCurrentStep}
                      onPlayPause={() => setIsPlaying(!isPlaying)}
                      onReset={() => setCurrentStep(0)}
                      algorithmId={algorithmData.id || "reverse-integer"}
                    />
                  )}
                  {selectedVisualization === 'reactflow' && (
                    <ReactFlowAnimation
                      steps={animationSteps}
                      currentStep={currentStep}
                      isPlaying={isPlaying}
                      onStepChange={setCurrentStep}
                      onPlayPause={() => setIsPlaying(!isPlaying)}
                      onReset={() => setCurrentStep(0)}
                      algorithmId={algorithmData.id || "reverse-integer"}
                    />
                  )}
                  {selectedVisualization === 'd3' && (
                    <D3Animation
                      steps={animationSteps}
                      currentStep={currentStep}
                      isPlaying={isPlaying}
                      onStepChange={setCurrentStep}
                      onPlayPause={() => setIsPlaying(!isPlaying)}
                      onReset={() => setCurrentStep(0)}
                      algorithmId={algorithmData.id || "reverse-integer"}
                    />
                  )}
                  {selectedVisualization === 'three' && (
                    <ThreeAnimation
                      steps={animationSteps}
                      currentStep={currentStep}
                      isPlaying={isPlaying}
                      onStepChange={setCurrentStep}
                      onPlayPause={() => setIsPlaying(!isPlaying)}
                      onReset={() => setCurrentStep(0)}
                      algorithmId={algorithmData.id || "reverse-integer"}
                    />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="interactive" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Interactive Learning
              </CardTitle>
              <CardDescription>
                Explore the algorithm with hands-on interactive elements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Interactive features coming soon! This section will include practice problems,
                    code editors, and interactive quizzes.
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
