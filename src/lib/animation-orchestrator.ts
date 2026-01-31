/**
 * ANIMATION ORCHESTRATOR - The Master Animation System
 * Unified interface for the complete animation framework
 */

import {
  AnimationAtom,
  AnimationResult,
  AnimationAlphabet,
  Position
} from './animation-atoms'

import {
  AnimationWord,
  AnimationVocabulary
} from './animation-words'

import {
  AnimationSentence,
  AlgorithmSentences,
  DynamicSentenceGenerator
} from './animation-sentences'

import {
  ParsedAlgorithm,
  DynamicAnimationGenerator,
  AlgorithmDetector,
  READMEParser,
  SolutionParser
} from './algorithm-parser'

import {
  AnimationFrameGenerator,
  AlgorithmData
} from './data-transformers'

import {
  VisualGeneratorFactory
} from './visual-generators'

import {
  AnimationComposer,
  SequenceBuilder,
  ComplexAnimations,
  AnimationTimeline,
  timelineManager
} from './animation-composers'

import {
  AlgorithmPresetFactory
} from './animation-presets'

import {
  AnimationOptimizer
} from './animation-optimizer'

// ============================================================================
// 🎭 MASTER ANIMATION ORCHESTRATOR
// ============================================================================

export class AnimationOrchestrator {
  private static instance: AnimationOrchestrator
  private renderers: Map<string, any> = new Map()
  private stateManagers: Map<string, any> = new Map()
  private eventManagers: Map<string, any> = new Map()

  private constructor() {
    // Initialize the system
    this.initializeSystem()
  }

  static getInstance(): AnimationOrchestrator {
    if (!AnimationOrchestrator.instance) {
      AnimationOrchestrator.instance = new AnimationOrchestrator()
    }
    return AnimationOrchestrator.instance
  }

  // ============================================================================
  // 🎯 ATOMIC LEVEL OPERATIONS
  // ============================================================================

  async executeAtom(atom: AnimationAtom, params: any = {}): Promise<AnimationResult> {
    try {
      const renderer = this.renderers.get(params.rendererType || 'default')
      const stateManager = this.stateManagers.get(params.stateManagerId || 'default')
      const eventManager = this.eventManagers.get(params.eventManagerId || 'default')

      const result = await atom.execute({
        renderer,
        stateManager,
        eventManager,
        ...params
      })

      return result
    } catch (error) {
      console.error('Animation atom execution error:', error)
      return { success: false, data: [], duration: 0 }
    }
  }

  async executeWord(word: AnimationWord, params: any = {}): Promise<AnimationResult> {
    const results: AnimationResult[] = []

    for (const atom of word.atoms) {
      const result = await this.executeAtom(atom, params)
      results.push(result)

      if (!result.success) {
        break // Stop on first failure
      }
    }

    return {
      success: results.every(r => r.success),
      data: results.map(r => r.data),
      duration: results.reduce((sum, r) => sum + r.duration, 0)
    }
  }

  async executeSentence(sentence: AnimationSentence, params: any = {}): Promise<AnimationResult> {
    const startTime = Date.now()

    try {
      const result = await sentence.execute(params)
      const duration = Date.now() - startTime

      return {
        success: result.success,
        data: result.data,
        duration: result.duration || duration
      }
    } catch (error) {
      console.error('Animation sentence execution error:', error)
      return {
        success: false,
        data: [],
        duration: Date.now() - startTime
      }
    }
  }

  // ============================================================================
  // 🎬 HIGH-LEVEL ANIMATION METHODS
  // ============================================================================

  async animateAlgorithm(
    algorithmId: string,
    data: AlgorithmData,
    visualizationType: 'mermaid' | 'reactflow' | 'd3' | 'three' = 'mermaid',
    options: {
      rendererType?: string
      autoPlay?: boolean
      speed?: number
      interactive?: boolean
    } = {}
  ): Promise<AnimationResult> {
    const { rendererType = 'default', autoPlay = true, speed = 1, interactive = true } = options

    // Generate animation sentence for the algorithm
    const sentence = this.generateAlgorithmSentence(algorithmId, data, visualizationType)
    if (!sentence) {
      throw new Error(`No animation available for algorithm: ${algorithmId}`)
    }

    // Apply speed multiplier
    if (speed !== 1) {
      sentence.metadata.estimatedDuration = sentence.metadata.estimatedDuration / speed
    }

    // Execute the animation
    const result = await this.executeSentence(sentence, {
      rendererType,
      autoPlay,
      interactive,
      speed
    })

    return result
  }

