/**
 * ANIMATION SENTENCES - Complete Algorithm Animation Compositions
 * Like combining words into sentences, these create complete animation sequences
 */

import { AnimationWord, AnimationVocabulary, AnimationResult } from './animation-words'
import { AlgorithmData } from './data-transformers'

export interface AnimationSentence {
  id: string
  words: AnimationWord[]
  description: string
  algorithm: string
  category: 'introduction' | 'processing' | 'conclusion' | 'comparison' | 'error'
  execute: (params: any) => Promise<AnimationResult>
  metadata: {
    estimatedDuration: number
    targetElements: string[]
    complexity: string
  }
}

// ============================================================================
// 📚 ALGORITHM SENTENCES (Complete Animation Sequences)
// ============================================================================

export class AlgorithmSentences {
  // ============================================================================
  // 🔍 SEARCH ALGORITHMS
  // ============================================================================

  static linearSearch(data: AlgorithmData): AnimationSentence {
    const { array = [], target, currentIndex, found } = data
    const arrayElements = array.map((_, i) => `array-${i}`)
    const targetElement = array.findIndex(val => val === target)

    return {
      id: 'linear-search-sequence',
      description: 'Complete linear search animation sequence',
      algorithm: 'linear-search',
      category: 'processing',
      words: [
        AnimationVocabulary.Elementary.fadeInOut('search-title', 500),
        AnimationVocabulary.Search.linearSearch(arrayElements, `array-${targetElement}`, found || false),
        ...(found ? [
          AnimationVocabulary.Elementary.emphasize(`array-${targetElement}`)
        ] : [
          AnimationVocabulary.Elementary.colorTransition('search-status', ['#ef4444', '#dc2626'])
        ])
      ],
      execute: async (params) => {
        const results = []
        for (const word of this.words) {
          const result = await word.execute(params)
          results.push(result)
        }
        return {
          success: results.every(r => r.success),
          data: results.map(r => r.data),
          duration: results.reduce((sum, r) => sum + r.duration, 0)
        }
      },
      metadata: {
        estimatedDuration: array.length * 600 + 1000,
        targetElements: arrayElements,
        complexity: 'O(n)'
      }
    }
  }

  static binarySearch(data: AlgorithmData): AnimationSentence {
    const { array = [], target, left = 0, right = array.length - 1 } = data
    const mid = Math.floor((left + right) / 2)
    const allElements = array.map((_, i) => `array-${i}`)
    const leftElements = allElements.slice(left, mid)
    const rightElements = allElements.slice(mid + 1, right + 1)
    const found = array[mid] === target

    return {
      id: 'binary-search-sequence',
      description: 'Complete binary search animation sequence',
      algorithm: 'binary-search',
      category: 'processing',
      words: [
        AnimationVocabulary.Elementary.fadeInOut('search-title', 500),
        AnimationVocabulary.Search.binarySearch(allElements, `array-${mid}`, leftElements, rightElements, found),
        ...(found ? [
          AnimationVocabulary.Elementary.emphasize(`array-${mid}`)
        ] : [
          AnimationVocabulary.Elementary.colorTransition('search-status', ['#6b7280', '#374151'])
        ])
      ],
      execute: async (params) => {
        const results = []
        for (const word of this.words) {
          const result = await word.execute(params)
          results.push(result)
        }
        return {
          success: results.every(r => r.success),
          data: results.map(r => r.data),
          duration: results.reduce((sum, r) => sum + r.duration, 0)
        }
      },
      metadata: {
        estimatedDuration: Math.log2(array.length) * 800 + 1000,
        targetElements: allElements,
        complexity: 'O(log n)'
      }
    }
  }

  // ============================================================================
  // 🔄 SORTING ALGORITHMS
  // ============================================================================

