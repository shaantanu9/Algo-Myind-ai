/**
 * Local Storage Manager for Algorithm Data
 * Handles saving and loading generated algorithm pages
 */

interface AlgorithmData {
  id: string
  problemId: number
  title: string
  description: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  category: string
  timeComplexity: string
  spaceComplexity: string
  popularity: number
  estimatedTime: string
  realWorldUse: string
  problemStatement: string
  examples: Array<{
    input: string
    output: string
    explanation: string
  }>
  constraints: string[]
  solution: {
    javascript: string
    explanation: string
  }
  analogy?: {
    title: string
    content: string
  }
  keyInsights?: string[]
  realWorldApplications?: Array<{
    domain: string
    application: string
    description: string
  }>
  engineeringLessons?: Array<{
    principle: string
    lesson: string
    application: string
  }>
  implementations?: {
    bruteForce?: {
      title: string
      timeComplexity: string
      spaceComplexity: string
      code: string
    }
    optimized?: {
      title: string
      timeComplexity: string
      spaceComplexity: string
      code: string
    }
  }
  animationStates?: Array<{
    step: number
    title: string
    description: string
    data: any
  }>
  animation: {
    interactiveData: any
  }
  metadata: {
    tags: string[]
    acceptanceRate?: string
    frequency?: number
  }
  createdAt?: number
  lastModified?: number
}

export class LocalStorageManager {
  private static readonly STORAGE_KEY = 'dsa-learning-algorithms'
  private static readonly MAX_ALGORITHMS = 50

