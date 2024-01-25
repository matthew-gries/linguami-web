'use client';

import { ConversationPostRequestData } from "@/app/api/conversation/route";
import { User } from "@prisma/client";
import { useRouter } from "next/navigation";
import React, { useState, useTransition } from "react";
import styles from "./CreateConversationForm.module.css";

type Props = {
  user: User,
  closeDialogCallback: () => void
};

// TODO give callback to close dialog upon submit
export function CreateConversationForm({ user, closeDialogCallback }: Props) {

  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isFetching, setIsFetching] = useState(false);

  const isMutating = isFetching || isPending;

  async function createNewConversation(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    // TODO how to handle errors
    const title = formData.get('title')!.toString();
    const targetLanguage = formData.get('targetLanguage')!.toString();

    const body: ConversationPostRequestData = {
      title,
      targetLanguage,
      userId: user.id
    };

    setIsFetching(true);

    const res = await fetch('/api/conversation', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    setIsFetching(false);

    const c = await res.json();

    console.log(`Conversation ${JSON.stringify(c)} created successfully`);

    closeDialogCallback();

    startTransition(() => {
      router.push(`/conversations/${c.id}`);
      router.refresh();
    })
  }

  return (
    <form className={styles.formRoot} onSubmit={createNewConversation}>
      <label className={styles.formLabel} htmlFor="title">Title</label>
      <input className={styles.formInput} type="text" id="title" name="title"></input>
      <label className={styles.formLabel} htmlFor="targetLanguage">Target Language</label>
      <select className={styles.formInput} name="targetLanguage" id="targetLanguage">
        <option value="fr">French</option>
      </select>
      <input className={styles.formSubmit} type="submit" value="Submit" disabled={!!isMutating} />
    </form>
  )
}