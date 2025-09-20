/**
 * 🎪 THREE.JS ANIMATION ATOMS
 *
 * Three.js-specific implementations of the atomic building blocks.
 * These functions know how to execute animations on Three.js 3D scenes.
 */

import { AnimationContext, AnimationResult } from '../animation-alphabet'
import * as THREE from 'three'

// ============================================================================
// 🎭 VISUAL ATOMS - Three.js Implementation
// ============================================================================

export async function executeFadeIn(context: AnimationContext, target: string, duration: number, easing: string): Promise<AnimationResult> {
  const startTime = Date.now()

  if (!context.container || !context.elements) {
    return { success: false, data: { error: 'No container or elements provided' }, duration: 0, library: 'three', timestamp: Date.now() }
  }

  try {
    const element = context.elements.get(target)

    if (!element || !(element instanceof THREE.Object3D)) {
      return { success: false, data: { error: 'Element not found or not a Three.js object' }, duration: 0, library: 'three', timestamp: Date.now() }
    }

    // Three.js fade in using material opacity
    const material = (element as any).material
    if (material) {
      const initialOpacity = material.opacity || 0
      const targetOpacity = 1

      await new Promise<void>((resolve) => {
        const startTime = Date.now()

        const animate = () => {
          const elapsed = Date.now() - startTime
          const progress = Math.min(elapsed / duration, 1)

          // Simple easing
          const easedProgress = 1 - Math.pow(1 - progress, 3)
          material.opacity = initialOpacity + (targetOpacity - initialOpacity) * easedProgress
          material.transparent = true

          if (progress < 1) {
            requestAnimationFrame(animate)
          } else {
            material.opacity = targetOpacity
            resolve()
          }
        }

        requestAnimationFrame(animate)
      })
    }

    return {
      success: true,
      data: { target, action: 'fadeIn', element },
      duration: Date.now() - startTime,
      library: 'three',
      timestamp: Date.now()
    }
  } catch (error) {
    return {
      success: false,
      data: { error: error instanceof Error ? error.message : 'Unknown error' },
      duration: Date.now() - startTime,
      library: 'three',
      timestamp: Date.now()
    }
  }
}

export async function executeFadeOut(context: AnimationContext, target: string, duration: number, easing: string): Promise<AnimationResult> {
  const startTime = Date.now()

  if (!context.container || !context.elements) {
    return { success: false, data: { error: 'No container or elements provided' }, duration: 0, library: 'three', timestamp: Date.now() }
  }

  try {
    const element = context.elements.get(target)

    if (!element || !(element instanceof THREE.Object3D)) {
      return { success: false, data: { error: 'Element not found or not a Three.js object' }, duration: 0, library: 'three', timestamp: Date.now() }
    }

    const material = (element as any).material
    if (material) {
      const initialOpacity = material.opacity || 1
      const targetOpacity = 0

      await new Promise<void>((resolve) => {
        const startTime = Date.now()

        const animate = () => {
          const elapsed = Date.now() - startTime
          const progress = Math.min(elapsed / duration, 1)

          const easedProgress = 1 - Math.pow(1 - progress, 3)
          material.opacity = initialOpacity + (targetOpacity - initialOpacity) * easedProgress
          material.transparent = true

          if (progress < 1) {
            requestAnimationFrame(animate)
          } else {
            material.opacity = targetOpacity
            resolve()
          }
        }

        requestAnimationFrame(animate)
      })
    }

    return {
      success: true,
      data: { target, action: 'fadeOut' },
      duration: Date.now() - startTime,
      library: 'three',
      timestamp: Date.now()
    }
  } catch (error) {
    return {
      success: false,
      data: { error: error instanceof Error ? error.message : 'Unknown error' },
      duration: Date.now() - startTime,
      library: 'three',
      timestamp: Date.now()
    }
  }
}

export async function executeHighlight(context: AnimationContext, target: string, color: string, duration: number): Promise<AnimationResult> {
  const startTime = Date.now()

  if (!context.container || !context.elements) {
    return { success: false, data: { error: 'No container or elements provided' }, duration: 0, library: 'three', timestamp: Date.now() }
  }

  try {
    const element = context.elements.get(target)

    if (!element || !(element instanceof THREE.Object3D)) {
      return { success: false, data: { error: 'Element not found or not a Three.js object' }, duration: 0, library: 'three', timestamp: Date.now() }
    }

    const material = (element as any).material
    if (material) {
      const originalColor = material.color ? material.color.clone() : new THREE.Color(0xffffff)
      const targetColor = new THREE.Color(color)

      await new Promise<void>((resolve) => {
        const startTime = Date.now()

        const animate = () => {
          const elapsed = Date.now() - startTime
          const progress = Math.min(elapsed / duration, 1)

          const easedProgress = 1 - Math.pow(1 - progress, 3)
          material.color.lerpColors(originalColor, targetColor, easedProgress)

          if (progress < 1) {
            requestAnimationFrame(animate)
          } else {
            material.color.copy(targetColor)
            resolve()
          }
        }

        requestAnimationFrame(animate)
      })
    }

    return {
      success: true,
      data: { target, color, action: 'highlight' },
      duration: Date.now() - startTime,
      library: 'three',
      timestamp: Date.now()
    }
  } catch (error) {
    return {
      success: false,
      data: { error: error instanceof Error ? error.message : 'Unknown error' },
      duration: Date.now() - startTime,
      library: 'three',
      timestamp: Date.now()
    }
  }
}

