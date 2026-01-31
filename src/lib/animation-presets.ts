/**
 * Animation Presets
 * Pre-built animation templates for common algorithm patterns
 */

import { AnimationSequence, SequenceBuilder, AnimationPatterns, ComplexAnimations } from './animation-composers'
import { ColorPalette, ColorSystem } from './animation-core'

export interface AlgorithmPreset {
  name: string
  description: string
  category: string
  complexity: {
    time: string
    space: string
  }
  sequences: {
    introduction: AnimationSequence
    processing: AnimationSequence
    conclusion: AnimationSequence
    error?: AnimationSequence
  }
  colorScheme: ColorPalette
  animationStyle: 'smooth' | 'energetic' | 'minimal' | 'educational'
}

// Array-based Algorithm Presets
export class ArrayAlgorithmPresets {
  static twoSum(): AlgorithmPreset {
    const colorScheme = ColorSystem.getPalette('algorithm')

    return {
      name: 'Two Sum',
      description: 'Find two numbers that add up to target',
      category: 'Array',
      complexity: {
        time: 'O(n)',
        space: 'O(n)'
      },
      sequences: {
        introduction: ComplexAnimations.algorithmIntroduction(['target', 'array']),
        processing: SequenceBuilder.create()
          .addStep('scan-array', ['array-elements'], AnimationPatterns.slideIn(['array-elements'], 'right', 800).animations, 800)
          .addDelay(200)
          .addStep('process-current', ['current-element'], AnimationPatterns.pulse(['current-element'], 600, false).animations, 600)
          .addDelay(150)
          .addStep('check-complement', ['complement'], AnimationPatterns.fadeIn(['complement'], 400).animations, 400)
          .addDelay(200)
          .addStep('update-hashmap', ['hashmap'], AnimationPatterns.scaleIn(['hashmap'], 500).animations, 500)
          .build('two-sum-processing', false),
        conclusion: ComplexAnimations.successCelebration(['result', 'solution-path'])
      },
      colorScheme,
      animationStyle: 'educational'
    }
  }

  static binarySearch(): AlgorithmPreset {
    const colorScheme = ColorSystem.getPalette('data')

    return {
      name: 'Binary Search',
      description: 'Find target in sorted array using divide and conquer',
      category: 'Array',
      complexity: {
        time: 'O(log n)',
        space: 'O(1)'
      },
      sequences: {
        introduction: SequenceBuilder.create()
          .addStep('show-array', ['array'], AnimationPatterns.fadeIn(['array'], 500).animations, 500)
          .addDelay(200)
          .addStep('highlight-target', ['target'], AnimationPatterns.bounceIn(['target'], 600).animations, 600)
          .build('binary-search-intro', false),
        processing: SequenceBuilder.create()
          .addStep('initial-range', ['range'], AnimationPatterns.highlight(['range'], colorScheme.secondary, 400).animations, 400)
          .addDelay(300)
          .addStep('calculate-mid', ['midpoint'], AnimationPatterns.pulse(['midpoint'], 500, false).animations, 500)
          .addDelay(200)
          .addStep('compare-values', ['comparison'], AnimationPatterns.slideIn(['comparison'], 'up', 30, 400).animations, 400)
          .addDelay(150)
          .addStep('narrow-range', ['new-range'], AnimationPatterns.highlight(['new-range'], colorScheme.accent, 600).animations, 600)
          .build('binary-search-processing', false),
        conclusion: SequenceBuilder.create()
          .addStep('found-element', ['found'], AnimationPatterns.bounceIn(['found'], 700).animations, 700)
          .addDelay(200)
          .addStep('show-path', ['search-path'], AnimationPatterns.typewriter('Search path: [3, 5, 7, 9] → Found at index 2', 'path-text', 50).animations, 2000)
          .build('binary-search-conclusion', false),
        error: SequenceBuilder.create()
          .addStep('not-found', ['error'], AnimationPatterns.highlight(['error'], colorScheme.error, 800).animations, 800)
          .build('binary-search-error', false)
      },
      colorScheme,
      animationStyle: 'smooth'
    }
  }

