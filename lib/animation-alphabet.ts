/**
 * 🎭 ANIMATION ALPHABET - Atomic Building Blocks System
 *
 * Just like letters combine to make words, and words combine to make sentences,
 * these atomic building blocks combine to create complex DSA animations.
 *
 * This system provides the fundamental "letters" of animation that can be
 * combined in infinite ways to explain any DSA algorithm.
 */

// ============================================================================
// 📝 ANIMATION ATOM INTERFACES
// ============================================================================

export interface AnimationAtom {
  id: string
  type: 'visual' | 'spatial' | 'temporal' | 'interactive' | 'composite'
  library: 'mermaid' | 'reactflow' | 'd3' | 'three' | 'universal'
  target?: string
  properties: Record<string, any>
  duration?: number
  delay?: number
  easing?: string
  execute: (context: AnimationContext) => Promise<AnimationResult>
}

export interface AnimationContext {
  library: 'mermaid' | 'reactflow' | 'd3' | 'three'
  container?: any
  elements?: Map<string, any>
  step?: number
  data?: any
  previousResult?: AnimationResult
}

export interface AnimationResult {
  success: boolean
  data: any
  duration: number
  library: string
  timestamp: number
}

// ============================================================================
// 🔤 BASIC ATOMS (The Alphabet Letters)
// ============================================================================

export class AnimationAtoms {

  // ===============================
  // 👁️ VISUAL ATOMS
  // ===============================

  static fadeIn(target: string, duration: number = 500, easing: string = 'easeOutCubic'): AnimationAtom {
    return {
      id: `fade-in-${target}-${Date.now()}`,
      type: 'visual',
      library: 'universal',
      target,
      properties: { opacity: [0, 1] },
      duration,
      easing,
      execute: async (context) => await executeFadeIn(context, target, duration, easing)
    }
  }

  static fadeOut(target: string, duration: number = 500, easing: string = 'easeOutCubic'): AnimationAtom {
    return {
      id: `fade-out-${target}-${Date.now()}`,
      type: 'visual',
      library: 'universal',
      target,
      properties: { opacity: [1, 0] },
      duration,
      easing,
      execute: async (context) => await executeFadeOut(context, target, duration, easing)
    }
  }

  static highlight(target: string, color: string = '#3b82f6', duration: number = 500): AnimationAtom {
    return {
      id: `highlight-${target}-${Date.now()}`,
      type: 'visual',
      library: 'universal',
      target,
      properties: { highlightColor: color, originalColor: null },
      duration,
      execute: async (context) => await executeHighlight(context, target, color, duration)
    }
  }

  static color(target: string, fromColor: string, toColor: string, duration: number = 500): AnimationAtom {
    return {
      id: `color-${target}-${Date.now()}`,
      type: 'visual',
      library: 'universal',
      target,
      properties: { fromColor, toColor },
      duration,
      execute: async (context) => await executeColor(context, target, fromColor, toColor, duration)
    }
  }

  static glow(target: string, intensity: number = 0.5, duration: number = 500): AnimationAtom {
    return {
      id: `glow-${target}-${Date.now()}`,
      type: 'visual',
      library: 'universal',
      target,
      properties: { intensity },
      duration,
      execute: async (context) => await executeGlow(context, target, intensity, duration)
    }
  }

  // ===============================
  // 📐 SPATIAL ATOMS
  // ===============================

  static move(target: string, from: { x: number, y: number, z?: number }, to: { x: number, y: number, z?: number }, duration: number = 500, easing: string = 'easeOutCubic'): AnimationAtom {
    return {
      id: `move-${target}-${Date.now()}`,
      type: 'spatial',
      library: 'universal',
      target,
      properties: { from, to },
      duration,
      easing,
      execute: async (context) => await executeMove(context, target, from, to, duration, easing)
    }
  }

  static scale(target: string, from: number, to: number, duration: number = 500, easing: string = 'easeOutBack'): AnimationAtom {
    return {
      id: `scale-${target}-${Date.now()}`,
      type: 'spatial',
      library: 'universal',
      target,
      properties: { from, to },
      duration,
      easing,
      execute: async (context) => await executeScale(context, target, from, to, duration, easing)
    }
  }