  static bubbleSort(data: AlgorithmData): AnimationSentence {
    const { array = [], currentIndex = 0, compareIndex = 0, swapped = false } = data
    const arrayElements = array.map((_, i) => `array-${i}`)
    const passNumber = Math.floor(currentIndex / array.length) + 1

    return {
      id: 'bubble-sort-sequence',
      description: 'Complete bubble sort animation sequence',
      algorithm: 'bubble-sort',
      category: 'processing',
      words: [
        AnimationVocabulary.Sorting.bubbleSortPass(arrayElements, compareIndex, swapped),
        ...(swapped ? [] : [
          AnimationVocabulary.Elementary.emphasize(`array-${array.length - passNumber}`)
        ])
      ],
      execute: async (params) => {
        const results = []
        for (const word of this.words) {
          const result = await word.execute(params)
          results.push(result)
        }
        return {
          success: results.every(r => r.success),
          data: results.map(r => r.data),
          duration: results.reduce((sum, r) => sum + r.duration, 0)
        }
      },
      metadata: {
        estimatedDuration: array.length * array.length * 500,
        targetElements: arrayElements,
        complexity: 'O(n²)'
      }
    }
  }

  static quickSort(data: AlgorithmData): AnimationSentence {
    const { array = [], pivot, left = 0, right = array.length - 1 } = data
    const arrayElements = array.map((_, i) => `array-${i}`)
    const leftPartition = arrayElements.slice(left, pivot)
    const rightPartition = arrayElements.slice(pivot + 1, right + 1)

    return {
      id: 'quick-sort-sequence',
      description: 'Complete quicksort animation sequence',
      algorithm: 'quick-sort',
      category: 'processing',
      words: [
        AnimationVocabulary.Sorting.quickSortPartition(arrayElements, `array-${pivot}`, leftPartition, rightPartition),
        AnimationVocabulary.Elementary.emphasize(`array-${pivot}`)
      ],
      execute: async (params) => {
        const results = []
        for (const word of this.words) {
          const result = await word.execute(params)
          results.push(result)
        }
        return {
          success: results.every(r => r.success),
          data: results.map(r => r.data),
          duration: results.reduce((sum, r) => sum + r.duration, 0)
        }
      },
      metadata: {
        estimatedDuration: array.length * Math.log2(array.length) * 600,
        targetElements: arrayElements,
        complexity: 'O(n log n)'
      }
    }
  }

  static mergeSort(data: AlgorithmData): AnimationSentence {
    const { array = [], leftArray = [], rightArray = [] } = data
    const leftElements = leftArray.map((_, i) => `left-${i}`)
    const rightElements = rightArray.map((_, i) => `right-${i}`)
    const mergedElements = array.map((_, i) => `merged-${i}`)

    return {
      id: 'merge-sort-sequence',
      description: 'Complete merge sort animation sequence',
      algorithm: 'merge-sort',
      category: 'processing',
      words: [
        AnimationVocabulary.Sorting.mergeSortMerge(leftElements, rightElements, mergedElements),
        AnimationVocabulary.Elementary.colorTransition('merge-status', ['#22c55e', '#16a34a'])
      ],
      execute: async (params) => {
        const results = []
        for (const word of this.words) {
          const result = await word.execute(params)
          results.push(result)
        }
        return {
          success: results.every(r => r.success),
          data: results.map(r => r.data),
          duration: results.reduce((sum, r) => sum + r.duration, 0)
        }
      },
      metadata: {
        estimatedDuration: array.length * Math.log2(array.length) * 400,
        targetElements: [...leftElements, ...rightElements, ...mergedElements],
        complexity: 'O(n log n)'
      }
    }
  }

  // ============================================================================
  // 🧠 DYNAMIC PROGRAMMING
  // ============================================================================

