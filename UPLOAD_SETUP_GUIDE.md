# 🚀 JavaScript Algorithm Upload Feature

This feature allows you to upload any JavaScript algorithm file and automatically generate interactive visualizations and complete learning pages using AI.

## 📋 Prerequisites

### 1. OpenAI API Setup

You need an OpenAI API key to use the AI analysis feature:

1. **Get API Key**: Visit [OpenAI Platform](https://platform.openai.com/api-keys)
2. **Create Account**: Sign up if you don't have an account
3. **Generate Key**: Create a new API key
4. **Add to Environment**: Create a `.env.local` file in your project root:

```bash
# .env.local
OPENAI_API_KEY=your_actual_api_key_here
```

### 2. Install Dependencies

```bash
npm install openai@^4.28.0
```

## 🎯 How to Use

### 1. Access Upload Page

Navigate to `/upload-js` in your application:

```
http://localhost:3000/upload-js
```

### 2. Upload JavaScript File

- **Supported Format**: `.js` files (max 10MB)
- **Naming Convention**: Use LeetCode-style naming: `0001-two-sum.js`, `0015-3sum.js`, etc.
- **File Structure**: Standard JavaScript function with JSDoc comments

### 3. AI Analysis Process

The system will:

1. **Upload** your JavaScript file
2. **Analyze** the code using OpenAI GPT-4
3. **Extract** algorithm information:
   - Problem title and description
   - Time/space complexity
   - Algorithm category
   - Example inputs/outputs
   - Solution explanation
4. **Generate** interactive animations
5. **Create** a complete algorithm page

### 4. Generated Content

Each uploaded algorithm gets:

- ✅ **Problem Overview** with detailed description
- ✅ **Solution Code** with syntax highlighting
- ✅ **Interactive Animations** (Mermaid, React Flow, D3.js, Three.js)
- ✅ **Step-by-step Visualization**
- ✅ **Performance Metrics**
- ✅ **SEO-optimized Page**
- ✅ **Mobile-responsive Design**

## 📁 File Format Requirements

### Example File Structure

```javascript
/**
 * 1. Two Sum
 * https://leetcode.com/problems/two-sum/
 * Difficulty: Easy
 *
 * Given an array of integers nums and an integer target,
 * return indices of the two numbers such that they add up to target.
 *
 * You may assume that each input would have exactly one solution,
 * and you may not use the same element twice.
 *
 * Example 1:
 * Input: nums = [2,7,11,15], target = 9
 * Output: [0,1]
 * Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].
 *
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
function twoSum(nums, target) {
  const map = new Map();

  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];

    if (map.has(complement)) {
      return [map.get(complement), i];
    }

    map.set(nums[i], i);
  }

  return [];
}
```

## 🤖 AI Analysis Features

The AI analyzes your code and extracts:

### Algorithm Classification
- **Category**: Array, String, Linked List, Tree, Graph, etc.
- **Difficulty**: Easy, Medium, Hard
- **Complexity**: Time and Space complexity analysis

### Code Understanding
- **Data Structures**: Detects Maps, Sets, Arrays, Trees, etc.
- **Patterns**: Identifies recursion, iteration, two-pointers, etc.
- **Optimizations**: Recognizes algorithmic improvements

### Educational Content
- **Step-by-step Explanation**
- **Visual Learning Aids**
- **Practice Problems**
- **Common Pitfalls**

## 🎨 Visualization Types

### 1. Mermaid Flowcharts
- Algorithm flow visualization
- Step-by-step process diagrams
- Data structure representations

### 2. React Flow
- Interactive node-based diagrams
- Drag-and-drop interfaces
- Real-time data flow

### 3. D3.js Animations
- Data-driven visualizations
- Smooth transitions
- Statistical representations

### 4. Three.js 3D
- 3D algorithm visualization
- Spatial data representation
- Immersive learning experience

## 🔧 API Endpoints

### `/api/upload-js`
- **Method**: POST
- **Purpose**: Handle file uploads
- **Input**: FormData with JavaScript file
- **Output**: File metadata and content

### `/api/analyze-js`
- **Method**: POST
- **Purpose**: AI-powered code analysis
- **Input**: File content and metadata
- **Output**: Comprehensive algorithm analysis

### `/api/generate-page`
- **Method**: POST
- **Purpose**: Create algorithm page
- **Input**: Analysis results
- **Output**: Generated page URL and metadata

## 🚀 Getting Started

1. **Setup Environment**:
   ```bash
   cp .env.example .env.local
   # Add your OpenAI API key to .env.local
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Start Development Server**:
   ```bash
   npm run dev
   ```

4. **Upload Your First Algorithm**:
   - Go to `/upload-js`
   - Upload a JavaScript file
   - Watch the AI create your algorithm page!

## 📊 Supported Algorithms

The system can handle any algorithm type:

- ✅ **Array Algorithms**: Two Sum, Binary Search, Sorting
- ✅ **String Algorithms**: Palindrome, Anagrams, Pattern Matching
- ✅ **Linked List**: Reverse, Cycle Detection, Merge
- ✅ **Tree Algorithms**: Traversal, BST operations
- ✅ **Graph Algorithms**: DFS, BFS, Shortest Path
- ✅ **Dynamic Programming**: Knapsack, LCS, Matrix Chain
- ✅ **Greedy Algorithms**: Activity Selection, Huffman Coding
- ✅ **Backtracking**: N-Queens, Sudoku, Subsets

## 🎯 Use Cases

### For Students
- Learn algorithms visually
- Understand complex concepts
- Practice with interactive examples

### For Educators
- Create custom algorithm lessons
- Generate interactive content
- Assess student understanding

### For Developers
- Document algorithms
- Create technical tutorials
- Build interactive code examples

## 🔒 Security & Privacy

- **File Validation**: Only JavaScript files accepted
- **Size Limits**: 10MB maximum file size
- **Content Analysis**: Code is analyzed but not stored permanently
- **API Security**: OpenAI API key is server-side only

## 🐛 Troubleshooting

### Common Issues

1. **"Module not found" error**:
   ```bash
   npm install openai@^4.28.0
   ```

2. **"Invalid API key" error**:
   - Check your `.env.local` file
   - Ensure API key is valid
   - Check OpenAI account billing

3. **"File upload failed" error**:
   - Check file size (max 10MB)
   - Ensure file is valid JavaScript
   - Check file permissions

4. **"AI analysis failed" error**:
   - Verify OpenAI API key
   - Check internet connection
   - Try again later (rate limits)

## 📈 Future Enhancements

- [ ] **Gemini API Integration** (Google AI alternative)
- [ ] **Batch Upload** (multiple files at once)
- [ ] **Algorithm Comparison** (side-by-side analysis)
- [ ] **Custom Templates** (different visualization styles)
- [ ] **Collaborative Features** (shared algorithm libraries)
- [ ] **Performance Analytics** (algorithm efficiency metrics)

---

**🎉 Happy Learning!** Upload your algorithms and watch the AI create amazing interactive visualizations!
