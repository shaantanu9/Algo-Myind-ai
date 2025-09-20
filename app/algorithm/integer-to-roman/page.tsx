import { AlgorithmDetailPage } from "@/components/algorithm-detail-page"
import { LocalStorageManager } from "@/lib/local-storage-manager"

export const metadata = {
  title: "Integer To Roman - Algorithm Visualization",
  description: "Convert an integer to a Roman numeral using a mapping approach with O(n) time complexity.",
  keywords: ["Math", "String", "Hash Table", "algorithm", "visualization", "javascript"],
  openGraph: {
    title: "Integer To Roman - Algorithm Visualization",
    description: "Convert an integer to a Roman numeral using a mapping approach with O(n) time complexity.",
    type: "website",
  },
}

export default function IntegerToRomanPage() {
  // Try to load from localStorage first, then use hardcoded data
  let algorithm = null

  try {
    const localStorageAlgorithm = LocalStorageManager.loadAlgorithm("integer-to-roman")
    if (localStorageAlgorithm) {
      algorithm = localStorageAlgorithm
    }
  } catch (error) {
    console.warn("Failed to load from localStorage:", error)
  }

  // Fallback to hardcoded data if not found in localStorage
  if (!algorithm) {
    algorithm = {
      id: "integer-to-roman",
      problemId: 12,
      title: "Integer To Roman",
      description: "Convert an integer to a Roman numeral using a mapping approach with O(n) time complexity.",
      difficulty: "Medium",
      category: "Math",
      timeComplexity: "O(n)",
      spaceComplexity: "O(1)",
      popularity: 85,
      estimatedTime: "25 min",
      realWorldUse: "Number formatting, historical data processing, educational tools",
      problemStatement: `Roman numerals are represented by seven different symbols: I, V, X, L, C, D and M.

Symbol       Value
I             1
V             5
X             10
L             50
C             100
D             500
M             1000

For example, 2 is written as II in Roman numeral, just two one's added together. 12 is written as XII, which is simply X + II. The number 27 is written as XXVII, which is XX + V + II.

Roman numerals are usually written largest to smallest from left to right. However, the numeral for four is not IIII. Instead, the number four is written as IV. Because the one is before the five we subtract it making four. The same principle applies to the number nine, which is written as IX. There are six instances where subtraction is used:

I can be placed before V (5) and X (10) to make 4 and 9.
X can be placed before L (50) and C (100) to make 40 and 90.
C can be placed before D (500) and M (1000) to make 400 and 900.

Given an integer, convert it to a roman numeral.`,
      examples: [
        {
          input: "3",
          output: '"III"',
          explanation: "3 is written as III in Roman numeral."
        },
        {
          input: "4",
          output: '"IV"',
          explanation: "4 is written as IV in Roman numeral (5 - 1 = 4)."
        },
        {
          input: "9",
          output: '"IX"',
          explanation: "9 is written as IX in Roman numeral (10 - 1 = 9)."
        },
        {
          input: "58",
          output: '"LVIII"',
          explanation: "L = 50, V = 5, III = 3, so LVIII = 50 + 5 + 3 = 58."
        },
        {
          input: "1994",
          output: '"MCMXCIV"',
          explanation: "M = 1000, CM = 900, XC = 90, IV = 4, so MCMXCIV = 1000 + 900 + 90 + 4 = 1994."
        }
      ],
      analogy: {
        title: "Real-World Analogy: Currency Exchange",
        content: "Imagine you're at a currency exchange booth and you need to give someone change using the largest possible bills and coins. You wouldn't give someone 10 one-dollar bills when you could give them a single 10-dollar bill. This algorithm works the same way - it uses the largest Roman numeral symbols first, then fills in the gaps with smaller symbols, just like how you use the largest denomination of currency first."
      },
      keyInsights: [
        "Use a mapping of values to symbols, ordered from largest to smallest",
        "Handle subtractive notation (IV, IX, XL, etc.) by including them in the mapping",
        "Process the number by repeatedly dividing by the largest possible value",
        "The greedy approach works because Roman numeral values are designed this way",
        "Edge cases include numbers at the boundaries of subtractive notation"
      ],
      realWorldApplications: [
        {
          domain: "Education",
          application: "Teaching ancient number systems",
          description: "Educational tools for teaching Roman numerals to students"
        },
        {
          domain: "Data Processing",
          application: "Legacy system integration",
          description: "Converting between different number representation systems"
        },
        {
          domain: "Games",
          application: "Historical game mechanics",
          description: "Implementing Roman numeral systems in strategy games"
        },
        {
          domain: "Publishing",
          application: "Document formatting",
          description: "Formatting page numbers, chapters, or sections in Roman numerals"
        }
      ],
      engineeringLessons: [
        {
          principle: "Greedy Algorithms",
          lesson: "When the problem allows it, greedy approaches can be both simple and optimal",
          application: "Apply greedy algorithms when the locally optimal choice leads to a globally optimal solution"
        },
        {
          principle: "Lookup Tables",
          lesson: "Pre-computed mappings can simplify complex logic",
          application: "Use lookup tables for problems involving standard mappings or conversions"
        },
        {
          principle: "Problem Decomposition",
          lesson: "Break down complex conversions into manageable steps",
          application: "Decompose complex problems into smaller, more manageable subproblems"
        }
      ],
      implementations: {
        bruteForce: {
          title: "Manual Mapping Approach",
          timeComplexity: "O(n)",
          spaceComplexity: "O(1)",
          code: `var intToRoman = function(num) {
    const values = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
    const symbols = ['M', 'CM', 'D', 'CD', 'C', 'XC', 'L', 'XL', 'X', 'IX', 'V', 'IV', 'I'];

    let result = '';
    for (let i = 0; i < values.length; i++) {
        while (num >= values[i]) {
            result += symbols[i];
            num -= values[i];
        }
    }

    return result;
};`
        },
        optimized: {
          title: "Optimized Mapping Approach",
          timeComplexity: "O(n)",
          spaceComplexity: "O(1)",
          code: `var intToRoman = function(num) {
    const map = {
        M: 1000, CM: 900, D: 500, CD: 400, C: 100,
        XC: 90, L: 50, XL: 40, X: 10, IX: 9,
        V: 5, IV: 4, I: 1
    };

    return Object.entries(map).reduce((result, [symbol, value]) => {
        const count = Math.floor(num / value);
        result += symbol.repeat(count);
        num %= value;
        return result;
    }, '');
};`
        }
      },
      animationStates: [
        {
          step: 1,
          title: "Initialize Mapping",
          description: "Set up the Roman numeral mapping from largest to smallest values",
          data: { map: { "M": 1000, "CM": 900, "D": 500, "CD": 400, "C": 100 }, input: 1994 }
        },
        {
          step: 2,
          title: "Process Thousands",
          description: "Handle the thousands place using 'M' (1000)",
          data: { current: 1994, symbol: "M", value: 1000, count: 1, remaining: 994, result: "M" }
        },
        {
          step: 3,
          title: "Process Hundreds",
          description: "Handle the hundreds place using 'CM' (900)",
          data: { current: 994, symbol: "CM", value: 900, count: 1, remaining: 94, result: "MCM" }
        },
        {
          step: 4,
          title: "Process Tens",
          description: "Handle the tens place using 'XC' (90)",
          data: { current: 94, symbol: "XC", value: 90, count: 1, remaining: 4, result: "MCMXC" }
        },
        {
          step: 5,
          title: "Process Units",
          description: "Handle the units place using 'IV' (4)",
          data: { current: 4, symbol: "IV", value: 4, count: 1, remaining: 0, result: "MCMXCIV" }
        },
        {
          step: 6,
          title: "Complete Conversion",
          description: "Final Roman numeral result",
          data: { input: 1994, result: "MCMXCIV", explanation: "1994 = M(1000) + CM(900) + XC(90) + IV(4)" }
        }
      ],
      animation: {
        interactiveData: {
          algorithmType: "Math",
          dataStructure: "Hash Map",
          keyOperations: ["Value mapping", "Division calculation", "String concatenation", "Modulo operation"],
          visualizationHints: "Show the step-by-step breakdown of the number using the mapping table"
        }
      },
      metadata: {
        tags: ["Math", "String", "Hash Table"],
        acceptanceRate: "55.4%",
        frequency: 75
      }
    }
  }

  return <AlgorithmDetailPage algorithm={algorithm as any} />
}
