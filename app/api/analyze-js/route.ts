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
You are an expert algorithm animator and analyst. Analyze this JavaScript code and generate comprehensive animation data optimized for D3.js, ReactFlow, and Three.js interactive visualizations.

CODE TO ANALYZE:
${code}

FILENAME: ${fileName}
PROBLEM ID: ${problemId || 'Unknown'}
ALGORITHM SLUG: ${algorithmSlug || 'Unknown'}

CRITICAL REQUIREMENTS:
1. Generate CONCRETE ANIMATION DATA with real values (no placeholders like "array" or "s")
2. Include algorithm-specific data structures for proper visualization
3. Provide visualization hints for D3, ReactFlow, and Three.js
4. Create step-by-step animation states with timing information
5. Focus on educational value and interactive learning experience

IMPORTANT: Return ONLY valid JSON starting with { and ending with }. No markdown, comments, or additional text.

{
  "algorithmName": "${algorithmSlug || 'algorithm'}",
  "problemId": ${problemId || 0},
  "title": "Algorithm Title",
  "description": "Detailed algorithm description with approach explanation",
  "difficulty": "Easy|Medium|Hard",
  "category": "Array|String|Linked List|Tree|Graph|Dynamic Programming|Sorting",
  "timeComplexity": "O(1)|O(log n)|O(n)|O(n log n)|O(n²)|O(2^n)",
  "spaceComplexity": "O(1)|O(log n)|O(n)|O(n²)",

  "examples": [
    {
      "input": "Generate concrete, realistic input based on the algorithm type. For Two Sum: [2,7,11,15], target = 9. For Shortest Palindrome: 'aacecaaa'. For Linked List: [1,4,3,2,5], partitionValue = 3",
      "output": "Generate corresponding concrete output. For Two Sum: [0,1]. For Shortest Palindrome: 'aaacecaaa'. For Linked List: [1,2,4,3,5]",
      "explanation": "Provide detailed step-by-step explanation of how the algorithm processes this specific input to produce the output"
    },
    {
      "input": "Generate a different realistic example for the same algorithm type",
      "output": "Generate corresponding output for this example",
      "explanation": "Explain the algorithm's behavior with this different input"
    },
    {
      "input": "Generate an edge case example (empty, single element, maximum values)",
      "output": "Generate corresponding edge case output",
      "explanation": "Explain how the algorithm handles edge cases"
    }
  ],

  "problemStatement": "Complete problem description with constraints and requirements",

  "implementations": {
    "bruteForce": {
      "title": "Brute Force Approach - Complete Solution",
      "timeComplexity": "O(n²)",
      "spaceComplexity": "O(1)",
      "code": "${code.replace(/"/g, '\\"').replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/\t/g, '\\t')}",
      "explanation": "Simple but inefficient approach that checks all possible combinations",
      "whenToUse": "Small input sizes, educational purposes, baseline comparison"
    },
    "optimized": {
      "title": "Optimized Solution - Efficient Implementation",
      "timeComplexity": "O(n)",
      "spaceComplexity": "O(1)",
      "code": "${code.replace(/"/g, '\\"').replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/\t/g, '\\t')}",
      "explanation": "Most efficient approach using optimal algorithm design",
      "whenToUse": "Large input sizes, production code, performance-critical applications"
    },
    "alternative": {
      "title": "Alternative Approach - Different Strategy",
      "timeComplexity": "O(n log n)",
      "spaceComplexity": "O(n)",
      "code": "// Alternative implementation would go here",
      "explanation": "Different algorithmic approach for comparison",
      "whenToUse": "When space is not a constraint, educational comparison"
    }
  },

  "animationStates": [
    {
      "step": 1,
      "title": "Initialization",
      "description": "Set up data structures and initial state",
      "data": {
        "status": "initialized",
        "timestamp": "Date.now()",
        "duration": 300,
        "easing": "ease-out"
      }
    },
    {
      "step": 2,
      "title": "Main Processing",
      "description": "Execute core algorithm logic with concrete data",
      "data": {
        "currentIndex": 0,
        "processing": true,
        "duration": 500,
        "delay": 200
      }
    },
    {
      "step": 3,
      "title": "Algorithm Completion",
      "description": "Final result and cleanup",
      "data": {
        "completed": true,
        "result": "computed",
        "duration": 400,
        "highlightResult": true
      }
    }
  ],

  "animation": {
    "interactiveData": {
      "algorithmType": "array|linked-list|tree|graph|string|dp|sorting",
      "dataStructure": "Array|LinkedList|Tree|Graph|String|Number",
      "keyOperations": [
        "Pointer movement",
        "Value comparison",
        "Node traversal",
        "List manipulation",
        "Tree traversal",
        "Array indexing"
      ],
      "visualizationHints": "Detailed hints for each visualization library",
      "d3Hints": "SVG-based approach: Use circles for nodes, paths for connections, transitions for animations",
      "reactFlowHints": "Node-edge approach: Custom node types, animated edges, interactive controls",
      "threeHints": "3D approach: Spatial positioning, material animations, camera movements"
    }
  },

  "visualizationConfig": {
    "d3": {
      "layout": "horizontal|vertical|circular",
      "nodeSize": 40,
      "edgeStyle": "curved|straight",
      "colorScheme": "blue-green|red-blue|green-red",
      "animationDuration": 500,
      "interactive": true
    },
    "reactFlow": {
      "nodeTypes": ["default", "algorithm-node"],
      "edgeTypes": ["default", "animated"],
      "layoutAlgorithm": "dagre|elk",
      "zoomOnScroll": true,
      "panOnDrag": true,
      "interactive": true
    },
    "three": {
      "cameraPosition": [5, 5, 5],
      "controls": "orbit|trackball",
      "lighting": "ambient,directional",
      "materialType": "standard",
      "geometryType": "box|sphere|cylinder",
      "animationStyle": "smooth|energetic"
    }
  },

  "metadata": {
    "tags": ["algorithm", "data-structure", "optimization", "javascript", "problem-solving"],
    "acceptanceRate": "55.2%",
    "frequency": 85,
    "similarProblems": [
      "Similar LeetCode problems for practice",
      "Related algorithm challenges"
    ],
    "difficultyBreakdown": {
      "understanding": "Medium",
      "implementation": "Easy",
      "optimization": "Hard"
    }
  },

  "educationalContent": {
    "analogy": {
      "title": "Real-world analogy for the algorithm",
      "content": "Detailed explanation using everyday concepts with concrete examples",
      "visualAid": "Description of how to visualize this analogy"
    },
    "keyInsights": [
      "Critical learning points about the algorithm",
      "Performance characteristics and trade-offs",
      "When to use this algorithm vs alternatives",
      "Common optimization patterns",
      "Edge case handling strategies"
    ],
    "commonMistakes": [
      "Typical errors developers make",
      "Edge cases to watch out for",
      "Performance pitfalls",
      "Memory leak scenarios",
      "Boundary condition errors"
    ],
    "optimizationTips": [
      "How to improve performance",
      "Memory optimization techniques",
      "Best practices for implementation",
      "Language-specific optimizations",
      "Space-time trade-off considerations"
    ],
    "interviewTips": [
      "Common interview questions about this algorithm",
      "How to explain the solution to interviewers",
      "Follow-up questions to prepare for",
      "Red flags interviewers look for"
    ]
  },

  "codeQuality": {
    "readability": 8,
    "efficiency": 9,
    "maintainability": 7,
    "documentation": 8,
    "testability": 9,
    "bestPractices": [
      "Use descriptive variable names",
      "Add proper error handling",
      "Include input validation",
      "Document edge cases",
      "Consider performance implications"
    ]
  },

  "testingScenarios": [
    {
      "scenario": "Basic functionality test",
      "input": "Typical input case",
      "expectedOutput": "Expected result",
      "edgeCase": false
    },
    {
      "scenario": "Edge case: Empty input",
      "input": "Empty array/string/null",
      "expectedOutput": "Appropriate handling",
      "edgeCase": true
    },
    {
      "scenario": "Edge case: Maximum input size",
      "input": "Largest possible input",
      "expectedOutput": "Handles large data efficiently",
      "edgeCase": true
    },
    {
      "scenario": "Edge case: Invalid input",
      "input": "Wrong data type or format",
      "expectedOutput": "Graceful error handling",
      "edgeCase": true
    }
  ],

  "performanceAnalysis": {
    "bestCase": "O(1) - Constant time",
    "averageCase": "O(n) - Linear time",
    "worstCase": "O(n²) - Quadratic time",
    "spaceComplexity": "O(1) - Constant space",
    "bottlenecks": [
      "Identify performance bottlenecks",
      "Optimization opportunities",
      "Memory usage patterns"
    ],
    "scalability": "How the algorithm scales with input size"
  },

  "relatedAlgorithms": [
    {
      "name": "Related Algorithm 1",
      "similarity": "Shares similar concepts",
      "whenToUse": "Alternative approach scenarios"
    },
    {
      "name": "Related Algorithm 2",
      "similarity": "Different but related problem",
      "whenToUse": "Complementary solution approach"
    }
  ]
}

