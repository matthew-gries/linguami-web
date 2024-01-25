'use client';

import { CSSProperties } from "react";
import styles from "./ChatList.module.css";
import { Chat, ChatText, Conversation } from "@prisma/client";
import { tts } from "@/lib/tts";

type ChatType = Chat & {chatTexts: ChatText[]};

type ConversationType = Conversation & {
  chats: ChatType[]
}

type Props = {
  conversation: ConversationType
};

const OPENAI_SENDER_TAG = 'OPENAI_SENDER';

export function ChatList({conversation }: Props) {

  function getChatListItem(chat: ChatType, isLastItem: boolean) {

    const chatBubbleStyle: CSSProperties = {};

    // Assistant is the sender, their messages are on the left
    if (chat.senderId.indexOf(OPENAI_SENDER_TAG) !== -1) {
      chatBubbleStyle.float = 'left';
      chatBubbleStyle.backgroundColor = '#949593';
      chatBubbleStyle.marginRight = '7em';
    } else {
      // User is the sender, their messages are on the right
      chatBubbleStyle.textAlign = 'right';
      chatBubbleStyle.float = 'right';
      chatBubbleStyle.backgroundColor = '#0099ff';
      chatBubbleStyle.marginLeft = '7em';
    }

    const id = (isLastItem) ? "last-chat" : undefined;

    const s = chat.chatTexts.map(chatText => chatText.text).join();
    
    return <li id={id} onClick={() => tts(s)} className={styles.chat} style={chatBubbleStyle} key={chat.id}>{s}</li>;
  }

  function getChatList() {

    const chats = [];

    for (let i = 0; i < conversation.chats.length; i++) {
      chats.push(getChatListItem(conversation.chats[i], i === conversation.chats.length - 1));
    }

    return chats;
  }

  return (
    <ul id="chat-list" className={styles.chatList}>
      {getChatList()}
    </ul>
  );
}