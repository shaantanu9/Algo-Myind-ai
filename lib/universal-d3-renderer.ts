/**
 * 🎨 Universal D3 Renderer
 * 
 * Renders ANY algorithm animation using D3.js
 * Automatically adapts to the data structure type
 */

import * as d3 from 'd3'
import { UniversalAnimationStep, DataStructure, Element, UniversalColors } from './universal-animation-parser'
import { Spring, SpringPresets, AnimationManager } from './spring-physics'

export class UniversalD3Renderer {
  private svg: any
  private width: number
  private height: number
  private mainGroup: any
  private springs: Map<string, Spring> = new Map()
  private animationManager: AnimationManager

  constructor(svgElement: SVGSVGElement, width = 800, height = 600) {
    this.svg = d3.select(svgElement)
    this.width = width
    this.height = height
    this.animationManager = new AnimationManager()
  }

  /**
   * Render a universal animation step
   */
  async render(step: UniversalAnimationStep): Promise<void> {
    // Clear previous content
    this.svg.selectAll('*').remove()

    // Setup main group
    this.mainGroup = this.svg
      .append('g')
      .attr('class', 'universal-visualization')

    // Render title and description
    this.renderHeader(step)

    // Render data structures
    let yOffset = 100
    for (const structure of step.visualData.structures) {
      yOffset = await this.renderStructure(structure, yOffset)
      yOffset += 60 // Spacing between structures
    }

    // Render variables panel
    if (Object.keys(step.visualData.variables).length > 0) {
      this.renderVariables(step.visualData.variables)
    }

    // Render pointers
    if (step.visualData.pointers) {
      this.renderPointers(step.visualData.pointers, step.visualData.structures)
    }

    // Render connections
    if (step.visualData.connections) {
      this.renderConnections(step.visualData.connections)
    }

    // Render operation metadata
    if (step.visualData.operation) {
      this.renderOperation(step.visualData.operation)
    }

    // Add interactivity
    this.addInteractivity()
  }

  private renderHeader(step: UniversalAnimationStep): void {
    // Step number badge
    this.mainGroup
      .append('rect')
      .attr('x', 20)
      .attr('y', 20)
      .attr('width', 60)
      .attr('height', 30)
      .attr('fill', UniversalColors.states.active)
      .attr('rx', 6)

    this.mainGroup
      .append('text')
      .attr('x', 50)
      .attr('y', 40)
      .attr('text-anchor', 'middle')
      .attr('fill', '#ffffff')
      .attr('font-size', '14px')
      .attr('font-weight', '600')
      .text(`Step ${step.step}`)

    // Title
    this.mainGroup
      .append('text')
      .attr('x', 100)
      .attr('y', 40)
      .attr('fill', '#1f2937')
      .attr('font-size', '18px')
      .attr('font-weight', '700')
      .text(step.title)

    // Description
    this.mainGroup
      .append('text')
      .attr('x', 20)
      .attr('y', 70)
      .attr('fill', '#6b7280')
      .attr('font-size', '14px')
      .text(step.description.substring(0, 100) + (step.description.length > 100 ? '...' : ''))
  }

  private async renderStructure(structure: DataStructure, yOffset: number): Promise<number> {
    switch (structure.type) {
      case 'array':
        return this.renderArray(structure, yOffset)
      case 'string':
        return this.renderString(structure, yOffset)
      case 'linkedList':
        return this.renderLinkedList(structure, yOffset)
      case 'tree':
        return this.renderTree(structure, yOffset)
      case 'graph':
        return this.renderGraph(structure, yOffset)
      case 'hashMap':
        return this.renderHashMap(structure, yOffset)
      case 'stack':
        return this.renderStack(structure, yOffset)
      case 'queue':
        return this.renderQueue(structure, yOffset)
      case 'matrix':
        return this.renderMatrix(structure, yOffset)
      default:
        return this.renderGeneric(structure, yOffset)
    }
  }