ANIMATION DATA REQUIREMENTS:
- Use CONCRETE VALUES: Real arrays, strings, numbers, objects
- Include TIMING: duration, delay, easing for each step
- Specify VISUALIZATION: D3 SVG, ReactFlow nodes, Three.js 3D
- Add INTERACTION: Clickable elements, hover effects, step controls
- Focus on EDUCATION: Clear progression, highlights, explanations

For specific algorithm types:
- ARRAY: Include actual array values, indices, comparisons
- LINKED LIST: Include node values, next pointers, traversal steps
- TREE: Include node values, left/right children, traversal order
- GRAPH: Include nodes, edges, visited states, traversal paths
- STRING: Include actual strings, indices, character comparisons
- DP: Include table values, dependencies, optimal substructure

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
    analogy: generateAnalogyForCategory(category, algorithmSlug),
    keyInsights: generateKeyInsights(codeAnalysis, category, algorithmSlug),
    realWorldApplications: generateRealWorldApplications(category, algorithmSlug),
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

function generateAnalogyForCategory(category: string, algorithmName?: string) {
  const analogies: Record<string, { title: string; content: string; visualAid: string }> = {
    'Array': {
      title: 'Two Sum: Finding Perfect Pizza Combinations',
      content: 'Imagine you\'re at a pizza shop with a menu of prices: [2, 7, 11, 15]. You need to find two items that total exactly $9. You scan the menu once, remembering what you\'ve seen, and when you find an item that complements what you need (7 + 2 = 9), you\'ve found your perfect combination!',
      visualAid: 'Picture a conveyor belt of pizza prices. As you walk along, you keep track of prices you\'ve seen. When you find one that matches what you need to reach your target, you grab both items.'
    },
    'String': {
      title: 'Palindrome: Mirror Reflection Puzzle',
      content: 'Think of a word written on a mirror. When you read it backwards, it should look exactly the same as the original. Like checking if "racecar" reads the same forwards and backwards, the algorithm compares characters from both ends, moving towards the center like closing a zipper.',
      visualAid: 'Visualize two people standing at opposite ends of a hallway with letters on the walls. They walk towards each other, comparing letters as they meet. If all pairs match, you have a perfect palindrome reflection.'
    },
    'Linked List': {
      title: 'Partition List: Sorting Laundry by Color',
      content: 'Imagine sorting a pile of laundry where you separate dark clothes from light ones. You go through each item one by one, deciding whether it goes in the "dark" pile or "light" pile based on a color threshold. The algorithm rearranges the linked list so all "smaller" values come before all "larger" values.',
      visualAid: 'Picture two laundry baskets. As you pick up each piece of clothing, you check its color against your threshold. Dark clothes go in one basket, light clothes in another. Finally, you connect the baskets to create one organized pile.'
    },
    'Tree': {
      title: 'Binary Search Tree: Library Card Catalog',
      content: 'A library card catalog is organized like a binary search tree. Books are arranged alphabetically, with each branch point helping you narrow down your search. "Is your book before or after \'M\'? Before \'G\' or after?" Each decision point guides you to your target book efficiently.',
      visualAid: 'Imagine a tree where each branch point has a book title. Starting from the root, you compare your target book with the current node, going left if it comes earlier alphabetically, right if it comes later, until you find your book.'
    },
    'Dynamic Programming': {
      title: 'Fibonacci: Rabbit Population Growth',
      content: 'Consider how rabbits reproduce: each pair produces a new pair every month. The total number of pairs each month follows the Fibonacci sequence. Instead of recalculating each month\'s total, you build up from previous months, storing intermediate results to avoid redundant calculations.',
      visualAid: 'Visualize a pyramid where each level represents a month. Instead of counting rabbits from scratch each month, you add the two previous levels together, creating an efficient calculation pyramid.'
    },
    'Graph': {
      title: 'Social Network: Finding Mutual Friends',
      content: 'Finding the shortest path between two people in a social network is like finding the most direct connection through mutual friends. You explore outward from person A, checking connections level by level, until you find the shortest path to person B.',
      visualAid: 'Imagine concentric circles radiating out from person A. Each circle represents one degree of separation. You systematically explore each circle, marking visited people, until you reach person B through the shortest possible connection chain.'
    }
  }

  // Get specific analogy based on algorithm name if available
  if (algorithmName) {
    const specificAnalogies: Record<string, { title: string; content: string; visualAid: string }> = {
      'two-sum': {
        title: 'Two Sum: Perfect Grocery Combination',
        content: 'You\'re shopping with a $10 budget and need exactly two items that total $10. As you scan prices [2, 7, 11, 15], you remember what you\'ve seen. When you see $7 and know you saw $3 earlier (10-7=3), you\'ve found your perfect pair!',
        visualAid: 'Picture a store shelf with price tags. You keep a mental note of prices you\'ve seen. When a new price complements a previous price to reach your target, you\'ve found the winning combination.'
      },
      'shortest-palindrome': {
        title: 'Shortest Palindrome: Minimal Mirror Extension',
        content: 'You have a word like "abc" and want to make it a palindrome by adding the fewest letters possible. You discover that adding "ba" at the front creates "bacabc", which reads the same forwards and backwards with minimal addition.',
        visualAid: 'Imagine a word as a half-finished mirror. You need to add the fewest possible characters to the front so that when light reflects off it, the word appears complete and symmetrical.'
      },
      'container-with-most-water': {
        title: 'Container With Most Water: Optimal Fence Posts',
        content: 'You have fence posts of different heights and want to find two posts that, with the ground, would hold the most water. You use two pointers starting from the ends, moving the shorter pointer inward, calculating area at each step to find the maximum.',
        visualAid: 'Visualize fence posts of heights [1,8,6,2,5,4,8,3,7]. Two pointers start at the ends. At each step, you calculate the water area between current pointers and move the shorter post inward, always seeking maximum area.'
      }
    }

    if (specificAnalogies[algorithmName.toLowerCase()]) {
      return specificAnalogies[algorithmName.toLowerCase()]
    }
  }

  return analogies[category] || {
    title: 'Algorithm Problem Solving',
    content: 'This algorithm systematically processes input data to achieve the desired computational result, breaking down complex problems into manageable, efficient steps that computers can execute reliably.',
    visualAid: 'Think of it as a well-designed factory assembly line where each worker (algorithm step) has a specific role, and the final product emerges through coordinated, efficient operations.'
  }
}

