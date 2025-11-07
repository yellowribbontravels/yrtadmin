import { prisma } from "@/lib/db";
import Link from "next/link";

export default async function BlogsPage() {
  const blogs = await prisma.blogs.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-5xl mx-auto p-8 space-y-4">
      <h1 className="text-xl font-semibold">Blogs</h1>

      {blogs.map((b) => (
        <Link
          href={`/blogs/${b.id}`}
          key={b.id}
          className="block border p-4 rounded hover:bg-gray-50"
        >
          <h2 className="font-medium">{b.title}</h2>
          <p className="text-sm text-gray-500">
            {new Date(b.createdAt).toDateString()}
          </p>
        </Link>
      ))}
    </div>
  );
}
