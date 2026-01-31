# 🎬 Universal Animation Data Format

## 🎯 CRITICAL: This is the EXACT format the system needs

Your generated animation steps MUST follow this format EXACTLY for D3, Mermaid, and React Flow to animate them perfectly.

---

## 📊 Universal Animation Step Structure

```json
{
  "step": 1,
  "title": "Brief step title (e.g., 'Check First Element')",
  "description": "1-2 sentence explanation of what happens in this step",
  "code": "const complement = target - nums[i]",
  
  "data": {
    // ===== DATA STRUCTURES (choose what applies) =====
    
    "array": [
      {"value": 2, "index": 0, "state": "checking", "color": "#f59e0b"},
      {"value": 7, "index": 1, "state": "unchecked", "color": "#6b7280"},
      {"value": 11, "index": 2, "state": "unchecked", "color": "#6b7280"}
    ],
    
    "string": [
      {"char": "a", "index": 0, "state": "active", "color": "#3b82f6"},
      {"char": "b", "index": 1, "state": "unchecked", "color": "#6b7280"}
    ],
    
    "linkedList": [
      {"value": 1, "index": 0, "state": "active", "color": "#3b82f6", "next": true},
      {"value": 4, "index": 1, "state": "checking", "color": "#f59e0b", "next": true},
      {"value": 5, "index": 2, "state": "unchecked", "color": "#6b7280", "next": false}
    ],
    
    "tree": [
      {"value": 1, "state": "active", "depth": 0, "path": "0"},
      {"value": 2, "state": "unchecked", "depth": 1, "path": "0L"},
      {"value": 3, "state": "unchecked", "depth": 1, "path": "0R"}
    ],
    
    "graph": {
      "nodes": [
        {"id": "A", "value": "A", "state": "active", "color": "#3b82f6"},
        {"id": "B", "value": "B", "state": "unchecked", "color": "#6b7280"}
      ],
      "edges": [
        {"from": "A", "to": "B", "type": "directed", "weight": 5}
      ]
    },
    
    "hashMap": {
      "2": {"value": 0, "state": "stored", "recent": true},
      "7": {"value": 1, "state": "stored", "recent": false}
    },
    
    "stack": [
      {"value": 5, "state": "stored"},
      {"value": 3, "state": "active"},
      {"value": 1, "state": "stored"}
    ],
    
    "queue": [
      {"value": 1, "state": "stored"},
      {"value": 2, "state": "stored"},
      {"value": 3, "state": "active"}
    ],
    
    "matrix": [
      {"value": 1, "row": 0, "col": 0, "state": "active"},
      {"value": 2, "row": 0, "col": 1, "state": "unchecked"}
    ],
    
    // ===== VARIABLES (track actual variable values) =====
    "variables": {
      "i": {"value": 0, "type": "number", "highlighted": true, "changed": false},
      "target": {"value": 9, "type": "number", "highlighted": false},
      "complement": {"value": 7, "type": "number", "highlighted": true, "changed": true},
      "found": {"value": false, "type": "boolean", "highlighted": false}
    },
    
    // ===== POINTERS (optional: track indices/pointers) =====
    "pointers": [
      {"name": "left", "pointsTo": 0, "color": "#3b82f6", "type": "index"},
      {"name": "right", "pointsTo": 3, "color": "#22c55e", "type": "index"}
    ],
    
    // ===== CONNECTIONS (optional: for graphs/trees) =====
    "connections": [
      {"from": "node-0", "to": "node-1", "type": "directed", "state": "active", "color": "#3b82f6"}
    ],
    
    // ===== OPERATION METADATA (always include) =====
    "operation": {
      "type": "HashMap Lookup",
      "complexity": "O(1)",
      "description": "Check if complement (7) exists in hashMap",
      "pseudocode": "if (hashMap.has(complement))",
      "result": "Not found"
    }
  }
}
```

---

## 🎨 STATE SYSTEM (MUST USE THESE)

