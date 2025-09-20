/**
 * 🧪 ALGORITHM ANIMATION GENERATOR DEMO
 *
 * Demonstrates how to generate proper D3, ReactFlow, and Three.js animations
 * from dynamic algorithm objects like the partition-list example
 */

const fs = require('fs')

// ============================================================================
// 🎭 MOCK ANIMATION SYSTEM (Simplified for Demo)
// ============================================================================

class MockAnimationGenerator {
  static detectAlgorithmType(algorithmData) {
    const { category, animation, id } = algorithmData

    // Direct category detection
    if (category?.toLowerCase().includes('linked list')) return 'linked-list'
    if (category?.toLowerCase().includes('array')) return 'array'
    if (category?.toLowerCase().includes('tree')) return 'tree'
    if (category?.toLowerCase().includes('graph')) return 'graph'
    if (category?.toLowerCase().includes('string')) return 'string'

    // Animation data detection
    if (animation?.interactiveData?.algorithmType) {
      const type = animation.interactiveData.algorithmType.toLowerCase()
      if (type.includes('linked') || type.includes('list')) return 'linked-list'
      if (type.includes('array')) return 'array'
    }

    // ID-based detection
    if (id?.includes('partition') || id?.includes('linked')) return 'linked-list'
    if (id?.includes('sum') || id?.includes('search') || id?.includes('sort')) return 'array'

    return 'generic'
  }

  static generateFrames(algorithmData, algorithmType) {
    const frames = []

    // Use animationStates if available
    if (algorithmData.animationStates && Array.isArray(algorithmData.animationStates)) {
      algorithmData.animationStates.forEach((state, index) => {
        frames.push({
          step: state.step || index + 1,
          title: state.title || `Step ${index + 1}`,
          description: state.description || '',
          data: state.data || {},
          highlights: this.generateHighlightsFromData(state.data, algorithmType),
          transitions: this.generateTransitionsFromData(state.data, algorithmType),
          atoms: this.generateAtomsForStep(state, algorithmType)
        })
      })
    } else {
      // Generate frames from algorithm data
      frames.push(...this.generateFramesFromAlgorithm(algorithmData, algorithmType))
    }

    return frames
  }

  static generateHighlightsFromData(data, algorithmType) {
    const highlights = []

    switch (algorithmType) {
      case 'linked-list':
        if (data.currentNode) {
          highlights.push({
            type: 'node',
            target: 'current-node',
            style: 'active',
            duration: 500
          })
        }
        if (data.lessList) {
          highlights.push({
            type: 'range',
            target: 'less-list',
            style: 'success',
            duration: 300
          })
        }
        if (data.greaterList) {
          highlights.push({
            type: 'range',
            target: 'greater-list',
            style: 'warning',
            duration: 300
          })
        }
        break

      case 'array':
        if (data.currentIndex !== undefined) {
          highlights.push({
            type: 'node',
            target: data.currentIndex,
            style: 'active',
            duration: 400
          })
        }
        break
    }

    return highlights
  }

  static generateTransitionsFromData(data, algorithmType) {
    const transitions = []

    switch (algorithmType) {
      case 'linked-list':
        if (data.lessList && data.greaterList) {
          transitions.push({
            from: { x: 0, y: 0 },
            to: { x: -200, y: 0 },
            duration: 600,
            easing: 'ease-out',
            element: 'less-nodes'
          })
          transitions.push({
            from: { x: 0, y: 0 },
            to: { x: 200, y: 0 },
            duration: 600,
            easing: 'ease-out',
            element: 'greater-nodes'
          })
        }
        break
    }

    return transitions
  }

  static generateAtomsForStep(step, algorithmType) {
    const atoms = []

    // Basic atoms for any step
    atoms.push({
      type: 'visual',
      action: 'fadeIn',
      target: `step-${step.step}`,
      duration: 300,
      delay: 0
    })

    // Algorithm-specific atoms
    switch (algorithmType) {
      case 'linked-list':
        if (step.data?.lessList) {
          atoms.push({
            type: 'visual',
            action: 'highlight',
            target: 'less-list',
            duration: 500,
            style: 'success'
          })
        }
        if (step.data?.greaterList) {
          atoms.push({
            type: 'visual',
            action: 'highlight',
            target: 'greater-list',
            duration: 500,
            style: 'warning'
          })
        }
        break
    }

    return atoms
  }