function generateKeyInsights(codeAnalysis: any, category: string, algorithmName?: string) {
  const insights = []

  // Algorithm-specific insights
  if (algorithmName?.toLowerCase().includes('two-sum')) {
    insights.push('Hash Map optimization transforms O(n²) brute force into O(n) by trading space for time')
    insights.push('Single-pass iteration with complement lookup is a classic example of the hash map pattern')
    insights.push('Early termination when solution is found prevents unnecessary computation')
  } else if (algorithmName?.toLowerCase().includes('palindrome')) {
    insights.push('Two-pointer technique from opposite ends is perfect for symmetry checking')
    insights.push('Character-by-character comparison reveals the essence of palindrome validation')
    insights.push('Reversing strings is memory-intensive; in-place comparison is more efficient')
  } else if (algorithmName?.toLowerCase().includes('linked-list')) {
    insights.push('Pointer manipulation requires careful null checking to prevent runtime errors')
    insights.push('Dummy node technique simplifies edge case handling in linked list operations')
    insights.push('Multiple pointer variables (slow/fast) enable complex traversal patterns')
  }

  // Category-based insights
  switch (category.toLowerCase()) {
    case 'array':
      insights.push('Arrays provide O(1) random access but require contiguous memory allocation')
      insights.push('Index-based operations make arrays ideal for sequential processing')
      insights.push('Consider space constraints when working with large arrays')
      break

    case 'string':
      insights.push('String immutability affects performance in languages like Java and Python')
      insights.push('Character arrays or StringBuilder provide better performance for modifications')
      insights.push('ASCII vs Unicode considerations impact string processing complexity')
      break

    case 'linked list':
      insights.push('Linked lists excel at insertions/deletions but have O(n) random access')
      insights.push('Memory overhead of pointers can be significant for small data elements')
      insights.push('Traversal requires careful null checking at each step')
      break

    case 'tree':
      insights.push('Tree height determines operation complexity - balanced trees are crucial')
      insights.push('Recursive algorithms are natural for tree traversal but watch stack depth')
      insights.push('In-order traversal preserves sorted order in binary search trees')
      break

    case 'dynamic programming':
      insights.push('Memoization prevents redundant calculations by storing intermediate results')
      insights.push('State definition is critical - each state must uniquely identify a subproblem')
      insights.push('Tabulation builds solutions bottom-up, often more cache-friendly than recursion')
      break
  }

  // Code pattern insights
  if (codeAnalysis.hasNestedLoops) {
    insights.push('Nested loops multiply time complexity - consider hash maps or sorting optimizations')
    insights.push('Break early from inner loops when possible to improve performance')
  }

  if (codeAnalysis.hasRecursion) {
    insights.push('Recursion depth should be monitored to prevent stack overflow errors')
    insights.push('Tail recursion can be optimized by compilers but isn\'t always guaranteed')
    insights.push('Consider iterative solutions for production code with large inputs')
  }

  if (codeAnalysis.hasHashMap) {
    insights.push('Hash collisions can degrade O(1) to O(n) - choose hash functions carefully')
    insights.push('Load factor affects hash table performance - monitor and resize when needed')
    insights.push('Hash maps provide excellent average-case performance for most use cases')
  }

  // Performance insights
  const timeComplexity = codeAnalysis.hasNestedLoops ? 'O(n²)' : codeAnalysis.hasRecursion ? 'O(2^n)' : 'O(n)'
  insights.push(`Time complexity of ${timeComplexity} demonstrates the importance of algorithmic efficiency`)
  insights.push('Space-time trade-offs are fundamental to algorithm design and optimization')

  return insights.length > 0 ? insights : [
    'This algorithm demonstrates fundamental problem-solving techniques',
    'Understanding time and space complexity is crucial for performance optimization',
    'Edge cases and input validation are essential for robust implementations'
  ]
}

