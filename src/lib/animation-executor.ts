/**
 * 🎬 ANIMATION EXECUTOR
 *
 * The central execution engine that routes atomic animation functions
 * to the appropriate library-specific implementations.
 *
 * This is the "conductor" that makes the alphabet system work.
 */

import { AnimationAtom, AnimationContext, AnimationResult } from './animation-alphabet'

// Import all library-specific implementations
import * as MermaidAtoms from './animation-libraries/mermaid-atoms'
import * as ReactFlowAtoms from './animation-libraries/reactflow-atoms'
import * as D3Atoms from './animation-libraries/d3-atoms'

// ============================================================================
// 🎯 EXECUTION ROUTER
// ============================================================================

export class AnimationExecutor {
  private static libraryExecutors = {
    mermaid: MermaidAtoms,
    reactflow: ReactFlowAtoms,
    d3: D3Atoms,
    three: null, // Three.js implementation would go here
  }

  /**
   * Execute a single animation atom
   */
  static async executeAtom(atom: AnimationAtom, context: AnimationContext): Promise<AnimationResult> {
    const executor = this.libraryExecutors[context.library]

    if (!executor) {
      return {
        success: false,
        data: { error: `No executor found for library: ${context.library}` },
        duration: 0,
        library: context.library,
        timestamp: Date.now()
      }
    }

    try {
      // Route to the appropriate library implementation
      switch (atom.type) {
        case 'visual':
          return await this.executeVisualAtom(atom, context, executor)
        case 'spatial':
          return await this.executeSpatialAtom(atom, context, executor)
        case 'temporal':
          return await this.executeTemporalAtom(atom, context, executor)
        case 'interactive':
          return await this.executeInteractiveAtom(atom, context, executor)
        case 'composite':
          return await this.executeCompositeAtom(atom, context)
        default:
          return {
            success: false,
            data: { error: `Unknown atom type: ${atom.type}` },
            duration: 0,
            library: context.library,
            timestamp: Date.now()
          }
      }
    } catch (error) {
      return {
        success: false,
        data: { error: error.message, atom: atom.id },
        duration: 0,
        library: context.library,
        timestamp: Date.now()
      }
    }
  }

  /**
   * Execute visual atoms (fade, highlight, glow, etc.)
   */
  private static async executeVisualAtom(atom: AnimationAtom, context: AnimationContext, executor: any): Promise<AnimationResult> {
    switch (atom.properties.action || atom.id.split('-')[0]) {
      case 'fadeIn':
      case 'fadein':
        return await executor.executeFadeIn(context, atom.target!, atom.duration || 500, atom.easing || 'easeOutCubic')

      case 'fadeOut':
      case 'fadeout':
        return await executor.executeFadeOut(context, atom.target!, atom.duration || 500, atom.easing || 'easeOutCubic')

      case 'highlight':
        return await executor.executeHighlight(context, atom.target!, atom.properties.color || '#3b82f6', atom.duration || 500)

      case 'glow':
        return await executor.executeGlow(context, atom.target!, atom.properties.intensity || 0.5, atom.duration || 500)

      default:
        return {
          success: false,
          data: { error: `Unknown visual action: ${atom.properties.action}` },
          duration: 0,
          library: context.library,
          timestamp: Date.now()
        }
    }
  }

  /**
   * Execute spatial atoms (move, scale, rotate)
   */
  private static async executeSpatialAtom(atom: AnimationAtom, context: AnimationContext, executor: any): Promise<AnimationResult> {
    switch (atom.properties.action || atom.id.split('-')[0]) {
      case 'move':
        return await executor.executeMove(
          context,
          atom.target!,
          atom.properties.from || { x: 0, y: 0 },
          atom.properties.to || { x: 0, y: 0 },
          atom.duration || 500,
          atom.easing || 'easeOutCubic'
        )

      case 'scale':
        return await executor.executeScale(
          context,
          atom.target!,
          atom.properties.from || 1,
          atom.properties.to || 1,
          atom.duration || 500,
          atom.easing || 'easeOutBack'
        )

      case 'rotate':
        return await executor.executeRotate(
          context,
          atom.target!,
          atom.properties.from || 0,
          atom.properties.to || 0,
          atom.duration || 500,
          atom.easing || 'easeOutCubic'
        )

      default:
        return {
          success: false,
          data: { error: `Unknown spatial action: ${atom.properties.action}` },
          duration: 0,
          library: context.library,
          timestamp: Date.now()
        }
    }
  }

