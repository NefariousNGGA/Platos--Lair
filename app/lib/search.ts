import { prisma } from './prisma'

export interface SearchResult {
  id: string
  title: string
  excerpt?: string | null
  slug: string
  publishedAt?: Date | null
  type: 'post' | 'tag'
}

export async function searchContent(query: string): Promise<SearchResult[]> {
  if (!query.trim()) return []

  const [posts, tags] = await Promise.all([
    prisma.post.findMany({
      where: {
        published: true,
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { excerpt: { contains: query, mode: 'insensitive' } },
        ]
      },
      take: 10,
      select: {
        id: true,
        title: true,
        excerpt: true,
        slug: true,
        publishedAt: true,
      }
    }),
    prisma.tag.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
        ]
      },
      take: 5,
      select: {
        id: true,
        name: true,
        slug: true,
      }
    })
  ])

  const postResults: SearchResult[] = posts.map(post => ({
    ...post,
    type: 'post' as const,
  }))

  const tagResults: SearchResult[] = tags.map(tag => ({
    id: tag.id,
    title: tag.name,
    slug: tag.slug,
    type: 'tag' as const,
  }))

  return [...postResults, ...tagResults]
}

export function highlightMatch(text: string, query: string): string {
  if (!query.trim()) return text
  
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
  return text.replace(regex, '<mark class="bg-pastel-yellow">$1</mark>')
}