/**
 * 🎭 ALGORITHM ANIMATION GENERATOR
 *
 * Transforms algorithm objects into proper animations for D3, ReactFlow, and Three.js
 * Uses the existing animation libraries to create dynamic, interactive visualizations
 */

import { AnimationContext, AnimationResult } from './animation-atoms'
import { AnimationAlphabet } from './animation-alphabet'
import { AlgorithmData } from './data-transformers'
import * as d3 from 'd3'

// Animation Library Imports
import {
  executeFadeIn as d3FadeIn,
  executeFadeOut as d3FadeOut,
  executeHighlight as d3Highlight,
  executeMove as d3Move,
  executeScale as d3Scale,
  executeRotate as d3Rotate,
  executeGlow as d3Glow
} from './animation-libraries/d3-atoms'

import {
  executeFadeIn as rfFadeIn,
  executeFadeOut as rfFadeOut,
  executeHighlight as rfHighlight,
  executeMove as rfMove,
  executeScale as rfScale,
  executeRotate as rfRotate,
  executeGlow as rfGlow
} from './animation-libraries/reactflow-atoms'

import {
  executeFadeIn as threeFadeIn,
  executeFadeOut as threeFadeOut,
  executeHighlight as threeHighlight,
  executeMove as threeMove,
  executeScale as threeScale,
  executeRotate as threeRotate,
  executeGlow as threeGlow
} from './animation-libraries/three-atoms'

export interface AnimationLibrary {
  name: 'd3' | 'reactflow' | 'three'
  container: any
  elements: Map<string, any>
}

export interface GeneratedAnimation {
  id: string
  algorithm: string
  library: string
  frames: AnimationFrame[]
  atoms: any[]
  duration: number
  metadata: {
    algorithmType: string
    dataStructure: string
    complexity: {
      time: string
      space: string
    }
  }
}

export interface AnimationFrame {
  step: number
  title: string
  description: string
  data: any
  highlights: AnimationHighlight[]
  transitions: AnimationTransition[]
  atoms: any[]
}

export interface AnimationHighlight {
  type: 'node' | 'edge' | 'value' | 'range'
  target: string | number[]
  style: 'active' | 'success' | 'error' | 'warning' | 'neutral'
  duration?: number
}

export interface AnimationTransition {
  from: { x: number; y: number; z?: number }
  to: { x: number; y: number; z?: number }
  duration: number
  easing: string
  element: string
}

// ============================================================================
// 🎭 MAIN ANIMATION GENERATOR
// ============================================================================

export class AlgorithmAnimationGenerator {

  static async generateAnimations(
    algorithmData: any,
    libraries: AnimationLibrary[]
  ): Promise<GeneratedAnimation[]> {
    const animations: GeneratedAnimation[] = []
    const algorithmType = this.detectAlgorithmType(algorithmData)

    console.log(`🎭 Generating animations for: ${algorithmData.title} (${algorithmType})`)

    for (const library of libraries) {
      try {
        const animation = await this.generateForLibrary(algorithmData, library, algorithmType)
        if (animation) {
          animations.push(animation)
          console.log(`✅ Generated ${library.name} animation with ${animation.frames.length} frames`)
        }
      } catch (error) {
        console.error(`❌ Failed to generate ${library.name} animation:`, error)
      }
    }

    return animations
  }

  private static detectAlgorithmType(algorithmData: any): string {
    const { category, animation, id } = algorithmData

    // Direct category detection
    if (category?.toLowerCase().includes('linked list')) return 'linked-list'
    if (category?.toLowerCase().includes('array')) return 'array'
    if (category?.toLowerCase().includes('tree')) return 'tree'
    if (category?.toLowerCase().includes('graph')) return 'graph'
    if (category?.toLowerCase().includes('string')) return 'string'
    if (category?.toLowerCase().includes('dynamic programming')) return 'dp'
    if (category?.toLowerCase().includes('sorting')) return 'sorting'

    // Animation data detection
    if (animation?.interactiveData?.algorithmType) {
      const type = animation.interactiveData.algorithmType.toLowerCase()
      if (type.includes('linked') || type.includes('list')) return 'linked-list'
      if (type.includes('array') || type.includes('two sum') || type.includes('binary search')) return 'array'
      if (type.includes('tree')) return 'tree'
      if (type.includes('graph')) return 'graph'
      if (type.includes('string')) return 'string'
      if (type.includes('dp') || type.includes('knapsack')) return 'dp'
    }

    // ID-based detection
    if (id?.includes('partition') || id?.includes('linked')) return 'linked-list'
    if (id?.includes('sum') || id?.includes('search') || id?.includes('sort')) return 'array'

    return 'generic'
  }

