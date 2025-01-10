"use client";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";

import PageLoaded from "./pageLoaded";
import PageSkeleton from "./pageLoading";

import User from "@/model/Users";
import { auth, db } from "@/firebase";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

function UserProfilePage({ name }: Readonly<{ name: string }>) {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(initializeUserSession(router, name, setUser), [router]);

  if (!name) return null;

  return <div>{user ? <PageLoaded user={user} /> : <PageSkeleton />}</div>;
}

export default UserProfilePage;
function initializeUserSession(router: AppRouterInstance, name: string, setUser: Dispatch<SetStateAction<User | null>>) {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    if (!user) {
      router.push("/login");
    }
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
  });

  return () => {
    unsubscribe();

  };
}

