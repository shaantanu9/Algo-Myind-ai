import { AlgorithmDetailPage } from "@/components/algorithm-detail-page"
import { notFound } from "next/navigation"
import { LocalStorageManager } from "@/lib/local-storage-manager"
import { AlgorithmContentLoader } from "@/lib/algorithm-content-loader"

interface PageProps {
  params: {
    id: string
  }
}

export default async function AlgorithmPage({ params }: PageProps) {
  const { id } = params

  // Priority order: localStorage -> hardcoded data -> not found
  let algorithm = null

  // 1. Try to get from localStorage first
  try {
    const localStorageAlgorithm = LocalStorageManager.loadAlgorithm(id)
    if (localStorageAlgorithm) {
      console.log(`📦 Loaded algorithm "${id}" from localStorage`)
      algorithm = localStorageAlgorithm
    }
  } catch (error) {
    console.warn(`Failed to load algorithm "${id}" from localStorage:`, error)
  }

  // 2. If not found in localStorage, try hardcoded data (for Two Sum and Shortest Palindrome)
  if (!algorithm && id === "two-sum") {
    const hardcodedAlgorithm = {
      id: "two-sum",
      problemId: 1,
      title: "Two Sum",
      description: "Find two numbers in an array that add up to a target sum",
      difficulty: "Easy",
      category: "Array",
      timeComplexity: "O(n)",
      spaceComplexity: "O(n)",
      popularity: 95,
      estimatedTime: "15 min",
      realWorldUse: "E-commerce recommendation systems, financial transaction matching",
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
      animation: {
        interactiveData: {
          algorithmType: "Array",
          dataStructure: "Hash Map",
          keyOperations: ["Hash lookup", "Array iteration", "Complement calculation"],
          visualizationHints: "Show hash map operations and array traversal"
        }
      },
      metadata: {
        tags: ["Array", "Hash Map", "Two Pointers"],
        acceptanceRate: "49.1%",
        frequency: 85
      }
    }
    algorithm = hardcodedAlgorithm
  }

  // Add hardcoded data for shortest-palindrome
  if (!algorithm && id === "shortest-palindrome") {
    const shortestPalindromeAlgorithm = {
      id: "shortest-palindrome",
      problemId: 214,
      title: "Shortest Palindrome by Front Addition",
      description: "Given a string s, the goal is to transform it into the shortest possible palindrome by adding characters only at the front of s. The algorithm finds the minimal prefix to prepend so that the resulting string reads the same forwards and backwards.",
      difficulty: "Hard",
      category: "String Manipulation",
      timeComplexity: "O(n^2)",
      spaceComplexity: "O(n)",
      popularity: 85,
      estimatedTime: "10-15 minutes",
      realWorldUse: "This algorithm can be used in data validation, DNA sequence analysis, or text correction where palindromic structures are relevant, such as in error detection or pattern recognition.",
      problemStatement: "Given a string s, you can add characters in front of it to make it a palindrome. Find the shortest such palindrome by performing this transformation, i.e., prepend as few characters as possible to s to make the entire string a palindrome.",
      examples: [
        {
          input: "aacecaaa",
          output: "aaacecaaa",
          explanation: "Prepending 'a' makes the string a palindrome."
        },
        {
          input: "abcd",
          output: "dcbabcd",
          explanation: "Prepending 'dcb' results in a palindrome."
        }
      ],
      analogy: {
        title: "Mirror Reflection Puzzle",
        content: "Imagine you have a string of beads, and you want to create a perfect mirror image starting from the front. You reverse the entire string and then check how much of the original string matches the end of this reversed version. The part that doesn't match needs to be added in front to complete the mirror image, resulting in the shortest symmetrical necklace."
      },
      keyInsights: [
        "Reversing the string helps identify the largest palindromic prefix.",
        "Checking decreasing prefixes from the full length down to 1 ensures finding the minimal prefix to prepend.",
        "String slicing and comparison are used to verify palindrome prefixes efficiently.",
        "The approach relies on string equality checks rather than more complex algorithms like KMP."
      ],
      realWorldApplications: [
        {
          domain: "Text Processing",
          application: "Auto-correct or auto-complete systems that suggest palindromic completions.",
          description: "Enhancing user input by automatically converting strings into palindromes for aesthetic or cryptographic purposes."
        },
        {
          domain: "Bioinformatics",
          application: "DNA sequence analysis for palindromic motifs.",
          description: "Identifying minimal additions needed to form palindromic DNA sequences for genetic research."
        }
      ],
      engineeringLessons: [
        {
          principle: "String Reversal and Slicing",
          lesson: "Using string reversal and slicing to efficiently compare prefixes and suffixes.",
          application: "Optimizing string matching algorithms in text editors or search engines."
        },
        {
          principle: "Iterative Decreasing Checks",
          lesson: "Decreasing loop from string length to 1 ensures minimal addition.",
          application: "Designing algorithms that find optimal solutions by incremental checks."
        }
      ],
      implementations: {
        bruteForce: {
          title: "Naive Palindrome Construction by Prefix Addition",
          timeComplexity: "O(n^3)",
          spaceComplexity: "O(n)",
          code: "function bruteForceShortestPalindrome(s) {\n  if (s === s.split('').reverse().join('')) return s;\n  for (let i = 0; i < s.length; i++) {\n    const prefix = s.slice(0, i);\n    const candidate = prefix + s;\n    if (candidate === candidate.split('').reverse().join('')) {\n      return candidate;\n    }\n  }\n  return s;\n}"
        },
        optimized: {
          title: "Efficient Shortest Palindrome via Reversal and Slicing",
          timeComplexity: "O(n^2)",
          spaceComplexity: "O(n)",
          code: "var shortestPalindrome = function(s) {\n  const reversed = s.split('').reverse().join('');\n  for (let i = s.length; i > 0; i--) {\n    if (s.slice(0, i) === reversed.slice(s.length - i)) {\n      return reversed.slice(0, reversed.length - i) + s;\n    }\n  }\n  return '';\n};"
        }
      },
      animationStates: [
        {
          step: 1,
          title: "Reverse the String",
          description: "Create a reversed version of the input string to compare prefixes and suffixes.",
          data: {
            original: "s",
            reversed: "reversed_s"
          }
        },
        {
          step: 2,
          title: "Iterate from Full Length Down to 1",
          description: "Check decreasing prefixes of s against corresponding suffixes of reversed_s.",
          data: {
            i: "current prefix length",
            s_slice: "s.slice(0, i)",
            reversed_slice: "reversed.slice(s.length - i)"
          }
        },
        {
          step: 3,
          title: "Compare Prefix and Suffix",
          description: "If the prefix of s matches the suffix of reversed_s, prepend the unmatched part of reversed_s.",
          data: {
            match: "true/false",
            result: "shortest palindrome"
          }
        }
      ],
      animation: {
        interactiveData: {
          algorithmType: "String Comparison",
          dataStructure: "Strings",
          keyOperations: [
            "reverse",
            "slice",
            "compare"
          ],
          visualizationHints: "Highlight matching prefixes and suffixes, animate reversal and slicing steps."
        }
      },
      metadata: {
        tags: [
          "string",
          "palindrome",
          "string manipulation",
          "optimization"
        ],
        acceptanceRate: "45.0%",
        frequency: 78
      }
    }
    algorithm = shortestPalindromeAlgorithm
  }

  // 3. If still not found, check if it's a problem ID (numeric)
  if (!algorithm) {
    const problemId = parseInt(id)
    if (!isNaN(problemId)) {
      try {
        // Try to get from localStorage by problem ID
        const localStorageAlgorithm = LocalStorageManager.loadAlgorithmByProblemId(problemId)
        if (localStorageAlgorithm) {
          console.log(`📦 Loaded algorithm by problem ID "${problemId}" from localStorage`)
          algorithm = localStorageAlgorithm
        }
      } catch (error) {
        console.warn(`Failed to load algorithm by problem ID "${problemId}":`, error)
      }
    }
  }

  // 4. If still not found, try the algorithm content loader
  if (!algorithm) {
    try {
      const loadedAlgorithm = await AlgorithmContentLoader.loadAlgorithm(id)
      if (loadedAlgorithm) {
        console.log(`📦 Loaded algorithm "${id}" from algorithm content loader`)
        algorithm = loadedAlgorithm
      }
    } catch (error) {
      console.warn(`Failed to load algorithm "${id}" from content loader:`, error)
    }
  }

  if (!algorithm) {
    console.log(`❌ Algorithm "${id}" not found in localStorage, hardcoded data, or content loader`)
    notFound()
  }

  console.log(`✅ Successfully loaded algorithm: ${algorithm.title} (${algorithm.id})`)

  return <AlgorithmDetailPage algorithm={algorithm as any} />
}

export async function generateStaticParams() {
  // Generate static params for hardcoded algorithms
  const staticIds = ["two-sum", "shortest-palindrome"]

  // Also include localStorage algorithms if available (during build time)
  try {
    if (typeof window !== 'undefined') {
      const localStorageAlgorithms = LocalStorageManager.loadAllAlgorithms()
      const localStorageIds = localStorageAlgorithms.map(algo => algo.id)
      return [...staticIds, ...localStorageIds].map(id => ({ id }))
    }
  } catch (error) {
    console.warn('Could not load localStorage algorithms for static generation:', error)
  }

  return staticIds.map(id => ({ id }))
}