  private static async generateForLibrary(
    algorithmData: any,
    library: AnimationLibrary,
    algorithmType: string
  ): Promise<GeneratedAnimation | null> {
    const frames = this.generateFrames(algorithmData, algorithmType)

    if (frames.length === 0) return null

    const atoms = await this.generateAtomsForFrames(frames, library)
    const totalDuration = atoms.reduce((sum, atom) => sum + (atom.duration || 0), 0)

    return {
      id: `${algorithmData.id}-${library.name}`,
      algorithm: algorithmData.id,
      library: library.name,
      frames,
      atoms,
      duration: totalDuration,
      metadata: {
        algorithmType,
        dataStructure: algorithmData.category || 'Unknown',
        complexity: {
          time: algorithmData.timeComplexity || 'O(?)',
          space: algorithmData.spaceComplexity || 'O(?)'
        }
      }
    }
  }

  private static generateFrames(algorithmData: any, algorithmType: string): AnimationFrame[] {
    const frames: AnimationFrame[] = []

    // Use animationStates if available
    if (algorithmData.animationStates && Array.isArray(algorithmData.animationStates)) {
      algorithmData.animationStates.forEach((state: any, index: number) => {
        frames.push({
          step: state.step || index + 1,
          title: state.title || `Step ${index + 1}`,
          description: state.description || '',
          data: state.data || {},
          highlights: this.generateHighlightsFromData(state.data, algorithmType),
          transitions: this.generateTransitionsFromData(state.data, algorithmType),
          atoms: this.generateAtomsForStep(state, algorithmType)
        })
      })
    } else {
      // Generate frames from algorithm data
      frames.push(...this.generateFramesFromAlgorithm(algorithmData, algorithmType))
    }

    return frames
  }

  private static generateHighlightsFromData(data: any, algorithmType: string): AnimationHighlight[] {
    const highlights: AnimationHighlight[] = []

    switch (algorithmType) {
      case 'linked-list':
        // Highlight current nodes in linked list
        if (data.currentNode) {
          highlights.push({
            type: 'node',
            target: 'current-node',
            style: 'active',
            duration: 500
          })
        }
        if (data.lessList) {
          highlights.push({
            type: 'range',
            target: 'less-list',
            style: 'success',
            duration: 300
          })
        }
        if (data.greaterList) {
          highlights.push({
            type: 'range',
            target: 'greater-list',
            style: 'warning',
            duration: 300
          })
        }
        break

      case 'array':
        // Highlight array elements
        if (data.currentIndex !== undefined) {
          highlights.push({
            type: 'node',
            target: data.currentIndex,
            style: 'active',
            duration: 400
          })
        }
        if (data.result && Array.isArray(data.result)) {
          data.result.forEach((index: number) => {
            highlights.push({
              type: 'node',
              target: index,
              style: 'success',
              duration: 600
            })
          })
        }
        break

      default:
        // Generic highlighting
        if (data.currentIndex !== undefined) {
          highlights.push({
            type: 'node',
            target: data.currentIndex,
            style: 'active',
            duration: 500
          })
        }
    }

    return highlights
  }

