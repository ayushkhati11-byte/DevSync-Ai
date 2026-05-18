import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

function isProjectMember(project: { ownerId: string; members: { userId: string }[] }, userId: string) {
  return project.ownerId === userId || project.members.some((m) => m.userId === userId);
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string; issueId: string }> }) {
  const { id, issueId } = await params;
  const session = await auth.api.getSession({ headers: request.headers });
  const userId = session?.user?.id;

  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const project = await prismaClient.project.findUnique({ where: { id }, select: { ownerId: true, members: { select: { userId: true } } } });
    if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });
    if (!isProjectMember(project, userId)) return NextResponse.json({ error: "Only members can update issues" }, { status: 403 });

    const existingIssue = await prismaClient.issue.findFirst({ where: { id: issueId, projectId: id }, select: { id: true } });
    if (!existingIssue) return NextResponse.json({ error: "Issue not found" }, { status: 404 });

    const { status, priority, assigneeId } = await request.json();
    const updateData: Record<string, unknown> = {};
    if (status && ["open", "in-progress", "resolved", "closed"].includes(status)) updateData.status = status;
    if (priority && ["low", "medium", "high", "urgent"].includes(priority)) updateData.priority = priority;
    if (assigneeId !== undefined) {
      const nextAssigneeId = typeof assigneeId === "string" && assigneeId ? assigneeId : null;
      if (nextAssigneeId && !isProjectMember(project, nextAssigneeId)) {
        return NextResponse.json({ error: "Assignee must be a project member" }, { status: 400 });
      }
      updateData.assigneeId = nextAssigneeId;
    }

    const issue = await prismaClient.issue.update({ where: { id: issueId }, data: updateData });
    return NextResponse.json(issue);
  } catch {
    return NextResponse.json({ error: "Failed to update issue" }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string; issueId: string }> }) {
  const { id, issueId } = await params;
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user?.id;

  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const project = await prismaClient.project.findUnique({ where: { id }, select: { ownerId: true } });
    if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });
    if (project.ownerId !== userId) return NextResponse.json({ error: "Only owner can delete issues" }, { status: 403 });

    await prismaClient.issue.delete({ where: { id: issueId, projectId: id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete issue" }, { status: 500 });
  }
}