```javascript
// Element states - ALWAYS use one of these
"state": "default"    // Not yet processed (gray #6b7280)
"state": "active"     // Currently processing (blue #3b82f6)
"state": "checking"   // Being evaluated (orange #f59e0b)
"state": "result"     // Solution found (green #22c55e)
"state": "error"      // Error/failure (red #ef4444)
"state": "stored"     // Saved in data structure (purple #8b5cf6)
"state": "visited"    // Already processed (cyan #06b6d4)
"state": "current"    // Current pointer/focus (pink #ec4899)
```

---

## 📝 EXAMPLES FOR COMMON ALGORITHMS

### Example 1: Two Sum (Array + HashMap)

```json
{
  "step": 1,
  "title": "Check First Element",
  "description": "Calculate complement (9-2=7) and check if it exists in hashMap. Not found, so store current value.",
  "code": "const complement = target - nums[i]; if (hashMap[complement] !== undefined)",
  "data": {
    "array": [
      {"value": 2, "index": 0, "state": "checking", "color": "#f59e0b"},
      {"value": 7, "index": 1, "state": "unchecked", "color": "#6b7280"},
      {"value": 11, "index": 2, "state": "unchecked", "color": "#6b7280"},
      {"value": 15, "index": 3, "state": "unchecked", "color": "#6b7280"}
    ],
    "hashMap": {},
    "variables": {
      "i": {"value": 0, "type": "number", "highlighted": true},
      "target": {"value": 9, "type": "number"},
      "complement": {"value": 7, "type": "number", "highlighted": true, "changed": true},
      "found": {"value": false, "type": "boolean"}
    },
    "pointers": [
      {"name": "i", "pointsTo": 0, "color": "#f59e0b"}
    ],
    "operation": {
      "type": "HashMap Lookup",
      "complexity": "O(1)",
      "description": "Check if complement (7) exists in hashMap",
      "result": "Not found - will store current value"
    }
  }
}
```

### Example 2: Reverse Linked List

```json
{
  "step": 2,
  "title": "Reverse Pointer",
  "description": "Change current node's next pointer to point to previous node, reversing the connection.",
  "code": "current.next = prev",
  "data": {
    "linkedList": [
      {"value": 1, "index": 0, "state": "stored", "color": "#8b5cf6", "next": false},
      {"value": 2, "index": 1, "state": "active", "color": "#3b82f6", "next": true},
      {"value": 3, "index": 2, "state": "unchecked", "color": "#6b7280", "next": true}
    ],
    "variables": {
      "prev": {"value": 1, "type": "number", "highlighted": true},
      "current": {"value": 2, "type": "number", "highlighted": true},
      "next": {"value": 3, "type": "number"}
    },
    "pointers": [
      {"name": "prev", "pointsTo": 0, "color": "#8b5cf6"},
      {"name": "current", "pointsTo": 1, "color": "#3b82f6"},
      {"name": "next", "pointsTo": 2, "color": "#6b7280"}
    ],
    "connections": [
      {"from": "node-1", "to": "node-0", "type": "directed", "state": "active", "color": "#22c55e"}
    ],
    "operation": {
      "type": "Pointer Manipulation",
      "complexity": "O(1)",
      "description": "Reverse the connection from current to prev",
      "result": "Connection reversed successfully"
    }
  }
}
```

### Example 3: Binary Tree Traversal

```json
{
  "step": 3,
  "title": "Visit Left Child",
  "description": "Move to the left child node and mark it as currently being processed.",
  "code": "current = current.left",
  "data": {
    "tree": [
      {"value": 1, "state": "visited", "depth": 0, "path": "0", "color": "#06b6d4"},
      {"value": 2, "state": "active", "depth": 1, "path": "0L", "color": "#3b82f6"},
      {"value": 3, "state": "unchecked", "depth": 1, "path": "0R", "color": "#6b7280"},
      {"value": 4, "state": "unchecked", "depth": 2, "path": "0LL", "color": "#6b7280"},
      {"value": 5, "state": "unchecked", "depth": 2, "path": "0LR", "color": "#6b7280"}
    ],
    "variables": {
      "current": {"value": 2, "type": "number", "highlighted": true, "changed": true},
      "result": {"value": [1], "type": "array"}
    },
    "operation": {
      "type": "Tree Traversal",
      "complexity": "O(1)",
      "description": "Navigate to left child node",
      "result": "Moved to node with value 2"
    }
  }
}
```

