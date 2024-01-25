import { getServerSession } from "next-auth";
import { authOptions } from '../auth/[...nextauth]/authOptions';
import { NextResponse } from "next/server";
import { Chat, ChatText, User } from "@prisma/client";
import { openai } from "@/lib/openai";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";

type ChatType = Chat & {chatTexts: ChatText[]};

export type OpenAIPostRequestData = {
  chats: ChatType[],
  chatToRespondTo: string
};

const OPENAI_SENDER_TAG = 'OPENAI_SENDER';

// TODO language should depend on what the user selects
const SYSTEM_MESSAGE: ChatCompletionMessageParam = {
  role: "system",
  content: "You are a french teacher, speaking in french to a student who is learning french"
}

const MODEL = 'gpt-3.5-turbo';

function convertChatTypeToChatCompletionMessageParam(chat: ChatType): ChatCompletionMessageParam {
  
  const role = (chat.senderId.indexOf(OPENAI_SENDER_TAG) < 0) ? 'user' : 'assistant';
  // Assume this is already sorted
  const content = chat.chatTexts.reduce((acc, currentValue) => {
    return acc + currentValue.text;
  }, "");

  return {
    role,
    content
  };
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.error();
  }

  const data: OpenAIPostRequestData = await req.json();

  const messages = data.chats.map(convertChatTypeToChatCompletionMessageParam);
  messages.unshift(SYSTEM_MESSAGE);
  if (messages[messages.length - 1].role !== 'user') {
    messages.push({
      role: 'user',
      content: data.chatToRespondTo
    });
  }

  console.log("messages: ", messages);

  let chatCompletion;
  try {
    chatCompletion = await openai.chat.completions.create({
      messages,
      model: MODEL,
    });
  } catch (e) {
    console.error(e);
    throw e;
  }

  if (chatCompletion.choices.length < 1) {
    throw new Error("No chat completion choices");
  }

  const newChat = chatCompletion.choices[0].message!;

  // TODO do some validation
  return NextResponse.json({
    role: newChat.role,
    content: newChat.content
  });
}