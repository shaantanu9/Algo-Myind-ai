/**
 * Visual Generators
 * Functions to create visual elements for different animation types
 */

import { Position, Size, ColorPalette, AnimationFrame, AnimationHighlight } from './animation-core'
import { AlgorithmData } from './data-transformers'

export interface VisualElement {
  id: string
  type: 'node' | 'edge' | 'text' | 'shape' | 'line' | 'group'
  position: Position
  size?: Size
  style: VisualStyle
  data?: any
  children?: VisualElement[]
  animations?: VisualAnimation[]
}

export interface VisualStyle {
  fill?: string
  stroke?: string
  strokeWidth?: number
  opacity?: number
  fontSize?: number
  fontWeight?: string
  borderRadius?: number
  shadow?: boolean
  gradient?: string[]
  pattern?: string
}

export interface VisualAnimation {
  property: string
  from: any
  to: any
  duration: number
  easing: string
  delay?: number
  repeat?: boolean
}

// Mermaid Visual Generator
export class MermaidGenerator {
  static generateDiagram(data: AlgorithmData, highlights: AnimationHighlight[] = []): string {
    const { array = [], target = 0, currentIndex = 0, hashMap = {}, complement, found, result } = data
    const hashEntries = Object.entries(hashMap)

    let diagram = `flowchart TD
    %% Algorithm Overview
    subgraph Algorithm["🎯 Algorithm State"]
        direction LR
        Target["🎯 Target: ${target}"]
        Progress["📊 Step: ${currentIndex + 1}/${array.length}"]
    end

    %% Data Visualization
    subgraph Data["📥 Input Data"]
        direction LR`

    // Generate array nodes with highlights
    array.forEach((value: number, index: number) => {
      const isActive = index === currentIndex
      const isResult = result && result.includes(index)
      const isInMap = Object.values(hashMap).includes(index)

      let style = this.getHighlightStyle(isActive, isResult, isInMap)
      let emoji = this.getElementEmoji(isActive, isResult, isInMap)

      diagram += `
        Arr${index}["${emoji} ${value}<br/>Index: ${index}"]${style}`
    })

    diagram += `
    end

    %% Processing Section
    subgraph Processing["⚙️ Current Processing"]
        direction TB`

    if (currentIndex >= 0 && currentIndex < array.length) {
      diagram += `
        Current["📍 Processing: ${array[currentIndex]}<br/>Index: ${currentIndex}"]:::active`
    }

    if (complement !== undefined) {
      const isFound = hashMap[complement] !== undefined
      diagram += `
        Complement["🔍 Looking for: ${complement}"]${isFound ? ':::found' : ':::searching'}`
    }

    diagram += `
    end

    %% Memory Section
    subgraph Memory["🧠 Memory (Hash Map)"]
        direction LR`

    if (hashEntries.length === 0) {
      diagram += `
        Empty["📭 Empty Map"]:::empty`
    } else {
      hashEntries.forEach(([key, value], index) => {
        const isComplement = complement !== undefined && parseInt(key) === complement
        diagram += `
        Map${index}["${key} → ${value}"]${isComplement ? ':::highlight' : ':::stored'}`
      })
    }

    diagram += `
    end

    %% Result Section
    subgraph Result["🎯 Result"]
        direction LR`

    if (found && result) {
      diagram += `
        Success["✅ SOLUTION FOUND!<br/>Indices: [${result.join(', ')}]<br/>Values: [${result.map((i: number) => array[i]).join(', ')}]"]:::success
        Formula["✨ ${array[result[0]]} + ${array[result[1]]} = ${target}"]:::formula`
    } else if (currentIndex >= array.length) {
      diagram += `
        NotFound["❌ Target not found in array"]:::error`
    } else {
      diagram += `
        InProgress["🔄 Processing..."]:::pending`
    }

    diagram += `
    end

    %% Flow Connections
    Algorithm --> Data
    Data --> Processing
    Processing --> Memory
    Memory --> Result`

    // Add specific connections based on state
    if (currentIndex >= 0 && currentIndex < array.length) {
      diagram += `
    Arr${currentIndex} -.-> Current`
    }

    if (complement !== undefined && hashMap[complement] !== undefined) {
      const complementIndex = hashEntries.findIndex(([key]) => parseInt(key) === complement)
      diagram += `
    Complement -.-> Map${complementIndex}`
    }

    // Enhanced styling
    diagram += this.generateMermaidStyles()

    return diagram
  }

