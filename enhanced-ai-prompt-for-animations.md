# 🎭 Enhanced AI Prompt for Dynamic Algorithm Animations

This document provides the enhanced AI prompt to generate proper animation data for D3, ReactFlow, and Three.js visualizations from JavaScript algorithm code.

## 🤖 Enhanced AI Prompt Template

```markdown
You are an expert algorithm animator. Analyze the following JavaScript code and generate comprehensive animation data for interactive visualizations.

**JavaScript Code to Analyze:**
```javascript
[PASTE THE JAVASCRIPT CODE HERE]
```

**Requirements:**
Generate a complete algorithm analysis with concrete animation data optimized for D3.js, ReactFlow, and Three.js visualizations.

**Output Format:**
```json
{
  "algorithmName": "descriptive-name",
  "problemId": 123,
  "title": "Algorithm Title",
  "description": "Detailed algorithm description",
  "difficulty": "Easy|Medium|Hard",
  "category": "Array|Linked List|Tree|Graph|String|Dynamic Programming|Sorting",
  "timeComplexity": "O(n)|O(n²)|O(log n)|etc",
  "spaceComplexity": "O(1)|O(n)|O(log n)|etc",

  "examples": [
    {
      "input": "concrete example input",
      "output": "concrete example output",
      "explanation": "step-by-step explanation"
    }
  ],

  "animationStates": [
    {
      "step": 1,
      "title": "Descriptive Step Title",
      "description": "What happens in this step",
      "data": {
        // CONCRETE VALUES - no placeholders
        "currentIndex": 0,
        "array": [2, 7, 11, 15],
        "target": 9,
        "left": 0,
        "right": 3,
        "currentSum": 17,
        "comparison": "greater",

        // For linked lists:
        "lessHead": {"value": 0, "next": null},
        "greaterHead": {"value": 0, "next": null},
        "lessList": [{"value": 1}, {"value": 2}],
        "greaterList": [{"value": 4}, {"value": 3}],
        "currentNode": {"value": 1, "next": {"value": 4, "next": null}},
        "partitionValue": 3,
        "finalList": [1, 2, 4, 3, 5],

        // For trees:
        "currentNode": {"value": 5, "left": {"value": 3}, "right": {"value": 7}},
        "traversalPath": [5, 3, 7],
        "visitedNodes": [3, 5],
        "currentLevel": 1,

        // Timing information
        "duration": 500,
        "delay": 200,
        "easing": "ease-out"
      }
    }
  ],

  "animation": {
    "interactiveData": {
      "algorithmType": "linked-list|array|tree|graph|string|dp",
      "dataStructure": "Linked List|Array|Binary Tree|Graph|String|etc",
      "keyOperations": [
        "Pointer movement",
        "Node traversal",
        "Value comparison",
        "List partitioning",
        "Tree traversal",
        "Array indexing"
      ],
      "visualizationHints": "Specific hints for each visualization library",
      "d3Hints": "SVG-based visualization approach",
      "reactFlowHints": "Node-edge based visualization approach",
      "threeHints": "3D spatial visualization approach"
    }
  },

  "metadata": {
    "tags": ["tag1", "tag2", "tag3"],
    "acceptanceRate": "50.5%",
    "frequency": 85
  },

  "visualizationConfig": {
    "d3": {
      "layout": "horizontal|vertical|circular",
      "nodeSize": 40,
      "edgeStyle": "curved|straight",
      "colorScheme": "blue-green|red-blue|etc",
      "animationDuration": 500
    },
    "reactFlow": {
      "nodeTypes": ["default", "custom"],
      "edgeTypes": ["default", "smoothstep"],
      "layoutAlgorithm": "dagre|elk",
      "interactive": true
    },
    "three": {
      "cameraPosition": [0, 0, 10],
      "lighting": "ambient|directional|point",
      "materialType": "standard|phong|lambert",
      "geometryType": "box|sphere|cylinder"
    }
  }
}
```

## 🎯 Key Improvements for Animation Generation

### 1. **Concrete Data Instead of Placeholders**
```javascript
// ❌ BAD - Generic placeholders
"data": {
  "currentIndex": "index",
  "array": "array_values",
  "target": "target_value"
}

// ✅ GOOD - Concrete values
"data": {
  "currentIndex": 2,
  "array": [2, 7, 11, 15],
  "target": 9
}
```

### 2. **Algorithm-Specific Data Structures**
```javascript
// For Linked Lists:
"data": {
  "lessList": [{"value": 1}, {"value": 2}],
  "greaterList": [{"value": 4}, {"value": 3}],
  "currentNode": {"value": 1, "next": {"value": 4}}
}

// For Arrays:
"data": {
  "array": [2, 7, 11, 15],
  "currentIndex": 2,
  "left": 0,
  "right": 3
}

