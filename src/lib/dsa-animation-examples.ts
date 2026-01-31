/**
 * 📚 DSA ANIMATION EXAMPLES
 *
 * Practical examples showing how to use the Animation Alphabet system
 * to create complex DSA algorithm visualizations.
 *
 * These examples demonstrate how atomic building blocks combine to create
 * meaningful algorithm explanations.
 */

import {
  AnimationAtoms,
  AnimationWords,
  AnimationSentences,
  AnimationAlphabet
} from './animation-alphabet'
import { AnimationExecutor } from './animation-executor'

// ============================================================================
// 🔍 SEARCH ALGORITHM EXAMPLES
// ============================================================================

export class SearchAnimations {

  /**
   * Linear Search Animation - Building blocks in action
   */
  static createLinearSearchAnimation(arrayElements: string[], targetElement: string, found: boolean) {
    // Start with array initialization
    const initializeArray = AnimationAtoms.sequence(
      ...arrayElements.map((element, index) =>
        AnimationAtoms.fadeIn(element, 300)
      )
    )

    // Highlight the target we're looking for
    const showTarget = AnimationAtoms.sequence(
      AnimationWords.emphasize(targetElement, 1.2, 0.5),
      AnimationAtoms.delay(500)
    )

    // Perform the search
    const searchProcess = AnimationSentences.linearSearch(arrayElements, targetElement, found)

    // Combine all phases
    return AnimationAtoms.sequence(
      initializeArray,
      AnimationAtoms.delay(800),
      showTarget,
      AnimationAtoms.delay(500),
      searchProcess
    )
  }

  /**
   * Binary Search Animation - More sophisticated
   */
  static createBinarySearchAnimation(arrayElements: string[], midElement: string, found: boolean) {
    // Show the sorted array
    const showSortedArray = AnimationAtoms.stagger(
      arrayElements.map(element => AnimationAtoms.fadeIn(element, 400)),
      100
    )

    // Show the search bounds
    const showBounds = AnimationAtoms.parallel(
      AnimationAtoms.highlight(arrayElements[0], '#6b7280', 500),
      AnimationAtoms.highlight(arrayElements[arrayElements.length - 1], '#6b7280', 500)
    )

    // Perform binary search steps
    const searchSteps = AnimationSentences.binarySearch(arrayElements, midElement, found)

    return AnimationAtoms.sequence(
      showSortedArray,
      AnimationAtoms.delay(1000),
      showBounds,
      AnimationAtoms.delay(800),
      searchSteps
    )
  }

  /**
   * Interpolation Search - Advanced search algorithm
   */
  static createInterpolationSearchAnimation(arrayElements: string[], probeElement: string, found: boolean) {
    const initialize = AnimationAtoms.parallel(
      ...arrayElements.map(element => AnimationAtoms.fadeIn(element, 300))
    )

    // Show the interpolation calculation
    const showInterpolation = AnimationAtoms.sequence(
      AnimationAtoms.highlight(arrayElements[0], '#3b82f6', 400),
      AnimationAtoms.highlight(arrayElements[arrayElements.length - 1], '#3b82f6', 400),
      AnimationAtoms.delay(500),
      AnimationWords.emphasize(probeElement, 1.3, 0.7)
    )

    const result = found ?
      AnimationWords.emphasize(probeElement, 1.4, 0.8) :
      AnimationAtoms.fadeOut(probeElement, 500)

    return AnimationAtoms.sequence(
      initialize,
      AnimationAtoms.delay(800),
      showInterpolation,
      AnimationAtoms.delay(600),
      result
    )
  }
}

// ============================================================================
// 🔄 SORTING ALGORITHM EXAMPLES
// ============================================================================

export class SortingAnimations {

  /**
   * Bubble Sort Pass - Step by step
   */
  static createBubbleSortPassAnimation(arrayElements: string[], comparisonIndex: number, shouldSwap: boolean) {
    const passAnimation = AnimationSentences.bubbleSortPass(arrayElements, comparisonIndex, shouldSwap)

    // Add visual feedback for the pass completion
    const completionFeedback = shouldSwap ?
      AnimationAtoms.glow(arrayElements[comparisonIndex + 1], 0.6, 800) :
      AnimationAtoms.parallel(
        AnimationAtoms.glow(arrayElements[comparisonIndex], 0.4, 500),
        AnimationAtoms.glow(arrayElements[comparisonIndex + 1], 0.4, 500)
      )

    return AnimationAtoms.sequence(
      passAnimation,
      AnimationAtoms.delay(300),
      completionFeedback
    )
  }

