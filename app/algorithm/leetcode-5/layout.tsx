import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '最长回文串 | DSA Learning App',
  description: 'Learn this algorithm step by step...',
}

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}