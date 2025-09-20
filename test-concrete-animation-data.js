const fs = require('fs');
const path = require('path');

// Test JavaScript code for shortest palindrome
const shortestPalindromeCode = `
var shortestPalindrome = function(s) {
  const reversed = s.split('').reverse().join('');
  for (let i = s.length; i > 0; i--) {
    if (s.slice(0, i) === reversed.slice(s.length - i)) {
      return reversed.slice(0, reversed.length - i) + s;
    }
  }
  return '';
};
`;

// Test function to validate concrete animation data
function validateAnimationData(algorithmData) {
  console.log('=== VALIDATING ANIMATION DATA ===');

  if (!algorithmData.animationStates) {
    console.error('❌ No animationStates found');
    return false;
  }

  if (!Array.isArray(algorithmData.animationStates)) {
    console.error('❌ animationStates is not an array');
    return false;
  }

  if (algorithmData.animationStates.length === 0) {
    console.error('❌ animationStates is empty');
    return false;
  }

  console.log(`✅ Found ${algorithmData.animationStates.length} animation states`);

  let validStates = 0;
  let concreteDataCount = 0;

  for (let i = 0; i < algorithmData.animationStates.length; i++) {
    const state = algorithmData.animationStates[i];
    console.log(`\n--- State ${i + 1} ---`);
    console.log(`Step: ${state.step}`);
    console.log(`Title: ${state.title}`);
    console.log(`Description: ${state.description}`);
    console.log(`Data:`, state.data);

    // Check if data is concrete (not generic placeholders)
    if (state.data) {
      const dataStr = JSON.stringify(state.data).toLowerCase();

      // Check for concrete data patterns
      const hasConcreteString = state.data.original && typeof state.data.original === 'string' && !state.data.original.includes('s') && state.data.original.length > 1;
      const hasConcreteReversed = state.data.reversed && typeof state.data.reversed === 'string' && !state.data.reversed.includes('reversed') && state.data.reversed.length > 1;
      const hasConcreteIndex = typeof state.data.currentIndex === 'number' || typeof state.data.i === 'number';
      const hasConcreteSlices = state.data.s_slice && state.data.reversed_slice;

      if (hasConcreteString || hasConcreteReversed || hasConcreteIndex || hasConcreteSlices) {
        concreteDataCount++;
        console.log('✅ Has concrete data');
      } else {
        console.log('❌ Only generic/placeholder data');
      }

      validStates++;
    } else {
      console.log('❌ No data object');
    }
  }

  console.log(`\n=== VALIDATION RESULTS ===`);
  console.log(`Valid states: ${validStates}/${algorithmData.animationStates.length}`);
  console.log(`States with concrete data: ${concreteDataCount}/${algorithmData.animationStates.length}`);

  if (concreteDataCount > 0) {
    console.log('✅ SUCCESS: Animation data contains concrete values');
    return true;
  } else {
    console.log('❌ FAILED: All animation data is generic/placeholders');
    return false;
  }
}

// Test with the hardcoded JSON first
const testData = {
  "algorithmName": "shortest-palindrome",
  "problemId": 214,
  "title": "Shortest Palindrome by Front Addition",
  "description": "Given a string s, the goal is to transform it into the shortest possible palindrome by adding characters only at the front of s.",
  "difficulty": "Hard",
  "category": "String Manipulation",
  "timeComplexity": "O(n^2)",
  "spaceComplexity": "O(n)",
  "examples": [
    {
      "input": "aacecaaa",
      "output": "aaacecaaa",
      "explanation": "Prepending 'a' makes the string a palindrome."
    },
    {
      "input": "abcd",
      "output": "dcbabcd",
      "explanation": "Prepending 'dcb' results in a palindrome."
    }
  ],
  "animationStates": [
    {
      "step": 1,
      "title": "Reverse the String",
      "description": "Create a reversed version of the input string to compare prefixes and suffixes.",
      "data": {
        "original": "aacecaaa",
        "reversed": "aaacecaa",
        "currentIndex": 0
      }
    },
    {
      "step": 2,
      "title": "Check Prefix Length 8",
      "description": "Check if the first 8 characters match the last 8 characters of reversed string.",
      "data": {
        "original": "aacecaaa",
        "reversed": "aaacecaa",
        "currentIndex": 8,
        "s_slice": "aacecaaa",
        "reversed_slice": "aaacecaa"
      }
    },
    {
      "step": 3,
      "title": "Check Prefix Length 7",
      "description": "Check if the first 7 characters match the last 7 characters of reversed string.",
      "data": {
        "original": "aacecaaa",
        "reversed": "aaacecaa",
        "currentIndex": 7,
        "s_slice": "aacecaa",
        "reversed_slice": "aaaceca"
      }
    },
    {
      "step": 4,
      "title": "Find Match at Length 1",
      "description": "Found that the first character 'a' matches the last character of reversed string.",
      "data": {
        "original": "aacecaaa",
        "reversed": "aaacecaa",
        "currentIndex": 1,
        "s_slice": "a",
        "reversed_slice": "a",
        "match": true,
        "result": "aaacecaaa"
      }
    }
  ]
};

console.log('Testing with hardcoded concrete animation data:');
const isValid = validateAnimationData(testData);

if (isValid) {
  console.log('\n🎉 Animation data is properly structured with concrete values!');
  console.log('This data can be used by D3, ReactFlow, and Three.js components.');
} else {
  console.log('\n❌ Animation data needs concrete values, not generic placeholders.');
}

// Write test file for upload
fs.writeFileSync('test-shortest-palindrome.js', shortestPalindromeCode);
console.log('\n📄 Created test file: test-shortest-palindrome.js');
console.log('You can now upload this file to test the AI analysis with concrete animation data.');