  /**
   * Save algorithm data to localStorage
   */
  static saveAlgorithm(algorithmData: AlgorithmData): boolean {
    try {
      // Check if running in browser environment
      if (typeof window === 'undefined' || !window.localStorage) {
        console.warn('localStorage not available')
        return false
      }

      // Validate required fields
      if (!algorithmData.id || !algorithmData.title || !algorithmData.problemId) {
        console.error('Invalid algorithm data - missing required fields:', algorithmData)
        return false
      }

      // Ensure algorithm data has all required fields with defaults
      const validatedData: AlgorithmData = {
        ...algorithmData,
        popularity: algorithmData.popularity || 75,
        estimatedTime: algorithmData.estimatedTime || '20 min',
        realWorldUse: algorithmData.realWorldUse || 'Various algorithmic applications',
        problemStatement: algorithmData.problemStatement || algorithmData.description || '',
        examples: algorithmData.examples || [],
        constraints: algorithmData.constraints || [],
        solution: algorithmData.solution || { javascript: '', explanation: '' },
        metadata: {
          tags: algorithmData.metadata?.tags || [],
          acceptanceRate: algorithmData.metadata?.acceptanceRate || 'N/A',
          frequency: algorithmData.metadata?.frequency || 0
        },
        createdAt: algorithmData.createdAt || Date.now(),
        lastModified: Date.now()
      }

      const existingData = this.loadAllAlgorithms()

      // Check if algorithm already exists, update it
      const existingIndex = existingData.findIndex(
        algo => algo.id === validatedData.id || algo.problemId === validatedData.problemId
      )

      if (existingIndex >= 0) {
        existingData[existingIndex] = validatedData
        console.log(`📝 Updated algorithm "${validatedData.title}" in localStorage`)
      } else {
        // Add new algorithm
        existingData.unshift(validatedData)
        console.log(`➕ Added new algorithm "${validatedData.title}" to localStorage`)
      }

      // Limit the number of stored algorithms
      if (existingData.length > this.MAX_ALGORITHMS) {
        existingData.splice(this.MAX_ALGORITHMS)
      }

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(existingData))
      console.log(`✅ Successfully saved algorithm "${validatedData.title}" (ID: ${validatedData.problemId})`)
      return true
    } catch (error) {
      console.error('Failed to save algorithm to localStorage:', error)
      console.error('Algorithm data:', algorithmData)
      return false
    }
  }

  /**
   * Load algorithm data from localStorage by ID
   */
  static loadAlgorithm(algorithmId: string): AlgorithmData | null {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return null
      }

      const algorithms = this.loadAllAlgorithms()
      return algorithms.find(algo => algo.id === algorithmId) || null
    } catch (error) {
      console.error('Failed to load algorithm from localStorage:', error)
      return null
    }
  }

  /**
   * Load algorithm data from localStorage by problem ID
   */
  static loadAlgorithmByProblemId(problemId: number): AlgorithmData | null {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return null
      }

      const algorithms = this.loadAllAlgorithms()
      return algorithms.find(algo => algo.problemId === problemId) || null
    } catch (error) {
      console.error('Failed to load algorithm from localStorage:', error)
      return null
    }
  }

  /**
   * Load all algorithms from localStorage
   */
  static loadAllAlgorithms(): AlgorithmData[] {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return []
      }

      const data = localStorage.getItem(this.STORAGE_KEY)
      if (!data) return []

      const algorithms = JSON.parse(data)

      // Validate and clean data
      return algorithms.filter((algo: any) =>
        algo &&
        typeof algo === 'object' &&
        algo.id &&
        algo.title
      )
    } catch (error) {
      console.error('Failed to load algorithms from localStorage:', error)
      return []
    }
  }

  /**
   * Check if an algorithm exists in localStorage
   */
  static algorithmExists(algorithmId: string): boolean {
    return this.loadAlgorithm(algorithmId) !== null
  }

  /**
   * Delete algorithm from localStorage
   */
  static deleteAlgorithm(algorithmId: string): boolean {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return false
      }

      const algorithms = this.loadAllAlgorithms()
      const filteredAlgorithms = algorithms.filter(algo => algo.id !== algorithmId)

      if (filteredAlgorithms.length !== algorithms.length) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredAlgorithms))
        console.log(`🗑️ Algorithm "${algorithmId}" deleted from localStorage`)
        return true
      }

      return false
    } catch (error) {
      console.error('Failed to delete algorithm from localStorage:', error)
      return false
    }
  }

  /**
   * Get storage statistics
   */
  static getStorageStats(): {
    totalAlgorithms: number
    totalSize: number
    lastModified?: number
  } {
    try {
      const algorithms = this.loadAllAlgorithms()
      const data = localStorage.getItem(this.STORAGE_KEY) || '[]'

      return {
        totalAlgorithms: algorithms.length,
        totalSize: new Blob([data]).size,
        lastModified: algorithms.length > 0 ? Math.max(...algorithms.map(a => a.lastModified || 0)) : undefined
      }
    } catch (error) {
      return {
        totalAlgorithms: 0,
        totalSize: 0
      }
    }
  }

  /**
   * Clear all algorithms from localStorage
   */
  static clearAllAlgorithms(): boolean {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return false
      }

      localStorage.removeItem(this.STORAGE_KEY)
      console.log('🧹 All algorithms cleared from localStorage')
      return true
    } catch (error) {
      console.error('Failed to clear algorithms from localStorage:', error)
      return false
    }
  }

  /**
   * Export algorithms as JSON
   */
  static exportAlgorithms(): string {
    try {
      const algorithms = this.loadAllAlgorithms()
      return JSON.stringify(algorithms, null, 2)
    } catch (error) {
      console.error('Failed to export algorithms:', error)
      return '[]'
    }
  }

  /**
   * Import algorithms from JSON
   */
  static importAlgorithms(jsonData: string): boolean {
    try {
      const algorithms = JSON.parse(jsonData)
      if (!Array.isArray(algorithms)) {
        throw new Error('Invalid JSON format')
      }

      // Validate each algorithm
      const validAlgorithms = algorithms.filter(algo =>
        algo &&
        typeof algo === 'object' &&
        algo.id &&
        algo.title
      )

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(validAlgorithms))
      console.log(`📥 Imported ${validAlgorithms.length} algorithms`)
      return true
    } catch (error) {
      console.error('Failed to import algorithms:', error)
      return false
    }
  }

  /**
   * Search algorithms by query
   */
  static searchAlgorithms(query: string): AlgorithmData[] {
    try {
      const algorithms = this.loadAllAlgorithms()
      const lowerQuery = query.toLowerCase()

      return algorithms.filter(algo =>
        algo.title.toLowerCase().includes(lowerQuery) ||
        algo.description.toLowerCase().includes(lowerQuery) ||
        algo.category.toLowerCase().includes(lowerQuery) ||
        algo.metadata?.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
      )
    } catch (error) {
      console.error('Failed to search algorithms:', error)
      return []
    }
  }

  /**
   * Get recently used algorithms
   */
  static getRecentlyUsed(limit: number = 10): AlgorithmData[] {
    try {
      const algorithms = this.loadAllAlgorithms()
      return algorithms
        .sort((a, b) => (b.lastModified || 0) - (a.lastModified || 0))
        .slice(0, limit)
    } catch (error) {
      console.error('Failed to get recently used algorithms:', error)
      return []
    }
  }

  /**
   * Update algorithm usage timestamp
   */
  static markAlgorithmAsUsed(algorithmId: string): boolean {
    try {
      const algorithm = this.loadAlgorithm(algorithmId)
      if (!algorithm) return false

      algorithm.lastModified = Date.now()
      return this.saveAlgorithm(algorithm)
    } catch (error) {
      console.error('Failed to mark algorithm as used:', error)
      return false
    }
  }
}
