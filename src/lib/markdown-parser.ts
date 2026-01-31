import fs from 'fs';
import path from 'path';
import { AlgorithmData } from '@/types/algorithm';

export interface LeetCodeProblem {
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

export class MarkdownParser {
  private algorithmsDir: string;

  constructor(algorithmsDir: string) {
    this.algorithmsDir = algorithmsDir;
  }

  async parseAllAlgorithms(): Promise<AlgorithmData[]> {
    const algorithmFiles = fs.readdirSync(this.algorithmsDir)
      .filter(file => file.endsWith('.md'))
      .map(file => path.join(this.algorithmsDir, file));

    const algorithms: AlgorithmData[] = [];

    for (const filePath of algorithmFiles) {
      try {
        const algorithm = await this.parseAlgorithmFile(filePath);
        if (algorithm) {
          algorithms.push(algorithm);
        }
      } catch (error) {
        console.warn(`Failed to parse algorithm file ${filePath}:`, error);
      }
    }

    return algorithms.sort((a, b) => b.popularity - a.popularity); // Sort by popularity
  }

  async parseAlgorithmFile(filePath: string): Promise<AlgorithmData | null> {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      return this.parseMarkdownContent(content);
    } catch (error) {
      console.error(`Error reading file ${filePath}:`, error);
      return null;
    }
  }

  private parseMarkdownContent(content: string): AlgorithmData {
    const lines = content.split('\n');
    const sections = this.splitIntoSections(content);

    // Parse basic information
    const basicInfo = this.parseBasicInformation(sections['Basic Information'] || '');

    return {
      id: basicInfo.id,
      title: basicInfo.title,
      description: basicInfo.description,
      difficulty: basicInfo.difficulty as 'Easy' | 'Medium' | 'Hard',
      category: basicInfo.category,
      timeComplexity: basicInfo.timeComplexity,
      spaceComplexity: basicInfo.spaceComplexity,
      popularity: basicInfo.popularity,
      estimatedTime: basicInfo.estimatedTime,
      realWorldUse: basicInfo.realWorldUse,
      problemStatement: this.parseProblemStatement(sections['Problem Statement'] || ''),
      examples: this.parseExamples(sections['Examples'] || ''),
      analogy: this.parseAnalogy(sections['Analogy'] || ''),
      keyInsights: this.parseKeyInsights(sections['Key Insights'] || ''),
      realWorldApplications: this.parseRealWorldApplications(sections['Real World Applications'] || ''),
      engineeringLessons: this.parseEngineeringLessons(sections['Engineering Lessons'] || ''),
      implementations: this.parseImplementations(sections['Implementations'] || ''),
      animationStates: this.parseAnimationStates(sections),
      metadata: this.parseMetadata(sections['Metadata'] || ''),
      educationalContent: this.parseEducationalContent(sections),
      codeQuality: this.parseCodeQuality(sections['Code Quality Metrics'] || ''),
      testingScenarios: this.parseTestingScenarios(sections['Testing Scenarios'] || ''),
      performanceAnalysis: this.parsePerformanceAnalysis(sections['Performance Analysis'] || ''),
      relatedAlgorithms: this.parseRelatedAlgorithms(sections['Related Algorithms'] || '')
    };
  }

  private splitIntoSections(content: string): Record<string, string> {
    const sections: Record<string, string> = {};
    const lines = content.split('\n');
    let currentSection = '';
    let currentContent: string[] = [];

    for (const line of lines) {
      if (line.startsWith('# ')) {
        if (currentSection) {
          sections[currentSection] = currentContent.join('\n').trim();
        }
        currentSection = line.substring(2).trim();
        currentContent = [];
      } else if (line.startsWith('## ')) {
        if (currentSection) {
          sections[currentSection] = currentContent.join('\n').trim();
        }
        currentSection = line.substring(3).trim();
        currentContent = [];
      } else {
        currentContent.push(line);
      }
    }

    if (currentSection) {
      sections[currentSection] = currentContent.join('\n').trim();
    }

    return sections;
  }

