import { AlgorithmDetailPage } from "@/components/algorithm-detail-page"
import { LocalStorageManager } from "@/lib/local-storage-manager"

export const metadata = {
  title: "Reverse Integer - Algorithm Visualization",
  description: "This algorithm takes a signed 32-bit integer as input, reverses its digits, and returns the reversed integer. If the reversed integer exceeds the 32-bit integer range, it returns 0.",
  keywords: ["Number", "String", "Array", "Reverse", "algorithm", "visualization", "javascript"],
  openGraph: {
    title: "Reverse Integer - Algorithm Visualization",
    description: "This algorithm takes a signed 32-bit integer as input, reverses its digits, and returns the reversed integer. If the reversed integer exceeds the 32-bit integer range, it returns 0.",
    type: "website",
  },
}

export default function ReverseIntegerPage() {
  // Try to load from localStorage first, then use hardcoded data
  let algorithm = null

  try {
    const localStorageAlgorithm = LocalStorageManager.loadAlgorithm("reverse-integer")
    if (localStorageAlgorithm) {
      algorithm = localStorageAlgorithm
    }
  } catch (error) {
    console.warn("Failed to load from localStorage:", error)
  }

  // Fallback to hardcoded data if not found in localStorage
  if (!algorithm) {
    algorithm = {
      id: "reverse-integer",
      problemId: 7,
      title: "Reverse Integer",
      description: "This algorithm takes a signed 32-bit integer as input, reverses its digits, and returns the reversed integer. If the reversed integer exceeds the 32-bit integer range, it returns 0.",
      difficulty: "Easy",
      category: "Math",
      timeComplexity: "O(log n)",
      spaceComplexity: "O(1)",
      popularity: 75,
      estimatedTime: "20 min",
      realWorldUse: "Various algorithmic applications",
      problemStatement: "This algorithm takes a signed 32-bit integer as input, reverses its digits, and returns the reversed integer. If the reversed integer exceeds the 32-bit integer range, it returns 0.",
      examples: [
        {
          input: "123",
          output: "321",
          explanation: "The digits of the number 123 are reversed to form the number 321."
        },
        {
          input: "-123",
          output: "-321",
          explanation: "The digits of the number 123 are reversed to form the number 321. The sign is preserved, so the result is -321."
        },
        {
          input: "1534236469",
          output: "0",
          explanation: "The reversed number exceeds the 32-bit integer range, so the function returns 0."
        }
      ],
      analogy: {
        title: "Real-World Analogy: Number Mirror",
        content: "Imagine looking at a number in a mirror. The digits appear reversed, just like this algorithm reverses the digits of a number. However, just like a mirror has limits to how large an image it can reflect clearly, this algorithm has limits on the size of numbers it can handle."
      },
      keyInsights: [
        "Integer overflow is a critical consideration in programming",
        "String manipulation can be useful for number processing",
        "Edge cases like negative numbers and overflow must be handled carefully",
        "The 32-bit integer range is -2^31 to 2^31-1"
      ],
      realWorldApplications: [
        {
          domain: "Data Processing",
          application: "Number formatting and validation",
          description: "Validating and formatting numerical inputs in forms and data processing"
        },
        {
          domain: "Cryptography",
          application: "Basic encryption algorithms",
          description: "Simple number transformations used in basic encryption schemes"
        }
      ],
      engineeringLessons: [
        {
          principle: "Input Validation",
          lesson: "Always validate input ranges and handle edge cases",
          application: "Implement proper bounds checking in all numerical operations"
        },
        {
          principle: "Type Conversion",
          lesson: "String operations can be useful for complex number manipulations",
          application: "Consider type conversion when direct mathematical operations are complex"
        }
      ],
      implementations: {
        bruteForce: {
          title: "Basic Approach",
          timeComplexity: "O(log n)",
          spaceComplexity: "O(log n)",
          code: `var reverse = function(x) {
    let result = 0;
    while (x !== 0) {
        result = result * 10 + x % 10;
        x = Math.trunc(x / 10);
    }
    return result;
};`
        },
        optimized: {
          title: "String Approach (Recommended)",
          timeComplexity: "O(log n)",
          spaceComplexity: "O(log n)",
          code: `var reverse = function(x) {
    const reversed = String(Math.abs(x)).split('').reverse().join('');

    if (reversed > Math.pow(2, 31)) {
      return 0;
    }

    return reversed * Math.sign(x);
};`
        }
      },
      animationStates: [
        {
          step: 1,
          title: "Input Processing",
          description: "Convert number to string and handle sign",
          data: { number: 123, sign: 1, string: "123" }
        },
        {
          step: 2,
          title: "Reverse Digits",
          description: "Split string into array and reverse",
          data: { original: "123", reversed: "321", array: ["1", "2", "3"] }
        },
        {
          step: 3,
          title: "Range Check",
          description: "Check if result fits in 32-bit integer range",
          data: { result: 321, min: -2147483648, max: 2147483647, valid: true }
        },
        {
          step: 4,
          title: "Apply Sign",
          description: "Apply original sign to reversed number",
          data: { result: 321, sign: 1, final: 321 }
        }
      ],
      animation: {
        interactiveData: {
          algorithmType: "Math",
          dataStructure: "Number",
          keyOperations: ["String conversion", "Array reversal", "Range checking"],
          visualizationHints: "Show digit-by-digit reversal process"
        }
      },
      metadata: {
        tags: ["Math", "String", "Number Manipulation"],
        acceptanceRate: "25.4%",
        frequency: 85
      }
    }
  }

  return <AlgorithmDetailPage algorithm={algorithm} />
}