"use client"

import { AlgorithmDetailPage } from "@/components/algorithm-detail-page"

// Algorithm data for remove-nth-node-from-end-of-list
const algorithmData = {
  "id": "remove-nth-node-from-end-of-list",
  "problemId": 19,
  "title": "Remove Nth Node From End Of List",
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
      "code": "/**\n * 19. Remove Nth Node From End of List\n * https://leetcode.com/problems/remove-nth-node-from-end-of-list/\n * Difficulty: Medium\n *\n * Given the head of a linked list, remove the nth node from the end of the list\n * and return its head.\n */\n\n/**\n * Definition for singly-linked list.\n * function ListNode(val, next) {\n *     this.val = (val===undefined ? 0 : val)\n *     this.next = (next===undefined ? null : next)\n * }\n */\n/**\n * @param {ListNode} head\n * @param {number} n\n * @return {ListNode}\n */\nvar removeNthFromEnd = function(head, n) {\n  const result = new ListNode();\n  let slow = result;\n  let fast = result;\n  slow.next = head;\n\n  for (let i = 0; i <= n; i++) {\n    fast = fast.next;\n  }\n\n  while (fast) {\n    fast = fast.next;\n    slow = slow.next;\n  }\n\n  slow.next = slow.next.next;\n\n  return result.next;\n};\n"
    },
    "bruteForce": {
      "title": "Brute Force Approach",
      "timeComplexity": "O(n²)",
      "spaceComplexity": "O(1)",
      "code": "// Brute force approach with nested loops"
    }
  },
  "animationStates": [
    {
      "step": 1,
      "title": "Initialize Pointers",
      "description": "Create dummy nodes and set up traversal pointers",
      "data": {
        "lessHead": {
          "value": 0,
          "next": null
        },
        "greaterHead": {
          "value": 0,
          "next": null
        },
        "less": {
          "value": 0,
          "next": null
        },
        "greater": {
          "value": 0,
          "next": null
        },
        "currentNode": null,
        "partitionValue": 3
      }
    },
    {
      "step": 2,
      "title": "Traverse List",
      "description": "Iterate through each node and partition based on value",
      "data": {
        "currentNode": {
          "value": 1,
          "next": {
            "value": 4,
            "next": {
              "value": 3,
              "next": {
                "value": 2,
                "next": {
                  "value": 5,
                  "next": null
                }
              }
            }
          }
        },
        "partitionValue": 3,
        "lessList": [
          {
            "value": 1
          },
          {
            "value": 2
          }
        ],
        "greaterList": [
          {
            "value": 4
          },
          {
            "value": 3
          },
          {
            "value": 5
          }
        ],
        "currentIndex": 0
      }
    },
    {
      "step": 3,
      "title": "Build Less-Than List",
      "description": "Connect nodes with values less than partition value",
      "data": {
        "less": {
          "value": 1,
          "next": {
            "value": 2,
            "next": null
          }
        },
        "lessList": [
          {
            "value": 1
          },
          {
            "value": 2
          }
        ],
        "partitionValue": 3
      }
    },
    {
      "step": 4,
      "title": "Build Greater-Than List",
      "description": "Connect nodes with values greater than or equal to partition value",
      "data": {
        "greater": {
          "value": 4,
          "next": {
            "value": 3,
            "next": {
              "value": 5,
              "next": null
            }
          }
        },
        "greaterList": [
          {
            "value": 4
          },
          {
            "value": 3
          },
          {
            "value": 5
          }
        ],
        "partitionValue": 3
      }
    },
    {
      "step": 5,
      "title": "Merge Lists",
      "description": "Connect the less-than list to the greater-than list",
      "data": {
        "finalList": [
          1,
          2,
          4,
          3,
          5
        ],
        "less": {
          "value": 1,
          "next": {
            "value": 2,
            "next": {
              "value": 4,
              "next": {
                "value": 3,
                "next": {
                  "value": 5,
                  "next": null
                }
              }
            }
          }
        },
        "partitionValue": 3
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
  "lastModified": 1758388954705
}

export default function removenthnodefromendoflistPage() {
  return <AlgorithmDetailPage algorithm={algorithmData} />
}