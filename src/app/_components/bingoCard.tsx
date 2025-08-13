"use client";

import { signOut } from "next-auth/react";
import { cn } from "~/server/utils/cn";
import { api } from "~/trpc/react";

export const BingoCard = ({ userId }: { userId?: string }) => {
  const { data: bingoCard } = api.bingo.onCardChange.useSubscription(
    userId ? { userId } : undefined,
  );

  const toggleCell = api.bingo.toggleCell.useMutation();

  // TODO: Use subscription to get bingo card for user ID

  return (
    <>
      <button onClick={() => signOut()}>SIGN OUT</button>
      <div className="grid aspect-square grid-cols-5 grid-rows-5">
        {bingoCard?.map((col, colIdx) =>
          col.map((cell, rowIdx) => {
            return (
              <button
                className={cn(
                  "flex aspect-square cursor-pointer items-center justify-center bg-white p-4 text-black select-none",
                  cell.checked && "bg-red-400",
                )}
                key={`card-${userId}-${colIdx}-${rowIdx}`}
                disabled={toggleCell.isPending}
                onClick={() => {
                  if (colIdx != 2 || rowIdx != 2) {
                    cell.checked = !cell.checked;
                    toggleCell.mutate({ colIdx, rowIdx });
                  }
                }}
              >
                {cell.text}
              </button>
            );
          }),
        )}
      </div>
    </>
  );
};
