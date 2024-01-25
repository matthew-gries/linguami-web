import { getServerSession } from "next-auth";
import { authOptions } from '../auth/[...nextauth]/authOptions';
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export type ConversationPostRequestData = {
  title: string;
  targetLanguage: string;
  userId: string;
};

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.error();
  }

  const data: ConversationPostRequestData = await req.json();

  const conversation = await prisma.conversation.create({
    data: {
      title: data.title,
      targetLanguage: data.targetLanguage,
      user: {
        connect: {
          id: data.userId
        }
      }
    }
  });

  return NextResponse.json(conversation);
}

export type ConversationDeleteRequestData = {
  conversationId: string
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.error();
  }

  const data: ConversationDeleteRequestData = await req.json();

  const res = await prisma.conversation.delete({
    where: {
      id: data.conversationId
    }
  });

  return NextResponse.json(res);
}