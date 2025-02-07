"use client";

import { Button, Input, Textarea } from "@heroui/react";
import { toast } from "react-hot-toast";
import {
  doc,
  DocumentData,
  DocumentReference,
  setDoc,
} from "firebase/firestore";
import dynamic from "next/dynamic";
import L from "leaflet";

import { MarkerType } from "@/components/map";
import User from "@/model/Users";
import { db } from "@/firebase";
import { v4 as uuidv4 } from "uuid";

const DynamicMap = dynamic(() => import("@/components/map"), { ssr: false });

export default function PageLoaded({
  _user,
  userRef,
}: Readonly<{
  _user: User;
  userRef: DocumentReference<DocumentData, DocumentData>;
}>): JSX.Element {
  let lat = 0,
    lng = 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const data = Object.fromEntries(
      new FormData(e.currentTarget as HTMLFormElement),
    );
    const formData = {
      title: data.title as string,
      description: data.description as string,
      location: data.location as string,
      date: data.date as string,
      time: data.time as string,
      lat: lat,
      lng: lng,
    };

    const eventID = uuidv4();
    const eventRef = doc(db, "events", eventID);

    if (!_user) {
      toast.error("Vous devez être connecté pour créer un événement");

      return;
    }
    if (
      !formData.title ||
      !formData.description ||
      !formData.location ||
      !formData.date ||
      !formData.time
    ) {
      toast.error("Veuillez remplir tous les champs");

      return;
    }
    if (formData.lat === 0 || formData.lng === 0) {
      toast.error("Veuillez choisir un lieu sur la carte");

      return;
    }
    setDoc(eventRef, {
      ...formData,
      organizer: _user.username,
      organizerId: _user.uid,
      attendees: [userRef],
      eventID: eventID
    })
      .then(() => {
        toast.success("Événement créé avec succès !");
      })
      .catch((_error) => {
        toast.error("Erreur lors de la création de l'événement");
      });
  };

  const markers = [
    {
      id: "1",
      lat: 48.8566,
      lng: 2.3522,
      label: "Paris",
    },
  ] as MarkerType[];

  const handleMapClick = (event: L.LeafletMouseEvent) => {
    lat = event.latlng.lat;
    lng = event.latlng.lng;
    markers[0].lat = lat;
    markers[0].lng = lng;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <form
        className="mx-auto p-6 shadow-md rounded-lg"
        onSubmit={handleSubmit}
      >
        <Input
          fullWidth
          required
          className="mb-4"
          label="Titre"
          name="title"
          placeholder="Nom de l'événement"
        />
        <Textarea
          fullWidth
          required
          className="mb-4"
          label="Description"
          name="description"
          placeholder="Description de l'événement"
        />
        <Input
          fullWidth
          required
          className="mb-4"
          label="Lieu"
          name="location"
          placeholder="Adresse ou lieu de l'événement"
        />
        <Input
          fullWidth
          required
          className="mb-4"
          label="Date"
          name="date"
          type="date"
        />
        <Input
          fullWidth
          required
          className="mb-6"
          label="Heure"
          name="time"
          type="time"
        />
        <Button
          className="w-full"
          color="primary"
          type="submit"
          variant="shadow"
        >
          Créer l&apos;événement
        </Button>
      </form>
      <DynamicMap handlerClick={handleMapClick} markers={markers} />
    </div>
  );
}
