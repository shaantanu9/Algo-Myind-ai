# Reverse Integer Algorithm

## Basic Information
- **ID**: reverse-integer
- **Title**: Reverse Integer
- **Description**: Reverses the digits of a signed 32-bit integer, returning 0 if overflow occurs.
- **Difficulty**: Easy
- **Category**: Math / String Conversion
- **Time Complexity**: O(n), where n is the number of digits in the integer
- **Space Complexity**: O(n), due to string conversion
- **Popularity**: High, common interview problem
- **Estimated Time**: 10-15 minutes
- **Real World Use**: Data transformation, encoding, or reversing sequences in applications

## Problem Statement
Given a signed 32-bit integer `x`, reverse its digits and return the reversed number. If the reversed number exceeds the 32-bit signed integer range `[-2^31, 2^31 - 1]`, return 0.

The function takes an integer `x` as input and outputs an integer. The process involves converting the number to a string, reversing the string, and converting back to a number, with overflow checks.

## Examples

### Example 1
```
Input: 123
Output: 321
Explanation: Convert to string "123", reverse to "321", convert back to number 321.
```

### Example 2
```
Input: -123
Output: -321
Explanation: Convert to string "123", reverse to "321", then apply sign to get -321.
```

### Example 3
```
Input: 120
Output: 21
Explanation: Convert to string "120", reverse to "021", which is "21" after trimming leading zeros.
```

## Analogy

### Title: Reversing a Number as Flipping a Sequence of Cards

**Content**: Imagine you have a sequence of numbered cards laid out in order. To reverse the number, you first take the absolute value of the number (ignoring the sign), then lay out the cards as a string. Reversing the string is like flipping the sequence of cards from right to left. After flipping, you convert the sequence back into a number. If the reversed sequence exceeds the maximum or minimum limits of a 32-bit signed integer, you discard it and return 0. If the original number was negative, you reapply the negative sign after reversing.

**Visual Aid**: Visualize a number as a row of cards, then flip the row, and read the sequence again to get the reversed number.

## Key Insights
- Uses string conversion (`String()`) and array methods (`split()`, `reverse()`, `join()`) for simplicity.
- Checks for overflow by comparing the reversed number against `2^31`.
- Handles negative numbers by using `Math.sign()` and `Math.abs()`.
- Efficient for small to medium-sized integers, but relies on string operations.

## Real World Applications

### Data Transformation
**Application**: Reversing sequences or identifiers in data processing pipelines.

### Encoding and Decoding
**Application**: Simple reversible transformations in encoding schemes.

### User Input Validation
**Application**: Reversing user input for puzzles or validation checks.

### Digital Signal Processing
**Application**: Reversing sequences of signal data for analysis.

## Engineering Lessons

### Principle 1: Use of String Conversion for Digit Manipulation
**Lesson**: Converting numbers to strings simplifies digit reversal without complex mathematical operations.
**Application**: Useful in scenarios where digit order needs to be manipulated easily.

### Principle 2: Overflow Handling
**Lesson**: Always check for overflow conditions after transformations to prevent incorrect results.
**Application**: Critical in systems with fixed data size limits, like 32-bit integers.

### Principle 3: Sign Preservation
**Lesson**: Handle negative numbers separately to preserve sign after transformation.
**Application**: Ensures correctness in signed number operations.

## Implementations

### Brute Force Approach
```javascript
// Not applicable here as the code relies on string conversion for simplicity.
```
**Time Complexity**: O(n)  
**Space Complexity**: O(n)  
**Explanation**: Converts number to string, reverses, and converts back, with overflow check.  
**When to Use**: Suitable for small to medium integers where simplicity is preferred over pure mathematical approach.

### Optimized Solution
```javascript
var reverse = function(x) {
  const reversed = String(Math.abs(x)).split('').reverse().join('');

  if (reversed > Math.pow(2, 31)) {
    return 0;
  }

  return reversed * Math.sign(x);
};
```
**Time Complexity**: O(n), where n is the number of digits in `x`.  
**Space Complexity**: O(n).  
**Explanation**: Converts `x` to absolute value, reverses the string, checks for overflow, then applies the original sign.  
**When to Use**: When simplicity and readability are priorities, and input size is manageable.