function generateRealWorldApplications(category: string, algorithmName?: string) {
  // Algorithm-specific applications
  if (algorithmName) {
    const specificApps: Record<string, Array<{ domain: string; application: string; description: string }>> = {
      'two-sum': [
        {
          domain: 'E-commerce',
          application: 'Shopping Cart Optimization',
          description: 'Finding two products that perfectly match a customer\'s budget for bundle deals'
        },
        {
          domain: 'Finance',
          application: 'Currency Exchange',
          description: 'Finding currency pairs that sum to a target exchange rate for arbitrage opportunities'
        },
        {
          domain: 'Gaming',
          application: 'Resource Combination',
          description: 'Combining game items or resources to achieve specific stat combinations'
        }
      ],
      'shortest-palindrome': [
        {
          domain: 'Bioinformatics',
          application: 'DNA Sequence Completion',
          description: 'Finding minimal DNA sequence extensions to create palindromic structures'
        },
        {
          domain: 'Text Editors',
          application: 'Auto-complete Suggestions',
          description: 'Suggesting minimal character additions to complete words or phrases'
        },
        {
          domain: 'Data Compression',
          application: 'Pattern Recognition',
          description: 'Identifying and extending palindromic patterns in compressed data streams'
        }
      ],
      'container-with-most-water': [
        {
          domain: 'Civil Engineering',
          application: 'Reservoir Design',
          description: 'Maximizing water storage capacity between terrain elevations'
        },
        {
          domain: 'Financial Trading',
          application: 'Portfolio Optimization',
          description: 'Finding optimal asset combinations for maximum return within constraints'
        },
        {
          domain: 'Urban Planning',
          application: 'Building Placement',
          description: 'Optimizing building heights and positions for maximum usable space'
        }
      ]
    }

    if (specificApps[algorithmName.toLowerCase()]) {
      return specificApps[algorithmName.toLowerCase()]
    }
  }

  // Category-based applications
  const applications: Record<string, Array<{ domain: string; application: string; description: string }>> = {
    'Array': [
      {
        domain: 'E-commerce',
        application: 'Product Recommendation',
        description: 'Finding complementary products that fit a budget constraint'
      },
      {
        domain: 'Data Analysis',
        application: 'Statistical Processing',
        description: 'Computing moving averages and statistical measures on data arrays'
      },
      {
        domain: 'Image Processing',
        application: 'Pixel Manipulation',
        description: 'Applying filters and transformations to image pixel arrays'
      }
    ],
    'String': [
      {
        domain: 'Text Processing',
        application: 'DNA Sequence Analysis',
        description: 'Finding unique genetic sequences and patterns in biological data'
      },
      {
        domain: 'Search Engines',
        application: 'Text Search Algorithms',
        description: 'Implementing efficient string matching for web search functionality'
      },
      {
        domain: 'Security',
        application: 'Pattern Recognition',
        description: 'Detecting malicious patterns in network traffic and system logs'
      }
    ],
    'Linked List': [
      {
        domain: 'Operating Systems',
        application: 'Memory Management',
        description: 'Managing free memory blocks in dynamic memory allocation systems'
      },
      {
        domain: 'File Systems',
        application: 'Directory Structures',
        description: 'Implementing hierarchical file system navigation and organization'
      },
      {
        domain: 'Network Routing',
        application: 'Packet Queues',
        description: 'Managing network packet queues with efficient insertion and removal'
      }
    ],
    'Tree': [
      {
        domain: 'Database Systems',
        application: 'Index Structures',
        description: 'Implementing B-trees and balanced trees for database indexing'
      },
      {
        domain: 'Artificial Intelligence',
        application: 'Decision Trees',
        description: 'Building decision tree models for machine learning classification'
      },
      {
        domain: 'Computer Graphics',
        application: 'Scene Graphs',
        description: 'Organizing 3D scene objects in hierarchical tree structures'
      }
    ],
    'Dynamic Programming': [
      {
        domain: 'Operations Research',
        application: 'Resource Allocation',
        description: 'Optimizing resource distribution with knapsack and scheduling problems'
      },
      {
        domain: 'Bioinformatics',
        application: 'Sequence Alignment',
        description: 'Finding optimal alignments between DNA, RNA, or protein sequences'
      },
      {
        domain: 'Speech Recognition',
        application: 'Language Modeling',
        description: 'Building probabilistic models for natural language processing'
      }
    ],
    'Graph': [
      {
        domain: 'Social Networks',
        application: 'Friend Recommendations',
        description: 'Finding mutual connections and suggesting new relationships'
      },
      {
        domain: 'Transportation',
        application: 'Route Optimization',
        description: 'Finding optimal paths in road networks and public transportation'
      },
      {
        domain: 'Computer Networks',
        application: 'Network Analysis',
        description: 'Analyzing network topology and finding bottlenecks in data networks'
      }
    ]
  }

  return applications[category] || [
    {
      domain: 'Software Development',
      application: 'Data Processing',
      description: 'Efficient data manipulation and algorithm implementation for general-purpose computing'
    },
    {
      domain: 'System Design',
      application: 'Performance Optimization',
      description: 'Applying algorithmic principles to improve system efficiency and scalability'
    },
    {
      domain: 'Problem Solving',
      application: 'Computational Thinking',
      description: 'Developing systematic approaches to complex computational challenges'
    }
  ]
}

