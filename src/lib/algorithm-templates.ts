/**
 * Algorithm Templates
 * Ready-to-use animation templates for specific algorithms
 */

import { AnimationFrame, AnimationFrameGenerator } from './data-transformers'
import { VisualGeneratorFactory } from './visual-generators'
import { AlgorithmPresetFactory } from './animation-presets'
import { timelineManager, ComplexAnimations } from './animation-composers'

export interface AlgorithmTemplate {
  id: string
  name: string
  category: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  description: string
  timeComplexity: string
  spaceComplexity: string

  // Animation configuration
  defaultVisualization: 'mermaid' | 'reactflow' | 'd3' | 'three'
  animationPreset?: string

  // Data transformation functions
  generateFrames: (data: any) => AnimationFrame[]
  getVisualData: (frame: AnimationFrame, type: string) => any

  // Educational content
  keyInsights: string[]
  commonMistakes: string[]
  optimizationTips: string[]

  // Interactive features
  interactiveElements?: string[]
  codeHighlighting?: boolean
  realTimeExecution?: boolean
}

// Two Sum Algorithm Template
export const TwoSumTemplate: AlgorithmTemplate = {
  id: 'two-sum',
  name: 'Two Sum',
  category: 'Array',
  difficulty: 'Easy',
  description: 'Find two numbers in an array that add up to a target sum using hash map optimization',
  timeComplexity: 'O(n)',
  spaceComplexity: 'O(n)',

  defaultVisualization: 'mermaid',
  animationPreset: 'two-sum',

  generateFrames: (data: any) => {
    return AnimationFrameGenerator.createFrames({
      array: data.array || [2, 7, 11, 15],
      target: data.target || 9,
      hashMap: data.hashMap || {},
      complement: data.complement,
      found: data.found,
      result: data.result
    }, 'two-sum')
  },

  getVisualData: (frame: AnimationFrame, type: string) => {
    return VisualGeneratorFactory.generateVisuals(type as any, frame.data, frame.highlights)
  },

  keyInsights: [
    'Hash map provides O(1) lookup time for complement checking',
    'Trade space for time - O(n) space enables O(n) time complexity',
    'One-pass solution combines iteration with hash map building',
    'Early termination when solution is found',
    'Handles negative numbers and zero correctly'
  ],

  commonMistakes: [
    'Forgetting to handle duplicate values in hash map',
    'Not considering same element used twice',
    'Incorrect complement calculation (target - current)',
    'Missing edge cases like empty array or single element'
  ],

  optimizationTips: [
    'Use hash map instead of nested loops for better performance',
    'Consider early termination when solution is found',
    'Handle hash collisions if using custom hash function',
    'Use appropriate data types for large numbers'
  ],

  interactiveElements: ['array-elements', 'hash-map', 'target-value', 'current-pointer'],
  codeHighlighting: true,
  realTimeExecution: true
}

// Binary Search Algorithm Template
export const BinarySearchTemplate: AlgorithmTemplate = {
  id: 'binary-search',
  name: 'Binary Search',
  category: 'Array',
  difficulty: 'Easy',
  description: 'Find target element in sorted array using divide and conquer approach',
  timeComplexity: 'O(log n)',
  spaceComplexity: 'O(1)',

  defaultVisualization: 'd3',
  animationPreset: 'binary-search',

  generateFrames: (data: any) => {
    const array = data.array || [1, 3, 5, 7, 9, 11, 13, 15]
    const target = data.target || 7

    return AnimationFrameGenerator.createFrames({
      array,
      target,
      left: data.left || 0,
      right: data.right || array.length - 1,
      mid: data.mid,
      found: data.found,
      result: data.result
    }, 'binary-search')
  },

  getVisualData: (frame: AnimationFrame, type: string) => {
    return VisualGeneratorFactory.generateVisuals(type as any, frame.data, frame.highlights)
  },

  keyInsights: [
    'Divide and conquer reduces search space by half each iteration',
    'Requires sorted array as prerequisite',
    'O(log n) time complexity is much faster than O(n) linear search',
    'Constant O(1) space complexity - no extra data structures needed',
    'Perfect example of algorithmic efficiency through problem constraints'
  ],

  commonMistakes: [
    'Off-by-one errors in boundary calculations',
    'Incorrect mid calculation: (left + right) / 2 can overflow',
    'Not handling empty array or single element cases',
    'Forgetting to check if target exists in array',
    'Infinite loop when left > right condition is wrong'
  ],

  optimizationTips: [
    'Use (left + (right - left) / 2) to avoid integer overflow',
    'Consider interpolation search for uniformly distributed data',
    'Use exponential search for unbounded arrays',
    'Implement early termination for common cases',
    'Consider parallel binary search for multiple targets'
  ],

  interactiveElements: ['search-range', 'mid-point', 'comparison-result', 'search-path'],
  codeHighlighting: true,
  realTimeExecution: true
}