  /**
   * Selection Sort Animation
   */
  static createSelectionSortAnimation(arrayElements: string[], currentIndex: number, minIndex: number) {
    // Highlight current position
    const highlightCurrent = AnimationAtoms.highlight(arrayElements[currentIndex], '#f59e0b', 400)

    // Show minimum search
    const searchMinimum = AnimationAtoms.stagger(
      arrayElements.slice(currentIndex).map((element, index) =>
        AnimationAtoms.sequence(
          AnimationAtoms.highlight(element, '#3b82f6', 300),
          AnimationAtoms.delay(200),
          AnimationAtoms.highlight(element, '#6b7280', 200)
        )
      ),
      150
    )

    // Highlight found minimum
    const highlightMinimum = AnimationWords.emphasize(arrayElements[minIndex], 1.2, 0.5)

    // Perform swap if needed
    const swapElements = currentIndex !== minIndex ?
      AnimationSentences.swap(arrayElements[currentIndex], arrayElements[minIndex]) :
      AnimationAtoms.delay(300)

    return AnimationAtoms.sequence(
      highlightCurrent,
      AnimationAtoms.delay(400),
      searchMinimum,
      AnimationAtoms.delay(500),
      highlightMinimum,
      AnimationAtoms.delay(600),
      swapElements
    )
  }

  /**
   * Quick Sort Partition Animation
   */
  static createQuickSortPartitionAnimation(arrayElements: string[], pivotIndex: number, leftPartition: string[], rightPartition: string[]) {
    // Show pivot selection
    const showPivot = AnimationWords.emphasize(arrayElements[pivotIndex], 1.3, 0.7)

    // Show partitioning process
    const showPartitioning = AnimationAtoms.parallel(
      ...leftPartition.map(element => AnimationAtoms.highlight(element, '#10b981', 400)),
      ...rightPartition.map(element => AnimationAtoms.highlight(element, '#ef4444', 400)),
      AnimationAtoms.highlight(arrayElements[pivotIndex], '#f59e0b', 600)
    )

    // Final arrangement
    const finalArrangement = AnimationAtoms.stagger([
      ...leftPartition.map(element => AnimationAtoms.glow(element, 0.3, 500)),
      AnimationWords.emphasize(arrayElements[pivotIndex], 1.2, 0.6),
      ...rightPartition.map(element => AnimationAtoms.glow(element, 0.3, 500))
    ], 200)

    return AnimationAtoms.sequence(
      showPivot,
      AnimationAtoms.delay(800),
      showPartitioning,
      AnimationAtoms.delay(1000),
      finalArrangement
    )
  }
}

// ============================================================================
// 🧠 DYNAMIC PROGRAMMING EXAMPLES
// ============================================================================

export class DPAnimations {

  /**
   * Fill DP Table Cell
   */
  static createDPTableFillAnimation(cellId: string, dependencies: string[], value: number) {
    return AnimationSentences.fillDPTable(cellId, dependencies)
  }

  /**
   * Optimal Path Tracing
   */
  static createOptimalPathAnimation(pathElements: string[]) {
    return AnimationSentences.traceOptimalPath(pathElements)
  }

  /**
   * Knapsack DP Animation
   */
  static createKnapsackDPAnimation(tableCells: string[], currentItem: string, currentWeight: string) {
    // Highlight current item and weight
    const highlightCurrent = AnimationAtoms.parallel(
      AnimationWords.emphasize(currentItem, 1.2, 0.5),
      AnimationWords.emphasize(currentWeight, 1.2, 0.5)
    )

    // Show table calculations
    const calculateTable = AnimationAtoms.stagger(
      tableCells.map(cell => AnimationAtoms.sequence(
        AnimationAtoms.highlight(cell, '#3b82f6', 300),
        AnimationAtoms.delay(200),
        AnimationAtoms.highlight(cell, '#10b981', 400)
      )),
      150
    )

    return AnimationAtoms.sequence(
      highlightCurrent,
      AnimationAtoms.delay(600),
      calculateTable
    )
  }
}

// ============================================================================
// 🌳 GRAPH ALGORITHM EXAMPLES
// ============================================================================

