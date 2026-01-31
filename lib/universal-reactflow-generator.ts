/**
 * 🎨 Universal React Flow Generator
 * 
 * Generates React Flow nodes and edges for ANY algorithm
 * Automatically creates layouts based on data structure type
 */

import { UniversalAnimationStep, DataStructure, Element, UniversalColors } from './universal-animation-parser'

export interface ReactFlowNode {
  id: string
  type: string
  data: {
    label: string
    value?: any
    emoji?: string
    state?: string
  }
  position: { x: number; y: number }
  style?: Record<string, any>
}

export interface ReactFlowEdge {
  id: string
  source: string
  target: string
  type?: string
  label?: string
  animated?: boolean
  style?: Record<string, any>
}

export interface ReactFlowData {
  nodes: ReactFlowNode[]
  edges: ReactFlowEdge[]
}

export class UniversalReactFlowGenerator {
  /**
   * Generate React Flow data from universal animation step
   */
  static generate(step: UniversalAnimationStep): ReactFlowData {
    const structures = step.visualData.structures

    if (structures.length === 0) {
      return this.generateGenericFlow(step)
    }

    // Choose layout based on primary data structure
    const primaryStructure = structures[0]

    switch (primaryStructure.type) {
      case 'array':
      case 'string':
        return this.generateArrayFlow(step, primaryStructure)
      case 'linkedList':
        return this.generateLinkedListFlow(step, primaryStructure)
      case 'tree':
        return this.generateTreeFlow(step, primaryStructure)
      case 'graph':
        return this.generateGraphFlow(step, primaryStructure)
      case 'hashMap':
        return this.generateHashMapFlow(step, primaryStructure)
      case 'stack':
        return this.generateStackFlow(step, primaryStructure)
      case 'queue':
        return this.generateQueueFlow(step, primaryStructure)
      case 'matrix':
        return this.generateMatrixFlow(step, primaryStructure)
      default:
        return this.generateGenericFlow(step)
    }
  }

  private static generateArrayFlow(step: UniversalAnimationStep, structure: DataStructure): ReactFlowData {
    const nodes: ReactFlowNode[] = []
    const edges: ReactFlowEdge[] = []

    // Title node
    nodes.push({
      id: 'title',
      type: 'input',
      data: { label: step.title, emoji: '📊' },
      position: { x: 250, y: 0 },
      style: this.getStyleForState('active')
    })

    // Array elements
    const startX = 50
    const startY = 100
    const spacing = 100

    structure.elements.forEach((element, index) => {
      const nodeId = `element-${index}`

      nodes.push({
        id: nodeId,
        type: 'default',
        data: {
          label: `[${element.index}] = ${element.value}`,
          value: element.value,
          state: element.state
        },
        position: { x: startX + index * spacing, y: startY },
        style: this.getStyleForState(element.state)
      })

      // Connect from title to first element
      if (index === 0) {
        edges.push({
          id: 'title-to-array',
          source: 'title',
          target: nodeId,
          type: 'smoothstep',
          animated: true
        })
      }

      // Connect array elements
      if (index > 0) {
        edges.push({
          id: `edge-${index - 1}-${index}`,
          source: `element-${index - 1}`,
          target: nodeId,
          type: 'smoothstep',
          style: { stroke: '#cbd5e1', strokeWidth: 2 }
        })
      }
    })

    // Add variables node if present
    if (Object.keys(step.visualData.variables).length > 0) {
      this.addVariablesNode(nodes, edges, step.visualData.variables, 'title')
    }

    return { nodes, edges }
  }

  private static generateLinkedListFlow(step: UniversalAnimationStep, structure: DataStructure): ReactFlowData {
    const nodes: ReactFlowNode[] = []
    const edges: ReactFlowEdge[] = []

    // Title
    nodes.push({
      id: 'title',
      type: 'input',
      data: { label: step.title, emoji: '🔗' },
      position: { x: 300, y: 0 },
      style: this.getStyleForState('active')
    })

    // Linked list nodes
    const startX = 50
    const startY = 100
    const spacing = 150

    structure.elements.forEach((element, index) => {
      const nodeId = `node-${index}`

      nodes.push({
        id: nodeId,
        type: 'default',
        data: {
          label: element.value.toString(),
          value: element.value,
          state: element.state,
          emoji: '⚪'
        },
        position: { x: startX + index * spacing, y: startY },
        style: this.getStyleForState(element.state)
      })

      // Connect to next node
      if (index < structure.elements.length - 1) {
        edges.push({
          id: `edge-${index}`,
          source: nodeId,
          target: `node-${index + 1}`,
          type: 'smoothstep',
          animated: element.state === 'active' || element.state === 'current',
          label: 'next',
          style: { stroke: element.color || '#6b7280', strokeWidth: 2 }
        })
      }

      // Connect from title
      if (index === 0) {
        edges.push({
          id: 'title-to-head',
          source: 'title',
          target: nodeId,
          type: 'smoothstep',
          animated: true,
          label: 'head'
        })
      }
    })

    // Null node at end
    nodes.push({
      id: 'null',
      type: 'output',
      data: { label: 'null', emoji: '⊘' },
      position: { x: startX + structure.elements.length * spacing, y: startY },
      style: { ...this.getStyleForState('default'), opacity: 0.5 }
    })

    if (structure.elements.length > 0) {
      edges.push({
        id: 'last-to-null',
        source: `node-${structure.elements.length - 1}`,
        target: 'null',
        type: 'smoothstep',
        style: { stroke: '#9ca3af', strokeWidth: 1, strokeDasharray: '5,5' }
      })
    }

    return { nodes, edges }
  }

