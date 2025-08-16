"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { env } from "~/env";
import type { BaseUser } from "~/server/utils/storage";
import { api } from "~/trpc/react";
import { ImageWithPlaceholder } from "./imageWithPlaceholder";
import { cn } from "~/server/utils/cn";

const UserBadge = ({
  user,
  currentUserId,
  myId,
}: {
  user: BaseUser;
  currentUserId: string;
  myId?: string;
}) => {
  return (
    <div
      className={cn(
        "from-primary-100/90 to-primary-200/80 text-primary-900 flex w-16 flex-col items-center justify-center gap-1 overflow-clip rounded-[50px_50px_10px_10px] bg-linear-to-b from-70% px-0.5 pb-1",
        currentUserId === user.id && "from-accent-300 to-accent-500/80",
      )}
    >
      <Link
        href={`/user/${user.id}`}
        className={cn(
          "border-primary-100 relative h-16 w-16 overflow-clip rounded-full border-4",
          currentUserId === user.id && "border-accent-500",
        )}
      >
        <ImageWithPlaceholder
          src={`${env.NEXT_PUBLIC_IMAGE_BASE_URL}${user.id}`}
          alt={`${user.name}`}
          fill
          className="object-cover"
        />
      </Link>
      <p
        className={cn(
          "max-w-full truncate text-xs",
          user.id === myId && "font-bold",
        )}
      >
        {user.id === myId ? "YOU" : user.name}
      </p>
    </div>
  );
};

export const UserList = ({ currentUserId }: { currentUserId: string }) => {
  const { data: session } = useSession();

  const { data: initialUsers } = api.user.getUsers.useQuery();

  const { data: users } = api.user.onUsersChange.useSubscription();

  return (
    <div>
      {" "}
      <button onClick={() => signOut({ redirectTo: "/", redirect: true })}>
        SIGN OUT
      </button>
      <div className="flex w-full max-w-full flex-wrap items-center justify-center gap-1">
        {(users ?? initialUsers)
          // ?.filter((a) => a.id !== session?.user.id)
          ?.map((user) => (
            <UserBadge
              key={`user-${user.id}`}
              user={user}
              myId={session?.user.id}
              currentUserId={currentUserId}
            />
          ))}
      </div>
    </div>
  );
};