export async function executeGlow(context: AnimationContext, target: string, intensity: number, duration: number): Promise<AnimationResult> {
  const startTime = Date.now()

  if (!context.container || !context.elements) {
    return { success: false, data: { error: 'No container or elements provided' }, duration: 0, library: 'three', timestamp: Date.now() }
  }

  try {
    const element = context.elements.get(target)

    if (!element || !(element instanceof THREE.Object3D)) {
      return { success: false, data: { error: 'Element not found or not a Three.js object' }, duration: 0, library: 'three', timestamp: Date.now() }
    }

    const material = (element as any).material
    if (material) {
      const originalEmissive = material.emissive ? material.emissive.clone() : new THREE.Color(0x000000)
      const glowColor = new THREE.Color(0x444444)
      const maxIntensity = intensity * 0.5

      await new Promise<void>((resolve) => {
        const startTime = Date.now()

        const animate = () => {
          const elapsed = Date.now() - startTime
          const progress = Math.min(elapsed / duration, 1)

          const easedProgress = 1 - Math.pow(1 - progress, 3)
          material.emissive.lerpColors(originalEmissive, glowColor, easedProgress * maxIntensity)

          if (progress < 1) {
            requestAnimationFrame(animate)
          } else {
            material.emissive.copy(glowColor).multiplyScalar(maxIntensity)
            resolve()
          }
        }

        requestAnimationFrame(animate)
      })
    }

    return {
      success: true,
      data: { target, intensity, action: 'glow' },
      duration: Date.now() - startTime,
      library: 'three',
      timestamp: Date.now()
    }
  } catch (error) {
    return {
      success: false,
      data: { error: error instanceof Error ? error.message : 'Unknown error' },
      duration: Date.now() - startTime,
      library: 'three',
      timestamp: Date.now()
    }
  }
}

// ============================================================================
// 📐 SPATIAL ATOMS - Three.js Implementation
// ============================================================================

export async function executeMove(context: AnimationContext, target: string, from: any, to: any, duration: number, easing: string): Promise<AnimationResult> {
  const startTime = Date.now()

  if (!context.container || !context.elements) {
    return { success: false, data: { error: 'No container or elements provided' }, duration: 0, library: 'three', timestamp: Date.now() }
  }

  try {
    const element = context.elements.get(target)

    if (!element || !(element instanceof THREE.Object3D)) {
      return { success: false, data: { error: 'Element not found or not a Three.js object' }, duration: 0, library: 'three', timestamp: Date.now() }
    }

    const initialPosition = {
      x: from.x !== undefined ? from.x : element.position.x,
      y: from.y !== undefined ? from.y : element.position.y,
      z: from.z !== undefined ? from.z : element.position.z
    }

    const targetPosition = {
      x: to.x !== undefined ? to.x : element.position.x,
      y: to.y !== undefined ? to.y : element.position.y,
      z: to.z !== undefined ? to.z : element.position.z
    }

    await new Promise<void>((resolve) => {
      const startTime = Date.now()

      const animate = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / duration, 1)

        const easedProgress = 1 - Math.pow(1 - progress, 3)

        element.position.x = initialPosition.x + (targetPosition.x - initialPosition.x) * easedProgress
        element.position.y = initialPosition.y + (targetPosition.y - initialPosition.y) * easedProgress
        element.position.z = initialPosition.z + (targetPosition.z - initialPosition.z) * easedProgress

        if (progress < 1) {
          requestAnimationFrame(animate)
        } else {
          element.position.set(targetPosition.x, targetPosition.y, targetPosition.z)
          resolve()
        }
      }

      requestAnimationFrame(animate)
    })

    return {
      success: true,
      data: { target, from: initialPosition, to: targetPosition, action: 'move' },
      duration: Date.now() - startTime,
      library: 'three',
      timestamp: Date.now()
    }
  } catch (error) {
    return {
      success: false,
      data: { error: error instanceof Error ? error.message : 'Unknown error' },
      duration: Date.now() - startTime,
      library: 'three',
      timestamp: Date.now()
    }
  }
}

