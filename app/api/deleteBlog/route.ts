import prisma from '@/prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const blogId = searchParams.get("blogId");

        if (!blogId) {
            return NextResponse.json(
                { error: "Blog ID is required" },
                { status: 400 }
            );
        }

        const deletedBlog = await prisma.blog.delete({
            where: { id: blogId },
        });
        if (!deletedBlog) {
            return NextResponse.json(
                { error: "Blog not found" },
                { status: 404 }
            );
        }
        return NextResponse.json(
            { message: "Blog deleted successfully" },
            { status: 200 }
        );

    } catch (error) {
        console.error("Error deleting blog:", error);
        return NextResponse.json(
            { error: "Failed to delete blog" },
            { status: 500 }
        );
    }

}