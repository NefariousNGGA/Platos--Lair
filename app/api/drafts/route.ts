import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../lib/prisma'
import { z } from 'zod'

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
    const token = request.headers.get('Authorization')
    if (token !== `Bearer ${process.env.ADMIN_TOKEN}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const body = await request.json()
    const data = createPostSchema.parse(body)
    
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