/**
 * 🎭 ULTIMATE ANIMATION SYSTEM - MASTER INTEGRATION
 * The complete algorithmic visualization powerhouse
 *
 * This file brings together:
 * - Atomic animation system (animation-atoms.ts)
 * - Word composition system (animation-words.ts)
 * - Sentence animation system (animation-sentences.ts)
 * - Algorithm parsing system (algorithm-parser.ts)
 * - Data transformation system (data-transformers.ts)
 * - Visual generation system (visual-generators.ts)
 * - Animation composition system (animation-composers.ts)
 * - Animation preset system (animation-presets.ts)
 * - Performance optimization system (animation-optimizer.ts)
 * - LeetCode integration system (leetcode-integration.ts)
 * - Master orchestrator (animation-orchestrator.ts)
 *
 * Usage:
 * ```typescript
 * import { UltimateAnimationSystem } from '@/lib/ultimate-animation-system'
 *
 * // Initialize everything
 * await UltimateAnimationSystem.initialize()
 *
 * // Animate any algorithm from LeetCode
 * await UltimateAnimationSystem.animate(1, 'mermaid') // Problem 1 (Two Sum)
 *
 * // Or create custom animations
 * await UltimateAnimationSystem.create({
 *   algorithm: 'custom-algorithm',
 *   data: myData,
 *   visualization: 'd3',
 *   options: { autoPlay: true, speed: 1.5 }
 * })
 * ```
 */

import { animationOrchestrator, AnimationDemos } from './animation-orchestrator'
import { IntegratedAnimationSystem, LeetCodeAnimationDemos } from './leetcode-integration'
import { AnimationSystemDemo } from './animation-demo'
import { LeetCodeIntegrationDemo, leetCodeQuickStart } from './leetcode-demo'

// ============================================================================
// 🎭 ULTIMATE ANIMATION SYSTEM
// ============================================================================

export class UltimateAnimationSystem {
  private static initialized = false

  /**
   * Initialize the complete animation system
   */
  static async initialize(): Promise<boolean> {
    if (this.initialized) {
      console.log('✅ Ultimate Animation System already initialized')
      return true
    }

    console.log('🚀 Initializing Ultimate Animation System...')
    console.log('🎭 This will take a moment to load all animations...')

    try {
      // Initialize core animation system
      console.log('🎯 Initializing core animation orchestrator...')
      // Note: animationOrchestrator auto-initializes

      // Initialize LeetCode integration
      console.log('📚 Initializing LeetCode animation integration...')
      await IntegratedAnimationSystem.initialize()

      // Verify everything is working
      const animations = IntegratedAnimationSystem.getAvailableAnimations()
      console.log(`📊 Loaded ${animations.length} algorithm animations`)

      this.initialized = true

      console.log('🎉 Ultimate Animation System initialized successfully!')
      console.log('🎯 Your DSA app now has WORLD-CLASS animations!')
      console.log('')
      console.log('💡 Quick Start:')
      console.log('   • Use animate(problemId) for LeetCode problems')
      console.log('   • Use search(query) to find algorithms')
      console.log('   • Use demo() to see the full system in action')
      console.log('   • Use stats() to see available animations')

      return true

    } catch (error) {
      console.error('❌ Failed to initialize Ultimate Animation System:', error)
      return false
    }
  }

  /**
   * Animate a LeetCode problem by ID
   */
  static async animate(
    problemId: number,
    visualizationType: 'mermaid' | 'reactflow' | 'd3' | 'three' | 'gif' = 'mermaid',
    options: {
      autoPlay?: boolean
      speed?: number
      interactive?: boolean
    } = {}
  ): Promise<any> {
    if (!this.initialized) {
      throw new Error('Ultimate Animation System not initialized. Call initialize() first.')
    }

    console.log(`🎬 Animating LeetCode Problem ${problemId} with ${visualizationType}...`)

    try {
      const result = await IntegratedAnimationSystem.animateLeetCodeProblem(
        problemId,
        visualizationType
      )

      if (result) {
        console.log(`✅ Animation ready: ${result.title || 'Unknown'}`)

        if (visualizationType !== 'gif') {
          // Use our TypeScript animation system for interactive visualizations
          const algorithmData = result.algorithmData || {}
          await animationOrchestrator.animateAlgorithm(
            `leetcode-${problemId}`,
            algorithmData,
            visualizationType,
            {
              autoPlay: options.autoPlay ?? true,
              speed: options.speed ?? 1,
              interactive: options.interactive ?? true
            }
          )
        }

        return result
      } else {
        console.warn(`⚠️ Animation for problem ${problemId} not found`)
        return null
      }

    } catch (error) {
      console.error(`❌ Failed to animate problem ${problemId}:`, error)

      // Try fallback to GIF
      try {
        const fallback = await IntegratedAnimationSystem.animateLeetCodeProblem(problemId, 'gif')
        if (fallback) {
          console.log('⚠️ Using GIF fallback animation')
          return fallback
        }
      } catch (fallbackError) {
        console.error('❌ Fallback also failed:', fallbackError)
      }

      return null
    }
  }

