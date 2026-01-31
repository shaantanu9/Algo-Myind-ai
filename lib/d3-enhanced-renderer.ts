/**
 * 🎨 Enhanced D3 Renderer
 * 
 * Beautiful, smooth animations with spring physics
 * Drop-in replacement renderer for D3 visualizations
 */

import * as d3 from 'd3'
import { D3Enhancements, SpringPresets, AnimationColors } from './animation-enhancements'

export interface EnhancedD3Options {
  width?: number
  height?: number
  spring?: keyof typeof SpringPresets
  enableParticles?: boolean
  stagger?: number
  duration?: number
}

export class EnhancedD3Renderer {
  private svg: d3.Selection<SVGSVGElement, unknown, null, undefined>
  private mainGroup: d3.Selection<SVGGElement, unknown, null, undefined>
  private options: Required<EnhancedD3Options>

  constructor(svgElement: SVGSVGElement, options: EnhancedD3Options = {}) {
    this.options = {
      width: options.width || 700,
      height: options.height || 500,
      spring: options.spring || 'smooth',
      enableParticles: options.enableParticles ?? false,
      stagger: options.stagger || 50,
      duration: options.duration || 600
    }

    this.svg = d3.select(svgElement)
    this.svg.attr('viewBox', `0 0 ${this.options.width} ${this.options.height}`)

    // Clear previous content
    this.svg.selectAll('*').remove()

    // Setup filters and gradients
    D3Enhancements.addGlow(this.svg)
    D3Enhancements.createGradients(this.svg)

    // Create main group
    this.mainGroup = this.svg.append('g')
      .attr('class', 'main-visualization')

    // Add background
    this.mainGroup.append('rect')
      .attr('width', this.options.width)
      .attr('height', this.options.height)
      .attr('fill', 'transparent')

    // Add particles if enabled
    if (this.options.enableParticles) {
      D3Enhancements.addParticles(this.svg, 15)
    }
  }

  /**
   * Render array visualization
   */
  renderArray(data: any[], options: {
    y?: number
    spacing?: number
    showIndex?: boolean
    highlightActive?: boolean
  } = {}) {
    const {
      y = 200,
      spacing = 80,
      showIndex = true,
      highlightActive = true
    } = options

    // Calculate positions
    const totalWidth = data.length * spacing
    const startX = (this.options.width - totalWidth) / 2

    D3Enhancements.animateArrayElements(
      this.mainGroup,
      data,
      {
        x: (d, i) => startX + i * spacing,
        y: (d, i) => y,
        width: 60,
        height: 60,
        stagger: this.options.stagger,
        duration: this.options.duration
      }
    )
  }

  /**
   * Render hash map visualization
   */
  renderHashMap(entries: Array<{key: any, value: any, state?: string}>, options: {
    x?: number
    y?: number
    spacing?: number
  } = {}) {
    const {
      x = 100,
      y = 300,
      spacing = 40
    } = options

    const hashGroup = this.mainGroup.selectAll('.hash-entry')
      .data(entries, (d: any) => d.key)

    // Enter
    const enter = hashGroup.enter()
      .append('g')
      .attr('class', 'hash-entry')
      .attr('transform', (d, i) => `translate(${x}, ${y + i * spacing + 50})`)
      .style('opacity', 0)

    // Background card
    enter.append('rect')
      .attr('width', 180)
      .attr('height', 32)
      .attr('rx', 6)
      .attr('fill', '#f9fafb')
      .attr('stroke', '#e5e7eb')
      .attr('stroke-width', 1.5)
      .attr('filter', 'url(#shadow)')

    // Key
    enter.append('text')
      .attr('x', 10)
      .attr('y', 16)
      .attr('text-anchor', 'start')
      .attr('dominant-baseline', 'middle')
      .attr('fill', '#6b7280')
      .attr('font-size', '13px')
      .attr('font-weight', '500')
      .text((d: any) => `Key: ${d.key}`)

    // Arrow
    enter.append('text')
      .attr('x', 85)
      .attr('y', 16)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('fill', '#9ca3af')
      .attr('font-size', '12px')
      .text('→')

    // Value
    enter.append('text')
      .attr('x', 110)
      .attr('y', 16)
      .attr('text-anchor', 'start')
      .attr('dominant-baseline', 'middle')
      .attr('fill', '#3b82f6')
      .attr('font-size', '13px')
      .attr('font-weight', '600')
      .text((d: any) => `[${d.value}]`)

    // Animate entrance
    enter
      .transition()
      .delay((d, i) => i * this.options.stagger)
      .duration(this.options.duration)
      .attr('transform', (d, i) => `translate(${x}, ${y + i * spacing})`)
      .style('opacity', 1)
      .ease(d3.easeBackOut)

    // Update
    hashGroup
      .transition()
      .duration(this.options.duration)
      .attr('transform', (d, i) => `translate(${x}, ${y + i * spacing})`)

    // Exit
    hashGroup.exit()
      .transition()
      .duration(this.options.duration / 2)
      .style('opacity', 0)
      .remove()
  }

