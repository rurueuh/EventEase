"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { getDoc, doc, DocumentReference } from "firebase/firestore";

// import PageLoaded from "./pageUserInEvent";
import PageSkeleton from "./pageLoading";

import User from "@/model/Users";
import { auth, db } from "@/firebase";
import Event from "@/model/Event";
import PageLoadedNotInEvent from "./pageUserNotInEvent";

function EventDetailsPage({ name }: Readonly<{ name: string }>): JSX.Element {
  const [user, setUser] = useState<User | null>(null);
  const [userDocs, setUserDocs] = useState<DocumentReference | null>(null);
  const [event, setEvent] = useState<Event | null>(null);
  const [eventDocs, setEventDocs] = useState<DocumentReference | null>(null);
  const [participants, setParticipants] = useState<User[]>([]);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const userRef = doc(db, "users", user.uid);
        setUserDocs(userRef);

        getDoc(userRef).then((docSnap) => {
          if (docSnap.exists()) {
            let user = docSnap.data() as User;

            const eventRef = doc(db, "events", name);
            setEventDocs(eventRef);
            getDoc(eventRef).then((docSnap) => {
              if (docSnap.exists()) {
                let event = docSnap.data() as Event;
                // get all participants
                event.attendees.forEach(async (attendee) => {
                  const attendeeDoc = await getDoc(attendee);
                  if (attendeeDoc.exists()) {
                    let participant = attendeeDoc.data() as User;
                    setParticipants((prev) => [...prev, participant]);
                  }
                });
                setEvent(event);
                setUser(user);
              }
            });
          }
        });
      } else {
        router.push("/login");
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (!name) return <PageSkeleton />;

  if (!user) return <PageSkeleton />;
  if (!event) return <PageSkeleton />;
  if (!userDocs) return <PageSkeleton />;
  if (!eventDocs) return <PageSkeleton />;
  return <div>{participants ? <PageLoadedNotInEvent _user={user} userDocs={userDocs} event={event} eventDocs={eventDocs} participants={participants} /> : <PageSkeleton />}</div>;
}

export default EventDetailsPage;
