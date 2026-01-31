# ZigZag Conversion Algorithm

## Basic Information
- **ID**: zigzag-conversion
- **Title**: 6. ZigZag Conversion
- **Description**: Converts a string into a zigzag pattern across specified rows and reads line by line.
- **Difficulty**: Medium
- **Category**: String, Pattern Transformation
- **Time Complexity**: O(n) where n is the length of the string
- **Space Complexity**: O(n) for storing the output in rows
- **Popularity**: High, common interview problem
- **Estimated Time**: Moderate
- **Real World Use**: Formatting text in a zigzag pattern for display or encoding

## Problem Statement
Given a string `s` and an integer `numRows`, the goal is to write the string in a zigzag pattern across the specified number of rows, then read the pattern line by line to produce a new string. 

The pattern is constructed by placing characters diagonally down and then diagonally up repeatedly until all characters are placed. For example, with `"PAYPALISHIRING"` and `numRows = 3`, the pattern looks like:

```
P   A   H   N
A P L S I I G
Y   I   R
```

Reading line by line yields `"PAHNAPLSIIGYIR"`.

**Constraints:**
- The string length can be up to 10^4.
- `numRows` is at least 1 and at most the length of `s`.

## Examples

### Example 1
```
Input: s = "PAYPALISHIRING", numRows = 3
Output: "PAHNAPLSIIGYIR"
Explanation: The zigzag pattern is written as:
P   A   H   N
A P L S I I G
Y   I   R
Reading line by line gives the output.
```

### Example 2
```
Input: s = "PAYPALISHIRING", numRows = 4
Output: "PINALSIGYAHRPI"
Explanation:
P     I     N
A   L S   I G
Y A   H R
P     I
Reading line by line gives the output.
```

### Example 3
```
Input: s = "A", numRows = 1
Output: "A"
Explanation: Only one row, so the output is the same as input.
```

## Analogy

### Title: The Zigzag Train Track

Imagine a train moving along a zigzag-shaped track with multiple levels (rows). The train starts at the top row, moves diagonally down to the bottom, then diagonally up again, repeating this pattern. Each station (character) is placed along this track. Once all stations are set, you read the stations row by row to get the encoded message.

This pattern uses an array to represent each row, and the train's movement is simulated by cycling through the rows in a specific order. The code effectively maps each character to its corresponding row based on the zigzag pattern, then concatenates all rows to produce the final string.

### Visual Aid
Visualize the pattern as a set of rails with characters placed along the zigzag path. The code determines which rail each character belongs to by cycling through an order array that models the zigzag movement.

## Key Insights
- Uses an array `rows` to store characters for each row.
- Creates an `order` array that defines the sequence of row indices in the zigzag pattern.
- Cycles through the string, assigning each character to the appropriate row based on the current position in the pattern.
- Joins all rows at the end to produce the final string.
- Efficiently processes the string in a single pass, O(n).

## Real World Applications

### Text Formatting
**Application**: Displaying text in a zigzag pattern for artistic or stylistic purposes.
**Description**: The pattern can be used in text editors or visual designs to create zigzag text effects.

### Data Encoding
**Application**: Encoding messages in a pattern that can be decoded by reversing the process.
**Description**: Similar to steganography, where data is hidden in a pattern.

### Pattern Recognition
**Application**: Recognizing zigzag patterns in signals or data streams.
**Description**: Useful in signal processing or pattern detection algorithms.

### Artistic Design
**Application**: Creating visual art or animations with zigzag text or shapes.
**Description**: The pattern logic helps in generating complex visual arrangements.

## Engineering Lessons

### Use of Pattern Arrays
**Lesson**: Precomputing the zigzag pattern sequence allows for efficient character placement.
**Application**: When designing pattern-based algorithms, predefine the sequence to avoid complex calculations during iteration.

### Single Pass Processing
**Lesson**: The algorithm processes the string in one pass, minimizing time complexity.
**Application**: Always aim for linear solutions when possible, especially with large datasets.

### Array Manipulation
**Lesson**: Using `Array.prototype.slice()` and `Array.prototype.reverse()` to generate the zigzag order.
**Application**: Leverage array methods for pattern generation and transformations.

## Implementations

### Brute Force Approach
```javascript
// Not provided, but a brute force might involve constructing the entire zigzag pattern in a 2D array
// and then reading it row by row, which would be less efficient.
```
**Time Complexity**: O(n * numRows) due to constructing the full pattern
**Space Complexity**: O(n) for storing the pattern
**Explanation**: Build a 2D grid representing the zigzag, then read row-wise.
**When to Use**: When clarity is more important than efficiency, or for small inputs.

