"use client";
import React, { useState, useEffect } from "react";
import { Input, User } from "@heroui/react";
import { collection, query, where, getDocs, limit } from "firebase/firestore";
import { FaSearch } from "react-icons/fa";
import Link from "next/link";

import { db } from "@/firebase";

interface User {
  id: string;
  username: string;
  uid: string;
}

const UserSearchBar: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleSearch = async (term: string) => {
    if (term.trim() === "") {
      setUsers([]);

      return;
    }

    setLoading(true);
    setError("");

    try {
      const usersRef = collection(db, "users");
      const q = query(
        usersRef,
        where("username", ">=", term),
        where("username", "<=", term + "\uf8ff"),
        limit(5),
      );

      const querySnapshot = await getDocs(q);
      const results: User[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();

        results.push({
          id: doc.id,
          uid: data.uid,
          username: data.username,
        });
      });

      setUsers(results);
    } catch (_err) {
      setError("Une erreur est survenue lors de la recherche.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      handleSearch(searchTerm);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "2rem" }}>
      <Input
        aria-label="Search"
        classNames={{
          inputWrapper: "bg-default-100",
          input: "text-sm",
        }}
        labelPlacement="outside"
        placeholder="Rechercher un utilisateur"
        startContent={
          <FaSearch className="text-base text-default-400 pointer-events-none flex-shrink-0" />
        }
        type="search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {loading && (
        <div
          className="fixed"
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "1rem",
          }}
        >
          <div className="spinner" />
          <style>{`
            .spinner {
              border: 4px solid rgba(0, 0, 0, 0.1);
              width: 36px;
              height: 36px;
              border-radius: 50%;
              border-left-color: #000;
              animation: spin 1s linear infinite;
            }

            @keyframes spin {
              to {
                transform: rotate(360deg);
              }
            }
          `}</style>
        </div>
      )}

      {error && <p style={{ color: "red", marginTop: "1rem" }}>{error}</p>}

      {!loading && users.length > 0 && (
        <div className="fixed flex flex-col" style={{ marginTop: "1rem" }}>
          {users.map((user) => (
            <Link key={user.id} href={`/app/profile/${user.uid}`}>
              <User
                avatarProps={{
                  src: "http://localhost:3000/_next/image?url=%2Fprofile.webp&w=384&q=75",
                }}
                name={user.username}
                onClick={() => {
                  setSearchTerm("");
                  setUsers([]);
                }}
              />
            </Link>
          ))}
        </div>
      )}

      {!loading && searchTerm.trim() !== "" && users.length === 0 && !error && (
        <p className="fixed" style={{ marginTop: "1rem" }}>
          Aucun utilisateur trouvé.
        </p>
      )}
    </div>
  );
};

export default UserSearchBar;
