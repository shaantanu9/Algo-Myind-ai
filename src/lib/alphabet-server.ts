/**
 * 🎭 ALPHABET SERVER - Advanced Text Animation System
 *
 * A sophisticated text animation system that serves as the foundation for complex
 * animations across all visualization libraries (Mermaid, React Flow, Three.js, D3).
 *
 * Features:
 * - Character-by-character animations with advanced timing
 * - Word-based animations with morphing effects
 * - Staggered animations with customizable patterns
 * - 3D text transformations and particle effects
 * - Typography animations with advanced easing
 * - Multi-library coordination and synchronization
 * - Performance-optimized animation sequences
 * - Reusable animation presets and templates
 */

import { AnimationAtom, AnimationResult } from './animation-atoms'
import { AnimationVocabulary } from './animation-words'

// ============================================================================
// 📝 TEXT ANIMATION INTERFACES
// ============================================================================

export interface TextAnimationConfig {
  text: string
  duration?: number
  delay?: number
  stagger?: number
  easing?: string
  direction?: 'forward' | 'backward' | 'random' | 'center-out'
  loop?: boolean
  repeat?: number
  morph?: boolean
  particleEffect?: boolean
  glowEffect?: boolean
  waveEffect?: boolean
  typeWriterEffect?: boolean
  threeDEffect?: boolean
  colorGradient?: string[]
  fontSize?: number
  fontWeight?: string | number
  letterSpacing?: number
  transform?: {
    scale?: number
    rotateX?: number
    rotateY?: number
    rotateZ?: number
    translateX?: number
    translateY?: number
    translateZ?: number
  }
}

export interface TextElement {
  id: string
  character: string
  index: number
  position: { x: number; y: number; z?: number }
  style: any
  isVisible: boolean
  animationState: 'idle' | 'animating' | 'completed'
}

export interface ComplexTextAnimation {
  id: string
  elements: TextElement[]
  config: TextAnimationConfig
  timeline: AnimationAtom[]
  currentFrame: number
  isPlaying: boolean
  onComplete?: () => void
  onProgress?: (progress: number) => void
}

// ============================================================================
// 🎭 ALPHABET SERVER CLASS
// ============================================================================

export class AlphabetServer {
  private static instance: AlphabetServer
  private activeAnimations: Map<string, ComplexTextAnimation> = new Map()
  private animationPresets: Map<string, TextAnimationConfig> = new Map()
  private performanceMetrics: Map<string, any> = new Map()

  static getInstance(): AlphabetServer {
    if (!AlphabetServer.instance) {
      AlphabetServer.instance = new AlphabetServer()
    }
    return AlphabetServer.instance
  }

  // ============================================================================
  // 🎯 TEXT PARSING AND ELEMENT CREATION
  // ============================================================================

  /**
   * Parse text into individual elements with advanced positioning and styling
   */
  parseText(text: string, config: TextAnimationConfig): TextElement[] {
    const elements: TextElement[] = []
    const words = text.split(' ')
    let currentX = 0
    let currentY = 0
    let elementIndex = 0

    for (let wordIndex = 0; wordIndex < words.length; wordIndex++) {
      const word = words[wordIndex]
      const characters = word.split('')

      // Handle word spacing
      if (wordIndex > 0) {
        currentX += config.letterSpacing || 10
      }

      for (let charIndex = 0; charIndex < characters.length; charIndex++) {
        const character = characters[charIndex]
        const element: TextElement = {
          id: `text-element-${elementIndex}`,
          character,
          index: elementIndex,
          position: {
            x: currentX,
            y: currentY,
            z: config.transform?.translateZ || 0
          },
          style: {
            fontSize: config.fontSize || 16,
            fontWeight: config.fontWeight || 'normal',
            color: config.colorGradient?.[elementIndex % (config.colorGradient.length || 1)] || '#000000',
            opacity: 0,
            transform: this.buildTransformString(config.transform),
            textShadow: config.glowEffect ? '0 0 10px rgba(255,255,255,0.8)' : 'none'
          },
          isVisible: false,
          animationState: 'idle'
        }

        elements.push(element)
        currentX += (config.fontSize || 16) * 0.6 + (config.letterSpacing || 2)
        elementIndex++
      }

      // Handle line wrapping (simplified)
      if (currentX > 400 && wordIndex < words.length - 1) {
        currentX = 0
        currentY += (config.fontSize || 16) * 1.2
      }
    }

    return elements
  }

