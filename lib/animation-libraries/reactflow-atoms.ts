/**
 * 🌊 REACT FLOW ANIMATION ATOMS
 *
 * React Flow-specific implementations of the atomic building blocks.
 * These functions know how to execute animations on React Flow diagrams.
 */

import { AnimationContext, AnimationResult } from '../animation-alphabet'

// ============================================================================
// 🎭 VISUAL ATOMS - React Flow Implementation
// ============================================================================

export async function executeFadeIn(context: AnimationContext, target: string, duration: number, easing: string): Promise<AnimationResult> {
  const startTime = Date.now()

  if (!context.container) {
    return { success: false, data: { error: 'No container provided' }, duration: 0, library: 'reactflow', timestamp: Date.now() }
  }

  try {
    // React Flow-specific fade in implementation
    const element = context.elements?.get(target) || context.container.querySelector(`[data-id="${target}"]`)

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
      library: 'reactflow',
      timestamp: Date.now()
    }
  } catch (error) {
    return {
      success: false,
      data: { error: (error as Error).message },
      duration: Date.now() - startTime,
      library: 'reactflow',
      timestamp: Date.now()
    }
  }
}

export async function executeFadeOut(context: AnimationContext, target: string, duration: number, easing: string): Promise<AnimationResult> {
  const startTime = Date.now()

  if (!context.container) {
    return { success: false, data: { error: 'No container provided' }, duration: 0, library: 'reactflow', timestamp: Date.now() }
  }

  try {
    const element = context.elements?.get(target) || context.container.querySelector(`[data-id="${target}"]`)

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
      library: 'reactflow',
      timestamp: Date.now()
    }
  } catch (error) {
    return {
      success: false,
      data: { error: (error as Error).message },
      duration: Date.now() - startTime,
      library: 'reactflow',
      timestamp: Date.now()
    }
  }
}

export async function executeHighlight(context: AnimationContext, target: string, color: string, duration: number): Promise<AnimationResult> {
  const startTime = Date.now()

  if (!context.container) {
    return { success: false, data: { error: 'No container provided' }, duration: 0, library: 'reactflow', timestamp: Date.now() }
  }

  try {
    const element = context.elements?.get(target) || context.container.querySelector(`[data-id="${target}"]`)

    if (element) {
      // Store original styles
      const originalBackground = element.style.background || element.style.backgroundColor
      const originalBorder = element.style.border || element.style.borderColor
      const originalBoxShadow = element.style.boxShadow

      // Apply highlight with enhanced visual effects
      element.style.transition = `all ${duration}ms ease`
      element.style.background = color
      element.style.border = `2px solid ${color}`
      element.style.boxShadow = `0 0 20px ${color}40, 0 4px 8px rgba(0,0,0,0.1)`
      element.style.transform = 'scale(1.05)'

      await new Promise(resolve => setTimeout(resolve, duration))

      // Restore original styles
      element.style.background = originalBackground || ''
      element.style.border = originalBorder || ''
      element.style.boxShadow = originalBoxShadow || ''
      element.style.transform = ''
    }

    return {
      success: true,
      data: { target, color, action: 'highlight' },
      duration: Date.now() - startTime,
      library: 'reactflow',
      timestamp: Date.now()
    }
  } catch (error) {
    return {
      success: false,
      data: { error: (error as Error).message },
      duration: Date.now() - startTime,
      library: 'reactflow',
      timestamp: Date.now()
    }
  }
}

export async function executeGlow(context: AnimationContext, target: string, intensity: number, duration: number): Promise<AnimationResult> {
  const startTime = Date.now()

  if (!context.container) {
    return { success: false, data: { error: 'No container provided' }, duration: 0, library: 'reactflow', timestamp: Date.now() }
  }

  try {
    const element = context.elements?.get(target) || context.container.querySelector(`[data-id="${target}"]`)

    if (element) {
      const glowIntensity = intensity * 20
      const glowColor = `rgba(59, 130, 246, ${intensity})`

      element.style.transition = `box-shadow ${duration}ms ease`
      element.style.boxShadow = `0 0 ${glowIntensity}px ${glowColor}, 0 0 ${glowIntensity * 2}px ${glowColor}`

      await new Promise(resolve => setTimeout(resolve, duration))

      element.style.boxShadow = ''
    }

    return {
      success: true,
      data: { target, intensity, action: 'glow' },
      duration: Date.now() - startTime,
      library: 'reactflow',
      timestamp: Date.now()
    }
  } catch (error) {
    return {
      success: false,
      data: { error: (error as Error).message },
      duration: Date.now() - startTime,
      library: 'reactflow',
      timestamp: Date.now()
    }
  }
}

