/**
 * 📊 D3 ANIMATION ATOMS
 *
 * D3-specific implementations of the atomic building blocks.
 * These functions leverage D3's powerful animation and transition system.
 */

import { AnimationContext, AnimationResult } from '../animation-alphabet'
import * as d3 from 'd3'

// ============================================================================
// 🎭 VISUAL ATOMS - D3 Implementation
// ============================================================================

export async function executeFadeIn(context: AnimationContext, target: string, duration: number, easing: string): Promise<AnimationResult> {
  const startTime = Date.now()

  if (!context.container) {
    return { success: false, data: { error: 'No container provided' }, duration: 0, library: 'd3', timestamp: Date.now() }
  }

  try {
    // D3-specific fade in implementation
    const svg = d3.select(context.container)
    const element = context.elements?.get(target) || svg.select(`[id*="${target}"]`)

    if (!element.empty()) {
      // Use D3 transitions for smooth animation
      await new Promise<void>((resolve) => {
        element
          .transition()
          .duration(duration)
          .ease(d3.easeCubicInOut)
          .style('opacity', 0)
          .transition()
          .duration(duration)
          .ease(d3.easeCubicInOut)
          .style('opacity', 1)
          .on('end', () => resolve())
      })
    }

    return {
      success: true,
      data: { target, action: 'fadeIn' },
      duration: Date.now() - startTime,
      library: 'd3',
      timestamp: Date.now()
    }
  } catch (error) {
    return {
      success: false,
      data: { error: error.message },
      duration: Date.now() - startTime,
      library: 'd3',
      timestamp: Date.now()
    }
  }
}

export async function executeFadeOut(context: AnimationContext, target: string, duration: number, easing: string): Promise<AnimationResult> {
  const startTime = Date.now()

  if (!context.container) {
    return { success: false, data: { error: 'No container provided' }, duration: 0, library: 'd3', timestamp: Date.now() }
  }

  try {
    const svg = d3.select(context.container)
    const element = context.elements?.get(target) || svg.select(`[id*="${target}"]`)

    if (!element.empty()) {
      await new Promise<void>((resolve) => {
        element
          .transition()
          .duration(duration)
          .ease(d3.easeCubicInOut)
          .style('opacity', 1)
          .transition()
          .duration(duration)
          .ease(d3.easeCubicInOut)
          .style('opacity', 0)
          .on('end', () => resolve())
      })
    }

    return {
      success: true,
      data: { target, action: 'fadeOut' },
      duration: Date.now() - startTime,
      library: 'd3',
      timestamp: Date.now()
    }
  } catch (error) {
    return {
      success: false,
      data: { error: error.message },
      duration: Date.now() - startTime,
      library: 'd3',
      timestamp: Date.now()
    }
  }
}

export async function executeHighlight(context: AnimationContext, target: string, color: string, duration: number): Promise<AnimationResult> {
  const startTime = Date.now()

  if (!context.container) {
    return { success: false, data: { error: 'No container provided' }, duration: 0, library: 'd3', timestamp: Date.now() }
  }

  try {
    const svg = d3.select(context.container)
    const element = context.elements?.get(target) || svg.select(`[id*="${target}"]`)

    if (!element.empty()) {
      // Store original attributes
      const originalFill = element.attr('fill')
      const originalStroke = element.attr('stroke')
      const originalStrokeWidth = element.attr('stroke-width')

      // Create highlight transition
      await new Promise<void>((resolve) => {
        element
          .transition()
          .duration(duration * 0.3)
          .ease(d3.easeCubicInOut)
          .attr('fill', color)
          .attr('stroke', color)
          .attr('stroke-width', 3)
          .style('filter', 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.6))')
          .transition()
          .duration(duration * 0.4)
          .ease(d3.easeCubicInOut)
          .attr('transform', 'scale(1.1)')
          .transition()
          .duration(duration * 0.3)
          .ease(d3.easeCubicInOut)
          .attr('fill', originalFill)
          .attr('stroke', originalStroke)
          .attr('stroke-width', originalStrokeWidth)
          .attr('transform', 'scale(1)')
          .style('filter', null)
          .on('end', () => resolve())
      })
    }

    return {
      success: true,
      data: { target, color, action: 'highlight' },
      duration: Date.now() - startTime,
      library: 'd3',
      timestamp: Date.now()
    }
  } catch (error) {
    return {
      success: false,
      data: { error: error.message },
      duration: Date.now() - startTime,
      library: 'd3',
      timestamp: Date.now()
    }
  }
}

