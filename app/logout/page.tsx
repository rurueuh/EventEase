"use client";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase";
import { useRouter } from "next/navigation";
import { Card, Button, Spacer } from "@nextui-org/react";
import Image from "next/image";
import Link from "next/link";

// Icônes
import { AiOutlineLogout } from "react-icons/ai";

// Import des toasts
import { Toaster, toast } from "react-hot-toast";

const Logout: React.FC = () => {
  const router = useRouter();

  const handleLogout = async (): Promise<void> => {
    try {
      await signOut(auth);
      toast.success("Déconnexion réussie !");
      router.push("/login");
    } catch (error: any) {
      toast.error(error.message || "Une erreur est survenue lors de la déconnexion.");
    }
  };

  return (
    <div className="flex justify-center items-center">
      <Card className="p-5 max-w-[400px] w-full">
        <div>
          <div className="w-[100px] mb-[10px] block mx-auto">
            <Image
              src="/logo.webp"
              alt="Logo"
              width={100}
              height={100}
            />
          </div>
          <Spacer y={1} />
          <div>
            <h3>À bientôt sur EventEase !</h3>
          </div>
          <Spacer y={5} />
        </div>

        <Button
          className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white hover:opacity-90"
          variant="shadow"
          onPress={handleLogout}
        >
          <AiOutlineLogout className="mr-2 w-6 h-6" />
          Se déconnecter
        </Button>

        <Spacer y={3} />
        <p className="text-center">
          Vous n'avez pas de compte ?{" "}
          <Link href="/register" className="text-blue-500">
            Inscrivez-vous
          </Link>
        </p>
      </Card>
    </div>
  );
};

export default Logout;
