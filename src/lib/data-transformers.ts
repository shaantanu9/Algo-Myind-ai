/**
 * Data Transformers
 * Functions to transform algorithm data into animation-ready formats
 */

import { Position, Size, ColorPalette, AnimationState } from './animation-core'

export interface AlgorithmData {
  id?: string
  problemId?: number
  array?: number[]
  target?: number
  currentIndex?: number
  hashMap?: Record<string, any>
  complement?: number
  found?: boolean
  result?: number[]
  tree?: TreeNode
  graph?: GraphData
  matrix?: number[][]
  lastModified?: number
  createdAt?: number
  [key: string]: any
}

export interface TreeNode {
  value: any
  left?: TreeNode
  right?: TreeNode
  children?: TreeNode[]
  id: string
  position?: Position
}

export interface GraphData {
  nodes: GraphNode[]
  edges: GraphEdge[]
}

export interface GraphNode {
  id: string
  value: any
  position: Position
  visited?: boolean
  inPath?: boolean
}

export interface GraphEdge {
  source: string
  target: string
  weight?: number
  directed?: boolean
  highlighted?: boolean
}

export interface AnimationFrame {
  step: number
  title: string
  description: string
  data: AlgorithmData
  highlights: AnimationHighlight[]
  transitions: AnimationTransition[]
}

export interface AnimationHighlight {
  type: 'node' | 'edge' | 'value' | 'range'
  target: string | number[]
  style: 'active' | 'success' | 'error' | 'warning' | 'neutral'
  duration?: number
}

export interface AnimationTransition {
  from: Position
  to: Position
  duration: number
  easing: string
  element: string
}

// Array Transformation Utilities
export class ArrayTransformer {
  static toAnimationPositions(array: number[], layout: 'linear' | 'circular' | 'grid' = 'linear'): Position[] {
    const positions: Position[] = []

    switch (layout) {
      case 'linear':
        array.forEach((_, index) => {
          positions.push({
            x: index * 120 - (array.length * 60) + 300,
            y: 150,
            z: 0
          })
        })
        break

      case 'circular':
        const radius = Math.max(100, array.length * 15)
        const center = { x: 300, y: 200, z: 0 }
        array.forEach((_, index) => {
          const angle = (index / array.length) * Math.PI * 2
          positions.push({
            x: center.x + Math.cos(angle) * radius,
            y: center.y + Math.sin(angle) * radius,
            z: 0
          })
        })
        break

      case 'grid':
        const cols = Math.ceil(Math.sqrt(array.length))
        const rows = Math.ceil(array.length / cols)
        array.forEach((_, index) => {
          const col = index % cols
          const row = Math.floor(index / cols)
          positions.push({
            x: col * 100 + 200,
            y: row * 80 + 100,
            z: 0
          })
        })
        break
    }

    return positions
  }

  static createArrayHighlights(array: number[], currentIndex: number, result?: number[]): AnimationHighlight[] {
    const highlights: AnimationHighlight[] = []

    // Current element highlight
    if (currentIndex >= 0 && currentIndex < array.length) {
      highlights.push({
        type: 'node',
        target: currentIndex,
        style: 'active',
        duration: 500
      })
    }

    // Result elements highlight
    if (result) {
      result.forEach(index => {
        highlights.push({
          type: 'node',
          target: index,
          style: 'success',
          duration: 1000
        })
      })
    }

    return highlights
  }

  static calculateArrayTransitions(fromIndex: number, toIndex: number, positions: Position[]): AnimationTransition[] {
    if (fromIndex === toIndex) return []

    return [{
      from: positions[fromIndex],
      to: positions[toIndex],
      duration: 600,
      easing: 'cubic',
      element: `array-${fromIndex}`
    }]
  }
}

// Hash Map Transformation Utilities
export class HashMapTransformer {
  static toAnimationPositions(hashMap: Record<string, any>, layout: 'vertical' | 'horizontal' | 'circular' = 'vertical'): Position[] {
    const entries = Object.entries(hashMap)
    const positions: Position[] = []
    const baseX = 100
    const baseY = 300

    switch (layout) {
      case 'vertical':
        entries.forEach((_, index) => {
          positions.push({
            x: baseX,
            y: baseY + index * 50,
            z: 0
          })
        })
        break

      case 'horizontal':
        entries.forEach((_, index) => {
          positions.push({
            x: baseX + index * 150,
            y: baseY,
            z: 0
          })
        })
        break

      case 'circular':
        const radius = Math.max(80, entries.length * 20)
        entries.forEach((_, index) => {
          const angle = (index / entries.length) * Math.PI * 2
          positions.push({
            x: 400 + Math.cos(angle) * radius,
            y: baseY + Math.sin(angle) * radius,
            z: 0
          })
        })
        break
    }

    return positions
  }