  private parseBasicInformation(content: string): any {
    const info: any = {};

    // Extract key-value pairs from the basic information section
    const lines = content.split('\n');
    for (const line of lines) {
      if (line.includes('**ID**: ')) {
        info.id = line.split('**ID**: ')[1].trim();
      } else if (line.includes('**Title**: ')) {
        info.title = line.split('**Title**: ')[1].trim();
      } else if (line.includes('**Description**: ')) {
        info.description = line.split('**Description**: ')[1].trim();
      } else if (line.includes('**Difficulty**: ')) {
        info.difficulty = line.split('**Difficulty**: ')[1].trim();
      } else if (line.includes('**Category**: ')) {
        info.category = line.split('**Category**: ')[1].trim();
      } else if (line.includes('**Time Complexity**: ')) {
        info.timeComplexity = line.split('**Time Complexity**: ')[1].trim();
      } else if (line.includes('**Space Complexity**: ')) {
        info.spaceComplexity = line.split('**Space Complexity**: ')[1].trim();
      } else if (line.includes('**Popularity**: ')) {
        info.popularity = parseInt(line.split('**Popularity**: ')[1].trim());
      } else if (line.includes('**Estimated Time**: ')) {
        info.estimatedTime = line.split('**Estimated Time**: ')[1].trim();
      } else if (line.includes('**Real World Use**: ')) {
        info.realWorldUse = line.split('**Real World Use**: ')[1].trim();
      }
    }

    return info;
  }

  private parseProblemStatement(content: string): string {
    return content.trim();
  }

  private parseExamples(content: string): Array<{input: string; output: string; explanation: string}> {
    const examples: Array<{input: string; output: string; explanation: string}> = [];
    const exampleBlocks = content.split('### Example').slice(1);

    for (const block of exampleBlocks) {
      const lines = block.split('\n');
      let input = '';
      let output = '';
      let explanation = '';

      for (const line of lines) {
        if (line.includes('Input: ')) {
          input = line.split('Input: ')[1].trim();
        } else if (line.includes('Output: ')) {
          output = line.split('Output: ')[1].trim();
        } else if (line.includes('Explanation: ')) {
          explanation = line.split('Explanation: ')[1].trim();
        }
      }

      if (input || output) {
        examples.push({ input, output, explanation });
      }
    }

    return examples;
  }

  private parseAnalogy(content: string): { title: string; content: string } | undefined {
    if (!content.trim()) return undefined;

    const lines = content.split('\n');
    let title = '';
    let contentText = '';

    for (const line of lines) {
      if (line.includes('### Title: ')) {
        title = line.split('### Title: ')[1].trim();
      } else if (line.includes('**Content**: ')) {
        contentText = line.split('**Content**: ')[1].trim();
      }
    }

    if (title && contentText) {
      return { title, content: contentText };
    }

    return undefined;
  }

  private parseKeyInsights(content: string): string[] {
    return content.split('\n')
      .filter(line => line.trim().startsWith('- '))
      .map(line => line.substring(2).trim());
  }

  private parseRealWorldApplications(content: string): Array<{domain: string; application: string; description: string}> {
    const applications: Array<{domain: string; application: string; description: string}> = [];
    const lines = content.split('\n');
    let currentApp: any = {};

    for (const line of lines) {
      if (line.includes('### ')) {
        if (currentApp.domain) {
          applications.push(currentApp);
        }
        currentApp = { domain: line.split('### ')[1].trim() };
      } else if (line.includes('**Application**: ')) {
        currentApp.application = line.split('**Application**: ')[1].trim();
      } else if (line.includes('**Description**: ')) {
        currentApp.description = line.split('**Description**: ')[1].trim();
      }
    }

    if (currentApp.domain) {
      applications.push(currentApp);
    }

    return applications;
  }

