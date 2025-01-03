"use strict";

import { Button, Input, Textarea, Spacer, Card, CardBody, CardFooter, CardHeader } from '@nextui-org/react';
import { useMemo, useState } from 'react';
import User from "@/model/Users";

import { toast } from "react-hot-toast";

import { auth, db } from "@/firebase";
import { doc, or, setDoc, getDocs, getDoc, collection } from "firebase/firestore";
import Event from '@/model/Event';
import Map from '@/components/map';
import dynamic from 'next/dynamic';


const markers = [
    { id: '1', lat: 48.8566, lng: 2.3522, label: 'Paris' },
    { id: '2', lat: 43.2965, lng: 5.3698, label: 'Marseille' },
    { id: '3', lat: 45.764, lng: 4.8357, label: 'Lyon' },
];

const DynamicMap = dynamic(() => import('@/components/map'), { ssr: false });

export default function pageLoaded({
    _user
}: {
    _user: User;
}
) {
    const [events, setEvents] = useState<Event[]>([]);
    // get all docs from the collection "events"
    const eventsRef = collection(db, "events");
    const querySnapshot = getDocs(eventsRef);
    querySnapshot.then((querySnapshot) => {
        let events: Event[] = [];
        querySnapshot.forEach((doc) => {
            let event = doc.data() as Event;
            events.push(event);
        });
        setEvents(events);
    });

    const handleMarkerClick = (id: string) => {
        alert(`Marqueur cliqué : ${id}`);
    };
  

    return (
        <>
            <h2>Liste des evenements disponibles</h2>

            <div className='flex flex-wrap'>
                <aside className="aside basis-5/12 " style={{ height: "90vh", backgroundColor: "lightgrey", padding: "1rem", overflowY: "auto" }}>
                    <DynamicMap markers={markers} handleMarkerClick={handleMarkerClick} />
                </aside>
                <div className='basis-7/12' style={{ height: "90vh", backgroundColor: "blue", padding: "1rem", overflowY: "auto" }}>
                    <div className='flex flex-wrap'>
                        {events.map((event) => (
                            <Card key={event.title} style={{ marginBottom: "1rem" }} className='basis-5/12 m-4'>
                                <CardHeader>
                                    <h3 className='text-center text-xl'>{event.title}</h3>
                                </CardHeader>
                                <CardBody>
                                    <p>{event.description}</p>
                                    <Spacer y={5} />
                                    <p>le {event.date} à {event.time}</p>
                                    <Spacer y={4} />
                                    <p>à {event.location}</p>
                                </CardBody>
                                <CardFooter>
                                    <Button>Participer</Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>

                </div>
            </div>
        </>
    );
}