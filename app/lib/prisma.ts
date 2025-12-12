import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Helper functions
export async function getPostCount() {
  return await prisma.post.count({ where: { published: true } })
}

export async function getTagCount() {
  return await prisma.tag.count()
}

export async function getTotalWords() {
  const result = await prisma.post.aggregate({
    where: { published: true },
    _sum: { wordCount: true }
  })
  return result._sum.wordCount || 0
}

export async function getRecentPosts(limit = 5) {
  return await prisma.post.findMany({
    where: { published: true },
    orderBy: { publishedAt: 'desc' },
    take: limit,
    include: {
      tags: {
        include: { tag: true }
      }
    }
  })
}