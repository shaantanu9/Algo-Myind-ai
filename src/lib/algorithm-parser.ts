/**
 * ALGORITHM PARSER - Dynamic Animation Generation from Content
 * Automatically parses README.md and solution files to generate animations
 */

import { AlgorithmData } from './data-transformers'
import { DynamicSentenceGenerator, AnimationSentence } from './animation-sentences'
import * as fs from 'fs'
import * as path from 'path'

export interface ParsedAlgorithm {
  id: string
  name: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  category: string
  description: string
  timeComplexity: string
  spaceComplexity: string
  examples: AlgorithmExample[]
  constraints: string[]
  solution: string
  testCases: TestCase[]
  animationData: AlgorithmData
}

export interface AlgorithmExample {
  input: string
  output: string
  explanation: string
}

export interface TestCase {
  input: any
  expectedOutput: any
  description?: string
}

// ============================================================================
// 📖 README.md PARSER
// ============================================================================

export class READMEParser {
  static parse(content: string): ParsedAlgorithm[] {
    const algorithms: ParsedAlgorithm[] = []
    const sections = this.splitIntoSections(content)

    for (const section of sections) {
      const algorithm = this.parseAlgorithmSection(section)
      if (algorithm) {
        algorithms.push(algorithm)
      }
    }

    return algorithms
  }