  /**
   * Execute temporal atoms (delay, timing controls)
   */
  private static async executeTemporalAtom(atom: AnimationAtom, context: AnimationContext, executor: any): Promise<AnimationResult> {
    switch (atom.properties.action || atom.id.split('-')[0]) {
      case 'delay':
        return await executor.executeDelay(atom.properties.duration || 500)

      default:
        return {
          success: false,
          data: { error: `Unknown temporal action: ${atom.properties.action}` },
          duration: 0,
          library: context.library,
          timestamp: Date.now()
        }
    }
  }

  /**
   * Execute interactive atoms (wait for user input)
   */
  private static async executeInteractiveAtom(atom: AnimationAtom, context: AnimationContext, executor: any): Promise<AnimationResult> {
    switch (atom.properties.interaction) {
      case 'click':
        return await executor.executeWaitForClick(context, atom.target!)

      case 'hover':
        return await executor.executeWaitForHover(context, atom.target!)

      default:
        return {
          success: false,
          data: { error: `Unknown interaction: ${atom.properties.interaction}` },
          duration: 0,
          library: context.library,
          timestamp: Date.now()
        }
    }
  }

  /**
   * Execute composite atoms (sequences, parallels, etc.)
   */
  private static async executeCompositeAtom(atom: AnimationAtom, context: AnimationContext): Promise<AnimationResult> {
    switch (atom.properties.type) {
      case 'sequence':
        return await this.executeSequence(context, atom.properties.atoms || [])

      case 'parallel':
        return await this.executeParallel(context, atom.properties.atoms || [])

      case 'repeat':
        return await this.executeRepeat(context, atom.properties.atom, atom.properties.count || 1)

      case 'stagger':
        return await this.executeStagger(context, atom.properties.atoms || [], atom.properties.staggerDelay || 100)

      default:
        return {
          success: false,
          data: { error: `Unknown composite type: ${atom.properties.type}` },
          duration: 0,
          library: context.library,
          timestamp: Date.now()
        }
    }
  }

  // ============================================================================
  // 🔄 COMPOSITE EXECUTION METHODS
  // ============================================================================

  /**
   * Execute atoms in sequence (one after another)
   */
  private static async executeSequence(context: AnimationContext, atoms: AnimationAtom[]): Promise<AnimationResult> {
    const results: AnimationResult[] = []
    let totalDuration = 0

    for (const atom of atoms) {
      const result = await this.executeAtom(atom, context)
      results.push(result)
      totalDuration += result.duration

      // If any atom fails, stop the sequence
      if (!result.success) {
        return {
          success: false,
          data: { results, failedAt: results.length - 1 },
          duration: totalDuration,
          library: context.library,
          timestamp: Date.now()
        }
      }
    }

    return {
      success: true,
      data: { results, type: 'sequence' },
      duration: totalDuration,
      library: context.library,
      timestamp: Date.now()
    }
  }

  /**
   * Execute atoms in parallel (all at once)
   */
  private static async executeParallel(context: AnimationContext, atoms: AnimationAtom[]): Promise<AnimationResult> {
    const promises = atoms.map(atom => this.executeAtom(atom, context))
    const results = await Promise.all(promises)
    const maxDuration = Math.max(...results.map(r => r.duration))

    return {
      success: results.every(r => r.success),
      data: { results, type: 'parallel' },
      duration: maxDuration,
      library: context.library,
      timestamp: Date.now()
    }
  }

  /**
   * Execute an atom repeatedly
   */
  private static async executeRepeat(context: AnimationContext, atom: AnimationAtom, count: number): Promise<AnimationResult> {
    const results: AnimationResult[] = []
    let totalDuration = 0

    for (let i = 0; i < count; i++) {
      const result = await this.executeAtom(atom, context)
      results.push(result)
      totalDuration += result.duration

      if (!result.success) {
        return {
          success: false,
          data: { results, failedAt: i },
          duration: totalDuration,
          library: context.library,
          timestamp: Date.now()
        }
      }
    }

    return {
      success: true,
      data: { results, count, type: 'repeat' },
      duration: totalDuration,
      library: context.library,
      timestamp: Date.now()
    }
  }

  /**
   * Execute atoms with staggered timing
   */
  private static async executeStagger(context: AnimationContext, atoms: AnimationAtom[], staggerDelay: number): Promise<AnimationResult> {
    const results: AnimationResult[] = []
    let totalDuration = 0

    for (let i = 0; i < atoms.length; i++) {
      if (i > 0) {
        // Add stagger delay
        await new Promise(resolve => setTimeout(resolve, staggerDelay))
        totalDuration += staggerDelay
      }

      const result = await this.executeAtom(atoms[i], context)
      results.push(result)
      totalDuration += result.duration

      if (!result.success) {
        return {
          success: false,
          data: { results, failedAt: i },
          duration: totalDuration,
          library: context.library,
          timestamp: Date.now()
        }
      }
    }

    return {
      success: true,
      data: { results, staggerDelay, type: 'stagger' },
      duration: totalDuration,
      library: context.library,
      timestamp: Date.now()
    }
  }

