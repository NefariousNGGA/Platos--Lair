import { NextRequest, NextResponse } from 'next/server'
import RSS from 'rss'
import { prisma } from '../../lib/prisma'

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const baseUrl = url.origin

  const feed = new RSS({
    title: 'Minimalist Blog',
    description: 'A clean, minimalist blog platform',
    feed_url: `${baseUrl}/api/feed`,
    site_url: baseUrl,
    language: 'en',
    pubDate: new Date(),
  })

  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { publishedAt: 'desc' },
    take: 20,
  })

  posts.forEach(post => {
    feed.item({
      title: post.title,
      description: post.excerpt || '',
      url: `${baseUrl}/posts/${post.slug}`,
      guid: post.id,
      date: post.publishedAt || post.createdAt,
    })
  })

  return new NextResponse(feed.xml({ indent: true }), {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, s-maxage=3600',
    },
  })
}