  static generateFramesFromAlgorithm(algorithmData, algorithmType) {
    const frames = []

    // Generate basic initialization frame
    frames.push({
      step: 1,
      title: 'Initialization',
      description: 'Setting up the algorithm',
      data: { status: 'initialized' },
      highlights: [],
      transitions: [],
      atoms: [{
        type: 'visual',
        action: 'fadeIn',
        target: 'algorithm-setup',
        duration: 300
      }]
    })

    // Generate algorithm-specific frames
    switch (algorithmType) {
      case 'linked-list':
        frames.push(
          {
            step: 2,
            title: 'Create Dummy Nodes',
            description: 'Initialize lessHead and greaterHead pointers',
            data: { lessHead: null, greaterHead: null },
            highlights: [
              { type: 'node', target: 'lessHead', style: 'neutral', duration: 300 },
              { type: 'node', target: 'greaterHead', style: 'neutral', duration: 300 }
            ],
            transitions: [],
            atoms: [
              { type: 'visual', action: 'fadeIn', target: 'lessHead', duration: 300 },
              { type: 'visual', action: 'fadeIn', target: 'greaterHead', duration: 300 }
            ]
          },
          {
            step: 3,
            title: 'Process Nodes',
            description: 'Traverse through each node and partition',
            data: { processing: true },
            highlights: [{ type: 'node', target: 'current', style: 'active', duration: 400 }],
            transitions: [
              { from: { x: 0, y: 0 }, to: { x: 0, y: 50 }, duration: 500, easing: 'ease-out', element: 'current' }
            ],
            atoms: [
              { type: 'visual', action: 'move', target: 'current', duration: 500, from: { x: 0, y: 0 }, to: { x: 0, y: 50 } }
            ]
          }
        )
        break
    }

    // Generate completion frame
    frames.push({
      step: frames.length + 1,
      title: 'Complete',
      description: 'Algorithm execution finished',
      data: { completed: true },
      highlights: [{ type: 'node', target: 'result', style: 'success', duration: 600 }],
      transitions: [],
      atoms: [
        { type: 'visual', action: 'glow', target: 'result', duration: 600, intensity: 0.8 }
      ]
    })

    return frames
  }

  static generateLibrarySpecificAnimations(frames, library) {
    const animations = []

    frames.forEach(frame => {
      const libraryAnimation = {
        library,
        frame: frame.step,
        title: frame.title,
        atoms: frame.atoms.map(atom => ({
          ...atom,
          library,
          implementation: this.getLibraryImplementation(atom, library)
        })),
        highlights: frame.highlights,
        transitions: frame.transitions
      }
      animations.push(libraryAnimation)
    })

    return animations
  }

  static getLibraryImplementation(atom, library) {
    // Mock implementation details for each library
    switch (library) {
      case 'd3':
        return `d3.select('#${atom.target}').transition().duration(${atom.duration})`
      case 'reactflow':
        return `ReactFlow API call for ${atom.action} on ${atom.target}`
      case 'three':
        return `THREE.js scene manipulation for ${atom.action}`
      default:
        return `Generic implementation for ${atom.action}`
    }
  }
}

// ============================================================================
// 🧪 TEST EXECUTION
// ============================================================================

