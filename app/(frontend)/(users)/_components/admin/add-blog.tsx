'use client'

import React, { useCallback, useState } from 'react'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import TextStyle from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import Highlight from '@tiptap/extension-highlight'
import TextAlign from '@tiptap/extension-text-align'
import Heading from '@tiptap/extension-heading'
import BulletList from '@tiptap/extension-bullet-list'
import OrderedList from '@tiptap/extension-ordered-list'
import ListItem from '@tiptap/extension-list-item'

import { Bold, Italic, Underline as UnderlineIcon, Link as LinkIcon, Strikethrough, List, ListOrdered, Pipette, Heading1, Heading2, Heading3, AlignLeft, AlignCenter, AlignRight } from 'lucide-react'
import { FontSize } from '@/components/font-size'
import { useForm } from 'react-hook-form'
import { blogSchema, TBlogSchema } from './blog'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import LoadingButton from '@/components/loading-button'
import { toast } from '@/hooks/use-toast'
import { useSignedCloudinaryWidgetLogo } from '../shelters/(form)/custom-widget'

const RichTextForm = () => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [isDeleting, setIsDeleting] = useState(false);

  const router = useRouter()

  const editor = useEditor({
    extensions: [
      StarterKit,
      FontSize,
      Underline,
      Link,
      TextStyle,
      Color,
      Highlight,
      Heading.configure({ levels: [1, 2, 3] }),
      BulletList,
      OrderedList,
      ListItem,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content: '',
    onUpdate: ({ editor }) => {
      form.setValue('html', editor.getHTML(), { shouldValidate: true })
    },
  })

  const form = useForm<TBlogSchema>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: "",
      html: "",
      image: "",
    },
  })

  const handleUpload = (result: any) => {
    if (result.event === "success") {
      const uploadedUrl = result.info.secure_url;
      form.setValue("image", uploadedUrl, { shouldValidate: true });

      toast({
        title: "Image Uploaded",
        description: "Your image has been uploaded successfully!",
        variant: "success",
      });
    }
  };


  const { openWidget } = useSignedCloudinaryWidgetLogo(handleUpload);

  // Function to get public ID from Cloudinary URL
  const getPublicIdFromUrl = useCallback((url: string) => {
    try {
      // Extract the part of the URL after '/upload/'
      const uploadIndex = url.indexOf('/upload/');
      if (uploadIndex === -1) return '';

      // Get everything after /upload/
      let path = url.slice(uploadIndex + 8);

      // Remove any transformation parameters
      if (path.includes('/')) {
        const transformEnd = path.indexOf('/');
        path = path.slice(transformEnd + 1);
      }

      // Remove file extension
      const extensionIndex = path.lastIndexOf('.');
      if (extensionIndex !== -1) {
        path = path.slice(0, extensionIndex);
      }

      // Return the complete public ID including the folder
      return path;
    } catch (error) {
      console.error("Error extracting public ID:", error);
      return '';
    }
  }, []);

  // Function to delete image from Cloudinary
  const deleteImageFromCloudinary = useCallback(async (imageUrl: string) => {
    setIsDeleting(true);
    try {
      const publicId = getPublicIdFromUrl(imageUrl);

      const response = await fetch('/api/cloudinary/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ publicId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete image');
      }

      toast({
        title: "Image Deleted",
        description: "Image has been removed from cloud storage.",
        variant: "success",
      });

      return true;
    } catch (error) {
      console.error("Error deleting image:", error);
      toast({
        title: "Error",
        description: "Failed to delete image from cloud storage.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsDeleting(false);
    }
  }, [getPublicIdFromUrl]);

  // Function to handle image removal
  const handleRemoveImage = async (imageUrl: string) => {
    if (!imageUrl.includes('blob:')) {
      await deleteImageFromCloudinary(imageUrl);
    }

    // Clear the image from the form
    form.setValue("image", "", { shouldValidate: true });
  };

  console.log("Form", form.getValues())
  console.log(form.formState.errors)


  async function onSubmit(values: TBlogSchema) {
    setIsSubmitting(true)
    console.log(values);
    try {
      const response = await fetch('/api/blog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        throw new Error('Failed to create blog post')
      }

      const data = await response.json()
      toast({
        title: "Blog Created!",
        description: "Blog post created successfully.",
        variant: "success"
      });
      router.push(`/blog/${data.id}`)
    } catch (error) {
      console.error('Error submitting blog:', error);
      toast({
        title: "Error",
        description: "Error submitting the blog",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false)
    }
  }

  return (

    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-1">
            Title
          </label>
          <input
            id="title"
            type="text"
            {...form.register('title')}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {form.formState.errors.title && (
            <p className="mt-1 text-sm text-red-500">
              {form.formState.errors.title.message}
            </p>
          )}
        </div>


        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Description
          </label>
          <div className="border border-gray-300 rounded-md">
            <MenuBar editor={editor} />
            <EditorContent editor={editor} className="p-3 min-h-[200px]" />
          </div>
          {form.formState.errors.html && (
            <p className="mt-1 text-sm text-red-500">
              {form.formState.errors.html.message}
            </p>
          )}
          <input
            type="hidden"
            {...form.register('html')}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Blog Image <span className="text-red-500">*</span>
          </label>

          {form.watch('image') ? (
            <div className="mb-4 relative w-40 h-40 group">
              <img
                src={form.watch('image')}
                alt="Blog Cover"
                className="w-full h-full object-cover rounded-md"
              />
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => handleRemoveImage(form.watch('image') as string)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-80 hover:opacity-100"
                aria-label="Remove image"
              >
                ×
              </button>
            </div>
          ) : (
            <p className="text-gray-500 text-sm mb-4">No image uploaded yet.</p>
          )}

          <div className="space-y-2">
            <button
              type="button"
              onClick={openWidget}
              disabled={isDeleting}
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md px-3 py-2 text-sm"
            >
              {isDeleting ? "Removing..." : "Choose Image"}
            </button>
            <p className="text-xs text-gray-500">Max size: 5MB</p>
          </div>

          {form.formState.errors.image && (
            <p className="mt-1 text-sm text-red-500">
              {form.formState.errors.image.message}
            </p>
          )}

          {/* This keeps it registered in the form */}
          <input type="hidden" {...form.register('image')} />
        </div>

      </div>

      <LoadingButton
        pending={isSubmitting}
      >
        Submit
      </LoadingButton>
    </form>
  )
}

export default RichTextForm

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) return null

  return (
    <div className="flex flex-wrap gap-1 border-b border-gray-300 p-2 bg-gray-50 text-sm">
      <button onClick={() => editor.chain().focus().toggleBold().run()} className={getBtnStyle(editor.isActive('bold'))}>
        <Bold className="h-5 w-5" />
      </button>
      <button onClick={() => editor.chain().focus().toggleItalic().run()} className={getBtnStyle(editor.isActive('italic'))}>
        <Italic className="h-5 w-5" />
      </button>
      <button onClick={() => editor.chain().focus().toggleUnderline().run()} className={getBtnStyle(editor.isActive('underline'))}>
        <UnderlineIcon className="h-5 w-5" />
      </button>
      <button onClick={() => editor.chain().focus().toggleStrike().run()} className={getBtnStyle(editor.isActive('strike'))}>
        <Strikethrough className="h-5 w-5" />
      </button>
      <button onClick={() => editor.chain().focus().toggleHighlight().run()} className={getBtnStyle(editor.isActive('highlight'))}>
        <Pipette className="h-5 w-5" />
      </button>
      <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={getBtnStyle(editor.isActive('heading', { level: 1 }))}>
        <Heading1 className="h-5 w-5" />
      </button>
      <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={getBtnStyle(editor.isActive('heading', { level: 2 }))}>
        <Heading2 className="h-5 w-5" />
      </button>
      <button onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={getBtnStyle(editor.isActive('heading', { level: 3 }))}>
        <Heading3 className="h-5 w-5" />
      </button>
      <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={getBtnStyle(editor.isActive('bulletList'))}>
        <List className="h-5 w-5" />
      </button>
      <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className={getBtnStyle(editor.isActive('orderedList'))}>
        <ListOrdered className="h-5 w-5" />
      </button>
      <button onClick={() => {
        const url = prompt('Enter URL:')
        if (url) editor.chain().focus().setLink({ href: url }).run()
      }} className={getBtnStyle(editor.isActive('link'))}>
        <LinkIcon className="h-5 w-5" />
      </button>

      {/* Text alignment buttons */}
      <button onClick={() => editor.chain().focus().setTextAlign('left').run()} className={getBtnStyle(editor.isActive('textAlign', { align: 'left' }))}>
        <AlignLeft className="h-5 w-5" />
      </button>
      <button onClick={() => editor.chain().focus().setTextAlign('center').run()} className={getBtnStyle(editor.isActive('textAlign', { align: 'center' }))}>
        <AlignCenter className="h-5 w-5" />
      </button>
      <button onClick={() => editor.chain().focus().setTextAlign('right').run()} className={getBtnStyle(editor.isActive('textAlign', { align: 'right' }))}>
        <AlignRight className="h-5 w-5" />
      </button>

      <select
        onChange={(e) => editor?.chain().focus().setFontSize(e.target.value).run()}
      >
        <option value="12px">12</option>
        <option value="14px">14</option>
        <option value="16px">16</option>
        <option value="20px">20</option>
        <option value="24px">24</option>
        <option value="30px">30</option>
      </select>
    </div>

  )
}

const getBtnStyle = (active: boolean) =>
  `px-2 py-1 rounded ${active ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`
