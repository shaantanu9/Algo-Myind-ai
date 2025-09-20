'use client'

import { AlgorithmDetailPage } from '@/components/algorithm-detail-page'

const algorithmData = {
  "id": "leetcode-4",
  "problemId": 4,
  "title": "寻找两个正序数组的中位数",
  "description": "",
  "difficulty": "Hard",
  "category": "Algorithm",
  "timeComplexity": "O(n)",
  "spaceComplexity": "O(n)",
  "popularity": 29,
  "estimatedTime": "60-120 mins",
  "realWorldUse": "Various software engineering applications",
  "problemStatement": "",
  "examples": [],
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
    "acceptanceRate": "29.0% ",
    "frequency": 18,
    "similarProblems": [],
    "difficultyBreakdown": {
      "understanding": "Complex problem analysis",
      "implementation": "Advanced data structures",
      "optimization": "Optimal algorithmic solutions"
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