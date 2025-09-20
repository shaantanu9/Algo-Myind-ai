import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '蛇形矩阵 | DSA Learning App',
  description: 'Learn this algorithm step by step...',
}

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}