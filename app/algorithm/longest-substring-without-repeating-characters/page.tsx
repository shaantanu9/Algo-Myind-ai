import { AlgorithmDetailPage } from "@/components/algorithm-detail-page"
import { LocalStorageManager } from "@/lib/local-storage-manager"

export const metadata = {
  title: "Longest Substring Without Repeating Characters - Algorithm Visualization",
  description: "Given a string `s`, the algorithm finds the length of the longest substring without repeating characters.",
  keywords: ["Sliding Window", "String", "Map", "algorithm", "visualization", "javascript"],
  openGraph: {
    title: "Longest Substring Without Repeating Characters - Algorithm Visualization",
    description: "Given a string `s`, the algorithm finds the length of the longest substring without repeating characters.",
    type: "website",
  },
}

export default function LongestSubstringWithoutRepeatingCharactersPage() {
  // Try to load from localStorage first, then use hardcoded data
  let algorithm = null

  try {
    const localStorageAlgorithm = LocalStorageManager.loadAlgorithm("longest-substring-without-repeating-characters")
    if (localStorageAlgorithm) {
      algorithm = localStorageAlgorithm
    }
  } catch (error) {
    console.warn("Failed to load from localStorage:", error)
  }

  // Fallback to hardcoded data if not found in localStorage
  if (!algorithm) {
    algorithm = {
      id: "longest-substring-without-repeating-characters",
      problemId: 3,
      title: "Longest Substring Without Repeating Characters",
      description: "Given a string `s`, the algorithm finds the length of the longest substring without repeating characters.",
      difficulty: "Medium",
      category: "String",
      timeComplexity: "O(n)",
      spaceComplexity: "O(n)",
      popularity: 95,
      estimatedTime: "25 min",
      realWorldUse: "Text analysis, data validation, compression algorithms",
      problemStatement: "Given a string `s`, the algorithm finds the length of the longest substring without repeating characters.",
      examples: [
        {
          input: "'abcabcbb'",
          output: "3",
          explanation: "The answer is 'abc', with the length of 3."
        },
        {
          input: "'bbbbb'",
          output: "1",
          explanation: "The answer is 'b', with the length of 1."
        },
        {
          input: "'pwwkew'",
          output: "3",
          explanation: "The answer is 'wke', with the length of 3."
        }
      ],
      analogy: {
        title: "Real-World Analogy: Unique Item Collector",
        content: "Imagine you're collecting unique trading cards. You can only keep one of each type, and you want to maximize your collection. As you go through a stack of cards, you occasionally find duplicates. When you do, you have to remove all cards from the point where you first saw that duplicate up to the current card, then continue. This sliding window approach helps you find the maximum number of unique cards you can collect in a single pass."
      },
      keyInsights: [
        "Sliding window technique optimizes substring problems",
        "Hash maps provide O(1) lookup for character positions",
        "Two pointers (start and end) maintain the current window",
        "Maximum length is tracked throughout the iteration",
        "This pattern applies to many substring optimization problems"
      ],
      realWorldApplications: [
        {
          domain: "Text Processing",
          application: "DNA sequence analysis",
          description: "Finding unique genetic sequences in biological data"
        },
        {
          domain: "Data Compression",
          application: "Dictionary-based compression",
          description: "Optimizing compression by finding repeated patterns"
        },
        {
          domain: "Web Development",
          application: "URL validation",
          description: "Validating URLs and checking for duplicate parameters"
        },
        {
          domain: "Security",
          application: "Password strength analysis",
          description: "Analyzing password complexity based on character variety"
        }
      ],
      engineeringLessons: [
        {
          principle: "Space-Time Tradeoff",
          lesson: "Using extra space (hash map) to achieve better time complexity",
          application: "Consider memory usage when optimizing for speed"
        },
        {
          principle: "Two Pointer Technique",
          lesson: "Two pointers can efficiently manage dynamic ranges",
          application: "Use two pointers for array/string range problems"
        },
        {
          principle: "Greedy Algorithms",
          lesson: "Sometimes the locally optimal choice leads to globally optimal solution",
          application: "Apply greedy approaches when they guarantee optimal results"
        }
      ],
      implementations: {
        bruteForce: {
          title: "Brute Force Approach",
          timeComplexity: "O(n³)",
          spaceComplexity: "O(n)",
          code: `var lengthOfLongestSubstring = function(s) {
    let maxLength = 0;

    for (let i = 0; i < s.length; i++) {
        for (let j = i; j < s.length; j++) {
            const substring = s.slice(i, j + 1);
            const uniqueChars = new Set(substring);

            if (uniqueChars.size === substring.length) {
                maxLength = Math.max(maxLength, substring.length);
            }
        }
    }

    return maxLength;
};`
        },
        optimized: {
          title: "Sliding Window with Hash Map",
          timeComplexity: "O(n)",
          spaceComplexity: "O(n)",
          code: `var lengthOfLongestSubstring = function(s) {
    const map = {};
    let offset = 0;

    return s.split('').reduce((max, value, i) => {
        offset = map[value] >= offset ? map[value] + 1 : offset;
        map[value] = i;
        return Math.max(max, i - offset + 1);
    }, 0);
};`
        }
      },
      animationStates: [
        {
          step: 1,
          title: "Initialization",
          description: "Set up hash map and offset pointer",
          data: { string: "abcabcbb", offset: 0, map: {}, currentMax: 0 }
        },
        {
          step: 2,
          title: "Process 'a'",
          description: "Add 'a' to map, window: 'a'",
          data: { char: "a", index: 0, offset: 0, map: { "a": 0 }, currentLength: 1, maxLength: 1 }
        },
        {
          step: 3,
          title: "Process 'b'",
          description: "Add 'b' to map, window: 'ab'",
          data: { char: "b", index: 1, offset: 0, map: { "a": 0, "b": 1 }, currentLength: 2, maxLength: 2 }
        },
        {
          step: 4,
          title: "Process 'c'",
          description: "Add 'c' to map, window: 'abc'",
          data: { char: "c", index: 2, offset: 0, map: { "a": 0, "b": 1, "c": 2 }, currentLength: 3, maxLength: 3 }
        },
        {
          step: 5,
          title: "Process duplicate 'a'",
          description: "Found duplicate 'a', move offset to position after first 'a'",
          data: { char: "a", index: 3, offset: 1, map: { "a": 3, "b": 1, "c": 2 }, currentLength: 3, maxLength: 3 }
        },
        {
          step: 6,
          title: "Continue processing",
          description: "Continue with sliding window approach",
          data: { currentWindow: "bcab", currentLength: 3, maxLength: 3 }
        }
      ],
      animation: {
        interactiveData: {
          algorithmType: "String",
          dataStructure: "Hash Map",
          keyOperations: ["Character mapping", "Window sliding", "Duplicate detection"],
          visualizationHints: "Show the sliding window moving across the string and highlight duplicate characters"
        }
      },
      metadata: {
        tags: ["Sliding Window", "String", "Hash Map", "Two Pointers"],
        acceptanceRate: "30.1%",
        frequency: 90
      }
    }
  }

  return <AlgorithmDetailPage algorithm={algorithm as any} />
}