  static rotate(target: string, from: number, to: number, duration: number = 500, easing: string = 'easeOutCubic'): AnimationAtom {
    return {
      id: `rotate-${target}-${Date.now()}`,
      type: 'spatial',
      library: 'universal',
      target,
      properties: { from, to },
      duration,
      easing,
      execute: async (context) => await executeRotate(context, target, from, to, duration, easing)
    }
  }

  // ===============================
  // ⏰ TEMPORAL ATOMS
  // ===============================

  static delay(duration: number): AnimationAtom {
    return {
      id: `delay-${duration}-${Date.now()}`,
      type: 'temporal',
      library: 'universal',
      properties: { duration },
      duration,
      execute: async (context) => await executeDelay(duration)
    }
  }

  static waitForClick(target: string): AnimationAtom {
    return {
      id: `wait-click-${target}-${Date.now()}`,
      type: 'interactive',
      library: 'universal',
      target,
      properties: { interaction: 'click' },
      execute: async (context) => await executeWaitForClick(context, target)
    }
  }

  static waitForHover(target: string): AnimationAtom {
    return {
      id: `wait-hover-${target}-${Date.now()}`,
      type: 'interactive',
      library: 'universal',
      target,
      properties: { interaction: 'hover' },
      execute: async (context) => await executeWaitForHover(context, target)
    }
  }

  // ===============================
  // 🔄 COMPOSITE ATOMS
  // ===============================

  static sequence(...atoms: AnimationAtom[]): AnimationAtom {
    return {
      id: `sequence-${atoms.length}-${Date.now()}`,
      type: 'composite',
      library: 'universal',
      properties: { atoms, type: 'sequence' },
      execute: async (context) => await executeSequence(context, atoms)
    }
  }

  static parallel(...atoms: AnimationAtom[]): AnimationAtom {
    return {
      id: `parallel-${atoms.length}-${Date.now()}`,
      type: 'composite',
      library: 'universal',
      properties: { atoms, type: 'parallel' },
      execute: async (context) => await executeParallel(context, atoms)
    }
  }

  static repeat(atom: AnimationAtom, count: number): AnimationAtom {
    return {
      id: `repeat-${atom.id}-${count}-${Date.now()}`,
      type: 'composite',
      library: 'universal',
      properties: { atom, count, type: 'repeat' },
      execute: async (context) => await executeRepeat(context, atom, count)
    }
  }

  static stagger(atoms: AnimationAtom[], staggerDelay: number): AnimationAtom {
    return {
      id: `stagger-${atoms.length}-${staggerDelay}-${Date.now()}`,
      type: 'composite',
      library: 'universal',
      properties: { atoms, staggerDelay, type: 'stagger' },
      execute: async (context) => await executeStagger(context, atoms, staggerDelay)
    }
  }
}

// ============================================================================
// 🔤 ANIMATION WORDS (Letter Combinations)
// ============================================================================

export class AnimationWords {

  // ===============================
  // ✨ EMPHASIS WORDS
  // ===============================

  static emphasize(target: string, scale: number = 1.2, glow: number = 0.5): AnimationAtom {
    return AnimationAtoms.sequence(
      AnimationAtoms.scale(target, 1, scale, 300),
      AnimationAtoms.glow(target, glow, 300),
      AnimationAtoms.delay(500),
      AnimationAtoms.scale(target, scale, 1, 300),
      AnimationAtoms.glow(target, 0, 300)
    )
  }

  static pulse(target: string, times: number = 3): AnimationAtom {
    const pulses: AnimationAtom[] = []
    for (let i = 0; i < times; i++) {
      pulses.push(
        AnimationAtoms.scale(target, 1, 1.1, 200),
        AnimationAtoms.scale(target, 1.1, 1, 200)
      )
    }
    return AnimationAtoms.sequence(...pulses)
  }

  static bounce(target: string): AnimationAtom {
    return AnimationAtoms.sequence(
      AnimationAtoms.move(target, { x: 0, y: 0 }, { x: 0, y: -20 }, 300, 'easeOutCubic'),
      AnimationAtoms.move(target, { x: 0, y: -20 }, { x: 0, y: 0 }, 300, 'easeOutBounce')
    )
  }

  // ===============================
  // 🔄 TRANSITION WORDS
  // ===============================