  static getHighlightStyle(isActive: boolean, isResult: boolean, isInMap: boolean): string {
    if (isResult) return ':::success'
    if (isActive) return ':::active'
    if (isInMap) return ':::mapped'
    return ':::default'
  }

  static getElementEmoji(isActive: boolean, isResult: boolean, isInMap: boolean): string {
    if (isResult) return '🎯'
    if (isActive) return '⚡'
    if (isInMap) return '💾'
    return '📦'
  }

  static generateMermaidStyles(): string {
    return `

    %% Enhanced Styling Classes
    classDef default fill:#f8fafc,stroke:#e2e8f0,color:#64748b,stroke-width:2px
    classDef active fill:#3b82f6,stroke:#2563eb,color:#fff,stroke-width:3px,animation:pulse 2s infinite
    classDef success fill:#22c55e,stroke:#16a34a,color:#fff,stroke-width:4px,animation:celebration 2s ease-in-out
    classDef error fill:#ef4444,stroke:#dc2626,color:#fff,stroke-width:2px
    classDef mapped fill:#8b5cf6,stroke:#7c3aed,color:#fff,stroke-width:2px
    classDef found fill:#22c55e,stroke:#16a34a,color:#fff,stroke-width:3px,animation:pulse 1.5s infinite
    classDef searching fill:#f59e0b,stroke:#d97706,color:#fff,stroke-width:2px
    classDef stored fill:#06b6d4,stroke:#0891b2,color:#fff,stroke-width:2px
    classDef highlight fill:#f59e0b,stroke:#d97706,color:#fff,stroke-width:3px,animation:pulse 1s infinite
    classDef empty fill:#6b7280,stroke:#4b5563,color:#fff,stroke-width:2px
    classDef pending fill:#6b7280,stroke:#4b5563,color:#fff,stroke-width:2px
    classDef formula fill:#fbbf24,stroke:#f59e0b,color:#92400e,stroke-width:2px,font-weight:bold

    %% Apply Styles to Main Elements
    class Target,Progress active
    class Current active
    class Success success
    class Formula formula`
  }
}

// React Flow Visual Generator
export class ReactFlowGenerator {
  static generateNodes(data: AlgorithmData, highlights: AnimationHighlight[] = []) {
    const nodes: any[] = []
    const { array = [], target = 0, currentIndex = 0, hashMap = {}, complement, found, result } = data

    // Algorithm header node
    nodes.push({
      id: 'algorithm-header',
      type: 'custom',
      position: { x: 300, y: -50 },
      data: {
        label: '🎯 Two Sum Algorithm',
        subLabel: `Step ${currentIndex + 1}/${array.length}`,
        emoji: '🎯',
        isHighlighted: true
      }
    })

    // Target node
    nodes.push({
      id: 'target',
      type: 'custom',
      position: { x: 300, y: 50 },
      data: {
        label: 'Target Value',
        subLabel: target.toString(),
        emoji: '🎯',
        isHighlighted: true
      }
    })

    // Array element nodes
    array.forEach((value: number, index: number) => {
      const isActive = index === currentIndex
      const isResult = result && result.includes(index)
      const isInMap = Object.values(hashMap).includes(index)

      nodes.push({
        id: `array-${index}`,
        type: 'custom',
        position: { x: index * 120 - (array.length * 60) + 300, y: 150 },
        data: {
          label: value.toString(),
          subLabel: `Index: ${index}`,
          emoji: isResult ? '🎯' : isActive ? '⚡' : isInMap ? '💾' : '📦',
          isActive,
          isResult,
          isHighlighted: isInMap
        }
      })
    })

    // Processing node
    if (currentIndex >= 0 && currentIndex < array.length) {
      nodes.push({
        id: 'current-processing',
        type: 'custom',
        position: { x: 200, y: 250 },
        data: {
          label: 'Current Element',
          subLabel: `${array[currentIndex]} (Index: ${currentIndex})`,
          emoji: '⚙️',
          isActive: true
        }
      })
    }

    // Complement node
    if (complement !== undefined) {
      const isComplementFound = hashMap[complement] !== undefined
      nodes.push({
        id: 'complement',
        type: 'custom',
        position: { x: 400, y: 250 },
        data: {
          label: 'Looking for Complement',
          subLabel: complement.toString(),
          emoji: isComplementFound ? '✅' : '🔍',
          isResult: isComplementFound
        }
      })
    }

    // Hash map nodes
    Object.entries(hashMap).forEach(([key, value], index) => {
      const isComplement = complement !== undefined && parseInt(key) === complement
      nodes.push({
        id: `hash-${index}`,
        type: 'custom',
        position: { x: index * 120 - (Object.keys(hashMap).length * 60) + 300, y: 350 },
        data: {
          label: key.toString(),
          subLabel: `→ ${value}`,
          emoji: isComplement ? '🎯' : '💾',
          isResult: isComplement,
          isHighlighted: isComplement
        }
      })
    })

    // Result node
    if (found && result) {
      nodes.push({
        id: 'result',
        type: 'custom',
        position: { x: 300, y: 450 },
        data: {
          label: 'SOLUTION FOUND!',
          subLabel: `Indices: [${result.join(', ')}] | Values: [${result.map((i: number) => array[i]).join(', ')}]`,
          emoji: '🎉',
          isResult: true
        }
      })
    }

    return nodes
  }

