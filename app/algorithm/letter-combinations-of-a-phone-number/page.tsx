"use client"

import { AlgorithmDetailPage } from "@/components/algorithm-detail-page"

// Algorithm data for letter-combinations-of-a-phone-number
const algorithmData = {
  "id": "letter-combinations-of-a-phone-number",
  "problemId": 17,
  "title": "Letter Combinations Of A Phone Number",
  "description": "A string algorithm that uses iterative approach to solve the problem with O(n) time complexity.",
  "difficulty": "Easy",
  "category": "String",
  "timeComplexity": "O(n)",
  "spaceComplexity": "O(1)",
  "popularity": 75,
  "estimatedTime": "15-30 min",
  "realWorldUse": "Text processing, search engines, data validation",
  "problemStatement": "Given a string, manipulate and process it according to the problem requirements.",
  "examples": [
    {
      "input": "\"abcabcbb\"",
      "output": "3",
      "explanation": "The longest substring without repeating characters is \"abc\" with length 3"
    }
  ],
  "analogy": {
    "title": "Palindrome: Mirror Reflection Puzzle",
    "content": "Think of a word written on a mirror. When you read it backwards, it should look exactly the same as the original. Like checking if \"racecar\" reads the same forwards and backwards, the algorithm compares characters from both ends, moving towards the center like closing a zipper.",
    "visualAid": "Visualize two people standing at opposite ends of a hallway with letters on the walls. They walk towards each other, comparing letters as they meet. If all pairs match, you have a perfect palindrome reflection."
  },
  "keyInsights": [
    "String immutability affects performance in languages like Java and Python",
    "Character arrays or StringBuilder provide better performance for modifications",
    "ASCII vs Unicode considerations impact string processing complexity",
    "Nested loops multiply time complexity - consider hash maps or sorting optimizations",
    "Break early from inner loops when possible to improve performance",
    "Hash collisions can degrade O(1) to O(n) - choose hash functions carefully",
    "Load factor affects hash table performance - monitor and resize when needed",
    "Hash maps provide excellent average-case performance for most use cases",
    "Time complexity of O(n²) demonstrates the importance of algorithmic efficiency",
    "Space-time trade-offs are fundamental to algorithm design and optimization"
  ],
  "realWorldApplications": [
    {
      "domain": "Text Processing",
      "application": "DNA Sequence Analysis",
      "description": "Finding unique genetic sequences and patterns in biological data"
    },
    {
      "domain": "Search Engines",
      "application": "Text Search Algorithms",
      "description": "Implementing efficient string matching for web search functionality"
    },
    {
      "domain": "Security",
      "application": "Pattern Recognition",
      "description": "Detecting malicious patterns in network traffic and system logs"
    }
  ],
  "engineeringLessons": [
    {
      "principle": "Hash Function Quality",
      "lesson": "Poor hash functions lead to collisions and degrade O(1) to O(n) performance",
      "application": "Choose appropriate hash functions, handle collisions properly, and consider load factor"
    },
    {
      "principle": "Edge Case Handling",
      "lesson": "Always consider empty inputs, single elements, maximum values, and boundary conditions",
      "application": "Write comprehensive tests covering edge cases and validate input constraints early"
    },
    {
      "principle": "Space-Time Trade-offs",
      "lesson": "Often you can trade space for time or vice versa - choose based on constraints",
      "application": "Use additional space for caching, precomputation, or hash tables when time is critical"
    }
  ],
  "implementations": {
    "optimized": {
      "title": "Optimized Solution",
      "timeComplexity": "O(n²)",
      "spaceComplexity": "O(n)",
      "code": "/**\n * 17. Letter Combinations of a Phone Number\n * https://leetcode.com/problems/letter-combinations-of-a-phone-number/\n * Difficulty: Medium\n *\n * Given a string containing digits from 2-9 inclusive, return all possible\n * letter combinations that the number could represent. Return the answer\n * in any order.\n *\n * A mapping of digit to letters (just like on the telephone buttons) is\n * given below. Note that 1 does not map to any letters.\n */\n\n/**\n * @param {string} digits\n * @return {string[]}\n */\nvar letterCombinations = function(digits) {\n  if (!digits || !digits.length) return [];\n\n  const map = {\n    2: 'abc',\n    3: 'def',\n    4: 'ghi',\n    5: 'jkl',\n    6: 'mno',\n    7: 'pqrs',\n    8: 'tuv',\n    9: 'wxyz'\n  };\n\n  if (digits.length === 1) {\n    return map[digits].split('');\n  }\n\n  const result = [];\n  const group1 = letterCombinations(digits.substr(0, 1));\n  const group2 = letterCombinations(digits.substr(1));\n\n  for (let i = 0; i < group1.length; i++) {\n    for (let j = 0; j < group2.length; j++) {\n      result.push(group1[i] + group2[j]);\n    }\n  }\n\n  return result;\n};\n"
    },
    "bruteForce": {
      "title": "Brute Force Approach",
      "timeComplexity": "O(n²)",
      "spaceComplexity": "O(1)",
      "code": "// Nested loops checking all character pairs"
    }
  },
  "animationStates": [
    {
      "step": 1,
      "title": "Initialize String",
      "description": "Set up string variables and pointers",
      "data": {
        "original": "aacecaaa",
        "reversed": "",
        "currentIndex": 0
      }
    },
    {
      "step": 2,
      "title": "Reverse String",
      "description": "Create reversed version of the input string",
      "data": {
        "original": "aacecaaa",
        "reversed": "aaacecaa",
        "currentIndex": 0
      }
    },
    {
      "step": 3,
      "title": "Compare Prefixes",
      "description": "Check if string prefixes match reversed suffixes",
      "data": {
        "original": "aacecaaa",
        "reversed": "aaacecaa",
        "currentIndex": 1,
        "s_slice": "a",
        "reversed_slice": "a",
        "match": true
      }
    },
    {
      "step": 4,
      "title": "Construct Result",
      "description": "Build the shortest palindrome by prepending unmatched characters",
      "data": {
        "original": "aacecaaa",
        "result": "aaacecaaa",
        "prepend": "a",
        "final": "aaacecaaa"
      }
    }
  ],
  "animation": {
    "interactiveData": {
      "algorithmType": "string",
      "dataStructure": "String",
      "keyOperations": [
        "Hash map operations",
        "Pointer movement",
        "Character processing",
        "Substring operations"
      ],
      "visualizationHints": "Show string operations and data flow"
    }
  },
  "metadata": {
    "tags": [
      "String",
      "Hash Table",
      "Two Pointers"
    ],
    "acceptanceRate": "50%",
    "frequency": 50
  },
  "lastModified": 1758391118822
}

export default function lettercombinationsofaphonenumberPage() {
  return <AlgorithmDetailPage algorithm={algorithmData} />
}