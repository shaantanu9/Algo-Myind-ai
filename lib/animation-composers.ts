/**
 * Animation Composers
 * Functions to combine and orchestrate multiple animation effects
 */

import {
  AnimationConfig,
  Position,
  AnimationTiming,
  ColorSystem,
  GeometryUtils
} from './animation-core'
import { VisualElement, VisualAnimation } from './visual-generators'

export interface AnimationSequence {
  id: string
  steps: AnimationStep[]
  totalDuration: number
  loop: boolean
}

export interface AnimationStep {
  id: string
  elements: string[]
  animations: VisualAnimation[]
  delay: number
  duration: number
  easing: string
  parallel: boolean
}

export interface AnimationTimeline {
  sequences: AnimationSequence[]
  currentTime: number
  isPlaying: boolean
  onComplete?: () => void
  onStepComplete?: (stepId: string) => void
}

// Animation Composer Base Class
export abstract class AnimationComposer {
  protected elements: Map<string, VisualElement> = new Map()
  protected sequences: AnimationSequence[] = []
  protected timeline: AnimationTimeline

  constructor() {
    this.timeline = {
      sequences: [],
      currentTime: 0,
      isPlaying: false
    }
  }

  abstract createSequence(id: string, config: AnimationConfig): AnimationSequence
  abstract composeSequences(sequences: AnimationSequence[]): AnimationTimeline
  abstract play(): void
  abstract pause(): void
  abstract stop(): void
  abstract seek(time: number): void

  protected addElement(element: VisualElement): void {
    this.elements.set(element.id, element)
  }

  protected getElement(id: string): VisualElement | undefined {
    return this.elements.get(id)
  }

  protected removeElement(id: string): void {
    this.elements.delete(id)
  }

  protected createBasicAnimation(
    property: string,
    from: any,
    to: any,
    duration: number,
    easing: string = 'cubic'
  ): VisualAnimation {
    return {
      property,
      from,
      to,
      duration,
      easing,
      delay: 0
    }
  }
}

// Sequence Builder for Complex Animations
export class SequenceBuilder {
  private steps: AnimationStep[] = []
  private currentDelay = 0

  static create(): SequenceBuilder {
    return new SequenceBuilder()
  }

  addStep(
    id: string,
    elements: string[],
    animations: VisualAnimation[],
    duration: number,
    easing: string = 'cubic',
    parallel: boolean = false
  ): SequenceBuilder {
    this.steps.push({
      id,
      elements,
      animations,
      delay: parallel ? 0 : this.currentDelay,
      duration,
      easing,
      parallel
    })

    if (!parallel) {
      this.currentDelay += duration
    }

    return this
  }

  addDelay(duration: number): SequenceBuilder {
    this.currentDelay += duration
    return this
  }

  addParallelGroup(steps: Omit<AnimationStep, 'delay' | 'parallel'>[]): SequenceBuilder {
    const maxDuration = Math.max(...steps.map(s => s.duration))

    steps.forEach(step => {
      this.steps.push({
        ...step,
        delay: 0,
        parallel: true
      })
    })

    this.currentDelay += maxDuration
    return this
  }

  build(id: string, loop: boolean = false): AnimationSequence {
    const totalDuration = this.steps.reduce((max, step) => {
      return Math.max(max, step.delay + step.duration)
    }, 0)

    return {
      id,
      steps: this.steps,
      totalDuration,
      loop
    }
  }
}

// Pre-built Animation Patterns
export class AnimationPatterns {
  static fadeIn(elementIds: string[], duration: number = 500): AnimationStep {
    const animations: VisualAnimation[] = elementIds.map(id => ({
      property: 'opacity',
      from: 0,
      to: 1,
      duration,
      easing: 'cubic'
    }))

    return {
      id: 'fade-in',
      elements: elementIds,
      animations,
      delay: 0,
      duration,
      easing: 'cubic',
      parallel: true
    }
  }

  static slideIn(elementIds: string[], direction: 'left' | 'right' | 'up' | 'down', distance: number = 50, duration: number = 600): AnimationStep {
    const animations: VisualAnimation[] = elementIds.map(id => {
      let fromPosition: Position = { x: 0, y: 0 }

      switch (direction) {
        case 'left':
          fromPosition = { x: -distance, y: 0 }
          break
        case 'right':
          fromPosition = { x: distance, y: 0 }
          break
        case 'up':
          fromPosition = { x: 0, y: -distance }
          break
        case 'down':
          fromPosition = { x: 0, y: distance }
          break
      }

      return {
        property: 'position',
        from: fromPosition,
        to: { x: 0, y: 0 },
        duration,
        easing: 'cubic'
      }
    })

    return {
      id: `slide-in-${direction}`,
      elements: elementIds,
      animations,
      delay: 0,
      duration,
      easing: 'cubic',
      parallel: true
    }
  }

