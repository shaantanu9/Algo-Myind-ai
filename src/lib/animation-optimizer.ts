/**
 * Animation Performance Optimizer
 * Utilities for optimizing animation performance and memory usage
 */

import { PerformanceMonitor, MemoryManager } from './animation-core'
import { VisualElement } from './visual-generators'

export interface OptimizationConfig {
  maxFPS: number
  enableLOD: boolean
  lodDistance: number
  enableCulling: boolean
  cullingThreshold: number
  enablePooling: boolean
  poolSize: number
  enableCompression: boolean
  compressionThreshold: number
}

export interface PerformanceMetrics {
  fps: number
  memoryUsage: number
  renderTime: number
  frameDrops: number
  activeElements: number
  totalElements: number
}

// Object Pool for Visual Elements
export class VisualElementPool {
  private static pools = new Map<string, VisualElement[]>()
  private static maxPoolSize = 100

  static acquire(type: string): VisualElement | null {
    const pool = this.pools.get(type) || []
    if (pool.length > 0) {
      return pool.pop()!
    }
    return null
  }

  static release(element: VisualElement): void {
    const pool = this.pools.get(element.type) || []
    if (pool.length < this.maxPoolSize) {
      // Reset element to default state
      this.resetElement(element)
      pool.push(element)
    }
  }

  static preload(type: string, count: number, factory: () => VisualElement): void {
    const pool = this.pools.get(type) || []
    for (let i = 0; i < count && pool.length < this.maxPoolSize; i++) {
      pool.push(factory())
    }
    this.pools.set(type, pool)
  }

  private static resetElement(element: VisualElement): void {
    // Reset animations
    element.animations = []

    // Reset children
    if (element.children) {
      element.children.forEach(child => this.resetElement(child))
    }

    // Reset styles to defaults
    element.style = {
      fill: '#f3f4f6',
      stroke: '#d1d5db',
      strokeWidth: 2,
      opacity: 1,
      fontSize: 14,
      fontWeight: 'normal'
    }
  }

  static getStats(): Record<string, number> {
    const stats: Record<string, number> = {}
    this.pools.forEach((pool, type) => {
      stats[type] = pool.length
    })
    return stats
  }
}

// Level of Detail (LOD) Manager
export class LODManager {
  private static lodLevels = new Map<string, LODLevel[]>()

  static defineLOD(type: string, levels: LODLevel[]): void {
    this.lodLevels.set(type, levels.sort((a, b) => a.distance - b.distance))
  }

  static getLODForDistance(type: string, distance: number): LODLevel | null {
    const levels = this.lodLevels.get(type)
    if (!levels) return null

    // Find the appropriate LOD level
    for (let i = levels.length - 1; i >= 0; i--) {
      if (distance >= levels[i].distance) {
        return levels[i]
      }
    }

    return levels[0] // Default to highest detail
  }

  static getDefaultLODLevels(type: string): LODLevel[] {
    switch (type) {
      case 'node':
        return [
          { distance: 0, detail: 1.0, elements: ['shape', 'text', 'animations'] },
          { distance: 50, detail: 0.8, elements: ['shape', 'text'] },
          { distance: 100, detail: 0.5, elements: ['shape'] },
          { distance: 200, detail: 0.2, elements: ['shape'] }
        ]
      case 'edge':
        return [
          { distance: 0, detail: 1.0, elements: ['line', 'arrow', 'animations'] },
          { distance: 50, detail: 0.8, elements: ['line', 'arrow'] },
          { distance: 100, detail: 0.6, elements: ['line'] },
          { distance: 200, detail: 0.3, elements: ['line'] }
        ]
      default:
        return [
          { distance: 0, detail: 1.0, elements: ['all'] },
          { distance: 100, detail: 0.5, elements: ['basic'] }
        ]
    }
  }
}

export interface LODLevel {
  distance: number
  detail: number
  elements: string[]
}

// Frustum Culling Manager
export class CullingManager {
  private static cullDistance = 100
  private static cullAngle = Math.PI / 3

  static setCullingParameters(distance: number, angle: number): void {
    this.cullDistance = distance
    this.cullAngle = angle
  }

  static isVisible(element: VisualElement, cameraPosition: { x: number; y: number; z: number }): boolean {
    const distance = Math.sqrt(
      Math.pow(element.position.x - cameraPosition.x, 2) +
      Math.pow(element.position.y - cameraPosition.y, 2) +
      Math.pow((element.position.z || 0) - (cameraPosition.z || 0), 2)
    )

    // Distance culling
    if (distance > this.cullDistance) {
      return false
    }

    // View angle culling (simplified)
    const angle = Math.atan2(
      element.position.y - cameraPosition.y,
      element.position.x - cameraPosition.x
    )

    return Math.abs(angle) < this.cullAngle
  }

