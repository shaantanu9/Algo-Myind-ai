import fs from 'fs';
import path from 'path';

export interface Algorithm {
  id: string;
  problemId?: number;
  title: string;
  description: string;
  difficulty: string;
  category: string;
  timeComplexity: string;
  spaceComplexity: string;
  popularity: number;
  estimatedTime: string;
  realWorldUse: string;
  problemStatement: string;
  lastModified?: number;
  examples: Array<{
    input: string;
    output: string;
    explanation: string;
  }>;
  analogy: {
    title: string;
    content: string;
  } | undefined;
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
  implementations?: {
    bruteForce?: {
      title: string;
      timeComplexity: string;
      spaceComplexity: string;
      code: string;
      explanation?: string;
      whenToUse?: string;
    };
    optimized?: {
      title: string;
      timeComplexity: string;
      spaceComplexity: string;
      code: string;
      explanation?: string;
      whenToUse?: string;
    };
    alternative?: {
      title: string;
      timeComplexity: string;
      spaceComplexity: string;
      code: string;
      explanation?: string;
      whenToUse?: string;
    };
  };
  animationStates: Array<{
    step: number;
    title: string;
    description: string;
    data: any;
  }>;
  animation?: {
    interactiveData: any;
  };
  metadata?: {
    tags?: string[];
    acceptanceRate?: string;
    frequency?: number;
    similarProblems?: string[];
    difficultyBreakdown?: {
      understanding: string;
      implementation: string;
      optimization: string;
    };
  };
  generatedAnimations?: Array<{
    library: string;
    frames: Array<{
      step: number;
      atoms: any[];
      data: any;
    }>;
  }>;
  educationalContent?: {
    analogy?: {
      title: string;
      content: string;
      visualAid?: string;
    };
    keyInsights?: string[];
    commonMistakes?: string[];
    optimizationTips?: string[];
    interviewTips?: string[];
  };
  codeQuality?: {
    readability: number;
    efficiency: number;
    maintainability: number;
    documentation: number;
    testability: number;
    bestPractices?: string[];
  };
  testingScenarios?: Array<{
    scenario: string;
    input: string;
    expectedOutput: string;
    edgeCase: boolean;
  }>;
  performanceAnalysis?: {
    bestCase: string;
    averageCase: string;
    worstCase: string;
    spaceComplexity: string;
    bottlenecks?: string[];
    scalability: string;
  };
  relatedAlgorithms?: Array<{
    name: string;
    similarity: string;
    whenToUse: string;
  }>;
}

export class MarkdownAlgorithmParser {
  private content: string;
  private sections: Map<string, string> = new Map();

  constructor(content: string) {
    this.content = content;
    this.parseSections();
  }

