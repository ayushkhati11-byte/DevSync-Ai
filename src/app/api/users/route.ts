import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");

  if (!query || query.length < 2) return NextResponse.json({ users: [] });

  try {
    const users = await prismaClient.user.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { bio: { contains: query, mode: "insensitive" } },
        ],
      },
      select: { id: true, name: true, image: true, bio: true, _count: { select: { ownedProjects: true } } },
      take: 20,
    });
    return NextResponse.json({ users });
  } catch {
    return NextResponse.json({ error: "Failed to search users" }, { status: 500 });
  }
}