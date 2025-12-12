import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../lib/prisma'
import { z } from 'zod'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = Number(searchParams.get('limit')) || 50
    const popular = searchParams.get('popular') === 'true'
    
    const tags = await prisma.tag.findMany({
      include: {
        _count: {
          select: { posts: true }
        }
      },
      orderBy: popular 
        ? { posts: { _count: 'desc' } }
        : { name: 'asc' },
      take: limit,
    })
    
    const formattedTags = tags.map(tag => ({
      ...tag,
      postCount: tag._count.posts,
    }))
    
    return NextResponse.json(formattedTags, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600',
      }
    })
    
  } catch (error) {
    console.error('Error fetching tags:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

const createTagSchema = z.object({
  name: z.string().min(1).max(50),
  description: z.string().max(200).optional(),
  color: z.string().optional(),
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
    const data = createTagSchema.parse(body)
    
    const slug = data.name.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')
    
    const tag = await prisma.tag.create({
      data: {
        ...data,
        slug,
      }
    })
    
    return NextResponse.json(tag, { status: 201 })
    
  } catch (error) {
    console.error('Error creating tag:', error)
    
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