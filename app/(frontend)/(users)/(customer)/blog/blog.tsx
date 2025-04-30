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
// Helper function to extract plain text from HTML and limit its length
const extractPreview = (html: string, maxLength = 150) => {
    // Create temporary element to parse HTML safely
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    const text = tempDiv.textContent || tempDiv.innerText || '';
    
    if (text.length <= maxLength) return text;
    
    // Truncate text and add ellipsis
    return text.substring(0, maxLength).trim() + '...';
};


export default function BlogListComponent() {
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
        <div>
            <main className="max-w-4xl mx-auto p-6">
                {loading ? (
                    <p>Loading blogs...</p>
                ) : blogs && blogs.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4">
                        {blogs.map((blog) => (
                                <div className="p-4 border border-gray-200 rounded-3xl shadow-sm hover:shadow-md transition" key={blog.id}>
                                    <div>
                                        <img
                                            src={blog.image? blog.image : '/default-image.jpg'}
                                            alt={blog.title}
                                            className="w-full h-[300px] rounded-lg mb-6"
                                        />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-semibold">{blog.title}</h2>
                                        <p className="text-sm text-gray-500">
                                            {new Date(blog.createdAt).toLocaleDateString()}
                                        </p>
                                        <p className="text-gray-700 mb-3">
                                        {extractPreview(blog.html)}
                                    </p>
                                    <Link href={`/blog/${blog.id}`} className="inline-block text-blue-600 font-medium hover:text-blue-800 hover:underline mt-2">
                                        Read more →
                                    </Link>
                                    </div>
                                </div>
                        ))}
                    </div>
                ) : (
                    <p>No blogs found.</p>
                )}
            </main>
        </div>
    );
}
