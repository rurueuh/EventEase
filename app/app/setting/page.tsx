"use client";

import { useState, useEffect } from "react";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";

import SettingLoaded from "./pageLoaded";
import PageSkeleton from "./pageLoading";

import User from "@/model/Users";
import { auth } from "@/firebase";

const db = getFirestore();

export default function Settings() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    age: "",
    location: "",
    job: "",
    description: "",
    aboutPhone: "",
    aboutLocationAddress: "",
    aboutEmail: "",
    aboutWebsite: "",
    basicInfoBirthDate: "",
    basicInfoGender: "",
    basicInfoRelationshipStatus: "",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const userRef = doc(db, "users", user.uid);

        getDoc(userRef).then((docSnap) => {
          if (docSnap.exists()) {
            let user = docSnap.data() as User;

            setFormData({
              username: user.username,
              age: user.age ? user.age.toString() : "",
              location: user.location ?? "",
              job: user.job ?? "",
              description: user.description ?? "",
              aboutPhone: user.aboutPhone ?? "",
              aboutLocationAddress: user.aboutLocationAddress ?? "",
              aboutEmail: user.aboutEmail ?? "",
              aboutWebsite: user.aboutWebsite ?? "",
              basicInfoBirthDate:
                (user.basicInfoBirthDate as unknown as string) || "",
              basicInfoGender: user.basicInfoGender ?? "",
              basicInfoRelationshipStatus:
                user.basicInfoRelationshipStatus ?? "",
            });
            setLoading(false);
          }
        });
      } else {
        router.push("/login");
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <PageSkeleton />;
  }

  return <SettingLoaded formData={formData} setFormData={setFormData} />;
}
