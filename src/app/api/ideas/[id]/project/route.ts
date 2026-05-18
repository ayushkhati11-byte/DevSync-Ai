import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { addGitHubCollaborators } from "@/lib/github-collaborators";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth.api.getSession({ headers: request.headers });
  const userId = session?.user?.id;

  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const idea = await prismaClient.ideaTicket.findUnique({
      where: { id },
      include: { members: { include: { user: true } } },
    });

    if (!idea) return NextResponse.json({ error: "Idea not found" }, { status: 404 });
    if (idea.ownerId !== userId) return NextResponse.json({ error: "Only the owner can create a project from this idea" }, { status: 403 });

    const { repoUrl, name } = await request.json();
    if (!repoUrl || !name) return NextResponse.json({ error: "Repo URL and name are required" }, { status: 400 });
    if (!repoUrl.includes("github.com")) return NextResponse.json({ error: "Must be a valid GitHub URL" }, { status: 400 });

    const existing = await prismaClient.project.findUnique({ where: { repoUrl } });
    if (existing) return NextResponse.json({ error: "Project already exists with this repo URL" }, { status: 409 });

    const project = await prismaClient.project.create({
      data: {
        name,
        repoUrl,
        description: idea.vision,
        ownerId: userId,
        status: "active",
        members: {
          create: idea.members.map((m) => ({
            userId: m.userId,
            role: m.userId === idea.ownerId ? "owner" : m.role === "owner" ? "co-owner" : m.role,
          })),
        },
      },
      include: {
        owner: { select: { id: true, name: true, image: true } },
        members: { include: { user: { select: { id: true, name: true, image: true } } } },
        _count: { select: { members: true } },
      },
    });

    // Add idea members as GitHub collaborators (non-blocking, errors don't fail the request)
    if (idea.members.length > 0) {
      const memberIds = idea.members.map((m) => m.userId);
      addGitHubCollaborators(userId, memberIds, repoUrl).catch((error) => {
        console.error("Failed to add GitHub collaborators:", error);
      });
    }

    await prismaClient.ideaTicket.update({
      where: { id },
      data: { status: "completed" },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error("Failed to create project from idea:", error);
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}