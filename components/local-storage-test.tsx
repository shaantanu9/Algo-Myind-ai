"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LocalStorageManager } from "@/lib/local-storage-manager"
import { Database, Trash2, Download, Upload, TestTube } from "lucide-react"
import { testAndSaveAlgorithmData } from "@/lib/test-algorithm-data"

interface AlgorithmData {
  id: string
  problemId: number
  title: string
  description: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  category: string
  timeComplexity: string
  spaceComplexity: string
  popularity: number
  estimatedTime: string
  realWorldUse: string
  problemStatement: string
  examples: Array<{
    input: string
    output: string
    explanation: string
  }>
  constraints: string[]
  solution: {
    javascript: string
    explanation: string
  }
  analogy?: {
    title: string
    content: string
  }
  keyInsights?: string[]
  realWorldApplications?: Array<{
    domain: string
    application: string
    description: string
  }>
  engineeringLessons?: Array<{
    principle: string
    lesson: string
    application: string
  }>
  implementations?: {
    bruteForce?: {
      title: string
      timeComplexity: string
      spaceComplexity: string
      code: string
    }
    optimized?: {
      title: string
      timeComplexity: string
      spaceComplexity: string
      code: string
    }
  }
  animationStates?: Array<{
    step: number
    title: string
    description: string
    data: any
  }>
  animation: {
    interactiveData: any
  }
  metadata: {
    tags: string[]
    acceptanceRate?: string
    frequency?: number
  }
  createdAt?: number
  lastModified?: number
}