  static generateEdges(data: AlgorithmData) {
    const edges: any[] = []
    const { array = [], currentIndex = 0, hashMap = {}, complement, found, result } = data

    // Basic flow edges
    edges.push(
      { id: 'target-to-array', source: 'algorithm-header', target: 'target', animated: false },
      { id: 'target-to-first', source: 'target', target: 'array-0', animated: true }
    )

    // Current element connections
    if (currentIndex >= 0 && currentIndex < array.length) {
      edges.push({
        id: 'current-connection',
        source: `array-${currentIndex}`,
        target: 'current-processing',
        animated: true,
        style: { stroke: '#3b82f6', strokeWidth: 3 }
      })
    }

    // Complement connections
    if (complement !== undefined) {
      edges.push({
        id: 'complement-connection',
        source: 'current-processing',
        target: 'complement',
        animated: true,
        style: { stroke: '#f59e0b', strokeWidth: 2 }
      })

      // Connect to found hash entry
      const hashEntries = Object.entries(hashMap)
      const complementIndex = hashEntries.findIndex(([key]) => parseInt(key) === complement)
      if (complementIndex >= 0) {
        edges.push({
          id: 'complement-found',
          source: 'complement',
          target: `hash-${complementIndex}`,
          animated: true,
          style: { stroke: '#22c55e', strokeWidth: 4 }
        })
      }
    }

    // Hash map connections
    Object.entries(hashMap).forEach((_, index) => {
      edges.push({
        id: `hash-connection-${index}`,
        source: 'current-processing',
        target: `hash-${index}`,
        animated: false,
        style: { stroke: '#06b6d4', strokeWidth: 1 }
      })
    })

    // Result connections
    if (found && result) {
      edges.push({
        id: 'result-connection',
        source: 'complement',
        target: 'result',
        animated: true,
        style: { stroke: '#22c55e', strokeWidth: 4 }
      })
    }

    return edges
  }
}