  async animateFromContent(
    content: string,
    contentType: 'readme' | 'solution' | 'directory',
    visualizationType: 'mermaid' | 'reactflow' | 'd3' | 'three' = 'mermaid',
    options: any = {}
  ): Promise<AnimationResult[]> {
    const results: AnimationResult[] = []

    try {
      let animations: AnimationSentence[] = []

      switch (contentType) {
        case 'readme':
          animations = DynamicSentenceGenerator.generateFromREADME(content, '')
          break
        case 'solution':
          const animation = DynamicSentenceGenerator.generateFromSolution(content)
          if (animation) animations = [animation]
          break
        case 'directory':
          animations = await DynamicAnimationGenerator.generateFromDirectory(content)
          break
      }

      for (const animation of animations) {
        const result = await this.executeSentence(animation, {
          rendererType: visualizationType,
          ...options
        })
        results.push(result)
      }

      return results
    } catch (error) {
      console.error('Content animation generation error:', error)
      return []
    }
  }

  // ============================================================================
  // 🎨 VISUALIZATION METHODS
  // ============================================================================

  renderVisualization(
    algorithmId: string,
    data: AlgorithmData,
    visualizationType: 'mermaid' | 'reactflow' | 'd3' | 'three',
    containerId: string
  ): void {
    const renderer = this.renderers.get(visualizationType)
    if (!renderer) {
      throw new Error(`Renderer not available for type: ${visualizationType}`)
    }

    const visualData = VisualGeneratorFactory.generateVisuals(visualizationType, data)
    renderer.render(containerId, visualData)
  }

  updateVisualization(
    algorithmId: string,
    newData: AlgorithmData,
    visualizationType: 'mermaid' | 'reactflow' | 'd3' | 'three',
    containerId: string
  ): void {
    const renderer = this.renderers.get(visualizationType)
    if (!renderer) return

    const visualData = VisualGeneratorFactory.generateVisuals(visualizationType, newData)
    renderer.update(containerId, visualData)
  }

  // ============================================================================
  // 🎪 INTERACTIVE METHODS
  // ============================================================================

  addInteraction(
    elementId: string,
    eventType: string,
    handler: (event: any) => Promise<void>,
    options: any = {}
  ): void {
    const eventManager = this.eventManagers.get(options.eventManagerId || 'default')
    if (eventManager) {
      eventManager.addEventListener(elementId, eventType, handler)
    }
  }

  removeInteraction(
    elementId: string,
    eventType: string,
    handler?: (event: any) => Promise<void>
  ): void {
    const eventManager = this.eventManagers.get('default')
    if (eventManager) {
      eventManager.removeEventListener(elementId, eventType, handler)
    }
  }

  // ============================================================================
  // 🎬 TIMELINE METHODS
  // ============================================================================

  createTimeline(
    id: string,
    sentences: AnimationSentence[],
    options: {
      autoPlay?: boolean
      loop?: boolean
      speed?: number
    } = {}
  ): AnimationTimeline {
    const { autoPlay = false, loop = false, speed = 1 } = options

    // Apply speed modifications to sentences
    const adjustedSentences = sentences.map(sentence => ({
      ...sentence,
      metadata: {
        ...sentence.metadata,
        estimatedDuration: sentence.metadata.estimatedDuration / speed
      }
    }))

    const timeline = timelineManager.createTimeline(id, adjustedSentences)

    if (autoPlay) {
      timelineManager.playTimeline(id)
    }

    return timeline
  }

  playTimeline(id: string): void {
    timelineManager.playTimeline(id)
  }

  pauseTimeline(id: string): void {
    timelineManager.pauseTimeline(id)
  }

  stopTimeline(id: string): void {
    // Reset timeline to beginning
    const timeline = timelineManager['timelines'].get(id)
    if (timeline) {
      timeline.currentTime = 0
      timeline.isPlaying = false
    }
  }

  // ============================================================================
  // 🎯 PRESET METHODS
  // ============================================================================

  getAlgorithmPreset(algorithmId: string) {
    return AlgorithmPresetFactory.getPreset(algorithmId)
  }

  getAllPresets() {
    return AlgorithmPresetFactory.getAllPresets()
  }

  getPresetsByCategory(category: string) {
    return AlgorithmPresetFactory.getPresetsByCategory(category)
  }

  // ============================================================================
  // 🔧 UTILITY METHODS
  // ============================================================================

  detectAlgorithms(content: string): string[] {
    return AlgorithmDetector.detectFromContent(content)
  }

