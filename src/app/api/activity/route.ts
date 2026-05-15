import { NextResponse } from "next/server";
import { prismaClient } from "@/lib/prisma";

export async function GET() {
  try {
    const [recentProjects, recentIdeas, recentDiscussions] = await Promise.all([
      prismaClient.project.findMany({
        take: 5, orderBy: { createdAt: "desc" },
        select: { id: true, name: true, createdAt: true, owner: { select: { name: true, image: true } } },
      }),
      prismaClient.ideaTicket.findMany({
        take: 5, orderBy: { createdAt: "desc" },
        select: { id: true, title: true, createdAt: true, owner: { select: { name: true, image: true } } },
      }),
      prismaClient.discussion.findMany({
        take: 5, orderBy: { createdAt: "desc" },
        select: { id: true, title: true, createdAt: true, author: { select: { name: true, image: true } }, category: true },
      }),
    ]);

    const activity = [
      ...recentProjects.map(p => ({ type: "project", id: p.id, name: p.name, createdAt: p.createdAt, user: p.owner })),
      ...recentIdeas.map(i => ({ type: "idea", id: i.id, name: i.title, createdAt: i.createdAt, user: i.owner })),
      ...recentDiscussions.map(d => ({ type: "discussion", id: d.id, name: d.title, createdAt: d.createdAt, category: d.category, user: d.author })),
    ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 15);

    return NextResponse.json({ activity });
  } catch {
    return NextResponse.json({ error: "Failed to fetch activity" }, { status: 500 });
  }
}