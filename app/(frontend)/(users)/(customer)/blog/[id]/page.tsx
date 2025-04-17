import SafeHtml from '@/components/safe-html';
import { notFound } from 'next/navigation';

type Blog = {
  id: string;
  title: string;
  html: string;
  image: string | null;
  createdAt: string;
};

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
    <main className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">{blog.title}</h1>
      <p className="text-sm text-gray-500 mb-6">
        Posted on {new Date(blog.createdAt).toLocaleDateString()}
      </p>

      {blog.image && (
        <img
          src={blog.image}
          alt={blog.title}
          className="w-full h-[300px] rounded-lg mb-6"
        />
        
      )}

      <SafeHtml html={blog.html} />
    </main>
  );
}
