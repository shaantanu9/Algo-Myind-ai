/**
 * ANIMATION WORDS - Combining Atoms into Meaningful Patterns
 * Like combining letters to make words, these combine atoms into animation "words"
 */

import {
  AnimationAtom,
  VisualAtoms,
  TemporalAtoms,
  SpatialAtoms,
  StateAtoms,
  InteractiveAtoms,
  AnimationAlphabet,
  Position
} from './animation-atoms'

// ============================================================================
// 📝 ANIMATION WORDS (Atom Combinations)
// ============================================================================

export interface AnimationWord {
  id: string
  atoms: AnimationAtom[]
  description: string
  category: string
  execute: (params: any) => Promise<AnimationResult>
}

// ============================================================================
// 🎯 ELEMENTARY WORDS (Basic Animation Patterns)
// ============================================================================

export class ElementaryWords {
  // Visual emphasis patterns
  static emphasize = (elementId: string): AnimationWord => ({
    id: `emphasize-${elementId}`,
    description: 'Draw attention to an element with scale and glow',
    category: 'emphasis',
    atoms: [
      VisualAtoms.scaleTransform(elementId, 1, 1.2, 300),
      VisualAtoms.glowEffect(elementId, 0.5, 400),
      TemporalAtoms.delay(200),
      VisualAtoms.scaleTransform(elementId, 1.2, 1, 300),
      VisualAtoms.glowEffect(elementId, 0.5, 0, 200)
    ],
    execute: async (params) => {
      const results = []
      for (const atom of this.atoms) {
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

  static fadeInOut = (elementId: string, holdDuration: number = 1000): AnimationWord => ({
    id: `fade-in-out-${elementId}`,
    description: 'Fade element in, hold, then fade out',
    category: 'transition',
    atoms: [
      VisualAtoms.opacityFade(elementId, 0, 1, 500),
      TemporalAtoms.delay(holdDuration),
      VisualAtoms.opacityFade(elementId, 1, 0, 500)
    ],
    execute: async (params) => {
      const results = []
      for (const atom of this.atoms) {
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

  static slideInFromDirection = (elementId: string, direction: 'left' | 'right' | 'up' | 'down', distance: number = 100): AnimationWord => ({
    id: `slide-${direction}-${elementId}`,
    description: `Slide element in from ${direction}`,
    category: 'entrance',
    atoms: [
      SpatialAtoms.moveBy(elementId, getDirectionDelta(direction, distance), 0),
      SpatialAtoms.moveBy(elementId, getDirectionDelta(direction, -distance), 600)
    ],
    execute: async (params) => {
      const results = []
      for (const atom of this.atoms) {
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

  static pulse = (elementId: string, times: number = 3): AnimationWord => ({
    id: `pulse-${elementId}`,
    description: 'Pulse element to draw attention',
    category: 'attention',
    atoms: [
      TemporalAtoms.repeat(
        TemporalAtoms.sequence(
          VisualAtoms.scaleTransform(elementId, 1, 1.1, 200),
          VisualAtoms.scaleTransform(elementId, 1.1, 1, 200)
        ),
        times
      )
    ],
    execute: async (params) => {
      const results = []
      for (const atom of this.atoms) {
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

  static colorTransition = (elementId: string, colors: string[]): AnimationWord => ({
    id: `color-transition-${elementId}`,
    description: 'Transition through multiple colors',
    category: 'visual',
    atoms: colors.slice(1).map((color, index) =>
      VisualAtoms.colorChange(elementId, colors[index], color, 300)
    ),
    execute: async (params) => {
      const results = []
      for (const atom of this.atoms) {
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
}

// ============================================================================
// 🔄 COMPARISON WORDS (For Algorithm Comparisons)
// ============================================================================

export class ComparisonWords {
  static compareElements = (elementId1: string, elementId2: string): AnimationWord => ({
    id: `compare-${elementId1}-${elementId2}`,
    description: 'Compare two elements with alternating highlights',
    category: 'comparison',
    atoms: [
      StateAtoms.highlightElement(elementId1, 'active', 400),
      TemporalAtoms.delay(200),
      StateAtoms.highlightElement(elementId2, 'active', 400),
      TemporalAtoms.delay(200),
      StateAtoms.highlightElement(elementId1, 'info', 200),
      StateAtoms.highlightElement(elementId2, 'info', 200)
    ],
    execute: async (params) => {
      const results = []
      for (const atom of this.atoms) {
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

  static swapElements = (elementId1: string, elementId2: string): AnimationWord => ({
    id: `swap-${elementId1}-${elementId2}`,
    description: 'Swap two elements with smooth animation',
    category: 'swap',
    atoms: [
      StateAtoms.highlightElement(elementId1, 'warning', 300),
      StateAtoms.highlightElement(elementId2, 'warning', 300),
      TemporalAtoms.parallel(
        SpatialAtoms.moveTo(elementId1, params.renderer.getPosition(elementId2), 500),
        SpatialAtoms.moveTo(elementId2, params.renderer.getPosition(elementId1), 500)
      ),
      StateAtoms.highlightElement(elementId1, 'success', 300),
      StateAtoms.highlightElement(elementId2, 'success', 300)
    ],
    execute: async (params) => {
      const results = []
      for (const atom of this.atoms) {
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

  static showDifference = (elementIds: string[], differentId: string): AnimationWord => ({
    id: `difference-${differentId}`,
    description: 'Highlight the difference between elements',
    category: 'difference',
    atoms: [
      ...elementIds.filter(id => id !== differentId).map(id =>
        StateAtoms.highlightElement(id, 'info', 300)
      ),
      StateAtoms.highlightElement(differentId, 'warning', 600),
      TemporalAtoms.delay(300),
      StateAtoms.highlightElement(differentId, 'error', 400)
    ],
    execute: async (params) => {
      const results = []
      for (const atom of this.atoms) {
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
}

// ============================================================================
// 🔍 SEARCH WORDS (For Search Algorithm Patterns)
// ============================================================================

export class SearchWords {
  static linearSearch = (arrayElements: string[], targetElement: string, found: boolean): AnimationWord => ({
    id: `linear-search-${targetElement}`,
    description: 'Animate linear search through array',
    category: 'search',
    atoms: [
      ...arrayElements.map((elementId, index) =>
        TemporalAtoms.sequence(
          StateAtoms.highlightElement(elementId, 'active', 300),
          TemporalAtoms.delay(200),
          StateAtoms.highlightElement(elementId, elementId === targetElement ? 'success' : 'info', 200)
        )
      ),
      ...(found ? [
        StateAtoms.highlightElement(targetElement, 'success', 800),
        ElementaryWords.emphasize(targetElement).atoms[0] // Scale up
      ] : [
        StateAtoms.highlightElement(arrayElements[arrayElements.length - 1], 'error', 500)
      ])
    ].flat(),
    execute: async (params) => {
      const results = []
      for (const atom of this.atoms) {
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

  static binarySearch = (arrayElements: string[], midElement: string, leftElements: string[], rightElements: string[], found: boolean): AnimationWord => ({
    id: `binary-search-${midElement}`,
    description: 'Animate binary search decision tree',
    category: 'search',
    atoms: [
      // Highlight search range
      ...leftElements.map(id => StateAtoms.highlightElement(id, 'info', 200)),
      ...rightElements.map(id => StateAtoms.highlightElement(id, 'info', 200)),

      // Focus on middle element
      TemporalAtoms.delay(300),
      StateAtoms.highlightElement(midElement, 'active', 500),

      // Show decision
      TemporalAtoms.delay(300),
      ...(found ? [
        StateAtoms.highlightElement(midElement, 'success', 800),
        ElementaryWords.emphasize(midElement).atoms[0]
      ] : [
        // Cross out half of array
        ...leftElements.map(id => StateAtoms.highlightElement(id, 'error', 300)),
        ...rightElements.map(id => StateAtoms.highlightElement(id, 'error', 300))
      ])
    ].flat(),
    execute: async (params) => {
      const results = []
      for (const atom of this.atoms) {
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

  static depthFirstTraversal = (nodeElements: string[], edgeElements: string[], visitedOrder: string[]): AnimationWord => ({
    id: `dfs-traversal`,
    description: 'Animate depth-first traversal of graph/tree',
    category: 'traversal',
    atoms: [
      ...visitedOrder.flatMap((nodeId, index) => [
        StateAtoms.highlightElement(nodeId, 'active', 400),
        ...(edgeElements[index] ? [StateAtoms.highlightElement(edgeElements[index], 'active', 300)] : []),
        TemporalAtoms.delay(200),
        StateAtoms.highlightElement(nodeId, 'success', 300)
      ])
    ],
    execute: async (params) => {
      const results = []
      for (const atom of this.atoms) {
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
}

// ============================================================================
// 📊 SORTING WORDS (For Sorting Algorithm Patterns)
// ============================================================================

export class SortingWords {
  static bubbleSortPass = (arrayElements: string[], comparisonIndex: number, swapHappened: boolean): AnimationWord => ({
    id: `bubble-pass-${comparisonIndex}`,
    description: 'Animate one pass of bubble sort',
    category: 'sorting',
    atoms: [
      // Highlight comparison pair
      StateAtoms.highlightElement(arrayElements[comparisonIndex], 'active', 400),
      StateAtoms.highlightElement(arrayElements[comparisonIndex + 1], 'active', 400),

      TemporalAtoms.delay(300),

      ...(swapHappened ? [
        // Show swap
        ComparisonWords.swapElements(arrayElements[comparisonIndex], arrayElements[comparisonIndex + 1]).atoms
      ] : [
        // No swap needed
        StateAtoms.highlightElement(arrayElements[comparisonIndex], 'success', 300),
        StateAtoms.highlightElement(arrayElements[comparisonIndex + 1], 'success', 300)
      ]).flat(),

      TemporalAtoms.delay(200)
    ].flat(),
    execute: async (params) => {
      const results = []
      for (const atom of this.atoms) {
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

  static quickSortPartition = (arrayElements: string[], pivotElement: string, leftPartition: string[], rightPartition: string[]): AnimationWord => ({
    id: `quick-partition-${pivotElement}`,
    description: 'Animate quicksort partitioning step',
    category: 'sorting',
    atoms: [
      // Highlight pivot
      StateAtoms.highlightElement(pivotElement, 'warning', 500),

      TemporalAtoms.delay(300),

      // Show partitioning
      ...leftPartition.map(id => StateAtoms.highlightElement(id, 'info', 300)),
      ...rightPartition.map(id => StateAtoms.highlightElement(id, 'info', 300)),

      TemporalAtoms.delay(400),

      // Final arrangement
      StateAtoms.highlightElement(pivotElement, 'success', 500),
      ...leftPartition.map(id => StateAtoms.highlightElement(id, 'success', 300)),
      ...rightPartition.map(id => StateAtoms.highlightElement(id, 'success', 300))
    ],
    execute: async (params) => {
      const results = []
      for (const atom of this.atoms) {
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

  static mergeSortMerge = (leftElements: string[], rightElements: string[], mergedElements: string[]): AnimationWord => ({
    id: `merge-sort-merge`,
    description: 'Animate merging step in merge sort',
    category: 'sorting',
    atoms: [
      // Highlight input arrays
      ...leftElements.map(id => StateAtoms.highlightElement(id, 'info', 300)),
      ...rightElements.map(id => StateAtoms.highlightElement(id, 'warning', 300)),

      TemporalAtoms.delay(400),

      // Show merging process
      ...mergedElements.map((id, index) => {
        const delay = index * 200
        return TemporalAtoms.sequence(
          TemporalAtoms.delay(delay),
          StateAtoms.highlightElement(id, 'active', 300),
          StateAtoms.highlightElement(id, 'success', 200)
        )
      }),

      TemporalAtoms.delay(300),

      // Final merged result
      ...mergedElements.map(id => StateAtoms.highlightElement(id, 'success', 400))
    ],
    execute: async (params) => {
      const results = []
      for (const atom of this.atoms) {
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
}

// ============================================================================
// 🧠 DYNAMIC PROGRAMMING WORDS
// ============================================================================

export class DPWords {
  static tableFill = (tableCell: string, value: any, dependencies: string[]): AnimationWord => ({
    id: `dp-fill-${tableCell}`,
    description: 'Fill DP table cell with dependencies',
    category: 'dynamic-programming',
    atoms: [
      // Highlight dependencies
      ...dependencies.map(id => StateAtoms.highlightElement(id, 'info', 200)),

      TemporalAtoms.delay(300),

      // Calculate and fill cell
      StateAtoms.highlightElement(tableCell, 'active', 400),
      TemporalAtoms.delay(200),
      StateAtoms.highlightElement(tableCell, 'success', 500),

      // Fade out dependency highlights
      ...dependencies.map(id => StateAtoms.highlightElement(id, 'info', 100))
    ],
    execute: async (params) => {
      const results = []
      for (const atom of this.atoms) {
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

  static optimalPath = (pathElements: string[]): AnimationWord => ({
    id: `optimal-path-${pathElements.join('-')}`,
    description: 'Highlight the optimal path in DP solution',
    category: 'dynamic-programming',
    atoms: [
      // Sequential path highlighting
      ...pathElements.map((elementId, index) =>
        TemporalAtoms.sequence(
          TemporalAtoms.delay(index * 300),
          StateAtoms.highlightElement(elementId, 'active', 400),
          StateAtoms.highlightElement(elementId, 'success', 300)
        )
      ),

      // Final path glow
      TemporalAtoms.delay(500),
      ...pathElements.map(id => VisualAtoms.glowEffect(id, 0.3, 1000))
    ],
    execute: async (params) => {
      const results = []
      for (const atom of this.atoms) {
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
}

// ============================================================================
// 🎭 INTERACTIVE WORDS
// ============================================================================

export class InteractiveWords {
  static stepByStepGuide = (elementIds: string[], instructions: string[]): AnimationWord => ({
    id: `guide-${elementIds.join('-')}`,
    description: 'Interactive step-by-step guide',
    category: 'interactive',
    atoms: [
      ...elementIds.flatMap((elementId, index) => [
        InteractiveAtoms.waitForClick(elementId),
        ElementaryWords.emphasize(elementId).atoms,
        StateAtoms.highlightElement(elementId, 'success', 500)
      ].filter(Boolean))
    ],
    execute: async (params) => {
      const results = []
      for (const atom of this.atoms) {
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

  static elementInspector = (elementIds: string[]): AnimationWord => ({
    id: `inspector-${elementIds.join('-')}`,
    description: 'Inspect elements on hover/click',
    category: 'interactive',
    atoms: [
      ...elementIds.map(elementId =>
        InteractiveAtoms.hoverEffect(elementId, 'glow', 300)
      )
    ],
    execute: async (params) => {
      const results = []
      for (const atom of this.atoms) {
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
}

// ============================================================================
// 🔧 UTILITY FUNCTIONS
// ============================================================================

function getDirectionDelta(direction: string, distance: number): Position {
  switch (direction) {
    case 'left': return { x: -distance, y: 0 }
    case 'right': return { x: distance, y: 0 }
    case 'up': return { x: 0, y: -distance }
    case 'down': return { x: 0, y: distance }
    default: return { x: 0, y: 0 }
  }
}

// ============================================================================
// 📤 EXPORT WORD COLLECTIONS
// ============================================================================

export const AnimationVocabulary = {
  Elementary: ElementaryWords,
  Comparison: ComparisonWords,
  Search: SearchWords,
  Sorting: SortingWords,
  DynamicProgramming: DPWords,
  Interactive: InteractiveWords
}

export { AnimationWord, AnimationResult }

export interface AnimationResult {
  success: boolean
  data: any[]
  duration: number
}