  /**
   * Build CSS transform string from transform config
   */
  private buildTransformString(transform?: TextAnimationConfig['transform']): string {
    if (!transform) return 'none'

    const transforms: string[] = []

    if (transform.scale && transform.scale !== 1) {
      transforms.push(`scale(${transform.scale})`)
    }
    if (transform.rotateX) {
      transforms.push(`rotateX(${transform.rotateX}deg)`)
    }
    if (transform.rotateY) {
      transforms.push(`rotateY(${transform.rotateY}deg)`)
    }
    if (transform.rotateZ) {
      transforms.push(`rotateZ(${transform.rotateZ}deg)`)
    }
    if (transform.translateX || transform.translateY || transform.translateZ) {
      transforms.push(`translate3d(${transform.translateX || 0}px, ${transform.translateY || 0}px, ${transform.translateZ || 0}px)`)
    }

    return transforms.length > 0 ? transforms.join(' ') : 'none'
  }

  // ============================================================================
  // 🎬 ANIMATION CREATION METHODS
  // ============================================================================

  /**
   * Create character-by-character animation with advanced effects
   */
  createCharacterAnimation(config: TextAnimationConfig): ComplexTextAnimation {
    const elements = this.parseText(config.text, config)
    const animationId = `char-anim-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    const timeline: AnimationAtom[] = []
    const staggerDelay = config.stagger || 100

    // Calculate animation order based on direction
    const elementOrder = this.calculateAnimationOrder(elements, config.direction || 'forward')

    elementOrder.forEach((elementIndex, orderIndex) => {
      const element = elements[elementIndex]
      const delay = (config.delay || 0) + (orderIndex * staggerDelay)

      // Fade in animation
      timeline.push({
        id: `fade-in-${element.id}`,
        type: 'visual',
        target: element.id,
        properties: { opacity: [0, 1] },
        duration: config.duration || 500,
        delay,
        easing: config.easing || 'easeOutCubic',
        execute: async (params: any) => {
          element.isVisible = true
          element.animationState = 'animating'
          return { success: true, data: { element, action: 'fadeIn' }, duration: config.duration || 500 }
        }
      })

      // Scale animation if enabled
      if (config.transform?.scale && config.transform.scale !== 1) {
        timeline.push({
          id: `scale-${element.id}`,
          type: 'visual',
          target: element.id,
          properties: { scale: [0.5, config.transform.scale] },
          duration: (config.duration || 500) * 0.8,
          delay: delay + 50,
          easing: 'easeOutBack',
          execute: async (params: any) => {
            return { success: true, data: { element, action: 'scale' }, duration: (config.duration || 500) * 0.8 }
          }
        })
      }

      // Wave effect if enabled
      if (config.waveEffect) {
        timeline.push({
          id: `wave-${element.id}`,
          type: 'visual',
          target: element.id,
          properties: {
            translateY: [0, -10, 0],
            rotateZ: [0, 5, -5, 0]
          },
          duration: (config.duration || 500) * 1.5,
          delay: delay + 200,
          easing: 'easeInOutSine',
          execute: async (params: any) => {
            return { success: true, data: { element, action: 'wave' }, duration: (config.duration || 500) * 1.5 }
          }
        })
      }

      // Typing effect if enabled
      if (config.typeWriterEffect) {
        timeline.push({
          id: `type-${element.id}`,
          type: 'visual',
          target: element.id,
          properties: { opacity: [0, 1] },
          duration: 50,
          delay,
          easing: 'steps(1)',
          execute: async (params: any) => {
            element.animationState = 'completed'
            return { success: true, data: { element, action: 'type' }, duration: 50 }
          }
        })
      }
    })

    const animation: ComplexTextAnimation = {
      id: animationId,
      elements,
      config,
      timeline,
      currentFrame: 0,
      isPlaying: false
    }

    this.activeAnimations.set(animationId, animation)
    return animation
  }

  /**
   * Create word-based animation with morphing effects
   */
  createWordAnimation(config: TextAnimationConfig): ComplexTextAnimation {
    const elements = this.parseText(config.text, config)
    const animationId = `word-anim-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    // Group elements by words
    const words: TextElement[][] = []
    let currentWord: TextElement[] = []

    elements.forEach((element, index) => {
      if (element.character === ' ' || index === elements.length - 1) {
        if (currentWord.length > 0) {
          words.push([...currentWord])
          currentWord = []
        }
      } else {
        currentWord.push(element)
      }
    })

    if (currentWord.length > 0) {
      words.push(currentWord)
    }

    const timeline: AnimationAtom[] = []
    const wordDelay = config.stagger || 300

    words.forEach((wordElements, wordIndex) => {
      const delay = (config.delay || 0) + (wordIndex * wordDelay)

      // Animate all characters in word simultaneously or with micro-stagger
      wordElements.forEach((element, charIndex) => {
        const charDelay = delay + (charIndex * 20)

        timeline.push({
          id: `word-char-${element.id}`,
          type: 'visual',
          target: element.id,
          properties: { opacity: [0, 1] },
          duration: config.duration || 400,
          delay: charDelay,
          easing: config.easing || 'easeOutQuad',
          execute: async (params: any) => {
            element.isVisible = true
            element.animationState = 'animating'
            return { success: true, data: { element, wordIndex, action: 'wordFade' }, duration: config.duration || 400 }
          }
        })

        // Morphing effect for words
        if (config.morph) {
          timeline.push({
            id: `morph-${element.id}`,
            type: 'visual',
            target: element.id,
            properties: {
              scale: [0.8, 1.2, 1],
              rotateZ: [0, 10, -10, 0]
            },
            duration: (config.duration || 400) * 1.5,
            delay: charDelay + 100,
            easing: 'easeInOutBack',
            execute: async (params: any) => {
              element.animationState = 'completed'
              return { success: true, data: { element, action: 'morph' }, duration: (config.duration || 400) * 1.5 }
            }
          })
        }
      })
    })

    const animation: ComplexTextAnimation = {
      id: animationId,
      elements,
      config,
      timeline,
      currentFrame: 0,
      isPlaying: false
    }

    this.activeAnimations.set(animationId, animation)
    return animation
  }