  /**
   * Search for animations
   */
  static search(query: string): any[] {
    if (!this.initialized) {
      console.warn('⚠️ Ultimate Animation System not initialized')
      return []
    }

    const results = IntegratedAnimationSystem.searchAnimations(query)
    console.log(`🔍 Found ${results.length} animations for "${query}"`)

    return results
  }

  /**
   * Get system statistics
   */
  static stats(): any {
    if (!this.initialized) {
      console.warn('⚠️ Ultimate Animation System not initialized')
      return { initialized: false }
    }

    const animations = IntegratedAnimationSystem.getAvailableAnimations()

    const stats = {
      initialized: true,
      totalAnimations: animations.length,
      difficulties: {} as Record<string, number>,
      tags: {} as Record<string, number>,
      gifAvailability: 0
    }

    animations.forEach(animation => {
      // Count difficulties
      stats.difficulties[animation.metadata.difficulty] =
        (stats.difficulties[animation.metadata.difficulty] || 0) + 1

      // Count tags
      animation.metadata.tags.forEach(tag => {
        stats.tags[tag] = (stats.tags[tag] || 0) + 1
      })

      // Count GIF availability
      if (animation.animationGifUrl) {
        stats.gifAvailability++
      }
    })

    console.log('📊 Animation System Statistics:')
    console.log(`   Total: ${stats.totalAnimations} animations`)
    console.log(`   GIF Available: ${stats.gifAvailability}/${stats.totalAnimations}`)
    console.log(`   Difficulties:`, stats.difficulties)
    console.log(`   Top Tags:`, Object.entries(stats.tags)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([tag, count]) => `${tag}(${count})`)
      .join(', ')
    )

    return stats
  }

  /**
   * Create custom algorithm animation
   */
  static async create(options: {
    algorithm: string
    data: any
    visualization?: 'mermaid' | 'reactflow' | 'd3' | 'three'
    options?: any
  }): Promise<any> {
    if (!this.initialized) {
      throw new Error('Ultimate Animation System not initialized. Call initialize() first.')
    }

    const { algorithm, data, visualization = 'mermaid', options = {} } = options

    console.log(`🎨 Creating custom animation for ${algorithm}...`)

    try {
      const result = await animationOrchestrator.animateAlgorithm(
        algorithm,
        data,
        visualization,
        options
      )

      console.log(`✅ Custom animation created for ${algorithm}`)
      return result

    } catch (error) {
      console.error(`❌ Failed to create custom animation:`, error)
      return null
    }
  }

  /**
   * Run the complete system demo
   */
  static async demo(): Promise<any> {
    console.log('🎬 Running Ultimate Animation System Demo...')

    const results = {
      coreDemo: false,
      leetCodeDemo: false,
      advancedDemo: false
    }

    try {
      // Run core animation system demo
      console.log('\n🎯 Running Core Animation System Demo...')
      await AnimationSystemDemo.runFullDemo()
      results.coreDemo = true

      // Run LeetCode integration demo
      console.log('\n📚 Running LeetCode Integration Demo...')
      await LeetCodeIntegrationDemo.runCompleteDemo()
      results.leetCodeDemo = true

      // Run advanced demonstrations
      console.log('\n🚀 Running Advanced Demonstrations...')
      await AnimationSystemDemo.demonstrateAdvancedUsage()
      await LeetCodeIntegrationDemo.demonstrateAdvancedFeatures()
      await LeetCodeIntegrationDemo.showPracticalExamples()
      results.advancedDemo = true

      console.log('\n🎉 ALL DEMOS COMPLETED SUCCESSFULLY!')
      console.log('🎭 Your Ultimate Animation System is WORKING PERFECTLY!')

      return results

    } catch (error) {
      console.error('❌ Demo failed:', error)
      return { error: error.message, ...results }
    }
  }

  /**
   * Get all available animations
   */
  static getAllAnimations(): any[] {
    if (!this.initialized) {
      console.warn('⚠️ Ultimate Animation System not initialized')
      return []
    }

    return IntegratedAnimationSystem.getAvailableAnimations()
  }

  /**
   * Get animation by problem ID
   */
  static getAnimation(problemId: number): any {
    if (!this.initialized) {
      console.warn('⚠️ Ultimate Animation System not initialized')
      return null
    }

    return IntegratedAnimationSystem.getAnimationById(problemId)
  }

  /**
   * Check if system is initialized
   */
  static isInitialized(): boolean {
    return this.initialized
  }
}

// ============================================================================
// 🎯 CONVENIENCE FUNCTIONS
// ============================================================================

export const UAS = {
  // Initialize the system
  async init() {
    return await UltimateAnimationSystem.initialize()
  },

  // Quick animation by problem ID
  async animate(problemId: number, viz: string = 'mermaid') {
    return await UltimateAnimationSystem.animate(problemId, viz as any)
  },

  // Quick search
  search(query: string) {
    return UltimateAnimationSystem.search(query)
  },

  // Quick stats
  stats() {
    return UltimateAnimationSystem.stats()
  },

  // Quick demo
  async demo() {
    return await UltimateAnimationSystem.demo()
  },

  // Quick custom animation
  async create(options: any) {
    return await UltimateAnimationSystem.create(options)
  }
}

