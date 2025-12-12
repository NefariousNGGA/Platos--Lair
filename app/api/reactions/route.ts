import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'
import { z } from 'zod'

const reactionSchema = z.object({
  postId: z.string(),
  type: z.enum(['like', 'love', 'clap', 'save']),
  userHash: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = reactionSchema.parse(body)
    
    const ip = request.headers.get('x-forwarded-for') || 'anonymous'
    const userHash = data.userHash || Buffer.from(ip).toString('base64').slice(0, 32)
    
    const existing = await prisma.reaction.findUnique({
      where: {
        postId_userHash_type: {
          postId: data.postId,
          userHash,
          type: data.type,
        }
      }
    })
    
    if (existing) {
      return NextResponse.json(
        { error: 'Already reacted' },
        { status: 400 }
      )
    }
    
    const reaction = await prisma.reaction.create({
      data: {
        postId: data.postId,
        type: data.type,
        userHash,
        userAgent: request.headers.get('user-agent') || undefined,
      }
    })
    
    const counts = await prisma.reaction.groupBy({
      by: ['type'],
      where: { postId: data.postId },
      _count: true,
    })
    
    return NextResponse.json({
      success: true,
      reaction,
      counts: Object.fromEntries(counts.map(c => [c.type, c._count])),
    })
    
  } catch (error) {
    console.error('Error adding reaction:', error)
    
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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const postId = searchParams.get('postId')
    
    if (!postId) {
      return NextResponse.json(
        { error: 'postId is required' },
        { status: 400 }
      )
    }
    
    const counts = await prisma.reaction.groupBy({
      by: ['type'],
      where: { postId },
      _count: true,
    })
    
    const total = counts.reduce((sum, c) => sum + c._count, 0)
    
    return NextResponse.json({
      counts: Object.fromEntries(counts.map(c => [c.type, c._count])),
      total,
    })
    
  } catch (error) {
    console.error('Error fetching reactions:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}