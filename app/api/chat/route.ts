import { getServerSession } from "next-auth";
import { authOptions } from '../auth/[...nextauth]/authOptions';
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export type ChatPostRequestData = {
  conversationId: string;
  senderId: string;
  // TODO need to validate how much text is ok to send, and how much to chunk
  text: string;
  ordinal: number;
};

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.error();
  }

  const data: ChatPostRequestData = await req.json();

  const chat = await prisma.chat.create({
    data: {
      ordinal: data.ordinal,
      senderId: data.senderId,
      conversation: {
        connect: {
          id: data.conversationId
        }
      },
      chatTexts: {
        // TODO if we decide to chunk the text data, this should me createMany with correct ordinals
        create: {
          ordinal: 0,
          text: data.text
        }
      }
    }
  });

  // TODO do we want to have the API get a chat from ChatGPT here? Should this be a separate API?
  return NextResponse.json(chat);
}