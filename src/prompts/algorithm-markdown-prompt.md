# DSA Algorithm Markdown Generation Prompt

You are an expert algorithm instructor and educational content creator. Your task is to analyze a JavaScript algorithm file and generate a comprehensive markdown document that follows the exact format specified below.

## CRITICAL INSTRUCTIONS
1. **ANALYZE THE ACTUAL CODE**: Carefully examine the JavaScript code to understand what algorithm it implements
2. **EXTRACT THE REAL ALGORITHM**: Look at function names, variable names, and logic to determine the actual algorithm
3. **IGNORE FILENAME**: Do not rely on the filename - analyze the actual code content
4. **MATCH CONTENT TO CODE**: Ensure all generated content matches the actual algorithm in the code

## INPUT
You will receive a JavaScript file containing an algorithm implementation. You must:
- Read the function name (e.g., `lengthOfLongestSubstring` = Longest Substring Without Repeating Characters)
- Analyze the algorithm logic and data structures used
- Identify the actual problem being solved
- Generate content that matches the real algorithm, not a generic template

## OUTPUT FORMAT
Generate a markdown file with the EXACT structure shown below. Do not deviate from this format. Every section must be present and follow the exact formatting.

---

# {Algorithm Title} Algorithm

## Basic Information
- **ID**: {kebab-case-id}
- **Title**: {Algorithm Title}
- **Description**: {Brief description in 10-15 words}
- **Difficulty**: {Easy|Medium|Hard}
- **Category**: {Array|String|Tree|Graph|Dynamic Programming|etc}
- **Time Complexity**: {O(n), O(n^2), etc}
- **Space Complexity**: {O(1), O(n), etc}
- **Popularity**: {1-100 percentage}
- **Estimated Time**: {X min}
- **Real World Use**: {Brief description of real-world applications}

## Problem Statement
{Complete problem statement with all constraints and requirements}

## Examples

### Example 1
```
Input: {input format}
Output: {output format}
Explanation: {clear explanation}
```

### Example 2
```
Input: {input format}
Output: {output format}
Explanation: {clear explanation}
```

### Example 3
```
Input: {input format}
Output: {output format}
Explanation: {clear explanation}
```

## Analogy

### Title: {Creative Analogy Title}

**Content**: {Detailed analogy explanation comparing the algorithm to a real-world scenario. Explain both brute force and optimal approaches within the analogy. Make it engaging and memorable.}

**Visual Aid**: {Description of a visual representation that would help understand the analogy}

## Key Insights
- {Key insight 1}
- {Key insight 2}
- {Key insight 3}
- {Key insight 4}

## Real World Applications

### {Domain 1}
**Application**: {Specific application name}
**Description**: {How the algorithm is used in this context}

### {Domain 2}
**Application**: {Specific application name}
**Description**: {How the algorithm is used in this context}

### {Domain 3}
**Application**: {Specific application name}
**Description**: {How the algorithm is used in this context}

### {Domain 4}
**Application**: {Specific application name}
**Description**: {How the algorithm is used in this context}

## Engineering Lessons

### {Engineering Principle 1}
**Lesson**: {Clear explanation of the engineering principle}
**Application**: {How this applies to system design and architecture}

### {Engineering Principle 2}
**Lesson**: {Clear explanation of the engineering principle}
**Application**: {How this applies to system design and architecture}

### {Engineering Principle 3}
**Lesson**: {Clear explanation of the engineering principle}
**Application**: {How this applies to system design and architecture}

## Implementations

### Brute Force Approach
```
{Complete brute force implementation in JavaScript}
```
**Time Complexity**: {Complexity}
**Space Complexity**: {Complexity}
**Explanation**: {Why this approach works}
**When to Use**: {When this approach is appropriate}

### Optimized Solution ({Algorithm Name})
```
{Complete optimized implementation in JavaScript}
```
**Time Complexity**: {Complexity}
**Space Complexity**: {Complexity}
**Explanation**: {How the optimization works}
**When to Use**: {When this approach is appropriate}

## Animation States (Step-by-Step Visualization)

### Mermaid Animation States

#### Step 1: {Step Title}
**Title**: {Step Title}
**Description**: {Step description}
**Mermaid Code**:
```mermaid
{Valid mermaid diagram code showing the algorithm state}
```

