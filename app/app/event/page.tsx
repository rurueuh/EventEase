"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

import { auth, db } from "@/firebase";
import User from "@/model/Users";
import PageLoaded from "./pageLoaded";
import PageSkeleton from "./pageSkeleton";

const Home: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const userRef = doc(db, "users", user.uid);

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
    <div>{user ? <PageLoaded _user={user} /> : <PageSkeleton />}</div>
  );
};

export default Home;
