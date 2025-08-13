"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import type { BaseUser } from "~/server/utils/storage";
import { api } from "~/trpc/react";

const UserBadge = ({ user, myId }: { user: BaseUser; myId?: string }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <Link
        href={`/user/${user.id}`}
        className="h-12 w-12 rounded-full bg-red-500"
      ></Link>
      <p className="text-xs">{user.id === myId ? "YOU" : user.name}</p>
    </div>
  );
};

export const UserList = () => {
  const { data: session } = useSession();
  const { data: users } = api.user.getUsers.useQuery();

  return (
    <div className="flex w-full max-w-full flex-wrap items-center justify-center gap-4">
      {users
        ?.sort((a, _) => (a.id === session?.user.id ? -1 : 0))
        .map((user) => (
          <UserBadge
            key={`user-${user.id}`}
            user={user}
            myId={session?.user.id}
          />
        ))}
    </div>
  );
};