  static knapsack(data: AlgorithmData): AnimationSentence {
    const { weights = [], values = [], capacity = 0, currentItem = 0 } = data
    const tableCells = []
    for (let i = 0; i <= weights.length; i++) {
      for (let w = 0; w <= capacity; w++) {
        tableCells.push(`dp-${i}-${w}`)
      }
    }

    const dependencies = [
      `dp-${currentItem}-${capacity - weights[currentItem]}`,
      `dp-${currentItem - 1}-${capacity}`
    ].filter(id => id.includes('dp-'))

    return {
      id: 'knapsack-sequence',
      description: 'Complete 0/1 knapsack DP animation sequence',
      algorithm: 'knapsack',
      category: 'processing',
      words: [
        AnimationVocabulary.DynamicProgramming.tableFill(`dp-${currentItem + 1}-${capacity}`, null, dependencies),
        AnimationVocabulary.Elementary.emphasize(`dp-${currentItem + 1}-${capacity}`)
      ],
      execute: async (params) => {
        const results = []
        for (const word of this.words) {
          const result = await word.execute(params)
          results.push(result)
        }
        return {
          success: results.every(r => r.success),
          data: results.map(r => r.data),
          duration: results.reduce((sum, r) => sum + r.duration, 0)
        }
      },
      metadata: {
        estimatedDuration: (weights.length * capacity) * 300,
        targetElements: tableCells,
        complexity: 'O(nW)'
      }
    }
  }

  static longestCommonSubsequence(data: AlgorithmData): AnimationSentence {
    const { string1 = '', string2 = '', currentI = 0, currentJ = 0 } = data
    const tableCells = []
    for (let i = 0; i <= string1.length; i++) {
      for (let j = 0; j <= string2.length; j++) {
        tableCells.push(`lcs-${i}-${j}`)
      }
    }

    const dependencies = [
      `lcs-${currentI - 1}-${currentJ - 1}`,
      `lcs-${currentI - 1}-${currentJ}`,
      `lcs-${currentI}-${currentJ - 1}`
    ].filter(id => id.includes('lcs-'))

    return {
      id: 'lcs-sequence',
      description: 'Complete LCS DP animation sequence',
      algorithm: 'longest-common-subsequence',
      category: 'processing',
      words: [
        AnimationVocabulary.DynamicProgramming.tableFill(`lcs-${currentI}-${currentJ}`, null, dependencies),
        ...(string1[currentI - 1] === string2[currentJ - 1] ? [
          AnimationVocabulary.Elementary.emphasize(`lcs-${currentI}-${currentJ}`)
        ] : [])
      ],
      execute: async (params) => {
        const results = []
        for (const word of this.words) {
          const result = await word.execute(params)
          results.push(result)
        }
        return {
          success: results.every(r => r.success),
          data: results.map(r => r.data),
          duration: results.reduce((sum, r) => sum + r.duration, 0)
        }
      },
      metadata: {
        estimatedDuration: (string1.length * string2.length) * 200,
        targetElements: tableCells,
        complexity: 'O(mn)'
      }
    }
  }

  // ============================================================================
  // 🌳 TREE & GRAPH ALGORITHMS
  // ============================================================================

  static binaryTreeTraversal(data: AlgorithmData): AnimationSentence {
    const { tree, traversalType = 'inorder', currentNode } = data
    const nodeElements = collectTreeNodes(tree).map(node => `node-${node}`)
    const visitedOrder = getTraversalOrder(tree, traversalType)

    return {
      id: 'tree-traversal-sequence',
      description: `Complete ${traversalType} tree traversal animation`,
      algorithm: 'binary-tree-traversal',
      category: 'processing',
      words: [
        AnimationVocabulary.Search.depthFirstTraversal(nodeElements, [], visitedOrder.map(id => `node-${id}`)),
        ...(currentNode ? [AnimationVocabulary.Elementary.emphasize(`node-${currentNode}`)] : [])
      ],
      execute: async (params) => {
        const results = []
        for (const word of this.words) {
          const result = await word.execute(params)
          results.push(result)
        }
        return {
          success: results.every(r => r.success),
          data: results.map(r => r.data),
          duration: results.reduce((sum, r) => sum + r.duration, 0)
        }
      },
      metadata: {
        estimatedDuration: nodeElements.length * 400,
        targetElements: nodeElements,
        complexity: 'O(n)'
      }
    }
  }

