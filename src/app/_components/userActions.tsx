"use client";

import { useSession } from "next-auth/react";
import { api } from "~/trpc/react";

export const UserActions = ({ userId }: { userId: string }) => {
  const { data: session } = useSession();

  const removeUser = api.user.removeUser.useMutation();
  const newCard = api.bingo.resetCard.useMutation();

  return (
    <div className="flex flex-1 items-end justify-center gap-4">
      {session?.user.id === userId ? (
        <>
          <button
            className="bg-accent-500 rounded-md px-2 py-1 text-white"
            onClick={() => {
              if (confirm("Are you sure you want to generate a new card?")) {
                newCard.mutate();
              }
            }}
          >
            NEW CARD
          </button>
          <button
            className="rounded-md bg-red-500 px-2 py-1 text-white"
            onClick={() => {
              if (confirm("Are you sure you want to reset?")) {
                removeUser.mutate({ userId });
              }
            }}
          >
            RESET
          </button>
        </>
      ) : (
        session?.user.name === "Seina" && (
          <button
            className="rounded-md bg-red-500 px-2 py-1 text-white"
            onClick={() => {
              if (confirm("Are you sure you want to remove this user?")) {
                removeUser.mutate({ userId });
              }
            }}
          >
            REMOVE USER
          </button>
        )
      )}
    </div>
  );
};