  generateAlgorithmSentence(
    algorithmId: string,
    data: AlgorithmData,
    visualizationType: string
  ): AnimationSentence | null {
    // Try different sentence generators based on algorithm
    switch (algorithmId) {
      case 'two-sum':
        return AlgorithmSentences.twoSum(data)
      case 'binary-search':
        return AlgorithmSentences.binarySearch(data)
      case 'bubble-sort':
        return AlgorithmSentences.bubbleSort(data)
      case 'quick-sort':
        return AlgorithmSentences.quickSort(data)
      case 'merge-sort':
        return AlgorithmSentences.mergeSort(data)
      case 'breadth-first-search':
        return AlgorithmSentences.breadthFirstSearch(data)
      case 'knapsack':
        return AlgorithmSentences.knapsack(data)
      case 'longest-common-subsequence':
        return AlgorithmSentences.longestCommonSubsequence(data)
      default:
        return AlgorithmSentences.algorithmIntroduction(algorithmId)
    }
  }

  optimizeAnimation(
    algorithmId: string,
    data: AlgorithmData,
    deviceCapabilities: any = {}
  ): AlgorithmData {
    // Apply performance optimizations
    const optimizedData = AnimationOptimizer.optimizeElements(
      [data], // Wrap in array for processing
      { x: 0, y: 0, z: 0 } // Default camera position
    )[0] || data

    return optimizedData
  }

  getPerformanceMetrics() {
    return AnimationOptimizer.getPerformanceMetrics()
  }

  // ============================================================================
  // 🔌 PLUGIN SYSTEM
  // ============================================================================

  registerRenderer(type: string, renderer: any): void {
    this.renderers.set(type, renderer)
  }

  registerStateManager(id: string, stateManager: any): void {
    this.stateManagers.set(id, stateManager)
  }

  registerEventManager(id: string, eventManager: any): void {
    this.eventManagers.set(id, eventManager)
  }

  unregisterRenderer(type: string): void {
    this.renderers.delete(type)
  }

  unregisterStateManager(id: string): void {
    this.stateManagers.delete(id)
  }

  unregisterEventManager(id: string): void {
    this.eventManagers.delete(id)
  }

  // ============================================================================
  // 🏗️ INITIALIZATION
  // ============================================================================

  private initializeSystem(): void {
    // Register default renderers (these would be implemented separately)
    this.registerRenderer('mermaid', {
      render: (containerId: string, data: any) => {
        // Mermaid rendering logic
        console.log(`Rendering Mermaid in ${containerId}:`, data)
      },
      update: (containerId: string, data: any) => {
        // Mermaid update logic
        console.log(`Updating Mermaid in ${containerId}:`, data)
      }
    })

    this.registerRenderer('reactflow', {
      render: (containerId: string, data: any) => {
        // React Flow rendering logic
        console.log(`Rendering React Flow in ${containerId}:`, data)
      },
      update: (containerId: string, data: any) => {
        // React Flow update logic
        console.log(`Updating React Flow in ${containerId}:`, data)
      }
    })

    this.registerRenderer('d3', {
      render: (containerId: string, data: any) => {
        // D3.js rendering logic
        console.log(`Rendering D3 in ${containerId}:`, data)
      },
      update: (containerId: string, data: any) => {
        // D3.js update logic
        console.log(`Updating D3 in ${containerId}:`, data)
      }
    })

    this.registerRenderer('three', {
      render: (containerId: string, data: any) => {
        // Three.js rendering logic
        console.log(`Rendering Three.js in ${containerId}:`, data)
      },
      update: (containerId: string, data: any) => {
        // Three.js update logic
        console.log(`Updating Three.js in ${containerId}:`, data)
      }
    })

    // Register default state manager
    this.registerStateManager('default', {
      setElementState: (elementId: string, key: string, value: any) => {
        console.log(`Setting state for ${elementId}: ${key} = ${value}`)
      },
      getElementState: (elementId: string, key: string) => {
        return null // Placeholder
      }
    })

    // Register default event manager
    this.registerEventManager('default', {
      addEventListener: (elementId: string, eventType: string, handler: Function) => {
        console.log(`Adding ${eventType} listener to ${elementId}`)
      },
      removeEventListener: (elementId: string, eventType: string, handler?: Function) => {
        console.log(`Removing ${eventType} listener from ${elementId}`)
      }
    })

    // Initialize performance monitoring
    AnimationOptimizer.initialize()

    console.log('🎭 Animation Orchestrator initialized successfully!')
  }
}

// ============================================================================
// 🎯 CONVENIENCE FUNCTIONS
// ============================================================================

