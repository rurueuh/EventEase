"use client";
import { useState } from "react";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import {
  Card,
  Input,
  Button,
  Spacer,
  Divider,
  ButtonGroup,
} from "@heroui/react";
import Image from "next/image";
import Link from "next/link";
import { AiOutlineUser } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { setCookie } from "cookies-next";
import { toast } from "react-hot-toast";

import { auth } from "@/firebase";

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const router = useRouter();

  const handleLogin = async (): Promise<void> => {
    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      const user = userCred.user;
      const idToken = await user.getIdToken(true);

      setCookie("token", idToken);
      toast.success("Connexion réussie !");
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
        "auth/account-exists-with-different-credential":
          "Compte existant avec des identifiants différents.",
        "auth/credential-already-in-use": "Identifiants déjà utilisés.",
        "auth/user-not-found": "Utilisateur non trouvé.",
        "auth/wrong-password": "Mot de passe incorrect.",
        "auth/missing-password": "Mot de passe manquant.",
      } as Record<string, string>;

      setError(
        messageTranslated[error.code] ||
          error.message ||
          "An error occurred during login.",
      );
      toast.error(
        messageTranslated[error.code] ||
          error.message ||
          "Une erreur est survenue lors de la connexion.",
      );
    }
  };

  const handleGoogleLogin = async (): Promise<void> => {
    const provider = new GoogleAuthProvider();

    try {
      const userCred = await signInWithPopup(auth, provider);
      const user = userCred.user;

      toast.success("Connexion réussie !");
      const idToken = await user.getIdToken(true);

      setCookie("token", idToken);
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
        "auth/account-exists-with-different-credential":
          "Compte existant avec des identifiants différents.",
        "auth/credential-already-in-use": "Identifiants déjà utilisés.",
        "auth/user-not-found": "Utilisateur non trouvé.",
        "auth/wrong-password": "Mot de passe incorrect.",
        "auth/missing-password": "Mot de passe manquant.",
      } as Record<string, string>;

      setError(
        messageTranslated[error.code] ||
          error.message ||
          "An error occurred during login.",
      );
      toast.error(
        messageTranslated[error.code] ||
          error.message ||
          "Une erreur est survenue lors de la connexion.",
      );
    }
  };

  return (
    <div className="flex justify-center items-center">
      <Card className="p-5 max-w-[400px] w-full">
        <div>
          <div className="w-[100px] mb-[10px] block mx-auto">
            <Image alt="Logo" height={100} src="/logo.webp" width={100} />
          </div>
          <Spacer y={1} />
          <div>
            <h3>Bienvenue sur EventEase</h3>
          </div>
          <Spacer y={5} />
        </div>

        <Input
          fullWidth
          placeholder="Email"
          size="lg"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Spacer y={1} />
        <Input
          fullWidth
          placeholder="Mot de passe"
          size="lg"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Spacer y={5} />
        <Divider />
        <Spacer y={5} />

        <ButtonGroup className="p-[1px] rounded-md overflow-hidden bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
          <Button
            className="w-full !bg-transparent !text-white !border-none hover:!bg-transparent"
            color="primary"
            variant="shadow"
            onPress={handleLogin}
          >
            <AiOutlineUser className="mr-2 w-6 h-6" />
            Se connecter
          </Button>
          <Button
            className="w-full !bg-transparent !text-white !border-none hover:!bg-transparent"
            color="secondary"
            variant="shadow"
            onPress={handleGoogleLogin}
          >
            <FcGoogle className="mr-2 w-6 h-6" />
            Utiliser Google
          </Button>
        </ButtonGroup>

        <Spacer y={1} />
        {error && <p className="text-red-500 text-center">{error}</p>}
        <Spacer y={5} />
        <Divider />
        <Spacer y={5} />
        <p className="text-center">
          Pas encore de compte ?{" "}
          <Link className="text-blue-500" href="/signup">
            Créer un compte
          </Link>
        </p>
      </Card>
    </div>
  );
};

export default Login;
