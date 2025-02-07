"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { getDoc, doc, DocumentReference } from "firebase/firestore";

import PageSkeleton from "./pageLoading";
import PageLoadedNotInEvent from "./pageUserNotInEvent";
import PageLoadedInEvent from "./pageUserInEvent";

import User from "@/model/Users";
import { auth, db } from "@/firebase";
import Event from "@/model/Event";

function EventDetailsPage({
  eventID,
}: Readonly<{ eventID: string }>): JSX.Element {
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

            const eventRef = doc(db, "events", eventID);

            setEventDocs(eventRef);
            getDoc(eventRef).then((docSnap) => {
              if (docSnap.exists()) {
                let event = docSnap.data() as Event;

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

  if (!eventID) return <PageSkeleton />;

  if (!user) return <PageSkeleton />;
  if (!event) return <PageSkeleton />;
  if (!userDocs) return <PageSkeleton />;
  if (!eventDocs) return <PageSkeleton />;

  let isUserInEvent = participants.filter((u) => {
    if (u.uid == user.uid) return true;

    return false;
  });

  if (isUserInEvent.length != 0) {
    return (
      <div>
        {participants ? (
          <PageLoadedInEvent
            _user={user}
            event={event}
            eventDocs={eventDocs}
            participants={participants}
            userDocs={userDocs}
          />
        ) : (
          <PageSkeleton />
        )}
      </div>
    );
  }

  return (
    <div>
      {participants ? (
        <PageLoadedNotInEvent
          _user={user}
          event={event}
          eventDocs={eventDocs}
          participants={participants}
          userDocs={userDocs}
        />
      ) : (
        <PageSkeleton />
      )}
    </div>
  );
}

export default EventDetailsPage;
