'use client'

import { AlgorithmDetailPage } from '@/components/algorithm-detail-page'

const algorithmData = {
  "id": "leetcode-3",
  "problemId": 3,
  "title": "无重复字符的最长子串",
  "description": "给定一个字符串，请你找出其中不含有重复字符的 **最长子串** 的长度。\n\n**示例 1:**\n\n```java\n输入: \"abcabcbb\"\n输出: 3 \n解释: 因为无重复字符的最长子串是 \"abc\"，所以其长度为 3。\n```",
  "difficulty": "Medium",
  "category": "Algorithm",
  "timeComplexity": "O(n)",
  "spaceComplexity": "O(n)",
  "popularity": 29,
  "estimatedTime": "30-60 mins",
  "realWorldUse": "Various software engineering applications",
  "problemStatement": "给定一个字符串，请你找出其中不含有重复字符的 **最长子串** 的长度。\n\n**示例 1:**\n\n```java\n输入: \"abcabcbb\"\n输出: 3 \n解释: 因为无重复字符的最长子串是 \"abc\"，所以其长度为 3。\n```",
  "examples": [
    {
      "input": "### 题目解析",
      "output": "",
      "explanation": "建立一个256位大小的整型数组 freg ，用来建立字符和其出现位置之间的映射。  维护一个滑动窗口，窗口内的都是没有重复的字符，去尽可能的扩大窗口的大小，窗口不停的向右滑动。  - （1）如果当前遍历到的字符从未出现过，那么直接扩大右边界； - （2）如果当前遍历到的字符出现过，则缩小窗口（左边索引向右移动），然后继续观察当前遍历到的字符； - （3）重复（1）（2），直到左边索引无法再移动； - （4）维护一个结果res，每次用出现过的窗口大小来更新结果 res，最后返回 res 获取结果。  ### 动画描述  ![动画描述](https://blog-1257126549.cos.ap-guangzhou.myqcloud.com/blog/20ahe.gif)  ### 代码实现"
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
    "acceptanceRate": "29.0% ",
    "frequency": 85,
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