import { AlgorithmDetailPage } from "@/components/algorithm-detail-page"
import { notFound } from "next/navigation"

// This would normally come from a database or API
const ALGORITHM_DATA = {
  "two-sum": {
    id: "two-sum",
    title: "Two Sum",
    description: "Find two numbers in an array that add up to a target sum",
    difficulty: "Easy",
    category: "Array",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    popularity: 95,
    estimatedTime: "15 min",
    realWorldUse: "E-commerce recommendation systems, financial transaction matching",

    // Core algorithm content
    problemStatement: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.`,

    examples: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1].",
      },
      {
        input: "nums = [3,2,4], target = 6",
        output: "[1,2]",
        explanation: "Because nums[1] + nums[2] == 6, we return [1, 2].",
      },
    ],

    // AI-generated content sections
    analogy: {
      title: "Real-World Analogy: Finding Dance Partners",
      content: `Imagine you're organizing a dance competition where each dancer has a skill level (number), and you need to find pairs whose combined skill levels equal exactly 10 points.

**The Naive Approach (Brute Force):** You'd ask each dancer to try dancing with every other dancer until you find a perfect match. This is like checking every possible pair in the array - slow and inefficient!

**The Smart Approach (Hash Map):** Instead, you create a "compatibility board" where you write down what skill level each dancer needs in a partner. As each dancer arrives, you check the board - if someone already needs their exact skill level, you've found a match instantly!

This is exactly how the Two Sum algorithm works - the hash map is your "compatibility board" that remembers what numbers you're looking for.`,
    },

    keyInsights: [
      "Hash maps trade space for time - we use O(n) extra space to achieve O(n) time complexity",
      "The complement approach: instead of checking all pairs, we look for the 'missing piece'",
      "One-pass solution: we can build the hash map and find the answer simultaneously",
      "This pattern applies to many 'find pair that satisfies condition' problems",
    ],

    realWorldApplications: [
      {
        domain: "E-commerce",
        application: "Product recommendation systems",
        description: "Find products that together meet a customer's budget or combine to create bundles",
      },
      {
        domain: "Finance",
        application: "Transaction matching",
        description: "Match debit and credit transactions, or find transactions that sum to suspicious amounts",
      },
      {
        domain: "Gaming",
        application: "Team balancing",
        description: "Match players with complementary skill levels to create balanced teams",
      },
      {
        domain: "Logistics",
        application: "Load optimization",
        description: "Find packages that together fill a container to optimal capacity",
      },
    ],

    engineeringLessons: [
      {
        principle: "Space-Time Tradeoffs",
        lesson: "Sometimes using more memory can dramatically improve performance",
        application: "Consider caching, memoization, and lookup tables in system design",
      },
      {
        principle: "Hash-based Optimization",
        lesson: "Hash maps provide O(1) average lookup time for key-value relationships",
        application: "Use hash maps for deduplication, caching, and fast lookups in distributed systems",
      },
      {
        principle: "Complement Thinking",
        lesson: "Instead of checking all combinations, think about what you need to complete the solution",
        application: "API design, database queries, and system integration patterns",
      },
    ],

    implementations: {
      bruteForce: {
        title: "Brute Force Approach",
        timeComplexity: "O(n²)",
        spaceComplexity: "O(1)",
        code: `function twoSum(nums, target) {
    for (let i = 0; i < nums.length; i++) {
        for (let j = i + 1; j < nums.length; j++) {
            if (nums[i] + nums[j] === target) {
                return [i, j];
            }
        }
    }
    return [];
}`,
      },
      optimized: {
        title: "Hash Map Approach (Optimized)",
        timeComplexity: "O(n)",
        spaceComplexity: "O(n)",
        code: `function twoSum(nums, target) {
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
      },
    },

    // Animation states for Mermaid and Three.js
    animationStates: [
      {
        step: 1,
        title: "Initialize",
        description: "Start with empty hash map and first element",
        data: { array: [2, 7, 11, 15], target: 9, currentIndex: 0, hashMap: {}, complement: 7 },
      },
      {
        step: 2,
        title: "Check complement",
        description: "Look for complement (7) in hash map - not found",
        data: { array: [2, 7, 11, 15], target: 9, currentIndex: 0, hashMap: {}, complement: 7, found: false },
      },
      {
        step: 3,
        title: "Store current",
        description: "Add current number and index to hash map",
        data: { array: [2, 7, 11, 15], target: 9, currentIndex: 0, hashMap: { 2: 0 }, complement: 7 },
      },
      {
        step: 4,
        title: "Next element",
        description: "Move to next element (7), calculate complement (2)",
        data: { array: [2, 7, 11, 15], target: 9, currentIndex: 1, hashMap: { 2: 0 }, complement: 2 },
      },
      {
        step: 5,
        title: "Found match!",
        description: "Complement (2) exists in hash map - return indices [0, 1]",
        data: {
          array: [2, 7, 11, 15],
          target: 9,
          currentIndex: 1,
          hashMap: { 2: 0 },
          complement: 2,
          found: true,
          result: [0, 1],
        },
      },
    ],
  },
  // Add more algorithms here...
}

interface PageProps {
  params: {
    id: string
  }
}

export default function AlgorithmPage({ params }: PageProps) {
  const algorithm = ALGORITHM_DATA[params.id as keyof typeof ALGORITHM_DATA]

  if (!algorithm) {
    notFound()
  }

  return <AlgorithmDetailPage algorithm={algorithm} />
}

export function generateStaticParams() {
  return Object.keys(ALGORITHM_DATA).map((id) => ({
    id,
  }))
}
