import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(_: Request, ctx: { params: Promise<{ id: string }> }) {
  const t = await prisma.testimonials.findUnique({
    where: { id: (await ctx.params).id },
  });
  return NextResponse.json(t);
}

export async function DELETE(_: Request, ctx: { params: Promise<{ id: string }> }) {
  await prisma.testimonials.delete({ where: { id: (await ctx.params).id } });
  return NextResponse.json({ success: true });
}