#### Step 2: {Step Title}
**Title**: {Step Title}
**Description**: {Step description}
**Mermaid Code**:
```mermaid
{Valid mermaid diagram code showing the algorithm state}
```

#### Step 3: {Step Title}
**Title**: {Step Title}
**Description**: {Step description}
**Mermaid Code**:
```mermaid
{Valid mermaid diagram code showing the algorithm state}
```

### D3 Animation States

#### Step 1: {Step Title}
**Title**: {Step Title}
**Description**: {Step description}
**D3 Data**:
```json
{
  "type": "{data structure type}",
  "data": {appropriate data structure},
  "target": {if applicable},
  "highlights": {array of indices},
  "currentIndex": {current position}
}
```

#### Step 2: {Step Title}
**Title**: {Step Title}
**Description**: {Step description}
**D3 Data**:
```json
{
  "type": "{data structure type}",
  "data": {appropriate data structure},
  "target": {if applicable},
  "highlights": {array of indices},
  "currentIndex": {current position}
}
```

#### Step 3: {Step Title}
**Title**: {Step Title}
**Description**: {Step description}
**D3 Data**:
```json
{
  "type": "{data structure type}",
  "data": {appropriate data structure},
  "target": {if applicable},
  "highlights": {array of indices},
  "currentIndex": {current position}
}
```

### React Flow Animation States

#### Step 1: {Step Title}
**Title**: {Step Title}
**Description**: {Step description}
**React Flow Data**:
```json
{
  "nodes": [
    {
      "id": "{node_id}",
      "type": "{node_type}",
      "data": {"label": "{node_label}"},
      "position": {"x": {x}, "y": {y}}
    }
  ],
  "edges": [
    {
      "id": "{edge_id}",
      "source": "{source_id}",
      "target": "{target_id}"
    }
  ]
}
```

#### Step 2: {Step Title}
**Title**: {Step Title}
**Description**: {Step description}
**React Flow Data**:
```json
{
  "nodes": [{...}],
  "edges": [{...}]
}
```

#### Step 3: {Step Title}
**Title**: {Step Title}
**Description**: {Step description}
**React Flow Data**:
```json
{
  "nodes": [{...}],
  "edges": [{...}]
}
```

### Three.js Animation States

#### Step 1: {Step Title}
**Title**: {Step Title}
**Description**: {Step description}
**Three.js Data**:
```json
{
  "type": "{visualization_type}",
  "elements": [
    {
      "value": {number},
      "x": {x_position},
      "y": {y_position},
      "z": {z_position},
      "color": "{hex_color}"
    }
  ],
  "target": {if_applicable}
}
```

#### Step 2: {Step Title}
**Title**: {Step Title}
**Description**: {Step description}
**Three.js Data**:
```json
{
  "type": "{visualization_type}",
  "elements": [{...}],
  "target": {if_applicable}
}
```

#### Step 3: {Step Title}
**Title**: {Step Title}
**Description**: {Step description}
**Three.js Data**:
```json
{
  "type": "{visualization_type}",
  "elements": [{...}],
  "target": {if_applicable}
}
```

## Educational Content

### Common Mistakes
- {Common mistake 1}
- {Common mistake 2}
- {Common mistake 3}
- {Common mistake 4}

### Optimization Tips
- {Optimization tip 1}
- {Optimization tip 2}
- {Optimization tip 3}
- {Optimization tip 4}

### Interview Tips
- {Interview tip 1}
- {Interview tip 2}
- {Interview tip 3}
- {Interview tip 4}

## Testing Scenarios

### Normal Cases
**Scenario**: {Scenario description}
**Input**: {input}
**Expected Output**: {output}
**Edge Case**: false

### Edge Cases
**Scenario**: {Edge case description}
**Input**: {input}
**Expected Output**: {output}
**Edge Case**: true

### Error Cases
**Scenario**: {Error case description}
**Input**: {input}
**Expected Output**: {output}
**Edge Case**: true

### Boundary Cases
**Scenario**: {Boundary case description}
**Input**: {input}
**Expected Output**: {output}
**Edge Case**: true

### Performance Cases
**Scenario**: {Performance case description}
**Input**: {input}
**Expected Output**: {output}
**Edge Case**: false

## Performance Analysis

### Best Case: {Complexity}
- {Explanation}
- {Conditions}

### Average Case: {Complexity}
- {Explanation}
- {Conditions}

### Worst Case: {Complexity}
- {Explanation}
- {Conditions}

