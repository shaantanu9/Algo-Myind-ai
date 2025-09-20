/**
 * ALGORITHM CONTENT LOADER
 * Unified loader for JavaScript solutions and animation content
 */

// import * as fs from 'fs'
// import * as path from 'path'
import { ParsedAlgorithm } from './algorithm-parser'
import { LocalStorageManager } from './local-storage-manager'

export interface UnifiedAlgorithmData {
  problemId: number
  title: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  category: string
  description: string
  timeComplexity: string
  spaceComplexity: string
  examples: Array<{
    input: string
    output: string
    explanation: string
  }>
  constraints: string[]
  solution: {
    javascript: string
    explanation: string
  }
  animation: {
    gifUrl?: string
    articleContent?: string
    interactiveData: any
  }
  metadata: {
    tags: string[]
    acceptanceRate: string
    frequency: number
  }
}

// ============================================================================
// 🎯 CONTENT LOADER
// ============================================================================

export class AlgorithmContentLoader {
  /**
   * Load complete algorithm data by problem ID
   */
  static async loadAlgorithm(problemId: number): Promise<UnifiedAlgorithmData | null> {
    // First, check localStorage for saved algorithms
    const localStorageData = LocalStorageManager.loadAlgorithmByProblemId(problemId)
    if (localStorageData) {
      console.log(`📦 Loaded algorithm ${problemId} from localStorage`)
      return localStorageData as UnifiedAlgorithmData
    }

    // Try to load from dynamic analysis
    const dynamicData = await this.loadFromDynamicAnalysis(problemId)
    if (dynamicData) {
      // Save to localStorage for future use
      LocalStorageManager.saveAlgorithm(dynamicData as any)
      return dynamicData
    }

    // Fallback to mock data for the 5 algorithms we support
    const mockData = this.getMockAlgorithmData(problemId)
    if (mockData) {
      // Save mock data to localStorage as well
      LocalStorageManager.saveAlgorithm(mockData as any)
    }
    return mockData || null
  }

  /**
   * Load algorithm data using dynamic analysis of the solution file
   */
  private static async loadFromDynamicAnalysis(problemId: number): Promise<UnifiedAlgorithmData | null> {
    try {
      // For now, let's create a dynamic analyzer that can handle the add-two-numbers algorithm
      if (problemId === 2) {
        return this.analyzeAddTwoNumbers()
      }

      // Add more algorithms here as we implement them
      return null
    } catch (error) {
      console.warn(`Dynamic analysis failed for problem ${problemId}:`, error)
      return null
    }
  }

  /**
   * Analyze the Add Two Numbers algorithm and generate animation data
   */
  private static analyzeAddTwoNumbers(): UnifiedAlgorithmData {
    return {
      problemId: 2,
      title: 'Add Two Numbers',
      difficulty: 'Medium',
      category: 'Linked List',
      description: 'You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.',
      timeComplexity: 'O(max(m,n))',
      spaceComplexity: 'O(max(m,n))',
      examples: [
        {
          input: 'l1 = [2,4,3], l2 = [5,6,4]',
          output: '[7,0,8]',
          explanation: '342 + 465 = 807'
        },
        {
          input: 'l1 = [0], l2 = [0]',
          output: '[0]',
          explanation: '0 + 0 = 0'
        }
      ],
      constraints: [
        'The number of nodes in each linked list is in the range [1, 100]',
        '0 <= Node.val <= 9',
        'It is guaranteed that the list represents a number that does not have leading zeros'
      ],
      solution: {
        javascript: `function addTwoNumbers(l1, l2) {
  const result = new ListNode();
  let tail = result;
  let carry = 0;

  while (l1 || l2 || carry) {
    const val1 = l1 ? l1.val : 0;
    const val2 = l2 ? l2.val : 0;
    const sum = val1 + val2 + carry;

    tail.next = new ListNode(sum % 10);
    tail = tail.next;
    carry = Math.floor(sum / 10);

    l1 = l1 ? l1.next : null;
    l2 = l2 ? l2.next : null;
  }

  return result.next;
}`,
        explanation: 'This solution iterates through both linked lists simultaneously, adding corresponding digits and handling carry. Time Complexity: O(max(m,n)), Space Complexity: O(max(m,n))'
      },
      animation: {
        gifUrl: undefined,
        articleContent: '# Add Two Numbers\n\nAdding two numbers represented as linked lists...',
        interactiveData: {
          list1: [2, 4, 3],
          list2: [5, 6, 4],
          current1: 0,
          current2: 0,
          carry: 0,
          result: [],
          step: 0
        }
      },
      metadata: {
        tags: ['Linked List', 'Math', 'Recursion'],
        acceptanceRate: '37.1%',
        frequency: 80
      }
    }
  }

