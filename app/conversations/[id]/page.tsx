import CreateChatForm from "@/app/components/CreateChatForm";
import ServerSideAuthCheck from "@/app/components/ServerSideAuthCheck";
import { prisma } from "@/lib/prisma";
import { Chat, ChatText } from "@prisma/client";
import styles from "./page.module.css";
import ChatList from "@/app/components/ChatList";

type Props = {
  params: {
    id: string;
  }
}

type ChatType = Chat & {chatTexts: ChatText[]};

export default async function Conversations({ params }: Props) {

  function getLastOrdinal(chats: ChatType[]) {
    if (chats.length === 0) {
      return null;
    }

    const lastChat = chats[chats.length - 1];
    return lastChat.ordinal;
  }

  // TODO error handling
  const conversation = await prisma.conversation.findUnique({
    where: {
      id: params.id
    },
    include: {
      chats: {
        orderBy: {
          ordinal: 'asc'
        },
        include: {
          chatTexts: {
            orderBy: {
              ordinal: 'asc'
            }
          }
        }
      }
    }
  });

  return (
    <ServerSideAuthCheck>
      <div className={styles.root}>
        <h2 className={styles.header}>{conversation?.title}</h2>
        <ChatList conversation={conversation!} />
        <CreateChatForm
          conversation={conversation!}
          lastOrdinal={getLastOrdinal(conversation?.chats!)}
        />
      </div>
    </ServerSideAuthCheck>
  )
}