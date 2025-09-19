"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ChevronLeft, ChevronRight, Play, Pause, RotateCcw, Zap, Clock, MemoryStick } from "lucide-react"

interface AnimationStep {
  step: number
  title: string
  description: string
  data: any
}

interface MermaidAnimationProps {
  steps: AnimationStep[]
  currentStep: number
  isPlaying: boolean
  onStepChange: (step: number) => void
  onPlayPause: () => void
  onReset: () => void
  algorithmId: string
}

export function MermaidAnimation({
  steps,
  currentStep,
  isPlaying,
  onStepChange,
  onPlayPause,
  onReset,
  algorithmId,
}: MermaidAnimationProps) {
  const [mermaidContent, setMermaidContent] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [performanceMetrics, setPerformanceMetrics] = useState({
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    currentOperations: 0,
    totalOperations: 0
  })
  const mermaidRef = useRef<HTMLDivElement>(null)
  const animationTimeoutRef = useRef<NodeJS.Timeout>()

  // Enhanced Mermaid diagram generation with better visual storytelling
  const generateMermaidDiagram = (step: AnimationStep, algorithmId: string) => {
    try {
      if (algorithmId === "two-sum") {
        return generateTwoSumDiagram(step)
      }
      // Add more algorithms here
      return generateDefaultDiagram(step)
    } catch (err) {
      console.error("[v0] Mermaid diagram generation error:", err)
      setError("Failed to generate diagram")
      return generateErrorDiagram(step)
    }
  }

  const generateTwoSumDiagram = (step: AnimationStep) => {
    const { array = [], target = 0, currentIndex = 0, hashMap = {}, complement, found, result } = step.data || {}
    const hashEntries = Object.entries(hashMap)
    const currentElement = array[currentIndex]
    const isComplementFound = found && result
    const progress = (currentIndex + 1) / array.length * 100

    // Update performance metrics
    setPerformanceMetrics({
      timeComplexity: "O(n)",
      spaceComplexity: "O(n)",
      currentOperations: currentIndex + 1,
      totalOperations: array.length
    })

    let diagram = `flowchart TD
    %% Algorithm Header
    subgraph Algorithm["🎯 Two Sum Algorithm"]
        direction LR
        Target["🎯 Target Value<br/>${target}"]
        Status["📊 Progress<br/>${Math.round(progress)}% Complete"]
    end

    %% Input Data Section
    subgraph Input["📥 Input Array"]
        direction LR`

    // Array elements with enhanced visualization
    array.forEach((value: number, index: number) => {
      const isActive = index === currentIndex
      const isResult = result && result.includes(index)
      const isInMap = Object.values(hashMap).includes(index)

      let style = "fill:#f3f4f6,stroke:#d1d5db,color:#374151"
      let emoji = "📦"

      if (isResult) {
        style = "fill:#22c55e,stroke:#16a34a,color:#fff"
        emoji = "🎯"
      } else if (isActive) {
        style = "fill:#3b82f6,stroke:#2563eb,color:#fff"
        emoji = "⚡"
      } else if (isInMap) {
        style = "fill:#8b5cf6,stroke:#7c3aed,color:#fff"
        emoji = "💾"
      }

      diagram += `
        Arr${index}["${emoji} ${value}<br/>Index: ${index}"]:::arr${index === currentIndex ? 'Active' : isResult ? 'Result' : isInMap ? 'Mapped' : 'Default'}`
    })

    diagram += `
    end

    %% Current Processing Section
    subgraph Processing["⚙️ Current Processing"]
        direction TB
        Current["📍 Current Element<br/>${currentElement !== undefined ? `Value: ${currentElement}<br/>Index: ${currentIndex}` : 'N/A'}"]`

    if (complement !== undefined) {
      const complementFound = hashMap[complement] !== undefined
      diagram += `
        Complement["🔍 Looking for<br/>${complement}"]${complementFound ? ':::found' : ':::notfound'}`
    }

    diagram += `
    end

    %% Hash Map Section
    subgraph HashMap["🗂️ Hash Map (Memory)"]
        direction LR
        HM_Title["Hash Map Contents"]`

    if (hashEntries.length === 0) {
      diagram += `
        HM_Empty["📭 Empty Map"]:::empty`
    } else {
      hashEntries.forEach(([key, value], index) => {
        const isComplement = complement !== undefined && parseInt(key) === complement
        diagram += `
        HM${index}["${key} → ${value}"]${isComplement ? ':::complement' : ':::stored'}`
      })
    }

    diagram += `
    end

    %% Result Section
    subgraph Result["🎯 Final Result"]
        direction LR`

    if (isComplementFound && result) {
      diagram += `
        Success["✅ SOLUTION FOUND!<br/>Indices: [${result.join(', ')}]<br/>Values: [${result.map((i: number) => array[i]).join(', ')}]"]:::success
        Formula["✨ ${array[result[0]]} + ${array[result[1]]} = ${target}"]:::formula`
    } else if (step.step > 1 && !found) {
      diagram += `
        Continue["🔄 Continue searching...<br/>${array.length - currentIndex - 1} elements remaining"]:::continue`
    } else {
      diagram += `
        Pending["⏳ Processing...<br/>Step ${step.step} of ${array.length}"]:::pending`
    }

    diagram += `
    end

    %% Flow Connections
    Algorithm --> Input
    Input --> Processing
    Processing --> HashMap
    HashMap --> Result

    %% Array to Processing connections
    Arr${currentIndex} -.-> Current`

    if (complement !== undefined) {
      diagram += `
    Current -.-> Complement`
    }

    // Connect complement to hash map if looking for it
    if (complement !== undefined && hashMap[complement] !== undefined) {
      diagram += `
    Complement -.-> HM${hashEntries.findIndex(([key]) => parseInt(key) === complement)}`
    }

    // Enhanced styling with animations and better colors
    diagram += `

    %% Style Definitions with Enhanced Colors
    classDef header fill:#1e40af,stroke:#1d4ed8,color:#fff,stroke-width:3px
    classDef arrDefault fill:#f8fafc,stroke:#cbd5e1,color:#475569,stroke-width:2px
    classDef arrActive fill:#3b82f6,stroke:#2563eb,color:#fff,stroke-width:3px,animation:pulse 2s infinite
    classDef arrResult fill:#22c55e,stroke:#16a34a,color:#fff,stroke-width:3px,animation:bounce 1s
    classDef arrMapped fill:#8b5cf6,stroke:#7c3aed,color:#fff,stroke-width:2px
    classDef processing fill:#f59e0b,stroke:#d97706,color:#fff,stroke-width:2px
    classDef found fill:#22c55e,stroke:#16a34a,color:#fff,stroke-width:3px,animation:pulse 1.5s infinite
    classDef notfound fill:#ef4444,stroke:#dc2626,color:#fff,stroke-width:2px
    classDef stored fill:#06b6d4,stroke:#0891b2,color:#fff,stroke-width:2px
    classDef complement fill:#f59e0b,stroke:#d97706,color:#fff,stroke-width:3px,animation:pulse 1s infinite
    classDef empty fill:#6b7280,stroke:#4b5563,color:#fff,stroke-width:2px
    classDef success fill:#22c55e,stroke:#16a34a,color:#fff,stroke-width:4px,animation:celebration 2s ease-in-out
    classDef formula fill:#fbbf24,stroke:#f59e0b,color:#92400e,stroke-width:2px,font-weight:bold
    classDef continue fill:#f59e0b,stroke:#d97706,color:#fff,stroke-width:2px
    classDef pending fill:#6b7280,stroke:#4b5563,color:#fff,stroke-width:2px

    %% Apply Styles
    class Algorithm header
    class Target,Status header
    class Current,Complement processing
    class HM_Title stored
    class Success success
    class Formula formula`

    // Add conditional styling based on state
    array.forEach((_, index) => {
      if (index === currentIndex) {
        diagram += `
    class Arr${index} arrActive`
      } else if (result && result.includes(index)) {
        diagram += `
    class Arr${index} arrResult`
      } else if (Object.values(hashMap).includes(index)) {
        diagram += `
    class Arr${index} arrMapped`
      } else {
        diagram += `
    class Arr${index} arrDefault`
      }
    })

    return diagram
  }

  const generateDefaultDiagram = (step: AnimationStep) => {
    return `flowchart TD
    subgraph Algorithm["📚 Algorithm Visualization"]
        direction TB
        Step["Step ${step.step}"]
        Title["${step.title}"]
        Desc["${step.description}"]
    end

    Step --> Title
    Title --> Desc

    classDef default fill:#3b82f6,stroke:#2563eb,color:#fff,stroke-width:2px
    class Algorithm,Step,Title,Desc default`
  }

  const generateErrorDiagram = (step: AnimationStep) => {
    return `flowchart TD
    subgraph Error["⚠️ Visualization Error"]
        direction TB
        ErrIcon["🚨"]
        ErrTitle["Diagram Error"]
        ErrDesc["Step ${step.step}: ${step.title}"]
        ErrMsg["Unable to render diagram"]
    end

    ErrIcon --> ErrTitle
    ErrTitle --> ErrDesc
    ErrDesc --> ErrMsg

    classDef error fill:#ef4444,stroke:#dc2626,color:#fff,stroke-width:2px
    class Error,ErrIcon,ErrTitle,ErrDesc,ErrMsg error`
  }

  // Enhanced auto-play with smooth transitions
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isPlaying && currentStep < steps.length - 1) {
      interval = setInterval(() => {
        setIsAnimating(true)
        animationTimeoutRef.current = setTimeout(() => {
          onStepChange(currentStep + 1)
          setIsAnimating(false)
        }, 300) // Brief animation delay
      }, 2500) // 2.5 seconds per step for better comprehension
    } else if (isPlaying && currentStep >= steps.length - 1) {
      onPlayPause()
      setIsAnimating(false)
    }
    return () => {
      clearInterval(interval)
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current)
      }
    }
  }, [isPlaying, currentStep, steps.length, onStepChange, onPlayPause])

  // Update Mermaid content with enhanced error handling
  useEffect(() => {
    if (steps[currentStep]) {
      setError(null)
      try {
        const newContent = generateMermaidDiagram(steps[currentStep], algorithmId)
        setMermaidContent(newContent)
      } catch (err) {
        console.error("[Enhanced Mermaid] Content generation error:", err)
        setError("Failed to generate enhanced diagram")
        setMermaidContent(generateErrorDiagram(steps[currentStep]))
      }
    }
  }, [currentStep, steps, algorithmId])

  // Enhanced Mermaid rendering with better error handling and animations
  useEffect(() => {
    if (mermaidContent && mermaidRef.current) {
      setIsAnimating(true)

      // Clear previous content with fade effect
      const container = mermaidRef.current
      container.style.opacity = '0.7'

      setTimeout(() => {
        container.innerHTML = ""

        // Create a unique ID for this diagram
        const diagramId = `mermaid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

        // Create the mermaid div with enhanced styling
        const mermaidDiv = document.createElement("div")
        mermaidDiv.className = "mermaid enhanced-diagram"
        mermaidDiv.style.transition = "all 0.3s ease-in-out"
        mermaidDiv.textContent = mermaidContent
        container.appendChild(mermaidDiv)

        // Enhanced Mermaid initialization
        import("mermaid")
          .then((mermaid) => {
            mermaid.default.initialize({
              startOnLoad: false,
              theme: "base",
              themeVariables: {
                primaryColor: "#3b82f6",
                primaryTextColor: "#ffffff",
                primaryBorderColor: "#2563eb",
                lineColor: "#6b7280",
                secondaryColor: "#f3f4f6",
                tertiaryColor: "#ffffff",
                background: "transparent",
                mainBkg: "#f8fafc",
                secondBkg: "#e2e8f0",
                tertiaryBkg: "#cbd5e1",
                textColor: "#374151",
                mainBkgColor: "#f8fafc",
                secondBkgColor: "#e2e8f0",
                tertiaryBkgColor: "#cbd5e1",
              },
              flowchart: {
                useMaxWidth: true,
                htmlLabels: true,
                curve: "basis",
                padding: 20,
                nodeSpacing: 100,
                rankSpacing: 80,
              },
              securityLevel: "loose",
            })

            mermaid.default
              .render(diagramId, mermaidContent)
              .then((result) => {
                if (container) {
                  container.innerHTML = result.svg
                  container.style.opacity = '1'
                  setError(null)
                  setIsAnimating(false)
                }
              })
              .catch((err) => {
                console.error("[Enhanced Mermaid] Render error:", err)
                setError("Enhanced diagram rendering failed")
                setIsAnimating(false)
                if (container) {
                  container.style.opacity = '1'
                  container.innerHTML = `
                  <div class="flex items-center justify-center h-full">
                    <div class="text-center p-6 bg-red-50 rounded-lg border border-red-200">
                      <div class="text-4xl mb-4">🚨</div>
                      <p class="font-semibold text-red-800">Enhanced Visualization Error</p>
                      <p class="text-sm text-red-600 mt-2">Unable to render interactive diagram</p>
                      <p class="text-xs text-red-500 mt-2">Error: ${err.message}</p>
                      <button
                        onclick="window.location.reload()"
                        class="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                      >
                        Reload Page
                      </button>
                    </div>
                  </div>
                `
                }
              })
          })
          .catch((err) => {
            console.error("[Enhanced Mermaid] Import error:", err)
            setError("Failed to load enhanced diagram library")
            setIsAnimating(false)
            if (container) {
              container.style.opacity = '1'
            }
          })
      }, 200) // Brief delay for smooth transition
    }
  }, [mermaidContent])

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

      {/* Enhanced Mermaid Diagram Container */}
      <div className="relative">
        <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 rounded-xl border-2 border-muted p-6 min-h-[500px] overflow-auto shadow-lg">
          {error && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center p-6 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-700">
                <div className="text-4xl mb-4">🚨</div>
                <p className="font-semibold text-red-800 dark:text-red-200">Visualization Error</p>
                <p className="text-sm text-red-600 dark:text-red-300 mt-2">{error}</p>
              </div>
            </div>
          )}

          {isAnimating && (
            <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 flex items-center justify-center z-10 rounded-xl">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Rendering enhanced visualization...</p>
              </div>
            </div>
          )}

          <div
            ref={mermaidRef}
            className="w-full h-full flex items-center justify-center transition-all duration-300"
            style={{ opacity: isAnimating ? 0.7 : 1 }}
          />
        </div>

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

      {/* Educational Tips */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
        <div className="flex items-start gap-3">
          <div className="text-2xl">💡</div>
          <div>
            <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-1">Pro Tip</h4>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Watch how the hash map stores values for O(1) lookups! Each color represents a different state:
              ⚡ Active element • 🎯 Solution found • 💾 Stored in memory • 📦 Default state
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
