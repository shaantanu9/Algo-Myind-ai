"use client"

import { AlgorithmDetailPage } from "@/components/algorithm-detail-page"

// Algorithm data for partition-list
const algorithmData = {
  "id": "partition-list",
  "problemId": 86,
  "title": "Partition List",
  "description": "A linked list algorithm that uses iterative approach to solve the problem with O(n) time complexity.",
  "difficulty": "Easy",
  "category": "Linked List",
  "timeComplexity": "O(n)",
  "spaceComplexity": "O(1)",
  "popularity": 75,
  "estimatedTime": "15-30 min",
  "realWorldUse": "Memory management, undo functionality, browser history",
  "problemStatement": "Given a linked list, traverse and modify nodes to achieve the desired result.",
  "examples": [
    {
      "input": "[1, 2, 3, 4, 5]",
      "output": "[1, 3, 5]",
      "explanation": "Returns nodes with odd indices from the linked list"
    }
  ],
  "analogy": {
    "title": "Train Car Rearrangement",
    "content": "Imagine rearranging train cars on a track. Each car is connected to the next, and you need to reorganize them according to specific rules, just like manipulating nodes in a linked list."
  },
  "keyInsights": [
    "This is a linked list algorithm that demonstrates efficient data structure usage",
    "Time complexity of O(n) shows the importance of algorithm optimization"
  ],
  "realWorldApplications": [
    {
      "domain": "Operating Systems",
      "application": "Memory Management",
      "description": "Managing free memory blocks in dynamic allocation"
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
      "code": "/**\n * 86. Partition List\n * https://leetcode.com/problems/partition-list/\n * Difficulty: Medium\n *\n * Given the head of a linked list and a value x, partition it such that\n * all nodes less than x come before nodes greater than or equal to x.\n *\n * You should preserve the original relative order of the nodes in each\n * of the two partitions.\n */\n\n/**\n * @param {ListNode} head\n * @param {number} x\n * @return {ListNode}\n */\nvar partition = function(head, x) {\n  const result = [];\n  const stack = [];\n\n  while (head) {\n    const target = head.val >= x ? result : stack;\n    target.push(head.val);\n    head = head.next;\n  }\n\n  return [...stack, ...result].reverse().reduce((a, b) => {\n    return new ListNode(b, a);\n  }, null);\n};\n"
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
        "status": "initialized"
      }
    },
    {
      "step": 2,
      "title": "Main Loop",
      "description": "Iterate through the main data structure",
      "data": {
        "status": "iterating",
        "index": 0
      }
    },
    {
      "step": 3,
      "title": "Processing",
      "description": "Execute the core algorithm logic",
      "data": {
        "status": "processing"
      }
    },
    {
      "step": 4,
      "title": "Result",
      "description": "Return the final computed result",
      "data": {
        "status": "complete",
        "result": "computed"
      }
    }
  ],
  "animation": {
    "interactiveData": {
      "algorithmType": "linked-list",
      "dataStructure": "Linked List",
      "keyOperations": [
        "Pointer movement",
        "Node traversal",
        "Pointer manipulation"
      ],
      "visualizationHints": "Show linked list operations and data flow"
    }
  },
  "metadata": {
    "tags": [
      "Linked List",
      "Two Pointers"
    ],
    "acceptanceRate": "50%",
    "frequency": 50
  },
  "lastModified": 1758386283547
}

export default function partitionlistPage() {
  return <AlgorithmDetailPage algorithm={algorithmData} />
}