// Test with the partition-list algorithm data
const partitionListData = {
  "id": "partition-list",
  "problemId": 86,
  "title": "Partition List",
  "description": "A linked list algorithm that uses iterative approach to solve the problem with O(n) time complexity.",
  "difficulty": "Easy",
  "category": "Linked List",
  "timeComplexity": "O(n)",
  "spaceComplexity": "O(1)",
  "popularity": 75,
  "estimatedTime": "15-30 min",
  "realWorldUse": "Memory management, undo functionality, browser history",
  "problemStatement": "Given a linked list, traverse and modify nodes to achieve the desired result.",
  "examples": [
    {
      "input": "[1, 2, 3, 4, 5]",
      "output": "[1, 3, 5]",
      "explanation": "Returns nodes with odd indices from the linked list"
    }
  ],
  "animationStates": [
    {
      "step": 1,
      "title": "Initialize Pointers",
      "description": "Create dummy nodes and set up traversal pointers",
      "data": {
        "lessHead": { "value": 0, "next": null },
        "greaterHead": { "value": 0, "next": null },
        "less": { "value": 0, "next": null },
        "greater": { "value": 0, "next": null },
        "partitionValue": 3
      }
    },
    {
      "step": 2,
      "title": "Traverse List",
      "description": "Iterate through each node and partition based on value",
      "data": {
        "currentNode": { "value": 1, "next": { "value": 4, "next": { "value": 3, "next": { "value": 2, "next": { "value": 5, "next": null }}}}},
        "partitionValue": 3,
        "lessList": [{ "value": 1 }, { "value": 2 }],
        "greaterList": [{ "value": 4 }, { "value": 3 }, { "value": 5 }],
        "currentIndex": 0
      }
    },
    {
      "step": 3,
      "title": "Build Less-Than List",
      "description": "Connect nodes with values less than partition value",
      "data": {
        "less": { "value": 1, "next": { "value": 2, "next": null }},
        "lessList": [{ "value": 1 }, { "value": 2 }],
        "partitionValue": 3
      }
    },
    {
      "step": 4,
      "title": "Build Greater-Than List",
      "description": "Connect nodes with values greater than or equal to partition value",
      "data": {
        "greater": { "value": 4, "next": { "value": 3, "next": { "value": 5, "next": null }}},
        "greaterList": [{ "value": 4 }, { "value": 3 }, { "value": 5 }],
        "partitionValue": 3
      }
    },
    {
      "step": 5,
      "title": "Merge Lists",
      "description": "Connect the less-than list to the greater-than list",
      "data": {
        "finalList": [1, 2, 4, 3, 5],
        "less": { "value": 1, "next": { "value": 2, "next": { "value": 4, "next": { "value": 3, "next": { "value": 5, "next": null }}}}},
        "partitionValue": 3
      }
    }
  ],
  "animation": {
    "interactiveData": {
      "algorithmType": "linked-list",
      "dataStructure": "Linked List",
      "keyOperations": [
        "Pointer movement",
        "Node traversal",
        "Pointer manipulation"
      ],
      "visualizationHints": "Show linked list operations and data flow"
    }
  },
  "metadata": {
    "tags": [
      "Linked List",
      "Two Pointers"
    ],
    "acceptanceRate": "50%",
    "frequency": 50
  },
  "lastModified": 1758386283547
}