  private static generateTransitionsFromData(data: any, algorithmType: string): AnimationTransition[] {
    const transitions: AnimationTransition[] = []

    switch (algorithmType) {
      case 'linked-list':
        // Linked list node movements
        if (data.lessList && data.greaterList) {
          // Animate nodes moving to their respective lists
          transitions.push({
            from: { x: 0, y: 0 },
            to: { x: -200, y: 0 },
            duration: 600,
            easing: 'ease-out',
            element: 'less-nodes'
          })
          transitions.push({
            from: { x: 0, y: 0 },
            to: { x: 200, y: 0 },
            duration: 600,
            easing: 'ease-out',
            element: 'greater-nodes'
          })
        }
        break

      case 'array':
        // Array element movements
        if (data.currentIndex !== undefined) {
          transitions.push({
            from: { x: data.currentIndex * 50, y: 0 },
            to: { x: data.currentIndex * 50, y: -20 },
            duration: 300,
            easing: 'ease-out',
            element: `array-element-${data.currentIndex}`
          })
        }
        break
    }

    return transitions
  }

  private static generateAtomsForStep(step: any, algorithmType: string): any[] {
    const atoms: any[] = []

    // Basic atoms for any step
    atoms.push({
      type: 'visual',
      action: 'fadeIn',
      target: `step-${step.step}`,
      duration: 300,
      delay: 0
    })

    // Algorithm-specific atoms
    switch (algorithmType) {
      case 'linked-list':
        if (step.data?.lessList) {
          atoms.push({
            type: 'visual',
            action: 'highlight',
            target: 'less-list',
            duration: 500,
            style: 'success'
          })
        }
        if (step.data?.greaterList) {
          atoms.push({
            type: 'visual',
            action: 'highlight',
            target: 'greater-list',
            duration: 500,
            style: 'warning'
          })
        }
        break

      case 'array':
        if (step.data?.currentIndex !== undefined) {
          atoms.push({
            type: 'visual',
            action: 'highlight',
            target: `array-${step.data.currentIndex}`,
            duration: 400,
            style: 'active'
          })
        }
        break
    }

    return atoms
  }

  private static generateFramesFromAlgorithm(algorithmData: any, algorithmType: string): AnimationFrame[] {
    const frames: AnimationFrame[] = []

    // Generate basic initialization frame
    frames.push({
      step: 1,
      title: 'Initialization',
      description: 'Setting up the algorithm',
      data: { status: 'initialized' },
      highlights: [],
      transitions: [],
      atoms: [{
        type: 'visual',
        action: 'fadeIn',
        target: 'algorithm-setup',
        duration: 300
      }]
    })

    // Generate algorithm-specific frames
    switch (algorithmType) {
      case 'linked-list':
        frames.push(
          {
            step: 2,
            title: 'Create Dummy Nodes',
            description: 'Initialize lessHead and greaterHead pointers',
            data: { lessHead: null, greaterHead: null },
            highlights: [
              { type: 'node', target: 'lessHead', style: 'neutral', duration: 300 },
              { type: 'node', target: 'greaterHead', style: 'neutral', duration: 300 }
            ],
            transitions: [],
            atoms: [
              { type: 'visual', action: 'fadeIn', target: 'lessHead', duration: 300 },
              { type: 'visual', action: 'fadeIn', target: 'greaterHead', duration: 300 }
            ]
          },
          {
            step: 3,
            title: 'Process Nodes',
            description: 'Traverse through each node and partition',
            data: { processing: true },
            highlights: [{ type: 'node', target: 'current', style: 'active', duration: 400 }],
            transitions: [
              { from: { x: 0, y: 0 }, to: { x: 0, y: 50 }, duration: 500, easing: 'ease-out', element: 'current' }
            ],
            atoms: [
              { type: 'visual', action: 'move', target: 'current', duration: 500, from: { x: 0, y: 0 }, to: { x: 0, y: 50 } }
            ]
          }
        )
        break

      case 'array':
        frames.push(
          {
            step: 2,
            title: 'Initialize Variables',
            description: 'Set up array and pointers',
            data: { currentIndex: 0 },
            highlights: [{ type: 'node', target: 0, style: 'active', duration: 300 }],
            transitions: [],
            atoms: [
              { type: 'visual', action: 'highlight', target: 'array-0', duration: 300, style: 'active' }
            ]
          }
        )
        break
    }

    // Generate completion frame
    frames.push({
      step: frames.length + 1,
      title: 'Complete',
      description: 'Algorithm execution finished',
      data: { completed: true },
      highlights: [{ type: 'node', target: 'result', style: 'success', duration: 600 }],
      transitions: [],
      atoms: [
        { type: 'visual', action: 'glow', target: 'result', duration: 600, intensity: 0.8 }
      ]
    })

    return frames
  }