export class GraphAnimations {

  /**
   * BFS Traversal Animation
   */
  static createBFSTraversalAnimation(nodes: string[], edges: string[], visitedOrder: string[]) {
    const traversalSteps: any[] = []

    visitedOrder.forEach((nodeId, index) => {
      const edgeId = edges[index]

      traversalSteps.push(
        AnimationSentences.traverseNode(nodeId, edgeId, true)
      )

      // Add delay between levels
      if (index < visitedOrder.length - 1) {
        traversalSteps.push(AnimationAtoms.delay(500))
      }
    })

    return AnimationAtoms.sequence(...traversalSteps)
  }

  /**
   * DFS Traversal Animation
   */
  static createDFSTraversalAnimation(nodes: string[], edges: string[], visitedOrder: string[]) {
    return AnimationSentences.dfsTraversal(nodes, edges, visitedOrder)
  }

  /**
   * Dijkstra's Algorithm Animation
   */
  static createDijkstraAnimation(nodes: string[], edges: string[], currentNode: string, distances: Map<string, number>) {
    // Highlight current node
    const highlightCurrent = AnimationWords.emphasize(currentNode, 1.3, 0.6)

    // Update neighbor distances
    const updateNeighbors = AnimationAtoms.stagger(
      edges.map(edge => AnimationAtoms.sequence(
        AnimationAtoms.highlight(edge, '#3b82f6', 400),
        AnimationAtoms.delay(300),
        AnimationAtoms.highlight(edge, '#10b981', 400)
      )),
      200
    )

    // Show updated distance labels
    const showDistances = AnimationAtoms.stagger(
      nodes.map(node => {
        const distance = distances.get(node)
        return AnimationAtoms.sequence(
          AnimationAtoms.highlight(node, '#6b7280', 300),
          AnimationAtoms.delay(200),
          AnimationAtoms.highlight(node, distance === Infinity ? '#ef4444' : '#10b981', 400)
        )
      }),
      150
    )

    return AnimationAtoms.sequence(
      highlightCurrent,
      AnimationAtoms.delay(600),
      updateNeighbors,
      AnimationAtoms.delay(800),
      showDistances
    )
  }
}

// ============================================================================
// 🎯 COMPLETE ALGORITHM ANIMATIONS
// ============================================================================

export class CompleteAlgorithmAnimations {

  /**
   * Two Sum Algorithm - Complete visualization
   */
  static createTwoSumAnimation(array: string[], target: string, result: [string, string] | null) {
    // Initialize the array
    const initializeArray = AnimationAtoms.stagger(
      array.map(element => AnimationAtoms.fadeIn(element, 400)),
      100
    )

    // Show the target
    const showTarget = AnimationWords.emphasize(target, 1.2, 0.5)

    // Perform the search
    const searchProcess = result ?
      AnimationAtoms.sequence(
        // Show the two elements being compared
        AnimationWords.compare(result[0], result[1]),
        AnimationAtoms.delay(500),
        // Show solution
        AnimationAtoms.parallel(
          AnimationWords.emphasize(result[0], 1.4, 0.8),
          AnimationWords.emphasize(result[1], 1.4, 0.8)
        ),
        AnimationAtoms.delay(800),
        AnimationAtoms.parallel(
          AnimationAtoms.glow(result[0], 0.6, 1000),
          AnimationAtoms.glow(result[1], 0.6, 1000)
        )
      ) :
      AnimationAtoms.sequence(
        // Show unsuccessful search
        ...array.map(element => AnimationAtoms.sequence(
          AnimationAtoms.highlight(element, '#ef4444', 300),
          AnimationAtoms.delay(200)
        )),
        AnimationAtoms.delay(500),
        AnimationWords.emphasize(target, 1.1, 0.3) // No solution found
      )

    return AnimationAtoms.sequence(
      initializeArray,
      AnimationAtoms.delay(1000),
      showTarget,
      AnimationAtoms.delay(800),
      searchProcess
    )
  }

