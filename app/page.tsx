import { prisma } from "@/lib/db";
import Link from "next/link";
import { ArrowRight, FileText, Globe2, Package, Quote, PlusCircle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [blogs, packages, destinations, testimonials] = await Promise.all([
    prisma.blogs.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { categories: true },
    }),
    prisma.package.findMany({ take: 3, orderBy: { createdAt: "desc" } }),
    prisma.destinations.findMany({ take: 3, orderBy: { createdAt: "desc" } }),
    prisma.testimonials.findMany({ take: 3, orderBy: { createdAt: "desc" } }),
  ]);

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-semibold text-gray-900">
            Admin Dashboard
          </h1>
          <Link href="/blogs/new">
            <Button className="flex items-center gap-2">
              <PlusCircle className="w-4 h-4" />
              Create Blog
            </Button>
          </Link>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white border">
            <CardHeader className="flex items-center justify-between">
              <CardTitle className="text-base font-medium">Blogs</CardTitle>
              <FileText className="w-5 h-5 text-sky-600" />
            </CardHeader>
            <CardContent className="text-2xl font-semibold text-gray-800">
              {blogs.length}
            </CardContent>
          </Card>

          <Card className="bg-white border">
            <CardHeader className="flex items-center justify-between">
              <CardTitle className="text-base font-medium">Packages</CardTitle>
              <Package className="w-5 h-5 text-emerald-600" />
            </CardHeader>
            <CardContent className="text-2xl font-semibold text-gray-800">
              {packages.length}
            </CardContent>
          </Card>

          <Card className="bg-white border">
            <CardHeader className="flex items-center justify-between">
              <CardTitle className="text-base font-medium">Destinations</CardTitle>
              <Globe2 className="w-5 h-5 text-indigo-600" />
            </CardHeader>
            <CardContent className="text-2xl font-semibold text-gray-800">
              {destinations.length}
            </CardContent>
          </Card>

          <Card className="bg-white border">
            <CardHeader className="flex items-center justify-between">
              <CardTitle className="text-base font-medium">Testimonials</CardTitle>
              <Quote className="w-5 h-5 text-amber-600" />
            </CardHeader>
            <CardContent className="text-2xl font-semibold text-gray-800">
              {testimonials.length}
            </CardContent>
          </Card>
        </div>

        {/* Latest Blogs */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Blogs</h2>
            <Link
              href="/blogs"
              className="text-sm text-sky-600 hover:underline flex items-center gap-1"
            >
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {blogs.length > 0 ? (
            <div className="border rounded-lg bg-white overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-100 text-gray-700">
                  <tr>
                    <th className="py-3 px-4 text-left font-medium">Title</th>
                    <th className="py-3 px-4 text-left font-medium">Author</th>
                    <th className="py-3 px-4 text-left font-medium">Categories</th>
                    <th className="py-3 px-4 text-right font-medium">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {blogs.map((b) => (
                    <tr
                      key={b.id}
                      className="border-t hover:bg-gray-50 transition"
                    >
                      <td className="py-3 px-4">{b.title}</td>
                      <td className="py-3 px-4">{b.author}</td>
                      <td className="py-3 px-4 text-gray-600">
                        {b.categories.map((c) => c.name).join(", ") || "—"}
                      </td>
                      <td className="py-3 px-4 text-right text-gray-500">
                        {new Date(b.createdAt).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No blogs found.</p>
          )}
        </section>

        {/* Packages & Destinations Quick Access */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Packages */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Recent Packages
              </h2>
              <Link
                href="/packages"
                className="text-sm text-sky-600 hover:underline flex items-center gap-1"
              >
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="bg-white border rounded-lg divide-y">
              {packages.length > 0 ? (
                packages.map((p) => (
                  <div
                    key={p.id}
                    className="p-4 flex justify-between items-center hover:bg-gray-50"
                  >
                    <div>
                      <p className="font-medium text-gray-800">{p.name}</p>
                      <p className="text-sm text-gray-500">{p.location}</p>
                    </div>
                    <span className="text-sky-700 font-semibold">
                      ₹{p.price.toFixed(2)}
                    </span>
                  </div>
                ))
              ) : (
                <p className="p-4 text-gray-500 text-sm">No packages found.</p>
              )}
            </div>
          </div>

          {/* Destinations */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Featured Destinations
              </h2>
              <Link
                href="/destinations"
                className="text-sm text-sky-600 hover:underline flex items-center gap-1"
              >
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="bg-white border rounded-lg divide-y">
              {destinations.length > 0 ? (
                destinations.map((d) => (
                  <div
                    key={d.id}
                    className="p-4 flex justify-between items-center hover:bg-gray-50"
                  >
                    <div>
                      <p className="font-medium text-gray-800">{d.name}</p>
                      <p className="text-sm text-gray-500">{d.country}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-sky-600" />
                  </div>
                ))
              ) : (
                <p className="p-4 text-gray-500 text-sm">No destinations found.</p>
              )}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Testimonials
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.length > 0 ? (
              testimonials.map((t) => (
                <Card key={t.id} className="bg-white border hover:shadow-sm">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-4 mb-3">
                      {t.image ? (
                        <img
                          src={t.image}
                          className="w-12 h-12 rounded-full object-cover"
                          alt={t.customerName}
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gray-200" />
                      )}
                      <div>
                        <p className="font-medium text-gray-800">
                          {t.customerName}
                        </p>
                        <p className="text-xs text-gray-500">
                          Rating: {t.rating}/5
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-3">
                      {t.feedback}
                    </p>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="text-gray-500 text-sm">
                No testimonials available.
              </p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
