import { prisma } from "@/lib/db";

export default async function BlogViewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const blog = await prisma.blogs.findUnique({
    where: { id },
    include: { categories: true, images: true },
  });

  if (!blog) return <div className="p-8">Not found</div>;

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-6">
      {blog.thumbnail && (
        <img src={blog.thumbnail} className="w-full rounded" />
      )}

      <h1 className="text-3xl font-semibold">{blog.title}</h1>

      <div className="text-sm text-gray-500">
        By {blog.author} — {new Date(blog.createdAt).toDateString()}
      </div>

      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: blog.html }}
      />

      <div className="flex gap-2 flex-wrap">
        {blog.images.map((img) => (
          <img key={img.id} src={img.url} className="w-40 rounded border" />
        ))}
      </div>
    </div>
  );
}
