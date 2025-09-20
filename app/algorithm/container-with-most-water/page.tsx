"use client"

import { AlgorithmDetailPage } from "@/components/algorithm-detail-page"

// Container With Most Water Algorithm Data
const algorithmData = {
  "id": "container-with-most-water",
  "problemId": 11,
  "title": "Container With Most Water",
  "description": "Given n non-negative integers a1, a2, ..., an, where each represents a point at coordinate (i, ai). n vertical lines are drawn such that the two endpoints of the line i is at (i, ai) and (i, 0). Find two lines, which, together with the x-axis forms a container, such that the container contains the most water.",
  "difficulty": "Medium",
  "category": "Array",
  "timeComplexity": "O(n)",
  "spaceComplexity": "O(1)",
  "popularity": 90,
  "estimatedTime": "25 min",
  "realWorldUse": "Optimization problems, resource allocation, container packing algorithms",
  "problemStatement": "Given n non-negative integers a1, a2, ..., an, where each represents a point at coordinate (i, ai). n vertical lines are drawn such that the two endpoints of the line i is at (i, ai) and (i, 0). Find two lines, which, together with the x-axis forms a container, such that the container contains the most water.\n\nNotice that you may not slant the container.",
  "examples": [
    {
      "input": "height = [1,8,6,2,5,4,8,3,7]",
      "output": "49",
      "explanation": "The above vertical lines are represented by array [1,8,6,2,5,4,8,3,7]. In this case, the max area of water (blue section) the container can contain is 49."
    },
    {
      "input": "height = [1,1]",
      "output": "1",
      "explanation": "The two vertical lines form a container with height 1 and width 1, so the area is 1."
    }
  ],
  "analogy": {
    "title": "Finding the Best Container",
    "content": "Imagine you have a series of vertical lines of different heights, like fence posts. You want to find two posts that, when connected with the ground, would form a container that holds the most water. The challenge is to find the optimal pair of posts that maximizes the area (height × width) between them.\n\nThis is like finding the best container in a set of vertical bars - you want the one that can hold the most liquid!"
  },
  "keyInsights": [
    "The area between two lines is determined by the shorter line's height and the distance between them",
    "Moving the shorter line inward might increase the area, while moving the taller line inward will only decrease it",
    "The optimal solution uses a two-pointer approach, starting from both ends",
    "Each move should prioritize keeping the taller line to maximize potential area"
  ],
  "realWorldApplications": [
    {
      "domain": "E-commerce",
      "application": "Container packing optimization",
      "description": "Optimizing how items are packed into shipping containers to maximize space utilization"
    },
    {
      "domain": "Data Analysis",
      "application": "Peak finding algorithms",
      "description": "Finding optimal ranges or intervals in data analysis and signal processing"
    },
    {
      "domain": "Resource Management",
      "application": "Resource allocation",
      "description": "Optimizing resource distribution and capacity planning in systems"
    }
  ],
  "engineeringLessons": [
    {
      "principle": "Two Pointer Technique",
      "lesson": "Use two pointers moving towards each other to efficiently solve optimization problems",
      "application": "Array problems, string manipulation, and range-based optimization"
    },
    {
      "principle": "Greedy Algorithm Design",
      "lesson": "Make locally optimal choices at each step to reach globally optimal solution",
      "application": "Resource scheduling, path finding, and optimization problems"
    },
    {
      "principle": "Trade-off Analysis",
      "lesson": "Balance between different factors (height vs width) to find optimal solution",
      "application": "Multi-objective optimization and decision making in algorithms"
    }
  ],
  "implementations": {
    "bruteForce": {
      "title": "Brute Force - Check All Pairs",
      "timeComplexity": "O(n²)",
      "spaceComplexity": "O(1)",
      "code": "function maxArea(height) {\n    let maxArea = 0;\n    for (let i = 0; i < height.length; i++) {\n        for (let j = i + 1; j < height.length; j++) {\n            const area = Math.min(height[i], height[j]) * (j - i);\n            maxArea = Math.max(maxArea, area);\n        }\n    }\n    return maxArea;\n}"
    },
    "optimized": {
      "title": "Two Pointer Approach",
      "timeComplexity": "O(n)",
      "spaceComplexity": "O(1)",
      "code": "function maxArea(height) {\n    let maxArea = 0;\n    let left = 0;\n    let right = height.length - 1;\n    \n    while (left < right) {\n        const currentArea = Math.min(height[left], height[right]) * (right - left);\n        maxArea = Math.max(maxArea, currentArea);\n        \n        // Move the pointer with smaller height\n        if (height[left] < height[right]) {\n            left++;\n        } else {\n            right--;\n        }\n    }\n    \n    return maxArea;\n}"
    }
  },
  "animationStates": [
    {
      "step": 1,
      "title": "Initialize Pointers",
      "description": "Set left pointer at start (0) and right pointer at end (length-1)",
      "data": {
        "array": [1, 8, 6, 2, 5, 4, 8, 3, 7],
        "left": 0,
        "right": 8,
        "currentArea": 0,
        "maxArea": 0
      }
    },
    {
      "step": 2,
      "title": "Calculate Initial Area",
      "description": "Area = min(height[0], height[8]) × (8-0) = min(1,7) × 8 = 8",
      "data": {
        "array": [1, 8, 6, 2, 5, 4, 8, 3, 7],
        "left": 0,
        "right": 8,
        "currentArea": 8,
        "maxArea": 8
      }
    },
    {
      "step": 3,
      "title": "Move Shorter Pointer",
      "description": "Since height[0] (1) < height[8] (7), move left pointer to position 1",
      "data": {
        "array": [1, 8, 6, 2, 5, 4, 8, 3, 7],
        "left": 1,
        "right": 8,
        "currentArea": 8,
        "maxArea": 8
      }
    },
    {
      "step": 4,
      "title": "Calculate New Area",
      "description": "Area = min(height[1], height[8]) × (8-1) = min(8,7) × 7 = 49",
      "data": {
        "array": [1, 8, 6, 2, 5, 4, 8, 3, 7],
        "left": 1,
        "right": 8,
        "currentArea": 49,
        "maxArea": 49
      }
    },
    {
      "step": 5,
      "title": "Continue Optimization",
      "description": "Continue moving pointers to find even better solutions",
      "data": {
        "array": [1, 8, 6, 2, 5, 4, 8, 3, 7],
        "left": 1,
        "right": 8,
        "currentArea": 49,
        "maxArea": 49,
        "complete": true
      }
    }
  ],
  "animation": {
    "interactiveData": {
      "algorithmType": "array-optimization",
      "dataStructure": "Array",
      "keyOperations": ["pointer movement", "area calculation", "min/max comparison"],
      "visualizationHints": "Show array bars with heights, highlight current pointers, display calculated areas"
    }
  },
  "metadata": {
    "tags": ["Array", "Two Pointers", "Greedy"],
    "acceptanceRate": "53.1%",
    "frequency": 85
  },
  "lastModified": Date.now()
}

