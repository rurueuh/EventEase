import User from "@/model/Users";
import { Spacer } from "@nextui-org/react";
import Image from "next/image";

export default function UserList({
    users,
    size = 150,
}: Readonly<{
    users: User[];
    size?: number;
}>) {
    return (
        <>
            {users.map((user) => (
                <div key={user.uid}>
                    <Image src={user.profilePicture ?? "/profile.webp"} alt={user.username} width={size} height={size} />
                    <Spacer y={2} />
                    <h2>{user.username}</h2>
                </div>
            ))}
        </>
    );
}