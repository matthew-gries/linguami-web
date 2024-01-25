'use client';

import { User } from "@prisma/client";
import styles from "./CreateConversationButton.module.css";
import CreateConversationForm from "../CreateConversationForm";
import { useState } from "react";

type Props = {
  user: User 
};

export function CreateConversationButton({ user }: Props) {

  const [isOpen, setIsOpen] = useState(false);

  function renderModalContent() {
    return (
      <div className={styles.modalWrapper}>
        <div className={styles.modalContent}>
          <div className={styles.modalHeader}>
            <h2 className={styles.modalTitle}>Create Conversation</h2>
            <button className={styles.cancelButton} onClick={() => setIsOpen(false)}>Back</button>
          </div>
          <CreateConversationForm user={user} closeDialogCallback={() => setIsOpen(false)} />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.modalRoot}>
      <button className={styles.modalButton} onClick={() => setIsOpen(true)}>
        Create
      </button>
      {isOpen ? renderModalContent() : <></>}
    </div>
  );
}