  static getVisibleElements(elements: VisualElement[], cameraPosition: { x: number; y: number; z: number }): VisualElement[] {
    return elements.filter(element => this.isVisible(element, cameraPosition))
  }
}

// Animation Compression
export class AnimationCompressor {
  static compressKeyframes(keyframes: any[]): any[] {
    if (keyframes.length < 3) return keyframes

    const compressed: any[] = [keyframes[0]] // Always keep first frame

    for (let i = 1; i < keyframes.length - 1; i++) {
      const prev = keyframes[i - 1]
      const current = keyframes[i]
      const next = keyframes[i + 1]

      // Check if current frame is a linear interpolation between prev and next
      if (!this.isLinearInterpolation(prev, current, next)) {
        compressed.push(current)
      }
    }

    compressed.push(keyframes[keyframes.length - 1]) // Always keep last frame

    return compressed
  }

  private static isLinearInterpolation(prev: any, current: any, next: any): boolean {
    // Simple linear interpolation check for numeric properties
    const properties = ['x', 'y', 'z', 'opacity', 'scale']

    for (const prop of properties) {
      if (current[prop] !== undefined) {
        const expected = (prev[prop] + next[prop]) / 2
        const tolerance = Math.abs(next[prop] - prev[prop]) * 0.1

        if (Math.abs(current[prop] - expected) > tolerance) {
          return false
        }
      }
    }

    return true
  }

  static compressAnimations(animations: any[]): any[] {
    return animations.map(animation => ({
      ...animation,
      keyframes: this.compressKeyframes(animation.keyframes || [])
    }))
  }
}

// Performance Profiler
export class AnimationProfiler {
  private static profiles = new Map<string, ProfileData>()
  private static currentProfile: string | null = null

  static startProfile(name: string): void {
    this.currentProfile = name
    this.profiles.set(name, {
      name,
      startTime: performance.now(),
      frameCount: 0,
      totalRenderTime: 0,
      peakMemoryUsage: 0,
      averageFPS: 0
    })
  }

  static endProfile(): ProfileData | null {
    if (!this.currentProfile) return null

    const profile = this.profiles.get(this.currentProfile)
    if (profile) {
      profile.endTime = performance.now()
      profile.duration = profile.endTime - profile.startTime
      profile.averageFPS = profile.frameCount / (profile.duration / 1000)
    }

    const result = profile || null
    this.currentProfile = null
    return result
  }

  static recordFrame(renderTime: number, memoryUsage: number): void {
    if (!this.currentProfile) return

    const profile = this.profiles.get(this.currentProfile)
    if (profile) {
      profile.frameCount++
      profile.totalRenderTime += renderTime
      profile.peakMemoryUsage = Math.max(profile.peakMemoryUsage, memoryUsage)
    }
  }

  static getProfiles(): Map<string, ProfileData> {
    return new Map(this.profiles)
  }

  static getProfile(name: string): ProfileData | undefined {
    return this.profiles.get(name)
  }

  static clearProfiles(): void {
    this.profiles.clear()
  }
}

export interface ProfileData {
  name: string
  startTime: number
  endTime?: number
  duration?: number
  frameCount: number
  totalRenderTime: number
  peakMemoryUsage: number
  averageFPS: number
}

// Adaptive Quality Manager
export class QualityManager {
  private static qualityLevel = 'high'
  private static adaptiveEnabled = true

  static setQualityLevel(level: 'low' | 'medium' | 'high' | 'ultra'): void {
    this.qualityLevel = level
  }

  static enableAdaptiveQuality(enable: boolean): void {
    this.adaptiveEnabled = enable
  }

  static getOptimalSettings(): OptimizationConfig {
    const fps = PerformanceMonitor.getFPS()
    const shouldThrottle = PerformanceMonitor.shouldThrottle()

    if (!this.adaptiveEnabled) {
      return this.getQualitySettings(this.qualityLevel)
    }

    if (fps < 20 || shouldThrottle) {
      return this.getQualitySettings('low')
    } else if (fps < 40) {
      return this.getQualitySettings('medium')
    } else if (fps < 55) {
      return this.getQualitySettings('high')
    } else {
      return this.getQualitySettings('ultra')
    }
  }

  private static getQualitySettings(level: string): OptimizationConfig {
    switch (level) {
      case 'low':
        return {
          maxFPS: 30,
          enableLOD: true,
          lodDistance: 50,
          enableCulling: true,
          cullingThreshold: 75,
          enablePooling: true,
          poolSize: 50,
          enableCompression: true,
          compressionThreshold: 10
        }
      case 'medium':
        return {
          maxFPS: 45,
          enableLOD: true,
          lodDistance: 75,
          enableCulling: true,
          cullingThreshold: 100,
          enablePooling: true,
          poolSize: 75,
          enableCompression: true,
          compressionThreshold: 20
        }
      case 'high':
        return {
          maxFPS: 60,
          enableLOD: true,
          lodDistance: 100,
          enableCulling: false,
          cullingThreshold: 150,
          enablePooling: true,
          poolSize: 100,
          enableCompression: false,
          compressionThreshold: 50
        }
      case 'ultra':
      default:
        return {
          maxFPS: 60,
          enableLOD: false,
          lodDistance: 200,
          enableCulling: false,
          cullingThreshold: 300,
          enablePooling: false,
          poolSize: 200,
          enableCompression: false,
          compressionThreshold: 100
        }
    }
  }

