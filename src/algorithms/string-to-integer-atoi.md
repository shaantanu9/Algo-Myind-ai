# String to Integer (atoi) Algorithm

## Basic Information
- **ID**: string-to-integer-atoi
- **Title**: String to Integer (atoi)
- **Description**: Converts a string to a 32-bit signed integer following specific parsing rules.
- **Difficulty**: Medium
- **Category**: String
- **Time Complexity**: O(n) where n is the length of the input string
- **Space Complexity**: O(1)
- **Popularity**: High, common in input parsing scenarios
- **Estimated Time**: Moderate
- **Real World Use**: Parsing user input, command-line arguments, or data serialization/deserialization

## Problem Statement
Implement the `myAtoi(s)` function, which converts a string `s` into a 32-bit signed integer. The function should follow these steps:
- Ignore any leading whitespace characters.
- Check if the next character is '-' or '+', which determines the sign of the number.
- Read subsequent digits until a non-digit character or the end of the string is encountered.
- Convert the read digits into an integer, applying the sign.
- Clamp the result within the 32-bit signed integer range `[-2^31, 2^31 - 1]`.
- Return the final integer.

Constraints:
- The input string may contain invalid characters, which should be ignored after the number.
- If no valid digits are found, return 0.

## Examples

### Example 1
```
Input: "   -42"
Output: -42
Explanation: Leading spaces are ignored, '-' indicates negative, digits are parsed until non-digit.
```

### Example 2
```
Input: "4193 with words"
Output: 4193
Explanation: Digits are parsed until a non-digit character is encountered.
```

### Example 3
```
Input: "0032"
Output: 32
Explanation: Leading zeros are ignored in the conversion.
```

## Analogy

### Title: Climbing a Mountain with Signposts

**Content**: Imagine you're climbing a mountain trail marked with signposts. You start at the trailhead, ignoring any initial distractions (whitespace). When you see a signpost indicating "minus" or "plus," you note the sign to determine whether you'll descend or ascend. As you walk along, you read the numbers on the signs, but only until you encounter a non-numeric symbol or the trail ends. You then interpret these numbers as your elevation change, adjusting for the sign. If your calculated elevation exceeds the maximum or minimum allowed (clamped to safe limits), you adjust accordingly. This process ensures you accurately determine your final elevation change based on the trail signs.

**Visual Aid**: A path with signposts showing signs like "+123", "-45", and "abc" where only the numeric parts are considered, with signs indicating direction.

## Key Insights
- Uses string trimming and regex matching for initial parsing.
- Handles optional sign characters ('-' or '+') at the start.
- Extracts only the leading digits following the sign.
- Converts the string of digits into a number, applying sign.
- Clamps the number within 32-bit signed integer bounds.
- Efficiently handles invalid inputs and edge cases with minimal overhead.

## Real World Applications

### Input Validation
**Application**: Converting user input strings into integers for form validation.
**Description**: Ensures that only valid numeric input is processed, with bounds checking.

### Command Line Parsing
**Application**: Parsing command-line arguments that specify numeric options.
**Description**: Extracts and validates numeric parameters from strings.

### Data Serialization
**Application**: Reading numeric data from text files or network streams.
**Description**: Converts string data into integers with safety bounds.

### Configuration Parsing
**Application**: Reading configuration files where numeric values are stored as strings.
**Description**: Safely converts string values into integers with validation.

## Engineering Lessons

### Principle 1: Input Sanitization
**Lesson**: Always trim and sanitize input before processing.
**Application**: Prevents errors caused by unexpected whitespace or invalid characters.

### Principle 2: Regular Expression Usage
**Lesson**: Use regex to efficiently extract patterns from strings.
**Application**: Simplifies parsing logic and reduces manual iteration.

### Principle 3: Boundary Handling
**Lesson**: Always clamp or validate output to prevent overflow.
**Application**: Ensures robustness in systems with fixed data ranges.

## Implementations

### Brute Force Approach
```javascript
// Manual character-by-character parsing without regex
var myAtoiBruteForce = function(s) {
  let i = 0, n = s.length, sign = 1, result = 0;
  // Skip whitespace
  while (i < n && s[i] === ' ') i++;
  // Check sign
  if (i < n && (s[i] === '-' || s[i] === '+')) {
    sign = s[i] === '-' ? -1 : 1;
    i++;
  }
  // Parse digits
  while (i < n && s[i] >= '0' && s[i] <= '9') {
    const digit = s[i] - '0';
    if (result > Math.floor((2**31 - 1 - digit) / 10)) {
      return sign === 1 ? 2**31 - 1 : -(2**31);
    }
    result = result * 10 + digit;
    i++;
  }
  return result * sign;
}
```
**Time Complexity**: O(n)  
**Space Complexity**: O(1)  
**Explanation**: Processes each character manually, handling sign and digits, with overflow checks.  
**When to Use**: When regex is unavailable or for more control over parsing.