  /**
   * Render pointer/index indicator
   */
  renderPointer(pointer: {
    label: string
    index: number
    color?: string
    y?: number
  }, totalElements: number) {
    const spacing = 80
    const totalWidth = totalElements * spacing
    const startX = (this.options.width - totalWidth) / 2

    const pointerX = startX + pointer.index * spacing + 30

    const pointerGroup = this.mainGroup.selectAll(`.pointer-${pointer.label}`)
      .data([pointer])

    // Enter
    const enter = pointerGroup.enter()
      .append('g')
      .attr('class', `pointer-${pointer.label}`)
      .attr('transform', `translate(${pointerX}, ${pointer.y || 100})`)
      .style('opacity', 0)

    // Arrow
    enter.append('path')
      .attr('d', 'M 0,0 L -8,-15 L 8,-15 Z')
      .attr('fill', pointer.color || '#3b82f6')
      .attr('filter', 'url(#glow)')

    // Label
    enter.append('text')
      .attr('y', -25)
      .attr('text-anchor', 'middle')
      .attr('fill', pointer.color || '#3b82f6')
      .attr('font-size', '12px')
      .attr('font-weight', '600')
      .text(pointer.label)

    // Animate entrance
    enter
      .transition()
      .duration(this.options.duration)
      .style('opacity', 1)
      .ease(d3.easeBackOut)

    // Update
    pointerGroup
      .transition()
      .duration(this.options.duration)
      .attr('transform', `translate(${pointerX}, ${pointer.y || 100})`)
      .ease(d3.easeCubicOut)

    // Exit
    pointerGroup.exit()
      .transition()
      .duration(this.options.duration / 2)
      .style('opacity', 0)
      .remove()
  }

  /**
   * Render connection/arrow between elements
   */
  renderConnection(from: {x: number, y: number}, to: {x: number, y: number}, options: {
    color?: string
    dashed?: boolean
    animated?: boolean
    label?: string
  } = {}) {
    const {
      color = '#3b82f6',
      dashed = false,
      animated = true,
      label
    } = options

    const connectionGroup = this.mainGroup.append('g')
      .attr('class', 'connection')

    // Draw path
    const path = connectionGroup.append('path')
      .attr('d', `M ${from.x},${from.y} Q ${(from.x + to.x) / 2},${from.y - 30} ${to.x},${to.y}`)
      .attr('fill', 'none')
      .attr('stroke', color)
      .attr('stroke-width', 2)
      .attr('marker-end', 'url(#arrowhead)')
      .style('opacity', 0)

    if (dashed) {
      path.attr('stroke-dasharray', '5,5')
    }

    if (animated) {
      const length = (path.node() as SVGPathElement).getTotalLength()
      path
        .attr('stroke-dasharray', `${length} ${length}`)
        .attr('stroke-dashoffset', length)
        .transition()
        .duration(this.options.duration)
        .attr('stroke-dashoffset', 0)
        .style('opacity', 1)
    } else {
      path
        .transition()
        .duration(this.options.duration / 2)
        .style('opacity', 1)
    }

    // Add label if provided
    if (label) {
      connectionGroup.append('text')
        .attr('x', (from.x + to.x) / 2)
        .attr('y', from.y - 35)
        .attr('text-anchor', 'middle')
        .attr('fill', color)
        .attr('font-size', '11px')
        .attr('font-weight', '600')
        .style('opacity', 0)
        .text(label)
        .transition()
        .delay(this.options.duration / 2)
        .duration(this.options.duration / 2)
        .style('opacity', 1)
    }

    // Add arrowhead marker if not exists
    const defs = this.svg.select('defs')
    if (defs.select('#arrowhead').empty()) {
      defs.append('marker')
        .attr('id', 'arrowhead')
        .attr('markerWidth', 10)
        .attr('markerHeight', 10)
        .attr('refX', 8)
        .attr('refY', 3)
        .attr('orient', 'auto')
        .append('polygon')
        .attr('points', '0 0, 10 3, 0 6')
        .attr('fill', color)
    }
  }

  /**
   * Add title/header
   */
  addTitle(text: string, options: {
    y?: number
    fontSize?: number
    color?: string
  } = {}) {
    const {
      y = 40,
      fontSize = 24,
      color = '#1f2937'
    } = options

    this.mainGroup.append('text')
      .attr('x', this.options.width / 2)
      .attr('y', y)
      .attr('text-anchor', 'middle')
      .attr('fill', color)
      .attr('font-size', `${fontSize}px`)
      .attr('font-weight', '700')
      .style('opacity', 0)
      .text(text)
      .transition()
      .duration(this.options.duration)
      .style('opacity', 1)
  }

  /**
   * Add description text
   */
  addDescription(text: string, options: {
    y?: number
    fontSize?: number
    color?: string
  } = {}) {
    const {
      y = 70,
      fontSize = 14,
      color = '#6b7280'
    } = options

    this.mainGroup.append('text')
      .attr('x', this.options.width / 2)
      .attr('y', y)
      .attr('text-anchor', 'middle')
      .attr('fill', color)
      .attr('font-size', `${fontSize}px`)
      .style('opacity', 0)
      .text(text)
      .transition()
      .duration(this.options.duration)
      .style('opacity', 1)
  }

  /**
   * Clear all visualizations
   */
  clear() {
    this.mainGroup.selectAll('*:not(rect):not(defs)').remove()
  }
}