// ============================================================================
// 📐 SPATIAL ATOMS - React Flow Implementation
// ============================================================================

export async function executeMove(context: AnimationContext, target: string, from: any, to: any, duration: number, easing: string): Promise<AnimationResult> {
  const startTime = Date.now()

  if (!context.container) {
    return { success: false, data: { error: 'No container provided' }, duration: 0, library: 'reactflow', timestamp: Date.now() }
  }

  try {
    // React Flow uses a different approach for node positioning
    // We need to update the node data or use React Flow's built-in animation system

    const element = context.elements?.get(target) || context.container.querySelector(`[data-id="${target}"]`)

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
      library: 'reactflow',
      timestamp: Date.now()
    }
  } catch (error) {
    return {
      success: false,
      data: { error: (error as Error).message },
      duration: Date.now() - startTime,
      library: 'reactflow',
      timestamp: Date.now()
    }
  }
}

export async function executeScale(context: AnimationContext, target: string, from: number, to: number, duration: number, easing: string): Promise<AnimationResult> {
  const startTime = Date.now()

  if (!context.container) {
    return { success: false, data: { error: 'No container provided' }, duration: 0, library: 'reactflow', timestamp: Date.now() }
  }

  try {
    const element = context.elements?.get(target) || context.container.querySelector(`[data-id="${target}"]`)

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
      library: 'reactflow',
      timestamp: Date.now()
    }
  } catch (error) {
    return {
      success: false,
      data: { error: (error as Error).message },
      duration: Date.now() - startTime,
      library: 'reactflow',
      timestamp: Date.now()
    }
  }
}

export async function executeRotate(context: AnimationContext, target: string, from: number, to: number, duration: number, easing: string): Promise<AnimationResult> {
  const startTime = Date.now()

  if (!context.container) {
    return { success: false, data: { error: 'No container provided' }, duration: 0, library: 'reactflow', timestamp: Date.now() }
  }

  try {
    const element = context.elements?.get(target) || context.container.querySelector(`[data-id="${target}"]`)

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
      library: 'reactflow',
      timestamp: Date.now()
    }
  } catch (error) {
    return {
      success: false,
      data: { error: (error as Error).message },
      duration: Date.now() - startTime,
      library: 'reactflow',
      timestamp: Date.now()
    }
  }
}

// ============================================================================
// ⏰ TEMPORAL ATOMS - React Flow Implementation
// ============================================================================

export async function executeDelay(duration: number): Promise<AnimationResult> {
  const startTime = Date.now()

  await new Promise(resolve => setTimeout(resolve, duration))

  return {
    success: true,
    data: { action: 'delay', duration },
    duration: Date.now() - startTime,
    library: 'reactflow',
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
        library: 'reactflow',
        timestamp: Date.now()
      })
      return
    }

    const element = context.elements?.get(target) || context.container.querySelector(`[data-id="${target}"]`)

    if (!element) {
      resolve({
        success: false,
        data: { error: 'Element not found' },
        duration: Date.now() - startTime,
        library: 'reactflow',
        timestamp: Date.now()
      })
      return
    }

    const handleClick = (event: Event) => {
      event.stopPropagation()
      element.removeEventListener('click', handleClick)
      element.style.cursor = ''
      resolve({
        success: true,
        data: { target, action: 'waitForClick' },
        duration: Date.now() - startTime,
        library: 'reactflow',
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
        library: 'reactflow',
        timestamp: Date.now()
      })
      return
    }

    const element = context.elements?.get(target) || context.container.querySelector(`[data-id="${target}"]`)

    if (!element) {
      resolve({
        success: false,
        data: { error: 'Element not found' },
        duration: Date.now() - startTime,
        library: 'reactflow',
        timestamp: Date.now()
      })
      return
    }

    const handleMouseEnter = (event: Event) => {
      event.stopPropagation()
      element.removeEventListener('mouseenter', handleMouseEnter)
      resolve({
        success: true,
        data: { target, action: 'waitForHover' },
        duration: Date.now() - startTime,
        library: 'reactflow',
        timestamp: Date.now()
      })
    }

    element.addEventListener('mouseenter', handleMouseEnter)
  })
}

// ============================================================================
// 🎨 SPECIALIZED REACT FLOW ANIMATIONS
// ============================================================================