// D3.js Visual Generator
export class D3Generator {
  static generateElements(data: AlgorithmData, highlights: AnimationHighlight[] = []) {
    const elements: VisualElement[] = []
    const { array = [], target = 0, currentIndex = 0, hashMap = {}, complement, found, result } = data

    // Array elements
    array.forEach((value: number, index: number) => {
      const isActive = index === currentIndex
      const isResult = result && result.includes(index)
      const isInMap = Object.values(hashMap).includes(index)

      elements.push({
        id: `array-${index}`,
        type: 'shape',
        position: { x: index * 80 + 100, y: 150 },
        size: { width: 60, height: 40 },
        style: this.getD3Style(isActive, isResult, isInMap),
        data: { value, index },
        animations: isActive ? [{
          property: 'scale',
          from: 1,
          to: 1.1,
          duration: 500,
          easing: 'elastic',
          repeat: true
        }] : []
      })

      // Index label
      elements.push({
        id: `array-label-${index}`,
        type: 'text',
        position: { x: index * 80 + 130, y: 190 },
        style: { fontSize: 11, fill: '#64748b' },
        data: { text: `[${index}]` }
      })
    })

    // Target element
    elements.push({
      id: 'target',
      type: 'shape',
      position: { x: 400, y: 50 },
      size: { width: 100, height: 50 },
      style: { fill: '#fef3c7', stroke: '#f59e0b', strokeWidth: 3, borderRadius: 8 },
      data: { type: 'target', value: target },
      animations: [{
        property: 'opacity',
        from: 0.7,
        to: 1,
        duration: 1000,
        easing: 'cubic',
        repeat: true,
        yoyo: true
      }]
    })

    // Hash map elements
    Object.entries(hashMap).forEach(([key, value], index) => {
      const isComplement = complement !== undefined && parseInt(key) === complement

      elements.push({
        id: `hash-${index}`,
        type: 'shape',
        position: { x: 100, y: 280 + index * 40 },
        size: { width: 120, height: 30 },
        style: {
          fill: isComplement ? '#dcfce7' : '#f0f9ff',
          stroke: isComplement ? '#22c55e' : '#0ea5e9',
          strokeWidth: isComplement ? 3 : 2,
          borderRadius: 6
        },
        data: { key, value },
        animations: isComplement ? [{
          property: 'glow',
          from: 0,
          to: 10,
          duration: 500,
          easing: 'cubic',
          repeat: true,
          yoyo: true
        }] : []
      })
    })

    // Success animation
    if (found && result) {
      elements.push({
        id: 'success-banner',
        type: 'shape',
        position: { x: 200, y: 400 },
        size: { width: 400, height: 60 },
        style: {
          fill: '#22c55e',
          stroke: '#16a34a',
          strokeWidth: 4,
          borderRadius: 12,
          opacity: 0
        },
        data: { type: 'success' },
        animations: [{
          property: 'opacity',
          from: 0,
          to: 1,
          duration: 800,
          easing: 'cubic'
        }, {
          property: 'scale',
          from: 0.8,
          to: 1,
          duration: 600,
          easing: 'elastic'
        }]
      })
    }

    return elements
  }

  static getD3Style(isActive: boolean, isResult: boolean, isInMap: boolean) {
    if (isResult) {
      return { fill: '#22c55e', stroke: '#16a34a', strokeWidth: 3, borderRadius: 6 }
    }
    if (isActive) {
      return { fill: '#3b82f6', stroke: '#2563eb', strokeWidth: 3, borderRadius: 6 }
    }
    if (isInMap) {
      return { fill: '#8b5cf6', stroke: '#7c3aed', strokeWidth: 2, borderRadius: 6 }
    }
    return { fill: '#f1f5f9', stroke: '#cbd5e1', strokeWidth: 2, borderRadius: 6 }
  }
}