  static scaleIn(elementIds: string[], duration: number = 400): AnimationStep {
    const animations: VisualAnimation[] = elementIds.map(id => ({
      property: 'scale',
      from: { x: 0, y: 0, z: 0 },
      to: { x: 1, y: 1, z: 1 },
      duration,
      easing: 'elastic'
    }))

    return {
      id: 'scale-in',
      elements: elementIds,
      animations,
      delay: 0,
      duration,
      easing: 'elastic',
      parallel: true
    }
  }

  static bounceIn(elementIds: string[], duration: number = 800): AnimationStep {
    const animations: VisualAnimation[] = elementIds.map(id => ({
      property: 'position',
      from: { x: 0, y: -50 },
      to: { x: 0, y: 0 },
      duration,
      easing: 'bounce'
    }))

    return {
      id: 'bounce-in',
      elements: elementIds,
      animations,
      delay: 0,
      duration,
      easing: 'bounce',
      parallel: true
    }
  }

  static highlight(elementIds: string[], color: string, duration: number = 500): AnimationStep {
    const animations: VisualAnimation[] = elementIds.map(id => ({
      property: 'backgroundColor',
      from: '#ffffff',
      to: color,
      duration: duration / 2,
      easing: 'cubic'
    })).concat(elementIds.map(id => ({
      property: 'backgroundColor',
      from: color,
      to: '#ffffff',
      duration: duration / 2,
      easing: 'cubic',
      delay: duration / 2
    })))

    return {
      id: 'highlight',
      elements: elementIds,
      animations,
      delay: 0,
      duration,
      easing: 'cubic',
      parallel: true
    }
  }

  static pulse(elementIds: string[], duration: number = 1000, repeat: boolean = true): AnimationStep {
    const animations: VisualAnimation[] = elementIds.map(id => ({
      property: 'scale',
      from: { x: 1, y: 1, z: 1 },
      to: { x: 1.1, y: 1.1, z: 1.1 },
      duration: duration / 2,
      easing: 'cubic',
      repeat,
      yoyo: true
    }))

    return {
      id: 'pulse',
      elements: elementIds,
      animations,
      delay: 0,
      duration,
      easing: 'cubic',
      parallel: true
    }
  }

  static typewriter(text: string, elementId: string, speed: number = 50): AnimationStep {
    const characters = text.split('')
    const animations: VisualAnimation[] = []

    characters.forEach((char, index) => {
      animations.push({
        property: 'text',
        from: text.substring(0, index),
        to: text.substring(0, index + 1),
        duration: speed,
        easing: 'linear',
        delay: index * speed
      })
    })

    return {
      id: 'typewriter',
      elements: [elementId],
      animations,
      delay: 0,
      duration: characters.length * speed,
      easing: 'linear',
      parallel: false
    }
  }
}

// Complex Animation Sequences
export class ComplexAnimations {
  static algorithmIntroduction(elementIds: string[]): AnimationSequence {
    return SequenceBuilder.create()
      .addStep('initial-delay', [], [], 200)
      .addParallelGroup([
        AnimationPatterns.fadeIn([elementIds[0]], 300),
        AnimationPatterns.scaleIn([elementIds[0]], 500)
      ])
      .addDelay(100)
      .addParallelGroup(
        elementIds.slice(1).map(id => AnimationPatterns.slideIn([id], 'up', 30, 400))
      )
      .addDelay(200)
      .addStep('highlight-main', [elementIds[0]], [AnimationPatterns.highlight([elementIds[0]], '#3b82f6', 600).animations[0]], 600)
      .build('algorithm-intro', false)
  }

