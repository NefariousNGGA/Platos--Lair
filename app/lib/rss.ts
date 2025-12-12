import { Feed } from 'feed'
import { prisma } from './prisma'

export async function generateRSSFeed(baseUrl: string) {
  const feed = new Feed({
    title: 'Minimalist Blog',
    description: 'A clean, minimalist blog platform',
    id: baseUrl,
    link: baseUrl,
    language: 'en',
    image: `${baseUrl}/logo.png`,
    favicon: `${baseUrl}/favicon.ico`,
    copyright: `All rights reserved ${new Date().getFullYear()}`,
    updated: new Date(),
    generator: 'Next.js + Feed',
    feedLinks: {
      rss2: `${baseUrl}/feed.xml`,
    },
  })

  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { publishedAt: 'desc' },
    take: 20,
    include: {
      tags: {
        include: { tag: true }
      }
    }
  })

  posts.forEach(post => {
    feed.addItem({
      title: post.title,
      id: `${baseUrl}/posts/${post.slug}`,
      link: `${baseUrl}/posts/${post.slug}`,
      description: post.excerpt || '',
      content: post.content || '',
      author: [{ name: 'Minimalist Blog' }],
      date: post.publishedAt || post.createdAt,
      image: post.coverImage || undefined,
      category: post.tags.map(({ tag }) => ({
        name: tag.name,
      })),
    })
  })

  return feed.rss2()
}