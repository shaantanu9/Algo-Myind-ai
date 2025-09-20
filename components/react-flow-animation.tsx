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
import { alphabetServer, createTypingAnimation, createWaveAnimation, create3DAnimation, createWordAnimation } from "@/lib/alphabet-server"

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
  const [textAnimations, setTextAnimations] = useState<Map<string, any>>(new Map())
  const [currentTextAnimation, setCurrentTextAnimation] = useState<string | null>(null)
  const [textAnimationProgress, setTextAnimationProgress] = useState(0)
  const [flowTextElements, setFlowTextElements] = useState<Map<string, any>>(new Map())

  const initialNodes: Node[] = []
  const initialEdges: Edge[] = []

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  const generateReactFlowData = useCallback((step: AnimationStep, algorithmId: string) => {
    // Enhanced algorithm detection for AI-generated JSON
    if (algorithmId === "two-sum" || (step.data?.array && step.data?.target)) {
      return generateTwoSumFlow(step)
    }
    if (algorithmId === "container-with-most-water" || step.data?.array?.length > 0) {
      return generateContainerWithMostWaterFlow(step)
    }
    if (algorithmId === "shortest-palindrome" || step.data?.original !== undefined) {
      return generateStringManipulationFlow(step)
    }
    if (algorithmId === "reverse-integer" || step.data?.original !== undefined) {
      return generateMathFlow(step)
    }
    if (algorithmId.includes("partition") || step.data?.lessHead || step.data?.greaterHead) {
      return generateLinkedListFlow(step)
    }
    return generateDefaultFlow(step)
  }, [])

  const generateContainerWithMostWaterFlow = (step: AnimationStep) => {
    const { array = [], left = 0, right = array.length - 1, currentArea = 0, maxArea = 0 } = step.data || {}
    const nodes: Node[] = []
    const edges: Edge[] = []

    // Algorithm header
    nodes.push({
      id: "algorithm-header",
      type: "custom",
      position: { x: 300, y: -50 },
      data: {
        label: "🏗️ Container With Most Water",
        subLabel: `Area: ${currentArea}`,
        emoji: "🏗️",
        isHighlighted: true
      },
    })

    // Array elements as bars
    array.forEach((height: number, index: number) => {
      const isActive = index === left || index === right
      const isInRange = index >= left && index <= right

      nodes.push({
        id: `bar-${index}`,
        type: "custom",
        position: { x: index * 80 - (array.length * 40) + 300, y: 100 },
        data: {
          label: height.toString(),
          subLabel: `Index: ${index}`,
          emoji: isActive ? "🎯" : isInRange ? "💧" : "📦",
          isActive,
          isHighlighted: isInRange,
          height: height * 2 // Scale for visualization
        },
      })
    })

    // Pointers
    nodes.push({
      id: "left-pointer",
      type: "custom",
      position: { x: left * 80 - (array.length * 40) + 300, y: 200 },
      data: {
        label: "Left",
        subLabel: `Index: ${left}`,
        emoji: "👈",
        isActive: true
      },
    })

    nodes.push({
      id: "right-pointer",
      type: "custom",
      position: { x: right * 80 - (array.length * 40) + 300, y: 200 },
      data: {
        label: "Right",
        subLabel: `Index: ${right}`,
        emoji: "👉",
        isActive: true
      },
    })

    // Results
    nodes.push({
      id: "current-area",
      type: "custom",
      position: { x: 100, y: 300 },
      data: {
        label: "Current Area",
        subLabel: currentArea.toString(),
        emoji: "📊",
        isHighlighted: true
      },
    })

    nodes.push({
      id: "max-area",
      type: "custom",
      position: { x: 300, y: 300 },
      data: {
        label: "Max Area",
        subLabel: maxArea.toString(),
        emoji: "🏆",
        isHighlighted: true
      },
    })

    return { nodes, edges }
  }

  const generateStringManipulationFlow = (step: AnimationStep) => {
    const nodes: Node[] = []
    const edges: Edge[] = []

    // Handle different data formats from AI-generated JSON
    let originalString = ""
    let reversedString = ""
    let currentIndex = 0
    let s_slice = ""
    let reversed_slice = ""
    let result = ""

    if (step.data) {
      if (typeof step.data.original === 'string') {
        originalString = step.data.original
      } else if (Array.isArray(step.data.original)) {
        originalString = step.data.original.map((char: any) => char.char || char).join('')
      }

      if (typeof step.data.reversed === 'string') {
        reversedString = step.data.reversed
      } else if (Array.isArray(step.data.reversed)) {
        reversedString = step.data.reversed.map((char: any) => char.char || char).join('')
      }

      currentIndex = step.data.currentIndex || step.data.i || 0
      s_slice = step.data.s_slice || ""
      reversed_slice = step.data.reversed_slice || ""
      result = step.data.result || ""
    }

    // Algorithm header
    nodes.push({
      id: "algorithm-header",
      type: "custom",
      position: { x: 350, y: -50 },
      data: {
        label: "🔄 Shortest Palindrome",
        subLabel: `Finding palindromic prefix`,
        emoji: "🔄",
        isHighlighted: true
      },
    })

    // Input string node
    nodes.push({
      id: "input-string",
      type: "custom",
      position: { x: 50, y: 50 },
      data: {
        label: "Input String",
        subLabel: `"${originalString}"`,
        emoji: "📥",
        isHighlighted: true
      },
    })

    // Reverse operation node
    nodes.push({
      id: "reverse-operation",
      type: "custom",
      position: { x: 350, y: 50 },
      data: {
        label: "Reverse String",
        subLabel: `"${reversedString}"`,
        emoji: "🔄",
        isActive: step.step === 1
      },
    })

    // Connect input to reverse
    edges.push({
      id: "input-to-reverse",
      source: "input-string",
      target: "reverse-operation",
      type: "smoothstep",
      animated: step.step >= 1,
      style: { stroke: '#3b82f6', strokeWidth: 3 }
    })

    // Original string character nodes
    const originalChars = originalString.split('')
    originalChars.forEach((char: string, index: number) => {
      const isActive = index === currentIndex
      nodes.push({
        id: `orig-${index}`,
        type: "custom",
        position: { x: index * 70 + 50, y: 150 },
        data: {
          label: char,
          subLabel: `[${index}]`,
          emoji: isActive ? "🎯" : "📝",
          isActive,
          isHighlighted: isActive
        },
      })
    })

    // Reversed string character nodes
    const reversedChars = reversedString.split('')
    reversedChars.forEach((char: string, index: number) => {
      const isActive = index === currentIndex
      nodes.push({
        id: `rev-${index}`,
        type: "custom",
        position: { x: index * 70 + 50, y: 250 },
        data: {
          label: char,
          subLabel: `[${index}]`,
          emoji: isActive ? "🎯" : "🔄",
          isActive,
          isHighlighted: isActive
        },
      })
    })

    // Comparison node (appears in step 2-3)
    if (step.step >= 2 && s_slice && reversed_slice) {
      nodes.push({
        id: "comparison-node",
        type: "custom",
        position: { x: 350, y: 350 },
        data: {
          label: "Compare Slices",
          subLabel: s_slice === reversed_slice ? "✅ MATCH" : "❌ NO MATCH",
          emoji: s_slice === reversed_slice ? "✅" : "❌",
          isActive: step.step === 3,
          isHighlighted: step.step === 3
        },
      })

      // Connect some original characters to comparison
      if (currentIndex < originalChars.length) {
        edges.push({
          id: `orig-${currentIndex}-to-comparison`,
          source: `orig-${currentIndex}`,
          target: "comparison-node",
          type: "smoothstep",
          animated: step.step >= 3,
          style: { stroke: '#3b82f6', strokeWidth: 2 }
        })
      }

      // Connect some reversed characters to comparison
      if (currentIndex < reversedChars.length) {
        edges.push({
          id: `rev-${currentIndex}-to-comparison`,
          source: `rev-${currentIndex}`,
          target: "comparison-node",
          type: "smoothstep",
          animated: step.step >= 3,
          style: { stroke: '#10b981', strokeWidth: 2 }
        })
      }
    }

    // Result node (appears when we find a match)
    if (result) {
      nodes.push({
        id: "result-node",
        type: "custom",
        position: { x: 350, y: 450 },
        data: {
          label: "Shortest Palindrome",
          subLabel: `"${result}"`,
          emoji: "🏆",
          isHighlighted: true
        },
      })

      // Connect comparison to result
      edges.push({
        id: "comparison-to-result",
        source: "comparison-node",
        target: "result-node",
        type: "smoothstep",
        animated: true,
        style: { stroke: '#7c3aed', strokeWidth: 3 }
      })
    }

    // Processing indicator
    nodes.push({
      id: "processing-indicator",
      type: "custom",
      position: { x: 600, y: 50 },
      data: {
        label: `Processing Length`,
        subLabel: `i = ${currentIndex}`,
        emoji: "⚡",
        isActive: true
      },
    })

  return { nodes, edges }
}

