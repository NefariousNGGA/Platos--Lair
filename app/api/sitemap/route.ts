import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const baseUrl = url.origin

  const [posts, tags] = await Promise.all([
    prisma.post.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true }
    }),
    prisma.tag.findMany({
      select: { slug: true, updatedAt: true }
    })
  ])

  const urls = [
    { loc: '/', priority: 1.0 },
    { loc: '/about', priority: 0.8 },
    { loc: '/archive', priority: 0.7 },
    { loc: '/stats', priority: 0.7 },
    ...posts.map(post => ({
      loc: `/posts/${post.slug}`,
      lastmod: post.updatedAt.toISOString(),
      priority: 0.9
    })),
    ...tags.map(tag => ({
      loc: `/tags/${tag.slug}`,
      lastmod: tag.updatedAt.toISOString(),
      priority: 0.6
    }))
  ]

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls.map(url => `
  <url>
    <loc>${baseUrl}${url.loc}</loc>
    ${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ''}
    <changefreq>weekly</changefreq>
    <priority>${url.priority}</priority>
  </url>
  `).join('')}
</urlset>`

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, s-maxage=86400', // 24 hours
    },
  })
}