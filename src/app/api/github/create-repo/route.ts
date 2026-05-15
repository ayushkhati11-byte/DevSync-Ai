import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prismaClient } from "@/lib/prisma";
import { headers } from "next/headers";

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user?.id;

  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const account = await prismaClient.account.findFirst({ where: { userId, providerId: "github" } });
  if (!account?.accessToken) return NextResponse.json({ error: "No GitHub token found" }, { status: 400 });

  try {
    const { name, description, isPrivate } = await request.json();
    if (!name) return NextResponse.json({ error: "Repo name is required" }, { status: 400 });

    const repoName = name.toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-");
    
    const res = await fetch("https://api.github.com/user/repos", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${account.accessToken}`,
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: repoName,
        description: description || "",
        private: isPrivate ?? false,
        auto_init: true,
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      return NextResponse.json({ error: err.message || "Failed to create repo" }, { status: res.status });
    }

    const repo = await res.json();
    return NextResponse.json({ url: repo.html_url, fullName: repo.full_name });
  } catch (error) {
    console.error("GitHub repo creation error:", error);
    return NextResponse.json({ error: "Failed to create repository" }, { status: 500 });
  }
}