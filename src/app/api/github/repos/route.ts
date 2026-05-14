import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prismaClient } from "@/lib/prisma";
import { headers } from "next/headers";

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const account = await prismaClient.account.findFirst({ where: { userId: session.user.id, providerId: "github" } });
  if (!account?.accessToken) return NextResponse.json({ error: "No GitHub token found" }, { status: 400 });

  try {
    const res = await fetch("https://api.github.com/user/repos?per_page=100&sort=updated&type=owner", {
      headers: { Authorization: `Bearer ${account.accessToken}`, Accept: "application/vnd.github.v3+json" },
    });
    if (!res.ok) return NextResponse.json({ error: "Failed to fetch repos" }, { status: 502 });

    const repos = await res.json();
    const filtered = (Array.isArray(repos) ? repos : []).map((r: any) => ({
      id: r.id, name: r.full_name, url: r.html_url, description: r.description, language: r.language, stars: r.stargazers_count, updatedAt: r.updated_at,
    }));
    return NextResponse.json(filtered);
  } catch { return NextResponse.json({ error: "Failed to fetch repos" }, { status: 500 }); }
}
