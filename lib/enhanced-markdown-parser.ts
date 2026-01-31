/**
 * 🔧 Enhanced Markdown Parser
 * 
 * Extracts implementations and animation states more robustly
 * Works with AI-generated markdown format
 */

import fs from 'fs'

export function extractImplementationsFromMarkdown(content: string): {
  bruteForce?: { code: string; timeComplexity: string; spaceComplexity: string; explanation?: string }
  optimized?: { code: string; timeComplexity: string; spaceComplexity: string; explanation?: string }
} {
  const implementations: any = {}

  // Extract Brute Force - flexible regex
  const bruteForceRegex = /### Brute Force(?: Approach)?\s*\n```(?:javascript|js)?\s*\n([\s\S]+?)\n```\s*\n\*\*Time Complexity\*\*:\s*([^\n]+)\s*\n\*\*Space Complexity\*\*:\s*([^\n]+)\s*\n\*\*Explanation\*\*:\s*([^\n]+)/i
  const bruteForceMatch = content.match(bruteForceRegex)
  
  if (bruteForceMatch) {
    implementations.bruteForce = {
      title: 'Brute Force Approach',
      code: bruteForceMatch[1].trim(),
      timeComplexity: bruteForceMatch[2].trim(),
      spaceComplexity: bruteForceMatch[3].trim(),
      explanation: bruteForceMatch[4].trim()
    }
    console.log('✅ Extracted Brute Force code')
  }

  // Extract Optimized Solution - very flexible
  const optimizedRegex = /### Optimized Solution(?:\s*\([^)]+\))?\s*\n```(?:javascript|js)?\s*\n([\s\S]+?)\n```\s*\n\*\*Time Complexity\*\*:\s*([^\n]+)\s*\n\*\*Space Complexity\*\*:\s*([^\n]+)\s*\n\*\*Explanation\*\*:\s*([\s\S]+?)(?=\n##|$)/i
  const optimizedMatch = content.match(optimizedRegex)
  
  if (optimizedMatch) {
    implementations.optimized = {
      title: 'Optimized Solution',
      code: optimizedMatch[1].trim(),
      timeComplexity: optimizedMatch[2].trim(),
      spaceComplexity: optimizedMatch[3].trim(),
      explanation: optimizedMatch[4].trim().split('\n')[0] // Take first line
    }
    console.log('✅ Extracted Optimized code')
  }

  return implementations
}

export function extractAnimationStatesFromMarkdown(content: string): Array<{
  step: number
  title: string
  description: string
  data: any
}> {
  const states: Array<any> = []

  // Look for D3 Animation States section
  const d3SectionMatch = content.match(/### D3 Animation States\s*\n([\s\S]+?)(?=\n### [A-Z]|$)/i)
  if (!d3SectionMatch) {
    console.log('⚠️  No D3 Animation States section found')
    return []
  }

  const d3Section = d3SectionMatch[1]

  // Extract each step
  const stepRegex = /#### Step (\d+):\s*([^\n]+)\s*\n\*\*Title\*\*:\s*([^\n]+)\s*\n\*\*Description\*\*:\s*([^\n]+)\s*\n(?:\*\*D3 Data\*\*:\s*\n)?```json\s*\n([\s\S]+?)\n```/g
  
  let match
  while ((match = stepRegex.exec(d3Section)) !== null) {
    try {
      const jsonData = JSON.parse(match[5])
      states.push({
        step: parseInt(match[1]),
        title: match[3].trim(),
        description: match[4].trim(),
        data: jsonData
      })
      console.log(`✅ Extracted animation step ${match[1]}`)
    } catch (error) {
      console.warn(`⚠️  Failed to parse JSON for step ${match[1]}:`, error)
    }
  }

  console.log(`✅ Total animation states extracted: ${states.length}`)
  return states
}

/**
 * Enhance an algorithm object with better code and animation extraction
 */
export function enhanceAlgorithmData(algorithm: any, markdownPath: string): any {
  try {
    const content = fs.readFileSync(markdownPath, 'utf-8')

    // Extract implementations (CODE!)
    const implementations = extractImplementationsFromMarkdown(content)
    if (Object.keys(implementations).length > 0) {
      algorithm.implementations = {
        ...algorithm.implementations,
        ...implementations
      }
      console.log(`✅ Enhanced ${algorithm.id} with ${Object.keys(implementations).length} implementations`)
    }

    // Extract animation states
    const animationStates = extractAnimationStatesFromMarkdown(content)
    if (animationStates.length > 0) {
      algorithm.animationStates = animationStates
      console.log(`✅ Enhanced ${algorithm.id} with ${animationStates.length} animation states`)
    }

    return algorithm
  } catch (error) {
    console.error(`Failed to enhance algorithm ${algorithm.id}:`, error)
    return algorithm
  }
}