  /**
   * Get mock algorithm data for the 5 supported algorithms
   */
  private static getMockAlgorithmData(problemId: number): UnifiedAlgorithmData | null {
    const mockAlgorithms: Record<number, UnifiedAlgorithmData> = {
      1: {
        problemId: 1,
        title: 'Two Sum',
        difficulty: 'Easy',
        category: 'Array',
        description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(n)',
        examples: [
          {
            input: 'nums = [2,7,11,15], target = 9',
            output: '[0,1]',
            explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].'
          },
          {
            input: 'nums = [3,2,4], target = 6',
            output: '[1,2]',
            explanation: 'Because nums[1] + nums[2] == 6, we return [1, 2].'
          }
        ],
        constraints: ['2 <= nums.length <= 10^4', '-10^9 <= nums[i] <= 10^9', '-10^9 <= target <= 10^9'],
        solution: {
          javascript: `function twoSum(nums, target) {
  const map = new Map();

  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];

    if (map.has(complement)) {
      return [map.get(complement), i];
    }

    map.set(nums[i], i);
  }

  return [];
}`,
          explanation: 'This solution uses a HashMap to store elements and their indices for O(1) lookups. Time Complexity: O(n), Space Complexity: O(n)'
        },
        animation: {
          gifUrl: undefined, // Will be loaded from LeetCodeAnimation-master
          articleContent: '# Two Sum Algorithm\n\nThe Two Sum problem can be solved efficiently using a hash map...',
          interactiveData: {
            array: [2, 7, 11, 15],
            target: 9,
            currentIndex: 0,
            hashMap: {},
            found: false,
            result: []
          }
        },
        metadata: {
          tags: ['Array', 'Hash Table', 'Two Pointers'],
          acceptanceRate: '50.5%',
          frequency: 85
        }
      },

      11: {
        problemId: 11,
        title: 'Container With Most Water',
        difficulty: 'Medium',
        category: 'Array',
        description: 'Given n non-negative integers a1, a2, ..., an , where each represents a point at coordinate (i, ai). n vertical lines are drawn such that the two endpoints of the line i is at (i, ai) and (i, 0). Find two lines, which, together with the x-axis forms a container, such that the container contains the most water.',
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(1)',
        examples: [
          {
            input: 'height = [1,8,6,2,5,4,8,3,7]',
            output: '49',
            explanation: 'The above vertical lines are represented by array [1,8,6,2,5,4,8,3,7]. In this case, the max area of water (blue section) the container can contain is 49.'
          }
        ],
        constraints: ['n == height.length', '2 <= n <= 10^5', '0 <= height[i] <= 10^4'],
        solution: {
          javascript: `function maxArea(height) {
  let left = 0;
  let right = height.length - 1;
  let maxArea = 0;

  while (left < right) {
    const currentArea = Math.min(height[left], height[right]) * (right - left);
    maxArea = Math.max(maxArea, currentArea);

    if (height[left] < height[right]) {
      left++;
    } else {
      right--;
    }
  }

  return maxArea;
}`,
          explanation: 'This solution uses a two-pointer approach starting from both ends. Time Complexity: O(n), Space Complexity: O(1)'
        },
        animation: {
          gifUrl: undefined,
          articleContent: '# Container With Most Water\n\nUsing two pointers to find the maximum area...',
          interactiveData: {
            height: [1, 8, 6, 2, 5, 4, 8, 3, 7],
            left: 0,
            right: 8,
            maxArea: 0,
            currentArea: 0
          }
        },
        metadata: {
          tags: ['Array', 'Two Pointers', 'Greedy'],
          acceptanceRate: '54.1%',
          frequency: 75
        }
      },

      20: {
        problemId: 20,
        title: 'Valid Parentheses',
        difficulty: 'Easy',
        category: 'String',
        description: 'Given a string s containing just the characters \'(\', \')\', \'{\', \'}\', \'[\' and \']\', determine if the input string is valid.',
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(n)',
        examples: [
          {
            input: 's = "()"',
            output: 'true',
            explanation: 'Valid parentheses'
          },
          {
            input: 's = "(]"',
            output: 'false',
            explanation: 'Invalid parentheses'
          }
        ],
        constraints: ['1 <= s.length <= 10^4', 's consists of parentheses only \'()[]{}'],
        solution: {
          javascript: `function isValid(s) {
  const stack = [];
  const map = {
    ')': '(',
    '}': '{',
    ']': '['
  };

  for (const char of s) {
    if (char in map) {
      if (stack.length === 0 || stack[stack.length - 1] !== map[char]) {
        return false;
      }
      stack.pop();
    } else {
      stack.push(char);
    }
  }

  return stack.length === 0;
}`,
          explanation: 'This solution uses a stack to track opening brackets and validates closing brackets. Time Complexity: O(n), Space Complexity: O(n)'
        },
        animation: {
          gifUrl: undefined,
          articleContent: '# Valid Parentheses\n\nUsing stack to validate bracket sequences...',
          interactiveData: {
            string: '()[]{}',
            stack: [],
            currentIndex: 0,
            isValid: true
          }
        },
        metadata: {
          tags: ['String', 'Stack', 'Parentheses'],
          acceptanceRate: '40.2%',
          frequency: 80
        }
      },

      21: {
        problemId: 21,
        title: 'Merge Two Sorted Lists',
        difficulty: 'Easy',
        category: 'Linked List',
        description: 'Merge two sorted linked lists and return it as a sorted list.',
        timeComplexity: 'O(n + m)',
        spaceComplexity: 'O(1)',
        examples: [
          {
            input: 'list1 = [1,2,4], list2 = [1,3,4]',
            output: '[1,1,2,3,4,4]',
            explanation: 'Merge the two sorted lists'
          }
        ],
        constraints: ['The number of nodes in both lists is in the range [0, 50]', '-100 <= Node.val <= 100'],
        solution: {
          javascript: `function mergeTwoLists(list1, list2) {
  const dummy = new ListNode();
  let current = dummy;

  while (list1 && list2) {
    if (list1.val < list2.val) {
      current.next = list1;
      list1 = list1.next;
    } else {
      current.next = list2;
      list2 = list2.next;
    }
    current = current.next;
  }

  current.next = list1 || list2;
  return dummy.next;
}`,
          explanation: 'This solution iterates through both lists simultaneously, comparing values and building the merged list. Time Complexity: O(n + m), Space Complexity: O(1)'
        },
        animation: {
          gifUrl: undefined,
          articleContent: '# Merge Two Sorted Lists\n\nMerging linked lists by comparing values...',
          interactiveData: {
            list1: [1, 2, 4],
            list2: [1, 3, 4],
            result: [],
            current1: 0,
            current2: 0
          }
        },
        metadata: {
          tags: ['Linked List', 'Recursion', 'Two Pointers'],
          acceptanceRate: '61.3%',
          frequency: 70
        }
      },

      75: {
        problemId: 75,
        title: 'Sort Colors',
        difficulty: 'Medium',
        category: 'Array',
        description: 'Given an array nums with n objects colored red, white, or blue, sort them in-place so that objects of the same color are adjacent, with the colors in the order red, white, and blue.',
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(1)',
        examples: [
          {
            input: 'nums = [2,0,2,1,1,0]',
            output: '[0,0,1,1,2,2]',
            explanation: 'Sort the array in-place'
          }
        ],
        constraints: ['n == nums.length', '1 <= n <= 300', 'nums[i] is 0, 1, or 2'],
        solution: {
          javascript: `function sortColors(nums) {
  let low = 0;
  let high = nums.length - 1;
  let current = 0;

  while (current <= high) {
    if (nums[current] === 0) {
      [nums[current], nums[low]] = [nums[low], nums[current]];
      low++;
      current++;
    } else if (nums[current] === 2) {
      [nums[current], nums[high]] = [nums[high], nums[current]];
      high--;
    } else {
      current++;
    }
  }
}`,
          explanation: 'This solution uses the Dutch National Flag algorithm with three pointers. Time Complexity: O(n), Space Complexity: O(1)'
        },
        animation: {
          gifUrl: undefined,
          articleContent: '# Sort Colors - Dutch National Flag\n\nUsing three pointers to sort 0s, 1s, and 2s...',
          interactiveData: {
            array: [2, 0, 2, 1, 1, 0],
            currentIndex: 0,
            low: 0,
            high: 5
          }
        },
        metadata: {
          tags: ['Array', 'Two Pointers', 'Sorting'],
          acceptanceRate: '58.2%',
          frequency: 65
        }
      }
    }