export async function executeGlow(context: AnimationContext, target: string, intensity: number, duration: number): Promise<AnimationResult> {
  const startTime = Date.now()

  if (!context.container) {
    return { success: false, data: { error: 'No container provided' }, duration: 0, library: 'd3', timestamp: Date.now() }
  }

  try {
    const svg = d3.select(context.container)
    const element = context.elements?.get(target) || svg.select(`[id*="${target}"]`)

    if (!element.empty()) {
      const glowIntensity = intensity * 20
      const glowColor = `rgba(59, 130, 246, ${intensity})`

      await new Promise<void>((resolve) => {
        element
          .transition()
          .duration(duration)
          .ease(d3.easeCubicInOut)
          .style('filter', `drop-shadow(0 0 ${glowIntensity}px ${glowColor})`)
          .transition()
          .duration(duration)
          .ease(d3.easeCubicInOut)
          .style('filter', null)
          .on('end', () => resolve())
      })
    }

    return {
      success: true,
      data: { target, intensity, action: 'glow' },
      duration: Date.now() - startTime,
      library: 'd3',
      timestamp: Date.now()
    }
  } catch (error) {
    return {
      success: false,
      data: { error: error.message },
      duration: Date.now() - startTime,
      library: 'd3',
      timestamp: Date.now()
    }
  }
}

// ============================================================================
// 📐 SPATIAL ATOMS - D3 Implementation
// ============================================================================

export async function executeMove(context: AnimationContext, target: string, from: any, to: any, duration: number, easing: string): Promise<AnimationResult> {
  const startTime = Date.now()

  if (!context.container) {
    return { success: false, data: { error: 'No container provided' }, duration: 0, library: 'd3', timestamp: Date.now() }
  }

  try {
    const svg = d3.select(context.container)
    const element = context.elements?.get(target) || svg.select(`[id*="${target}"]`)

    if (!element.empty()) {
      await new Promise<void>((resolve) => {
        element
          .transition()
          .duration(duration)
          .ease(d3.easeCubicInOut)
          .attr('transform', `translate(${from.x}, ${from.y})`)
          .transition()
          .duration(duration)
          .ease(d3.easeCubicInOut)
          .attr('transform', `translate(${to.x}, ${to.y})`)
          .on('end', () => resolve())
      })
    }

    return {
      success: true,
      data: { target, from, to, action: 'move' },
      duration: Date.now() - startTime,
      library: 'd3',
      timestamp: Date.now()
    }
  } catch (error) {
    return {
      success: false,
      data: { error: error.message },
      duration: Date.now() - startTime,
      library: 'd3',
      timestamp: Date.now()
    }
  }
}

export async function executeScale(context: AnimationContext, target: string, from: number, to: number, duration: number, easing: string): Promise<AnimationResult> {
  const startTime = Date.now()

  if (!context.container) {
    return { success: false, data: { error: 'No container provided' }, duration: 0, library: 'd3', timestamp: Date.now() }
  }

  try {
    const svg = d3.select(context.container)
    const element = context.elements?.get(target) || svg.select(`[id*="${target}"]`)

    if (!element.empty()) {
      await new Promise<void>((resolve) => {
        element
          .transition()
          .duration(duration)
          .ease(d3.easeBackOut)
          .attr('transform', `scale(${from})`)
          .transition()
          .duration(duration)
          .ease(d3.easeBackOut)
          .attr('transform', `scale(${to})`)
          .on('end', () => resolve())
      })
    }

    return {
      success: true,
      data: { target, from, to, action: 'scale' },
      duration: Date.now() - startTime,
      library: 'd3',
      timestamp: Date.now()
    }
  } catch (error) {
    return {
      success: false,
      data: { error: error.message },
      duration: Date.now() - startTime,
      library: 'd3',
      timestamp: Date.now()
    }
  }
}

