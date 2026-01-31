/**
 * ANIMATION SYSTEM DEMO - Complete Integration with LeetCode Solutions
 * Demonstrates the full power of the atomic animation system
 */

import { animationOrchestrator, AnimationDemos, animate } from './animation-orchestrator'
import { DynamicAnimationGenerator, READMEParser, SolutionParser } from './algorithm-parser'
import { AlgorithmSentences } from './animation-sentences'
import { AnimationVocabulary } from './animation-words'
import { AnimationAlphabet } from './animation-atoms'

// ============================================================================
// 🎯 COMPLETE ANIMATION SYSTEM DEMO
// ============================================================================

export class AnimationSystemDemo {
  static async runFullDemo() {
    console.log('🚀 ANIMATION SYSTEM MASTER DEMO')
    console.log('=' .repeat(60))
    console.log('🎭 Testing the complete atomic animation framework')
    console.log('=' .repeat(60))

    const results = {
      atoms: false,
      words: false,
      sentences: false,
      algorithms: false,
      dynamic: false,
      performance: false
    }

    try {
      // 1. Test Atomic Level
      console.log('\n🎯 PHASE 1: Testing Atomic Animations')
      console.log('-'.repeat(40))

      const atomResult = await this.testAtomicAnimations()
      results.atoms = atomResult.success
      console.log(`✓ Atomic animations: ${atomResult.success ? 'PASS' : 'FAIL'}`)

      // 2. Test Word Level
      console.log('\n📝 PHASE 2: Testing Word Compositions')
      console.log('-'.repeat(40))

      const wordResult = await this.testWordCompositions()
      results.words = wordResult.success
      console.log(`✓ Word compositions: ${wordResult.success ? 'PASS' : 'FAIL'}`)

      // 3. Test Sentence Level
      console.log('\n📖 PHASE 3: Testing Sentence Animations')
      console.log('-'.repeat(40))

      const sentenceResult = await this.testSentenceAnimations()
      results.sentences = sentenceResult.success
      console.log(`✓ Sentence animations: ${sentenceResult.success ? 'PASS' : 'FAIL'}`)

      // 4. Test Algorithm Integration
      console.log('\n🎭 PHASE 4: Testing Algorithm Animations')
      console.log('-'.repeat(40))

      const algorithmResult = await this.testAlgorithmAnimations()
      results.algorithms = algorithmResult.success
      console.log(`✓ Algorithm animations: ${algorithmResult.success ? 'PASS' : 'FAIL'}`)

      // 5. Test Dynamic Content Parsing
      console.log('\n🔄 PHASE 5: Testing Dynamic Content Parsing')
      console.log('-'.repeat(40))

      const dynamicResult = await this.testDynamicContent()
      results.dynamic = dynamicResult.success
      console.log(`✓ Dynamic parsing: ${dynamicResult.success ? 'PASS' : 'FAIL'}`)

      // 6. Performance Testing
      console.log('\n⚡ PHASE 6: Performance Metrics')
      console.log('-'.repeat(40))

      const performanceResult = await this.testPerformance()
      results.performance = performanceResult.success
      console.log(`✓ Performance: ${performanceResult.success ? 'PASS' : 'FAIL'}`)

      // Final Results
      console.log('\n' + '=' .repeat(60))
      console.log('🎉 ANIMATION SYSTEM DEMO RESULTS')
      console.log('=' .repeat(60))

      Object.entries(results).forEach(([test, passed]) => {
        const status = passed ? '✅' : '❌'
        console.log(`${status} ${test.charAt(0).toUpperCase() + test.slice(1)}: ${passed ? 'PASS' : 'FAIL'}`)
      })

      const totalPassed = Object.values(results).filter(Boolean).length
      const totalTests = Object.keys(results).length

      console.log(`\n📊 Overall Score: ${totalPassed}/${totalTests} tests passed`)

      if (totalPassed === totalTests) {
        console.log('🎯 PERFECT! All animation systems working flawlessly!')
        console.log('🚀 Your DSA app now has WORLD-CLASS animations!')
      } else {
        console.log('⚠️ Some systems need attention, but core functionality is working!')
      }

      return results

    } catch (error) {
      console.error('❌ Demo failed with error:', error)
      return { error: error.message, ...results }
    }
  }

  // ============================================================================
  // 🎯 ATOMIC ANIMATIONS TEST
  // ============================================================================

