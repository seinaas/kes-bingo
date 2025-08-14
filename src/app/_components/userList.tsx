"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { env } from "~/env";
import type { BaseUser } from "~/server/utils/storage";
import { api } from "~/trpc/react";
import { ImageWithPlaceholder } from "./imageWithPlaceholder";
import { useState } from "react";

const UserBadge = ({ user, myId }: { user: BaseUser; myId?: string }) => {
  return (
    <div className="flex w-13 max-w-13 flex-col items-center justify-center gap-1">
      <Link
        href={`/user/${user.id}`}
        className="relative h-12 w-12 overflow-clip rounded-full bg-gray-800"
      >
        <ImageWithPlaceholder
          src={`${env.NEXT_PUBLIC_IMAGE_BASE_URL}${user.id}`}
          alt={`${user.name}`}
          fill
          className="object-cover"
        />
      </Link>
      <p className="max-w-full truncate text-xs">
        {user.id === myId ? "YOU" : user.name}
      </p>
    </div>
  );
};

export const UserList = () => {
  const { data: session } = useSession();

  const [users, setUsers] = useState<BaseUser[]>([]);
  api.user.onUsersChange.useSubscription(undefined, {
    onData: (users) => setUsers(users),
  });

  return (
    <div>
      {" "}
      <button onClick={() => signOut({ redirectTo: "/", redirect: true })}>
        SIGN OUT
      </button>
      <div className="flex w-full max-w-full flex-wrap items-center justify-center gap-3">
        {[...users.values()]
          // ?.filter((a) => a.id !== session?.user.id)
          .map((user) => (
            <UserBadge
              key={`user-${user.id}`}
              user={user}
              myId={session?.user.id}
            />
          ))}
      </div>
    </div>
  );
};
