import { AlgorithmData, AlgorithmLoadResult, AlgorithmLoaderConfig } from '@/types/algorithm';


class AlgorithmCache {
  private cache: Map<string, { data: AlgorithmData[]; timestamp: number }> = new Map();
  private cacheTimeout: number;

  constructor(cacheTimeout: number = 5 * 60 * 1000) { // 5 minutes default
    this.cacheTimeout = cacheTimeout;
  }

  get(key: string): AlgorithmData[] | null {
    const cached = this.cache.get(key);
    if (!cached) return null;

    const now = Date.now();
    if (now - cached.timestamp > this.cacheTimeout) {
      this.cache.delete(key);
      return null;
    }

    return cached.data;
  }

  set(key: string, data: AlgorithmData[]): void {
    this.cache.set(key, {
      data: [...data], // Deep copy
      timestamp: Date.now()
    });
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }
}

/**
 * Client-side algorithm loader that uses API endpoints
 * Loads algorithms from server-side API efficiently
 */
export class AlgorithmLoader {
  private cache: AlgorithmCache;
  private config: Required<AlgorithmLoaderConfig>;
  private allAlgorithms: AlgorithmData[] | null = null;
  private isLoading = false;

  constructor(config: AlgorithmLoaderConfig) {
    this.config = {
      cacheTimeout: 5 * 60 * 1000, // 5 minutes
      batchSize: 12, // Load 12 algorithms at a time
      enableCache: true,
      ...config
    };

    this.cache = new AlgorithmCache(this.config.cacheTimeout);
  }

  /**
   * Fetch data from API
   */
  private async fetchFromAPI(endpoint: string): Promise<any> {
    const response = await fetch(`/api/algorithms${endpoint}`);
    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || 'API request failed');
    }

    return data;
  }

  /**
   * Load initial batch of algorithms
   */
  async loadInitialBatch(): Promise<AlgorithmLoadResult> {
    try {
      const data = await this.fetchFromAPI('?action=batch&offset=0&limit=' + this.config.batchSize);

      return {
        algorithms: data.data,
        hasMore: data.hasMore,
        totalCount: data.total,
        loadedCount: data.loaded
      };
    } catch (error) {
      console.error('Failed to load initial batch:', error);
      throw error;
    }
  }

  /**
   * Load next batch of algorithms
   */
  async loadNextBatch(currentCount: number): Promise<AlgorithmLoadResult> {
    try {
      const data = await this.fetchFromAPI(`?action=batch&offset=${currentCount}&limit=${this.config.batchSize}`);

      return {
        algorithms: data.data,
        hasMore: data.hasMore,
        totalCount: data.total,
        loadedCount: data.loaded
      };
    } catch (error) {
      console.error('Failed to load next batch:', error);
      throw error;
    }
  }

  /**
   * Get all algorithms (for filtering/search)
   */
  async getAllAlgorithms(): Promise<AlgorithmData[]> {
    if (this.config.enableCache) {
      const cached = this.cache.get('all-algorithms');
      if (cached) {
        this.allAlgorithms = cached;
        return this.allAlgorithms;
      }
    }

    if (!this.allAlgorithms) {
      try {
        const data = await this.fetchFromAPI('?action=all');
        this.allAlgorithms = data.data;

        if (this.config.enableCache) {
          this.cache.set('all-algorithms', this.allAlgorithms);
        }
      } catch (error) {
        console.error('Failed to load all algorithms:', error);
        throw error;
      }
    }

    return this.allAlgorithms;
  }

  /**
   * Search algorithms by query
   */
  async searchAlgorithms(query: string): Promise<AlgorithmData[]> {
    try {
      const data = await this.fetchFromAPI(`?action=search&q=${encodeURIComponent(query)}`);
      return data.data;
    } catch (error) {
      console.error('Failed to search algorithms:', error);
      return [];
    }
  }

  /**
   * Filter algorithms by criteria
   */
  async filterAlgorithms(filters: {
    category?: string;
    difficulty?: string;
    minPopularity?: number;
    maxTimeComplexity?: string;
  }): Promise<AlgorithmData[]> {
    const allAlgorithms = await this.getAllAlgorithms();

    return allAlgorithms.filter(algorithm => {
      if (filters.category && filters.category !== 'All' && algorithm.category !== filters.category) {
        return false;
      }

      if (filters.difficulty && filters.difficulty !== 'All' && algorithm.difficulty !== filters.difficulty) {
        return false;
      }

      if (filters.minPopularity && algorithm.popularity < filters.minPopularity) {
        return false;
      }

      if (filters.maxTimeComplexity && this.compareComplexity(algorithm.timeComplexity, filters.maxTimeComplexity) > 0) {
        return false;
      }

      return true;
    });
  }

  /**
   * Get algorithm by ID
   */
  async getAlgorithmById(id: string): Promise<AlgorithmData | null> {
    const allAlgorithms = await this.getAllAlgorithms();
    return allAlgorithms.find(algorithm => algorithm.id === id) || null;
  }

  /**
   * Get algorithms by category
   */
  async getAlgorithmsByCategory(category: string): Promise<AlgorithmData[]> {
    const allAlgorithms = await this.getAllAlgorithms();
    return allAlgorithms.filter(algorithm => algorithm.category === category);
  }

  /**
   * Get algorithms by difficulty
   */
  async getAlgorithmsByDifficulty(difficulty: string): Promise<AlgorithmData[]> {
    const allAlgorithms = await this.getAllAlgorithms();
    return allAlgorithms.filter(algorithm => algorithm.difficulty === difficulty);
  }

  /**
   * Refresh cache and reload algorithms
   */
  async refresh(): Promise<void> {
    this.cache.clear();
    this.allAlgorithms = null;
    // Force reload by fetching again
    await this.getAllAlgorithms();
  }

  /**
   * Get cache statistics
   */
  getCacheStats() {
    return {
      cacheSize: this.cache.size(),
      isLoaded: this.allAlgorithms !== null,
      totalAlgorithms: this.allAlgorithms?.length || 0,
      config: this.config
    };
  }

  /**
   * Compare time complexities (simple heuristic)
   * Returns -1 if a < b, 0 if equal, 1 if a > b
   */
  private compareComplexity(a: string, b: string): number {
    const complexityOrder = {
      'O(1)': 1,
      'O(log n)': 2,
      'O(n)': 3,
      'O(n log n)': 4,
      'O(n²)': 5,
      'O(n³)': 6,
      'O(2^n)': 7,
      'O(n!)': 8
    };

    const aOrder = complexityOrder[a as keyof typeof complexityOrder] || 99;
    const bOrder = complexityOrder[b as keyof typeof complexityOrder] || 99;

    return aOrder - bOrder;
  }
}

