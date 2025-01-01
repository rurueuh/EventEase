import { redirect } from "next/navigation";
import { getCookie } from "cookies-next";

import { admin } from "@/lib/firebaseAdmin";

export default async function validateClient(): Promise<boolean> {
  const token = await getCookie("token");

  if (!token) {
    redirect("/login");
  }

  try {
    await admin.auth().verifyIdToken(token);
  } catch (__event) {
    redirect("/login");
  }

  return true;
}