  private renderArray(structure: DataStructure, yOffset: number): number {
    const group = this.mainGroup.append('g').attr('class', `structure-${structure.id}`)

    // Label
    group
      .append('text')
      .attr('x', 50)
      .attr('y', yOffset - 10)
      .attr('fill', '#374151')
      .attr('font-size', '14px')
      .attr('font-weight', '600')
      .text(structure.metadata?.name || 'Array')

    const cellWidth = 60
    const cellHeight = 50
    const startX = 50

    structure.elements.forEach((element, index) => {
      const x = startX + index * (cellWidth + 5)
      const y = yOffset

      // Cell background
      const cell = group
        .append('rect')
        .attr('x', x)
        .attr('y', y)
        .attr('width', cellWidth)
        .attr('height', cellHeight)
        .attr('fill', element.color || UniversalColors.states.default)
        .attr('stroke', this.darkenColor(element.color || UniversalColors.states.default))
        .attr('stroke-width', 2)
        .attr('rx', 8)
        .style('filter', 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))')
        .attr('data-id', element.id)
        .attr('opacity', 0)

      // Fade in animation
      cell.transition().duration(300).delay(index * 50).attr('opacity', 1)

      // Index label
      group
        .append('text')
        .attr('x', x + cellWidth / 2)
        .attr('y', y - 5)
        .attr('text-anchor', 'middle')
        .attr('fill', '#9ca3af')
        .attr('font-size', '11px')
        .text(element.index !== undefined ? `[${element.index}]` : '')

      // Value
      group
        .append('text')
        .attr('x', x + cellWidth / 2)
        .attr('y', y + cellHeight / 2 + 5)
        .attr('text-anchor', 'middle')
        .attr('fill', '#ffffff')
        .attr('font-size', '16px')
        .attr('font-weight', '600')
        .text(this.formatValue(element.value))
        .attr('data-id', element.id)
    })

