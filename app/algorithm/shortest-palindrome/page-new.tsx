"use client"

import { AlgorithmDetailPage } from "@/components/algorithm-detail-page"

// Shortest Palindrome Algorithm Data
const algorithmData = {
  "id": "shortest-palindrome",
  "problemId": 214,
  "title": "Shortest Palindrome by Front Addition",
  "description": "Given a string s, the goal is to transform it into the shortest possible palindrome by adding characters only at the front of s. The algorithm finds the minimal prefix to prepend so that the resulting string reads the same forwards and backwards.",
  "difficulty": "Hard",
  "category": "String Manipulation",
  "timeComplexity": "O(n^2)",
  "spaceComplexity": "O(n)",
  "popularity": 85,
  "estimatedTime": "10-15 minutes",
  "realWorldUse": "This algorithm can be used in data validation, DNA sequence analysis, or text correction where palindromic structures are relevant, such as in error detection or pattern recognition.",
  "problemStatement": "Given a string s, you can add characters in front of it to make it a palindrome. Find the shortest such palindrome by performing this transformation, i.e., prepend as few characters as possible to s to make the entire string a palindrome.",
  "examples": [
    {
      "input": "aacecaaa",
      "output": "aaacecaaa",
      "explanation": "Prepending 'a' makes the string a palindrome."
    },
    {
      "input": "abcd",
      "output": "dcbabcd",
      "explanation": "Prepending 'dcb' results in a palindrome."
    }
  ],
  "analogy": {
    "title": "Mirror Reflection Puzzle",
    "content": "Imagine you have a string of beads, and you want to create a perfect mirror image starting from the front. You reverse the entire string and then check how much of the original string matches the end of this reversed version. The part that doesn't match needs to be added in front to complete the mirror image, resulting in the shortest symmetrical necklace."
  },
  "keyInsights": [
    "Reversing the string helps identify the largest palindromic prefix.",
    "Checking decreasing prefixes from the full length down to 1 ensures finding the minimal prefix to prepend.",
    "String slicing and comparison are used to verify palindrome prefixes efficiently.",
    "The approach relies on string equality checks rather than more complex algorithms like KMP."
  ],
  "realWorldApplications": [
    {
      "domain": "Text Processing",
      "application": "Auto-correct or auto-complete systems that suggest palindromic completions.",
      "description": "Enhancing user input by automatically converting strings into palindromes for aesthetic or cryptographic purposes."
    },
    {
      "domain": "Bioinformatics",
      "application": "DNA sequence analysis for palindromic motifs.",
      "description": "Identifying minimal additions needed to form palindromic DNA sequences for genetic research."
    }
  ],
  "engineeringLessons": [
    {
      "principle": "String Reversal and Slicing",
      "lesson": "Using string reversal and slicing to efficiently compare prefixes and suffixes.",
      "application": "Optimizing string matching algorithms in text editors or search engines."
    },
    {
      "principle": "Iterative Decreasing Checks",
      "lesson": "Decreasing loop from string length to 1 ensures minimal addition.",
      "application": "Designing algorithms that find optimal solutions by incremental checks."
    }
  ],
  "implementations": {
    "bruteForce": {
      "title": "Naive Palindrome Construction by Prefix Addition",
      "timeComplexity": "O(n^3)",
      "spaceComplexity": "O(n)",
      "code": "function bruteForceShortestPalindrome(s) {\n if (s === s.split('').reverse().join('')) return s;\n for (let i = 0; i < s.length; i++) {\n const prefix = s.slice(0, i);\n const candidate = prefix + s;\n if (candidate === candidate.split('').reverse().join('')) {\n return candidate;\n }\n }\n return s;\n}"
    },
    "optimized": {
      "title": "Efficient Shortest Palindrome via Reversal and Slicing",
      "timeComplexity": "O(n^2)",
      "spaceComplexity": "O(n)",
      "code": "var shortestPalindrome = function(s) {\n const reversed = s.split('').reverse().join('');\n for (let i = s.length; i > 0; i--) {\n if (s.slice(0, i) === reversed.slice(s.length - i)) {\n return reversed.slice(0, reversed.length - i) + s;\n }\n }\n return '';\n};"
    }
  },
  "animationStates": [
    {
      "step": 1,
      "title": "Reverse the String",
      "description": "Create a reversed version of the input string to compare prefixes and suffixes.",
      "data": {
        "original": "s",
        "reversed": "reversed_s"
      }
    },
    {
      "step": 2,
      "title": "Iterate from Full Length Down to 1",
      "description": "Check decreasing prefixes of s against corresponding suffixes of reversed_s.",
      "data": {
        "i": "current prefix length",
        "s_slice": "s.slice(0, i)",
        "reversed_slice": "reversed.slice(s.length - i)"
      }
    },
    {
      "step": 3,
      "title": "Compare Prefix and Suffix",
      "description": "If the prefix of s matches the suffix of reversed_s, prepend the unmatched part of reversed_s.",
      "data": {
        "match": "true/false",
        "result": "shortest palindrome"
      }
    }
  ],
  "animation": {
    "interactiveData": {
      "algorithmType": "String Comparison",
      "dataStructure": "Strings",
      "keyOperations": [
        "reverse",
        "slice",
        "compare"
      ],
      "visualizationHints": "Highlight matching prefixes and suffixes, animate reversal and slicing steps."
    }
  },
  "metadata": {
    "tags": [
      "string",
      "palindrome",
      "string manipulation",
      "optimization"
    ],
    "acceptanceRate": "45.0%",
    "frequency": 78
  },
  "lastModified": Date.now()
}

export default function ShortestpalindromePage() {
  return <AlgorithmDetailPage algorithm={algorithmData} />
}
