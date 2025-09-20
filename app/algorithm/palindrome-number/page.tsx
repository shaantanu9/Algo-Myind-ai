"use client"

import { AlgorithmDetailPage } from "@/components/algorithm-detail-page"

// Palindrome Number Algorithm Data
const algorithmData = {
  "id": "palindrome-number",
  "problemId": 9,
  "title": "Palindrome Number",
  "description": "Given an integer x, determine whether it is a palindrome. An integer is a palindrome if it reads the same backward as forward.",
  "difficulty": "Easy",
  "category": "Math",
  "timeComplexity": "O(log n)",
  "spaceComplexity": "O(1)",
  "popularity": 90,
  "estimatedTime": "15 min",
  "realWorldUse": "Number validation, data integrity checks, and pattern recognition in numerical systems",
  "problemStatement": "Given an integer x, return true if x is a palindrome, and false otherwise. An integer is a palindrome when it reads the same backward as forward.",
  "examples": [
    {
      "input": "x = 121",
      "output": "true",
      "explanation": "121 reads as 121 from left to right and from right to left."
    },
    {
      "input": "x = -121",
      "output": "false",
      "explanation": "From left to right, it reads -121. From right to left, it becomes 121-. Therefore it is not a palindrome."
    },
    {
      "input": "x = 10",
      "output": "false",
      "explanation": "Reads 01 from right to left. Therefore it is not a palindrome."
    }
  ],
  "analogy": {
    "title": "Reading Numbers in a Mirror",
    "content": "Imagine writing a number on a piece of paper and then holding it up to a mirror. If the number looks exactly the same in the mirror as it does on the paper, then it's a palindrome! For example, 121 looks like 121 in the mirror, but 123 would look like 321, which is different.\n\nThis is exactly what our algorithm does - it reverses the number and checks if it matches the original."
  },
  "keyInsights": [
    "Negative numbers cannot be palindromes due to the minus sign",
    "Single-digit numbers are always palindromes",
    "Convert to string for easy reversal, or use mathematical approach",
    "Handle edge cases like 0, single digits, and negative numbers",
    "The mathematical approach avoids string conversion"
  ],
  "realWorldApplications": [
    {
      "domain": "Data Validation",
      "application": "Credit card number validation",
      "description": "Validating card numbers using Luhn algorithm with palindrome checks"
    },
    {
      "domain": "Security",
      "application": "CAPTCHA systems",
      "description": "Generating and validating palindrome-based security challenges"
    },
    {
      "domain": "Data Integrity",
      "application": "Checksum validation",
      "description": "Ensuring data integrity through palindrome verification"
    }
  ],
  "engineeringLessons": [
    {
      "principle": "Edge Case Handling",
      "lesson": "Always consider edge cases like negative numbers, zero, and single digits",
      "application": "Robust input validation in production systems"
    },
    {
      "principle": "Multiple Solution Approaches",
      "lesson": "Different problems can be solved using different paradigms (string vs math)",
      "application": "Choosing the right approach based on constraints and requirements"
    },
    {
      "principle": "Performance Trade-offs",
      "lesson": "String conversion vs mathematical operations have different performance characteristics",
      "application": "Optimizing for performance vs readability based on use case"
    }
  ],
  "implementations": {
    "bruteForce": {
      "title": "String Conversion Approach",
      "timeComplexity": "O(log n)",
      "spaceComplexity": "O(log n)",
      "code": "function isPalindrome(x) {\n    if (x < 0) return false;\n    const str = x.toString();\n    const reversed = str.split('').reverse().join('');\n    return str === reversed;\n}"
    },
    "optimized": {
      "title": "Mathematical Approach",
      "timeComplexity": "O(log n)",
      "spaceComplexity": "O(1)",
      "code": "function isPalindrome(x) {\n    if (x < 0) return false;\n    if (x < 10) return true;\n    \n    let original = x;\n    let reversed = 0;\n    \n    while (x > 0) {\n        const digit = x % 10;\n        reversed = reversed * 10 + digit;\n        x = Math.floor(x / 10);\n    }\n    \n    return original === reversed;\n}"
    }
  },
  "animationStates": [
    {
      "step": 1,
      "title": "Check Negative Numbers",
      "description": "Negative numbers cannot be palindromes due to the minus sign",
      "data": {
        "number": "x",
        "isNegative": "x < 0",
        "result": "false if negative"
      }
    },
    {
      "step": 2,
      "title": "Handle Single Digits",
      "description": "Single-digit numbers (0-9) are always palindromes",
      "data": {
        "number": "x",
        "isSingleDigit": "x >= 0 && x < 10",
        "result": "true for single digits"
      }
    },
    {
      "step": 3,
      "title": "Extract Digits",
      "description": "Extract each digit using modulo operation",
      "data": {
        "original": "x",
        "digit": "x % 10",
        "remaining": "Math.floor(x / 10)"
      }
    },
    {
      "step": 4,
      "title": "Build Reversed Number",
      "description": "Build the reversed number by multiplying by 10 and adding digits",
      "data": {
        "reversed": "reversed * 10 + digit",
        "currentReversed": "building reversed number"
      }
    },
    {
      "step": 5,
      "title": "Compare Original and Reversed",
      "description": "Check if the reversed number equals the original",
      "data": {
        "original": "x",
        "reversed": "reversed_number",
        "isPalindrome": "original === reversed"
      }
    }
  ],
  "animation": {
    "interactiveData": {
      "algorithmType": "math-manipulation",
      "dataStructure": "Numbers",
      "keyOperations": ["modulo", "multiplication", "division", "comparison"],
      "visualizationHints": "Show digit extraction, number reversal, and comparison steps"
    }
  },
  "metadata": {
    "tags": ["Math", "String Manipulation", "Palindrome"],
    "acceptanceRate": "50.5%",
    "frequency": 70
  },
  "lastModified": Date.now()
}

export default function PalindromenumberPage() {
  return <AlgorithmDetailPage algorithm={algorithmData} />
}