    return mockAlgorithms[problemId] || null
  }

  /**
   * Get all available algorithms
   */
  static async getAvailableAlgorithms(): Promise<Array<{ id: number, title: string, hasSolution: boolean, hasAnimation: boolean }>> {
    // Start with default algorithms
    const defaultAlgorithms = [
      { id: 1, title: 'Two Sum', hasSolution: true, hasAnimation: true },
      { id: 11, title: 'Container With Most Water', hasSolution: true, hasAnimation: true },
      { id: 20, title: 'Valid Parentheses', hasSolution: true, hasAnimation: true },
      { id: 21, title: 'Merge Two Sorted Lists', hasSolution: true, hasAnimation: true },
      { id: 75, title: 'Sort Colors', hasSolution: true, hasAnimation: true }
    ]

    // Add algorithms from localStorage
    const localStorageAlgorithms = LocalStorageManager.loadAllAlgorithms().map(algo => ({
      id: algo.problemId,
      title: algo.title,
      hasSolution: true,
      hasAnimation: true
    }))

    // Combine and deduplicate
    const allAlgorithms = [...defaultAlgorithms]
    localStorageAlgorithms.forEach(localAlgo => {
      if (!allAlgorithms.some(defaultAlgo => defaultAlgo.id === localAlgo.id)) {
        allAlgorithms.push(localAlgo)
      }
    })

    console.log(`📋 Available algorithms: ${allAlgorithms.length} total (${defaultAlgorithms.length} default + ${localStorageAlgorithms.length} localStorage)`)
    return allAlgorithms
  }

  /**
   * Refresh algorithm cache (useful after adding new algorithms)
   */
  static refreshCache(): void {
    console.log('🔄 Refreshing algorithm cache...')
    // This is a simple cache refresh - in a real implementation you might want to invalidate specific caches
  }
}