  private static generateTreeFlow(step: UniversalAnimationStep, structure: DataStructure): ReactFlowData {
    const nodes: ReactFlowNode[] = []
    const edges: ReactFlowEdge[] = []

    // Title
    nodes.push({
      id: 'title',
      type: 'input',
      data: { label: step.title, emoji: '🌳' },
      position: { x: 400, y: 0 },
      style: this.getStyleForState('active')
    })

    // Calculate tree positions
    const levelWidth = 150
    const levelHeight = 120

    // Group by depth
    const byDepth: Map<number, Element[]> = new Map()
    structure.elements.forEach(element => {
      const depth = element.metadata?.depth || 0
      if (!byDepth.has(depth)) {
        byDepth.set(depth, [])
      }
      byDepth.get(depth)!.push(element)
    })

    // Calculate positions for each node
    byDepth.forEach((elements, depth) => {
      const y = 100 + depth * levelHeight
      const totalWidth = elements.length * levelWidth
      const startX = (800 - totalWidth) / 2 // Center horizontally

      elements.forEach((element, index) => {
        const nodeId = this.sanitizeId(element.id)
        const x = startX + index * levelWidth

        nodes.push({
          id: nodeId,
          type: depth === 0 ? 'input' : 'default',
          data: {
            label: element.value.toString(),
            value: element.value,
            state: element.state,
            emoji: '🔵'
          },
          position: { x, y },
          style: this.getStyleForState(element.state)
        })

        // Connect parent to children
        const path = element.metadata?.path || '0'
        const parentPath = path.slice(0, -1)
        const parentElement = structure.elements.find(e => e.metadata?.path === parentPath)

        if (parentElement) {
          const parentId = this.sanitizeId(parentElement.id)
          const edgeLabel = path.endsWith('L') ? 'L' : path.endsWith('R') ? 'R' : ''

          edges.push({
            id: `edge-${parentId}-${nodeId}`,
            source: parentId,
            target: nodeId,
            type: 'smoothstep',
            label: edgeLabel,
            animated: element.state === 'active' || element.state === 'current'
          })
        }
      })
    })

    return { nodes, edges }
  }

  private static generateGraphFlow(step: UniversalAnimationStep, structure: DataStructure): ReactFlowData {
    const nodes: ReactFlowNode[] = []
    const edges: ReactFlowEdge[] = []

    // Title
    nodes.push({
      id: 'title',
      type: 'input',
      data: { label: step.title, emoji: '🕸️' },
      position: { x: 400, y: 0 },
      style: this.getStyleForState('active')
    })

    // Use force-directed layout approximation
    const centerX = 400
    const centerY = 300
    const radius = 200

    structure.elements.forEach((element, index) => {
      const angle = (2 * Math.PI * index) / structure.elements.length
      const x = centerX + radius * Math.cos(angle)
      const y = centerY + radius * Math.sin(angle)

      nodes.push({
        id: this.sanitizeId(element.id),
        type: 'default',
        data: {
          label: element.value.toString(),
          value: element.value,
          state: element.state,
          emoji: '⚪'
        },
        position: { x, y },
        style: this.getStyleForState(element.state)
      })
    })

    // Add connections
    if (step.visualData.connections) {
      step.visualData.connections.forEach((conn, index) => {
        edges.push({
          id: `edge-${index}`,
          source: this.sanitizeId(conn.from),
          target: this.sanitizeId(conn.to),
          type: conn.type === 'undirected' ? 'straight' : 'smoothstep',
          label: conn.label,
          animated: conn.state === 'active',
          style: {
            stroke: conn.color || UniversalColors.connections.default,
            strokeWidth: 2
          }
        })
      })
    }

    return { nodes, edges }
  }

