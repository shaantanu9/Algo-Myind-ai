"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Upload,
  FileText,
  Code,
  Brain,
  CheckCircle,
  AlertCircle,
  Loader2,
  Sparkles,
  Zap,
  Eye,
  PlayCircle
} from "lucide-react"
import { useRouter } from "next/navigation"
import { LocalStorageManager } from "@/lib/local-storage-manager"

interface AnalysisResult {
  algorithmName: string
  problemId: number
  title: string
  description: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  category: string
  timeComplexity: string
  spaceComplexity: string
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
  animationData: any
  tags: string[]
  acceptanceRate?: string
  frequency?: number
}

export default function UploadJSPage() {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile) {
      if (selectedFile.type !== 'text/javascript' && !selectedFile.name.endsWith('.js')) {
        setError('Please select a JavaScript (.js) file')
        return
      }
      setFile(selectedFile)
      setError(null)
      setAnalysisResult(null)
      setPreviewUrl(null)
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setUploading(true)
    setAnalyzing(true)
    setProgress(0)
    setError(null)

    try {
      // Step 1: Upload file
      setProgress(20)
      const formData = new FormData()
      formData.append('file', file)

      const uploadResponse = await fetch('/api/upload-js', {
        method: 'POST',
        body: formData,
      })

      if (!uploadResponse.ok) {
        throw new Error('Upload failed')
      }

      const uploadResult = await uploadResponse.json()
      setProgress(50)

      // Step 2: Analyze with AI
      const analysisResponse = await fetch('/api/analyze-js', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileName: file.name,
          fileContent: uploadResult.content,
          filePath: uploadResult.filePath,
        }),
      })

      if (!analysisResponse.ok) {
        throw new Error('AI analysis failed')
      }

      const analysisData = await analysisResponse.json()
      setProgress(80)

      // Step 3: Generate page
      const pageResponse = await fetch('/api/generate-page', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          algorithmData: analysisData,
        }),
      })

      if (!pageResponse.ok) {
        throw new Error('Page generation failed')
      }

      const pageResult = await pageResponse.json()
      setProgress(100)
      setAnalysisResult(analysisData)
      setPreviewUrl(pageResult.previewUrl)

      // Save algorithm data to localStorage for persistence
      try {
        const localStorageData = pageResult.algorithmData
        const saved = LocalStorageManager.saveAlgorithm(localStorageData)
        if (saved) {
          console.log('💾 Algorithm saved to localStorage:', localStorageData.title)

          // Refresh algorithm discovery page if function is available
          if (typeof window !== 'undefined' && (window as any).refreshAlgorithmDiscovery) {
            console.log('🔄 Triggering algorithm discovery refresh...')
            ;(window as any).refreshAlgorithmDiscovery()
          }
        } else {
          console.warn('Failed to save to localStorage')
        }
      } catch (error) {
        console.warn('Failed to save to localStorage:', error)
      }

      // Don't navigate automatically - let user choose to view the page
      setPreviewUrl(pageResult.previewUrl)

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
      console.error('Upload error:', err)
    } finally {
      setUploading(false)
      setAnalyzing(false)
    }
  }

  const handleViewPage = () => {
    if (previewUrl) {
      router.push(previewUrl)
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          🚀 Upload JavaScript Algorithm
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          Upload any LeetCode-style JavaScript solution file and our AI will automatically create a complete
          interactive visualization page with animations, explanations, and step-by-step breakdowns.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upload Section */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                File Upload
              </CardTitle>
              <CardDescription>
                Select a JavaScript file containing your algorithm solution
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".js,.javascript"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <div className="space-y-4">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto" />
                  <div>
                    <p className="text-sm text-gray-600 mb-2">
                      {file ? file.name : 'Click to browse or drag and drop'}
                    </p>
                    <p className="text-xs text-gray-500">
                      Supports .js files (max 10MB)
                    </p>
                  </div>
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    variant="outline"
                    className="mt-4"
                  >
                    Choose File
                  </Button>
                </div>
              </div>

              {file && (
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Code className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium">{file.name}</p>
                      <p className="text-sm text-gray-500">
                        {(file.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={handleUpload}
                    disabled={uploading}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Brain className="h-4 w-4 mr-2" />
                        Analyze with AI
                      </>
                    )}
                  </Button>
                </div>
              )}

              {(uploading || analyzing) && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                  <p className="text-sm text-gray-600">
                    {analyzing ? '🤖 AI is analyzing your code...' : '📤 Uploading file...'}
                  </p>
                </div>
              )}

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* How it works */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                How It Works
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-sm font-bold text-blue-600">
                    1
                  </div>
                  <div>
                    <h4 className="font-medium">Upload JavaScript File</h4>
                    <p className="text-sm text-gray-600">
                      Upload any LeetCode-style algorithm solution
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-sm font-bold text-green-600">
                    2
                  </div>
                  <div>
                    <h4 className="font-medium">AI Analysis</h4>
                    <p className="text-sm text-gray-600">
                      Our AI analyzes the code structure, complexity, and patterns
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-sm font-bold text-purple-600">
                    3
                  </div>
                  <div>
                    <h4 className="font-medium">Generate Animations</h4>
                    <p className="text-sm text-gray-600">
                      Automatically creates interactive visualizations and animations
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-sm font-bold text-orange-600">
                    4
                  </div>
                  <div>
                    <h4 className="font-medium">Complete Page</h4>
                    <p className="text-sm text-gray-600">
                      Get a fully functional algorithm learning page with explanations
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          {analysisResult && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Analysis Complete
                </CardTitle>
                <CardDescription>
                  AI has successfully analyzed your algorithm
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="code">Code</TabsTrigger>
                    <TabsTrigger value="preview">Preview</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-4">
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-semibold text-lg">{analysisResult.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          {analysisResult.description}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Badge variant={
                          analysisResult.difficulty === 'Easy' ? 'default' :
                          analysisResult.difficulty === 'Medium' ? 'secondary' : 'destructive'
                        }>
                          {analysisResult.difficulty}
                        </Badge>
                        <Badge variant="outline">{analysisResult.category}</Badge>
                        <Badge variant="outline">O({analysisResult.timeComplexity})</Badge>
                        <Badge variant="outline">O({analysisResult.spaceComplexity})</Badge>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {analysisResult.tags.map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="code" className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Solution</h4>
                      <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
                        <code>{analysisResult.solution.javascript}</code>
                      </pre>
                      <p className="text-sm text-gray-600 mt-2">
                        {analysisResult.solution.explanation}
                      </p>
                    </div>
                  </TabsContent>

                  <TabsContent value="preview" className="space-y-4">
                    <div className="text-center space-y-4">
                      <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg">
                        <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                        <h4 className="font-semibold text-lg mb-2">Page Generated Successfully!</h4>
                        <p className="text-gray-600 mb-4">
                          Your algorithm page is ready with interactive animations and detailed explanations.
                        </p>
                        {previewUrl && (
                          <Button onClick={handleViewPage} className="bg-gradient-to-r from-green-600 to-blue-600">
                            <Eye className="h-4 w-4 mr-2" />
                            View Algorithm Page
                          </Button>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <PlayCircle className="h-5 w-5 text-blue-600" />
                            <span className="font-medium">Animations</span>
                          </div>
                          <p className="text-sm text-gray-600">
                            Interactive step-by-step visualizations
                          </p>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <Zap className="h-5 w-5 text-purple-600" />
                            <span className="font-medium">AI Analysis</span>
                          </div>
                          <p className="text-sm text-gray-600">
                            Comprehensive code analysis and explanations
                          </p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}

          {!analysisResult && !uploading && !analyzing && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-purple-600" />
                  AI-Powered Analysis
                </CardTitle>
                <CardDescription>
                  What our AI will create for you
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm">Problem statement extraction</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Algorithm complexity analysis</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-sm">Interactive animation generation</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span className="text-sm">Step-by-step code explanations</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-sm">Educational content creation</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
