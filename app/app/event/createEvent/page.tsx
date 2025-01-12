"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import {
  doc,
  DocumentData,
  DocumentReference,
  getDoc,
} from "firebase/firestore";

import PageLoaded from "./pageLoaded";
import PageSkeleton from "./pageSkeleton";

import { auth, db } from "@/firebase";
import User from "@/model/Users";

const Home: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userRef, setUserRef] = useState<DocumentReference<
    DocumentData,
    DocumentData
  > | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const userRef = doc(db, "users", user.uid);

        setUserRef(userRef);

        getDoc(userRef).then((docSnap) => {
          if (docSnap.exists()) {
            let user = docSnap.data() as User;

            setUser(user);
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
      {user && userRef ? (
        <PageLoaded _user={user} userRef={userRef} />
      ) : (
        <PageSkeleton />
      )}
    </div>
  );
};

export default Home;
