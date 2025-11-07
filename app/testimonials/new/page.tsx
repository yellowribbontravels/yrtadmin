"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { createTestimonialAction } from "@/app/actions/testimonial.server";

export default function NewTestimonialPage() {
  const [customerName, setCustomerName] = useState("");
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(5);
  const [image, setImage] = useState("");
  const [uploading, setUploading] = useState(false);

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const data = new FormData();
    data.append("file", file);
    data.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_PRESET!
    );
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD}/image/upload`,
      { method: "POST", body: data }
    );
    const json = await res.json();
    return json.secure_url;
  };

  const submit = async () => {
    if (!customerName || !feedback) {
      toast.error("Missing fields");
      return;
    }

    await createTestimonialAction({
      customerName,
      feedback,
      rating,
      image,
    });

    toast.success("Testimonial created");
    setCustomerName("");
    setFeedback("");
    setRating(5);
    setImage("");
  };

  return (
    <div className="max-w-3xl mx-auto p-8 space-y-5">
      <h1 className="text-2xl font-semibold">Add New Testimonial</h1>

      <input
        className="border p-2 rounded w-full"
        placeholder="Customer Name"
        value={customerName}
        onChange={(e) => setCustomerName(e.target.value)}
      />

      <textarea
        className="border p-2 rounded w-full"
        rows={5}
        placeholder="Feedback"
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
      />

      <input
        type="number"
        min={1}
        max={5}
        className="border p-2 rounded w-32"
        value={rating}
        onChange={(e) => setRating(Number(e.target.value))}
      />

      <div>
        <label className="block text-sm mb-1">Image (optional)</label>
        <input
          type="file"
          accept="image/*"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            setUploading(true);
            const url = await uploadToCloudinary(file);
            setImage(url);
            toast.success("Image uploaded");
            setUploading(false);
          }}
        />
        {image && (
          <img
            src={image}
            className="w-32 h-32 object-cover mt-3 rounded border"
          />
        )}
      </div>

      <button
        onClick={submit}
        disabled={uploading}
        className="px-4 py-2 bg-sky-700 text-white rounded"
      >
        {uploading ? "Uploading..." : "Save Testimonial"}
      </button>
    </div>
  );
}
