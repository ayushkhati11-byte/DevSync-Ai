import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { createNotification } from "@/lib/notifications";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { content } = await request.json();
    if (!content) return NextResponse.json({ error: "Content is required" }, { status: 400 });
    if (typeof content !== "string" || content.length > 5000) return NextResponse.json({ error: "Content too long" }, { status: 400 });

    const discussion = await prismaClient.discussion.findUnique({ where: { id } });
    if (!discussion) return NextResponse.json({ error: "Discussion not found" }, { status: 404 });

    const comment = await prismaClient.comment.create({
      data: { content, authorId: session.user.id, discussionId: id },
      include: { author: { select: { id: true, name: true, image: true } } },
    });

    if (discussion.authorId !== session.user.id) {
      await createNotification({
        userId: discussion.authorId,
        type: "comment_reply",
        title: "New comment",
        message: `${session.user.name || "Someone"} commented on "${discussion.title}"`,
        link: `/forum/${id}`,
        commentId: comment.id,
      });
    }

    return NextResponse.json(comment, { status: 201 });
  } catch { return NextResponse.json({ error: "Failed to create comment" }, { status: 500 }); }
}