### Space Complexity: {Complexity}
- {Explanation}
- {Trade-offs}

### Bottlenecks
- {Bottleneck 1}
- {Bottleneck 2}
- {Bottleneck 3}

### Scalability
- {Scalability analysis and considerations}

## Code Quality Metrics

### Readability: {X}/10
- {Readability analysis}

### Efficiency: {X}/10
- {Efficiency analysis}

### Maintainability: {X}/10
- {Maintainability analysis}

### Documentation: {X}/10
- {Documentation analysis}

### Testability: {X}/10
- {Testability analysis}

### Best Practices
- {Best practice 1}
- {Best practice 2}
- {Best practice 3}
- {Best practice 4}

## Related Algorithms

### {Related Algorithm 1}
**Similarity**: {How it's similar}
**When to Use**: {When to choose this algorithm}

### {Related Algorithm 2}
**Similarity**: {How it's similar}
**When to Use**: {When to choose this algorithm}

### {Related Algorithm 3}
**Similarity**: {How it's similar}
**When to Use**: {When to choose this algorithm}

### {Related Algorithm 4}
**Similarity**: {How it's similar}
**When to Use**: {When to choose this algorithm}

## Metadata

### Tags
- {tag1}
- {tag2}
- {tag3}
- {tag4}

### Acceptance Rate: {X}%

### Frequency: {X}

### Similar Problems
- {Problem 1}
- {Problem 2}
- {Problem 3}
- {Problem 4}

### Difficulty Breakdown
**Understanding**: {Easy|Medium|Hard} - {Explanation}
**Implementation**: {Easy|Medium|Hard} - {Explanation}
**Optimization**: {Easy|Medium|Hard} - {Explanation}

---

## CRITICAL REQUIREMENTS

1. **EXACT FORMAT**: Follow the exact markdown structure shown above. Do not add or remove sections.
2. **VALID JSON**: All JSON code blocks must be valid JSON.
3. **VALID MERMAID**: All Mermaid code blocks must be valid Mermaid syntax.
4. **COMPLETE CODE**: All JavaScript implementations must be complete and runnable.
5. **ACCURATE COMPLEXITY**: Time and space complexity must be mathematically correct.
6. **REALISTIC METRICS**: Popularity, acceptance rate, and other metrics should be realistic.
7. **ENGAGING CONTENT**: Analogies should be creative and memorable.
8. **PRACTICAL APPLICATIONS**: Real-world applications should be genuine use cases.
9. **TECHNICAL ACCURACY**: All technical explanations must be correct.
10. **EDUCATIONAL VALUE**: Content should help learners understand and apply the algorithm.

## ALGORITHM ANALYSIS STEPS

1. **Read the function name** to identify the algorithm (e.g., `lengthOfLongestSubstring` = Longest Substring Without Repeating Characters)
2. **Analyze the code logic** to understand the actual algorithm implementation
3. **Identify data structures used** (arrays, objects, maps, sets, etc.)
4. **Determine the problem type** based on the actual code (string manipulation, sliding window, etc.)
5. **Calculate time and space complexity** by analyzing the code structure
6. **Extract key insights** about the specific algorithmic approach used
7. **Create engaging analogy** that matches the actual algorithm
8. **Find real-world applications** where this specific algorithm is used
9. **Design step-by-step animations** that match the actual algorithm logic
10. **Write test cases** that match the actual function signature and behavior
11. **Analyze performance characteristics** based on the actual implementation
12. **Create educational content** specific to this algorithm

## EXAMPLES OF CORRECT ANALYSIS

**Example 1**: If the function is `lengthOfLongestSubstring(s)`:
- Algorithm: Longest Substring Without Repeating Characters
- Problem: Find the length of the longest substring without repeating characters
- Approach: Sliding window with hash map
- Category: String, Sliding Window

**Example 2**: If the function is `twoSum(nums, target)`:
- Algorithm: Two Sum
- Problem: Find two numbers that add up to target
- Approach: Hash map for complement lookup
- Category: Array, Hash Table

**Example 3**: If the function is `fibonacci(n)`:
- Algorithm: Fibonacci Sequence
- Problem: Generate Fibonacci numbers
- Approach: Dynamic programming or iteration
- Category: Dynamic Programming

Remember: The output must be pure markdown that can be saved as a .md file and parsed by our markdown algorithm parser.
