"use client";
import { randomBytes } from "crypto";

import {
  collection,
  query,
  onSnapshot,
  orderBy,
  getDocs,
  doc,
  where,
  Timestamp,
  getDoc,
  Query,
  DocumentData,
  setDoc,
} from "firebase/firestore";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Textarea } from "@heroui/input";
import { Card, CardBody, Chip, Spacer } from "@heroui/react";
import Image from "next/image";

import { db } from "@/firebase";

type Props = {
  eventID: string;
  userId: string;
};

interface Message {
  useruid: string;
  username: string;
  message: string;
  timestamps: Timestamp;
}

interface ChatInterface {
  eventID: string;
  messages: Message[];
}

export const Chat: React.FC<Props> = ({ eventID, userId }: Props) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [myMessage, setMyMessage] = useState<string>("");

  useEffect(() => {
    const q = query(
      collection(db, "chats"),
      where("eventID", "==", eventID) && orderBy("timestamp", "asc"),
    );

    const unsubscribe = subscribeToChat(q, setMessages);

    const q2 = query(collection(db, "chats"), where("eventID", "==", eventID));

    fetchAndSetChatMessages(q2, setMessages);

    return () => unsubscribe();
  }, [messages, setMessages]);

  const sendMessage = async () => {
    if (!myMessage) return;
    if (myMessage.trim() === "") return;

    try {
      getDoc(doc(db, "chats", eventID)).then((snap) => {
        let chat = (snap.data() as ChatInterface) || { eventID, messages: [] };

        let newMessage = {} as Message;

        newMessage.message = myMessage;
        newMessage.useruid = userId;
        newMessage.timestamps = Timestamp.now();

        chat.messages.push(newMessage);
        setDoc(doc(db, "chats", eventID), { ...chat });
        setMyMessage("");
      });
    } catch (_e) {
      // handle error
    }
  };

  if (!messages) {
    return <></>;
  }

  return (
    <Card>
      <CardBody>
        <div className="flex flex-col max-h-[500px] overflow-y-scroll  will-change-scroll">
          {messages.map((m) => (
            <Chip
              key={randomBytes(1024) as unknown as string}
              className="h-max p-2 m-2"
              color={m.useruid === userId ? "primary" : "default"}
              radius="lg"
            >
              <div className="flex">
                <div className=" min-w-[36px] mr-3 mt-0.5">
                  <Image
                    alt={"profile picture of".concat("e")}
                    height={36}
                    src="/profile.webp"
                    width={36}
                  />
                </div>
                <div className="max-w-full">
                  <p className=" text-wrap">{m.message}</p>
                  <p className="text-[0.5rem] text-slate-300">
                    de {m.username ?? "inconnu"}, le{" "}
                    {m.timestamps.toDate().toUTCString()}
                  </p>
                </div>
              </div>
            </Chip>
          ))}
        </div>
        <Spacer y={3} />
        <Textarea
          isClearable
          placeholder="Écrire un message..."
          value={myMessage}
          variant="bordered"
          onChange={(e) => setMyMessage(e.target.value)}
          onClear={() => setMyMessage("")}
        />
        <button onClick={sendMessage}>Envoyer</button>
      </CardBody>
    </Card>
  );
};

export default Chat;

function subscribeToChat(
  q: Query<DocumentData, DocumentData>,
  setMessages: Dispatch<SetStateAction<Message[]>>,
) {
  return onSnapshot(q, () => {
    getDocs(q).then((snap) => {
      snap.forEach((doc) => {
        let chat = doc.data() as ChatInterface;

        setMessages(chat.messages);
      });
    });
  });
}

function fetchAndSetChatMessages(
  q2: Query<DocumentData, DocumentData>,
  setMessages: Dispatch<SetStateAction<Message[]>>,
) {
  getDocs(q2).then((snap) => {
    snap.forEach((doc) => {
      let chat = doc.data() as ChatInterface;

      setMessages(chat.messages);
    });
  });
}