// Bubble Sort Algorithm Template
export const BubbleSortTemplate: AlgorithmTemplate = {
  id: 'bubble-sort',
  name: 'Bubble Sort',
  category: 'Sorting',
  difficulty: 'Easy',
  description: 'Sort array by repeatedly swapping adjacent elements that are in wrong order',
  timeComplexity: 'O(n²)',
  spaceComplexity: 'O(1)',

  defaultVisualization: 'reactflow',
  animationPreset: 'bubble-sort',

  generateFrames: (data: any) => {
    return AnimationFrameGenerator.createFrames({
      array: data.array || [64, 34, 25, 12, 22, 11, 90],
      currentIndex: data.currentIndex,
      compareIndex: data.compareIndex,
      swapped: data.swapped,
      pass: data.pass,
      sorted: data.sorted
    }, 'bubble-sort')
  },

  getVisualData: (frame: AnimationFrame, type: string) => {
    return VisualGeneratorFactory.generateVisuals(type as any, frame.data, frame.highlights)
  },

  keyInsights: [
    'Simple and intuitive sorting algorithm',
    'In-place sorting - no extra space required',
    'Stable sort - preserves relative order of equal elements',
    'Best case O(n) when array is already sorted',
    'Educational value in demonstrating nested loops and comparisons'
  ],

  commonMistakes: [
    'Incorrect loop bounds causing out-of-bounds access',
    'Forgetting to reset swapped flag each pass',
    'Not optimizing for already sorted arrays',
    'Incorrect swap logic with temporary variables',
    'Missing early termination when no swaps occur'
  ],

  optimizationTips: [
    'Add early termination when no swaps occur in a pass',
    'Use optimized version with reduced comparisons',
    'Consider cocktail shaker sort for bidirectional passes',
    'Use insertion sort hybrid for small subarrays',
    'Not suitable for large datasets - consider quicksort or mergesort'
  ],

  interactiveElements: ['array-elements', 'comparison-pair', 'swap-indicators', 'pass-counter'],
  codeHighlighting: true,
  realTimeExecution: true
}

// Quick Sort Algorithm Template
export const QuickSortTemplate: AlgorithmTemplate = {
  id: 'quick-sort',
  name: 'Quick Sort',
  category: 'Sorting',
  difficulty: 'Medium',
  description: 'Fast divide-and-conquer sorting algorithm using pivot element',
  timeComplexity: 'O(n log n)',
  spaceComplexity: 'O(log n)',

  defaultVisualization: 'three',
  animationPreset: 'quick-sort',

  generateFrames: (data: any) => {
    const array = data.array || [10, 7, 8, 9, 1, 5]
    const pivot = data.pivot
    const left = data.left || 0
    const right = data.right || array.length - 1
    const i = data.i
    const j = data.j

    const frames: AnimationFrame[] = []

    // Partition step visualization
    frames.push({
      step: 0,
      title: 'Choose Pivot',
      description: `Select pivot element: ${array[pivot]}`,
      data: { array, pivot, left, right },
      highlights: [{
        type: 'node',
        target: pivot,
        style: 'warning',
        duration: 500
      }],
      transitions: []
    })

    // Partitioning process
    if (i !== undefined && j !== undefined) {
      frames.push({
        step: 1,
        title: 'Partition Process',
        description: `i=${i}, j=${j}, comparing ${array[i]} and ${array[j]}`,
        data: { array, pivot, left, right, i, j },
        highlights: [
          { type: 'node', target: i, style: 'active', duration: 300 },
          { type: 'node', target: j, style: 'active', duration: 300 },
          { type: 'node', target: pivot, style: 'warning', duration: 300 }
        ],
        transitions: []
      })
    }

    return frames
  },

  getVisualData: (frame: AnimationFrame, type: string) => {
    return VisualGeneratorFactory.generateVisuals(type as any, frame.data, frame.highlights)
  },

  keyInsights: [
    'Divide and conquer algorithm with excellent average performance',
    'In-place sorting with O(log n) stack space',
    'Cache-friendly due to locality of reference',
    'Worst case O(n²) but rare with good pivot selection',
    'Fastest sorting algorithm in practice for most cases'
  ],

  commonMistakes: [
    'Poor pivot selection leading to worst-case performance',
    'Incorrect partition logic with infinite loops',
    'Not handling duplicate elements properly',
    'Stack overflow for deeply recursive calls',
    'Incorrect boundary conditions in partitioning'
  ],

  optimizationTips: [
    'Use median-of-three for pivot selection',
    'Implement iterative version to avoid stack overflow',
    'Use insertion sort hybrid for small subarrays',
    'Consider three-way partitioning for duplicate elements',
    'Randomized pivot selection for guaranteed performance'
  ],

  interactiveElements: ['pivot-element', 'partition-indicators', 'recursion-stack', 'comparison-pointers'],
  codeHighlighting: true,
  realTimeExecution: true
}

