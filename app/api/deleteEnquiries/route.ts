import prisma from '@/prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");
        const requestId = searchParams.get("requestId"); 
        const type = searchParams.get("type");       

        // Check if user is authenticated
        if (!userId || !requestId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        if (!type || (type !== 'adoption' && type !== 'rehome')) {
            return NextResponse.json({ error: 'Invalid request type' }, { status: 400 });
        }

        if (type === 'adoption') {
            // Verify ownership before deletion
            const adoptionRequest = await prisma.adoptionRequests.findUnique({
                where: { id: requestId },
                include: { adoptionprofile: true }
            });

            if (!adoptionRequest) {
                return NextResponse.json({ error: 'Request not found' }, { status: 404 });
            }

            // Check if the user owns this request
            if (adoptionRequest.adoptionprofile.userId !== userId) {
                return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
            }

            // Only allow deletion of unprocessed requests
            if (adoptionRequest.status !== 'unprocessed') {
                return NextResponse.json(
                    { error: 'Only unprocessed requests can be deleted' },
                    { status: 400 }
                );
            }

            // Delete the adoption request
            await prisma.adoptionRequests.delete({
                where: { id: requestId }
            });
        } else {
            // For rehome requests
            const rehomeRequest = await prisma.rehomeRequests.findUnique({
                where: { id: requestId }
            });

            if (!rehomeRequest) {
                return NextResponse.json({ error: 'Request not found' }, { status: 404 });
            }

            // Check if the user owns this request
            if (rehomeRequest.userId !== userId) {
                return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
            }

            // Only allow deletion of unprocessed requests
            if (rehomeRequest.status !== 'unprocessed') {
                return NextResponse.json(
                    { error: 'Only unprocessed requests can be deleted' },
                    { status: 400 }
                );
            }

            // Delete the rehome request
            await prisma.rehomeRequests.delete({
                where: { id: requestId }
            });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting request:', error);
        return NextResponse.json(
            { error: 'An error occurred while deleting the request' },
            { status: 500 }
        );
    }
}