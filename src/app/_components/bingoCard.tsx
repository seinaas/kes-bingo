"use client";

import { useSession } from "next-auth/react";
import { cn } from "~/server/utils/cn";
import { api } from "~/trpc/react";

export const BingoCard = ({ userId }: { userId?: string }) => {
  const { data: session } = useSession();

  const { data: bingoCard } = api.bingo.onCardChange.useSubscription(
    userId ? { userId } : undefined,
  );

  const toggleCell = api.bingo.toggleCell.useMutation();

  // TODO: Use subscription to get bingo card for user ID

  return (
    <div className="grid aspect-square w-full max-w-xl grid-cols-5 grid-rows-5 overflow-clip rounded-lg">
      {bingoCard?.map((col, colIdx) =>
        col.map((cell, rowIdx) => {
          return (
            <button
              className={cn(
                "bg-primary-100 flex aspect-square cursor-pointer items-center justify-center p-1 text-xs text-black select-none",
                cell.checked && "bg-accent-500",
              )}
              key={`card-${userId}-${colIdx}-${rowIdx}`}
              disabled={toggleCell.isPending}
              onClick={() => {
                if (userId && userId != session?.user.id) return;
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
  );
};