export async function executeScale(context: AnimationContext, target: string, from: number, to: number, duration: number, easing: string): Promise<AnimationResult> {
  const startTime = Date.now()

  if (!context.container || !context.elements) {
    return { success: false, data: { error: 'No container or elements provided' }, duration: 0, library: 'three', timestamp: Date.now() }
  }

  try {
    const element = context.elements.get(target)

    if (!element || !(element instanceof THREE.Object3D)) {
      return { success: false, data: { error: 'Element not found or not a Three.js object' }, duration: 0, library: 'three', timestamp: Date.now() }
    }

    await new Promise<void>((resolve) => {
      const startTime = Date.now()

      const animate = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / duration, 1)

        const easedProgress = 1 - Math.pow(1 - progress, 3)
        const currentScale = from + (to - from) * easedProgress

        element.scale.setScalar(currentScale)

        if (progress < 1) {
          requestAnimationFrame(animate)
        } else {
          element.scale.setScalar(to)
          resolve()
        }
      }

      requestAnimationFrame(animate)
    })

    return {
      success: true,
      data: { target, from, to, action: 'scale' },
      duration: Date.now() - startTime,
      library: 'three',
      timestamp: Date.now()
    }
  } catch (error) {
    return {
      success: false,
      data: { error: error instanceof Error ? error.message : 'Unknown error' },
      duration: Date.now() - startTime,
      library: 'three',
      timestamp: Date.now()
    }
  }
}

export async function executeRotate(context: AnimationContext, target: string, from: number, to: number, duration: number, easing: string): Promise<AnimationResult> {
  const startTime = Date.now()

  if (!context.container || !context.elements) {
    return { success: false, data: { error: 'No container or elements provided' }, duration: 0, library: 'three', timestamp: Date.now() }
  }

  try {
    const element = context.elements.get(target)

    if (!element || !(element instanceof THREE.Object3D)) {
      return { success: false, data: { error: 'Element not found or not a Three.js object' }, duration: 0, library: 'three', timestamp: Date.now() }
    }

    const fromRadians = (from * Math.PI) / 180
    const toRadians = (to * Math.PI) / 180

    await new Promise<void>((resolve) => {
      const startTime = Date.now()

      const animate = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / duration, 1)

        const easedProgress = 1 - Math.pow(1 - progress, 3)
        const currentRotation = fromRadians + (toRadians - fromRadians) * easedProgress

        element.rotation.z = currentRotation

        if (progress < 1) {
          requestAnimationFrame(animate)
        } else {
          element.rotation.z = toRadians
          resolve()
        }
      }

      requestAnimationFrame(animate)
    })

    return {
      success: true,
      data: { target, from, to, action: 'rotate' },
      duration: Date.now() - startTime,
      library: 'three',
      timestamp: Date.now()
    }
  } catch (error) {
    return {
      success: false,
      data: { error: error instanceof Error ? error.message : 'Unknown error' },
      duration: Date.now() - startTime,
      library: 'three',
      timestamp: Date.now()
    }
  }
}

// ============================================================================
// ⏰ TEMPORAL ATOMS - Three.js Implementation
// ============================================================================

export async function executeDelay(duration: number): Promise<AnimationResult> {
  const startTime = Date.now()

  await new Promise(resolve => setTimeout(resolve, duration))

  return {
    success: true,
    data: { action: 'delay', duration },
    duration: Date.now() - startTime,
    library: 'three',
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
        library: 'three',
        timestamp: Date.now()
      })
      return
    }

    // Three.js raycasting would be needed for proper 3D click detection
    // For now, we'll use a simplified approach
    const canvas = context.container.querySelector('canvas')

    if (!canvas) {
      resolve({
        success: false,
        data: { error: 'No canvas found' },
        duration: Date.now() - startTime,
        library: 'three',
        timestamp: Date.now()
      })
      return
    }

    const handleClick = (event: Event) => {
      canvas.removeEventListener('click', handleClick)
      resolve({
        success: true,
        data: { target, action: 'waitForClick' },
        duration: Date.now() - startTime,
        library: 'three',
        timestamp: Date.now()
      })
    }

    canvas.addEventListener('click', handleClick)
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
        library: 'three',
        timestamp: Date.now()
      })
      return
    }

    const canvas = context.container.querySelector('canvas')

    if (!canvas) {
      resolve({
        success: false,
        data: { error: 'No canvas found' },
        duration: Date.now() - startTime,
        library: 'three',
        timestamp: Date.now()
      })
      return
    }

    const handleMouseEnter = (event: Event) => {
      canvas.removeEventListener('mouseenter', handleMouseEnter)
      resolve({
        success: true,
        data: { target, action: 'waitForHover' },
        duration: Date.now() - startTime,
        library: 'three',
        timestamp: Date.now()
      })
    }

    canvas.addEventListener('mouseenter', handleMouseEnter)
  })
}

// ============================================================================
// 🎨 SPECIALIZED THREE.JS ANIMATIONS
// ============================================================================