  private parseEngineeringLessons(content: string): Array<{principle: string; lesson: string; application: string}> {
    const lessons: Array<{principle: string; lesson: string; application: string}> = [];
    const lines = content.split('\n');
    let currentLesson: any = {};

    for (const line of lines) {
      if (line.includes('### ')) {
        if (currentLesson.principle) {
          lessons.push(currentLesson);
        }
        currentLesson = { principle: line.split('### ')[1].trim() };
      } else if (line.includes('**Lesson**: ')) {
        currentLesson.lesson = line.split('**Lesson**: ')[1].trim();
      } else if (line.includes('**Application**: ')) {
        currentLesson.application = line.split('**Application**: ')[1].trim();
      }
    }

    if (currentLesson.principle) {
      lessons.push(currentLesson);
    }

    return lessons;
  }

  private parseImplementations(content: string): AlgorithmData['implementations'] {
    const implementations: AlgorithmData['implementations'] = {};

    // Parse code blocks
    const codeBlockRegex = /```[\s\S]*?```/g;
    const codeBlocks = content.match(codeBlockRegex) || [];

    // Parse implementation types
    if (content.includes('### Brute Force Approach')) {
      const bruteForceCode = this.extractCodeBlock(content, 'Brute Force Approach');
      implementations.bruteForce = {
        title: 'Brute Force Approach',
        timeComplexity: this.extractComplexity(content, 'Brute Force Approach', 'Time'),
        spaceComplexity: this.extractComplexity(content, 'Brute Force Approach', 'Space'),
        code: bruteForceCode,
        explanation: this.extractExplanation(content, 'Brute Force Approach'),
        whenToUse: this.extractWhenToUse(content, 'Brute Force Approach')
      };
    }

    if (content.includes('### Optimized Solution')) {
      const optimizedCode = this.extractCodeBlock(content, 'Optimized Solution');
      implementations.optimized = {
        title: 'Optimized Solution',
        timeComplexity: this.extractComplexity(content, 'Optimized Solution', 'Time'),
        spaceComplexity: this.extractComplexity(content, 'Optimized Solution', 'Space'),
        code: optimizedCode,
        explanation: this.extractExplanation(content, 'Optimized Solution'),
        whenToUse: this.extractWhenToUse(content, 'Optimized Solution')
      };
    }

    return implementations;
  }

  private extractCodeBlock(content: string, section: string): string {
    const sectionRegex = new RegExp(`### ${section}[\\s\\S]*?(?=###|$)`, 'i');
    const sectionMatch = content.match(sectionRegex);
    if (!sectionMatch) return '';

    const codeBlockMatch = sectionMatch[0].match(/```\n([\s\S]*?)\n```/);
    return codeBlockMatch ? codeBlockMatch[1].trim() : '';
  }

  private extractComplexity(content: string, section: string, type: string): string {
    const sectionRegex = new RegExp(`### ${section}[\\s\\S]*?(?=###|$)`, 'i');
    const sectionMatch = content.match(sectionRegex);
    if (!sectionMatch) return 'O(n)';

    const complexityMatch = sectionMatch[0].match(new RegExp(`\\*\\*${type} Complexity\\*\\*: ([^\\n]+)`));
    return complexityMatch ? complexityMatch[1].trim() : 'O(n)';
  }

  private extractExplanation(content: string, section: string): string {
    const sectionRegex = new RegExp(`### ${section}[\\s\\S]*?(?=###|$)`, 'i');
    const sectionMatch = content.match(sectionRegex);
    if (!sectionMatch) return '';

    const explanationMatch = sectionMatch[0].match(/\*\*Explanation\*\*: ([^\n]+)/);
    return explanationMatch ? explanationMatch[1].trim() : '';
  }

  private extractWhenToUse(content: string, section: string): string {
    const sectionRegex = new RegExp(`### ${section}[\\s\\S]*?(?=###|$)`, 'i');
    const sectionMatch = content.match(sectionRegex);
    if (!sectionMatch) return '';

    const whenToUseMatch = sectionMatch[0].match(/\*\*When to Use\*\*: ([^\n]+)/);
    return whenToUseMatch ? whenToUseMatch[1].trim() : '';
  }

