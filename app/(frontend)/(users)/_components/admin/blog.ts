import { z } from "zod";

export const blogSchema = z.object({
    title: z
        .string()
        .min(10, "The title of the blog must be atleast 10 characters"),
    html: z
        .string()
        .trim()
        .min(100, "The body content of the blog must be atleast 100 characters"),

    image: z
        .string()
        .min(1, "An image is required")
});

export type TBlogSchema = z.infer<typeof blogSchema>;
