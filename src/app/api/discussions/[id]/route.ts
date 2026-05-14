import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@/lib/prisma";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const discussion = await prismaClient.discussion.findUnique({
      where: { id }, include: {
        author: { select: { id: true, name: true, image: true } },
        project: { select: { id: true, name: true } },
        comments: { include: { author: { select: { id: true, name: true, image: true } } }, orderBy: { createdAt: "asc" } },
      },
    });
    if (!discussion) return NextResponse.json({ error: "Discussion not found" }, { status: 404 });
    return NextResponse.json(discussion);
  } catch { return NextResponse.json({ error: "Failed to fetch discussion" }, { status: 500 }); }
}
