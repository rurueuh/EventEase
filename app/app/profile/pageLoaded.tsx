"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CiLocationOn } from "react-icons/ci";

import User from "@/model/Users";
import Image from "next/image";
import { Button, ButtonGroup, Spacer, Tab, Tabs } from "@nextui-org/react";


export default function PageLoaded({ user }: { user: User }) {
    return (
        <div className="flex">
            <aside className="block basis-2/5">
                <Image src="/profile.webp" alt="profile" width={300} height={300} className="justify-self-center" />
                <Spacer y={16} />
                <p style={{ fontSize: "11px", margin: "0", padding: "0", color: "gray", textAlign: "center" }}>
                    Entreprises
                </p>
                <Spacer y={16} />
                <p style={{ fontSize: "11px", margin: "0", padding: "0", color: "gray", textAlign: "center" }}>
                    Talents
                </p>
            </aside>

            <div className="block basis-3/5">
                <div className="flex">
                    <h1 className="text-2xl font-bold mr-3">Profil de {user.username}</h1>{" "}
                    <div className="flex">
                        <CiLocationOn className="h-8 w-8 pt-1 text-gray-500" />
                        <h3 className="text-lg font-semibold pt-1 text-gray-500">{user.location || "Pas de localisation"}</h3>
                    </div>
                </div>
                <Spacer y={2} />
                <div>
                    <p className=" text-blue-600 ">{user.job || "Travail non préciser"}</p>
                </div>
                <Spacer y={4} />
                <div>
                    <p className="text-gray-600">ranking (a venir)</p>
                </div>
                <Spacer y={4} />
                <div>
                    <ButtonGroup>
                        <Button variant="shadow" color="primary">Envoyer un message</Button>
                        <Button variant="shadow">Ajouter en ami</Button>
                        <Button variant="shadow" color="danger">Signaler l'utilisateur</Button>
                    </ButtonGroup>
                </div>
                <Spacer y={8} />
                <div>
                    <Tabs
                        aria-label="Options"
                        classNames={{
                            tabList: "gap-6 w-full relative rounded-none p-0 border-b border-divider",
                            cursor: "w-full bg-[#22d3ee]",
                            tab: "max-w-fit px-0 h-12",
                            tabContent: "group-data-[selected=true]:text-[#06b6d4]",
                        }}
                        color="primary"
                        variant="underlined"
                    >
                        <Tab title="Timeline" value="Timeline">
                            <p>A venir</p>
                        </Tab>
                        <Tab title="A propos" value="A propos">
                            {!user.aboutPhone && !user.aboutLocationAddress && !user.aboutEmail && !user.aboutWebsite && <p>Pas d'information</p>}
                            {user.aboutPhone && <p>Phone: {user.aboutPhone}</p>}
                            {user.aboutLocationAddress && <p>Adresse: {user.aboutLocationAddress}</p>}
                            {user.aboutEmail && <p>Email: {user.aboutEmail}</p>}
                            {user.aboutWebsite && <p>Site web: {user.aboutWebsite}</p>}
                        </Tab>
                        <Tab title="Description" value="Description">
                            <p>{user.description || "Pas de description"}</p>
                        </Tab>
                    </Tabs>

                </div>

            </div>
        </div>
    )
}