/**
 * LEETCODE ANIMATION INTEGRATION
 * Bridge between LeetCodeAnimation-master and our TypeScript animation system
 */

import { animationOrchestrator, DynamicAnimationGenerator } from './animation-orchestrator'
import { ParsedAlgorithm, READMEParser, SolutionParser } from './algorithm-parser'
import { AnimationDataTransformer } from './data-transformers'
import * as fs from 'fs'
import * as path from 'path'

export interface LeetCodeAnimation {
  problemId: number
  title: string
  animationGifUrl: string
  articleContent: string
  algorithmData: any
  metadata: {
    difficulty: string
    tags: string[]
    acceptanceRate: string
    frequency: number
  }
}

// ============================================================================
// 🎬 LEETCODE ANIMATION LOADER
// ============================================================================

export class LeetCodeAnimationLoader {
  private static leetCodeAnimationPath = '/Users/shantanubombatkar/Downloads/dsa-learning-app/LeetCodeAnimation-master'

  static async loadAllAnimations(): Promise<LeetCodeAnimation[]> {
    const animations: LeetCodeAnimation[] = []

    try {
      const algorithmFolders = await this.getAlgorithmFolders()

      for (const folder of algorithmFolders) {
        const animation = await this.loadAnimationFromFolder(folder)
        if (animation) {
          animations.push(animation)
        }
      }

      console.log(`✅ Loaded ${animations.length} LeetCode animations`)
      return animations

    } catch (error) {
      console.error('❌ Failed to load LeetCode animations:', error)
      return []
    }
  }

  static async loadAnimationById(problemId: number): Promise<LeetCodeAnimation | null> {
    try {
      const folderName = await this.findAlgorithmFolder(problemId)
      if (!folderName) return null

      return await this.loadAnimationFromFolder(folderName)
    } catch (error) {
      console.error(`❌ Failed to load animation for problem ${problemId}:`, error)
      return null
    }
  }

  private static async getAlgorithmFolders(): Promise<string[]> {
    const fullPath = this.leetCodeAnimationPath

    if (!fs.existsSync(fullPath)) {
      console.warn('⚠️ LeetCodeAnimation-master folder not found')
      return []
    }

    const items = fs.readdirSync(fullPath)
    return items.filter(item => {
      const itemPath = path.join(fullPath, item)
      return fs.statSync(itemPath).isDirectory() &&
             /^\d{4}-/.test(item) // Matches pattern like "0001-Two-Sum"
    })
  }

  private static async findAlgorithmFolder(problemId: number): Promise<string | null> {
    const folders = await this.getAlgorithmFolders()
    const targetPattern = `${problemId.toString().padStart(4, '0')}-`

    for (const folder of folders) {
      if (folder.startsWith(targetPattern)) {
        return folder
      }
    }

    return null
  }

  private static async loadAnimationFromFolder(folderName: string): Promise<LeetCodeAnimation | null> {
    try {
      const folderPath = path.join(this.leetCodeAnimationPath, folderName)
      const animationPath = path.join(folderPath, 'Animation')
      const articlePath = path.join(folderPath, 'Article')

      // Extract problem ID from folder name
      const problemIdMatch = folderName.match(/^(\d{4})/)
      if (!problemIdMatch) return null

      const problemId = parseInt(problemIdMatch[1])

      // Load animation GIF
      const gifPath = path.join(animationPath, 'Animation.gif')
      const gifExists = fs.existsSync(gifPath)

      // Load article content
      const articleFiles = fs.readdirSync(articlePath)
      const mdFile = articleFiles.find(file => file.endsWith('.md'))
      let articleContent = ''

      if (mdFile) {
        const mdPath = path.join(articlePath, mdFile)
        articleContent = fs.readFileSync(mdPath, 'utf-8')
      }

      // Extract algorithm data from content
      const algorithmData = await this.extractAlgorithmData(articleContent, problemId)

      // Create GIF URL (for local access)
      const gifUrl = gifExists ? `file://${gifPath}` : ''

      return {
        problemId,
        title: this.extractTitleFromFolder(folderName),
        animationGifUrl: gifUrl,
        articleContent,
        algorithmData,
        metadata: await this.extractMetadata(articleContent)
      }

    } catch (error) {
      console.error(`❌ Failed to load animation from folder ${folderName}:`, error)
      return null
    }
  }

