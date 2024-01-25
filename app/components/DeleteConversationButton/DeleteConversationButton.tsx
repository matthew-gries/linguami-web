'use client';

import { Conversation } from "@prisma/client";
import styles from "./DeleteConversationButton.module.css";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ConversationDeleteRequestData } from "@/app/api/conversation/route";

type Props = {
  conversation: Conversation 
};

export function DeleteConversationButton({ conversation }: Props) {

  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isFetching, setIsFetching] = useState(false);

  const isMutating = isFetching || isPending;

  async function deleteConversation() {

    const body: ConversationDeleteRequestData = {
      conversationId: conversation.id
    };

    setIsFetching(true);

    const res = await fetch('/api/conversation', {
      method: 'DELETE',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    setIsFetching(false);

    const convo = await res.json();

    console.log(`Conversation ${JSON.stringify(convo)} deleted successfully`);

    startTransition(() => {
      router.refresh();
      setIsOpen(false);
    })
  }

  function renderModalContent() {
    return (
      <div className={styles.modalWrapper}>
        <div className={styles.modalContent}>
          <h2 className={styles.modalTitle}>Delete Conversation</h2>
          <p>Are you sure you want to delete this conversation?</p>
          <div className={styles.buttonsContainer}>
            <button className={styles.okButton} onClick={deleteConversation} disabled={isMutating}>Ok</button>
            <button className={styles.cancelButton} disabled={isMutating} onClick={() => setIsOpen(false)}>Back</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.modalRoot}>
      <button className={styles.modalButton} onClick={() => setIsOpen(true)}>
        X
      </button>
      {isOpen ? renderModalContent() : <></>}
    </div>
  );
}