import dynamic from 'next/dynamic'

const AlgorithmDiscovery = dynamic(
  () => import('@/components/algorithm-discovery').then(mod => ({ default: mod.AlgorithmDiscovery })),
  {
    ssr: false,
    loading: () => (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-secondary mx-auto mb-4"></div>
          <h3 className="text-xl font-semibold mb-2">Loading Algorithms...</h3>
          <p className="text-muted-foreground">Preparing interactive content</p>
        </div>
      </div>
    )
  }
)

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <AlgorithmDiscovery />
    </main>
  )
}
