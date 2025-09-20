'use client'

import { AlgorithmDetailPage } from '@/components/algorithm-detail-page'

const algorithmData = {
  "id": "leetcode-1",
  "problemId": 1,
  "title": "两数之和",
  "description": "给定一个整数数组 `nums` 和一个目标值 `target`，请你在该数组中找出和为目标值的那 **两个** 整数，并返回他们的数组下标。\n\n你可以假设每种输入只会对应一个答案。但是，你不能重复利用这个数组中同样的元素。\n\n**示例:**\n\n```\n给定 nums = [2, 7, 11, 15], target = 9\n\n因为 nums[0] + nums[1] = 2 + 7 = 9\n所以返回 [0, 1]\n```",
  "difficulty": "Easy",
  "category": "Array & Hash Table",
  "timeComplexity": "O(n)",
  "spaceComplexity": "O(n)",
  "popularity": 45.8,
  "estimatedTime": "15-30 mins",
  "realWorldUse": "Various software engineering applications",
  "problemStatement": "给定一个整数数组 `nums` 和一个目标值 `target`，请你在该数组中找出和为目标值的那 **两个** 整数，并返回他们的数组下标。\n\n你可以假设每种输入只会对应一个答案。但是，你不能重复利用这个数组中同样的元素。\n\n**示例:**\n\n```\n给定 nums = [2, 7, 11, 15], target = 9\n\n因为 nums[0] + nums[1] = 2 + 7 = 9\n所以返回 [0, 1]\n```",
  "examples": [
    {
      "input": "nums = [2, 7, 11, 15], target = 9",
      "output": "[0, 1]",
      "explanation": "nums[0] + nums[1] = 2 + 7 = 9 [0, 1]"
    }
  ],
  "analogy": {
    "title": "Finding Perfect Matches",
    "content": "Like finding two puzzle pieces that fit perfectly together, we're looking for two numbers that sum to exactly the target value. Just as you might organize puzzle pieces by shape, we use a hash map to quickly find the complement we need."
  },
  "keyInsights": [
    "Hash maps provide O(1) average case lookup time",
    "Trade space for time - store complements for quick access",
    "One-pass solution avoids multiple iterations",
    "Handle edge cases like duplicate values carefully"
  ],
  "realWorldApplications": [],
  "engineeringLessons": [],
  "implementations": {
    "optimized": {
      "title": "Optimized Solution",
      "timeComplexity": "O(n)",
      "spaceComplexity": "O(n)",
      "code": "// 1. Two Sum\n// https://leetcode.com/problems/two-sum/description/\n// 时间复杂度：O(n)\n// 空间复杂度：O(n)\nclass Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        unordered_map<int,int> record;\n        for(int i = 0 ; i < nums.size() ; i ++){\n       \n            int complement = target - nums[i];\n            if(record.find(complement) != record.end()){\n                int res[] = {i, record[complement]};\n                return vector<int>(res, res + 2);\n            }\n\n            record[nums[i]] = i;\n        }\n        return {};\n    }\n};",
      "explanation": "使用查找表来解决该问题。\n\n设置一个 map 容器 record 用来记录元素的值与索引，然后遍历数组 nums。\n\n* 每次遍历时使用临时变量 complement 用来保存目标值与当前值的差值\n* 在此次遍历中查找 record ，查看是否有与 complement 一致的值，如果查找成功则返回查找值的索引值与当前变量的值 i\n* 如果未找到，则在 record 保存该元素与索引值 i",
      "whenToUse": "Production code, large datasets"
    },
    "alternative": {
      "title": "Java Implementation",
      "timeComplexity": "O(n)",
      "spaceComplexity": "O(n)",
      "code": "// 1. Two Sum\n// https://leetcode.com/problems/two-sum/description/\n// 时间复杂度：O(n)\n// 空间复杂度：O(n)\nclass Solution {\n    public int[] twoSum(int[] nums, int target) {\n        int l = nums.length;\n        int[] ans=new int[2];\n        int i,j;\n        for(i=0;i<l-1;i++)\n        {\n            for(j=i+1;j<l;j++)\n            {\n                if(nums[i]+nums[j] == target)\n                {\n                    ans[0]=i;\n                    ans[1]=j;\n                }\n            }\n        }\n        \n        return ans;\n        \n    }\n}",
      "explanation": "Alternative implementation in Java",
      "whenToUse": "Java-based projects"
    }
  },
  "animationStates": [],
  "metadata": {
    "tags": [
      "LeetCode"
    ],
    "acceptanceRate": "45.8% ",
    "frequency": 79,
    "similarProblems": [],
    "difficultyBreakdown": {
      "understanding": "Straightforward",
      "implementation": "Simple loops and data structures",
      "optimization": "Basic time/space complexity"
    }
  },
  "educationalContent": {
    "analogy": {
      "title": "Finding Perfect Matches",
      "content": "Like finding two puzzle pieces that fit perfectly together, we're looking for two numbers that sum to exactly the target value. Just as you might organize puzzle pieces by shape, we use a hash map to quickly find the complement we need."
    },
    "keyInsights": [
      "Hash maps provide O(1) average case lookup time",
      "Trade space for time - store complements for quick access",
      "One-pass solution avoids multiple iterations",
      "Handle edge cases like duplicate values carefully"
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