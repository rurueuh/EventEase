import dynamic from "next/dynamic";
import Image from "next/image";
import { DocumentReference, updateDoc } from "firebase/firestore";
import { Button, Spacer } from "@heroui/react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Calendar } from "@heroui/calendar";
import { parseDate } from "@internationalized/date";

import PageSkeleton from "./pageLoading";

import UserList from "@/components/userList";
import User from "@/model/Users";
import Event from "@/model/Event";
import Chat from "@/components/chat";

const DynamicMap = dynamic(() => import("@/components/map"), { ssr: false });
const numberOfProfilAttendeesByGrid = 16;

export default function PageLoadedInEvent({
  _user,
  userDocs,
  event,
  participants,
  eventDocs,
}: Readonly<{
  _user: User;
  userDocs: DocumentReference;
  event: Event;
  participants: User[];
  eventDocs: DocumentReference;
}>): JSX.Element {
  const router = useRouter();
  const unregisterToEvent = () => {
    let userID = _user.uid;
    let isOnEvent = false;

    participants.forEach((p) => {
      if (p.uid == userID) {
        isOnEvent = true;
      }
    });
    if (!isOnEvent) {
      toast.error("Vous n'êtes pas inscrit a l'evenement.");

      return;
    }
    event.attendees = event.attendees.filter((p) => p.id !== userID);
    updateDoc(eventDocs, {
      attendees: [...event.attendees],
    })
      .then(() => {
        toast.success("Déinscription réussie");
        router.push("/app/event");
      })
      .catch((_error) => {
        toast.error("Erreur lors de l'inscription");
      });
  };

  const organizer = participants.find((user) => participants.includes(user));

  if (!organizer) return <PageSkeleton />;

  const markers = [
    {
      id: event.title,
      lat: Number(event.lat) || 0,
      lng: Number(event.lng) || 0,
      label: event.title,
      event: event,
    },
  ];

  return (
    <div className="max-w-6xl mx-auto flex items-center">
      <div className="basis-8/12 h-full flex flex-col self-start items-center justify-center">
        <div className="w-full flex">
          <div className="basis-5/12">
            <Image
              alt={event.title}
              height={500}
              src={event.image ?? "/event.jpg"}
              width={500}
            />
          </div>
          <div className="basis-7/12">
            <h1 className="text-3xl">{event.title}</h1>
            <Spacer y={1} />
            <p className="text-lg">{event.description}</p>
            <Spacer y={1} />
            <p>
              le {event.date} à {event.time}
            </p>
            <Spacer y={1} />
            <p>à {event.location}</p>
            <Spacer y={2} />
            <Button
              color="primary"
              variant="shadow"
              onPress={unregisterToEvent}
            >
              Se désinscrire
            </Button>
          </div>
        </div>
        <Spacer y={10} />
        <div>
          <h2>Organisateur</h2>
          <Spacer y={4} />
          <div className="w-full mx-auto flex items-center justify-center">
            <div key={organizer.uid}>
              <Image
                alt={organizer.username}
                height={150}
                src={organizer.profilePicture ?? "/profile.webp"}
                width={150}
              />
              <Spacer y={2} />
              <h2>{organizer.username}</h2>
            </div>
          </div>
          <h2>Participants</h2>
          <Spacer y={4} />
          {participants.length > numberOfProfilAttendeesByGrid ? (
            <>
              <div className="grid grid-cols-6 gap-4">
                <UserList
                  users={participants.slice(0, numberOfProfilAttendeesByGrid)}
                />
              </div>
              <p color="primary">
                et {participants.length - numberOfProfilAttendeesByGrid} autres
              </p>
            </>
          ) : (
            <div className="grid grid-cols-6 gap-4">
              <UserList users={participants} />
            </div>
          )}
        </div>
      </div>
      <div className="basis-4/12 self-start">
        <DynamicMap classname="w-full h-[300px]" markers={markers} />
        <Spacer y={3} />
        <Calendar
          isReadOnly
          aria-label="Date (Read Only)"
          value={parseDate(event.date)}
        />
        <Spacer y={3} />
        <Chat eventID={event.eventID} userId={_user.uid} />
      </div>
    </div>
  );
}
