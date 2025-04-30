import SafeHtml from '@/components/safe-html';
import { Button } from '@/components/ui/button';
import { ChevronRight, Home } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

type Blog = {
  id: string;
  title: string;
  html: string;
  image: string | null;
  createdAt: string;
};

export const metadata: Metadata = {
  title: "Blog | Fur-Ever Friends"
}

async function getBlog(blogId: string): Promise<Blog | null> {
  try {
    const res = await fetch(`http://localhost:3000/api/getBlogbyBlogId?id=${blogId}`, {
      cache: 'no-store',
    });

    if (!res.ok) return null;

    return await res.json();
  } catch (error) {
    console.error("Error fetching blog:", error);
    return null;
  }
}

type Props = {
  params: { id: string };
};

export default async function BlogDetailPage({ params }: Props) {
  const blog = await getBlog(params.id);

  if (!blog) return notFound();

  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumb navigation */}
      <div className="max-w-3xl mx-auto px-4 pt-6 pb-2">
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-2">
            <li className="inline-flex items-center">
              <Link href="/" className="inline-flex items-center text-sm text-gray-500 hover:text-blue-600">
                <Home size={16} className="mr-2" />
                Home
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <ChevronRight size={16} className="text-gray-400" />
                <Link href="/blog" className="ml-1 text-sm text-gray-500 hover:text-blue-600 md:ml-2">
                  Blogs
                </Link>
              </div>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <ChevronRight size={16} className="text-gray-400" />
                <span className="ml-1 text-sm font-medium text-gray-800 md:ml-2 truncate max-w-[200px]">
                  {blog.title}
                </span>
              </div>
            </li>
          </ol>
        </nav>
      </div>

      <main className="max-w-3xl mx-auto px-4 py-6">
        {/* Blog header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">{blog.title}</h1>
          <p className="text-sm text-gray-500">
            Published on {new Date(blog.createdAt).toLocaleDateString("en-US", {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </header>

        {/* Featured image */}
        {blog.image && (
          <div className="mb-8">
            <img
              src={blog.image}
              alt={blog.title}
              className="w-full h-auto max-h-[400px] object-cover rounded-lg shadow-sm"
            />
          </div>
        )}

        {/* Blog content */}
        <article className="prose prose-blue max-w-none">
          <SafeHtml html={blog.html} />
        </article>
        
        {/* Back to blogs button */}
        <div className="mt-12 border-t pt-6">
          <Link href="/blog">
            <Button variant="outline" className="text-sm">
              ← Back to all blogs
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}