'use client'

import { AlgorithmDetailPage } from '@/components/algorithm-detail-page'

const algorithmData = {
  "id": "leetcode-11",
  "problemId": 11,
  "title": "maxArea",
  "description": "",
  "difficulty": "Medium",
  "category": "Algorithm",
  "timeComplexity": "O(n)",
  "spaceComplexity": "O(n)",
  "popularity": 45,
  "estimatedTime": "30-60 mins",
  "realWorldUse": "Various software engineering applications",
  "problemStatement": "",
  "examples": [
    {
      "input": "我们都应该听说过**木桶原理**，一个木桶可以装入多少水取决于最短的那块板；而这道题也可以与木桶装水的问题对应上。",
      "output": "很容易的可以得到---->**容器可以容纳水的容量=两条垂直线中最短的那条*两条线之间的距离**",
      "explanation": "现在的情况是，有很多条线，让你计算两两之间能装的最多的水，其实暴力法之间就能解决这个问题，但是它的时间复杂度也达到了**O(n^2)**  ok，那我们先试试用**暴力法**来解 决问题：  ### 1.暴力法  直接上代码："
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
    "acceptanceRate": "45.0%",
    "frequency": 79,
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