  static slideIn(target: string, direction: 'left' | 'right' | 'up' | 'down', distance: number = 100): AnimationAtom {
    const getOffset = (dir: string, dist: number) => {
      switch (dir) {
        case 'left': return { x: -dist, y: 0 }
        case 'right': return { x: dist, y: 0 }
        case 'up': return { x: 0, y: -dist }
        case 'down': return { x: 0, y: dist }
        default: return { x: 0, y: 0 }
      }
    }

    return AnimationAtoms.parallel(
      AnimationAtoms.move(target, getOffset(direction, distance), { x: 0, y: 0 }, 600),
      AnimationAtoms.fadeIn(target, 400)
    )
  }

  static slideOut(target: string, direction: 'left' | 'right' | 'up' | 'down', distance: number = 100): AnimationAtom {
    const getOffset = (dir: string, dist: number) => {
      switch (dir) {
        case 'left': return { x: -dist, y: 0 }
        case 'right': return { x: dist, y: 0 }
        case 'up': return { x: 0, y: -dist }
        case 'down': return { x: 0, y: dist }
        default: return { x: 0, y: 0 }
      }
    }

    return AnimationAtoms.parallel(
      AnimationAtoms.move(target, { x: 0, y: 0 }, getOffset(direction, distance), 600),
      AnimationAtoms.fadeOut(target, 400)
    )
  }

  // ===============================
  // 🎯 COMPARISON WORDS
  // ===============================

  static compare(target1: string, target2: string): AnimationAtom {
    return AnimationAtoms.sequence(
      AnimationAtoms.highlight(target1, '#3b82f6', 400),
      AnimationAtoms.delay(200),
      AnimationAtoms.highlight(target2, '#3b82f6', 400),
      AnimationAtoms.delay(300),
      AnimationAtoms.highlight(target1, '#6b7280', 200),
      AnimationAtoms.highlight(target2, '#6b7280', 200)
    )
  }

  static swap(target1: string, target2: string): AnimationAtom {
    return AnimationAtoms.sequence(
      AnimationAtoms.highlight(target1, '#f59e0b', 300),
      AnimationAtoms.highlight(target2, '#f59e0b', 300),
      AnimationAtoms.parallel(
        AnimationAtoms.move(target1, { x: 0, y: 0 }, { x: 100, y: 0 }, 500),
        AnimationAtoms.move(target2, { x: 100, y: 0 }, { x: 0, y: 0 }, 500)
      ),
      AnimationAtoms.highlight(target1, '#10b981', 300),
      AnimationAtoms.highlight(target2, '#10b981', 300)
    )
  }

  static showDifference(different: string, others: string[]): AnimationAtom {
    const highlights: AnimationAtom[] = []

    // Highlight all others first
    others.forEach(other => {
      highlights.push(AnimationAtoms.highlight(other, '#6b7280', 300))
    })

    highlights.push(AnimationAtoms.delay(300))
    highlights.push(AnimationAtoms.highlight(different, '#ef4444', 600))
    highlights.push(AnimationAtoms.delay(300))
    highlights.push(AnimationAtoms.scale(different, 1, 1.2, 300))

    return AnimationAtoms.sequence(...highlights)
  }
}

// ============================================================================
// 📖 ANIMATION SENTENCES (DSA Patterns)
// ============================================================================

export class AnimationSentences {

  // ===============================
  // 🔍 SEARCH PATTERNS
  // ===============================

  static linearSearch(arrayElements: string[], targetElement: string, found: boolean): AnimationAtom {
    const searchSteps: AnimationAtom[] = []

    // Search through array
    arrayElements.forEach((element, index) => {
      searchSteps.push(
        AnimationAtoms.highlight(element, '#3b82f6', 300),
        AnimationAtoms.delay(200),
        AnimationAtoms.highlight(element, index === arrayElements.length - 1 && !found ? '#ef4444' : '#6b7280', 200)
      )
    })

    // If found, emphasize the target
    if (found) {
      searchSteps.push(
        AnimationAtoms.delay(300),
        AnimationAtoms.emphasize(targetElement, 1.3, 0.7),
        AnimationAtoms.highlight(targetElement, '#10b981', 800)
      )
    }

    return AnimationAtoms.sequence(...searchSteps)
  }

