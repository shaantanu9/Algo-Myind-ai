"use client"

import { useState, useEffect, useCallback } from "react"
import { Search, Zap, Brain, Share2, Play, Clock, Users, TrendingUp, Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useAlgorithmLoader } from "@/lib/algorithm-loader"
import { useAlgorithmFilters, useIntersectionInfiniteScroll } from "@/hooks/use-infinite-scroll"
import { AlgorithmData } from "@/types/algorithm"

export function AlgorithmDiscovery() {
  // State for infinite scroll
  const [displayedAlgorithms, setDisplayedAlgorithms] = useState<AlgorithmData[]>([])
  const [allAlgorithms, setAllAlgorithms] = useState<AlgorithmData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Algorithm loader hook
  const { loader } = useAlgorithmLoader({
    algorithmsDir: './src/algorithms'
  })

  // Filter hooks
  const {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedDifficulty,
    setSelectedDifficulty,
    filteredItems,
    categories,
    difficulties,
    isSearching
  } = useAlgorithmFilters(allAlgorithms, {
    searchQuery: '',
    category: 'All',
    difficulty: 'All'
  })

  // Infinite scroll hook
  const {
    loadMoreRef,
    isLoading: infiniteLoading,
    hasMore,
    loadMore
  } = useIntersectionInfiniteScroll({
    hasMore: displayedAlgorithms.length < filteredItems.length,
    loading: false, // We'll manage loading state separately
    onLoadMore: async () => {
      const nextBatch = await loader.loadNextBatch(displayedAlgorithms.length)
      setDisplayedAlgorithms(prev => [...prev, ...nextBatch.algorithms])
    },
    rootMargin: '200px'
  })

  // Load initial algorithms
  const loadInitialAlgorithms = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      // Load all algorithms for filtering
      const allAlgorithmsData = await loader.getAllAlgorithms()
      setAllAlgorithms(allAlgorithmsData)

      // Load initial batch for display
      const initialBatch = await loader.loadInitialBatch()
      setDisplayedAlgorithms(initialBatch.algorithms)

      console.log(`✅ Loaded ${initialBatch.algorithms.length} algorithms (${allAlgorithmsData.length} total)`)
    } catch (err) {
      console.error('Failed to load algorithms:', err)
      setError('Failed to load algorithms. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [loader])

  // Initial load
  useEffect(() => {
    loadInitialAlgorithms()
  }, [loadInitialAlgorithms])

  // Update displayed algorithms when filters change
  useEffect(() => {
    if (!isSearching && filteredItems.length > 0) {
      // Reset to first batch when filters change
      const batchSize = 12 // Same as loader config
      const initialBatch = filteredItems.slice(0, batchSize)
      setDisplayedAlgorithms(initialBatch)
    }
  }, [filteredItems, isSearching])

  // Refresh function
  const refreshAlgorithms = useCallback(async () => {
    console.log('🔄 Refreshing algorithms...')
    await loader.refresh()
    await loadInitialAlgorithms()
  }, [loader, loadInitialAlgorithms])

  // Expose refresh function to window for external calls
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).refreshAlgorithmDiscovery = refreshAlgorithms
    }
  }, [refreshAlgorithms])

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "Medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "Hard":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header Section */}
      <div className="text-center mb-12 animate-slide-in-up">
        <h1 className="text-4xl md:text-6xl font-bold text-balance mb-6">
          Master <span className="text-secondary">Algorithms</span> with
          <br />
          Interactive Animations
        </h1>
        <p className="text-xl text-muted-foreground text-pretty max-w-3xl mx-auto mb-8">
          Learn Data Structures and Algorithms through AI-powered explanations, real-world analogies, and shareable
          visualizations that make complex concepts simple.
        </p>

        {/* Search Bar */}
        <div className="relative max-w-2xl mx-auto mb-8">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
          <Input
            placeholder="Search algorithms... (e.g., 'binary search', 'sorting', 'graph traversal')"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 pr-4 py-6 text-lg rounded-xl border-2 focus:border-secondary transition-colors"
          />
          {isSearching && (
            <Loader2 className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5 animate-spin" />
          )}
        </div>

        {/* Upload Button */}
        <div className="flex justify-center mb-8">
          <Link href="/upload-js">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <Brain className="h-5 w-5 mr-2" />
              Upload Your Algorithm
              <span className="ml-2 text-sm opacity-90">AI-Powered Analysis</span>
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-8 mb-12 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>{allAlgorithms.length}+ algorithms</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            <span>Interactive animations</span>
          </div>
          <div className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            <span>AI explanations</span>
          </div>
          <div className="flex items-center gap-2">
            <Share2 className="h-4 w-4" />
            <span>Viral sharing</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-8 justify-center">
        <div className="flex flex-wrap gap-2">
          <span className="text-sm font-medium text-muted-foreground self-center">Category:</span>
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "secondary" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="rounded-full"
            >
              {category}
            </Button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="text-sm font-medium text-muted-foreground self-center">Difficulty:</span>
          {difficulties.map((difficulty) => (
            <Button
              key={difficulty}
              variant={selectedDifficulty === difficulty ? "secondary" : "outline"}
              size="sm"
              onClick={() => setSelectedDifficulty(difficulty)}
              className="rounded-full"
            >
              {difficulty}
            </Button>
          ))}
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="text-center py-12">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2 text-red-700">Error Loading Algorithms</h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={refreshAlgorithms} variant="outline">
            Try Again
          </Button>
        </div>
      )}

      {/* Loading State */}
      {loading && !error && (
        <div className="text-center py-12">
          <Loader2 className="h-16 w-16 animate-spin text-secondary mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Loading Algorithms...</h3>
          <p className="text-muted-foreground">Reading algorithm data from markdown files</p>
        </div>
      )}

      {/* Algorithm Grid */}
      {!loading && !error && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {displayedAlgorithms.map((algorithm, index) => (
              <Card
                key={algorithm.id}
                className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fade-in-scale border-2 hover:border-secondary/20"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between mb-2">
                    <Badge className={getDifficultyColor(algorithm.difficulty)}>
                      {algorithm.difficulty}
                    </Badge>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <TrendingUp className="h-3 w-3" />
                      {algorithm.popularity}%
                    </div>
                  </div>
                  <CardTitle className="text-xl group-hover:text-secondary transition-colors line-clamp-2">
                    {algorithm.title}
                  </CardTitle>
                  <CardDescription className="text-sm leading-relaxed line-clamp-3">
                    {algorithm.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="font-medium text-muted-foreground">Time:</span>
                      <div className="font-mono text-secondary">{algorithm.timeComplexity}</div>
                    </div>
                    <div>
                      <span className="font-medium text-muted-foreground">Space:</span>
                      <div className="font-mono text-secondary">{algorithm.spaceComplexity}</div>
                    </div>
                  </div>

                  <div className="text-xs">
                    <span className="font-medium text-muted-foreground">Real-world use:</span>
                    <div className="text-foreground mt-1 line-clamp-2">{algorithm.realWorldUse}</div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Play className="h-3 w-3" />
                      <span className="truncate">Interactive</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {algorithm.estimatedTime}
                    </div>
                  </div>

                  <Link href={`/algorithm/${algorithm.id}`}>
                    <Button className="w-full group-hover:bg-secondary group-hover:text-secondary-foreground transition-colors">
                      Start Learning
                      <Play className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Infinite Scroll Trigger */}
          {hasMore && (
            <div ref={loadMoreRef} className="flex justify-center py-8">
              {infiniteLoading ? (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Loading more algorithms...</span>
                </div>
              ) : (
                <Button
                  variant="outline"
                  onClick={loadMore}
                  className="rounded-full"
                >
                  Load More Algorithms
                </Button>
              )}
            </div>
          )}

          {/* No Results */}
          {!loading && displayedAlgorithms.length === 0 && filteredItems.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-2">No algorithms found</h3>
              <p className="text-muted-foreground">
                {searchQuery || selectedCategory !== 'All' || selectedDifficulty !== 'All'
                  ? "Try adjusting your search or filters to find what you're looking for."
                  : "No algorithms available. Add some markdown files to the algorithms directory."}
              </p>
              {(searchQuery || selectedCategory !== 'All' || selectedDifficulty !== 'All') && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery('')
                    setSelectedCategory('All')
                    setSelectedDifficulty('All')
                  }}
                  className="mt-4"
                >
                  Clear Filters
                </Button>
              )}
            </div>
          )}

          {/* Results Info */}
          {displayedAlgorithms.length > 0 && (
            <div className="text-center text-sm text-muted-foreground mt-8">
              Showing {displayedAlgorithms.length} of {filteredItems.length} algorithms
              {hasMore && ` (${filteredItems.length - displayedAlgorithms.length} more available)`}
            </div>
          )}
        </>
      )}
    </div>
  )
}
