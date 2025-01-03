'use client';

import { Button, Input, Textarea } from '@nextui-org/react';
import { useState } from 'react';
import User from "@/model/Users";

import { toast } from "react-hot-toast";

import { auth, db } from "@/firebase";
import { doc, or, setDoc } from "firebase/firestore";

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
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Event Created:', formData);
        // add to firestore collection "events"
        const eventRef = doc(db, 'events', formData.title);
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
            });
        }).catch((error) => {
            toast.error('Erreur lors de la création de l\'événement');
            console.error('Error adding document: ', error);
        });

        

    };
    return (
        <>
            <form
                onSubmit={handleSubmit}
                className="mx-auto p-6 shadow-md rounded-lg"
            >
                <Input
                    label="Titre"
                    name="title"
                    placeholder="Nom de l'événement"
                    value={formData.title}
                    onChange={handleChange}
                    fullWidth
                    required
                    className="mb-4"
                />
                <Textarea
                    label="Description"
                    name="description"
                    placeholder="Description de l'événement"
                    value={formData.description}
                    onChange={handleChange}
                    fullWidth
                    required
                    className="mb-4"
                />
                <Input
                    label="Lieu"
                    name="location"
                    placeholder="Adresse ou lieu de l'événement"
                    value={formData.location}
                    onChange={handleChange}
                    fullWidth
                    required
                    className="mb-4"
                />
                <Input
                    label="Date"
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleChange}
                    fullWidth
                    required
                    className="mb-4"
                />
                <Input
                    label="Heure"
                    name="time"
                    type="time"
                    value={formData.time}
                    onChange={handleChange}
                    fullWidth
                    required
                    className="mb-6"
                />
                <Button type="submit" color="primary" variant='shadow' className="w-full">
                    Créer l'événement
                </Button>
            </form>
        </>
    );
}