  static binarySearch(arrayElements: string[], midElement: string, found: boolean): AnimationAtom {
    const searchSteps: AnimationAtom[] = []

    // Show search space reduction
    searchSteps.push(
      AnimationAtoms.parallel(
        ...arrayElements.slice(0, arrayElements.indexOf(midElement)).map(el =>
          AnimationAtoms.highlight(el, '#6b7280', 300)
        ),
        ...arrayElements.slice(arrayElements.indexOf(midElement) + 1).map(el =>
          AnimationAtoms.highlight(el, '#6b7280', 300)
        )
      )
    )

    searchSteps.push(AnimationAtoms.delay(300))
    searchSteps.push(AnimationAtoms.emphasize(midElement, 1.2, 0.5))

    if (found) {
      searchSteps.push(
        AnimationAtoms.highlight(midElement, '#10b981', 800),
        AnimationAtoms.glow(midElement, 0.8, 1000)
      )
    } else {
      searchSteps.push(
        AnimationAtoms.highlight(midElement, '#ef4444', 500),
        AnimationAtoms.fadeOut(midElement, 300)
      )
    }

    return AnimationAtoms.sequence(...searchSteps)
  }

  // ===============================
  // 🔄 SORTING PATTERNS
  // ===============================

  static bubbleSortPass(arrayElements: string[], comparisonIndex: number, shouldSwap: boolean): AnimationAtom {
    const passSteps: AnimationAtom[] = []

    // Highlight comparison pair
    passSteps.push(
      AnimationAtoms.highlight(arrayElements[comparisonIndex], '#3b82f6', 400),
      AnimationAtoms.highlight(arrayElements[comparisonIndex + 1], '#3b82f6', 400)
    )

    passSteps.push(AnimationAtoms.delay(300))

    if (shouldSwap) {
      // Show swap animation
      passSteps.push(
        AnimationAtoms.swap(arrayElements[comparisonIndex], arrayElements[comparisonIndex + 1])
      )
    } else {
      // No swap needed
      passSteps.push(
        AnimationAtoms.highlight(arrayElements[comparisonIndex], '#10b981', 300),
        AnimationAtoms.highlight(arrayElements[comparisonIndex + 1], '#10b981', 300)
      )
    }

    return AnimationAtoms.sequence(...passSteps)
  }

  static insertionSort(arrayElements: string[], insertIndex: number, insertValue: string): AnimationAtom {
    const sortSteps: AnimationAtom[] = []

    // Show shifting elements
    for (let i = insertIndex - 1; i >= 0; i--) {
      sortSteps.push(
        AnimationAtoms.highlight(arrayElements[i], '#f59e0b', 300),
        AnimationAtoms.move(arrayElements[i], { x: 0, y: 0 }, { x: 60, y: 0 }, 400),
        AnimationAtoms.highlight(arrayElements[i], '#6b7280', 200)
      )
    }

    // Insert new element
    sortSteps.push(
      AnimationAtoms.fadeIn(insertValue, 300),
      AnimationAtoms.highlight(insertValue, '#10b981', 500)
    )

    return AnimationAtoms.sequence(...sortSteps)
  }

  // ===============================
  // 🧠 DP PATTERNS
  // ===============================

  static fillDPTable(cellId: string, dependencies: string[]): AnimationAtom {
    const fillSteps: AnimationAtom[] = []

    // Highlight dependencies
    dependencies.forEach(dep => {
      fillSteps.push(AnimationAtoms.highlight(dep, '#6b7280', 200))
    })

    fillSteps.push(AnimationAtoms.delay(300))

    // Fill the cell
    fillSteps.push(
      AnimationAtoms.highlight(cellId, '#3b82f6', 400),
      AnimationAtoms.delay(200),
      AnimationAtoms.scale(cellId, 1, 1.1, 300),
      AnimationAtoms.highlight(cellId, '#10b981', 500)
    )

    // Fade dependency highlights
    dependencies.forEach(dep => {
      fillSteps.push(AnimationAtoms.highlight(dep, '#374151', 100))
    })

    return AnimationAtoms.sequence(...fillSteps)
  }