  static bubbleSort(): AlgorithmPreset {
    const colorScheme = ColorSystem.getPalette('process')

    return {
      name: 'Bubble Sort',
      description: 'Sort array by repeatedly swapping adjacent elements',
      category: 'Sorting',
      complexity: {
        time: 'O(n²)',
        space: 'O(1)'
      },
      sequences: {
        introduction: ComplexAnimations.algorithmIntroduction(['array', 'sort-info']),
        processing: SequenceBuilder.create()
          .addStep('pass-start', ['pass-indicator'], AnimationPatterns.fadeIn(['pass-indicator'], 300).animations, 300)
          .addDelay(200)
          .addStep('compare-elements', ['comparison-pair'], AnimationPatterns.pulse(['comparison-pair'], 600, false).animations, 600)
          .addDelay(150)
          .addStep('swap-if-needed', ['swap'], AnimationPatterns.highlight(['swap'], colorScheme.warning, 400).animations, 400)
          .addDelay(100)
          .addStep('move-next', ['next-pair'], AnimationPatterns.slideIn(['next-pair'], 'right', 50, 300).animations, 300)
          .build('bubble-sort-processing', false),
        conclusion: SequenceBuilder.create()
          .addStep('sorted-array', ['sorted-elements'], AnimationPatterns.highlight(['sorted-elements'], colorScheme.success, 1000).animations, 1000)
          .addDelay(300)
          .addStep('completion-message', ['complete'], AnimationPatterns.typewriter('Array successfully sorted!', 'completion-text', 60).animations, 1500)
          .build('bubble-sort-conclusion', false)
      },
      colorScheme,
      animationStyle: 'educational'
    }
  }
}

// Tree Algorithm Presets
export class TreeAlgorithmPresets {
  static binaryTreeTraversal(): AlgorithmPreset {
    const colorScheme = ColorSystem.getPalette('algorithm')

    return {
      name: 'Binary Tree Traversal',
      description: 'Traverse binary tree in different orders',
      category: 'Tree',
      complexity: {
        time: 'O(n)',
        space: 'O(h)'
      },
      sequences: {
        introduction: SequenceBuilder.create()
          .addStep('show-tree', ['tree-root'], AnimationPatterns.scaleIn(['tree-root'], 600).animations, 600)
          .addDelay(200)
          .addStep('show-traversal-type', ['traversal-info'], AnimationPatterns.fadeIn(['traversal-info'], 400).animations, 400)
          .build('tree-traversal-intro', false),
        processing: SequenceBuilder.create()
          .addStep('visit-node', ['current-node'], AnimationPatterns.highlight(['current-node'], colorScheme.secondary, 500).animations, 500)
          .addDelay(200)
          .addStep('process-left', ['left-child'], AnimationPatterns.slideIn(['left-child'], 'left', 40, 400).animations, 400)
          .addDelay(150)
          .addStep('process-right', ['right-child'], AnimationPatterns.slideIn(['right-child'], 'right', 40, 400).animations, 400)
          .addDelay(200)
          .addStep('backtrack', ['parent-node'], AnimationPatterns.pulse(['parent-node'], 400, false).animations, 400)
          .build('tree-traversal-processing', false),
        conclusion: SequenceBuilder.create()
          .addStep('show-result', ['traversal-result'], AnimationPatterns.typewriter('Traversal result: [1, 2, 3, 4, 5, 6, 7]', 'result-text', 80).animations, 2000)
          .addDelay(300)
          .addStep('highlight-path', ['traversal-path'], AnimationPatterns.highlight(['traversal-path'], colorScheme.success, 800).animations, 800)
          .build('tree-traversal-conclusion', false)
      },
      colorScheme,
      animationStyle: 'smooth'
    }
  }

  static heapOperations(): AlgorithmPreset {
    const colorScheme = ColorSystem.getPalette('data')

    return {
      name: 'Heap Operations',
      description: 'Insert and extract operations on binary heap',
      category: 'Tree',
      complexity: {
        time: 'O(log n)',
        space: 'O(n)'
      },
      sequences: {
        introduction: SequenceBuilder.create()
          .addStep('show-heap', ['heap-array'], AnimationPatterns.fadeIn(['heap-array'], 500).animations, 500)
          .addDelay(200)
          .addStep('show-heap-property', ['heap-property'], AnimationPatterns.bounceIn(['heap-property'], 600).animations, 600)
          .build('heap-intro', false),
        processing: SequenceBuilder.create()
          .addStep('insert-element', ['new-element'], AnimationPatterns.slideIn(['new-element'], 'up', 50, 500).animations, 500)
          .addDelay(200)
          .addStep('bubble-up', ['bubble-path'], AnimationPatterns.pulse(['bubble-path'], 800, false).animations, 800)
          .addDelay(150)
          .addStep('heapify', ['heapified'], AnimationPatterns.highlight(['heapified'], colorScheme.success, 600).animations, 600)
          .build('heap-processing', false),
        conclusion: SequenceBuilder.create()
          .addStep('show-final-heap', ['final-heap'], AnimationPatterns.scaleIn(['final-heap'], 700).animations, 700)
          .addDelay(300)
          .addStep('heap-properties', ['properties'], AnimationPatterns.typewriter('Max Heap: Parent ≥ Children ✓', 'properties-text', 70).animations, 1500)
          .build('heap-conclusion', false)
      },
      colorScheme,
      animationStyle: 'energetic'
    }
  }
}