function generateEngineeringLessons(codeAnalysis: any, timeComplexity: string) {
  const lessons = []
  const algorithmType = codeAnalysis.algorithmType || 'unknown'

  // Algorithm-specific lessons based on type
  switch (algorithmType.toLowerCase()) {
    case 'array':
    case 'two-sum':
      lessons.push({
        principle: 'Hash Map Optimization',
        lesson: 'Using hash maps for O(1) lookups can reduce time complexity from O(n²) to O(n)',
        application: 'Trade space for time - use HashMap/Set for frequency counting and fast lookups in array problems'
      })
      lessons.push({
        principle: 'Two Pointer Technique',
        lesson: 'Two pointers moving towards each other can solve many array problems efficiently',
        application: 'Use for sorted arrays, palindrome checks, and problems requiring O(n) time with O(1) space'
      })
      break

    case 'string':
    case 'palindrome':
      lessons.push({
        principle: 'String Immutability',
        lesson: 'Strings are immutable in most languages - consider character arrays for frequent modifications',
        application: 'Use StringBuilder in Java, arrays in C++, or mutable strings where available for better performance'
      })
      lessons.push({
        principle: 'Character Encoding',
        lesson: 'Different character encodings can affect string comparison and manipulation',
        application: 'Be aware of ASCII vs Unicode, case sensitivity, and special character handling'
      })
      break

    case 'linked-list':
      lessons.push({
        principle: 'Pointer Management',
        lesson: 'Careful pointer manipulation is crucial to avoid memory leaks and null pointer exceptions',
        application: 'Always check for null pointers, use dummy nodes for edge cases, and properly update next pointers'
      })
      lessons.push({
        principle: 'Fast/Slow Pointer Pattern',
        lesson: 'Using two pointers moving at different speeds can detect cycles and find middle elements',
        application: 'Perfect for cycle detection, finding middle of list, and handling circular linked lists'
      })
      break

    case 'tree':
      lessons.push({
        principle: 'Recursive Tree Traversal',
        lesson: 'Tree problems often lend themselves naturally to recursive solutions',
        application: 'Consider recursion for inorder, preorder, postorder traversals, but watch for stack overflow'
      })
      lessons.push({
        principle: 'Tree Balancing',
        lesson: 'Balanced trees provide O(log n) operations, unbalanced trees can degrade to O(n)',
        application: 'Use self-balancing trees (AVL, Red-Black) or ensure input is randomized for better performance'
      })
      break

    case 'dynamic-programming':
      lessons.push({
        principle: 'Optimal Substructure',
        lesson: 'Break problems into smaller subproblems and solve each only once',
        application: 'Use memoization or tabulation to avoid redundant calculations and achieve optimal solutions'
      })
      lessons.push({
        principle: 'State Definition',
        lesson: 'Clearly define what each state in your DP table represents',
        application: 'Choose meaningful state variables that capture all necessary information for the subproblem'
      })
      break
  }

  // Complexity-based lessons
  if (timeComplexity === 'O(n²)' || timeComplexity === 'O(n³)') {
    lessons.push({
      principle: 'Algorithm Optimization',
      lesson: 'Nested loops create multiplicative time complexity - look for optimization opportunities',
      application: 'Use hash maps for O(1) lookups, sorting for O(n log n), or divide-and-conquer for better performance'
    })
  }

  if (timeComplexity === 'O(2^n)') {
    lessons.push({
      principle: 'Exponential Complexity',
      lesson: 'Exponential time complexity limits input size to ~20-30 elements',
      application: 'Consider dynamic programming, greedy algorithms, or mathematical optimizations for larger inputs'
    })
  }

  // Code pattern-based lessons
  if (codeAnalysis.hasRecursion) {
    lessons.push({
      principle: 'Recursion Depth Management',
      lesson: 'Deep recursion can cause stack overflow - monitor recursion depth',
      application: 'Use iterative solutions for deep recursion, implement tail recursion where possible'
    })
  }

  if (codeAnalysis.hasHashMap) {
    lessons.push({
      principle: 'Hash Function Quality',
      lesson: 'Poor hash functions lead to collisions and degrade O(1) to O(n) performance',
      application: 'Choose appropriate hash functions, handle collisions properly, and consider load factor'
    })
  }

  if (codeAnalysis.hasSorting) {
    lessons.push({
      principle: 'Sorting Algorithm Selection',
      lesson: 'Different sorting algorithms have different time/space trade-offs',
      application: 'Use quicksort for general purpose, mergesort for stability, heapsort for space constraints'
    })
  }

  // General engineering lessons
  lessons.push({
    principle: 'Edge Case Handling',
    lesson: 'Always consider empty inputs, single elements, maximum values, and boundary conditions',
    application: 'Write comprehensive tests covering edge cases and validate input constraints early'
  })

  lessons.push({
    principle: 'Space-Time Trade-offs',
    lesson: 'Often you can trade space for time or vice versa - choose based on constraints',
    application: 'Use additional space for caching, precomputation, or hash tables when time is critical'
  })

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
