'use client';

import { ChatPostRequestData } from "@/app/api/chat/route";
import { OpenAIPostRequestData } from "@/app/api/openai/route";
import { Chat, ChatText, Conversation } from "@prisma/client";
import { useRouter } from "next/navigation";
import { CSSProperties, useEffect, useState, useTransition } from "react";
import styles from "./CreateChatForm.module.css";
import { tts } from "@/lib/tts";

type ChatType = Chat & {chatTexts: ChatText[]};

type ConversationType = Conversation & {
  chats: ChatType[]
}

type Props = {
  conversation: ConversationType
  lastOrdinal: number | null
};

const OPENAI_SENDER_TAG = 'OPENAI_SENDER';

export function CreateChatForm({ conversation, lastOrdinal }: Props) {

  // const isBrowser = () => typeof window !== 'undefined'; //The approach recommended by Next.js

  // const SpeechRecognition = (isBrowser()) ? window.SpeechRecognition || window.webkitSpeechRecognition : undefined;
  
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isFetching, setIsFetching] = useState(false);
  const [isRecording, setRecording] = useState(false);
  const [speechRec, setSpeechRec] = useState<any>(null);

  const isMutating = isFetching || isRecording || isPending;

  useEffect(() => {
    scrollToBottom();
  });

  useEffect(() => {
    setupSpeechRecognition();
  }, []);

  function setupSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {

      const speechRec = new SpeechRecognition();
      speechRec.lang = 'fr-FR';

      speechRec.onstart = function(event) {
        console.log("SpeechRecognition start:", event);
      }

      speechRec.onspeechstart = function(event) {
        console.log("SpeechRecognition speech start:", event);
      }

      speechRec.onaudiostart = function(event) {
        console.log("SpeechRecognition audio start:", event);
      }

      speechRec.onaudioend = function(event) {
        console.log("SpeechRecognition audio end:", event);
      }

      speechRec.onend = function(event) {
        console.log("SpeechRecognition end:", event);
      }

      speechRec.onsoundstart = function(event) {
        console.log("SpeechRecognition sound start:", event);
      }

      speechRec.onsoundend = function(event) {
        console.log("SpeechRecognition sound end:", event);
      }
    
      speechRec.onresult = function(event) {
    
        console.log("SpeechRecognition result: ", event);
        setRecording(false);
    
        const textAreaNode: any = document.getElementById("text-area")!;
        let result = "";
        if (event.results.length > 0) {
          if (event.results[0].length > 0) {
            result = event.results[0][0].transcript;
          }
        }
    
        textAreaNode.value = result;
      }
    
      speechRec.onspeechend = function(event) {

        console.log("SpeechRecognition speech end", event);
        setRecording(false);
  
        if (speechRec) {
          speechRec.stop();
        }
      }
    
      speechRec.onnomatch = function(event) {
        console.log("SpeechRecognition, no match: ", event);
      }
    
      speechRec.onerror = function(event) {
        console.error("SpeechRecognition error:", event);
      }

      setSpeechRec(speechRec);
    }
  }


  function scrollToBottom() {
    const divToScrollTo = document.getElementById("last-chat");

    if (divToScrollTo) {
      divToScrollTo.scrollIntoView({behavior: 'smooth'});
    }
  }

  async function createNewChat(e: React.FormEvent<HTMLFormElement>) {

    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    // TODO how to handle errors
    if (!formData.get('userText') || formData.get('userText')?.toString().length == 0) {
      return;
    }

    const text = formData.get('userText')!.toString();

    const ordinal = lastOrdinal !== null ? lastOrdinal + 1 : 0;

    const body: ChatPostRequestData = {
      text,
      conversationId: conversation.id,
      senderId: `User_${conversation.userId}`,
      ordinal
    };

    setIsFetching(true);

    const res = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const chat = await res.json();

    console.log(`Chat ${JSON.stringify(chat)} created successfully`);

    // This lets the chat we just posted render before getting OpenAI's response
    router.refresh();

    // TODO need to block form when getting chat from OpenAI
    console.log("Fetching new chat from OpenAI with current conversation: ", conversation);

    const bodyOpenAi: OpenAIPostRequestData = {
      chats: conversation?.chats!,
      chatToRespondTo: text
    };

    const resOpenAi = await fetch('/api/openai', {
      method: 'POST',
      body: JSON.stringify(bodyOpenAi),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const newChat: {role: string, content: string} = await resOpenAi.json();

    console.log("New chat from OpenAI: ", newChat);

    const bodyNewChat: ChatPostRequestData = {
      conversationId: conversation?.id!,
      ordinal: ordinal + 1,
      senderId: `${OPENAI_SENDER_TAG}_${conversation?.userId!}`,
      text: (newChat.content) ? newChat.content : "" 
    };

    const resChatPost = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify(bodyNewChat),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    setIsFetching(false);

    console.log(`Chat ${JSON.stringify(resChatPost)} created successfully`);

    startTransition(() => {
      router.refresh();
      scrollToBottom();
      tts(newChat.content);

      const textAreaNode: any = document.getElementById("text-area")!;
      textAreaNode.value = "";
    });
  }

  function handleRecordButtonPressed() {
    if (isRecording) {
      stopRecordingSpeech();
      setRecording(false);
    } else {
      setRecording(true);
      startRecordingSpeech();
    }
  }

  function startRecordingSpeech() {

    const textAreaNode: any = document.getElementById("text-area")!;
    textAreaNode.value = "";

    if (speechRec) {
      console.log("Starting speech rec: ", speechRec);
      speechRec.start();
    }
  }

  function stopRecordingSpeech() {

    if (speechRec) {
      speechRec.stop();
      console.log("Speech rec stopped");
    }
  }

  function getRecordingButtonStyle() {

    const style: CSSProperties = {};
    if (isRecording) {
      style.color = 'white';
      style.backgroundColor = 'red';
    }

    return style;
  }

  return (
    <form className={styles.formRoot} onSubmit={createNewChat}>
      <textarea id="text-area" className={styles.formInput} disabled={!!isMutating} name="userText" />
      <div className={styles.buttons}>
        <button className={styles.formSubmit} type="submit" disabled={!!isMutating}>Post</button>
        {(speechRec) ? (
          <button
            className={styles.recordButton}
            onClick={handleRecordButtonPressed}
            disabled={isFetching || isPending}
            style={getRecordingButtonStyle()}
          >
            {(isRecording) ? "Stop" : "Record"}
          </button>
        ) : null}
      </div>
    </form>
  );
}