### Optimized Solution
```javascript
/**
 * 8. String to Integer (atoi)
 * https://leetcode.com/problems/string-to-integer-atoi/
 * Difficulty: Medium
 *
 * Implement the myAtoi(string s) function, which converts a string to a
 * 32-bit signed integer (similar to C/C++'s atoi function).
 *
 * The algorithm for myAtoi(string s) is as follows:
 *
 * - Read in and ignore any leading whitespace.
 * - Check if the next character (if not already at the end of the string)
 *   is '-' or '+'. Read this character in if it is either. This determines
 *   if the final result is negative or positive respectively.
 *   Assume the result is positive if neither is present.
 * - Read in next the characters until the next non-digit charcter or the end
 *   of the input is reached. The rest of the string is ignored.
 * - Convert these digits into an integer (i.e. "123" -> 123, "0032" -> 32).
 *   If no digits were read, then the integer is 0. Change the sign as
 *   necessary (from step 2).
 * - If the integer is out of the 32-bit signed integer range [-231, 231 - 1],
 *   then clamp the integer so that it remains in the range. Specifically,
 *   integers less than -231 should be clamped to -231, and integers greater
 *   than 231 - 1 should be clamped to 231 - 1.
 * - Return the integer as the final result.
 */

/**
 * @param {string} s
 * @return {number}
 */
var myAtoi = function(s) {
  const parsed = +(s.trim().match(/^[-+]?\d+/g) || [0])[0];
  const clamped = Math.min(Math.max(parsed, (-2)**31), 2**31 - 1);

  return clamped;
};
```
**Time Complexity**: O(n) — regex matching and trimming each at most once.  
**Space Complexity**: O(1) — only a few variables used.  
**Explanation**:  
- `s.trim()` removes leading/trailing whitespace.  
- `.match(/^[-+]?\d+/g)` extracts the optional sign and subsequent digits at the start of the string.  
- If no match, defaults to `[0]`.  
- The unary `+` converts the matched string to a number.  
- `Math.min(Math.max(parsed, (-2)**31), 2**31 - 1)` clamps the value within 32-bit signed integer bounds.  
- Returns the final clamped integer.

## Animation States (Step-by-Step Visualization)

### D3 Animation States

#### Step 1: Trimming whitespace
**Title**: Remove Leading and Trailing Spaces  
**Description**: The function trims the input string to ignore whitespace at the start and end.  
**D3 Data**:
```json
{
  "type": "string",
  "data": "   -42",
  "highlights": [0, 1, 2],
  "currentIndex": 3
}
```

#### Step 2: Regex matching for sign and digits
**Title**: Extract Sign and Digits  
**Description**: Uses regex to match optional sign and subsequent digits from the start of the trimmed string.  
**D3 Data**:
```json
{
  "type": "array",
  "data": ["-42"],
  "highlights": [0],
  "currentIndex": 1
}
```

#### Step 3: Convert to number and clamp
**Title**: Convert and Clamp  
**Description**: Converts the matched string to a number and clamps it within 32-bit bounds.  
**D3 Data**:
```json
{
  "type": "number",
  "data": -42,
  "highlights": [],
  "currentIndex": 2
}
```

### React Flow Animation States

#### Step 1: Input string
**Title**: Initial Input  
**Description**: The raw input string is processed.  
**React Flow Data**:
```json
{
  "nodes": [
    {
      "id": "1",
      "type": "input",
      "data": {"label": "   -42"},
      "position": {"x": 250, "y": 0}
    }
  ],
  "edges": []
}
```

#### Step 2: After trimming
**Title**: Trimmed String  
**Description**: The string becomes "-42" after trimming whitespace.  
**React Flow Data**:
```json
{
  "nodes": [
    {
      "id": "1",
      "type": "input",
      "data": {"label": "-42"},
      "position": {"x": 250, "y": 0}
    }
  ],
  "edges": []
}
```

#### Step 3: Regex match result
**Title**: Matched Pattern  
**Description**: The regex extracts "-42" as the numeric part with sign.  
**React Flow Data**:
```json
{
  "nodes": [
    {
      "id": "1",
      "type": "input",
      "data": {"label": "[-+]?\d+"},
      "position": {"x": 250, "y": 0}
    }
  ],
  "edges": []
}
```

#### Step 4: Final number and clamping
**Title**: Final Result  
**Description**: The number is converted and clamped within bounds, resulting in -42.  
**React Flow Data**:
```json
{
  "nodes": [
    {
      "id": "1",
      "type": "output",
      "data": {"label": "-42"},
      "position": {"x": 250, "y": 100}
    }
  ],
  "edges": []
}
```

### Three.js Animation States

#### Step 1: Visualize input string
**Title**: Input String Visualization  
**Description**: Show the string "   -42" with whitespace highlighted.  
**Three.js Data**:
```json
{
  "type": "text",
  "elements": [
    {"value": "   -42", "x": 0, "y": 0, "z": 0, "color": "#0000ff"}
  ],
  "target": null
}
```

