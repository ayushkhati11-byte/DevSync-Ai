import { NextResponse } from "next/server";
import { prismaClient } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const count = await prismaClient.collaborationRequest.count({
    where: {
      status: "pending",
      project: { ownerId: session.user.id },
    },
  });

  return NextResponse.json({ count });
}