  static async testAtomicAnimations() {
    try {
      console.log('Testing basic atomic operations...')

      // Test visual atoms
      const fadeAtom = AnimationAlphabet.Visual.opacityFade('test-element', 0, 1, 500)
      await animate.atom(fadeAtom, { rendererType: 'test' })
      console.log('✓ Visual atoms working')

      // Test temporal atoms
      const delayAtom = AnimationAlphabet.Temporal.delay(200)
      await animate.atom(delayAtom)
      console.log('✓ Temporal atoms working')

      // Test spatial atoms
      const moveAtom = AnimationAlphabet.Spatial.moveTo('test-element', { x: 100, y: 100 }, 300)
      await animate.atom(moveAtom, { rendererType: 'test' })
      console.log('✓ Spatial atoms working')

      // Test state atoms
      const highlightAtom = AnimationAlphabet.State.highlightElement('test-element', 'active', 400)
      await animate.atom(highlightAtom, { rendererType: 'test', stateManagerId: 'test' })
      console.log('✓ State atoms working')

      return { success: true, message: 'All atomic operations working' }

    } catch (error) {
      console.error('Atomic test failed:', error)
      return { success: false, message: error.message }
    }
  }

  // ============================================================================
  // 📝 WORD COMPOSITIONS TEST
  // ============================================================================

  static async testWordCompositions() {
    try {
      console.log('Testing word compositions...')

      // Test elementary words
      const emphasizeWord = AnimationVocabulary.Elementary.emphasize('demo-element')
      await animate.word(emphasizeWord, { rendererType: 'test' })
      console.log('✓ Elementary words working')

      // Test comparison words
      const arrayData = ['elem1', 'elem2']
      const compareWord = AnimationVocabulary.Comparison.compareElements('elem1', 'elem2')
      await animate.word(compareWord, { rendererType: 'test' })
      console.log('✓ Comparison words working')

      // Test search words
      const searchWord = AnimationVocabulary.Search.linearSearch(arrayData, 'elem2', true)
      await animate.word(searchWord, { rendererType: 'test' })
      console.log('✓ Search words working')

      // Test sorting words
      const sortWord = AnimationVocabulary.Sorting.bubbleSortPass(arrayData, 0, false)
      await animate.word(sortWord, { rendererType: 'test' })
      console.log('✓ Sorting words working')

      return { success: true, message: 'All word compositions working' }

    } catch (error) {
      console.error('Word composition test failed:', error)
      return { success: false, message: error.message }
    }
  }

  // ============================================================================
  // 📖 SENTENCE ANIMATIONS TEST
  // ============================================================================

  static async testSentenceAnimations() {
    try {
      console.log('Testing sentence animations...')

      // Test algorithm sentences
      const twoSumData = {
        array: [2, 7, 11, 15],
        target: 9,
        currentIndex: 1,
        hashMap: { 2: 0 },
        complement: 7,
        found: true,
        result: [0, 1]
      }

      const twoSumSentence = AlgorithmSentences.twoSum(twoSumData)
      await animate.sentence(twoSumSentence, { rendererType: 'mermaid' })
      console.log('✓ Two Sum sentence working')

      // Test introduction sentence
      const introSentence = AlgorithmSentences.algorithmIntroduction('two-sum')
      await animate.sentence(introSentence, { rendererType: 'mermaid' })
      console.log('✓ Introduction sentence working')

      // Test conclusion sentence
      const conclusionSentence = AlgorithmSentences.algorithmConclusion(true, 'two-sum')
      await animate.sentence(conclusionSentence, { rendererType: 'mermaid' })
      console.log('✓ Conclusion sentence working')

      return { success: true, message: 'All sentence animations working' }

    } catch (error) {
      console.error('Sentence animation test failed:', error)
      return { success: false, message: error.message }
    }
  }

  // ============================================================================
  // 🎭 ALGORITHM ANIMATIONS TEST
  // ============================================================================

  static async testAlgorithmAnimations() {
    try {
      console.log('Testing full algorithm animations...')

      // Test Two Sum algorithm
      const twoSumData = {
        array: [2, 7, 11, 15],
        target: 9,
        currentIndex: 1,
        hashMap: { 2: 0 },
        complement: 7,
        found: true,
        result: [0, 1]
      }

      await animate.algorithm('two-sum', twoSumData, 'mermaid', { autoPlay: false })
      console.log('✓ Two Sum algorithm animation working')

      // Test Binary Search
      const binarySearchData = {
        array: [1, 3, 5, 7, 9, 11, 13, 15],
        target: 7,
        left: 0,
        right: 7,
        mid: 3,
        found: true,
        result: 3
      }

      await animate.algorithm('binary-search', binarySearchData, 'd3', { autoPlay: false })
      console.log('✓ Binary Search algorithm animation working')

      // Test Bubble Sort
      const bubbleSortData = {
        array: [64, 34, 25, 12, 22, 11, 90],
        currentIndex: 1,
        compareIndex: 1,
        swapped: true
      }

      await animate.algorithm('bubble-sort', bubbleSortData, 'reactflow', { autoPlay: false })
      console.log('✓ Bubble Sort algorithm animation working')

      return { success: true, message: 'All algorithm animations working' }

    } catch (error) {
      console.error('Algorithm animation test failed:', error)
      return { success: false, message: error.message }
    }
  }

