import { Link, Spacer } from "@heroui/react";
import Image from "next/image";

import User from "@/model/Users";

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
        <Link
          key={user.uid}
          className="flex flex-col items-center text-white"
          href={"/app/profile/" + user.uid}
        >
          <Image
            alt={user.username}
            height={size}
            src={user.profilePicture ?? "/profile.webp"}
            width={size}
          />
          <Spacer y={2} />
          <h2>{user.username}</h2>
        </Link>
      ))}
    </>
  );
}