  static createHashMapHighlights(hashMap: Record<string, any>, complement?: number): AnimationHighlight[] {
    const highlights: AnimationHighlight[] = []

    if (complement !== undefined && hashMap[complement] !== undefined) {
      highlights.push({
        type: 'node',
        target: complement.toString(),
        style: 'success',
        duration: 800
      })
    }

    return highlights
  }
}

// Tree Transformation Utilities
export class TreeTransformer {
  static toAnimationPositions(root: TreeNode | null, layout: 'binary' | 'radial' | 'compact' = 'binary'): Map<string, Position> {
    const positions = new Map<string, Position>()

    if (!root) return positions

    const traverse = (node: TreeNode, x: number, y: number, level: number = 0): void => {
      positions.set(node.id, { x, y, z: 0 })

      if (layout === 'binary') {
        if (node.left) {
          traverse(node.left, x - 100 / (level + 1), y + 80, level + 1)
        }
        if (node.right) {
          traverse(node.right, x + 100 / (level + 1), y + 80, level + 1)
        }
      } else if (layout === 'radial') {
        // Radial layout implementation
        const children = node.children || []
        children.forEach((child, index) => {
          const angle = (index / children.length) * Math.PI * 2
          const radius = 80
          traverse(child, x + Math.cos(angle) * radius, y + Math.sin(angle) * radius, level + 1)
        })
      }
    }

    traverse(root, 400, 100)
    return positions
  }

  static createTreeHighlights(currentNode?: TreeNode, path?: TreeNode[]): AnimationHighlight[] {
    const highlights: AnimationHighlight[] = []

    if (currentNode) {
      highlights.push({
        type: 'node',
        target: currentNode.id,
        style: 'active',
        duration: 500
      })
    }

    if (path) {
      path.forEach(node => {
        highlights.push({
          type: 'node',
          target: node.id,
          style: 'success',
          duration: 300
        })
      })
    }

    return highlights
  }
}

// Graph Transformation Utilities
export class GraphTransformer {
  static calculateOptimalPositions(nodes: GraphNode[], edges: GraphEdge[], algorithm: 'force' | 'circular' | 'grid' = 'force'): void {
    switch (algorithm) {
      case 'force':
        this.applyForceDirectedLayout(nodes, edges)
        break
      case 'circular':
        this.applyCircularLayout(nodes)
        break
      case 'grid':
        this.applyGridLayout(nodes)
        break
    }
  }

  static applyForceDirectedLayout(nodes: GraphNode[], edges: GraphEdge[]): void {
    // Simplified force-directed layout
    const iterations = 50
    const repulsion = 500
    const attraction = 0.01

    for (let iter = 0; iter < iterations; iter++) {
      // Calculate repulsive forces
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[j].position.x - nodes[i].position.x
          const dy = nodes[j].position.y - nodes[i].position.y
          const distance = Math.sqrt(dx * dx + dy * dy) || 1

          const force = repulsion / (distance * distance)
          const fx = (dx / distance) * force
          const fy = (dy / distance) * force

          nodes[i].position.x -= fx * 0.1
          nodes[i].position.y -= fy * 0.1
          nodes[j].position.x += fx * 0.1
          nodes[j].position.y += fy * 0.1
        }
      }

      // Calculate attractive forces
      edges.forEach(edge => {
        const source = nodes.find(n => n.id === edge.source)
        const target = nodes.find(n => n.id === edge.target)

        if (source && target) {
          const dx = target.position.x - source.position.x
          const dy = target.position.y - source.position.y
          const distance = Math.sqrt(dx * dx + dy * dy) || 1

          const force = distance * attraction
          const fx = (dx / distance) * force
          const fy = (dy / distance) * force

          source.position.x += fx * 0.1
          source.position.y += fy * 0.1
          target.position.x -= fx * 0.1
          target.position.y -= fy * 0.1
        }
      })
    }
  }

  static applyCircularLayout(nodes: GraphNode[]): void {
    const radius = Math.max(150, nodes.length * 20)
    const center = { x: 400, y: 250 }

    nodes.forEach((node, index) => {
      const angle = (index / nodes.length) * Math.PI * 2
      node.position.x = center.x + Math.cos(angle) * radius
      node.position.y = center.y + Math.sin(angle) * radius
    })
  }

  static applyGridLayout(nodes: GraphNode[]): void {
    const cols = Math.ceil(Math.sqrt(nodes.length))
    const rows = Math.ceil(nodes.length / cols)

    nodes.forEach((node, index) => {
      const col = index % cols
      const row = Math.floor(index / cols)
      node.position.x = col * 100 + 300
      node.position.y = row * 80 + 200
    })
  }

  static createGraphHighlights(visitedNodes: string[], path: string[]): AnimationHighlight[] {
    const highlights: AnimationHighlight[] = []

    visitedNodes.forEach(nodeId => {
      highlights.push({
        type: 'node',
        target: nodeId,
        style: 'neutral',
        duration: 300
      })
    })

    path.forEach(nodeId => {
      highlights.push({
        type: 'node',
        target: nodeId,
        style: 'success',
        duration: 500
      })
    })

    // Add edge highlights for path
    for (let i = 0; i < path.length - 1; i++) {
      highlights.push({
        type: 'edge',
        target: [path[i], path[i + 1]],
        style: 'success',
        duration: 500
      })
    }

    return highlights
  }
}

