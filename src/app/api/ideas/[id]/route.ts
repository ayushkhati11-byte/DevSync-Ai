import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@/lib/prisma";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const idea = await prismaClient.ideaTicket.findUnique({
      where: { id }, include: {
        owner: { select: { id: true, name: true, image: true, bio: true } },
        members: { include: { user: { select: { id: true, name: true, image: true } } } },
      },
    });
    if (!idea) return NextResponse.json({ error: "Idea not found" }, { status: 404 });
    return NextResponse.json(idea);
  } catch { return NextResponse.json({ error: "Failed to fetch idea" }, { status: 500 }); }
}