### Example 4: Dynamic Programming (Matrix)

```json
{
  "step": 4,
  "title": "Fill DP Cell",
  "description": "Calculate dp[i][j] based on values from dp[i-1][j] and dp[i][j-1].",
  "code": "dp[i][j] = dp[i-1][j] + dp[i][j-1]",
  "data": {
    "matrix": [
      {"value": 1, "row": 0, "col": 0, "state": "stored", "color": "#8b5cf6"},
      {"value": 1, "row": 0, "col": 1, "state": "stored", "color": "#8b5cf6"},
      {"value": 1, "row": 1, "col": 0, "state": "stored", "color": "#8b5cf6"},
      {"value": 2, "row": 1, "col": 1, "state": "active", "color": "#3b82f6"}
    ],
    "variables": {
      "i": {"value": 1, "type": "number", "highlighted": true},
      "j": {"value": 1, "type": "number", "highlighted": true},
      "result": {"value": 2, "type": "number", "highlighted": true, "changed": true}
    },
    "operation": {
      "type": "Dynamic Programming",
      "complexity": "O(1)",
      "description": "Compute current cell from previous cells",
      "pseudocode": "dp[i][j] = dp[i-1][j] + dp[i][j-1]",
      "result": "dp[1][1] = 1 + 1 = 2"
    }
  }
}
```

---

## ✅ QUALITY CHECKLIST

Before generating animation steps, ensure:

- [ ] **Correct Structure**: Each step has "step", "title", "description", "code", "data"
- [ ] **Right Data Structure**: Use "array", "linkedList", "tree", "graph", "hashMap", etc.
- [ ] **Valid States**: Only use the 8 defined states (default, active, checking, result, error, stored, visited, current)
- [ ] **Proper Colors**: Use the exact hex codes for each state
- [ ] **Real Values**: All element values must be from the actual algorithm execution
- [ ] **Variables Tracked**: Include all relevant variables with actual values
- [ ] **Operation Metadata**: Always include type, complexity, description
- [ ] **Progressive States**: Each step should show how data evolves
- [ ] **Unique Indices**: Array/list elements must have correct index values
- [ ] **Tree Paths**: Tree nodes must have depth and path (0, 0L, 0R, 0LL, etc.)
- [ ] **Graph IDs**: Graph nodes must have unique IDs
- [ ] **HashMap Keys**: HashMap keys must be strings

---

## 🚫 COMMON MISTAKES TO AVOID

❌ **DON'T** use generic placeholders:
```json
{"array": [1, 2, 3, 4]}  // Missing state and color!
```

✅ **DO** include full element data:
```json
{"array": [
  {"value": 1, "index": 0, "state": "active", "color": "#3b82f6"},
  {"value": 2, "index": 1, "state": "unchecked", "color": "#6b7280"}
]}
```

❌ **DON'T** make up states:
```json
{"state": "processing"}  // Invalid state!
```

✅ **DO** use defined states:
```json
{"state": "checking"}  // Valid state with proper color
```

❌ **DON'T** forget operation metadata:
```json
{"data": {"array": [...]}}  // Missing operation!
```

✅ **DO** always include operation:
```json
{
  "data": {
    "array": [...],
    "operation": {
      "type": "Comparison",
      "complexity": "O(1)",
      "description": "Compare two elements"
    }
  }
}
```

---

## 🎯 FINAL INSTRUCTIONS

1. **Trace the Code**: Follow the actual code execution step by step
2. **Use Real Data**: All values must come from actual algorithm execution
3. **Show State Changes**: Each step must show how data evolves
4. **Include All Metadata**: Variables, operation, pointers, etc.
5. **Follow Format Exactly**: The system depends on this exact structure
6. **Test Your JSON**: Ensure all JSON is valid and parseable
7. **Be Specific**: Use actual variable names and values from the code

**Remember: These animation steps are what makes the visualizations come alive! Make them accurate, detailed, and beautiful! 🎬✨**

