import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@/lib/prisma";
import { auth } from "@/lib/auth";

async function getUserId(request: NextRequest): Promise<string | null> {
  const session = await auth.api.getSession({ headers: request.headers });
  return session?.user?.id || null;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const tech = searchParams.get("tech");
  const minScore = searchParams.get("minScore");
  const search = searchParams.get("search");

  const where: Record<string, unknown> = { status: "active" };
  if (tech) where.techStack = { path: "$", array_contains: tech };
  if (minScore) where.overallScore = { gte: parseInt(minScore) };
  if (search) where.OR = [
    { name: { contains: search, mode: "insensitive" } },
    { description: { contains: search, mode: "insensitive" } },
  ];

  try {
    const projects = await prismaClient.project.findMany({
      where, include: { owner: { select: { id: true, name: true, image: true } }, _count: { select: { members: true } } },
      orderBy: { createdAt: "desc" }, take: 50,
    });
    return NextResponse.json(projects);
  } catch {
    return NextResponse.json({ error: "Failed to list projects" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const userId = await getUserId(request);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { name, description, repoUrl, deploymentUrl, overallScore, codeQuality, documentation, bestPractices, performance, techStack, strengths, suggestions, summary, readme } = await request.json();
    if (!name || !repoUrl) return NextResponse.json({ error: "Name and repoUrl are required" }, { status: 400 });
    if (typeof name !== "string" || name.length > 200) return NextResponse.json({ error: "Invalid name" }, { status: 400 });
    if (typeof repoUrl !== "string" || repoUrl.length > 500 || !repoUrl.includes("github.com"))
      return NextResponse.json({ error: "Invalid repoUrl" }, { status: 400 });

    const existing = await prismaClient.project.findUnique({ where: { repoUrl } });
    if (existing) return NextResponse.json({ error: "Project already exists" }, { status: 409 });

    const project = await prismaClient.project.create({
      data: { name, description, repoUrl, deploymentUrl, ownerId: userId, overallScore, codeQuality, documentation, bestPractices, performance, techStack: techStack || [], strengths: strengths || [], suggestions: suggestions || [], summary, readme,
        members: { create: { userId, role: "owner" } },
      },
      include: { owner: { select: { id: true, name: true, image: true } }, _count: { select: { members: true } } },
    });

    return NextResponse.json(project, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}