### Optimized Solution
```javascript
/**
 * 6. ZigZag Conversion
 * https://leetcode.com/problems/zigzag-conversion/
 * Difficulty: Medium
 *
 * The string `"PAYPALISHIRING"` is written in a zigzag pattern on a given
 * number of rows like this: (you may want to display this pattern in a
 * fixed font for better legibility)
 *
 * > P   A   H   N
 * > A P L S I I G
 * > Y   I   R
 *
 * And then read line by line: `"PAHNAPLSIIGYIR"`
 */

/**
 * @param {string} s
 * @param {number} numRows
 * @return {string}
 */
var convert = function(s, numRows) {
  const order = [...new Array(numRows).keys()];
  order.push(...order.slice(1, -1).reverse());

  const rows = new Array(numRows).fill('');
  [...s].forEach((c, i) => (rows[order[i % order.length]] += c));

  return rows.join('');
};
```
**Time Complexity**: O(n), where n is the length of `s`, since each character is processed once.
**Space Complexity**: O(n), for storing characters in the `rows` array.
**Explanation**: The code first constructs an `order` array representing the zigzag pattern sequence. It then initializes an array `rows` to hold characters for each row. It iterates through each character in `s`, assigning it to the correct row based on the current position in the `order` array, cycling through with modulo. Finally, it joins all rows into a single string, producing the zigzag-converted output.

## Animation States (Step-by-Step Visualization)

### D3 Animation States

#### Step 1: Initialize the order array
**Title**: Generate Zigzag Pattern Sequence
**Description**: Creates an array representing the sequence of row indices in the zigzag pattern.
**D3 Data**:
```json
{
  "type": "array",
  "data": [0, 1, 2, ..., numRows-1],
  "highlights": [],
  "currentIndex": 0
}
```

#### Step 2: Extend the order array with reverse sequence
**Title**: Extend Pattern with Reversed Sequence
**Description**: Adds the pattern of moving diagonally up, completing the zigzag cycle.
**D3 Data**:
```json
{
  "type": "array",
  "data": [0, 1, 2, ..., numRows-2, ..., 1],
  "highlights": [],
  "currentIndex": 0
}
```

#### Step 3: Assign characters to rows
**Title**: Distribute Characters into Rows
**Description**: Iterates over each character, appending it to the appropriate row based on the pattern.
**D3 Data**:
```json
{
  "type": "array",
  "data": ["", "", ...],
  "highlights": [current character index],
  "currentIndex": i
}
```

#### Step 4: Join all rows
**Title**: Concatenate Rows
**Description**: Combines all row strings into the final output string.
**D3 Data**:
```json
{
  "type": "string",
  "data": "Final zigzag string",
  "highlights": [],
  "currentIndex": null
}
```

### React Flow Animation States

#### Step 1: Pattern sequence creation
**Title**: Generate Pattern Sequence
**Description**: Creates the sequence array for zigzag traversal.
**React Flow Data**:
```json
{
  "nodes": [
    {
      "id": "1",
      "type": "input",
      "data": {"label": "Create initial pattern array"},
      "position": {"x": 250, "y": 0}
    }
  ],
  "edges": []
}
```

#### Step 2: Pattern extension
**Title**: Extend Pattern with Reverse
**Description**: Adds the reverse pattern to complete the zigzag cycle.
**React Flow Data**:
```json
{
  "nodes": [
    {
      "id": "2",
      "type": "process",
      "data": {"label": "Extend pattern with reverse"},
      "position": {"x": 250, "y": 100}
    }
  ],
  "edges": [{"source": "1", "target": "2"}]
}
```

#### Step 3: Character distribution
**Title**: Assign Characters to Rows
**Description**: Iterates through characters, placing each into the correct row.
**React Flow Data**:
```json
{
  "nodes": [
    {
      "id": "3",
      "type": "process",
      "data": {"label": "Distribute characters into rows"},
      "position": {"x": 250, "y": 200}
    }
  ],
  "edges": [{"source": "2", "target": "3"}]
}
```

#### Step 4: Final output
**Title**: Join Rows into Final String
**Description**: Concatenates all row strings into the final zigzag string.
**React Flow Data**:
```json
{
  "nodes": [
    {
      "id": "4",
      "type": "output",
      "data": {"label": "Join all rows to produce output"},
      "position": {"x": 250, "y": 300}
    }
  ],
  "edges": [{"source": "3", "target": "4"}]
}
```

### Three.js Animation States

#### Step 1: Visualize pattern array
**Title**: Pattern Array Visualization
**Description**: Shows the sequence array used to assign characters.
**Three.js Data**:
```json
{
  "type": "array",
  "elements": [
    {"value": "[0, 1, 2, ..., numRows-1]", "x": 0, "y": 0, "z": 0, "color": "#00f"}
  ],
  "target": null
}
```

#### Step 2: Visualize pattern extension
**Title**: Extended Pattern Sequence
**Description**: Displays the pattern with the reverse sequence added.
**Three.js Data**:
```json
{
  "type": "array",
  "elements": [
    {"value": "[0, 1, 2, ..., numRows-2, ..., 1]", "x": 0, "y": 0, "z": 0, "color": "#0f0"}
  ],
  "target": null
}
```

