'use client';

import { Button, Input, Textarea } from '@nextui-org/react';
import { useState } from 'react';
import User from "@/model/Users";

import { toast } from "react-hot-toast";

import { auth, db } from "@/firebase";
import { doc, or, setDoc } from "firebase/firestore";
import dynamic from 'next/dynamic';
import { MarkerType } from '@/components/map';
import L from 'leaflet';

const DynamicMap = dynamic(() => import('@/components/map'), { ssr: false });


export default function pageLoaded({
    _user
}: {
    _user: User;
}
) {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        location: '',
        date: '',
        time: '',
        lat: 0,
        lng: 0,
    });

    let lat = 0, lng = 0;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const data = Object.fromEntries(new FormData(e.currentTarget as HTMLFormElement));
        console.log(lat, lng);
        const formData = {
            title: data.title as string,
            description: data.description as string,
            location: data.location as string,
            date: data.date as string,
            time: data.time as string,
            lat: lat,
            lng: lng,
        };

        const eventRef = doc(db, 'events', formData.title);
        if (!_user) {
            toast.error('Vous devez être connecté pour créer un événement');
            return;
        }
        if (!formData.title || !formData.description || !formData.location || !formData.date || !formData.time) {
            toast.error('Veuillez remplir tous les champs');
            return;
        }
        if (formData.lat === 0 || formData.lng === 0) {
            toast.error('Veuillez choisir un lieu sur la carte');
            return;
        }
        setDoc(eventRef, {
            ...formData,
            organizer: _user.username,
            organizerId: _user.uid,
            attendees: [],
        }).then(() => {
            toast.success('Événement créé avec succès !');
            setFormData({
                title: '',
                description: '',
                location: '',
                date: '',
                time: '',
                lat: 0,
                lng: 0,
            });
        }).catch((error) => {
            toast.error('Erreur lors de la création de l\'événement');
            console.error('Error adding document: ', error);
        });
    };

    const markers = [{
        id: '1',
        lat: 48.8566,
        lng: 2.3522,
        label: 'Paris',
    }] as MarkerType[];

    const handleMapClick = (event: L.LeafletMouseEvent) => {
        lat = event.latlng.lat;
        lng = event.latlng.lng;
        markers[0].lat = lat;
        markers[0].lng = lng;
        // setFormData((prev) => ({ ...prev, lat, lng }));
    }

    console.log("user");

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <form
                onSubmit={handleSubmit}
                className="mx-auto p-6 shadow-md rounded-lg"
            >
                <Input
                    label="Titre"
                    name="title"
                    placeholder="Nom de l'événement"
                    fullWidth
                    required
                    className="mb-4"
                />
                <Textarea
                    label="Description"
                    name="description"
                    placeholder="Description de l'événement"
                    fullWidth
                    required
                    className="mb-4"
                />
                <Input
                    label="Lieu"
                    name="location"
                    placeholder="Adresse ou lieu de l'événement"
                    fullWidth
                    required
                    className="mb-4"
                />
                <Input
                    label="Date"
                    name="date"
                    type="date"
                    fullWidth
                    required
                    className="mb-4"
                />
                <Input
                    label="Heure"
                    name="time"
                    type="time"
                    fullWidth
                    required
                    className="mb-6"
                />
                <Button type="submit" color="primary" variant='shadow' className="w-full">
                    Créer l'événement
                </Button>
            </form>
            <DynamicMap markers={markers} handlerClick={handleMapClick} />
        </div>
    );
}