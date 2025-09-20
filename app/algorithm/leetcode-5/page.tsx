'use client'

import { AlgorithmDetailPage } from '@/components/algorithm-detail-page'

const algorithmData = {
  "id": "leetcode-5",
  "problemId": 5,
  "title": "最长回文串",
  "description": "",
  "difficulty": "Medium",
  "category": "String",
  "timeComplexity": "O(n)",
  "spaceComplexity": "O(n)",
  "popularity": 29,
  "estimatedTime": "30-60 mins",
  "realWorldUse": "Various software engineering applications",
  "problemStatement": "",
  "examples": [
    {
      "input": "Input: \"babad\"",
      "output": "Output: \"bab\"",
      "explanation": "Note: \"aba\" is also a valid answer."
    }
  ],
  "analogy": null,
  "keyInsights": [
    "Break down the problem into smaller subproblems",
    "Consider time and space complexity trade-offs",
    "Think about edge cases and boundary conditions",
    "Look for optimal data structures for the problem"
  ],
  "realWorldApplications": [],
  "engineeringLessons": [],
  "implementations": {},
  "animationStates": [],
  "metadata": {
    "tags": [
      "LeetCode"
    ],
    "acceptanceRate": "29% ",
    "frequency": 60,
    "similarProblems": [],
    "difficultyBreakdown": {
      "understanding": "Requires careful analysis",
      "implementation": "Multiple approaches possible",
      "optimization": "Balance time vs space complexity"
    }
  },
  "educationalContent": {
    "analogy": null,
    "keyInsights": [
      "Break down the problem into smaller subproblems",
      "Consider time and space complexity trade-offs",
      "Think about edge cases and boundary conditions",
      "Look for optimal data structures for the problem"
    ],
    "commonMistakes": [],
    "optimizationTips": [],
    "interviewTips": []
  },
  "codeQuality": {
    "readability": 8,
    "efficiency": 9,
    "maintainability": 7,
    "documentation": 8,
    "testability": 9,
    "bestPractices": []
  },
  "testingScenarios": [
    {
      "scenario": "Basic Case",
      "input": "nums = [2, 7, 11, 15], target = 9",
      "expectedOutput": "[0, 1]",
      "edgeCase": false
    },
    {
      "scenario": "No Solution",
      "input": "nums = [1, 2, 3], target = 10",
      "expectedOutput": "[]",
      "edgeCase": true
    },
    {
      "scenario": "Duplicate Values",
      "input": "nums = [3, 3], target = 6",
      "expectedOutput": "[0, 1]",
      "edgeCase": true
    }
  ],
  "performanceAnalysis": {
    "bestCase": "O(1)",
    "averageCase": "O(n)",
    "worstCase": "O(n²)",
    "spaceComplexity": "O(n)",
    "bottlenecks": [
      "Hash collisions",
      "Memory allocation"
    ],
    "scalability": "Linear scaling with input size"
  },
  "relatedAlgorithms": []
}

export default function Page() {
  return <AlgorithmDetailPage algorithm={algorithmData} />
}