  private static extractTitleFromFolder(folderName: string): string {
    // Convert "0001-Two-Sum" to "Two Sum"
    return folderName
      .replace(/^\d{4}-/, '') // Remove problem ID
      .replace(/-/g, ' ') // Replace hyphens with spaces
      .trim()
  }

  private static async extractAlgorithmData(content: string, problemId: number): Promise<any> {
    // Use our existing parsers to extract algorithm data
    const parsed = READMEParser.parse(content)[0]

    if (parsed) {
      return parsed.animationData
    }

    // Fallback: create basic algorithm data based on problem ID
    return this.createFallbackAlgorithmData(problemId)
  }

  private static async extractMetadata(content: string): Promise<LeetCodeAnimation['metadata']> {
    // Extract metadata from article content
    const difficulty = this.extractDifficulty(content)
    const tags = this.extractTags(content)
    const acceptanceRate = this.extractAcceptanceRate(content)
    const frequency = this.extractFrequency(content)

    return {
      difficulty,
      tags,
      acceptanceRate,
      frequency
    }
  }

  private static extractDifficulty(content: string): string {
    const contentLower = content.toLowerCase()

    if (contentLower.includes('easy') || contentLower.includes('简单')) return 'Easy'
    if (contentLower.includes('medium') || contentLower.includes('中等')) return 'Medium'
    if (contentLower.includes('hard') || contentLower.includes('困难')) return 'Hard'

    return 'Medium' // Default
  }

  private static extractTags(content: string): string[] {
    const tags: string[] = []

    // Common algorithm tags based on content analysis
    const tagPatterns = {
      'Array': /\b(array|数组)\b/i,
      'String': /\b(string|字符串)\b/i,
      'Hash Table': /\b(hash|哈希|map)\b/i,
      'Dynamic Programming': /\b(dynamic|动态规划|dp)\b/i,
      'Tree': /\b(tree|树|binary tree)\b/i,
      'Graph': /\b(graph|图)\b/i,
      'Sorting': /\b(sort|排序)\b/i,
      'Searching': /\b(search|查找)\b/i,
      'Linked List': /\b(linked list|链表)\b/i,
      'Stack': /\b(stack|栈)\b/i,
      'Queue': /\b(queue|队列)\b/i,
      'Recursion': /\b(recursion|递归)\b/i,
      'Backtracking': /\b(backtrack|回溯)\b/i,
      'Greedy': /\b(greedy|贪心)\b/i
    }

    for (const [tag, pattern] of Object.entries(tagPatterns)) {
      if (pattern.test(content)) {
        tags.push(tag)
      }
    }

    return tags
  }

  private static extractAcceptanceRate(content: string): string {
    // Look for acceptance rate in content
    const match = content.match(/(\d+(\.\d+)?)%/)
    return match ? match[1] + '%' : 'Unknown'
  }

  private static extractFrequency(content: string): number {
    // Extract frequency score (if available)
    const match = content.match(/frequency[:\s]*(\d+)/i)
    return match ? parseInt(match[1]) : 0
  }

  private static createFallbackAlgorithmData(problemId: number): any {
    // Create basic algorithm data for common LeetCode problems
    const problemData: Record<number, any> = {
      1: { // Two Sum
        array: [2, 7, 11, 15],
        target: 9,
        currentIndex: 0,
        hashMap: {},
        found: false,
        result: []
      },
      2: { // Add Two Numbers
        list1: [2, 4, 3],
        list2: [5, 6, 4],
        currentIndex: 0,
        carry: 0,
        result: []
      },
      11: { // Container With Most Water
        height: [1, 8, 6, 2, 5, 4, 8, 3, 7],
        left: 0,
        right: 8,
        maxArea: 0,
        currentArea: 0
      },
      20: { // Valid Parentheses
        string: '()[]{}',
        stack: [],
        currentIndex: 0,
        isValid: true
      },
      21: { // Merge Two Sorted Lists
        list1: [1, 2, 4],
        list2: [1, 3, 4],
        result: [],
        current1: 0,
        current2: 0
      }
    }

    return problemData[problemId] || {}
  }
}