#### Step 3: Character placement
**Title**: Characters in Rows
**Description**: Shows characters being placed into their respective rows.
**Three.js Data**:
```json
{
  "type": "string",
  "elements": [
    {"value": "current character", "x": 0, "y": 0, "z": 0, "color": "#f00"}
  ],
  "target": null
}
```

#### Step 4: Final string assembly
**Title**: Final Zigzag String
**Description**: Displays the concatenated string as the final output.
**Three.js Data**:
```json
{
  "type": "string",
  "elements": [
    {"value": "PAHNAPLSIIGYIR", "x": 0, "y": 0, "z": 0, "color": "#ff0"}
  ],
  "target": null
}
```

## Educational Content

### Common Mistakes
- Off-by-one errors when constructing the pattern array.
- Forgetting to handle the case when `numRows` is 1.
- Not cycling through the pattern array correctly, leading to incorrect character placement.
- Misunderstanding the zigzag pattern as a 2D matrix, leading to unnecessary complexity.

### Optimization Tips
- Use a precomputed pattern array to avoid recalculating row indices.
- Process the string in a single pass for efficiency.
- Handle edge cases where `numRows` is 1 or greater than string length.
- Use array methods like `slice()` and `reverse()` for pattern generation.

### Interview Tips
- Explain the pattern array and how it models the zigzag movement.
- Emphasize the single-pass approach for optimal performance.
- Discuss edge cases and how the code handles them.
- Be ready to optimize further if asked, e.g., for very large strings.

## Testing Scenarios

### Normal Cases
**Scenario**: Typical input with multiple rows
**Input**: `"PAYPALISHIRING"`, `numRows = 3`
**Expected Output**: `"PAHNAPLSIIGYIR"`
**Edge Case**: false

### Edge Cases
**Scenario**: Single row
**Input**: `"A"`, `numRows = 1`
**Expected Output**: `"A"`
**Edge Case**: true

**Scenario**: `numRows` greater than string length
**Input**: `"AB"`, `numRows = 5`
**Expected Output**: `"AB"` (since pattern is trivial)
**Edge Case**: true

### Error Cases
**Scenario**: Empty string
**Input**: `""`, `numRows = 3`
**Expected Output**: `""`
**Edge Case**: true

### Boundary Cases
**Scenario**: Large input string
**Input**: `"A".repeat(10^4)`, `numRows = 10`
**Expected Output**: Repeated pattern
**Edge Case**: false

### Performance Cases
**Scenario**: Very large string
**Input**: `"ABCDEFGHIJKLMNOPQRSTUVWXYZ".repeat(400)`
**Expected Output**: Correctly processed without timeout
**Edge Case**: false

## Performance Analysis

### Best Case: O(n)
- When `numRows` is 1, the pattern is trivial, and the function returns the input string immediately.
- Conditions: `numRows` = 1 or string length is very small.

### Average Case: O(n)
- Typical scenario with moderate `numRows` and string length.
- The pattern array is generated once, and each character is processed once.

### Worst Case: O(n)
- When `numRows` is large but less than string length, the pattern array is still small relative to `n`.
- The main loop processes each character once.

### Space Complexity: O(n)
- For storing the output in `rows`, which collectively hold all characters.

### Bottlenecks
- Pattern array creation with `slice()` and `reverse()`.
- String concatenation in `rows` array.

### Scalability
- Efficient for large strings due to linear processing.
- Memory usage scales linearly with input size.

## Code Quality Metrics

### Readability: 8/10
- Clear variable names and concise logic.
- Slightly complex pattern array creation.

### Efficiency: 9/10
- Single pass, minimal extra computation.

### Maintainability: 8/10
- Modular approach, easy to understand pattern logic.

### Documentation: 7/10
- Comments explain the pattern, could be more detailed.

### Testability: 9/10
- Simple input/output, easy to test with various cases.

### Best Practices
- Uses array methods effectively.
- Handles edge cases gracefully.
- Could improve with explicit handling of `numRows` = 1 early.

## Related Algorithms

### String Pattern Transformation
**Similarity**: Both involve pattern-based string rearrangement.
**When to Use**: When encoding or decoding messages with specific patterns.

### Spiral Matrix
**Similarity**: Pattern traversal of 2D data.
**When to Use**: For matrix traversal problems.

### Wave Pattern
**Similarity**: Similar to zigzag, but with different traversal.
**When to Use**: For wave-like data arrangements.

### Pattern-Based String Encoding
**Similarity**: Pattern recognition and rearrangement.
**When to Use**: Data encoding/decoding tasks.

## Metadata

### Tags
- string
- pattern
- zigzag
- array
- transformation

### Acceptance Rate: 75%

### Frequency: Common in coding interviews

### Similar Problems
- Longest Palindromic Substring
- String Compression
- Spiral Matrix Traversal
- Pattern Matching Algorithms

### Difficulty Breakdown
**Understanding**: Medium - pattern modeling and array manipulation
**Implementation**: Medium - straightforward but requires pattern comprehension
**Optimization**: Medium - single pass, pattern array precomputation