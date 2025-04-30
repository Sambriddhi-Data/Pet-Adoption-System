import prisma from '@/prisma/client'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {

    const blog = await prisma.blog.findMany(
      {
        orderBy: {
          createdAt: 'desc',
        },
      }
    )
    if (!blog) {
        return NextResponse.json(
          { error: 'Blog not found' },
          { status: 404 }
        )
      }
  
      return NextResponse.json(blog)
  } catch (error) {
    console.error('Error creating blog:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}