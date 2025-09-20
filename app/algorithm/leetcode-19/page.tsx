'use client'

import { AlgorithmDetailPage } from '@/components/algorithm-detail-page'

const algorithmData = {
  "id": "leetcode-19",
  "problemId": 19,
  "title": "删除链表的倒数第 N 个节点",
  "description": "给定一个链表，删除链表的倒数第 *n* 个节点，并且返回链表的头结点。\n\n**示例：**\n\n```\n给定一个链表: 1->2->3->4->5, 和 n = 2.\n\n当删除了倒数第二个节点后，链表变为 1->2->3->5.\n```\n\n**说明：**\n\n给定的 *n* 保证是有效的。\n\n**进阶：**\n\n你能尝试使用一趟扫描实现吗？",
  "difficulty": "Medium",
  "category": "Linked List",
  "timeComplexity": "O(n)",
  "spaceComplexity": "O(n)",
  "popularity": 34.4,
  "estimatedTime": "30-60 mins",
  "realWorldUse": "Various software engineering applications",
  "problemStatement": "给定一个链表，删除链表的倒数第 *n* 个节点，并且返回链表的头结点。\n\n**示例：**\n\n```\n给定一个链表: 1->2->3->4->5, 和 n = 2.\n\n当删除了倒数第二个节点后，链表变为 1->2->3->5.\n```\n\n**说明：**\n\n给定的 *n* 保证是有效的。\n\n**进阶：**\n\n你能尝试使用一趟扫描实现吗？",
  "examples": [
    {
      "input": "给定一个链表: 1->2->3->4->5, 和 n = 2.",
      "output": "",
      "explanation": "当删除了倒数第二个节点后，链表变为 1->2->3->5."
    }
  ],
  "analogy": null,
  "keyInsights": [
    "Multiple pointers can solve linked list problems efficiently",
    "Always handle edge cases: empty list, single node, head/tail operations",
    "Dummy nodes can simplify boundary condition handling"
  ],
  "realWorldApplications": [],
  "engineeringLessons": [],
  "implementations": {},
  "animationStates": [],
  "metadata": {
    "tags": [
      "LeetCode"
    ],
    "acceptanceRate": "34.4% ",
    "frequency": 28,
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
      "Multiple pointers can solve linked list problems efficiently",
      "Always handle edge cases: empty list, single node, head/tail operations",
      "Dummy nodes can simplify boundary condition handling"
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