"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Link from "next/link";
import { Trash2, PlusCircle } from "lucide-react";

type Testimonial = {
  id: string;
  customerName: string;
  feedback: string;
  rating: number;
  image?: string | null;
  createdAt: string;
};

export default function TestimonialsPage() {
  const [data, setData] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    const res = await fetch("/api/testimonials");
    const json = await res.json();
    setData(json);
    setLoading(false);
  };

  const deleteItem = async (id: string) => {
    if (!confirm("Delete this testimonial?")) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/testimonials/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Deleted successfully");
        fetchData();
      } else toast.error("Failed to delete");
    } catch {
      toast.error("Error deleting testimonial");
    } finally {
      setDeleting(null);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold">Testimonials</h1>
        <Link
          href="/testimonials/new"
          className="flex items-center gap-2 px-4 py-2 bg-sky-700 text-white rounded"
        >
          <PlusCircle className="w-4 h-4" /> Add New
        </Link>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : data.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((t) => (
            <div
              key={t.id}
              className="border rounded-lg bg-white p-5 hover:shadow-md transition"
            >
              {t.image && (
                <img
                  src={t.image}
                  alt={t.customerName}
                  className="w-20 h-20 rounded-full object-cover mx-auto mb-3"
                />
              )}
              <h3 className="text-center font-medium text-gray-800">
                {t.customerName}
              </h3>
              <p className="text-sm text-gray-600 mt-2 line-clamp-3 text-center">
                {t.feedback}
              </p>
              <p className="text-xs text-gray-500 text-center mt-2">
                Rating: {t.rating}/5
              </p>
              <div className="flex justify-center mt-3">
                <button
                  onClick={() => deleteItem(t.id)}
                  disabled={deleting === t.id}
                  className="flex items-center gap-1 text-red-600 hover:text-red-700 text-sm"
                >
                  <Trash2 className="w-4 h-4" />
                  {deleting === t.id ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No testimonials available.</p>
      )}
    </div>
  );
}
