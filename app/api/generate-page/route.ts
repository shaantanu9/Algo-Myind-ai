import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { LocalStorageManager } from '@/lib/local-storage-manager'

export async function POST(request: NextRequest) {
  try {
    const { algorithmData } = await request.json()

    if (!algorithmData) {
      return NextResponse.json({ error: 'No algorithm data provided.' }, { status: 400 })
    }

    const {
      algorithmName,
      problemId,
      title,
      description,
      difficulty,
      category,
      timeComplexity,
      spaceComplexity,
      examples,
      problemStatement,
      realWorldUse,
      analogy,
      keyInsights,
      realWorldApplications,
      engineeringLessons,
      implementations,
      animationStates,
      animation,
      metadata
    } = algorithmData

    // Extract metadata fields with fallbacks
    const tags = metadata?.tags || []
    const acceptanceRate = metadata?.acceptanceRate || 'N/A'
    const frequency = metadata?.frequency || 0

    // Generate the page route with proper ID format
    const routeSlug = algorithmName || `problem-${problemId}`
    const algorithmId = algorithmData.id || routeSlug // Use existing ID or generate from routeSlug
    const pagePath = path.join(process.cwd(), 'app', 'algorithm', routeSlug, 'page.tsx')
    const layoutPath = path.join(process.cwd(), 'app', 'algorithm', routeSlug, 'layout.tsx')

    // Ensure directory exists
    const dirPath = path.dirname(pagePath)
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true })
    }

    // Generate the page content
    const pageContent = generatePageContent({
      algorithmName: algorithmId, // Use consistent ID
      problemId,
      title,
      description,
      difficulty,
      category,
      timeComplexity,
      spaceComplexity,
      examples,
      problemStatement,
      realWorldUse,
      analogy,
      keyInsights,
      realWorldApplications,
      engineeringLessons,
      implementations,
      animationStates,
      animation,
      metadata,
      routeSlug
    })

    // Generate the layout content
    const layoutContent = generateLayoutContent({
      title,
      description,
      metadata
    })

    // Write the page file
    fs.writeFileSync(pagePath, pageContent)

    // Write the layout file
    fs.writeFileSync(layoutPath, layoutContent)

    // Save algorithm data to localStorage (will be available on the client side)
    try {
      // Prepare data for localStorage with consistent ID format
      const localStorageData = {
        ...algorithmData,
        id: algorithmId, // Use the consistent algorithm ID
        problemId: algorithmData.problemId || problemId,
        createdAt: algorithmData.createdAt || Date.now(),
        lastModified: Date.now()
      }

      // Note: localStorage operations happen on client side, so we just prepare the data
      // The client will handle saving to localStorage after receiving this response
      console.log(`📄 Page generated for algorithm: ${algorithmData.title}`)
    } catch (error) {
      console.warn('Failed to prepare localStorage data:', error)
    }

    return NextResponse.json({
      success: true,
      previewUrl: `/algorithm/${routeSlug}`,
      pagePath,
      layoutPath,
      algorithmData: {
        ...algorithmData,
        id: routeSlug,
        createdAt: Date.now(),
        lastModified: Date.now()
      }
    })

  } catch (error) {
    console.error('Page generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate algorithm page.' },
      { status: 500 }
    )
  }
}

function generatePageContent(data: any) {
  const {
    algorithmName,
    problemId,
    title,
    description,
    difficulty,
    category,
    timeComplexity,
    spaceComplexity,
    examples,
    problemStatement,
    realWorldUse,
    analogy,
    keyInsights,
    realWorldApplications,
    engineeringLessons,
    implementations,
    animationStates,
    animation,
    metadata,
    routeSlug
  } = data

  // Extract metadata fields with fallbacks
  const tags = metadata?.tags || []
  const acceptanceRate = metadata?.acceptanceRate || 'N/A'
  const frequency = metadata?.frequency || 0

  // Prepare algorithm data for AlgorithmDetailPage
  const algorithmData = {
    id: algorithmName,
    problemId: problemId || 0,
    title: title || 'Algorithm Title',
    description: description || 'Algorithm description',
    difficulty: difficulty || 'Medium',
    category: category || 'General',
    timeComplexity: timeComplexity || 'O(n)',
    spaceComplexity: spaceComplexity || 'O(1)',
    popularity: 75,
    estimatedTime: '15-30 min',
    realWorldUse: realWorldUse || 'General algorithm applications',
    problemStatement: problemStatement || description || 'Solve this algorithmic problem',
    examples: examples || [],
    analogy: analogy || {
      title: 'Algorithm Analogy',
      content: 'Think of this algorithm as...'
    },
    keyInsights: keyInsights || [
      'Key algorithmic insights will be generated',
      'Understanding the problem constraints is crucial',
      'Efficiency matters in algorithm design'
    ],
    realWorldApplications: realWorldApplications || [],
    engineeringLessons: engineeringLessons || [],
    implementations: implementations || {
      bruteForce: {
        title: 'Brute Force Approach',
        timeComplexity: 'O(n²)',
        spaceComplexity: 'O(1)',
        code: implementations?.bruteForce?.code || '// Brute force implementation'
      },
      optimized: {
        title: 'Optimized Solution',
        timeComplexity: timeComplexity || 'O(n)',
        spaceComplexity: spaceComplexity || 'O(1)',
        code: implementations?.optimized?.code || implementations?.bruteForce?.code || '// Optimized implementation'
      }
    },
    animationStates: animationStates || [
      {
    step: 1,
        title: 'Algorithm Overview',
        description: description || 'Understanding the algorithm',
        data: animation?.interactiveData || {}
      },
      {
    step: 2,
        title: 'Execution Steps',
        description: 'Step-by-step execution',
        data: animation?.interactiveData || {}
      },
      {
    step: 3,
        title: 'Final Result',
        description: 'Algorithm completes',
        data: animation?.interactiveData || {}
      }
    ],
    animation: animation || {
      interactiveData: {
        algorithmType: category?.toLowerCase() || 'algorithm',
        dataStructure: category || 'General',
        keyOperations: ['execution'],
        visualizationHints: 'Algorithm visualization'
      }
    },
    metadata: {
      tags: tags,
      acceptanceRate: acceptanceRate,
      frequency: frequency
    },
    lastModified: Date.now()
  }

  return `"use client"

import { AlgorithmDetailPage } from "@/components/algorithm-detail-page"

// Algorithm data for ${algorithmName}
const algorithmData = ${JSON.stringify(algorithmData, null, 2)}

export default function ${algorithmName.replace(/[^a-zA-Z0-9]/g, '')}Page() {
  return <AlgorithmDetailPage algorithm={algorithmData} />
}`
}


function generateLayoutContent(data: any) {
  const { title, description, metadata } = data
  const tags = metadata?.tags || []

  return `export const metadata = {
  title: "${title.replace(/"/g, '\\"')} - Algorithm Visualization",
  description: "${description.replace(/"/g, '\\"')}",
  keywords: ["${tags.join('", "')}", "algorithm", "visualization", "javascript"],
  openGraph: {
    title: "${title.replace(/"/g, '\\"')} - Algorithm Visualization",
    description: "${description.replace(/"/g, '\\"')}",
    type: "website",
  },
}

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}`
}

function updateAlgorithmContentLoader(algorithmData: any) {
  // This would update the AlgorithmContentLoader to include the new algorithm
  // For now, we'll just return a success
  return Promise.resolve()
}
