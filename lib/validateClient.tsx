import { admin } from "@/lib/firebaseAdmin";
import { redirect } from "next/navigation";
import { getCookie } from "cookies-next";

export default async function validateClient(): Promise<boolean> {
    const token = await getCookie("token");
    if (!token) {
        redirect("/login");
    }

    try {
        await admin.auth().verifyIdToken(token);
    } catch (error) {
        redirect("/login");
    }
    return true;
}