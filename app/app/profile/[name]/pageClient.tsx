"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";

import PageLoaded from "./pageLoaded";
import PageSkeleton from "./pageLoading";

import User from "@/model/Users";
import { auth, db } from "@/firebase";

function _home({
  name,
}: {
  name: string
}) {
  if (!name) return null;
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const allUsers = collection(db, "users");
        const querySnapshot = getDocs(allUsers);
        querySnapshot.then((snapshot) => {
          snapshot.forEach((doc) => {
            if (doc.data().username === name) {
              let user = doc.data() as User;
              setUser(user);
            }
          });
        });

      } else {
        router.push("/login");
      }
    });

    return () => unsubscribe();
  }, [router]);

  return <div>{user ? <PageLoaded user={user} /> : <PageSkeleton />}</div>;
};

export default _home;
