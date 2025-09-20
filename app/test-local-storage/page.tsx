import { LocalStorageTest } from "@/components/local-storage-test"

export default function TestLocalStoragePage() {
  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          LocalStorage Test
        </h1>
        <p className="text-lg text-gray-600">
          Test and manage your locally stored algorithm data. This page shows all algorithms saved in your browser's localStorage.
        </p>
      </div>

      <LocalStorageTest />
    </div>
  )
}

export const metadata = {
  title: 'LocalStorage Test - Algorithm Data Management',
  description: 'Test and manage locally stored algorithm data',
}