  private parseAnimationStates(sections: Record<string, string>): Array<{step: number; title: string; description: string; data: any}> {
    // This is a complex parsing task. For now, return empty array.
    // In a full implementation, you'd parse the detailed animation states from the markdown.
    return [];
  }

  private parseMetadata(content: string): AlgorithmData['metadata'] {
    const metadata: AlgorithmData['metadata'] = {
      tags: [],
      acceptanceRate: '45%',
      frequency: 50,
      similarProblems: [],
      difficultyBreakdown: {
        understanding: 'Medium',
        implementation: 'Easy',
        optimization: 'Medium'
      }
    };

    const lines = content.split('\n');

    for (const line of lines) {
      if (line.includes('### Tags')) {
        // Parse tags (next few lines)
        const tagLines = lines.slice(lines.indexOf(line) + 1);
        for (const tagLine of tagLines) {
          if (tagLine.trim().startsWith('- ')) {
            metadata.tags.push(tagLine.substring(2).trim());
          } else if (tagLine.startsWith('###')) {
            break;
          }
        }
      } else if (line.includes('### Acceptance Rate: ')) {
        metadata.acceptanceRate = line.split('### Acceptance Rate: ')[1].trim();
      } else if (line.includes('### Frequency: ')) {
        metadata.frequency = parseInt(line.split('### Frequency: ')[1].trim());
      } else if (line.includes('**Understanding**: ')) {
        metadata.difficultyBreakdown.understanding = line.split('**Understanding**: ')[1].trim();
      } else if (line.includes('**Implementation**: ')) {
        metadata.difficultyBreakdown.implementation = line.split('**Implementation**: ')[1].trim();
      } else if (line.includes('**Optimization**: ')) {
        metadata.difficultyBreakdown.optimization = line.split('**Optimization**: ')[1].trim();
      }
    }

    return metadata;
  }

  private parseEducationalContent(sections: Record<string, string>): AlgorithmData['educationalContent'] {
    return {
      analogy: this.parseAnalogy(sections['Analogy'] || ''),
      keyInsights: this.parseKeyInsights(sections['Key Insights'] || ''),
      commonMistakes: this.parseList(sections['Common Mistakes'] || ''),
      optimizationTips: this.parseList(sections['Optimization Tips'] || ''),
      interviewTips: this.parseList(sections['Interview Tips'] || '')
    };
  }

  private parseCodeQuality(content: string): AlgorithmData['codeQuality'] {
    const quality: AlgorithmData['codeQuality'] = {
      readability: 8,
      efficiency: 9,
      maintainability: 7,
      documentation: 8,
      testability: 9,
      bestPractices: []
    };

    const lines = content.split('\n');

    for (const line of lines) {
      if (line.includes('### Readability: ')) {
        quality.readability = parseInt(line.split('### Readability: ')[1].split('/')[0]);
      } else if (line.includes('### Efficiency: ')) {
        quality.efficiency = parseInt(line.split('### Efficiency: ')[1].split('/')[0]);
      } else if (line.includes('### Maintainability: ')) {
        quality.mainability = parseInt(line.split('### Maintainability: ')[1].split('/')[0]);
      } else if (line.includes('### Documentation: ')) {
        quality.documentation = parseInt(line.split('### Documentation: ')[1].split('/')[0]);
      } else if (line.includes('### Testability: ')) {
        quality.testability = parseInt(line.split('### Testability: ')[1].split('/')[0]);
      } else if (line.includes('### Best Practices')) {
        // Parse best practices list
        const practiceLines = lines.slice(lines.indexOf(line) + 1);
        for (const practiceLine of practiceLines) {
          if (practiceLine.trim().startsWith('- ')) {
            quality.bestPractices.push(practiceLine.substring(2).trim());
          } else if (practiceLine.startsWith('###')) {
            break;
          }
        }
      }
    }

    return quality;
  }

