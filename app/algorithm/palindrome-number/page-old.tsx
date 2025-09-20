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
  animation: {
    interactiveData: any
  }
  metadata: {
    tags: string[]
    acceptanceRate?: string
    frequency?: number
  }
  constraints: string[]
  solution: {
    javascript: string
    explanation: string
  }
}

const ALGORITHM_DATA: AlgorithmData = {
  problemId: 9,
  title: "Palindrome Number Check",
  description: "Given an integer `x`, determine whether it is a palindrome. An integer is a palindrome if it reads the same backward as forward. For example, `121` is a palindrome, while `123` is not. Negative numbers are not considered palindromes since the minus sign affects the symmetry.",
  difficulty: "Easy",
  category: "Math / String Manipulation",
  timeComplexity: "n",
  spaceComplexity: "n",
  examples: [
    {
      input: "121",
      output: "true",
      explanation: "Reversing '121' yields '121', which matches the original number."
    },
    {
      input: "-121",
      output: "false",
      explanation: "Negative numbers are automatically not palindromes due to the minus sign."
    },
    {
      input: "123",
      output: "false",
      explanation: "Reversing '123' yields '321', which does not match the original number."
    }
  ],
  problemStatement: "The task is to determine if a given integer `x` is a palindrome. The function should return `true` if the number reads the same backward as forward, and `false` otherwise. Negative numbers are not palindromes by definition in this context. The approach involves converting the number to a string, reversing it, and comparing it to the original number.",
  realWorldUse: "Palindrome checks are useful in data validation, error detection, and pattern recognition in fields like cryptography, data entry validation, and number theory research.",
  animation: {
    interactiveData: {
      algorithmType: "String Reversal Comparison",
      dataStructure: "String",
      keyOperations: [
        "Conversion to string",
        "Splitting",
        "Reversing",
        "Joining",
        "Comparison"
      ],
      visualizationHints: "Highlight string conversion, show reversal process step-by-step, emphasize comparison result."
    }
  },
  metadata: {
    tags: [
      "string manipulation",
      "number",
      "palindrome",
      "leetcode"
    ],
    acceptanceRate: "50.5%",
    frequency: 70
  },
  constraints: [
    "-2³¹ <= x <= 2³¹ - 1",
    "You must solve this problem without converting the integer to a string (if possible in your language)"
  ],
  solution: {
    javascript: `var isPalindrome = function(x) {
  if (x < 0) return false;

  // Convert to string and reverse
  const str = String(x);
  const reversed = str.split('').reverse().join('');

  // Compare with original (converted back to number)
  return parseInt(reversed) === x;
};`,
    explanation: "This solution first checks if the number is negative (negative numbers can't be palindromes). Then it converts the number to a string, reverses it using JavaScript's built-in array methods, and compares the reversed string (converted back to number) with the original number."
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

export default function PalindromenumberPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [selectedVisualization, setSelectedVisualization] = useState<'mermaid' | 'reactflow' | 'd3' | 'three'>('mermaid')

  const animationSteps = generateAnimationSteps(ALGORITHM_DATA)

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
              {ALGORITHM_DATA.title}
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl">
              {ALGORITHM_DATA.description}
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500 mb-2">Problem #{ALGORITHM_DATA.problemId}</div>
            <Badge className={getDifficultyColor(ALGORITHM_DATA.difficulty)}>
              {ALGORITHM_DATA.difficulty}
            </Badge>
          </div>
        </div>

        {/* Metadata */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium">Category:</span>
            <Badge variant="outline">{ALGORITHM_DATA.category}</Badge>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium">Time:</span>
            <Badge variant="outline">O({ALGORITHM_DATA.timeComplexity})</Badge>
          </div>
          <div className="flex items-center gap-2">
            <MemoryStick className="h-4 w-4 text-purple-600" />
            <span className="text-sm font-medium">Space:</span>
            <Badge variant="outline">O({ALGORITHM_DATA.spaceComplexity})</Badge>
          </div>
          {ALGORITHM_DATA.metadata.acceptanceRate && (
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-orange-600" />
              <span className="text-sm font-medium">Acceptance:</span>
              <Badge variant="outline">{ALGORITHM_DATA.metadata.acceptanceRate}</Badge>
            </div>
          )}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {ALGORITHM_DATA.metadata.tags.map(tag => (
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
                {ALGORITHM_DATA.description}
              </p>
            </CardContent>
          </Card>

          {/* Examples */}
          <Card>
            <CardHeader>
              <CardTitle>Examples</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {ALGORITHM_DATA.examples.map((example, index) => (
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
                {ALGORITHM_DATA.constraints.map((constraint, index) => (
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
                  <code>{ALGORITHM_DATA.solution.javascript}</code>
                </pre>
              </div>
              <div>
                <h4 className="font-medium mb-2">Explanation:</h4>
                <p className="text-gray-700 leading-relaxed">
                  {ALGORITHM_DATA.solution.explanation}
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
                      algorithmId="palindrome-number"
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
                      algorithmId="palindrome-number"
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
                      algorithmId="palindrome-number"
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
                      algorithmId="palindrome-number"
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