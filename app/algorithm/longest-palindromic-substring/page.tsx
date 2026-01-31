import { AlgorithmDetailPage } from "@/components/algorithm-detail-page"
import { notFound } from "next/navigation"
import { markdownAlgorithmLoader } from "@/lib/markdown-algorithm-loader"

export default function Page() {
  const algorithm = markdownAlgorithmLoader.loadAlgorithm("longest-palindromic-substring")
  
  if (!algorithm) {
    notFound()
  }

  return <AlgorithmDetailPage algorithm={algorithm} />
}
