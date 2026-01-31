/**
 * 📖 Markdown to JSON Parser
 * 
 * Parses algorithm markdown files and extracts:
 * - Basic info (title, difficulty, complexity, etc.)
 * - Code implementations (brute force, optimized)
 * - Animation states (D3, Mermaid, React Flow, Three.js)
 * - Examples, insights, applications, etc.
 */

import fs from 'fs'
import path from 'path'

export interface ParsedMarkdownAlgorithm {
  id: string
  title: string
  description: string
  difficulty: string
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
  analogy?: {
    title: string
    content: string
  }
  keyInsights: string[]
  realWorldApplications: Array<{
    domain: string
    application: string
    description: string
  }>
  engineeringLessons: Array<{
    principle: string
    lesson: string
    application: string
  }>
  implementations: {
    bruteForce?: {
      title: string
      timeComplexity: string
      spaceComplexity: string
      code: string
      explanation?: string
      whenToUse?: string
    }
    optimized?: {
      title: string
      timeComplexity: string
      spaceComplexity: string
      code: string
      explanation?: string
      whenToUse?: string
    }
  }
  animationStates: Array<{
    step: number
    title: string
    description: string
    data: any
  }>
  metadata?: {
    tags?: string[]
    acceptanceRate?: string
    frequency?: number
    similarProblems?: string[]
  }
}

export class MarkdownToJSONParser {
  /**
   * Parse a markdown file and return structured algorithm data
   */
  static parseFile(filePath: string): ParsedMarkdownAlgorithm {
    const content = fs.readFileSync(filePath, 'utf-8')
    return this.parseContent(content, path.basename(filePath, '.md'))
  }

