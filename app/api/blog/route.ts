import { blogSchema } from '@/app/(frontend)/(users)/_components/admin/blog'
import prisma from '@/prisma/client'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, html,image } = blogSchema.parse(body);

    if (!title || !html) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      )
    }

    const blog = await prisma.blog.create({
      data: {
        title,
        html,
        image
      },
    })

    return NextResponse.json(blog, { status: 201 })
  } catch (error) {
    console.error('Error creating blog:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}