  private static generateHashMapFlow(step: UniversalAnimationStep, structure: DataStructure): ReactFlowData {
    const nodes: ReactFlowNode[] = []
    const edges: ReactFlowEdge[] = []

    // Title
    nodes.push({
      id: 'title',
      type: 'input',
      data: { label: step.title, emoji: '🗂️' },
      position: { x: 250, y: 0 },
      style: this.getStyleForState('active')
    })

    // HashMap central node
    nodes.push({
      id: 'hashmap',
      type: 'default',
      data: { label: 'Hash Map', emoji: '🗃️' },
      position: { x: 250, y: 100 },
      style: { ...this.getStyleForState('stored'), padding: 20 }
    })

    edges.push({
      id: 'title-to-hashmap',
      source: 'title',
      target: 'hashmap',
      type: 'smoothstep',
      animated: true
    })

    // Key-value pairs
    const startX = 50
    const startY = 220
    const spacing = 120

    structure.elements.forEach((element, index) => {
      const nodeId = `kv-${index}`
      const key = element.label || element.metadata?.key
      const value = element.value

      nodes.push({
        id: nodeId,
        type: 'default',
        data: {
          label: `${key}: ${value}`,
          state: element.state
        },
        position: { x: startX + index * spacing, y: startY },
        style: this.getStyleForState(element.state)
      })

      edges.push({
        id: `hashmap-to-${nodeId}`,
        source: 'hashmap',
        target: nodeId,
        type: 'smoothstep',
        style: { stroke: element.color || UniversalColors.states.stored }
      })
    })

    return { nodes, edges }
  }

  private static generateStackFlow(step: UniversalAnimationStep, structure: DataStructure): ReactFlowData {
    const nodes: ReactFlowNode[] = []
    const edges: ReactFlowEdge[] = []

    // Title
    nodes.push({
      id: 'title',
      type: 'input',
      data: { label: step.title, emoji: '📚' },
      position: { x: 300, y: 0 },
      style: this.getStyleForState('active')
    })

    // Stack elements (bottom to top)
    const x = 300
    const startY = 400
    const spacing = 80

    structure.elements.forEach((element, index) => {
      const nodeId = `stack-${index}`
      const y = startY - index * spacing

      nodes.push({
        id: nodeId,
        type: 'default',
        data: {
          label: element.value.toString(),
          value: element.value,
          state: element.state
        },
        position: { x, y },
        style: this.getStyleForState(element.state)
      })

      // Connect stack elements
      if (index > 0) {
        edges.push({
          id: `edge-${index - 1}-${index}`,
          source: `stack-${index - 1}`,
          target: nodeId,
          type: 'step',
          style: { stroke: '#6b7280' }
        })
      }
    })

    // Top indicator
    if (structure.elements.length > 0) {
      nodes.push({
        id: 'top',
        type: 'output',
        data: { label: 'TOP', emoji: '👆' },
        position: { x: 300, y: startY - structure.elements.length * spacing - 60 },
        style: { ...this.getStyleForState('result'), fontWeight: 'bold' }
      })

      edges.push({
        id: 'top-indicator',
        source: `stack-${structure.elements.length - 1}`,
        target: 'top',
        type: 'step',
        animated: true,
        style: { stroke: UniversalColors.states.result, strokeWidth: 3 }
      })
    }

    return { nodes, edges }
  }

  private static generateQueueFlow(step: UniversalAnimationStep, structure: DataStructure): ReactFlowData {
    const nodes: ReactFlowNode[] = []
    const edges: ReactFlowEdge[] = []

    // Title
    nodes.push({
      id: 'title',
      type: 'input',
      data: { label: step.title, emoji: '🎟️' },
      position: { x: 300, y: 0 },
      style: this.getStyleForState('active')
    })

    // Front indicator
    nodes.push({
      id: 'front',
      type: 'input',
      data: { label: 'FRONT', emoji: '👉' },
      position: { x: 50, y: 100 },
      style: { ...this.getStyleForState('result'), fontWeight: 'bold' }
    })

    // Queue elements
    const startX = 150
    const y = 100
    const spacing = 120

    structure.elements.forEach((element, index) => {
      const nodeId = `queue-${index}`

      nodes.push({
        id: nodeId,
        type: 'default',
        data: {
          label: element.value.toString(),
          value: element.value,
          state: element.state
        },
        position: { x: startX + index * spacing, y },
        style: this.getStyleForState(element.state)
      })

      // Connect front to first element
      if (index === 0) {
        edges.push({
          id: 'front-to-first',
          source: 'front',
          target: nodeId,
          type: 'smoothstep',
          animated: true,
          style: { stroke: UniversalColors.states.result, strokeWidth: 3 }
        })
      }

      // Connect queue elements
      if (index > 0) {
        edges.push({
          id: `edge-${index - 1}-${index}`,
          source: `queue-${index - 1}`,
          target: nodeId,
          type: 'smoothstep',
          style: { stroke: '#6b7280' }
        })
      }
    })

    // Rear indicator
    if (structure.elements.length > 0) {
      nodes.push({
        id: 'rear',
        type: 'output',
        data: { label: 'REAR', emoji: '👈' },
        position: { x: startX + structure.elements.length * spacing + 50, y: 100 },
        style: { ...this.getStyleForState('error'), fontWeight: 'bold' }
      })

      edges.push({
        id: 'last-to-rear',
        source: `queue-${structure.elements.length - 1}`,
        target: 'rear',
        type: 'smoothstep',
        animated: true,
        style: { stroke: UniversalColors.states.error, strokeWidth: 3 }
      })
    }

    return { nodes, edges }
  }

