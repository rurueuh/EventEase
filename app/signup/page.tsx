"use client";
import { useState } from "react";
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "@/firebase";
import { useRouter } from "next/navigation";
import { Card, Input, Button, Spacer, ButtonGroup } from "@nextui-org/react";
import Image from "next/image";
import Link from "next/link";

// Icônes
import { AiOutlineUserAdd } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";

// Import des toasts
import { Toaster, toast } from "react-hot-toast";

const Signup: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const router = useRouter();

  const handleSignup = async (): Promise<void> => {
    // On réinitialise le message d'erreur
    setError("");
    
    // Vérification de la confirmation de mot de passe
    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      toast.error("Les mots de passe ne correspondent pas.");
      return;
    }
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      toast.success("Compte créé avec succès !");
      router.push("/home");
    } catch (error: any) {
      const messageTranslated = {
        "auth/invalid-email": "Adresse email invalide.",
        "auth/user-disabled": "Utilisateur désactivé.",
        "auth/user-token-expired": "Session expirée.",
        "auth/too-many-requests": "Trop de requêtes. Réessayez plus tard.",
        "auth/operation-not-allowed": "Opération non autorisée.",
        "auth/email-already-in-use": "Adresse email déjà utilisée.",
        "auth/weak-password": "Mot de passe trop faible.",
        "auth/invalid-credential": "Identifiants invalides.",
        "auth/account-exists-with-different-credential": "Compte existant avec des identifiants différents.",
        "auth/credential-already-in-use": "Identifiants déjà utilisés.",
        "auth/user-not-found": "Utilisateur non trouvé.",
        "auth/wrong-password": "Mot de passe incorrect.",
        "auth/missing-password": "Mot de passe manquant.",
      } as Record<string, string>;
      setError(messageTranslated[error.code] || error.message || "An error occurred during login.");
      toast.error(messageTranslated[error.code] || error.message || "Une erreur est survenue lors de la création du compte.");
    }
  };

  const handleGoogleSignup = async (): Promise<void> => {
    // On réinitialise le message d'erreur
    setError("");
    const provider = new GoogleAuthProvider();

    try {
      await signInWithPopup(auth, provider);
      toast.success("Compte créé via Google !");
      router.push("/home");
    } catch (error: any) {
      setError(error.message || "Une erreur est survenue lors de l'inscription via Google.");
      toast.error(error.message || "Une erreur est survenue lors de l'inscription via Google.");
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
            <h3>Rejoindre EventEase</h3>
          </div>
          <Spacer y={5} />
        </div>

        {/* Champ email */}
        <Input
          fullWidth
          size="lg"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Spacer y={1} />

        {/* Champ mot de passe */}
        <Input
          fullWidth
          size="lg"
          placeholder="Mot de passe"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Spacer y={1} />

        {/* Champ confirmation mot de passe */}
        <Input
          fullWidth
          size="lg"
          placeholder="Confirmer le mot de passe"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <Spacer y={5} />

        {/* Boutons d'action (Email/Password ou Google) */}
        <ButtonGroup
          className="p-[1px] rounded-md overflow-hidden bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
        >
          <Button
            className="w-full !bg-transparent !text-white !border-none hover:!bg-transparent"
            color="primary"
            variant="shadow"
            onPress={handleSignup}
          >
            <AiOutlineUserAdd className="mr-2 w-6 h-6" />
            S'inscrire
          </Button>
          <Button
            className="w-full !bg-transparent !text-white !border-none hover:!bg-transparent"
            color="secondary"
            variant="shadow"
            onPress={handleGoogleSignup}
          >
            <FcGoogle className="mr-2 w-6 h-6" />
            Google
          </Button>
        </ButtonGroup>

        <Spacer y={1} />
        {error && <p className="text-red-500 text-center">{error}</p>}
        <p className="text-center">
          Vous avez déjà un compte ?{" "}
          <Link href="/login" className="text-blue-500">
            Se connecter
          </Link>
        </p>
      </Card>
    </div>
  );
};

export default Signup;