// ============================================================================
// 🎬 DEMO SCENARIOS
// ============================================================================

export const UltimateAnimationScenarios = {
  // Scenario 1: Learning a new algorithm
  async scenario1_LearningAlgorithm() {
    console.log('📚 SCENARIO 1: Learning a New Algorithm')
    console.log('🎯 Student wants to learn Two Sum algorithm')

    // Initialize system
    await UltimateAnimationSystem.initialize()

    // Load Two Sum animation
    console.log('🎬 Loading Two Sum animation...')
    const animation = await UltimateAnimationSystem.animate(1, 'mermaid', {
      autoPlay: true,
      interactive: true
    })

    // Show related algorithms
    console.log('🔍 Finding related algorithms...')
    const related = UltimateAnimationSystem.search('array')
    console.log(`📋 Found ${related.length} array algorithms for further learning`)

    // Show algorithm details
    if (animation) {
      console.log('📖 Algorithm Details:')
      console.log(`   🎯 Title: ${animation.title}`)
      console.log(`   🏷️ Tags: ${animation.metadata.tags.join(', ')}`)
      console.log(`   🎭 Difficulty: ${animation.metadata.difficulty}`)
    }

    return { animation, related }
  },

  // Scenario 2: Comparing algorithms
  async scenario2_ComparingAlgorithms() {
    console.log('⚖️ SCENARIO 2: Comparing Sorting Algorithms')
    console.log('🎯 Student wants to compare different sorting approaches')

    await UltimateAnimationSystem.initialize()

    // Load different sorting algorithms
    const sortingAlgorithms = [
      { id: 75, name: 'Sort Colors' },
      { id: 88, name: 'Merge Sorted Array' }
    ]

    const results = []

    for (const { id, name } of sortingAlgorithms) {
      console.log(`🎬 Loading ${name} animation...`)
      const result = await UltimateAnimationSystem.animate(id, 'd3', {
        autoPlay: false,
        speed: 1.2
      })
      results.push({ name, result })
    }

    // Show comparison
    console.log('📊 Comparison Results:')
    results.forEach(({ name, result }) => {
      if (result) {
        console.log(`   ✅ ${name}: ${result.metadata.difficulty} difficulty`)
        console.log(`      🏷️ Tags: ${result.metadata.tags.join(', ')}`)
      }
    })

    return results
  },

  // Scenario 3: Practice session
  async scenario3_PracticeSession() {
    console.log('🎯 SCENARIO 3: Practice Session')
    console.log('🎯 Student wants to practice medium difficulty problems')

    await UltimateAnimationSystem.initialize()

    // Find medium difficulty problems
    const mediumProblems = UltimateAnimationSystem.search('medium')
    console.log(`📋 Found ${mediumProblems.length} medium difficulty problems`)

    // Load a few for practice
    const practiceProblems = mediumProblems.slice(0, 3)

    for (const problem of practiceProblems) {
      console.log(`🎬 Practicing: ${problem.title}`)
      await UltimateAnimationSystem.animate(problem.problemId, 'reactflow', {
        autoPlay: false,
        interactive: true
      })
    }

    return practiceProblems
  },

  // Scenario 4: Deep dive into a topic
  async scenario4_DeepDive() {
    console.log('🔬 SCENARIO 4: Deep Dive into Dynamic Programming')
    console.log('🎯 Student wants to master DP algorithms')

    await UltimateAnimationSystem.initialize()

    // Find all DP algorithms
    const dpAlgorithms = UltimateAnimationSystem.search('dynamic')
    console.log(`📋 Found ${dpAlgorithms.length} dynamic programming algorithms`)

    // Load them systematically
    for (const algorithm of dpAlgorithms.slice(0, 5)) {
      console.log(`🎬 Studying: ${algorithm.title}`)
      await UltimateAnimationSystem.animate(algorithm.problemId, 'mermaid', {
        autoPlay: true,
        speed: 0.8 // Slower for detailed study
      })
    }

    return dpAlgorithms
  }
}

// ============================================================================
// 🚀 AUTO-INITIALIZATION (Optional)
// ============================================================================

// Uncomment to auto-initialize when module is imported
// (Be careful with this in production)
/*
if (typeof window !== 'undefined') {
  UltimateAnimationSystem.initialize().catch(error => {
    console.error('Failed to auto-initialize Ultimate Animation System:', error)
  })
}
*/

// ============================================================================
// 📤 EXPORTS
// ============================================================================

export default UltimateAnimationSystem
export {
  UltimateAnimationSystem,
  UAS,
  UltimateAnimationScenarios,

  // Re-export all subsystems for advanced usage
  animationOrchestrator,
  IntegratedAnimationSystem,
  AnimationSystemDemo,
  LeetCodeIntegrationDemo,
  AnimationDemos,
  LeetCodeAnimationDemos,
  leetCodeQuickStart
}
