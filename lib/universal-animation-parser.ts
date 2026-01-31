/**
 * 🎬 Universal Animation Parser
 * 
 * Parses AI-generated animation steps and converts them into data structures
 * that D3, Mermaid, React Flow, and Three.js can render
 * 
 * KEY PRINCIPLE: Any algorithm, any data structure, any visualization
 */

// ==================== UNIVERSAL ANIMATION DATA STRUCTURE ====================

export interface UniversalAnimationStep {
  step: number
  title: string
  description: string
  code?: string // Optional: the code line being executed
  
  // Core visualization data
  visualData: {
    // Data structures (arrays, objects, trees, graphs, etc.)
    structures: DataStructure[]
    
    // Variables and their current values
    variables: Record<string, Variable>
    
    // Pointers/indices being tracked
    pointers?: Pointer[]
    
    // Connections/edges between elements
    connections?: Connection[]
    
    // Highlights (what to emphasize)
    highlights?: Highlight[]
    
    // Operation metadata
    operation?: Operation
  }
  
  // Library-specific hints (optional)
  hints?: {
    d3?: D3Hints
    mermaid?: MermaidHints
    reactFlow?: ReactFlowHints
    three?: ThreeHints
  }
}

export interface DataStructure {
  id: string
  type: 'array' | 'linkedList' | 'tree' | 'graph' | 'string' | 'hashMap' | 'stack' | 'queue' | 'heap' | 'matrix'
  elements: Element[]
  metadata?: {
    name?: string
    description?: string
    capacity?: number
    size?: number
  }
}

export interface Element {
  id: string
  value: any
  index?: number
  position?: { x?: number; y?: number; z?: number }
  state: 'default' | 'active' | 'checking' | 'result' | 'error' | 'stored' | 'visited' | 'current'
  color?: string
  label?: string
  metadata?: Record<string, any>
}

export interface Variable {
  name: string
  value: any
  type: 'number' | 'string' | 'boolean' | 'object' | 'array' | 'null' | 'undefined'
  highlighted?: boolean
  changed?: boolean
  previous?: any
}

export interface Pointer {
  id: string
  name: string
  pointsTo: string | number // Element ID or index
  color?: string
  type?: 'index' | 'reference' | 'cursor'
}

export interface Connection {
  id: string
  from: string
  to: string
  type?: 'directed' | 'undirected' | 'bidirectional'
  label?: string
  weight?: number
  state?: 'default' | 'active' | 'traversed' | 'result'
  color?: string
}

export interface Highlight {
  targetId: string
  type: 'glow' | 'pulse' | 'border' | 'background'
  color?: string
  intensity?: number
}

export interface Operation {
  type: string // 'comparison', 'swap', 'insert', 'delete', 'traverse', 'lookup', etc.
  complexity: string // 'O(1)', 'O(n)', 'O(log n)', etc.
  description: string
  pseudocode?: string
  result?: string
}

// Library-specific hints
export interface D3Hints {
  layout?: 'horizontal' | 'vertical' | 'circular' | 'force' | 'tree'
  spacing?: number
  animationDuration?: number
  customRender?: string
}

export interface MermaidHints {
  diagramType?: 'flowchart' | 'graph' | 'sequenceDiagram' | 'classDiagram' | 'stateDiagram'
  direction?: 'TB' | 'LR' | 'RL' | 'BT'
  theme?: 'default' | 'dark' | 'forest' | 'neutral'
}

export interface ReactFlowHints {
  layout?: 'dagre' | 'elk' | 'custom'
  nodeType?: 'default' | 'input' | 'output' | 'custom'
  edgeType?: 'default' | 'smoothstep' | 'step' | 'straight'
}

export interface ThreeHints {
  cameraPosition?: { x: number; y: number; z: number }
  cameraLookAt?: { x: number; y: number; z: number }
  layout?: '3d-array' | '3d-tree' | '3d-graph' | 'spatial'
}

// ==================== COLOR SYSTEM ====================