export async function executeReactFlowPulse(context: AnimationContext, target: string, times: number = 3): Promise<AnimationResult> {
  const startTime = Date.now()

  if (!context.container) {
    return { success: false, data: { error: 'No container provided' }, duration: 0, library: 'reactflow', timestamp: Date.now() }
  }

  try {
    const element = context.elements?.get(target) || context.container.querySelector(`[data-id="${target}"]`)

    if (element) {
      // Create a pulse animation using CSS keyframes
      const pulseKeyframes = `
        @keyframes reactflow-pulse {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7);
          }
          50% {
            transform: scale(1.05);
            box-shadow: 0 0 0 10px rgba(59, 130, 246, 0);
          }
        }
      `

      // Add keyframes to document if not already present
      if (!document.querySelector('#reactflow-pulse-keyframes')) {
        const style = document.createElement('style')
        style.id = 'reactflow-pulse-keyframes'
        style.textContent = pulseKeyframes
        document.head.appendChild(style)
      }

      element.style.animation = `reactflow-pulse 1s ease-in-out ${times}`

      await new Promise(resolve => {
        setTimeout(() => {
          element.style.animation = ''
          resolve(void 0)
        }, times * 1000)
      })
    }

    return {
      success: true,
      data: { target, times, action: 'pulse' },
      duration: Date.now() - startTime,
      library: 'reactflow',
      timestamp: Date.now()
    }
  } catch (error) {
    return {
      success: false,
      data: { error: (error as Error).message },
      duration: Date.now() - startTime,
      library: 'reactflow',
      timestamp: Date.now()
    }
  }
}

export async function executeReactFlowSlideIn(context: AnimationContext, target: string, direction: string, distance: number): Promise<AnimationResult> {
  const startTime = Date.now()

  if (!context.container) {
    return { success: false, data: { error: 'No container provided' }, duration: 0, library: 'reactflow', timestamp: Date.now() }
  }

  try {
    const element = context.elements?.get(target) || context.container.querySelector(`[data-id="${target}"]`)

    if (element) {
      let startTransform = ''
      let endTransform = 'translate(0, 0) scale(1)'

      switch (direction) {
        case 'left':
          startTransform = `translate(${-distance}px, 0) scale(0.8)`
          break
        case 'right':
          startTransform = `translate(${distance}px, 0) scale(0.8)`
          break
        case 'up':
          startTransform = `translate(0, ${-distance}px) scale(0.8)`
          break
        case 'down':
          startTransform = `translate(0, ${distance}px) scale(0.8)`
          break
      }

      element.style.opacity = '0'
      element.style.transform = startTransform
      element.style.transition = 'all 800ms cubic-bezier(0.34, 1.56, 0.64, 1)'

      await new Promise(resolve => {
        requestAnimationFrame(() => {
          element.style.opacity = '1'
          element.style.transform = endTransform
          setTimeout(resolve, 800)
        })
      })
    }

    return {
      success: true,
      data: { target, direction, distance, action: 'slideIn' },
      duration: Date.now() - startTime,
      library: 'reactflow',
      timestamp: Date.now()
    }
  } catch (error) {
    return {
      success: false,
      data: { error: (error as Error).message },
      duration: Date.now() - startTime,
      library: 'reactflow',
      timestamp: Date.now()
    }
  }
}

export async function executeReactFlowNodeShake(context: AnimationContext, target: string, intensity: number = 5): Promise<AnimationResult> {
  const startTime = Date.now()

  if (!context.container) {
    return { success: false, data: { error: 'No container provided' }, duration: 0, library: 'reactflow', timestamp: Date.now() }
  }

  try {
    const element = context.elements?.get(target) || context.container.querySelector(`[data-id="${target}"]`)

    if (element) {
      const shakeKeyframes = `
        @keyframes reactflow-shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-${intensity}px); }
          20%, 40%, 60%, 80% { transform: translateX(${intensity}px); }
        }
      `

      // Add keyframes to document if not already present
      if (!document.querySelector('#reactflow-shake-keyframes')) {
        const style = document.createElement('style')
        style.id = 'reactflow-shake-keyframes'
        style.textContent = shakeKeyframes
        document.head.appendChild(style)
      }

      element.style.animation = 'reactflow-shake 0.5s ease-in-out'

      await new Promise(resolve => {
        setTimeout(() => {
          element.style.animation = ''
          resolve(void 0)
        }, 500)
      })
    }

    return {
      success: true,
      data: { target, intensity, action: 'shake' },
      duration: Date.now() - startTime,
      library: 'reactflow',
      timestamp: Date.now()
    }
  } catch (error) {
    return {
      success: false,
      data: { error: (error as Error).message },
      duration: Date.now() - startTime,
      library: 'reactflow',
      timestamp: Date.now()
    }
  }
}