  static breadthFirstSearch(data: AlgorithmData): AnimationSentence {
    const { graph, startNode, visited = [], queue = [] } = data
    const nodeElements = graph?.nodes?.map(node => `node-${node.id}`) || []
    const visitedElements = visited.map(id => `node-${id}`)

    return {
      id: 'bfs-sequence',
      description: 'Complete BFS traversal animation sequence',
      algorithm: 'breadth-first-search',
      category: 'processing',
      words: [
        AnimationVocabulary.Elementary.fadeInOut('bfs-title', 500),
        AnimationVocabulary.Search.depthFirstTraversal(nodeElements, [], visitedElements),
        AnimationVocabulary.Elementary.colorTransition('bfs-status', ['#22c55e', '#16a34a'])
      ],
      execute: async (params) => {
        const results = []
        for (const word of this.words) {
          const result = await word.execute(params)
          results.push(result)
        }
        return {
          success: results.every(r => r.success),
          data: results.map(r => r.data),
          duration: results.reduce((sum, r) => sum + r.duration, 0)
        }
      },
      metadata: {
        estimatedDuration: (graph?.nodes?.length || 0) * 500,
        targetElements: nodeElements,
        complexity: 'O(V + E)'
      }
    }
  }

  // ============================================================================
  // 🎯 INTRODUCTION & CONCLUSION SEQUENCES
  // ============================================================================

  static algorithmIntroduction(algorithmName: string): AnimationSentence {
    return {
      id: 'intro-sequence',
      description: 'Algorithm introduction animation sequence',
      algorithm: algorithmName,
      category: 'introduction',
      words: [
        AnimationVocabulary.Elementary.fadeInOut('algorithm-title', 800),
        AnimationVocabulary.Elementary.slideInFromDirection('algorithm-description', 'up', 50),
        AnimationVocabulary.Elementary.colorTransition('complexity-display', ['#3b82f6', '#6366f1', '#8b5cf6']),
        AnimationVocabulary.Elementary.emphasize('start-button')
      ],
      execute: async (params) => {
        const results = []
        for (const word of this.words) {
          const result = await word.execute(params)
          results.push(result)
        }
        return {
          success: results.every(r => r.success),
          data: results.map(r => r.data),
          duration: results.reduce((sum, r) => sum + r.duration, 0)
        }
      },
      metadata: {
        estimatedDuration: 2500,
        targetElements: ['algorithm-title', 'algorithm-description', 'complexity-display', 'start-button'],
        complexity: 'Static'
      }
    }
  }

  static algorithmConclusion(success: boolean, algorithmName: string): AnimationSentence {
    return {
      id: 'conclusion-sequence',
      description: 'Algorithm conclusion animation sequence',
      algorithm: algorithmName,
      category: 'conclusion',
      words: success ? [
        AnimationVocabulary.Elementary.colorTransition('result-display', ['#22c55e', '#16a34a']),
        AnimationVocabulary.Elementary.emphasize('success-message'),
        AnimationVocabulary.Elementary.fadeInOut('completion-stats', 1000)
      ] : [
        AnimationVocabulary.Elementary.colorTransition('result-display', ['#ef4444', '#dc2626']),
        AnimationVocabulary.Elementary.fadeInOut('error-message', 800),
        AnimationVocabulary.Elementary.colorTransition('retry-button', ['#f59e0b', '#d97706'])
      ],
      execute: async (params) => {
        const results = []
        for (const word of this.words) {
          const result = await word.execute(params)
          results.push(result)
        }
        return {
          success: results.every(r => r.success),
          data: results.map(r => r.data),
          duration: results.reduce((sum, r) => sum + r.duration, 0)
        }
      },
      metadata: {
        estimatedDuration: success ? 2000 : 1500,
        targetElements: ['result-display', 'success-message', 'completion-stats', 'error-message', 'retry-button'],
        complexity: 'Static'
      }
    }
  }

  // ============================================================================
  // 🔄 COMPARISON SEQUENCES
  // ============================================================================

