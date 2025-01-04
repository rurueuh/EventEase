"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";

import PageLoaded from "./pageLoaded";
import PageSkeleton from "./pageSkeleton";

import { auth, db } from "@/firebase";
import User from "@/model/Users";
import Event from "@/model/Event";

const Home: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [position, setPosition] = useState({ lat: 0, lng: 0 });

  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const userRef = doc(db, "users", user.uid);

        getDoc(userRef).then((docSnap) => {
          if (docSnap.exists()) {
            let user = docSnap.data() as User;

            const eventsRef = collection(db, "events");
            const querySnapshot = getDocs(eventsRef);

            querySnapshot.then((querySnapshot) => {
              let events: Event[] = [];

              querySnapshot.forEach((doc) => {
                let event = doc.data() as Event;

                events.push(event);
              });
              navigator.geolocation.getCurrentPosition((position) => {
                let lat = 0,
                  lng = 0;

                lat = position.coords.latitude;
                lng = position.coords.longitude;
                setPosition({ lat: lat, lng: lng });
              });
              setEvents(events);
              setUser(user);
            });
          }
        });
      } else {
        router.push("/login");
      }
    });

    return () => unsubscribe();
  }, [router]);

  return (
    <div>
      {user ? (
        <PageLoaded _user={user} events={events} position={position} />
      ) : (
        <PageSkeleton />
      )}
    </div>
  );
};

export default Home;