  private static generateMatrixFlow(step: UniversalAnimationStep, structure: DataStructure): ReactFlowData {
    const nodes: ReactFlowNode[] = []
    const edges: ReactFlowEdge[] = []

    // Title
    nodes.push({
      id: 'title',
      type: 'input',
      data: { label: step.title, emoji: '📐' },
      position: { x: 300, y: 0 },
      style: this.getStyleForState('active')
    })

    // Calculate matrix dimensions
    const maxRow = Math.max(...structure.elements.map(e => e.metadata?.row || 0))
    const maxCol = Math.max(...structure.elements.map(e => e.metadata?.col || 0))

    const startX = 100
    const startY = 100
    const spacingX = 80
    const spacingY = 80

    structure.elements.forEach(element => {
      const row = element.metadata?.row || 0
      const col = element.metadata?.col || 0
      const nodeId = `cell-${row}-${col}`

      nodes.push({
        id: nodeId,
        type: 'default',
        data: {
          label: element.value.toString(),
          value: element.value,
          state: element.state
        },
        position: {
          x: startX + col * spacingX,
          y: startY + row * spacingY
        },
        style: this.getStyleForState(element.state)
      })
    })

    return { nodes, edges }
  }

  private static generateGenericFlow(step: UniversalAnimationStep): ReactFlowData {
    const nodes: ReactFlowNode[] = []
    const edges: ReactFlowEdge[] = []

    // Title
    nodes.push({
      id: 'title',
      type: 'input',
      data: { label: step.title, emoji: '🎯' },
      position: { x: 300, y: 0 },
      style: this.getStyleForState('active')
    })

    // Description
    nodes.push({
      id: 'description',
      type: 'default',
      data: { label: step.description.substring(0, 50) + '...' },
      position: { x: 250, y: 100 }
    })

    edges.push({
      id: 'title-to-desc',
      source: 'title',
      target: 'description',
      type: 'smoothstep',
      animated: true
    })

    // Add variables if present
    if (Object.keys(step.visualData.variables).length > 0) {
      this.addVariablesNode(nodes, edges, step.visualData.variables, 'description')
    }

    return { nodes, edges }
  }

  private static addVariablesNode(
    nodes: ReactFlowNode[],
    edges: ReactFlowEdge[],
    variables: Record<string, any>,
    sourceId: string
  ): void {
    const varText = Object.values(variables)
      .map((v: any) => `${v.name}=${v.value}`)
      .join(', ')

    nodes.push({
      id: 'variables',
      type: 'default',
      data: { label: `Variables: ${varText}`, emoji: '📊' },
      position: { x: 600, y: 100 },
      style: { ...this.getStyleForState('default'), fontSize: 12 }
    })

    edges.push({
      id: 'to-variables',
      source: sourceId,
      target: 'variables',
      type: 'smoothstep',
      style: { strokeDasharray: '5,5', opacity: 0.5 }
    })
  }

  private static getStyleForState(state: string): Record<string, any> {
    const colors: Record<string, string> = {
      default: '#6b7280',
      active: '#3b82f6',
      checking: '#f59e0b',
      result: '#22c55e',
      error: '#ef4444',
      stored: '#8b5cf6',
      visited: '#06b6d4',
      current: '#ec4899'
    }

    const color = colors[state] || colors.default

    return {
      background: color,
      color: '#ffffff',
      border: `2px solid ${this.darkenColor(color)}`,
      borderRadius: 8,
      padding: 10,
      fontSize: 14,
      fontWeight: '600'
    }
  }

  private static darkenColor(hex: string): string {
    const num = parseInt(hex.slice(1), 16)
    const r = Math.max(0, ((num >> 16) & 0xff) - 40)
    const g = Math.max(0, ((num >> 8) & 0xff) - 40)
    const b = Math.max(0, (num & 0xff) - 40)
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`
  }

  private static sanitizeId(id: string): string {
    return id.replace(/[^a-zA-Z0-9-_]/g, '_')
  }
}

// Export convenience function
export function generateReactFlowData(step: UniversalAnimationStep): ReactFlowData {
  return UniversalReactFlowGenerator.generate(step)
}

