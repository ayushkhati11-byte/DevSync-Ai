import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const issues = await prismaClient.issue.findMany({
      where: { projectId: id },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(issues);
  } catch {
    return NextResponse.json({ error: "Failed to fetch issues" }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth.api.getSession({ headers: request.headers });
  const userId = session?.user?.id;

  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { title, description, priority } = await request.json();
    if (!title) return NextResponse.json({ error: "Title is required" }, { status: 400 });

    const project = await prismaClient.project.findUnique({ where: { id }, select: { ownerId: true, members: true } });
    if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });
    const isMember = project.ownerId === userId || project.members.some((m: any) => m.userId === userId);
    if (!isMember) return NextResponse.json({ error: "Only members can create issues" }, { status: 403 });

    const validPriorities = ["low", "medium", "high", "urgent"];
    const issuePriority = priority && validPriorities.includes(priority) ? priority : "medium";

    const issue = await prismaClient.issue.create({
      data: { title, description: description || null, priority: issuePriority, projectId: id, reporterId: userId },
    });
    return NextResponse.json(issue, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create issue" }, { status: 500 });
  }
}