  private static async generateAtomsForFrames(
    frames: AnimationFrame[],
    library: AnimationLibrary
  ): Promise<any[]> {
    const atoms: any[] = []

    for (const frame of frames) {
      // Convert frame atoms to library-specific atoms
      for (const atom of frame.atoms) {
        const libraryAtom = await this.convertToLibraryAtom(atom, library)
        if (libraryAtom) {
          atoms.push(libraryAtom)
        }
      }
    }

    return atoms
  }

  private static async convertToLibraryAtom(
    atom: any,
    library: AnimationLibrary
  ): Promise<any | null> {
    const context: AnimationContext = {
      library: library.name as any,
      container: library.container,
      elements: library.elements
    }

    try {
      switch (atom.action) {
        case 'fadeIn':
          return await this.executeFadeIn(context, atom.target, atom.duration || 500, atom.easing || 'ease-out')

        case 'fadeOut':
          return await this.executeFadeOut(context, atom.target, atom.duration || 500, atom.easing || 'ease-out')

        case 'highlight':
          return await this.executeHighlight(context, atom.target, atom.style || 'active', atom.duration || 500)

        case 'move':
          return await this.executeMove(context, atom.target, atom.from || { x: 0, y: 0 }, atom.to || { x: 0, y: 0 }, atom.duration || 500)

        case 'scale':
          return await this.executeScale(context, atom.target, atom.from || 1, atom.to || 1.2, atom.duration || 500)

        case 'glow':
          return await this.executeGlow(context, atom.target, atom.intensity || 0.5, atom.duration || 500)

        default:
          console.warn(`Unknown atom action: ${atom.action}`)
          return null
      }
    } catch (error) {
      console.error(`Failed to execute atom ${atom.action}:`, error)
      return null
    }
  }

  // ============================================================================
  // 🎭 LIBRARY-SPECIFIC EXECUTION METHODS
  // ============================================================================

  private static async executeFadeIn(
    context: AnimationContext,
    target: string,
    duration: number,
    easing: string
  ): Promise<AnimationResult> {
    switch (context.library) {
      case 'd3':
        return await d3FadeIn(context, target, duration, easing)
      case 'reactflow':
        return await rfFadeIn(context, target, duration, easing)
      case 'three':
        return await threeFadeIn(context, target, duration, easing)
      default:
        return { success: false, data: { error: 'Unsupported library' }, duration: 0, library: context.library, timestamp: Date.now() }
    }
  }

  private static async executeFadeOut(
    context: AnimationContext,
    target: string,
    duration: number,
    easing: string
  ): Promise<AnimationResult> {
    switch (context.library) {
      case 'd3':
        return await d3FadeOut(context, target, duration, easing)
      case 'reactflow':
        return await rfFadeOut(context, target, duration, easing)
      case 'three':
        return await threeFadeOut(context, target, duration, easing)
      default:
        return { success: false, data: { error: 'Unsupported library' }, duration: 0, library: context.library, timestamp: Date.now() }
    }
  }

  private static async executeHighlight(
    context: AnimationContext,
    target: string,
    style: string,
    duration: number
  ): Promise<AnimationResult> {
    switch (context.library) {
      case 'd3':
        return await d3Highlight(context, target, style, duration)
      case 'reactflow':
        return await rfHighlight(context, target, style, duration)
      case 'three':
        return await threeHighlight(context, target, style, duration)
      default:
        return { success: false, data: { error: 'Unsupported library' }, duration: 0, library: context.library, timestamp: Date.now() }
    }
  }