  private parseSections() {
    const lines = this.content.split('\n');
    let currentSection = '';
    let currentContent: string[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Check for main section headers (## - not ###)
      if (line.startsWith('## ')) {
        // Save previous section
        if (currentSection) {
          this.sections.set(currentSection, currentContent.join('\n').trim());
        }

        // Start new section - use the main section name
        const sectionTitle = line.replace(/^##\s*/, '').toLowerCase().replace(/\s+/g, '-');
        currentSection = sectionTitle;
        currentContent = [];
      } else if (line.startsWith('### ') && currentSection) {
        // For subsections, append to current section
        currentContent.push(line);
      } else if (currentSection) {
        currentContent.push(line);
      }
    }

    // Save last section
    if (currentSection) {
      this.sections.set(currentSection, currentContent.join('\n').trim());
    }
  }

  private parseBasicInfo(): Partial<Algorithm> {
    const section = this.sections.get('basic-information') || '';
    const lines = section.split('\n');
    const data: any = {};

    lines.forEach(line => {
      // Handle markdown format: - **Key**: value
      if (line.includes('**') && line.includes(':')) {
        const match = line.match(/- \*\*([^:]+)\*\*:\s*(.+)/);
        if (match) {
          const key = match[1].trim().toLowerCase();
          const value = match[2].trim();

          switch (key) {
            case 'id':
              data.id = value;
              break;
            case 'title':
              data.title = value;
              break;
            case 'description':
              data.description = value;
              break;
            case 'difficulty':
              data.difficulty = value;
              break;
            case 'category':
              data.category = value;
              break;
            case 'time complexity':
              data.timeComplexity = value;
              break;
            case 'space complexity':
              data.spaceComplexity = value;
              break;
            case 'popularity':
              data.popularity = parseInt(value) || 0;
              break;
            case 'estimated time':
              data.estimatedTime = value;
              break;
            case 'real world use':
              data.realWorldUse = value;
              break;
          }
        }
      }
      // Fallback for simple format: key: value
      else if (line.includes(':') && !line.startsWith('-') && !line.startsWith('*')) {
        const [key, ...valueParts] = line.split(':');
        const value = valueParts.join(':').trim();

        switch (key.trim().toLowerCase()) {
          case 'id':
            data.id = value;
            break;
          case 'title':
            data.title = value;
            break;
          case 'description':
            data.description = value;
            break;
          case 'difficulty':
            data.difficulty = value;
            break;
          case 'category':
            data.category = value;
            break;
          case 'time complexity':
            data.timeComplexity = value;
            break;
          case 'space complexity':
            data.spaceComplexity = value;
            break;
          case 'popularity':
            data.popularity = parseInt(value) || 0;
            break;
          case 'estimated time':
            data.estimatedTime = value;
            break;
          case 'real world use':
            data.realWorldUse = value;
            break;
        }
      }
    });

    return data;
  }

  private parseProblemStatement(): string {
    return this.sections.get('problem-statement') || '';
  }

  private parseExamples(): Array<{input: string, output: string, explanation: string}> {
    const section = this.sections.get('examples') || '';
    const examples: Array<{input: string, output: string, explanation: string}> = [];

    // Split by example headers
    const exampleBlocks = section.split(/### Example \d+/);

    exampleBlocks.forEach(block => {
      if (block.trim()) {
        const lines = block.trim().split('\n');
        let input = '';
        let output = '';
        let explanation = '';

        lines.forEach(line => {
          if (line.startsWith('Input:')) {
            input = line.replace('Input:', '').trim();
          } else if (line.startsWith('Output:')) {
            output = line.replace('Output:', '').trim();
          } else if (line.startsWith('Explanation:')) {
            explanation = line.replace('Explanation:', '').trim();
          }
        });

        if (input || output || explanation) {
          examples.push({ input, output, explanation });
        }
      }
    });

    return examples;
  }

  private parseAnalogy(): {title: string, content: string} | undefined {
    const section = this.sections.get('analogy') || '';
    const lines = section.split('\n');

    let title = '';
    let content = '';

    lines.forEach(line => {
      if (line.startsWith('### Title:')) {
        title = line.replace('### Title:', '').trim();
      } else if (line.startsWith('**Content**:') || line.startsWith('**Content**:')) {
        content = line.replace(/\*\*Content\*\*:/, '').trim();
      } else if (!line.startsWith('**') && !line.startsWith('###') && line.trim()) {
        content += (content ? '\n' : '') + line.trim();
      }
    });

    return title && content ? { title, content } : undefined;
  }

  private parseListSection(sectionName: string): string[] {
    const section = this.sections.get(sectionName) || '';
    const lines = section.split('\n');
    const items: string[] = [];

    lines.forEach(line => {
      if (line.trim().startsWith('- ')) {
        items.push(line.trim().substring(2));
      }
    });

    return items;
  }

  private parseRealWorldApplications(): Array<{domain: string, application: string, description: string}> {
    const section = this.sections.get('real-world-applications') || '';
    const lines = section.split('\n');
    const applications: Array<{domain: string, application: string, description: string}> = [];

    let currentApp: any = {};

    lines.forEach(line => {
      if (line.startsWith('### ')) {
        if (currentApp.domain) {
          applications.push(currentApp);
        }
        currentApp = { domain: line.replace('### ', '').trim() };
      } else if (line.startsWith('**Application**:') || line.startsWith('**Application**:')) {
        currentApp.application = line.replace(/\*\*Application\*\*:/, '').trim();
      } else if (line.startsWith('**Description**:') || line.startsWith('**Description**:')) {
        currentApp.description = line.replace(/\*\*Description\*\*:/, '').trim();
      }
    });

    if (currentApp.domain) {
      applications.push(currentApp);
    }

    return applications;
  }

  private parseEngineeringLessons(): Array<{principle: string, lesson: string, application: string}> {
    const section = this.sections.get('engineering-lessons') || '';
    const lines = section.split('\n');
    const lessons: Array<{principle: string, lesson: string, application: string}> = [];

    let currentLesson: any = {};

    lines.forEach(line => {
      if (line.startsWith('### ')) {
        if (currentLesson.principle) {
          lessons.push(currentLesson);
        }
        currentLesson = { principle: line.replace('### ', '').trim() };
      } else if (line.startsWith('**Lesson**:') || line.startsWith('**Lesson**:')) {
        currentLesson.lesson = line.replace(/\*\*Lesson\*\*:/, '').trim();
      } else if (line.startsWith('**Application**:') || line.startsWith('**Application**:')) {
        currentLesson.application = line.replace(/\*\*Application\*\*:/, '').trim();
      }
    });

    if (currentLesson.principle) {
      lessons.push(currentLesson);
    }

    return lessons;
  }

  private parseImplementations(): Algorithm['implementations'] {
    const implementations: Algorithm['implementations'] = {};

    // Parse Brute Force
    const bruteForceSection = this.sections.get('brute-force-approach') || '';
    if (bruteForceSection) {
      implementations.bruteForce = this.parseImplementation(bruteForceSection);
    }

    // Parse Optimized
    const optimizedSection = this.sections.get('optimized-solution-(hash-map)') || '';
    if (optimizedSection) {
      implementations.optimized = this.parseImplementation(optimizedSection);
    }

    return Object.keys(implementations).length > 0 ? implementations : undefined;
  }

  private parseImplementation(section: string): any {
    const lines = section.split('\n');
    let inCodeBlock = false;
    let code = '';
    let title = '';
    let timeComplexity = '';
    let spaceComplexity = '';
    let explanation = '';
    let whenToUse = '';

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (line.includes('```')) {
        inCodeBlock = !inCodeBlock;
        if (!inCodeBlock && code) {
          break; // End of code block
        }
        continue;
      }

      if (inCodeBlock) {
        code += (code ? '\n' : '') + line;
      } else {
        if (line.startsWith('**Time Complexity**:') || line.startsWith('**Time Complexity**:')) {
          timeComplexity = line.replace(/\*\*Time Complexity\*\*:/, '').trim();
        } else if (line.startsWith('**Space Complexity**:') || line.startsWith('**Space Complexity**:')) {
          spaceComplexity = line.replace(/\*\*Space Complexity\*\*:/, '').trim();
        } else if (line.startsWith('**Explanation**:') || line.startsWith('**Explanation**:')) {
          explanation = line.replace(/\*\*Explanation\*\*:/, '').trim();
        } else if (line.startsWith('**When to Use**:') || line.startsWith('**When to Use**:')) {
          whenToUse = line.replace(/\*\*When to Use\*\*:/, '').trim();
        }
      }
    }

    return {
      title: title || 'Implementation',
      timeComplexity: timeComplexity || 'O(n)',
      spaceComplexity: spaceComplexity || 'O(1)',
      code: code.trim(),
      explanation,
      whenToUse
    };
  }

  private parseAnimationStates(): Array<{step: number, title: string, description: string, data: any}> {
    const animationStates: Array<{step: number, title: string, description: string, data: any}> = [];

    // For now, create basic animation states from the algorithm data
    // This provides a fallback when detailed animation data isn't available
    if (!this.sections.get('d3-animation-states')) {
      // Create basic animation states
      animationStates.push({
        step: 0,
        title: "Algorithm Overview",
        description: this.sections.get('basic-information')?.split('\n')[1]?.replace('- **Description**: ', '') || "Understanding the algorithm",
        data: { type: "overview" }
      });

      animationStates.push({
        step: 1,
        title: "Initialization",
        description: "Set up initial variables and data structures",
        data: { type: "initialization" }
      });

      animationStates.push({
        step: 2,
        title: "Processing",
        description: "Execute the main algorithm logic",
        data: { type: "processing" }
      });

      animationStates.push({
        step: 3,
        title: "Result",
        description: "Return the final result",
        data: { type: "result" }
      });
    } else {
      // Parse detailed D3 Animation States
      const d3Section = this.sections.get('d3-animation-states') || '';
      const steps = d3Section.split(/#### Step \d+:/);

      steps.forEach((stepContent, index) => {
        if (index === 0) return; // Skip first empty part

        const lines = stepContent.trim().split('\n');
        let title = '';
        let description = '';
        let data: any = {};

        lines.forEach(line => {
          if (line.startsWith('**Title**:') || line.startsWith('**Title**:')) {
            title = line.replace(/\*\*Title\*\*:/, '').trim();
          } else if (line.startsWith('**Description**:') || line.startsWith('**Description**:')) {
            description = line.replace(/\*\*Description\*\*:/, '').trim();
          } else if (line.startsWith('**D3 Data**:')) {
            // Look for JSON code block that follows
            const dataIndex = lines.indexOf(line);
            let jsonContent = '';
            let inJsonBlock = false;

            for (let j = dataIndex + 1; j < lines.length; j++) {
              const jsonLine = lines[j];

              if (jsonLine.trim() === '```json') {
                inJsonBlock = true;
                continue;
              }

              if (jsonLine.trim() === '```') {
                inJsonBlock = false;
                break;
              }

              if (inJsonBlock) {
                jsonContent += jsonLine + '\n';
              }
            }

            try {
              if (jsonContent.trim()) {
                data = JSON.parse(jsonContent.trim());
              }
            } catch (e) {
              console.warn('Failed to parse D3 animation data JSON:', e);
              // Fallback to basic data
              data = { type: "fallback" };
            }
          }
        });

        if (title) {
          animationStates.push({
            step: index,
            title,
            description,
            data
          });
        }
      });
    }

    return animationStates;
  }

  private parseEducationalContent(): Algorithm['educationalContent'] {
    const educationalContent: Algorithm['educationalContent'] = {};

    // Parse common mistakes
    const commonMistakes = this.parseListSection('common-mistakes');
    if (commonMistakes.length > 0) {
      educationalContent.commonMistakes = commonMistakes;
    }

    // Parse optimization tips
    const optimizationTips = this.parseListSection('optimization-tips');
    if (optimizationTips.length > 0) {
      educationalContent.optimizationTips = optimizationTips;
    }

    // Parse interview tips
    const interviewTips = this.parseListSection('interview-tips');
    if (interviewTips.length > 0) {
      educationalContent.interviewTips = interviewTips;
    }

    // Parse analogy from main analogy section
    const analogy = this.parseAnalogy();
    if (analogy) {
      educationalContent.analogy = analogy;
    }

    return Object.keys(educationalContent).length > 0 ? educationalContent : undefined;
  }

  private parseTestingScenarios(): Algorithm['testingScenarios'] {
    const section = this.sections.get('testing-scenarios') || '';
    const lines = section.split('\n');
    const scenarios: Algorithm['testingScenarios'] = [];

    let currentScenario: any = {};

    lines.forEach(line => {
      if (line.startsWith('### ')) {
        if (currentScenario.scenario) {
          scenarios.push(currentScenario);
        }
        currentScenario = { scenario: line.replace('### ', '').trim() };
      } else if (line.startsWith('**Input**:') || line.startsWith('**Input**:')) {
        currentScenario.input = line.replace(/\*\*Input\*\*:/, '').trim();
      } else if (line.startsWith('**Expected Output**:') || line.startsWith('**Expected Output**:')) {
        currentScenario.expectedOutput = line.replace(/\*\*Expected Output\*\*:/, '').trim();
      } else if (line.startsWith('**Edge Case**:') || line.startsWith('**Edge Case**:')) {
        currentScenario.edgeCase = line.replace(/\*\*Edge Case\*\*:/, '').trim().toLowerCase() === 'true';
      }
    });

    if (currentScenario.scenario) {
      scenarios.push(currentScenario);
    }

    return scenarios.length > 0 ? scenarios : undefined;
  }

  private parsePerformanceAnalysis(): Algorithm['performanceAnalysis'] {
    const section = this.sections.get('performance-analysis') || '';
    const lines = section.split('\n');
    const performanceAnalysis: Algorithm['performanceAnalysis'] = {
      bestCase: 'O(1)',
      averageCase: 'O(n)',
      worstCase: 'O(n)',
      spaceComplexity: 'O(n)'
    };

    lines.forEach(line => {
      if (line.startsWith('### Best Case:')) {
        performanceAnalysis.bestCase = line.replace('### Best Case:', '').trim();
      } else if (line.startsWith('### Average Case:')) {
        performanceAnalysis.averageCase = line.replace('### Average Case:', '').trim();
      } else if (line.startsWith('### Worst Case:')) {
        performanceAnalysis.worstCase = line.replace('### Worst Case:', '').trim();
      } else if (line.startsWith('### Space Complexity:')) {
        performanceAnalysis.spaceComplexity = line.replace('### Space Complexity:', '').trim();
      }
    });

    // Parse bottlenecks
    const bottlenecks = this.parseListSection('bottlenecks');
    if (bottlenecks.length > 0) {
      performanceAnalysis.bottlenecks = bottlenecks;
    }

    // Parse scalability
    const scalabilitySection = this.sections.get('scalability') || '';
    if (scalabilitySection) {
      performanceAnalysis.scalability = scalabilitySection.trim();
    }

    return performanceAnalysis;
  }

  private parseCodeQuality(): Algorithm['codeQuality'] {
    const section = this.sections.get('code-quality-metrics') || '';
    const lines = section.split('\n');
    const codeQuality: Algorithm['codeQuality'] = {
      readability: 8,
      efficiency: 9,
      maintainability: 8,
      documentation: 8,
      testability: 9
    };

    lines.forEach(line => {
      if (line.includes('Readability:')) {
        const match = line.match(/Readability:\s*(\d+)\/10/);
        if (match) codeQuality.readability = parseInt(match[1]);
      } else if (line.includes('Efficiency:')) {
        const match = line.match(/Efficiency:\s*(\d+)\/10/);
        if (match) codeQuality.efficiency = parseInt(match[1]);
      } else if (line.includes('Maintainability:')) {
        const match = line.match(/Maintainability:\s*(\d+)\/10/);
        if (match) codeQuality.maintainability = parseInt(match[1]);
      } else if (line.includes('Documentation:')) {
        const match = line.match(/Documentation:\s*(\d+)\/10/);
        if (match) codeQuality.documentation = parseInt(match[1]);
      } else if (line.includes('Testability:')) {
        const match = line.match(/Testability:\s*(\d+)\/10/);
        if (match) codeQuality.testability = parseInt(match[1]);
      }
    });

    // Parse best practices
    const bestPractices = this.parseListSection('best-practices');
    if (bestPractices.length > 0) {
      codeQuality.bestPractices = bestPractices;
    }

    return codeQuality;
  }

  private parseRelatedAlgorithms(): Algorithm['relatedAlgorithms'] {
    const section = this.sections.get('related-algorithms') || '';
    const lines = section.split('\n');
    const relatedAlgorithms: Algorithm['relatedAlgorithms'] = [];

    let currentAlgo: any = {};

    lines.forEach(line => {
      if (line.startsWith('### ')) {
        if (currentAlgo.name) {
          relatedAlgorithms.push(currentAlgo);
        }
        currentAlgo = { name: line.replace('### ', '').trim() };
      } else if (line.startsWith('**Similarity**:') || line.startsWith('**Similarity**:')) {
        currentAlgo.similarity = line.replace(/\*\*Similarity\*\*:/, '').trim();
      } else if (line.startsWith('**When to Use**:') || line.startsWith('**When to Use**:')) {
        currentAlgo.whenToUse = line.replace(/\*\*When to Use\*\*:/, '').trim();
      }
    });

    if (currentAlgo.name) {
      relatedAlgorithms.push(currentAlgo);
    }

    return relatedAlgorithms.length > 0 ? relatedAlgorithms : undefined;
  }

  private parseMetadata(): Algorithm['metadata'] {
    const section = this.sections.get('metadata') || '';
    const lines = section.split('\n');
    const metadata: Algorithm['metadata'] = {};

    lines.forEach(line => {
      if (line.startsWith('### Tags')) {
        // Parse next lines for tags
        const tagsSection = this.sections.get('tags') || '';
        if (tagsSection) {
          metadata.tags = tagsSection.split('\n')
            .filter(line => line.trim().startsWith('- '))
            .map(line => line.trim().substring(2));
        }
      } else if (line.includes('Acceptance Rate:')) {
        const match = line.match(/Acceptance Rate:\s*(\d+)%/);
        if (match) metadata.acceptanceRate = match[1] + '%';
      } else if (line.includes('Frequency:')) {
        const match = line.match(/Frequency:\s*(\d+)/);
        if (match) metadata.frequency = parseInt(match[1]);
      }
    });

    // Parse difficulty breakdown
    const difficultySection = this.sections.get('difficulty-breakdown') || '';
    if (difficultySection) {
      const breakdown: any = {};
      const lines = difficultySection.split('\n');

      lines.forEach(line => {
        if (line.includes('Understanding:')) {
          breakdown.understanding = line.split(':')[1]?.trim();
        } else if (line.includes('Implementation:')) {
          breakdown.implementation = line.split(':')[1]?.trim();
        } else if (line.includes('Optimization:')) {
          breakdown.optimization = line.split(':')[1]?.trim();
        }
      });

      if (Object.keys(breakdown).length > 0) {
        metadata.difficultyBreakdown = breakdown;
      }
    }

    return Object.keys(metadata).length > 0 ? metadata : undefined;
  }

  public parse(): Algorithm {
    const basicInfo = this.parseBasicInfo();

    const algorithm: Algorithm = {
      id: basicInfo.id || 'unknown',
      title: basicInfo.title || 'Unknown Algorithm',
      description: basicInfo.description || '',
      difficulty: basicInfo.difficulty || 'Medium',
      category: basicInfo.category || 'Unknown',
      timeComplexity: basicInfo.timeComplexity || 'O(n)',
      spaceComplexity: basicInfo.spaceComplexity || 'O(1)',
      popularity: basicInfo.popularity || 0,
      estimatedTime: basicInfo.estimatedTime || '15 min',
      realWorldUse: basicInfo.realWorldUse || '',
      problemStatement: this.parseProblemStatement(),
      examples: this.parseExamples(),
      analogy: this.parseAnalogy(),
      keyInsights: this.parseListSection('key-insights'),
      realWorldApplications: this.parseRealWorldApplications(),
      engineeringLessons: this.parseEngineeringLessons(),
      animationStates: this.parseAnimationStates(),
      implementations: this.parseImplementations(),
      educationalContent: this.parseEducationalContent(),
      testingScenarios: this.parseTestingScenarios(),
      performanceAnalysis: this.parsePerformanceAnalysis(),
      codeQuality: this.parseCodeQuality(),
      relatedAlgorithms: this.parseRelatedAlgorithms(),
      metadata: this.parseMetadata(),
      lastModified: Date.now()
    };

    return algorithm;
  }

  static fromFile(filePath: string): Algorithm {
    const content = fs.readFileSync(filePath, 'utf-8');
    const parser = new MarkdownAlgorithmParser(content);
    return parser.parse();
  }

  static fromDirectory(directoryPath: string): Algorithm[] {
    const algorithms: Algorithm[] = [];
    const files = fs.readdirSync(directoryPath);

    files.forEach(file => {
      if (file.endsWith('.md')) {
        try {
          const filePath = path.join(directoryPath, file);
          const algorithm = MarkdownAlgorithmParser.fromFile(filePath);
          algorithms.push(algorithm);
        } catch (error) {
          console.warn(`Failed to parse ${file}:`, error);
        }
      }
    });

    return algorithms;
  }
}
