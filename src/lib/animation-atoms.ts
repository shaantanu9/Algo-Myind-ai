/**
 * ANIMATION ATOMS - The Fundamental Building Blocks
 * Like letters in an alphabet, these atomic functions combine to create complex animations
 */

// ============================================================================
// 🎯 ATOMIC ANIMATION PRIMITIVES (The "Alphabet")
// ============================================================================

export interface AnimationAtom {
  id: string
  type: 'visual' | 'temporal' | 'spatial' | 'state' | 'interactive'
  execute: (params: any) => AnimationResult
  duration: number
  dependencies: string[]
}

export interface AnimationResult {
  success: boolean
  data: any
  duration: number
  sideEffects?: AnimationSideEffect[]
}

export interface AnimationSideEffect {
  type: 'highlight' | 'sound' | 'vibration' | 'callback'
  payload: any
  timing: number
}

// ============================================================================
// 🎨 VISUAL ATOMS (Color, Shape, Size, Position)
// ============================================================================

export class VisualAtoms {
  // Color atoms
  static colorChange = (elementId: string, fromColor: string, toColor: string, duration: number): AnimationAtom => ({
    id: `color-${elementId}`,
    type: 'visual',
    duration,
    dependencies: [],
    execute: ({ renderer }) => {
      renderer.animate(elementId, 'color', fromColor, toColor, duration)
      return { success: true, data: { elementId, fromColor, toColor }, duration }
    }
  })

  static opacityFade = (elementId: string, from: number, to: number, duration: number): AnimationAtom => ({
    id: `opacity-${elementId}`,
    type: 'visual',
    duration,
    dependencies: [],
    execute: ({ renderer }) => {
      renderer.animate(elementId, 'opacity', from, to, duration)
      return { success: true, data: { elementId, from, to }, duration }
    }
  })

  static scaleTransform = (elementId: string, from: number, to: number, duration: number): AnimationAtom => ({
    id: `scale-${elementId}`,
    type: 'visual',
    duration,
    dependencies: [],
    execute: ({ renderer }) => {
      renderer.animate(elementId, 'scale', from, to, duration)
      return { success: true, data: { elementId, from, to }, duration }
    }
  })

  static positionMove = (elementId: string, from: Position, to: Position, duration: number): AnimationAtom => ({
    id: `position-${elementId}`,
    type: 'visual',
    duration,
    dependencies: [],
    execute: ({ renderer }) => {
      renderer.animate(elementId, 'position', from, to, duration)
      return { success: true, data: { elementId, from, to }, duration }
    }
  })

  static rotationSpin = (elementId: string, degrees: number, duration: number): AnimationAtom => ({
    id: `rotation-${elementId}`,
    type: 'visual',
    duration,
    dependencies: [],
    execute: ({ renderer }) => {
      renderer.animate(elementId, 'rotation', 0, degrees, duration)
      return { success: true, data: { elementId, degrees }, duration }
    }
  })

  static glowEffect = (elementId: string, intensity: number, duration: number): AnimationAtom => ({
    id: `glow-${elementId}`,
    type: 'visual',
    duration,
    dependencies: [],
    execute: ({ renderer }) => {
      renderer.animate(elementId, 'glow', 0, intensity, duration)
      return { success: true, data: { elementId, intensity }, duration }
    }
  })

  static borderPulse = (elementId: string, thickness: number, duration: number): AnimationAtom => ({
    id: `border-${elementId}`,
    type: 'visual',
    duration,
    dependencies: [],
    execute: ({ renderer }) => {
      renderer.animate(elementId, 'borderWidth', 1, thickness, duration / 2)
      setTimeout(() => renderer.animate(elementId, 'borderWidth', thickness, 1, duration / 2), duration / 2)
      return { success: true, data: { elementId, thickness }, duration }
    }
  })
}

// ============================================================================
// ⏰ TEMPORAL ATOMS (Timing, Sequencing, Delays)
// ============================================================================

export class TemporalAtoms {
  static delay = (milliseconds: number): AnimationAtom => ({
    id: `delay-${milliseconds}`,
    type: 'temporal',
    duration: milliseconds,
    dependencies: [],
    execute: () => new Promise(resolve =>
      setTimeout(() => resolve({ success: true, data: {}, duration: milliseconds }), milliseconds)
    )
  })

