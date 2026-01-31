/**
 * Animation Core Utilities
 * Core building blocks for all animation systems
 */

export interface AnimationConfig {
  duration: number
  easing: string
  delay: number
  repeat: boolean
  yoyo: boolean
}

export interface ColorPalette {
  primary: string
  secondary: string
  accent: string
  success: string
  error: string
  warning: string
  neutral: string[]
}

export interface Position {
  x: number
  y: number
  z?: number
}

export interface Size {
  width: number
  height: number
  depth?: number
}

export interface AnimationState {
  step: number
  progress: number
  isPlaying: boolean
  isTransitioning: boolean
  direction: 'forward' | 'backward'
}

// Timing and Easing Functions
export class AnimationTiming {
  static easeInOutCubic(t: number): number {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
  }

  static easeOutElastic(t: number): number {
    const c4 = (2 * Math.PI) / 3
    return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1
  }

  static easeInBounce(t: number): number {
    return 1 - this.easeOutBounce(1 - t)
  }

  static easeOutBounce(t: number): number {
    const n1 = 7.5625
    const d1 = 2.75

    if (t < 1 / d1) {
      return n1 * t * t
    } else if (t < 2 / d1) {
      return n1 * (t -= 1.5 / d1) * t + 0.75
    } else if (t < 2.5 / d1) {
      return n1 * (t -= 2.25 / d1) * t + 0.9375
    } else {
      return n1 * (t -= 2.625 / d1) * t + 0.984375
    }
  }

  static createTimingFunction(type: string): (t: number) => number {
    switch (type) {
      case 'elastic': return this.easeOutElastic
      case 'bounce': return this.easeOutBounce
      case 'bounce-in': return this.easeInBounce
      default: return this.easeInOutCubic
    }
  }
}

// Color Management System
export class ColorSystem {
  static palettes = {
    algorithm: {
      primary: '#3b82f6',
      secondary: '#6366f1',
      accent: '#8b5cf6',
      success: '#22c55e',
      error: '#ef4444',
      warning: '#f59e0b',
      neutral: ['#f8fafc', '#e2e8f0', '#cbd5e1', '#94a3b8', '#64748b']
    },
    data: {
      primary: '#06b6d4',
      secondary: '#0891b2',
      accent: '#0e7490',
      success: '#10b981',
      error: '#f87171',
      warning: '#fbbf24',
      neutral: ['#f0f9ff', '#e0f2fe', '#bae6fd', '#7dd3fc', '#38bdf8']
    },
    process: {
      primary: '#f59e0b',
      secondary: '#d97706',
      accent: '#b45309',
      success: '#65a30d',
      error: '#dc2626',
      warning: '#ea580c',
      neutral: ['#fffbeb', '#fef3c7', '#fde68a', '#fcd34d', '#fbbf24']
    }
  }

  static getPalette(type: keyof typeof ColorSystem.palettes = 'algorithm'): ColorPalette {
    return this.palettes[type]
  }

  static interpolateColor(color1: string, color2: string, factor: number): string {
    // Convert hex to RGB
    const c1 = this.hexToRgb(color1)
    const c2 = this.hexToRgb(color2)

    if (!c1 || !c2) return color1

    // Interpolate
    const r = Math.round(c1.r + (c2.r - c1.r) * factor)
    const g = Math.round(c1.g + (c2.g - c1.g) * factor)
    const b = Math.round(c1.b + (c2.b - c1.b) * factor)

    return this.rgbToHex(r, g, b)
  }

  static hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null
  }

  static rgbToHex(r: number, g: number, b: number): string {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
  }

  static generateGradient(colors: string[], steps: number): string[] {
    if (colors.length < 2) return colors

    const gradient: string[] = []
    const segments = colors.length - 1
    const stepsPerSegment = Math.floor(steps / segments)

    for (let i = 0; i < segments; i++) {
      const startColor = colors[i]
      const endColor = colors[i + 1]

      for (let j = 0; j < stepsPerSegment; j++) {
        const factor = j / (stepsPerSegment - 1)
        gradient.push(this.interpolateColor(startColor, endColor, factor))
      }
    }

    return gradient
  }
}

