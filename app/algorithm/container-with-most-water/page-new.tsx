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

export default function ContainerwithmostwaterPage() {
  return <AlgorithmDetailPage algorithm={algorithmData} />
}
