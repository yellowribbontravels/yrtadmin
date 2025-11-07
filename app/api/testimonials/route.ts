import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const testimonials = await prisma.testimonials.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(testimonials);
}

export async function POST(req: Request) {
  const data = await req.json();
  const created = await prisma.testimonials.create({
    data: {
      customerName: data.customerName,
      feedback: data.feedback,
      rating: data.rating,
      image: data.image,
    },
  });
  return NextResponse.json(created);
}
