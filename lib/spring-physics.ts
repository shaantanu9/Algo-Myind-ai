/**
 * Spring Physics Engine for Smooth Animations
 * Implements spring-based motion for natural, fluid animations
 */

export interface SpringConfig {
  stiffness: number  // How tight the spring is (higher = faster)
  damping: number    // How much the spring resists motion (higher = less oscillation)
  mass: number       // Mass of the object (higher = slower)
  precision: number  // When to stop (distance threshold)
}

export const SpringPresets: Record<string, SpringConfig> = {
  // Gentle, smooth motion
  gentle: {
    stiffness: 120,
    damping: 14,
    mass: 1,
    precision: 0.01
  },
  // Fast, responsive motion
  wobbly: {
    stiffness: 180,
    damping: 12,
    mass: 1,
    precision: 0.01
  },
  // Slow, smooth motion
  slow: {
    stiffness: 60,
    damping: 20,
    mass: 1,
    precision: 0.01
  },
  // Very bouncy
  bouncy: {
    stiffness: 200,
    damping: 10,
    mass: 1,
    precision: 0.01
  },
  // Stiff, fast response
  stiff: {
    stiffness: 210,
    damping: 20,
    mass: 1,
    precision: 0.01
  }
}

export class Spring {
  private currentValue: number
  private targetValue: number
  private velocity: number
  private config: SpringConfig

  constructor(initialValue: number = 0, config: SpringConfig = SpringPresets.gentle) {
    this.currentValue = initialValue
    this.targetValue = initialValue
    this.velocity = 0
    this.config = config
  }

  setTarget(target: number): void {
    this.targetValue = target
  }

  getCurrentValue(): number {
    return this.currentValue
  }

  isAtRest(): boolean {
    return Math.abs(this.currentValue - this.targetValue) < this.config.precision && 
           Math.abs(this.velocity) < this.config.precision
  }

  update(deltaTime: number = 1/60): number {
    if (this.isAtRest()) {
      this.currentValue = this.targetValue
      this.velocity = 0
      return this.currentValue
    }

    // Spring physics calculation
    const springForce = -this.config.stiffness * (this.currentValue - this.targetValue)
    const dampingForce = -this.config.damping * this.velocity
    const acceleration = (springForce + dampingForce) / this.config.mass

    // Update velocity and position
    this.velocity += acceleration * deltaTime
    this.currentValue += this.velocity * deltaTime

    return this.currentValue
  }
}

/**
 * Multi-dimensional spring for animating objects with multiple properties
 */
export class SpringVector {
  private springs: Map<string, Spring>
  private config: SpringConfig

  constructor(config: SpringConfig = SpringPresets.gentle) {
    this.springs = new Map()
    this.config = config
  }

  set(key: string, currentValue: number, targetValue: number): void {
    if (!this.springs.has(key)) {
      this.springs.set(key, new Spring(currentValue, this.config))
    }
    this.springs.get(key)!.setTarget(targetValue)
  }

  get(key: string): number {
    return this.springs.get(key)?.getCurrentValue() ?? 0
  }

  update(deltaTime: number = 1/60): Record<string, number> {
    const values: Record<string, number> = {}
    this.springs.forEach((spring, key) => {
      values[key] = spring.update(deltaTime)
    })
    return values
  }

  isAtRest(): boolean {
    return Array.from(this.springs.values()).every(spring => spring.isAtRest())
  }
}

/**
 * Easing functions for non-spring animations
 */
export const Easings = {
  // No easing
  linear: (t: number) => t,
  
  // Quad
  easeInQuad: (t: number) => t * t,
  easeOutQuad: (t: number) => t * (2 - t),
  easeInOutQuad: (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
  
  // Cubic
  easeInCubic: (t: number) => t * t * t,
  easeOutCubic: (t: number) => (--t) * t * t + 1,
  easeInOutCubic: (t: number) => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
  
  // Elastic
  easeInElastic: (t: number) => {
    if (t === 0 || t === 1) return t
    return -Math.pow(2, 10 * (t - 1)) * Math.sin((t - 1.1) * 5 * Math.PI)
  },
  easeOutElastic: (t: number) => {
    if (t === 0 || t === 1) return t
    return Math.pow(2, -10 * t) * Math.sin((t - 0.1) * 5 * Math.PI) + 1
  },
  
  // Back
  easeInBack: (t: number) => {
    const c1 = 1.70158
    return t * t * ((c1 + 1) * t - c1)
  },
  easeOutBack: (t: number) => {
    const c1 = 1.70158
    return 1 + (--t) * t * ((c1 + 1) * t + c1)
  },
  
  // Bounce
  easeOutBounce: (t: number) => {
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
}

/**
 * Animation frame manager for smooth 60 FPS animations
 */
export class AnimationManager {
  private animationId: number | null = null
  private lastTime: number = 0
  private isRunning: boolean = false

  start(callback: (deltaTime: number) => boolean): void {
    if (this.isRunning) return

    this.isRunning = true
    this.lastTime = performance.now()

    const animate = (currentTime: number) => {
      if (!this.isRunning) return

      const deltaTime = Math.min((currentTime - this.lastTime) / 1000, 0.1) // Cap at 100ms
      this.lastTime = currentTime

      const shouldContinue = callback(deltaTime)

      if (shouldContinue) {
        this.animationId = requestAnimationFrame(animate)
      } else {
        this.stop()
      }
    }

    this.animationId = requestAnimationFrame(animate)
  }

  stop(): void {
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId)
      this.animationId = null
    }
    this.isRunning = false
  }

  isActive(): boolean {
    return this.isRunning
  }
}

