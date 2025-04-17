'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

type Blog = {
  id: string;
  title: string;
  html: string;
  image: string | null;
  createdAt: string;
};

export default function Blog() {
  const [blogs, setBlogs] = useState<Blog[] | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAllBlogs = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/getAllBlogs');
      if (!response.ok) throw new Error("Failed to fetch blogs");
      const data = await response.json();
      setBlogs(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllBlogs();
  }, []);

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Blogs</h1>

      {loading ? (
        <p>Loading blogs...</p>
      ) : blogs && blogs.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {blogs.map((blog) => (
            <Link href={`/blog/${blog.id}`} key={blog.id}>
              <div className="p-4 border border-gray-200 rounded-md shadow-sm hover:shadow-md transition">
                <h2 className="text-lg font-semibold">{blog.title}</h2>
                <p className="text-sm text-gray-500">
                  {new Date(blog.createdAt).toLocaleDateString()}
                </p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p>No blogs found.</p>
      )}
    </main>
  );
}
