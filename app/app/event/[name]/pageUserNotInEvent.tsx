import Event from "@/model/Event";
import User from "@/model/Users";
import dynamic from "next/dynamic";
import Image from "next/image";
import UserList from "@/components/userList";
import { DocumentReference, updateDoc } from "firebase/firestore";
import { Button, Spacer } from "@nextui-org/react";
import toast from "react-hot-toast";
import PageSkeleton from "./pageLoading";

const DynamicMap = dynamic(() => import("@/components/map"), { ssr: false });


export default function PageLoadedNotInEvent({
    _user,
    userDocs,
    event,
    participants,
    eventDocs,
}: Readonly<{
    _user: User,
    userDocs: DocumentReference,
    event: Event,
    participants: User[],
    eventDocs: DocumentReference
}>): JSX.Element {

    const registerToEvent = () => {
        updateDoc(eventDocs, {
            attendees: [...event.attendees, userDocs]
        }).then(() => {
            toast.success("Inscription réussie");
        }).catch((error) => {
            toast.error("Erreur lors de l'inscription");
            console.error(error);
        });
    }

    const organizer = participants.find((user) => participants.includes(user));
    if (!organizer) return (
        <PageSkeleton />
    );

    const markers = [
        {
            id: event.title,
            lat: Number(event.lat) || 0,
            lng: Number(event.lng) || 0,
            label: event.title,
            event: event,
        }
    ];

    let numberOfProfilAttendeesByGrid = 16;

    return (
        <div className="max-w-6xl mx-auto flex items-center">

            <div className="basis-8/12 h-full flex flex-col self-start items-center justify-center">
                <div className="w-full flex">
                    <div className="basis-5/12">
                        <Image src={event.image ?? "/event.jpg"} alt={event.title} width={500} height={500} />
                    </div>
                    <div className="basis-7/12">
                        <h1 className="text-3xl">{event.title}</h1>
                        <Spacer y={1} />
                        <p className="text-lg">{event.description}</p>
                        <Spacer y={1} />
                        <p>le {event.date} à {event.time}</p>
                        <Spacer y={1} />
                        <p>à {event.location}</p>
                        <Spacer y={2} />
                        <Button onPress={registerToEvent} color="primary" variant="shadow">S'inscrire</Button>
                    </div>
                </div>
                <Spacer y={10} />
                <div>
                    <h2>Organisateur</h2>
                    <Spacer y={4} />
                    <div className="w-full grid grid-cols-3">
                        <UserList users={[organizer]} />
                    </div>
                    <h2>Participants</h2>
                    <Spacer y={4} />
                    {/* adjust for the number of participants */}
                    {/* <div className="grid grid-cols-11 gap-4">
                        <UserList users={participants} />
                    </div> */}
                    {participants.length > numberOfProfilAttendeesByGrid ? (
                        <>
                            <div className="grid grid-cols-6 gap-4">
                                <UserList users={participants.slice(0, numberOfProfilAttendeesByGrid)} />
                            </div>
                            <p color="primary">et {participants.length - numberOfProfilAttendeesByGrid} autres</p>
                        </>
                    ) : (
                        <div className="grid grid-cols-6 gap-4">
                            <UserList users={participants} />
                        </div>
                    )}
                </div>
            </div>
            <div className="basis-4/12 self-start">
                <DynamicMap markers={markers} classname="w-full h-[300px]" />
                <div>
                    <h2>DATE TYPE CALENDRIER</h2>
                    <ul>
                        <li>DATE TYPE CALENDRIER 1</li>
                        <li>DATE TYPE CALENDRIER 2</li>
                        <li>DATE TYPE CALENDRIER 3</li>
                    </ul>
                </div>
            </div>

        </div>
    );
}