"use client";
import { useEffect, useState } from "react";
import { collection, addDoc, query, onSnapshot, orderBy, getDocs, QuerySnapshot, doc, where, Timestamp, updateDoc, getDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { randomBytes, randomUUID } from "crypto";

type Props = {
    eventID: string;
    userId: string;
};

interface Message {
    uid: string,
    useruid: string,
    message: string,
    timestamps: Timestamp
}

interface ChatInterface {
    eventID: string,
    messages: Message[]
}

export const Chat: React.FC<Props> = ({ eventID, userId }: Props) => {
    const [messages, setMessage] = useState<Message[]>([]);
    const [myMessage, setMyMessage] = useState<string>("");

    useEffect(() => {
        const q = query(collection(db, "chats"), where("eventID", "==", eventID) && orderBy("timestamp", "asc"));

        const unsubscribe = onSnapshot(q, () => {
            getDocs(q).then((snap) => {
                snap.forEach((doc) => {
                    let chat = doc.data() as ChatInterface;
                    setMessage(chat.messages);
                });
            });
        })

        const q2 = query(collection(db, "chats"), where("eventID", "==", eventID));
    
        getDocs(q2).then((snap) => {
            snap.forEach((doc) => {
                let chat = doc.data() as ChatInterface;
                chat.messages.forEach((m) => {
                    m.uid = randomBytes(1024) as unknown as string;
                })
                setMessage(chat.messages);
            });
        });
        return () => unsubscribe();
    }, [messages, setMessage])

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
            newMessage.useruid = "magic useless"
            chat.messages.push(newMessage)
            updateDoc(doc(db, "chats", eventID), { ...chat })
            setMyMessage("");
        })
      };

    if (!messages) {
        return (<></>)
    }

    return (
        <div>
            <div>
                {messages.map((m) => (
                    <p key={m.uid}>{m.timestamps.toDate().toDateString()}:{m.message}</p>
                ))}
            </div>
            <input
                type="text"
                value={myMessage}
                onChange={(e) => setMyMessage(e.target.value)}
                placeholder="Écrire un message..."
            />
            <button onClick={sendMessage}>Envoyer</button>
        </div>
    );
}

export default Chat