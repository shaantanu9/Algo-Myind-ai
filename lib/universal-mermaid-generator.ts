/**
 * 🎨 Universal Mermaid Diagram Generator
 * 
 * Generates Mermaid diagrams for ANY algorithm
 * Automatically selects the best diagram type based on data structure
 */

import { UniversalAnimationStep, DataStructure, UniversalColors } from './universal-animation-parser'

export class UniversalMermaidGenerator {
  /**
   * Generate Mermaid diagram from universal animation step
   */
  static generate(step: UniversalAnimationStep): string {
    const structures = step.visualData.structures

    if (structures.length === 0) {
      return this.generateGenericFlowchart(step)
    }

    // Choose diagram type based on primary data structure
    const primaryStructure = structures[0]

    switch (primaryStructure.type) {
      case 'array':
      case 'string':
        return this.generateArrayFlowchart(step, primaryStructure)
      case 'linkedList':
        return this.generateLinkedListDiagram(step, primaryStructure)
      case 'tree':
        return this.generateTreeDiagram(step, primaryStructure)
      case 'graph':
        return this.generateGraphDiagram(step, primaryStructure)
      case 'hashMap':
        return this.generateHashMapFlowchart(step, primaryStructure)
      case 'stack':
      case 'queue':
        return this.generateStackQueueFlowchart(step, primaryStructure)
      default:
        return this.generateGenericFlowchart(step)
    }
  }

  private static generateArrayFlowchart(step: UniversalAnimationStep, structure: DataStructure): string {
    let diagram = `flowchart TD\n`
    diagram += `    Start([Step ${step.step}: ${step.title}])\n\n`

    // Create nodes for array elements
    structure.elements.forEach((element, index) => {
      const nodeId = `E${index}`
      const color = this.getColorForState(element.state)
      const style = this.getStyleForColor(color)

      diagram += `    ${nodeId}["[${element.index}] = ${element.value}"]\n`
      diagram += `    style ${nodeId} ${style}\n`
    })

    diagram += `\n`

    // Add connections
    diagram += `    Start --> E0\n`
    for (let i = 0; i < structure.elements.length - 1; i++) {
      diagram += `    E${i} -.-> E${i + 1}\n`
    }

    // Add variables info
    if (Object.keys(step.visualData.variables).length > 0) {
      diagram += `\n    Variables["Variables:\n`
      Object.values(step.visualData.variables).forEach((v: any) => {
        diagram += `${v.name}=${v.value} `
      })
      diagram += `"]\n`
      diagram += `    Start --> Variables\n`
    }

    // Add operation
    if (step.visualData.operation) {
      diagram += `\n    Op["${step.visualData.operation.type}: ${step.visualData.operation.complexity}"]\n`
      diagram += `    style Op fill:#f0f9ff,stroke:#3b82f6,stroke-width:2px\n`
    }

    return diagram
  }

  private static generateLinkedListDiagram(step: UniversalAnimationStep, structure: DataStructure): string {
    let diagram = `flowchart LR\n`
    diagram += `    Start(["Step ${step.step}"])\n\n`

    // Create nodes for list elements
    structure.elements.forEach((element, index) => {
      const nodeId = `N${index}`
      const color = this.getColorForState(element.state)
      const style = this.getStyleForColor(color)

      diagram += `    ${nodeId}["${element.value}"]\n`
      diagram += `    style ${nodeId} ${style}\n`
    })

    diagram += `\n    Start --> N0\n`

    // Link nodes
    for (let i = 0; i < structure.elements.length - 1; i++) {
      diagram += `    N${i} --> N${i + 1}\n`
    }

    // Add null at end
    diagram += `    N${structure.elements.length - 1} --> Null([null])\n`
    diagram += `    style Null fill:#f3f4f6,stroke:#9ca3af\n`

    return diagram
  }

  private static generateTreeDiagram(step: UniversalAnimationStep, structure: DataStructure): string {
    let diagram = `flowchart TD\n`
    diagram += `    Title(["${step.title}"])\n\n`

    // Group elements by depth
    const byDepth: Map<number, typeof structure.elements> = new Map()
    structure.elements.forEach(element => {
      const depth = element.metadata?.depth || 0
      if (!byDepth.has(depth)) {
        byDepth.set(depth, [])
      }
      byDepth.get(depth)!.push(element)
    })

    // Create nodes
    structure.elements.forEach(element => {
      const nodeId = this.sanitizeId(element.id)
      const color = this.getColorForState(element.state)
      const style = this.getStyleForColor(color)

      diagram += `    ${nodeId}["${element.value}"]\n`
      diagram += `    style ${nodeId} ${style}\n`
    })

    diagram += `\n`

    // Create connections based on tree structure
    structure.elements.forEach(element => {
      const path = element.metadata?.path || '0'
      const leftPath = path + 'L'
      const rightPath = path + 'R'

      const leftChild = structure.elements.find(e => e.metadata?.path === leftPath)
      const rightChild = structure.elements.find(e => e.metadata?.path === rightPath)

      const nodeId = this.sanitizeId(element.id)

      if (leftChild) {
        diagram += `    ${nodeId} -->|L| ${this.sanitizeId(leftChild.id)}\n`
      }
      if (rightChild) {
        diagram += `    ${nodeId} -->|R| ${this.sanitizeId(rightChild.id)}\n`
      }
    })

    return diagram
  }

