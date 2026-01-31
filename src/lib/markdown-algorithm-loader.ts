import { MarkdownAlgorithmParser, Algorithm } from './markdown-algorithm-parser';
import { enhanceAlgorithmData } from '../../lib/enhanced-markdown-parser';
import path from 'path';
import fs from 'fs';

export class MarkdownAlgorithmLoader {
  private algorithmsDir: string;
  private cache: Map<string, Algorithm> = new Map();

  constructor(algorithmsDir = './src/algorithms') {
    this.algorithmsDir = path.resolve(algorithmsDir);
  }

  /**
   * Load a single algorithm by ID from markdown file
   */
  loadAlgorithm(id: string): Algorithm | null {
    try {
      // Check cache first
      if (this.cache.has(id)) {
        return this.cache.get(id)!;
      }

      const filePath = path.join(this.algorithmsDir, `${id}.md`);

      if (!fs.existsSync(filePath)) {
        console.warn(`Algorithm file not found: ${filePath}`);
        return null;
      }

      let algorithm = MarkdownAlgorithmParser.fromFile(filePath);

      // Enhance with better code and animation extraction
      algorithm = enhanceAlgorithmData(algorithm, filePath);

      // Cache the result
      this.cache.set(id, algorithm);

      return algorithm;
    } catch (error) {
      console.error(`Failed to load algorithm ${id}:`, error);
      return null;
    }
  }

  /**
   * Load all algorithms from the algorithms directory
   */
  loadAllAlgorithms(): Algorithm[] {
    try {
      console.log(`🔍 Scanning algorithms directory: ${this.algorithmsDir}`);

      if (!fs.existsSync(this.algorithmsDir)) {
        console.warn(`❌ Algorithms directory not found: ${this.algorithmsDir}`);
        return [];
      }

      const files = fs.readdirSync(this.algorithmsDir);
      console.log(`📁 Found ${files.length} files in algorithms directory:`, files);

      const algorithms: Algorithm[] = [];
      const mdFiles = files.filter(file => file.endsWith('.md'));

      console.log(`📄 Found ${mdFiles.length} markdown files:`, mdFiles);

      mdFiles.forEach(file => {
        try {
          const id = file.replace('.md', '');
          console.log(`🔄 Loading algorithm: ${id} from ${file}`);
          const algorithm = this.loadAlgorithm(id);
          if (algorithm) {
            algorithms.push(algorithm);
            console.log(`✅ Successfully loaded algorithm: ${algorithm.id}`);
          } else {
            console.warn(`⚠️  Failed to load algorithm: ${id} (returned null)`);
          }
        } catch (error) {
          console.warn(`❌ Failed to load algorithm from ${file}:`, error);
        }
      });

      console.log(`📊 Successfully loaded ${algorithms.length} algorithms`);
      return algorithms;
    } catch (error) {
      console.error('❌ Failed to load algorithms:', error);
      return [];
    }
  }

  /**
   * Get algorithm data in the format expected by the app
   */
  getAlgorithmData(): Record<string, Algorithm> {
    try {
      console.log('🔍 Loading algorithm data from markdown files...');
      const algorithms = this.loadAllAlgorithms();
      console.log(`✅ Loaded ${algorithms.length} algorithms from markdown files`);

      const data: Record<string, Algorithm> = {};

      algorithms.forEach(algo => {
        if (algo && algo.id) {
          data[algo.id] = algo;
          console.log(`📄 Loaded algorithm: ${algo.id} - ${algo.title}`);
          console.log(`   📖 Analogy: ${algo.analogy ? 'Yes' : 'No'}`);
          console.log(`   🏢 Applications: ${algo.realWorldApplications?.length || 0}`);
          console.log(`   🔧 Engineering Lessons: ${algo.engineeringLessons?.length || 0}`);
        } else {
          console.warn('⚠️  Skipping algorithm with missing id or data');
        }
      });

      console.log(`📊 Total algorithms available: ${Object.keys(data).length}`);
      return data;
    } catch (error) {
      console.error('❌ Failed to load algorithm data:', error);
      return {};
    }
  }

  /**
   * Clear the cache
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Check if an algorithm exists
   */
  hasAlgorithm(id: string): boolean {
    const filePath = path.join(this.algorithmsDir, `${id}.md`);
    return fs.existsSync(filePath);
  }
}

// Export a singleton instance
export const markdownAlgorithmLoader = new MarkdownAlgorithmLoader();