  static algorithmComparison(algorithm1: string, algorithm2: string, data: AlgorithmData): AnimationSentence {
    const elements1 = getAlgorithmElements(algorithm1, data)
    const elements2 = getAlgorithmElements(algorithm2, data)

    return {
      id: 'comparison-sequence',
      description: `Compare ${algorithm1} vs ${algorithm2} algorithms`,
      algorithm: `${algorithm1}-vs-${algorithm2}`,
      category: 'comparison',
      words: [
        AnimationVocabulary.Elementary.slideInFromDirection('algorithm1-display', 'left', 100),
        AnimationVocabulary.Elementary.slideInFromDirection('algorithm2-display', 'right', 100),
        AnimationVocabulary.Comparison.compareElements('algorithm1-display', 'algorithm2-display'),
        AnimationVocabulary.Elementary.colorTransition('comparison-result', ['#3b82f6', '#22c55e'])
      ],
      execute: async (params) => {
        const results = []
        for (const word of this.words) {
          const result = await word.execute(params)
          results.push(result)
        }
        return {
          success: results.every(r => r.success),
          data: results.map(r => r.data),
          duration: results.reduce((sum, r) => sum + r.duration, 0)
        }
      },
      metadata: {
        estimatedDuration: 3000,
        targetElements: ['algorithm1-display', 'algorithm2-display', 'comparison-result'],
        complexity: 'Static'
      }
    }
  }
}

// ============================================================================
// 🎬 DYNAMIC SENTENCE GENERATOR (From README & Solutions)
// ============================================================================

export class DynamicSentenceGenerator {
  private static algorithmPatterns = {
    'two-sum': {
      pattern: /two.*sum/i,
      generator: AlgorithmSentences.linearSearch
    },
    'binary-search': {
      pattern: /binary.*search/i,
      generator: AlgorithmSentences.binarySearch
    },
    'bubble-sort': {
      pattern: /bubble.*sort/i,
      generator: AlgorithmSentences.bubbleSort
    },
    'quick-sort': {
      pattern: /quick.*sort/i,
      generator: AlgorithmSentences.quickSort
    },
    'merge-sort': {
      pattern: /merge.*sort/i,
      generator: AlgorithmSentences.mergeSort
    },
    'knapsack': {
      pattern: /knapsack/i,
      generator: AlgorithmSentences.knapsack
    },
    'longest-common-subsequence': {
      pattern: /longest.*common.*subsequence|lcs/i,
      generator: AlgorithmSentences.longestCommonSubsequence
    },
    'breadth-first-search': {
      pattern: /breadth.*first.*search|bfs/i,
      generator: AlgorithmSentences.breadthFirstSearch
    },
    'binary-tree-traversal': {
      pattern: /tree.*traversal/i,
      generator: AlgorithmSentences.binaryTreeTraversal
    }
  }

  static generateFromREADME(readmeContent: string, solutionContent: string): AnimationSentence[] {
    const sentences: AnimationSentence[] = []
    const detectedAlgorithms = this.detectAlgorithms(readmeContent, solutionContent)

    for (const algorithm of detectedAlgorithms) {
      const pattern = this.algorithmPatterns[algorithm as keyof typeof this.algorithmPatterns]
      if (pattern) {
        const mockData = this.generateMockData(algorithm)
        const sentence = pattern.generator(mockData)
        sentences.push(sentence)
      }
    }

    return sentences
  }

  static generateFromSolution(solutionPath: string): AnimationSentence | null {
    // Extract algorithm name from file path
    const algorithmName = this.extractAlgorithmFromPath(solutionPath)
    if (!algorithmName) return null

    const pattern = this.algorithmPatterns[algorithmName as keyof typeof this.algorithmPatterns]
    if (!pattern) return null

    const mockData = this.generateMockData(algorithmName)
    return pattern.generator(mockData)
  }

  private static detectAlgorithms(readmeContent: string, solutionContent: string): string[] {
    const detected: string[] = []
    const content = (readmeContent + ' ' + solutionContent).toLowerCase()

    for (const [algorithm, config] of Object.entries(this.algorithmPatterns)) {
      if (config.pattern.test(content)) {
        detected.push(algorithm)
      }
    }

    return [...new Set(detected)] // Remove duplicates
  }

