"use client";

import { useEffect, useState } from "react";
import BlogEditor from "@/components/BlogEditor";
import { updateBlogAction } from "@/app/actions/blog.server";
import toast from "react-hot-toast";
import { useParams } from "next/navigation";

export default function BlogEditPage() {
    const {id} = useParams();
  const [loading, setLoading] = useState(true);
  const [blog, setBlog] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/blogs/${id}`)
      .then((r) => r.json())
      .then((d) => {
        setBlog(d);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="p-8">Loading...</div>;

  const [title, setTitle] = useState(blog.title);
  const [author, setAuthor] = useState(blog.author);
  const [html, setHtml] = useState(blog.html);
  const [thumbnail, setThumbnail] = useState(blog.thumbnail ?? "");
  const [categories, setCategories] = useState(
    blog.categories.map((c: any) => c.name).join(", ")
  );

  const submit = async () => {
    await updateBlogAction(blog.id, {
      title,
      author,
      html,
      thumbnail,
      categories: categories.split(",").map((c: string) => c.trim()),
    });

    toast.success("Updated");
  };

  return (
    <div className="max-w-5xl mx-auto p-8 space-y-4">
      <input
        className="border p-2 rounded w-full"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        className="border p-2 rounded w-full"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
      />

      <input
        className="border p-2 rounded w-full"
        value={categories}
        onChange={(e) => setCategories(e.target.value)}
      />

      <BlogEditor value={html} onChange={setHtml} />

      <button
        onClick={submit}
        className="px-4 py-2 bg-sky-700 text-white rounded"
      >
        Save Changes
      </button>
    </div>
  );
}
