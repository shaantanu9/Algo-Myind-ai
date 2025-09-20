"use client"

import { AlgorithmDetailPage } from "@/components/algorithm-detail-page"

// Reverse Integer Algorithm Data
const algorithmData = {
  "id": "reverse-integer",
  "problemId": 7,
  "title": "Reverse Integer",
  "description": "Given a signed 32-bit integer x, return x with its digits reversed. If reversing x causes the value to go outside the signed 32-bit integer range [-2³¹, 2³¹ - 1], then return 0.",
  "difficulty": "Medium",
  "category": "Math",
  "timeComplexity": "O(log n)",
  "spaceComplexity": "O(1)",
  "popularity": 88,
  "estimatedTime": "20 min",
  "realWorldUse": "Number manipulation, data transformation, and validation in financial systems",
  "problemStatement": "Given a signed 32-bit integer x, return x with its digits reversed. If reversing x causes the value to go outside the signed 32-bit integer range [-2³¹, 2³¹ - 1], then return 0.\n\nAssume the environment does not allow you to store 64-bit integers (signed or unsigned).",
  "examples": [
    {
      "input": "x = 123",
      "output": "321",
      "explanation": "The digits of 123 are reversed to become 321."
    },
    {
      "input": "x = -123",
      "output": "-321",
      "explanation": "The digits of -123 are reversed to become -321."
    },
    {
      "input": "x = 120",
      "output": "21",
      "explanation": "The digits of 120 are reversed to become 21, removing the leading zero."
    }
  ],
  "analogy": {
    "title": "Reversing a Number Like Reading Backwards",
    "content": "Imagine you have a number written on paper, like 123. If you were to read it backwards, you'd say 'three-two-one', which gives you 321. That's exactly what this algorithm does - it takes each digit and reverses their order.\n\nHowever, just like you can't read numbers that are too big or too small for your voice to handle, this algorithm has limits on how large the reversed number can be!"
  },
  "keyInsights": [
    "Convert the integer to string to easily access individual digits",
    "Reverse the string representation",
    "Convert back to integer and handle overflow/underflow",
    "Use 32-bit integer boundaries: -2³¹ to 2³¹-1",
    "Handle negative numbers by preserving the sign"
  ],
  "realWorldApplications": [
    {
      "domain": "Financial Systems",
      "application": "Check digit validation",
      "description": "Validating account numbers, credit card numbers, and other financial identifiers"
    },
    {
      "domain": "Data Processing",
      "application": "Number format conversion",
      "description": "Converting between different number formats and representations"
    },
    {
      "domain": "Cryptography",
      "application": "Basic encryption techniques",
      "description": "Simple number manipulation for basic cryptographic operations"
    }
  ],
  "engineeringLessons": [
    {
      "principle": "Type Conversion",
      "lesson": "Convert between data types to leverage different operations available for each type",
      "application": "String manipulation for numbers, array operations for objects, etc."
    },
    {
      "principle": "Boundary Checking",
      "lesson": "Always validate input and output against system constraints",
      "application": "Integer overflow prevention, memory limits, and resource constraints"
    },
    {
      "principle": "Sign Preservation",
      "lesson": "Maintain important properties (like sign) through transformations",
      "application": "Data integrity in mathematical operations and format conversions"
    }
  ],
  "implementations": {
    "bruteForce": {
      "title": "String Conversion Approach",
      "timeComplexity": "O(log n)",
      "spaceComplexity": "O(log n)",
      "code": "function reverse(x) {\n    const sign = x < 0 ? -1 : 1;\n    const reversed = Math.abs(x).toString().split('').reverse().join('');\n    const result = sign * parseInt(reversed);\n    \n    // Check for 32-bit integer overflow\n    if (result > 2147483647 || result < -2147483648) {\n        return 0;\n    }\n    \n    return result;\n}"
    },
    "optimized": {
      "title": "Mathematical Approach",
      "timeComplexity": "O(log n)",
      "spaceComplexity": "O(1)",
      "code": "function reverse(x) {\n    let result = 0;\n    const sign = x < 0 ? -1 : 1;\n    x = Math.abs(x);\n    \n    while (x > 0) {\n        const digit = x % 10;\n        result = result * 10 + digit;\n        x = Math.floor(x / 10);\n        \n        // Check for overflow\n        if (result > 2147483647) {\n            return 0;\n        }\n    }\n    \n    return sign * result;\n}"
    }
  },
  "animationStates": [
    {
      "step": 1,
      "title": "Handle Sign",
      "description": "Extract the sign of the number and work with absolute value",
      "data": {
        "original": "x",
        "sign": "x < 0 ? -1 : 1",
        "absolute": "Math.abs(x)"
      }
    },
    {
      "step": 2,
      "title": "Extract Digits",
      "description": "Extract each digit using modulo operation",
      "data": {
        "number": "absolute_value",
        "digit": "number % 10",
        "remaining": "Math.floor(number / 10)"
      }
    },
    {
      "step": 3,
      "title": "Build Reversed Number",
      "description": "Build the reversed number by multiplying by 10 and adding digits",
      "data": {
        "result": "result * 10 + digit",
        "current_result": "building_number"
      }
    },
    {
      "step": 4,
      "title": "Apply Sign and Check Overflow",
      "description": "Apply the original sign and validate against 32-bit integer limits",
      "data": {
        "final_result": "sign * result",
        "overflow_check": "result > 2147483647 || result < -2147483648"
      }
    }
  ],
  "animation": {
    "interactiveData": {
      "algorithmType": "math-manipulation",
      "dataStructure": "Numbers",
      "keyOperations": ["modulo", "multiplication", "division", "overflow check"],
      "visualizationHints": "Show digit extraction, number building, and overflow detection steps"
    }
  },
  "metadata": {
    "tags": ["Math", "String Manipulation", "Overflow Handling"],
    "acceptanceRate": "25.8%",
    "frequency": 90
  },
  "lastModified": Date.now()
}

export default function ReverseintegerPage() {
  return <AlgorithmDetailPage algorithm={algorithmData} />
}
