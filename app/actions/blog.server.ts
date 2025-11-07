"use server";

import { prisma } from "@/lib/db";
import { parseText } from "@/lib/text-functions";

export async function createBlogAction(payload: {
  title: string;
  html: string;
  author: string;
  thumbnail?: string;
  categories?: string[];
  images?: string[];
}) {
  const id = parseText(payload.title);
  // Defensive normalization
  const safeCategories = (payload.categories ?? [])
    .map((c) => c.trim())
    .filter(Boolean)
    .map((name) => ({ name }));

  const safeImages = (payload.images ?? [])
    .filter(
      (url): url is string => typeof url === "string" && url.trim() !== ""
    )
    .map((url) => ({ url }));

  return await prisma.blogs.create({
    data: {
      id,
      title: payload.title,
      html: payload.html,
      author: payload.author,
      thumbnail: payload.thumbnail ?? null,
      categories: safeCategories.length
        ? {
            create: safeCategories,
          }
        : undefined,
      images: safeImages.length ? { create: safeImages } : undefined,
    },
  });
}

export async function updateBlogAction(
  id: string,
  payload: {
    title?: string;
    html?: string;
    thumbnail?: string;
    author?: string;
    categories?: string[];
    images?: string[];
  }
) {
  return await prisma.$transaction(async (tx: any) => {
    await tx.blogImages.deleteMany({ where: { blogId: id } });

    const updated = await tx.blogs.update({
      where: { id },
      data: {
        title: payload.title,
        html: payload.html,
        thumbnail: payload.thumbnail,
        author: payload.author,
        categories: {
          categories: {
            set: [],
            create:
              payload.categories?.map((c) => ({
                name: c,
              })) ?? [],
          },
          create:
            payload.images?.map((url) => ({
              url,
            })) ?? [],
        },
      },
    });

    return updated;
  });
}

export async function deleteBlogAction(id: string) {
  return await prisma.blogs.delete({
    where: { id },
  });
}