// Animation Frame Generator
export class AnimationFrameGenerator {
  static createFrames(algorithmData: AlgorithmData, algorithmType: string): AnimationFrame[] {
    const frames: AnimationFrame[] = []

    switch (algorithmType) {
      case 'two-sum':
        frames.push(...this.generateTwoSumFrames(algorithmData))
        break
      case 'binary-search':
        frames.push(...this.generateBinarySearchFrames(algorithmData))
        break
      case 'bubble-sort':
        frames.push(...this.generateBubbleSortFrames(algorithmData))
        break
      case 'dfs':
        frames.push(...this.generateDFSFrames(algorithmData))
        break
      default:
        frames.push(this.generateDefaultFrame(algorithmData))
    }

    return frames
  }

  static generateTwoSumFrames(data: AlgorithmData): AnimationFrame[] {
    const frames: AnimationFrame[] = []
    const { array = [], target = 0, hashMap = {} } = data

    // Initialization frame
    frames.push({
      step: 0,
      title: "Initialize",
      description: "Start with empty hash map",
      data: { array, target, currentIndex: -1, hashMap: {} },
      highlights: [],
      transitions: []
    })

    // Processing frames
    array.forEach((value, index) => {
      const complement = target - value
      const found = hashMap[complement] !== undefined

      frames.push({
        step: index + 1,
        title: found ? "Solution Found!" : "Process Element",
        description: found
          ? `Found complement ${complement} in hash map at index ${hashMap[complement]}`
          : `Add ${value} to hash map, look for complement ${complement}`,
        data: {
          array,
          target,
          currentIndex: index,
          hashMap: found ? hashMap : { ...hashMap, [value]: index },
          complement,
          found
        },
        highlights: ArrayTransformer.createArrayHighlights(array, index, found ? [hashMap[complement], index] : undefined),
        transitions: []
      })

      if (found) {
        frames.push({
          step: index + 2,
          title: "Complete",
          description: `Solution: indices [${hashMap[complement]}, ${index}] with values [${array[hashMap[complement]]}, ${value}]`,
          data: {
            array,
            target,
            currentIndex: index,
            hashMap,
            complement,
            found: true,
            result: [hashMap[complement], index]
          },
          highlights: ArrayTransformer.createArrayHighlights(array, index, [hashMap[complement], index]),
          transitions: []
        })
        break
      }
    })

    return frames
  }

  static generateBinarySearchFrames(data: AlgorithmData): AnimationFrame[] {
    const frames: AnimationFrame[] = []
    const { array = [], target = 0 } = data

    let left = 0
    let right = array.length - 1
    let step = 0

    while (left <= right) {
      const mid = Math.floor((left + right) / 2)
      const midValue = array[mid]

      frames.push({
        step: step++,
        title: "Binary Search Step",
        description: `Check middle element at index ${mid}: ${midValue}`,
        data: { array, target, left, right, mid, currentIndex: mid },
        highlights: [{
          type: 'range',
          target: [left, right],
          style: 'active',
          duration: 500
        }],
        transitions: []
      })

      if (midValue === target) {
        frames.push({
          step: step,
          title: "Target Found!",
          description: `Element ${target} found at index ${mid}`,
          data: { array, target, left, right, mid, found: true, result: mid },
          highlights: [{
            type: 'node',
            target: mid,
            style: 'success',
            duration: 1000
          }],
          transitions: []
        })
        break
      } else if (midValue < target) {
        left = mid + 1
        frames.push({
          step: step,
          title: "Search Right Half",
          description: `${midValue} < ${target}, search right half`,
          data: { array, target, left, right, mid },
          highlights: [{
            type: 'range',
            target: [mid + 1, right],
            style: 'warning',
            duration: 500
          }],
          transitions: []
        })
      } else {
        right = mid - 1
        frames.push({
          step: step,
          title: "Search Left Half",
          description: `${midValue} > ${target}, search left half`,
          data: { array, target, left, right, mid },
          highlights: [{
            type: 'range',
            target: [left, mid - 1],
            style: 'warning',
            duration: 500
          }],
          transitions: []
        })
      }
    }

    if (left > right) {
      frames.push({
        step: step,
        title: "Target Not Found",
        description: `Element ${target} not found in array`,
        data: { array, target, left, right, found: false },
        highlights: [{
          type: 'node',
          target: -1,
          style: 'error',
          duration: 1000
        }],
        transitions: []
      })
    }

    return frames
  }

