
import { buttonVariants } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function DonationSuccess({
    searchParams,
}:{
    searchParams: { [key: string]: string | string[] | undefined };
}) {
  
    const amount = searchParams.amount?.toString() || '0';
    const shelterName = searchParams.shelterName?.toString() || 'Unknown Shelter';
    
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        <div className="flex justify-center mb-4">
          <CheckCircle className="text-green-500 w-16 h-16" />
        </div>
        
        <h1 className="text-2xl font-bold text-green-600 mb-4">
          Donation Successful!
        </h1>
        
        <div className="text-gray-700 mb-6">
          <p className="mb-2">
            Thank you for your generous donation of <span className="font-bold">Rs. {amount}</span> to:
          </p>
          <p className="text-lg font-semibold mb-4">{shelterName}</p>
        </div>
        
        <p className="text-gray-600 italic mb-6">
          Your contribution will help animals in need find loving homes.
        </p>
        
        <Link href="/" className={buttonVariants({
          variant: "default",
        })}>
          Return Home
        </Link>
      </div>
    </div>
  );
}