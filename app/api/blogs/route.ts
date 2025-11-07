import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const blogs = await prisma.blogs.findMany({
    orderBy: { createdAt: "desc" },
    include: { categories: true, images: true },
  });
  return NextResponse.json(blogs);
}

export async function POST(req: Request) {
  const body = await req.json();
  const created = await prisma.blogs.create({
    data: {
      title: body.title,
      html: body.html,
      thumbnail: body.thumbnail,
      author: body.author,
      categories: {
        connectOrCreate:
          body.categories?.map((c: string) => ({
            where: { name: c },
            create: { name: c },
          })) ?? [],
      },
      images: {
        create: body.images?.map((url: string) => ({ url })) ?? [],
      },
    },
  });
  return NextResponse.json(created);
}
