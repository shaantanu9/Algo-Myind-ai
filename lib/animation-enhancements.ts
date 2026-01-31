/**
 * 🎨 Animation Enhancements
 * 
 * Smooth spring physics, beautiful transitions, and engaging effects
 * for D3, Mermaid, React Flow, and Three.js animations
 */

import * as d3 from 'd3'

// ==================== SPRING PHYSICS ====================

export interface SpringConfig {
  stiffness: number
  damping: number
  mass: number
}

export const SpringPresets = {
  gentle: { stiffness: 120, damping: 14, mass: 1 },
  smooth: { stiffness: 170, damping: 26, mass: 1 },
  bouncy: { stiffness: 260, damping: 20, mass: 1 },
  stiff: { stiffness: 400, damping: 30, mass: 1 },
  wobbly: { stiffness: 180, damping: 12, mass: 1 }
}

export class SpringPhysics {
  private velocity = 0
  private position: number
  private target: number
  private config: SpringConfig

  constructor(initial: number, config: SpringConfig = SpringPresets.smooth) {
    this.position = initial
    this.target = initial
    this.config = config
  }

  setTarget(target: number) {
    this.target = target
  }

  step(deltaTime: number = 16.67) { // ~60fps
    const dt = deltaTime / 1000
    const displacement = this.position - this.target
    const springForce = -this.config.stiffness * displacement
    const dampingForce = -this.config.damping * this.velocity
    const acceleration = (springForce + dampingForce) / this.config.mass

    this.velocity += acceleration * dt
    this.position += this.velocity * dt

    return this.position
  }

  isAtRest(threshold = 0.01): boolean {
    return Math.abs(this.velocity) < threshold && Math.abs(this.position - this.target) < threshold
  }

  getValue(): number {
    return this.position
  }
}

// ==================== D3 ENHANCEMENTS ====================

