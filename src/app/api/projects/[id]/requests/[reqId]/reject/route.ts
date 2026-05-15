import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { createNotification } from "@/lib/notifications";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string; reqId: string }> }) {
  const { id, reqId } = await params;
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const project = await prismaClient.project.findUnique({ where: { id }, select: { ownerId: true } });
  if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });
  if (project.ownerId !== session.user.id) return NextResponse.json({ error: "Only the owner can reject" }, { status: 403 });

  const req = await prismaClient.collaborationRequest.findUnique({ where: { id: reqId } });
  if (!req || req.projectId !== id) return NextResponse.json({ error: "Request not found" }, { status: 404 });
  if (req.status !== "pending") return NextResponse.json({ error: "Already handled" }, { status: 400 });

  const project = await prismaClient.project.findUnique({ where: { id }, select: { name: true } });
  await prismaClient.collaborationRequest.update({ where: { id: reqId }, data: { status: "rejected" } });

  await createNotification({
    userId: req.userId,
    type: "collab_rejected",
    title: "Request declined",
    message: `Your request to join "${project?.name || "the project"}" was declined.`,
  });

  return NextResponse.json({ success: true });
}