const generateLinkedListFlow = (step: AnimationStep) => {
  const nodes: Node[] = []
  const edges: Edge[] = []

  // Handle different data formats from AI-generated JSON
  const {
    lessHead,
    greaterHead,
    less,
    greater,
    currentNode,
    lessList = [],
    greaterList = [],
    finalList = [],
    partitionValue = 3
  } = step.data || {}

  // Algorithm header
  nodes.push({
    id: "algorithm-header",
    type: "custom",
    position: { x: 400, y: -100 },
    data: {
      label: "🔗 Linked List Partition",
      subLabel: `Partition value: ${partitionValue}`,
      emoji: "🔗",
      isHighlighted: true
    },
  })

  // Less-than list header
  nodes.push({
    id: "less-header",
    type: "custom",
    position: { x: 100, y: 50 },
    data: {
      label: "Less Than",
      subLabel: `< ${partitionValue}`,
      emoji: "⬇️",
      isActive: step.step >= 3
    },
  })

  // Greater-than list header
  nodes.push({
    id: "greater-header",
    type: "custom",
    position: { x: 600, y: 50 },
    data: {
      label: "Greater Than",
      subLabel: `>= ${partitionValue}`,
      emoji: "⬆️",
      isActive: step.step >= 4
    },
  })

  // Create nodes for less-than list
  lessList.forEach((node: any, index: number) => {
    const nodeId = `less-${index}`
    nodes.push({
      id: nodeId,
      type: "custom",
      position: { x: 50 + index * 100, y: 150 },
      data: {
        label: node.value || node.val || node,
        subLabel: `Node ${index}`,
        emoji: "🔵",
        isActive: step.step >= 3
      },
    })

    // Connect nodes in less-than list
    if (index > 0) {
      edges.push({
        id: `less-edge-${index - 1}-${index}`,
        source: `less-${index - 1}`,
        target: nodeId,
        type: "smoothstep",
        animated: step.step >= 3,
        style: { stroke: '#10b981', strokeWidth: 3 },
        label: "next"
      })
    }
  })

  // Create nodes for greater-than list
  greaterList.forEach((node: any, index: number) => {
    const nodeId = `greater-${index}`
    nodes.push({
      id: nodeId,
      type: "custom",
      position: { x: 550 + index * 100, y: 150 },
      data: {
        label: node.value || node.val || node,
        subLabel: `Node ${index}`,
        emoji: "🔴",
        isActive: step.step >= 4
      },
    })

    // Connect nodes in greater-than list
    if (index > 0) {
      edges.push({
        id: `greater-edge-${index - 1}-${index}`,
        source: `greater-${index - 1}`,
        target: nodeId,
        type: "smoothstep",
        animated: step.step >= 4,
        style: { stroke: '#ef4444', strokeWidth: 3 },
        label: "next"
      })
    }
  })

  // Create nodes for final merged list
  if (step.step >= 5 && finalList.length > 0) {
    finalList.forEach((value: any, index: number) => {
      const nodeId = `final-${index}`
      const actualValue = typeof value === 'object' ? (value.value || value.val || value) : value

      nodes.push({
        id: nodeId,
        type: "custom",
        position: { x: 200 + index * 80, y: 300 },
        data: {
          label: actualValue,
          subLabel: `Pos ${index}`,
          emoji: actualValue < partitionValue ? "🔵" : "🔴",
          isHighlighted: true
        },
      })

      // Connect final list
      if (index > 0) {
        edges.push({
          id: `final-edge-${index - 1}-${index}`,
          source: `final-${index - 1}`,
          target: nodeId,
          type: "smoothstep",
          animated: true,
          style: { stroke: '#7c3aed', strokeWidth: 3 }
        })
      }
    })

    // Connect less list to greater list in final result
    if (lessList.length > 0 && greaterList.length > 0) {
      edges.push({
        id: "merge-lists",
        source: `less-${lessList.length - 1}`,
        target: `greater-0`,
        type: "smoothstep",
        animated: true,
        style: { stroke: '#7c3aed', strokeWidth: 4 },
        label: "merged"
      })
    }
  }

  // Partition value indicator
  nodes.push({
    id: "partition-indicator",
    type: "custom",
    position: { x: 400, y: 200 },
    data: {
      label: `Partition: ${partitionValue}`,
      subLabel: "Threshold value",
      emoji: "🎯",
      isActive: true
    },
  })

  return { nodes, edges }
}

