"use server";

import { prisma } from "@/lib/db";

export async function createTestimonialAction(payload: {
  customerName: string;
  feedback: string;
  rating: number;
  image?: string;
}) {
  return await prisma.testimonials.create({
    data: {
      customerName: payload.customerName,
      feedback: payload.feedback,
      rating: payload.rating,
      image: payload.image,
    },
  });
}

export async function updateTestimonialAction(
  id: string,
  payload: {
    customerName?: string;
    feedback?: string;
    rating?: number;
    image?: string | null;
  }
) {
  return await prisma.testimonials.update({
    where: { id },
    data: {
      customerName: payload.customerName,
      feedback: payload.feedback,
      rating: payload.rating,
      image: payload.image ?? undefined,
    },
  });
}

export async function deleteTestimonialAction(id: string) {
  return await prisma.testimonials.delete({ where: { id } });
}
