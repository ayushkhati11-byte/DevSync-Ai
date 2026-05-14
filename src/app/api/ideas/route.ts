import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@/lib/prisma";
import { auth } from "@/lib/auth";

async function getUserId(request: NextRequest): Promise<string | null> {
  const session = await auth.api.getSession({ headers: request.headers });
  return session?.user?.id || null;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const role = searchParams.get("role");

  const where: Record<string, unknown> = {};
  if (status && status !== "all") where.status = status;
  if (role) where.requiredRoles = { path: "$", array_contains: role };

  try {
    const ideas = await prismaClient.ideaTicket.findMany({
      where, include: { owner: { select: { id: true, name: true, image: true } }, _count: { select: { members: true } } },
      orderBy: { createdAt: "desc" }, take: 50,
    });
    return NextResponse.json(ideas);
  } catch { return NextResponse.json({ error: "Failed to list ideas" }, { status: 500 }); }
}

export async function POST(request: NextRequest) {
  const userId = await getUserId(request);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { title, vision, requiredRoles, maxMembers } = await request.json();
    if (!title || !vision) return NextResponse.json({ error: "Title and vision are required" }, { status: 400 });
    if (typeof title !== "string" || title.length > 200) return NextResponse.json({ error: "Invalid title" }, { status: 400 });
    if (typeof vision !== "string" || vision.length > 5000) return NextResponse.json({ error: "Vision too long" }, { status: 400 });

    const idea = await prismaClient.ideaTicket.create({
      data: { title, vision, requiredRoles: requiredRoles || [], maxMembers: maxMembers || 4, ownerId: userId, members: { create: { userId, role: "owner" } } },
      include: { owner: { select: { id: true, name: true, image: true } }, _count: { select: { members: true } } },
    });
    return NextResponse.json(idea, { status: 201 });
  } catch { return NextResponse.json({ error: "Failed to create idea" }, { status: 500 }); }
}