// Three.js Visual Generator
export class ThreeGenerator {
  static generateScene(data: AlgorithmData, highlights: AnimationHighlight[] = []) {
    const elements: VisualElement[] = []
    const { array = [], target = 0, currentIndex = 0, hashMap = {}, complement, found, result } = data

    // Array boxes
    array.forEach((value: number, index: number) => {
      const isActive = index === currentIndex
      const isResult = result && result.includes(index)
      const isInMap = Object.values(hashMap).includes(index)

      elements.push({
        id: `array-3d-${index}`,
        type: 'shape',
        position: { x: index * 2 - array.length, y: 0, z: 0 },
        size: { width: 1.5, height: 1.5, depth: 1.5 },
        style: this.getThreeStyle(isActive, isResult, isInMap),
        data: { value, index, type: 'box' },
        animations: isActive ? [{
          property: 'position',
          from: { x: index * 2 - array.length, y: 0, z: 0 },
          to: { x: index * 2 - array.length, y: 0.5, z: 0 },
          duration: 500,
          easing: 'bounce',
          repeat: true,
          yoyo: true
        }] : []
      })
    })

    // Hash map spheres
    Object.entries(hashMap).forEach(([key, value], index) => {
      const isComplement = complement !== undefined && parseInt(key) === complement

      elements.push({
        id: `hash-3d-${index}`,
        type: 'shape',
        position: { x: index * 2.5 - Object.keys(hashMap).length * 1.25, y: 3, z: 0 },
        size: { width: 0.8, height: 0.8, depth: 0.8 },
        style: {
          fill: isComplement ? '#f59e0b' : '#8b5cf6',
          metalness: 0.6,
          roughness: 0.2,
          emissive: isComplement ? '#d97706' : '#7c3aed',
          emissiveIntensity: isComplement ? 0.3 : 0.1
        },
        data: { key, value, type: 'sphere' },
        animations: isComplement ? [{
          property: 'scale',
          from: { x: 0.8, y: 0.8, z: 0.8 },
          to: { x: 1.2, y: 1.2, z: 1.2 },
          duration: 800,
          easing: 'elastic',
          repeat: true,
          yoyo: true
        }] : []
      })
    })

    // Target cylinder
    elements.push({
      id: 'target-3d',
      type: 'shape',
      position: { x: 0, y: -3, z: 0 },
      size: { width: 2, height: 1, depth: 1 },
      style: { fill: '#fef3c7', metalness: 0.3, roughness: 0.7 },
      data: { value: target, type: 'cylinder' }
    })

    // Success particles
    if (found && result) {
      for (let i = 0; i < 20; i++) {
        elements.push({
          id: `particle-${i}`,
          type: 'shape',
          position: {
            x: (Math.random() - 0.5) * 10,
            y: (Math.random() - 0.5) * 10,
            z: (Math.random() - 0.5) * 10
          },
          size: { width: 0.05, height: 0.05, depth: 0.05 },
          style: { fill: '#fbbf24', emissive: '#f59e0b', emissiveIntensity: 0.5 },
          data: { type: 'particle' },
          animations: [{
            property: 'position',
            from: {
              x: (Math.random() - 0.5) * 10,
              y: (Math.random() - 0.5) * 10,
              z: (Math.random() - 0.5) * 10
            },
            to: {
              x: (Math.random() - 0.5) * 20,
              y: (Math.random() - 0.5) * 20,
              z: (Math.random() - 0.5) * 20
            },
            duration: 2000 + Math.random() * 1000,
            easing: 'cubic'
          }]
        })
      }
    }

    return elements
  }

  static getThreeStyle(isActive: boolean, isResult: boolean, isInMap: boolean) {
    if (isResult) {
      return {
        fill: '#22c55e',
        metalness: 0.5,
        roughness: 0.3,
        emissive: '#166534',
        emissiveIntensity: 0.2
      }
    }
    if (isActive) {
      return {
        fill: '#3b82f6',
        metalness: 0.5,
        roughness: 0.3,
        emissive: '#1e40af',
        emissiveIntensity: 0.3
      }
    }
    if (isInMap) {
      return {
        fill: '#8b5cf6',
        metalness: 0.5,
        roughness: 0.3,
        emissive: '#7c3aed',
        emissiveIntensity: 0.1
      }
    }
    return {
      fill: '#6b7280',
      metalness: 0.3,
      roughness: 0.5,
      emissive: '#000000',
      emissiveIntensity: 0
    }
  }
}

// Unified Visual Generator Factory
export class VisualGeneratorFactory {
  static createGenerator(type: 'mermaid' | 'reactflow' | 'd3' | 'three') {
    switch (type) {
      case 'mermaid':
        return MermaidGenerator
      case 'reactflow':
        return ReactFlowGenerator
      case 'd3':
        return D3Generator
      case 'three':
        return ThreeGenerator
      default:
        throw new Error(`Unknown generator type: ${type}`)
    }
  }

  static generateVisuals(type: 'mermaid' | 'reactflow' | 'd3' | 'three', data: AlgorithmData, highlights: AnimationHighlight[] = []) {
    const generator = this.createGenerator(type)

    switch (type) {
      case 'mermaid':
        return (generator as typeof MermaidGenerator).generateDiagram(data, highlights)
      case 'reactflow':
        return {
          nodes: (generator as typeof ReactFlowGenerator).generateNodes(data, highlights),
          edges: (generator as typeof ReactFlowGenerator).generateEdges(data)
        }
      case 'd3':
        return (generator as typeof D3Generator).generateElements(data, highlights)
      case 'three':
        return (generator as typeof ThreeGenerator).generateScene(data, highlights)
      default:
        throw new Error(`Unknown generator type: ${type}`)
    }
  }
}
