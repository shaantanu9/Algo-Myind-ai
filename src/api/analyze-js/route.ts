import { OPENAI_API_KEY } from '@/constants/constant'
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

    // Use OpenAI to generate markdown documentation
    const markdownContent = await generateMarkdownWithAI(fileContent, fileName, problemId, algorithmSlug)

    // Save the markdown file
    const fs = require('fs').promises
    const path = require('path')

    try {
      const algorithmsDir = path.join(process.cwd(), 'src', 'algorithms')
      await fs.mkdir(algorithmsDir, { recursive: true })

      const algorithmId = algorithmSlug || `problem-${problemId}` || `algorithm-${Date.now()}`
      const markdownPath = path.join(algorithmsDir, `${algorithmId}.md`)

      await fs.writeFile(markdownPath, markdownContent, 'utf-8')

      console.log(`✅ Markdown saved to: ${markdownPath}`)
    } catch (saveError) {
      console.error('Failed to save markdown file:', saveError)
    }

    return NextResponse.json({
      success: true,
      markdown: markdownContent,
      message: 'Markdown documentation generated and saved successfully'
    })

  } catch (error) {
    console.error('AI analysis error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze code with AI.' },
      { status: 500 }
    )
  }
}

async function generateMarkdownWithAI(
  code: string,
  fileName: string,
  problemId: number | null,
  algorithmSlug: string | null
) {
  // Read the markdown prompt from file
  const fs = require('fs')
  const path = require('path')
  const promptPath = path.join(process.cwd(), 'src', 'prompts', 'algorithm-markdown-prompt.md')
  const promptTemplate = fs.readFileSync(promptPath, 'utf-8')

  // Replace placeholders in the prompt
  const prompt = promptTemplate
    .replace(/\{CODE\}/g, code)
    .replace(/\{FILENAME\}/g, fileName)
    .replace(/\{PROBLEM_ID\}/g, problemId?.toString() || 'Unknown')
    .replace(/\{ALGORITHM_SLUG\}/g, algorithmSlug || 'Unknown')

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are an expert algorithm instructor and educational content creator. Generate comprehensive markdown documentation following the exact format specified."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 4000,
      temperature: 0.3,
    })

    const markdownContent = completion.choices[0]?.message?.content?.trim()

    if (!markdownContent) {
      throw new Error('No response from OpenAI')
    }

    return markdownContent

  } catch (error) {
    console.error('OpenAI API error:', error)

    // Fallback: generate basic markdown structure
    return generateFallbackMarkdown(code, fileName, problemId, algorithmSlug)
  }
}

function generateFallbackMarkdown(
  code: string,
  fileName: string,
  problemId: number | null,
  algorithmSlug: string | null
) {
  const algorithmId = algorithmSlug || `problem-${problemId}` || `algorithm-${Date.now()}`
  const title = algorithmSlug ? algorithmSlug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : 'Algorithm Solution'

  return `# ${title} Algorithm

## Basic Information
- **ID**: ${algorithmId}
- **Title**: ${title}
- **Description**: Algorithm implementation solution
- **Difficulty**: Medium
- **Category**: Algorithm
- **Time Complexity**: O(n)
- **Space Complexity**: O(1)
- **Popularity**: 50
- **Estimated Time**: 30 min
- **Real World Use**: General algorithm applications

## Problem Statement
Implement the algorithm solution as shown in the provided code.

## Examples

### Example 1
\`\`\`
Input: Sample input
Output: Sample output
Explanation: Algorithm execution result
\`\`\`

## Analogy

### Title: Algorithm Problem Solving

**Content**: This algorithm demonstrates systematic problem-solving approaches in computer science, breaking down complex computational challenges into manageable steps that can be efficiently executed by computers.

**Visual Aid**: Think of it as a well-designed assembly line where each step contributes to the final product through coordinated operations.

## Key Insights
- Understand the problem requirements thoroughly
- Choose appropriate data structures and algorithms
- Consider time and space complexity trade-offs
- Test with various input scenarios

## Real World Applications

### Software Development
**Application**: Problem Solving
**Description**: Core algorithmic thinking and implementation skills

## Engineering Lessons

### Algorithm Design
**Lesson**: Systematic approach to solving computational problems
**Application**: Apply structured thinking to complex software challenges

## Implementations

### Optimized Solution
\`\`\`javascript
${code}
\`\`\`
**Time Complexity**: O(n)
**Space Complexity**: O(1)
**Explanation**: Efficient algorithm implementation
**When to Use**: General purpose use cases

## Animation States (Step-by-Step Visualization)

### D3 Animation States

#### Step 1: Initialization
**Title**: Setup Phase
**Description**: Initialize data structures and variables
**D3 Data**:
\`\`\`json
{
  "type": "initialization",
  "status": "ready"
}
\`\`\`

#### Step 2: Processing
**Title**: Main Algorithm
**Description**: Execute core algorithm logic
**D3 Data**:
\`\`\`json
{
  "type": "processing",
  "status": "running"
}
\`\`\`

#### Step 3: Completion
**Title**: Final Result
**Description**: Algorithm execution completed
**D3 Data**:
\`\`\`json
{
  "type": "complete",
  "status": "finished"
}
\`\`\`

### React Flow Animation States

#### Step 1: Start
**Title**: Begin Process
**Description**: Initialize the algorithm flow
**React Flow Data**:
\`\`\`json
{
  "nodes": [
    {
      "id": "start",
      "type": "input",
      "data": {"label": "Start"},
      "position": {"x": 250, "y": 25}
    }
  ],
  "edges": []
}
\`\`\`

### Three.js Animation States

#### Step 1: Setup
**Title**: 3D Visualization
**Description**: Initialize 3D scene
**Three.js Data**:
\`\`\`json
{
  "type": "setup",
  "status": "initialized"
}
\`\`\`

## Educational Content

### Common Mistakes
- Missing edge case handling
- Incorrect complexity analysis
- Poor variable naming
- Insufficient testing

### Optimization Tips
- Choose appropriate data structures
- Consider memory usage patterns
- Optimize for specific constraints
- Profile performance bottlenecks

### Interview Tips
- Explain your thought process clearly
- Discuss time and space complexity
- Consider edge cases and constraints
- Ask clarifying questions

## Testing Scenarios

### Normal Cases
**Scenario**: Standard input
**Input**: Regular test case
**Expected Output**: Correct result
**Edge Case**: false

## Performance Analysis

### Average Case: O(n)
- Linear time complexity for typical inputs
- Efficient for most practical use cases

### Space Complexity: O(1)
- Constant space usage
- Memory efficient implementation

### Scalability
- Performs well with increasing input sizes
- Suitable for large-scale applications

## Code Quality Metrics

### Readability: 7/10
- Clear code structure with good naming

### Efficiency: 8/10
- Good algorithmic efficiency

### Maintainability: 7/10
- Well-structured and documented

### Documentation: 6/10
- Basic documentation provided

### Testability: 8/10
- Easy to test with various inputs

### Best Practices
- Follow consistent coding style
- Use meaningful variable names
- Add proper error handling
- Include comprehensive tests

## Related Algorithms

### Similar Problems
**Similarity**: Related algorithmic challenges
**When to Use**: When solving similar computational problems
`
}