## Animation States (Step-by-Step Visualization)

### D3 Animation States

#### Step 1: Convert to absolute value and string
**Title**: Convert number to string
**Description**: Take the absolute value of `x` and convert it to a string.
**D3 Data**:
```json
{
  "type": "string",
  "data": "123",
  "highlights": [0],
  "currentIndex": 0
}
```

#### Step 2: Reverse the string
**Title**: Reverse the string
**Description**: Reverse the array of characters.
**D3 Data**:
```json
{
  "type": "string",
  "data": "321",
  "highlights": [1],
  "currentIndex": 1
}
```

#### Step 3: Convert back to number and check overflow
**Title**: Convert to number and check overflow
**Description**: Join the reversed characters, convert to number, compare with 2^31.
**D3 Data**:
```json
{
  "type": "number",
  "data": 321,
  "highlights": [],
  "currentIndex": null
}
```

## Educational Content

### Common Mistakes
- Forgetting to handle negative signs separately.
- Not checking for overflow after reversing.
- Leading zeros after reversal are ignored in number conversion.

### Optimization Tips
- Use string methods for simplicity, but be cautious with very large numbers.
- For large-scale systems, consider mathematical reversal to avoid string overhead.

### Interview Tips
- Explain the sign handling clearly.
- Mention overflow checks explicitly.
- Discuss alternative approaches like mathematical reversal without string conversion.

## Testing Scenarios

### Normal Cases
**Scenario**: Reversing a typical positive number
**Input**: 123
**Expected Output**: 321

### Edge Cases
**Scenario**: Reversing a number that causes overflow
**Input**: 1534236469
**Expected Output**: 0 (overflow)

**Scenario**: Negative number
**Input**: -123
**Expected Output**: -321

### Error Cases
**Scenario**: Zero
**Input**: 0
**Expected Output**: 0

### Boundary Cases
**Scenario**: Max 32-bit integer
**Input**: 2147483647
**Expected Output**: 0 (overflow after reversal)

### Performance Cases
**Scenario**: Large number with many digits
**Input**: 1000000003
**Expected Output**: 3000000001 (but check overflow)

## Performance Analysis

### Best Case: O(n)
- When input is small, e.g., single-digit numbers.

### Average Case: O(n)
- Typical integer inputs with moderate digit length.

### Worst Case: O(n)
- Large integers close to overflow threshold.

### Space Complexity: O(n)
- Due to string conversion and reversal.

### Bottlenecks
- String conversion and comparison operations.
- Handling very large numbers near overflow limits.

### Scalability
- Efficient for typical 32-bit integers.
- Not suitable for extremely large numbers beyond 64-bit range.

## Code Quality Metrics

### Readability: 9/10
- Clear steps, well-commented, straightforward logic.

### Efficiency: 8/10
- Simple and effective, but relies on string operations.

### Maintainability: 9/10
- Easy to modify for different bounds or additional features.

### Documentation: 8/10
- Clear explanation, but could include more inline comments.

### Testability: 9/10
- Easy to test with different inputs and edge cases.

### Best Practices
- Proper sign handling.
- Overflow checks after conversion.
- Use of built-in string methods for clarity.

## Related Algorithms

### Palindrome Number
**Similarity**: Both involve reversing digits.
**When to Use**: When checking if a number reads the same backward and forward.

### String Reversal
**Similarity**: Uses string reversal techniques.
**When to Use**: When reversing sequences in data processing.

### Mathematical Reversal
**Similarity**: Reverses digits mathematically without string conversion.
**When to Use**: For performance-critical applications or avoiding string overhead.

## Metadata

### Tags
- math
- string
- number
- overflow
- conversion

### Acceptance Rate: 85%

### Frequency: Common

### Similar Problems
- 9. Palindrome Number
- 7. Reverse Integer (this problem)
- 13. Roman to Integer
- 67. Add Binary

### Difficulty Breakdown
**Understanding**: Easy - straightforward string manipulation and overflow check.  
**Implementation**: Easy - simple sequence of conversions and checks.  
**Optimization**: Medium - could be optimized with purely mathematical approach.