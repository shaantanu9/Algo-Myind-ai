import fs from 'fs';
import path from 'path';

export interface LeetCodeProblem {
  number: number;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  acceptanceRate: string;
  description: string;
  examples: Array<{
    input: string;
    output: string;
    explanation: string;
  }>;
  analysis: string;
  implementations: {
    [language: string]: {
      code: string;
      timeComplexity: string;
      spaceComplexity: string;
    };
  };
  hasAnimation: boolean;
  animationPath: string;
}

export class LeetCodeParser {
  private basePath: string;

  constructor(basePath: string) {
    this.basePath = basePath;
  }

  async parseAllProblems(): Promise<LeetCodeProblem[]> {
    const problems: LeetCodeProblem[] = [];
    const directories = fs.readdirSync(this.basePath).filter(dir =>
      fs.statSync(path.join(this.basePath, dir)).isDirectory() &&
      dir.match(/^\d{4}-/)
    );

    for (const dir of directories) {
      try {
        const problem = await this.parseProblem(dir);
        if (problem) {
          problems.push(problem);
        }
      } catch (error) {
        console.warn(`Failed to parse ${dir}:`, error);
      }
    }

    return problems.sort((a, b) => a.number - b.number);
  }

  async parseProblem(dirName: string): Promise<LeetCodeProblem | null> {
    const problemPath = path.join(this.basePath, dirName);
    const articlePath = path.join(problemPath, 'Article');
    const animationPath = path.join(problemPath, 'Animation', 'Animation.gif');

    // Find the markdown file
    const files = fs.readdirSync(articlePath);
    const mdFile = files.find(f => f.endsWith('.md'));

    if (!mdFile) {
      return null;
    }

    const content = fs.readFileSync(path.join(articlePath, mdFile), 'utf-8');
    const hasAnimation = fs.existsSync(animationPath);

    return this.parseMarkdownContent(content, dirName, hasAnimation, animationPath);
  }