  /**
   * Create 3D text animation with particle effects
   */
  create3DTextAnimation(config: TextAnimationConfig): ComplexTextAnimation {
    const elements = this.parseText(config.text, config)
    const animationId = `3d-text-anim-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    const timeline: AnimationAtom[] = []
    const staggerDelay = config.stagger || 150

    elements.forEach((element, index) => {
      const delay = (config.delay || 0) + (index * staggerDelay)

      // 3D entrance animation
      timeline.push({
        id: `3d-enter-${element.id}`,
        type: 'spatial',
        target: element.id,
        properties: {
          translateZ: [-100, 0],
          rotateX: [-90, 0],
          rotateY: [90, 0],
          scale: [0.1, 1]
        },
        duration: config.duration || 800,
        delay,
        easing: 'easeOutBack',
        execute: async (params: any) => {
          element.isVisible = true
          element.position.z = 0
          element.animationState = 'animating'
          return { success: true, data: { element, action: '3dEnter' }, duration: config.duration || 800 }
        }
      })

      // Particle effect if enabled
      if (config.particleEffect) {
        timeline.push({
          id: `particles-${element.id}`,
          type: 'visual',
          target: element.id,
          properties: {
            opacity: [0.5, 1, 0.8],
            scale: [1, 1.5, 1.2]
          },
          duration: (config.duration || 800) * 0.6,
          delay: delay + 200,
          easing: 'easeInOutSine',
          execute: async (params: any) => {
            return { success: true, data: { element, action: 'particles' }, duration: (config.duration || 800) * 0.6 }
          }
        })
      }

      // 3D hover/float animation
      if (config.threeDEffect) {
        timeline.push({
          id: `3d-float-${element.id}`,
          type: 'spatial',
          target: element.id,
          properties: {
            translateY: [0, -5, 0],
            rotateX: [0, 5, 0],
            rotateY: [0, -5, 0]
          },
          duration: (config.duration || 800) * 2,
          delay: delay + 500,
          easing: 'easeInOutSine',
          execute: async (params: any) => {
            element.animationState = 'completed'
            return { success: true, data: { element, action: '3dFloat' }, duration: (config.duration || 800) * 2 }
          }
        })
      }
    })

    const animation: ComplexTextAnimation = {
      id: animationId,
      elements,
      config,
      timeline,
      currentFrame: 0,
      isPlaying: false
    }

    this.activeAnimations.set(animationId, animation)
    return animation
  }

  /**
   * Calculate animation order based on direction
   */
  private calculateAnimationOrder(elements: TextElement[], direction: string): number[] {
    const order: number[] = []

    switch (direction) {
      case 'backward':
        for (let i = elements.length - 1; i >= 0; i--) {
          order.push(i)
        }
        break
      case 'random':
        const indices = Array.from({ length: elements.length }, (_, i) => i)
        for (let i = indices.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1))
          ;[indices[i], indices[j]] = [indices[j], indices[i]]
        }
        order.push(...indices)
        break
      case 'center-out':
        const center = Math.floor(elements.length / 2)
        order.push(center)
        let left = center - 1
        let right = center + 1
        while (left >= 0 || right < elements.length) {
          if (left >= 0) order.push(left--)
          if (right < elements.length) order.push(right++)
        }
        break
      case 'forward':
      default:
        for (let i = 0; i < elements.length; i++) {
          order.push(i)
        }
        break
    }

    return order
  }

  // ============================================================================
  // 🎭 ANIMATION PRESETS
  // ============================================================================

  /**
   * Create and store animation presets
   */
  createPreset(name: string, config: TextAnimationConfig): void {
    this.animationPresets.set(name, config)
  }

  /**
   * Get animation preset by name
   */
  getPreset(name: string): TextAnimationConfig | undefined {
    return this.animationPresets.get(name)
  }

  /**
   * Initialize default presets
   */
  initializeDefaultPresets(): void {
    // Typing effect preset
    this.createPreset('typing', {
      duration: 50,
      stagger: 80,
      typeWriterEffect: true,
      easing: 'steps(1)'
    })

    // Wave effect preset
    this.createPreset('wave', {
      duration: 600,
      stagger: 100,
      waveEffect: true,
      easing: 'easeInOutSine'
    })

    // Explosion effect preset
    this.createPreset('explosion', {
      duration: 800,
      stagger: 50,
      direction: 'center-out',
      particleEffect: true,
      transform: { scale: 1.5 },
      easing: 'easeOutBack'
    })

    // 3D entrance preset
    this.createPreset('3d-entrance', {
      duration: 1000,
      stagger: 150,
      threeDEffect: true,
      transform: {
        rotateX: -90,
        rotateY: 90,
        translateZ: -100
      },
      easing: 'easeOutBack'
    })

    // Morphing text preset
    this.createPreset('morph', {
      duration: 700,
      stagger: 200,
      morph: true,
      direction: 'random',
      easing: 'easeInOutBack'
    })

    // Elegant fade preset
    this.createPreset('elegant', {
      duration: 1000,
      stagger: 100,
      glowEffect: true,
      colorGradient: ['#667eea', '#764ba2', '#f093fb', '#f5576c'],
      easing: 'easeOutCubic'
    })
  }

  // ============================================================================
  // 🎬 ANIMATION EXECUTION
  // ============================================================================

  /**
   * Execute animation with coordination across multiple libraries
   */
  async executeAnimation(animationId: string, libraries: string[] = ['mermaid', 'reactflow', 'd3', 'three']): Promise<AnimationResult> {
    const animation = this.activeAnimations.get(animationId)
    if (!animation) {
      return { success: false, data: [], duration: 0 }
    }

    animation.isPlaying = true
    const results: any[] = []
    const startTime = Date.now()

    try {
      // Execute timeline atoms
      for (const atom of animation.timeline) {
        const result = await atom.execute({ libraries, animation })
        results.push(result)

        // Update progress
        const progress = (results.length / animation.timeline.length) * 100
        animation.onProgress?.(progress)
      }

      animation.isPlaying = false
      animation.onComplete?.()

      const duration = Date.now() - startTime
      return {
        success: true,
        data: results,
        duration
      }
    } catch (error) {
      animation.isPlaying = false
      return {
        success: false,
        data: [{ error: error.message }],
        duration: Date.now() - startTime
      }
    }
  }

  /**
   * Stop animation
   */
  stopAnimation(animationId: string): void {
    const animation = this.activeAnimations.get(animationId)
    if (animation) {
      animation.isPlaying = false
    }
  }

  /**
   * Get animation by ID
   */
  getAnimation(animationId: string): ComplexTextAnimation | undefined {
    return this.activeAnimations.get(animationId)
  }

  /**
   * Get all active animations
   */
  getActiveAnimations(): ComplexTextAnimation[] {
    return Array.from(this.activeAnimations.values())
  }

  // ============================================================================
  // 📊 PERFORMANCE MONITORING
  // ============================================================================

  /**
   * Track performance metrics
   */
  trackPerformance(animationId: string, metrics: any): void {
    this.performanceMetrics.set(animationId, {
      ...metrics,
      timestamp: Date.now()
    })
  }

  /**
   * Get performance metrics
   */
  getPerformanceMetrics(animationId: string): any {
    return this.performanceMetrics.get(animationId)
  }
}

// ============================================================================
// 🎭 EXPORT UTILITIES
// ============================================================================

export const alphabetServer = AlphabetServer.getInstance()

// Quick animation creators
export const createTypingAnimation = (text: string, config?: Partial<TextAnimationConfig>) =>
  alphabetServer.createCharacterAnimation({
    text,
    typeWriterEffect: true,
    ...config
  })

export const createWaveAnimation = (text: string, config?: Partial<TextAnimationConfig>) =>
  alphabetServer.createCharacterAnimation({
    text,
    waveEffect: true,
    ...config
  })

export const create3DAnimation = (text: string, config?: Partial<TextAnimationConfig>) =>
  alphabetServer.create3DTextAnimation({
    text,
    threeDEffect: true,
    ...config
  })

export const createWordAnimation = (text: string, config?: Partial<TextAnimationConfig>) =>
  alphabetServer.createWordAnimation({
    text,
    morph: true,
    ...config
  })

// Preset-based quick animations
export const typing = (text: string) => createTypingAnimation(text)
export const wave = (text: string) => createWaveAnimation(text)
export const explode = (text: string) => alphabetServer.createCharacterAnimation({
  text,
  direction: 'center-out',
  particleEffect: true,
  duration: 800
})
export const morph = (text: string) => createWordAnimation(text)
export const elegant = (text: string) => alphabetServer.createCharacterAnimation({
  text,
  glowEffect: true,
  colorGradient: ['#667eea', '#764ba2'],
  duration: 1000
})