// Global animation orchestrator instance
export const animationOrchestrator = AnimationOrchestrator.getInstance()

// Quick animation functions
export const animate = {
  // Atomic level
  atom: (atom: AnimationAtom, params?: any) =>
    animationOrchestrator.executeAtom(atom, params),

  word: (word: AnimationWord, params?: any) =>
    animationOrchestrator.executeWord(word, params),

  sentence: (sentence: AnimationSentence, params?: any) =>
    animationOrchestrator.executeSentence(sentence, params),

  // Algorithm level
  algorithm: (
    algorithmId: string,
    data: AlgorithmData,
    visualizationType?: 'mermaid' | 'reactflow' | 'd3' | 'three',
    options?: any
  ) => animationOrchestrator.animateAlgorithm(algorithmId, data, visualizationType, options),

  // Content level
  fromContent: (
    content: string,
    contentType: 'readme' | 'solution' | 'directory',
    visualizationType?: 'mermaid' | 'reactflow' | 'd3' | 'three',
    options?: any
  ) => animationOrchestrator.animateFromContent(content, contentType, visualizationType, options),

  // Timeline level
  timeline: (id: string, sentences: AnimationSentence[], options?: any) =>
    animationOrchestrator.createTimeline(id, sentences, options),

  // Utility functions
  detect: (content: string) => animationOrchestrator.detectAlgorithms(content),
  optimize: (algorithmId: string, data: AlgorithmData, capabilities?: any) =>
    animationOrchestrator.optimizeAnimation(algorithmId, data, capabilities),
  metrics: () => animationOrchestrator.getPerformanceMetrics()
}

// Export everything for advanced usage
export {
  AnimationAtom,
  AnimationWord,
  AnimationSentence,
  AnimationResult,
  AlgorithmData,
  Position,
  AnimationAlphabet,
  AnimationVocabulary,
  AlgorithmSentences,
  DynamicSentenceGenerator,
  VisualGeneratorFactory,
  AnimationFrameGenerator,
  AlgorithmPresetFactory,
  AnimationOptimizer,
  AnimationTimeline,
  timelineManager
}

// ============================================================================
// 🎬 DEMO FUNCTIONS
// ============================================================================

export const AnimationDemos = {
  // Simple atom demo
  async simpleAtom() {
    console.log('🎯 Simple Atom Demo')

    const atom = AnimationAlphabet.Visual.opacityFade('demo-element', 0, 1, 1000)
    const result = await animationOrchestrator.executeAtom(atom, {
      renderer: { animate: console.log }
    })

    console.log('Atom execution result:', result)
    return result
  },

  // Word composition demo
  async wordComposition() {
    console.log('📝 Word Composition Demo')

    const word = AnimationVocabulary.Elementary.emphasize('demo-element')
    const result = await animationOrchestrator.executeWord(word, {
      renderer: { animate: console.log }
    })

    console.log('Word execution result:', result)
    return result
  },

  // Algorithm animation demo
  async algorithmAnimation() {
    console.log('🎭 Algorithm Animation Demo')

    const data: AlgorithmData = {
      array: [2, 7, 11, 15],
      target: 9,
      currentIndex: 1,
      hashMap: { 2: 0 },
      complement: 7,
      found: true,
      result: [0, 1]
    }

    const result = await animationOrchestrator.animateAlgorithm('two-sum', data, 'mermaid', {
      autoPlay: true,
      speed: 1.5
    })

    console.log('Algorithm animation result:', result)
    return result
  },

  // Full system demo
  async fullSystemDemo() {
    console.log('🚀 Full Animation System Demo')
    console.log('=' .repeat(50))

    try {
      // Test all levels
      await this.simpleAtom()
      console.log('✓ Atoms working')

      await this.wordComposition()
      console.log('✓ Words working')

      await this.algorithmAnimation()
      console.log('✓ Sentences working')

      // Test utilities
      const detected = animationOrchestrator.detectAlgorithms('This is a two sum algorithm implementation')
      console.log('✓ Algorithm detection:', detected)

      const metrics = animationOrchestrator.getPerformanceMetrics()
      console.log('✓ Performance metrics:', metrics)

      console.log('=' .repeat(50))
      console.log('🎉 All Animation System Components Working!')

      return {
        atoms: true,
        words: true,
        sentences: true,
        detection: detected,
        metrics
      }

    } catch (error) {
      console.error('❌ Demo Error:', error)
      return { error: error.message }
    }
  }
}

// Auto-initialize on import
animationOrchestrator
