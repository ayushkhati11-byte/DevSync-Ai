import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const idea = await prismaClient.ideaTicket.findUnique({ where: { id }, include: { _count: { select: { members: true } } } });
    if (!idea) return NextResponse.json({ error: "Idea not found" }, { status: 404 });
    if (idea.status !== "open") return NextResponse.json({ error: "This idea is no longer open" }, { status: 400 });
    if (idea._count.members >= idea.maxMembers) return NextResponse.json({ error: "Team is full" }, { status: 400 });

    const existing = await prismaClient.userIdea.findUnique({ where: { userId_ideaId: { userId: session.user.id, ideaId: id } } });
    if (existing) return NextResponse.json({ error: "Already joined" }, { status: 409 });

    await prismaClient.userIdea.create({ data: { userId: session.user.id, ideaId: id, role: "member" } });

    const updated = await prismaClient.ideaTicket.findUnique({
      where: { id }, include: {
        owner: { select: { id: true, name: true, image: true } },
        members: { include: { user: { select: { id: true, name: true, image: true } } } },
      },
    });
    return NextResponse.json(updated);
  } catch { return NextResponse.json({ error: "Failed to join idea" }, { status: 500 }); }
}