// Singleton instance for global use
let globalLoader: AlgorithmLoader | null = null;

/**
 * Get the global algorithm loader instance
 */
export function getAlgorithmLoader(config?: AlgorithmLoaderConfig): AlgorithmLoader {
  if (!globalLoader) {
    const defaultConfig: AlgorithmLoaderConfig = {
      ...config
    };
    globalLoader = new AlgorithmLoader(defaultConfig);
  }

  return globalLoader;
}

/**
 * Initialize algorithm loader with custom config
 */
export function initializeAlgorithmLoader(config: AlgorithmLoaderConfig): AlgorithmLoader {
  globalLoader = new AlgorithmLoader(config);
  return globalLoader;
}

/**
 * Hook for using algorithm loader in React components
 */
export function useAlgorithmLoader(config?: AlgorithmLoaderConfig) {
  const loader = getAlgorithmLoader(config);

  return {
    loader,
    loadInitialBatch: loader.loadInitialBatch.bind(loader),
    loadNextBatch: loader.loadNextBatch.bind(loader),
    getAllAlgorithms: loader.getAllAlgorithms.bind(loader),
    searchAlgorithms: loader.searchAlgorithms.bind(loader),
    filterAlgorithms: loader.filterAlgorithms.bind(loader),
    getAlgorithmById: loader.getAlgorithmById.bind(loader),
    getAlgorithmsByCategory: loader.getAlgorithmsByCategory.bind(loader),
    getAlgorithmsByDifficulty: loader.getAlgorithmsByDifficulty.bind(loader),
    refresh: loader.refresh.bind(loader),
    getCacheStats: loader.getCacheStats.bind(loader)
  };
}
