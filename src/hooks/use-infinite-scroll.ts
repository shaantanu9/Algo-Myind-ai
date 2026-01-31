import { useState, useEffect, useCallback, useRef, useMemo } from 'react';

export interface InfiniteScrollOptions<T> {
  items: T[];
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
  loadMoreThreshold?: number;
  onLoadMore?: () => Promise<void>;
  hasMore?: boolean;
  loading?: boolean;
}

export interface VirtualItem {
  index: number;
  start: number;
  end: number;
  visible: boolean;
}

export interface InfiniteScrollResult<T> {
  virtualItems: VirtualItem[];
  totalHeight: number;
  scrollElementRef: React.RefObject<HTMLDivElement>;
  isLoading: boolean;
  hasMore: boolean;
  loadMore: () => Promise<void>;
}

/**
 * Custom hook for performant infinite scrolling with virtualization
 * Handles large lists efficiently by only rendering visible items
 */
export function useInfiniteScroll<T>({
  items,
  itemHeight,
  containerHeight,
  overscan = 5,
  loadMoreThreshold = 200,
  onLoadMore,
  hasMore = false,
  loading = false
}: InfiniteScrollOptions<T>): InfiniteScrollResult<T> {
  const [scrollTop, setScrollTop] = useState(0);
  const [isLoading, setIsLoading] = useState(loading);
  const scrollElementRef = useRef<HTMLDivElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef(false);

  // Calculate virtual items based on scroll position
  const virtualItems = useMemo(() => {
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const endIndex = Math.min(
      items.length - 1,
      Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
    );

    const virtualItems: VirtualItem[] = [];

    for (let i = startIndex; i <= endIndex; i++) {
      virtualItems.push({
        index: i,
        start: i * itemHeight,
        end: (i + 1) * itemHeight,
        visible: i >= startIndex && i <= endIndex
      });
    }

    return virtualItems;
  }, [items.length, scrollTop, itemHeight, containerHeight, overscan]);

  // Total height of all items
  const totalHeight = useMemo(() => items.length * itemHeight, [items.length, itemHeight]);

  // Handle scroll events
  const handleScroll = useCallback((event: Event) => {
    const target = event.target as HTMLDivElement;
    setScrollTop(target.scrollTop);
  }, []);

  // Load more items when approaching the end
  const loadMore = useCallback(async () => {
    if (loadingRef.current || !onLoadMore || !hasMore || isLoading) {
      return;
    }

    loadingRef.current = true;
    setIsLoading(true);

    try {
      await onLoadMore();
    } catch (error) {
      console.error('Error loading more items:', error);
    } finally {
      setIsLoading(false);
      loadingRef.current = false;
    }
  }, [onLoadMore, hasMore, isLoading]);

  // Intersection observer for load more trigger
  useEffect(() => {
    if (!loadMoreRef.current || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !isLoading) {
          loadMore();
        }
      },
      {
        root: scrollElementRef.current,
        rootMargin: `${loadMoreThreshold}px`,
        threshold: 0.1
      }
    );

    observer.observe(loadMoreRef.current);

    return () => observer.disconnect();
  }, [hasMore, isLoading, loadMore, loadMoreThreshold]);

  // Set up scroll event listener
  useEffect(() => {
    const scrollElement = scrollElementRef.current;
    if (!scrollElement) return;

    scrollElement.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      scrollElement.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  // Update loading state when prop changes
  useEffect(() => {
    setIsLoading(loading);
  }, [loading]);

  return {
    virtualItems,
    totalHeight,
    scrollElementRef,
    isLoading,
    hasMore,
    loadMore
  };
}

/**
 * Hook for intersection observer-based infinite scroll
 * Simpler version without virtualization for smaller lists
 */
export function useIntersectionInfiniteScroll<T>({
  hasMore = false,
  loading = false,
  onLoadMore,
  threshold = 0.1,
  rootMargin = '100px'
}: {
  hasMore?: boolean;
  loading?: boolean;
  onLoadMore?: () => Promise<void>;
  threshold?: number;
  rootMargin?: string;
}) {
  const [isLoading, setIsLoading] = useState(loading);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef(false);

  const loadMore = useCallback(async () => {
    if (loadingRef.current || !onLoadMore || !hasMore || isLoading) {
      return;
    }

    loadingRef.current = true;
    setIsLoading(true);

    try {
      await onLoadMore();
    } catch (error) {
      console.error('Error loading more items:', error);
    } finally {
      setIsLoading(false);
      loadingRef.current = false;
    }
  }, [onLoadMore, hasMore, isLoading]);

  useEffect(() => {
    if (!loadMoreRef.current || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !isLoading) {
          loadMore();
        }
      },
      {
        rootMargin,
        threshold
      }
    );

    observer.observe(loadMoreRef.current);

    return () => observer.disconnect();
  }, [hasMore, isLoading, loadMore, rootMargin, threshold]);

  useEffect(() => {
    setIsLoading(loading);
  }, [loading]);

  return {
    loadMoreRef,
    isLoading,
    hasMore,
    loadMore
  };
}

/**
 * Hook for debounced search/filter functionality
 */
export function useDebouncedValue<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Hook for managing algorithm filtering and search
 */
export function useAlgorithmFilters<T extends { title: string; description: string; difficulty: string; category: string }>(
  items: T[],
  initialFilters: {
    searchQuery?: string;
    category?: string;
    difficulty?: string;
  } = {}
) {
  const [searchQuery, setSearchQuery] = useState(initialFilters.searchQuery || '');
  const [selectedCategory, setSelectedCategory] = useState(initialFilters.category || 'All');
  const [selectedDifficulty, setSelectedDifficulty] = useState(initialFilters.difficulty || 'All');

  const debouncedSearchQuery = useDebouncedValue(searchQuery, 300);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(debouncedSearchQuery.toLowerCase());

      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      const matchesDifficulty = selectedDifficulty === 'All' || item.difficulty === selectedDifficulty;

      return matchesSearch && matchesCategory && matchesDifficulty;
    });
  }, [items, debouncedSearchQuery, selectedCategory, selectedDifficulty]);

  const categories = useMemo(() => {
    const cats = new Set(items.map(item => item.category));
    return ['All', ...Array.from(cats).sort()];
  }, [items]);

  const difficulties = useMemo(() => {
    const diffs = new Set(items.map(item => item.difficulty));
    return ['All', ...Array.from(diffs).sort()];
  }, [items]);

  return {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedDifficulty,
    setSelectedDifficulty,
    filteredItems,
    categories,
    difficulties,
    isSearching: searchQuery !== debouncedSearchQuery
  };
}