  static parallel = (...atoms: AnimationAtom[]): AnimationAtom => ({
    id: `parallel-${atoms.map(a => a.id).join('-')}`,
    type: 'temporal',
    duration: Math.max(...atoms.map(a => a.duration)),
    dependencies: atoms.flatMap(a => a.dependencies),
    execute: async (params) => {
      const promises = atoms.map(atom => atom.execute(params))
      const results = await Promise.all(promises)
      return {
        success: results.every(r => r.success),
        data: results.map(r => r.data),
        duration: Math.max(...results.map(r => r.duration))
      }
    }
  })

  static sequence = (...atoms: AnimationAtom[]): AnimationAtom => ({
    id: `sequence-${atoms.map(a => a.id).join('-')}`,
    type: 'temporal',
    duration: atoms.reduce((sum, atom) => sum + atom.duration, 0),
    dependencies: atoms.flatMap(a => a.dependencies),
    execute: async (params) => {
      const results = []
      for (const atom of atoms) {
        const result = await atom.execute(params)
        results.push(result)
      }
      return {
        success: results.every(r => r.success),
        data: results.map(r => r.data),
        duration: results.reduce((sum, r) => sum + r.duration, 0)
      }
    }
  })

  static repeat = (atom: AnimationAtom, times: number): AnimationAtom => ({
    id: `repeat-${atom.id}-${times}`,
    type: 'temporal',
    duration: atom.duration * times,
    dependencies: atom.dependencies,
    execute: async (params) => {
      const results = []
      for (let i = 0; i < times; i++) {
        const result = await atom.execute(params)
        results.push(result)
      }
      return {
        success: results.every(r => r.success),
        data: results.map(r => r.data),
        duration: results.reduce((sum, r) => sum + r.duration, 0)
      }
    }
  })

  static loop = (atom: AnimationAtom, condition: () => boolean): AnimationAtom => ({
    id: `loop-${atom.id}`,
    type: 'temporal',
    duration: 0, // Will be calculated dynamically
    dependencies: atom.dependencies,
    execute: async (params) => {
      const results = []
      let totalDuration = 0

      while (condition()) {
        const result = await atom.execute(params)
        results.push(result)
        totalDuration += result.duration
      }

      return {
        success: results.every(r => r.success),
        data: results.map(r => r.data),
        duration: totalDuration
      }
    }
  })
}

// ============================================================================
// 📍 SPATIAL ATOMS (Layout, Positioning, Movement)
// ============================================================================

export class SpatialAtoms {
  static moveTo = (elementId: string, targetPosition: Position, duration: number): AnimationAtom => ({
    id: `moveTo-${elementId}`,
    type: 'spatial',
    duration,
    dependencies: [],
    execute: ({ renderer }) => {
      const currentPos = renderer.getPosition(elementId)
      renderer.animate(elementId, 'position', currentPos, targetPosition, duration)
      return { success: true, data: { elementId, from: currentPos, to: targetPosition }, duration }
    }
  })

  static moveBy = (elementId: string, delta: Position, duration: number): AnimationAtom => ({
    id: `moveBy-${elementId}`,
    type: 'spatial',
    duration,
    dependencies: [],
    execute: ({ renderer }) => {
      const currentPos = renderer.getPosition(elementId)
      const targetPos = {
        x: currentPos.x + delta.x,
        y: currentPos.y + (delta.y || 0),
        z: (currentPos.z || 0) + (delta.z || 0)
      }
      renderer.animate(elementId, 'position', currentPos, targetPos, duration)
      return { success: true, data: { elementId, delta, target: targetPos }, duration }
    }
  })

