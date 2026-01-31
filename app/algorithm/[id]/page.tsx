import { AlgorithmDetailPage } from "@/components/algorithm-detail-page"
import { notFound } from "next/navigation"
import { markdownAlgorithmLoader } from "@/lib/markdown-algorithm-loader"

// Load algorithms from markdown files
const ALGORITHM_DATA = markdownAlgorithmLoader.getAlgorithmData()

interface PageProps {
  params: {
    id: string
  }
}

export default function AlgorithmPage({ params }: PageProps) {
  // Try to get algorithm from markdown data first
  let algorithm = ALGORITHM_DATA[params.id as keyof typeof ALGORITHM_DATA]

  // If not found in markdown data, try to load directly (for runtime loading)
  if (!algorithm) {
    console.log(`Algorithm ${params.id} not found in preloaded data, trying direct load...`)
    algorithm = markdownAlgorithmLoader.loadAlgorithm(params.id)

    if (!algorithm) {
      console.error(`Algorithm ${params.id} not found in markdown files`)
      notFound()
    }
  }

  return <AlgorithmDetailPage algorithm={algorithm} />
}

export function generateStaticParams() {
  return Object.keys(ALGORITHM_DATA).map((id) => ({
    id,
  }))
}