// ============================================================================
// 🎭 INTEGRATED ANIMATION SYSTEM
// ============================================================================

export class IntegratedAnimationSystem {
  private static loadedAnimations: Map<number, LeetCodeAnimation> = new Map()

  static async initialize(): Promise<void> {
    console.log('🚀 Initializing Integrated Animation System...')

    try {
      // Load all LeetCode animations
      const animations = await LeetCodeAnimationLoader.loadAllAnimations()

      // Store in memory for quick access
      for (const animation of animations) {
        this.loadedAnimations.set(animation.problemId, animation)
      }

      console.log(`✅ Loaded ${animations.length} integrated animations`)

      // Register with our main animation orchestrator
      this.registerWithOrchestrator()

    } catch (error) {
      console.error('❌ Failed to initialize integrated animation system:', error)
    }
  }

  static async animateLeetCodeProblem(
    problemId: number,
    visualizationType: 'mermaid' | 'reactflow' | 'd3' | 'three' | 'gif' = 'mermaid'
  ): Promise<any> {
    const animation = this.loadedAnimations.get(problemId)

    if (!animation) {
      console.warn(`⚠️ Animation for problem ${problemId} not found`)
      return null
    }

    if (visualizationType === 'gif') {
      // Return GIF animation data
      return {
        type: 'gif',
        url: animation.animationGifUrl,
        title: animation.title,
        metadata: animation.metadata
      }
    }

    // Use our TypeScript animation system
    try {
      const result = await animationOrchestrator.animateAlgorithm(
        animation.title.toLowerCase().replace(/\s+/g, '-'),
        animation.algorithmData,
        visualizationType,
        { autoPlay: true }
      )

      return {
        type: 'interactive',
        result,
        metadata: animation.metadata,
        articleContent: animation.articleContent
      }

    } catch (error) {
      console.error(`❌ Failed to animate problem ${problemId}:`, error)

      // Fallback to GIF
      return {
        type: 'gif',
        url: animation.animationGifUrl,
        title: animation.title,
        metadata: animation.metadata
      }
    }
  }

  static getAvailableAnimations(): LeetCodeAnimation[] {
    return Array.from(this.loadedAnimations.values())
  }

  static getAnimationById(problemId: number): LeetCodeAnimation | undefined {
    return this.loadedAnimations.get(problemId)
  }

  static searchAnimations(query: string): LeetCodeAnimation[] {
    const queryLower = query.toLowerCase()
    return Array.from(this.loadedAnimations.values()).filter(animation =>
      animation.title.toLowerCase().includes(queryLower) ||
      animation.metadata.tags.some(tag => tag.toLowerCase().includes(queryLower)) ||
      animation.metadata.difficulty.toLowerCase().includes(queryLower)
    )
  }

  private static registerWithOrchestrator(): void {
    // Register custom renderer for GIF animations
    animationOrchestrator.registerRenderer('gif', {
      render: (containerId: string, data: any) => {
        const container = document.getElementById(containerId)
        if (container && data.url) {
          container.innerHTML = `
            <div class="gif-animation-container">
              <h3 class="text-lg font-semibold mb-4">${data.title}</h3>
              <img src="${data.url}" alt="${data.title} Animation"
                   class="max-w-full h-auto rounded-lg shadow-lg" />
              <div class="mt-4 text-sm text-gray-600">
                <span class="px-2 py-1 bg-blue-100 text-blue-800 rounded">
                  ${data.metadata.difficulty}
                </span>
                ${data.metadata.tags.map(tag =>
                  `<span class="ml-2 px-2 py-1 bg-gray-100 text-gray-600 rounded">${tag}</span>`
                ).join('')}
              </div>
            </div>
          `
        }
      },
      update: (containerId: string, data: any) => {
        // GIF animations are static, no update needed
      }
    })

    console.log('✅ GIF renderer registered with orchestrator')
  }
}