  static alignTo = (elementId: string, targetId: string, alignment: 'left' | 'right' | 'top' | 'bottom' | 'center', duration: number): AnimationAtom => ({
    id: `align-${elementId}-to-${targetId}`,
    type: 'spatial',
    duration,
    dependencies: [targetId],
    execute: ({ renderer }) => {
      const targetBounds = renderer.getBounds(targetId)
      const elementBounds = renderer.getBounds(elementId)
      let targetPos = renderer.getPosition(elementId)

      switch (alignment) {
        case 'left':
          targetPos.x = targetBounds.left - elementBounds.width / 2
          break
        case 'right':
          targetPos.x = targetBounds.right + elementBounds.width / 2
          break
        case 'top':
          targetPos.y = targetBounds.top - elementBounds.height / 2
          break
        case 'bottom':
          targetPos.y = targetBounds.bottom + elementBounds.height / 2
          break
        case 'center':
          targetPos.x = targetBounds.center.x
          targetPos.y = targetBounds.center.y
          break
      }

      renderer.animate(elementId, 'position', renderer.getPosition(elementId), targetPos, duration)
      return { success: true, data: { elementId, targetId, alignment, position: targetPos }, duration }
    }
  })

  static distribute = (elementIds: string[], layout: 'horizontal' | 'vertical' | 'circular', spacing: number, duration: number): AnimationAtom => ({
    id: `distribute-${layout}-${elementIds.length}`,
    type: 'spatial',
    duration,
    dependencies: [],
    execute: ({ renderer }) => {
      const positions = calculateDistribution(elementIds.length, layout, spacing, renderer)
      elementIds.forEach((id, index) => {
        const currentPos = renderer.getPosition(id)
        renderer.animate(id, 'position', currentPos, positions[index], duration)
      })
      return { success: true, data: { elementIds, layout, positions }, duration }
    }
  })

  static pathAnimation = (elementId: string, path: Position[], duration: number): AnimationAtom => ({
    id: `path-${elementId}`,
    type: 'spatial',
    duration,
    dependencies: [],
    execute: ({ renderer }) => {
      let currentPos = renderer.getPosition(elementId)
      const segmentDuration = duration / (path.length - 1)

      path.forEach((targetPos, index) => {
        if (index > 0) {
          setTimeout(() => {
            renderer.animate(elementId, 'position', currentPos, targetPos, segmentDuration)
            currentPos = targetPos
          }, index * segmentDuration)
        }
      })

      return { success: true, data: { elementId, path }, duration }
    }
  })
}

// ============================================================================
// 🔄 STATE ATOMS (Data, Algorithm State, UI State)
// ============================================================================

export class StateAtoms {
  static highlightElement = (elementId: string, style: 'success' | 'error' | 'warning' | 'info' | 'active', duration: number): AnimationAtom => ({
    id: `highlight-${elementId}-${style}`,
    type: 'state',
    duration,
    dependencies: [],
    execute: ({ renderer, stateManager }) => {
      const originalStyle = renderer.getStyle(elementId)
      const highlightStyle = getHighlightStyle(style)

      renderer.setStyle(elementId, highlightStyle)
      stateManager.setElementState(elementId, 'highlighted', true)

      setTimeout(() => {
        renderer.setStyle(elementId, originalStyle)
        stateManager.setElementState(elementId, 'highlighted', false)
      }, duration)

      return {
        success: true,
        data: { elementId, style, originalStyle, highlightStyle },
        duration,
        sideEffects: [{
          type: 'highlight',
          payload: { elementId, style },
          timing: 0
        }]
      }
    }
  })

  static toggleVisibility = (elementId: string, visible: boolean, duration: number): AnimationAtom => ({
    id: `visibility-${elementId}-${visible}`,
    type: 'state',
    duration,
    dependencies: [],
    execute: ({ renderer, stateManager }) => {
      renderer.animate(elementId, 'opacity', visible ? 0 : 1, visible ? 1 : 0, duration)
      stateManager.setElementState(elementId, 'visible', visible)
      return { success: true, data: { elementId, visible }, duration }
    }
  })

  static updateData = (elementId: string, newData: any, duration: number): AnimationAtom => ({
    id: `update-${elementId}`,
    type: 'state',
    duration,
    dependencies: [],
    execute: ({ renderer, stateManager }) => {
      const oldData = renderer.getData(elementId)
      renderer.animate(elementId, 'data', oldData, newData, duration)
      stateManager.updateElementData(elementId, newData)
      return { success: true, data: { elementId, oldData, newData }, duration }
    }
  })