  private static splitIntoSections(content: string): string[] {
    // Split by algorithm headers (typically ## or ### followed by algorithm name)
    const lines = content.split('\n')
    const sections: string[] = []
    let currentSection: string[] = []
    let inAlgorithmSection = false

    for (const line of lines) {
      if (line.match(/^#{2,3}\s+.*(?:sum|search|sort|tree|graph|dynamic|programming|knapsack|lcs|bfs|dfs).*/i)) {
        if (currentSection.length > 0) {
          sections.push(currentSection.join('\n'))
        }
        currentSection = [line]
        inAlgorithmSection = true
      } else if (inAlgorithmSection) {
        currentSection.push(line)
      }
    }

    if (currentSection.length > 0) {
      sections.push(currentSection.join('\n'))
    }

    return sections
  }

  private static parseAlgorithmSection(section: string): ParsedAlgorithm | null {
    const lines = section.split('\n')
    if (lines.length < 3) return null

    const header = lines[0]
    const algorithmName = this.extractAlgorithmName(header)
    if (!algorithmName) return null

    return {
      id: this.generateAlgorithmId(algorithmName),
      name: algorithmName,
      difficulty: this.extractDifficulty(section),
      category: this.categorizeAlgorithm(algorithmName),
      description: this.extractDescription(section),
      timeComplexity: this.extractComplexity(section, 'time'),
      spaceComplexity: this.extractComplexity(section, 'space'),
      examples: this.extractExamples(section),
      constraints: this.extractConstraints(section),
      solution: this.extractSolution(section),
      testCases: this.generateTestCases(algorithmName),
      animationData: this.generateAnimationData(algorithmName)
    }
  }

  private static extractAlgorithmName(header: string): string {
    // Remove markdown headers and clean up
    const name = header.replace(/^#{2,3}\s+/, '').trim()

    // Common algorithm name mappings
    const mappings: Record<string, string> = {
      'Two Sum': 'Two Sum',
      'Binary Search': 'Binary Search',
      'Bubble Sort': 'Bubble Sort',
      'Quick Sort': 'Quick Sort',
      'Merge Sort': 'Merge Sort',
      '0/1 Knapsack': '0/1 Knapsack',
      'Longest Common Subsequence': 'Longest Common Subsequence',
      'Breadth First Search': 'Breadth First Search',
      'Depth First Search': 'Depth First Search',
      'Binary Tree Traversal': 'Binary Tree Traversal'
    }

    return mappings[name] || name
  }

  private static generateAlgorithmId(name: string): string {
    return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
  }

  private static extractDifficulty(section: string): 'Easy' | 'Medium' | 'Hard' {
    const content = section.toLowerCase()

    if (content.includes('easy') || content.includes('beginner')) return 'Easy'
    if (content.includes('medium') || content.includes('intermediate')) return 'Medium'
    if (content.includes('hard') || content.includes('advanced')) return 'Hard'

    // Default based on algorithm type
    if (content.includes('two sum') || content.includes('binary search')) return 'Easy'
    if (content.includes('sort') || content.includes('tree traversal')) return 'Medium'
    return 'Hard'
  }

  private static categorizeAlgorithm(name: string): string {
    const lowerName = name.toLowerCase()

    if (lowerName.includes('sum') || lowerName.includes('search')) return 'Array'
    if (lowerName.includes('sort')) return 'Sorting'
    if (lowerName.includes('tree') || lowerName.includes('traversal')) return 'Tree'
    if (lowerName.includes('graph') || lowerName.includes('search') && lowerName.includes('first')) return 'Graph'
    if (lowerName.includes('knapsack') || lowerName.includes('subsequence') || lowerName.includes('dynamic')) return 'Dynamic Programming'

    return 'Other'
  }

  private static extractDescription(section: string): string {
    // Look for description after the header
    const lines = section.split('\n')
    const descriptionLines: string[] = []

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim()
      if (line.startsWith('-') || line.startsWith('*') || line.match(/^[A-Z]/) || line.includes('Example')) {
        break
      }
      if (line && !line.startsWith('#') && !line.includes('**')) {
        descriptionLines.push(line)
      }
    }

    return descriptionLines.join(' ').trim() || 'Algorithm implementation and visualization'
  }

  private static extractComplexity(section: string, type: 'time' | 'space'): string {
    const content = section.toLowerCase()
    const patterns = {
      time: [
        /time complexity[:\s]*o\([^)]+\)/i,
        /time[:\s]*o\([^)]+\)/i,
        /complexity[:\s]*o\([^)]+\)/i
      ],
      space: [
        /space complexity[:\s]*o\([^)]+\)/i,
        /space[:\s]*o\([^)]+\)/i,
        /memory[:\s]*o\([^)]+\)/i
      ]
    }

    for (const pattern of patterns[type]) {
      const match = content.match(pattern)
      if (match) {
        return match[1].toUpperCase()
      }
    }

    // Default complexities based on algorithm type
    if (section.toLowerCase().includes('two sum')) return 'O(N)'
    if (section.toLowerCase().includes('binary search')) return 'O(LOG N)'
    if (section.toLowerCase().includes('bubble sort')) return 'O(N²)'
    if (section.toLowerCase().includes('quick sort') || section.toLowerCase().includes('merge sort')) return 'O(N LOG N)'

    return 'O(N)' // Default
  }

  private static extractExamples(section: string): AlgorithmExample[] {
    const examples: AlgorithmExample[] = []
    const lines = section.split('\n')
    let currentExample: Partial<AlgorithmExample> = {}
    let inExample = false

    for (const line of lines) {
      const trimmed = line.trim()

      if (trimmed.match(/^Example\s+\d*:?/i) || trimmed.match(/^Input:/i)) {
        if (currentExample.input && currentExample.output) {
          examples.push(currentExample as AlgorithmExample)
        }
        currentExample = {}
        inExample = true
      }

      if (inExample) {
        if (trimmed.match(/^Input:/i)) {
          currentExample.input = trimmed.replace(/^Input:/i, '').trim()
        } else if (trimmed.match(/^Output:/i)) {
          currentExample.output = trimmed.replace(/^Output:/i, '').trim()
        } else if (trimmed.match(/^Explanation:/i)) {
          currentExample.explanation = trimmed.replace(/^Explanation:/i, '').trim()
        }
      }
    }

    // Add the last example
    if (currentExample.input && currentExample.output) {
      examples.push(currentExample as AlgorithmExample)
    }

    return examples
  }

  private static extractConstraints(section: string): string[] {
    const constraints: string[] = []
    const lines = section.split('\n')

    for (const line of lines) {
      const trimmed = line.trim()
      if (trimmed.match(/^-?\s*\d+\s*[<>=]+\s*\d+/)) {
        constraints.push(trimmed.replace(/^-\s*/, ''))
      }
    }

    return constraints
  }

  private static extractSolution(section: string): string {
    // Look for solution or approach section
    const lines = section.split('\n')
    const solutionLines: string[] = []
    let inSolution = false

    for (const line of lines) {
      const trimmed = line.trim()

      if (trimmed.match(/^##?\s*(Solution|Approach|Algorithm)/i)) {
        inSolution = true
        continue
      }

      if (inSolution && trimmed.match(/^##?\s/i)) {
        break // Next section
      }

      if (inSolution && trimmed) {
        solutionLines.push(trimmed)
      }
    }

    return solutionLines.join('\n').trim() || 'Standard algorithm implementation'
  }

  private static generateTestCases(algorithmName: string): TestCase[] {
    // Generate test cases based on algorithm type
    switch (algorithmName.toLowerCase()) {
      case 'two sum':
        return [
          { input: { nums: [2, 7, 11, 15], target: 9 }, expectedOutput: [0, 1], description: 'Basic case' },
          { input: { nums: [3, 2, 4], target: 6 }, expectedOutput: [1, 2], description: 'Different order' },
          { input: { nums: [3, 3], target: 6 }, expectedOutput: [0, 1], description: 'Same numbers' }
        ]

      case 'binary search':
        return [
          { input: { nums: [1, 3, 5, 7, 9], target: 5 }, expectedOutput: 2, description: 'Middle element' },
          { input: { nums: [1, 3, 5, 7, 9], target: 1 }, expectedOutput: 0, description: 'First element' },
          { input: { nums: [1, 3, 5, 7, 9], target: 10 }, expectedOutput: -1, description: 'Not found' }
        ]

      case 'bubble sort':
        return [
          { input: [64, 34, 25, 12, 22, 11, 90], expectedOutput: [11, 12, 22, 25, 34, 64, 90], description: 'Random array' },
          { input: [1, 2, 3, 4, 5], expectedOutput: [1, 2, 3, 4, 5], description: 'Already sorted' },
          { input: [5, 4, 3, 2, 1], expectedOutput: [1, 2, 3, 4, 5], description: 'Reverse sorted' }
        ]

      default:
        return [
          { input: {}, expectedOutput: null, description: 'Default test case' }
        ]
    }
  }

  private static generateAnimationData(algorithmName: string): AlgorithmData {
    return DynamicSentenceGenerator.generateMockData(
      algorithmName.toLowerCase().replace(/\s+/g, '-')
    )
  }
}

// ============================================================================
// 💻 SOLUTION FILE PARSER
// ============================================================================

export class SolutionParser {
  static parse(filePath: string): ParsedAlgorithm | null {
    try {
      const content = fs.readFileSync(filePath, 'utf-8')
      const algorithmName = this.extractAlgorithmName(filePath)

      if (!algorithmName) return null

      return {
        id: this.generateAlgorithmId(algorithmName),
        name: algorithmName,
        difficulty: this.extractDifficultyFromSolution(content),
        category: this.categorizeAlgorithm(algorithmName),
        description: this.extractDescriptionFromSolution(content),
        timeComplexity: this.extractComplexityFromSolution(content, 'time'),
        spaceComplexity: this.extractComplexityFromSolution(content, 'space'),
        examples: this.extractExamplesFromSolution(content),
        constraints: [],
        solution: content,
        testCases: this.generateTestCasesFromSolution(content, algorithmName),
        animationData: this.generateAnimationDataFromSolution(content, algorithmName)
      }
    } catch (error) {
      console.error(`Error parsing solution file ${filePath}:`, error)
      return null
    }
  }

  private static extractAlgorithmName(filePath: string): string | null {
    const fileName = path.basename(filePath, path.extname(filePath))
    const patterns = [
      { pattern: /(\d+)-(.+)/, extract: (match: RegExpMatchArray) => match[2] },
      { pattern: /(.+)-solution/, extract: (match: RegExpMatchArray) => match[1] },
      { pattern: /(.+)/, extract: (match: RegExpMatchArray) => match[1] }
    ]

    for (const { pattern, extract } of patterns) {
      const match = fileName.match(pattern)
      if (match) {
        const extracted = extract(match)
        return extracted
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')
      }
    }

    return null
  }

  private static extractDifficultyFromSolution(content: string): 'Easy' | 'Medium' | 'Hard' {
    // Look for difficulty comments or patterns
    const contentLower = content.toLowerCase()

    if (contentLower.includes('easy') || contentLower.includes('beginner')) return 'Easy'
    if (contentLower.includes('medium') || contentLower.includes('intermediate')) return 'Medium'
    if (contentLower.includes('hard') || contentLower.includes('advanced')) return 'Hard'

    // Analyze code complexity
    const lines = content.split('\n').length
    const loops = (content.match(/\bfor\b|\bwhile\b/g) || []).length
    const recursion = content.includes('function') && (content.match(/\breturn\b.*\w+\s*\(/g) || []).length > 0

    if (lines < 20 && loops <= 1 && !recursion) return 'Easy'
    if (lines < 50 && loops <= 2) return 'Medium'
    return 'Hard'
  }

  private static extractDescriptionFromSolution(content: string): string {
    // Look for comments at the top of the file
    const lines = content.split('\n')
    const comments: string[] = []

    for (const line of lines.slice(0, 10)) {
      const trimmed = line.trim()
      if (trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*')) {
        const comment = trimmed.replace(/^\/\/|^\/\*\*?|^[*]\s*/, '').trim()
        if (comment) comments.push(comment)
      }
      if (!trimmed.startsWith('//') && !trimmed.startsWith('/*') && !trimmed.startsWith('*') && comments.length > 0) {
        break
      }
    }

    return comments.join(' ').trim() || 'Algorithm implementation'
  }

  private static extractComplexityFromSolution(content: string, type: 'time' | 'space'): string {
    // Look for complexity comments
    const lines = content.split('\n')
    const complexityPattern = new RegExp(`${type} complexity[:\\s]*o\\([^)]+\\)`, 'i')

    for (const line of lines) {
      const match = line.match(complexityPattern)
      if (match) {
        return match[1].toUpperCase()
      }
    }

    // Infer from code analysis
    const hasNestedLoops = content.includes('for') && content.split('for').length > 2
    const hasRecursion = content.includes('function') && content.includes('return') && content.includes('(')

    if (type === 'time') {
      if (hasRecursion) return 'O(2^N)' // Recursion often exponential
      if (hasNestedLoops) return 'O(N²)' // Nested loops
      if (content.includes('for') || content.includes('while')) return 'O(N)' // Single loop
      return 'O(1)' // Constant time
    } else {
      if (content.includes('new Map') || content.includes('new Set')) return 'O(N)'
      if (content.includes('new Array')) return 'O(N)'
      return 'O(1)'
    }
  }

  private static extractExamplesFromSolution(content: string): AlgorithmExample[] {
    // Look for test cases or examples in the code
    const examples: AlgorithmExample[] = []
    const lines = content.split('\n')

    for (const line of lines) {
      // Look for console.log statements that might show examples
      const exampleMatch = line.match(/console\.log.*(\[.*?\]).*(\[.*?\]|\d+)/)
      if (exampleMatch) {
        examples.push({
          input: exampleMatch[1],
          output: exampleMatch[2],
          explanation: 'Example from solution'
        })
      }
    }

    return examples
  }

  private static generateTestCasesFromSolution(content: string, algorithmName: string): TestCase[] {
    // Extract test cases from the solution code
    const testCases: TestCase[] = []
    const lines = content.split('\n')

    for (const line of lines) {
      // Look for function calls that might be test cases
      const functionCall = line.match(/(\w+)\s*\(\s*([^)]+)\s*\)/)
      if (functionCall && functionCall[1] !== 'console') {
        const args = functionCall[2]
        testCases.push({
          input: args,
          expectedOutput: null, // Would need to be determined by running the code
          description: `Test case from ${functionCall[1]}(${args})`
        })
      }
    }

    return testCases.length > 0 ? testCases : this.generateTestCases(algorithmName)
  }

  private static generateAnimationDataFromSolution(content: string, algorithmName: string): AlgorithmData {
    // Analyze the solution code to generate appropriate animation data
    const data = this.generateTestCases(algorithmName)[0]?.input || {}

    // Enhance with code analysis
    if (content.includes('for') && content.includes('if')) {
      // Likely a search algorithm
      return { ...data, currentIndex: 0, found: false }
    }

    if (content.includes('temp') || content.includes('swap')) {
      // Likely a sorting algorithm
      return { ...data, currentIndex: 0, compareIndex: 1, swapped: false }
    }

    return data
  }

  private static generateAlgorithmId(name: string): string {
    return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
  }

  private static categorizeAlgorithm(name: string): string {
    return READMEParser.categorizeAlgorithm(name)
  }

  private static generateTestCases(algorithmName: string): TestCase[] {
    return READMEParser.generateTestCases(algorithmName)
  }
}

// ============================================================================
// 🎬 DYNAMIC ANIMATION GENERATOR
// ============================================================================

export class DynamicAnimationGenerator {
  static async generateFromREADME(readmePath: string): Promise<AnimationSentence[]> {
    try {
      const content = fs.readFileSync(readmePath, 'utf-8')
      const algorithms = READMEParser.parse(content)

      const animations: AnimationSentence[] = []

      for (const algorithm of algorithms) {
        const animation = DynamicSentenceGenerator.generateFromSolution(`solutions/${algorithm.id}.js`)
        if (animation) {
          animations.push(animation)
        }
      }

      return animations
    } catch (error) {
      console.error('Error generating animations from README:', error)
      return []
    }
  }

  static async generateFromSolution(solutionPath: string): Promise<AnimationSentence | null> {
    try {
      const algorithm = SolutionParser.parse(solutionPath)
      if (!algorithm) return null

      return DynamicSentenceGenerator.generateFromSolution(solutionPath)
    } catch (error) {
      console.error(`Error generating animation from solution ${solutionPath}:`, error)
      return null
    }
  }

  static async generateFromDirectory(directoryPath: string): Promise<AnimationSentence[]> {
    const animations: AnimationSentence[] = []

    try {
      // First try to find README.md
      const readmePath = path.join(directoryPath, 'README.md')
      if (fs.existsSync(readmePath)) {
        animations.push(...await this.generateFromREADME(readmePath))
      }

      // Then parse all solution files
      const solutionsDir = path.join(directoryPath, 'solutions')
      if (fs.existsSync(solutionsDir)) {
        const files = fs.readdirSync(solutionsDir)

        for (const file of files) {
          if (file.endsWith('.js') || file.endsWith('.ts')) {
            const solutionPath = path.join(solutionsDir, file)
            const animation = await this.generateFromSolution(solutionPath)
            if (animation) {
              animations.push(animation)
            }
          }
        }
      }

      return animations
    } catch (error) {
      console.error('Error generating animations from directory:', error)
      return []
    }
  }

  static generateFromAlgorithmData(algorithmId: string, data: AlgorithmData): AnimationSentence | null {
    return DynamicSentenceGenerator.generateFromSolution(`solutions/${algorithmId}.js`)
  }
}

// ============================================================================
// 🎯 ALGORITHM DETECTION UTILITIES
// ============================================================================

export class AlgorithmDetector {
  static detectFromContent(content: string): string[] {
    const detectedAlgorithms: string[] = []
    const contentLower = content.toLowerCase()

    const algorithmPatterns = [
      { name: 'two-sum', patterns: ['two sum', 'two-sum', '2sum'] },
      { name: 'binary-search', patterns: ['binary search', 'binary-search'] },
      { name: 'bubble-sort', patterns: ['bubble sort', 'bubble-sort'] },
      { name: 'quick-sort', patterns: ['quick sort', 'quick-sort', 'quicksort'] },
      { name: 'merge-sort', patterns: ['merge sort', 'merge-sort', 'mergesort'] },
      { name: 'breadth-first-search', patterns: ['breadth first search', 'bfs', 'breadth-first'] },
      { name: 'depth-first-search', patterns: ['depth first search', 'dfs', 'depth-first'] },
      { name: 'knapsack', patterns: ['knapsack', '0/1 knapsack'] },
      { name: 'longest-common-subsequence', patterns: ['longest common subsequence', 'lcs'] },
      { name: 'binary-tree-traversal', patterns: ['tree traversal', 'inorder', 'preorder', 'postorder'] }
    ]

    for (const { name, patterns } of algorithmPatterns) {
      for (const pattern of patterns) {
        if (contentLower.includes(pattern)) {
          detectedAlgorithms.push(name)
          break
        }
      }
    }

    return [...new Set(detectedAlgorithms)] // Remove duplicates
  }

  static detectFromFileName(fileName: string): string | null {
    const fileNameLower = fileName.toLowerCase()

    const mappings: Record<string, string> = {
      'two-sum': 'two-sum',
      'twosum': 'two-sum',
      '2sum': 'two-sum',
      'binary-search': 'binary-search',
      'binarysearch': 'binary-search',
      'bubble-sort': 'bubble-sort',
      'bubblesort': 'bubble-sort',
      'quick-sort': 'quick-sort',
      'quicksort': 'quick-sort',
      'merge-sort': 'merge-sort',
      'mergesort': 'merge-sort',
      'bfs': 'breadth-first-search',
      'dfs': 'depth-first-search',
      'knapsack': 'knapsack',
      'lcs': 'longest-common-subsequence',
      'tree-traversal': 'binary-tree-traversal'
    }

    for (const [key, value] of Object.entries(mappings)) {
      if (fileNameLower.includes(key)) {
        return value
      }
    }

    return null
  }
}

// ============================================================================
// 📤 EXPORTS
// ============================================================================

export {
  ParsedAlgorithm,
  AlgorithmExample,
  TestCase,
  READMEParser,
  SolutionParser,
  DynamicAnimationGenerator,
  AlgorithmDetector
}
