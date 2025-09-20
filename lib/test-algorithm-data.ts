/**
 * Test utility for validating algorithm data and saving to localStorage
 */

import { LocalStorageManager } from './local-storage-manager'

export const testAlgorithmData = [
  {
    "algorithmName": "string-to-integer-atoi",
    "problemId": 8,
    "title": "String To Integer Atoi",
    "description": "Implement the myAtoi(string s) function, which converts a string to a 32-bit signed integer.",
    "difficulty": "Medium",
    "category": "String",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(1)",
    "examples": [
      {
        "input": "\"42\"",
        "output": "42",
        "explanation": "The string \"42\" is converted to the integer 42."
      },
      {
        "input": "\"   -42\"",
        "output": "-42",
        "explanation": "Leading whitespace is ignored, and the negative sign is preserved."
      }
    ],
    "constraints": [
      "0 <= s.length <= 200",
      "s consists of English letters (lower-case and upper-case), digits (0-9), ' ', '+', '-', and '.'."
    ],
    "solution": {
      "javascript": "/**\n * 8. String to Integer (atoi)\n * https://leetcode.com/problems/string-to-integer-atoi/\n * Difficulty: Medium\n *\n * Implement the myAtoi(string s) function, which converts a string to a\n * 32-bit signed integer (similar to C/C++'s atoi function).\n *\n * The algorithm for myAtoi(string s) is as follows:\n *\n * - Read in and ignore any leading whitespace.\n * - Check if the next character (if not already at the end of the string)\n *   is '-' or '+'. Read this character in if it is either. This determines\n *   if the final result is negative or positive respectively.\n *   Assume the result is positive if neither is present.\n * - Read in next the characters until the next non-digit charcter or the end\n *   of the input is reached. The rest of the string is ignored.\n * - Convert these digits into an integer (i.e. \"123\" -> 123, \"0032\" -> 32).\n *   If no digits were read, then the integer is 0. Change the sign as\n *   necessary (from step 2).\n * - If the integer is out of the 32-bit signed integer range [-231, 231 - 1],\n *   then clamp the integer so that it remains in the range. Specifically,\n *   integers less than -231 should be clamped to -231, and integers greater\n *   than 231 - 1 should be clamped to 231 - 1.\n * - Return the integer as the final result.\n */\n\n/**\n * @param {string} s\n * @return {number}\n */\nvar myAtoi = function(s) {\n  const parsed = +(s.trim().match(/^[-+]?\\d+/g) || [0])[0];\n  const clamped = Math.min(Math.max(parsed, (-2)**31), 2**31 - 1);\n\n  return clamped;\n};\n",
      "explanation": "This algorithm converts a string to a 32-bit signed integer by parsing the string, handling edge cases, and clamping the result to the valid range."
    },
    "analogy": {
      "title": "Reading a License Plate",
      "content": "Imagine you're reading a license plate number. You need to ignore any irrelevant characters around the numbers, determine if there are any special indicators (like negative signs), extract just the numeric part, and ensure the final number fits within the allowed range for your system."
    },
    "keyInsights": [
      "Handle leading whitespace and signs properly",
      "Extract only the numeric part of the string",
      "Clamp results to 32-bit signed integer range",
      "Consider edge cases like empty strings and invalid inputs"
    ],
    "realWorldApplications": [
      {
        "domain": "Data Processing",
        "application": "Parsing Configuration Files",
        "description": "Convert string values from configuration files to numeric values for system settings."
      },
      {
        "domain": "Web Development",
        "application": "Form Input Validation",
        "description": "Convert user input strings to numbers while handling various formats and edge cases."
      }
    ],
    "engineeringLessons": [
      {
        "principle": "Input Validation",
        "lesson": "Always validate and sanitize input data before processing to prevent errors and security issues.",
        "application": "This principle applies to all data processing systems, from web forms to file parsing."
      }
    ],
    "implementations": {
      "bruteForce": {
        "title": "Manual Parsing Approach",
        "timeComplexity": "O(n)",
        "spaceComplexity": "O(1)",
        "code": "var myAtoi = function(s) {\n  const parsed = +(s.trim().match(/^[-+]?\\\\d+/g) || [0])[0];\n  const clamped = Math.min(Math.max(parsed, (-2)**31), 2**31 - 1);\n  return clamped;\n};"
      },
      "optimized": {
        "title": "Regex and Clamp Approach",
        "timeComplexity": "O(n)",
        "spaceComplexity": "O(1)",
        "code": "var myAtoi = function(s) {\n  const parsed = +(s.trim().match(/^[-+]?\\\\d+/g) || [0])[0];\n  const clamped = Math.min(Math.max(parsed, (-2)**31), 2**31 - 1);\n  return clamped;\n};"
      }
    },
    "animationStates": [
      {
        "step": 1,
        "title": "Trim Leading Whitespace",
        "description": "Remove any leading whitespace from the input string.",
        "data": { "input": "   -42abc", "output": "-42abc" }
      },
      {
        "step": 2,
        "title": "Extract Numeric Part",
        "description": "Use regex to extract the numeric part including optional sign.",
        "data": { "input": "-42abc", "output": "-42" }
      },
      {
        "step": 3,
        "title": "Convert to Number",
        "description": "Convert the extracted string to a number.",
        "data": { "input": "-42", "output": -42 }
      },
      {
        "step": 4,
        "title": "Clamp to Range",
        "description": "Ensure the number is within 32-bit signed integer range.",
        "data": { "input": -42, "output": -42 }
      }
    ],
    "animationData": {
      "algorithmType": "string-processing",
      "dataStructure": "String",
      "keyOperations": ["trim", "regex-match", "parse", "clamp"],
      "visualizationHints": "Show string transformation steps with highlighting"
    },
    "tags": ["String", "Math", "Parsing"],
    "acceptanceRate": "17.5%",
    "frequency": 60,
    "estimatedTime": "20 min",
    "popularity": 85,
    "id": "string-to-integer-atoi",
    "createdAt": Date.now(),
    "lastModified": Date.now()
  },
  {
    "algorithmName": "reverse-integer",
    "problemId": 7,
    "title": "Reverse Integer",
    "description": "Given a signed 32-bit integer x, the algorithm should return x with its digits reversed. If reversing x causes the value to go outside the signed 32-bit integer range [-2^31, 2^31 - 1], then return 0.",
    "difficulty": "Easy",
    "category": "Math",
    "timeComplexity": "O(log n)",
    "spaceComplexity": "O(1)",
    "examples": [
      {
        "input": "123",
        "output": "321",
        "explanation": "The digits of the number 123 are reversed to form the number 321."
      },
      {
        "input": "-123",
        "output": "-321",
        "explanation": "The digits of the number 123 are reversed to form the number 321. The negative sign is preserved."
      }
    ],
    "constraints": [
      "-2^31 <= x <= 2^31 - 1"
    ],
    "solution": {
      "javascript": "var reverse = function(x) {\n  const reversed = String(Math.abs(x)).split('').reverse().join('');\n\n  if (reversed > Math.pow(2, 31)) {\n    return 0;\n  }\n\n  return reversed * Math.sign(x);\n};",
      "explanation": "The algorithm first converts the absolute value of the input number to a string, splits the string into an array of characters, reverses the array, and then joins the array back into a string. This effectively reverses the digits of the input number. If the reversed number exceeds the maximum value of a 32-bit signed integer, the algorithm returns 0. Otherwise, it returns the reversed number with the original sign."
    },
    "analogy": {
      "title": "Reversing a Queue",
      "content": "Imagine you have a queue of people. The process of reversing an integer is like asking each person in the queue to leave and join another queue in the reverse order. If the new queue becomes too long (exceeds the maximum 32-bit integer), we disband the queue and return an empty queue (0)."
    },
    "keyInsights": [
      "The algorithm uses the built-in JavaScript functions to reverse the digits of the number.",
      "The algorithm takes into account the possibility of integer overflow."
    ],
    "realWorldApplications": [
      {
        "domain": "Data Validation",
        "application": "Checking for Palindromic Numbers",
        "description": "This algorithm can be used in data validation to check if a number is a palindrome. A number is a palindrome if it remains the same when its digits are reversed."
      }
    ],
    "engineeringLessons": [
      {
        "principle": "Handling Edge Cases",
        "lesson": "Always consider edge cases in your algorithms. In this case, the algorithm handles the edge case where the reversed number exceeds the maximum 32-bit integer.",
        "application": "This principle is applicable in all areas of software development. Always consider and handle edge cases to prevent unexpected behavior."
      }
    ],
    "implementations": {
      "bruteForce": {
        "title": "Reversing Digits Using String and Array Operations",
        "timeComplexity": "O(log n)",
        "spaceComplexity": "O(1)",
        "code": "var reverse = function(x) {\n  const reversed = String(Math.abs(x)).split('').reverse().join('');\n\n  if (reversed > Math.pow(2, 31)) {\n    return 0;\n  }\n\n  return reversed * Math.sign(x);\n};"
      }
    },
    "animationStates": [
      {
        "step": 1,
        "title": "Convert to String",
        "description": "Convert the absolute value of the input number to a string.",
        "data": {
          "input": "123",
          "output": "'123'"
        }
      },
      {
        "step": 2,
        "title": "Reverse String",
        "description": "Reverse the string.",
        "data": {
          "input": "'123'",
          "output": "'321'"
        }
      },
      {
        "step": 3,
        "title": "Check for Overflow",
        "description": "Check if the reversed number exceeds the maximum 32-bit integer.",
        "data": {
          "input": "'321'",
          "output": "false"
        }
      },
      {
        "step": 4,
        "title": "Return Result",
        "description": "Return the reversed number with the original sign.",
        "data": {
          "input": "'321'",
          "output": "321"
        }
      }
    ],
    "animationData": {
      "algorithmType": "Math",
      "dataStructure": "Number",
      "keyOperations": [
        "Convert to string",
        "Reverse string",
        "Check for overflow",
        "Return result"
      ],
      "visualizationHints": "Visualize the process of reversing the digits of the number."
    },
    "tags": [
      "Math",
      "String",
      "Array"
    ],
    "acceptanceRate": "25.5%",
    "frequency": 85,
    "estimatedTime": "15 min",
    "popularity": 90,
    "id": "reverse-integer",
    "createdAt": Date.now(),
    "lastModified": Date.now()
  }
]

