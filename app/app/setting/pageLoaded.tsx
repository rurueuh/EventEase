"use client";

import { useState } from "react";
import { auth } from "@/firebase";
import {
  getFirestore,
  doc,
  updateDoc,
} from "firebase/firestore";

const db = getFirestore();

type formData = {
  username: string;
  age: string;
  location: string;
  job: string;
  description: string;
  aboutPhone: string;
  aboutLocationAddress: string;
  aboutEmail: string;
  aboutWebsite: string;
  basicInfoBirthDate: string;
  basicInfoGender: string;
  basicInfoRelationshipStatus: string;
};

export default function _settingLoaded( { formData, setFormData }: { formData: formData, setFormData: (formData: formData) => void }){
  const [savingStates, setSavingStates] = useState<Record<string, boolean>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async (field: string) => {
    setSavingStates((prev) => ({ ...prev, [field]: true }));
    try {
      if (auth.currentUser) {
        const userRef = doc(db, "users", auth.currentUser.uid);
        await updateDoc(userRef, {
          [field]: formData[field as keyof typeof formData],
        });
        alert(`Changement pour ${field} sauvegardé avec succès !`);
      }
    } catch (error) {
      console.error(`Erreur lors de la sauvegarde pour ${field} :`, error);
      alert(`Erreur lors de la sauvegarde pour ${field}. Veuillez réessayer.`);
    } finally {
      setSavingStates((prev) => ({ ...prev, [field]: false }));
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Paramètres</h1>
      <div className="space-y-6">
        {Object.keys(formData).reduce((acc: JSX.Element[], field, index, fields) => {
          if (index % 2 === 0) {
            const nextField = fields[index + 1];
            acc.push(
              <div key={field} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[field, nextField].map((f) => (
                  f && (
                    <div key={f} className="flex flex-col gap-2">
                      <label
                        htmlFor={f}
                        className="text-sm font-medium text-gray-700"
                      >
                        {f.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                      </label>
                      {f === "basicInfoGender" || f === "basicInfoRelationshipStatus" ? (
                        <select
                          id={f}
                          name={f}
                          value={formData[f as keyof typeof formData]}
                          onChange={handleChange}
                          className="border border-gray-300 rounded-md p-2"
                        >
                          {f === "basicInfoGender" && (
                            <>
                              <option value="">Sélectionnez le genre</option>
                              <option value="Male">Homme</option>
                              <option value="Female">Femme</option>
                              <option value="Other">Autre</option>
                            </>
                          )}
                          {f === "basicInfoRelationshipStatus" && (
                            <>
                              <option value="">Statut relationnel</option>
                              <option value="Single">Célibataire</option>
                              <option value="Married">Marié(e)</option>
                              <option value="Divorced">Divorcé(e)</option>
                            </>
                          )}
                        </select>
                      ) : (
                        <input
                          id={f}
                          name={f}
                          type={f === "basicInfoBirthDate" ? "date" : "text"}
                          value={formData[f as keyof typeof formData]}
                          onChange={handleChange}
                          className="border border-gray-300 rounded-md p-2"
                        />
                      )}
                      <button
                        onClick={() => handleSave(f)}
                        className={`mt-2 px-4 py-2 rounded-md text-white ${savingStates[f] ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"}`}
                        disabled={savingStates[f]}
                      >
                        {savingStates[f] ? "Sauvegarde..." : "Sauvegarder"}
                      </button>
                    </div>
                  )
                ))}
              </div>
            );
          }
          return acc;
        }, [])}
      </div>
    </div>
  );
};
