"use strict";

import {
  Button,
  Spacer,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Link,
} from "@heroui/react";
import { useMemo } from "react";
import dynamic from "next/dynamic";

import User from "@/model/Users";
import Event from "@/model/Event";

const DynamicMap = dynamic(() => import("@/components/map"), { ssr: false });

export default function PageLoaded({
  _user,
  events,
  position,
}: {
  _user: User;
  events: Event[];
  position: { lat: number; lng: number };
}) {
  const UseMarkers = useMemo(() => {
    return events.map((event) => ({
      id: event.title,
      lat: Number(event.lat) || 0,
      lng: Number(event.lng) || 0,
      label: event.title,
      event: event,
    }));
  }, [events]);

  let lastid = "";

  const handleMarkerClick = (id: string) => {
    const card = document.getElementById(id);

    if (card) {
      card.style.backgroundColor = "hsl(var(--heroui-primary) / .4)";
      card.scrollIntoView({ behavior: "smooth" });
      if (lastid) {
        const lastcard = document.getElementById(lastid);

        if (lastcard) {
          lastcard.style.backgroundColor = "revert-layer";
        } else {
          alert("Last card not found");
        }
      }
      lastid = id;
    } else {
      alert("Card not found");
    }
  };

  return (
    <>
      <h2>Liste des evenements disponibles</h2>

      <div className="flex flex-wrap">
        <aside
          className="aside basis-5/12 "
          style={{ height: "90vh", padding: "1rem", overflowY: "auto" }}
        >
          <Link href="/app/event/createEvent">
            <Button color="primary" variant="shadow">
              Créer un événement
            </Button>
          </Link>
          <Spacer y={5} />
          {position.lat && position.lng ? (
            <DynamicMap
              handleMarkerClick={handleMarkerClick}
              markers={UseMarkers}
              setViewPosition={position}
            />
          ) : (
            <DynamicMap
              handleMarkerClick={handleMarkerClick}
              markers={UseMarkers}
            />
          )}
        </aside>
        <div
          className="basis-7/12"
          style={{
            height: "90vh",
            padding: "1rem",
            overflowY: "auto",
            scrollbarWidth: "none",
          }}
        >
          <div className="flex flex-wrap">
            {events.map((event) => (
              <Card
                key={event.title}
                className="basis-5/12 m-4"
                id={event.title}
                style={{ marginBottom: "1rem" }}
              >
                <CardHeader>
                  <h3 className="text-center text-xl">{event.title}</h3>
                </CardHeader>
                <CardBody>
                  <p>{event.description}</p>
                  <Spacer y={5} />
                  <p>
                    le {event.date} à {event.time}
                  </p>
                  <Spacer y={4} />
                  <p>à {event.location}</p>
                  <Spacer y={4} />
                  <p> par {event.organizer}</p>
                  <Spacer y={4} />
                  <p> {event.attendees.length} participants</p>
                </CardBody>
                <CardFooter>
                  <Link href={"/app/event/" + event.eventID}>
                    <Button
                      color="primary"
                      href={"./ruruTest"}
                      variant="shadow"
                    >
                      Participer
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
