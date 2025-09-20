"use client"

import { useState, useEffect } from "react"
import { Search, Zap, Brain, Share2, Play, Clock, Users, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { LocalStorageManager } from "@/lib/local-storage-manager"

const FEATURED_ALGORITHMS = [
  {
    id: "two-sum",
    title: "Two Sum",
    description: "Find two numbers in an array that add up to a target sum",
    difficulty: "Easy",
    category: "Array",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    popularity: 95,
    realWorldUse: "E-commerce recommendation systems",
    animationType: "Hash Table Visualization",
    estimatedTime: "15 min",
  },
  {
    id: "binary-search",
    title: "Binary Search",
    description: "Efficiently search for a target value in a sorted array",
    difficulty: "Easy",
    category: "Search",
    timeComplexity: "O(log n)",
    spaceComplexity: "O(1)",
    popularity: 88,
    realWorldUse: "Database indexing, phone book lookup",
    animationType: "Divide & Conquer Animation",
    estimatedTime: "12 min",
  },
  {
    id: "merge-sort",
    title: "Merge Sort",
    description: "Divide and conquer sorting algorithm with guaranteed O(n log n) performance",
    difficulty: "Medium",
    category: "Sorting",
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(n)",
    popularity: 82,
    realWorldUse: "Large dataset sorting, external sorting",
    animationType: "Recursive Tree Visualization",
    estimatedTime: "25 min",
  },
  {
    id: "breadth-first-search",
    title: "Breadth-First Search (BFS)",
    description: "Explore graph nodes level by level to find shortest paths",
    difficulty: "Medium",
    category: "Graph",
    timeComplexity: "O(V + E)",
    spaceComplexity: "O(V)",
    popularity: 79,
    realWorldUse: "Social networks, GPS navigation",
    animationType: "3D Graph Traversal",
    estimatedTime: "30 min",
  },
  {
    id: "dynamic-programming-fibonacci",
    title: "Dynamic Programming: Fibonacci",
    description: "Optimize recursive solutions using memoization and tabulation",
    difficulty: "Medium",
    category: "Dynamic Programming",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    popularity: 75,
    realWorldUse: "Financial modeling, optimization problems",
    animationType: "Memoization Table Animation",
    estimatedTime: "20 min",
  },
  {
    id: "quick-sort",
    title: "Quick Sort",
    description: "Fast in-place sorting using pivot partitioning",
    difficulty: "Medium",
    category: "Sorting",
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(log n)",
    popularity: 71,
    realWorldUse: "System sorting, data processing pipelines",
    animationType: "Partition Animation",
    estimatedTime: "22 min",
  },
]

const CATEGORIES = ["All", "Array", "Search", "Sorting", "Graph", "Dynamic Programming", "Tree", "String"]
const DIFFICULTIES = ["All", "Easy", "Medium", "Hard"]

export function AlgorithmDiscovery() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedDifficulty, setSelectedDifficulty] = useState("All")
  const [algorithms, setAlgorithms] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshKey, setRefreshKey] = useState(0)

  // Load algorithms from localStorage on component mount
  useEffect(() => {
    const loadAlgorithms = () => {
      try {
        console.log('🔄 Loading algorithms for discovery page...')

        // Load default algorithms
        const defaultAlgorithms = [
          {
            id: "two-sum",
            title: "Two Sum",
            description: "Find two numbers in an array that add up to a target sum",
            difficulty: "Easy",
            category: "Array",
            timeComplexity: "O(n)",
            spaceComplexity: "O(n)",
            popularity: 95,
            realWorldUse: "E-commerce recommendation systems",
            animationType: "Hash Table Visualization",
            estimatedTime: "15 min",
            problemId: 1
          },
          {
            id: "binary-search",
            title: "Binary Search",
            description: "Efficiently search for a target value in a sorted array",
            difficulty: "Easy",
            category: "Search",
            timeComplexity: "O(log n)",
            spaceComplexity: "O(1)",
            popularity: 88,
            realWorldUse: "Database indexing, phone book lookup",
            animationType: "Divide & Conquer Animation",
            estimatedTime: "12 min",
            problemId: 704
          },
          {
            id: "merge-sort",
            title: "Merge Sort",
            description: "Divide and conquer sorting algorithm with guaranteed O(n log n) performance",
            difficulty: "Medium",
            category: "Sorting",
            timeComplexity: "O(n log n)",
            spaceComplexity: "O(n)",
            popularity: 82,
            realWorldUse: "Large dataset sorting, external sorting",
            animationType: "Recursive Tree Visualization",
            estimatedTime: "25 min",
            problemId: 912
          },
          {
            id: "breadth-first-search",
            title: "Breadth-First Search (BFS)",
            description: "Explore graph nodes level by level to find shortest paths",
            difficulty: "Medium",
            category: "Graph",
            timeComplexity: "O(V + E)",
            spaceComplexity: "O(V)",
            popularity: 79,
            realWorldUse: "Social networks, GPS navigation",
            animationType: "3D Graph Traversal",
            estimatedTime: "30 min",
            problemId: 102
          },
          {
            id: "dynamic-programming-fibonacci",
            title: "Dynamic Programming: Fibonacci",
            description: "Optimize recursive solutions using memoization and tabulation",
            difficulty: "Medium",
            category: "Dynamic Programming",
            timeComplexity: "O(n)",
            spaceComplexity: "O(n)",
            popularity: 75,
            realWorldUse: "Financial modeling, optimization problems",
            animationType: "Memoization Table Animation",
            estimatedTime: "20 min",
            problemId: 509
          },
          {
            id: "quick-sort",
            title: "Quick Sort",
            description: "Fast in-place sorting using pivot partitioning",
            difficulty: "Medium",
            category: "Sorting",
            timeComplexity: "O(n log n)",
            spaceComplexity: "O(log n)",
            popularity: 71,
            realWorldUse: "System sorting, data processing pipelines",
            animationType: "Partition Animation",
            estimatedTime: "22 min",
            problemId: 912
          }
        ]

        // Load algorithms from localStorage
        const localStorageAlgorithms = LocalStorageManager.loadAllAlgorithms()
        console.log(`📦 Found ${localStorageAlgorithms.length} algorithms in localStorage`)

        // Convert localStorage algorithms to discovery format
        const formattedLocalAlgorithms = localStorageAlgorithms.map(algo => ({
          id: algo.id,
          title: algo.title,
          description: algo.description || 'Interactive algorithm visualization',
          difficulty: algo.difficulty,
          category: algo.category,
          timeComplexity: algo.timeComplexity,
          spaceComplexity: algo.spaceComplexity,
          popularity: algo.popularity || 75,
          realWorldUse: algo.realWorldApplications?.[0]?.description || 'Various algorithmic applications',
          animationType: 'Interactive Visualization',
          estimatedTime: algo.estimatedTime || '20 min',
          problemId: algo.problemId
        }))

        // Combine and deduplicate
        const allAlgorithms = [...defaultAlgorithms]
        formattedLocalAlgorithms.forEach(localAlgo => {
          if (!allAlgorithms.some(defaultAlgo => defaultAlgo.problemId === localAlgo.problemId)) {
            allAlgorithms.push(localAlgo)
          }
        })

        console.log(`📋 Total algorithms loaded: ${allAlgorithms.length} (${defaultAlgorithms.length} default + ${formattedLocalAlgorithms.length} localStorage)`)
        setAlgorithms(allAlgorithms)
        setLoading(false)
      } catch (error) {
        console.error('Failed to load algorithms:', error)
        setLoading(false)
      }
    }

    loadAlgorithms()
  }, [refreshKey])

  // Function to refresh algorithms (can be called externally)
  const refreshAlgorithms = () => {
    console.log('🔄 Manual refresh triggered')
    setRefreshKey(prev => prev + 1)
  }

  // Expose refresh function to window for external calls
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).refreshAlgorithmDiscovery = refreshAlgorithms
    }
  }, [])

  const filteredAlgorithms = algorithms.filter((algo) => {
    const matchesSearch =
      algo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      algo.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "All" || algo.category === selectedCategory
    const matchesDifficulty = selectedDifficulty === "All" || algo.difficulty === selectedDifficulty

    return matchesSearch && matchesCategory && matchesDifficulty
  })

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

        <div className="relative max-w-2xl mx-auto mb-8">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
          <Input
            placeholder="Search algorithms... (e.g., 'binary search', 'sorting', 'graph traversal')"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 pr-4 py-6 text-lg rounded-xl border-2 focus:border-secondary transition-colors"
          />
        </div>

        <div className="flex justify-center mb-8">
          <Link href="/upload-js">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <Brain className="h-5 w-5 mr-2" />
              Upload Your Algorithm
              <span className="ml-2 text-sm opacity-90">AI-Powered Analysis</span>
            </Button>
          </Link>
        </div>

        <div className="flex flex-wrap justify-center gap-8 mb-12 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>50K+ learners</span>
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

      <div className="flex flex-wrap gap-4 mb-8 justify-center">
        <div className="flex flex-wrap gap-2">
          <span className="text-sm font-medium text-muted-foreground self-center">Category:</span>
          {CATEGORIES.map((category) => (
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
          {DIFFICULTIES.map((difficulty) => (
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

      {loading ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔄</div>
          <h3 className="text-xl font-semibold mb-2">Loading Algorithms...</h3>
          <p className="text-muted-foreground">Fetching algorithm data from localStorage</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAlgorithms.map((algorithm, index) => (
          <Card
            key={algorithm.id}
            className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fade-in-scale border-2 hover:border-secondary/20"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between mb-2">
                <Badge className={getDifficultyColor(algorithm.difficulty)}>{algorithm.difficulty}</Badge>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <TrendingUp className="h-3 w-3" />
                  {algorithm.popularity}%
                </div>
              </div>
              <CardTitle className="text-xl group-hover:text-secondary transition-colors">{algorithm.title}</CardTitle>
              <CardDescription className="text-sm leading-relaxed">{algorithm.description}</CardDescription>
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
                <div className="text-foreground mt-1">{algorithm.realWorldUse}</div>
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Play className="h-3 w-3" />
                  {algorithm.animationType}
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
      )}

      {!loading && filteredAlgorithms.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold mb-2">No algorithms found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filters to find what you're looking for.</p>
        </div>
      )}
    </div>
  )
}
