import { OPENAI_API_KEY } from '@/constant'
import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { fileName, fileContent, filePath } = await request.json()

    if (!fileContent) {
      return NextResponse.json({ error: 'No file content provided.' }, { status: 400 })
    }

    // Extract problem ID and algorithm name from filename
    const problemIdMatch = fileName.match(/^(\d{4})-(.+)\.js$/)
    const problemId = problemIdMatch ? parseInt(problemIdMatch[1]) : null
    const algorithmSlug = problemIdMatch ? problemIdMatch[2] : null

    // Use OpenAI to analyze the JavaScript code
    const analysis = await analyzeCodeWithAI(fileContent, fileName, problemId, algorithmSlug)

    return NextResponse.json(analysis)

  } catch (error) {
    console.error('AI analysis error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze code with AI.' },
      { status: 500 }
    )
  }
}

async function analyzeCodeWithAI(
  code: string,
  fileName: string,
  problemId: number | null,
  algorithmSlug: string | null
) {
  const prompt = `
You are an expert algorithm analyst. Analyze this ENTIRE JavaScript algorithm solution comprehensively.

CODE TO ANALYZE:
${code}

FILENAME: ${fileName}
PROBLEM ID: ${problemId || 'Unknown'}
ALGORITHM SLUG: ${algorithmSlug || 'Unknown'}

ANALYSIS REQUIREMENTS:
1. Read and understand the ENTIRE code thoroughly
2. Identify the algorithm type, data structures, and approach used
3. Analyze time and space complexity accurately
4. Extract meaningful examples from the code logic
5. Create educational content including analogies and insights
6. Generate appropriate animation states for visualization

IMPORTANT: Provide ONLY a valid JSON response with NO additional text, comments, or markdown formatting. Start directly with { and end with }. Use double quotes for all strings and property names. Do not include trailing commas.
{
  "algorithmName": "string - kebab-case name (e.g., 'two-sum', 'binary-search')",
  "problemId": ${problemId || 'number - extract from filename or 0'},
  "title": "string - human readable title",
  "description": "string - detailed problem description",
  "difficulty": "Easy" | "Medium" | "Hard",
  "category": "string - algorithm category (Array, String, Linked List, etc.)",
  "timeComplexity": "string - Big O notation (e.g., 'n', 'n^2', 'log n')",
  "spaceComplexity": "string - Big O notation",
  "examples": [
    {
      "input": "string - example input",
      "output": "string - example output",
      "explanation": "string - explanation of the example"
    }
  ],
  "problemStatement": "string - detailed problem statement and description",
  "realWorldUse": "string - real world applications and use cases",
  "analogy": {
    "title": "string - creative real-world analogy title",
    "content": "string - detailed analogy explaining the algorithm"
  },
  "keyInsights": ["string - key learning points and insights"],
  "realWorldApplications": [
    {
      "domain": "string - application domain (e.g., 'E-commerce')",
      "application": "string - specific use case",
      "description": "string - detailed description"
    }
  ],
  "engineeringLessons": [
    {
      "principle": "string - engineering principle",
      "lesson": "string - lesson learned",
      "application": "string - how to apply in real systems"
    }
  ],
  "implementations": {
    "bruteForce": {
      "title": "string - brute force approach title (REQUIRED - always provide)",
      "timeComplexity": "string - time complexity for brute force (e.g., 'O(n²)')",
      "spaceComplexity": "string - space complexity for brute force (e.g., 'O(1)')",
      "code": "string - brute force solution code (if not provided, describe the approach)"
    },
    "optimized": {
      "title": "string - optimized approach title (REQUIRED - always provide)",
      "timeComplexity": "string - time complexity for optimized solution",
      "spaceComplexity": "string - space complexity for optimized solution",
      "code": "string - optimized solution code (REQUIRED - use the provided uploaded code)"
    }
  },
  "animationStates": [
    {
      "step": "number - step number (REQUIRED)",
      "title": "string - step title (REQUIRED)",
      "description": "string - step description (REQUIRED)",
      "data": "object - CONCRETE data for visualization (REQUIRED - use actual values, not placeholders)"
    }
  ],
  "animation": {
    "interactiveData": {
      "algorithmType": "string - type for animation generation",
      "dataStructure": "string - main data structure used",
      "keyOperations": ["string - key operations to animate"],
      "visualizationHints": "string - hints for visualization"
    }
  },
  "metadata": {
    "tags": ["string - relevant tags for the algorithm"],
    "acceptanceRate": "string - estimated acceptance rate (e.g., '50.5%')",
    "frequency": "number - frequency score (1-100)"
  },
  "estimatedTime": "string - estimated time to understand (e.g., '15 min')",
  "popularity": "number - popularity score (1-100)"
}

Focus on:
1. THOROUGH CODE ANALYSIS - Read every line, understand the complete logic flow
2. ACCURATE ALGORITHM IDENTIFICATION - Determine the exact algorithm type and category
3. PRECISE COMPLEXITY ANALYSIS - Calculate O(n) notation based on actual code structure
4. MEANINGFUL EXAMPLES - Create realistic test cases based on code behavior
5. EDUCATIONAL CONTENT - Generate analogies, insights, and real-world applications
6. VISUALIZATION DATA - Create step-by-step animation states with CONCRETE DATA:
   - For Two Sum: Include actual array values, target number, indices
   - For Shortest Palindrome: Include actual strings, current indices, slice comparisons
   - For Container With Most Water: Include actual array heights, pointer positions
   - For Reverse Integer: Include actual numbers, current digits, processing steps
   - Use REAL VALUES not placeholders like "s" or "array"
7. COMPREHENSIVE METADATA - Include relevant tags, difficulty, and frequency data

CRITICAL REQUIREMENTS:
- Generate CONCRETE animation data with actual values (numbers, strings, arrays)
- Use the first example from the examples array to populate animation steps
- Include currentIndex, actual strings, and comparison results in animation data
- Make sure animationStates have realistic, usable data for D3/ReactFlow/Three.js components`

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-nano",
    //   model: "openai/gpt-4.1-nano-2025-04-14",
      messages: [
        {
          role: "system",
          content: "You are an expert algorithm analyst and educational content creator. Analyze JavaScript code and provide detailed, accurate algorithm breakdowns suitable for educational visualization."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 2000,
      temperature: 0.3,
    })

    const response = completion.choices[0]?.message?.content

    if (!response) {
      throw new Error('No response from OpenAI')
    }

    // Parse the JSON response with better error handling
    let analysisResult
    try {
      // Clean the response to remove any markdown formatting
      let cleanedResponse = response.trim()

      // Remove markdown code blocks if present
      if (cleanedResponse.startsWith('```json')) {
        cleanedResponse = cleanedResponse.replace(/^```json\s*/, '').replace(/\s*```$/, '')
      } else if (cleanedResponse.startsWith('```')) {
        cleanedResponse = cleanedResponse.replace(/^```\s*/, '').replace(/\s*```$/, '')
      }

      // Enhanced JSON cleaning for malformed AI responses
      cleanedResponse = cleanedResponse
        // Remove trailing commas before closing braces/brackets
        .replace(/,(\s*[}\]])/g, '$1')
        // Quote unquoted object keys (more comprehensive pattern)
        .replace(/([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g, '$1"$2":')
        // Fix common JSON syntax errors
        .replace(/:\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*([,}\]])/g, ': "$1"$2') // Quote unquoted string values
        .replace(/:\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*$/gm, ': "$1"') // Quote unquoted values at end of lines
        // Handle missing quotes around string values in objects
        .replace(/:\s*([a-zA-Z][a-zA-Z0-9\s]*)\s*([,}\]])/g, ': "$1"$2')
        // Fix double quotes in already quoted strings
        .replace(/"([^"]*)""/g, '"$1"')
        // Remove any remaining trailing commas
        .replace(/,(\s*[}\]])/g, '$1')

      console.log('Cleaned response preview:', cleanedResponse.substring(0, 500) + '...')

      // Try to parse the cleaned JSON
      try {
        analysisResult = JSON.parse(cleanedResponse)
      } catch (firstParseError) {
        console.warn('First JSON parse attempt failed:', firstParseError.message)

        // Try additional cleaning for complex cases
        cleanedResponse = cleanedResponse
          // Handle multiline strings that might break JSON
          .replace(/\\n/g, '\\\\n')
          .replace(/\\t/g, '\\\\t')
          .replace(/\\r/g, '\\\\r')
          // Fix any remaining syntax issues
          .replace(/([{,]\s*)([^":\s][^:]*?)\s*:/g, '$1"$2":')
          // Ensure proper closing of objects and arrays
          .replace(/}([^}]*)$/g, '}$1')
          .replace(/]([^]]*)$/g, ']$1')

        console.log('Attempting second parse with additional cleaning...')
        analysisResult = JSON.parse(cleanedResponse)
      }
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError.message)
      console.error('Raw response:', response)
      throw new Error(`Failed to parse AI response as JSON: ${parseError.message}`)
    }

    // Validate and enhance the result with proper ID generation
    const algorithmName = analysisResult.algorithmName || algorithmSlug || `problem-${problemId}` || 'unknown-algorithm'
    const enhancedResult = {
      ...analysisResult,
      id: algorithmName, // Add consistent ID for localStorage
      problemId: problemId || analysisResult.problemId || 0,
      algorithmName: algorithmName,
      createdAt: Date.now(),
      lastModified: Date.now()
    }

    return enhancedResult

  } catch (error) {
    console.error('OpenAI API error:', error)

    // Fallback analysis if AI fails
    return generateFallbackAnalysis(code, fileName, problemId, algorithmSlug)
  }
}