// Geometry and Math Utilities
export class GeometryUtils {
  static calculateDistance(pos1: Position, pos2: Position): number {
    const dx = pos2.x - pos1.x
    const dy = pos2.y - pos1.y
    const dz = (pos2.z || 0) - (pos1.z || 0)
    return Math.sqrt(dx * dx + dy * dy + dz * dz)
  }

  static calculateAngle(pos1: Position, pos2: Position): number {
    return Math.atan2(pos2.y - pos1.y, pos2.x - pos1.x)
  }

  static interpolatePosition(pos1: Position, pos2: Position, factor: number): Position {
    return {
      x: pos1.x + (pos2.x - pos1.x) * factor,
      y: pos1.y + (pos2.y - pos1.y) * factor,
      z: pos1.z !== undefined && pos2.z !== undefined
        ? pos1.z + (pos2.z - pos1.z) * factor
        : pos1.z
    }
  }

  static createCirclePoints(center: Position, radius: number, count: number): Position[] {
    const points: Position[] = []
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2
      points.push({
        x: center.x + Math.cos(angle) * radius,
        y: center.y + Math.sin(angle) * radius,
        z: center.z || 0
      })
    }
    return points
  }

  static createSpiralPoints(center: Position, startRadius: number, endRadius: number, turns: number, count: number): Position[] {
    const points: Position[] = []
    for (let i = 0; i < count; i++) {
      const t = i / (count - 1)
      const angle = t * turns * Math.PI * 2
      const radius = startRadius + (endRadius - startRadius) * t

      points.push({
        x: center.x + Math.cos(angle) * radius,
        y: center.y + Math.sin(angle) * radius,
        z: center.z || 0
      })
    }
    return points
  }
}

// Animation State Management
export class AnimationStateManager {
  private static instances = new Map<string, AnimationStateManager>()
  private state: AnimationState
  private listeners: ((state: AnimationState) => void)[] = []

  constructor(private id: string) {
    this.state = {
      step: 0,
      progress: 0,
      isPlaying: false,
      isTransitioning: false,
      direction: 'forward'
    }
  }

  static getInstance(id: string): AnimationStateManager {
    if (!this.instances.has(id)) {
      this.instances.set(id, new AnimationStateManager(id))
    }
    return this.instances.get(id)!
  }

  getState(): AnimationState {
    return { ...this.state }
  }

  updateState(updates: Partial<AnimationState>): void {
    this.state = { ...this.state, ...updates }
    this.notifyListeners()
  }

  subscribe(listener: (state: AnimationState) => void): () => void {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener)
    }
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.state))
  }
}

// Performance Monitoring
export class PerformanceMonitor {
  private static frameCount = 0
  private static lastTime = 0
  private static fps = 60

  static update(): void {
    const now = performance.now()
    this.frameCount++

    if (now - this.lastTime >= 1000) {
      this.fps = Math.round((this.frameCount * 1000) / (now - this.lastTime))
      this.frameCount = 0
      this.lastTime = now
    }
  }

  static getFPS(): number {
    return this.fps
  }

  static shouldThrottle(): boolean {
    return this.fps < 30 // Throttle if FPS drops below 30
  }
}

// Memory Management
export class MemoryManager {
  private static cache = new Map<string, any>()
  private static maxCacheSize = 50

  static set(key: string, value: any): void {
    if (this.cache.size >= this.maxCacheSize) {
      // Remove oldest entry (simple LRU approximation)
      const firstKey = this.cache.keys().next().value
      this.cache.delete(firstKey)
    }
    this.cache.set(key, value)
  }

  static get<T>(key: string): T | undefined {
    return this.cache.get(key)
  }

  static has(key: string): boolean {
    return this.cache.has(key)
  }

  static clear(): void {
    this.cache.clear()
  }

  static size(): number {
    return this.cache.size
  }
}