// Graph Traversal Templates
export const BFSTemplate: AlgorithmTemplate = {
  id: 'breadth-first-search',
  name: 'Breadth First Search',
  category: 'Graph',
  difficulty: 'Medium',
  description: 'Traverse graph level by level using queue data structure',
  timeComplexity: 'O(V + E)',
  spaceComplexity: 'O(V)',

  defaultVisualization: 'reactflow',
  animationPreset: 'breadth-first-search',

  generateFrames: (data: any) => {
    const graph = data.graph || {
      nodes: [
        { id: 'A', value: 'A', position: { x: 100, y: 100 } },
        { id: 'B', value: 'B', position: { x: 200, y: 100 } },
        { id: 'C', value: 'C', position: { x: 150, y: 200 } }
      ],
      edges: [
        { source: 'A', target: 'B' },
        { source: 'A', target: 'C' },
        { source: 'B', target: 'C' }
      ]
    }
    const visited = data.visited || []
    const queue = data.queue || []
    const current = data.current

    const frames: AnimationFrame[] = []

    frames.push({
      step: 0,
      title: 'BFS Initialization',
      description: `Start BFS from node ${current || 'A'}`,
      data: { graph, visited, queue, current },
      highlights: [{
        type: 'node',
        target: current || 'A',
        style: 'active',
        duration: 500
      }],
      transitions: []
    })

    return frames
  },

  getVisualData: (frame: AnimationFrame, type: string) => {
    return VisualGeneratorFactory.generateVisuals(type as any, frame.data, frame.highlights)
  },

  keyInsights: [
    'Level-order traversal visits nodes by distance from start',
    'Queue data structure ensures FIFO processing',
    'Finds shortest path in unweighted graphs',
    'Can be used for web crawling and social network analysis',
    'Memory efficient for wide but shallow graphs'
  ],

  commonMistakes: [
    'Not marking nodes as visited causing infinite loops',
    'Incorrect queue operations (enqueue/dequeue)',
    'Forgetting to handle disconnected components',
    'Not checking for null/empty graph',
    'Incorrect neighbor traversal logic'
  ],

  optimizationTips: [
    'Use adjacency list for efficient neighbor access',
    'Implement iterative version to avoid recursion stack issues',
    'Use color coding (white/gray/black) for node states',
    'Consider bidirectional BFS for shortest path optimization',
    'Use priority queue variation for weighted graphs (Dijkstra)'
  ],

  interactiveElements: ['graph-nodes', 'queue-visualization', 'visited-indicators', 'level-indicators'],
  codeHighlighting: true,
  realTimeExecution: true
}

// Template Registry and Factory
export class AlgorithmTemplateFactory {
  private static templates = new Map<string, AlgorithmTemplate>()

  static initialize(): void {
    this.registerTemplate(TwoSumTemplate)
    this.registerTemplate(BinarySearchTemplate)
    this.registerTemplate(BubbleSortTemplate)
    this.registerTemplate(QuickSortTemplate)
    this.registerTemplate(BFSTemplate)
  }

  static registerTemplate(template: AlgorithmTemplate): void {
    this.templates.set(template.id, template)
  }

  static getTemplate(id: string): AlgorithmTemplate | undefined {
    return this.templates.get(id)
  }

  static getAllTemplates(): Map<string, AlgorithmTemplate> {
    return new Map(this.templates)
  }

  static getTemplatesByCategory(category: string): AlgorithmTemplate[] {
    return Array.from(this.templates.values()).filter(template => template.category === category)
  }

  static getTemplatesByDifficulty(difficulty: 'Easy' | 'Medium' | 'Hard'): AlgorithmTemplate[] {
    return Array.from(this.templates.values()).filter(template => template.difficulty === difficulty)
  }

  static createAnimationForAlgorithm(algorithmId: string, data: any, visualizationType?: string): any {
    const template = this.getTemplate(algorithmId)
    if (!template) {
      throw new Error(`Template not found for algorithm: ${algorithmId}`)
    }

    const frames = template.generateFrames(data)
    const vizType = visualizationType || template.defaultVisualization

    return {
      template,
      frames,
      visualizationType: vizType,
      animations: frames.map(frame => template.getVisualData(frame, vizType)),
      preset: template.animationPreset ? AlgorithmPresetFactory.getPreset(template.animationPreset) : undefined
    }
  }

  static getEducationalContent(algorithmId: string): any {
    const template = this.getTemplate(algorithmId)
    if (!template) return null

    return {
      keyInsights: template.keyInsights,
      commonMistakes: template.commonMistakes,
      optimizationTips: template.optimizationTips,
      timeComplexity: template.timeComplexity,
      spaceComplexity: template.spaceComplexity
    }
  }
}

// Initialize templates on module load
AlgorithmTemplateFactory.initialize()

// Export individual templates for direct use
export { TwoSumTemplate, BinarySearchTemplate, BubbleSortTemplate, QuickSortTemplate, BFSTemplate }
