"use client"

import { AlgorithmDetailPage } from "@/components/algorithm-detail-page"
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
  analogy?: {
    title: string
    content: string
  }
  keyInsights?: string[]
  realWorldApplications?: Array<{
    domain: string
    application: string
    description: string
  }>
  engineeringLessons?: Array<{
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
    }
    optimized?: {
      title: string
      timeComplexity: string
      spaceComplexity: string
      code: string
    }
  }
  animationStates?: Array<{
    step: number
    title: string
    description: string
    data: any
  }>
  createdAt?: number
  lastModified?: number
}

const ALGORITHM_DATA: AlgorithmData = {
  problemId: 11,
  title: "Container With Most Water",
  description: "A search algorithm that uses iterative approach to solve the problem with O(n) time complexity.",
  difficulty: "Easy",
  category: "Search",
  timeComplexity: "O(n)",
  spaceComplexity: "O(1)",
  examples: [
  {
    "input": "Sample input",
    "output": "Sample output",
    "explanation": "Generated based on algorithm analysis"
  }
],
  problemStatement: "Find elements or properties within data structures efficiently.",
  realWorldUse: "Information retrieval, database queries, recommendation systems",
  constraints: [
  "Standard algorithm constraints apply"
],
  solution: {
  "javascript": "/**\n * 11. Container With Most Water\n * https://leetcode.com/problems/container-with-most-water/\n * Difficulty: Medium\n *\n * Given n non-negative integers `a1, a2, ..., an ,` where each represents a point at\n * coordinate `(i, ai)`. `n` vertical lines are drawn such that the two endpoints of\n * the line `i` is at `(i, ai)` and `(i, 0)`. Find two lines, which, together with the\n * x-axis forms a container, such that the container contains the most water.\n *\n * Notice that you may not slant the container.\n */\n\n/**\n * @param {number[]} height\n * @return {number}\n */\nvar maxArea = function(height) {\n  let maxArea = 0;\n\n  for (let left = 0, right = height.length - 1; left < right;) {\n    maxArea = Math.max(\n      maxArea,\n      Math.min(height[left], height[right]) * (right - left)\n    );\n\n    if (height[left] < height[right]) {\n      left++;\n    } else {\n      right--;\n    }\n  }\n\n  return maxArea;\n};\n",
  "explanation": "Optimized Solution"
},
  animation: {
    interactiveData: {
  "algorithmType": "search",
  "dataStructure": "Search",
  "keyOperations": [
    "Pointer movement"
  ],
  "visualizationHints": "Show search operations and data flow"
}
  },
  metadata: {
    tags: [
  "Search",
  "Two Pointers"
],
    acceptanceRate: "50%",
    frequency: 50
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
    description: "Set up initial variables and data structures",
    data: algorithmData.animation.interactiveData
  })

  steps.push({
    step: 2,
    title: "Processing",
    description: "Execute the main algorithm logic",
    data: algorithmData.animation.interactiveData
  })

  steps.push({
    step: 3,
    title: "Result",
    description: "Return the final result",
    data: algorithmData.animation.interactiveData
  })

  return steps
}

export default function ContainerwithmostwaterPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [selectedVisualization, setSelectedVisualization] = useState<'mermaid' | 'reactflow' | 'd3' | 'three'>('mermaid')
  const [algorithmData, setAlgorithmData] = useState<AlgorithmData>(ALGORITHM_DATA)
  const [isClient, setIsClient] = useState(false)

  // Load from LocalStorageManager on mount (client-side only)
  useEffect(() => {
    setIsClient(true)
    if (typeof window !== 'undefined') {
      const localStorageAlgorithm = LocalStorageManager.loadAlgorithm("container-with-most-water")
      if (localStorageAlgorithm) {
        setAlgorithmData(localStorageAlgorithm)
      } else {
        // Save the hardcoded data to LocalStorageManager if not exists
        LocalStorageManager.saveAlgorithm({
          ...ALGORITHM_DATA,
          id: "container-with-most-water",
          createdAt: Date.now(),
          lastModified: Date.now()
        })
      }

      // Mark as recently used
      LocalStorageManager.markAlgorithmAsUsed("container-with-most-water")
    }
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
    <div className="container mx-auto p-6 max-w-7xl" suppressHydrationWarning>
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
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full" suppressHydrationWarning>
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
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg" suppressHydrationWarning>
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

                {/* Animation Content - Only render on client to prevent hydration issues */}
                <div className="min-h-[500px] border rounded-lg p-4" suppressHydrationWarning>
                  {isClient ? (
                    <>
                      {selectedVisualization === 'mermaid' && (
                        <MermaidAnimation
                          steps={animationSteps}
                          currentStep={currentStep}
                          isPlaying={isPlaying}
                          onStepChange={setCurrentStep}
                          onPlayPause={() => setIsPlaying(!isPlaying)}
                          onReset={() => setCurrentStep(0)}
                          algorithmId={algorithmData.id || "container-with-most-water"}
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
                          algorithmId={algorithmData.id || "container-with-most-water"}
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
                          algorithmId={algorithmData.id || "container-with-most-water"}
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
                          algorithmId={algorithmData.id || "container-with-most-water"}
                        />
                      )}
                    </>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-gray-500">Loading visualization...</div>
                    </div>
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

