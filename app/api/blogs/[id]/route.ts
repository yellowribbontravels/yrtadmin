import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const blog = await prisma.blogs.findUnique({
    where: { id: (await ctx.params).id },
    include: { categories: true, images: true },
  });
  return NextResponse.json(blog);
}

export async function DELETE(
  req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  await prisma.blogs.delete({
    where: { id: (await ctx.params).id },
  });
  return NextResponse.json({ success: true });
}
