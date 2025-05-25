'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { DialogFooter, DialogHeader } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { useSession } from '@/auth-client';
import { set } from 'lodash';

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
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [selectedBlogId, setSelectedBlogId] = useState<string | null>(null);

    const { data: session } = useSession();
    const role = session?.user?.role;

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

    const handleDeleteBlog = async (blogId: string) => {
        setIsDeleting(true);
        try {
            const response = await fetch(`/api/deleteBlog?blogId=${blogId}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Failed to delete blog');
            }
            toast({
                title: "Success",
                description: "Blog deleted successfully",
                variant: "success",
            });
            setIsDeleteDialogOpen(false);
            setIsDeleting(false);

            // Refresh the blog list after deletion
            await fetchAllBlogs();

        } catch (error) {
            console.error('Error deleting blog:', error);
            toast({
                title: "Error",
                description: "Failed to delete blog. Please try again later",
                variant: "destructive",
            });
        }
    }
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
                                        src={blog.image ? blog.image : '/images/dog.jpg'}
                                        alt={blog.title}
                                        className="w-full h-[300px] rounded-lg mb-6 object-cover"
                                    />
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold">{blog.title}</h2>
                                    <p className="text-sm text-gray-500">
                                        {new Date(blog.createdAt).toLocaleDateString()}
                                    </p>
                                    <p className="text-gray-700 mb-3 break-words whitespace-normal">
                                        {extractPreview(blog.html)}
                                    </p>
                                    <div className='flex justify-between'>
                                        <Link href={`/blog/${blog.id}`} className="inline-block text-blue-600 font-medium hover:text-blue-800 hover:underline mt-2">
                                            Read more →
                                        </Link>
                                        {role === 'admin' && (
                                            <Button
                                                className=''
                                                variant="destructive"
                                                onClick={() => {
                                                    setSelectedBlogId(blog.id);
                                                    setIsDeleteDialogOpen(true)
                                                }}
                                            >
                                                Delete
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No blogs found.</p>
                )}
            </main>
            {/* Delete Account Confirmation Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold">Delete Account</DialogTitle>
                        <DialogDescription className="py-4">
                            Are you sure you want to delete your account? This action cannot be undone.
                            All your personal information will be marked as deleted but your adoption history
                            will be preserved for record-keeping purposes.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex justify-between">
                        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => handleDeleteBlog(selectedBlogId!)}
                            disabled={isDeleting}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            {isDeleting ? "Deleting..." : "Yes, Delete Blog"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