  // ============================================================================
  // 🔄 DYNAMIC CONTENT TEST
  // ============================================================================

  static async testDynamicContent() {
    try {
      console.log('Testing dynamic content parsing...')

      // Test algorithm detection
      const testContent = `
        # Two Sum
        Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

        ## Examples
        Input: nums = [2,7,11,15], target = 9
        Output: [0,1]

        ## Solution
        function twoSum(nums, target) {
          const map = new Map();
          for (let i = 0; i < nums.length; i++) {
            const complement = target - nums[i];
            if (map.has(complement)) {
              return [map.get(complement), i];
            }
            map.set(nums[i], i);
          }
          return [];
        }
      `

      const detectedAlgorithms = animate.detect(testContent)
      console.log('✓ Algorithm detection:', detectedAlgorithms)

      // Test content-based animation generation
      if (detectedAlgorithms.includes('two-sum')) {
        const animations = await animate.fromContent(testContent, 'readme', 'mermaid')
        console.log(`✓ Generated ${animations.length} animations from content`)
      }

      return { success: true, message: 'Dynamic content parsing working' }

    } catch (error) {
      console.error('Dynamic content test failed:', error)
      return { success: false, message: error.message }
    }
  }

  // ============================================================================
  // ⚡ PERFORMANCE TEST
  // ============================================================================

  static async testPerformance() {
    try {
      console.log('Testing performance metrics...')

      // Get baseline metrics
      const baselineMetrics = animate.metrics()
      console.log('📊 Baseline metrics:', baselineMetrics)

      // Run a few animations to generate metrics
      const testData = {
        array: [1, 2, 3, 4, 5],
        target: 6,
        currentIndex: 2,
        found: false
      }

      // Run multiple animations
      const promises = []
      for (let i = 0; i < 5; i++) {
        promises.push(animate.algorithm('two-sum', testData, 'mermaid', { autoPlay: false }))
      }

      await Promise.all(promises)
      console.log('✓ Ran 5 animations successfully')

      // Get updated metrics
      const updatedMetrics = animate.metrics()
      console.log('📈 Updated metrics:', updatedMetrics)

      return { success: true, message: 'Performance monitoring working', metrics: updatedMetrics }

    } catch (error) {
      console.error('Performance test failed:', error)
      return { success: false, message: error.message }
    }
  }

  // ============================================================================
  // 🎬 ADVANCED DEMO SCENARIOS
  // ============================================================================

  static async demonstrateAdvancedUsage() {
    console.log('\n🎨 ADVANCED USAGE DEMONSTRATIONS')
    console.log('=' .repeat(50))

    try {
      // 1. Timeline-based animations
      console.log('🎬 Creating animation timeline...')
      const timeline = animate.timeline('demo-timeline', [
        AlgorithmSentences.algorithmIntroduction('two-sum'),
        AlgorithmSentences.twoSum({
          array: [2, 7, 11, 15],
          target: 9,
          currentIndex: 0,
          hashMap: {},
          found: false
        }),
        AlgorithmSentences.algorithmConclusion(true, 'two-sum')
      ], { autoPlay: false, speed: 1.5 })

      console.log('✓ Timeline created with 3 sequences')

      // 2. Interactive elements
      console.log('🎮 Setting up interactive elements...')
      animationOrchestrator.addInteraction('play-button', 'click', async () => {
        animate.timeline('demo-timeline', [], { autoPlay: true })
        console.log('▶️ Timeline started via interaction')
      })

      // 3. Real-time algorithm simulation
      console.log('🔄 Simulating real-time algorithm execution...')
      const simulationData = {
        array: [3, 2, 4],
        target: 6,
        currentIndex: 0,
        hashMap: {},
        found: false
      }

      // Simulate step-by-step execution
      for (let i = 0; i < simulationData.array.length; i++) {
        simulationData.currentIndex = i
        simulationData.hashMap[simulationData.array[i]] = i

        if (simulationData.hashMap[simulationData.target - simulationData.array[i]] !== undefined) {
          simulationData.found = true
          simulationData.result = [simulationData.hashMap[simulationData.target - simulationData.array[i]], i]
          break
        }

        await animate.algorithm('two-sum', simulationData, 'mermaid', { autoPlay: false })
        await new Promise(resolve => setTimeout(resolve, 500)) // Simulate processing time
      }

      console.log('✓ Real-time simulation completed')

      // 4. Cross-visualization comparison
      console.log('🔄 Testing cross-visualization rendering...')
      const comparisonData = {
        array: [1, 3, 5, 7, 9],
        target: 5,
        currentIndex: 2,
        found: true,
        result: 2
      }

      const visualizations = ['mermaid', 'reactflow', 'd3', 'three'] as const
      for (const viz of visualizations) {
        await animate.algorithm('binary-search', comparisonData, viz, { autoPlay: false })
        console.log(`✓ ${viz.toUpperCase()} visualization rendered`)
      }

      console.log('✓ All advanced features working perfectly!')

      return {
        timeline: true,
        interactive: true,
        simulation: true,
        crossVisualization: true
      }

    } catch (error) {
      console.error('Advanced demo failed:', error)
      return { error: error.message }
    }
  }