  private parseTestingScenarios(content: string): Array<{scenario: string; input: string; expectedOutput: string; edgeCase: boolean}> {
    const scenarios: Array<{scenario: string; input: string; expectedOutput: string; edgeCase: boolean}> = [];
    const lines = content.split('\n');
    let currentScenario: any = {};

    for (const line of lines) {
      if (line.includes('**Scenario**: ')) {
        if (currentScenario.scenario) {
          scenarios.push(currentScenario);
        }
        currentScenario = { scenario: line.split('**Scenario**: ')[1].trim() };
      } else if (line.includes('**Input**: ')) {
        currentScenario.input = line.split('**Input**: ')[1].trim();
      } else if (line.includes('**Expected Output**: ')) {
        currentScenario.expectedOutput = line.split('**Expected Output**: ')[1].trim();
      } else if (line.includes('**Edge Case**: ')) {
        currentScenario.edgeCase = line.split('**Edge Case**: ')[1].trim().toLowerCase() === 'true';
      }
    }

    if (currentScenario.scenario) {
      scenarios.push(currentScenario);
    }

    return scenarios;
  }

  private parsePerformanceAnalysis(content: string): AlgorithmData['performanceAnalysis'] {
    const analysis: AlgorithmData['performanceAnalysis'] = {
      bestCase: 'O(1)',
      averageCase: 'O(n)',
      worstCase: 'O(n²)',
      spaceComplexity: 'O(n)',
      bottlenecks: [],
      scalability: 'Linear scaling with input size'
    };

    const lines = content.split('\n');

    for (const line of lines) {
      if (line.includes('### Best Case: ')) {
        analysis.bestCase = line.split('### Best Case: ')[1].trim();
      } else if (line.includes('### Average Case: ')) {
        analysis.averageCase = line.split('### Average Case: ')[1].trim();
      } else if (line.includes('### Worst Case: ')) {
        analysis.worstCase = line.split('### Worst Case: ')[1].trim();
      } else if (line.includes('### Space Complexity: ')) {
        analysis.spaceComplexity = line.split('### Space Complexity: ')[1].trim();
      } else if (line.includes('### Scalability')) {
        const scalabilityLines = lines.slice(lines.indexOf(line) + 1);
        for (const scalabilityLine of scalabilityLines) {
          if (scalabilityLine.trim().startsWith('- ')) {
            analysis.scalability = scalabilityLine.substring(2).trim();
            break;
          }
        }
      } else if (line.includes('### Bottlenecks')) {
        const bottleneckLines = lines.slice(lines.indexOf(line) + 1);
        for (const bottleneckLine of bottleneckLines) {
          if (bottleneckLine.trim().startsWith('- ')) {
            analysis.bottlenecks.push(bottleneckLine.substring(2).trim());
          } else if (bottleneckLine.startsWith('###')) {
            break;
          }
        }
      }
    }

    return analysis;
  }

  private parseRelatedAlgorithms(content: string): Array<{name: string; similarity: string; whenToUse: string}> {
    const algorithms: Array<{name: string; similarity: string; whenToUse: string}> = [];
    const lines = content.split('\n');
    let currentAlgo: any = {};

    for (const line of lines) {
      if (line.startsWith('### ')) {
        if (currentAlgo.name) {
          algorithms.push(currentAlgo);
        }
        currentAlgo = { name: line.substring(4).trim() };
      } else if (line.includes('**Similarity**: ')) {
        currentAlgo.similarity = line.split('**Similarity**: ')[1].trim();
      } else if (line.includes('**When to Use**: ')) {
        currentAlgo.whenToUse = line.split('**When to Use**: ')[1].trim();
      }
    }

    if (currentAlgo.name) {
      algorithms.push(currentAlgo);
    }

    return algorithms;
  }

  private parseList(content: string): string[] {
    return content.split('\n')
      .filter(line => line.trim().startsWith('- '))
      .map(line => line.substring(2).trim());
  }
}
