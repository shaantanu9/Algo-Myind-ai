/**
 * 🧜‍♀️ MERMAID ANIMATION ATOMS
 *
 * Mermaid-specific implementations of the atomic building blocks.
 * These functions know how to execute animations on Mermaid diagrams.
 */

import { AnimationContext, AnimationResult } from '../animation-alphabet'

// ============================================================================
// 🎭 VISUAL ATOMS - Mermaid Implementation
// ============================================================================

export async function executeFadeIn(context: AnimationContext, target: string, duration: number, easing: string): Promise<AnimationResult> {
  const startTime = Date.now()

  if (!context.container) {
    return { success: false, data: { error: 'No container provided' }, duration: 0, library: 'mermaid', timestamp: Date.now() }
  }

  try {
    // Mermaid-specific fade in implementation
    const element = context.elements?.get(target) || context.container.querySelector(`[id*="${target}"]`)

    if (element) {
      // Use CSS transitions for smooth animation
      element.style.transition = `opacity ${duration}ms ${easing}`
      element.style.opacity = '0'

      await new Promise(resolve => {
        requestAnimationFrame(() => {
          element.style.opacity = '1'
          setTimeout(resolve, duration)
        })
      })
    }

    return {
      success: true,
      data: { target, action: 'fadeIn', element },
      duration: Date.now() - startTime,
      library: 'mermaid',
      timestamp: Date.now()
    }
  } catch (error) {
    return {
      success: false,
      data: { error: error.message },
      duration: Date.now() - startTime,
      library: 'mermaid',
      timestamp: Date.now()
    }
  }
}

export async function executeFadeOut(context: AnimationContext, target: string, duration: number, easing: string): Promise<AnimationResult> {
  const startTime = Date.now()

  if (!context.container) {
    return { success: false, data: { error: 'No container provided' }, duration: 0, library: 'mermaid', timestamp: Date.now() }
  }

  try {
    const element = context.elements?.get(target) || context.container.querySelector(`[id*="${target}"]`)

    if (element) {
      element.style.transition = `opacity ${duration}ms ${easing}`
      element.style.opacity = '1'

      await new Promise(resolve => {
        requestAnimationFrame(() => {
          element.style.opacity = '0'
          setTimeout(resolve, duration)
        })
      })
    }

    return {
      success: true,
      data: { target, action: 'fadeOut' },
      duration: Date.now() - startTime,
      library: 'mermaid',
      timestamp: Date.now()
    }
  } catch (error) {
    return {
      success: false,
      data: { error: error.message },
      duration: Date.now() - startTime,
      library: 'mermaid',
      timestamp: Date.now()
    }
  }
}

export async function executeHighlight(context: AnimationContext, target: string, color: string, duration: number): Promise<AnimationResult> {
  const startTime = Date.now()

  if (!context.container) {
    return { success: false, data: { error: 'No container provided' }, duration: 0, library: 'mermaid', timestamp: Date.now() }
  }

  try {
    const element = context.elements?.get(target) || context.container.querySelector(`[id*="${target}"]`)

    if (element) {
      // Store original styles
      const originalFill = element.style.fill || element.getAttribute('fill')
      const originalStroke = element.style.stroke || element.getAttribute('stroke')
      const originalStrokeWidth = element.style.strokeWidth || element.getAttribute('stroke-width')

      // Apply highlight
      element.style.transition = `all ${duration}ms ease`
      element.style.fill = color
      element.style.stroke = color
      element.style.strokeWidth = '3'
      element.style.filter = 'drop-shadow(0 0 6px rgba(59, 130, 246, 0.5))'

      await new Promise(resolve => setTimeout(resolve, duration))

      // Restore original styles
      element.style.fill = originalFill || ''
      element.style.stroke = originalStroke || ''
      element.style.strokeWidth = originalStrokeWidth || ''
      element.style.filter = ''
    }

    return {
      success: true,
      data: { target, color, action: 'highlight' },
      duration: Date.now() - startTime,
      library: 'mermaid',
      timestamp: Date.now()
    }
  } catch (error) {
    return {
      success: false,
      data: { error: error.message },
      duration: Date.now() - startTime,
      library: 'mermaid',
      timestamp: Date.now()
    }
  }
}

