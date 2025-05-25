import Link from "next/link";
import RichTextForm from "../../_components/admin/add-blog";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function BlogPage() {
  return (
    <main className=" relative min-h-screen flex flex-col items-center p-6">
      <Link className={cn(buttonVariants(), "absolute top-10 right-36")} href="/blog">
        Go To All BLogs
      </Link>
      <h1 className="text-2xl font-bold mb-4">Create Post</h1>
      <RichTextForm />
    </main>
  );
}