  static getCurrentQuality(): string {
    return this.qualityLevel
  }

  static isAdaptiveEnabled(): boolean {
    return this.adaptiveEnabled
  }
}

// Main Animation Optimizer
export class AnimationOptimizer {
  private static config: OptimizationConfig = QualityManager.getOptimalSettings()

  static initialize(): void {
    // Set up performance monitoring
    this.startPerformanceMonitoring()

    // Initialize LOD for common element types
    LODManager.defineLOD('node', LODManager.getDefaultLODLevels('node'))
    LODManager.defineLOD('edge', LODManager.getDefaultLODLevels('edge'))

    // Preload common elements into pool
    VisualElementPool.preload('node', 20, () => ({
      id: '',
      type: 'node',
      position: { x: 0, y: 0 },
      style: { fill: '#f3f4f6', stroke: '#d1d5db', strokeWidth: 2 }
    }))

    VisualElementPool.preload('edge', 30, () => ({
      id: '',
      type: 'edge',
      position: { x: 0, y: 0 },
      style: { stroke: '#6b7280', strokeWidth: 2 }
    }))
  }

  static optimizeElements(elements: VisualElement[], cameraPosition: { x: number; y: number; z: number }): VisualElement[] {
    let optimizedElements = [...elements]

    // Apply quality settings
    this.config = QualityManager.getOptimalSettings()

    // Frustum culling
    if (this.config.enableCulling) {
      optimizedElements = CullingManager.getVisibleElements(optimizedElements, cameraPosition)
    }

    // Level of detail
    if (this.config.enableLOD) {
      optimizedElements = optimizedElements.map(element => {
        const lod = LODManager.getLODForDistance(
          element.type,
          Math.sqrt(
            Math.pow(element.position.x - cameraPosition.x, 2) +
            Math.pow(element.position.y - cameraPosition.y, 2)
          )
        )

        if (lod) {
          return this.applyLOD(element, lod)
        }

        return element
      })
    }

    // Object pooling
    if (this.config.enablePooling) {
      optimizedElements = optimizedElements.map(element => {
        const pooled = VisualElementPool.acquire(element.type)
        if (pooled) {
          // Reuse pooled element
          return { ...pooled, ...element }
        }
        return element
      })
    }

    return optimizedElements
  }

  static optimizeAnimations(animations: any[]): any[] {
    if (!this.config.enableCompression) {
      return animations
    }

    return AnimationCompressor.compressAnimations(animations)
  }

  private static applyLOD(element: VisualElement, lod: LODLevel): VisualElement {
    const optimizedElement = { ...element }

    // Adjust detail level
    optimizedElement.style = { ...element.style }

    // Scale down opacity for lower LOD
    if (optimizedElement.style.opacity) {
      optimizedElement.style.opacity *= lod.detail
    }

    // Simplify animations for lower LOD
    if (optimizedElement.animations && lod.detail < 0.8) {
      optimizedElement.animations = optimizedElement.animations.filter((_, index) =>
        index % Math.ceil(1 / lod.detail) === 0
      )
    }

    return optimizedElement
  }

  private static startPerformanceMonitoring(): void {
    const monitorPerformance = () => {
      PerformanceMonitor.update()

      // Adaptive quality adjustment
      if (QualityManager.isAdaptiveEnabled()) {
        const optimalSettings = QualityManager.getOptimalSettings()
        this.config = { ...this.config, ...optimalSettings }
      }

      requestAnimationFrame(monitorPerformance)
    }

    monitorPerformance()
  }

  static getPerformanceMetrics(): PerformanceMetrics {
    return {
      fps: PerformanceMonitor.getFPS(),
      memoryUsage: MemoryManager.size(),
      renderTime: 0, // Would be measured per frame
      frameDrops: 0, // Would be calculated based on FPS drops
      activeElements: 0, // Would be tracked during rendering
      totalElements: VisualElementPool.getStats()['total'] || 0
    }
  }

  static getOptimizationConfig(): OptimizationConfig {
    return { ...this.config }
  }

  static updateConfig(newConfig: Partial<OptimizationConfig>): void {
    this.config = { ...this.config, ...newConfig }
  }
}

// Initialize optimizer on module load
AnimationOptimizer.initialize()