export const UniversalColors = {
  states: {
    default: '#6b7280',     // Gray - not yet processed
    active: '#3b82f6',      // Blue - currently processing
    checking: '#f59e0b',    // Orange - being evaluated
    result: '#22c55e',      // Green - solution/success
    error: '#ef4444',       // Red - error/failure
    stored: '#8b5cf6',      // Purple - saved in data structure
    visited: '#06b6d4',     // Cyan - already processed
    current: '#ec4899',     // Pink - current pointer/focus
  },
  pointers: {
    left: '#3b82f6',        // Blue
    right: '#22c55e',       // Green
    current: '#f59e0b',     // Orange
    target: '#ef4444',      // Red
    slow: '#8b5cf6',        // Purple
    fast: '#06b6d4',        // Cyan
  },
  connections: {
    default: '#9ca3af',     // Gray
    active: '#3b82f6',      // Blue
    traversed: '#22c55e',   // Green
    result: '#f59e0b',      // Orange
  }
}

// ==================== UNIVERSAL PARSER ====================

export class UniversalAnimationParser {
  /**
   * Parse animation step from AI-generated JSON
   */
  static parseStep(rawData: any): UniversalAnimationStep {
    return {
      step: rawData.step || 0,
      title: rawData.title || '',
      description: rawData.description || '',
      code: rawData.code,
      visualData: this.parseVisualData(rawData.data || rawData.visualData || {}),
      hints: rawData.hints
    }
  }

  private static parseVisualData(data: any): UniversalAnimationStep['visualData'] {
    return {
      structures: this.parseStructures(data),
      variables: this.parseVariables(data.variables || {}),
      pointers: this.parsePointers(data.pointers || data.indices || []),
      connections: this.parseConnections(data.connections || data.edges || []),
      highlights: this.parseHighlights(data.highlights || []),
      operation: this.parseOperation(data.operation)
    }
  }

  private static parseStructures(data: any): DataStructure[] {
    const structures: DataStructure[] = []

    // Parse array
    if (data.array) {
      structures.push({
        id: 'main-array',
        type: 'array',
        elements: this.parseArrayElements(data.array),
        metadata: { name: 'Array', size: data.array.length }
      })
    }

    // Parse string
    if (data.string !== undefined) {
      structures.push({
        id: 'main-string',
        type: 'string',
        elements: this.parseStringElements(data.string),
        metadata: { name: 'String', size: data.string.length }
      })
    }

    // Parse linked list
    if (data.linkedList || data.head || data.list) {
      const listData = data.linkedList || data.head || data.list
      structures.push({
        id: 'main-list',
        type: 'linkedList',
        elements: this.parseLinkedListElements(listData),
        metadata: { name: 'Linked List' }
      })
    }

    // Parse tree
    if (data.tree || data.root) {
      const treeData = data.tree || data.root
      structures.push({
        id: 'main-tree',
        type: 'tree',
        elements: this.parseTreeElements(treeData),
        metadata: { name: 'Tree' }
      })
    }

    // Parse graph
    if (data.graph || data.nodes) {
      structures.push({
        id: 'main-graph',
        type: 'graph',
        elements: this.parseGraphElements(data.graph || data),
        metadata: { name: 'Graph' }
      })
    }

    // Parse hash map
    if (data.hashMap || data.map || data.dict) {
      const mapData = data.hashMap || data.map || data.dict
      structures.push({
        id: 'main-hashmap',
        type: 'hashMap',
        elements: this.parseHashMapElements(mapData),
        metadata: { name: 'Hash Map', size: Object.keys(mapData).length }
      })
    }

    // Parse stack
    if (data.stack) {
      structures.push({
        id: 'main-stack',
        type: 'stack',
        elements: this.parseStackElements(data.stack),
        metadata: { name: 'Stack', size: data.stack.length }
      })
    }

    // Parse queue
    if (data.queue) {
      structures.push({
        id: 'main-queue',
        type: 'queue',
        elements: this.parseQueueElements(data.queue),
        metadata: { name: 'Queue', size: data.queue.length }
      })
    }

    // Parse matrix
    if (data.matrix) {
      structures.push({
        id: 'main-matrix',
        type: 'matrix',
        elements: this.parseMatrixElements(data.matrix),
        metadata: {
          name: 'Matrix',
          size: data.matrix.length * (data.matrix[0]?.length || 0)
        }
      })
    }

    return structures
  }

  private static parseArrayElements(array: any[]): Element[] {
    return array.map((item, index) => {
      if (typeof item === 'object' && item !== null) {
        return {
          id: `array-${index}`,
          value: item.value ?? item.val ?? item,
          index,
          state: this.normalizeState(item.state),
          color: item.color || this.getColorForState(item.state),
          label: item.label,
          metadata: item
        }
      }
      return {
        id: `array-${index}`,
        value: item,
        index,
        state: 'default',
        color: UniversalColors.states.default
      }
    })
  }

