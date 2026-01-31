import { AlgorithmDetailPage } from "@/components/algorithm-detail-page"
import { notFound } from "next/navigation"
import { markdownAlgorithmLoader } from "@/lib/markdown-algorithm-loader"

export default function Page() {
  const algorithm = markdownAlgorithmLoader.loadAlgorithm("leetcode-9")
  
  if (!algorithm) {
    notFound()
  }

  return <AlgorithmDetailPage algorithm={algorithm} />
}
