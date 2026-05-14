import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@/lib/prisma";
import { auth } from "@/lib/auth";

async function getUserId(request: NextRequest): Promise<string | null> {
  const session = await auth.api.getSession({ headers: request.headers });
  return session?.user?.id || null;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const projectId = searchParams.get("projectId");

  const where: Record<string, unknown> = {};
  if (category && category !== "all") where.category = category;
  if (projectId) where.projectId = projectId;

  try {
    const discussions = await prismaClient.discussion.findMany({
      where, include: {
        author: { select: { id: true, name: true, image: true } },
        project: { select: { id: true, name: true } },
        _count: { select: { comments: true } },
      },
      orderBy: { createdAt: "desc" }, take: 50,
    });
    return NextResponse.json(discussions);
  } catch { return NextResponse.json({ error: "Failed to list discussions" }, { status: 500 }); }
}

export async function POST(request: NextRequest) {
  const userId = await getUserId(request);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { title, content, category, projectId } = await request.json();
    if (!title || !content || !category) return NextResponse.json({ error: "Title, content, and category are required" }, { status: 400 });
    if (typeof title !== "string" || title.length > 300) return NextResponse.json({ error: "Invalid title" }, { status: 400 });
    if (typeof content !== "string" || content.length > 10000) return NextResponse.json({ error: "Content too long" }, { status: 400 });

    const validCategories = ["general", "help", "showcase", "feedback", "collaboration"];
    if (!validCategories.includes(category)) return NextResponse.json({ error: "Invalid category" }, { status: 400 });

    const discussion = await prismaClient.discussion.create({
      data: { title, content, category, projectId: projectId || null, authorId: userId },
      include: { author: { select: { id: true, name: true, image: true } }, _count: { select: { comments: true } } },
    });
    return NextResponse.json(discussion, { status: 201 });
  } catch { return NextResponse.json({ error: "Failed to create discussion" }, { status: 500 }); }
}
