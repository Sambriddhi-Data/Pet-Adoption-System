import { Suspense } from 'react'
import BlogListComponent from './blog';
import Image from 'next/image';

export default function Blog() {

  return (
    <div className='bg-white'>
      <header className="relative bg-primary text-white">
        <div className="relative">
          <Image
            className="absolute top-10 sm:top-24 z-20 w-32 sm:w-24 md:w-36"
            src="/images/tail.svg"
            alt="paw"
            width={200}
            height={200}
          />
        </div>
        <div className="h-80 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-5xl font-bold z-20">Tail Tales</h1>
          <p className="w-4/6 mx-auto font-extralight text-gray-200 mt-4 z-20">
            Read the latest posts below.
          </p>
        </div>

        {/* Convex SVG curve */}
        <svg
          className="absolute bottom-0 left-0 w-full z-10"
          viewBox="0 0 1440 100"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="white"
            d="M0,100 C480,0 960,0 1440,100 L1440,100 L0,100 Z"
          />
        </svg>
      </header>

      <main className="max-w-4xl mx-auto p-6">
        <Suspense fallback={<p>Loading</p>}>
          <BlogListComponent />
        </Suspense>
      </main>
    </div>
  );
}