async function testAnimationGenerator() {
  console.log('🎭 ALGORITHM ANIMATION GENERATOR DEMO')
  console.log('='.repeat(60))

  try {
    // Step 1: Detect algorithm type
    console.log('\n1. 🎯 ALGORITHM TYPE DETECTION')
    const algorithmType = MockAnimationGenerator.detectAlgorithmType(partitionListData)
    console.log(`   ✅ Detected algorithm type: ${algorithmType}`)
    console.log(`   ✅ Category: ${partitionListData.category}`)
    console.log(`   ✅ Data Structure: ${partitionListData.animation.interactiveData.dataStructure}`)

    // Step 2: Generate animation frames
    console.log('\n2. 🎬 FRAME GENERATION')
    const frames = MockAnimationGenerator.generateFrames(partitionListData, algorithmType)
    console.log(`   ✅ Generated ${frames.length} animation frames:`)

    frames.forEach((frame, index) => {
      console.log(`      ${index + 1}. ${frame.title}`)
      console.log(`         Atoms: ${frame.atoms.length}`)
      console.log(`         Highlights: ${frame.highlights.length}`)
      console.log(`         Transitions: ${frame.transitions.length}`)
    })

    // Step 3: Generate library-specific animations
    console.log('\n3. 🎨 LIBRARY-SPECIFIC ANIMATIONS')
    const libraries = ['d3', 'reactflow', 'three']
    const allAnimations = {}

    libraries.forEach(library => {
      const animations = MockAnimationGenerator.generateLibrarySpecificAnimations(frames, library)
      allAnimations[library] = animations
      console.log(`\n   📊 ${library.toUpperCase()} ANIMATIONS:`)
      animations.forEach((anim, index) => {
        console.log(`      Frame ${index + 1}: ${anim.atoms.length} atoms`)
        anim.atoms.slice(0, 2).forEach((atom, atomIndex) => {
          console.log(`         ${atomIndex + 1}. ${atom.action} → ${atom.implementation.substring(0, 60)}...`)
        })
        if (anim.atoms.length > 2) {
          console.log(`         ... and ${anim.atoms.length - 2} more atoms`)
        }
      })
    })

    // Step 4: Show enhanced data structure
    console.log('\n4. 📈 ENHANCED DATA STRUCTURE')
    console.log('   ✅ Animation States:', partitionListData.animationStates.length)
    console.log('   ✅ Interactive Data:', JSON.stringify(partitionListData.animation.interactiveData, null, 2))
    console.log('   ✅ Key Operations:', partitionListData.animation.interactiveData.keyOperations.join(', '))
    console.log('   ✅ Visualization Hints:', partitionListData.animation.interactiveData.visualizationHints)

    // Step 5: Demonstrate atom generation details
    console.log('\n5. ⚛️ ANIMATION ATOMS BREAKDOWN')
    const firstFrame = frames[0]
    console.log(`   First frame atoms (${firstFrame.atoms.length}):`)
    firstFrame.atoms.forEach((atom, index) => {
      console.log(`      ${index + 1}. Type: ${atom.type}, Action: ${atom.action}, Target: ${atom.target}`)
    })

    // Step 6: Show highlights generation
    console.log('\n6. ✨ HIGHLIGHTS GENERATION')
    console.log('   Generated highlights for linked list algorithm:')
    frames.forEach((frame, frameIndex) => {
      if (frame.highlights.length > 0) {
        console.log(`   Frame ${frameIndex + 1} (${frame.title}):`)
        frame.highlights.forEach((highlight, hIndex) => {
          console.log(`      • ${highlight.type} → ${highlight.target} (${highlight.style})`)
        })
      }
    })

    // Step 7: Show transitions generation
    console.log('\n7. 🔄 TRANSITIONS GENERATION')
    frames.forEach((frame, frameIndex) => {
      if (frame.transitions.length > 0) {
        console.log(`   Frame ${frameIndex + 1} (${frame.title}):`)
        frame.transitions.forEach((transition, tIndex) => {
          console.log(`      • ${transition.element}: ${JSON.stringify(transition.from)} → ${JSON.stringify(transition.to)}`)
        })
      }
    })

    // Step 8: Performance metrics
    console.log('\n8. 📊 PERFORMANCE METRICS')
    const totalFrames = frames.length
    const totalAtoms = frames.reduce((sum, frame) => sum + frame.atoms.length, 0)
    const totalHighlights = frames.reduce((sum, frame) => sum + frame.highlights.length, 0)
    const totalTransitions = frames.reduce((sum, frame) => sum + frame.transitions.length, 0)

    console.log(`   ✅ Total frames: ${totalFrames}`)
    console.log(`   ✅ Total atoms: ${totalAtoms}`)
    console.log(`   ✅ Total highlights: ${totalHighlights}`)
    console.log(`   ✅ Total transitions: ${totalTransitions}`)
    console.log(`   ✅ Average atoms per frame: ${(totalAtoms / totalFrames).toFixed(1)}`)

    // Step 9: Save comprehensive results
    console.log('\n9. 💾 SAVING COMPREHENSIVE RESULTS')
    const results = {
      timestamp: new Date().toISOString(),
      algorithm: partitionListData.title,
      algorithmType,
      libraries: libraries,
      frames: frames,
      animations: allAnimations,
      metrics: {
        totalFrames,
        totalAtoms,
        totalHighlights,
        totalTransitions
      },
      originalData: partitionListData
    }

    fs.writeFileSync('animation-generator-demo-results.json', JSON.stringify(results, null, 2))
    console.log('   ✅ Results saved to: animation-generator-demo-results.json')

    // Step 10: Show usage recommendations
    console.log('\n10. 🎯 USAGE RECOMMENDATIONS')
    console.log('   📝 To improve AI prompt for better animations:')
    console.log('   • Request specific animation data structures for each algorithm type')
    console.log('   • Include concrete values instead of generic placeholders')
    console.log('   • Specify key operations and their visual representations')
    console.log('   • Add timing and transition information')
    console.log('   • Include algorithm-specific visualization hints')

    console.log('\n   🛠️  Animation libraries to use:')
    console.log('   • @animation-libraries/d3-atoms.ts for SVG-based animations')
    console.log('   • @animation-libraries/reactflow-atoms.ts for node/edge visualizations')
    console.log('   • @animation-libraries/three-atoms.ts for 3D animations')
    console.log('   • @animation-alphabet.ts for atomic building blocks')
    console.log('   • @animation-composers.ts for complex animation sequences')

    console.log('\n' + '='.repeat(60))
    console.log('🎉 ANIMATION GENERATOR DEMO COMPLETED!')
    console.log('   ✅ Algorithm type detection')
    console.log('   ✅ Dynamic frame generation')
    console.log('   ✅ Library-specific atom creation')
    console.log('   ✅ Highlights and transitions')
    console.log('   ✅ Performance metrics')
    console.log('   ✅ Complete animation pipeline')
    console.log('🎉'.repeat(30))

  } catch (error) {
    console.error('❌ Demo failed:', error.message)
    console.error(error.stack)
  }
}

