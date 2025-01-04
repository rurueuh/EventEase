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

const DynamicMap = dynamic(() => import('@/components/map'), { ssr: false });

export default function pageLoaded({
    _user,
    events
}: {
    _user: User;
    events: Event[];
}
) {
    console.log(events.at(0));
    const markers = useMemo(() => {
        return events.map((event) => ({
            id: event.title,
            lat: Number(event.lat) || 0,
            lng: Number(event.log) || 0,
            label: event.title,
            event: event,
        }));
    }, [events]);

    const handleMarkerClick = (id: string) => {
        alert(`Marqueur cliqué : ${id} lat: ${markers.find((marker) => marker.id === id)?.lat} lng: ${markers.find((marker) => marker.id === id)?.lng}`);
    };
    return (
        <>
            <h2>Liste des evenements disponibles</h2>

            <div className='flex flex-wrap'>
                <aside className="aside basis-5/12 " style={{ height: "90vh", padding: "1rem", overflowY: "auto" }}>
                    <DynamicMap markers={markers} handleMarkerClick={handleMarkerClick} />
                </aside>
                <div className='basis-7/12' style={{ height: "90vh", padding: "1rem", overflowY: "auto" }}>
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