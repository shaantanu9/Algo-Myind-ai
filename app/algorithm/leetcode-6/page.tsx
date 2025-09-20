'use client'

import { AlgorithmDetailPage } from '@/components/algorithm-detail-page'

const algorithmData = {
  "id": "leetcode-6",
  "problemId": 6,
  "title": "蛇形矩阵",
  "description": "",
  "difficulty": "Medium",
  "category": "Algorithm",
  "timeComplexity": "O(n)",
  "spaceComplexity": "O(n)",
  "popularity": 35.1,
  "estimatedTime": "30-60 mins",
  "realWorldUse": "Various software engineering applications",
  "problemStatement": "",
  "examples": [
    {
      "input": "P   A   H   N",
      "output": "A P L S I I G",
      "explanation": "Y   I   R And then read line by line: \"PAHNAPLSIIGYIR\"  Write the code that will take a string and make this conversion given a number of rows:  string convert(string s, int numRows); Example 1:  Input: s = \"PAYPALISHIRING\", numRows = 3 Output: \"PAHNAPLSIIGYIR\" Example 2:  Input: s = \"PAYPALISHIRING\", numRows = 4 Output: \"PINALSIGYAHRPI\" Explanation:  P     I    N A   L S  I G Y A   H R P     I"
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
    "acceptanceRate": "35.1% ",
    "frequency": 86,
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