  // ============================================================================
  // 🎭 SPECIALIZED EXECUTION METHODS
  // ============================================================================

  /**
   * Execute animation with performance monitoring
   */
  static async executeWithMetrics(atom: AnimationAtom, context: AnimationContext): Promise<{
    result: AnimationResult
    metrics: {
      startTime: number
      endTime: number
      duration: number
      fps: number
      memoryUsage?: number
    }
  }> {
    const startTime = performance.now()
    const startMemory = (performance as any).memory?.usedJSHeapSize

    const result = await this.executeAtom(atom, context)

    const endTime = performance.now()
    const endMemory = (performance as any).memory?.usedJSHeapSize
    const duration = endTime - startTime
    const fps = duration > 0 ? 1000 / duration : 60
    const memoryUsage = startMemory && endMemory ? endMemory - startMemory : undefined

    return {
      result,
      metrics: {
        startTime,
        endTime,
        duration,
        fps,
        memoryUsage
      }
    }
  }

  /**
   * Execute multiple atoms with batch processing
   */
  static async executeBatch(atoms: AnimationAtom[], context: AnimationContext): Promise<{
    results: AnimationResult[]
    summary: {
      totalDuration: number
      successCount: number
      failureCount: number
      averageDuration: number
    }
  }> {
    const results: AnimationResult[] = []
    let totalDuration = 0

    for (const atom of atoms) {
      const result = await this.executeAtom(atom, context)
      results.push(result)
      totalDuration += result.duration
    }

    const successCount = results.filter(r => r.success).length
    const failureCount = results.length - successCount
    const averageDuration = totalDuration / results.length

    return {
      results,
      summary: {
        totalDuration,
        successCount,
        failureCount,
        averageDuration
      }
    }
  }

  /**
   * Execute animation with error recovery
   */
  static async executeWithRecovery(atom: AnimationAtom, context: AnimationContext, maxRetries: number = 3): Promise<AnimationResult> {
    let lastError: any = null

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const result = await this.executeAtom(atom, context)
        if (result.success) {
          return result
        }

        lastError = result.data.error
      } catch (error) {
        lastError = error
      }

      // Wait before retrying
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, 100 * attempt))
      }
    }

    return {
      success: false,
      data: {
        error: `Failed after ${maxRetries} attempts`,
        lastError,
        atomId: atom.id
      },
      duration: 0,
      library: context.library,
      timestamp: Date.now()
    }
  }
}

// ============================================================================
// 🚀 CONVENIENCE FUNCTIONS
// ============================================================================

/**
 * Execute a single atom with default context
 */
export async function executeAtom(atom: AnimationAtom, context: Partial<AnimationContext>): Promise<AnimationResult> {
  const defaultContext: AnimationContext = {
    library: 'universal',
    container: null,
    elements: new Map(),
    step: 0,
    data: {},
    ...context
  }

  return AnimationExecutor.executeAtom(atom, defaultContext)
}

/**
 * Execute atoms in sequence
 */
export async function executeSequence(atoms: AnimationAtom[], context: Partial<AnimationContext>): Promise<AnimationResult> {
  const sequenceAtom = {
    id: `sequence-${Date.now()}`,
    type: 'composite' as const,
    library: 'universal',
    properties: { atoms, type: 'sequence' },
    execute: async (ctx: AnimationContext) => AnimationExecutor.executeCompositeAtom(sequenceAtom, ctx)
  }

  return executeAtom(sequenceAtom, context)
}

/**
 * Execute atoms in parallel
 */
export async function executeParallel(atoms: AnimationAtom[], context: Partial<AnimationContext>): Promise<AnimationResult> {
  const parallelAtom = {
    id: `parallel-${Date.now()}`,
    type: 'composite' as const,
    library: 'universal',
    properties: { atoms, type: 'parallel' },
    execute: async (ctx: AnimationContext) => AnimationExecutor.executeCompositeAtom(parallelAtom, ctx)
  }

  return executeAtom(parallelAtom, context)
}

/**
 * Execute atoms with stagger timing
 */
export async function executeStagger(atoms: AnimationAtom[], staggerDelay: number, context: Partial<AnimationContext>): Promise<AnimationResult> {
  const staggerAtom = {
    id: `stagger-${Date.now()}`,
    type: 'composite' as const,
    library: 'universal',
    properties: { atoms, staggerDelay, type: 'stagger' },
    execute: async (ctx: AnimationContext) => AnimationExecutor.executeCompositeAtom(staggerAtom, ctx)
  }

  return executeAtom(staggerAtom, context)
}