export async function executeRotate(context: AnimationContext, target: string, from: number, to: number, duration: number, easing: string): Promise<AnimationResult> {
  const startTime = Date.now()

  if (!context.container) {
    return { success: false, data: { error: 'No container provided' }, duration: 0, library: 'd3', timestamp: Date.now() }
  }

  try {
    const svg = d3.select(context.container)
    const element = context.elements?.get(target) || svg.select(`[id*="${target}"]`)

    if (!element.empty()) {
      await new Promise<void>((resolve) => {
        element
          .transition()
          .duration(duration)
          .ease(d3.easeCubicInOut)
          .attr('transform', `rotate(${from})`)
          .transition()
          .duration(duration)
          .ease(d3.easeCubicInOut)
          .attr('transform', `rotate(${to})`)
          .on('end', () => resolve())
      })
    }

    return {
      success: true,
      data: { target, from, to, action: 'rotate' },
      duration: Date.now() - startTime,
      library: 'd3',
      timestamp: Date.now()
    }
  } catch (error) {
    return {
      success: false,
      data: { error: error.message },
      duration: Date.now() - startTime,
      library: 'd3',
      timestamp: Date.now()
    }
  }
}

// ============================================================================
// ⏰ TEMPORAL ATOMS - D3 Implementation
// ============================================================================

export async function executeDelay(duration: number): Promise<AnimationResult> {
  const startTime = Date.now()

  await new Promise(resolve => setTimeout(resolve, duration))

  return {
    success: true,
    data: { action: 'delay', duration },
    duration: Date.now() - startTime,
    library: 'd3',
    timestamp: Date.now()
  }
}

export async function executeWaitForClick(context: AnimationContext, target: string): Promise<AnimationResult> {
  const startTime = Date.now()

  return new Promise((resolve) => {
    if (!context.container) {
      resolve({
        success: false,
        data: { error: 'No container provided' },
        duration: 0,
        library: 'd3',
        timestamp: Date.now()
      })
      return
    }

    const svg = d3.select(context.container)
    const element = context.elements?.get(target) || svg.select(`[id*="${target}"]`)

    if (element.empty()) {
      resolve({
        success: false,
        data: { error: 'Element not found' },
        duration: Date.now() - startTime,
        library: 'd3',
        timestamp: Date.now()
      })
      return
    }

    element.style('cursor', 'pointer')

    element.on('click', function(event) {
      event.stopPropagation()
      d3.select(this).style('cursor', null)
      element.on('click', null) // Remove listener
      resolve({
        success: true,
        data: { target, action: 'waitForClick' },
        duration: Date.now() - startTime,
        library: 'd3',
        timestamp: Date.now()
      })
    })
  })
}

export async function executeWaitForHover(context: AnimationContext, target: string): Promise<AnimationResult> {
  const startTime = Date.now()

  return new Promise((resolve) => {
    if (!context.container) {
      resolve({
        success: false,
        data: { error: 'No container provided' },
        duration: 0,
        library: 'd3',
        timestamp: Date.now()
      })
      return
    }

    const svg = d3.select(context.container)
    const element = context.elements?.get(target) || svg.select(`[id*="${target}"]`)

    if (element.empty()) {
      resolve({
        success: false,
        data: { error: 'Element not found' },
        duration: Date.now() - startTime,
        library: 'd3',
        timestamp: Date.now()
      })
      return
    }

    element.on('mouseenter', function(event) {
      event.stopPropagation()
      element.on('mouseenter', null) // Remove listener
      resolve({
        success: true,
        data: { target, action: 'waitForHover' },
        duration: Date.now() - startTime,
        library: 'd3',
        timestamp: Date.now()
      })
    })
  })
}

// ============================================================================
// 🎨 SPECIALIZED D3 ANIMATIONS
// ============================================================================