// ============================================================================
// 🎬 DEMO FUNCTIONS
// ============================================================================

export const LeetCodeAnimationDemos = {
  async loadAndDisplayAnimation(problemId: number): Promise<void> {
    console.log(`🎬 Loading LeetCode animation for problem ${problemId}...`)

    try {
      const result = await IntegratedAnimationSystem.animateLeetCodeProblem(problemId, 'gif')

      if (result) {
        console.log('✅ Animation loaded:', result.title)
        console.log('📊 Metadata:', result.metadata)
        console.log('🎭 Type:', result.type)

        if (result.type === 'gif' && result.url) {
          console.log('🖼️ GIF URL:', result.url)
        }
      } else {
        console.log('❌ Animation not found')
      }

    } catch (error) {
      console.error('❌ Failed to load animation:', error)
    }
  },

  async searchAndAnimate(query: string): Promise<void> {
    console.log(`🔍 Searching for animations: "${query}"`)

    const results = IntegratedAnimationSystem.searchAnimations(query)
    console.log(`📋 Found ${results.length} matching animations`)

    for (const result of results.slice(0, 3)) { // Show first 3
      console.log(`🎯 ${result.problemId}: ${result.title} (${result.metadata.difficulty})`)
      console.log(`   Tags: ${result.metadata.tags.join(', ')}`)
      console.log(`   GIF: ${result.animationGifUrl ? 'Available' : 'Not available'}`)
      console.log('')
    }
  },

  async benchmarkLoading(): Promise<void> {
    console.log('⚡ Benchmarking animation loading...')

    const startTime = Date.now()
    const animations = IntegratedAnimationSystem.getAvailableAnimations()
    const loadTime = Date.now() - startTime

    console.log(`📊 Loaded ${animations.length} animations in ${loadTime}ms`)
    console.log(`📈 Average: ${(loadTime / animations.length).toFixed(2)}ms per animation`)

    // Test random animation loading
    const testIds = [1, 11, 20, 21, 75] // Popular algorithms
    const testStart = Date.now()

    for (const id of testIds) {
      await IntegratedAnimationSystem.animateLeetCodeProblem(id, 'gif')
    }

    const testTime = Date.now() - testStart
    console.log(`🎯 Loaded 5 popular animations in ${testTime}ms`)
    console.log(`📈 Average: ${(testTime / testIds.length).toFixed(2)}ms per animation`)
  },

  async showStatistics(): Promise<void> {
    console.log('📊 LeetCode Animation Statistics')
    console.log('=' .repeat(50))

    const animations = IntegratedAnimationSystem.getAvailableAnimations()

    // Difficulty distribution
    const difficulties = animations.reduce((acc, anim) => {
      acc[anim.metadata.difficulty] = (acc[anim.metadata.difficulty] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    console.log('🎯 Difficulty Distribution:')
    Object.entries(difficulties).forEach(([diff, count]) => {
      console.log(`   ${diff}: ${count} animations`)
    })

    // Tag frequency
    const allTags = animations.flatMap(anim => anim.metadata.tags)
    const tagCounts = allTags.reduce((acc, tag) => {
      acc[tag] = (acc[tag] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    console.log('\n🏷️ Popular Tags:')
    Object.entries(tagCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .forEach(([tag, count]) => {
        console.log(`   ${tag}: ${count} animations`)
      })

    // GIF availability
    const withGif = animations.filter(anim => anim.animationGifUrl).length
    console.log(`\n🖼️ GIF Availability: ${withGif}/${animations.length} (${((withGif/animations.length)*100).toFixed(1)}%)`)

    console.log(`\n📈 Total Animations: ${animations.length}`)
  }
}

// ============================================================================
// 🚀 AUTO-INITIALIZE
// ============================================================================

// Initialize the integrated system when module is imported
if (typeof window !== 'undefined') {
  // Browser environment
  IntegratedAnimationSystem.initialize().then(() => {
    console.log('🎭 LeetCode Animation Integration Ready!')
  })
}

// Export everything
export { LeetCodeAnimationLoader, IntegratedAnimationSystem, LeetCodeAnimationDemos }