  private static async executeMove(
    context: AnimationContext,
    target: string,
    from: any,
    to: any,
    duration: number
  ): Promise<AnimationResult> {
    switch (context.library) {
      case 'd3':
        return await d3Move(context, target, from, to, duration, 'ease-out')
      case 'reactflow':
        return await rfMove(context, target, from, to, duration, 'ease-out')
      case 'three':
        return await threeMove(context, target, from, to, duration, 'ease-out')
      default:
        return { success: false, data: { error: 'Unsupported library' }, duration: 0, library: context.library, timestamp: Date.now() }
    }
  }

  private static async executeScale(
    context: AnimationContext,
    target: string,
    from: number,
    to: number,
    duration: number
  ): Promise<AnimationResult> {
    switch (context.library) {
      case 'd3':
        return await d3Scale(context, target, from, to, duration, 'ease-out')
      case 'reactflow':
        return await rfScale(context, target, from, to, duration, 'ease-out')
      case 'three':
        return await threeScale(context, target, from, to, duration, 'ease-out')
      default:
        return { success: false, data: { error: 'Unsupported library' }, duration: 0, library: context.library, timestamp: Date.now() }
    }
  }

  private static async executeGlow(
    context: AnimationContext,
    target: string,
    intensity: number,
    duration: number
  ): Promise<AnimationResult> {
    switch (context.library) {
      case 'd3':
        return await d3Glow(context, target, intensity, duration)
      case 'reactflow':
        return await rfGlow(context, target, intensity, duration)
      case 'three':
        return await threeGlow(context, target, intensity, duration)
      default:
        return { success: false, data: { error: 'Unsupported library' }, duration: 0, library: context.library, timestamp: Date.now() }
    }
  }
}

// ============================================================================
// 🎯 UTILITY FUNCTIONS
// ============================================================================

export function createAnimationLibraries(
  d3Container: any,
  reactFlowContainer: any,
  threeContainer: any
): AnimationLibrary[] {
  return [
    {
      name: 'd3',
      container: d3Container,
      elements: new Map()
    },
    {
      name: 'reactflow',
      container: reactFlowContainer,
      elements: new Map()
    },
    {
      name: 'three',
      container: threeContainer,
      elements: new Map()
    }
  ]
}

export function validateAlgorithmData(algorithmData: any): boolean {
  return !!(
    algorithmData &&
    algorithmData.id &&
    algorithmData.title &&
    (algorithmData.animationStates || algorithmData.animation)
  )
}

export function enhanceAlgorithmData(algorithmData: any): any {
  // Add missing animation data if needed
  if (!algorithmData.animationStates) {
    algorithmData.animationStates = generateDefaultAnimationStates(algorithmData)
  }

  if (!algorithmData.animation) {
    algorithmData.animation = {
      interactiveData: {
        algorithmType: algorithmData.category?.toLowerCase() || 'generic',
        dataStructure: algorithmData.category || 'Unknown',
        keyOperations: ['process', 'compare', 'update'],
        visualizationHints: `Visualize ${algorithmData.category || 'algorithm'} operations`
      }
    }
  }

  return algorithmData
}

function generateDefaultAnimationStates(algorithmData: any): any[] {
  return [
    {
      step: 1,
      title: 'Initialize',
      description: 'Set up algorithm variables and data structures',
      data: { status: 'initialized', step: 1 }
    },
    {
      step: 2,
      title: 'Process',
      description: 'Execute the main algorithm logic',
      data: { status: 'processing', step: 2 }
    },
    {
      step: 3,
      title: 'Complete',
      description: 'Algorithm execution finished',
      data: { status: 'completed', step: 3, result: algorithmData.solution?.javascript || 'Done' }
    }
  ]
}

// ============================================================================
// 📤 EXPORTS
// ============================================================================

export {
  AnimationLibrary,
  GeneratedAnimation,
  AnimationFrame,
  AnimationHighlight,
  AnimationTransition
}
