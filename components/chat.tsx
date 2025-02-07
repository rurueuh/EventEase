"use client";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { collection, query, onSnapshot, orderBy, getDocs, doc, where, Timestamp, updateDoc, getDoc, Query, DocumentData } from "firebase/firestore";
import { db } from "@/firebase";
import { randomBytes } from "crypto";
import { Textarea } from "@heroui/input";
import { Card, CardBody, Chip, Spacer } from "@heroui/react";
import Image from "next/image";

type Props = {
    eventID: string;
    userId: string;
};

interface Message {
    useruid: string,
    username: string,
    message: string,
    timestamps: Timestamp
}

interface ChatInterface {
    eventID: string,
    messages: Message[]
}

export const Chat: React.FC<Props> = ({ eventID, userId }: Props) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [myMessage, setMyMessage] = useState<string>("");

    useEffect(() => {
        const q = query(collection(db, "chats"), where("eventID", "==", eventID) && orderBy("timestamp", "asc"));

        const unsubscribe = subscribeToChat(q, setMessages)

        const q2 = query(collection(db, "chats"), where("eventID", "==", eventID));

        fetchAndSetChatMessages(q2, setMessages);
        return () => unsubscribe();
    }, [messages, setMessages])

    const sendMessage = async () => {
        if (!myMessage)
            return;
        if (myMessage.trim() === "") return;


        getDoc(doc(db, "chats", eventID)).then((snap) => {
            let chat = snap.data() as ChatInterface;
            let newMessage = {} as Message;
            newMessage.message = myMessage;
            newMessage.useruid = userId;
            newMessage.timestamps = Timestamp.now()
            chat.messages.push(newMessage)
            updateDoc(doc(db, "chats", eventID), { ...chat })
            setMyMessage("");
        })
    };

    if (!messages) {
        return (<></>)
    }

    return (
        <Card>
            <CardBody>
                <div className="flex flex-col max-h-[500px] overflow-y-scroll  will-change-scroll">
                    {messages.map((m) => (
                        <Chip radius="lg" className="h-max p-2 m-2" color={m.useruid === userId ? "primary" : "default"} key={randomBytes(1024) as unknown as string}>
                            <div className="flex">
                                <div className=" min-w-[36px] mr-3 mt-0.5">
                                    <Image height={36} width={36} alt={"profile picture of".concat("e")} src="/profile.webp" />
                                </div>
                                <div className="max-w-full">
                                    <p className=" text-wrap">{m.message}</p>
                                    <p className="text-[0.5rem] text-slate-300">de {m.username ?? "inconnu"}, le {m.timestamps.toDate().toUTCString()}</p>
                                </div>
                            </div>
                        </Chip>
                    ))}
                </div>
                <Spacer y={3} />
                <Textarea
                    isClearable
                    placeholder="Écrire un message..."
                    variant="bordered"
                    value={myMessage}
                    onChange={(e) => setMyMessage(e.target.value)}
                    onClear={() => setMyMessage("")}
                />
                <button onClick={sendMessage}>Envoyer</button>
            </CardBody>
        </Card>
    );
}

export default Chat

function subscribeToChat(q: Query<DocumentData, DocumentData>, setMessages: Dispatch<SetStateAction<Message[]>>) {
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
    setMessages: Dispatch<SetStateAction<Message[]>>
) {
    getDocs(q2).then((snap) => {
        snap.forEach((doc) => {
            let chat = doc.data() as ChatInterface;

            setMessages(chat.messages);
        });
    });
}
