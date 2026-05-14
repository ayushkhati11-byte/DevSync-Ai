import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const project = await prismaClient.project.findUnique({
      where: { id },
      include: {
        owner: { select: { id: true, name: true, image: true, bio: true } },
        members: { include: { user: { select: { id: true, name: true, image: true } } } },
        discussions: { include: { author: { select: { id: true, name: true, image: true } }, _count: { select: { comments: true } } }, orderBy: { createdAt: "desc" }, take: 10 },
      },
    });
    if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });
    return NextResponse.json(project);
  } catch {
    return NextResponse.json({ error: "Failed to fetch project" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  try {
    const project = await prismaClient.project.findUnique({ where: { id } });
    if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });
    if (project.ownerId !== session.user.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    await prismaClient.$transaction([
      prismaClient.userProject.deleteMany({ where: { projectId: id } }),
      prismaClient.collaborationRequest.deleteMany({ where: { projectId: id } }),
      prismaClient.discussion.deleteMany({ where: { projectId: id } }),
      prismaClient.project.delete({ where: { id } }),
    ]);
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("Delete error:", e);
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}
