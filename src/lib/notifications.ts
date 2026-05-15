import { prismaClient } from "@/lib/prisma";

type NotificationType = 
  | "collab_request" 
  | "collab_accepted" 
  | "collab_rejected" 
  | "idea_joined" 
  | "comment_reply"
  | "member_added";

export async function createNotification({
  userId,
  type,
  title,
  message,
  link,
  commentId,
}: {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  commentId?: string;
}) {
  try {
    await prismaClient.notification.create({
      data: {
        userId,
        type,
        title,
        message,
        link,
        commentId,
      },
    });
  } catch (error) {
    console.error("Failed to create notification:", error);
  }
}