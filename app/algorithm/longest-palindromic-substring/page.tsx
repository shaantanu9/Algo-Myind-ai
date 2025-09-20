"use client"

import { AlgorithmDetailPage } from "@/components/algorithm-detail-page"

// Algorithm data for longest-palindromic-substring
const algorithmData = {
  "id": "longest-palindromic-substring",
  "problemId": 5,
  "title": "Longest Palindromic Substring",
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
    "title": "Reading a Book Without Repeating Words",
    "content": "Think of reading a book and trying to find the longest passage where no word repeats. You slide through the text, keeping track of words you've seen, similar to how the algorithm maintains a window of unique characters."
  },
  "keyInsights": [
    "This is a string algorithm that demonstrates efficient data structure usage",
    "Time complexity of O(n) shows the importance of algorithm optimization"
  ],
  "realWorldApplications": [
    {
      "domain": "Text Processing",
      "application": "DNA Sequence Analysis",
      "description": "Finding unique genetic sequences in biological data"
    }
  ],
  "engineeringLessons": [
    {
      "principle": "Problem Solving",
      "lesson": "Break down complex problems into manageable steps",
      "application": "Apply systematic thinking to algorithm design and implementation"
    }
  ],
  "implementations": {
    "optimized": {
      "title": "Optimized Solution",
      "timeComplexity": "O(n)",
      "spaceComplexity": "O(1)",
      "code": "/**\n * 5. Longest Palindromic Substring\n * https://leetcode.com/problems/longest-palindromic-substring/\n * Difficulty: Medium\n *\n * Given a string `s`, return the longest palindromic substring in `s`.\n */\n\n/**\n * @param {string} s\n * @return {string}\n */\nvar longestPalindrome = function(s) {\n  let result = '';\n\n  for (let i = 0; i < s.length; i++) {\n    const palindrome1 = getExtendedPalindrome(s, i, i);\n    const palindrome2 = getExtendedPalindrome(s, i, i + 1);\n    const longerPalindrome = palindrome1.length > palindrome2.length\n      ? palindrome1\n      : palindrome2;\n\n    if (longerPalindrome.length > result.length) {\n      result = longerPalindrome;\n    }\n  }\n\n  return result;\n};\n\nfunction getExtendedPalindrome(s, start, end) {\n  while (start >= 0 && end < s.length && s[start] === s[end]) {\n    start--;\n    end++;\n  }\n\n  return s.slice(start + 1, end);\n}\n"
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
        "Pointer movement",
        "Window sliding",
        "Character processing",
        "Substring operations"
      ],
      "visualizationHints": "Show string operations and data flow"
    }
  },
  "metadata": {
    "tags": [
      "String",
      "Two Pointers",
      "Sliding Window"
    ],
    "acceptanceRate": "50%",
    "frequency": 50
  },
  "lastModified": 1758390385950
}

export default function longestpalindromicsubstringPage() {
  return <AlgorithmDetailPage algorithm={algorithmData} />
}