// Graph Algorithm Presets
export class GraphAlgorithmPresets {
  static breadthFirstSearch(): AlgorithmPreset {
    const colorScheme = ColorSystem.getPalette('algorithm')

    return {
      name: 'Breadth First Search',
      description: 'Traverse graph level by level',
      category: 'Graph',
      complexity: {
        time: 'O(V + E)',
        space: 'O(V)'
      },
      sequences: {
        introduction: SequenceBuilder.create()
          .addStep('show-graph', ['graph-nodes', 'graph-edges'], AnimationPatterns.scaleIn(['graph-nodes', 'graph-edges'], 800).animations, 800)
          .addDelay(300)
          .addStep('show-start-node', ['start-node'], AnimationPatterns.pulse(['start-node'], 600, false).animations, 600)
          .build('bfs-intro', false),
        processing: SequenceBuilder.create()
          .addStep('enqueue-start', ['queue'], AnimationPatterns.slideIn(['queue'], 'left', 60, 400).animations, 400)
          .addDelay(200)
          .addStep('visit-current', ['current-node'], AnimationPatterns.highlight(['current-node'], colorScheme.secondary, 500).animations, 500)
          .addDelay(150)
          .addStep('explore-neighbors', ['neighbors'], AnimationPatterns.fadeIn(['neighbors'], 600).animations, 600)
          .addDelay(200)
          .addStep('enqueue-unvisited', ['new-queue-items'], AnimationPatterns.bounceIn(['new-queue-items'], 500).animations, 500)
          .build('bfs-processing', false),
        conclusion: SequenceBuilder.create()
          .addStep('show-visited', ['visited-nodes'], AnimationPatterns.highlight(['visited-nodes'], colorScheme.success, 800).animations, 800)
          .addDelay(300)
          .addStep('show-levels', ['level-info'], AnimationPatterns.typewriter('BFS Levels: A(0), B(1), C(1), D(2), E(2)', 'levels-text', 60).animations, 2000)
          .build('bfs-conclusion', false)
      },
      colorScheme,
      animationStyle: 'educational'
    }
  }

  static dijkstraAlgorithm(): AlgorithmPreset {
    const colorScheme = ColorSystem.getPalette('data')

    return {
      name: 'Dijkstra\'s Algorithm',
      description: 'Find shortest path in weighted graph',
      category: 'Graph',
      complexity: {
        time: 'O((V + E) log V)',
        space: 'O(V)'
      },
      sequences: {
        introduction: ComplexAnimations.algorithmIntroduction(['graph', 'weights', 'start-goal']),
        processing: SequenceBuilder.create()
          .addStep('initialize-distances', ['distance-table'], AnimationPatterns.fadeIn(['distance-table'], 500).animations, 500)
          .addDelay(200)
          .addStep('select-minimum', ['current-node'], AnimationPatterns.highlight(['current-node'], colorScheme.secondary, 600).animations, 600)
          .addDelay(150)
          .addStep('update-neighbors', ['neighbor-updates'], AnimationPatterns.pulse(['neighbor-updates'], 700, false).animations, 700)
          .addDelay(200)
          .addStep('mark-visited', ['visited'], AnimationPatterns.scaleIn(['visited'], 400).animations, 400)
          .build('dijkstra-processing', false),
        conclusion: SequenceBuilder.create()
          .addStep('show-shortest-path', ['shortest-path'], AnimationPatterns.highlight(['shortest-path'], colorScheme.success, 1000).animations, 1000)
          .addDelay(400)
          .addStep('show-distances', ['final-distances'], AnimationPatterns.typewriter('Shortest distances calculated for all nodes!', 'distances-text', 50).animations, 2500)
          .build('dijkstra-conclusion', false)
      },
      colorScheme,
      animationStyle: 'smooth'
    }
  }
}

// Dynamic Programming Presets
export class DPAlgorithmPresets {
  static knapsackProblem(): AlgorithmPreset {
    const colorScheme = ColorSystem.getPalette('process')

    return {
      name: '0/1 Knapsack',
      description: 'Optimize value within weight constraint',
      category: 'Dynamic Programming',
      complexity: {
        time: 'O(nW)',
        space: 'O(nW)'
      },
      sequences: {
        introduction: SequenceBuilder.create()
          .addStep('show-items', ['items'], AnimationPatterns.slideIn(['items'], 'up', 60, 600).animations, 600)
          .addDelay(200)
          .addStep('show-capacity', ['capacity'], AnimationPatterns.bounceIn(['capacity'], 500).animations, 500)
          .build('knapsack-intro', false),
        processing: SequenceBuilder.create()
          .addStep('fill-table', ['dp-table'], AnimationPatterns.fadeIn(['dp-table'], 400).animations, 400)
          .addDelay(150)
          .addStep('consider-item', ['current-item'], AnimationPatterns.highlight(['current-item'], colorScheme.secondary, 500).animations, 500)
          .addDelay(200)
          .addStep('compute-choice', ['choice-calculation'], AnimationPatterns.pulse(['choice-calculation'], 600, false).animations, 600)
          .addDelay(150)
          .addStep('update-cell', ['table-cell'], AnimationPatterns.scaleIn(['table-cell'], 300).animations, 300)
          .build('knapsack-processing', false),
        conclusion: SequenceBuilder.create()
          .addStep('show-optimal', ['optimal-solution'], AnimationPatterns.highlight(['optimal-solution'], colorScheme.success, 800).animations, 800)
          .addDelay(300)
          .addStep('show-selection', ['selected-items'], AnimationPatterns.typewriter('Selected: Guitar($1500, 1kg), iPhone($2000, 1kg)', 'selection-text', 60).animations, 2000)
          .build('knapsack-conclusion', false)
      },
      colorScheme,
      animationStyle: 'educational'
    }
  }