// For Trees:
"data": {
  "currentNode": {"value": 5, "left": {"value": 3}, "right": {"value": 7}},
  "traversalPath": [5, 3, 7],
  "currentLevel": 1
}
```

### 3. **Visualization-Specific Hints**
```javascript
"interactiveData": {
  "d3Hints": "Use SVG circles for nodes, curved paths for connections",
  "reactFlowHints": "Use custom node types with expandable details",
  "threeHints": "Use 3D boxes for nodes, cylinders for connections"
}
```

### 4. **Timing and Animation Information**
```javascript
"data": {
  "duration": 500,
  "delay": 200,
  "easing": "ease-out",
  "transitionType": "fade|slide|scale|rotate"
}
```

## 🎨 Library-Specific Animation Patterns

### D3.js Patterns
```javascript
// Node highlighting
d3.selectAll('.node')
  .filter(d => d.index === currentIndex)
  .transition()
  .duration(500)
  .style('fill', 'orange')

// Path animations
d3.select('.path')
  .transition()
  .duration(1000)
  .attrTween('stroke-dasharray', function() {
    return d3.interpolateString('0,100', '100,0')
  })
```

### ReactFlow Patterns
```javascript
// Node updates
setNodes(nodes => nodes.map(node =>
  node.id === targetNode
    ? { ...node, data: { ...node.data, highlighted: true } }
    : node
))

// Edge animations
setEdges(edges => edges.map(edge =>
  edge.id === targetEdge
    ? { ...edge, animated: true, style: { stroke: 'red' } }
    : edge
))
```

### Three.js Patterns
```javascript
// Object transformations
const mesh = scene.getObjectByName(targetName)
if (mesh) {
  gsap.to(mesh.position, {
    x: targetPosition.x,
    y: targetPosition.y,
    z: targetPosition.z,
    duration: 1
  })

  gsap.to(mesh.material, {
    opacity: 0.8,
    duration: 0.5
  })
}
```

## 🔧 Usage in Your Application

### 1. **Enhanced AI Analysis** (`app/api/analyze-js/route.ts`)
```typescript
const enhancedPrompt = `
  Analyze this JavaScript code and generate animation data using the enhanced format above.
  Focus on concrete values, algorithm-specific data structures, and visualization hints.
  Include timing information and library-specific configuration.
`

const response = await openai.chat.completions.create({
  model: "gpt-4",
  messages: [
    {
      role: "system",
      content: "You are an expert algorithm animator. Generate concrete animation data for interactive visualizations."
    },
    {
      role: "user",
      content: enhancedPrompt + jsCode
    }
  ]
})
```

### 2. **Animation Component Integration**
```typescript
// In your animation components
import { AlgorithmAnimationGenerator } from '@/lib/algorithm-animation-generator'
import { executeFadeIn } from '@/lib/animation-libraries/d3-atoms'

const generateAnimations = async (algorithmData: any) => {
  const animations = await AlgorithmAnimationGenerator.generateAnimations(
    algorithmData,
    animationLibraries
  )

  return animations.map(anim => ({
    ...anim,
    atoms: anim.atoms.map(atom => ({
      ...atom,
      execute: () => executeLibraryAtom(atom, anim.library)
    }))
  }))
}
```

### 3. **Performance Optimization**
```typescript
// Use the animation optimizer
import { AnimationOptimizer } from '@/lib/animation-optimizer'

const optimizedAnimations = AnimationOptimizer.optimizeElements(
  generatedAnimations,
  cameraPosition
)
```

## 📊 Expected Output Example

For the partition list algorithm, the enhanced AI should generate:

```json
{
  "algorithmName": "partition-list",
  "category": "Linked List",
  "animationStates": [
    {
      "step": 2,
      "title": "Traverse List",
      "data": {
        "currentNode": {"value": 1, "next": {"value": 4}},
        "lessList": [{"value": 1}, {"value": 2}],
        "greaterList": [{"value": 4}],
        "partitionValue": 3,
        "duration": 600,
        "easing": "ease-out"
      }
    }
  ],
  "visualizationConfig": {
    "d3": {
      "nodeSize": 40,
      "colorScheme": "green-red",
      "layout": "horizontal"
    },
    "reactFlow": {
      "interactive": true,
      "layoutAlgorithm": "dagre"
    },
    "three": {
      "geometryType": "box",
      "materialType": "standard"
    }
  }
}
```

## 🎯 Benefits of Enhanced Prompt

1. **🎨 Better Visualizations**: Concrete data enables accurate animations
2. **⚡ Performance**: Optimized data structures reduce processing time
3. **🔧 Maintainability**: Structured data is easier to work with
4. **📱 Cross-Platform**: Works across D3, ReactFlow, and Three.js
5. **🎭 Interactivity**: Rich data enables interactive features
6. **📊 Analytics**: Better data for performance monitoring

## 🚀 Next Steps

1. **Update your AI prompt** in `app/api/analyze-js/route.ts`
2. **Use the animation generator** in your components
3. **Leverage existing libraries** from `@/lib/animation-libraries/`
4. **Monitor performance** with the built-in optimizer
5. **Test with different algorithms** to ensure broad compatibility

This enhanced approach will give you production-ready animations that work seamlessly across all three visualization libraries! 🎉
