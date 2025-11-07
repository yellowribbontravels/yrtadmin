"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import BlogEditor from "@/components/BlogEditor";
import { createBlogAction } from "@/app/actions/blog.server";
import { Loader2, ImagePlus } from "lucide-react";

export default function NewBlogPage() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [html, setHtml] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [categories, setCategories] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const upload = async (file: File): Promise<string> => {
    setUploading(true);
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_PRESET!);
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD}/image/upload`,
      { method: "POST", body: data }
    );
    const json = await res.json();
    setUploading(false);
    return json.secure_url;
  };

  const submit = async () => {
    if (!title || !author || !html) {
      toast.error("Please fill all required fields");
      return;
    }
    setSubmitting(true);

    try {
      await createBlogAction({
        title,
        html,
        author,
        thumbnail,
        categories: categories
          .split(",")
          .map((c) => c.trim())
          .filter(Boolean),
        images,
      });

      toast.success("Blog published successfully");
      setTitle("");
      setAuthor("");
      setHtml("");
      setThumbnail("");
      setImages([]);
      setCategories("");
    } catch (e) {
      toast.error("Failed to create blog");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="mb-10">
        <h1 className="text-3xl font-semibold text-gray-900">Create New Blog</h1>
        <p className="text-gray-500 text-sm mt-2">
          Fill in the details below to create and publish a new article.
        </p>
      </div>

      <div className="space-y-8">
        {/* Title & Author */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Blog Title<span className="text-red-500">*</span>
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter blog title"
              className="border rounded-lg w-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Author<span className="text-red-500">*</span>
            </label>
            <input
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Author name"
              className="border rounded-lg w-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
        </div>

        {/* Categories */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Categories
          </label>
          <input
            value={categories}
            onChange={(e) => setCategories(e.target.value)}
            placeholder="Separate categories with commas (e.g. Travel, Tips, Adventure)"
            className="border rounded-lg w-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        {/* Thumbnail */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Thumbnail Image
          </label>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <input
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const url = await upload(file);
                setThumbnail(url);
                toast.success("Thumbnail uploaded");
              }}
            />
            {uploading && (
              <Loader2 className="w-4 h-4 animate-spin text-sky-600" />
            )}
          </div>

          {thumbnail && (
            <div className="mt-3 w-full sm:w-80">
              <img
                src={thumbnail}
                alt="Thumbnail"
                className="rounded-lg border shadow-sm"
              />
            </div>
          )}
        </div>

        {/* Extra Images */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Gallery Images
          </label>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer text-sky-700 hover:underline">
              <ImagePlus className="w-4 h-4" />
              <span>Select Images</span>
              <input
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={async (e) => {
                  const files = Array.from(e.target.files ?? []);
                  const urls: string[] = [];
                  for (const f of files) urls.push(await upload(f));
                  setImages(urls);
                  toast.success("Images uploaded");
                }}
              />
            </label>
            {uploading && (
              <Loader2 className="w-4 h-4 animate-spin text-sky-600" />
            )}
          </div>

          {images.length > 0 && (
            <div className="flex flex-wrap gap-3 mt-3">
              {images.map((url, i) => (
                <img
                  key={i}
                  src={url}
                  alt={`Blog image ${i + 1}`}
                  className="w-32 h-32 object-cover rounded-md border shadow-sm"
                />
              ))}
            </div>
          )}
        </div>

        {/* Blog Editor */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Blog Content<span className="text-red-500">*</span>
          </label>
          <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
            <BlogEditor value={html} onChange={setHtml} />
          </div>
        </div>

        {/* Publish Button */}
        <div className="flex justify-end">
          <button
            onClick={submit}
            disabled={uploading || submitting}
            className="flex items-center justify-center gap-2 px-6 py-2 bg-sky-700 text-white rounded-lg font-medium hover:bg-sky-800 disabled:opacity-60"
          >
            {submitting && (
              <Loader2 className="w-4 h-4 animate-spin text-white" />
            )}
            {submitting ? "Publishing..." : "Publish Blog"}
          </button>
        </div>
      </div>
    </div>
  );
}