// ============================================================================
// 📚 USAGE EXAMPLES
// ============================================================================

function showUsageExamples() {
  console.log('\n📚 PRACTICAL USAGE EXAMPLES')
  console.log('='.repeat(40))

  console.log('\n1. 🎭 BASIC INTEGRATION:')
  console.log(`
   // In your animation components, use the generated data:
   const frames = MockAnimationGenerator.generateFrames(algorithmData, algorithmType)
   const d3Animations = MockAnimationGenerator.generateLibrarySpecificAnimations(frames, 'd3')

   // Each frame contains:
   // - step: Frame number
   // - title: Human-readable title
   // - atoms: Library-specific animation atoms
   // - highlights: Elements to highlight
   // - transitions: Movement animations
  `)

  console.log('\n2. 🔧 ENHANCED AI PROMPT:')
  console.log(`
   When generating algorithm data, request:

   "Generate animationStates with concrete data:
    - step: number
    - title: string
    - description: string
    - data: {
        // Algorithm-specific concrete values
        currentIndex: number,
        array: number[],
        pointers: {left: number, right: number},
        // Linked list specific
        lessList: [{value: number}, ...],
        greaterList: [{value: number}, ...],
        currentNode: {value: number, next: ...}
      }
    - Include timing information and transition hints"
  `)

  console.log('\n3. 🎨 LIBRARY INTEGRATION:')
  console.log(`
   // D3.js Integration:
   frames.forEach(frame => {
     frame.atoms.forEach(atom => {
       if (atom.library === 'd3') {
         executeD3Atom(atom) // Use d3-atoms.ts functions
       }
     })
   })

   // ReactFlow Integration:
   // Similar pattern with reactflow-atoms.ts

   // Three.js Integration:
   // Similar pattern with three-atoms.ts
  `)

  console.log('\n4. ⚡ PERFORMANCE OPTIMIZATION:')
  console.log(`
   // Use the animation optimizer from @animation-optimizer.ts
   const optimizedFrames = AnimationOptimizer.optimizeElements(frames, cameraPosition)

   // Batch related animations together
   const batchedAtoms = AnimationCompressor.compressAnimations(atoms)

   // Monitor performance with @performance-monitor.ts
   PerformanceMonitor.update()
   console.log('FPS:', PerformanceMonitor.getFPS())
  `)
}

// ============================================================================
// 🚀 MAIN EXECUTION
// ============================================================================

async function main() {
  console.log('🚀 ALGORITHM ANIMATION GENERATOR DEMO')
  console.log('This demonstrates how the animation generator works with')
  console.log('dynamic algorithm objects like the partition-list example.')
  console.log('')

  await testAnimationGenerator()
  showUsageExamples()

  console.log('\n🎯 KEY TAKEAWAYS:')
  console.log('✅ Use @animation-libraries/ for library-specific implementations')
  console.log('✅ Generate concrete animation data, not generic placeholders')
  console.log('✅ Structure animationStates with step-by-step data')
  console.log('✅ Include algorithm-specific visualization hints')
  console.log('✅ Use @animation-alphabet.ts for atomic building blocks')
  console.log('✅ Leverage @animation-composers.ts for complex sequences')
  console.log('✅ Monitor performance with built-in optimization tools')
}

// Run the demo
main().catch(console.error)