  private static parseStringElements(str: string | any[]): Element[] {
    const chars = typeof str === 'string' ? str.split('') : str
    return chars.map((item, index) => {
      if (typeof item === 'object' && item !== null) {
        return {
          id: `char-${index}`,
          value: item.char ?? item.value ?? item,
          index,
          state: this.normalizeState(item.state),
          color: item.color || this.getColorForState(item.state),
          metadata: item
        }
      }
      return {
        id: `char-${index}`,
        value: item,
        index,
        state: 'default',
        color: UniversalColors.states.default
      }
    })
  }

  private static parseLinkedListElements(listData: any): Element[] {
    const elements: Element[] = []
    let current = listData
    let index = 0

    while (current && index < 100) { // Safety limit
      if (typeof current === 'object') {
        elements.push({
          id: `node-${index}`,
          value: current.value ?? current.val ?? current.data ?? current,
          index,
          state: this.normalizeState(current.state),
          color: current.color || this.getColorForState(current.state),
          metadata: { next: current.next !== undefined }
        })
        current = current.next
      } else {
        elements.push({
          id: `node-${index}`,
          value: current,
          index,
          state: 'default',
          color: UniversalColors.states.default
        })
        break
      }
      index++
    }

    return elements
  }

  private static parseTreeElements(treeData: any): Element[] {
    const elements: Element[] = []
    
    const traverse = (node: any, depth = 0, path = '0') => {
      if (!node) return

      elements.push({
        id: `tree-${path}`,
        value: node.value ?? node.val ?? node.data ?? node,
        position: { x: 0, y: depth * 80 }, // Y based on depth
        state: this.normalizeState(node.state),
        color: node.color || this.getColorForState(node.state),
        metadata: {
          depth,
          path,
          hasLeft: !!node.left,
          hasRight: !!node.right
        }
      })

      if (node.left) traverse(node.left, depth + 1, path + 'L')
      if (node.right) traverse(node.right, depth + 1, path + 'R')
    }

    traverse(treeData)
    return elements
  }

  private static parseGraphElements(graphData: any): Element[] {
    if (Array.isArray(graphData.nodes)) {
      return graphData.nodes.map((node: any, index: number) => ({
        id: node.id || `node-${index}`,
        value: node.value ?? node.label ?? node.id,
        position: node.position || { x: 0, y: 0 },
        state: this.normalizeState(node.state),
        color: node.color || this.getColorForState(node.state),
        metadata: node
      }))
    }
    return []
  }

  private static parseHashMapElements(mapData: Record<string, any>): Element[] {
    return Object.entries(mapData).map(([key, value], index) => ({
      id: `map-${key}`,
      value: typeof value === 'object' ? value.value : value,
      index,
      state: typeof value === 'object' ? this.normalizeState(value.state) : 'stored',
      color: typeof value === 'object' ? (value.color || this.getColorForState(value.state)) : UniversalColors.states.stored,
      label: key,
      metadata: { key, value }
    }))
  }

  private static parseStackElements(stack: any[]): Element[] {
    return stack.map((item, index) => ({
      id: `stack-${index}`,
      value: typeof item === 'object' ? item.value : item,
      index,
      position: { y: (stack.length - index - 1) * 60 }, // Stack grows upward
      state: typeof item === 'object' ? this.normalizeState(item.state) : 'stored',
      color: typeof item === 'object' ? (item.color || this.getColorForState(item.state)) : UniversalColors.states.stored,
      metadata: { stackPosition: stack.length - index - 1 }
    }))
  }

  private static parseQueueElements(queue: any[]): Element[] {
    return queue.map((item, index) => ({
      id: `queue-${index}`,
      value: typeof item === 'object' ? item.value : item,
      index,
      position: { x: index * 80 }, // Queue grows horizontally
      state: typeof item === 'object' ? this.normalizeState(item.state) : 'stored',
      color: typeof item === 'object' ? (item.color || this.getColorForState(item.state)) : UniversalColors.states.stored,
      metadata: { queuePosition: index }
    }))
  }