export async function executeD3Pulse(context: AnimationContext, target: string, times: number = 3): Promise<AnimationResult> {
  const startTime = Date.now()

  if (!context.container) {
    return { success: false, data: { error: 'No container provided' }, duration: 0, library: 'd3', timestamp: Date.now() }
  }

  try {
    const svg = d3.select(context.container)
    const element = context.elements?.get(target) || svg.select(`[id*="${target}"]`)

    if (!element.empty()) {
      const pulseAnimation = async () => {
        for (let i = 0; i < times; i++) {
          await new Promise<void>((resolve) => {
            element
              .transition()
              .duration(300)
              .ease(d3.easeCubicInOut)
              .attr('transform', 'scale(1.2)')
              .attr('opacity', 0.8)
              .transition()
              .duration(300)
              .ease(d3.easeCubicInOut)
              .attr('transform', 'scale(1)')
              .attr('opacity', 1)
              .on('end', () => resolve())
          })
        }
      }

      await pulseAnimation()
    }

    return {
      success: true,
      data: { target, times, action: 'pulse' },
      duration: Date.now() - startTime,
      library: 'd3',
      timestamp: Date.now()
    }
  } catch (error) {
    return {
      success: false,
      data: { error: error.message },
      duration: Date.now() - startTime,
      library: 'd3',
      timestamp: Date.now()
    }
  }
}

export async function executeD3PathAnimation(context: AnimationContext, target: string, pathData: string, duration: number): Promise<AnimationResult> {
  const startTime = Date.now()

  if (!context.container) {
    return { success: false, data: { error: 'No container provided' }, duration: 0, library: 'd3', timestamp: Date.now() }
  }

  try {
    const svg = d3.select(context.container)
    const element = context.elements?.get(target) || svg.select(`[id*="${target}"]`)

    if (!element.empty()) {
      await new Promise<void>((resolve) => {
        element
          .attr('d', '') // Start with empty path
          .transition()
          .duration(duration)
          .ease(d3.easeLinear)
          .attrTween('d', function() {
            const interpolate = d3.interpolateString('', pathData)
            return function(t) { return interpolate(t) }
          })
          .on('end', () => resolve())
      })
    }

    return {
      success: true,
      data: { target, pathData, action: 'pathAnimation' },
      duration: Date.now() - startTime,
      library: 'd3',
      timestamp: Date.now()
    }
  } catch (error) {
    return {
      success: false,
      data: { error: error.message },
      duration: Date.now() - startTime,
      library: 'd3',
      timestamp: Date.now()
    }
  }
}

export async function executeD3MorphText(context: AnimationContext, target: string, fromText: string, toText: string, duration: number): Promise<AnimationResult> {
  const startTime = Date.now()

  if (!context.container) {
    return { success: false, data: { error: 'No container provided' }, duration: 0, library: 'd3', timestamp: Date.now() }
  }

  try {
    const svg = d3.select(context.container)
    const element = context.elements?.get(target) || svg.select(`[id*="${target}"]`)

    if (!element.empty()) {
      // For text morphing, we'll animate opacity and then change text
      await new Promise<void>((resolve) => {
        element
          .transition()
          .duration(duration * 0.4)
          .ease(d3.easeCubicInOut)
          .style('opacity', 0.3)
          .attr('transform', 'scale(0.9)')
          .transition()
          .duration(duration * 0.2)
          .ease(d3.easeCubicInOut)
          .text(toText)
          .transition()
          .duration(duration * 0.4)
          .ease(d3.easeCubicInOut)
          .style('opacity', 1)
          .attr('transform', 'scale(1)')
          .on('end', () => resolve())
      })
    }

    return {
      success: true,
      data: { target, fromText, toText, action: 'morphText' },
      duration: Date.now() - startTime,
      library: 'd3',
      timestamp: Date.now()
    }
  } catch (error) {
    return {
      success: false,
      data: { error: error.message },
      duration: Date.now() - startTime,
      library: 'd3',
      timestamp: Date.now()
    }
  }
}