  static successCelebration(elementIds: string[]): AnimationSequence {
    return SequenceBuilder.create()
      .addParallelGroup([
        AnimationPatterns.bounceIn([elementIds[0]], 800),
        AnimationPatterns.pulse(elementIds.slice(1), 1000, false)
      ])
      .addDelay(200)
      .addStep('confetti', elementIds, [{
        property: 'particles',
        from: 0,
        to: 50,
        duration: 1000,
        easing: 'cubic'
      }], 1000)
      .addDelay(500)
      .addStep('final-highlight', elementIds, AnimationPatterns.highlight(elementIds, '#22c55e', 800).animations, 800)
      .build('success-celebration', false)
  }

  static dataProcessingFlow(elementIds: string[]): AnimationSequence {
    return SequenceBuilder.create()
      .addStep('data-input', [elementIds[0]], AnimationPatterns.slideIn([elementIds[0]], 'left', 100, 500).animations, 500)
      .addDelay(200)
      .addStep('processing', [elementIds[1]], AnimationPatterns.pulse([elementIds[1]], 800, false).animations, 800)
      .addDelay(100)
      .addStep('memory-update', [elementIds[2]], AnimationPatterns.fadeIn([elementIds[2]], 400).animations, 400)
      .addDelay(150)
      .addStep('result-output', [elementIds[3]], AnimationPatterns.slideIn([elementIds[3]], 'right', 100, 600).animations, 600)
      .build('data-processing', false)
  }

  static algorithmComparison(oldElements: string[], newElements: string[]): AnimationSequence {
    return SequenceBuilder.create()
      .addParallelGroup([
        {
          id: 'fade-out-old',
          elements: oldElements,
          animations: oldElements.map(id => ({
            property: 'opacity',
            from: 1,
            to: 0,
            duration: 300,
            easing: 'cubic'
          })),
          duration: 300,
          easing: 'cubic'
        },
        {
          id: 'slide-in-new',
          elements: newElements,
          animations: newElements.map(id => ({
            property: 'position',
            from: { x: 50, y: 0 },
            to: { x: 0, y: 0 },
            duration: 400,
            easing: 'cubic'
          })),
          duration: 400,
          easing: 'cubic'
        }
      ])
      .addDelay(100)
      .addStep('highlight-improvement', newElements, AnimationPatterns.highlight(newElements, '#22c55e', 500).animations, 500)
      .build('algorithm-comparison', false)
  }
}

// Timeline Manager for Coordinating Multiple Sequences
export class TimelineManager {
  private timelines: Map<string, AnimationTimeline> = new Map()
  private activeSequences: Set<string> = new Set()
  private globalTime = 0

  createTimeline(id: string, sequences: AnimationSequence[]): AnimationTimeline {
    const timeline: AnimationTimeline = {
      sequences,
      currentTime: 0,
      isPlaying: false,
      onComplete: () => this.onTimelineComplete(id),
      onStepComplete: (stepId) => this.onStepComplete(id, stepId)
    }

    this.timelines.set(id, timeline)
    return timeline
  }

  playTimeline(id: string): void {
    const timeline = this.timelines.get(id)
    if (timeline) {
      timeline.isPlaying = true
      this.activeSequences.add(id)
      this.animate()
    }
  }

  pauseTimeline(id: string): void {
    const timeline = this.timelines.get(id)
    if (timeline) {
      timeline.isPlaying = false
      this.activeSequences.delete(id)
    }
  }

  private animate = (): void => {
    if (this.activeSequences.size === 0) return

    this.globalTime += 16 // ~60fps

    this.activeSequences.forEach(sequenceId => {
      const timeline = this.timelines.get(sequenceId)
      if (!timeline) return

      timeline.currentTime = this.globalTime

      // Check for completed sequences
      const completedSequences = timeline.sequences.filter(seq =>
        timeline.currentTime >= seq.totalDuration
      )

      completedSequences.forEach(seq => {
        if (timeline.onStepComplete) {
          timeline.onStepComplete(seq.id)
        }
      })

      // Check if entire timeline is complete
      if (timeline.sequences.every(seq => timeline.currentTime >= seq.totalDuration)) {
        timeline.isPlaying = false
        this.activeSequences.delete(sequenceId)
        if (timeline.onComplete) {
          timeline.onComplete()
        }
      }
    })

    requestAnimationFrame(this.animate)
  }

  private onTimelineComplete(timelineId: string): void {
    console.log(`Timeline ${timelineId} completed`)
  }

  private onStepComplete(timelineId: string, stepId: string): void {
    console.log(`Timeline ${timelineId}, Step ${stepId} completed`)
  }
}

// Export singleton instance
export const timelineManager = new TimelineManager()