export const D3Enhancements = {
  /**
   * Smooth transition with spring physics
   */
  springTransition(selection: d3.Selection<any, any, any, any>, duration: number = 600) {
    return selection
      .transition()
      .duration(duration)
      .ease(d3.easeCubicOut)
  },

  /**
   * Add glow effect to active elements
   */
  addGlow(svg: d3.Selection<any, any, any, any>) {
    const defs = svg.append('defs')
    
    // Glow filter
    const glowFilter = defs.append('filter')
      .attr('id', 'glow')
      .attr('x', '-50%')
      .attr('y', '-50%')
      .attr('width', '200%')
      .attr('height', '200%')

    glowFilter.append('feGaussianBlur')
      .attr('stdDeviation', '4')
      .attr('result', 'coloredBlur')

    const feMerge = glowFilter.append('feMerge')
    feMerge.append('feMergeNode').attr('in', 'coloredBlur')
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic')

    // Shadow filter
    const shadowFilter = defs.append('filter')
      .attr('id', 'shadow')
      .attr('x', '-50%')
      .attr('y', '-50%')
      .attr('width', '200%')
      .attr('height', '200%')

    shadowFilter.append('feGaussianBlur')
      .attr('in', 'SourceAlpha')
      .attr('stdDeviation', '3')

    shadowFilter.append('feOffset')
      .attr('dx', '2')
      .attr('dy', '2')
      .attr('result', 'offsetblur')

    const feMerge2 = shadowFilter.append('feMerge')
    feMerge2.append('feMergeNode').attr('in', 'offsetblur')
    feMerge2.append('feMergeNode').attr('in', 'SourceGraphic')

    // Pulse animation
    const pulseFilter = defs.append('filter')
      .attr('id', 'pulse')

    pulseFilter.append('feGaussianBlur')
      .attr('stdDeviation', '2')
      .attr('result', 'blur')

    return { glowFilter, shadowFilter, pulseFilter }
  },

  /**
   * Create gradient definitions
   */
  createGradients(svg: d3.Selection<any, any, any, any>) {
    const defs = svg.select('defs').empty() ? svg.append('defs') : svg.select('defs')

    // Active gradient (blue)
    const activeGradient = defs.append('linearGradient')
      .attr('id', 'gradient-active')
      .attr('x1', '0%').attr('y1', '0%')
      .attr('x2', '0%').attr('y2', '100%')

    activeGradient.append('stop')
      .attr('offset', '0%')
      .attr('style', 'stop-color:#60a5fa;stop-opacity:1')

    activeGradient.append('stop')
      .attr('offset', '100%')
      .attr('style', 'stop-color:#3b82f6;stop-opacity:1')

    // Result gradient (green)
    const resultGradient = defs.append('linearGradient')
      .attr('id', 'gradient-result')
      .attr('x1', '0%').attr('y1', '0%')
      .attr('x2', '0%').attr('y2', '100%')

    resultGradient.append('stop')
      .attr('offset', '0%')
      .attr('style', 'stop-color:#4ade80;stop-opacity:1')

    resultGradient.append('stop')
      .attr('offset', '100%')
      .attr('style', 'stop-color:#22c55e;stop-opacity:1')

    // Checking gradient (orange)
    const checkingGradient = defs.append('linearGradient')
      .attr('id', 'gradient-checking')
      .attr('x1', '0%').attr('y1', '0%')
      .attr('x2', '0%').attr('y2', '100%')

    checkingGradient.append('stop')
      .attr('offset', '0%')
      .attr('style', 'stop-color:#fb923c;stop-opacity:1')

    checkingGradient.append('stop')
      .attr('offset', '100%')
      .attr('style', 'stop-color:#f59e0b;stop-opacity:1')

    // Stored gradient (purple)
    const storedGradient = defs.append('linearGradient')
      .attr('id', 'gradient-stored')
      .attr('x1', '0%').attr('y1', '0%')
      .attr('x2', '0%').attr('y2', '100%')

    storedGradient.append('stop')
      .attr('offset', '0%')
      .attr('style', 'stop-color:#a78bfa;stop-opacity:1')

    storedGradient.append('stop')
      .attr('offset', '100%')
      .attr('style', 'stop-color:#8b5cf6;stop-opacity:1')

    return { activeGradient, resultGradient, checkingGradient, storedGradient }
  },

  /**
   * Animate array elements with stagger
   */
  animateArrayElements(
    svg: d3.Selection<any, any, any, any>,
    data: any[],
    options: {
      x: (d: any, i: number) => number
      y: (d: any, i: number) => number
      width?: number
      height?: number
      stagger?: number
      duration?: number
    }
  ) {
    const {
      x, y,
      width = 60,
      height = 60,
      stagger = 50,
      duration = 600
    } = options

    const elements = svg.selectAll('.array-element')
      .data(data, (d: any) => d.id)

    // Enter
    const enter = elements.enter()
      .append('g')
      .attr('class', 'array-element')
      .attr('transform', (d, i) => `translate(${x(d, i)}, ${y(d, i) + 50})`)
      .style('opacity', 0)

    // Add rectangles with gradients
    enter.append('rect')
      .attr('width', width)
      .attr('height', height)
      .attr('rx', 8)
      .attr('fill', (d: any) => {
        switch (d.state || d.status) {
          case 'active': return 'url(#gradient-active)'
          case 'result': return 'url(#gradient-result)'
          case 'checking': return 'url(#gradient-checking)'
          case 'stored': case 'mapped': return 'url(#gradient-stored)'
          default: return '#e5e7eb'
        }
      })
      .attr('stroke', (d: any) => {
        switch (d.state || d.status) {
          case 'active': return '#3b82f6'
          case 'result': return '#22c55e'
          case 'checking': return '#f59e0b'
          case 'stored': case 'mapped': return '#8b5cf6'
          default: return '#d1d5db'
        }
      })
      .attr('stroke-width', 2)
      .attr('filter', (d: any) => {
        if (d.state === 'active' || d.status === 'active') return 'url(#glow)'
        return 'url(#shadow)'
      })

    // Add text
    enter.append('text')
      .attr('x', width / 2)
      .attr('y', height / 2)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('fill', '#1f2937')
      .attr('font-size', '18px')
      .attr('font-weight', '600')
      .text((d: any) => d.value ?? d.char ?? d.val ?? '')

    // Add index label
    enter.append('text')
      .attr('x', width / 2)
      .attr('y', height + 20)
      .attr('text-anchor', 'middle')
      .attr('fill', '#6b7280')
      .attr('font-size', '12px')
      .text((d: any, i: number) => d.index ?? i)

    // Animate entrance
    enter
      .transition()
      .delay((d, i) => i * stagger)
      .duration(duration)
      .attr('transform', (d, i) => `translate(${x(d, i)}, ${y(d, i)})`)
      .style('opacity', 1)
      .ease(d3.easeBackOut)

    // Update
    elements
      .transition()
      .duration(duration)
      .attr('transform', (d, i) => `translate(${x(d, i)}, ${y(d, i)})`)
      .ease(d3.easeCubicOut)

    elements.select('rect')
      .transition()
      .duration(duration)
      .attr('fill', (d: any) => {
        switch (d.state || d.status) {
          case 'active': return 'url(#gradient-active)'
          case 'result': return 'url(#gradient-result)'
          case 'checking': return 'url(#gradient-checking)'
          case 'stored': case 'mapped': return 'url(#gradient-stored)'
          default: return '#e5e7eb'
        }
      })
      .attr('stroke', (d: any) => {
        switch (d.state || d.status) {
          case 'active': return '#3b82f6'
          case 'result': return '#22c55e'
          case 'checking': return '#f59e0b'
          case 'stored': case 'mapped': return '#8b5cf6'
          default: return '#d1d5db'
        }
      })
      .attr('filter', (d: any) => {
        if (d.state === 'active' || d.status === 'active') return 'url(#glow)'
        return 'url(#shadow)'
      })

    elements.select('text:first-of-type')
      .transition()
      .duration(duration)
      .text((d: any) => d.value ?? d.char ?? d.val ?? '')

    // Exit
    elements.exit()
      .transition()
      .duration(duration / 2)
      .attr('transform', (d, i) => `translate(${x(d, i)}, ${y(d, i) + 50})`)
      .style('opacity', 0)
      .remove()

    return elements
  },

  /**
   * Add floating particles effect
   */
  addParticles(svg: d3.Selection<any, any, any, any>, count: number = 20) {
    const particles = svg.append('g')
      .attr('class', 'particles')
      .attr('opacity', 0.3)

    for (let i = 0; i < count; i++) {
      particles.append('circle')
        .attr('cx', Math.random() * 700)
        .attr('cy', Math.random() * 500)
        .attr('r', Math.random() * 3 + 1)
        .attr('fill', '#60a5fa')
        .transition()
        .duration(3000 + Math.random() * 2000)
        .attr('cy', Math.random() * 500)
        .attr('opacity', Math.random() * 0.5)
        .ease(d3.easeLinear)
        .on('end', function repeat() {
          d3.select(this)
            .transition()
            .duration(3000 + Math.random() * 2000)
            .attr('cy', Math.random() * 500)
            .attr('opacity', Math.random() * 0.5)
            .ease(d3.easeLinear)
            .on('end', repeat)
        })
    }

    return particles
  }
}

