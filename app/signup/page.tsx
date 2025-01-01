"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/firebase";
import { Card, Input, Button, Spacer } from "@nextui-org/react";
import Link from "next/link";
import { toast } from "react-hot-toast";

const Signup: React.FC = () => {
  const [username, setUsername] = useState("");
  const [age, setAge] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();

  const handleSignup = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (username) {
        await updateProfile(user, {
          displayName: username,
        });
      }

      await setDoc(doc(db, "users", user.uid), {
        username: username,
        age: age,
        email: email,
        createdAt: new Date(),
      });

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

      const errorMsg =
        messageTranslated[error.code] ||
        error.message ||
        "Une erreur est survenue lors de la création du compte.";
      setError(errorMsg);
      toast.error(errorMsg);
    }
  };

  return (
    <div className="flex justify-center items-center">
      <Card className="p-5 max-w-[400px] w-full">
        <h3 className="text-center">Créer un compte</h3>
        <Spacer y={4} />

        <Input
          fullWidth
          size="lg"
          placeholder="Nom d'utilisateur"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Spacer y={1} />

        <Input
          fullWidth
          size="lg"
          placeholder="Âge"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />
        <Spacer y={1} />

        <Input
          fullWidth
          size="lg"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Spacer y={1} />

        <Input
          fullWidth
          size="lg"
          placeholder="Mot de passe"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Spacer y={2} />

        {error && <p className="text-red-500 text-center">{error}</p>}
        <Spacer y={1} />

        <Button
          className="w-full"
          onPress={handleSignup}
          variant="shadow"
          color="primary"
        >
          S'inscrire
        </Button>
        <Spacer y={1} />
        
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
