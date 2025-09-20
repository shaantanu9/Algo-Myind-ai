import { AlgorithmDetailPage } from "@/components/algorithm-detail-page"
import { LocalStorageManager } from "@/lib/local-storage-manager"

export const metadata = {
  title: "String To Integer Atoi - Algorithm Visualization",
  description: "Implement the myAtoi(string s) function, which converts a string to a 32-bit signed integer.",
  keywords: ["String", "Algorithm", "algorithm", "visualization", "javascript"],
  openGraph: {
    title: "String To Integer Atoi - Algorithm Visualization",
    description: "Implement the myAtoi(string s) function, which converts a string to a 32-bit signed integer.",
    type: "website",
  },
}

export default function StringToIntegerAtoiPage() {
  // Try to load from localStorage first, then use hardcoded data
  let algorithm = null

  try {
    const localStorageAlgorithm = LocalStorageManager.loadAlgorithm("string-to-integer-atoi")
    if (localStorageAlgorithm) {
      algorithm = localStorageAlgorithm
    }
  } catch (error) {
    console.warn("Failed to load from localStorage:", error)
  }

  // Fallback to hardcoded data if not found in localStorage
  if (!algorithm) {
    algorithm = {
      id: "string-to-integer-atoi",
      problemId: 8,
      title: "String To Integer Atoi",
      description: "Implement the myAtoi(string s) function, which converts a string to a 32-bit signed integer.",
      difficulty: "Medium",
      category: "String",
      timeComplexity: "O(n)",
      spaceComplexity: "O(1)",
      popularity: 85,
      estimatedTime: "20 min",
      realWorldUse: "Various algorithmic applications",
      problemStatement: "Implement the myAtoi(string s) function, which converts a string to a 32-bit signed integer.",
      examples: [
        {
          input: '"42"',
          output: "42",
          explanation: "The string \"42\" is converted to the integer 42."
        },
        {
          input: '"   -42"',
          output: "-42",
          explanation: "Leading whitespace is ignored, and the negative sign is preserved."
        }
      ],
      analogy: {
        title: "Real-World Analogy: Text to Number Converter",
        content: "Imagine you're reading a recipe that says 'add 2 cups of flour'. Your brain automatically converts the text '2' into the mathematical concept of the number 2. This algorithm does the same thing - it reads text and extracts numerical meaning from it, just like how we parse numbers from written instructions."
      },
      keyInsights: [
        "Parsing requires careful handling of edge cases",
        "Whitespace and sign handling are critical",
        "Integer overflow must be prevented",
        "Regular expressions can simplify string parsing",
        "Type conversion is fundamental to data processing"
      ],
      realWorldApplications: [
        {
          domain: "Data Processing",
          application: "CSV file parsing",
          description: "Converting string data from CSV files into numerical values for analysis"
        },
        {
          domain: "Web Development",
          application: "Form input validation",
          description: "Validating and converting user input from text fields to numbers"
        },
        {
          domain: "Configuration",
          application: "Settings parsing",
          description: "Reading configuration files and environment variables"
        }
      ],
      engineeringLessons: [
        {
          principle: "Defensive Programming",
          lesson: "Always validate and sanitize input before processing",
          application: "Implement comprehensive input validation in all data processing functions"
        },
        {
          principle: "Error Handling",
          lesson: "Gracefully handle invalid inputs and edge cases",
          application: "Use try-catch blocks and return sensible defaults for invalid inputs"
        },
        {
          principle: "Performance vs Readability",
          lesson: "Sometimes a more readable solution is preferable to a micro-optimized one",
          application: "Balance code readability with performance requirements"
        }
      ],
      implementations: {
        bruteForce: {
          title: "Manual Parsing Approach",
          timeComplexity: "O(n)",
          spaceComplexity: "O(1)",
          code: `var myAtoi = function(s) {
    let i = 0;
    let result = 0;
    let sign = 1;

    // Skip whitespace
    while (i < s.length && s[i] === ' ') {
        i++;
    }

    // Check sign
    if (i < s.length && (s[i] === '+' || s[i] === '-')) {
        sign = s[i] === '-' ? -1 : 1;
        i++;
    }

    // Parse digits
    while (i < s.length && s[i] >= '0' && s[i] <= '9') {
        result = result * 10 + (s[i] - '0');
        i++;
    }

    result *= sign;

    // Clamp to 32-bit range
    if (result > 2147483647) return 2147483647;
    if (result < -2147483648) return -2147483648;

    return result;
};`
        },
        optimized: {
          title: "Regex Approach (Recommended)",
          timeComplexity: "O(n)",
          spaceComplexity: "O(1)",
          code: `var myAtoi = function(s) {
  const parsed = +(s.trim().match(/^[-+]?\\d+/g) || [0])[0];
  const clamped = Math.min(Math.max(parsed, (-2)**31), 2**31 - 1);

  return clamped;
};`
        }
      },
      animationStates: [
        {
          step: 1,
          title: "Input Validation",
          description: "Trim whitespace and check for valid number format",
          data: { input: "   -42abc", trimmed: "-42abc" }
        },
        {
          step: 2,
          title: "Sign Detection",
          description: "Identify and extract the sign (+ or -)",
          data: { input: "-42abc", sign: -1, remaining: "42abc" }
        },
        {
          step: 3,
          title: "Digit Extraction",
          description: "Extract consecutive digits from the string",
          data: { remaining: "42abc", digits: "42", remaining_after: "abc" }
        },
        {
          step: 4,
          title: "Number Conversion",
          description: "Convert digit string to integer and apply sign",
          data: { digits: "42", sign: -1, result: -42 }
        },
        {
          step: 5,
          title: "Range Validation",
          description: "Ensure result fits within 32-bit integer range",
          data: { result: -42, min: -2147483648, max: 2147483647, valid: true }
        }
      ],
      animation: {
        interactiveData: {
          algorithmType: "String",
          dataStructure: "String",
          keyOperations: ["Whitespace trimming", "Sign detection", "Digit parsing", "Range checking"],
          visualizationHints: "Show step-by-step string processing and character-by-character analysis"
        }
      },
      metadata: {
        tags: ["String", "Parsing", "Mathematics"],
        acceptanceRate: "15.4%",
        frequency: 75
      }
    }
  }

  return <AlgorithmDetailPage algorithm={algorithm as any} />
}