#### Step 2: Visualize trimmed string
**Title**: Trimmed String Visualization  
**Description**: Show "-42" after trimming.  
**Three.js Data**:
```json
{
  "type": "text",
  "elements": [
    {"value": "-42", "x": 0, "y": 0, "z": 0, "color": "#00ff00"}
  ],
  "target": null
}
```

#### Step 3: Visualize regex match
**Title**: Matched Pattern Visualization  
**Description**: Highlight "-42" as the matched numeric pattern.  
**Three.js Data**:
```json
{
  "type": "text",
  "elements": [
    {"value": "-42", "x": 0, "y": 0, "z": 0, "color": "#ff0000"}
  ],
  "target": null
}
```

#### Step 4: Visualize final number
**Title**: Final Number Visualization  
**Description**: Show the number -42, after conversion and clamping.  
**Three.js Data**:
```json
{
  "type": "number",
  "elements": [
    {"value": -42, "x": 0, "y": 0, "z": 0, "color": "#ffff00"}
  ],
  "target": null
}
```

## Educational Content

### Common Mistakes
- Forgetting to trim whitespace, leading to incorrect parsing.
- Not handling the absence of digits, resulting in NaN.
- Misinterpreting the sign, especially when no sign is present.
- Overflow errors when the number exceeds 32-bit bounds.
- Using `parseInt` without proper bounds checking.

### Optimization Tips
- Use regex to simplify extraction of sign and digits.
- Default to 0 if no match is found to avoid NaN.
- Clamp the result immediately after conversion.
- Use unary `+` for quick conversion from string to number.
- Minimize string operations for performance.

### Interview Tips
- Explain how regex simplifies parsing.
- Discuss the importance of bounds checking.
- Mention handling of invalid inputs gracefully.
- Be prepared to optimize further if asked, e.g., manual parsing.

## Testing Scenarios

### Normal Cases
**Scenario**: Typical input with sign and digits  
**Input**: `"   -42"`  
**Expected Output**: `-42`  
**Edge Case**: false

### Edge Cases
**Scenario**: No digits, only signs or whitespace  
**Input**: `"   "`  
**Expected Output**: `0`  
**Edge Case**: true

**Scenario**: Number exceeds 32-bit bounds  
**Input**: `"91283472332"`  
**Expected Output**: `2147483647` (clamped)  
**Edge Case**: true

### Error Cases
**Scenario**: Invalid characters after digits  
**Input**: `"123abc"`  
**Expected Output**: `123`  
**Edge Case**: false

### Boundary Cases
**Scenario**: Exactly at the bounds  
**Input**: `"-2147483648"`  
**Expected Output**: `-2147483648`  
**Edge Case**: true

### Performance Cases
**Scenario**: Very large input string  
**Input**: `"1".repeat(10^6)`  
**Expected Output**: `1000000`  
**Edge Case**: false

## Performance Analysis

### Best Case: O(1)
- Input with no digits or whitespace only.
- Minimal parsing needed.

### Average Case: O(n)
- Typical input with sign and digits.
- Regex matching and trimming dominate.

### Worst Case: O(n)
- Very large strings with many characters, but regex still processes linearly.

### Space Complexity: O(1)
- Only a few variables used, no additional data structures.

### Bottlenecks
- Regex matching could be costly for very large strings.
- Clamping involves constant time but may be unnecessary if input is within bounds.

### Scalability
- Efficient for typical inputs.
- May slow with extremely large strings due to regex processing.

## Code Quality Metrics

### Readability: 8/10
- Clear use of regex and concise logic.
- Comments could be more detailed.

### Efficiency: 8/10
- Uses regex for simplicity, minimal overhead.

### Maintainability: 8/10
- Straightforward, easy to modify or extend.

### Documentation: 9/10
- Well-commented, explaining each step.

### Testability: 9/10
- Easy to test with various input strings.

### Best Practices
- Uses regex for pattern matching.
- Clamps output to prevent overflow.
- Handles invalid inputs gracefully.

## Related Algorithms

### String Parsing with Regex
**Similarity**: Uses regex for extracting numeric patterns.
**When to Use**: When pattern extraction from strings is needed.

### Manual Character Parsing
**Similarity**: Iterates character-by-character for control.
**When to Use**: When regex is unavailable or for performance tuning.

### Data Validation
**Similarity**: Validates and clamps data within bounds.
**When to Use**: When sanitizing user input or external data.

### Numeric Conversion
**Similarity**: Converts strings to numbers efficiently.
**When to Use**: When parsing numeric data from text.

## Metadata

### Tags
- string
- parsing
- regex
- input-validation
- bounds-checking

### Acceptance Rate: 75%

### Frequency: High

### Similar Problems
- Valid Parentheses
- Valid Palindrome
- String to Integer (LeetCode 8)
- String Compression

### Difficulty Breakdown
**Understanding**: Medium — regex and bounds handling are key.  
**Implementation**: Medium — straightforward with regex.  
**Optimization**: Medium — regex simplifies parsing but can be optimized further with manual parsing if needed.