export async function executeParticleExplosion(context: AnimationContext, target: string, particleCount: number = 20): Promise<AnimationResult> {
  const startTime = Date.now()

  if (!context.container || !context.elements) {
    return { success: false, data: { error: 'No container or elements provided' }, duration: 0, library: 'three', timestamp: Date.now() }
  }

  try {
    const element = context.elements.get(target)

    if (!element || !(element instanceof THREE.Object3D)) {
      return { success: false, data: { error: 'Element not found or not a Three.js object' }, duration: 0, library: 'three', timestamp: Date.now() }
    }

    const scene = (context.container as any).__scene
    if (!scene) {
      return { success: false, data: { error: 'No Three.js scene found' }, duration: 0, library: 'three', timestamp: Date.now() }
    }

    // Create particle system for explosion effect
    const particles: THREE.Vector3[] = []
    const particleMeshes: THREE.Mesh[] = []

    for (let i = 0; i < particleCount; i++) {
      const particle = new THREE.Vector3(
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2
      ).normalize().multiplyScalar(2)

      particles.push(particle)

      const particleGeometry = new THREE.SphereGeometry(0.05)
      const particleMaterial = new THREE.MeshBasicMaterial({ color: Math.random() * 0xffffff })
      const particleMesh = new THREE.Mesh(particleGeometry, particleMaterial)

      particleMesh.position.copy(element.position)
      scene.add(particleMesh)
      particleMeshes.push(particleMesh)
    }

    // Animate particles
    await new Promise<void>((resolve) => {
      const startTime = Date.now()
      const duration = 1000

      const animate = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / duration, 1)

        particleMeshes.forEach((mesh, index) => {
          const particle = particles[index]
          const distance = progress * 3

          mesh.position.x = element.position.x + particle.x * distance
          mesh.position.y = element.position.y + particle.y * distance
          mesh.position.z = element.position.z + particle.z * distance

          ;(mesh.material as any).opacity = 1 - progress
          ;(mesh.material as any).transparent = true
        })

        if (progress < 1) {
          requestAnimationFrame(animate)
        } else {
          // Clean up particles
          particleMeshes.forEach(mesh => scene.remove(mesh))
          resolve()
        }
      }

      requestAnimationFrame(animate)
    })

    return {
      success: true,
      data: { target, particleCount, action: 'particleExplosion' },
      duration: Date.now() - startTime,
      library: 'three',
      timestamp: Date.now()
    }
  } catch (error) {
    return {
      success: false,
      data: { error: error instanceof Error ? error.message : 'Unknown error' },
      duration: Date.now() - startTime,
      library: 'three',
      timestamp: Date.now()
    }
  }
}

export async function execute3DTextMorph(context: AnimationContext, target: string, fromText: string, toText: string, duration: number): Promise<AnimationResult> {
  const startTime = Date.now()

  if (!context.container || !context.elements) {
    return { success: false, data: { error: 'No container or elements provided' }, duration: 0, library: 'three', timestamp: Date.now() }
  }

  try {
    const element = context.elements.get(target)

    if (!element || !(element instanceof THREE.Object3D)) {
      return { success: false, data: { error: 'Element not found or not a Three.js object' }, duration: 0, library: 'three', timestamp: Date.now() }
    }

    // For 3D text morphing, we'll animate scale and position
    const originalScale = element.scale.clone()
    const originalPosition = element.position.clone()

    await new Promise<void>((resolve) => {
      const startTime = Date.now()

      const animate = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / duration, 1)

        // Morphing animation: scale down, move, then scale back up
        if (progress < 0.5) {
          const morphProgress = progress * 2
          element.scale.lerpVectors(originalScale, new THREE.Vector3(0.1, 0.1, 0.1), morphProgress)
          element.position.lerpVectors(originalPosition, new THREE.Vector3(0, -2, 0), morphProgress)
        } else {
          const morphProgress = (progress - 0.5) * 2
          element.scale.lerpVectors(new THREE.Vector3(0.1, 0.1, 0.1), originalScale, morphProgress)
          element.position.lerpVectors(new THREE.Vector3(0, -2, 0), originalPosition, morphProgress)
        }

        if (progress < 1) {
          requestAnimationFrame(animate)
        } else {
          element.scale.copy(originalScale)
          element.position.copy(originalPosition)
          resolve()
        }
      }

      requestAnimationFrame(animate)
    })

    return {
      success: true,
      data: { target, fromText, toText, action: '3dTextMorph' },
      duration: Date.now() - startTime,
      library: 'three',
      timestamp: Date.now()
    }
  } catch (error) {
    return {
      success: false,
      data: { error: error instanceof Error ? error.message : 'Unknown error' },
      duration: Date.now() - startTime,
      library: 'three',
      timestamp: Date.now()
    }
  }
}