  static traceOptimalPath(pathElements: string[]): AnimationAtom {
    const pathSteps: AnimationAtom[] = []

    // Sequential path highlighting
    pathElements.forEach((element, index) => {
      pathSteps.push(
        AnimationAtoms.delay(index * 300),
        AnimationAtoms.highlight(element, '#3b82f6', 400),
        AnimationAtoms.glow(element, 0.3, 300),
        AnimationAtoms.highlight(element, '#10b981', 300)
      )
    })

    // Final path celebration
    pathSteps.push(
      AnimationAtoms.delay(500),
      AnimationAtoms.parallel(
        ...pathElements.map(el => AnimationAtoms.glow(el, 0.5, 1000))
      )
    )

    return AnimationAtoms.sequence(...pathSteps)
  }

  // ===============================
  // 🌳 TREE/GRAPH PATTERNS
  // ===============================

  static traverseNode(nodeId: string, edgeId: string | null, visited: boolean): AnimationAtom {
    const traverseSteps: AnimationAtom[] = []

    traverseSteps.push(AnimationAtoms.highlight(nodeId, '#3b82f6', 400))

    if (edgeId) {
      traverseSteps.push(AnimationAtoms.highlight(edgeId, '#6b7280', 300))
    }

    traverseSteps.push(AnimationAtoms.delay(200))

    if (visited) {
      traverseSteps.push(AnimationAtoms.highlight(nodeId, '#10b981', 300))
    } else {
      traverseSteps.push(AnimationAtoms.highlight(nodeId, '#ef4444', 300))
    }

    return AnimationAtoms.sequence(...traverseSteps)
  }

  static dfsTraversal(nodeOrder: string[], edgeOrder: string[]): AnimationAtom {
    const traversalSteps: AnimationAtom[] = []

    nodeOrder.forEach((nodeId, index) => {
      const edgeId = edgeOrder[index] || null
      traversalSteps.push(AnimationSentences.traverseNode(nodeId, edgeId, true))
    })

    return AnimationAtoms.sequence(...traversalSteps)
  }
}

// ============================================================================
// 🎭 EXECUTION FUNCTIONS
// ============================================================================

// These functions need to be implemented for each library
async function executeFadeIn(context: AnimationContext, target: string, duration: number, easing: string): Promise<AnimationResult> {
  const startTime = Date.now()

  switch (context.library) {
    case 'mermaid':
      // Mermaid-specific fade in implementation
      return { success: true, data: { target, action: 'fadeIn' }, duration: Date.now() - startTime, library: 'mermaid', timestamp: Date.now() }

    case 'reactflow':
      // React Flow-specific fade in implementation
      return { success: true, data: { target, action: 'fadeIn' }, duration: Date.now() - startTime, library: 'reactflow', timestamp: Date.now() }

    case 'd3':
      // D3-specific fade in implementation
      return { success: true, data: { target, action: 'fadeIn' }, duration: Date.now() - startTime, library: 'd3', timestamp: Date.now() }

    case 'three':
      // Three.js-specific fade in implementation
      return { success: true, data: { target, action: 'fadeIn' }, duration: Date.now() - startTime, library: 'three', timestamp: Date.now() }

    default:
      return { success: false, data: { error: 'Unsupported library' }, duration: 0, library: context.library, timestamp: Date.now() }
  }
}

// Placeholder implementations - these need to be filled in for each library
async function executeFadeOut(context: AnimationContext, target: string, duration: number, easing: string): Promise<AnimationResult> {
  return { success: true, data: { target, action: 'fadeOut' }, duration, library: context.library, timestamp: Date.now() }
}

async function executeHighlight(context: AnimationContext, target: string, color: string, duration: number): Promise<AnimationResult> {
  return { success: true, data: { target, color, action: 'highlight' }, duration, library: context.library, timestamp: Date.now() }
}

async function executeColor(context: AnimationContext, target: string, fromColor: string, toColor: string, duration: number): Promise<AnimationResult> {
  return { success: true, data: { target, fromColor, toColor, action: 'color' }, duration, library: context.library, timestamp: Date.now() }
}

async function executeGlow(context: AnimationContext, target: string, intensity: number, duration: number): Promise<AnimationResult> {
  return { success: true, data: { target, intensity, action: 'glow' }, duration, library: context.library, timestamp: Date.now() }
}

async function executeMove(context: AnimationContext, target: string, from: any, to: any, duration: number, easing: string): Promise<AnimationResult> {
  return { success: true, data: { target, from, to, action: 'move' }, duration, library: context.library, timestamp: Date.now() }
}