const algorithmData1 = {
  "algorithmName": "shortest-palindrome",
  "problemId": 214,
  "title": "Shortest Palindrome by Front Addition",
  "description": "Given a string s, the goal is to transform it into the shortest possible palindrome by adding characters only at the front of s. The algorithm finds the minimal prefix to prepend so that the resulting string reads the same forwards and backwards.",
  "difficulty": "Hard",
  "category": "String Manipulation",
  "timeComplexity": "O(n^2)",
  "spaceComplexity": "O(n)",
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
  "problemStatement": "Given a string s, you can add characters in front of it to make it a palindrome. Find the shortest such palindrome by performing this transformation, i.e., prepend as few characters as possible to s to make the entire string a palindrome.",
  "realWorldUse": "This algorithm can be used in data validation, DNA sequence analysis, or text correction where palindromic structures are relevant, such as in error detection or pattern recognition.",
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
          "code": "function bruteForceShortestPalindrome(s) {\n  if (s === s.split('').reverse().join('')) return s;\n  for (let i = 0; i < s.length; i++) {\n    const prefix = s.slice(0, i);\n    const candidate = prefix + s;\n    if (candidate === candidate.split('').reverse().join('')) {\n      return candidate;\n    }\n  }\n  return s;\n}"
      },
      "optimized": {
          "title": "Efficient Shortest Palindrome via Reversal and Slicing",
          "timeComplexity": "O(n^2)",
          "spaceComplexity": "O(n)",
          "code": "var shortestPalindrome = function(s) {\n  const reversed = s.split('').reverse().join('');\n  for (let i = s.length; i > 0; i--) {\n    if (s.slice(0, i) === reversed.slice(s.length - i)) {\n      return reversed.slice(0, reversed.length - i) + s;\n    }\n  }\n  return '';\n};"
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
  "estimatedTime": "10-15 minutes",
  "popularity": 85,
  "id": "shortest-palindrome",
  "createdAt": 1758357898603,
  "lastModified": 1758357945104,
  "constraints": [],
  "solution": {
      "javascript": "",
      "explanation": ""
  }
}

export default function ContainerwithmostwaterPage() {
  return <AlgorithmDetailPage algorithm={algorithmData1} />
}
