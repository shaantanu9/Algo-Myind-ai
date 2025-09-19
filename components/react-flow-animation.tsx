"use client"

import { useEffect, useState, useCallback, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ChevronLeft, ChevronRight, Play, Pause, RotateCcw, Zap, Clock, MemoryStick, MousePointer, ZoomIn } from "lucide-react"
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Controls,
  MiniMap,
  Background,
  BackgroundVariant,
  Panel,
} from 'reactflow'
import 'reactflow/dist/style.css'

interface AnimationStep {
  step: number
  title: string
  description: string
  data: any
}

interface ReactFlowAnimationProps {
  steps: AnimationStep[]
  currentStep: number
  isPlaying: boolean
  onStepChange: (step: number) => void
  onPlayPause: () => void
  onReset: () => void
  algorithmId: string
}

// Custom node types for enhanced visualization
const CustomNode = ({ data }: any) => {
  const isActive = data.isActive
  const isResult = data.isResult
  const isHighlighted = data.isHighlighted

  let bgColor = "bg-gray-100 border-gray-300 text-gray-800"
  let emoji = data.emoji || "📦"

  if (isResult) {
    bgColor = "bg-green-100 border-green-400 text-green-800"
    emoji = "🎯"
  } else if (isActive) {
    bgColor = "bg-blue-100 border-blue-400 text-blue-800 animate-pulse"
    emoji = "⚡"
  } else if (isHighlighted) {
    bgColor = "bg-purple-100 border-purple-400 text-purple-800"
    emoji = "💡"
  }

  return (
    <div className={`px-4 py-3 rounded-xl border-2 shadow-lg transition-all duration-300 ${bgColor}`}>
      <div className="flex items-center gap-2">
        <span className="text-lg">{emoji}</span>
        <div className="text-sm font-medium">
          {data.label}
          {data.subLabel && (
            <div className="text-xs opacity-75 mt-1">{data.subLabel}</div>
          )}
        </div>
      </div>
    </div>
  )
}

const nodeTypes = {
  custom: CustomNode,
}