  private static parseMatrixElements(matrix: any[][]): Element[] {
    const elements: Element[] = []
    matrix.forEach((row, rowIndex) => {
      row.forEach((item, colIndex) => {
        elements.push({
          id: `matrix-${rowIndex}-${colIndex}`,
          value: typeof item === 'object' ? item.value : item,
          position: { x: colIndex * 60, y: rowIndex * 60 },
          state: typeof item === 'object' ? this.normalizeState(item.state) : 'default',
          color: typeof item === 'object' ? (item.color || this.getColorForState(item.state)) : UniversalColors.states.default,
          metadata: { row: rowIndex, col: colIndex }
        })
      })
    })
    return elements
  }

  private static parseVariables(variables: Record<string, any>): Record<string, Variable> {
    const parsed: Record<string, Variable> = {}
    
    for (const [name, data] of Object.entries(variables)) {
      if (typeof data === 'object' && data !== null && 'value' in data) {
        parsed[name] = {
          name,
          value: data.value,
          type: data.type || typeof data.value,
          highlighted: data.highlighted || data.changed,
          changed: data.changed,
          previous: data.previous
        }
      } else {
        parsed[name] = {
          name,
          value: data,
          type: typeof data,
          highlighted: false,
          changed: false
        }
      }
    }
    
    return parsed
  }

  private static parsePointers(pointers: any[]): Pointer[] {
    return pointers.map((pointer, index) => ({
      id: pointer.id || `pointer-${index}`,
      name: pointer.name || pointer.label || `ptr${index}`,
      pointsTo: pointer.pointsTo || pointer.target || pointer.index,
      color: pointer.color || UniversalColors.pointers.current,
      type: pointer.type || 'index'
    }))
  }

  private static parseConnections(connections: any[]): Connection[] {
    return connections.map((conn, index) => ({
      id: conn.id || `conn-${index}`,
      from: conn.from || conn.source,
      to: conn.to || conn.target,
      type: conn.type || 'directed',
      label: conn.label,
      weight: conn.weight,
      state: this.normalizeState(conn.state),
      color: conn.color || this.getColorForState(conn.state, 'connection')
    }))
  }

  private static parseHighlights(highlights: any[]): Highlight[] {
    return highlights.map((h, index) => ({
      targetId: h.targetId || h.target || h.id,
      type: h.type || 'glow',
      color: h.color || UniversalColors.states.active,
      intensity: h.intensity || 0.8
    }))
  }

  private static parseOperation(operation: any): Operation | undefined {
    if (!operation) return undefined
    
    return {
      type: operation.type || 'operation',
      complexity: operation.complexity || 'O(1)',
      description: operation.description || '',
      pseudocode: operation.pseudocode,
      result: operation.result
    }
  }

  private static normalizeState(state: string | undefined): Element['state'] {
    if (!state) return 'default'
    
    const normalized = state.toLowerCase()
    const validStates: Element['state'][] = ['default', 'active', 'checking', 'result', 'error', 'stored', 'visited', 'current']
    
    for (const validState of validStates) {
      if (normalized.includes(validState)) return validState
    }
    
    return 'default'
  }

  private static getColorForState(state: string | undefined, type: 'element' | 'connection' = 'element'): string {
    const normalized = this.normalizeState(state)
    
    if (type === 'connection') {
      return UniversalColors.connections[normalized as keyof typeof UniversalColors.connections] || UniversalColors.connections.default
    }
    
    return UniversalColors.states[normalized]
  }
}

// ==================== CONVENIENCE EXPORTS ====================

/**
 * Parse animation steps from markdown JSON blocks
 */
export function parseAnimationSteps(stepsData: any[]): UniversalAnimationStep[] {
  return stepsData.map(step => UniversalAnimationParser.parseStep(step))
}

/**
 * Auto-detect data structure types from raw data
 */
export function detectDataStructures(data: any): string[] {
  const types: string[] = []
  
  if (data.array) types.push('array')
  if (data.string !== undefined) types.push('string')
  if (data.linkedList || data.head || data.list) types.push('linkedList')
  if (data.tree || data.root) types.push('tree')
  if (data.graph || data.nodes) types.push('graph')
  if (data.hashMap || data.map || data.dict) types.push('hashMap')
  if (data.stack) types.push('stack')
  if (data.queue) types.push('queue')
  if (data.matrix) types.push('matrix')
  
  return types
}