const generateMathFlow = (step: AnimationStep) => {
    const { original = 0, reversed = 0, digit, remainder } = step.data || {}
    const nodes: Node[] = []
    const edges: Edge[] = []

    // Algorithm header
    nodes.push({
      id: "algorithm-header",
      type: "custom",
      position: { x: 300, y: -50 },
      data: {
        label: "🔢 Reverse Integer",
        subLabel: `Processing ${original}`,
        emoji: "🔢",
        isHighlighted: true
      },
    })

    // Original number
    nodes.push({
      id: "original",
      type: "custom",
      position: { x: 200, y: 100 },
      data: {
        label: "Original",
        subLabel: original.toString(),
        emoji: "📥",
        isHighlighted: true
      },
    })

    // Reversed number
    nodes.push({
      id: "reversed",
      type: "custom",
      position: { x: 400, y: 100 },
      data: {
        label: "Reversed",
        subLabel: reversed.toString(),
        emoji: "📤",
        isHighlighted: true
      },
    })

    // Current digit (if available)
    if (digit !== undefined) {
      nodes.push({
        id: "current-digit",
        type: "custom",
        position: { x: 300, y: 200 },
        data: {
          label: "Current Digit",
          subLabel: digit.toString(),
          emoji: "🎯",
          isActive: true
        },
      })

      // Connect to processing flow
      edges.push({
        id: "orig-to-digit",
        source: "original",
        target: "current-digit",
        type: "smoothstep",
        animated: true,
        style: { stroke: '#3b82f6', strokeWidth: 2 }
      })

      edges.push({
        id: "digit-to-reversed",
        source: "current-digit",
        target: "reversed",
        type: "smoothstep",
        animated: true,
        style: { stroke: '#10b981', strokeWidth: 2 }
      })
    }

    return { nodes, edges }
  }

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
        })

        // Connect complement to found hash entry
        if (isComplement) {
          edges.push({
            id: "complement-to-hash",
            source: "complement",
            target: `hash-${index}`,
            animated: true,
            style: { stroke: "#22c55e", strokeWidth: 3 },
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

  // ============================================================================
  // 🎭 ADVANCED TEXT ANIMATION METHODS
  // ============================================================================

  /**
   * Create text animation for React Flow nodes
   */
  const createFlowTextAnimation = async (text: string, type: 'typing' | 'wave' | '3d' | 'word' = 'typing', targetNodeId?: string) => {
    let animation
    switch (type) {
      case 'typing':
        animation = createTypingAnimation(text, {
          duration: 50,
          stagger: 80,
          easing: 'steps(1)'
        })
        break
      case 'wave':
        animation = createWaveAnimation(text, {
          duration: 600,
          stagger: 100,
          easing: 'easeInOutSine'
        })
        break
      case '3d':
        animation = create3DAnimation(text, {
          duration: 1000,
          stagger: 150,
          easing: 'easeOutBack'
        })
        break
      case 'word':
        animation = createWordAnimation(text, {
          duration: 700,
          stagger: 200,
          easing: 'easeInOutQuad'
        })
        break
    }

    // Add React Flow-specific execution logic
    animation.onProgress = (progress: number) => {
      setTextAnimationProgress(progress)
    }

    animation.onComplete = () => {
      setCurrentTextAnimation(null)
      setTextAnimationProgress(100)
    }

    setTextAnimations(prev => new Map(prev.set(animation.id, animation)))
    setCurrentTextAnimation(animation.id)

    // Execute animation with React Flow-specific rendering
    const result = await alphabetServer.executeAnimation(animation.id, ['reactflow'])

    // Update React Flow nodes with animated text
    if (targetNodeId) {
      // Find the target node and update its data with animated text
      setNodes(nds => nds.map(node => {
        if (node.id === targetNodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              animatedText: (animation as any).elements,
              isAnimatingText: true
            }
          }
        }
        return node
      }))
    } else {
      // Create floating text nodes for the animation
      const textNodes: Node[] = (animation as any).elements.map((element: any, index: number) => ({
        id: `text-node-${element.id}`,
        type: 'custom',
        position: {
          x: 100 + (index * 30),
          y: 50 + Math.sin(index * 0.5) * 20
        },
        data: {
          label: element.character,
          emoji: '📝',
          isActive: false,
          isResult: false,
          isHighlighted: false,
          textElement: element,
          isTextNode: true
        },
        style: {
          opacity: element.isVisible ? 1 : 0,
          transition: 'all 0.5s ease'
        }
      }))

      setNodes(nds => [...nds, ...textNodes])
      setFlowTextElements(prev => new Map(prev.set(animation.id, textNodes)))
    }

    return result
  }

  /**
   * Enhanced node text animation
   */
  const animateNodeText = async (nodeId: string, text: string, type: 'typing' | 'wave' | '3d' | 'word' = 'typing') => {
    // Create animation without executing immediately
    let animation
    switch (type) {
      case 'typing':
        animation = createTypingAnimation(text, { duration: 50, stagger: 80, easing: 'steps(1)' })
        break
      case 'wave':
        animation = createWaveAnimation(text, { duration: 600, stagger: 100, easing: 'easeInOutSine' })
        break
      case '3d':
        animation = create3DAnimation(text, { duration: 1000, stagger: 150, easing: 'easeOutBack' })
        break
      case 'word':
        animation = createWordAnimation(text, { duration: 700, stagger: 200, easing: 'easeInOutQuad' })
        break
      default:
        animation = createTypingAnimation(text)
    }

    // Add React Flow-specific execution logic
    animation.onProgress = (progress: number) => {
      setTextAnimationProgress(progress)
    }

    animation.onComplete = () => {
      setCurrentTextAnimation(null)
      setTextAnimationProgress(100)
    }

    // Execute animation
    const result = await alphabetServer.executeAnimation(animation.id, ['reactflow'])

    // Update the specific node with animated text
    setNodes(nds => nds.map(node => {
      if (node.id === nodeId) {
        return {
          ...node,
          data: {
            ...node.data,
            animatedTextElements: (animation as any).elements,
            textAnimationType: type
          }
        }
      }
      return node
    }))

    return animation
  }

  /**
   * Create animated edge labels
   */
  const createAnimatedEdgeLabel = async (edgeId: string, text: string) => {
    const animation = createTypingAnimation(text, {
      duration: 100,
      stagger: 50,
      easing: 'easeOutQuad'
    })

    // Update edge with animated label
    setEdges(eds => eds.map(edge => {
      if (edge.id === edgeId) {
        return {
          ...edge,
          label: text,
          animated: true,
          labelStyle: { fontSize: 12, fill: '#3b82f6' },
          data: {
            ...edge.data,
            animatedLabel: (animation as any).elements
          }
        }
      }
      return edge
    }))

    await alphabetServer.executeAnimation(animation.id, ['reactflow'])
    return animation
  }

  /**
   * Create complex flow narrative with multiple text animations
   */
  const createFlowNarrative = async (narrativeSteps: Array<{ text: string, nodeId?: string, delay?: number }>) => {
    const narrativeId = `narrative-${Date.now()}`
    const animations: any[] = []

    for (let i = 0; i < narrativeSteps.length; i++) {
      const step = narrativeSteps[i]
      const animationType = i % 2 === 0 ? 'typing' : 'wave'

      // Create animation without executing immediately
      let animation
      switch (animationType) {
        case 'typing':
          animation = createTypingAnimation(step.text, { duration: 50, stagger: 80, easing: 'steps(1)' })
          break
        case 'wave':
          animation = createWaveAnimation(step.text, { duration: 600, stagger: 100, easing: 'easeInOutSine' })
          break
        default:
          animation = createTypingAnimation(step.text)
      }

      // Add React Flow-specific execution logic
      animation.onProgress = (progress: number) => {
        setTextAnimationProgress(progress)
      }

      animation.onComplete = () => {
        setCurrentTextAnimation(null)
        setTextAnimationProgress(100)
      }

      // Add delays between narrative steps
      if (step.delay || i > 0) {
        const delay = step.delay || 1500
        if ((animation as any).config) {
          (animation as any).config.delay = i * delay
        }
      }

      // Execute the animation
      await alphabetServer.executeAnimation(animation.id, ['reactflow'])

      animations.push(animation)

      // Brief pause between steps
      if (i < narrativeSteps.length - 1) {
        await new Promise(resolve => setTimeout(resolve, step.delay || 1500))
      }
    }

    setTextAnimations(prev => new Map(prev.set(narrativeId, animations)))
    return narrativeId
  }

  /**
   * Stop current text animation and clean up
   */
  const stopFlowTextAnimation = () => {
    if (currentTextAnimation) {
      alphabetServer.stopAnimation(currentTextAnimation)

      // Remove animated text nodes
      const textNodes = flowTextElements.get(currentTextAnimation) || []
      setNodes(nds => nds.filter(node => !textNodes.some((textNode: Node) => textNode.id === node.id)))

      // Reset node text animations
      setNodes(nds => nds.map(node => ({
        ...node,
        data: {
          ...node.data,
          animatedTextElements: undefined,
          isAnimatingText: false
        }
      })))

      setCurrentTextAnimation(null)
      setTextAnimationProgress(0)
    }
  }

  /**
   * Get text animation performance metrics
   */
  const getFlowTextMetrics = () => {
    if (!currentTextAnimation) return null
    return alphabetServer.getPerformanceMetrics(currentTextAnimation)
  }

  /**
   * Enhanced node types for animated text
   */
  const EnhancedCustomNode = ({ data }: any) => {
    const isActive = data.isActive
    const isResult = data.isResult
    const isHighlighted = data.isHighlighted
    const isTextNode = data.isTextNode
    const animatedTextElements = data.animatedTextElements

    // For animated text nodes
    if (isTextNode && data.textElement) {
      const element = data.textElement
      return (
        <div
          className={`px-3 py-2 rounded-lg shadow-lg text-sm font-bold border-2 transition-all duration-300 ${
            element.isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
          }`}
          style={{
            backgroundColor: element.style?.color || '#3b82f6',
            color: 'white',
            borderColor: element.style?.color || '#3b82f6',
            transform: element.style?.transform || 'none',
            textShadow: element.style?.textShadow || 'none'
          }}
        >
          {element.character}
        </div>
      )
    }

    // For regular nodes with animated text
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
      <div className={`px-4 py-3 rounded-xl border-2 shadow-lg transition-all duration-300 ${bgColor} relative`}>
        <div className="flex items-center gap-2">
          <span className="text-lg">{emoji}</span>
          <div className="text-sm font-medium">
            {data.label}
            {data.subLabel && (
              <div className="text-xs opacity-75 mt-1">{data.subLabel}</div>
            )}
            {/* Render animated text elements if present */}
            {animatedTextElements && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-xl">
                <div className="text-white text-xs font-bold">
                  {animatedTextElements.filter((el: any) => el.isVisible).map((el: any) => el.character).join('')}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  const enhancedNodeTypes = {
    custom: EnhancedCustomNode,
  }

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
            nodeTypes={enhancedNodeTypes}
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

      {/* Advanced Text Animation Controls */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-indigo-200 dark:border-indigo-700">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="text-2xl">🎭</div>
            <div>
              <h4 className="font-semibold text-indigo-800 dark:text-indigo-200 mb-1">Flow Text Animations</h4>
              <p className="text-sm text-indigo-700 dark:text-indigo-300">
                Advanced character and word animations integrated with React Flow nodes
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => createFlowTextAnimation(steps[currentStep]?.title || 'Sample Text', 'typing')}
              className="hover:scale-105 transition-all duration-200"
              disabled={!!currentTextAnimation}
            >
              ⌨️ Type
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => createFlowTextAnimation(steps[currentStep]?.title || 'Sample Text', 'wave')}
              className="hover:scale-105 transition-all duration-200"
              disabled={!!currentTextAnimation}
            >
              🌊 Wave
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => createFlowTextAnimation(steps[currentStep]?.title || 'Sample Text', '3d')}
              className="hover:scale-105 transition-all duration-200"
              disabled={!!currentTextAnimation}
            >
              🎲 3D
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => createFlowTextAnimation(steps[currentStep]?.title || 'Sample Text', 'word')}
              className="hover:scale-105 transition-all duration-200"
              disabled={!!currentTextAnimation}
            >
              📝 Word
            </Button>
            {currentTextAnimation && (
              <Button
                variant="destructive"
                size="sm"
                onClick={stopFlowTextAnimation}
                className="hover:scale-105 transition-all duration-200"
              >
                ⏹️ Stop
              </Button>
            )}
          </div>
        </div>

        {/* Text Animation Progress */}
        {currentTextAnimation && (
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-indigo-700 dark:text-indigo-300">Text Animation Progress</span>
              <span className="font-medium text-indigo-800 dark:text-indigo-200">{Math.round(textAnimationProgress)}%</span>
            </div>
            <Progress value={textAnimationProgress} className="h-2" />
          </div>
        )}

        {/* Text Animation Metrics */}
        {getFlowTextMetrics() && (
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2">
            <div className="bg-white/50 dark:bg-gray-800/50 rounded p-2 text-center">
              <div className="text-xs text-indigo-600 dark:text-indigo-400">Duration</div>
              <div className="text-sm font-medium">{getFlowTextMetrics()?.duration || 0}ms</div>
            </div>
            <div className="bg-white/50 dark:bg-gray-800/50 rounded p-2 text-center">
              <div className="text-xs text-indigo-600 dark:text-indigo-400">Elements</div>
              <div className="text-sm font-medium">{currentTextAnimation ? textAnimations.get(currentTextAnimation)?.elements?.length || 0 : 0}</div>
            </div>
            <div className="bg-white/50 dark:bg-gray-800/50 rounded p-2 text-center">
              <div className="text-xs text-indigo-600 dark:text-indigo-400">Nodes</div>
              <div className="text-sm font-medium">{nodes.filter(n => n.data?.isTextNode).length}</div>
            </div>
            <div className="bg-white/50 dark:bg-gray-800/50 rounded p-2 text-center">
              <div className="text-xs text-indigo-600 dark:text-indigo-400">Memory</div>
              <div className="text-sm font-medium">{getFlowTextMetrics()?.memoryUsage || 0}MB</div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-4 flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => createFlowNarrative([
              { text: "Step 1: Initialize", delay: 1000 },
              { text: "Step 2: Process", delay: 1500 },
              { text: "Step 3: Complete", delay: 1000 }
            ])}
            className="text-xs"
          >
            📚 Narrative
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => animateNodeText('algorithm-header', 'Algorithm Running...', 'wave')}
            className="text-xs"
            disabled={nodes.length === 0}
          >
            🎯 Node Text
          </Button>
        </div>
      </div>
    </div>
  )
}