export function ReactFlowAnimation({
  steps,
  currentStep,
  isPlaying,
  onStepChange,
  onPlayPause,
  onReset,
  algorithmId,
}: ReactFlowAnimationProps) {
  const [performanceMetrics, setPerformanceMetrics] = useState({
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    currentOperations: 0,
    totalOperations: 0
  })
  const [isAnimating, setIsAnimating] = useState(false)

  const initialNodes: Node[] = []
  const initialEdges: Edge[] = []

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  const generateReactFlowData = useCallback((step: AnimationStep, algorithmId: string) => {
    if (algorithmId === "two-sum") {
      return generateTwoSumFlow(step)
    }
    return generateDefaultFlow(step)
  }, [])

  const generateTwoSumFlow = (step: AnimationStep) => {
    const { array = [], target = 0, currentIndex = 0, hashMap = {}, complement, found, result } = step.data || {}
    const hashEntries = Object.entries(hashMap)
    const currentElement = array[currentIndex]
    const progress = (currentIndex + 1) / array.length * 100

    // Update performance metrics
    setPerformanceMetrics({
      timeComplexity: "O(n)",
      spaceComplexity: "O(n)",
      currentOperations: currentIndex + 1,
      totalOperations: array.length
    })

    const nodes: Node[] = [
      // Algorithm Header
      {
        id: "algorithm-header",
        type: "custom",
        position: { x: 300, y: -50 },
        data: {
          label: "🎯 Two Sum Algorithm",
          subLabel: `${Math.round(progress)}% Complete`,
          emoji: "🎯",
          isHighlighted: true
        },
      },
      // Target Node
      {
        id: "target",
        type: "custom",
        position: { x: 300, y: 50 },
        data: {
          label: `Target Value`,
          subLabel: target.toString(),
          emoji: "🎯",
          isHighlighted: true
        },
      },
    ]

    const edges: Edge[] = []

    // Array elements
    array.forEach((value: number, index: number) => {
      const isActive = index === currentIndex
      const isResult = result && result.includes(index)
      const isInMap = Object.values(hashMap).includes(index)

      nodes.push({
        id: `array-${index}`,
        type: "custom",
        position: { x: index * 120 - (array.length * 60) + 300, y: 150 },
        data: {
          label: value.toString(),
          subLabel: `Index: ${index}`,
          emoji: isResult ? "🎯" : isActive ? "⚡" : isInMap ? "💾" : "📦",
          isActive,
          isResult,
          isHighlighted: isInMap
        },
      })

      // Connect target to first element if this is the current one
      if (isActive) {
        edges.push({
          id: `target-to-current`,
          source: "target",
          target: `array-${index}`,
          animated: true,
          style: { stroke: "#3b82f6", strokeWidth: 3 },
          markerEnd: { type: "arrowclosed", color: "#3b82f6" }
        })
      }
    })

    // Current Processing Node
    if (currentElement !== undefined) {
      nodes.push({
        id: "current-processing",
        type: "custom",
        position: { x: 200, y: 250 },
        data: {
          label: "Current Element",
          subLabel: `${currentElement} (Index: ${currentIndex})`,
          emoji: "⚙️",
          isActive: true
        },
      })

      // Connect current array element to processing
      edges.push({
        id: "current-to-processing",
        source: `array-${currentIndex}`,
        target: "current-processing",
        animated: true,
        style: { stroke: "#8b5cf6", strokeWidth: 2 },
        markerEnd: { type: "arrowclosed", color: "#8b5cf6" }
      })
    }

    // Complement Node
    if (complement !== undefined) {
      const isComplementFound = hashMap[complement] !== undefined
      nodes.push({
        id: "complement",
        type: "custom",
        position: { x: 400, y: 250 },
        data: {
          label: "Looking for Complement",
          subLabel: complement.toString(),
          emoji: isComplementFound ? "✅" : "🔍",
          isResult: isComplementFound
        },
      })

      edges.push({
        id: "processing-to-complement",
        source: "current-processing",
        target: "complement",
        animated: true,
        style: { stroke: "#ec4899", strokeWidth: 2 },
        markerEnd: { type: "arrowclosed", color: "#ec4899" }
      })
    }

    // Hash Map Section
    if (hashEntries.length > 0 || currentElement !== undefined) {
      nodes.push({
        id: "hashmap-header",
        type: "custom",
        position: { x: 300, y: 350 },
        data: {
          label: "Hash Map (Memory)",
          subLabel: `${hashEntries.length} entries`,
          emoji: "🗂️",
          isHighlighted: true
        },
      })

      // Individual hash map entries
      hashEntries.forEach(([key, value], index) => {
        const isComplement = complement !== undefined && parseInt(key) === complement
        nodes.push({
          id: `hash-${index}`,
          type: "custom",
          position: { x: index * 120 - (hashEntries.length * 60) + 300, y: 450 },
          data: {
            label: key.toString(),
            subLabel: `→ ${value}`,
            emoji: isComplement ? "🎯" : "💾",
            isResult: isComplement,
            isHighlighted: isComplement
          },
        })

        edges.push({
          id: `hashmap-to-entry-${index}`,
          source: "hashmap-header",
          target: `hash-${index}`,
          animated: false,
          style: { stroke: "#06b6d4", strokeWidth: 1 },
          markerEnd: { type: "arrowclosed", color: "#06b6d4" }
        })

        // Connect complement to found hash entry
        if (isComplement) {
          edges.push({
            id: "complement-to-hash",
            source: "complement",
            target: `hash-${index}`,
            animated: true,
            style: { stroke: "#22c55e", strokeWidth: 3 },
            markerEnd: { type: "arrowclosed", color: "#22c55e" }
          })
        }
      })

      // Connect processing to hash map
      if (currentElement !== undefined) {
        edges.push({
          id: "processing-to-hashmap",
          source: "current-processing",
          target: "hashmap-header",
          animated: true,
          style: { stroke: "#06b6d4", strokeWidth: 2 },
          markerEnd: { type: "arrowclosed", color: "#06b6d4" }
        })
      }
    }

    // Result Node
    if (found && result) {
      nodes.push({
        id: "result",
        type: "custom",
        position: { x: 300, y: 550 },
        data: {
          label: "SOLUTION FOUND!",
          subLabel: `Indices: [${result.join(', ')}] | Values: [${result.map((i: number) => array[i]).join(', ')}]`,
          emoji: "🎉",
          isResult: true
        },
      })

      edges.push({
        id: "hashmap-to-result",
        source: "hashmap-header",
        target: "result",
        animated: true,
        style: { stroke: "#22c55e", strokeWidth: 4 },
        markerEnd: { type: "arrowclosed", color: "#22c55e" }
      })
    }

    return { nodes, edges }
  }

  const generateDefaultFlow = (step: AnimationStep) => {
    const nodes: Node[] = [
      {
        id: "step",
        type: "custom",
        position: { x: 250, y: 100 },
        data: {
          label: `Step ${step.step}`,
          subLabel: step.title,
          emoji: "📋",
          isHighlighted: true
        },
      },
      {
        id: "description",
        type: "custom",
        position: { x: 250, y: 250 },
        data: {
          label: "Description",
          subLabel: step.description,
          emoji: "💭"
        },
      },
    ]

    const edges: Edge[] = [
      {
        id: "e1",
        source: "step",
        target: "description",
        animated: true,
        style: { stroke: "#3b82f6", strokeWidth: 2 },
        markerEnd: { type: "arrowclosed", color: "#3b82f6" }
      }
    ]

    return { nodes, edges }
  }

  const onConnect = useCallback((params: Connection) => setEdges((eds) => addEdge(params, eds)), [setEdges])

  useEffect(() => {
    setIsAnimating(true)
    const timer = setTimeout(() => {
      if (steps[currentStep]) {
        const { nodes: newNodes, edges: newEdges } = generateReactFlowData(steps[currentStep], algorithmId)
        setNodes(newNodes)
        setEdges(newEdges)
      }
      setIsAnimating(false)
    }, 300)
    return () => clearTimeout(timer)
  }, [currentStep, steps, algorithmId, generateReactFlowData, setNodes, setEdges])

  // Enhanced auto-play with smooth transitions
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isPlaying && currentStep < steps.length - 1) {
      interval = setInterval(() => {
        setIsAnimating(true)
        setTimeout(() => {
          onStepChange(currentStep + 1)
          setIsAnimating(false)
        }, 300)
      }, 3000) // 3 seconds for React Flow animations
    } else if (isPlaying && currentStep >= steps.length - 1) {
      onPlayPause()
    }
    return () => clearInterval(interval)
  }, [isPlaying, currentStep, steps.length, onStepChange, onPlayPause])

  const canGoPrevious = currentStep > 0
  const canGoNext = currentStep < steps.length - 1
  const progress = ((currentStep + 1) / steps.length) * 100

  return (
    <div className="space-y-6">
      {/* Performance Metrics Header */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-blue-600" />
            <div>
              <p className="text-xs text-blue-600 font-medium">Time Complexity</p>
              <p className="text-lg font-bold text-blue-800">{performanceMetrics.timeComplexity}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800 p-4 rounded-lg border border-purple-200 dark:border-purple-700">
          <div className="flex items-center gap-2">
            <MemoryStick className="h-5 w-5 text-purple-600" />
            <div>
              <p className="text-xs text-purple-600 font-medium">Space Complexity</p>
              <p className="text-lg font-bold text-purple-800">{performanceMetrics.spaceComplexity}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 p-4 rounded-lg border border-green-200 dark:border-green-700">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-green-600" />
            <div>
              <p className="text-xs text-green-600 font-medium">Operations</p>
              <p className="text-lg font-bold text-green-800">{performanceMetrics.currentOperations}/{performanceMetrics.totalOperations}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900 dark:to-orange-800 p-4 rounded-lg border border-orange-200 dark:border-orange-700">
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 rounded-full border-2 border-orange-600 border-t-transparent animate-spin" />
            <div>
              <p className="text-xs text-orange-600 font-medium">Progress</p>
              <p className="text-lg font-bold text-orange-800">{Math.round(progress)}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced React Flow Container */}
      <div className="relative">
        <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 rounded-xl border-2 border-muted p-6 min-h-[600px] overflow-hidden shadow-lg">
          {isAnimating && (
            <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 flex items-center justify-center z-50 rounded-xl">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Building interactive flow...</p>
              </div>
            </div>
          )}

          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            fitView
            attributionPosition="top-right"
            className="bg-transparent"
          >
            <Controls className="bg-white/90 dark:bg-gray-800/90 border border-border rounded-lg shadow-lg" />
            <MiniMap
              className="bg-white/90 dark:bg-gray-800/90 border border-border rounded-lg shadow-lg"
              nodeColor={(node) => {
                if (node.data?.isResult) return "#22c55e"
                if (node.data?.isActive) return "#3b82f6"
                if (node.data?.isHighlighted) return "#8b5cf6"
                return "#6b7280"
              }}
            />
            <Background variant={BackgroundVariant.Dots} gap={20} size={1} />

            {/* Interactive Controls Panel */}
            <Panel position="top-left" className="bg-white/90 dark:bg-gray-800/90 p-3 rounded-lg shadow-lg border">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <MousePointer className="h-4 w-4" />
                <span>Drag to pan • </span>
                <ZoomIn className="h-4 w-4" />
                <span>Scroll to zoom</span>
              </div>
            </Panel>
          </ReactFlow>

          {/* Floating Progress Indicator */}
          <div className="absolute top-4 right-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg p-3 shadow-lg border">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                Step {currentStep + 1}/{steps.length}
              </Badge>
              <Progress value={progress} className="w-20 h-2" />
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Step Information */}
      <div className="bg-gradient-to-r from-muted/30 to-muted/50 rounded-xl p-6 border border-muted">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <span className="text-xl font-bold text-primary">{currentStep + 1}</span>
            </div>
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-xl mb-2 text-foreground">{steps[currentStep]?.title}</h3>
            <p className="text-muted-foreground text-base leading-relaxed">{steps[currentStep]?.description}</p>
          </div>
        </div>
      </div>

      {/* Enhanced Animation Controls */}
      <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onStepChange(currentStep - 1)}
              disabled={!canGoPrevious}
              className="hover:scale-105 transition-transform"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            <div className="flex items-center gap-2 px-4 py-2 bg-muted/50 rounded-lg">
              <span className="text-sm font-medium">Step</span>
              <Badge variant="secondary" className="font-bold">
                {currentStep + 1} / {steps.length}
              </Badge>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onStepChange(currentStep + 1)}
              disabled={!canGoNext}
              className="hover:scale-105 transition-transform"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={onReset}
              className="hover:scale-105 transition-transform"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>

            <Button
              variant={isPlaying ? "destructive" : "default"}
              size="sm"
              onClick={onPlayPause}
              className="hover:scale-105 transition-transform px-6"
            >
              {isPlaying ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
              {isPlaying ? "Pause" : "Auto Play"}
            </Button>
          </div>
        </div>
      </div>

      {/* Enhanced Step Indicator */}
      <div className="flex items-center justify-center gap-2">
        {steps.map((_, index) => (
          <button
            key={index}
            onClick={() => onStepChange(index)}
            className={`relative group transition-all duration-300 ${
              index === currentStep
                ? "w-8 h-8 bg-primary shadow-lg scale-125"
                : index < currentStep
                  ? "w-6 h-6 bg-primary/70 hover:bg-primary/80"
                  : "w-4 h-4 bg-muted-foreground/30 hover:bg-muted-foreground/50"
            } rounded-full hover:scale-110`}
            aria-label={`Go to step ${index + 1}`}
          >
            {index === currentStep && (
              <div className="absolute inset-0 rounded-full border-2 border-primary/30 animate-ping"></div>
            )}
            {index < currentStep && (
              <div className="absolute inset-0 rounded-full bg-primary/20 animate-pulse"></div>
            )}
          </button>
        ))}
      </div>

      {/* Interactive Features Guide */}
      <div className="bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 rounded-lg p-4 border border-cyan-200 dark:border-cyan-700">
        <div className="flex items-start gap-3">
          <div className="text-2xl">🎮</div>
          <div>
            <h4 className="font-semibold text-cyan-800 dark:text-cyan-200 mb-1">Interactive Flow Features</h4>
            <p className="text-sm text-cyan-700 dark:text-cyan-300">
              🖱️ <strong>Drag nodes</strong> to explore • 🔍 <strong>Zoom and pan</strong> for details • 📊 <strong>Minimap navigation</strong> •
              ⚡ <strong>Animated connections</strong> show data flow • 🎯 <strong>Click nodes</strong> for more info
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