function generateFallbackAnalysis(
  code: string,
  fileName: string,
  problemId: number | null,
  algorithmSlug: string | null
) {
  console.log('🔄 Generating fallback analysis for:', fileName)

  // Comprehensive pattern analysis
  const patterns = {
    // Data structure patterns
    array: /array|nums|arr|\[\]/gi,
    string: /string|str|charAt|substring|slice/gi,
    linkedList: /ListNode|\.next|head|tail/gi,
    tree: /TreeNode|\.left|\.right|root/gi,
    graph: /graph|adj|visited|dfs|bfs/gi,
    hashMap: /Map|Set|Object|hash|\{\}/gi,

    // Algorithm patterns
    sorting: /sort|Sort|bubble|quick|merge/gi,
    searching: /find|search|binary|linear/gi,
    dynamic: /dp|memo|cache|fibonacci/gi,
    greedy: /greedy|max|min|optimal/gi,

    // Code structure patterns
    recursion: /\bfunction\s+\w+\s*\([^)]*\)\s*\{[\s\S]*?\breturn\s+\w+\s*\(/gi,
    nestedLoops: /for\s*\([^}]*\{[\s\S]*for\s*\(/gi,
    twoPointers: /left|right|i|j|start|end/gi,
    slidingWindow: /window|maxLength|substring/gi
  }

  // Analyze code for patterns
  const codeAnalysis = {
    hasArray: patterns.array.test(code),
    hasString: patterns.string.test(code),
    hasLinkedList: patterns.linkedList.test(code),
    hasTree: patterns.tree.test(code),
    hasGraph: patterns.graph.test(code),
    hasHashMap: patterns.hashMap.test(code),
    hasSorting: patterns.sorting.test(code),
    hasSearching: patterns.searching.test(code),
    hasRecursion: patterns.recursion.test(code),
    hasNestedLoops: patterns.nestedLoops.test(code),
    hasTwoPointers: patterns.twoPointers.test(code),
    hasSlidingWindow: patterns.slidingWindow.test(code),
    hasDynamic: patterns.dynamic.test(code),
    hasGreedy: patterns.greedy.test(code),

    // Count loops and functions
    loopCount: (code.match(/for|while/gi) || []).length,
    functionCount: (code.match(/function|=>/gi) || []).length,
    returnCount: (code.match(/return/gi) || []).length,
    ifCount: (code.match(/if/gi) || []).length
  }

  // Determine algorithm category
  let category = 'Array'
  let difficulty = 'Medium'
  let timeComplexity = 'O(n)'
  let spaceComplexity = 'O(1)'

  if (codeAnalysis.hasString) {
    category = 'String'
    if (codeAnalysis.hasTwoPointers || codeAnalysis.hasSlidingWindow) {
      timeComplexity = 'O(n)'
      difficulty = 'Medium'
    }
  } else if (codeAnalysis.hasLinkedList) {
    category = 'Linked List'
    timeComplexity = 'O(n)'
    spaceComplexity = 'O(1)'
  } else if (codeAnalysis.hasTree) {
    category = 'Tree'
    if (codeAnalysis.hasRecursion) {
      timeComplexity = 'O(n)'
      spaceComplexity = 'O(h)' // height of tree
    }
  } else if (codeAnalysis.hasGraph) {
    category = 'Graph'
    timeComplexity = 'O(V + E)'
    spaceComplexity = 'O(V)'
  } else if (codeAnalysis.hasSorting) {
    category = 'Sorting'
    timeComplexity = 'O(n log n)'
    spaceComplexity = 'O(n)'
  } else if (codeAnalysis.hasSearching) {
    category = 'Search'
    if (codeAnalysis.hasNestedLoops) {
      timeComplexity = 'O(n²)'
    } else {
      timeComplexity = 'O(n)'
    }
  } else if (codeAnalysis.hasDynamic) {
    category = 'Dynamic Programming'
    if (codeAnalysis.hasRecursion) {
      timeComplexity = 'O(2^n)'
      spaceComplexity = 'O(n)'
    } else {
      timeComplexity = 'O(n)'
      spaceComplexity = 'O(n)'
    }
  }

  // Adjust difficulty based on complexity
  if (timeComplexity === 'O(2^n)' || timeComplexity === 'O(n²)') {
    difficulty = 'Hard'
  } else if (timeComplexity === 'O(n)' && !codeAnalysis.hasRecursion) {
    difficulty = 'Easy'
  }

  // Generate meaningful examples based on category
  const examples = generateExamplesForCategory(category, code)

  // Generate animation states
  const animationStates = generateAnimationStates(category, codeAnalysis)

  // Create title from slug
  const title = algorithmSlug
    ? algorithmSlug.split('-').map(word =>
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ')
    : 'Algorithm Solution'

  // Generate tags
  const tags = [category]
  if (codeAnalysis.hasRecursion) tags.push('Recursion')
  if (codeAnalysis.hasHashMap) tags.push('Hash Table')
  if (codeAnalysis.hasTwoPointers) tags.push('Two Pointers')
  if (codeAnalysis.hasSlidingWindow) tags.push('Sliding Window')

  return {
    algorithmName: algorithmSlug || 'unknown-algorithm',
    problemId: problemId || 0,
    title,
    description: `A ${category.toLowerCase()} algorithm that ${codeAnalysis.hasRecursion ? 'uses recursive' : 'uses iterative'} approach to solve the problem with ${timeComplexity} time complexity.`,
    difficulty,
    category,
    timeComplexity,
    spaceComplexity,
    examples,
    problemStatement: generateProblemStatement(category, codeAnalysis),
    realWorldUse: generateRealWorldUse(category),
    analogy: generateAnalogyForCategory(category),
    keyInsights: generateKeyInsights(codeAnalysis, category),
    realWorldApplications: generateRealWorldApplications(category),
    engineeringLessons: generateEngineeringLessons(codeAnalysis, timeComplexity),
    implementations: generateImplementations(code, codeAnalysis),
    animationStates,
    animation: {
      interactiveData: {
        algorithmType: category.toLowerCase().replace(' ', '-'),
        dataStructure: category,
        keyOperations: generateKeyOperations(codeAnalysis, category),
        visualizationHints: `Show ${category.toLowerCase()} operations and data flow`
      }
    },
    metadata: {
      tags,
      acceptanceRate: '50%',
      frequency: 50
    },
    estimatedTime: '20 min',
    popularity: 75
  }
}

function generateProblemStatement(category: string, codeAnalysis: any) {
  const statements: Record<string, string> = {
    'Array': 'Given an array of integers, perform operations to solve the problem efficiently.',
    'String': 'Given a string, manipulate and process it according to the problem requirements.',
    'Linked List': 'Given a linked list, traverse and modify nodes to achieve the desired result.',
    'Tree': 'Given a binary tree, traverse and process nodes to solve the problem.',
    'Graph': 'Given a graph representation, find paths, cycles, or other graph properties.',
    'Hash Table': 'Use efficient key-value storage to solve lookup and counting problems.',
    'Dynamic Programming': 'Break down the problem into overlapping subproblems and solve optimally.',
    'Sorting': 'Arrange elements in a specific order using efficient sorting algorithms.',
    'Search': 'Find elements or properties within data structures efficiently.',
    'Math': 'Apply mathematical concepts and formulas to solve numerical problems.'
  }

  return statements[category] || 'Solve the given algorithmic problem efficiently.'
}

function generateRealWorldUse(category: string) {
  const uses: Record<string, string> = {
    'Array': 'Data processing, scientific computing, game development',
    'String': 'Text processing, search engines, data validation',
    'Linked List': 'Memory management, undo functionality, browser history',
    'Tree': 'File systems, database indexing, decision trees',
    'Graph': 'Social networks, GPS navigation, dependency management',
    'Hash Table': 'Database indexing, caching, symbol tables',
    'Dynamic Programming': 'Resource optimization, game AI, financial modeling',
    'Sorting': 'Search optimization, data analysis, ranking systems',
    'Search': 'Information retrieval, database queries, recommendation systems',
    'Math': 'Cryptography, graphics, scientific simulations'
  }

  return uses[category] || 'Various algorithmic applications'
}

function generateExamplesForCategory(category: string, code: string) {
  const examples = []

  switch (category) {
    case 'Array':
      examples.push({
        input: '[2, 7, 11, 15], target = 9',
        output: '[0, 1]',
        explanation: 'The numbers at indices 0 and 1 (2 + 7) sum to the target 9'
      })
      break
    case 'String':
      examples.push({
        input: '"abcabcbb"',
        output: '3',
        explanation: 'The longest substring without repeating characters is "abc" with length 3'
      })
      break
    case 'Linked List':
      examples.push({
        input: '[1, 2, 3, 4, 5]',
        output: '[1, 3, 5]',
        explanation: 'Returns nodes with odd indices from the linked list'
      })
      break
    case 'Tree':
      examples.push({
        input: '[3, 9, 20, null, null, 15, 7]',
        output: '3',
        explanation: 'The maximum depth of the binary tree is 3'
      })
      break
    default:
      examples.push({
        input: 'Sample input',
        output: 'Sample output',
        explanation: 'Generated based on algorithm analysis'
      })
  }

  return examples
}

function generateConstraintsForCategory(category: string) {
  const constraints = []

  switch (category) {
    case 'Array':
      constraints.push('1 <= nums.length <= 10^4')
      constraints.push('-10^9 <= nums[i] <= 10^9')
      break
    case 'String':
      constraints.push('1 <= s.length <= 10^4')
      constraints.push('s consists of English letters, digits, symbols and spaces')
      break
    case 'Linked List':
      constraints.push('The number of nodes in the list is in the range [0, 10^4]')
      constraints.push('-10^5 <= Node.val <= 10^5')
      break
    default:
      constraints.push('Standard algorithm constraints apply')
  }

  return constraints
}

function generateSolutionExplanation(codeAnalysis: any, timeComplexity: string, category: string) {
  let explanation = `This ${category.toLowerCase()} algorithm `

  if (codeAnalysis.hasRecursion) {
    explanation += 'uses a recursive approach to solve the problem. '
  } else if (codeAnalysis.hasNestedLoops) {
    explanation += 'uses nested loops to iterate through the data. '
  } else {
    explanation += 'uses an iterative approach with linear traversal. '
  }

  explanation += `The time complexity is ${timeComplexity}, and it `

  if (codeAnalysis.hasHashMap) {
    explanation += 'utilizes a hash map for efficient lookups. '
  } else if (codeAnalysis.hasTwoPointers) {
    explanation += 'employs a two-pointer technique for optimal performance. '
  } else if (codeAnalysis.hasSlidingWindow) {
    explanation += 'applies a sliding window approach to maintain efficiency. '
  }

  return explanation.trim()
}

function generateAnalogyForCategory(category: string) {
  const analogies: Record<string, { title: string; content: string }> = {
    'Array': {
      title: 'Shopping List Organization',
      content: 'Imagine organizing a shopping list where you need to find items that together cost exactly $10. You check each combination systematically, just like the algorithm searches through array elements to find the perfect pair.'
    },
    'String': {
      title: 'Reading a Book Without Repeating Words',
      content: 'Think of reading a book and trying to find the longest passage where no word repeats. You slide through the text, keeping track of words you\'ve seen, similar to how the algorithm maintains a window of unique characters.'
    },
    'Linked List': {
      title: 'Train Car Rearrangement',
      content: 'Imagine rearranging train cars on a track. Each car is connected to the next, and you need to reorganize them according to specific rules, just like manipulating nodes in a linked list.'
    },
    'Tree': {
      title: 'Family Tree Exploration',
      content: 'Exploring a family tree is like traversing a binary tree. You start from the root (oldest ancestor) and systematically visit each branch, collecting information as you go deeper.'
    }
  }

  return analogies[category] || {
    title: 'Algorithm Visualization',
    content: 'This algorithm processes data systematically to achieve the desired result, similar to how computers solve complex problems through step-by-step computation.'
  }
}

function generateKeyInsights(codeAnalysis: any, category: string) {
  const insights = [
    `This is a ${category.toLowerCase()} algorithm that demonstrates efficient data structure usage`,
    `Time complexity of ${codeAnalysis.hasNestedLoops ? 'O(n²)' : 'O(n)'} shows the importance of algorithm optimization`
  ]

  if (codeAnalysis.hasRecursion) {
    insights.push('Recursion provides an elegant solution but requires careful stack management')
  }

  if (codeAnalysis.hasHashMap) {
    insights.push('Hash maps provide O(1) lookup time, making them ideal for frequency counting and deduplication')
  }

  return insights
}

function generateRealWorldApplications(category: string) {
  const applications: Record<string, Array<{ domain: string; application: string; description: string }>> = {
    'Array': [
      {
        domain: 'E-commerce',
        application: 'Product Recommendation',
        description: 'Finding complementary products that fit a budget'
      }
    ],
    'String': [
      {
        domain: 'Text Processing',
        application: 'DNA Sequence Analysis',
        description: 'Finding unique genetic sequences in biological data'
      }
    ],
    'Linked List': [
      {
        domain: 'Operating Systems',
        application: 'Memory Management',
        description: 'Managing free memory blocks in dynamic allocation'
      }
    ]
  }

  return applications[category] || [
    {
      domain: 'Software Development',
      application: 'Data Processing',
      description: 'Efficient data manipulation and algorithm implementation'
    }
  ]
}

function generateEngineeringLessons(codeAnalysis: any, timeComplexity: string) {
  const lessons = []

  if (timeComplexity === 'O(n²)') {
    lessons.push({
      principle: 'Algorithm Optimization',
      lesson: 'Nested loops can lead to quadratic time complexity - consider optimization techniques',
      application: 'Use hash maps, sorting, or divide-and-conquer approaches for better performance'
    })
  }

  if (codeAnalysis.hasRecursion) {
    lessons.push({
      principle: 'Recursion Management',
      lesson: 'Recursion simplifies code but can cause stack overflow for large inputs',
      application: 'Consider iterative solutions or tail recursion for production systems'
    })
  }

  return lessons.length > 0 ? lessons : [
    {
      principle: 'Problem Solving',
      lesson: 'Break down complex problems into manageable steps',
      application: 'Apply systematic thinking to algorithm design and implementation'
    }
  ]
}

function generateImplementations(code: string, codeAnalysis: any) {
  const implementations = {
    optimized: {
      title: 'Optimized Solution',
      timeComplexity: codeAnalysis.hasNestedLoops ? 'O(n²)' : codeAnalysis.hasRecursion ? 'O(2^n)' : 'O(n)',
      spaceComplexity: codeAnalysis.hasHashMap ? 'O(n)' : codeAnalysis.hasRecursion ? 'O(n)' : 'O(1)',
      code: code
    },
    bruteForce: {
      title: 'Brute Force Solution',
      timeComplexity: 'O(n²)',
      spaceComplexity: 'O(1)',
      code: '// Brute force approach with nested loops'
    }
  }

  // Always provide brute force implementation for comparison
  let bruteForceTime = 'O(n²)'
  let bruteForceSpace = 'O(1)'
  let bruteForceCode = '// Brute force approach with nested loops'

  if (codeAnalysis.hasRecursion) {
    bruteForceTime = 'O(2^n)'
    bruteForceSpace = 'O(n)'
    bruteForceCode = '// Recursive brute force approach'
  } else if (codeAnalysis.hasString && codeAnalysis.hasTwoPointers) {
    bruteForceTime = 'O(n²)'
    bruteForceCode = '// Nested loops checking all character pairs'
  } else if (codeAnalysis.hasArray && !codeAnalysis.hasNestedLoops) {
    bruteForceTime = 'O(n)'
    bruteForceCode = '// Single pass approach'
  }

  implementations.bruteForce = {
    title: 'Brute Force Approach',
    timeComplexity: bruteForceTime,
    spaceComplexity: bruteForceSpace,
    code: bruteForceCode
  }

  return implementations
}

function generateAnimationStates(category: string, codeAnalysis: any) {
  const states = []

  switch (category) {
    case 'Linked List':
      // Generate concrete linked list animation states
      states.push(
        {
          step: 1,
          title: 'Initialize Pointers',
          description: 'Create dummy nodes and set up traversal pointers',
          data: {
            lessHead: { value: 0, next: null },
            greaterHead: { value: 0, next: null },
            less: { value: 0, next: null },
            greater: { value: 0, next: null },
            currentNode: null,
            partitionValue: 3
          }
        },
        {
          step: 2,
          title: 'Traverse List',
          description: 'Iterate through each node and partition based on value',
          data: {
            currentNode: { value: 1, next: { value: 4, next: { value: 3, next: { value: 2, next: { value: 5, next: null }}}}},
            partitionValue: 3,
            lessList: [{ value: 1 }, { value: 2 }],
            greaterList: [{ value: 4 }, { value: 3 }, { value: 5 }],
            currentIndex: 0
          }
        },
        {
          step: 3,
          title: 'Build Less-Than List',
          description: 'Connect nodes with values less than partition value',
          data: {
            less: { value: 1, next: { value: 2, next: null }},
            lessList: [{ value: 1 }, { value: 2 }],
            partitionValue: 3
          }
        },
        {
          step: 4,
          title: 'Build Greater-Than List',
          description: 'Connect nodes with values greater than or equal to partition value',
          data: {
            greater: { value: 4, next: { value: 3, next: { value: 5, next: null }}},
            greaterList: [{ value: 4 }, { value: 3 }, { value: 5 }],
            partitionValue: 3
          }
        },
        {
          step: 5,
          title: 'Merge Lists',
          description: 'Connect the less-than list to the greater-than list',
          data: {
            finalList: [1, 2, 4, 3, 5],
            less: { value: 1, next: { value: 2, next: { value: 4, next: { value: 3, next: { value: 5, next: null }}}}},
            partitionValue: 3
          }
        }
      )
      break

    case 'Array':
      // Generate concrete array animation states
      states.push(
        {
          step: 1,
          title: 'Initialize Variables',
          description: 'Set up array pointers and variables',
          data: {
            array: [2, 7, 11, 15],
            target: 9,
            left: 0,
            right: 3
          }
        },
        {
          step: 2,
          title: 'Check Sum',
          description: 'Calculate sum of current pointers and compare with target',
          data: {
            array: [2, 7, 11, 15],
            target: 9,
            left: 0,
            right: 3,
            currentSum: 17,
            comparison: 'greater'
          }
        },
        {
          step: 3,
          title: 'Move Pointers',
          description: 'Adjust pointers based on sum comparison',
          data: {
            array: [2, 7, 11, 15],
            target: 9,
            left: 0,
            right: 1,
            currentSum: 9,
            comparison: 'equal'
          }
        },
        {
          step: 4,
          title: 'Found Solution',
          description: 'Target sum found at current pointer positions',
          data: {
            array: [2, 7, 11, 15],
            target: 9,
            solution: [0, 1],
            found: true
          }
        }
      )
      break

    case 'String':
      // Generate concrete string animation states
      states.push(
        {
          step: 1,
          title: 'Initialize String',
          description: 'Set up string variables and pointers',
          data: {
            original: "aacecaaa",
            reversed: "",
            currentIndex: 0
          }
        },
        {
          step: 2,
          title: 'Reverse String',
          description: 'Create reversed version of the input string',
          data: {
            original: "aacecaaa",
            reversed: "aaacecaa",
            currentIndex: 0
          }
        },
        {
          step: 3,
          title: 'Compare Prefixes',
          description: 'Check if string prefixes match reversed suffixes',
          data: {
            original: "aacecaaa",
            reversed: "aaacecaa",
            currentIndex: 1,
            s_slice: "a",
            reversed_slice: "a",
            match: true
          }
        },
        {
          step: 4,
          title: 'Construct Result',
          description: 'Build the shortest palindrome by prepending unmatched characters',
          data: {
            original: "aacecaaa",
            result: "aaacecaaa",
            prepend: "a",
            final: "aaacecaaa"
          }
        }
      )
      break

    default:
      // Generic fallback for other categories
      states.push(
        {
          step: 1,
          title: 'Initialization',
          description: 'Set up initial variables and data structures',
          data: { status: 'initialized', category: category }
        },
        {
          step: 2,
          title: 'Process Data',
          description: 'Execute the core algorithm logic',
          data: { status: 'processing', operations: codeAnalysis.functionCount }
        },
        {
          step: 3,
          title: 'Compute Result',
          description: 'Calculate and prepare the final result',
          data: { status: 'computing', result: 'pending' }
        },
        {
          step: 4,
          title: 'Complete',
          description: 'Algorithm execution finished',
          data: { status: 'complete', result: 'computed' }
        }
      )
  }

  return states
}

function generateKeyOperations(codeAnalysis: any, category: string) {
  const operations = []

  if (codeAnalysis.hasHashMap) operations.push('Hash map operations')
  if (codeAnalysis.hasTwoPointers) operations.push('Pointer movement')
  if (codeAnalysis.hasSlidingWindow) operations.push('Window sliding')
  if (codeAnalysis.hasRecursion) operations.push('Recursive calls')

  // Add category-specific operations
  switch (category) {
    case 'Array':
      operations.push('Array iteration', 'Element comparison')
      break
    case 'String':
      operations.push('Character processing', 'Substring operations')
      break
    case 'Linked List':
      operations.push('Node traversal', 'Pointer manipulation')
      break
    case 'Tree':
      operations.push('Tree traversal', 'Node processing')
      break
  }

  return operations.length > 0 ? operations : ['Data processing', 'Result computation']
}
