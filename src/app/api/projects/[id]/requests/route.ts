import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const project = await prismaClient.project.findUnique({ where: { id }, select: { ownerId: true } });
  if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });
  if (project.ownerId !== session.user.id) return NextResponse.json({ error: "Only the owner can view requests" }, { status: 403 });

  const requests = await prismaClient.collaborationRequest.findMany({
    where: { projectId: id }, include: { user: { select: { id: true, name: true, image: true } } }, orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(requests);
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const project = await prismaClient.project.findUnique({ where: { id }, include: { members: { where: { userId: session.user.id } } } });
  if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });
  if (project.ownerId === session.user.id) return NextResponse.json({ error: "You own this project" }, { status: 400 });
  if (project.members.length > 0) return NextResponse.json({ error: "Already a member" }, { status: 409 });

  const existing = await prismaClient.collaborationRequest.findUnique({ where: { userId_projectId: { userId: session.user.id, projectId: id } } });
  if (existing) return NextResponse.json({ error: "Request already sent" }, { status: 409 });

  const { message } = await request.json();
  if (message && (typeof message !== "string" || message.length > 500)) return NextResponse.json({ error: "Message too long" }, { status: 400 });

  const req = await prismaClient.collaborationRequest.create({
    data: { projectId: id, userId: session.user.id, message: message || null },
    include: { user: { select: { id: true, name: true, image: true } } },
  });
  return NextResponse.json(req, { status: 201 });
}
