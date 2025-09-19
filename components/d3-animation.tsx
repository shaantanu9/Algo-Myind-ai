"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ChevronLeft, Zap, Clock, MemoryStick, ChevronRight, Play, Pause, RotateCcw, BarChart3, TrendingUp, Activity, MousePointer, ZoomIn } from "lucide-react"
import * as d3 from "d3"

interface AnimationStep {
  step: number
  title: string
  description: string
  data: any
}

interface D3AnimationProps {
  steps: AnimationStep[]
  currentStep: number
  isPlaying: boolean
  onStepChange: (step: number) => void
  onPlayPause: () => void
  onReset: () => void
  algorithmId: string
}

// Enhanced D3 Animation Component with advanced visualization techniques
export function D3Animation({
  steps,
  currentStep,
  isPlaying,
  onStepChange,
  onPlayPause,
  onReset,
  algorithmId,
}: D3AnimationProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [animationData, setAnimationData] = useState<any>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [performanceMetrics, setPerformanceMetrics] = useState({
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    currentOperations: 0,
    totalOperations: 0
  })

  const generateD3Visualization = useCallback((step: AnimationStep, algorithmId: string) => {
    if (algorithmId === "two-sum") {
      return generateTwoSumD3(step)
    }
    return generateDefaultD3(step)
  }, [])

  const generateTwoSumD3 = (step: AnimationStep) => {
    const { array = [], target = 0, currentIndex = 0, hashMap = {}, complement, found, result } = step.data || {}
    const hashEntries = Object.entries(hashMap)
    const progress = (currentIndex + 1) / array.length * 100

    // Update performance metrics
    setPerformanceMetrics({
      timeComplexity: "O(n)",
      spaceComplexity: "O(n)",
      currentOperations: currentIndex + 1,
      totalOperations: array.length
    })

    return {
      array: array.map((value: number, index: number) => ({
        id: `array-${index}`,
        value,
        index,
        x: index * 80 + 100, // Dynamic positioning
        y: 150,
        isActive: index === currentIndex,
        isResult: result && result.includes(index),
        isInHashMap: Object.values(hashMap).includes(index),
        status: index === currentIndex ? 'active' :
                (result && result.includes(index)) ? 'result' :
                (Object.values(hashMap).includes(index)) ? 'mapped' : 'default'
      })),
      target: {
        value: target,
        x: 400,
        y: 50
      },
      currentIndex,
      hashMap: hashEntries.map(([key, value], idx) => ({
        key: parseInt(key),
        value,
        x: 100,
        y: 280 + idx * 35
      })),
      complement: complement ? {
        value: complement,
        found: hashMap[complement] !== undefined,
        x: complement !== undefined && hashMap[complement] !== undefined ? 550 : 250,
        y: 200
      } : null,
      found,
      result,
      progress
    }
  }

  const generateDefaultD3 = (step: AnimationStep) => {
    return {
      step: step.step,
      title: step.title,
      description: step.description,
      x: 300,
      y: 200
    }
  }

  const renderD3Visualization = useCallback((data: any) => {
    if (!svgRef.current || !data) return

    const svg = d3.select(svgRef.current)
    const width = 700
    const height = 500

    // Clear previous content
    svg.selectAll("*").remove()

    // Create main container group
    const mainGroup = svg.append("g").attr("class", "main-visualization")

    if (data.array) {
      // Enhanced Array Visualization with D3 data binding
      const arrayGroup = mainGroup.append("g").attr("class", "array-visualization")

      // Array background
      arrayGroup.append("rect")
        .attr("x", 50)
        .attr("y", 120)
        .attr("width", data.array.length * 80 + 20)
        .attr("height", 80)
        .attr("fill", "#f8fafc")
        .attr("stroke", "#e2e8f0")
        .attr("stroke-width", 2)
        .attr("rx", 8)

      arrayGroup.append("text")
        .attr("x", 60)
        .attr("y", 110)
        .attr("fill", "#64748b")
        .attr("font-size", "12px")
        .attr("font-weight", "600")
        .text("Array Elements")

      // Array cells with D3 data binding and transitions
      const cells = arrayGroup.selectAll(".array-cell")
        .data(data.array, (d: any) => d.id)
        .enter()
        .append("g")
        .attr("class", "array-cell")
        .attr("transform", (d: any) => `translate(${d.x}, ${d.y})`)

      // Cell backgrounds with smooth transitions
      cells.append("rect")
        .attr("width", 60)
        .attr("height", 40)
        .attr("rx", 6)
        .attr("fill", (d: any) => {
          switch (d.status) {
            case 'result': return '#22c55e'
            case 'active': return '#3b82f6'
            case 'mapped': return '#8b5cf6'
            default: return '#f1f5f9'
          }
        })
        .attr("stroke", (d: any) => {
          switch (d.status) {
            case 'result': return '#16a34a'
            case 'active': return '#2563eb'
            case 'mapped': return '#7c3aed'
            default: return '#cbd5e1'
          }
        })
        .attr("stroke-width", 2)
        .style("filter", (d: any) => d.isActive ? "drop-shadow(0 4px 8px rgba(59, 130, 246, 0.3))" : "none")
        .transition()
        .duration(600)
        .ease(d3.easeCubicInOut)

      // Cell values with animated text
      cells.append("text")
        .attr("x", 30)
        .attr("y", 25)
        .attr("text-anchor", "middle")
        .attr("fill", (d: any) => ['result', 'active', 'mapped'].includes(d.status) ? 'white' : '#334155')
        .attr("font-size", "14px")
        .attr("font-weight", "600")
        .text((d: any) => d.value)
        .style("opacity", 0)
        .transition()
        .delay(200)
        .duration(400)
        .style("opacity", 1)

      // Index labels
      cells.append("text")
        .attr("x", 30)
        .attr("y", 60)
        .attr("text-anchor", "middle")
        .attr("fill", "#64748b")
        .attr("font-size", "11px")
        .text((d: any) => `[${d.index}]`)
        .style("opacity", 0)
        .transition()
        .delay(400)
        .duration(300)
        .style("opacity", 1)

      // Target visualization with enhanced styling
      const targetGroup = mainGroup.append("g").attr("class", "target-visualization")

      targetGroup.append("circle")
        .attr("cx", data.target.x)
        .attr("cy", data.target.y)
        .attr("r", 35)
        .attr("fill", "#fef3c7")
        .attr("stroke", "#f59e0b")
        .attr("stroke-width", 3)

      targetGroup.append("text")
        .attr("x", data.target.x)
        .attr("y", data.target.y - 5)
        .attr("text-anchor", "middle")
        .attr("fill", "#92400e")
        .attr("font-size", "12px")
        .attr("font-weight", "600")
        .text("🎯 Target")

      targetGroup.append("text")
        .attr("x", data.target.x)
        .attr("y", data.target.y + 8)
        .attr("text-anchor", "middle")
        .attr("fill", "#92400e")
        .attr("font-size", "16px")
        .attr("font-weight", "bold")
        .text(data.target.value)

      // Complement visualization
      if (data.complement) {
        const complementGroup = mainGroup.append("g").attr("class", "complement-visualization")

        complementGroup.append("rect")
          .attr("x", data.complement.x - 40)
          .attr("y", data.complement.y - 20)
          .attr("width", 80)
          .attr("height", 40)
          .attr("fill", data.complement.found ? "#dcfce7" : "#fee2e2")
          .attr("stroke", data.complement.found ? "#22c55e" : "#ef4444")
          .attr("stroke-width", 2)
          .attr("rx", 6)
          .style("opacity", 0)
          .transition()
          .delay(800)
          .duration(500)
          .style("opacity", 1)

        complementGroup.append("text")
          .attr("x", data.complement.x)
          .attr("y", data.complement.y + 5)
          .attr("text-anchor", "middle")
          .attr("fill", data.complement.found ? "#166534" : "#991b1b")
          .attr("font-size", "14px")
          .attr("font-weight", "600")
          .text(`${data.complement.found ? '✅' : '🔍'} ${data.complement.value}`)
          .style("opacity", 0)
          .transition()
          .delay(1000)
          .duration(400)
          .style("opacity", 1)
      }

      // Enhanced Hash Map visualization
      if (data.hashMap.length > 0) {
        const hashGroup = mainGroup.append("g").attr("class", "hashmap-visualization")

        // Hash map container
        hashGroup.append("rect")
          .attr("x", 50)
          .attr("y", 250)
          .attr("width", 300)
          .attr("height", data.hashMap.length * 35 + 40)
          .attr("fill", "#f0f9ff")
          .attr("stroke", "#0ea5e9")
          .attr("stroke-width", 2)
          .attr("rx", 8)

        hashGroup.append("text")
          .attr("x", 60)
          .attr("y", 270)
          .attr("fill", "#0c4a6e")
          .attr("font-size", "14px")
          .attr("font-weight", "600")
          .text("🗂️ Hash Map (Memory)")

        // Hash map entries
        hashGroup.selectAll(".hash-entry")
          .data(data.hashMap)
          .enter()
          .append("g")
          .attr("class", "hash-entry")
          .attr("transform", (d: any, i: number) => `translate(${d.x}, ${d.y})`)
          .style("opacity", 0)
          .transition()
          .delay((d: any, i: number) => 1200 + i * 200)
          .duration(400)
          .style("opacity", 1)

        hashGroup.selectAll(".hash-entry")
          .append("circle")
          .attr("cx", 0)
          .attr("cy", 0)
          .attr("r", 12)
          .attr("fill", "#06b6d4")

        hashGroup.selectAll(".hash-entry")
          .append("text")
          .attr("x", 25)
          .attr("y", 5)
          .attr("fill", "#164e63")
          .attr("font-size", "13px")
          .attr("font-weight", "500")
          .text((d: any) => `${d.key} → ${d.value}`)
      }

      // Success animation for found results
      if (data.found && data.result) {
        const successGroup = mainGroup.append("g").attr("class", "success-animation")

        // Animated success banner
        successGroup.append("rect")
          .attr("x", 150)
          .attr("y", 380)
          .attr("width", 400)
          .attr("height", 60)
          .attr("fill", "#22c55e")
          .attr("stroke", "#16a34a")
          .attr("stroke-width", 3)
          .attr("rx", 8)
          .style("opacity", 0)
          .transition()
          .delay(1500)
          .duration(600)
          .style("opacity", 1)

        successGroup.append("text")
          .attr("x", 350)
          .attr("y", 400)
          .attr("text-anchor", "middle")
          .attr("fill", "white")
          .attr("font-size", "16px")
          .attr("font-weight", "700")
          .text("🎉 SOLUTION FOUND!")
          .style("opacity", 0)
          .transition()
          .delay(1800)
          .duration(400)
          .style("opacity", 1)

        successGroup.append("text")
          .attr("x", 350)
          .attr("y", 420)
          .attr("text-anchor", "middle")
          .attr("fill", "white")
          .attr("font-size", "14px")
          .attr("font-weight", "500")
          .text(`Indices: [${data.result.join(', ')}] | Values: [${data.result.map((i: number) => data.array[i].value).join(', ')}]`)
          .style("opacity", 0)
          .transition()
          .delay(2000)
          .duration(400)
          .style("opacity", 1)

        // Celebration particles effect
        const particles = successGroup.selectAll(".particle")
          .data(d3.range(20))
          .enter()
          .append("circle")
          .attr("class", "particle")
          .attr("cx", 350)
          .attr("cy", 410)
          .attr("r", 2)
          .attr("fill", "#fbbf24")
          .style("opacity", 0)
          .transition()
          .delay((d: any, i: number) => 2200 + i * 50)
          .duration(800)
          .attr("cx", (d: any) => 350 + (Math.random() - 0.5) * 200)
          .attr("cy", (d: any) => 410 + (Math.random() - 0.5) * 100)
          .style("opacity", 1)
          .transition()
          .delay(3000)
          .duration(400)
          .style("opacity", 0)
          .remove()
      }

      // Progress bar
      const progressGroup = mainGroup.append("g").attr("class", "progress-visualization")

      progressGroup.append("rect")
        .attr("x", 100)
        .attr("y", 460)
        .attr("width", 500)
        .attr("height", 8)
        .attr("fill", "#e2e8f0")
        .attr("rx", 4)

      progressGroup.append("rect")
        .attr("x", 100)
        .attr("y", 460)
        .attr("width", 0)
        .attr("height", 8)
        .attr("fill", "#3b82f6")
        .attr("rx", 4)
        .transition()
        .duration(800)
        .attr("width", (data.progress / 100) * 500)

      progressGroup.append("text")
        .attr("x", 350)
        .attr("y", 485)
        .attr("text-anchor", "middle")
        .attr("fill", "#64748b")
        .attr("font-size", "12px")
        .text(`${Math.round(data.progress)}% Complete`)

    } else {
      // Enhanced default visualization
      const defaultGroup = mainGroup.append("g").attr("class", "default-visualization")

      defaultGroup.append("circle")
        .attr("cx", data.x)
        .attr("cy", data.y)
        .attr("r", 80)
        .attr("fill", "#f1f5f9")
        .attr("stroke", "#3b82f6")
        .attr("stroke-width", 3)

      defaultGroup.append("text")
        .attr("x", data.x)
        .attr("y", data.y - 10)
        .attr("text-anchor", "middle")
        .attr("fill", "#1e293b")
        .attr("font-size", "16px")
        .attr("font-weight", "600")
        .text(`Step ${data.step}`)

      defaultGroup.append("text")
        .attr("x", data.x)
        .attr("y", data.y + 15)
        .attr("text-anchor", "middle")
        .attr("fill", "#64748b")
        .attr("font-size", "14px")
        .text(data.title)
    }

    // Add subtle animations to all elements
    svg.selectAll("rect, circle, text")
      .style("cursor", "pointer")
      .on("mouseover", function() {
        d3.select(this)
          .transition()
          .duration(200)
          .style("filter", "brightness(1.1)")
      })
      .on("mouseout", function() {
        d3.select(this)
          .transition()
          .duration(200)
          .style("filter", "brightness(1)")
      })

  }, [svgRef])

  useEffect(() => {
    setIsAnimating(true)
    const timer = setTimeout(() => {
      if (steps[currentStep]) {
        const data = generateD3Visualization(steps[currentStep], algorithmId)
        setAnimationData(data)
      }
      setIsAnimating(false)
    }, 300)
    return () => clearTimeout(timer)
  }, [currentStep, steps, algorithmId, generateD3Visualization])

  useEffect(() => {
    if (animationData) {
      renderD3Visualization(animationData)
    }
  }, [animationData, renderD3Visualization])

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
      }, 2800) // 2.8 seconds for D3 animations
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

      {/* Enhanced D3 Visualization Container */}
      <div className="relative">
        <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 rounded-xl border-2 border-muted p-6 min-h-[550px] overflow-auto shadow-lg">
          {isAnimating && (
            <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 flex items-center justify-center z-50 rounded-xl">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Rendering advanced D3 visualization...</p>
              </div>
            </div>
          )}

          <svg
            ref={svgRef}
            width="100%"
            height="500"
            viewBox="0 0 700 500"
            className="w-full h-full"
            style={{ background: 'transparent' }}
          />

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

      {/* D3.js Features Guide */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-lg p-4 border border-emerald-200 dark:border-emerald-700">
        <div className="flex items-start gap-3">
          <div className="text-2xl">📊</div>
          <div>
            <h4 className="font-semibold text-emerald-800 dark:text-emerald-200 mb-1">Advanced D3.js Features</h4>
            <p className="text-sm text-emerald-700 dark:text-emerald-300">
              ✨ <strong>Smooth transitions</strong> • 🎨 <strong>Data-driven styling</strong> • 🎯 <strong>Interactive elements</strong> •
              📈 <strong>Real-time animations</strong> • 🎪 <strong>Celebration effects</strong> for solutions
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
