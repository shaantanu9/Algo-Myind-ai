"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ChevronLeft, Zap, Clock, MemoryStick, ChevronRight, Play, Pause, RotateCcw, BarChart3, TrendingUp, Activity, MousePointer, ZoomIn } from "lucide-react"
import * as d3 from "d3"
import { alphabetServer, createTypingAnimation, createWaveAnimation, create3DAnimation, createWordAnimation } from "@/lib/alphabet-server"

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
  const [textAnimations, setTextAnimations] = useState<Map<string, any>>(new Map())
  const [currentTextAnimation, setCurrentTextAnimation] = useState<string | null>(null)
  const [textAnimationProgress, setTextAnimationProgress] = useState(0)
  const [d3TextElements, setD3TextElements] = useState<Map<string, any>>(new Map())

  const generateD3Visualization = useCallback((step: AnimationStep, algorithmId: string) => {
    // Enhanced algorithm detection for AI-generated JSON
    if (algorithmId === "two-sum" || (step.data?.array && step.data?.target)) {
      return generateTwoSumD3(step)
    }
    if (algorithmId === "container-with-most-water" || step.data?.array?.length > 0) {
      return generateContainerWithMostWaterD3(step)
    }
    if (algorithmId === "shortest-palindrome" || step.data?.original !== undefined) {
      return generateStringManipulationD3(step)
    }
    if (algorithmId === "reverse-integer" || step.data?.original !== undefined) {
      return generateMathD3(step)
    }
    return generateDefaultD3(step)
  }, [])

  const generateContainerWithMostWaterD3 = (step: AnimationStep) => {
    const { array = [], left = 0, right = array.length - 1, currentArea = 0, maxArea = 0 } = step.data || {}

    return {
      array: array.map((height: number, index: number) => ({
        id: `bar-${index}`,
        height,
        index,
        x: index * 40 + 50,
        y: 300,
        isActive: index === left || index === right,
        isInRange: index >= left && index <= right,
        fill: index === left || index === right ? '#3b82f6' : index >= left && index <= right ? '#10b981' : '#6b7280'
      })),
      pointers: [
        { id: 'left', x: left * 40 + 50 + 20, y: 280, label: 'Left', color: '#3b82f6' },
        { id: 'right', x: right * 40 + 50 + 20, y: 280, label: 'Right', color: '#3b82f6' }
      ],
      currentArea,
      maxArea,
      step: step.step
    }
  }

  const generateStringManipulationD3 = (step: AnimationStep) => {
    const { original = '', reversed = '', currentIndex = 0 } = step.data || {}

    return {
      original: original.split('').map((char: string, index: number) => ({
        id: `orig-${index}`,
        char,
        index,
        x: index * 30 + 50,
        y: 150,
        isActive: index === currentIndex,
        color: index === currentIndex ? '#3b82f6' : '#374151'
      })),
      reversed: reversed.split('').map((char: string, index: number) => ({
        id: `rev-${index}`,
        char,
        index,
        x: index * 30 + 50,
        y: 250,
        isActive: index === currentIndex,
        color: index === currentIndex ? '#10b981' : '#374151'
      })),
      step: step.step
    }
  }

  const generateMathD3 = (step: AnimationStep) => {
    const { original = 0, reversed = 0, digit, remainder } = step.data || {}

    return {
      numbers: [
        { id: 'original', value: original, x: 200, y: 150, label: 'Original', color: '#3b82f6' },
        { id: 'reversed', value: reversed, x: 400, y: 150, label: 'Reversed', color: '#10b981' }
      ],
      currentDigit: digit ? { value: digit, x: 300, y: 200, label: 'Current Digit', color: '#f59e0b' } : null,
      step: step.step
    }
  }

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

    // Handle different visualization types
    if (data.lessHead || data.greaterHead || data.lessList || data.greaterList) {
      // Linked List Partition visualization
      renderLinkedListVisualization(svg, mainGroup, data)
    } else if (data.array && data.pointers) {
      // Container With Most Water visualization
      renderContainerWithMostWater(svg, mainGroup, data)
    } else if (data.original && data.reversed) {
      // String manipulation visualization
      renderStringManipulation(svg, mainGroup, data)
    } else if (data.numbers) {
      // Math visualization
      renderMathVisualization(svg, mainGroup, data)
    } else if (data.array) {
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

  // ============================================================================
  // 🎭 ADVANCED TEXT ANIMATION METHODS
  // ============================================================================

  /**
   * Create text animation for D3 visualizations
   */
  const createD3TextAnimation = async (text: string, type: 'typing' | 'wave' | '3d' | 'word' = 'typing', position?: { x: number, y: number }) => {
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

    // Add D3-specific execution logic
    animation.onProgress = (progress: number) => {
      setTextAnimationProgress(progress)
    }

    animation.onComplete = () => {
      setCurrentTextAnimation(null)
      setTextAnimationProgress(100)
    }

    setTextAnimations(prev => new Map(prev.set(animation.id, animation)))
    setCurrentTextAnimation(animation.id)

    // Execute animation with D3-specific rendering
    const result = await alphabetServer.executeAnimation(animation.id, ['d3'])

    // Update D3 visualization with animated text
    if (svgRef.current) {
      const svg = d3.select(svgRef.current)
      const textElements = animation.elements
      const basePosition = position || { x: 300, y: 200 }

      // Create animated text elements in D3
      const textGroup = svg.append("g")
        .attr("class", "d3-text-animation")
        .attr("transform", `translate(${basePosition.x}, ${basePosition.y})`)

      textElements.forEach((element: any, index: number) => {
        // Create text element
        const textElement = textGroup.append("text")
          .attr("class", "d3-animated-text")
          .attr("x", index * 12)
          .attr("y", 0)
          .attr("fill", element.style?.color || "#3b82f6")
          .attr("font-size", element.style?.fontSize || "16px")
          .attr("font-weight", element.style?.fontWeight || "normal")
          .attr("opacity", element.isVisible ? 1 : 0)
          .attr("text-anchor", "middle")
          .text(element.character)

        // Add glow effect if enabled
        if (element.style?.textShadow) {
          textElement.style("filter", "drop-shadow(0 0 4px rgba(59, 130, 246, 0.5))")
        }

        // Animate text element
        textElement
          .transition()
          .delay(index * (animation.config.stagger || 100))
          .duration(animation.config.duration || 500)
          .attr("opacity", 1)
          .attr("transform", element.style?.transform || "scale(1)")
          .ease(d3.easeCubicInOut)

        // Add wave effect for wave animations
        if (type === 'wave') {
          textElement
            .transition()
            .delay(index * (animation.config.stagger || 100) + 200)
            .duration(400)
            .attr("transform", `translate(0, ${Math.sin(index * 0.5) * 10}) scale(1.1)`)
            .transition()
            .delay(600)
            .duration(400)
            .attr("transform", "translate(0, 0) scale(1)")
            .ease(d3.easeElasticOut)
        }

        // Add 3D effect for 3D animations
        if (type === '3d') {
          textElement
            .transition()
            .delay(index * (animation.config.stagger || 100))
            .duration(800)
            .attr("transform", `translateZ(-50px) rotateX(45deg) scale(0.5)`)
            .style("filter", "drop-shadow(0 10px 20px rgba(59, 130, 246, 0.3))")
            .transition()
            .delay(400)
            .duration(600)
            .attr("transform", "translateZ(0px) rotateX(0deg) scale(1)")
            .style("filter", "none")
            .ease(d3.easeBackOut)
        }
      })

      setD3TextElements(prev => new Map(prev.set(animation.id, textGroup)))
    }

    return result
  }

  /**
   * Create animated data labels for D3 charts
   */
  const createAnimatedDataLabels = async (data: any[], positions: Array<{ x: number, y: number }>) => {
    const labelAnimations: any[] = []

    for (let i = 0; i < data.length && i < positions.length; i++) {
      const item = data[i]
      const position = positions[i]
      const labelText = item.value?.toString() || item.label || item.toString()

      const animation = createTypingAnimation(labelText, {
        duration: 100,
        stagger: 30,
        easing: 'easeOutQuad'
      })

      // Add D3-specific execution logic
      animation.onProgress = (progress: number) => {
        setTextAnimationProgress(progress)
      }

      // Execute animation
      await alphabetServer.executeAnimation(animation.id, ['d3'])

      // Create D3 label
      if (svgRef.current) {
        const svg = d3.select(svgRef.current)
        const textElements = animation.elements

        textElements.forEach((element: any, index: number) => {
          svg.append("text")
            .attr("class", "d3-data-label")
            .attr("x", position.x + index * 8)
            .attr("y", position.y)
            .attr("fill", "#374151")
            .attr("font-size", "12px")
            .attr("font-weight", "600")
            .attr("text-anchor", "middle")
            .attr("opacity", 0)
            .text(element.character)
            .transition()
            .delay(index * 30 + i * 200)
            .duration(300)
            .attr("opacity", 1)
            .attr("transform", `translate(0, ${Math.sin(index * 0.3) * 3})`)
            .transition()
            .delay(500)
            .duration(200)
            .attr("transform", "translate(0, 0)")
            .ease(d3.easeBounceOut)
        })
      }

      labelAnimations.push(animation)

      // Brief pause between labels
      if (i < data.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 300))
      }
    }

    const sequenceId = `data-labels-${Date.now()}`
    setTextAnimations(prev => new Map(prev.set(sequenceId, labelAnimations)))
    return sequenceId
  }

  /**
   * Create animated axis labels
   */
  const createAnimatedAxisLabels = async (labels: string[], axis: 'x' | 'y', positions: number[]) => {
    const axisAnimations: any[] = []

    for (let i = 0; i < labels.length && i < positions.length; i++) {
      const label = labels[i]
      const position = positions[i]

      const animation = createTypingAnimation(label, {
        duration: 80,
        stagger: 40,
        easing: 'easeOutBack'
      })

      // Execute animation
      await alphabetServer.executeAnimation(animation.id, ['d3'])

      // Create D3 axis label
      if (svgRef.current) {
        const svg = d3.select(svgRef.current)
        const textElements = animation.elements

        textElements.forEach((element: any, index: number) => {
          const textElement = svg.append("text")
            .attr("class", "d3-axis-label")
            .attr("fill", "#6b7280")
            .attr("font-size", "11px")
            .attr("font-weight", "500")
            .attr("text-anchor", axis === 'x' ? "middle" : "end")
            .attr("opacity", 0)
            .text(element.character)

          if (axis === 'x') {
            textElement
              .attr("x", position)
              .attr("y", 420)
              .attr("transform", `translate(${index * 6}, 0)`)
          } else {
            textElement
              .attr("x", 60)
              .attr("y", position)
              .attr("transform", `translate(0, ${index * 4})`)
          }

          textElement
            .transition()
            .delay(index * 40 + i * 100)
            .duration(400)
            .attr("opacity", 1)
            .attr("transform", axis === 'x' ? `translate(${index * 6}, ${Math.sin(index * 0.2) * 2})` : `translate(${Math.sin(index * 0.2) * 2}, ${index * 4})`)
            .transition()
            .delay(500)
            .duration(300)
            .attr("transform", axis === 'x' ? `translate(${index * 6}, 0)` : `translate(0, ${index * 4})`)
            .ease(d3.easeElasticOut)
        })
      }

      axisAnimations.push(animation)
    }

    const sequenceId = `axis-labels-${Date.now()}`
    setTextAnimations(prev => new Map(prev.set(sequenceId, axisAnimations)))
    return sequenceId
  }

  /**
   * Create complex D3 narrative with multiple text animations
   */
  const createD3Narrative = async (narrativeSteps: Array<{ text: string, position?: { x: number, y: number }, delay?: number }>) => {
    const narrativeId = `d3-narrative-${Date.now()}`
    const animations: any[] = []

    for (let i = 0; i < narrativeSteps.length; i++) {
      const step = narrativeSteps[i]
      const animationType = i % 3 === 0 ? 'typing' : i % 3 === 1 ? 'wave' : 'word'

      // Create animation without executing immediately
      let animation
      switch (animationType) {
        case 'typing':
          animation = createTypingAnimation(step.text, { duration: 50, stagger: 80, easing: 'steps(1)' })
          break
        case 'wave':
          animation = createWaveAnimation(step.text, { duration: 600, stagger: 100, easing: 'easeInOutSine' })
          break
        case 'word':
          animation = createWordAnimation(step.text, { duration: 700, stagger: 200, easing: 'easeInOutQuad' })
          break
        default:
          animation = createTypingAnimation(step.text)
      }

      // Add delays between narrative steps
      if (step.delay || i > 0) {
        const delay = step.delay || 2000
        if (animation.config) {
          animation.config.delay = i * delay
        }
      }

      // Execute the animation
      await alphabetServer.executeAnimation(animation.id, ['d3'])

      animations.push(animation)

      // Brief pause between steps
      if (i < narrativeSteps.length - 1) {
        await new Promise(resolve => setTimeout(resolve, step.delay || 2000))
      }
    }

    setTextAnimations(prev => new Map(prev.set(narrativeId, animations)))
    return narrativeId
  }

  /**
   * Stop current text animation and clean up
   */
  const stopD3TextAnimation = () => {
    if (currentTextAnimation) {
      alphabetServer.stopAnimation(currentTextAnimation)

      // Remove animated text elements
      if (svgRef.current) {
        const svg = d3.select(svgRef.current)
        svg.selectAll(".d3-text-animation").remove()
        svg.selectAll(".d3-animated-text").remove()
        svg.selectAll(".d3-data-label").remove()
        svg.selectAll(".d3-axis-label").remove()
      }

      setCurrentTextAnimation(null)
      setTextAnimationProgress(0)
    }
  }

  /**
   * Get text animation performance metrics
   */
  const getD3TextMetrics = () => {
    if (!currentTextAnimation) return null
    return alphabetServer.getPerformanceMetrics(currentTextAnimation)
  }

  const canGoPrevious = currentStep > 0
  const canGoNext = currentStep < steps.length - 1
  const progress = ((currentStep + 1) / steps.length) * 100

  // Container With Most Water rendering function
  const renderContainerWithMostWater = (svg: any, mainGroup: any, data: any) => {
    const arrayGroup = mainGroup.append("g").attr("class", "container-visualization")

    // Array bars
    const bars = arrayGroup.selectAll(".bar")
      .data(data.array)
      .enter()
      .append("g")
      .attr("class", "bar")
      .attr("transform", (d: any) => `translate(${d.x}, ${d.y - d.height * 3})`)

    bars.append("rect")
      .attr("width", 30)
      .attr("height", (d: any) => d.height * 3)
      .attr("fill", (d: any) => d.fill)
      .attr("stroke", (d: any) => d.isActive ? "#1f2937" : "#d1d5db")
      .attr("stroke-width", 2)
      .attr("rx", 3)
      .transition()
      .duration(800)
      .ease(d3.easeCubicInOut)

    bars.append("text")
      .attr("x", 15)
      .attr("y", (d: any) => -d.height * 3 - 5)
      .attr("text-anchor", "middle")
      .attr("fill", "#374151")
      .attr("font-size", "12px")
      .attr("font-weight", "600")
      .text((d: any) => d.height)

    // Pointers
    data.pointers.forEach((pointer: any) => {
      arrayGroup.append("circle")
        .attr("cx", pointer.x)
        .attr("cy", pointer.y)
        .attr("r", 8)
        .attr("fill", pointer.color)
        .attr("stroke", "#ffffff")
        .attr("stroke-width", 2)
        .style("filter", "drop-shadow(0 2px 4px rgba(0,0,0,0.2))")

      arrayGroup.append("text")
        .attr("x", pointer.x)
        .attr("y", pointer.y - 15)
        .attr("text-anchor", "middle")
        .attr("fill", pointer.color)
        .attr("font-size", "12px")
        .attr("font-weight", "600")
        .text(pointer.label)
    })

    // Areas display
    const infoGroup = mainGroup.append("g").attr("class", "info-display")
    infoGroup.append("text")
      .attr("x", 50)
      .attr("y", 30)
      .attr("fill", "#059669")
      .attr("font-size", "14px")
      .attr("font-weight", "600")
      .text(`Current Area: ${data.currentArea}`)

    infoGroup.append("text")
      .attr("x", 50)
      .attr("y", 50)
      .attr("fill", "#dc2626")
      .attr("font-size", "14px")
      .attr("font-weight", "600")
      .text(`Max Area: ${data.maxArea}`)
  }

  // Enhanced String manipulation rendering function for Shortest Palindrome
  const renderStringManipulation = (svg: any, mainGroup: any, data: any) => {
    const width = 700
    const height = 400

    // Clear background
    mainGroup.append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", width)
      .attr("height", height)
      .attr("fill", "#f8fafc")
      .attr("stroke", "#e2e8f0")
      .attr("stroke-width", 1)
      .attr("rx", 8)

    // Algorithm title
    mainGroup.append("text")
      .attr("x", width / 2)
      .attr("y", 30)
      .attr("text-anchor", "middle")
      .attr("fill", "#1f2937")
      .attr("font-size", "18px")
      .attr("font-weight", "700")
      .text("Shortest Palindrome Algorithm")

    // Step indicator
    mainGroup.append("text")
      .attr("x", width / 2)
      .attr("y", 55)
      .attr("text-anchor", "middle")
      .attr("fill", "#6b7280")
      .attr("font-size", "14px")
      .text(`Step: Finding Palindromic Prefix`)

    // Original string visualization
    const originalGroup = mainGroup.append("g").attr("class", "original-string")
    originalGroup.append("text")
      .attr("x", 50)
      .attr("y", 100)
      .attr("fill", "#374151")
      .attr("font-size", "16px")
      .attr("font-weight", "600")
      .text("Original String:")

    // Handle different data formats
    let originalString = ""
    let reversedString = ""
    let currentIndex = 0

    if (data.original && typeof data.original === 'string') {
      originalString = data.original
    } else if (data.original && Array.isArray(data.original)) {
      originalString = data.original.map((char: any) => char.char || char).join('')
    }

    if (data.reversed && typeof data.reversed === 'string') {
      reversedString = data.reversed
    } else if (data.reversed && Array.isArray(data.reversed)) {
      reversedString = data.reversed.map((char: any) => char.char || char).join('')
    }

    currentIndex = data.currentIndex || data.i || 0

    // Original string characters
    const originalChars = originalString.split('')
    originalChars.forEach((char: string, index: number) => {
      const isActive = index === currentIndex
      const x = 100 + index * 35
      const y = 140

      // Character background
      originalGroup.append("rect")
        .attr("x", x - 15)
        .attr("y", y - 20)
        .attr("width", 30)
        .attr("height", 35)
        .attr("fill", isActive ? "#3b82f6" : "#ffffff")
        .attr("stroke", isActive ? "#2563eb" : "#d1d5db")
        .attr("stroke-width", 2)
        .attr("rx", 6)
        .style("filter", isActive ? "drop-shadow(0 4px 8px rgba(59, 130, 246, 0.3))" : "none")

      // Character text
      originalGroup.append("text")
        .attr("x", x)
        .attr("y", y + 5)
        .attr("text-anchor", "middle")
        .attr("fill", isActive ? "#ffffff" : "#374151")
        .attr("font-size", "18px")
        .attr("font-weight", "600")
        .text(char)

      // Index label
      originalGroup.append("text")
        .attr("x", x)
        .attr("y", y + 30)
        .attr("text-anchor", "middle")
        .attr("fill", "#6b7280")
        .attr("font-size", "12px")
        .text(`[${index}]`)
    })

    // Reversed string visualization
    const reversedGroup = mainGroup.append("g").attr("class", "reversed-string")
    reversedGroup.append("text")
      .attr("x", 50)
      .attr("y", 200)
      .attr("fill", "#374151")
      .attr("font-size", "16px")
      .attr("font-weight", "600")
      .text("Reversed String:")

    // Reversed string characters
    const reversedChars = reversedString.split('')
    reversedChars.forEach((char: string, index: number) => {
      const isActive = index === currentIndex
      const x = 100 + index * 35
      const y = 240

      // Character background
      reversedGroup.append("rect")
        .attr("x", x - 15)
        .attr("y", y - 20)
        .attr("width", 30)
        .attr("height", 35)
        .attr("fill", isActive ? "#10b981" : "#ffffff")
        .attr("stroke", isActive ? "#059669" : "#d1d5db")
        .attr("stroke-width", 2)
        .attr("rx", 6)
        .style("filter", isActive ? "drop-shadow(0 4px 8px rgba(16, 185, 129, 0.3))" : "none")

      // Character text
      reversedGroup.append("text")
        .attr("x", x)
        .attr("y", y + 5)
        .attr("text-anchor", "middle")
        .attr("fill", isActive ? "#ffffff" : "#374151")
        .attr("font-size", "18px")
        .attr("font-weight", "600")
        .text(char)

      // Index label
      reversedGroup.append("text")
        .attr("x", x)
        .attr("y", y + 30)
        .attr("text-anchor", "middle")
        .attr("fill", "#6b7280")
        .attr("font-size", "12px")
        .text(`[${index}]`)
    })

    // Comparison visualization
    if (data.s_slice && data.reversed_slice) {
      const comparisonGroup = mainGroup.append("g").attr("class", "comparison")

      // S prefix
      comparisonGroup.append("text")
        .attr("x", 50)
        .attr("y", 320)
        .attr("fill", "#374151")
        .attr("font-size", "14px")
        .attr("font-weight", "600")
        .text("S Prefix:")

      comparisonGroup.append("text")
        .attr("x", 150)
        .attr("y", 320)
        .attr("fill", "#3b82f6")
        .attr("font-size", "16px")
        .attr("font-weight", "600")
        .text(`"${data.s_slice}"`)

      // Reversed suffix
      comparisonGroup.append("text")
        .attr("x", 50)
        .attr("y", 345)
        .attr("fill", "#374151")
        .attr("font-size", "14px")
        .attr("font-weight", "600")
        .text("Reversed Suffix:")

      comparisonGroup.append("text")
        .attr("x", 180)
        .attr("y", 345)
        .attr("fill", "#10b981")
        .attr("font-size", "16px")
        .attr("font-weight", "600")
        .text(`"${data.reversed_slice}"`)

      // Match result
      const isMatch = data.s_slice === data.reversed_slice
      comparisonGroup.append("text")
        .attr("x", 50)
        .attr("y", 370)
        .attr("fill", "#374151")
        .attr("font-size", "14px")
        .attr("font-weight", "600")
        .text("Match:")

      comparisonGroup.append("text")
        .attr("x", 120)
        .attr("y", 370)
        .attr("fill", isMatch ? "#059669" : "#dc2626")
        .attr("font-size", "16px")
        .attr("font-weight", "700")
        .text(isMatch ? "✅ MATCH" : "❌ NO MATCH")
    }

    // Result visualization
    if (data.result) {
      const resultGroup = mainGroup.append("g").attr("class", "result")
      resultGroup.append("text")
        .attr("x", width / 2)
        .attr("y", 380)
        .attr("text-anchor", "middle")
        .attr("fill", "#7c3aed")
        .attr("font-size", "18px")
        .attr("font-weight", "700")
        .text(`Result: "${data.result}"`)
    }
  }

  // Linked List visualization rendering function
  const renderLinkedListVisualization = (svg: any, mainGroup: any, data: any) => {
    const width = 700
    const height = 400

    // Clear background
    mainGroup.append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", width)
      .attr("height", height)
      .attr("fill", "#f8fafc")
      .attr("stroke", "#e2e8f0")
      .attr("stroke-width", 1)
      .attr("rx", 8)

    // Algorithm title
    mainGroup.append("text")
      .attr("x", width / 2)
      .attr("y", 30)
      .attr("text-anchor", "middle")
      .attr("fill", "#1f2937")
      .attr("font-size", "18px")
      .attr("font-weight", "700")
      .text("🔗 Linked List Partition Algorithm")

    // Partition value display
    const partitionValue = data.partitionValue || 3
    mainGroup.append("text")
      .attr("x", width / 2)
      .attr("y", 55)
      .attr("text-anchor", "middle")
      .attr("fill", "#6b7280")
      .attr("font-size", "14px")
      .text(`Partition Value: ${partitionValue}`)

    // Handle different data formats
    let lessList = []
    let greaterList = []
    let finalList = []

    if (data.lessList && Array.isArray(data.lessList)) {
      lessList = data.lessList
    }
    if (data.greaterList && Array.isArray(data.greaterList)) {
      greaterList = data.greaterList
    }
    if (data.finalList && Array.isArray(data.finalList)) {
      finalList = data.finalList
    }

    // Less-than list visualization
    const lessGroup = mainGroup.append("g").attr("class", "less-list")
    lessGroup.append("text")
      .attr("x", 50)
      .attr("y", 100)
      .attr("fill", "#374151")
      .attr("font-size", "16px")
      .attr("font-weight", "600")
      .text("Less Than:")

    lessList.forEach((node: any, index: number) => {
      const value = typeof node === 'object' ? (node.value || node.val || node) : node
      const x = 100 + index * 80
      const y = 140

      // Node background
      lessGroup.append("rect")
        .attr("x", x - 20)
        .attr("y", y - 20)
        .attr("width", 40)
        .attr("height", 40)
        .attr("fill", "#10b981")
        .attr("stroke", "#059669")
        .attr("stroke-width", 2)
        .attr("rx", 8)
        .style("filter", "drop-shadow(0 4px 8px rgba(16, 185, 129, 0.3))")

      // Node value
      lessGroup.append("text")
        .attr("x", x)
        .attr("y", y + 5)
        .attr("text-anchor", "middle")
        .attr("fill", "#ffffff")
        .attr("font-size", "18px")
        .attr("font-weight", "600")
        .text(value)

      // Arrow to next node (if not last)
      if (index < lessList.length - 1) {
        lessGroup.append("path")
          .attr("d", `M ${x + 20} ${y} L ${x + 60} ${y}`)
          .attr("stroke", "#10b981")
          .attr("stroke-width", 3)
          .attr("marker-end", "url(#arrowhead-green)")
      }
    })

    // Greater-than list visualization
    const greaterGroup = mainGroup.append("g").attr("class", "greater-list")
    greaterGroup.append("text")
      .attr("x", 50)
      .attr("y", 220)
      .attr("fill", "#374151")
      .attr("font-size", "16px")
      .attr("font-weight", "600")
      .text("Greater Than:")

    greaterList.forEach((node: any, index: number) => {
      const value = typeof node === 'object' ? (node.value || node.val || node) : node
      const x = 100 + index * 80
      const y = 260

      // Node background
      greaterGroup.append("rect")
        .attr("x", x - 20)
        .attr("y", y - 20)
        .attr("width", 40)
        .attr("height", 40)
        .attr("fill", "#ef4444")
        .attr("stroke", "#dc2626")
        .attr("stroke-width", 2)
        .attr("rx", 8)
        .style("filter", "drop-shadow(0 4px 8px rgba(239, 68, 68, 0.3))")

      // Node value
      greaterGroup.append("text")
        .attr("x", x)
        .attr("y", y + 5)
        .attr("text-anchor", "middle")
        .attr("fill", "#ffffff")
        .attr("font-size", "18px")
        .attr("font-weight", "600")
        .text(value)

      // Arrow to next node (if not last)
      if (index < greaterList.length - 1) {
        greaterGroup.append("path")
          .attr("d", `M ${x + 20} ${y} L ${x + 60} ${y}`)
          .attr("stroke", "#ef4444")
          .attr("stroke-width", 3)
          .attr("marker-end", "url(#arrowhead-red)")
      }
    })

    // Final merged list visualization
    if (finalList.length > 0) {
      const finalGroup = mainGroup.append("g").attr("class", "final-list")
      finalGroup.append("text")
        .attr("x", 50)
        .attr("y", 340)
        .attr("fill", "#374151")
        .attr("font-size", "16px")
        .attr("font-weight", "600")
        .text("Final Result:")

      finalList.forEach((value: any, index: number) => {
        const actualValue = typeof value === 'object' ? (value.value || value.val || value) : value
        const x = 150 + index * 70
        const y = 380
        const isLess = actualValue < partitionValue

        // Node background
        finalGroup.append("rect")
          .attr("x", x - 20)
          .attr("y", y - 20)
          .attr("width", 40)
          .attr("height", 40)
          .attr("fill", isLess ? "#10b981" : "#ef4444")
          .attr("stroke", isLess ? "#059669" : "#dc2626")
          .attr("stroke-width", 2)
          .attr("rx", 8)
          .style("filter", "drop-shadow(0 4px 8px rgba(0,0,0,0.2))")

        // Node value
        finalGroup.append("text")
          .attr("x", x)
          .attr("y", y + 5)
          .attr("text-anchor", "middle")
          .attr("fill", "#ffffff")
          .attr("font-size", "18px")
          .attr("font-weight", "600")
          .text(actualValue)

        // Arrow to next node (if not last)
        if (index < finalList.length - 1) {
          finalGroup.append("path")
            .attr("d", `M ${x + 20} ${y} L ${x + 50} ${y}`)
            .attr("stroke", "#7c3aed")
            .attr("stroke-width", 3)
            .attr("marker-end", "url(#arrowhead-purple)")
        }
      })
    }

    // Add arrow markers
    const defs = svg.append("defs")
    defs.append("marker")
      .attr("id", "arrowhead-green")
      .attr("viewBox", "0 0 10 10")
      .attr("refX", 9)
      .attr("refY", 5)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M 0 0 L 10 5 L 0 10 z")
      .attr("fill", "#10b981")

    defs.append("marker")
      .attr("id", "arrowhead-red")
      .attr("viewBox", "0 0 10 10")
      .attr("refX", 9)
      .attr("refY", 5)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M 0 0 L 10 5 L 0 10 z")
      .attr("fill", "#ef4444")

    defs.append("marker")
      .attr("id", "arrowhead-purple")
      .attr("viewBox", "0 0 10 10")
      .attr("refX", 9)
      .attr("refY", 5)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M 0 0 L 10 5 L 0 10 z")
      .attr("fill", "#7c3aed")
  }

  // Math visualization rendering function
  const renderMathVisualization = (svg: any, mainGroup: any, data: any) => {
    data.numbers.forEach((num: any) => {
      const numGroup = mainGroup.append("g").attr("class", `number-${num.id}`)

      numGroup.append("circle")
        .attr("cx", num.x)
        .attr("cy", num.y)
        .attr("r", 40)
        .attr("fill", num.color)
        .attr("stroke", "#ffffff")
        .attr("stroke-width", 3)
        .style("filter", "drop-shadow(0 4px 8px rgba(0,0,0,0.1))")

      numGroup.append("text")
        .attr("x", num.x)
        .attr("y", num.y - 5)
        .attr("text-anchor", "middle")
        .attr("fill", "#ffffff")
        .attr("font-size", "20px")
        .attr("font-weight", "700")
        .text(num.value)

      numGroup.append("text")
        .attr("x", num.x)
        .attr("y", num.y + 60)
        .attr("text-anchor", "middle")
        .attr("fill", "#374151")
        .attr("font-size", "12px")
        .attr("font-weight", "600")
        .text(num.label)
    })

    if (data.currentDigit) {
      const digit = data.currentDigit
      const digitGroup = mainGroup.append("g").attr("class", "current-digit")

      digitGroup.append("rect")
        .attr("x", digit.x - 20)
        .attr("y", digit.y - 15)
        .attr("width", 40)
        .attr("height", 30)
        .attr("fill", digit.color)
        .attr("stroke", "#ffffff")
        .attr("stroke-width", 2)
        .attr("rx", 6)
        .style("filter", "drop-shadow(0 2px 4px rgba(0,0,0,0.1))")

      digitGroup.append("text")
        .attr("x", digit.x)
        .attr("y", digit.y + 5)
        .attr("text-anchor", "middle")
        .attr("fill", "#ffffff")
        .attr("font-size", "16px")
        .attr("font-weight", "700")
        .text(digit.value)

      digitGroup.append("text")
        .attr("x", digit.x)
        .attr("y", digit.y + 40)
        .attr("text-anchor", "middle")
        .attr("fill", "#374151")
        .attr("font-size", "11px")
        .attr("font-weight", "600")
        .text(digit.label)
    }
  }

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

      {/* Advanced Text Animation Controls */}
      <div className="bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 rounded-xl p-6 border border-teal-200 dark:border-teal-700">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="text-2xl">🎭</div>
            <div>
              <h4 className="font-semibold text-teal-800 dark:text-teal-200 mb-1">D3 Text Animations</h4>
              <p className="text-sm text-teal-700 dark:text-teal-300">
                Advanced character and word animations integrated with D3 visualizations
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => createD3TextAnimation(steps[currentStep]?.title || 'Sample Text', 'typing')}
              className="hover:scale-105 transition-all duration-200"
              disabled={!!currentTextAnimation}
            >
              ⌨️ Type
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => createD3TextAnimation(steps[currentStep]?.title || 'Sample Text', 'wave')}
              className="hover:scale-105 transition-all duration-200"
              disabled={!!currentTextAnimation}
            >
              🌊 Wave
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => createD3TextAnimation(steps[currentStep]?.title || 'Sample Text', '3d')}
              className="hover:scale-105 transition-all duration-200"
              disabled={!!currentTextAnimation}
            >
              🎲 3D
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => createD3TextAnimation(steps[currentStep]?.title || 'Sample Text', 'word')}
              className="hover:scale-105 transition-all duration-200"
              disabled={!!currentTextAnimation}
            >
              📝 Word
            </Button>
            {currentTextAnimation && (
              <Button
                variant="destructive"
                size="sm"
                onClick={stopD3TextAnimation}
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
              <span className="text-teal-700 dark:text-teal-300">Text Animation Progress</span>
              <span className="font-medium text-teal-800 dark:text-teal-200">{Math.round(textAnimationProgress)}%</span>
            </div>
            <Progress value={textAnimationProgress} className="h-2" />
          </div>
        )}

        {/* Text Animation Metrics */}
        {getD3TextMetrics() && (
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2">
            <div className="bg-white/50 dark:bg-gray-800/50 rounded p-2 text-center">
              <div className="text-xs text-teal-600 dark:text-teal-400">Duration</div>
              <div className="text-sm font-medium">{getD3TextMetrics()?.duration || 0}ms</div>
            </div>
            <div className="bg-white/50 dark:bg-gray-800/50 rounded p-2 text-center">
              <div className="text-xs text-teal-600 dark:text-teal-400">Elements</div>
              <div className="text-sm font-medium">{currentTextAnimation ? textAnimations.get(currentTextAnimation)?.elements?.length || 0 : 0}</div>
            </div>
            <div className="bg-white/50 dark:bg-gray-800/50 rounded p-2 text-center">
              <div className="text-xs text-teal-600 dark:text-teal-400">Groups</div>
              <div className="text-sm font-medium">{d3TextElements.size}</div>
            </div>
            <div className="bg-white/50 dark:bg-gray-800/50 rounded p-2 text-center">
              <div className="text-xs text-teal-600 dark:text-teal-400">Memory</div>
              <div className="text-sm font-medium">{getD3TextMetrics()?.memoryUsage || 0}MB</div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-4 flex gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => createD3Narrative([
              { text: "Step 1: Initialize", position: { x: 200, y: 150 }, delay: 1000 },
              { text: "Step 2: Process", position: { x: 300, y: 200 }, delay: 1500 },
              { text: "Step 3: Complete", position: { x: 400, y: 250 }, delay: 1000 }
            ])}
            className="text-xs"
          >
            📚 Narrative
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => createAnimatedDataLabels(
              [10, 25, 15, 30, 20],
              [{ x: 150, y: 180 }, { x: 250, y: 150 }, { x: 350, y: 200 }, { x: 450, y: 160 }, { x: 550, y: 190 }]
            )}
            className="text-xs"
          >
            📊 Data Labels
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => createAnimatedAxisLabels(
              ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
              'x',
              [150, 250, 350, 450, 550]
            )}
            className="text-xs"
          >
            📈 Axis Labels
          </Button>
        </div>
      </div>
    </div>
  )
}