export async function executeGlow(context: AnimationContext, target: string, intensity: number, duration: number): Promise<AnimationResult> {
  const startTime = Date.now()

  if (!context.container) {
    return { success: false, data: { error: 'No container provided' }, duration: 0, library: 'mermaid', timestamp: Date.now() }
  }

  try {
    const element = context.elements?.get(target) || context.container.querySelector(`[id*="${target}"]`)

    if (element) {
      const glowValue = `drop-shadow(0 0 ${intensity * 10}px rgba(59, 130, 246, ${intensity}))`
      element.style.transition = `filter ${duration}ms ease`
      element.style.filter = glowValue

      await new Promise(resolve => setTimeout(resolve, duration))

      element.style.filter = ''
    }

    return {
      success: true,
      data: { target, intensity, action: 'glow' },
      duration: Date.now() - startTime,
      library: 'mermaid',
      timestamp: Date.now()
    }
  } catch (error) {
    return {
      success: false,
      data: { error: error.message },
      duration: Date.now() - startTime,
      library: 'mermaid',
      timestamp: Date.now()
    }
  }
}

// ============================================================================
// 📐 SPATIAL ATOMS - Mermaid Implementation
// ============================================================================

export async function executeMove(context: AnimationContext, target: string, from: any, to: any, duration: number, easing: string): Promise<AnimationResult> {
  const startTime = Date.now()

  if (!context.container) {
    return { success: false, data: { error: 'No container provided' }, duration: 0, library: 'mermaid', timestamp: Date.now() }
  }

  try {
    const element = context.elements?.get(target) || context.container.querySelector(`[id*="${target}"]`)

    if (element) {
      element.style.transition = `transform ${duration}ms ${easing}`
      element.style.transform = `translate(${from.x}px, ${from.y}px)`

      await new Promise(resolve => {
        requestAnimationFrame(() => {
          element.style.transform = `translate(${to.x}px, ${to.y}px)`
          setTimeout(resolve, duration)
        })
      })
    }

    return {
      success: true,
      data: { target, from, to, action: 'move' },
      duration: Date.now() - startTime,
      library: 'mermaid',
      timestamp: Date.now()
    }
  } catch (error) {
    return {
      success: false,
      data: { error: error.message },
      duration: Date.now() - startTime,
      library: 'mermaid',
      timestamp: Date.now()
    }
  }
}

export async function executeScale(context: AnimationContext, target: string, from: number, to: number, duration: number, easing: string): Promise<AnimationResult> {
  const startTime = Date.now()

  if (!context.container) {
    return { success: false, data: { error: 'No container provided' }, duration: 0, library: 'mermaid', timestamp: Date.now() }
  }

  try {
    const element = context.elements?.get(target) || context.container.querySelector(`[id*="${target}"]`)

    if (element) {
      element.style.transition = `transform ${duration}ms ${easing}`
      element.style.transform = `scale(${from})`

      await new Promise(resolve => {
        requestAnimationFrame(() => {
          element.style.transform = `scale(${to})`
          setTimeout(resolve, duration)
        })
      })
    }

    return {
      success: true,
      data: { target, from, to, action: 'scale' },
      duration: Date.now() - startTime,
      library: 'mermaid',
      timestamp: Date.now()
    }
  } catch (error) {
    return {
      success: false,
      data: { error: error.message },
      duration: Date.now() - startTime,
      library: 'mermaid',
      timestamp: Date.now()
    }
  }
}

export async function executeRotate(context: AnimationContext, target: string, from: number, to: number, duration: number, easing: string): Promise<AnimationResult> {
  const startTime = Date.now()

  if (!context.container) {
    return { success: false, data: { error: 'No container provided' }, duration: 0, library: 'mermaid', timestamp: Date.now() }
  }

  try {
    const element = context.elements?.get(target) || context.container.querySelector(`[id*="${target}"]`)

    if (element) {
      element.style.transition = `transform ${duration}ms ${easing}`
      element.style.transform = `rotate(${from}deg)`

      await new Promise(resolve => {
        requestAnimationFrame(() => {
          element.style.transform = `rotate(${to}deg)`
          setTimeout(resolve, duration)
        })
      })
    }

    return {
      success: true,
      data: { target, from, to, action: 'rotate' },
      duration: Date.now() - startTime,
      library: 'mermaid',
      timestamp: Date.now()
    }
  } catch (error) {
    return {
      success: false,
      data: { error: error.message },
      duration: Date.now() - startTime,
      library: 'mermaid',
      timestamp: Date.now()
    }
  }
}

// ============================================================================
// ⏰ TEMPORAL ATOMS - Mermaid Implementation
// ============================================================================