  private static generateGraphDiagram(step: UniversalAnimationStep, structure: DataStructure): string {
    let diagram = `graph TD\n`
    diagram += `    Title(["${step.title}"])\n\n`

    // Create nodes
    structure.elements.forEach(element => {
      const nodeId = this.sanitizeId(element.id)
      const color = this.getColorForState(element.state)
      const style = this.getStyleForColor(color)

      diagram += `    ${nodeId}["${element.value}"]\n`
      diagram += `    style ${nodeId} ${style}\n`
    })

    diagram += `\n`

    // Add connections
    if (step.visualData.connections) {
      step.visualData.connections.forEach(conn => {
        const fromId = this.sanitizeId(conn.from)
        const toId = this.sanitizeId(conn.to)
        const label = conn.label ? `|${conn.label}|` : ''

        if (conn.type === 'directed') {
          diagram += `    ${fromId} -->${label} ${toId}\n`
        } else if (conn.type === 'bidirectional') {
          diagram += `    ${fromId} <-->${label} ${toId}\n`
        } else {
          diagram += `    ${fromId} ---${label} ${toId}\n`
        }
      })
    }

    return diagram
  }

  private static generateHashMapFlowchart(step: UniversalAnimationStep, structure: DataStructure): string {
    let diagram = `flowchart TD\n`
    diagram += `    Start([Step ${step.step}: ${step.title}])\n\n`
    diagram += `    HashMap["Hash Map"]\n`
    diagram += `    style HashMap fill:#8b5cf6,stroke:#7c3aed,color:#fff,stroke-width:3px\n\n`

    diagram += `    Start --> HashMap\n\n`

    // Create nodes for each key-value pair
    structure.elements.forEach((element, index) => {
      const nodeId = `KV${index}`
      const key = element.label || element.metadata?.key
      const value = element.value

      diagram += `    ${nodeId}["${key}: ${value}"]\n`
      diagram += `    style ${nodeId} fill:#8b5cf6,stroke:#7c3aed,color:#fff\n`
      diagram += `    HashMap --> ${nodeId}\n`
    })

    return diagram
  }

  private static generateStackQueueFlowchart(step: UniversalAnimationStep, structure: DataStructure): string {
    const isStack = structure.type === 'stack'
    const direction = isStack ? 'BT' : 'LR' // Stack: Bottom to Top, Queue: Left to Right

    let diagram = `flowchart ${direction}\n`
    diagram += `    Title(["${step.title}"])\n\n`

    structure.elements.forEach((element, index) => {
      const nodeId = `E${index}`
      const color = this.getColorForState(element.state)
      const style = this.getStyleForColor(color)

      diagram += `    ${nodeId}["${element.value}"]\n`
      diagram += `    style ${nodeId} ${style}\n`
    })

    diagram += `\n`

    if (isStack) {
      // Stack: connect from bottom to top
      for (let i = structure.elements.length - 1; i > 0; i--) {
        diagram += `    E${i} --> E${i - 1}\n`
      }
      if (structure.elements.length > 0) {
        diagram += `    Top[Top]\n`
        diagram += `    style Top fill:#22c55e,stroke:#16a34a,color:#fff\n`
        diagram += `    E0 --> Top\n`
      }
    } else {
      // Queue: connect from left to right
      diagram += `    Front[Front]\n`
      diagram += `    style Front fill:#22c55e,stroke:#16a34a,color:#fff\n`
      diagram += `    Front --> E0\n`

      for (let i = 0; i < structure.elements.length - 1; i++) {
        diagram += `    E${i} --> E${i + 1}\n`
      }

      if (structure.elements.length > 0) {
        diagram += `    E${structure.elements.length - 1} --> Rear[Rear]\n`
        diagram += `    style Rear fill:#ef4444,stroke:#dc2626,color:#fff\n`
      }
    }

    return diagram
  }

  private static generateGenericFlowchart(step: UniversalAnimationStep): string {
    let diagram = `flowchart TD\n`
    diagram += `    Start([Step ${step.step}: ${step.title}])\n\n`

    diagram += `    Desc["${step.description.substring(0, 50)}..."]\n`
    diagram += `    style Desc fill:#f0f9ff,stroke:#3b82f6\n\n`

    diagram += `    Start --> Desc\n\n`

    // Add variables
    if (Object.keys(step.visualData.variables).length > 0) {
      diagram += `    Vars["Variables:\n`
      Object.values(step.visualData.variables).forEach((v: any) => {
        diagram += `${v.name}=${v.value}\\n`
      })
      diagram += `"]\n`
      diagram += `    style Vars fill:#fef3c7,stroke:#f59e0b\n`
      diagram += `    Desc --> Vars\n\n`
    }

    // Add operation
    if (step.visualData.operation) {
      diagram += `    Op["${step.visualData.operation.type}\\n${step.visualData.operation.complexity}"]\n`
      diagram += `    style Op fill:#dcfce7,stroke:#22c55e\n`
      diagram += `    Desc --> Op\n`
    }

    return diagram
  }

  private static getColorForState(state: string): string {
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

    return colors[state] || colors.default
  }

  private static getStyleForColor(color: string): string {
    return `fill:${color},stroke:${this.darkenColor(color)},color:#fff,stroke-width:2px`
  }

  private static darkenColor(hex: string): string {
    // Simple hex color darkening
    const num = parseInt(hex.slice(1), 16)
    const r = Math.max(0, ((num >> 16) & 0xff) - 40)
    const g = Math.max(0, ((num >> 8) & 0xff) - 40)
    const b = Math.max(0, (num & 0xff) - 40)
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`
  }

  private static sanitizeId(id: string): string {
    return id.replace(/[^a-zA-Z0-9]/g, '_')
  }
}

// Export convenience function
export function generateMermaidDiagram(step: UniversalAnimationStep): string {
  return UniversalMermaidGenerator.generate(step)
}

