"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { Card, Input, Button, Spacer } from "@nextui-org/react";
import Link from "next/link";
import { toast } from "react-hot-toast";

import { auth, db } from "@/firebase";
import User from "@/model/Users";

const Signup: React.FC = () => {
  const [username, setUsername] = useState("");
  const [age, setAge] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSignup = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;

      if (username) {
        await updateProfile(user, {
          displayName: username,
        });
      }

      let userDB = {} as User;

      userDB.username = username;
      userDB.age = age ? parseInt(age) : 0;
      userDB.email = email;
      userDB.createdAt = new Date();
      userDB.updatedAt = new Date();
      userDB.uid = user.uid;

      await setDoc(doc(db, "users", user.uid), {
        ...userDB,
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
        "auth/account-exists-with-different-credential":
          "Compte existant avec des identifiants différents.",
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
      setLoading(false);
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
          placeholder="Nom d'utilisateur"
          size="lg"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Spacer y={1} />

        <Input
          fullWidth
          placeholder="Âge"
          size="lg"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />
        <Spacer y={1} />

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
        <Spacer y={2} />

        {error && <p className="text-red-500 text-center">{error}</p>}
        <Spacer y={1} />

        <Button
          className="w-full"
          color="primary"
          variant="shadow"
          {...(loading ? { isLoading: true } : {})}
          {...(loading ? { disabled: true } : {})}
          onPress={handleSignup}
          onPressEnd={() => {
            setLoading(true);
          }}
        >
          S&apos;inscrire
        </Button>
        <Spacer y={1} />

        <p className="text-center">
          Vous avez déjà un compte ?{" "}
          <Link className="text-blue-500" href="/login">
            Se connecter
          </Link>
        </p>
      </Card>
    </div>
  );
};

export default Signup;
