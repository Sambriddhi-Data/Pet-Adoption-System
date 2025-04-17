import RichTextForm from "../../_components/admin/add-blog";

export default function BlogPage() {
  return (
    <main className="min-h-screen flex flex-col items-center p-6">
      <h1 className="text-2xl font-bold mb-4">Create Post</h1>
      <RichTextForm />
    </main>
  );
}
