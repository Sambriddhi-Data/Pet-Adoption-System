import { Suspense } from 'react'
import BlogListComponent from './blog';

export default function Blog() {

  return (
    <div>
      <main className="max-w-4xl mx-auto p-6">
        <header>
          <h1 className="text-2xl font-bold mb-4">Welcome to Blogs</h1>
          <p>Read the latest posts below.</p>
        </header>
        <Suspense fallback={<p>Loading</p>}>
          <BlogListComponent />
        </Suspense>
      </main>
    </div>
  );
}