async function executeScale(context: AnimationContext, target: string, from: number, to: number, duration: number, easing: string): Promise<AnimationResult> {
  return { success: true, data: { target, from, to, action: 'scale' }, duration, library: context.library, timestamp: Date.now() }
}

async function executeRotate(context: AnimationContext, target: string, from: number, to: number, duration: number, easing: string): Promise<AnimationResult> {
  return { success: true, data: { target, from, to, action: 'rotate' }, duration, library: context.library, timestamp: Date.now() }
}

async function executeDelay(duration: number): Promise<AnimationResult> {
  await new Promise(resolve => setTimeout(resolve, duration))
  return { success: true, data: { action: 'delay' }, duration, library: 'universal', timestamp: Date.now() }
}

async function executeWaitForClick(context: AnimationContext, target: string): Promise<AnimationResult> {
  return new Promise((resolve) => {
    // Implementation depends on the specific library
    setTimeout(() => resolve({
      success: true,
      data: { target, action: 'waitForClick' },
      duration: 0,
      library: context.library,
      timestamp: Date.now()
    }), 100) // Placeholder
  })
}

async function executeWaitForHover(context: AnimationContext, target: string): Promise<AnimationResult> {
  return new Promise((resolve) => {
    // Implementation depends on the specific library
    setTimeout(() => resolve({
      success: true,
      data: { target, action: 'waitForHover' },
      duration: 0,
      library: context.library,
      timestamp: Date.now()
    }), 100) // Placeholder
  })
}

async function executeSequence(context: AnimationContext, atoms: AnimationAtom[]): Promise<AnimationResult> {
  const results = []
  let totalDuration = 0

  for (const atom of atoms) {
    const result = await atom.execute(context)
    results.push(result)
    totalDuration += result.duration
  }

  return {
    success: results.every(r => r.success),
    data: { atoms: results, type: 'sequence' },
    duration: totalDuration,
    library: context.library,
    timestamp: Date.now()
  }
}

async function executeParallel(context: AnimationContext, atoms: AnimationAtom[]): Promise<AnimationResult> {
  const promises = atoms.map(atom => atom.execute(context))
  const results = await Promise.all(promises)
  const maxDuration = Math.max(...results.map(r => r.duration))

  return {
    success: results.every(r => r.success),
    data: { atoms: results, type: 'parallel' },
    duration: maxDuration,
    library: context.library,
    timestamp: Date.now()
  }
}

async function executeRepeat(context: AnimationContext, atom: AnimationAtom, count: number): Promise<AnimationResult> {
  const results = []
  let totalDuration = 0

  for (let i = 0; i < count; i++) {
    const result = await atom.execute(context)
    results.push(result)
    totalDuration += result.duration
  }

  return {
    success: results.every(r => r.success),
    data: { atom: results, count, type: 'repeat' },
    duration: totalDuration,
    library: context.library,
    timestamp: Date.now()
  }
}

async function executeStagger(context: AnimationContext, atoms: AnimationAtom[], staggerDelay: number): Promise<AnimationResult> {
  const results = []
  let totalDuration = 0

  for (let i = 0; i < atoms.length; i++) {
    if (i > 0) {
      await executeDelay(staggerDelay)
      totalDuration += staggerDelay
    }

    const result = await atoms[i].execute(context)
    results.push(result)
    totalDuration += result.duration
  }

  return {
    success: results.every(r => r.success),
    data: { atoms: results, staggerDelay, type: 'stagger' },
    duration: totalDuration,
    library: context.library,
    timestamp: Date.now()
  }
}

// ============================================================================
// 🎯 EXPORT BUILDING BLOCKS
// ============================================================================

export const AnimationAlphabet = {
  Atoms: AnimationAtoms,
  Words: AnimationWords,
  Sentences: AnimationSentences
}

// Quick access functions
export const {
  fadeIn, fadeOut, highlight, color, glow,
  move, scale, rotate,
  delay, waitForClick, waitForHover,
  sequence, parallel, repeat, stagger
} = AnimationAtoms

export const {
  emphasize, pulse, bounce,
  slideIn, slideOut,
  compare, swap, showDifference
} = AnimationWords

export const {
  linearSearch, binarySearch,
  bubbleSortPass, insertionSort,
  fillDPTable, traceOptimalPath,
  traverseNode, dfsTraversal
} = AnimationSentences
