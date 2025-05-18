'use client';

import { useSearchParams } from 'next/navigation';
import { XCircle } from 'lucide-react';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';

export default function DonationFailure() {
    const searchParams = useSearchParams();

    const amount = searchParams.get('amount') || '0';
    const shelterName = searchParams.get('shelterName') || 'Unknown Shelter';
    const status = searchParams.get('status') || 'failed';

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
                <div className="flex justify-center mb-4">
                    <XCircle className="text-red-500 w-16 h-16" />
                </div>

                <h1 className="text-2xl font-bold text-red-600 mb-4">
                    Donation Unsuccessful
                </h1>

                <div className="text-gray-700 mb-6">
                    <p className="mb-2">
                        Your donation was unsuccessful.
                    </p>
                    <p>Payment status: <span className="font-medium">{status}</span></p>
                </div>

                <p className="text-gray-600 italic mb-6">
                    We encountered an issue processing your donation. Please try again or contact support.
                </p>

                <div className="space-x-4">
                    <Link href="/donate" className={buttonVariants({
                        variant: "default",
                    })}>

                        Try Again
                    </Link>
                    <Link href="/" className={buttonVariants({
                        variant: "default",
                    })}>
                        Return Home
                    </Link>
                </div>
            </div>
        </div>
    );
}