  static stateTransition = (elementId: string, fromState: string, toState: string, duration: number): AnimationAtom => ({
    id: `transition-${elementId}-${fromState}-to-${toState}`,
    type: 'state',
    duration,
    dependencies: [],
    execute: ({ renderer, stateManager }) => {
      const transition = getStateTransition(fromState, toState)
      renderer.animate(elementId, 'state', fromState, toState, duration, transition.easing)
      stateManager.setElementState(elementId, 'currentState', toState)
      return { success: true, data: { elementId, fromState, toState, transition }, duration }
    }
  })
}

// ============================================================================
// 🎮 INTERACTIVE ATOMS (User Input, Events, Feedback)
// ============================================================================

export class InteractiveAtoms {
  static waitForClick = (elementId: string): AnimationAtom => ({
    id: `wait-click-${elementId}`,
    type: 'interactive',
    duration: 0, // Will be set when click happens
    dependencies: [],
    execute: ({ renderer, eventManager }) => {
      return new Promise(resolve => {
        const clickHandler = () => {
          eventManager.removeEventListener(elementId, 'click', clickHandler)
          resolve({ success: true, data: { elementId, event: 'click' }, duration: 0 })
        }
        eventManager.addEventListener(elementId, 'click', clickHandler)
      })
    }
  })

  static hoverEffect = (elementId: string, effect: 'glow' | 'scale' | 'color', duration: number): AnimationAtom => ({
    id: `hover-${elementId}-${effect}`,
    type: 'interactive',
    duration,
    dependencies: [],
    execute: ({ renderer, eventManager }) => {
      const mouseEnterHandler = () => {
        switch (effect) {
          case 'glow':
            renderer.animate(elementId, 'glow', 0, 1, duration)
            break
          case 'scale':
            renderer.animate(elementId, 'scale', 1, 1.1, duration)
            break
          case 'color':
            renderer.animate(elementId, 'color', renderer.getStyle(elementId).fill, '#3b82f6', duration)
            break
        }
      }

      const mouseLeaveHandler = () => {
        switch (effect) {
          case 'glow':
            renderer.animate(elementId, 'glow', 1, 0, duration)
            break
          case 'scale':
            renderer.animate(elementId, 'scale', 1.1, 1, duration)
            break
          case 'color':
            renderer.animate(elementId, 'color', '#3b82f6', renderer.getStyle(elementId).fill, duration)
            break
        }
      }

      eventManager.addEventListener(elementId, 'mouseenter', mouseEnterHandler)
      eventManager.addEventListener(elementId, 'mouseleave', mouseLeaveHandler)

      return {
        success: true,
        data: { elementId, effect },
        duration,
        sideEffects: [{
          type: 'callback',
          payload: () => {
            eventManager.removeEventListener(elementId, 'mouseenter', mouseEnterHandler)
            eventManager.removeEventListener(elementId, 'mouseleave', mouseLeaveHandler)
          },
          timing: duration
        }]
      }
    }
  })

  static dragInteraction = (elementId: string): AnimationAtom => ({
    id: `drag-${elementId}`,
    type: 'interactive',
    duration: 0,
    dependencies: [],
    execute: ({ renderer, eventManager }) => {
      let isDragging = false
      let startPos = { x: 0, y: 0 }
      let elementStartPos = { x: 0, y: 0 }

      const mouseDownHandler = (event: any) => {
        isDragging = true
        startPos = { x: event.clientX, y: event.clientY }
        elementStartPos = renderer.getPosition(elementId)
        document.addEventListener('mousemove', mouseMoveHandler)
        document.addEventListener('mouseup', mouseUpHandler)
      }

      const mouseMoveHandler = (event: any) => {
        if (!isDragging) return

        const deltaX = event.clientX - startPos.x
        const deltaY = event.clientY - startPos.y

        const newPos = {
          x: elementStartPos.x + deltaX,
          y: elementStartPos.y + deltaY
        }

        renderer.setPosition(elementId, newPos)
      }

      const mouseUpHandler = () => {
        isDragging = false
        document.removeEventListener('mousemove', mouseMoveHandler)
        document.removeEventListener('mouseup', mouseUpHandler)
      }

      eventManager.addEventListener(elementId, 'mousedown', mouseDownHandler)

      return {
        success: true,
        data: { elementId, interactive: true },
        duration: 0,
        sideEffects: [{
          type: 'callback',
          payload: () => {
            eventManager.removeEventListener(elementId, 'mousedown', mouseDownHandler)
          },
          timing: 0
        }]
      }
    }
  })