  private parseMarkdownContent(
    content: string,
    dirName: string,
    hasAnimation: boolean,
    animationPath: string
  ): LeetCodeProblem {
    const lines = content.split('\n');

    // Extract problem number and title from first line
    const titleMatch = lines[0].match(/# LeetCode 第 (\d+) 号问题：(.+)/);
    const number = titleMatch ? parseInt(titleMatch[1]) : parseInt(dirName.split('-')[0]);
    const title = titleMatch ? titleMatch[2].trim() : dirName.replace(/^\d{4}-/, '').replace(/-/g, ' ');

    // Extract difficulty and acceptance rate
    const difficultyMatch = content.match(/题目难度为 ([^，]+)，目前通过率为 ([^。]+)/);
    const difficulty = (difficultyMatch ? difficultyMatch[1] : 'Medium') as 'Easy' | 'Medium' | 'Hard';
    const acceptanceRate = difficultyMatch ? difficultyMatch[2] : '45.0%';

    // Extract description
    const descriptionMatch = content.match(/### 题目描述\n\n([\s\S]*?)\n\n###/);
    const description = descriptionMatch ? descriptionMatch[1].trim() : '';

    // Extract examples
    const examples: Array<{input: string; output: string; explanation: string}> = [];
    const exampleMatches = content.match(/```\n([^`]+)\n```/g);

    if (exampleMatches) {
      for (const match of exampleMatches) {
        const exampleText = match.replace(/```/g, '').trim();
        const lines = exampleText.split('\n');
        if (lines.length >= 3) {
          examples.push({
            input: lines[0].replace('给定 ', '').replace('输入：', '').trim(),
            output: lines[1].replace('输出：', '').trim(),
            explanation: lines.slice(2).join(' ').trim()
          });
        }
      }
    }

    // Extract analysis
    const analysisMatch = content.match(/### 题目解析\n\n([\s\S]*?)\n\n###/);
    const analysis = analysisMatch ? analysisMatch[1].trim() : '';

    // Extract code implementations
    const implementations: {[language: string]: {code: string; timeComplexity: string; spaceComplexity: string}} = {};

    const codeBlocks = content.match(/#### ([^\n]+)\n```[^\n]*\n([\s\S]*?)```/g);

    if (codeBlocks) {
      for (const block of codeBlocks) {
        const languageMatch = block.match(/#### ([^\n]+)/);
        const codeMatch = block.match(/```\n([\s\S]*?)```/);

        if (languageMatch && codeMatch) {
          const language = languageMatch[1].trim();
          let code = codeMatch[1].trim();

          // Extract time and space complexity from comments
          const timeMatch = code.match(/时间复杂度[：:]\s*([^\/\n]+)/);
          const spaceMatch = code.match(/空间复杂度[：:]\s*([^\/\n]+)/);

          const timeComplexity = timeMatch ? timeMatch[1].trim() : 'O(n)';
          const spaceComplexity = spaceMatch ? spaceMatch[1].trim() : 'O(n)';

          // Clean up code
          code = code.replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '').trim();

          implementations[language] = {
            code,
            timeComplexity,
            spaceComplexity
          };
        }
      }
    }

    return {
      number,
      title,
      difficulty,
      acceptanceRate,
      description,
      examples,
      analysis,
      implementations,
      hasAnimation,
      animationPath
    };
  }

  async generateAlgorithmJSON(problem: LeetCodeProblem): Promise<any> {
    return {
      id: `leetcode-${problem.number}`,
      problemId: problem.number,
      title: problem.title,
      description: problem.description,
      difficulty: problem.difficulty,
      category: this.categorizeAlgorithm(problem.title),
      timeComplexity: problem.implementations['C++']?.timeComplexity || 'O(n)',
      spaceComplexity: problem.implementations['C++']?.spaceComplexity || 'O(n)',
      popularity: parseFloat(problem.acceptanceRate.replace('%', '')),
      estimatedTime: this.estimateTime(problem.difficulty),
      realWorldUse: this.generateRealWorldUse(problem.title),
      problemStatement: problem.description,
      examples: problem.examples,
      analogy: this.generateAnalogy(problem.title),
      keyInsights: this.generateKeyInsights(problem.title, problem.analysis),
      realWorldApplications: this.generateApplications(problem.title),
      engineeringLessons: this.generateEngineeringLessons(problem.title),
      implementations: {
        bruteForce: problem.implementations['C'] ? {
          title: 'Brute Force Approach',
          timeComplexity: 'O(n²)',
          spaceComplexity: 'O(1)',
          code: problem.implementations['C'].code,
          explanation: 'Simple nested loop approach checking all pairs',
          whenToUse: 'Small input sizes, educational purposes'
        } : undefined,
        optimized: problem.implementations['C++'] ? {
          title: 'Optimized Solution',
          timeComplexity: problem.implementations['C++'].timeComplexity,
          spaceComplexity: problem.implementations['C++'].spaceComplexity,
          code: problem.implementations['C++'].code,
          explanation: problem.analysis,
          whenToUse: 'Production code, large datasets'
        } : undefined,
        alternative: problem.implementations['Java'] ? {
          title: 'Java Implementation',
          timeComplexity: problem.implementations['Java'].timeComplexity,
          spaceComplexity: problem.implementations['Java'].spaceComplexity,
          code: problem.implementations['Java'].code,
          explanation: 'Alternative implementation in Java',
          whenToUse: 'Java-based projects'
        } : undefined
      },
      animationStates: this.generateAnimationStates(problem),
      metadata: {
        tags: this.generateTags(problem.title),
        acceptanceRate: problem.acceptanceRate,
        frequency: Math.floor(Math.random() * 100),
        similarProblems: this.generateSimilarProblems(problem.title),
        difficultyBreakdown: this.generateDifficultyBreakdown(problem.difficulty)
      },
      educationalContent: {
        analogy: this.generateAnalogy(problem.title),
        keyInsights: this.generateKeyInsights(problem.title, problem.analysis),
        commonMistakes: this.generateCommonMistakes(problem.title),
        optimizationTips: this.generateOptimizationTips(problem.title),
        interviewTips: this.generateInterviewTips(problem.title)
      },
      codeQuality: {
        readability: 8,
        efficiency: 9,
        maintainability: 7,
        documentation: 8,
        testability: 9,
        bestPractices: this.generateBestPractices(problem.title)
      },
      testingScenarios: this.generateTestingScenarios(problem),
      performanceAnalysis: {
        bestCase: 'O(1)',
        averageCase: 'O(n)',
        worstCase: 'O(n²)',
        spaceComplexity: 'O(n)',
        bottlenecks: ['Hash collisions', 'Memory allocation'],
        scalability: 'Linear scaling with input size'
      },
      relatedAlgorithms: this.generateRelatedAlgorithms(problem.title)
    };
  }

  private categorizeAlgorithm(title: string): string {
    const titleLower = title.toLowerCase();

    if (titleLower.includes('two sum') || titleLower.includes('three sum') || titleLower.includes('4sum')) {
      return 'Array & Hash Table';
    }
    if (titleLower.includes('linked list') || titleLower.includes('node')) {
      return 'Linked List';
    }
    if (titleLower.includes('tree') || titleLower.includes('binary')) {
      return 'Tree';
    }
    if (titleLower.includes('sort') || titleLower.includes('merge')) {
      return 'Sorting';
    }
    if (titleLower.includes('string') || titleLower.includes('palindrome')) {
      return 'String';
    }
    if (titleLower.includes('dynamic') || titleLower.includes('dp')) {
      return 'Dynamic Programming';
    }

    return 'Algorithm';
  }

  private estimateTime(difficulty: string): string {
    switch (difficulty) {
      case 'Easy': return '15-30 mins';
      case 'Medium': return '30-60 mins';
      case 'Hard': return '60-120 mins';
      default: return '30-45 mins';
    }
  }

  private generateRealWorldUse(title: string): string {
    const titleLower = title.toLowerCase();

    if (titleLower.includes('two sum')) {
      return 'Finding complementary pairs in financial transactions, database joins, cryptography';
    }
    if (titleLower.includes('linked list')) {
      return 'Memory management, undo/redo functionality, browser history';
    }
    if (titleLower.includes('tree')) {
      return 'File systems, database indexing, syntax parsing';
    }

    return 'Various software engineering applications';
  }

  private generateAnalogy(title: string): { title: string; content: string } | undefined {
    const titleLower = title.toLowerCase();

    if (titleLower.includes('two sum')) {
      return {
        title: 'Finding Perfect Matches',
        content: 'Like finding two puzzle pieces that fit perfectly together, we\'re looking for two numbers that sum to exactly the target value. Just as you might organize puzzle pieces by shape, we use a hash map to quickly find the complement we need.'
      };
    }

    return undefined;
  }

  private generateKeyInsights(title: string, analysis: string): string[] {
    const insights = [];

    if (title.toLowerCase().includes('two sum')) {
      insights.push('Hash maps provide O(1) average case lookup time');
      insights.push('Trade space for time - store complements for quick access');
      insights.push('One-pass solution avoids multiple iterations');
      insights.push('Handle edge cases like duplicate values carefully');
    }

    return insights;
  }

  private generateApplications(title: string): Array<{domain: string; application: string; description: string}> {
    if (title.toLowerCase().includes('two sum')) {
      return [
        {
          domain: 'Finance',
          application: 'Transaction Matching',
          description: 'Finding pairs of transactions that sum to a specific amount for fraud detection'
        },
        {
          domain: 'E-commerce',
          application: 'Price Optimization',
          description: 'Finding product combinations that meet budget constraints'
        }
      ];
    }

    return [];
  }

  private generateEngineeringLessons(title: string): Array<{principle: string; lesson: string; application: string}> {
    if (title.toLowerCase().includes('two sum')) {
      return [
        {
          principle: 'Space-Time Tradeoff',
          lesson: 'Using extra space (hash map) to achieve better time complexity',
          application: 'Optimize performance-critical code by sacrificing memory when beneficial'
        }
      ];
    }

    return [];
  }

  private generateAnimationStates(problem: LeetCodeProblem): Array<{step: number; title: string; description: string; data: any}> {
    const states = [];

    if (problem.title.toLowerCase().includes('two sum')) {
      states.push(
        {
          step: 0,
          title: 'Initial Array',
          description: 'Start with the input array and target value',
          data: { array: [2, 7, 11, 15], target: 9, currentIndex: -1 }
        },
        {
          step: 1,
          title: 'Initialize Hash Map',
          description: 'Create an empty hash map to store seen numbers',
          data: { array: [2, 7, 11, 15], target: 9, currentIndex: 0, hashMap: {} }
        },
        {
          step: 2,
          title: 'Process First Element',
          description: 'Calculate complement and check hash map',
          data: { array: [2, 7, 11, 15], target: 9, currentIndex: 0, complement: 7, hashMap: {} }
        },
        {
          step: 3,
          title: 'Add to Hash Map',
          description: 'Store current number and its index',
          data: { array: [2, 7, 11, 15], target: 9, currentIndex: 0, hashMap: { 2: 0 } }
        },
        {
          step: 4,
          title: 'Find Match',
          description: 'Complement 7 found in hash map at index 0',
          data: { array: [2, 7, 11, 15], target: 9, currentIndex: 1, complement: 2, hashMap: { 2: 0 }, found: true }
        },
        {
          step: 5,
          title: 'Solution Found',
          description: 'Return indices [0, 1] as the solution',
          data: { array: [2, 7, 11, 15], target: 9, result: [0, 1] }
        }
      );
    }

    return states;
  }

  private generateTags(title: string): string[] {
    const tags = ['LeetCode'];
    const titleLower = title.toLowerCase();

    if (titleLower.includes('two sum')) {
      tags.push('Hash Table', 'Array', 'Easy');
    }
    if (titleLower.includes('linked list')) {
      tags.push('Linked List', 'Two Pointers');
    }

    return tags;
  }

  private generateSimilarProblems(title: string): string[] {
    if (title.toLowerCase().includes('two sum')) {
      return ['Three Sum', 'Four Sum', 'Two Sum II'];
    }
    return [];
  }

  private generateDifficultyBreakdown(difficulty: string): {understanding: string; implementation: string; optimization: string} {
    switch (difficulty) {
      case 'Easy':
        return {
          understanding: 'Straightforward',
          implementation: 'Simple loops and data structures',
          optimization: 'Basic time/space complexity'
        };
      case 'Medium':
        return {
          understanding: 'Requires careful analysis',
          implementation: 'Multiple approaches possible',
          optimization: 'Balance time vs space complexity'
        };
      case 'Hard':
        return {
          understanding: 'Complex problem analysis',
          implementation: 'Advanced data structures',
          optimization: 'Optimal algorithmic solutions'
        };
      default:
        return {
          understanding: 'Moderate',
          implementation: 'Standard algorithms',
          optimization: 'Efficient implementation'
        };
    }
  }

  private generateCommonMistakes(title: string): string[] {
    if (title.toLowerCase().includes('two sum')) {
      return [
        'Forgetting to handle duplicate values in the array',
        'Not considering the constraint that same element cannot be used twice',
        'Using nested loops when hash map can solve it efficiently',
        'Not handling edge cases like empty array or single element'
      ];
    }
    return [];
  }

  private generateOptimizationTips(title: string): string[] {
    if (title.toLowerCase().includes('two sum')) {
      return [
        'Use hash map for O(n) time complexity instead of O(n²) brute force',
        'Consider early termination if duplicates are not allowed',
        'Use appropriate hash map implementation for the language',
        'Consider space constraints for very large inputs'
      ];
    }
    return [];
  }

  private generateInterviewTips(title: string): string[] {
    if (title.toLowerCase().includes('two sum')) {
      return [
        'Start with brute force solution, then optimize',
        'Discuss time and space complexity trade-offs',
        'Consider edge cases and constraints carefully',
        'Explain why hash map is the optimal solution'
      ];
    }
    return [];
  }

  private generateBestPractices(title: string): string[] {
    if (title.toLowerCase().includes('two sum')) {
      return [
        'Use descriptive variable names (complement instead of diff)',
        'Handle edge cases at the beginning',
        'Choose appropriate data structures for the problem',
        'Write clean, readable code with proper comments'
      ];
    }
    return [];
  }

  private generateTestingScenarios(problem: LeetCodeProblem): Array<{scenario: string; input: string; expectedOutput: string; edgeCase: boolean}> {
    const scenarios = [
      {
        scenario: 'Basic Case',
        input: 'nums = [2, 7, 11, 15], target = 9',
        expectedOutput: '[0, 1]',
        edgeCase: false
      },
      {
        scenario: 'No Solution',
        input: 'nums = [1, 2, 3], target = 10',
        expectedOutput: '[]',
        edgeCase: true
      },
      {
        scenario: 'Duplicate Values',
        input: 'nums = [3, 3], target = 6',
        expectedOutput: '[0, 1]',
        edgeCase: true
      }
    ];

    return scenarios;
  }

  private generateRelatedAlgorithms(title: string): Array<{name: string; similarity: string; whenToUse: string}> {
    if (title.toLowerCase().includes('two sum')) {
      return [
        {
          name: 'Three Sum',
          similarity: 'Extension to find three numbers that sum to target',
          whenToUse: 'When you need to find triplets instead of pairs'
        },
        {
          name: 'Two Sum II',
          similarity: 'Sorted array variant with two pointers approach',
          whenToUse: 'When input array is already sorted'
        }
      ];
    }
    return [];
  }
}
