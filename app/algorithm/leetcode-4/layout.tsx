import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '寻找两个正序数组的中位数 | DSA Learning App',
  description: 'Learn this algorithm step by step...',
}

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}