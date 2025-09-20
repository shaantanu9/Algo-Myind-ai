"use client"

import { AlgorithmDetailPage } from "@/components/algorithm-detail-page"

// Algorithm data for median-of-two-sorted-arrays
const algorithmData = {
  "id": "median-of-two-sorted-arrays",
  "problemId": 4,
  "title": "Median Of Two Sorted Arrays",
  "description": "A sorting algorithm that uses iterative approach to solve the problem with O(n log n) time complexity.",
  "difficulty": "Medium",
  "category": "Sorting",
  "timeComplexity": "O(n log n)",
  "spaceComplexity": "O(n)",
  "popularity": 75,
  "estimatedTime": "15-30 min",
  "realWorldUse": "Search optimization, data analysis, ranking systems",
  "problemStatement": "Arrange elements in a specific order using efficient sorting algorithms.",
  "examples": [
    {
      "input": "Sample input",
      "output": "Sample output",
      "explanation": "Generated based on algorithm analysis"
    }
  ],
  "analogy": {
    "title": "Algorithm Visualization",
    "content": "This algorithm processes data systematically to achieve the desired result, similar to how computers solve complex problems through step-by-step computation."
  },
  "keyInsights": [
    "This is a sorting algorithm that demonstrates efficient data structure usage",
    "Time complexity of O(n) shows the importance of algorithm optimization"
  ],
  "realWorldApplications": [
    {
      "domain": "Software Development",
      "application": "Data Processing",
      "description": "Efficient data manipulation and algorithm implementation"
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
      "code": "/**\n * 4. Median of Two Sorted Arrays\n * https://leetcode.com/problems/median-of-two-sorted-arrays/\n * Difficulty: Hard\n *\n * There are two sorted arrays nums1 and nums2 of size m and n respectively.\n *\n * Find the median of the two sorted arrays.\n * The overall run time complexity should be O(log (m+n)).\n *\n * You may assume nums1 and nums2 cannot be both empty.\n */\n\n/**\n * @param {number[]} nums1\n * @param {number[]} nums2\n * @return {number}\n */\nvar findMedianSortedArrays = function(nums1, nums2) {\n  const sorted = [...nums1, ...nums2].sort((a, b) => a - b);\n  const index = Math.floor((sorted.length - 1) / 2);\n\n  return sorted.length % 2 === 0\n    ? (sorted[index] + sorted[index + 1]) / 2\n    : sorted[index];\n};\n"
    },
    "bruteForce": {
      "title": "Brute Force Approach",
      "timeComplexity": "O(n)",
      "spaceComplexity": "O(1)",
      "code": "// Single pass approach"
    }
  },
  "animationStates": [
    {
      "step": 1,
      "title": "Initialization",
      "description": "Set up initial variables and data structures",
      "data": {
        "status": "initialized",
        "category": "Sorting"
      }
    },
    {
      "step": 2,
      "title": "Process Data",
      "description": "Execute the core algorithm logic",
      "data": {
        "status": "processing",
        "operations": 2
      }
    },
    {
      "step": 3,
      "title": "Compute Result",
      "description": "Calculate and prepare the final result",
      "data": {
        "status": "computing",
        "result": "pending"
      }
    },
    {
      "step": 4,
      "title": "Complete",
      "description": "Algorithm execution finished",
      "data": {
        "status": "complete",
        "result": "computed"
      }
    }
  ],
  "animation": {
    "interactiveData": {
      "algorithmType": "sorting",
      "dataStructure": "Sorting",
      "keyOperations": [
        "Pointer movement"
      ],
      "visualizationHints": "Show sorting operations and data flow"
    }
  },
  "metadata": {
    "tags": [
      "Sorting",
      "Two Pointers"
    ],
    "acceptanceRate": "50%",
    "frequency": 50
  },
  "lastModified": 1758390316280
}

export default function medianoftwosortedarraysPage() {
  return <AlgorithmDetailPage algorithm={algorithmData} />
}