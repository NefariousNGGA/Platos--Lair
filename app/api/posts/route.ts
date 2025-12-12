import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'
import { z } from 'zod'

const postQuerySchema = z.object({
  slug: z.string().optional(),
  tag: z.string().optional(),
  limit: z.coerce.number().min(1).max(50).default(10),
  offset: z.coerce.number().min(0).default(0),
  search: z.string().optional(),
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = postQuerySchema.parse(Object.fromEntries(searchParams))
    
    // Single post by slug
    if (query.slug) {
      const post = await prisma.post.findUnique({
        where: { 
          slug: query.slug,
          published: true 
        },
        include: {
          tags: {
            include: { tag: true }
          }
        }
      })
      
      if (!post) {
        return NextResponse.json(
          { error: 'Post not found' },
          { status: 404 }
        )
      }
      
      return NextResponse.json(post, {
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200'
        }
      })
    }
    
    // Multiple posts with filters
    const where: any = {
      published: true,
      ...(query.tag && {
        tags: {
          some: {
            tag: {
              slug: query.tag
            }
          }
        }
      }),
      ...(query.search && {
        OR: [
          { title: { contains: query.search, mode: 'insensitive' } },
          { excerpt: { contains: query.search, mode: 'insensitive' } },
        ]
      })
    }
    
    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        include: {
          tags: {
            include: { tag: true }
          }
        },
        orderBy: { publishedAt: 'desc' },
        take: query.limit,
        skip: query.offset
      }),
      prisma.post.count({ where })
    ])
    
    return NextResponse.json({
      posts,
      total,
      limit: query.limit,
      offset: query.offset
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600'
      }
    })
    
  } catch (error) {
    console.error('Error fetching posts:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid query parameters', details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST endpoint for admin to create posts (protected)
const createPostSchema = z.object({
  title: z.string().min(1).max(200),
  slug: z.string().min(1).max(200),
  excerpt: z.string().max(300).optional(),
  content: z.string().min(1),
  coverImage: z.string().url().optional(),
  tags: z.array(z.string()).optional(),
  published: z.boolean().default(false),
})

export async function POST(request: NextRequest) {
  try {
    // Verify admin token
    const token = request.headers.get('Authorization')
    if (token !== `Bearer ${process.env.ADMIN_TOKEN}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const body = await request.json()
    const data = createPostSchema.parse(body)
    
    // Calculate reading time and word count
    const wordCount = data.content.trim().split(/\s+/).length
    const readingTime = Math.ceil(wordCount / 200)
    
    const post = await prisma.post.create({
      data: {
        ...data,
        wordCount,
        readingTime,
        publishedAt: data.published ? new Date() : null,
        tags: data.tags ? {
          create: data.tags.map(tagName => ({
            tag: {
              connectOrCreate: {
                where: { name: tagName },
                create: {
                  name: tagName,
                  slug: tagName.toLowerCase().replace(/\s+/g, '-')
                }
              }
            }
          }))
        } : undefined,
      },
      include: {
        tags: {
          include: { tag: true }
        }
      }
    })
    
    return NextResponse.json(post, { status: 201 })
    
  } catch (error) {
    console.error('Error creating post:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}