export async function executeDelay(duration: number): Promise<AnimationResult> {
  const startTime = Date.now()

  await new Promise(resolve => setTimeout(resolve, duration))

  return {
    success: true,
    data: { action: 'delay', duration },
    duration: Date.now() - startTime,
    library: 'mermaid',
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
        library: 'mermaid',
        timestamp: Date.now()
      })
      return
    }

    const element = context.elements?.get(target) || context.container.querySelector(`[id*="${target}"]`)

    if (!element) {
      resolve({
        success: false,
        data: { error: 'Element not found' },
        duration: Date.now() - startTime,
        library: 'mermaid',
        timestamp: Date.now()
      })
      return
    }

    const handleClick = () => {
      element.removeEventListener('click', handleClick)
      resolve({
        success: true,
        data: { target, action: 'waitForClick' },
        duration: Date.now() - startTime,
        library: 'mermaid',
        timestamp: Date.now()
      })
    }

    element.addEventListener('click', handleClick)
    element.style.cursor = 'pointer'
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
        library: 'mermaid',
        timestamp: Date.now()
      })
      return
    }

    const element = context.elements?.get(target) || context.container.querySelector(`[id*="${target}"]`)

    if (!element) {
      resolve({
        success: false,
        data: { error: 'Element not found' },
        duration: Date.now() - startTime,
        library: 'mermaid',
        timestamp: Date.now()
      })
      return
    }

    const handleMouseEnter = () => {
      element.removeEventListener('mouseenter', handleMouseEnter)
      resolve({
        success: true,
        data: { target, action: 'waitForHover' },
        duration: Date.now() - startTime,
        library: 'mermaid',
        timestamp: Date.now()
      })
    }

    element.addEventListener('mouseenter', handleMouseEnter)
  })
}

// ============================================================================
// 🎨 SPECIALIZED MERMAID ANIMATIONS
// ============================================================================

export async function executeMermaidPulse(context: AnimationContext, target: string): Promise<AnimationResult> {
  const startTime = Date.now()

  if (!context.container) {
    return { success: false, data: { error: 'No container provided' }, duration: 0, library: 'mermaid', timestamp: Date.now() }
  }

  try {
    const element = context.elements?.get(target) || context.container.querySelector(`[id*="${target}"]`)

    if (element) {
      // Create a pulse animation using CSS keyframes
      const pulseKeyframes = `
        @keyframes mermaid-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
      `

      // Add keyframes to document if not already present
      if (!document.querySelector('#mermaid-pulse-keyframes')) {
        const style = document.createElement('style')
        style.id = 'mermaid-pulse-keyframes'
        style.textContent = pulseKeyframes
        document.head.appendChild(style)
      }

      element.style.animation = 'mermaid-pulse 1s ease-in-out 3'

      await new Promise(resolve => {
        setTimeout(() => {
          element.style.animation = ''
          resolve(void 0)
        }, 3000)
      })
    }

    return {
      success: true,
      data: { target, action: 'pulse' },
      duration: Date.now() - startTime,
      library: 'mermaid',
      timestamp: Date.now()
    }
  } catch (error) {
    return {
      success: false,
      data: { error: error.message },
      duration: Date.now() - startTime,
      library: 'mermaid',
      timestamp: Date.now()
    }
  }
}

export async function executeMermaidSlideIn(context: AnimationContext, target: string, direction: string, distance: number): Promise<AnimationResult> {
  const startTime = Date.now()

  if (!context.container) {
    return { success: false, data: { error: 'No container provided' }, duration: 0, library: 'mermaid', timestamp: Date.now() }
  }

  try {
    const element = context.elements?.get(target) || context.container.querySelector(`[id*="${target}"]`)

    if (element) {
      let startTransform = ''
      let endTransform = 'translate(0, 0)'

      switch (direction) {
        case 'left':
          startTransform = `translate(${-distance}px, 0)`
          break
        case 'right':
          startTransform = `translate(${distance}px, 0)`
          break
        case 'up':
          startTransform = `translate(0, ${-distance}px)`
          break
        case 'down':
          startTransform = `translate(0, ${distance}px)`
          break
      }

      element.style.opacity = '0'
      element.style.transform = startTransform
      element.style.transition = 'all 600ms ease-out'

      await new Promise(resolve => {
        requestAnimationFrame(() => {
          element.style.opacity = '1'
          element.style.transform = endTransform
          setTimeout(resolve, 600)
        })
      })
    }

    return {
      success: true,
      data: { target, direction, distance, action: 'slideIn' },
      duration: Date.now() - startTime,
      library: 'mermaid',
      timestamp: Date.now()
    }
  } catch (error) {
    return {
      success: false,
      data: { error: error.message },
      duration: Date.now() - startTime,
      library: 'mermaid',
      timestamp: Date.now()
    }
  }
}