  /**
   * Parse markdown content string
   */
  static parseContent(content: string, id: string): ParsedMarkdownAlgorithm {
    const algorithm: Partial<ParsedMarkdownAlgorithm> = {
      id,
      examples: [],
      keyInsights: [],
      realWorldApplications: [],
      engineeringLessons: [],
      implementations: {},
      animationStates: []
    }

    // Extract basic information
    algorithm.title = this.extractField(content, /^#\s+(.+?)(?:\s+Algorithm)?$/m)
    algorithm.description = this.extractBasicInfo(content, 'Description')
    algorithm.difficulty = this.extractBasicInfo(content, 'Difficulty')
    algorithm.category = this.extractBasicInfo(content, 'Category')
    algorithm.timeComplexity = this.extractBasicInfo(content, 'Time Complexity')
    algorithm.spaceComplexity = this.extractBasicInfo(content, 'Space Complexity')
    algorithm.popularity = parseInt(this.extractBasicInfo(content, 'Popularity') || '50')
    algorithm.estimatedTime = this.extractBasicInfo(content, 'Estimated Time') || '30 min'
    algorithm.realWorldUse = this.extractBasicInfo(content, 'Real World Use') || ''

    // Extract problem statement
    algorithm.problemStatement = this.extractSection(content, '## Problem Statement')

    // Extract examples
    algorithm.examples = this.extractExamples(content)

    // Extract analogy
    algorithm.analogy = this.extractAnalogy(content)

    // Extract key insights
    algorithm.keyInsights = this.extractListItems(content, '## Key Insights')

    // Extract real world applications
    algorithm.realWorldApplications = this.extractRealWorldApplications(content)

    // Extract engineering lessons
    algorithm.engineeringLessons = this.extractEngineeringLessons(content)

    // Extract implementations (CODE!)
    algorithm.implementations = this.extractImplementations(content)

    // Extract animation states
    algorithm.animationStates = this.extractAnimationStates(content)

    // Extract metadata
    algorithm.metadata = this.extractMetadata(content)

    return algorithm as ParsedMarkdownAlgorithm
  }

  private static extractField(content: string, regex: RegExp): string {
    const match = content.match(regex)
    return match ? match[1].trim() : ''
  }

  private static extractBasicInfo(content: string, field: string): string {
    const regex = new RegExp(`^-\\s*\\*\\*${field}\\*\\*:\\s*(.+)$`, 'm')
    const match = content.match(regex)
    return match ? match[1].trim() : ''
  }

  private static extractSection(content: string, heading: string): string {
    const regex = new RegExp(`${heading}\\n([\\s\\S]+?)(?=\\n##|$)`, 'm')
    const match = content.match(regex)
    return match ? match[1].trim() : ''
  }

  private static extractExamples(content: string): Array<{input: string, output: string, explanation: string}> {
    const examples: Array<{input: string, output: string, explanation: string}> = []
    const examplesSection = this.extractSection(content, '## Examples')
    
    // Match each example block
    const exampleRegex = /### Example \d+\n```\n([\\s\\S]+?)\n```/g
    let match

    while ((match = exampleRegex.exec(examplesSection)) !== null) {
      const exampleText = match[1]
      const inputMatch = exampleText.match(/Input:\s*(.+?)(?=\nOutput:|$)/s)
      const outputMatch = exampleText.match(/Output:\s*(.+?)(?=\nExplanation:|$)/s)
      const explanationMatch = exampleText.match(/Explanation:\s*(.+?)$/s)

      examples.push({
        input: inputMatch ? inputMatch[1].trim() : '',
        output: outputMatch ? outputMatch[1].trim() : '',
        explanation: explanationMatch ? explanationMatch[1].trim() : ''
      })
    }

    return examples
  }

  private static extractAnalogy(content: string): {title: string, content: string} | undefined {
    const analogySection = this.extractSection(content, '## Analogy')
    if (!analogySection) return undefined

    const titleMatch = analogySection.match(/### Title:\s*(.+)/)
    const contentMatch = analogySection.match(/\*\*Content\*\*:\s*([\\s\\S]+?)(?=\n\*\*Visual Aid\*\*:|$)/)

    if (titleMatch && contentMatch) {
      return {
        title: titleMatch[1].trim(),
        content: contentMatch[1].trim()
      }
    }

    return undefined
  }

  private static extractListItems(content: string, heading: string): string[] {
    const section = this.extractSection(content, heading)
    if (!section) return []

    const items: string[] = []
    const lines = section.split('\n')

    for (const line of lines) {
      const match = line.match(/^-\s+(.+)$/)
      if (match) {
        items.push(match[1].trim())
      }
    }

    return items
  }

  private static extractRealWorldApplications(content: string): Array<{domain: string, application: string, description: string}> {
    const applications: Array<{domain: string, application: string, description: string}> = []
    const section = this.extractSection(content, '## Real World Applications')
    if (!section) return []

    const domainRegex = /### (.+?)\n\*\*Application\*\*:\s*(.+?)\n\*\*Description\*\*:\s*(.+?)(?=\n###|$)/gs
    let match

    while ((match = domainRegex.exec(section)) !== null) {
      applications.push({
        domain: match[1].trim(),
        application: match[2].trim(),
        description: match[3].trim()
      })
    }

    return applications
  }

  private static extractEngineeringLessons(content: string): Array<{principle: string, lesson: string, application: string}> {
    const lessons: Array<{principle: string, lesson: string, application: string}> = []
    const section = this.extractSection(content, '## Engineering Lessons')
    if (!section) return []

    const lessonRegex = /### (.+?)\n\*\*Lesson\*\*:\s*(.+?)\n\*\*Application\*\*:\s*(.+?)(?=\n###|$)/gs
    let match

    while ((match = lessonRegex.exec(section)) !== null) {
      lessons.push({
        principle: match[1].trim(),
        lesson: match[2].trim(),
        application: match[3].trim()
      })
    }

    return lessons
  }

  private static extractImplementations(content: string): ParsedMarkdownAlgorithm['implementations'] {
    const implementations: ParsedMarkdownAlgorithm['implementations'] = {}

    // Extract Brute Force
    const bruteForceMatch = content.match(/### Brute Force Approach\n```javascript\n([\\s\\S]+?)\n```\n\*\*Time Complexity\*\*:\s*(.+?)\n\*\*Space Complexity\*\*:\s*(.+?)\n\*\*Explanation\*\*:\s*(.+?)(?:\n\*\*When to Use\*\*:\s*(.+?))?(?=\n###|$)/s)
    
    if (bruteForceMatch) {
      implementations.bruteForce = {
        title: 'Brute Force Approach',
        code: bruteForceMatch[1].trim(),
        timeComplexity: bruteForceMatch[2].trim(),
        spaceComplexity: bruteForceMatch[3].trim(),
        explanation: bruteForceMatch[4].trim(),
        whenToUse: bruteForceMatch[5]?.trim()
      }
    }

    // Extract Optimized Solution
    const optimizedMatch = content.match(/### Optimized Solution(?:\s*\(.+?\))?\n```javascript\n([\\s\\S]+?)\n```\n\*\*Time Complexity\*\*:\s*(.+?)\n\*\*Space Complexity\*\*:\s*(.+?)\n\*\*Explanation\*\*:\s*(.+?)(?:\n\*\*When to Use\*\*:\s*(.+?))?(?=\n###|$)/s)
    
    if (optimizedMatch) {
      implementations.optimized = {
        title: 'Optimized Solution',
        code: optimizedMatch[1].trim(),
        timeComplexity: optimizedMatch[2].trim(),
        spaceComplexity: optimizedMatch[3].trim(),
        explanation: optimizedMatch[4].trim(),
        whenToUse: optimizedMatch[5]?.trim()
      }
    }

    return implementations
  }

  private static extractAnimationStates(content: string): Array<{step: number, title: string, description: string, data: any}> {
    const states: Array<{step: number, title: string, description: string, data: any}> = []

    // Look for D3 Animation States section (but any animation section works)
    const animationSection = this.extractSection(content, '## Animation States')
    if (!animationSection) return []

    // Extract each step
    const stepRegex = /#### Step (\d+):\s*(.+?)\n\*\*Title\*\*:\s*(.+?)\n\*\*Description\*\*:\s*(.+?)\n(?:\*\*D3 Data\*\*:\n)?```json\n([\\s\\S]+?)\n```/g
    let match

    while ((match = stepRegex.exec(animationSection)) !== null) {
      try {
        const data = JSON.parse(match[5])
        states.push({
          step: parseInt(match[1]),
          title: match[3].trim(),
          description: match[4].trim(),
          data
        })
      } catch (error) {
        console.warn(`Failed to parse JSON for step ${match[1]}:`, error)
      }
    }

    return states
  }

  private static extractMetadata(content: string): ParsedMarkdownAlgorithm['metadata'] {
    const metadata: ParsedMarkdownAlgorithm['metadata'] = {}

    // Extract tags
    const tagsMatch = content.match(/### Tags\n((?:-\s+.+\n?)+)/)
    if (tagsMatch) {
      metadata.tags = tagsMatch[1]
        .split('\n')
        .filter(line => line.trim().startsWith('-'))
        .map(line => line.replace(/^-\s+/, '').trim())
    }

    // Extract acceptance rate
    const acceptanceMatch = content.match(/### Acceptance Rate:\s*(.+?)%/)
    if (acceptanceMatch) {
      metadata.acceptanceRate = acceptanceMatch[1].trim()
    }

    // Extract frequency
    const frequencyMatch = content.match(/### Frequency:\s*(\d+)/)
    if (frequencyMatch) {
      metadata.frequency = parseInt(frequencyMatch[1])
    }

    // Extract similar problems
    const similarMatch = content.match(/### Similar Problems\n((?:-\s+.+\n?)+)/)
    if (similarMatch) {
      metadata.similarProblems = similarMatch[1]
        .split('\n')
        .filter(line => line.trim().startsWith('-'))
        .map(line => line.replace(/^-\s+/, '').trim())
    }

    return metadata
  }
}

/**
 * Convenience function to parse a markdown file
 */
export function parseMarkdownFile(filePath: string): ParsedMarkdownAlgorithm {
  return MarkdownToJSONParser.parseFile(filePath)
}

/**
 * Get all algorithm IDs from the algorithms directory
 */
export function getAllAlgorithmIds(): string[] {
  const algorithmsDir = path.join(process.cwd(), 'src', 'algorithms')
  
  if (!fs.existsSync(algorithmsDir)) {
    return []
  }

  return fs.readdirSync(algorithmsDir)
    .filter(file => file.endsWith('.md'))
    .map(file => file.replace('.md', ''))
}

/**
 * Load algorithm by ID
 */
export function loadAlgorithmById(id: string): ParsedMarkdownAlgorithm | null {
  const filePath = path.join(process.cwd(), 'src', 'algorithms', `${id}.md`)
  
  if (!fs.existsSync(filePath)) {
    return null
  }

  return parseMarkdownFile(filePath)
}

