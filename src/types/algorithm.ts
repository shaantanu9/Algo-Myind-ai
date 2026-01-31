export interface AlgorithmData {
  id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  timeComplexity: string;
  spaceComplexity: string;
  popularity: number;
  estimatedTime: string;
  realWorldUse: string;
  problemStatement: string;
  examples: Array<{
    input: string;
    output: string;
    explanation: string;
  }>;
  analogy?: {
    title: string;
    content: string;
  };
  keyInsights: string[];
  realWorldApplications: Array<{
    domain: string;
    application: string;
    description: string;
  }>;
  engineeringLessons: Array<{
    principle: string;
    lesson: string;
    application: string;
  }>;
  implementations: {
    bruteForce?: {
      title: string;
      timeComplexity: string;
      spaceComplexity: string;
      code: string;
      explanation: string;
      whenToUse: string;
    };
    optimized?: {
      title: string;
      timeComplexity: string;
      spaceComplexity: string;
      code: string;
      explanation: string;
      whenToUse: string;
    };
    alternative?: {
      title: string;
      timeComplexity: string;
      spaceComplexity: string;
      code: string;
      explanation: string;
      whenToUse: string;
    };
  };
  animationStates: Array<{
    step: number;
    title: string;
    description: string;
    data: any;
  }>;
  metadata: {
    tags: string[];
    acceptanceRate: string;
    frequency: number;
    similarProblems: string[];
    difficultyBreakdown: {
      understanding: string;
      implementation: string;
      optimization: string;
    };
  };
  educationalContent: {
    analogy?: {
      title: string;
      content: string;
    };
    keyInsights: string[];
    commonMistakes: string[];
    optimizationTips: string[];
    interviewTips: string[];
  };
  codeQuality: {
    readability: number;
    efficiency: number;
    maintainability: number;
    documentation: number;
    testability: number;
    bestPractices: string[];
  };
  testingScenarios: Array<{
    scenario: string;
    input: string;
    expectedOutput: string;
    edgeCase: boolean;
  }>;
  performanceAnalysis: {
    bestCase: string;
    averageCase: string;
    worstCase: string;
    spaceComplexity: string;
    bottlenecks: string[];
    scalability: string;
  };
  relatedAlgorithms: Array<{
    name: string;
    similarity: string;
    whenToUse: string;
  }>;
}

export interface AlgorithmLoadResult {
  algorithms: AlgorithmData[];
  hasMore: boolean;
  totalCount: number;
  loadedCount: number;
}

export interface AlgorithmLoaderConfig {
  cacheTimeout?: number;
  batchSize?: number;
  enableCache?: boolean;
}