  static keyboardNavigation = (elementIds: string[]): AnimationAtom => ({
    id: `keyboard-nav-${elementIds.join('-')}`,
    type: 'interactive',
    duration: 0,
    dependencies: [],
    execute: ({ renderer, eventManager, stateManager }) => {
      let currentIndex = 0

      const keyHandler = (event: KeyboardEvent) => {
        switch (event.key) {
          case 'ArrowRight':
          case 'ArrowDown':
            currentIndex = (currentIndex + 1) % elementIds.length
            break
          case 'ArrowLeft':
          case 'ArrowUp':
            currentIndex = (currentIndex - 1 + elementIds.length) % elementIds.length
            break
          case 'Enter':
          case ' ':
            stateManager.triggerAction(elementIds[currentIndex], 'select')
            return
          default:
            return
        }

        // Update focus
        elementIds.forEach((id, index) => {
          if (index === currentIndex) {
            StateAtoms.highlightElement(id, 'active', 200).execute({ renderer, stateManager })
          } else {
            StateAtoms.highlightElement(id, 'info', 100).execute({ renderer, stateManager })
          }
        })
      }

      document.addEventListener('keydown', keyHandler)

      return {
        success: true,
        data: { elementIds, navigation: true },
        duration: 0,
        sideEffects: [{
          type: 'callback',
          payload: () => document.removeEventListener('keydown', keyHandler),
          timing: 0
        }]
      }
    }
  })
}

// ============================================================================
// 🔧 UTILITY FUNCTIONS
// ============================================================================

function calculateDistribution(count: number, layout: string, spacing: number, renderer: any): Position[] {
  const positions: Position[] = []

  switch (layout) {
    case 'horizontal':
      for (let i = 0; i < count; i++) {
        positions.push({ x: i * spacing, y: 0, z: 0 })
      }
      break
    case 'vertical':
      for (let i = 0; i < count; i++) {
        positions.push({ x: 0, y: i * spacing, z: 0 })
      }
      break
    case 'circular':
      const radius = (count * spacing) / (2 * Math.PI)
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * 2 * Math.PI
        positions.push({
          x: Math.cos(angle) * radius,
          y: Math.sin(angle) * radius,
          z: 0
        })
      }
      break
  }

  return positions
}

function getHighlightStyle(style: string) {
  const styles = {
    success: { fill: '#22c55e', stroke: '#16a34a', strokeWidth: 3 },
    error: { fill: '#ef4444', stroke: '#dc2626', strokeWidth: 3 },
    warning: { fill: '#f59e0b', stroke: '#d97706', strokeWidth: 3 },
    info: { fill: '#3b82f6', stroke: '#2563eb', strokeWidth: 2 },
    active: { fill: '#8b5cf6', stroke: '#7c3aed', strokeWidth: 3, glow: 0.5 }
  }
  return styles[style] || styles.info
}

function getStateTransition(fromState: string, toState: string) {
  // Define common state transitions
  const transitions = {
    'idle->active': { easing: 'ease-out', duration: 300 },
    'active->processing': { easing: 'ease-in', duration: 200 },
    'processing->complete': { easing: 'ease-out', duration: 400 },
    'complete->idle': { easing: 'ease-in-out', duration: 500 }
  }

  return transitions[`${fromState}->${toState}`] || { easing: 'ease-in-out', duration: 300 }
}

// ============================================================================
// 🎯 POSITION INTERFACE
// ============================================================================

export interface Position {
  x: number
  y: number
  z?: number
}

// ============================================================================
// 📤 EXPORT ATOM COLLECTIONS
// ============================================================================

export const AnimationAlphabet = {
  Visual: VisualAtoms,
  Temporal: TemporalAtoms,
  Spatial: SpatialAtoms,
  State: StateAtoms,
  Interactive: InteractiveAtoms
}

export { AnimationAtom, AnimationResult, AnimationSideEffect }