// ==================== COLOR UTILITIES ====================

export const AnimationColors = {
  active: {
    fill: 'url(#gradient-active)',
    stroke: '#3b82f6',
    glow: '#60a5fa'
  },
  result: {
    fill: 'url(#gradient-result)',
    stroke: '#22c55e',
    glow: '#4ade80'
  },
  checking: {
    fill: 'url(#gradient-checking)',
    stroke: '#f59e0b',
    glow: '#fb923c'
  },
  stored: {
    fill: 'url(#gradient-stored)',
    stroke: '#8b5cf6',
    glow: '#a78bfa'
  },
  default: {
    fill: '#e5e7eb',
    stroke: '#d1d5db',
    glow: '#f3f4f6'
  },
  visited: {
    fill: '#bfdbfe',
    stroke: '#93c5fd',
    glow: '#dbeafe'
  }
}

// ==================== EASING FUNCTIONS ====================

export const CustomEasing = {
  // Custom spring-like easing
  spring: (t: number) => {
    const c4 = (2 * Math.PI) / 3
    return t === 0 ? 0 : t === 1 ? 1 :
      Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1
  },

  // Elastic bounce
  elastic: (t: number) => {
    const c4 = (2 * Math.PI) / 3
    return t === 0 ? 0 : t === 1 ? 1 :
      -Math.pow(2, 10 * t - 10) * Math.sin((t * 10 - 10.75) * c4)
  },

  // Smooth cubic
  smoothCubic: (t: number) => {
    return t < 0.5
      ? 4 * t * t * t
      : 1 - Math.pow(-2 * t + 2, 3) / 2
  }
}