export function testAndSaveAlgorithmData() {
  console.log('🧪 Testing algorithm data validation and localStorage saving...')

  testAlgorithmData.forEach((algorithmData, index) => {
    console.log(`\n📊 Testing Algorithm ${index + 1}: ${algorithmData.title}`)
    console.log('Problem ID:', algorithmData.problemId)
    console.log('Difficulty:', algorithmData.difficulty)
    console.log('Time Complexity:', algorithmData.timeComplexity)
    console.log('Space Complexity:', algorithmData.spaceComplexity)

    // Validate the data structure
    const isValid = validateAlgorithmData(algorithmData)
    console.log('✅ Data structure valid:', isValid)

    if (isValid) {
      // Try to save to localStorage
      const saved = LocalStorageManager.saveAlgorithm(algorithmData as any)
      console.log('💾 Saved to localStorage:', saved)

      if (saved) {
        // Test loading
        const loaded = LocalStorageManager.loadAlgorithm(algorithmData.id)
        console.log('📖 Loaded from localStorage:', !!loaded)
        if (loaded) {
          console.log('Loaded title:', loaded.title)
          console.log('Loaded problem ID:', loaded.problemId)
        }
      }
    }
  })

  // Test getting all algorithms
  const allAlgorithms = LocalStorageManager.loadAllAlgorithms()
  console.log('\n📋 All algorithms in localStorage:', allAlgorithms.length)
  allAlgorithms.forEach(algo => {
    console.log(`- ${algo.title} (ID: ${algo.problemId})`)
  })

  // Test getting available algorithms (should include localStorage ones)
  console.log('\n🔍 Testing getAvailableAlgorithms...')
  // This would normally be called from AlgorithmContentLoader
  const availableAlgorithms = [
    { id: 1, title: 'Two Sum', hasSolution: true, hasAnimation: true },
    { id: 11, title: 'Container With Most Water', hasSolution: true, hasAnimation: true },
    { id: 20, title: 'Valid Parentheses', hasSolution: true, hasAnimation: true },
    { id: 21, title: 'Merge Two Sorted Lists', hasSolution: true, hasAnimation: true },
    { id: 75, title: 'Sort Colors', hasSolution: true, hasAnimation: true }
  ]

  const localStorageAlgorithms = LocalStorageManager.loadAllAlgorithms().map(algo => ({
    id: algo.problemId,
    title: algo.title,
    hasSolution: true,
    hasAnimation: true
  }))

  const combinedAlgorithms = [...availableAlgorithms]
  localStorageAlgorithms.forEach(localAlgo => {
    if (!combinedAlgorithms.some(defaultAlgo => defaultAlgo.id === localAlgo.id)) {
      combinedAlgorithms.push(localAlgo)
    }
  })

  console.log('Combined algorithms count:', combinedAlgorithms.length)
  combinedAlgorithms.forEach(algo => {
    console.log(`- ${algo.title} (ID: ${algo.id})`)
  })

  return {
    success: true,
    savedAlgorithms: allAlgorithms.length,
    availableAlgorithms: combinedAlgorithms.length
  }
}

