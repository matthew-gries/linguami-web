import { prisma } from "@/lib/prisma";
import Link from "next/link";
import styles from "./ConversationList.module.css";
import CreateConversationButton from "../CreateConversationButton";
import { User } from "@prisma/client";
import DeleteConversationButton from "../DeleteConversationButton";

type Props = {
  user: User
};

export async function ConversationList({ user }: Props) {

  const conversations = await prisma.conversation.findMany({
    where: { userId: user.id }
  });

  function getConversations() {
    if (conversations.length === 0) {
      return (
        <p className={styles.emptyListText}>
          Create a conversation to get started!
        </p>
      );
    }

    return conversations.map(c => (
      <div key={c.id} className={styles.row}>
        <Link className={styles.rowEntry} href={`conversations/${c.id}`}>{c.title}</Link>
        <DeleteConversationButton conversation={c} />
      </div>
    ));
  }

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <h3 className={styles.headerText}>
          Conversations
        </h3>
        <div className={styles.buttonContainer}>
          <CreateConversationButton user={user} />
        </div>
      </div>
      <div className={styles.body}>
        {getConversations()}
      </div>
    </div>
  );
}