  /**
   * Binary Tree Traversal - Complete visualization
   */
  static createTreeTraversalAnimation(nodes: string[], traversalOrder: string[], traversalType: 'preorder' | 'inorder' | 'postorder') {
    // Initialize tree
    const initializeTree = AnimationAtoms.stagger(
      nodes.map(node => AnimationAtoms.fadeIn(node, 500)),
      200
    )

    // Show traversal order
    const showTraversal = AnimationAtoms.stagger(
      traversalOrder.map(nodeId => AnimationAtoms.sequence(
        AnimationWords.emphasize(nodeId, 1.3, 0.6),
        AnimationAtoms.delay(300),
        AnimationAtoms.highlight(nodeId, '#10b981', 600)
      )),
      400
    )

    // Show traversal type
    const traversalLabel = `Traversal: ${traversalType.toUpperCase()}`
    const showTraversalType = AnimationAtoms.fadeIn(`traversal-label-${Date.now()}`, 600)

    return AnimationAtoms.sequence(
      initializeTree,
      AnimationAtoms.delay(1000),
      showTraversalType,
      AnimationAtoms.delay(500),
      showTraversal
    )
  }

  /**
   * Sorting Algorithm Complete Flow
   */
  static createSortingCompleteAnimation(arrayElements: string[], algorithm: 'bubble' | 'selection' | 'insertion') {
    const algorithmName = `${algorithm.charAt(0).toUpperCase() + algorithm.slice(1)} Sort`

    // Show algorithm title
    const showTitle = AnimationAtoms.fadeIn(`algorithm-title-${Date.now()}`, 600)

    // Initialize array
    const initializeArray = AnimationAtoms.stagger(
      arrayElements.map(element => AnimationAtoms.fadeIn(element, 400)),
      150
    )

    // Show sorting process (simplified)
    const sortingProcess = AnimationAtoms.sequence(
      ...Array.from({ length: arrayElements.length }, (_, i) =>
        AnimationAtoms.sequence(
          AnimationAtoms.delay(800),
          AnimationWords.compare(arrayElements[i], arrayElements[i + 1] || arrayElements[i]),
          AnimationAtoms.delay(400)
        )
      )
    )

    // Show completion
    const showCompletion = AnimationAtoms.parallel(
      ...arrayElements.map(element =>
        AnimationAtoms.highlight(element, '#10b981', 500)
      )
    )

    return AnimationAtoms.sequence(
      showTitle,
      AnimationAtoms.delay(800),
      initializeArray,
      AnimationAtoms.delay(1000),
      sortingProcess,
      AnimationAtoms.delay(800),
      showCompletion
    )
  }
}

// ============================================================================
// 🚀 EXECUTION HELPERS
// ============================================================================

export class AnimationRunner {

  /**
   * Execute an animation with a specific library context
   */
  static async runAnimation(animation: any, library: 'mermaid' | 'reactflow' | 'd3' | 'three', context: any = {}) {
    const executionContext = {
      library,
      container: context.container,
      elements: context.elements || new Map(),
      step: context.step || 0,
      data: context.data || {},
      ...context
    }

    return await AnimationExecutor.executeAtom(animation, executionContext)
  }

  /**
   * Run animation with performance monitoring
   */
  static async runWithMetrics(animation: any, library: 'mermaid' | 'reactflow' | 'd3' | 'three', context: any = {}) {
    const executionContext = {
      library,
      container: context.container,
      elements: context.elements || new Map(),
      step: context.step || 0,
      data: context.data || {},
      ...context
    }

    return await AnimationExecutor.executeWithMetrics(animation, executionContext)
  }

  /**
   * Run multiple animations in sequence
   */
  static async runSequence(animations: any[], library: 'mermaid' | 'reactflow' | 'd3' | 'three', context: any = {}) {
    const results = []

    for (const animation of animations) {
      const result = await this.runAnimation(animation, library, context)
      results.push(result)

      if (!result.success) {
        console.warn('Animation failed:', result.data)
        break
      }
    }

    return results
  }
}

// ============================================================================
// 🎨 EXPORT EXAMPLES
// ============================================================================

export const DSAAnimationExamples = {
  Search: SearchAnimations,
  Sorting: SortingAnimations,
  DynamicProgramming: DPAnimations,
  Graph: GraphAnimations,
  Complete: CompleteAlgorithmAnimations,
  Runner: AnimationRunner
}

// Quick access functions
export const {
  linearSearch,
  binarySearch,
  bubbleSortPass,
  selectionSort,
  fillDPTable,
  traceOptimalPath,
  bfsTraversal,
  dfsTraversal
} = AnimationSentences

export const {
  runAnimation,
  runWithMetrics,
  runSequence
} = AnimationRunner