function validateAlgorithmData(data: any): boolean {
  const requiredFields = ['id', 'title', 'problemId', 'difficulty', 'category', 'timeComplexity', 'spaceComplexity']
  const missingFields = requiredFields.filter(field => !data[field])

  if (missingFields.length > 0) {
    console.error('❌ Missing required fields:', missingFields)
    return false
  }

  // Check data types
  if (typeof data.problemId !== 'number') {
    console.error('❌ problemId should be a number')
    return false
  }

  if (!['Easy', 'Medium', 'Hard'].includes(data.difficulty)) {
    console.error('❌ Invalid difficulty level')
    return false
  }

  // Check examples structure
  if (!Array.isArray(data.examples)) {
    console.error('❌ examples should be an array')
    return false
  }

  // Check solution structure
  if (!data.solution || typeof data.solution.javascript !== 'string') {
    console.error('❌ Invalid solution structure')
    return false
  }

  console.log('✅ All validation checks passed')
  return true
}

// Manual test function for the specific data provided by user
export function testUserProvidedData() {
  console.log('🧪 Testing user-provided algorithm data...')

  // First algorithm: String to Integer Atoi
  const atoiData = {
    "algorithmName": "string-to-integer-atoi",
    "problemId": 8,
    "title": "String To Integer Atoi",
    "description": "Implement the myAtoi(string s) function, which converts a string to a 32-bit signed integer.",
    "difficulty": "Medium",
    "category": "String",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(1)",
    "examples": [
      {
        "input": "\"42\"",
        "output": "42",
        "explanation": "The string \"42\" is converted to the integer 42."
      },
      {
        "input": "\"   -42\"",
        "output": "-42",
        "explanation": "Leading whitespace is ignored, and the negative sign is preserved."
      }
    ],
    "constraints": [
      "0 <= s.length <= 200",
      "s consists of English letters (lower-case and upper-case), digits (0-9), ' ', '+', '-', and '.'."
    ],
    "solution": {
      "javascript": `/**\n * 8. String to Integer (atoi)\n * https://leetcode.com/problems/string-to-integer-atoi/\n * Difficulty: Medium\n *\n * Implement the myAtoi(string s) function, which converts a string to a\n * 32-bit signed integer (similar to C/C++'s atoi function).\n *\n * The algorithm for myAtoi(string s) is as follows:\n *\n * - Read in and ignore any leading whitespace.\n * - Check if the next character (if not already at the end of the string)\n *   is '-' or '+'. Read this character in if it is either. This determines\n *   if the final result is negative or positive respectively.\n *   Assume the result is positive if neither is present.\n * - Read in next the characters until the next non-digit charcter or the end\n *   of the input is reached. The rest of the string is ignored.\n * - Convert these digits into an integer (i.e. \"123\" -> 123, \"0032\" -> 32).\n *   If no digits were read, then the integer is 0. Change the sign as\n *   necessary (from step 2).\n * - If the integer is out of the 32-bit signed integer range [-231, 231 - 1],\n *   then clamp the integer so that it remains in the range. Specifically,\n *   integers less than -231 should be clamped to -231, and integers greater\n *   than 231 - 1 should be clamped to 231 - 1.\n * - Return the integer as the final result.\n */\n\n/**\n * @param {string} s\n * @return {number}\n */\nvar myAtoi = function(s) {\n  const parsed = +(s.trim().match(/^[-+]?\\d+/g) || [0])[0];\n  const clamped = Math.min(Math.max(parsed, (-2)**31), 2**31 - 1);\n\n  return clamped;\n};\n`,
      "explanation": "This algorithm converts a string to a 32-bit signed integer by parsing the string, handling edge cases, and clamping the result to the valid range."
    },
    "analogy": {
      "title": "Reading a License Plate",
      "content": "Imagine you're reading a license plate number. You need to ignore any irrelevant characters around the numbers, determine if there are any special indicators (like negative signs), extract just the numeric part, and ensure the final number fits within the allowed range for your system."
    },
    "keyInsights": [
      "Handle leading whitespace and signs properly",
      "Extract only the numeric part of the string",
      "Clamp results to 32-bit signed integer range",
      "Consider edge cases like empty strings and invalid inputs"
    ],
    "realWorldApplications": [
      {
        "domain": "Data Processing",
        "application": "Parsing Configuration Files",
        "description": "Convert string values from configuration files to numeric values for system settings."
      },
      {
        "domain": "Web Development",
        "application": "Form Input Validation",
        "description": "Convert user input strings to numbers while handling various formats and edge cases."
      }
    ],
    "engineeringLessons": [
      {
        "principle": "Input Validation",
        "lesson": "Always validate and sanitize input data before processing to prevent errors and security issues.",
        "application": "This principle applies to all data processing systems, from web forms to file parsing."
      }
    ],
    "implementations": {
      "bruteForce": {
        "title": "Manual Parsing Approach",
        "timeComplexity": "O(n)",
        "spaceComplexity": "O(1)",
        "code": "var myAtoi = function(s) {\n  const parsed = +(s.trim().match(/^[-+]?\\\\d+/g) || [0])[0];\n  const clamped = Math.min(Math.max(parsed, (-2)**31), 2**31 - 1);\n  return clamped;\n};"
      },
      "optimized": {
        "title": "Regex and Clamp Approach",
        "timeComplexity": "O(n)",
        "spaceComplexity": "O(1)",
        "code": "var myAtoi = function(s) {\n  const parsed = +(s.trim().match(/^[-+]?\\\\d+/g) || [0])[0];\n  const clamped = Math.min(Math.max(parsed, (-2)**31), 2**31 - 1);\n  return clamped;\n};"
      }
    },
    "animationStates": [
      {
        "step": 1,
        "title": "Trim Leading Whitespace",
        "description": "Remove any leading whitespace from the input string.",
        "data": { "input": "   -42abc", "output": "-42abc" }
      },
      {
        "step": 2,
        "title": "Extract Numeric Part",
        "description": "Use regex to extract the numeric part including optional sign.",
        "data": { "input": "-42abc", "output": "-42" }
      },
      {
        "step": 3,
        "title": "Convert to Number",
        "description": "Convert the extracted string to a number.",
        "data": { "input": "-42", "output": -42 }
      },
      {
        "step": 4,
        "title": "Clamp to Range",
        "description": "Ensure the number is within 32-bit signed integer range.",
        "data": { "input": -42, "output": -42 }
      }
    ],
    "animationData": {
      "algorithmType": "string-processing",
      "dataStructure": "String",
      "keyOperations": ["trim", "regex-match", "parse", "clamp"],
      "visualizationHints": "Show string transformation steps with highlighting"
    },
    "tags": ["String", "Math", "Parsing"],
    "acceptanceRate": "17.5%",
    "frequency": 60,
    "estimatedTime": "20 min",
    "popularity": 85,
    "id": "string-to-integer-atoi",
    "createdAt": Date.now(),
    "lastModified": Date.now()
  }

  // Second algorithm: Reverse Integer
  const reverseData = {
    "algorithmName": "reverse-integer",
    "problemId": 7,
    "title": "Reverse Integer",
    "description": "Given a signed 32-bit integer x, the algorithm should return x with its digits reversed. If reversing x causes the value to go outside the signed 32-bit integer range [-2^31, 2^31 - 1], then return 0.",
    "difficulty": "Easy",
    "category": "Math",
    "timeComplexity": "O(log n)",
    "spaceComplexity": "O(1)",
    "examples": [
      {
        "input": "123",
        "output": "321",
        "explanation": "The digits of the number 123 are reversed to form the number 321."
      },
      {
        "input": "-123",
        "output": "-321",
        "explanation": "The digits of the number 123 are reversed to form the number 321. The negative sign is preserved."
      }
    ],
    "constraints": [
      "-2^31 <= x <= 2^31 - 1"
    ],
    "solution": {
      "javascript": "var reverse = function(x) {\n  const reversed = String(Math.abs(x)).split('').reverse().join('');\n\n  if (reversed > Math.pow(2, 31)) {\n    return 0;\n  }\n\n  return reversed * Math.sign(x);\n};",
      "explanation": "The algorithm first converts the absolute value of the input number to a string, splits the string into an array of characters, reverses the array, and then joins the array back into a string. This effectively reverses the digits of the input number. If the reversed number exceeds the maximum value of a 32-bit signed integer, the algorithm returns 0. Otherwise, it returns the reversed number with the original sign."
    },
    "analogy": {
      "title": "Reversing a Queue",
      "content": "Imagine you have a queue of people. The process of reversing an integer is like asking each person in the queue to leave and join another queue in the reverse order. If the new queue becomes too long (exceeds the maximum 32-bit integer), we disband the queue and return an empty queue (0)."
    },
    "keyInsights": [
      "The algorithm uses the built-in JavaScript functions to reverse the digits of the number.",
      "The algorithm takes into account the possibility of integer overflow."
    ],
    "realWorldApplications": [
      {
        "domain": "Data Validation",
        "application": "Checking for Palindromic Numbers",
        "description": "This algorithm can be used in data validation to check if a number is a palindrome. A number is a palindrome if it remains the same when its digits are reversed."
      }
    ],
    "engineeringLessons": [
      {
        "principle": "Handling Edge Cases",
        "lesson": "Always consider edge cases in your algorithms. In this case, the algorithm handles the edge case where the reversed number exceeds the maximum 32-bit integer.",
        "application": "This principle is applicable in all areas of software development. Always consider and handle edge cases to prevent unexpected behavior."
      }
    ],
    "implementations": {
      "bruteForce": {
        "title": "Reversing Digits Using String and Array Operations",
        "timeComplexity": "O(log n)",
        "spaceComplexity": "O(1)",
        "code": "var reverse = function(x) {\n  const reversed = String(Math.abs(x)).split('').reverse().join('');\n\n  if (reversed > Math.pow(2, 31)) {\n    return 0;\n  }\n\n  return reversed * Math.sign(x);\n};"
      }
    },
    "animationStates": [
      {
        "step": 1,
        "title": "Convert to String",
        "description": "Convert the absolute value of the input number to a string.",
        "data": {
          "input": "123",
          "output": "'123'"
        }
      },
      {
        "step": 2,
        "title": "Reverse String",
        "description": "Reverse the string.",
        "data": {
          "input": "'123'",
          "output": "'321'"
        }
      },
      {
        "step": 3,
        "title": "Check for Overflow",
        "description": "Check if the reversed number exceeds the maximum 32-bit integer.",
        "data": {
          "input": "'321'",
          "output": "false"
        }
      },
      {
        "step": 4,
        "title": "Return Result",
        "description": "Return the reversed number with the original sign.",
        "data": {
          "input": "'321'",
          "output": "321"
        }
      }
    ],
    "animationData": {
      "algorithmType": "Math",
      "dataStructure": "Number",
      "keyOperations": [
        "Convert to string",
        "Reverse string",
        "Check for overflow",
        "Return result"
      ],
      "visualizationHints": "Visualize the process of reversing the digits of the number."
    },
    "tags": [
      "Math",
      "String",
      "Array"
    ],
    "acceptanceRate": "25.5%",
    "frequency": 85,
    "estimatedTime": "15 min",
    "popularity": 90,
    "id": "reverse-integer",
    "createdAt": Date.now(),
    "lastModified": Date.now()
  }

  console.log('Testing String to Integer Atoi...')
  const atoiValid = validateAlgorithmData(atoiData)
  console.log('✅ Atoi data valid:', atoiValid)

  console.log('Testing Reverse Integer...')
  const reverseValid = validateAlgorithmData(reverseData)
  console.log('✅ Reverse data valid:', reverseValid)

  if (atoiValid) {
    const saved1 = LocalStorageManager.saveAlgorithm(atoiData as any)
    console.log('💾 Atoi saved to localStorage:', saved1)
  }

  if (reverseValid) {
    const saved2 = LocalStorageManager.saveAlgorithm(reverseData as any)
    console.log('💾 Reverse saved to localStorage:', saved2)
  }

  // Test loading
  const loadedAtoi = LocalStorageManager.loadAlgorithm('string-to-integer-atoi')
  const loadedReverse = LocalStorageManager.loadAlgorithmByProblemId(7)

  console.log('📖 Loaded Atoi by ID:', !!loadedAtoi)
  console.log('📖 Loaded Reverse by problem ID:', !!loadedReverse)

  // Test getting all algorithms
  const allAlgorithms = LocalStorageManager.loadAllAlgorithms()
  console.log('📋 Total algorithms in localStorage:', allAlgorithms.length)
  allAlgorithms.forEach(algo => {
    console.log(`- ${algo.title} (ID: ${algo.problemId})`)
  })

  return {
    atoiValid,
    reverseValid,
    loadedAtoi: !!loadedAtoi,
    loadedReverse: !!loadedReverse,
    totalAlgorithms: allAlgorithms.length
  }
}

// Export for use in browser console
if (typeof window !== 'undefined') {
  (window as any).testAlgorithmData = testAndSaveAlgorithmData
  (window as any).validateAlgorithmData = validateAlgorithmData
  (window as any).testUserProvidedData = testUserProvidedData
  console.log('🔧 Test functions available in console:')
  console.log('- testAlgorithmData() - Test all algorithm data')
  console.log('- validateAlgorithmData(data) - Validate specific data')
  console.log('- testUserProvidedData() - Test the specific data you provided')
}