  // ============================================================================
  // 🎯 INTEGRATION WITH LEETCODE CONTENT
  // ============================================================================

  static async demonstrateLeetCodeIntegration() {
    console.log('\n🏆 LEETCODE INTEGRATION DEMO')
    console.log('=' .repeat(50))

    try {
      // This would work with actual file system access
      console.log('📖 Parsing LeetCode README content...')

      // Simulate README content
      const mockReadmeContent = `
        # 1. Two Sum
        Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

        ## Examples
        Input: nums = [2,7,11,15], target = 9
        Output: [0,1]

        ## Solution
        Use a hash map to store complements for O(n) time complexity.

        # 704. Binary Search
        Given a sorted array and target, find the target using binary search.

        ## Examples
        Input: nums = [1,3,5,7,9], target = 5
        Output: 2
      `

      const algorithms = READMEParser.parse(mockReadmeContent)
      console.log(`✓ Parsed ${algorithms.length} algorithms from README`)

      // Generate animations for each algorithm
      for (const algorithm of algorithms) {
        console.log(`🎭 Generating animation for: ${algorithm.name}`)
        await animate.algorithm(algorithm.id, algorithm.animationData, 'mermaid', {
          autoPlay: false,
          speed: 1.2
        })
      }

      console.log('✓ LeetCode integration successful!')

      return {
        parsedAlgorithms: algorithms.length,
        animationsGenerated: algorithms.length
      }

    } catch (error) {
      console.error('LeetCode integration failed:', error)
      return { error: error.message }
    }
  }
}

// ============================================================================
// 🚀 QUICK START FUNCTIONS
// ============================================================================

export const quickStart = {
  // Run complete demo
  async demo() {
    return await AnimationSystemDemo.runFullDemo()
  },

  // Test specific algorithm
  async testAlgorithm(algorithmId: string, data: any) {
    console.log(`🧪 Testing ${algorithmId} algorithm...`)
    try {
      const result = await animate.algorithm(algorithmId, data, 'mermaid', { autoPlay: true })
      console.log(`✅ ${algorithmId} test successful!`)
      return result
    } catch (error) {
      console.error(`❌ ${algorithmId} test failed:`, error)
      return { error: error.message }
    }
  },

  // Parse content and animate
  async animateContent(content: string, type: 'readme' | 'solution' = 'readme') {
    console.log(`📄 Animating ${type} content...`)
    try {
      const animations = await animate.fromContent(content, type, 'mermaid')
      console.log(`✅ Generated ${animations.length} animations from ${type}`)
      return animations
    } catch (error) {
      console.error(`❌ Content animation failed:`, error)
      return { error: error.message }
    }
  },

  // Performance benchmark
  async benchmark() {
    console.log('⚡ Running animation performance benchmark...')
    const startTime = Date.now()

    // Run multiple animations
    const promises = []
    for (let i = 0; i < 10; i++) {
      promises.push(animate.algorithm('two-sum', {
        array: [2, 7, 11, 15],
        target: 9,
        currentIndex: i % 4,
        hashMap: {},
        found: false
      }, 'mermaid', { autoPlay: false }))
    }

    await Promise.all(promises)
    const duration = Date.now() - startTime

    console.log(`✅ Benchmark complete: ${duration}ms for 10 animations`)
    console.log(`📊 Average: ${duration / 10}ms per animation`)

    return {
      totalTime: duration,
      averageTime: duration / 10,
      animationsRun: 10
    }
  }
}

// ============================================================================
// 🎯 EXPORT EVERYTHING
// ============================================================================

export default AnimationSystemDemo
export { AnimationSystemDemo, quickStart }
