import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Foobi - AI動画生成プラットフォーム',
  description: 'Foobiの最先端AI技術で、あなたのビジョンを一瞬で世界に届ける動画へと昇華させます。プロ品質の広告動画を、誰でも簡単に。',
  keywords: ['AI', '動画生成', '広告', 'Foobi', 'Novan'],
  authors: [{ name: 'Novan' }],
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <h1>testtest</h1>
      <body>{children}</body>
    </html>
  )
}