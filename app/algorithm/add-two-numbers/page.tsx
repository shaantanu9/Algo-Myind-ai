import { AlgorithmDetailPage } from "@/components/algorithm-detail-page"
import { LocalStorageManager } from "@/lib/local-storage-manager"

export const metadata = {
  title: "Add Two Numbers - Algorithm Visualization",
  description: "You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.",
  keywords: ["Linked List", "Math", "Recursion", "algorithm", "visualization", "javascript"],
  openGraph: {
    title: "Add Two Numbers - Algorithm Visualization",
    description: "You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.",
    type: "website",
  },
}

export default function AddTwoNumbersPage() {
  // Try to load from localStorage first, then use hardcoded data
  let algorithm = null

  try {
    const localStorageAlgorithm = LocalStorageManager.loadAlgorithm("add-two-numbers")
    if (localStorageAlgorithm) {
      algorithm = localStorageAlgorithm
    }
  } catch (error) {
    console.warn("Failed to load from localStorage:", error)
  }

  // Fallback to hardcoded data if not found in localStorage
  if (!algorithm) {
    algorithm = {
      id: "add-two-numbers",
      problemId: 2,
      title: "Add Two Numbers",
      description: "You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.",
      difficulty: "Medium",
      category: "Linked List",
      timeComplexity: "O(max(m,n))",
      spaceComplexity: "O(max(m,n))",
      popularity: 90,
      estimatedTime: "35 min",
      realWorldUse: "Big integer arithmetic, arbitrary precision arithmetic",
      problemStatement: "You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.",
      examples: [
        {
          input: "l1 = [2,4,3], l2 = [5,6,4]",
          output: "[7,0,8]",
          explanation: "342 + 465 = 807. The result should be [7,0,8] because 807 in reverse is 708."
        },
        {
          input: "l1 = [0], l2 = [0]",
          output: "[0]",
          explanation: "0 + 0 = 0. The result should be [0]."
        },
        {
          input: "l1 = [9,9,9,9,9,9,9], l2 = [9,9,9,9]",
          output: "[8,9,9,9,0,0,0,1]",
          explanation: "9999999 + 9999 = 10009998. The result should be [8,9,9,9,0,0,0,1] because 10009998 in reverse is 89990001."
        }
      ],
      analogy: {
        title: "Real-World Analogy: Column Addition",
        content: "Imagine you're adding two large numbers on paper, column by column, starting from the rightmost digit. When the sum of digits in a column exceeds 9, you carry over the extra digit to the next column on the left. This is exactly what the algorithm does - it traverses both linked lists simultaneously, adding corresponding digits and handling the carry just like manual column addition."
      },
      keyInsights: [
        "Process linked lists from left to right (head to tail) since digits are stored in reverse order",
        "Use a carry variable to handle digit sums greater than 9",
        "Handle different length lists by treating missing nodes as 0",
        "The result list will be at most max(length1, length2) + 1 nodes",
        "Edge cases include carry propagation and unequal list lengths"
      ],
      realWorldApplications: [
        {
          domain: "Cryptography",
          application: "Big integer arithmetic",
          description: "Performing arithmetic operations on very large numbers that exceed standard integer limits"
        },
        {
          domain: "Data Processing",
          application: "Arbitrary precision arithmetic",
          description: "Implementing calculators and mathematical libraries for unlimited precision calculations"
        },
        {
          domain: "Distributed Systems",
          application: "Distributed computation",
          description: "Breaking down large computations across multiple nodes or systems"
        }
      ],
      engineeringLessons: [
        {
          principle: "Dummy Node Pattern",
          lesson: "Using a dummy head node simplifies linked list manipulation",
          application: "Simplifies edge case handling when building new linked lists"
        },
        {
          principle: "Carry Propagation",
          lesson: "Proper carry handling is crucial in multi-digit arithmetic",
          application: "Essential for implementing arbitrary precision arithmetic"
        },
        {
          principle: "Two Pointer Technique",
          lesson: "Process multiple data structures simultaneously",
          application: "Useful when merging, comparing, or combining multiple sequences"
        }
      ],
      implementations: {
        bruteForce: {
          title: "Iterative Approach",
          timeComplexity: "O(max(m,n))",
          spaceComplexity: "O(max(m,n))",
          code: `var addTwoNumbers = function(l1, l2) {
    let dummy = new ListNode(0);
    let current = dummy;
    let carry = 0;

    while (l1 || l2 || carry) {
        let sum = carry;

        if (l1) {
            sum += l1.val;
            l1 = l1.next;
        }

        if (l2) {
            sum += l2.val;
            l2 = l2.next;
        }

        carry = Math.floor(sum / 10);
        current.next = new ListNode(sum % 10);
        current = current.next;
    }

    return dummy.next;
};`
        },
        optimized: {
          title: "Recursive Approach",
          timeComplexity: "O(max(m,n))",
          spaceComplexity: "O(max(m,n))",
          code: `var addTwoNumbers = function(l1, l2) {
    return addHelper(l1, l2, 0);
};

function addHelper(l1, l2, carry) {
    // Base case: both lists are empty and no carry
    if (!l1 && !l2 && carry === 0) {
        return null;
    }

    let sum = carry;

    if (l1) {
        sum += l1.val;
        l1 = l1.next;
    }

    if (l2) {
        sum += l2.val;
        l2 = l2.next;
    }

    const newNode = new ListNode(sum % 10);
    newNode.next = addHelper(l1, l2, Math.floor(sum / 10));

    return newNode;
}`
        }
      },
      animationStates: [
        {
          step: 1,
          title: "Initialize Pointers",
          description: "Set up dummy node and current pointer for result list",
          data: { l1: [2,4,3], l2: [5,6,4], carry: 0, result: [] }
        },
        {
          step: 2,
          title: "Process First Digits",
          description: "Add 2 + 5 = 7, no carry",
          data: { l1: [2,4,3], l2: [5,6,4], current: 2, carry: 0, sum: 7, result: [7] }
        },
        {
          step: 3,
          title: "Process Second Digits",
          description: "Add 4 + 6 = 10, carry 1",
          data: { l1: [2,4,3], l2: [5,6,4], current: 4, carry: 0, sum: 10, result: [7,0] }
        },
        {
          step: 4,
          title: "Process Third Digits",
          description: "Add 3 + 4 + 1 = 8, no carry",
          data: { l1: [2,4,3], l2: [5,6,4], current: 3, carry: 1, sum: 8, result: [7,0,8] }
        },
        {
          step: 5,
          title: "Complete Addition",
          description: "All digits processed, final result: 807",
          data: { l1: [2,4,3], l2: [5,6,4], result: [7,0,8], explanation: "342 + 465 = 807" }
        }
      ],
      animation: {
        interactiveData: {
          algorithmType: "Linked List",
          dataStructure: "Linked List",
          keyOperations: ["Node traversal", "Carry calculation", "List construction"],
          visualizationHints: "Show linked list nodes being processed and result list being built"
        }
      },
      metadata: {
        tags: ["Linked List", "Math", "Recursion"],
        acceptanceRate: "37.3%",
        frequency: 85
      }
    }
  }

  return <AlgorithmDetailPage algorithm={algorithm as any} />
}