  static longestCommonSubsequence(): AlgorithmPreset {
    const colorScheme = ColorSystem.getPalette('algorithm')

    return {
      name: 'Longest Common Subsequence',
      description: 'Find longest subsequence present in both strings',
      category: 'Dynamic Programming',
      complexity: {
        time: 'O(mn)',
        space: 'O(mn)'
      },
      sequences: {
        introduction: SequenceBuilder.create()
          .addStep('show-strings', ['string-a', 'string-b'], AnimationPatterns.fadeIn(['string-a', 'string-b'], 500).animations, 500)
          .addDelay(300)
          .addStep('show-problem', ['lcs-problem'], AnimationPatterns.bounceIn(['lcs-problem'], 600).animations, 600)
          .build('lcs-intro', false),
        processing: SequenceBuilder.create()
          .addStep('build-matrix', ['dp-matrix'], AnimationPatterns.scaleIn(['dp-matrix'], 600).animations, 600)
          .addDelay(200)
          .addStep('fill-matrix', ['matrix-cells'], AnimationPatterns.slideIn(['matrix-cells'], 'right', 800).animations, 800)
          .addDelay(300)
          .addStep('trace-back', ['trace-path'], AnimationPatterns.highlight(['trace-path'], colorScheme.success, 1000).animations, 1000)
          .build('lcs-processing', false),
        conclusion: SequenceBuilder.create()
          .addStep('show-lcs', ['lcs-result'], AnimationPatterns.typewriter('Longest Common Subsequence: "ABC"', 'lcs-text', 80).animations, 1500)
          .addDelay(200)
          .addStep('highlight-sequence', ['sequence'], AnimationPatterns.pulse(['sequence'], 800, false).animations, 800)
          .build('lcs-conclusion', false)
      },
      colorScheme,
      animationStyle: 'smooth'
    }
  }
}

// Algorithm Preset Factory
export class AlgorithmPresetFactory {
  private static presets = new Map<string, AlgorithmPreset>()

  static initialize(): void {
    // Array algorithms
    this.registerPreset('two-sum', ArrayAlgorithmPresets.twoSum())
    this.registerPreset('binary-search', ArrayAlgorithmPresets.binarySearch())
    this.registerPreset('bubble-sort', ArrayAlgorithmPresets.bubbleSort())

    // Tree algorithms
    this.registerPreset('binary-tree-traversal', TreeAlgorithmPresets.binaryTreeTraversal())
    this.registerPreset('heap-operations', TreeAlgorithmPresets.heapOperations())

    // Graph algorithms
    this.registerPreset('breadth-first-search', GraphAlgorithmPresets.breadthFirstSearch())
    this.registerPreset('dijkstra', GraphAlgorithmPresets.dijkstraAlgorithm())

    // Dynamic programming
    this.registerPreset('knapsack', DPAlgorithmPresets.knapsackProblem())
    this.registerPreset('longest-common-subsequence', DPAlgorithmPresets.longestCommonSubsequence())
  }

  static registerPreset(id: string, preset: AlgorithmPreset): void {
    this.presets.set(id, preset)
  }

  static getPreset(id: string): AlgorithmPreset | undefined {
    return this.presets.get(id)
  }

  static getAllPresets(): Map<string, AlgorithmPreset> {
    return new Map(this.presets)
  }

  static getPresetsByCategory(category: string): AlgorithmPreset[] {
    return Array.from(this.presets.values()).filter(preset => preset.category === category)
  }

  static searchPresets(query: string): AlgorithmPreset[] {
    const lowercaseQuery = query.toLowerCase()
    return Array.from(this.presets.values()).filter(preset =>
      preset.name.toLowerCase().includes(lowercaseQuery) ||
      preset.description.toLowerCase().includes(lowercaseQuery) ||
      preset.category.toLowerCase().includes(lowercaseQuery)
    )
  }
}

// Initialize presets on module load
AlgorithmPresetFactory.initialize()