  private static extractAlgorithmFromPath(path: string): string | null {
    const fileName = path.split('/').pop()?.toLowerCase() || ''

    for (const [algorithm, config] of Object.entries(this.algorithmPatterns)) {
      if (config.pattern.test(fileName)) {
        return algorithm
      }
    }

    return null
  }

  private static generateMockData(algorithm: string): AlgorithmData {
    switch (algorithm) {
      case 'two-sum':
        return {
          array: [2, 7, 11, 15],
          target: 9,
          currentIndex: 1,
          hashMap: { 2: 0 },
          complement: 7,
          found: true,
          result: [0, 1]
        }

      case 'binary-search':
        return {
          array: [1, 3, 5, 7, 9, 11, 13, 15],
          target: 7,
          left: 0,
          right: 7,
          mid: 3,
          found: true,
          result: 3
        }

      case 'bubble-sort':
        return {
          array: [64, 34, 25, 12, 22, 11, 90],
          currentIndex: 1,
          compareIndex: 1,
          swapped: true
        }

      case 'quick-sort':
        return {
          array: [10, 7, 8, 9, 1, 5],
          pivot: 1,
          left: 0,
          right: 5
        }

      case 'merge-sort':
        return {
          array: [1, 3, 5, 7, 2, 4, 6, 8],
          leftArray: [1, 3, 5, 7],
          rightArray: [2, 4, 6, 8]
        }

      case 'knapsack':
        return {
          weights: [1, 2, 3, 4],
          values: [10, 20, 30, 40],
          capacity: 5,
          currentItem: 2
        }

      case 'longest-common-subsequence':
        return {
          string1: 'ABCBDAB',
          string2: 'BDCABA',
          currentI: 3,
          currentJ: 2
        }

      case 'breadth-first-search':
        return {
          graph: {
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
          },
          startNode: 'A',
          visited: ['A', 'B'],
          queue: ['C']
        }

      case 'binary-tree-traversal':
        return {
          tree: {
            value: 1,
            left: { value: 2, left: { value: 4 }, right: { value: 5 } },
            right: { value: 3, left: { value: 6 }, right: { value: 7 } }
          },
          traversalType: 'inorder',
          currentNode: 2
        }

      default:
        return {}
    }
  }
}

// ============================================================================
// 🔧 UTILITY FUNCTIONS
// ============================================================================

function collectTreeNodes(tree: any): string[] {
  if (!tree) return []

  const nodes: string[] = [tree.id || tree.value?.toString() || 'root']

  if (tree.left) nodes.push(...collectTreeNodes(tree.left))
  if (tree.right) nodes.push(...collectTreeNodes(tree.right))
  if (tree.children) {
    tree.children.forEach((child: any) => nodes.push(...collectTreeNodes(child)))
  }

  return nodes
}

function getTraversalOrder(tree: any, type: string): string[] {
  if (!tree) return []

  const left = tree.left ? getTraversalOrder(tree.left, type) : []
  const right = tree.right ? getTraversalOrder(tree.right, type) : []
  const current = [tree.id || tree.value?.toString() || 'root']

  switch (type) {
    case 'preorder': return [...current, ...left, ...right]
    case 'inorder': return [...left, ...current, ...right]
    case 'postorder': return [...left, ...right, ...current]
    default: return [...left, ...current, ...right]
  }
}

function getAlgorithmElements(algorithm: string, data: AlgorithmData): string[] {
  switch (algorithm) {
    case 'two-sum':
      return (data.array || []).map((_, i) => `array-${i}`)
    case 'binary-search':
      return (data.array || []).map((_, i) => `array-${i}`)
    case 'bubble-sort':
      return (data.array || []).map((_, i) => `array-${i}`)
    case 'quick-sort':
      return (data.array || []).map((_, i) => `array-${i}`)
    default:
      return []
  }
}

// ============================================================================
// 📤 EXPORTS
// ============================================================================

export { AnimationSentence, AlgorithmSentences, DynamicSentenceGenerator }