export function LocalStorageTest() {
  const [algorithms, setAlgorithms] = useState<AlgorithmData[]>([])
  const [storageStats, setStorageStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [testResults, setTestResults] = useState<any>(null)

  useEffect(() => {
    loadData()

    // Debug: Check localStorage directly
    if (typeof window !== 'undefined') {
      console.log('🔍 Debug: Checking localStorage directly...')
      const rawData = localStorage.getItem('dsa-learning-algorithms')
      console.log('Raw localStorage data:', rawData)

      if (rawData) {
        try {
          const parsed = JSON.parse(rawData)
          console.log('Parsed localStorage data:', parsed)
          console.log('Number of algorithms in localStorage:', parsed.length)
        } catch (error) {
          console.error('Failed to parse localStorage data:', error)
        }
      } else {
        console.log('No data found in localStorage with key "dsa-learning-algorithms"')
      }
    }
  }, [])

  const loadData = () => {
    try {
      const loadedAlgorithms = LocalStorageManager.loadAllAlgorithms()
      const stats = LocalStorageManager.getStorageStats()
      setAlgorithms(loadedAlgorithms)
      setStorageStats(stats)
    } catch (error) {
      console.error('Failed to load data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleClearAll = () => {
    if (confirm('Are you sure you want to clear all stored algorithms?')) {
      LocalStorageManager.clearAllAlgorithms()
      loadData()
    }
  }

  const handleExport = () => {
    const data = LocalStorageManager.exportAlgorithms()
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'algorithms-backup.json'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleDeleteAlgorithm = (algorithmId: string) => {
    if (confirm('Are you sure you want to delete this algorithm?')) {
      LocalStorageManager.deleteAlgorithm(algorithmId)
      loadData()
    }
  }

  const handleTestAlgorithmData = () => {
    console.log('🧪 Running algorithm data tests...')
    const results = testAndSaveAlgorithmData()
    setTestResults(results)
    loadData() // Refresh data after test
  }

  const handleAddTestData = () => {
    console.log('➕ Adding test algorithm data to localStorage...')

    const testData = {
      "algorithmName": "test-algorithm",
      "problemId": 999,
      "title": "Test Algorithm",
      "description": "This is a test algorithm to verify localStorage loading",
      "difficulty": "Easy",
      "category": "Test",
      "timeComplexity": "O(1)",
      "spaceComplexity": "O(1)",
      "examples": [
        {
          "input": "test input",
          "output": "test output",
          "explanation": "Test explanation"
        }
      ],
      "constraints": ["Test constraint"],
      "solution": {
        "javascript": "console.log('test');",
        "explanation": "Test solution"
      },
      "tags": ["Test"],
      "acceptanceRate": "100%",
      "frequency": 1,
      "estimatedTime": "1 min",
      "popularity": 100,
      "id": "test-algorithm",
      "createdAt": Date.now(),
      "lastModified": Date.now()
    }

    const success = LocalStorageManager.saveAlgorithm(testData as any)
    console.log('Test data saved:', success)

    if (success) {
      loadData() // Refresh to show the new data
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading localStorage data...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Storage Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            LocalStorage Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          {storageStats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{storageStats.totalAlgorithms}</div>
                <div className="text-sm text-gray-600">Total Algorithms</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{Math.round(storageStats.totalSize / 1024)} KB</div>
                <div className="text-sm text-gray-600">Storage Used</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {storageStats.lastModified ? new Date(storageStats.lastModified).toLocaleDateString() : 'N/A'}
                </div>
                <div className="text-sm text-gray-600">Last Modified</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {algorithms.filter(a => (a.lastModified || 0) > Date.now() - 24 * 60 * 60 * 1000).length}
                </div>
                <div className="text-sm text-gray-600">Modified Today</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Actions</CardTitle>
          <CardDescription>Manage your localStorage data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 flex-wrap">
            <Button onClick={loadData} variant="outline">
              <Database className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button onClick={handleAddTestData} variant="secondary">
              <Upload className="h-4 w-4 mr-2" />
              Add Test Data
            </Button>
            <Button onClick={handleTestAlgorithmData} variant="default">
              <TestTube className="h-4 w-4 mr-2" />
              Test Algorithm Data
            </Button>
            <Button onClick={handleExport} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button onClick={handleClearAll} variant="destructive">
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All
            </Button>
          </div>
          {testResults && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2">Test Results:</h4>
              <p className="text-sm text-gray-600">
                ✅ Saved algorithms: {testResults.savedAlgorithms}<br />
                📋 Available algorithms: {testResults.availableAlgorithms}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Algorithms List */}
      <Card>
        <CardHeader>
          <CardTitle>Stored Algorithms</CardTitle>
          <CardDescription>Algorithms saved in your browser's localStorage</CardDescription>
        </CardHeader>
        <CardContent>
          {algorithms.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Database className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No algorithms stored in localStorage</p>
              <p className="text-sm">Upload an algorithm using the /upload-js page to see it here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {algorithms.map((algorithm) => (
                <div key={algorithm.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg">{algorithm.title}</h3>
                        <Badge className={
                          algorithm.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                          algorithm.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }>
                          {algorithm.difficulty}
                        </Badge>
                        <Badge variant="outline">#{algorithm.problemId}</Badge>
                      </div>

                      <p className="text-gray-600 mb-2 line-clamp-2">
                        {algorithm.description}
                      </p>

                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                        <span>Time: O({algorithm.timeComplexity})</span>
                        <span>Space: O({algorithm.spaceComplexity})</span>
                        <span>Category: {algorithm.category}</span>
                        {algorithm.createdAt && (
                          <span>
                            Created: {new Date(algorithm.createdAt).toLocaleDateString()}
                          </span>
                        )}
                        {algorithm.lastModified && (
                          <span>
                            Modified: {new Date(algorithm.lastModified).toLocaleDateString()}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-1 mb-3">
                        {algorithm.metadata.tags.map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(`/algorithm/${algorithm.id}`, '_blank')}
                      >
                        View
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteAlgorithm(algorithm.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Additional Details */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t">
                    <div>
                      <div className="text-sm font-medium">Acceptance Rate</div>
                      <div className="text-sm text-gray-600">{algorithm.metadata.acceptanceRate || 'N/A'}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium">Frequency</div>
                      <div className="text-sm text-gray-600">{algorithm.metadata.frequency || 0}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium">Popularity</div>
                      <div className="text-sm text-gray-600">{algorithm.popularity || 0}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium">Estimated Time</div>
                      <div className="text-sm text-gray-600">{algorithm.estimatedTime || 'N/A'}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recently Used */}
      {algorithms.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recently Used</CardTitle>
            <CardDescription>Your most recently accessed algorithms</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {LocalStorageManager.getRecentlyUsed(5).map((algorithm) => (
                <div key={algorithm.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <span className="font-medium">{algorithm.title}</span>
                    <span className="text-sm text-gray-500 ml-2">
                      {algorithm.lastModified ? new Date(algorithm.lastModified).toLocaleDateString() : ''}
                    </span>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open(`/algorithm/${algorithm.id}`, '_blank')}
                  >
                    Open
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
