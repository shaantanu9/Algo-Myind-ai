'use client'

import { AlgorithmDetailPage } from '@/components/algorithm-detail-page'

const algorithmData = {
  "id": "leetcode-2",
  "problemId": 2,
  "title": "两数相加",
  "description": "给出两个 **非空** 的链表用来表示两个非负的整数。其中，它们各自的位数是按照 **逆序** 的方式存储的，并且它们的每个节点只能存储 **一位** 数字。\n\n如果，我们将这两个数相加起来，则会返回一个新的链表来表示它们的和。\n\n您可以假设除了数字 0 之外，这两个数都不会以 0 开头。\n\n**示例：**\n\n```\n输入：(2 -> 4 -> 3) + (5 -> 6 -> 4)\n输出：7 -> 0 -> 8\n原因：342 + 465 = 807\n```",
  "difficulty": "Medium",
  "category": "Algorithm",
  "timeComplexity": "O(n)",
  "spaceComplexity": "O(n)",
  "popularity": 33.9,
  "estimatedTime": "30-60 mins",
  "realWorldUse": "Various software engineering applications",
  "problemStatement": "给出两个 **非空** 的链表用来表示两个非负的整数。其中，它们各自的位数是按照 **逆序** 的方式存储的，并且它们的每个节点只能存储 **一位** 数字。\n\n如果，我们将这两个数相加起来，则会返回一个新的链表来表示它们的和。\n\n您可以假设除了数字 0 之外，这两个数都不会以 0 开头。\n\n**示例：**\n\n```\n输入：(2 -> 4 -> 3) + (5 -> 6 -> 4)\n输出：7 -> 0 -> 8\n原因：342 + 465 = 807\n```",
  "examples": [
    {
      "input": "(2 -> 4 -> 3) + (5 -> 6 -> 4)",
      "output": "7 -> 0 -> 8",
      "explanation": "原因：342 + 465 = 807"
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
    "acceptanceRate": "33.9% ",
    "frequency": 88,
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