  static generateBubbleSortFrames(data: AlgorithmData): AnimationFrame[] {
    const frames: AnimationFrame[] = []
    const array = [...(data.array || [])]
    let step = 0

    frames.push({
      step: step++,
      title: "Initial Array",
      description: "Starting bubble sort algorithm",
      data: { array: [...array], currentIndex: -1 },
      highlights: [],
      transitions: []
    })

    for (let i = 0; i < array.length - 1; i++) {
      for (let j = 0; j < array.length - i - 1; j++) {
        frames.push({
          step: step++,
          title: "Compare Elements",
          description: `Compare ${array[j]} and ${array[j + 1]}`,
          data: { array: [...array], currentIndex: j, compareIndex: j + 1 },
          highlights: [
            { type: 'node', target: j, style: 'active', duration: 300 },
            { type: 'node', target: j + 1, style: 'active', duration: 300 }
          ],
          transitions: []
        })

        if (array[j] > array[j + 1]) {
          // Swap elements
          [array[j], array[j + 1]] = [array[j + 1], array[j]]

          frames.push({
            step: step++,
            title: "Swap Elements",
            description: `Swap ${array[j + 1]} and ${array[j]}`,
            data: { array: [...array], currentIndex: j, swapped: true },
            highlights: [
              { type: 'node', target: j, style: 'success', duration: 500 },
              { type: 'node', target: j + 1, style: 'success', duration: 500 }
            ],
            transitions: [{
              from: { x: j * 120 - (array.length * 60) + 300, y: 150 },
              to: { x: (j + 1) * 120 - (array.length * 60) + 300, y: 150 },
              duration: 400,
              easing: 'cubic',
              element: `array-${j}`
            }, {
              from: { x: (j + 1) * 120 - (array.length * 60) + 300, y: 150 },
              to: { x: j * 120 - (array.length * 60) + 300, y: 150 },
              duration: 400,
              easing: 'cubic',
              element: `array-${j + 1}`
            }]
          })
        }
      }

      frames.push({
        step: step++,
        title: "Pass Complete",
        description: `Largest element ${array[array.length - i - 1]} is now in correct position`,
        data: { array: [...array], sortedIndex: array.length - i - 1 },
        highlights: [{
          type: 'node',
          target: array.length - i - 1,
          style: 'success',
          duration: 800
        }],
        transitions: []
      })
    }

    frames.push({
      step: step,
      title: "Sorting Complete",
      description: "Array is now fully sorted",
      data: { array: [...array], sorted: true },
      highlights: array.map((_, index) => ({
        type: 'node' as const,
        target: index,
        style: 'success' as const,
        duration: 500
      })),
      transitions: []
    })

    return frames
  }

  static generateDFSFrames(data: AlgorithmData): AnimationFrame[] {
    const frames: AnimationFrame[] = []
    const { graph } = data
    if (!graph) return frames

    const visited = new Set<string>()
    const stack: string[] = []
    const step = 0

    // Start from first node
    const startNode = graph.nodes[0]
    if (startNode) {
      stack.push(startNode.id)

      frames.push({
        step: 0,
        title: "DFS Start",
        description: `Start DFS from node ${startNode.value}`,
        data: { ...data, visited: Array.from(visited), stack: [...stack] },
        highlights: [{
          type: 'node',
          target: startNode.id,
          style: 'active',
          duration: 500
        }],
        transitions: []
      })
    }

    return frames
  }

  static generateDefaultFrame(data: AlgorithmData): AnimationFrame {
    return {
      step: 0,
      title: "Algorithm Visualization",
      description: "Interactive algorithm demonstration",
      data,
      highlights: [],
      transitions: []
    }
  }
}
