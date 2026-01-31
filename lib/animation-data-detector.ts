/**
 * 🔍 Animation Data Detector
 * 
 * Auto-detects data structure types from animation step data
 * Used to route to the correct visualization renderer
 */

export interface DataStructureType {
  type: 'array' | 'string' | 'linkedList' | 'tree' | 'graph' | 'hashMap' | 'stack' | 'queue' | 'matrix' | 'number' | 'unknown'
  confidence: number
  metadata?: any
}

export function detectDataStructureType(stepData: any): DataStructureType {
  if (!stepData || typeof stepData !== 'object') {
    return { type: 'unknown', confidence: 0 }
  }

  // Check for array
  if (stepData.array && Array.isArray(stepData.array)) {
    return { type: 'array', confidence: 1.0, metadata: { length: stepData.array.length } }
  }

  // Check for string manipulation
  if (stepData.string || stepData.original || stepData.text) {
    return { type: 'string', confidence: 0.9 }
  }

  // Check for linked list
  if (stepData.linkedList || stepData.head || stepData.nodes || stepData.current) {
    return { type: 'linkedList', confidence: 0.85 }
  }

  // Check for tree
  if (stepData.tree || stepData.root || (stepData.nodes && stepData.edges)) {
    return { type: 'tree', confidence: 0.8 }
  }

  // Check for graph
  if (stepData.graph || (stepData.nodes && stepData.edges)) {
    return { type: 'graph', confidence: 0.75 }
  }

  // Check for hash map
  if (stepData.hashMap || stepData.map) {
    return { type: 'hashMap', confidence: 0.9 }
  }

  // Check for stack
  if (stepData.stack) {
    return { type: 'stack', confidence: 0.9 }
  }

  // Check for queue
  if (stepData.queue) {
    return { type: 'queue', confidence: 0.9 }
  }

  // Check for matrix
  if (stepData.matrix || (Array.isArray(stepData.data) && Array.isArray(stepData.data[0]))) {
    return { type: 'matrix', confidence: 0.85 }
  }

  // Check for number manipulation
  if (typeof stepData.value === 'number' || stepData.digit !== undefined || stepData.result !== undefined) {
    return { type: 'number', confidence: 0.7 }
  }

  // Check for variables (general)
  if (stepData.variables) {
    // Analyze variables to determine structure
    const vars = stepData.variables
    if (vars.array || vars.nums) return { type: 'array', confidence: 0.8 }
    if (vars.str || vars.s) return { type: 'string', confidence: 0.8 }
  }

  return { type: 'unknown', confidence: 0 }
}

/**
 * Get the best matching algorithm ID based on data structure
 */
export function suggestAlgorithmType(stepData: any): string {
  const detected = detectDataStructureType(stepData)

  switch (detected.type) {
    case 'array':
      return 'array-algorithm'
    case 'string':
      return 'string-algorithm'
    case 'linkedList':
      return 'linked-list-algorithm'
    case 'tree':
      return 'tree-algorithm'
    case 'graph':
      return 'graph-algorithm'
    case 'hashMap':
      return 'hash-map-algorithm'
    case 'stack':
      return 'stack-algorithm'
    case 'queue':
      return 'queue-algorithm'
    case 'matrix':
      return 'matrix-algorithm'
    case 'number':
      return 'math-algorithm'
    default:
      return 'default-algorithm'
  }
}

/**
 * Universal data normalizer - converts any format to standard format
 */
export function normalizeAnimationData(stepData: any): any {
  const detected = detectDataStructureType(stepData)

  if (detected.type === 'array' && stepData.array) {
    return {
      type: 'array',
      elements: stepData.array.map((item: any, index: number) => ({
        value: typeof item === 'object' ? item.value : item,
        index: typeof item === 'object' ? item.index : index,
        state: typeof item === 'object' ? item.state : 'default',
        color: typeof item === 'object' ? item.color : '#6b7280',
        ...item
      })),
      pointers: stepData.pointers || [],
      variables: stepData.variables || {}
    }
  }

  if (detected.type === 'string') {
    const str = stepData.string || stepData.original || stepData.text || ''
    return {
      type: 'string',
      chars: Array.from(str).map((char: any, index: number) => ({
        char: typeof char === 'object' ? char.char || char.value : char,
        index,
        state: typeof char === 'object' ? char.state : 'default',
        color: typeof char === 'object' ? char.color : '#6b7280'
      })),
      variables: stepData.variables || {}
    }
  }

  // Return as-is for other types (can be extended)
  return { type: detected.type, ...stepData }
}