    return yOffset + cellHeight + 40
  }

  private renderString(structure: DataStructure, yOffset: number): number {
    // Similar to array but styled for strings
    return this.renderArray(structure, yOffset)
  }

  private renderLinkedList(structure: DataStructure, yOffset: number): number {
    const group = this.mainGroup.append('g').attr('class', `structure-${structure.id}`)

    // Label
    group
      .append('text')
      .attr('x', 50)
      .attr('y', yOffset - 10)
      .attr('fill', '#374151')
      .attr('font-size', '14px')
      .attr('font-weight', '600')
      .text(structure.metadata?.name || 'Linked List')

    const nodeWidth = 60
    const nodeHeight = 50
    const spacing = 40
    const startX = 50

    structure.elements.forEach((element, index) => {
      const x = startX + index * (nodeWidth + spacing)
      const y = yOffset

      // Node
      group
        .append('rect')
        .attr('x', x)
        .attr('y', y)
        .attr('width', nodeWidth)
        .attr('height', nodeHeight)
        .attr('fill', element.color || UniversalColors.states.default)
        .attr('stroke', this.darkenColor(element.color || UniversalColors.states.default))
        .attr('stroke-width', 2)
        .attr('rx', 8)
        .attr('data-id', element.id)

      // Value
      group
        .append('text')
        .attr('x', x + nodeWidth / 2)
        .attr('y', y + nodeHeight / 2 + 5)
        .attr('text-anchor', 'middle')
        .attr('fill', '#ffffff')
        .attr('font-size', '16px')
        .attr('font-weight', '600')
        .text(this.formatValue(element.value))

      // Arrow to next node
      if (element.metadata?.next && index < structure.elements.length - 1) {
        group
          .append('path')
          .attr('d', `M ${x + nodeWidth} ${y + nodeHeight / 2} L ${x + nodeWidth + spacing} ${y + nodeHeight / 2}`)
          .attr('stroke', element.color || UniversalColors.states.default)
          .attr('stroke-width', 3)
          .attr('marker-end', 'url(#arrowhead)')
      }
    })

    // Define arrowhead marker
    this.svg
      .append('defs')
      .append('marker')
      .attr('id', 'arrowhead')
      .attr('markerWidth', 10)
      .attr('markerHeight', 10)
      .attr('refX', 9)
      .attr('refY', 3)
      .attr('orient', 'auto')
      .append('polygon')
      .attr('points', '0 0, 10 3, 0 6')
      .attr('fill', UniversalColors.states.default)

    return yOffset + nodeHeight + 40
  }

  private renderTree(structure: DataStructure, yOffset: number): number {
    const group = this.mainGroup.append('g').attr('class', `structure-${structure.id}`)

    // Label
    group
      .append('text')
      .attr('x', this.width / 2)
      .attr('y', yOffset - 10)
      .attr('text-anchor', 'middle')
      .attr('fill', '#374151')
      .attr('font-size', '14px')
      .attr('font-weight', '600')
      .text(structure.metadata?.name || 'Tree')

    // Calculate positions using tree layout
    const treeLayout = d3.tree<Element>()
      .size([this.width - 100, 300])
      .separation((a, b) => (a.parent === b.parent ? 1 : 1.5))

    // Convert flat elements to hierarchy
    const root = this.buildTreeHierarchy(structure.elements)
    if (!root) return yOffset + 100

    const treeData = treeLayout(root)

    // Render edges
    treeData.links().forEach(link => {
      group
        .append('line')
        .attr('x1', link.source.x + 50)
        .attr('y1', link.source.y + yOffset)
        .attr('x2', link.target.x + 50)
        .attr('y2', link.target.y + yOffset)
        .attr('stroke', '#cbd5e1')
        .attr('stroke-width', 2)
    })

    // Render nodes
    treeData.descendants().forEach(node => {
      const nodeRadius = 25

      // Node circle
      group
        .append('circle')
        .attr('cx', node.x + 50)
        .attr('cy', node.y + yOffset)
        .attr('r', nodeRadius)
        .attr('fill', node.data.color || UniversalColors.states.default)
        .attr('stroke', this.darkenColor(node.data.color || UniversalColors.states.default))
        .attr('stroke-width', 2)
        .attr('data-id', node.data.id)

      // Value
      group
        .append('text')
        .attr('x', node.x + 50)
        .attr('y', node.y + yOffset + 5)
        .attr('text-anchor', 'middle')
        .attr('fill', '#ffffff')
        .attr('font-size', '14px')
        .attr('font-weight', '600')
        .text(this.formatValue(node.data.value))
    })

    return yOffset + 350
  }

  private renderGraph(structure: DataStructure, yOffset: number): number {
    const group = this.mainGroup.append('g').attr('class', `structure-${structure.id}`)

    // Label
    group
      .append('text')
      .attr('x', this.width / 2)
      .attr('y', yOffset - 10)
      .attr('text-anchor', 'middle')
      .attr('fill', '#374151')
      .attr('font-size', '14px')
      .attr('font-weight', '600')
      .text(structure.metadata?.name || 'Graph')

    // Use force simulation for layout
    const simulation = d3.forceSimulation(structure.elements as any)
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(this.width / 2, yOffset + 150))
      .force('collision', d3.forceCollide().radius(40))

    simulation.tick(100) // Pre-compute positions

    // Render nodes
    structure.elements.forEach(element => {
      const x = (element as any).x || this.width / 2
      const y = (element as any).y || yOffset + 150

      group
        .append('circle')
        .attr('cx', x)
        .attr('cy', y)
        .attr('r', 30)
        .attr('fill', element.color || UniversalColors.states.default)
        .attr('stroke', this.darkenColor(element.color || UniversalColors.states.default))
        .attr('stroke-width', 2)
        .attr('data-id', element.id)

      group
        .append('text')
        .attr('x', x)
        .attr('y', y + 5)
        .attr('text-anchor', 'middle')
        .attr('fill', '#ffffff')
        .attr('font-size', '14px')
        .attr('font-weight', '600')
        .text(this.formatValue(element.value))
    })

    return yOffset + 350
  }

  private renderHashMap(structure: DataStructure, yOffset: number): number {
    const group = this.mainGroup.append('g').attr('class', `structure-${structure.id}`)

    // Label
    group
      .append('text')
      .attr('x', 50)
      .attr('y', yOffset - 10)
      .attr('fill', '#374151')
      .attr('font-size', '14px')
      .attr('font-weight', '600')
      .text(structure.metadata?.name || 'Hash Map')

    const itemHeight = 40
    const itemWidth = 200
    const startX = 50

    structure.elements.forEach((element, index) => {
      const y = yOffset + index * (itemHeight + 5)

      // Background
      group
        .append('rect')
        .attr('x', startX)
        .attr('y', y)
        .attr('width', itemWidth)
        .attr('height', itemHeight)
        .attr('fill', element.color || UniversalColors.states.stored)
        .attr('stroke', this.darkenColor(element.color || UniversalColors.states.stored))
        .attr('stroke-width', 2)
        .attr('rx', 6)
        .attr('data-id', element.id)

      // Key
      group
        .append('text')
        .attr('x', startX + 10)
        .attr('y', y + itemHeight / 2 + 5)
        .attr('fill', '#ffffff')
        .attr('font-size', '14px')
        .attr('font-weight', '600')
        .text(`${element.label || element.metadata?.key}:`)

      // Value
      group
        .append('text')
        .attr('x', startX + 80)
        .attr('y', y + itemHeight / 2 + 5)
        .attr('fill', '#ffffff')
        .attr('font-size', '14px')
        .text(this.formatValue(element.value))
    })

    return yOffset + structure.elements.length * (itemHeight + 5) + 20
  }

  private renderStack(structure: DataStructure, yOffset: number): number {
    const group = this.mainGroup.append('g').attr('class', `structure-${structure.id}`)

    // Label
    group
      .append('text')
      .attr('x', 50)
      .attr('y', yOffset - 10)
      .attr('fill', '#374151')
      .attr('font-size', '14px')
      .attr('font-weight', '600')
      .text(structure.metadata?.name || 'Stack')

    const cellWidth = 100
    const cellHeight = 40
    const startX = 50

    // Stack base
    group
      .append('line')
      .attr('x1', startX - 10)
      .attr('y1', yOffset + structure.elements.length * (cellHeight + 5))
      .attr('x2', startX + cellWidth + 10)
      .attr('y2', yOffset + structure.elements.length * (cellHeight + 5))
      .attr('stroke', '#374151')
      .attr('stroke-width', 3)

    // Stack elements (bottom to top)
    structure.elements.reverse().forEach((element, index) => {
      const y = yOffset + index * (cellHeight + 5)

      group
        .append('rect')
        .attr('x', startX)
        .attr('y', y)
        .attr('width', cellWidth)
        .attr('height', cellHeight)
        .attr('fill', element.color || UniversalColors.states.stored)
        .attr('stroke', this.darkenColor(element.color || UniversalColors.states.stored))
        .attr('stroke-width', 2)
        .attr('rx', 6)
        .attr('data-id', element.id)

      group
        .append('text')
        .attr('x', startX + cellWidth / 2)
        .attr('y', y + cellHeight / 2 + 5)
        .attr('text-anchor', 'middle')
        .attr('fill', '#ffffff')
        .attr('font-size', '14px')
        .attr('font-weight', '600')
        .text(this.formatValue(element.value))
    })

    return yOffset + structure.elements.length * (cellHeight + 5) + 40
  }

  private renderQueue(structure: DataStructure, yOffset: number): number {
    // Similar to array but with front/rear indicators
    const result = this.renderArray(structure, yOffset)

    // Add front/rear labels
    this.mainGroup
      .append('text')
      .attr('x', 50)
      .attr('y', yOffset - 25)
      .attr('fill', '#22c55e')
      .attr('font-size', '12px')
      .attr('font-weight', '600')
      .text('← Front')

    this.mainGroup
      .append('text')
      .attr('x', 50 + structure.elements.length * 65)
      .attr('y', yOffset - 25)
      .attr('fill', '#ef4444')
      .attr('font-size', '12px')
      .attr('font-weight', '600')
      .text('Rear →')

    return result
  }

  private renderMatrix(structure: DataStructure, yOffset: number): number {
    const group = this.mainGroup.append('g').attr('class', `structure-${structure.id}`)

    // Label
    group
      .append('text')
      .attr('x', 50)
      .attr('y', yOffset - 10)
      .attr('fill', '#374151')
      .attr('font-size', '14px')
      .attr('font-weight', '600')
      .text(structure.metadata?.name || 'Matrix')

    const cellSize = 45
    const startX = 50

    structure.elements.forEach(element => {
      const row = element.metadata?.row || 0
      const col = element.metadata?.col || 0
      const x = startX + col * (cellSize + 2)
      const y = yOffset + row * (cellSize + 2)

      group
        .append('rect')
        .attr('x', x)
        .attr('y', y)
        .attr('width', cellSize)
        .attr('height', cellSize)
        .attr('fill', element.color || UniversalColors.states.default)
        .attr('stroke', this.darkenColor(element.color || UniversalColors.states.default))
        .attr('stroke-width', 1)
        .attr('data-id', element.id)

      group
        .append('text')
        .attr('x', x + cellSize / 2)
        .attr('y', y + cellSize / 2 + 5)
        .attr('text-anchor', 'middle')
        .attr('fill', '#ffffff')
        .attr('font-size', '12px')
        .attr('font-weight', '600')
        .text(this.formatValue(element.value))
    })

    // Calculate max row/col for height calculation
    const maxRow = Math.max(...structure.elements.map(e => e.metadata?.row || 0))
    return yOffset + (maxRow + 1) * (cellSize + 2) + 40
  }

  private renderGeneric(structure: DataStructure, yOffset: number): number {
    // Fallback: render as simple list
    return this.renderArray(structure, yOffset)
  }

  private renderVariables(variables: Record<string, any>): void {
    const panel = this.mainGroup.append('g').attr('class', 'variables-panel')

    // Background
    panel
      .append('rect')
      .attr('x', this.width - 220)
      .attr('y', 100)
      .attr('width', 200)
      .attr('height', Object.keys(variables).length * 30 + 40)
      .attr('fill', '#f9fafb')
      .attr('stroke', '#e5e7eb')
      .attr('stroke-width', 2)
      .attr('rx', 8)

    // Title
    panel
      .append('text')
      .attr('x', this.width - 120)
      .attr('y', 125)
      .attr('text-anchor', 'middle')
      .attr('fill', '#374151')
      .attr('font-size', '12px')
      .attr('font-weight', '700')
      .text('VARIABLES')

    // Variables
    Object.values(variables).forEach((variable: any, index) => {
      const y = 150 + index * 30

      const text = panel
        .append('text')
        .attr('x', this.width - 210)
        .attr('y', y)
        .attr('fill', variable.highlighted ? UniversalColors.states.active : '#6b7280')
        .attr('font-size', '13px')
        .attr('font-weight', variable.highlighted ? '600' : '400')
        .text(`${variable.name}: ${this.formatValue(variable.value)}`)

      if (variable.changed) {
        text.attr('font-weight', '700')
          .transition()
          .duration(300)
          .attr('fill', UniversalColors.states.result)
      }
    })
  }

  private renderPointers(pointers: any[], structures: DataStructure[]): void {
    pointers.forEach(pointer => {
      // Find the element the pointer points to
      const targetElement = this.mainGroup.select(`[data-id="${pointer.pointsTo}"]`)

      if (!targetElement.empty()) {
        const bbox = targetElement.node().getBBox()

        // Draw arrow
        this.mainGroup
          .append('path')
          .attr('d', `M ${bbox.x + bbox.width / 2} ${bbox.y - 20} L ${bbox.x + bbox.width / 2} ${bbox.y}`)
          .attr('stroke', pointer.color || UniversalColors.pointers.current)
          .attr('stroke-width', 2)
          .attr('marker-end', 'url(#pointer-arrow)')

        // Pointer label
        this.mainGroup
          .append('text')
          .attr('x', bbox.x + bbox.width / 2)
          .attr('y', bbox.y - 25)
          .attr('text-anchor', 'middle')
          .attr('fill', pointer.color || UniversalColors.pointers.current)
          .attr('font-size', '12px')
          .attr('font-weight', '600')
          .text(pointer.name)
      }
    })
  }

  private renderConnections(connections: any[]): void {
    // Render after elements are placed
    connections.forEach(conn => {
      const source = this.mainGroup.select(`[data-id="${conn.from}"]`)
      const target = this.mainGroup.select(`[data-id="${conn.to}"]`)

      if (!source.empty() && !target.empty()) {
        const sourceBBox = source.node().getBBox()
        const targetBBox = target.node().getBBox()

        this.mainGroup
          .append('line')
          .attr('x1', sourceBBox.x + sourceBBox.width / 2)
          .attr('y1', sourceBBox.y + sourceBBox.height / 2)
          .attr('x2', targetBBox.x + targetBBox.width / 2)
          .attr('y2', targetBBox.y + targetBBox.height / 2)
          .attr('stroke', conn.color || UniversalColors.connections.default)
          .attr('stroke-width', 2)
          .attr('marker-end', conn.type === 'directed' ? 'url(#connection-arrow)' : '')
      }
    })
  }

  private renderOperation(operation: any): void {
    const panel = this.mainGroup.append('g').attr('class', 'operation-panel')

    // Background
    panel
      .append('rect')
      .attr('x', 20)
      .attr('y', this.height - 120)
      .attr('width', this.width - 40)
      .attr('height', 100)
      .attr('fill', '#f0f9ff')
      .attr('stroke', '#bfdbfe')
      .attr('stroke-width', 2)
      .attr('rx', 8)

    // Operation type
    panel
      .append('text')
      .attr('x', 40)
      .attr('y', this.height - 90)
      .attr('fill', '#1e40af')
      .attr('font-size', '14px')
      .attr('font-weight', '700')
      .text(`Operation: ${operation.type}`)

    // Complexity
    panel
      .append('text')
      .attr('x', 40)
      .attr('y', this.height - 65)
      .attr('fill', '#6b7280')
      .attr('font-size', '13px')
      .text(`Complexity: ${operation.complexity}`)

    // Description
    panel
      .append('text')
      .attr('x', 40)
      .attr('y', this.height - 40)
      .attr('fill', '#374151')
      .attr('font-size', '13px')
      .text(operation.description.substring(0, 80) + (operation.description.length > 80 ? '...' : ''))
  }

  private addInteractivity(): void {
    this.mainGroup.selectAll('[data-id]')
      .style('cursor', 'pointer')
      .on('mouseover', function() {
        d3.select(this)
          .transition()
          .duration(150)
          .style('filter', 'brightness(1.2) drop-shadow(0 4px 8px rgba(0,0,0,0.2))')
      })
      .on('mouseout', function() {
        d3.select(this)
          .transition()
          .duration(150)
          .style('filter', 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))')
      })
  }

  private formatValue(value: any): string {
    if (value === null) return 'null'
    if (value === undefined) return 'undefined'
    if (typeof value === 'string') return value.length > 10 ? value.substring(0, 10) + '...' : value
    if (typeof value === 'number') return value.toString()
    if (typeof value === 'boolean') return value ? 'true' : 'false'
    return String(value)
  }

  private darkenColor(color: string, amount = 0.2): string {
    // Simple color darkening
    const rgb = d3.rgb(color)
    return rgb.darker(amount).toString()
  }

  private buildTreeHierarchy(elements: Element[]): d3.HierarchyNode<Element> | null {
    if (elements.length === 0) return null

    const root = elements.find(e => e.metadata?.depth === 0) || elements[0]

    return d3.hierarchy(root, (node: Element) => {
      const path = node.metadata?.path || '0'
      return elements.filter(e => {
        const ePath = e.metadata?.path || ''
        return ePath.startsWith(path) && ePath.length === path.length + 1
      })
    })
  }
}

// Export convenience function
export function createUniversalD3Renderer(svgElement: SVGSVGElement, width?: number, height?: number): UniversalD3Renderer {
  return new UniversalD3Renderer(svgElement, width, height)
}

